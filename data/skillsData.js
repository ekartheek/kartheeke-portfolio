export const hardwareChassisData = [
  {
    id: "nexus-9336",
    name: "Cisco Nexus 9336C-FX2",
    vendor: "Cisco Systems",
    role: "100G Data Center Spine & EVPN Gateway",
    os: "Cisco NX-OS 9.3(10)",
    formFactor: "1RU Fixed Enterprise Chassis",
    status: "ONLINE // OPERATIONAL",
    throughput: "7.2 Tbps",
    latency: "< 1.0 µs (Cut-Through)",
    powerDraw: "520W (Dual 1100W Platinum PSUs)",
    thermal: "34°C Inlet / 41°C Exhaust",
    fans: "4 x Hot-Swap Counter-Rotating Fan Trays (100% RPM)",
    crcErrors: "0 (Frame Integrity 100%)",
    portCount: 36,
    portType: "QSFP28 100GbE / 40GbE",
    protocols: ["BGP EVPN", "VXLAN", "OSPF Area 0", "vPC Peer-Link", "PIM-SM", "PTP"],
    cliSnippet: `spine-01# show vpc brief
vPC domain id                     : 10
vPC status                        : Peer status: peer adjacency formed ok
vPC keepalive status              : Peer is alive
vPC peer-link status              : 100G Up, Port-Channel 1 (active)
Number of vPCs configured         : 24

spine-01# show bgp l2vpn evpn summary
BGP router identifier 10.240.10.1, local AS number 65001
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.240.10.2     4 65001   94210   94212       12    0    0 42d18h        148`,
    ports: Array.from({ length: 36 }, (_, i) => ({
      id: `1/${i + 1}`,
      name: `Eth1/${i + 1}`,
      type: "QSFP28",
      speed: "100G",
      status: i < 30 ? "up" : i < 34 ? "active" : "standby",
      rxGbps: (18 + (i * 2.1) % 40).toFixed(1),
      txGbps: (14 + (i * 1.9) % 38).toFixed(1),
      opticalPower: `-${(2.1 + (i % 3) * 0.4).toFixed(1)} dBm`,
      vlan: i % 2 === 0 ? "Trunk (Tagged)" : "VLAN 100",
      description: i < 4 ? "Cross-DC vPC Peer-Link" : i < 20 ? `Leaf-0${Math.floor(i/2) + 1} 100G Uplink` : "Citizen Service Pod Transit"
    }))
  },
  {
    id: "arista-7060",
    name: "Arista 7060CX-32S",
    vendor: "Arista Networks",
    role: "Ultra Low-Latency Financial Trading Core",
    os: "Arista EOS 4.28.2F",
    formFactor: "1RU High-Density Wire-Speed Spine",
    status: "ONLINE // SUB-MS MODE",
    throughput: "6.4 Tbps Wire-Speed",
    latency: "450 ns (Sub-Microsecond ASIC)",
    powerDraw: "340W (Dual 500W Hot-Swap PSUs)",
    thermal: "31°C Chassis Ambient (Cooling OK)",
    fans: "5 x N+1 Hot-Swap Fan Modules (Normal)",
    crcErrors: "0 (Micro-Burst Tuned)",
    portCount: 32,
    portType: "QSFP28 100GbE + 2x SFP+ Mgmt",
    protocols: ["BGP ECMP", "Sub-30ms BFD", "PTP IEEE 1588v2", "Strict QoS EF", "Cut-Through"],
    cliSnippet: `trading-spine-01# show ip bfd neighbors
OurAddr       NeighAddr      LD/RD  RH/RS  State  Hold  Interface
10.150.10.1   10.150.10.2    1/2    Up/Up  Up     45ms  Ethernet1/1
10.150.10.1   10.150.20.1    3/4    Up/Up  Up     45ms  Ethernet1/2

trading-spine-01# show qos interface ethernet 1/1
Class-map: Expedited-Forwarding (match cos 5, dscp ef)
  Transmitted: 481,920,410 packets, 42.8 GB
  Dropped: 0 packets (Zero-buffer drop threshold active)`,
    ports: Array.from({ length: 32 }, (_, i) => ({
      id: `1/${i + 1}`,
      name: `Eth${i + 1}`,
      type: "QSFP28",
      speed: "100G",
      status: i < 28 ? "up" : "active",
      rxGbps: (24 + (i * 2.3) % 45).toFixed(1),
      txGbps: (22 + (i * 2.1) % 43).toFixed(1),
      opticalPower: `-${(1.8 + (i % 3) * 0.3).toFixed(1)} dBm`,
      vlan: "Non-blocking ECMP Fabric",
      description: i < 4 ? "CME / Equinix Direct Feed" : i < 16 ? `Leaf-HFT-${i} 100G Bus` : "Matching Engine Pod Interconnect"
    }))
  },
  {
    id: "cisco-firepower",
    name: "Cisco Firepower 4110 (ASA/FTD)",
    vendor: "Cisco Systems",
    role: "Perimeter Threat Defense & IPsec/SSL Security",
    os: "Cisco FXOS / Firepower Threat Defense 7.2",
    formFactor: "1RU Enterprise Security Appliance",
    status: "ONLINE // ACTIVE HA PAIR",
    throughput: "45 Gbps Stateful Inspection",
    latency: "< 10 µs Full DPI Inspection",
    powerDraw: "650W (Dual 1100W AC Redundant)",
    thermal: "35°C Card Cage (Optimal)",
    fans: "Hot-Swap Fan Modules (Normal)",
    crcErrors: "0 (Threat Dropped: 18,420)",
    portCount: 24,
    portType: "8x 40GbE QSFP+ / 16x 10GbE SFP+",
    protocols: ["Cisco ASA/FTD", "IPsec / SSL VPN", "ACLs & IDS/IPS", "Zero Trust", "802.1X NAC", "RADIUS/TACACS+"],
    cliSnippet: `firepower-01# show failover state
               State          Holdtime(sec)
This host  -   Primary        Active
Other host -   Secondary      Standby Ready

firepower-01# show vpn-sessiondb summary
Active Session Summary:
  IPsec Site-to-Site : 48 (AES-256-GCM / DH-19)
  SSL AnyConnect     : 2,410 active sessions
  Total Active       : 2,458 (Zero Dropped Packets)`,
    ports: Array.from({ length: 24 }, (_, i) => ({
      id: `1/${i + 1}`,
      name: i < 8 ? `FortyGigE1/${i + 1}` : `TenGigE1/${i - 7}`,
      type: i < 8 ? "QSFP+ 40G" : "SFP+ 10G",
      speed: i < 8 ? "40G" : "10G",
      status: i < 20 ? "up" : "standby",
      rxGbps: (10 + (i * 1.5) % 25).toFixed(1),
      txGbps: (9 + (i * 1.3) % 24).toFixed(1),
      opticalPower: `-${(2.0 + (i % 3) * 0.4).toFixed(1)} dBm`,
      vlan: i < 4 ? "Outside / WAN Internet" : i < 12 ? "Inside / Enterprise LAN" : "DMZ / Secure Workloads",
      description: i < 2 ? "Carrier WAN MPLS Trunk" : i < 4 ? "Direct Internet Fiber" : "Core Nexus vPC Interconnect"
    }))
  },
  {
    id: "catalyst-9500",
    name: "Cisco Catalyst 9500-48Y4C",
    vendor: "Cisco Systems",
    role: "Campus Enterprise Core & Distribution Switch",
    os: "Cisco IOS-XE 17.9.4",
    formFactor: "1RU High-Density Distribution Switch",
    status: "ONLINE // STACKWISE VIRTUAL",
    throughput: "3.2 Tbps Switching Capacity",
    latency: "< 2.0 µs Enterprise Forwarding",
    powerDraw: "380W (Dual 950W AC Redundant)",
    thermal: "33°C Chassis Normal",
    fans: "Dual Rotor Fan Modules (100% Health)",
    crcErrors: "0 (802.1X Port Security Active)",
    portCount: 32,
    portType: "28x 25GbE SFP28 + 4x 100GbE Uplinks",
    protocols: ["802.1X NAC", "LACP EtherChannel", "HSRP / VRRP", "OSPF Area 0", "Dynamic VLANs"],
    cliSnippet: `campus-core-01# show etherchannel summary
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Te1/0/1(P) Te1/0/2(P) Te1/0/3(P) Te1/0/4(P)
10     Po10(SU)        LACP      Hu1/0/49(P) Hu1/0/50(P) [100G Uplink to Core]

campus-core-01# show authentication sessions
Interface    MAC Address    Method   Domain   Status         Session ID
Gi1/0/12     001e.4921.ad01 dot1x    DATA     Auth Success   0A1820010000001
Gi1/0/13     001e.4921.ad02 dot1x    VOICE    Auth Success   0A1820010000002`,
    ports: Array.from({ length: 32 }, (_, i) => ({
      id: `1/${i + 1}`,
      name: i < 28 ? `TwentyFiveGigE1/0/${i + 1}` : `HundredGigE1/0/${i - 27}`,
      type: i < 28 ? "SFP28 25G" : "QSFP28 100G",
      speed: i < 28 ? "25G" : "100G",
      status: i < 26 ? "up" : "active",
      rxGbps: (4 + (i * 0.7) % 18).toFixed(1),
      txGbps: (3.8 + (i * 0.6) % 16).toFixed(1),
      opticalPower: `-${(2.4 + (i % 3) * 0.4).toFixed(1)} dBm`,
      vlan: i < 10 ? "VLAN 10 Corporate" : i < 20 ? "VLAN 20 Engineering" : "VLAN 99 Voice/Mgmt",
      description: i >= 28 ? "100G Core Nexus Uplink" : `Access Switch Stack-0${Math.floor(i/4)+1}`
    }))
  }
];

