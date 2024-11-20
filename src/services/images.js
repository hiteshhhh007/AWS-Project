import { api } from './api';
import { useAuthStore } from '@/store/authStore';

export const imageService = {
  async getAllImages({ searchQuery = '', tags = [] } = {}) {
    const allImages = [];
    let lastKey = null;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getImages({ lastKey, limit: 100, searchQuery, tags });
      allImages.push(...(response.images || []));
      
      if (response.lastEvaluatedKey) {
        lastKey = response.lastEvaluatedKey;
      } else {
        hasMore = false;
      }
    }

    return { images: allImages };
  },

  async getImages({ lastKey = null, limit = 100, searchQuery = '', tags = [] }) {
    const userId = useAuthStore.getState().user?.username;
    if (!userId) throw new Error('User not authenticated');

    const params = new URLSearchParams();
    if (lastKey) params.append('lastKey', JSON.stringify(lastKey));
    params.append('limit', limit);
    if (searchQuery) params.append('query', searchQuery);
    if (tags.length > 0) params.append('tags', JSON.stringify(tags));
    
    return await api.get(`/images/${userId}?${params.toString()}`);
  },

  async uploadImage(base64Data, fileName, tags = []) {
    const userId = useAuthStore.getState().user?.username;
    if (!userId) throw new Error('User not authenticated');

    return await api.post('/upload', {
      userId,
      imageData: base64Data,
      fileName,
      tags
    });
  },

  async deleteImage(imageId) {
    const userId = useAuthStore.getState().user?.username;
    if (!userId) throw new Error('User not authenticated');

    return await api.delete(`/images/${userId}/${imageId}`);
  },

  async batchDeleteImages(imageIds) {
    return await api.post('/images/batch-delete', {
      imageIds
    });
  },

  async updateImageTags(imageId, tags) {
    const userId = useAuthStore.getState().user?.username;
    if (!userId) throw new Error('User not authenticated');

    return await api.put(`/images/${userId}/${imageId}/tags`, {
      tags
    });
  },

  async searchImages(query) {
    const params = new URLSearchParams();
    params.append('query', query);
    return await api.get(`/images/search?${params.toString()}`);
  }
};
