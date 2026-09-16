import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://quickdrop-0nnr.onrender.com').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Uploads a file to the backend
 * @param {File} file - The file object to upload
 * @param {Function} onProgress - Callback function for upload progress (0-100)
 * @returns {Promise<{token: string, expiresAt: string}>}
 */
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/v1/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    },
  });

  const result = response.data?.data || response.data;
  return result;
};

/**
 * Downloads a file using its 6-digit token and triggers browser save
 * @param {string} token - 6-digit token
 * @returns {Promise<{fileName: string}>}
 */
export const downloadFile = async (token) => {
  // Do not fetch the file with Axios. Axios waits for the complete Cloudinary
  // response, keeps it in JavaScript memory, then starts a second download.
  // A normal browser navigation follows the backend's redirect to Cloudinary
  // and lets the browser stream the file straight to disk.
  const link = document.createElement('a');
  link.href = `${API_BASE_URL}/api/v1/files/download/${encodeURIComponent(token)}`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();

  return { fileName: `quickdrop-${token}` };
};

export default api;
