import React, { useState } from 'react';

export default function Dashboard({ documents, loading, setCurrentView }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [expandedDocs, setExpandedDocs] = useState({});

  const toggleExpand = (docId) => {
    setExpandedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (doc.category?.toLowerCase().includes(q)) return true;
    if (doc.filename?.toLowerCase().includes(q)) return true;
    if (doc.extracted_data) {
      const allValues = Object.values(doc.extracted_data).map(v => String(v).toLowerCase());
      if (allValues.some(v => v.includes(q))) return true;
      const allKeys = Object.keys(doc.extracted_data).map(k => k.toLowerCase().replace(/_/g, ' '));
      if (allKeys.some(k => k.includes(q))) return true;
    }
    return false;
  });

  return (
    <>
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A2A5E' }}>Dashboard</h1>
          <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.25rem' }}>
            {documents.length} document{documents.length !== 1 ? 's' : ''} stored
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Metadata Search */}
          <div className="relative flex-1 md:w-96">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a6a8a" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="search"
              id="doc-search"
              aria-label="Search documents by metadata"
              placeholder="Search by name, category, merchant…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ fontFamily: 'inherit', fontSize: '16px' }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-[#E8EEF7] bg-white focus:outline-none focus:border-[#0A2A5E] text-[#0A2A5E] placeholder-[#9aabbf] min-h-[44px] transition-colors"
            />
          </div>

          {/* Upload Button */}
          <button
            id="new-doc-btn"
            onClick={() => setCurrentView('upload')}
            className="flex items-center justify-center gap-2 px-5 rounded-lg font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 min-h-[44px]"
            style={{ backgroundColor: '#0A2A5E', fontSize: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Document
          </button>
        </div>
      </header>

      {/* Body states */}
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[300px] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8EEF7] border-t-[#0A2A5E]"></div>
          <p style={{ color: '#5a6a8a', fontSize: '16px' }}>Loading documents…</p>
        </div>

      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] rounded-xl p-12 text-center" style={{ backgroundColor: '#E8EEF7' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0A2A5E" strokeWidth="1.5" className="mb-4" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2A5E' }}>No documents yet</h2>
          <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.5rem', maxWidth: '340px' }}>
            Upload your first course file and the AI will categorise it for you.
          </p>
          <button
            onClick={() => setCurrentView('upload')}
            className="mt-6 px-6 rounded-lg font-bold text-white min-h-[44px] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0A2A5E', fontSize: '16px' }}>
            Upload a File
          </button>
        </div>

      ) : filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl p-12 text-center" style={{ backgroundColor: '#E8EEF7' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5a6a8a" strokeWidth="1.5" className="mb-4" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2A5E' }}>No results found</h2>
          <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.5rem' }}>
            No metadata matches "<strong>{searchQuery}</strong>".
          </p>
          <button onClick={() => setSearchQuery('')} className="mt-4 px-5 rounded-lg font-bold min-h-[44px] hover:opacity-90 transition-opacity" style={{ backgroundColor: '#E8EEF7', color: '#0A2A5E', border: '2px solid #0A2A5E', fontSize: '16px' }}>
            Clear Search
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map(doc => {
            const today = new Date();
            const expDate = doc.expiration_date ? new Date(doc.expiration_date) : null;
            const diffDays = expDate ? Math.ceil((expDate - today) / (1000 * 60 * 60 * 24)) : null;
            const isExpired = diffDays !== null && diffDays < 0;
            const isExpiringSoon = diffDays !== null && diffDays >= 0 && diffDays <= 30;

            return (
              <article key={doc.id} className="flex flex-col rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: '#E8EEF7', border: '1px solid rgba(10,42,94,0.1)' }}>
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: '#0A2A5E', color: '#FFFFFF' }}>
                    {doc.category || 'Uncategorized'}
                  </span>

                  {isExpired && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: '#FCEAEA', color: '#B3261E' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      Expired
                    </span>
                  )}
                  {isExpiringSoon && !isExpired && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: '#F5B301', color: '#0A2A5E' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      Due {diffDays === 0 ? 'Today' : `in ${diffDays}d`}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold truncate mb-1" style={{ fontSize: '16px', color: '#0A2A5E' }} title={doc.filename}>
                  {doc.filename}
                </h3>
                <p style={{ fontSize: '14px', color: '#5a6a8a' }} className="mb-4">
                  Added {new Date(doc.created_at).toLocaleDateString('en-GB')}
                  {doc.expiration_date && ` · Expires ${new Date(doc.expiration_date).toLocaleDateString('en-GB')}`}
                </p>

                {/* Extracted metadata table or Error block */}
                {doc.extracted_data?.ai_extraction_error ? (
                  <div className="rounded-lg p-3 mb-4 flex flex-col gap-2" style={{ backgroundColor: '#FCEAEA', border: '1px solid #B3261E' }}>
                    <div className="flex items-center gap-2" style={{ color: '#B3261E' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span className="font-bold" style={{ fontSize: '14px' }}>AI Processing Failed</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#B3261E', opacity: 0.9 }} className="break-words line-clamp-3" title={doc.extracted_data.ai_extraction_error}>
                      {doc.extracted_data.ai_extraction_error}
                    </p>
                  </div>
                ) : (
                  doc.extracted_data && Object.keys(doc.extracted_data).length > 0 && (
                    <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'rgba(10,42,94,0.05)' }}>
                      {Object.entries(doc.extracted_data)
                        .slice(0, 4)
                        .map(([key, value]) => (
                        <div key={key} className="flex justify-between items-start gap-2 py-1 border-b last:border-b-0" style={{ borderColor: 'rgba(10,42,94,0.08)' }}>
                          <span style={{ fontSize: '14px', color: '#5a6a8a', minWidth: '80px' }} className="capitalize mt-0.5">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-semibold text-right truncate max-w-[160px]" style={{ fontSize: '14px', color: '#0A2A5E' }} title={String(value)}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                      {Object.keys(doc.extracted_data).length > 4 && (
                        <p className="text-center mt-3 font-semibold" style={{ fontSize: '13px', color: '#5a6a8a' }}>
                          +{Object.keys(doc.extracted_data).length - 4} more fields (View Details)
                        </p>
                      )}
                    </div>
                  )
                )}

                {/* View button */}
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="mt-auto w-full rounded-lg font-bold transition-colors hover:opacity-90 flex items-center justify-center gap-2 min-h-[44px]"
                  style={{ backgroundColor: 'white', color: '#0A2A5E', border: '2px solid #0A2A5E', fontSize: '16px' }}
                  aria-label={`View document ${doc.filename}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View Document
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* In-App Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#0A2A5E', color: 'white' }}>
              <div className="flex items-center gap-3 overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <h3 className="font-bold truncate" style={{ fontSize: '18px' }}>{previewDoc.filename}</h3>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close preview"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              <div className="flex-1 bg-[#E8EEF7] relative">
                <iframe 
                  src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080'}/api/documents/${previewDoc.id}/file`} 
                  title={`Preview of ${previewDoc.filename}`}
                  className="w-full h-full border-none absolute inset-0"
                />
              </div>
              <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 overflow-y-auto p-6 flex flex-col gap-6">
                <div>
                  <h4 className="font-bold text-[#5a6a8a] text-xs uppercase tracking-widest mb-2">Category</h4>
                  <span className="px-3 py-1 rounded-full text-sm font-bold tracking-wide inline-block" style={{ backgroundColor: '#0A2A5E', color: '#FFFFFF' }}>
                    {previewDoc.category || 'Uncategorized'}
                  </span>
                </div>
                
                {(previewDoc.issue_date || previewDoc.expiration_date) && (
                  <div className="flex gap-4">
                    {previewDoc.issue_date && (
                      <div className="flex-1">
                        <h4 className="font-bold text-[#5a6a8a] text-xs uppercase tracking-widest mb-1">Issue Date</h4>
                        <p className="text-[15px] font-semibold text-[#0A2A5E]">{new Date(previewDoc.issue_date).toLocaleDateString('en-GB')}</p>
                      </div>
                    )}
                    {previewDoc.expiration_date && (
                      <div className="flex-1">
                        <h4 className="font-bold text-[#5a6a8a] text-xs uppercase tracking-widest mb-1">Expiration</h4>
                        <p className="text-[15px] font-semibold text-[#0A2A5E]">{new Date(previewDoc.expiration_date).toLocaleDateString('en-GB')}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {previewDoc.extracted_data?.ai_extraction_error ? (
                  <div className="rounded-lg p-4 mt-2" style={{ backgroundColor: '#FCEAEA', border: '1px solid #B3261E' }}>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#B3261E' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <h4 className="font-bold text-sm">AI Error</h4>
                    </div>
                    <p style={{ fontSize: '13px', color: '#B3261E' }}>{previewDoc.extracted_data.ai_extraction_error}</p>
                  </div>
                ) : previewDoc.extracted_data && Object.keys(previewDoc.extracted_data).length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-bold text-[#0A2A5E] text-lg mb-4 pb-2 border-b border-gray-100">AI Extracted Data</h4>
                    <div className="flex flex-col gap-4">
                      {Object.entries(previewDoc.extracted_data).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a6a8a]">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[15px] text-[#0A2A5E] break-words font-medium leading-snug">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
