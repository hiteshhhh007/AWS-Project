import { create } from 'zustand';
import { useAuthStore } from './authStore';

const useGalleryStore = create((set, get) => ({
  // State
  images: [],
  filteredImages: [],
  loading: false,
  error: null,
  viewingImage: null,
  selectedImages: [],
  isSelectMode: false,
  searchQuery: '',
  selectedTags: [],
  dateRange: null,
  sortBy: 'date',
  sortOrder: 'desc',
  lastKey: null,
  hasMore: true,

  // Setters
  setImages: (images) => {
    const processedImages = (images || []).map(image => ({
      ...image,
      tags: Array.isArray(image.tags) ? image.tags : [],
      url: image.url,
      thumbnailUrl: image.url
    }));
    set({ images: processedImages });
    get().applyFilters();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query || '' });
    get().applyFilters();
  },

  toggleTag: (tag) => {
    if (!tag) return;
    set(state => {
      const newTags = state.selectedTags.includes(tag)
        ? state.selectedTags.filter(t => t !== tag)
        : [...state.selectedTags, tag];
      return { selectedTags: newTags };
    });
    get().applyFilters();
  },

  setDateRange: (range) => {
    set({ dateRange: range });
    get().applyFilters();
  },

  setSortBy: (sortBy) => {
    set({ sortBy: sortBy || 'date' });
    get().applyFilters();
  },

  setSortOrder: (sortOrder) => {
    set({ sortOrder: sortOrder || 'desc' });
    get().applyFilters();
  },

  setLastKey: (lastKey) => {
    set({ lastKey });
  },

  setHasMore: (hasMore) => {
    set({ hasMore });
  },

  // Filtering and Sorting
  applyFilters: () => {
    const state = get();
    let filtered = [...(state.images || [])];

    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(image => 
        (image.fileName || '').toLowerCase().includes(query) ||
        (image.tags || []).some(tag => 
          (typeof tag === 'string' ? tag : tag.S || '').toLowerCase().includes(query)
        )
      );
    }

    // Apply tag filters
    if (state.selectedTags.length > 0) {
      filtered = filtered.filter(image =>
        state.selectedTags.every(tag =>
          (image.tags || []).some(imageTag => 
            (typeof imageTag === 'string' ? imageTag : imageTag.S || '').toLowerCase() === tag.toLowerCase()
          )
        )
      );
    }

    // Apply date range
    if (state.dateRange) {
      const { start, end } = state.dateRange;
      filtered = filtered.filter(image => {
        if (!image.uploadDate) return false;
        const imageDate = new Date(image.uploadDate);
        return (!start || imageDate >= start) && 
               (!end || imageDate <= end);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.sortBy) {
        case 'date':
          comparison = new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0);
          break;
        case 'name':
          comparison = (a.fileName || '').localeCompare(b.fileName || '');
          break;
        default:
          comparison = 0;
      }
      return state.sortOrder === 'asc' ? comparison : -comparison;
    });

    set({ filteredImages: filtered });
  },

  // Image Operations
  fetchImages: async () => {
    const state = get();
    const { accessToken, user } = useAuthStore.getState();
    
    if (!accessToken || !user?.userId) {
      set({ error: 'User ID not found. Please log in again.' });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/images/${user.userId}${state.lastKey ? `?lastKey=${encodeURIComponent(JSON.stringify(state.lastKey))}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle pagination
      if (data.lastEvaluatedKey) {
        set({ lastKey: data.lastEvaluatedKey, hasMore: true });
      } else {
        set({ lastKey: null, hasMore: false });
      }

      // Append new images to existing ones if we're paginating
      if (state.lastKey) {
        get().setImages([...state.images, ...(data.images || [])]);
      } else {
        get().setImages(data.images || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      set({ error: error.message || 'Failed to fetch images' });
    } finally {
      set({ loading: false });
    }
  },

  deleteImage: async (imageId) => {
    const { accessToken, user } = useAuthStore.getState();
    
    if (!accessToken || !user?.userId) {
      set({ error: 'User ID not found. Please log in again.' });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/images/${user.userId}/${imageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted image from state
      set(state => ({
        images: state.images.filter(img => img.imageId !== imageId),
        selectedImages: state.selectedImages.filter(id => id !== imageId)
      }));
      
      get().applyFilters();
    } catch (error) {
      set({ error: error.message || 'Failed to delete image' });
    } finally {
      set({ loading: false });
    }
  },

  uploadImages: async (files) => {
    const { accessToken, user } = useAuthStore.getState();
    
    if (!accessToken || !user?.userId) {
      set({ error: 'User ID not found. Please log in again.' });
      return { success: [], failed: files };
    }

    const results = {
      success: [],
      failed: []
    };

    for (const file of files) {
      set({ loading: true, error: null });
      try {
        // Convert file to base64
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/upload`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user.userId,
              fileName: file.name,
              imageData: base64Data
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        await response.json();
        results.success.push(file.name);
      } catch (error) {
        console.error('Upload error:', error);
        results.failed.push({ name: file.name, error: error.message || 'Failed to upload image' });
      }
    }

    // Fetch latest images only after all uploads are attempted
    if (results.success.length > 0) {
      await get().fetchImages();
    }
    
    set({ loading: false });
    return results;
  },

  uploadImage: async (file) => {
    const results = await get().uploadImages([file]);
    return results.success.length > 0;
  },

  viewImage: (image) => {
    set({ viewingImage: image });
  },

  closeImageView: () => {
    set({ viewingImage: null });
  },

  toggleSelectMode: () => {
    set(state => ({
      isSelectMode: !state.isSelectMode,
      selectedImages: [] // Clear selection when toggling mode
    }));
  },

  toggleImageSelection: (imageId) => {
    if (!imageId) return;
    set(state => {
      const isSelected = state.selectedImages.includes(imageId);
      return {
        selectedImages: isSelected
          ? state.selectedImages.filter(id => id !== imageId)
          : [...state.selectedImages, imageId]
      };
    });
  },

  clearSelection: () => {
    set({ selectedImages: [] });
  },

  batchDeleteImages: async () => {
    const { accessToken, user } = useAuthStore.getState();
    const state = get();
    
    if (!accessToken || !user?.userId || state.selectedImages.length === 0) {
      return false;
    }

    set({ loading: true, error: null });
    try {
      // Send a single batch delete request
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/images/${user.userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageIds: state.selectedImages
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove deleted images from state
      set(state => ({
        images: state.images.filter(img => !state.selectedImages.includes(img.imageId)),
        selectedImages: [], // Clear selection
        isSelectMode: false // Exit select mode
      }));
      
      get().applyFilters();
      return true;
    } catch (error) {
      console.error('Batch delete error:', error);
      set({ error: error.message || 'Failed to delete images' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedTags: [],
      dateRange: null,
      sortBy: 'date',
      sortOrder: 'desc'
    });
    get().applyFilters();
  },

  resetStore: () => {
    set({
      images: [],
      filteredImages: [],
      loading: false,
      error: null,
      viewingImage: null,
      selectedImages: [],
      isSelectMode: false,
      searchQuery: '',
      selectedTags: [],
      dateRange: null,
      sortBy: 'date',
      sortOrder: 'desc',
      lastKey: null,
      hasMore: true
    });
  }
}));

export default useGalleryStore;
