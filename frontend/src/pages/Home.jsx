import React, { useState } from 'react';
import Header from '../components/Header';
import FileUploader from '../components/FileUploader';
import TokenDisplay from '../components/TokenDisplay';
import FileDownloader from '../components/FileDownloader';
import { Upload, Download, Shield } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('send'); // 'send' or 'receive'
  const [uploadedData, setUploadedData] = useState(null); // { token, expiresAt }

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
  };

  const handleResetUpload = () => {
    setUploadedData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <div>
        <Header />

        {/* Mobile View Tab Toggle */}
        <div className="max-w-4xl mx-auto px-4 mb-6 md:hidden">
          <div className="flex bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('send')}
              type="button"
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'send'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Send File
            </button>
            <button
              onClick={() => setActiveTab('receive')}
              type="button"
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'receive'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Receive File
            </button>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <main className="max-w-4xl mx-auto px-4 pb-12">
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 items-start">
            <div>
              {uploadedData ? (
                <TokenDisplay
                  token={uploadedData.token}
                  expiresAt={uploadedData.expiresAt}
                  onReset={handleResetUpload}
                />
              ) : (
                <FileUploader onUploadSuccess={handleUploadSuccess} />
              )}
            </div>

            <div>
              <FileDownloader />
            </div>
          </div>

          {/* Mobile Single Tab View */}
          <div className="md:hidden">
            {activeTab === 'send' ? (
              uploadedData ? (
                <TokenDisplay
                  token={uploadedData.token}
                  expiresAt={uploadedData.expiresAt}
                  onReset={handleResetUpload}
                />
              ) : (
                <FileUploader onUploadSuccess={handleUploadSuccess} />
              )
            ) : (
              <FileDownloader />
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Files expire automatically & are stored securely. Max limit 2 MB.</span>
          </div>
          <p>© {new Date().getFullYear()} QuickDrop. Simple peer-to-device file transfer.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
