import {ByPriority, ControlLogEvent, LogEvent, LogLevel, ReloadSettingsStatus, Stats} from '../types';

export * from './request';
export * from './response';

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

export interface RawControlLogEvent {
  group: string;
  level: string;
  'ikesa-name': string;
  'ikesa-uniqued': string;
  msg: string;
}

export interface RawLogEvent extends RawControlLogEvent {
  thread: string;
}

export interface RawSaConfigurationSection {
  /**
   * IKE_SA unique identifier
   */
  uniqueid: string;
  /**
   * IKE version, 1 or 2
   */
  version: string;
  /**
   * IKE_SA state name
   */
  state: string;
  /**
   * local IKE endpoint address
   */
  'local-host': string;
  /**
   * local IKE endpoint port
   */
  'local-port': string;
  /**
   * local IKE identity
   */
  'local-id': string;
  /**
   * remote IKE endpoint address
   */
  'remote-host': string;
  /**
   * remote IKE endpoint port
   */
  'remote-port': string;
  /**
   * remote IKE identity
   */
  'remote-id': string;
  /**
   * remote XAuth identity, if XAuth-authenticated
   */
  'remote-xauth-id': string;
  /**
   * remote EAP identity, if EAP-authenticated
   */
  'remote-eap-id': string;
  /**
   * yes, if initiator of IKE_SA
   */
  initiator: string;
  /**
   * hex encoded initiator SPI / cookie
   */
  'initiator-spi': string;
  /**
   * hex encoded responder SPI / cookie
   */
  'responder-spi': string;
  /**
   * yes, if local endpoint is behind a NAT
   */
  'nat-local': string;
  /**
   * yes, if remote endpoint is behind a NAT
   */
  'nat-remote': string;
  /**
   * yes, if NAT situation has been faked as responder
   */
  'nat-fake': string;
  /**
   * yes, if any endpoint is behind a NAT (also if faked)
   */
  'nat-any': string;
  /**
   * hex encoded default inbound XFRM interface ID
   */
  'if-id-in': string;
  /**
   * hex encoded default outbound XFRM interface ID
   */
  'if-id-out': string;
  /**
   * IKE encryption algorithm string
   */
  'encr-alg': string;
  /**
   * key size for encr-alg, if applicable
   */
  'encr-keysize': string;
  /**
   * IKE integrity algorithm string
   */
  'integ-alg': string;
  /**
   * key size for encr-alg, if applicable
   */
  'integ-keysize': string;
  /**
   * IKE pseudo random function string
   */
  'prf-alg': string;
  /**
   * IKE Diffie-Hellman group string
   */
  'dh-group': string;
  /**
   * seconds the IKE_SA has been established
   */
  established: string;
  /**
   * seconds before IKE_SA gets rekeyed
   */
  'rekey-time': string;
  /**
   * seconds before IKE_SA gets re-authenticated
   */
  'reauth-time': string;
  /**
   * list of virtual IPs assigned by the remote peer, installed locally
   */
  'local-vips': string[];
  /**
   * list of virtual IPs assigned to the remote peer
   */
  'remote-vips': string[];
  /**
   * list of currently queued tasks for execution
   */
  'tasks-queued': string[];
  /**
   * list of tasks currently initiating actively
   */
  'tasks-active': string[];
  /**
   * list of tasks currently handling passively
   */
  'tasks-passive': string[];
  'child-sas': {
    '<unique child-sa-name>*': {
      /**
       * name of the CHILD_SA
       */
      name: string;
      /**
       * unique CHILD_SA identifier
       */
      uniqueid: string;
      /**
       * reqid of CHILD_SA
       */
      reqid: string;
      /**
       * state string of CHILD_SA
       */
      state: string;
      /**
       * IPsec mode, tunnel|transport|beet
       */
      mode: string;
      /**
       * IPsec protocol AH|ESP
       */
      protocol: string;
      /**
       * yes if using UDP encapsulation
       */
      encap: string;
      /**
       * hex encoded inbound SPI
       */
      'spi-in': string;
      /**
       * hex encoded outbound SPI
       */
      'spi-out': string;
      /**
       * hex encoded inbound CPI, if using compression
       */
      'cpi-in': string;
      /**
       * hex encoded outbound CPI, if using compression
       */
      'cpi-out': string;
      /**
       * hex encoded inbound Netfilter mark value
       */
      'mark-in': string;
      /**
       * hex encoded inbound Netfilter mark mask
       */
      'mark-mask-in': string;
      /**
       * hex encoded outbound Netfilter mark value
       */
      'mark-out': string;
      /**
       * hex encoded outbound Netfilter mark mask
       */
      'mark-mask-out': string;
      /**
       * hex encoded inbound XFRM interface ID
       */
      'if-id-in': string;
      /**
       * hex encoded outbound XFRM interface ID
       */
      'if-id-out': string;
      /**
       * ESP encryption algorithm name, if any
       */
      'encr-alg': string;
      /**
       * ESP encryption key size, if applicable
       */
      'encr-keysize': string;
      /**
       * ESP or AH integrity algorithm name, if any
       */
      'integ-alg': string;
      /**
       * ESP or AH integrity key size, if applicable
       */
      'integ-keysize': string;
      /**
       * CHILD_SA pseudo random function name
       */
      'prf-alg': string;
      /**
       * CHILD_SA PFS rekeying DH group name, if any
       */
      'dh-group': string;
      /**
       * 1 if using extended sequence numbers
       */
      esn: string;
      /**
       * number of input bytes processed
       */
      'bytes-in': string;
      /**
       * number of input packets processed
       */
      'packets-in': string;
      /**
       * seconds since last inbound packet, if any
       */
      'use-in': string;
      /**
       * number of output bytes processed
       */
      'bytes-out': string;
      /**
       * number of output packets processed
       */
      'packets-out': string;
      /**
       * seconds since last outbound packet, if any
       */
      'use-out': string;
      /**
       * seconds before CHILD_SA gets rekeyed
       */
      'rekey-time': string;
      /**
       * seconds before CHILD_SA expires
       */
      'life-time': string;
      /**
       * seconds the CHILD_SA has been installed
       */
      'install-time': string;
      /**
       * list of local traffic selectors
       */
      'local-ts': string[];
      /**
       * list of remote traffic selectors
       */
      'remote-ts': string[];
    };
  };
}

