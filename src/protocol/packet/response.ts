import {Section} from '../general';

export interface VersionResponse {
  /**
   * IKE daemon name
   */
  daemon: string;
  /**
   * strongSwan version
   */
  version: string;
  /**
   * operating system name
   */
  sysname: string;
  /**
   * operating system release
   */
  release: string;
  /**
   * hardware identifier
   */
  machine: string;
}

export interface RawStatsResponse {
  uptime: {
    /**
     * relative uptime in human-readable form
     */
    running: string;
    /**
     * absolute startup time
     */
    since: string;
  };
  workers: {
    /**
     * total number of worker threads
     */
    total: string;
    /**
     * worker threads currently idle
     */
    idle: string;
    active: {
      /**
       * threads processing "critical" priority jobs
       */
      critical: string;
      /**
       * threads processing "high" priority jobs
       */
      high: string;
      /**
       * threads processing "medium" priority jobs
       */
      medium: string;
      /**
       * threads processing "low" priority jobs
       */
      low: string;
    };
  };
  queues: {
    /**
     * jobs queued with "critical" priority
     */
    critical: string;
    /**
     * jobs queued with "high" priority
     */
    high: string;
    /**
     * jobs queued with "medium" priority
     */
    medium: string;
    /**
     * jobs queued with "low" priority
     */
    low: string;
  };
  /**
   * number of jobs scheduled for timed execution
   */
  scheduled: string;
  ikesas: {
    /**
     * total number of IKE_SAs active
     */
    total: string;
    /**
     * number of IKE_SAs in half-open state
     */
    'half-open': string;
  };
  /**
   * names of loaded plugins
   */
  plugins: string[];
  /**
   * available with mallinfo() support
   */
  mallinfo: {
    /**
     * non-mmaped space available
     */
    sbrk: string;
    /**
     * mmaped space available
     */
    mmap: string;
    /**
     * total number of bytes used
     */
    used: string;
    /**
     * available but unused bytes
     */
    free: string;
  };
}

export interface ReloadSettingsResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg?: string;
}

export interface RawInitiateResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure or timeout
   */
  errmsg: string;
}

export interface RawTerminateResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * number of matched SAs
   */
  matches: string;
  /**
   * number of terminated SAs
   */
  terminated: string;
  /**
   * error string on failure or timeout
   */
  errmsg: string;
}

export interface RawRekeyResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * number of matched SAs
   */
  matches: string;
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawRedirectResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * number of matched SAs
   */
  matches: string;
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawInstallResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawUninstallResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawGetConnsResponse {
  /**
   * list of connection names
   */
  conns: string[];
}

export interface RawGetAuthoritiesResponse {
  /**
   * list of certification authority names
   */
  authorities: string[];
}

export interface RawLoadConnResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawUnloadConnResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawLoadCertResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawLoadKeyResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
  /**
   * hex-encoded SHA-1 key identifier of the public key on success
   */
  id: string;
}

export interface RawUnloadKeyResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawGetKeysResponse {
  /**
   * list of hex-encoded SHA-1 key identifiers
   */
  keys: string[];
}

export interface RawLoadTokenResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
  /**
   * hex-encoded SHA-1 key identifier of the public key on success
   */
  id: string;
}

export interface RawLoadSharedResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawUnloadSharedResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawGetSharedResponse {
  /**
   * list of unique identifiers
   */
  keys: string[];
}

export interface RawFlushCertsResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawClearCredsResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawLoadAuthorityResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawUnloadAuthorityResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawLoadPoolResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawUnloadPoolResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}

export interface RawGetPoolsResponse {
  [poolName: string]: {
    /**
     * virtual IP pool base address
     */
    base: string;
    /**
     * total number of addresses in the pool
     */
    size: string;
    /**
     * number of leases online
     */
    online: string;
    /**
     * number of leases offline
     */
    offline: string;
    leases: {
      [zeroBasedIndex: string]: {
        /**
         * IP address
         */
        address: string;
        /**
         * assigned identity
         */
        identity: string;
        /**
         * online|offline
         */
        status: 'online' | 'offline';
      };
    };
  };
}

export interface RawGetAlgorithmsResponse {
  [algorithmType: string]: {
    /**
     * plugin providing the implementation
     */
    [algorithm: string]: string;
  };
}

export interface RawGetCountersResponse {
  counters: {
    [nameOrEmptyForGlobalCounters: string]: Section;
  } & {
    /**
     * yes or no
     */
    success: 'yes' | 'no';
    /**
     * error string on failure
     */
    errmsg: string;
  };
}

export interface RawResetCountersResponse {
  /**
   * yes or no
   */
  success: 'yes' | 'no';
  /**
   * error string on failure
   */
  errmsg: string;
}
