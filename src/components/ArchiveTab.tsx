import React, { useState } from 'react';
import { Discovery } from '../types';

interface ArchiveTabProps {
  discoveries: Discovery[];
  onOpenRegistry: () => void;
  onLocateOnMap: (disc: Discovery) => void;
}

export default function ArchiveTab({
  discoveries,
  onOpenRegistry,
  onLocateOnMap,
}: ArchiveTabProps) {
  // Filtering states
  const [selectedSector, setSelectedSector] = useState('ALL_SECTORS');
  const [selectedType, setSelectedType] = useState('ALL_ENTITIES');
  const [selectedDateRange, setSelectedDateRange] = useState('CY_2024');

  // Interactive selected card details modal/panel state
  const [expandedDiscovery, setExpandedDiscovery] = useState<Discovery | null>(null);

  // Filter the database entries
  const filteredDiscoveries = discoveries.filter(disc => {
    // Sector filter
    if (selectedSector !== 'ALL_SECTORS') {
      if (selectedSector === 'SECTOR_04' && disc.sector !== 'SECTOR_04' && disc.sector !== 'NE_INDUSTRIAL_04') {
        return false;
      }
      if (selectedSector === 'SECTOR_12' && disc.sector !== 'SW_CANAL_12') {
        return false;
      }
      if (selectedSector === 'SECTOR_01' && disc.sector !== 'CORE_CENTRAL_01') {
        return false;
      }
    }

    // Type filter
    if (selectedType !== 'ALL_ENTITIES') {
      if (disc.type !== selectedType) {
        return false;
      }
    }

    // Date range filter simple mocks
    if (selectedDateRange === 'CY_2023') {
      return false; // all mock items are CY_2024
    }

    return true;
  });

  return (
    <div className="flex-grow flex flex-col p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      
      {/* 1. Header Filters Section */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8 pb-6 border-b border-[#343737] select-none">
        <div className="space-y-4">
          <h2 className="font-extrabold text-white text-2xl uppercase tracking-tighter">
            DISCOVERY_LOGS
          </h2>
          
          <div className="flex flex-wrap gap-4">
            {/* SECTOR FILTER */}
            <div className="space-y-1">
              <label htmlFor="sector-filter" className="font-mono text-[9px] text-[#c5c7c6] uppercase opacity-70">
                SECTOR
              </label>
              <select
                id="sector-filter"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-[#282a2a] border border-[#343737] text-white font-mono text-xs px-3 py-1.5 focus:border-[#ff4f00] outline-none rounded-none"
              >
                <option value="ALL_SECTORS">ALL_SECTORS</option>
                <option value="SECTOR_01">SECTOR_01 (CORE)</option>
                <option value="SECTOR_04">SECTOR_04 (NE_IND_4)</option>
                <option value="SECTOR_12">SECTOR_12 (SW_CANAL)</option>
              </select>
            </div>

            {/* TYPE FILTER */}
            <div className="space-y-1">
              <label htmlFor="type-filter" className="font-mono text-[9px] text-[#c5c7c6] uppercase opacity-70">
                TYPE
              </label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#282a2a] border border-[#343737] text-white font-mono text-xs px-3 py-1.5 focus:border-[#ff4f00] outline-none rounded-none"
              >
                <option value="ALL_ENTITIES">ALL_ENTITIES</option>
                <option value="MURAL">MURAL (PAINT)</option>
                <option value="KINETIC">KINETIC (PROJECTED)</option>
                <option value="STENCIL">STENCIL / SPRAY</option>
                <option value="LIGHT_SCULPTURE">LIGHT_SCULPTURE</option>
                <option value="STRUCTURAL">STRUCTURAL</option>
              </select>
            </div>

            {/* DATE RANGE FILTER */}
            <div className="space-y-1">
              <label htmlFor="date-filter" className="font-mono text-[9px] text-[#c5c7c6] uppercase opacity-70">
                DATE_RANGE
              </label>
              <select
                id="date-filter"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="bg-[#282a2a] border border-[#343737] text-white font-mono text-xs px-3 py-1.5 focus:border-[#ff4f00] outline-none rounded-none"
              >
                <option value="CY_2024">CY_2024 (ACTIVE)</option>
                <option value="CY_2023">CY_2023</option>
                <option value="PRE_CRISIS">PRE_CRISIS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entries Found Counter */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#c5c7c6]">
          <span className="text-[#ff4f00] font-bold">{filteredDiscoveries.length}</span> ENTITIES_FOUND
          <div className="w-24 h-[2px] bg-[#343737] ml-4 relative">
            <div 
              className="absolute inset-y-0 left-0 bg-[#ff4f00] transition-all" 
              style={{ width: `${Math.min((filteredDiscoveries.length / (discoveries.length || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Grid/Bento Content Cards Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {filteredDiscoveries.map((disc) => (
          <div
            key={disc.id}
            onClick={() => setExpandedDiscovery(disc)}
            className="group bg-[#1e2020] border border-[#343737] transition-all hover:border-[#ff4f00] cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Grayscale image overlay on color */}
            <div className="aspect-[4/5] bg-[#0d0f0f] relative overflow-hidden shrink-0">
              <img
                src={disc.imageUrl}
                alt={disc.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-[#ff4f00]/5 pointer-events-none"></div>

              {/* Verified or Category tag */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-[#ff4f00]/40 px-2 py-0.5 font-mono text-[9px] text-[#ff4f00] font-bold">
                {disc.verified ? 'VERIFIED_LOG' : 'PENDING_VERIFICATION'}
              </div>
            </div>

            {/* Info details box */}
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase text-white truncate group-hover:text-[#ff4f00] transition-colors">
                    {disc.name}
                  </h3>
                  <p className="font-mono text-[9px] text-[#c5c7c6]">ID: #{disc.id}</p>
                </div>
                <span className="material-symbols-outlined text-[#c5c7c6] group-hover:text-[#ff4f00] transition-colors" style={{ fontSize: '18px' }}>
                  open_in_new
                </span>
              </div>

              {/* Meta properties */}
              <div className="grid grid-cols-2 gap-2 border-t border-[#343737] pt-4 font-mono text-[10px]">
                <div className="space-y-1">
                  <p className="text-[8px] text-[#c5c7c6] uppercase opacity-60">COORDINATES</p>
                  <p className="text-[#e2e2e2] truncate leading-tight">{disc.coordinates.formattedLat}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] text-[#c5c7c6] uppercase opacity-60">SECTOR</p>
                  <p className="text-[#e2e2e2] truncate leading-tight uppercase">{disc.sector}</p>
                </div>
              </div>

              {/* Status footer bar */}
              <div className="flex justify-between items-center bg-[#1a1c1c] p-2 leading-none font-mono text-[10px]">
                <span>
                  STATUS: <span className={`${disc.status === 'DEGRADED' ? 'text-red-400' : disc.status === 'ACTIVE' ? 'text-emerald-400' : 'text-[#ff4f00]'} font-bold`}>{disc.status}</span>
                </span>
                <span className="text-[#c5c7c6] opacity-60">{disc.date}</span>
              </div>
            </div>

          </div>
        ))}

        {/* Empty placeholder Register New Card */}
        <div
          onClick={onOpenRegistry}
          className="border-2 border-dashed border-[#343737] hover:border-[#ff4f00]/50 hover:bg-[#ff5717]/5 flex flex-col items-center justify-center p-8 text-center space-y-4 cursor-pointer min-h-[340px] group transition-all"
        >
          <span className="material-symbols-outlined text-[#c5c7c6] group-hover:text-[#ff4f00] transition-all text-4xl">
            add_circle
          </span>
          <div>
            <p className="font-sans font-bold text-sm text-white uppercase group-hover:text-[#ff4f00] transition-colors">
              REGISTER_NEW
            </p>
            <p className="font-mono text-[10px] text-[#c5c7c6] mt-1 uppercase tracking-wide">
              Upload sector imagery for analysis
            </p>
          </div>
        </div>

      </div>

      {/* 3. Terminal detail slideover popup for expanding card metrics */}
      {expandedDiscovery && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-end">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#1e2020] border-l border-[#ff4f00]/30 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            {/* Top Bar content details */}
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-[#343737] pb-4">
                <div>
                  <span className="font-mono text-[9px] text-[#ff4f00] uppercase block">
                    {expandedDiscovery.type} RE_UPLINK DATA LOG
                  </span>
                  <h3 className="font-sans text-xl font-bold uppercase text-white mt-1">
                    {expandedDiscovery.name}
                  </h3>
                  <span className="inline-block mt-1.5 px-2 py-0.5 font-mono text-[9px] bg-[#121414] border border-[#343737] text-white">
                    UID: 0x{expandedDiscovery.id.replace('-', '_')}
                  </span>
                </div>
                <button 
                  onClick={() => setExpandedDiscovery(null)}
                  className="text-[#c5c7c6] hover:text-[#ff4f00]"
                  title="Close Logs Overlay"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Large high contrast preview frame */}
              <div className="border border-[#343737] p-1 bg-[#121414] relative group aspect-[1.1] overflow-hidden">
                <img 
                  src={expandedDiscovery.imageUrl} 
                  alt={expandedDiscovery.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 font-mono text-[9px] text-[#c5c7c6] uppercase">
                  Telemetry Snapshot | Sector {expandedDiscovery.sector}
                </div>
              </div>

              {/* Coordinates details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121414] border border-[#343737] p-3 font-mono">
                  <span className="text-[9px] text-[#c5c7c6] block uppercase">LATITUDE RAD</span>
                  <span className="text-sm font-bold text-[#ff4f00]">{expandedDiscovery.coordinates.formattedLat}</span>
                </div>
                <div className="bg-[#121414] border border-[#343737] p-3 font-mono">
                  <span className="text-[9px] text-[#c5c7c6] block uppercase">LONGITUDE RAD</span>
                  <span className="text-sm font-bold text-[#ff4f00]">{expandedDiscovery.coordinates.formattedLng}</span>
                </div>
              </div>

              {/* Detailed Observations */}
              <div className="bg-[#121414] p-4 border border-[#343737] space-y-2">
                <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">
                  Originator Observations
                </h4>
                <p className="text-xs font-mono text-[#c5c7c6] leading-relaxed select-text">
                  {expandedDiscovery.description}
                </p>
                <div className="border-t border-[#343737]/60 pt-2 flex justify-between font-mono text-[9px] text-[#c5c7c6]">
                  <span>RECORD_BY: @{expandedDiscovery.tag}</span>
                  <span>SYNCED: {expandedDiscovery.date}</span>
                </div>
              </div>

            </div>

            {/* Locate and Sync actions */}
            <div className="pt-6 border-t border-[#343737] mt-8 space-y-3">
              <button
                onClick={() => {
                  onLocateOnMap(expandedDiscovery);
                  setExpandedDiscovery(null);
                }}
                className="w-full bg-[#ff5717] hover:bg-[#ff4f00] text-black font-sans font-bold py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-transparent hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,181,158,0.2)]"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>my_location</span>
                <span>LOCATE ON SECTOR RADAR</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(expandedDiscovery, null, 2));
                  alert("SYSTEM LOG: Encrypted JSON configuration exported successfully.");
                }}
                className="w-full bg-[#121414] hover:bg-[#282a2a] border border-[#343737] text-white font-mono py-2 text-xs uppercase"
              >
                EXPORT RAW METRICS (JSON)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
