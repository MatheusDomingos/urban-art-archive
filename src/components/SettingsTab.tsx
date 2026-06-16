import React from 'react';
import { Discovery } from '../types';

interface SettingsTabProps {
  sectorStrength: number;
  setSectorStrength: (val: number) => void;
  scanlineActive: boolean;
  setScanlineActive: (val: boolean) => void;
  onClearDiscoveries: () => void;
  onResetDiscoveries: () => void;
  discoveriesCount: number;
  mapBackgroundIndex: number;
  setMapBackgroundIndex: (idx: number) => void;
  telemetryLogs: string[];
  onAddTelemetryLog: (text: string) => void;
  onClearTelemetryLogs: () => void;
}

export default function SettingsTab({
  sectorStrength,
  setSectorStrength,
  scanlineActive,
  setScanlineActive,
  onClearDiscoveries,
  onResetDiscoveries,
  discoveriesCount,
  mapBackgroundIndex,
  setMapBackgroundIndex,
  telemetryLogs,
  onAddTelemetryLog,
  onClearTelemetryLogs,
}: SettingsTabProps) {
  const mapBackgrounds = [
    { name: "METROPOLIS BLACK GRACE" },
    { name: "WARM SAT RADAR (CRITICAL)" },
    { name: "ABSTRACT VECTOR DECRYPT" }
  ];

  const handleTestPing = () => {
    onAddTelemetryLog(`> ECHO RECEIVED: ROUNDTRIP LATENCY 14MS`);
    onAddTelemetryLog(`> SYNC_STATE: COMMENCING LOCAL DATABASE RE-AUTH`);
    alert("SYSTEM DIAGNOSTICS: Network handshakes nominal. Uplink status confirmed OK.");
  };

  return (
    <div className="flex-grow p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div>
          <h2 className="font-extrabold text-[#ff4f00] text-2xl uppercase tracking-tighter">
            CONSOLE_SETTINGS_CORE
          </h2>
          <p className="text-xs font-mono text-[#c5c7c6] tracking-wider mt-1 uppercase">
            Manage Telemetry Parameters & Terminal Feeds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column A: App Configurations */}
          <div className="space-y-6">
            
            {/* Map Theme Panel */}
            <div className="bg-[#1e2020] border border-[#343737] p-6 space-y-4">
              <h3 className="font-sans font-semibold text-sm uppercase text-white border-b border-[#343737] pb-2 text-primary-brand">
                1. Map Radar Skins
              </h3>
              <div className="space-y-2">
                {mapBackgrounds.map((bg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMapBackgroundIndex(idx)}
                    className={`w-full py-2.5 px-4 text-left font-mono text-xs border border-[#343737] flex justify-between items-center transition-colors ${
                      mapBackgroundIndex === idx
                        ? 'bg-[#ff5717]/10 text-[#ff4f00] border-[#ff4f00]'
                        : 'bg-[#121414] hover:bg-[#282a2a] text-[#c5c7c6]'
                    }`}
                  >
                    <span>{bg.name}</span>
                    {mapBackgroundIndex === idx && <span className="w-1.5 h-1.5 bg-[#ff4f00]"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Radar Parameters */}
            <div className="bg-[#1e2020] border border-[#343737] p-6 space-y-4">
              <h3 className="font-sans font-semibold text-sm uppercase text-white border-b border-[#343737] pb-2">
                2. Telemetry Parameters
              </h3>
              
              {/* Sector strength */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs text-[#c5c7c6]">
                  <span>Sector Coverage Intensity</span>
                  <span className="text-[#ff4f00]">{sectorStrength}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={sectorStrength}
                  onChange={(e) => setSectorStrength(parseInt(e.target.value))}
                  className="w-full accent-[#ff4f00] bg-[#121414]"
                />
              </div>

              {/* Scanline active */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-xs text-[#c5c7c6]">Flicker Scanlines</span>
                <button
                  type="button"
                  onClick={() => setScanlineActive(!scanlineActive)}
                  className={`px-4 py-1.5 font-mono text-[10px] uppercase border transition-colors ${
                    scanlineActive
                      ? 'bg-[#ff5717]/10 border-[#ff4f00] text-[#ff4f00]'
                      : 'border-[#343737] text-[#c5c7c6] hover:bg-[#282a2a]'
                  }`}
                >
                  {scanlineActive ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

          </div>

          {/* Column B: Telemetry Database resets */}
          <div className="space-y-6">
            
            {/* Diagnostic Actions */}
            <div className="bg-[#1e2020] border border-[#343737] p-6 space-y-4">
              <h3 className="font-sans font-semibold text-sm uppercase text-white border-b border-[#343737] pb-2">
                3. Transmission Actions
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                <button
                  onClick={handleTestPing}
                  className="w-full bg-[#121414] hover:bg-[#282a2a] py-2 px-3 text-left border border-[#ff4f00]/30 text-[#ff4f00] flex justify-between items-center transition-all"
                >
                  <span>TEST REMOTE RADAR CONNECTION</span>
                  <span>14ms</span>
                </button>

                <button
                  onClick={onResetDiscoveries}
                  className="w-full bg-[#121414] hover:bg-emerald-950/20 py-2 px-3 text-left border border-emerald-500/40 text-emerald-400 flex justify-between items-center transition-all"
                >
                  <span>SEED DEFAULT SECTOR ARCHIVE</span>
                  <span>5 ITEMS</span>
                </button>

                <button
                  onClick={onClearDiscoveries}
                  className="w-full bg-[#121414] hover:bg-red-950/20 py-2 px-3 text-left border border-red-500/40 text-red-400 flex justify-between items-center transition-all"
                >
                  <span>PURGE LOCAL CACHED ARCHIVE</span>
                  <span>({discoveriesCount} LOGS)</span>
                </button>
              </div>
            </div>

            {/* Simulated terminal and logger block */}
            <div className="bg-[#1e2020] border border-[#343737] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#343737] pb-2">
                <h3 className="font-sans font-semibold text-sm uppercase text-[#ff4f00] tracking-wider">
                  Live Telemetry Console
                </h3>
                <button
                  onClick={onClearTelemetryLogs}
                  className="font-mono text-[9px] uppercase text-[#c5c7c6] hover:text-white underline cursor-pointer"
                >
                  Clear Feed
                </button>
              </div>
              
              <div className="bg-[#121414] p-4 text-[#ff4f00]/80 h-44 border border-[#343737] font-mono text-[10px] space-y-2 overflow-y-auto">
                {telemetryLogs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {log}
                  </p>
                ))}
                <p className="animate-pulse">{">"} WAITING_FOR_INPUT_</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
