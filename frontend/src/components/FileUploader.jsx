import React, { useState, useRef } from 'react';
import { UploadCloud, FileUp, File, X, AlertCircle, HardDrive, WifiOff } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { uploadFile } from '../services/api';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB strictly

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  
  const fileInputRef = useRef(null);

  // Validate file size and select file
  const handleFileSelect = (file) => {
    setErrorMessage('');
    setIsNetworkError(false);
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File is too large (${formatBytes(file.size)}). Maximum allowed size is 2 MB.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage('');
    setIsNetworkError(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('File size exceeds the 2 MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    setIsNetworkError(false);

    try {
      const data = await uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      if (data && data.token) {
        onUploadSuccess(data);
      } else {
        throw new Error('Invalid response format received from server.');
      }
    } catch (err) {
      console.error('Upload error details:', err);
      
      if (!err.response || err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setIsNetworkError(true);
        setErrorMessage(
          'Network Error: Unable to reach the API. In Vercel, set VITE_API_URL to your backend’s HTTPS URL (without /api), then redeploy the frontend. For local development, start the backend with npm run dev.'
        );
      } else {
        const serverMsg = err.response?.data?.message || err.message || 'Failed to upload file. Please try again.';
        setErrorMessage(serverMsg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-8 border border-slate-200/90 shadow-sm transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileUp className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>Send a File</span>
        </h2>
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
          <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Max file size: 2 MB</span>
        </span>
      </div>

      {/* Drag and Drop Zone / Mobile Touch Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 active:bg-indigo-50/50 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : selectedFile
            ? 'border-slate-300 bg-slate-50/50 cursor-default'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          disabled={isUploading}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center py-2 sm:py-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 sm:mb-3">
              <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-1">
              Tap to browse file, or drag & drop here
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Supports any file format up to 2 MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-3 overflow-hidden text-left min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <File className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="truncate min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-mono">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Uploading file...</span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div className={`mt-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2 animate-fadeIn ${
          isNetworkError
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {isNetworkError ? (
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          )}
          <div className="leading-relaxed">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Action Buttons - Stacked on small mobile screens */}
      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full sm:flex-1 py-3 sm:py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-sm transition-all duration-150 active:scale-[0.98]"
        >
          {selectedFile ? 'Change File' : 'Choose File'}
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full sm:flex-1 py-3 sm:py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isUploading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Uploading...</span>
            </>
          ) : (
            <span>Upload File</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
