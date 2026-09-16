import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

const TokenDisplay = ({ token, expiresAt, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Split token into individual character array for formatted boxes
  const digits = token ? token.toString().split('') : ['-', '-', '-', '-', '-', '-'];

  // Handle Copy Code to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback copy method
      const textArea = document.createElement('textarea');
      textArea.value = token;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Live countdown timer calculation based on expiresAt
  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft('10 minutes');
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formattedMinutes = minutes > 0 ? `${minutes}m ` : '';
      const formattedSeconds = `${seconds.toString().padStart(2, '0')}s`;
      
      setTimeLeft(`${formattedMinutes}${formattedSeconds}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-8 border border-slate-200/90 shadow-sm text-center animate-fadeIn">
      {/* Upload Success Badge */}
      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4 border border-emerald-200/60 max-w-full">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>File Uploaded Successfully</span>
      </div>

      <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
        Your transfer code
      </p>

      {/* Large 6-digit Code Display - Scaled for 320px+ mobile screens */}
      <div className="flex justify-center items-center gap-1 sm:gap-2.5 mb-6">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="w-9 h-11 sm:w-12 sm:h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl bg-slate-900 text-white font-mono text-lg sm:text-2xl md:text-3xl font-bold shadow-sm select-all tracking-tight transition-transform active:scale-95"
          >
            {digit}
          </div>
        ))}
      </div>

      {/* Copy Code & Expiration Info */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
        <button
          onClick={handleCopy}
          type="button"
          className={`w-full py-3.5 sm:py-2.5 px-5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
          }`}
        >
          {copied ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard!</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </span>
          )}
        </button>
      </div>

      {/* Expiry Timer Warning */}
      <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100/90 px-3.5 py-1.5 rounded-lg mb-5">
        {isExpired ? (
          <span className="text-amber-600 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 shrink-0" /> Code expired
          </span>
        ) : (
          <>
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Expires in <strong className="font-semibold text-slate-800">{timeLeft}</strong></span>
          </>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={onReset}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload Another File</span>
        </button>
      </div>
    </div>
  );
};

export default TokenDisplay;
