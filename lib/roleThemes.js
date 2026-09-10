export const roleThemes = {
  'cloud-network': {
    id: 'cloud-network',
    label: 'Cloud & Hybrid Network',
    shortLabel: 'Cloud Mesh',
    metaphor: 'transit-mesh',
    palette: {
      bg: '#06090e',
      surface: '#0b121e',
      border: '#162438',
      primary: '#0284c7', // Optic Cyan Blue
      primaryGlow: 'rgba(2, 132, 199, 0.4)',
      accent: '#38bdf8',  // Sky Pulse
      line: '#1e293b',
      text: '#f8fafc',
      muted: '#94a3b8',
      badge: 'bg-sky-950/80 text-sky-400 border-sky-800/60'
    },
    nodeVocabulary: ['Transit Gateway', 'VPC Peering', 'DirectConnect', 'Anycast Edge', 'Route53'],
    statusText: 'MULTI-REGION MESH // OPTICAL FIBER ACTIVE'
  },
  'network-security': {
    id: 'network-security',
    label: 'Network Security',
    shortLabel: 'Zero-Trust',
    metaphor: 'zero-trust',
    palette: {
      bg: '#050a0e',
      surface: '#08141b',
      border: '#112b32',
      primary: '#10b981', // NOC Emerald
      primaryGlow: 'rgba(16, 185, 129, 0.4)',
      accent: '#34d399',  // Mint Wire
      line: '#13282b',
      text: '#f8fafc',
      muted: '#86efac',
      badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
    },
    nodeVocabulary: ['Stateful Firewall', 'Zero-Trust Proxy', 'IPSec Tunnel', 'DDoS Shield', 'Microsegmentation'],
    statusText: 'CRYPTO ENCLAVE // ZERO-TRUST INSPECTION 100%'
  },
  'enterprise-core': {
    id: 'enterprise-core',
    label: 'Enterprise Core & Routing',
    shortLabel: 'Spine-Leaf',
    metaphor: 'spine-leaf',
    palette: {
      bg: '#070a0f',
      surface: '#121820',
      border: '#262f3d',
      primary: '#d97706', // Console Amber
      primaryGlow: 'rgba(217, 119, 6, 0.4)',
      accent: '#f59e0b',  // Pulse Gold
      line: '#283344',
      text: '#f8fafc',
      muted: '#cbd5e1',
      badge: 'bg-amber-950/80 text-amber-400 border-amber-800/60'
    },
    nodeVocabulary: ['BGP Spine', 'Nexus Leaf', 'OSPF Area 0', 'Multi-Chassis LAG', 'SD-WAN Core'],
    statusText: 'BGP PEERING SYNCED // LOW LATENCY SUB-MS'
  },
  'telemetry-ops': {
    id: 'telemetry-ops',
    label: 'Network Ops & Telemetry',
    shortLabel: 'NetOps NOC',
    metaphor: 'telemetry-pulse',
    palette: {
      bg: '#04070c',
      surface: '#0c1322',
      border: '#172744',
      primary: '#2563eb', // Signal Cobalt Blue
      primaryGlow: 'rgba(37, 99, 235, 0.4)',
      accent: '#10b981',  // Live Green
      line: '#1c2e50',
      text: '#f8fafc',
      muted: '#93c5fd',
      badge: 'bg-blue-950/80 text-blue-400 border-blue-800/60'
    },
    nodeVocabulary: ['NetFlow Collector', 'SNMP Traps', 'Jitter Monitor', 'Interface Poller', 'Syslog War-Room'],
    statusText: 'PORT MONITOR 100G // LOSS: 0.000% // UPTIME: 99.999%'
  }
};

export const defaultThemeKey = 'cloud-network';