export interface RawListSaEvent {
  [IKE_SAConfigName: string]: RawSaConfigurationSection;
}

export interface RawListPolicyEvent {
  [ikeSaConfigNameChildSaConfigName: string]: {
    /**
     * CHILD_SA configuration name
     */
    child: string;
    /**
     * IKE_SA configuration name or namespace, if available
     */
    ike: string;
    /**
     * policy mode, tunnel|transport|pass|drop
     */
    mode: 'tunnel' | 'transport' | 'pass' | 'drop';
    /**
     * list of local traffic selectors
     */
    'local-ts': string[];
    /**
     * list of remote traffic selectors
     */
    'remote-ts': string[];
  };
}

export interface RawAuthSection {
  /**
   * authentication type
   */
  class: string;
  /**
   * EAP type to authenticate if when using EAP
   */
  'eap-type': string;
  /**
   * EAP vendor for type, if any
   */
  'eap-vendor': string;
  /**
   * xauth backend name
   */
  xauth: string;
  /**
   * revocation policy
   */
  revocation: string;
  /**
   * IKE identity
   */
  id: string;
  /**
   * AAA authentication backend identity
   */
  aaa_id: string;
  /**
   * EAP identity for authentication
   */
  eap_id: string;
  /**
   * XAuth username for authentication
   */
  xauth_id: string;
  /**
   * group membership required to use connection
   */
  groups: string[];
  /**
   * certificates allowed for authentication
   */
  certs: string[];
  /**
   * CA certificates allowed for authentication
   */
  cacerts: string[];
}

