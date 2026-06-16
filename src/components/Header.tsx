import React, { useState } from 'react';
import { Operator } from '../types';

interface HeaderProps {
  operator: Operator;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeNav: 'SECTOR_MAP' | 'LIVE_FEED';
  setActiveNav: (nav: 'SECTOR_MAP' | 'LIVE_FEED') => void;
  onTabChange: (tab: string) => void;
}

export default function Header({
  operator,
  searchQuery,
  setSearchQuery,
  activeNav,
  setActiveNav,
  onTabChange,
}: HeaderProps) {
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const notifications = [
    "SECURITY UPLINK STABLE - ENCRYPTION ACTIVE",
    "NEW VECTOR MARKS REPORTED IN INDUSTRIAL SECTOR 04",
    "TELEMETRY DATA STREAM RE-AUTHORIZED SUCCESSFULLY"
  ];

  const handleNotificationsClick = () => {
    setShowNotificationAlert(!showNotificationAlert);
    if (!showNotificationAlert) {
      setNotificationCount(0); // clear count
    }
  };

  return (
    <header className="fixed top-0 right-0 left-[260px] h-16 bg-[#1e2020] border-b border-[#343737] flex items-center justify-between px-8 z-20">
      {/* Brand & Map/Feed toggle */}
      <div className="flex items-center gap-8">
        <div 
          className="font-sans text-lg font-bold text-[#e2e2e2] tracking-tighter cursor-pointer hover:text-white" 
          onClick={() => onTabChange('map')}
        >
          UA_ARCHIVE_CORE
        </div>
        <nav className="flex gap-6">
          <button
            onClick={() => {
              setActiveNav('LIVE_FEED');
              onTabChange('settings'); // Settings has logs, feeds, and configurations
            }}
            className={`font-mono text-xs cursor-pointer transition-all uppercase tracking-wider pb-1 ${
              activeNav === 'LIVE_FEED'
                ? 'text-[#ff4f00] font-bold border-b-2 border-[#ff4f00]'
                : 'text-[#b3b5b5] hover:text-[#ff4f00]'
            }`}
          >
            LIVE_FEED
          </button>
          <button
            onClick={() => {
              setActiveNav('SECTOR_MAP');
              onTabChange('map');
            }}
            className={`font-mono text-xs cursor-pointer transition-all uppercase tracking-wider pb-1 ${
              activeNav === 'SECTOR_MAP'
                ? 'text-[#ff4f00] font-bold border-b-2 border-[#ff4f00]'
                : 'text-[#b3b5b5] hover:text-[#ff4f00]'
            }`}
          >
            SECTOR_MAP
          </button>
        </nav>
      </div>

      {/* Search, Notifications & Session state */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <input
            id="header-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121414] border border-[#343737] pl-10 pr-4 py-1.5 text-xs font-mono text-[#e2e2e2] w-64 focus:outline-none focus:border-[#ff4f00] transition-colors rounded-none placeholder:text-[#5c4037]/50"
            placeholder="SEARCH_COORDS OR LABELS..."
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#c5c7c6] text-xs opacity-75">
            search
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-mono text-[#ff4f00] hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Buttons & Indicators */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationsClick}
              className="text-[#b3b5b5] hover:text-[#ff4f00] transition-colors cursor-pointer flex items-center relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff4f00] rounded-none animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown Box */}
            {showNotificationAlert && (
              <div className="absolute right-0 mt-3 w-80 bg-[#1e2020] border border-[#ff4f00] p-4 shadow-2xl z-50 font-mono text-[10px] space-y-3">
                <div className="flex justify-between items-center border-b border-[#343737] pb-1.5 font-sans font-bold uppercase text-xs text-[#ff4f00]">
                  <span>Sys Messages</span>
                  <button onClick={() => setShowNotificationAlert(false)} className="hover:text-white">✕</button>
                </div>
                <div className="space-y-2">
                  {notifications.map((msg, index) => (
                    <div key={index} className="flex gap-2 items-start border-b border-[#121414]/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[#ff4f00]">{">"}</span>
                      <p className="text-[#e2e2e2] leading-relaxed">{msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Terminal Toggle shortcut */}
          <button
            onClick={() => onTabChange('settings')}
            className="text-[#b3b5b5] hover:text-[#ff4f00] transition-colors cursor-pointer flex items-center"
            title="Open Console Settings"
          >
            <span className="material-symbols-outlined">terminal</span>
          </button>

          <div className="h-6 w-px bg-[#343737] mx-1"></div>

          {/* Active Status */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-2 h-2 rounded-full bg-[#ff4f00] animate-pulse"></div>
            <span className="font-mono text-[10px] text-[#ff4f00] font-bold tracking-wider uppercase">
              SESSION_ACTIVE
            </span>
          </div>

          {/* Mini Avatar inside Header */}
          {operator.loggedIn && (
            <div 
              onClick={() => onTabChange('profile')}
              className="w-7 h-7 border border-[#ff4f00]/60 hover:border-[#ff4f00] p-0.5 bg-[#121414] overflow-hidden cursor-pointer"
            >
              <img
                src={operator.avatarUrl}
                alt={operator.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
