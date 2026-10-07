import React, { useState, useRef } from 'react';

export default function UploadView({ fetchDocuments, setCurrentView }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [aiFailedConfirm, setAiFailedConfirm] = useState(false);
  const [failedFile, setFailedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e, skipAi = false) => {
    const file = skipAi ? failedFile : e.target.files?.[0];
    if (!file) return;

    // Check file size (20 MB limit per HCD spec)
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File too large. Choose a file under 20 MB.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    if (!skipAi) {
      setAiFailedConfirm(false);
      setFailedFile(file);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const url = skipAi ? `${API_URL}/api/documents/upload?skip_ai=true` : `${API_URL}/api/documents/upload`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setAiFailedConfirm(false);
        setFailedFile(null);
        await fetchDocuments();
        setTimeout(() => {
          setCurrentView('dashboard');
          setUploadSuccess(false);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => null);
        
        if (errorData?.detail?.code === "AI_EXTRACTION_FAILED") {
           setAiFailedConfirm(true);
           setUploadError(errorData.detail.message);
        } else {
           setUploadError(errorData?.detail || 'Upload failed. Please try again.');
        }
      }
    } catch {
      setUploadError('Network error. Check your connection and try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A2A5E' }}>Upload Document</h1>
        <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.25rem' }}>
          The AI assistant will automatically categorise and extract information from your file.
        </p>
      </header>

      {/* Error Alert – plain English per HCD spec */}
      {uploadError && (
        <div role="alert" className="flex items-start gap-3 rounded-lg p-4 mb-5" style={{ backgroundColor: '#FCEAEA', border: '1px solid #B3261E', color: '#B3261E' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: '16px' }}>{aiFailedConfirm ? 'AI Processing Failed' : 'Upload Failed'}</p>
            <p style={{ fontSize: '16px', marginTop: '0.15rem' }}>{uploadError}</p>
            {aiFailedConfirm && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={(e) => handleFileUpload(e, true)}
                  className="px-4 py-2 bg-[#B3261E] text-white rounded font-bold hover:opacity-90"
                >
                  Yes, save without AI
                </button>
                <button
                  onClick={() => { setUploadError(null); setAiFailedConfirm(false); setFailedFile(null); }}
                  className="px-4 py-2 border border-[#B3261E] text-[#B3261E] rounded font-bold hover:bg-[#B3261E]/10"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => { setUploadError(null); setAiFailedConfirm(false); setFailedFile(null); }} 
            aria-label="Dismiss error"
            className="ml-auto text-[#B3261E] hover:opacity-70 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        role="button"
        tabIndex={isUploading || uploadSuccess ? -1 : 0}
        aria-label="Click or press Enter to select a file"
        onClick={() => !isUploading && !uploadSuccess && fileInputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !isUploading && !uploadSuccess && fileInputRef.current?.click()}
        className="rounded-xl flex flex-col items-center justify-center min-h-[280px] text-center cursor-pointer transition-all p-10"
        style={{
          border: `2px dashed ${isUploading ? '#0A2A5E' : uploadError ? '#B3261E' : '#9aabbf'}`,
          backgroundColor: isUploading ? 'rgba(10,42,94,0.04)' : '#E8EEF7',
        }}>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          aria-hidden="true"
          disabled={isUploading}
          onChange={handleFileUpload}
        />

        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#E8EEF7] border-t-[#0A2A5E] mb-5"></div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2A5E' }}>AI is processing…</h2>
            <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.25rem' }}>Extracting metadata from your document.</p>
          </>

        ) : uploadSuccess ? (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: '#E6F4EC' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B6E3C" strokeWidth="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1B6E3C' }}>File saved!</h2>
            <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.25rem' }}>Redirecting you to the Dashboard…</p>
          </>

        ) : (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'white' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A2A5E" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2A5E' }}>Click to select a file</h2>
            <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              Supports PDF, JPG, and PNG · Max 20 MB
            </p>
            <button
              type="button"
              className="px-6 rounded-lg font-bold text-white hover:opacity-90 transition-opacity min-h-[44px]"
              style={{ backgroundColor: '#0A2A5E', fontSize: '16px' }}>
              Select File
            </button>
          </>
        )}
      </div>
    </div>
  );
}