export const protocolArchitectureLayers = [
  {
    id: "l2-transport",
    name: "Layer 2: Enterprise Routing & Switching Fabric",
    badge: "L2/L3 SWITCHING & PHYSICAL FABRIC",
    color: "#38bdf8",
    accentBg: "bg-sky-950/50",
    accentBorder: "border-sky-500",
    tagline: "VLANs, VXLAN/EVPN, STP/RSTP/MSTP, EtherChannel/LACP, Inter-VLAN Routing, and multi-chassis redundancy.",
    protocols: [
      {
        name: "VLAN Trunking & Inter-VLAN Routing",
        acronym: "VLAN / 802.1Q",
        rfc: "IEEE 802.1Q",
        role: "Broadcast Domain Virtualization & Inter-VLAN Transit",
        desc: "802.1Q tag encapsulation separating traffic into segmented VLANs with high-performance Layer 3 Inter-VLAN routing.",
        cli: "interface Po1\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30,100\n switchport trunk native vlan 999",
        interconnectsWith: ["STP/RSTP/MSTP", "EtherChannel/LACP", "Cisco Nexus"]
      },
      {
        name: "Spanning Tree Protocol (STP / RSTP / MSTP)",
        acronym: "STP / RSTP / MSTP",
        rfc: "IEEE 802.1D / 802.1w / 802.1s",
        role: "Loop-Free L2 Topologies & Rapid Convergence",
        desc: "Proactive topology synchronization with sub-second RSTP/MSTP convergence, BPDU Guard, Root Guard, and PortFast.",
        cli: "spanning-tree mode rapid-pvst\nspanning-tree portfast bpduguard default\nspanning-tree vlan 1-4094 root primary",
        interconnectsWith: ["802.1Q", "EtherChannel", "Cisco IOS-XE"]
      },
      {
        name: "EtherChannel / LACP (802.3ad)",
        acronym: "EtherChannel / LACP",
        rfc: "IEEE 802.3ad",
        role: "Link Aggregation & Bandwidth Multiplying",
        desc: "Bundles physical links into high-speed logical channels with dynamic LACP negotiation and hash-based load sharing.",
        cli: "interface range Eth1/1-4\n channel-group 10 mode active\n lacp rate fast\n load-balance src-dst-ip-l4port",
        interconnectsWith: ["802.1Q", "Cisco Nexus vPC", "Arista EOS"]
      },
      {
        name: "Virtual Port Channel (vPC)",
        acronym: "Cisco vPC",
        rfc: "Cisco NX-OS",
        role: "Active/Active Multi-Chassis Redundancy",
        desc: "Enables dual physical switches to appear as a single logical entity, eliminating STP blocked ports and doubling uplink bandwidth.",
        cli: "vpc domain 10\n peer-switch\n role priority 1000\n peer-keepalive destination 10.240.10.2 source 10.240.10.1\n peer-gateway",
        interconnectsWith: ["802.1Q", "VXLAN/EVPN", "EtherChannel"]
      }
    ]
  },
  {
    id: "l3-routing",
    name: "Layer 3: Dynamic Routing & High Availability",
    badge: "DYNAMIC ROUTING & HA FABRIC",
    color: "#0284c7",
    accentBg: "bg-blue-950/50",
    accentBorder: "border-blue-500",
    tagline: "BGP, OSPF, EIGRP, IS-IS, MPLS, HSRP, VRRP, and GLBP maintaining predictable convergence.",
    protocols: [
      {
        name: "Border Gateway Protocol (BGP)",
        acronym: "BGP (eBGP / iBGP)",
        rfc: "RFC 4271",
        role: "Autonomous System Peering & Route Policy Engine",
        desc: "Path-vector routing governing multi-homed carrier peering, AS-Path prepending, MED route-selection, and BGP ECMP.",
        cli: "router bgp 65001\n neighbor 198.51.100.1 remote-as 65000\n  set weight 200\n  set metric 10\n neighbor 10.240.10.2 remote-as 65001\n  update-source loopback0",
        interconnectsWith: ["OSPF Areas", "Route Redistribution", "AWS DirectConnect"]
      },
      {
        name: "Open Shortest Path First (OSPF)",
        acronym: "OSPFv2 / OSPFv3",
        rfc: "RFC 2328",
        role: "Link-State Interior Gateway Protocol",
        desc: "Dijkstra SPF shortest-path routing across Area 0 backbone, sub-second hello timers, and multi-area route summarization.",
        cli: "router ospf 1\n router-id 10.240.10.1\n auto-cost reference-bandwidth 100000\n network 10.240.0.0 0.0.255.255 area 0\n timers throttle spf 10 50 200",
        interconnectsWith: ["BGP", "EIGRP", "MPLS"]
      },
      {
        name: "EIGRP & IS-IS Dynamic Routing",
        acronym: "EIGRP / IS-IS",
        rfc: "RFC 7868 / ISO 10589",
        role: "Interior Distance-Vector & Link-State Routing",
        desc: "DUAL algorithmic loop-free routing maintaining feasible successors for instant sub-50ms cutover and large-scale IS-IS routing.",
        cli: "router eigrp ENTERPRISE\n address-family ipv4 unicast autonomous-system 100\n  topology base\n   variance 2\n  network 10.200.0.0 0.0.255.255",
        interconnectsWith: ["OSPF", "BGP", "Route Redistribution"]
      },
      {
        name: "High Availability (HSRP / VRRP / GLBP)",
        acronym: "HSRP / VRRP / GLBP",
        rfc: "RFC 2281 / RFC 5798",
        role: "First-Hop Redundancy & Load Balancing",
        desc: "Active/standby virtual gateway VIP redundancy with interface tracking, automated preemption, and active load balancing.",
        cli: "interface Vlan10\n standby 10 ip 10.200.10.254\n standby 10 priority 110\n standby 10 preempt\n standby 10 track GigabitEthernet1/0/1 20",
        interconnectsWith: ["Cisco IOS-XE", "Juniper Junos", "LAN/WAN"]
      }
    ]
  },
  {
    id: "l4-transport",
    name: "Layer 4: Network Automation & Monitoring",
    badge: "AUTOMATION & DIAGNOSTICS",
    color: "#10b981",
    accentBg: "bg-emerald-950/50",
    accentBorder: "border-emerald-500",
    tagline: "Python, Ansible, Terraform, REST APIs, Netmiko, NAPALM, Wireshark, Splunk, and SolarWinds.",
    protocols: [
      {
        name: "Network Automation & IaC",
        acronym: "Python / Ansible / Terraform",
        rfc: "Infrastructure as Code",
        role: "Automated Device Configuration & Compliance",
        desc: "Scripted multi-vendor provisioning using Python, Ansible, Terraform, Netmiko, NAPALM, and REST APIs, eliminating manual configuration drift.",
        cli: "import netmiko\nconnection = netmiko.ConnectHandler(device_type='cisco_nxos', host='10.240.10.1', username='admin', password=pwd)\noutput = connection.send_config_set(['interface Ethernet1/1', 'description 100G-Uplink'])",
        interconnectsWith: ["Cisco Nexus", "Arista EOS", "Juniper Junos"]
      },
      {
        name: "Packet Analysis & Deep Troubleshooting",
        acronym: "Wireshark / Splunk",
        rfc: "Packet Telemetry",
        role: "Root-Cause Analysis & Performance Diagnostics",
        desc: "Packet-level capture analysis, TCP window collapse triage, latency profiling, and centralized log correlation in Splunk and SolarWinds.",
        cli: "monitor capture CAPTURE_1 interface Eth1/1 both\nmonitor capture CAPTURE_1 match ipv4 any any\nmonitor capture CAPTURE_1 start",
        interconnectsWith: ["TCP/IP", "NetFlow", "SNMP / Syslog"]
      },
      {
        name: "Enterprise Monitoring Suite",
        acronym: "SolarWinds / PRTG / Nagios",
        rfc: "RFC 1157 SNMP",
        role: "Continuous Health, Latency & Flow Telemetry",
        desc: "Multi-protocol polling via SNMP v2c/v3, Syslog daemons, NetFlow v9/IPFIX, alerting on interface drops, CRC errors, and jitter spikes.",
        cli: "snmp-server community EnterpriseNet RO\nsnmp-server enable traps\nlogging host 10.200.99.50 transport udp port 514",
        interconnectsWith: ["Wireshark", "Syslog", "NetFlow"]
      }
    ]
  },
  {
    id: "overlay-fabric",
    name: "Overlay, Leaf-Spine & Data Center Fabric",
    badge: "DATACENTER FABRIC & VXLAN",
    color: "#818cf8",
    accentBg: "bg-indigo-950/50",
    accentBorder: "border-indigo-500",
    tagline: "Leaf-Spine Architecture, VXLAN/EVPN, ACI, Data Center Interconnect, SD-WAN, and SDN.",
    protocols: [
      {
        name: "VXLAN / EVPN Fabric",
        acronym: "VXLAN / EVPN",
        rfc: "RFC 7348 / 8365",
        role: "Layer-2 Overlay Over Layer-3 Underlay",
        desc: "Encapsulates MAC frames in UDP (port 4789) across non-blocking leaf-spine fabrics, scaling segmentation to 16M VNI networks.",
        cli: "interface nve1\n no shutdown\n source-interface loopback1\n member vni 10100\n  suppress-arp\n  ingress-replication protocol bgp",
        interconnectsWith: ["BGP EVPN", "Cisco Nexus", "Arista EOS"]
      },
      {
        name: "Leaf-Spine Non-Blocking Architecture",
        acronym: "Clos Architecture / ACI",
        rfc: "RFC 7938",
        role: "Deterministic Any-to-Any East-West Latency",
        desc: "Every leaf connects to every spine, ensuring consistent single-hop latency and optimal ECMP traffic distribution.",
        cli: "ip routing\nip route 0.0.0.0/0 Null0\nip load-sharing bfd\nhardware profile tcam region qos 512",
        interconnectsWith: ["Arista 7060X", "Nexus 9336C", "BGP ECMP"]
      },
      {
        name: "SD-WAN & Software-Defined Networking",
        acronym: "SD-WAN / SDN",
        rfc: "Enterprise SD-WAN",
        role: "Intelligent Multi-Path WAN Transport",
        desc: "Dynamic application-aware routing over MPLS, broadband, and cloud links, ensuring sub-second failover and QoS enforcement.",
        cli: "sdwan\n policy app-aware SLA-MISSION-CRITICAL\n  loss 1\n  latency 50\n  jitter 10",
        interconnectsWith: ["BGP", "IPsec VPN", "Branch LAN/WAN"]
      }
    ]
  },
  {
    id: "security-perimeter",
    name: "Enterprise Network Security & Zero-Trust",
    badge: "ZERO-TRUST & NETWORK SECURITY",
    color: "#f59e0b",
    accentBg: "bg-amber-950/50",
    accentBorder: "border-amber-500",
    tagline: "Cisco ASA/Firepower, ACLs, IPsec/SSL VPN, IDS/IPS, NAC, 802.1X, RADIUS, TACACS+, Zero Trust, and DDoS protection.",
    protocols: [
      {
        name: "Cisco ASA / Firepower Threat Defense",
        acronym: "Cisco ASA / Firepower",
        rfc: "Enterprise Security",
        role: "NextGen Firewall, Stateful Inspection & IDS/IPS",
        desc: "Stateful Layer 3-7 threat prevention, deep packet inspection, access control lists (ACLs), and automated threat mitigation.",
        cli: "access-list OUTSIDE_IN extended permit tcp any host 10.240.10.50 eq https\naccess-group OUTSIDE_IN in interface outside",
        interconnectsWith: ["IPsec/SSL VPN", "802.1X", "RADIUS/TACACS+"]
      },
      {
        name: "Site-to-Site & Remote VPN (IPsec / SSL)",
        acronym: "IPsec / SSL VPN",
        rfc: "RFC 7296 / SSL",
        role: "Cryptographic Branch & Remote User Gateway",
        desc: "AES-256 encrypted site-to-site IPsec tunnels with IKEv2 and SSL VPN AnyConnect access for secure remote connectivity.",
        cli: "crypto ikev2 proposal PROPOSAL_AES256\n encryption aes-gcm-256\n prf sha384\n group 19\ncrypto ikev2 profile PROFILE_VPN\n match identity remote any",
        interconnectsWith: ["AWS VPN", "Azure VPN Gateway", "Cisco ASA"]
      },
      {
        name: "Network Access Control & Zero Trust",
        acronym: "NAC / 802.1X / Zero Trust",
        rfc: "IEEE 802.1X / NIST SP 800-207",
        role: "Dynamic Identity Authentication & Micro-Segmentation",
        desc: "Certificate-based dynamic VLAN assignment via RADIUS/TACACS+, micro-segmentation, and continuous zero-trust authorization.",
        cli: "aaa authentication dot1x default group radius\ndot1x system-auth-control\ninterface range Gi1/0/1-48\n authentication port-control auto",
        interconnectsWith: ["Catalyst 9500", "RADIUS / TACACS+", "VLANs"]
      }
    ]
  },
  {
    id: "cloud-hybrid",
    name: "Cloud Networking: AWS & Azure Hybrid",
    badge: "HYBRID-CLOUD TRANSIT",
    color: "#14b8a6",
    accentBg: "bg-teal-950/50",
    accentBorder: "border-teal-500",
    tagline: "AWS VPC, Subnets, Route Tables, Security Groups, NACLs, Transit Gateway, Direct Connect, Azure VNet, NSG, and ExpressRoute.",
    protocols: [
      {
        name: "AWS Hybrid-Cloud Fabric",
        acronym: "AWS VPC / TGW / Direct Connect",
        rfc: "AWS Cloud Networking",
        role: "Dedicated On-Premise to AWS Interconnect",
        desc: "AWS Transit Gateway (TGW) regional hubs, Direct Connect 10G private interconnects, VPC peering, Route Tables, Security Groups, and NACLs.",
        cli: "aws ec2 create-transit-gateway-route-table --transit-gateway-id tgw-0123456789abcdef0\naws ec2 create-direct-connect-gateway --direct-connect-gateway-name GovCloud-DXGW",
        interconnectsWith: ["BGP Peering", "IPsec Fallback", "AWS VPC Subnets"]
      },
      {
        name: "Azure Enterprise Cloud Transit",
        acronym: "Azure VNet / ExpressRoute / NSG",
        rfc: "Azure Cloud Networking",
        role: "Private High-Throughput Azure Interconnect",
        desc: "Azure Virtual Networks (VNet), Network Security Groups (NSGs), Azure Firewall, Azure VPN Gateway, and ExpressRoute private peering circuits.",
        cli: "az network vnet create --name ADP-Prod-VNet --resource-group NetRG --address-prefixes 10.100.0.0/16\naz network express-route create --name ExpressRoute-10G",
        interconnectsWith: ["Azure VPN Gateway", "ExpressRoute", "NAT"]
      },
      {
        name: "Cloud Security & Multi-Cloud Redundancy",
        acronym: "Security Groups / NACLs / Load Balancers",
        rfc: "Multi-Cloud Security",
        role: "Stateful & Stateless Cloud Perimeter Filtering",
        desc: "Dual-tier security group stateful rules and subnet NACL stateless filtering with automated multi-cloud failover and load balancing.",
        cli: "aws ec2 authorize-security-group-ingress --group-id sg-0123456 --protocol tcp --port 443 --cidr 10.240.0.0/16",
        interconnectsWith: ["AWS VPC", "Azure VNet", "Transit Gateway"]
      }
    ]
  }
];
