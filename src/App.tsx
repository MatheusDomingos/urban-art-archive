import React, { useState, useEffect } from 'react';
import { Discovery, Operator } from './types';
import { INITIAL_DISCOVERIES } from './data/discoveries';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapTab from './components/MapTab';
import ArchiveTab from './components/ArchiveTab';
import ProfileTab from './components/ProfileTab';
import SettingsTab from './components/SettingsTab';
import RegistryModal from './components/RegistryModal';

export default function App() {
  // Navigation states
  const [currentTab, setCurrentTab] = useState<string>('map');
  const [activeHeaderNav, setActiveHeaderNav] = useState<'SECTOR_MAP' | 'LIVE_FEED'>('SECTOR_MAP');
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage state initialization for discoveries
  const [discoveries, setDiscoveries] = useState<Discovery[]>(() => {
    try {
      const saved = localStorage.getItem('ua_discoveries');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Local storage read error", e);
    }
    return INITIAL_DISCOVERIES;
  });

  // Save discoveries to local storage
  useEffect(() => {
    localStorage.setItem('ua_discoveries', JSON.stringify(discoveries));
  }, [discoveries]);

  // Registry modal open/close toggle
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [presetCoordinates, setPresetCoordinates] = useState<{ lat: number; lng: number }>({
    lat: -23.5505,
    lng: -46.6333
  });

  // Operator identification states
  const [operator, setOperator] = useState<Operator>(() => {
    try {
      const savedUser = localStorage.getItem('ua_operator');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {}
    return {
      id: "Unit_8829",
      name: "Unit_8829",
      role: "Territory Operations Lead",
      emailOrPhone: "operator_04@uplink.net",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtBh7F39wsaBVRHtkd_kp7bmpSDPNGpE4464CCoqJ8yXTPTa1sNNxoQXHgJZ1fGv8U-Zat3K0Stvz5who4qTE7TpTnNXRUI3QExxVnf47Qp2hkTQa1Vnyh4UEwpnJdSlokgshJtiE-SSuc5ZzSrggsh81-iPFDe0JjYXDtibRDivmbS6x2rarOJW5qiF2lZ6DmKsOkvE8sTFoOZwiMGNQ8-XPK44roKvkiE8bXJKnFKrYv-PCl9gsg-2U0P7M6KgVFPYAcsNtifmg",
      loggedIn: true
    };
  });

  useEffect(() => {
    localStorage.setItem('ua_operator', JSON.stringify(operator));
  }, [operator]);

  // Calibration settings states
  const [sectorStrength, setSectorStrength] = useState(88);
  const [scanlineActive, setScanlineActive] = useState(true);
  const [mapBackgroundIndex, setMapBackgroundIndex] = useState(0);

  // Live telemetry logs stream
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "> REQUEST_MAP_TILES: 200 OK",
    "> FETCHING_ARCHIVE_DATA...",
    "> SYNCING_SECTOR_04_MARKERS",
    "> DETECTING_URBAN_ANOMALIES",
    "> STANDBY FOR COORDINATE POSITION LOCK_"
  ]);

  const addTelemetryLog = (text: string) => {
    setTelemetryLogs(prev => {
      const nextLogs = [...prev, text];
      // Bound size to keep screen tidy
      if (nextLogs.length > 25) {
        nextLogs.shift();
      }
      return nextLogs;
    });
  };

  // Automated simulated logs updating periodically over time
  useEffect(() => {
    const stream = [
      "> SIGNAL_STRENGTH_NOMINAL (98%)",
      "> CACHE_REFRESH_COMPLETE: DECRYPT_OK",
      "> PROTOCOL_HANDSHAKE: ACTIVE",
      "> LOADING SECTOR OVERLAYS SUCCESSFULLY",
      "> TELEMETRY DUPLEX CHANNEL STABLE",
      "> WARNING: SLIGHT COMPASS DRIFT AT CORRIDOR 12",
      "> PARALLAX CORRECTION ESTABLISHED",
      "> CACHED GEOMETRIC INTERVENTIONS SYNCED"
    ];

    const t = setInterval(() => {
      const chosen = stream[Math.floor(Math.random() * stream.length)];
      addTelemetryLog(chosen);
    }, 15000); // 15 seconds ticker

    return () => clearInterval(t);
  }, []);

  // Registry addition callback
  const handleRegisterDiscovery = (newDisc: Omit<Discovery, 'id' | 'verified' | 'date'>) => {
    const idPrefix = `UA-${Math.floor(1000 + Math.random() * 9000)}-${['X', 'Y', 'Z', 'Q', 'M'][Math.floor(Math.random() * 5)]}`;
    
    const formattedDate = () => {
      const d = new Date();
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${d.getDate()}.${months[d.getMonth()]}.${d.getFullYear().toString().substring(2)}`;
    };

    const finalDiscovery: Discovery = {
      ...newDisc,
      id: idPrefix,
      verified: true,
      date: formattedDate()
    };

    setDiscoveries(prev => [finalDiscovery, ...prev]);
    addTelemetryLog(`> TRANS_UPLOAD: TRANSMITTED ELEMENT ID #${idPrefix} FOR MARK [${newDisc.name}]`);
    addTelemetryLog(`> TRANS_SYNC: ELEMENT WRITTEN TO LOCAL TERRITORY GRID SUCCESSFULLY`);
    
    alert(`ELEMENT SECURED: Transmitted Vector ID #${idPrefix} successfully synced to Industrial Sector 04 database.`);
  };

  const handleClearDiscoveries = () => {
    if (window.confirm("PURGE CONFIRMATION:\nAre you absolutely sure you want to clear all discoveries from this local terminal caching partition?")) {
      setDiscoveries([]);
      addTelemetryLog("> PURGE: DISCOVERY METRIC PARTITIONS WIPED CLEAN");
    }
  };

  const handleResetDiscoveries = () => {
    setDiscoveries(INITIAL_DISCOVERIES);
    addTelemetryLog("> RE-SEED: LOCAL REGISTRY POPULATED WITH 5 ORIGINAL GEOMETRIC TARGETS");
    alert("SYSTEM CALIBRATED: Local database re-seeded with original high-fidelity markers.");
  };

  // Jump from archive list item directly onto the localized map location
  const handleLocateOnMap = (disc: Discovery) => {
    setPresetCoordinates(disc.coordinates);
    setCurrentTab('map');
    setActiveHeaderNav('SECTOR_MAP');
    addTelemetryLog(`> LOCALIZED_LOCK: BOUND GPS CAMERA POSITION TO ENCRYPTED VECTOR ${disc.name}`);
  };

  // Filter discoveries globally based on SearchQuery from top header
  const globallyFilteredDiscoveries = discoveries.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.tag.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.coordinates.formattedLat.toLowerCase().includes(q) ||
      d.coordinates.formattedLng.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen text-[#e2e2e2] bg-[#121414] select-none relative overflow-hidden font-sans">
      
      {/* CRT scanline flicker animation if active under configurations settings */}
      {scanlineActive && <div className="fixed inset-0 pointer-events-none z-50 scanline opacity-75 animate-[pulse_6s_infinite]" />}

      {/* Persistent Left navigation sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onNewDiscoveryClick={() => setIsRegistryOpen(true)}
        operator={operator}
      />

      {/* Main workspace (headers and custom views) */}
      <div className="absolute left-[260px] top-0 right-0 min-h-screen flex flex-col pt-16">
        
        {/* Persistent top bar header */}
        <Header
          operator={operator}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeNav={activeHeaderNav}
          setActiveNav={setActiveHeaderNav}
          onTabChange={setCurrentTab}
        />

        {/* Tab switcher */}
        {currentTab === 'map' && (
          <MapTab
            discoveries={globallyFilteredDiscoveries}
            onOpenRegistry={() => setIsRegistryOpen(true)}
            presetCoordinates={presetCoordinates}
            setPresetCoordinates={setPresetCoordinates}
            sectorStrength={sectorStrength}
            mapBackgroundIndex={mapBackgroundIndex}
            telemetryLogs={telemetryLogs}
            onAddTelemetryLog={addTelemetryLog}
          />
        )}

        {currentTab === 'archive' && (
          <ArchiveTab
            discoveries={globallyFilteredDiscoveries}
            onOpenRegistry={() => setIsRegistryOpen(true)}
            onLocateOnMap={handleLocateOnMap}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            operator={operator}
            setOperator={setOperator}
            discoveries={discoveries}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsTab
            sectorStrength={sectorStrength}
            setSectorStrength={setSectorStrength}
            scanlineActive={scanlineActive}
            setScanlineActive={setScanlineActive}
            onClearDiscoveries={handleClearDiscoveries}
            onResetDiscoveries={handleResetDiscoveries}
            discoveriesCount={discoveries.length}
            mapBackgroundIndex={mapBackgroundIndex}
            setMapBackgroundIndex={setMapBackgroundIndex}
            telemetryLogs={telemetryLogs}
            onAddTelemetryLog={addTelemetryLog}
            onClearTelemetryLogs={() => setTelemetryLogs([])}
          />
        )}

      </div>

      {/* Evidence submission Registry Modal overlay popup */}
      <RegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onSubmit={handleRegisterDiscovery}
        presetCoordinates={presetCoordinates}
      />

    </div>
  );
}
