export const topologyData = {
  title: "ENTERPRISE HYBRID CLOUD & ZERO-TRUST TOPOLOGY",
  description: "Interactive real-time packet routing engine. Select nodes or inject test packets to trace ingress, cryptographic inspection, and spine-leaf distribution.",
  nodes: [
    {
      id: "edge-dns",
      label: "Anycast Edge DNS",
      category: "edge",
      ip: "198.51.100.1",
      protocol: "BGP / Anycast",
      asn: "AS64512",
      status: "OPTIMAL",
      latency: "1.2ms",
      throughput: "94.2 Gbps",
      x: 100,
      y: 190,
      role: "Global routing entry point, Geo-DNS resolution, and volumetric DDoS mitigation."
    },
    {
      id: "perimeter-fw",
      label: "NextGen Firewall / WAF",
      category: "security",
      ip: "10.0.1.1",
      protocol: "Stateful L7 / IPsec",
      asn: "Trust-Zone-0",
      status: "ACTIVE",
      latency: "0.8ms",
      throughput: "78.6 Gbps",
      x: 280,
      y: 190,
      role: "Deep packet inspection (DPI), zero-trust policy enforcement, TLS termination, and ingress packet scrub."
    },
    {
      id: "transit-gw",
      label: "Cloud Transit Gateway",
      category: "cloud",
      ip: "10.100.0.1",
      protocol: "BGP over DirectConnect",
      asn: "AS64513",
      status: "OPTIMAL",
      latency: "2.1ms",
      throughput: "120.0 Gbps",
      x: 470,
      y: 110,
      role: "Hub-and-spoke interconnect linking multi-region AWS/Azure VPCs with on-prem data center cores."
    },
    {
      id: "spine-core",
      label: "Spine Fabric (Nexus)",
      category: "core",
      ip: "10.200.0.1",
      protocol: "BGP EVPN / VXLAN",
      asn: "AS65001",
      status: "OPTIMAL",
      latency: "0.4ms",
      throughput: "400.0 Gbps",
      x: 470,
      y: 270,
      role: "Non-blocking 100G spine routing fabric providing sub-millisecond East-West packet distribution."
    },
    {
      id: "vpc-prod",
      label: "Production App VPC",
      category: "compute",
      ip: "10.10.0.0/16",
      protocol: "Overlay Geneve",
      asn: "Subnet-Prod-A",
      status: "HEALTHY",
      latency: "1.4ms",
      throughput: "42.1 Gbps",
      x: 690,
      y: 80,
      role: "Microsegmented application clusters across availability zones with redundant NAT gateways."
    },
    {
      id: "leaf-access",
      label: "Leaf Switch Cluster",
      category: "lan",
      ip: "10.20.0.0/24",
      protocol: "802.1Q / LACP LAG",
      asn: "ToR-Rack-04",
      status: "ACTIVE",
      latency: "0.5ms",
      throughput: "80.0 Gbps",
      x: 690,
      y: 200,
      role: "Top-of-Rack redundant dual-homed switches with multi-chassis link aggregation (MLAG)."
    },
    {
      id: "db-enclave",
      label: "Secure Data Enclave",
      category: "storage",
      ip: "10.30.0.0/24",
      protocol: "Mutual TLS / IPsec",
      asn: "Vault-PCI-DSS",
      status: "LOCKED",
      latency: "0.6ms",
      throughput: "24.5 Gbps",
      x: 690,
      y: 310,
      role: "Air-gapped database tier with strict ingress ACLs, cryptographic storage tunnels, and auditing."
    }
  ],
  links: [
    { source: "edge-dns", target: "perimeter-fw", label: "100G Trunk", status: "ok" },
    { source: "perimeter-fw", target: "transit-gw", label: "DirectConnect", status: "ok" },
    { source: "perimeter-fw", target: "spine-core", label: "Fabric Uplink", status: "ok" },
    { source: "transit-gw", target: "vpc-prod", label: "VPC Peering", status: "ok" },
    { source: "spine-core", target: "leaf-access", label: "100G EVPN", status: "ok" },
    { source: "spine-core", target: "db-enclave", label: "Strict ACL Path", status: "secure" },
    { source: "vpc-prod", target: "db-enclave", label: "Private Link", status: "secure" }
  ],
  simulationFlows: [
    {
      id: "normal-ingress",
      name: "Public Citizen Request (NYS)",
      path: ["edge-dns", "perimeter-fw", "transit-gw", "vpc-prod"],
      description: "Anycast ingress resolved -> L7 WAF scrubbed -> Transit Gateway routed -> Application Pod served.",
      color: "#0284c7"
    },
    {
      id: "financial-trade",
      name: "Low-Latency Trading Order (JPMC)",
      path: ["edge-dns", "perimeter-fw", "spine-core", "leaf-access"],
      description: "Sub-millisecond packet traversal through non-blocking spine-leaf core with zero jitter.",
      color: "#f59e0b"
    },
    {
      id: "zero-trust-audit",
      name: "Secure DB Enclave Query",
      path: ["vpc-prod", "transit-gw", "perimeter-fw", "db-enclave"],
      description: "Zero-trust verification: mutual TLS handshake and egress firewall ACL inspection before data release.",
      color: "#10b981"
    }
  ]
};
