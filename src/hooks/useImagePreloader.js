import { useState, useEffect, useCallback, useRef } from 'react';
import useGalleryStore from '@/store/galleryStore';

// Constants for preloading
const PRELOAD_AHEAD = 3;
const PRELOAD_BEHIND = 2;

export function useImagePreloader(images, currentIndex) {
  const [loadingStates, setLoadingStates] = useState({});
  const abortControllers = useRef(new Map()).current;
  const preloadQueue = useRef(new Set()).current;
  
  const { cacheImage, getCachedImage } = useGalleryStore();

  // Cleanup function for aborting pending requests
  const cleanup = useCallback(() => {
    abortControllers.forEach(controller => controller.abort());
    abortControllers.clear();
    preloadQueue.clear();
  }, []);

  // Preload a single image with priority and abort capability
  const preloadImage = useCallback(async (imageUrl, priority = 'high') => {
    if (!imageUrl) return;

    // Check cache first
    const cachedUrl = getCachedImage(imageUrl);
    if (cachedUrl) {
      setLoadingStates(prev => ({ ...prev, [imageUrl]: false }));
      return;
    }

    // Add to queue
    preloadQueue.add(imageUrl);

    // Abort previous request for this URL if it exists
    if (abortControllers.has(imageUrl)) {
      abortControllers.get(imageUrl).abort();
      abortControllers.delete(imageUrl);
    }

    const controller = new AbortController();
    abortControllers.set(imageUrl, controller);

    try {
      setLoadingStates(prev => ({ ...prev, [imageUrl]: true }));

      // Create a promise that can be aborted
      const response = await fetch(imageUrl, {
        signal: controller.signal,
        priority: priority,
        cache: 'force-cache'
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      // Only proceed if this URL is still in the queue
      if (preloadQueue.has(imageUrl)) {
        // Cache the image
        cacheImage(imageUrl, objectUrl);
        setLoadingStates(prev => ({ ...prev, [imageUrl]: false }));
        preloadQueue.delete(imageUrl);
      } else {
        URL.revokeObjectURL(objectUrl);
      }

      abortControllers.delete(imageUrl);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Silently handle aborted requests
        preloadQueue.delete(imageUrl);
      } else {
        console.error('Error preloading image:', error);
      }
      setLoadingStates(prev => ({ ...prev, [imageUrl]: false }));
    }
  }, [cacheImage, getCachedImage]);

  // Preload images around current index with different priorities
  const preloadImagesAround = useCallback(async (index) => {
    if (!images?.length) return;

    // Clear queue for new batch
    preloadQueue.clear();

    // Immediate load for current image
    if (images[index]?.url) {
      await preloadImage(images[index].url, 'high');
    }

    // Preload ahead with high priority
    for (let i = 1; i <= PRELOAD_AHEAD; i++) {
      const nextIndex = index + i;
      if (nextIndex < images.length && images[nextIndex]?.url) {
        preloadImage(images[nextIndex].url, 'high');
      }
    }

    // Preload behind with lower priority
    for (let i = 1; i <= PRELOAD_BEHIND; i++) {
      const prevIndex = index - i;
      if (prevIndex >= 0 && images[prevIndex]?.url) {
        preloadImage(images[prevIndex].url, 'low');
      }
    }
  }, [images, preloadImage]);

  // Effect for preloading images when current index changes
  useEffect(() => {
    if (currentIndex >= 0) {
      preloadImagesAround(currentIndex);
    }

    return () => cleanup();
  }, [currentIndex, preloadImagesAround, cleanup]);

  const getImageUrl = useCallback((originalUrl) => {
    return getCachedImage(originalUrl) || originalUrl;
  }, [getCachedImage]);

  const isLoading = useCallback((url) => {
    return loadingStates[url] || false;
  }, [loadingStates]);

  const isPreloaded = useCallback((url) => {
    return !!getCachedImage(url);
  }, [getCachedImage]);

  return {
    getImageUrl,
    isLoading,
    isPreloaded
  };
}
