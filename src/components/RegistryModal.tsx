import React, { useState, useEffect } from 'react';
import { Discovery } from '../types';

interface RegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDiscovery: Omit<Discovery, 'id' | 'verified' | 'date'>) => void;
  presetCoordinates?: { lat: number; lng: number };
}

export default function RegistryModal({
  isOpen,
  onClose,
  onSubmit,
  presetCoordinates,
}: RegistryModalProps) {
  // Coordinates (either preset from map or standard defaults)
  const [latValue, setLatValue] = useState('');
  const [lngValue, setLngValue] = useState('');
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'MURAL' | 'KINETIC' | 'STENCIL' | 'LIGHT_SCULPTURE' | 'STRUCTURAL'>('MURAL');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'STABLE' | 'ACTIVE' | 'DEGRADED'>('STABLE');
  const [currentTimeStr, setCurrentTimeStr] = useState('12:45:01');
  const [isTransmitting, setIsTransmitting] = useState(false);

  // File/image uploading local state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Preset default sample urban artwork choices to simulate camera uploads easily
  const presetEvidences = [
    {
      name: "Geometric Vandalism #1",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEqtVNB12WdAL9TdYe66a6Ks0ifBV46GyZQY-lOO6s2TdpuF0bPDuR54hh4Fgna83wFpG6iMZ7mBLJXkGQreAl7xVzTzcCBovzNzUVBkCZ4mWUxP6GXoRduIje2V8t6CkgHghX97Dr0ZH9KGGr0y4cNdbJ6_TChrQZQQ5yCmZjUuv54GfkzfP25D0o3lM1UXhQBAYltKTtKbCHzCCARlWYhDIcJqK63wgpyOSB3VlfO_h5-zdjcvbbzSI7URC58UCsQBERphfD_uw",
    },
    {
      name: "Light Projections",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo1DWRzhdjz8X9k1HHz11qcX32N4CaDgWdtN4Cc4gLr_n4KbDfATf_HpxstHf1eLXmrrU9zFppaCGInd54IS4QKJzShtSbumnT0_ZoUEplL3a00wUCeZdccZPm_IWPChFnJF0oj6fDhuFd1zYH1yONYU46L0ipjSMGWzNSgCnsYAZgI4HeJrjxlmSl0h1AIrQJWaUAtu7B9B-cfstsyDsP4QeGq8KHgDY1jZI11ZCQUJsu4xdvUIg4s1dUCHO3DGxndAhTiM5nEvw",
    },
    {
      name: "Rusted Girder spray",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFB_bzyumsK7ZC4FtS0YoFeI4XtEF_Kxtqm-8ZUGRloRVX7-fT8UmrXjDetDRR7yDB7WKGRmICxsqjCgVqCfByBlEBqUP7EMvz3gLn1u0fhaIO0udu10SbnaygKAK4_TZOBKue6R17G9RzMwQgmOy8lLZbMGTprQzPOoMlWupKcGEFLaEnWT_VmsveFDzMOnujkoTvFlqNrJd1JUuBnOlN_o5qgXZ2Tj98MkLZ-99GMUjfy-SVIm84iUhBi968wqBDD3ovfn8kf-o",
    }
  ];

  // Set real coordinates when preset changes
  useEffect(() => {
    if (presetCoordinates) {
      setLatValue(presetCoordinates.lat.toFixed(4));
      setLngValue(presetCoordinates.lng.toFixed(4));
    } else {
      setLatValue('-23.5505');
      setLngValue('-46.6333');
    }
  }, [presetCoordinates, isOpen]);

  // Handle local clock tick
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const s = d.getHours().toString().padStart(2, '0') + ':' +
                d.getMinutes().toString().padStart(2, '0') + ':' +
                d.getSeconds().toString().padStart(2, '0');
      setCurrentTimeStr(s);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  // Handle fake drop or file click
  const triggerFakeUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Pick a random gorgeous preset evidence url
          const picked = presetEvidences[Math.floor(Math.random() * presetEvidences.length)];
          setUploadedImage(picked.url);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    triggerFakeUpload();
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim()) {
      alert("REQUIRED FIELD: Please identify a target Artist Tag / Originator.");
      return;
    }
    if (!name.trim()) {
      alert("REQUIRED FIELD: Please designate a Discovery Name (e.g., NEBULA_9).");
      return;
    }

    const finalLat = parseFloat(latValue) || -23.5505;
    const finalLng = parseFloat(lngValue) || -46.6333;

    setIsTransmitting(true);

    setTimeout(() => {
      onSubmit({
        name: name.toUpperCase().replace(/\s+/g, '_'),
        tag: tag.toUpperCase().replace(/\s+/g, '_'),
        coordinates: {
          lat: finalLat,
          lng: finalLng,
          formattedLat: `${Math.abs(finalLat).toFixed(4)}° ${finalLat >= 0 ? 'N' : 'S'}`,
          formattedLng: `${Math.abs(finalLng).toFixed(4)}° ${finalLng >= 0 ? 'E' : 'W'}`
        },
        sector: presetCoordinates ? "SECTOR_04" : "NE_INDUSTRIAL_04",
        type,
        status,
        imageUrl: uploadedImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAEqtVNB12WdAL9TdYe66a6Ks0ifBV46GyZQY-lOO6s2TdpuF0bPDuR54hh4Fgna83wFpG6iMZ7mBLJXkGQreAl7xVzTzcCBovzNzUVBkCZ4mWUxP6GXoRduIje2V8t6CkgHghX97Dr0ZH9KGGr0y4cNdbJ6_TChrQZQQ5yCmZjUuv54GfkzfP25D0o3lM1UXhQBAYltKTtKbCHzCCARlWYhDIcJqK63wgpyOSB3VlfO_h5-zdjcvbbzSI7URC58UCsQBERphfD_uw",
        description: description || `Decoded Vector Mark found at coordinates ${finalLat}, ${finalLng} during standard sector inspection.`
      });
      setIsTransmitting(false);
      // Reset state for next open
      setName('');
      setTag('');
      setDescription('');
      setUploadedImage(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Registry card block */}
      <section className="relative w-full max-w-lg bg-[#282a2a] border border-[#ff4f00]/30 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Scanning laser visual decoration */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ff4f00]/30 shadow-[0_0_12px_#ff4f00] pointer-events-none scanline"></div>

        {/* Modal Header */}
        <div className="border-b border-[#343737] p-5 flex justify-between items-center bg-[#333535]">
          <div>
            <h2 className="font-sans text-lg font-extrabold text-[#ff4f00] tracking-tight uppercase">
              REGISTRY_04
            </h2>
            <span className="font-mono text-[10px] text-[#b3b5b5] tracking-wider uppercase">
              STATUS: PENDING_VERIFICATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#c5c7c6] hover:text-[#ff4f00] transition-colors p-1"
            title="Cancel Transmission"
          >
            <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmitForm} className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-grow">
          
          {/* Coordinates Confirmation */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold text-[#ff4f00] uppercase flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
              Coordinate Confirmation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1c1c] border border-[#343737] p-3 flex flex-col">
                <span className="font-mono text-[9px] text-[#c5c7c6] uppercase">LATITUDE</span>
                <input
                  type="text"
                  required
                  value={latValue}
                  onChange={(e) => setLatValue(e.target.value)}
                  className="bg-transparent border-0 font-mono text-sm text-[#e2e2e2] p-0 focus:ring-0 focus:outline-none w-full"
                />
              </div>
              <div className="bg-[#1a1c1c] border border-[#343737] p-3 flex flex-col">
                <span className="font-mono text-[9px] text-[#c5c7c6] uppercase">LONGITUDE</span>
                <input
                  type="text"
                  required
                  value={lngValue}
                  onChange={(e) => setLngValue(e.target.value)}
                  className="bg-transparent border-0 font-mono text-sm text-[#e2e2e2] p-0 focus:ring-0 focus:outline-none w-full"
                />
              </div>
            </div>
            <p className="text-[10px] font-mono text-[#b3b5b5] italic">
              Note: Location extrapolated from active sector grid. Modify values if necessary.
            </p>
          </div>

          {/* Discovery Metadata Name and TYPE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-sans text-xs font-bold text-[#b3b5b5] uppercase block">
                Discovery Label
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MURAL_ALPHA"
                className="w-full bg-[#1a1c1c] border border-[#343737] text-white py-2 px-3 focus:outline-none focus:border-[#ff4f00] font-mono text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-xs font-bold text-[#b3b5b5] uppercase block">
                Element Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#1a1c1c] border border-[#343737] text-white py-2 px-3 focus:outline-none focus:border-[#ff4f00] font-mono text-xs"
              >
                <option value="MURAL">MURAL (PAINT)</option>
                <option value="KINETIC">KINETIC (PROJECTION)</option>
                <option value="STENCIL">STENCIL / SPRAY</option>
                <option value="LIGHT_SCULPTURE">LIGHT_SCULPTURE</option>
                <option value="STRUCTURAL">STRUCTURAL (STEEL)</option>
              </select>
            </div>
          </div>

          {/* Direct File drop / click uploading Simulator */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold text-[#ff4f00] uppercase flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>upload_file</span>
              Upload Visual Evidence
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFakeUpload}
              className="border-2 border-dashed border-[#343737] hover:border-[#ff4f00] bg-[#0d0f0f] h-40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group p-4 text-center select-none"
            >
              {isUploading ? (
                <div className="space-y-2 w-full max-w-[240px]">
                  <span className="font-mono text-[10px] text-[#ff4f00] uppercase animate-pulse block">
                    TRANSMITTING FILE EVIDENCE... {uploadProgress}%
                  </span>
                  <div className="h-1 bg-[#1a1c1c] w-full overflow-hidden">
                    <div className="h-full bg-[#ff4f00] transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              ) : uploadedImage ? (
                <div className="flex items-center gap-4 w-full h-full justify-center">
                  <div className="w-24 h-24 border border-[#ff4f00]/40 p-1 bg-[#1a1c1c] relative shrink-0">
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover grayscale" />
                    <div className="absolute inset-0 bg-[#ff4f00]/10"></div>
                  </div>
                  <div className="text-left font-mono">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">{">"} ENCRYPTED_ATTACHMENT_OK</p>
                    <p className="text-[9px] text-[#c5c7c6] mt-1">2.4 MB (READY FOR SYNC)</p>
                    <span className="text-[9px] text-[#ff4f00] underline hover:text-white block mt-2">TAP TO CHANGE</span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[#c5c7c6] group-hover:text-[#ff4f00] transition-colors text-3xl">
                    cloud_upload
                  </span>
                  <div>
                    <p className="font-sans font-bold text-xs text-[#e2e2e2] uppercase">DRAG_DROP_IMAGES</p>
                    <p className="font-mono text-[10px] text-[#c5c7c6] tracking-wider mt-1">
                      OR CLICK TO BROWSE CAMERA FILES
                    </p>
                  </div>
                  <p className="text-[9px] text-[#c5c7c6]/50 uppercase mt-1">
                    MAXIMUM TRANS-SIZE: 25MB (PNG, JPG, RAW)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Artist Tag Input */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-[#ff4f00] uppercase flex justify-between tracking-wide">
              <span>Artist Tag</span>
              <span className="text-[#c13700] text-[9px] font-mono">REQ_FIELD</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="IDENTIFY_ORIGINATOR..."
                className="w-full bg-[#1a1c1c] border border-[#343737] focus:border-[#ff4f00] focus:ring-1 focus:ring-[#ff4f00] py-2 px-3 text-white font-mono text-xs uppercase"
              />
            </div>
          </div>

          {/* Decryption description details */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-[#b3b5b5] uppercase block">
              Field Observations
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Weathering levels severe. Heavy aerosol layers over iron frameworks..."
              rows={2}
              className="w-full bg-[#1a1c1c] border border-[#343737] focus:border-[#ff4f00] focus:ring-1 focus:ring-[#ff4f00] py-2 px-3 text-white font-mono text-xs"
            />
          </div>

          {/* Transmitter submission button */}
          <div className="pt-2">
            <button
              id="btn-modal-transmit-archive"
              type="submit"
              disabled={isTransmitting}
              className="w-full bg-[#ff5717] hover:bg-[#ff4f00] text-black py-3.5 font-sans font-extrabold flex items-center justify-center gap-2 group transition-all active:scale-[0.98] border border-transparent hover:border-white/20 select-none cursor-pointer"
            >
              {isTransmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>sync</span>
                  <span className="font-sans text-xs uppercase tracking-widest">TRANSMITTING OVER LINK...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>inventory</span>
                  <span className="font-sans text-xs uppercase tracking-widest text-[#121414]">ARCHIVE DISCOVERY</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>
                    chevron_right
                  </span>
                </>
              )}
            </button>

            <div className="flex justify-between mt-2.5 px-1 font-mono text-[9px] text-[#c5c7c6]">
              <span>UID: 0x442_F29_A</span>
              <span>TIME: <span>{currentTimeStr}</span></span>
            </div>
          </div>
        </form>

        {/* Modal Panel Footer status info */}
        <div className="p-4 border-t border-[#343737] bg-[#1e2020] flex items-center justify-between text-mono text-[9px] text-[#c5c7c6] select-none">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#ff4f00] rounded-full animate-pulse"></div>
              <span>SECURE UPLINK</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px] text-[#c5c7c6]">encrypted</span>
              <span>AES-256</span>
            </div>
          </div>
          <span>V.4.2.0-STABLE</span>
        </div>

      </section>
    </div>
  );
}
