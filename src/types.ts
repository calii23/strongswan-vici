export {VersionResponse as Version} from './protocol/packet';

export interface ByPriority {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface WorkersStats {
  total: number;
  running: number;
  idle: number;
  activeByPriority: ByPriority;
}

export interface MemoryStats {
  nomMappedSpace: number;
  mappedSpace: number;
  /**
   * Total bytes of used memory
   */
  used: number;
  /**
   * Unused but available bytes
   */
  free: number;
}

export interface Stats {
  /**
   * Absolute startup time
   */
  runningSince: Date;
  /**
   * Stats about worker threads
   */
  workers: WorkersStats;

  queues: number;
  queuesByPriority: ByPriority;

  /**
   * Total number of IKE_SAs active
   */
  ikeSas: number;
  /**
   * Number of IKE_SAs in half-open state
   */
  ikeSasHalfOpen: number;

  memory: MemoryStats;
}

export interface ReloadSettingsStatus {
  success: boolean;
  error?: string;
}
