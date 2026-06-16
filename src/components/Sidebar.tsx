import React from 'react';
import { Operator } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNewDiscoveryClick: () => void;
  operator: Operator;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  onNewDiscoveryClick,
  operator,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#1e2020] border-r border-[#343737] flex flex-col py-5 gap-3 z-30 justify-between">
      <div>
        {/* Logo and Sector Title */}
        <div className="px-6 mb-8 group cursor-pointer" onClick={() => setCurrentTab('map')}>
          <h1 className="font-sans text-2xl font-extrabold uppercase tracking-tighter leading-none text-[#ff4f00] hover:brightness-110 transition-all">
            URBAN ART ARCHIVE
          </h1>
          <p className="font-mono text-[10px] text-[#c5c7c6] mt-2 tracking-widest uppercase">
            INDUSTRIAL SECTOR 04
          </p>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-grow">
          <ul className="space-y-1">
            {/* Map Link */}
            <li>
              <button
                id="sidebar-nav-map"
                onClick={() => setCurrentTab('map')}
                className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all text-left uppercase text-xs tracking-wider ${
                  currentTab === 'map'
                    ? 'text-[#ff4f00] border-l-4 border-[#ff4f00] bg-[#282a2a] font-bold'
                    : 'text-[#c5c7c6] hover:text-[#e2e2e2] hover:bg-[#333535] border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>map</span>
                <span className="font-sans">Map</span>
              </button>
            </li>

            {/* Archive Link */}
            <li>
              <button
                id="sidebar-nav-archive"
                onClick={() => setCurrentTab('archive')}
                className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all text-left uppercase text-xs tracking-wider ${
                  currentTab === 'archive'
                    ? 'text-[#ff4f00] border-l-4 border-[#ff4f00] bg-[#282a2a] font-bold'
                    : 'text-[#c5c7c6] hover:text-[#e2e2e2] hover:bg-[#333535] border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>inventory_2</span>
                <span className="font-sans">Archive</span>
              </button>
            </li>

            {/* Profile Link */}
            <li>
              <button
                id="sidebar-nav-profile"
                onClick={() => setCurrentTab('profile')}
                className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all text-left uppercase text-xs tracking-wider ${
                  currentTab === 'profile'
                    ? 'text-[#ff4f00] border-l-4 border-[#ff4f00] bg-[#282a2a] font-bold'
                    : 'text-[#c5c7c6] hover:text-[#e2e2e2] hover:bg-[#333535] border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>person</span>
                <span className="font-sans">Profile {operator.loggedIn ? '' : '(Access Required)'}</span>
              </button>
            </li>

            {/* Settings Link */}
            <li>
              <button
                id="sidebar-nav-settings"
                onClick={() => setCurrentTab('settings')}
                className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all text-left uppercase text-xs tracking-wider ${
                  currentTab === 'settings'
                    ? 'text-[#ff4f00] border-l-4 border-[#ff4f00] bg-[#282a2a] font-bold'
                    : 'text-[#c5c7c6] hover:text-[#e2e2e2] hover:bg-[#333535] border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>settings</span>
                <span className="font-sans">Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Button & Profile Status */}
      <div className="px-6 mt-auto">
        <button
          id="btn-sidebar-new-discovery"
          onClick={onNewDiscoveryClick}
          className="w-full bg-[#ff5717] hover:bg-[#ff4f00] active:scale-95 transition-all text-black font-sans font-extrabold py-3 uppercase tracking-widest text-xs border border-transparent hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,181,158,0.3)]"
        >
          NEW DISCOVERY
        </button>

        <div className="mt-6 flex items-center gap-3 border-t border-[#343737] pt-4">
          <div className="w-9 h-9 border border-[#343737] p-0.5 bg-[#121414] overflow-hidden shrink-0 flex items-center justify-center">
            {operator.loggedIn ? (
              <img
                src={operator.avatarUrl}
                alt={operator.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-none grayscale hover:grayscale-0 transition-transform hover:scale-110"
              />
            ) : (
              <span className="material-symbols-outlined text-[#c5c7c6] text-lg">no_accounts</span>
            )}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="font-mono text-[9px] text-[#c5c7c6] truncate tracking-wider">
              {operator.loggedIn ? 'OPERATOR_LOGGED_IN' : 'SYS_STANDBY'}
            </p>
            <p className="font-sans text-xs font-semibold uppercase text-[#e2e2e2] leading-tight truncate">
              {operator.loggedIn ? operator.name : 'GUEST_MODE'}
            </p>
            <p className="font-mono text-[8px] text-[#ff4f00] uppercase truncate leading-none mt-1">
              {operator.loggedIn ? operator.role : 'LOGGED_OUT'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
