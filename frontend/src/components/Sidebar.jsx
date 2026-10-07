import React from 'react';

export default function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  currentView, 
  setCurrentView, 
  documents 
}) {
  const expiringCount = documents.filter(d => {
    if (!d.expiration_date) return false;
    const diffDays = Math.ceil((new Date(d.expiration_date) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: 'upload',
      label: 'Upload File',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      ),
    },
    {
      id: 'alerts',
      label: 'Action Required',
      badge: expiringCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-20 flex justify-between items-center px-4 py-3"
           style={{ backgroundColor: '#0A2A5E' }}>
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded bg-white flex items-center justify-center font-bold text-sm" style={{ color: '#0A2A5E' }}>FA</span>
          <span className="text-white font-bold text-lg">Filing Assistant</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
          className="text-white p-2 rounded hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:static top-0 left-0 h-full w-64 flex flex-col pt-16 md:pt-0`}
        style={{ backgroundColor: '#0A2A5E', zIndex: 10 }}
        aria-label="Main navigation">
        
        {/* Logo area */}
        <div className="hidden md:flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <span className="w-9 h-9 rounded bg-white flex items-center justify-center font-bold text-sm" style={{ color: '#0A2A5E' }}>FA</span>
          <div>
            <p className="text-white font-bold text-base leading-tight">Filing Assistant</p>
            <p className="text-white/50 text-xs">University of Rwanda</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1" aria-label="Site navigation">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setIsSidebarOpen(false); }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 rounded-lg font-semibold text-base transition-all min-h-[44px] w-full text-left ${
                  isActive
                    ? 'bg-white text-[#0A2A5E]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}>
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="text-[#0A2A5E] text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5B301' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">Group 5 · HCD Project · 2026</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-[9]"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
