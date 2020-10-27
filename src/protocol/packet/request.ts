export interface RawInitiateRequest {
  /**
   * CHILD_SA configuration name to initiate
   */
  child?: string;
  /**
   * IKE_SA configuration name to initiate or to find child under
   */
  ike?: string;
  /**
   * timeout in ms before returning
   */
  timeout?: string;
  /**
   * whether limits may prevent initiating the CHILD_SA
   */
  'init-limits'?: string;
  /**
   * loglevel to issue "control-log" events for
   */
  loglevel?: string;
}

export interface RawTerminateRequest {
  /**
   * terminate a CHILD_SA by configuration name
   */
  child?: string;
  /**
   * terminate an IKE_SA by configuration name
   */
  ike?: string;
  /**
   * terminate a CHILD_SA by its reqid
   */
  'child-id'?: string;
  /**
   * terminate an IKE_SA by its unique id
   */
  'ike-id'?: string;
  /**
   * terminate IKE_SA without waiting for proper DELETE, if timeout is given, waits for a response until it is reached
   */
  force?: string;
  /**
   * timeout in ms before returning, see below
   */
  timeout?: string;
  /**
   * loglevel to issue "control-log" events for
   */
  loglevel?: string;
}

export interface RawRekeyRequest {
  /**
   * rekey a CHILD_SA by configuration name
   */
  child?: string;
  /**
   * rekey an IKE_SA by configuration name
   */
  ike?: string;
  /**
   * rekey a CHILD_SA by its reqid
   */
  'child-id'?: string;
  /**
   * rekey an IKE_SA by its unique id
   */
  'ike-id'?: string;
  /**
   * reauthenticate instead of rekey an IKEv2 SA
   */
  reauth?: string;
}

export interface RawRedirectRequest {
  /**
   * redirect an IKE_SA by configuration name
   */
  ike?: string;
  /**
   * redirect an IKE_SA by its unique id
   */
  'ike-id'?: string;
  /**
   * redirect an IKE_SA with matching peer IP, may also be a subnet in CIDR notation or an IP range
   */
  'peer-ip'?: string;
  /**
   * redirect an IKE_SA with matching peer identity, may contain wildcards
   */
  'peer-id'?: string;
}

export interface RawInstallRequest {
  /**
   * CHILD_SA configuration name to install
   */
  child?: string;
  /**
   * optional IKE_SA configuration name to find child under
   */
  ike?: string;
}

export interface RawUninstallRequest {
  /**
   * CHILD_SA configuration name to install
   */
  child?: string;
  /**
   * optional IKE_SA configuration name to find child under, if not given the first policy matching child is removed
   */
  ike?: string;
}

export interface RawListSasRequest {
  /**
   * use non-blocking mode if key is set
   */
  noblock?: string;
  /**
   * filter listed IKE_SAs by its name
   */
  ike?: string;
  /**
   * filter listed IKE_SA by its unique id
   */
  'ike-id'?: string;
}

export interface RawListPoliciesRequest {
  /**
   * set to yes to list drop policies
   */
  drop?: string;
  /**
   * set to yes to list bypass policies
   */
  pass?: string;
  /**
   * set to yes to list trap policies
   */
  trap?: string;
  /**
   * filter by CHILD_SA configuration name
   */
  child?: string;
  /**
   * filter by IKE_SA configuration name
   */
  ike?: string;
}

export interface RawListConnsRequest {
  /**
   * list connections matching a given configuration name only
   */
  ike?: string;
}

export interface RawListCertsRequest {
  /**
   * certificate type to filter for, X509|X509_AC|X509_CRL| OCSP_RESPONSE|PUBKEY  or ANY
   */
  type?: string;
  /**
   * X.509 certificate flag to filter for, NONE|CA|AA|OCSP or ANY
   */
  flag?: string;
  /**
   * set to list only certificates having subject
   */
  subject?: string;
}

export interface RawListAuthoritiesRequest {
  /**
   * list certification authority of a given name
   */
  name?: string;
}

export interface RawLoadConnRequest {
  [IKE_SAConfigName: string]: {
  };
}

export interface RawUnloadConnRequest {
  /**
   * IKE_SA config name
   */
  name?: string;
}

export interface RawLoadCertRequest {
  /**
   * certificate type, X509|X509_AC|X509_CRL
   */
  type?: 'X509' | 'X509_AC' | 'X509_CRL';
  /**
   * X.509 certificate flag, NONE|CA|AA|OCSP
   */
  flag?: 'NONE' | 'CA' | 'AA' | 'OCSP';
  /**
   * PEM or DER encoded certificate data
   */
  data?: string;
}

export interface RawLoadKeyRequest {
  /**
   * private key type, rsa|ecdsa|bliss|any
   */
  type?: 'rsa' | 'ecdsa' | 'bliss' | 'any';
  /**
   * PEM or DER encoded key data
   */
  data?: string;
}

export interface RawUnloadKeyRequest {
  /**
   * hex-encoded SHA-1 key identifier of the private key to unload
   */
  id?: string;
}

export interface RawLoadTokenRequest {
  /**
   * hex-encoded CKA_ID of the private key on token
   */
  handle?: string;
  /**
   * optional slot number
   */
  slot?: string;
  /**
   * optional PKCS#11 module
   */
  module?: string;
  /**
   * optional PIN to access the key, has to be provided via other means if not given
   */
  pin?: string;
}

export interface RawLoadSharedRequest {
  /**
   * optional unique identifier of this shared key
   */
  id?: string;
  /**
   * shared key type, IKE|EAP|XAUTH|NTLM
   */
  type?: 'IKE' | 'EAP' | 'XAUTH' | 'NTLM';
  /**
   * raw shared key data
   */
  data?: string;
  /**
   * list of shared key owner identities
   */
  owners?: string[];
}

export interface RawUnloadSharedRequest {
  /**
   * unique identifier of the shared key to unload
   */
  id?: string;
}

export interface RawFlushCertsRequest {
  /**
   * certificate type to filter for, X509|X509_AC|X509_CRL| OCSP_RESPONSE|PUBKEY or ANY
   */
  type?: string;
}

export interface RawLoadAuthorityRequest {
  [certificationAuthorityName: string]: {
  };
}

export interface RawUnloadAuthorityRequest {
  /**
   * certification authority name
   */
  name?: string;
}

export interface RawLoadPoolRequest {
  [poolName: string]: {
    /**
     * subnet of virtual IP pool addresses
     */
    // addrs?: string;
    /**
     * list of attributes for type
     */
    [attributeType: string]: string | string[];
  };
}

export interface RawUnloadPoolRequest {
  /**
   * virtual IP address pool to delete
   */
  name?: string;
}

export interface RawGetPoolsRequest {
  /**
   * set to yes to include leases
   */
  leases?: string;
  /**
   * optional name of the pool to query
   */
  name?: string;
}

export interface RawGetCountersRequest {
  /**
   * optional connection name, omit for global counters
   */
  name?: string;
  /**
   * yes to get counters for all connections, name is ignored
   */
  all?: string;
}

export interface RawResetCountersRequest {
  /**
   * optional connection name, omit for global counters
   */
  name?: string;
  /**
   * yes to reset counters for all connections, name is ignored
   */
  all?: string;
}
