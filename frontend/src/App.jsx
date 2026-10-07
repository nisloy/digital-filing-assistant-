import React, { useState, useEffect } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import UploadView from './components/UploadView'
import AlertsView from './components/AlertsView'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView]     = useState('dashboard');
  const [documents, setDocuments]         = useState([]);
  const [loading, setLoading]             = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const response = await fetch(`${API_URL}/api/documents/`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  return (
    /* White background per HCD spec */
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF', fontFamily: '"Noto Sans", Arial, sans-serif' }}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        documents={documents}
      />

      {/* Main content */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto"
        style={{ padding: '2.5rem', paddingTop: currentView === 'dashboard' ? '2.5rem' : '2.5rem' }}>

        {/* Skip nav for keyboard users (HCD accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 px-4 py-2 rounded font-bold text-white focus:outline-none"
          style={{ backgroundColor: '#0A2A5E' }}>
          Skip to content
        </a>

        {/* Mobile padding for the fixed top bar */}
        <div className="h-14 md:h-0"></div>

        {currentView === 'dashboard' && (
          <Dashboard documents={documents} loading={loading} setCurrentView={setCurrentView} />
        )}
        {currentView === 'upload' && (
          <UploadView fetchDocuments={fetchDocuments} setCurrentView={setCurrentView} />
        )}
        {currentView === 'alerts' && (
          <AlertsView documents={documents} setCurrentView={setCurrentView} />
        )}
      </main>
    </div>
  );
}

export default App
