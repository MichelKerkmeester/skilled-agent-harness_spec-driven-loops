// ───────────────────────────────────────────────────────────────────
// MODULE: Default Provider Transports
// ───────────────────────────────────────────────────────────────────

import type {
  ProviderTransport,
  ProviderWireRequest,
  ProviderWireResponse,
} from '../providers/types.js';

/** Minimal response surface the transport needs from any HTTP client. */
export interface HttpTransportResponse {
  readonly status: number;
  readonly text: () => Promise<string>;
}

/** Structural fetch boundary satisfied by globalThis.fetch and test doubles. */
export interface HttpFetchInit {
  method: 'POST';
  headers: Record<string, string>;
  body: string;
  signal: AbortSignal;
}

/** HTTP client boundary kept structural so the transport runs without a real socket. */
export type HttpFetch = (
  url: string,
  init: HttpFetchInit,
) => Promise<HttpTransportResponse>;

/** Resolves an opaque credential reference into a bearer token, or null when absent. */
export type CredentialResolver = (
  reference: string,
  signal: AbortSignal,
) => Promise<string | null>;

/** Shared options for the default transports. */
export interface HttpTransportOptions {
  readonly fetchImpl?: HttpFetch;
  readonly credentialResolver?: CredentialResolver;
}

const NONE_REFERENCE_PREFIX = 'none:';
const ENV_REFERENCE_PREFIX = 'env:';

const defaultFetch: HttpFetch = (url, init) => globalThis.fetch(url, init);

/** Resolve env: references from the process; leave platform-managed references null. */
export const defaultCredentialResolver: CredentialResolver = async (reference) => {
  if (reference.startsWith(ENV_REFERENCE_PREFIX)) {
    const value = process.env[reference.slice(ENV_REFERENCE_PREFIX.length)];
    return value === undefined || value.length === 0 ? null : value;
  }
  return null;
};

/** Transport for hosted providers that attaches a resolved bearer credential. */
export function createHostedHttpTransport(
  options: HttpTransportOptions = {},
): ProviderTransport {
  const fetchImpl = options.fetchImpl ?? defaultFetch;
  const resolver = options.credentialResolver ?? defaultCredentialResolver;
  return async (request: ProviderWireRequest): Promise<ProviderWireResponse> => {
    const token = await resolver(request.credentialReference, request.signal);
    if (token === null) {
      return { status: 401, body: null };
    }
    return postJson(fetchImpl, request, { authorization: `Bearer ${token}` });
  };
}

/** Transport for local model endpoints that never attaches a credential. */
export function createLocalHttpTransport(
  options: HttpTransportOptions = {},
): ProviderTransport {
  const fetchImpl = options.fetchImpl ?? defaultFetch;
  return async (request: ProviderWireRequest): Promise<ProviderWireResponse> =>
    postJson(fetchImpl, request, {});
}

/** One transport that routes local references to the no-auth path, else hosted. */
export function createDefaultProviderTransport(
  options: HttpTransportOptions = {},
): ProviderTransport {
  const hosted = createHostedHttpTransport(options);
  const local = createLocalHttpTransport(options);
  return (request: ProviderWireRequest): Promise<ProviderWireResponse> =>
    isLocalReference(request.credentialReference) ? local(request) : hosted(request);
}

function isLocalReference(reference: string): boolean {
  return reference.startsWith(NONE_REFERENCE_PREFIX);
}

async function postJson(
  fetchImpl: HttpFetch,
  request: ProviderWireRequest,
  headers: Record<string, string>,
): Promise<ProviderWireResponse> {
  const response = await fetchImpl(request.endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(request.body),
    signal: request.signal,
  });
  const text = await response.text();
  return { status: response.status, body: parseBody(text) };
}

function parseBody(text: string): unknown {
  if (text.length === 0) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
