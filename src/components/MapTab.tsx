import React, { useState, useEffect, useRef } from 'react';
import { Discovery, TelemetryLog } from '../types';

interface MapTabProps {
  discoveries: Discovery[];
  onOpenRegistry: () => void;
  presetCoordinates: { lat: number; lng: number };
  setPresetCoordinates: (coords: { lat: number; lng: number }) => void;
  sectorStrength: number;
  mapBackgroundIndex: number;
  telemetryLogs: string[];
  onAddTelemetryLog: (text: string) => void;
}

export default function MapTab({
  discoveries,
  onOpenRegistry,
  presetCoordinates,
  setPresetCoordinates,
  sectorStrength,
  mapBackgroundIndex,
  telemetryLogs,
  onAddTelemetryLog,
}: MapTabProps) {
  // Map dimensions and simulation values
  const [mapZoom, setMapZoom] = useState(1.25);
  const [activeCursorLat, setActiveCursorLat] = useState(-23.5505);
  const [activeCursorLng, setActiveCursorLng] = useState(-46.6333);
  const [lockedCoords, setLockedCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  // Track hovered markers
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);

  // References to handle mouse move calculations
  const mapRef = useRef<HTMLDivElement>(null);

  // Background map URLs based on setting index
  const mapBackgrounds = [
    // Standard city satellite grid matching screenshot 1
    "https://lh3.googleusercontent.com/aida/AP1WRLs2KNTLzqyDBBZz83e6r1U6WytZzsWCaWXPw8enWbxvZHEKwQv6nFS4081L2dre4ka_OrhwKOMmaXma1qSp9XZRgcMj0OCAmkkc0zbIJpodRhRFRczn3__XQabLg4tliCVkovwLaNltbrtDmczLAYv2EmZtVEGLPBaZZrpBCfTCZGcUKKts4GX2Xptb077yw-YEG4JGc_0Sa89S_414OoKKFWAFwg0UyZopTLOgzqnhbZT4-gJ1BOExoQ",
    // Extreme high-contrast grey satellite
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCMzHAf6EhYYA7a05k-myLVmA3jMlbDj4QRUEX0bMs_jwKib8QXGWwWwuIhmEKX9hXnsVlW_sUwk1r8GMECFlRZtblWs4Y-szUjk8EmspEmz2AZDUDlyHSdVLYKHLaxa9jAjWL0a7V9QMkMNMcUB2S880PAUC0og04od1tWldg_GLbg9oVZUkflWg5oj7aDNtrUe1XOcJ5kVmy5Q9ZqaPaUwoPeKV_eSz9MzCp4cd_N0ADiVtzoA3KfCEx20HXeV-z1efpaNofEViY",
    // Custom vector data blueprint
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAEqtVNB12WdAL9TdYe66a6Ks0ifBV46GyZQY-lOO6s2TdpuF0bPDuR54hh4Fgna83wFpG6iMZ7mBLJXkGQreAl7xVzTzcCBovzNzUVBkCZ4mWUxP6GXoRduIje2V8t6CkgHghX97Dr0ZH9KGGr0y4cNdbJ6_TChrQZQQ5yCmZjUuv54GfkzfP25D0o3lM1UXhQBAYltKTtKbCHzCCARlWYhDIcJqK63wgpyOSB3VlfO_h5-zdjcvbbzSI7URC58UCsQBERphfD_uw"
  ];

  // Dynamic coordinates calculations based on mouse position inside mapRef
  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map pixel coordinates to simulated Latitude and Longitudes (for Sector 04 / São Paulo coordinates shown in screenshot)
    // LATITUDE: -23.5505 (and around)
    // LONGITUDE: -46.6333 (and around)
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;

    // Range: Lat -23.5100 to -23.5900, Lng -46.5900 to -46.6700
    const calculatedLat = -23.5100 - (normalizedY * 0.0800);
    const calculatedLng = -46.5900 - (normalizedX * 0.0800);

    // Minor telemetry system jitter simulation (+/- 0.0001) for fully immersive military radar feel
    const jitter = (Math.random() - 0.5) * 0.0003;

    setActiveCursorLat(calculatedLat + jitter);
    setActiveCursorLng(calculatedLng + jitter);
  };

  const handleLockPosition = () => {
    const lockedC = { lat: activeCursorLat, lng: activeCursorLng };
    setLockedCoords(lockedC);
    setPresetCoordinates(lockedC);
    onAddTelemetryLog(`> POSITION_LOCK: LAT ${lockedC.lat.toFixed(4)} LNG ${lockedC.lng.toFixed(4)} REGISTERED OK`);
    alert(`CONSOLE: Locked spatial coordinate vector [${lockedC.lat.toFixed(4)}, ${lockedC.lng.toFixed(4)}]. Click 'NEW DISCOVERY' to register.`);
  };

  const handleExportTelemetry = () => {
    const data = `RE_UPLINK Telemetry\nSECTOR: INDUSTRIAL_04\nCOORDINATES: ${activeCursorLat.toFixed(4)}, ${activeCursorLng.toFixed(4)}\nSECTOR_STRENGTH: ${sectorStrength}%\nSTATUS: READY_FOR_SYNC`;
    navigator.clipboard.writeText(data);
    onAddTelemetryLog(`> EXPORT_TELEMETRY: BROADCAST STREAM EXPORTED TO BUFFER`);
    alert("SYSTEM CONFIRMED: Extrapolated telemetry frame copied to clipboard successfully.");
  };

  const handlePresetMapPan = (disc: Discovery) => {
    setActiveCursorLat(disc.coordinates.lat);
    setActiveCursorLng(disc.coordinates.lng);
    onAddTelemetryLog(`> RADAR_PAN: CALIBRATING SENSORS TO TARGET ${disc.name}`);
  };

  return (
    <div className="flex-grow flex relative min-h-[calc(100vh-4rem)] bg-[#121414] overflow-hidden">
      
      {/* 1. Satellite Map Main Workspace */}
      <div 
        ref={mapRef}
        onMouseMove={handleMapMouseMove}
        onClick={(e) => {
          // Allow tapping anywhere to lock position
          const target = e.target as HTMLElement;
          if (target.closest('.no-map-click')) return;
          const lockedC = { lat: activeCursorLat, lng: activeCursorLng };
          setLockedCoords(lockedC);
          setPresetCoordinates(lockedC);
        }}
        className="flex-grow h-[calc(100vh-4rem)] relative select-none overflow-hidden map-container"
      >
        {/* Gritty satellite imagery background */}
        <div 
          className="absolute inset-0 grayscale contrast-[1.25] opacity-60 bg-no-repeat bg-cover bg-center transition-transform duration-300"
          style={{ 
            backgroundImage: `url('${mapBackgrounds[mapBackgroundIndex]}')`,
            transform: `scale(${mapZoom})`,
          }}
        />

        {/* Matrix Technical Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#343737 1px, transparent 1px), linear-gradient(90deg, #343737 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Scanning Sweeper line overlay animation */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff5717]/25 shadow-[0_0_15px_#ff4f00] animate-[scan_8s_linear_infinite] pointer-events-none scanline" />

        {/* Dynamic Map Elements: Active Markers overlay */}
        {/* Preset Marker 1: Concrete Vandal (Mural Alpha) */}
        <div 
          className="absolute top-1/4 left-1/3 group cursor-pointer no-map-click"
          onMouseEnter={() => setHoveredDiscovery(discoveries[0])}
          onMouseLeave={() => setHoveredDiscovery(null)}
          onClick={() => handlePresetMapPan(discoveries[0] || {} as any)}
        >
          <div className="w-4 h-4 bg-[#ff4f00] flex items-center justify-center rotate-45 border border-black shadow-[0_0_10px_#ff4f00]">
            <div className="w-1.5 h-1.5 bg-black"></div>
          </div>
          <div className="absolute left-6 top-0 bg-[#1e2020] border border-[#343737] p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-40">
            <p className="font-mono text-[9px] text-[#ff4f00]">ENTITY_092</p>
            <p className="font-sans text-xs font-bold uppercase text-white">CONCRETE_VANDAL [VORTEX]</p>
          </div>
        </div>

        {/* Preset Marker 2: Aerosol Shadow (Stencil Beta 9) */}
        <div 
          className="absolute bottom-1/3 right-1/4 group cursor-pointer no-map-click"
          onMouseEnter={() => setHoveredDiscovery(discoveries[1])}
          onMouseLeave={() => setHoveredDiscovery(null)}
          onClick={() => handlePresetMapPan(discoveries[1] || {} as any)}
        >
          <div className="w-4 h-4 bg-white flex items-center justify-center rotate-45 border border-black shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            <div className="w-1.5 h-1.5 bg-black"></div>
          </div>
          <div className="absolute left-6 top-0 bg-[#1e2020] border border-[#343737] p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-40">
            <p className="font-mono text-[9px] text-[#c5c7c6]">ENTITY_114</p>
            <p className="font-sans text-xs font-bold uppercase text-white">AEROSOL_SHADOW [PULSE]</p>
          </div>
        </div>

        {/* Custom dynamic locked position marker */}
        {lockedCoords && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            className="pointer-events-none"
          >
            <div className="w-6 h-6 border-2 border-dashed border-[#ff4f00] flex items-center justify-center select-none rotate-45">
              <div className="w-1.5 h-1.5 bg-[#ff4f00]" />
            </div>
          </div>
        )}

        {/* Center Crosshair Decoration hud from Screenshot 1 */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          className="pointer-events-none flex items-center justify-center"
        >
          <div className="w-24 h-24 border-[0.5px] border-[#ff4f00]/30 rounded-full flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 bg-[#ff4f00]" />
            <div className="absolute w-[1px] h-36 bg-[#ff4f00]/15" />
            <div className="absolute h-[1px] w-36 bg-[#ff4f00]/15" />
          </div>
          <div className="absolute -top-14 -left-14 font-mono text-[9px] text-[#ff4f00] tracking-wider whitespace-nowrap">
            SCN_REF: 88-ALPHA
          </div>
          <div className="absolute -bottom-14 -right-14 font-mono text-[9px] text-[#ff4f00] tracking-wider whitespace-nowrap">
            ZOOM: {mapZoom.toFixed(2)}X
          </div>
        </div>

        {/* Dynamic Float-hover marker details inside Map */}
        {hoveredDiscovery && (
          <div className="absolute top-[40%] left-[10%] bg-[#1e2020] border border-[#ff4f00] p-4 shadow-2xl z-40 w-64 max-w-xs font-sans rounded-none no-map-click">
            <div className="flex gap-3">
              <div className="w-14 h-14 border border-[#343737] overflow-hidden shrink-0">
                <img src={hoveredDiscovery.imageUrl} alt={hoveredDiscovery.name} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[8px] text-[#ff4f00] block uppercase">{hoveredDiscovery.type} MARK</span>
                <h4 className="font-bold text-xs uppercase text-white truncate leading-tight">{hoveredDiscovery.name}</h4>
                <p className="font-mono text-[8px] text-[#c5c7c6] mt-1">{hoveredDiscovery.coordinates.formattedLat}</p>
                <span className="inline-block mt-1 font-mono text-[8px] text-[#ff4f00] bg-[#121414] px-1 border border-[#343737]">
                  {hoveredDiscovery.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Live bottom HUD actions inside left area: Telemetry stream and coordinate lock status */}
        <div className="absolute bottom-6 left-6 p-4 w-72 bg-[#1e2020]/90 backdrop-blur-md border border-[#343737] z-10 font-mono no-map-click">
          <p className="text-[10px] text-[#c5c7c6] mb-2 uppercase font-bold tracking-wider">
            Telemetry Stream
          </p>
            <div 
              id="map-telemetry-stream-box"
              className="space-y-1 overflow-hidden h-24 font-mono text-[9px] text-[#ff4f00]/85 scrollbar-thin select-text"
            >
              {telemetryLogs.slice(-7).map((log, idx) => (
                <p key={idx} className="truncate">{log}</p>
              ))}
              <p className="animate-pulse">{">"} WAITING_FOR_INPUT_</p>
            </div>
        </div>

        {/* Bottom zooming hud actions */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-10 no-map-click">
          <button 
            id="btn-map-zoom-in"
            onClick={() => setMapZoom(prev => Math.min(prev + 0.25, 3))}
            className="bg-[#1e2020] border border-[#343737] hover:border-[#ff4f00] p-3 text-white hover:text-[#ff4f00] transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Zoom In (Map)"
          >
            <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: '18px' }}>add</span>
          </button>
          <button 
            id="btn-map-zoom-out"
            onClick={() => setMapZoom(prev => Math.max(prev - 0.25, 0.75))}
            className="bg-[#1e2020] border border-[#343737] hover:border-[#ff4f00] p-3 text-white hover:text-[#ff4f00] transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Zoom Out (Map)"
          >
            <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: '18px' }}>remove</span>
          </button>
          <button 
            id="btn-map-recenter"
            onClick={() => {
              setMapZoom(1.25);
              setActiveCursorLat(-23.5505);
              setActiveCursorLng(-46.6333);
              setLockedCoords(null);
              onAddTelemetryLog(`> RADAR_CALIBRATE: MAP RECENTERED TO BASE ORIGIN_INDEX`);
            }}
            className="bg-[#1e2020] border border-[#343737] hover:border-[#ff4f00] p-3 text-white hover:text-[#ff4f00] transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Recenter Camera Coordinates"
          >
            <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: '18px' }}>my_location</span>
          </button>
        </div>

      </div>

      {/* 2. Right Side Monitor Panel: Location Selector and Detected listings */}
      <div className="w-80 h-[calc(100vh-4rem)] border-l border-[#343737] bg-[#121414] py-6 px-5 flex flex-col gap-4 overflow-y-auto shrink-0 relative z-10 no-map-click">
        
        {/* Card Block A: Location Selector Coordinates */}
        <div className="bg-[#1e2020]/90 border border-[#343737] shadow-xl backdrop-blur-md flex flex-col">
          
          <div className="border-b border-[#343737] px-4 py-3 bg-[#282a2a] flex justify-between items-center select-none font-sans font-bold text-xs uppercase tracking-wide">
            <span className="text-[#e2e2e2]">Location Selector</span>
            <button
              onClick={() => {
                onAddTelemetryLog("> WINDOW_EXPAND: LAUNCHED TELEMETRY MATRIX INSPECTOR");
                alert(`COORDINATES DETECTED:\nLATITUDE: ${activeCursorLat.toFixed(5)}\nLONGITUDE: ${activeCursorLng.toFixed(5)}`);
              }}
              className="text-[#c5c7c6] hover:text-[#ff4f00]"
              title="Expand Coordinates"
            >
              <span className="material-symbols-outlined text-sm">fullscreen</span>
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            
            {/* Latitude and Longitudes Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="bg-[#121414] border border-[#343737] p-2 flex flex-col">
                <span className="text-[9px] text-[#c5c7c6] block mb-1">LATITUDE</span>
                <span id="map-selector-lat-val" className="text-sm font-bold text-[#ff4f00] truncate">
                  {activeCursorLat.toFixed(4)}
                </span>
              </div>
              <div className="bg-[#121414] border border-[#343737] p-2 flex flex-col">
                <span className="text-[9px] text-[#c5c7c6] block mb-1">LONGITUDE</span>
                <span id="map-selector-lng-val" className="text-sm font-bold text-[#ff4f00] truncate">
                  {activeCursorLng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Sector Coverage bar */}
            <div className="space-y-3 font-sans select-none">
              <div className="flex justify-between items-center text-xs font-semibold uppercase">
                <span className="text-[#c5c7c6]">Sector Strength</span>
                <span className="text-white font-mono">{sectorStrength}%</span>
              </div>
              <div className="h-1.5 bg-[#121414] border border-[#343737] overflow-hidden">
                <div 
                  className="h-full bg-[#ff4f00] shadow-[0_0_8px_#ff4f00] transition-all" 
                  style={{ width: `${sectorStrength}%` }}
                />
              </div>
            </div>

            {/* Locked marker indicators if present */}
            {lockedCoords && (
              <div className="bg-[#121414] p-2 border border-[#ff4f00]/30 font-mono text-[9px] text-white flex justify-between items-center select-none uppercase">
                <span>Vector Lock Locked</span>
                <button 
                  onClick={() => setLockedCoords(null)} 
                  className="text-[#ff4f00] hover:text-white underline"
                >
                  Unbind
                </button>
              </div>
            )}

            {/* Lock Coordinate Actions */}
            <div className="space-y-2 select-none mt-1">
              <button
                id="btn-map-lock-position"
                onClick={handleLockPosition}
                className="w-full bg-[#121414] border border-[#ff4f00] text-[#ff4f00] py-2 font-sans font-bold uppercase tracking-widest text-[10px] hover:bg-[#ff4f00]/10 active:scale-95 transition-all cursor-pointer"
              >
                LOCK POSITION
              </button>
              <button
                id="btn-map-export-telemetry"
                onClick={handleExportTelemetry}
                className="w-full bg-[#121414] border border-[#343737] text-[#e2e2e2] py-2 font-sans font-bold uppercase tracking-widest text-[10px] hover:bg-[#282a2a] active:scale-95 transition-all cursor-pointer"
              >
                EXPORT TELEMETRY
              </button>
            </div>

          </div>

          <div className="bg-[#333535] px-4 py-2.5 flex items-center justify-between select-none font-mono text-[9px] text-[#c5c7c6] border-t border-[#343737]">
            <span>STATUS: READY_FOR_SYNC</span>
            <div className="w-1.5 h-1.5 bg-[#ff4f00] rounded-full animate-ping"></div>
          </div>

        </div>

        {/* Card Block B: Active Detected Listings */}
        <div className="bg-[#1e2020]/90 border border-[#343737] shadow-xl backdrop-blur-md flex flex-col flex-grow select-none">
          
          <div className="border-b border-[#343737] px-4 py-2 bg-[#282a2a] flex justify-between items-center font-sans font-bold text-[10px] uppercase tracking-wide">
            <span className="text-[#c5c7c6]">
              Detected Records ({discoveries.length})
            </span>
          </div>

          <div className="divide-y divide-[#343737] overflow-y-auto max-h-[220px] bg-[#121414] scrollbar-thin">
            {discoveries.map((disc, idx) => (
              <div 
                key={disc.id}
                onClick={() => handlePresetMapPan(disc)}
                className="p-3 flex items-center gap-3 hover:bg-[#1e2020] cursor-pointer transition-colors"
              >
                <div className={`w-2 h-2 ${disc.status === 'DEGRADED' ? 'bg-red-500' : 'bg-[#ff4f00]'}`}></div>
                <div className="flex-1 min-w-0 font-mono">
                  <p className="text-xs font-semibold leading-tight text-white truncate">{disc.name}</p>
                  <p className="text-[9px] text-[#c5c7c6] capitalize font-mono">{disc.tag.toLowerCase()} / {disc.type.toLowerCase()}</p>
                </div>
                <span className="material-symbols-outlined text-[#c5c7c6] text-xs">chevron_right</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
