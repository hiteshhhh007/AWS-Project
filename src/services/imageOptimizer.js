const thumbnailCache = new Map();
const fullImageCache = new Map();

export const generateThumbnail = async (imageUrl, maxWidth = 300) => {
  try {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
      img.crossOrigin = 'anonymous';
    });

    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    
    const thumbnailUrl = canvas.toDataURL('image/webp', 0.8);
    return thumbnailUrl;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return imageUrl;
  }
};

export const preloadFullImage = async (imageUrl) => {
  if (fullImageCache.has(imageUrl)) {
    return fullImageCache.get(imageUrl);
  }

  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
      img.crossOrigin = 'anonymous';
    });
    
    fullImageCache.set(imageUrl, img);
    return imageUrl;
  } catch (error) {
    console.error('Error preloading full image:', error);
    return imageUrl;
  }
};

export const getThumbnail = async (imageUrl) => {
  if (thumbnailCache.has(imageUrl)) {
    return thumbnailCache.get(imageUrl);
  }

  const thumbnailUrl = await generateThumbnail(imageUrl);
  thumbnailCache.set(imageUrl, thumbnailUrl);
  return thumbnailUrl;
};

export const getFullImage = (imageUrl) => {
  return fullImageCache.has(imageUrl) ? imageUrl : null;
};

// Clear caches when needed (e.g., low memory)
export const clearImageCaches = () => {
  thumbnailCache.clear();
  fullImageCache.clear();
};
