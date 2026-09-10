export const blueprints = [
  {
    id: "nys-its",
    client: "NYS Office of Information Technology Services",
    shortName: "NYS ITS",
    location: "Albany, NY",
    coordinates: "42.6526° N, 73.7562° W",
    role: "Network Engineer",
    timeline: "Oct 2023 – Present",
    tagline: "Statewide Hybrid-Cloud Infrastructure & Mission-Critical Government Services",
    architectureStyle: "Hybrid WAN · Dual-Homed BGP · Multi-Site Failover",
    badge: "STATEWIDE HYBRID WAN",
    metrics: [
      { label: "Uptime Goal", value: "99.999%", sub: "High Availability SLA" },
      { label: "State Agencies", value: "50+ Unified", sub: "Cross-Agency Mesh" },
      { label: "WAN Links", value: "Dual Redundant", sub: "MPLS + DIA BGP Peered" },
      { label: "Failover Time", value: "< 2.4 sec", sub: "BGP MED Fast-Convergence" }
    ],
    zones: [
      { id: 0, title: "CARRIER INGRESS", x: 90 },
      { id: 1, title: "EDGE SECURITY", x: 290 },
      { id: 2, title: "DATACENTER CORE", x: 490 },
      { id: 3, title: "CITIZEN WORKLOADS", x: 690 }
    ],
    nodes: [
      // Zone 0: Carrier Ingress
      { id: "mpls-primary", name: "10G MPLS Primary", sub: "Carrier Trunk A", zone: 0, x: 90, y: 110, layer: "L1 / Edge", ip: "198.51.100.1/30", role: "Primary WAN Circuit", spec: "AS65001 BGP Peered, Weight 200" },
      { id: "dia-backup", name: "10G DIA Secondary", sub: "Carrier Trunk B", zone: 0, x: 90, y: 225, layer: "L1 / Edge", ip: "203.0.113.1/30", role: "Direct Internet Backup", spec: "AS65002 BGP Peered, Weight 100" },
      { id: "regional-pop", name: "Albany/NYC POPs", sub: "State WAN Hubs", zone: 0, x: 90, y: 340, layer: "L1 / Edge", ip: "10.240.0.0/16", role: "Regional Aggregation", spec: "Dual-homed fiber ring with carrier diversity" },
      // Zone 1: Perimeter Security
      { id: "ngfw-01", name: "Palo Alto NGFW-01", sub: "Primary Active", zone: 1, x: 290, y: 120, layer: "L4-L7 / Security", ip: "10.240.1.1", role: "Stateful App-ID Inspection", spec: "Active HA, Threat Prevention, IPsec terminating" },
      { id: "ngfw-02", name: "Palo Alto NGFW-02", sub: "Standby Hot-Sync", zone: 1, x: 290, y: 240, layer: "L4-L7 / Security", ip: "10.240.1.2", role: "HA Standby Engine", spec: "Sub-second HA state table sync & failover" },
      { id: "ztna-gw", name: "Zero-Trust Edge", sub: "Identity Broker", zone: 1, x: 290, y: 345, layer: "L4-L7 / Security", ip: "10.240.5.10", role: "Contextual Access Gateway", spec: "MFA enforcement, TLS 1.3 decryption proxy" },
      // Zone 2: Datacenter Core
      { id: "nexus-vpc-1", name: "Nexus 9336C Core-1", sub: "vPC Primary", zone: 2, x: 490, y: 130, layer: "L2 / Transport", ip: "10.240.10.1", role: "Core Distribution Switch", spec: "OSPF Area 0, VRF: GovNet, MTU 9216" },
      { id: "nexus-vpc-2", name: "Nexus 9336C Core-2", sub: "vPC Peer", zone: 2, x: 490, y: 250, layer: "L2 / Transport", ip: "10.240.10.2", role: "Core Distribution Switch", spec: "100G vPC Peer-Link, Zero packet loss" },
      { id: "vrf-router", name: "GovNet VRF Core", sub: "L3 Isolation", zone: 2, x: 490, y: 345, layer: "L3 / Routing", ip: "10.240.20.1", role: "Multi-Agency VRF Mesh", spec: "MP-BGP EVPN segregation across 50+ departments" },
      // Zone 3: Citizen Workloads
      { id: "ny-gov-portal", name: "NY.gov Citizen Portal", sub: "Public Facing", zone: 3, x: 690, y: 110, layer: "L4-L7 / Security", ip: "172.16.10.0/24", role: "Citizen Web Services", spec: "F5 BIG-IP Load Balanced, Anycast routed" },
      { id: "dmv-hub", name: "DMV Transaction Hub", sub: "Agency Cluster", zone: 3, x: 690, y: 225, layer: "L3 / Routing", ip: "172.16.20.0/24", role: "Real-time Vehicle/ID DB", spec: "Encrypted micro-segmented DB transactions" },
      { id: "agency-enclave", name: "Taxation & Finance", sub: "Isolated VRF", zone: 3, x: 690, y: 340, layer: "L2 / Transport", ip: "172.16.30.0/24", role: "Critical Fiscal Engine", spec: "Strict ACL zero-trust perimeter, audited L3 logs" }
    ],
    links: [
      { source: "mpls-primary", target: "ngfw-01", type: "primary", speed: "10 Gbps", protocol: "BGP AS65001" },
      { source: "dia-backup", target: "ngfw-02", type: "secondary", speed: "10 Gbps", protocol: "BGP AS65002" },
      { source: "regional-pop", target: "ngfw-01", type: "primary", speed: "10 Gbps", protocol: "802.1Q Trunk" },
      { source: "regional-pop", target: "ztna-gw", type: "secondary", speed: "10 Gbps", protocol: "IPsec Tunnel" },
      { source: "ngfw-01", target: "ngfw-02", type: "sync", speed: "40 Gbps", protocol: "HA Heartbeat Sync" },
      { source: "ngfw-01", target: "nexus-vpc-1", type: "core", speed: "40 Gbps", protocol: "OSPF Area 0" },
      { source: "ngfw-02", target: "nexus-vpc-2", type: "core", speed: "40 Gbps", protocol: "OSPF Area 0" },
      { source: "ztna-gw", target: "vrf-router", type: "core", speed: "20 Gbps", protocol: "BGP EVPN" },
      { source: "nexus-vpc-1", target: "nexus-vpc-2", type: "sync", speed: "100 Gbps", protocol: "vPC Peer-Link" },
      { source: "nexus-vpc-1", target: "ny-gov-portal", type: "workload", speed: "10 Gbps", protocol: "VXLAN Encap" },
      { source: "nexus-vpc-1", target: "dmv-hub", type: "workload", speed: "10 Gbps", protocol: "802.1Q VLAN 120" },
      { source: "nexus-vpc-2", target: "dmv-hub", type: "workload", speed: "10 Gbps", protocol: "802.1Q VLAN 120" },
      { source: "nexus-vpc-2", target: "agency-enclave", type: "workload", speed: "10 Gbps", protocol: "VRF GovNet" },
      { source: "vrf-router", target: "agency-enclave", type: "workload", speed: "10 Gbps", protocol: "Zero-Trust ACL" }
    ],
    simulation: {
      title: "Simulate Carrier Fiber Cut",
      buttonText: "Simulate Carrier A Fiber Cut",
      resetText: "Restore Primary Circuit",
      impactSummary: "Carrier A primary link severed. BGP instantly withdraws routes via MED attribute; traffic seamlessly reroutes via Carrier B DIA in < 2.4s with 0 lost citizen sessions.",
      failedLink: { source: "mpls-primary", target: "ngfw-01" },
      activeFallbackLink: { source: "dia-backup", target: "ngfw-02" }
    },
    schematicLayers: [
      { layer: "L1 / Edge", spec: "Dual 10G Carrier MPLS + Redundant DIA Fiber with diverse physical entrances", highlightNodes: ["mpls-primary", "dia-backup", "regional-pop"] },
      { layer: "L2 / Transport", spec: "Cross-datacenter vPC Peer-Links, 802.1Q trunking, MTU 9216 Jumbo frames", highlightNodes: ["nexus-vpc-1", "nexus-vpc-2", "agency-enclave"] },
      { layer: "L3 / Routing", spec: "BGP dynamic multihomed peering, OSPF Area 0 backbone, MP-BGP VRF segmentation", highlightNodes: ["vrf-router", "nexus-vpc-1", "dmv-hub"] },
      { layer: "L4-L7 / Security", spec: "Palo Alto NGFW active/standby clusters, ZTNA proxy, and TLS 1.3 deep inspection", highlightNodes: ["ngfw-01", "ngfw-02", "ztna-gw", "ny-gov-portal"] }
    ],
    humanNotes: "Supporting IT systems for millions of New York citizens means zero tolerance for blackouts. When unexpected fiber cuts occur at carrier levels, dynamic BGP weight and MED attributes instantly route traffic around degraded paths without interrupting citizen portal services.",
    keyActions: [
      "Designed and supported enterprise network infrastructure across AWS hybrid-cloud environments, connecting state data centers, agency networks, and cloud workloads through secure and highly available connectivity.",
      "Configured AWS VPC, Subnets, Route Tables, Security Groups, NACLs, Transit Gateway, Direct Connect, and VPN to provide secure and resilient connectivity between on-premises and cloud environments.",
      "Configured and optimized Arista EOS, Cisco IOS/IOS-XE, Cisco Nexus, and Juniper Junos across large-scale routing and switching environments supporting critical state services.",
      "Implemented BGP, OSPF, EIGRP, IS-IS, MPLS, HSRP, VRRP, and GLBP, improving routing convergence, redundancy, load distribution, and high availability."
    ]
  },
  {
    id: "jpmc",
    client: "JPMorganChase",
    shortName: "JPMC",
    location: "Columbus, OH",
    coordinates: "40.0163° N, 82.9663° W",
    role: "Network Engineer",
    timeline: "Jun 2022 – Aug 2023",
    tagline: "High-Availability Financial Services Network Core & Low-Latency Mesh",
    architectureStyle: "Financial Trading Spine-Leaf · Sub-MS Latency · Ultra-Resilient",
    badge: "100G FINANCIAL SPINE-LEAF",
    metrics: [
      { label: "Latency Baseline", value: "< 0.4ms", sub: "Tick-to-Trade Path" },
      { label: "Fabric Bandwidth", value: "100G Spine", sub: "Non-blocking Bi-section" },
      { label: "Packet Loss Rate", value: "0.0001%", sub: "Zero-Buffer Drop" },
      { label: "Redundancy", value: "N+1 Hot-Standby", sub: "BGP ECMP & BFD" }
    ],
    zones: [
      { id: 0, title: "MARKET INGRESS", x: 90 },
      { id: 1, title: "100G SPINES", x: 290 },
      { id: 2, title: "LOW-LATENCY LEAVES", x: 490 },
      { id: 3, title: "TRADING & ENCLAVES", x: 690 }
    ],
    nodes: [
      // Zone 0: Market Ingress
      { id: "equinix-feed", name: "Equinix NY4 Feed", sub: "Direct Optical Cross", zone: 0, x: 90, y: 110, layer: "Trading Core", ip: "192.0.2.1/30", role: "Primary Market Ingress", spec: "100GbE single-mode dark fiber, NASDAQ/NYSE feeds" },
      { id: "cme-chicago", name: "CME Chicago Route", sub: "Low-Latency Metro", zone: 0, x: 90, y: 225, layer: "Trading Core", ip: "192.0.2.5/30", role: "Futures & Derivatives", spec: "Microwave + Optical hybrid, sub-4ms interstate link" },
      { id: "order-gw", name: "FIX Order Gateway", sub: "Session Broker", zone: 0, x: 90, y: 340, layer: "Trading Core", ip: "10.150.1.1", role: "Execution Protocol GW", spec: "Hardware timestamping, FIX/ITCH acceleration" },
      // Zone 1: 100G Spine Fabric
      { id: "spine-01", name: "Arista 7060X Spine-1", sub: "100G Non-Blocking", zone: 1, x: 290, y: 120, layer: "Trading Core", ip: "10.150.10.1", role: "Ultra-Fast Spine Fabric", spec: "Cut-through switching, 450ns ASIC transit latency" },
      { id: "spine-02", name: "Arista 7060X Spine-2", sub: "100G ECMP Partner", zone: 1, x: 290, y: 240, layer: "Redundancy Layer", ip: "10.150.10.2", role: "Equal-Cost Multi-Path", spec: "32x100GbE ports, BGP unnumbered peering" },
      { id: "bfd-monitor", name: "Sub-Second BFD", sub: "Failure Detector", zone: 1, x: 290, y: 345, layer: "Redundancy Layer", ip: "10.150.10.50", role: "Hardware Heartbeat", spec: "Bidirectional Forwarding Detection (15ms timer)" },
      // Zone 2: Low-Latency Leaf Fabric
      { id: "leaf-a", name: "Nexus 9300 Leaf A", sub: "QoS Priority Strict", zone: 2, x: 490, y: 130, layer: "Route Optimization", ip: "10.150.20.1", role: "Trading Floor Leaf", spec: "Expedited Forwarding (EF) Queue, 0 buffer drops" },
      { id: "leaf-b", name: "Nexus 9300 Leaf B", sub: "MLAG Peer", zone: 2, x: 490, y: 250, layer: "Route Optimization", ip: "10.150.20.2", role: "Trading Floor Leaf", spec: "PTP IEEE 1588 nanosecond clock synchronization" },
      { id: "pci-boundary", name: "PCI-DSS Gateway", sub: "Compliance Boundary", zone: 2, x: 490, y: 345, layer: "Compliance & Audit", ip: "10.150.30.1", role: "Encrypted Audit Boundary", spec: "MACsec line-rate encryption & SIEM telemetry feed" },
      // Zone 3: Trading Engines & Execution Pods
      { id: "trading-engine", name: "Algorithmic Engine", sub: "Tick-to-Trade", zone: 3, x: 690, y: 110, layer: "Trading Core", ip: "10.150.100.0/24", role: "HFT Compute Cluster", spec: "Solarflare Onload kernel-bypass NICs, <0.4ms latency" },
      { id: "clearing-mesh", name: "Clearing & Settle", sub: "Financial Ledger", zone: 3, x: 690, y: 225, layer: "Compliance & Audit", ip: "10.150.200.0/24", role: "Transaction Settlement", spec: "Active/Active dual ledger with synchronous commit" },
      { id: "corvil-sniff", name: "Micro-Burst Telemetry", sub: "Corvil Packet Sniffer", zone: 3, x: 690, y: 340, layer: "Route Optimization", ip: "10.150.250.10", role: "Deep Packet Tap", spec: "Nanosecond jitter & queue depth monitoring" }
    ],
    links: [
      { source: "equinix-feed", target: "spine-01", type: "primary", speed: "100 Gbps", protocol: "100GBASE-SR4" },
      { source: "cme-chicago", target: "spine-02", type: "secondary", speed: "100 Gbps", protocol: "100GBASE-LR4" },
      { source: "order-gw", target: "spine-01", type: "primary", speed: "40 Gbps", protocol: "FIX Protocol" },
      { source: "order-gw", target: "bfd-monitor", type: "sync", speed: "10 Gbps", protocol: "BFD Keepalive" },
      { source: "spine-01", target: "leaf-a", type: "core", speed: "100 Gbps", protocol: "BGP ECMP Lane 1" },
      { source: "spine-01", target: "leaf-b", type: "core", speed: "100 Gbps", protocol: "BGP ECMP Lane 2" },
      { source: "spine-02", target: "leaf-a", type: "core", speed: "100 Gbps", protocol: "BGP ECMP Lane 3" },
      { source: "spine-02", target: "leaf-b", type: "core", speed: "100 Gbps", protocol: "BGP ECMP Lane 4" },
      { source: "leaf-a", target: "leaf-b", type: "sync", speed: "100 Gbps", protocol: "MLAG Peer Link" },
      { source: "leaf-a", target: "trading-engine", type: "workload", speed: "25 Gbps", protocol: "Kernel Bypass" },
      { source: "leaf-b", target: "trading-engine", type: "workload", speed: "25 Gbps", protocol: "Kernel Bypass" },
      { source: "leaf-a", target: "clearing-mesh", type: "workload", speed: "10 Gbps", protocol: "PCI Segment" },
      { source: "leaf-b", target: "pci-boundary", type: "workload", speed: "10 Gbps", protocol: "MACsec Link" },
      { source: "pci-boundary", target: "corvil-sniff", type: "workload", speed: "10 Gbps", protocol: "Optical TAP" }
    ],
    simulation: {
      title: "Simulate Market Open Surge",
      buttonText: "Simulate 9:30 AM Market Surge",
      resetText: "Normalize Traffic Flow",
      impactSummary: "4.8M msg/sec burst injected across 100G Spine fabric. Strict QoS Expedited Forwarding prioritizes trading orders; buffer drop rate holds at 0.0000% while sub-0.4ms tick latency is preserved.",
      failedLink: null,
      activeFallbackLink: null
    },
    schematicLayers: [
      { layer: "Trading Core", spec: "Arista 7060X & Cisco Nexus 100G non-blocking low-latency cut-through switching", highlightNodes: ["equinix-feed", "cme-chicago", "spine-01", "trading-engine"] },
      { layer: "Route Optimization", spec: "Strict QoS queue prioritization (EF Queue), micro-burst tuning, zero-drop policing", highlightNodes: ["leaf-a", "leaf-b", "corvil-sniff"] },
      { layer: "Redundancy Layer", spec: "BGP Equal-Cost Multi-Path (ECMP) with sub-30ms Bidirectional Forwarding Detection (BFD)", highlightNodes: ["spine-02", "bfd-monitor", "leaf-a", "leaf-b"] },
      { layer: "Compliance & Audit", spec: "PCI-DSS network enclave segmentation, MACsec line-rate encryption, and Corvil packet audit", highlightNodes: ["pci-boundary", "clearing-mesh"] }
    ],
    humanNotes: "In financial networking, milliseconds equate to millions. Monitored interface micro-bursts and buffer drops, tuning QoS policing and multi-chassis link aggregation (MLAG) so trading desks experienced uninterrupted market feeds during market open surges.",
    keyActions: [
      "Managed secure enterprise network connectivity across branch, data center, and AWS/hybrid-cloud environments, supporting critical banking and trading applications.",
      "Automated network device configuration and operational tasks using Python, Ansible, Terraform, Netmiko, NAPALM, and REST APIs, reducing manual configuration effort and errors.",
      "Implemented and optimized SD-WAN, SDN, BGP, VPN, routing, firewall policies, and cloud connectivity to maintain resilient network paths across enterprise and cloud environments.",
      "Strengthened financial network security through network segmentation, Zero Trust, firewalls, NAC, 802.1X, RADIUS, TACACS+, SAML, and OAuth."
    ]
  },
  {
    id: "adp",
    client: "ADP",
    shortName: "ADP",
    location: "Hyderabad, India",
    coordinates: "17.4435° N, 78.3772° E",
    role: "Network engineer",
    timeline: "Dec 2019 – Nov 2021",
    tagline: "Global Multi-Tenant Enterprise LAN/WAN Operations & Rapid Incident Triage",
    architectureStyle: "Enterprise Campus LAN · Global WAN · 24/7 NOC Triaging",
    badge: "GLOBAL MULTI-TENANT ENTERPRISE",
    metrics: [
      { label: "Operational Model", value: "24/7/365 NOC", sub: "Follow-the-Sun Support" },
      { label: "Global Users", value: "60,000+", sub: "Multi-Tenant Enterprise" },
      { label: "Resolution Speed", value: "-35% MTTR", sub: "Incident Triage Automation" },
      { label: "Infrastructure", value: "Cisco Catalyst/Nexus", sub: "Campus & Distribution" }
    ],
    zones: [
      { id: 0, title: "GLOBAL HUBS", x: 90 },
      { id: 1, title: "WAN GATEWAYS", x: 290 },
      { id: 2, title: "DISTRIBUTION CORE", x: 490 },
      { id: 3, title: "TENANTS & NOC", x: 690 }
    ],
    nodes: [
      // Zone 0: Global Hubs
      { id: "us-east-hq", name: "US-East HQ Hub", sub: "Primary Datacenter", zone: 0, x: 90, y: 110, layer: "Global Backbone", ip: "10.100.0.1/16", role: "Core Global Hub", spec: "40GbE carrier interconnect, corporate systems anchor" },
      { id: "emea-hub", name: "EMEA Regional Hub", sub: "Frankfurt Gateway", zone: 0, x: 90, y: 225, layer: "Global Backbone", ip: "10.110.0.1/16", role: "European Region", spec: "GDPR isolated tenant enclave, dual transit" },
      { id: "apac-hub", name: "APAC Regional Hub", sub: "Hyderabad Core", zone: 0, x: 90, y: 340, layer: "Global Backbone", ip: "10.120.0.1/16", role: "Asia-Pacific Core", spec: "24/7 Global NOC Command center link" },
      // Zone 1: WAN Gateways
      { id: "asr-primary", name: "Cisco ASR 1002-HX", sub: "HSRP Active GW", zone: 1, x: 290, y: 120, layer: "Distribution", ip: "10.200.1.1", role: "Active Enterprise Router", spec: "VIP 10.200.1.254, BGP WAN peering, QoS traffic shaping" },
      { id: "asr-standby", name: "Cisco ASR 1001-X", sub: "HSRP Standby GW", zone: 1, x: 290, y: 240, layer: "Distribution", ip: "10.200.1.2", role: "Standby Router", spec: "HSRP tracking priority 110, auto-takeover in 1.2s" },
      { id: "ipsec-mesh", name: "IPsec VPN Mesh", sub: "AES-256 Cloud Tunnel", zone: 1, x: 290, y: 345, layer: "Global Backbone", ip: "10.200.50.1", role: "Encrypted Branch Link", spec: "Site-to-site dynamic crypto map with PFS Group 19" },
      // Zone 2: Campus Distribution & Access Fabric
      { id: "cat-9500-dist", name: "Catalyst 9500 Core", sub: "Distribution Switch", zone: 2, x: 490, y: 130, layer: "Campus Access", ip: "10.200.10.1", role: "Campus Distribution", spec: "StackWise Virtual, LACP 802.3ad trunk aggregation" },
      { id: "cat-9300-access", name: "Catalyst 9300 Stack", sub: "Access Switch Stack", zone: 2, x: 490, y: 250, layer: "Campus Access", ip: "10.200.20.1", role: "Edge User Access", spec: "802.1X Dynamic VLAN assignment, port-security mac-limit" },
      { id: "solarwinds-probe", name: "SolarWinds & NetFlow", sub: "SNMP & Telemetry", zone: 2, x: 490, y: 345, layer: "Telemetry", ip: "10.200.99.50", role: "NOC Health Monitor", spec: "Continuous polling, NetFlow v9 analysis, anomaly alerts" },
      // Zone 3: Enterprise Tenants & 24/7 Operations
      { id: "payroll-cloud", name: "Payroll Cloud Pod", sub: "Multi-Tenant Workload", zone: 3, x: 690, y: 110, layer: "Campus Access", ip: "172.24.10.0/24", role: "Enterprise Payroll Service", spec: "Serving 60,000+ corporate clients with 99.95% SLA" },
      { id: "hr-directory", name: "HR Directory Services", sub: "SSO & LDAP Enclave", zone: 3, x: 690, y: 225, layer: "Campus Access", ip: "172.24.20.0/24", role: "Identity Federation", spec: "Dynamic VLAN 20, 802.1X authenticated user profiles" },
      { id: "noc-console", name: "24/7 NOC Console", sub: "War-Room Incident Desk", zone: 3, x: 690, y: 340, layer: "Telemetry", ip: "172.24.99.10", role: "Operational Triaging", spec: "Live MTTR tracking dashboard, STP loop auto-remediation" }
    ],
    links: [
      { source: "us-east-hq", target: "asr-primary", type: "primary", speed: "10 Gbps", protocol: "BGP WAN" },
      { source: "emea-hub", target: "asr-standby", type: "secondary", speed: "10 Gbps", protocol: "BGP WAN" },
      { source: "apac-hub", target: "ipsec-mesh", type: "primary", speed: "5 Gbps", protocol: "IPsec Site-Mesh" },
      { source: "asr-primary", target: "asr-standby", type: "sync", speed: "10 Gbps", protocol: "HSRP Heartbeat" },
      { source: "ipsec-mesh", target: "asr-primary", type: "core", speed: "5 Gbps", protocol: "Crypto Transit" },
      { source: "asr-primary", target: "cat-9500-dist", type: "core", speed: "20 Gbps", protocol: "LACP EtherChannel" },
      { source: "asr-standby", target: "cat-9500-dist", type: "core", speed: "20 Gbps", protocol: "Standby Uplink" },
      { source: "cat-9500-dist", target: "cat-9300-access", type: "core", speed: "10 Gbps", protocol: "802.1Q Trunk" },
      { source: "cat-9500-dist", target: "solarwinds-probe", type: "sync", speed: "1 Gbps", protocol: "NetFlow v9 Stream" },
      { source: "cat-9300-access", target: "payroll-cloud", type: "workload", speed: "10 Gbps", protocol: "VLAN 10 Corporate" },
      { source: "cat-9300-access", target: "hr-directory", type: "workload", speed: "10 Gbps", protocol: "802.1X Dynamic" },
      { source: "solarwinds-probe", target: "noc-console", type: "workload", speed: "1 Gbps", protocol: "SNMP Traps" }
    ],
    simulation: {
      title: "Simulate Core Gateway Cutover",
      buttonText: "Simulate ASR Router Cutover",
      resetText: "Restore Primary Gateway",
      impactSummary: "ASR 1002-HX placed in maintenance mode. Standby ASR 1001-X immediately assumes VIP 10.200.1.254 via HSRP priority preemption in 1.2s with zero user disconnection across 60,000+ accounts.",
      failedLink: { source: "us-east-hq", target: "asr-primary" },
      activeFallbackLink: { source: "emea-hub", target: "asr-standby" }
    },
    schematicLayers: [
      { layer: "Campus Access", spec: "Cisco Catalyst 9300 switches, 802.1X port authentication, and dynamic VLAN allocation", highlightNodes: ["cat-9300-access", "payroll-cloud", "hr-directory"] },
      { layer: "Distribution", spec: "Cisco Catalyst 9500 distribution core, HSRP active/standby gateway pairs, EtherChannel LACP bundles", highlightNodes: ["cat-9500-dist", "asr-primary", "asr-standby"] },
      { layer: "Global Backbone", spec: "Full mesh IPsec site-to-site VPN tunnels connecting US-East, EMEA, and APAC headquarters", highlightNodes: ["us-east-hq", "emea-hub", "apac-hub", "ipsec-mesh"] },
      { layer: "Telemetry", spec: "Continuous SolarWinds SNMP monitoring, NetFlow v9 traffic analysis, and automated NOC alert triage", highlightNodes: ["solarwinds-probe", "noc-console"] }
    ],
    humanNotes: "Where practical engineering muscle was forged: troubleshooting Spanning Tree loops, resolving IP address conflicts, diagnosing trunk negotiation errors, and performing emergency switch cutovers during midnight maintenance windows without dropping user sessions.",
    keyActions: [
      "Managed DHCP lease paths, gateway handoffs, address pools, and connectivity across ADP network segments supporting payroll and HR applications.",
      "Validated Azure VNet routing and NAT behavior, using ICMP testing and packet captures to troubleshoot connectivity and routing issues.",
      "Implemented Azure VPN Gateway changes, coordinating NAT translations, NSG rules, and gateway updates across staging and production environments.",
      "Documented and maintained LAN/WAN topologies, VLAN configurations, and Azure ExpressRoute handoffs to improve network visibility and incident response."
    ]
  }
];