export interface RawListConnEvent {
  [IKE_SAConnectionName: string]: {
    /**
     * list of valid local IKE endpoint addresses
     */
    local_addrs: string[];
    /**
     * list of valid remote IKE endpoint addresses
     */
    remote_addrs: string[];
    /**
     * IKE version as string, IKEv1|IKEv2 or 0 for any
     */
    version: 'IKEv1' | 'IKEv2' | '0';
    /**
     * IKE_SA reauthentication interval in seconds
     */
    reauth_time: string;
    /**
     * IKE_SA rekeying interval in seconds
     */
    rekey_time: string;
    /**
     * multiple local auth sections
     */
    local: RawAuthSection;
    /**
     * multiple remote auth sections
     */
    remote: RawAuthSection;
    children: {
      [CHILD_SAConfigName: string]: {
        /**
         * IPsec mode
         */
        mode: string;
        /**
         * CHILD_SA rekeying interval in seconds
         */
        rekey_time: string;
        /**
         * CHILD_SA rekeying interval in bytes
         */
        rekey_bytes: string;
        /**
         * CHILD_SA rekeying interval in packets
         */
        rekey_packets: string;
        /**
         * list of local traffic selectors
         */
        'local-ts': string[];
        /**
         * list of remote traffic selectors
         */
        'remote-ts': string[];
      };
    };
  };
}

export interface RawListCertEvent {
  /**
   * certificate type, X509|X509_AC|X509_CRL|OCSP_RESPONSE|PUBKEY
   */
  type: 'X509' | 'X509_AC' | 'X509_CRL' | 'OCSP_RESPONSE' | 'PUBKEY';
  /**
   * X.509 certificate flag, NONE|CA|AA|OCSP
   */
  flag: 'NONE' | 'CA' | 'AA' | 'OCSP';
  /**
   * set if a private key for the certificate is available
   */
  has_privkey: string;
  /**
   * ASN1 encoded certificate data
   */
  data: string;
  /**
   * subject string if defined and certificate type is PUBKEY
   */
  subject: string;
  /**
   * time string if defined and certificate type is PUBKEY
   */
  'not-before': string;
  /**
   * time string if defined and certificate type is PUBKEY
   */
  'not-after': string;
}

export interface RawListAuthorityEvent {
  [certificationAuthorityName: string]: {
    /**
     * subject distinguished name of CA certificate
     */
    cacert: string;
    /**
     * CRL URI (http, ldap or file)
     */
    crl_uris: string[];
    /**
     * OCSP URI (http)
     */
    ocsp_uris: string[];
  };
}

export interface RawIkeUpdownEvent {
  /**
   * set if up event
   */
  up?: string;

  /**
   * string | undefined is only in the type signature to satisfy typescript
   */
  [IKE_SAConfigName: string]: Omit<RawSaConfigurationSection, 'child-sas'> | string | undefined;
}

export interface RawIkeRekeyEvent {
  [IKE_SAConfigName: string]: {
    old: Omit<RawSaConfigurationSection, 'child-sas'>;
    new: Omit<RawSaConfigurationSection, 'child-sas'>;
  }
}

export interface RawChildUpdownEvent {
  /**
   * set if up event
   */
  up?: string;

  /**
   * string | undefined is only in the type signature to satisfy typescript
   * same data as in the list-sas event, but with only the affected CHILD_SA in the child-sas section
   */
  [IKE_SAConfigName: string]: RawSaConfigurationSection | string | undefined;
}

export interface RawChildRekeyEvent {
  [IKE_SAConfigName: string]: {
    /**
     * same data as in the list-sas event, but with the child-sas section as follows
     */
    'child-sas': {
      [childSaName: string]: {
        old: Omit<RawSaConfigurationSection, 'child-sas'>;
        new: Omit<RawSaConfigurationSection, 'child-sas'>;
      }
    }
  }
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

export function convertControlLog(raw: RawControlLogEvent): ControlLogEvent {
  const event: ControlLogEvent = {
    group: raw.group,
    level: parseInt(raw.level) as LogLevel,
    message: raw.msg
  };

  if (raw['ikesa-name']) {
    event.ikeSa = {
      name: raw['ikesa-name'],
      id: raw['ikesa-uniqued']
    };
  }

  return event;
}

export function convertLog(raw: RawLogEvent): LogEvent {
  return {
    ...convertControlLog(raw),
    thread: parseInt(raw.thread)
  };
}
