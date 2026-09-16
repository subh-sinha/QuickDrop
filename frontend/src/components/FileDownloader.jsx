import React, { useState, useRef } from 'react';
import { FileDown, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { downloadFile } from '../services/api';

const FileDownloader = () => {
  const [tokenDigits, setTokenDigits] = useState(['', '', '', '', '', '']);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Helper to get full 6-digit token string
  const fullToken = tokenDigits.join('');

  // Handle single digit input change
  const handleChange = (index, value) => {
    // Only accept numeric digits
    const cleanedValue = value.replace(/[^0-9]/g, '');

    if (!cleanedValue) {
      const newDigits = [...tokenDigits];
      newDigits[index] = '';
      setTokenDigits(newDigits);
      return;
    }

    // If multiple digits pasted into a single input field
    if (cleanedValue.length > 1) {
      handlePasteData(cleanedValue);
      return;
    }

    const newDigits = [...tokenDigits];
    newDigits[index] = cleanedValue;
    setTokenDigits(newDigits);

    // Auto-advance focus to next input
    if (index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle KeyDown (Backspace navigation)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!tokenDigits[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  // Handle Paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteData) {
      handlePasteData(pasteData);
    }
  };

  const handlePasteData = (digitsString) => {
    const arr = digitsString.split('').slice(0, 6);
    const newDigits = ['', '', '', '', '', ''];
    arr.forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setTokenDigits(newDigits);
    setErrorMessage('');

    // Focus last entered digit or next empty
    const focusIndex = Math.min(arr.length, 5);
    inputRefs[focusIndex].current?.focus();
  };

  // Reset receive form
  const handleReset = () => {
    setTokenDigits(['', '', '', '', '', '']);
    setDownloadSuccess(false);
    setDownloadedFileName('');
    setErrorMessage('');
    setIsDownloading(false);
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 100);
  };

  // Submit download request
  const handleDownload = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (fullToken.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code.');
      return;
    }

    setIsDownloading(true);

    try {
      const { fileName } = await downloadFile(fullToken);
      setDownloadedFileName(fileName);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Download error:', err);
      if (err.response?.status === 400 || err.response?.status === 404) {
        setErrorMessage('Invalid or expired transfer code. Please check and try again.');
      } else if (err.response?.status === 410) {
        setErrorMessage('This transfer code has expired.');
      } else {
        setErrorMessage(
          err.response?.data?.message || err.message || 'Unable to download file. Please check your token or server connection.'
        );
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-8 border border-slate-200/90 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileDown className="w-5 h-5 text-indigo-600 shrink-0" />
          Receive a File
        </h2>
      </div>

      {downloadSuccess ? (
        /* Success State */
        <div className="text-center py-3 sm:py-4 animate-fadeIn">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            Download started ✓
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5 font-mono bg-slate-50 py-1.5 px-3 rounded-lg inline-block border border-slate-200/60 max-w-full truncate">
            {downloadedFileName || `quickdrop-${fullToken}`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              type="button"
              className="w-full py-3.5 sm:py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Receive Another File</span>
            </button>
          </div>
        </div>
      ) : (
        /* Code Input & Form State */
        <form onSubmit={handleDownload}>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-3">
            Enter 6-digit transfer code
          </p>

          {/* 6-digit Segmented Inputs - Touch friendly */}
          <div className="flex justify-between items-center gap-1 sm:gap-2 mb-5 sm:mb-6" onPaste={handlePaste}>
            {tokenDigits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isDownloading}
                className="w-9 h-11 sm:w-11 sm:h-13 md:w-12 md:h-14 text-center font-mono text-lg sm:text-2xl font-bold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Download Button */}
          <button
            type="submit"
            disabled={fullToken.length !== 6 || isDownloading}
            className="w-full py-3.5 sm:py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isDownloading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Downloading File...</span>
              </>
            ) : (
              <>
                <span>Download File</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FileDownloader;
