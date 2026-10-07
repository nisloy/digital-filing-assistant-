import React from 'react';

export default function AlertsView({ documents, setCurrentView }) {
  const [previewDoc, setPreviewDoc] = React.useState(null);
  const today = new Date();

  const alerts = documents
    .filter(doc => doc.expiration_date)
    .map(doc => {
      const expDate = new Date(doc.expiration_date);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      return { ...doc, diffDays, expDate };
    })
    .sort((a, b) => a.diffDays - b.diffDays);

  const expired     = alerts.filter(d => d.diffDays < 0);
  const expiringSoon = alerts.filter(d => d.diffDays >= 0 && d.diffDays <= 30);
  const active      = alerts.filter(d => d.diffDays > 30);

  const renderCard = (doc, status) => {
    const isExpired  = status === 'expired';
    const isWarning  = status === 'warning';

    const badgeStyle = isExpired
      ? { backgroundColor: '#FCEAEA', color: '#B3261E' }
      : isWarning
        ? { backgroundColor: '#F5B301', color: '#0A2A5E' }
        : { backgroundColor: '#E6F4EC', color: '#1B6E3C' };

    const badgeLabel = isExpired
      ? 'Expired'
      : isWarning
        ? (doc.diffDays === 0 ? 'Due Today' : `Due in ${doc.diffDays} day${doc.diffDays === 1 ? '' : 's'}`)
        : 'Active';

    return (
      <article
        key={doc.id}
        className="flex flex-col rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-md"
        style={{ backgroundColor: '#E8EEF7', border: isExpired ? '1px solid #B3261E' : isWarning ? '1px solid #F5B301' : '1px solid rgba(10,42,94,0.1)' }}>

        {/* Status badge + category */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: '#0A2A5E', color: '#FFFFFF' }}>
            {doc.category || 'Uncategorized'}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded font-bold" style={{ ...badgeStyle, fontSize: '14px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {badgeLabel}
          </span>
        </div>

        <h3 className="font-bold truncate mb-1" style={{ fontSize: '16px', color: '#0A2A5E' }} title={doc.filename}>
          {doc.filename}
        </h3>
        <p style={{ fontSize: '14px', color: '#5a6a8a', marginBottom: '1rem' }}>
          Expires {doc.expDate.toLocaleDateString('en-GB')}
        </p>

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
  };

  const SectionHeading = ({ children, color }) => (
    <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '22px', fontWeight: 700, color }}>
      {children}
    </h2>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A2A5E' }}>Action Required</h1>
          <p style={{ fontSize: '16px', color: '#5a6a8a', marginTop: '0.25rem' }}>
            Tracking {alerts.length} document{alerts.length !== 1 ? 's' : ''} with expiration dates.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('upload')}
          className="flex items-center justify-center gap-2 px-5 rounded-lg font-bold text-white hover:opacity-90 min-h-[44px]"
          style={{ backgroundColor: '#0A2A5E', fontSize: '16px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Document
        </button>
      </header>

      {/* All-clear */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] rounded-xl p-12 text-center" style={{ backgroundColor: '#E8EEF7' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#E6F4EC' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B6E3C" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0A2A5E' }}>You're all caught up!</h2>
          <p style={{ fontSize: '16px', color: '#5a6a8a', maxWidth: '360px', marginTop: '0.5rem' }}>
            None of your documents have upcoming or past expiration dates.
          </p>
        </div>

      ) : (
        <div className="space-y-10">
          {expired.length > 0 && (
            <section aria-label="Expired documents">
              <SectionHeading color="#B3261E">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Expired Documents
              </SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {expired.map(d => renderCard(d, 'expired'))}
              </div>
            </section>
          )}

          {expiringSoon.length > 0 && (
            <section aria-label="Documents expiring within 30 days">
              <SectionHeading color="#7a5c00">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="2" aria-hidden="true">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Expiring within 30 Days
              </SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {expiringSoon.map(d => renderCard(d, 'warning'))}
              </div>
            </section>
          )}

          {active.length > 0 && (
            <section aria-label="Active documents with tracked expiry">
              <SectionHeading color="#0A2A5E">Active &amp; Tracked</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {active.map(d => renderCard(d, 'active'))}
              </div>
            </section>
          )}
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
            <div className="flex-1 bg-[#E8EEF7] relative">
              <iframe 
                src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080'}/api/documents/${previewDoc.id}/file`} 
                title={`Preview of ${previewDoc.filename}`}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
