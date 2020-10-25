export interface VersionResponse {
  daemon: string;
  version: string;
  sysname: string;
  release: string;
  machine: string;
}

export interface StatsResponse {
  uptime: {
    running: string;
    since: string;
  };
  workers: {
    total: string;
    idle: string;
    active: {
      critical: string;
      high: string;
      medium: string;
      low: string;
    };
  };
  queues: {
    critical: string;
    high: string;
    medium: string;
    low: string;
  };
  scheduled: string;
  ikesas: {
    total: string;
    'half-open': string;
  };
  plugins: string[];
  mallinfo: {
    sbrk: string;
    mmap: string;
    used: string;
    free: string;
  };
}

export interface ReloadSettingsResponse {
  success: string;
  errmsg?: string;
}
