import React, { useState, useEffect } from 'react';
import { Operator, Discovery } from '../types';

interface ProfileTabProps {
  operator: Operator;
  setOperator: React.Dispatch<React.SetStateAction<Operator>>;
  discoveries: Discovery[];
}

export default function ProfileTab({
  operator,
  setOperator,
  discoveries,
}: ProfileTabProps) {
  // Login form state
  const [uniqueTag, setUniqueTag] = useState(operator.loggedIn ? operator.id : 'Unit_8829');
  const [phoneOrEmail, setPhoneOrEmail] = useState(operator.loggedIn ? operator.emailOrPhone : 'operator_04@uplink.net');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Custom terminal state for the login screen
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "> BOOT_SEQ: INITIALIZING...",
    "> AUTH_MODULE: STANDBY",
    "> NETWORK_ENCRYPTION: 256-BIT_AES_LOADED_STABLE"
  ]);

  // Handle periodic terminal log additions
  useEffect(() => {
    if (operator.loggedIn) return;
    
    const terminalTexts = [
      "> SIGNAL_STRENGTH: NOMINAL (98%)",
      "> FIREWALL_ACTIVE: INTRUSION_DETECTION_ENGAGED",
      "> ENCRYPTING_PACKETS: SHA-512 ACTIVE",
      "> GEO_LOCK_ENGAGED: NE_INDUSTRIAL_SECTOR_04",
      "> WAITING_FOR_OPERATOR_CREDENTIALS_",
      "> ENCRYPTED SECURE UPLINK ESTABLISHED",
      "> CACHE STATUS: SYNC_READY"
    ];

    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const nextLog = terminalTexts[Math.floor(Math.random() * terminalTexts.length)];
        // Keep logs size tidy
        const updated = [...prev, nextLog];
        if (updated.length > 5) {
          updated.shift();
        }
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [operator.loggedIn]);

  const handleEstablishLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueTag.trim()) {
      alert("CRITICAL ERROR: Unique Operator Tag is Required.");
      return;
    }

    setIsConnecting(true);
    
    // Simulate high tech connection
    setTimeout(() => {
      setOperator({
        id: uniqueTag,
        name: uniqueTag.toUpperCase(),
        emailOrPhone: phoneOrEmail || "operator_gen_04@uplink.net",
        role: uniqueTag.toLowerCase().includes('agent') ? 'Authorized Field Agent' : 'Territory Operations Lead',
        avatarUrl: uniqueTag.toLowerCase().includes('agent')
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAXZT3LVpFhAKfbaynqhHINcHwbNy1O-UHhrrDDJHZt55LK5UBOiqNEz1XebIDVRet2AWzjtf2WfcICuwpiVTiaHJ5ft3hN4V-L1gLVy2Ci5U9KeekY2SZ6dfG35zDaN_axfBGLaM35oPtysFQn1TLIUJDHTaaeTG3xSalbEdnICI2teOdya_fz-l96AA3pCEltWlDW97ALqBES-1RJ85BK5yo77Qkuw0oSgn1D9uIrUl4ugQhLLt12KI34vyMJi4aJsqrNjBSztYs"
          : "https://lh3.googleusercontent.com/aida-public/AB6AXuCtBh7F39wsaBVRHtkd_kp7bmpSDPNGpE4464CCoqJ8yXTPTa1sNNxoQXHgJZ1fGv8U-Zat3K0Stvz5who4qTE7TpTnNXRUI3QExxVnf47Qp2hkTQa1Vnyh4UEwpnJdSlokgshJtiE-SSuc5ZzSrggsh81-iPFDe0JjYXDtibRDivmbS6x2rarOJW5qiF2lZ6DmKsOkvE8sTFoOZwiMGNQ8-XPK44roKvkiE8bXJKnFKrYv-PCl9gsg-2U0P7M6KgVFPYAcsNtifmg",
        loggedIn: true
      });
      setIsConnecting(false);
    }, 1200);
  };

  const handleDisconnect = () => {
    setOperator(prev => ({
      ...prev,
      loggedIn: false
    }));
  };

  // Profile Dashboard for logged-in operators
  if (operator.loggedIn) {
    // Count discoveries uploaded by this operator or generic stats
    const verifiedCount = discoveries.filter(d => d.verified).length;
    const stableCount = discoveries.filter(d => d.status === 'STABLE').length;

    return (
      <div className="flex-grow p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="font-extrabold text-[#ff4f00] text-2xl uppercase tracking-tighter font-sans">
              OPERATOR PROFILES & STATUS
            </h2>
            <p className="text-xs font-mono text-[#c5c7c6] tracking-wider mt-1 uppercase">
              Current Uplink Metadata | SECURE_STABLE_NODE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Operator Card */}
            <div className="md:col-span-1 bg-[#1e2020] border border-[#343737] p-6 flex flex-col items-center text-center relative">
              <div className="absolute top-4 left-4 bg-emerald-950/30 border border-emerald-500/30 px-2 py-0.5 font-mono text-[9px] text-emerald-400">
                STABLE
              </div>
              <div className="w-28 h-28 border-2 border-[#ff4f00] p-1 bg-[#121414] mt-4 mb-4 overflow-hidden relative">
                <img
                  src={operator.avatarUrl}
                  alt={operator.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-[#ff4f00]/5 pointer-events-none"></div>
              </div>
              <h3 className="font-sans text-lg font-bold text-white tracking-tight uppercase">
                {operator.name}
              </h3>
              <p className="font-mono text-xs text-[#ff4f00] uppercase mt-1">
                {operator.role}
              </p>
              <p className="font-mono text-[10px] text-[#c5c7c6] mt-3 bg-[#121414] px-3 py-1 border border-[#343737] w-full truncate">
                {operator.emailOrPhone}
              </p>

              <button
                onClick={handleDisconnect}
                className="w-full mt-6 bg-[#121414] border border-red-500/40 text-red-400 font-mono text-xs py-2 hover:bg-red-500/10 transition-all uppercase tracking-wider"
              >
                De-authorize Uplink
              </button>
            </div>

            {/* General Stats Card */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#1e2020] border border-[#343737] p-6">
                <h4 className="font-sans text-sm font-semibold uppercase text-white border-b border-[#343737] pb-2 mb-4 tracking-wider">
                  TELEMETRY CONTRIBUTIONS
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#121414] border border-[#343737] p-4 text-center">
                    <span className="font-mono text-[9px] text-[#c5c7c6] block uppercase">SECTOR ENTITIES</span>
                    <span className="font-sans text-3xl font-extrabold text-[#ff4f00] mt-1 block">
                      {discoveries.length}
                    </span>
                  </div>
                  <div className="bg-[#121414] border border-[#343737] p-4 text-center">
                    <span className="font-mono text-[9px] text-[#c5c7c6] block uppercase">VERIFIED LOGS</span>
                    <span className="font-sans text-3xl font-extrabold text-white mt-1 block">
                      {verifiedCount}
                    </span>
                  </div>
                  <div className="bg-[#121414] border border-[#343737] p-4 text-center">
                    <span className="font-mono text-[9px] text-[#c5c7c6] block uppercase">STABLE SECTORS</span>
                    <span className="font-sans text-3xl font-extrabold text-emerald-400 mt-1 block">
                      {stableCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terminal feed simulation */}
              <div className="bg-[#1a1c1c] border border-[#343737] p-6">
                <h4 className="font-sans text-sm font-semibold uppercase text-[#ff4f00] mb-3 tracking-wider">
                  OPERATOR_ACTIVITY_LOGS
                </h4>
                <div className="bg-[#121414] p-4 rounded-none border border-[#343737] font-mono text-xs text-[#c5c7c6] space-y-2 h-44 overflow-y-auto">
                  <p className="text-emerald-400">{">"} [23:14:02] INITIALIZATION HANDSHAKE GRANTED FOR NODE_{operator.id}</p>
                  <p className="text-[#b3b5b5]">{">"} [23:14:15] RE-SYNCED SECTOR_MAP TILES SUCCESSFULLY</p>
                  <p className="text-[#b3b5b5]">{">"} [23:14:48] FETCHED DISCOVERY ARCHIVE COMPILING {discoveries.length} ENTITIES</p>
                  {discoveries.map((disc, idx) => (
                    <p key={idx} className="text-[#ff4f00]">
                      {">"} [{disc.date}] RENDERED RECORD {disc.name} (UUID: {disc.id.substring(0,6)}) AT {disc.coordinates.formattedLat}
                    </p>
                  ))}
                  <p className="animate-pulse">{">"} [WAITING_FOR_INPUT] CONNECTION STABLE_</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth / Establish Link Screen
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center p-8 relative min-h-[calc(100vh-4rem)] bg-[#121414] industrial-grid overflow-y-auto">
      {/* Dynamic Background Layout Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
        <div className="absolute top-10 left-10 border-l border-t border-[#343737] w-32 h-32"></div>
        <div className="absolute bottom-10 right-10 border-r border-b border-[#343737] w-32 h-32"></div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 font-mono text-[90px] text-[#333535] leading-none">
          MURO
        </div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 font-mono text-[90px] text-[#333535] leading-none">
          LIVRE
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[450px] flex flex-col gap-4">
        
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 hover:scale-105 duration-500 transition-all cursor-pointer">
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLsPfCafWhL3feO9UTyEqj3_z4jfj_fvHcexxcgZ55QEh4jz0hJO2Cq8VKUh0K_oze8HE_BtFqdsntAXNyCHsM3u38NLcQDfa1xGWI6h3eV2828-MDUjPPCyZtdp0ikSs6HpZPUMY2ahHspg3wKylfBSqQhHavSQXnZxAB3cMgR1DcgPwh2z3Qmu6rwWKBcNvumfUi9mXNFk37h8IOtroKCHDKjnQp4Xv_2GUFywa_IWkyS8Vthk8bdF0Q"
              alt="Muro Livre Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          
          <h2 className="font-sans text-2xl font-extrabold text-[#e2e2e2] tracking-tighter uppercase text-center">
            UA_ARCHIVE_CORE
          </h2>
          
          <div className="flex items-center gap-2 mt-1 select-none">
            <span className="w-2 h-2 bg-[#ff5717] rounded-full animate-pulse"></span>
            <p className="font-mono text-[10px] text-[#b3b5b5] tracking-widest uppercase">
              System Protocol: Active
            </p>
          </div>
        </div>

        {/* Login Form Box */}
        <form
          onSubmit={handleEstablishLink}
          className="bg-[#1e2020] border border-[#343737] p-7 flex flex-col gap-5 shadow-2xl rounded-none"
        >
          {/* Unique Tag Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="unique-tag-input" className="font-sans text-xs font-bold text-[#b3b5b5] flex justify-between tracking-wider">
              <span>UNIQUE TAG</span>
              <span className="text-[#ff4f00] text-[9px] font-mono">REQUIRED</span>
            </label>
            <div className="relative">
              <input
                id="unique-tag-input"
                type="text"
                required
                value={uniqueTag}
                onChange={(e) => setUniqueTag(e.target.value)}
                className="w-full h-10 bg-[#0d0f0f] border border-[#343737] text-white px-4 font-mono text-xs focus:outline-none focus:border-[#ff4f00] transition-all rounded-none placeholder:opacity-30"
                placeholder="OPERATOR_ID_00"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b5b5] text-xs">
                terminal
              </span>
            </div>
          </div>

          {/* Ph / email Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="credentials-input" className="font-sans text-xs font-bold text-[#b3b5b5] tracking-wider">
              PHONE/EMAIL
            </label>
            <div className="relative">
              <input
                id="credentials-input"
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full h-10 bg-[#0d0f0f] border border-[#343737] text-white px-4 font-mono text-xs focus:outline-none focus:border-[#ff4f00] transition-all rounded-none placeholder:opacity-30"
                placeholder="COMM_CHANNEL_ENTRY"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b5b5] text-xs">
                key
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="btn-establish-link"
            type="submit"
            disabled={isConnecting}
            className="w-full h-11 bg-[#ff5717] hover:bg-[#ff4f00] text-black font-sans font-extrabold select-none disabled:bg-[#ff5717]/40 active:scale-95 transition-all text-xs uppercase tracking-widest mt-2 flex items-center justify-center gap-2 border border-transparent hover:border-white/10"
          >
            <span>{isConnecting ? 'LINKING_CORE...' : 'ESTABLISH_LINK'}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
          </button>

          {/* Form Links */}
          <div className="flex justify-between items-center mt-2 font-mono text-[9px] text-[#b3b5b5]">
            <button
              type="button"
              onClick={() => alert("COMMUNICATION SYSTEM: Requesting credential fallback protocols. Standby for backup OTP verification...")}
              className="hover:text-[#ff4f00] transition-colors"
            >
              FORGOT_CREDENTIALS?
            </button>
            <button
              type="button"
              onClick={() => alert("COMMUNICATION SYSTEM: Broadcast request transmitted to Sector Administrators for access expansion key.")}
              className="hover:text-[#ff4f00] transition-colors"
            >
              REQUEST_ACCESS
            </button>
          </div>
        </form>

        {/* Console logs decorator below form */}
        <div className="bg-[#1a1c1c] border border-[#343737] p-4 select-none">
          <div className="font-mono text-[9px] text-[#b3b5b5] leading-relaxed opacity-70">
            {terminalLogs.map((log, idx) => (
              <p key={idx}>{log}</p>
            ))}
            <div className="flex items-center gap-1 mt-0.5">
              <span>&gt; CURSOR_STATUS:</span>
              <span className="w-1.5 h-3 bg-[#ff4f00] animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Footer info decorator */}
        <div className="mt-4 flex justify-between items-end text-right font-mono text-[9px] text-[#b3b5b5] select-none">
          <div className="text-left leading-normal">
            <span className="text-[#ff4f00] block">LOCATION: SECTOR_04</span>
            <span>LAT: 23.5505° S, LONG: 46.6333° W</span>
          </div>
          <div className="leading-normal">
            <span className="block opacity-60">REMOTE ARCHIVE SYSTEM</span>
            <span className="text-[#ff4f00] font-bold border border-[#343737] px-2 py-0.5 mt-1 inline-block bg-[#1e2020]">
              SYSTEM_V_2.0.4_REMOTE_ACCESS
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
