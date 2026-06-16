export interface Discovery {
  id: string; // e.g. "UA-8829-X"
  name: string; // e.g. "VORTEX_OMEGA"
  tag: string; // artist tag / identify originator
  coordinates: {
    lat: number;
    lng: number;
    formattedLat: string;
    formattedLng: string;
  };
  sector: string; // e.g. "NE_INDUSTRIAL_04"
  type: 'MURAL' | 'KINETIC' | 'STENCIL' | 'LIGHT_SCULPTURE' | 'STRUCTURAL';
  status: 'STABLE' | 'ACTIVE' | 'DEGRADED';
  date: string; // e.g. "12.OCT.2024"
  imageUrl: string;
  imageAlt?: string;
  verified: boolean;
  description?: string;
}

export interface Operator {
  id: string;
  name: string;
  emailOrPhone: string;
  role: string;
  avatarUrl: string;
  loggedIn: boolean;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
