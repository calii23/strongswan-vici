import {ByPriority, ReloadSettingsStatus, Stats} from '../types';

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

function toByPriority(raw: StatsResponse['queues']): ByPriority {
  return {
    critical: parseInt(raw.critical),
    high: parseInt(raw.high),
    medium: parseInt(raw.medium),
    low: parseInt(raw.low)
  };
}

export function convertStats(response: StatsResponse): Stats {
  const workersByPriority = toByPriority(response.workers.active);
  const queuesByPriority = toByPriority(response.queues);

  return {
    runningSince: new Date(response.uptime.since),
    workers: {
      total: parseInt(response.workers.total),
      running: Object.values(workersByPriority).reduce((a, b) => a + b),
      idle: parseInt(response.workers.idle),
      activeByPriority: workersByPriority
    },
    queues: Object.values(queuesByPriority).reduce((a, b) => a + b),
    queuesByPriority,
    ikeSas: parseInt(response.ikesas.total),
    ikeSasHalfOpen: parseInt(response.ikesas['half-open']),
    memory: {
      nomMappedSpace: parseInt(response.mallinfo.sbrk),
      mappedSpace: parseInt(response.mallinfo.mmap),
      used: parseInt(response.mallinfo.used),
      free: parseInt(response.mallinfo.free)
    }
  };
}

export function convertReloadSettings(response: ReloadSettingsResponse): ReloadSettingsStatus {
  const success = response.success === 'yes';
  if (response.errmsg) {
    return {
      success,
      error: response.errmsg
    };
  } else {
    return {success};
  }
}
