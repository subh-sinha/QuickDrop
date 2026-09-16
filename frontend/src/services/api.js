import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
  const response = await api.get(`/api/v1/files/download/${token}`, {
    responseType: 'blob',
  });

  let fileName = `quickdrop-${token}`;
  const disposition = response.headers['content-disposition'];

  if (disposition && disposition.includes('filename=')) {
    const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      fileName = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream',
  });

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);

  return { fileName };
};

export default api;
