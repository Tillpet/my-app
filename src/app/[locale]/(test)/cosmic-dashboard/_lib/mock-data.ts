export type KpiKey = "cpu" | "memory" | "network" | "latency";

export interface KpiConfig {
  key: KpiKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  decimals: number;
  initial: number;
}

export const KPIS: KpiConfig[] = [
  { key: "cpu", label: "CPU Load", unit: "%", min: 32, max: 78, decimals: 1, initial: 54.2 },
  { key: "memory", label: "Memory", unit: "%", min: 41, max: 89, decimals: 1, initial: 67.8 },
  { key: "network", label: "Network", unit: "MB/s", min: 120, max: 980, decimals: 0, initial: 412 },
  { key: "latency", label: "Latency", unit: "ms", min: 12, max: 84, decimals: 0, initial: 34 },
];

export type ServerStatus = "online" | "degraded" | "offline";

export interface Server {
  id: string;
  name: string;
  ip: string;
  status: ServerStatus;
  uptime: number;
}

export const SERVERS: Server[] = [
  { id: "s1", name: "prod-api-01", ip: "10.0.1.21", status: "online", uptime: 99.98 },
  { id: "s2", name: "prod-api-02", ip: "10.0.1.22", status: "online", uptime: 99.92 },
  { id: "s3", name: "prod-db-01", ip: "10.0.2.11", status: "degraded", uptime: 99.41 },
  { id: "s4", name: "prod-db-02", ip: "10.0.2.12", status: "online", uptime: 99.99 },
  { id: "s5", name: "staging-web-01", ip: "10.0.3.5", status: "offline", uptime: 96.20 },
  { id: "s6", name: "edge-cdn-01", ip: "10.0.4.7", status: "online", uptime: 99.87 },
];

export type ActivityType = "info" | "success" | "warning" | "error";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  timestamp: number;
  message: string;
}

export const ACTIVITY_POOL: Omit<ActivityEvent, "id" | "timestamp">[] = [
  { type: "info", message: "Auth handshake completed" },
  { type: "success", message: "Deploy v2.41.0 finished" },
  { type: "warning", message: "Threshold exceeded on prod-api-02" },
  { type: "info", message: "Snapshot backup initiated" },
  { type: "success", message: "TLS cert renewed for api.cosmic.io" },
  { type: "error", message: "Anomaly detected on edge-cdn-01" },
  { type: "info", message: "Latency spike resolved" },
  { type: "success", message: "Pod restart completed" },
  { type: "warning", message: "Disk usage above 80% on prod-db-01" },
  { type: "info", message: "Cache warmed across 14 regions" },
];

export interface Endpoint {
  id: string;
  name: string;
  initialDbm: number;
  minDbm: number;
  maxDbm: number;
}

export const ENDPOINTS: Endpoint[] = [
  { id: "e1", name: "api.cosmic.io", initialDbm: -52, minDbm: -78, maxDbm: -38 },
  { id: "e2", name: "cdn.cosmic.io", initialDbm: -48, minDbm: -72, maxDbm: -34 },
  { id: "e3", name: "auth.cosmic.io", initialDbm: -61, minDbm: -84, maxDbm: -45 },
  { id: "e4", name: "db.cosmic.io", initialDbm: -55, minDbm: -80, maxDbm: -40 },
  { id: "e5", name: "ml.cosmic.io", initialDbm: -66, minDbm: -88, maxDbm: -50 },
  { id: "e6", name: "stream.cosmic.io", initialDbm: -58, minDbm: -82, maxDbm: -42 },
  { id: "e7", name: "mail.cosmic.io", initialDbm: -71, minDbm: -90, maxDbm: -55 },
  { id: "e8", name: "log.cosmic.io", initialDbm: -49, minDbm: -75, maxDbm: -36 },
];

export const SIDEBAR_NAV = [
  { icon: "Rocket", label: "Mission", active: true },
  { icon: "Server", label: "Servers" },
  { icon: "BarChart3", label: "Analytics" },
  { icon: "Bell", label: "Alerts" },
  { icon: "Network", label: "Network" },
  { icon: "FileText", label: "Logs" },
  { icon: "Settings", label: "Settings" },
] as const;
