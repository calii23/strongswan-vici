import {Section} from './general';

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
