// ───────────────────────────────────────────────────────────────────
// MODULE: Provenance Reduction Identity
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type { ReductionIdentity } from './types.js';

function normalizedToken(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase('en-US').replace(/\s+/gu, ' ');
}

function normalizedRepositoryName(value: string): string {
  return normalizedToken(value)
    .replace(/^www\./u, '')
    .replace(/\.git$/u, '')
    .replace(/^\/+|\/+$/gu, '');
}

/** Normalize a repository locator without transport, query, fragment, or display casing. */
export function normalizeRepositoryUrl(value: string): string {
  const candidate = value.normalize('NFKC').trim();
  const withScheme = /^[a-z][a-z\d+.-]*:\/\//iu.test(candidate)
    ? candidate
    : `https://${candidate}`;
  const parsed = new URL(withScheme);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new TypeError('Repository identity URL must use HTTP or HTTPS');
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    throw new TypeError('Repository identity URL cannot contain credentials');
  }
  const host = parsed.hostname.toLocaleLowerCase('en-US').replace(/^www\./u, '');
  const port = (parsed.protocol === 'http:' && parsed.port === '80')
    || (parsed.protocol === 'https:' && parsed.port === '443')
    ? ''
    : parsed.port;
  const pathname = decodeURIComponent(parsed.pathname)
    .normalize('NFKC')
    .replace(/\/{2,}/gu, '/')
    .replace(/\.git\/?$/iu, '')
    .replace(/^\/+|\/+$/gu, '')
    .toLocaleLowerCase('en-US');
  return `${host}${port.length > 0 ? `:${port}` : ''}${pathname.length > 0 ? `/${pathname}` : ''}`;
}

/** Derive the versioned exact identity used for deterministic deduplication. */
export function canonicalIdentityKey(identity: ReductionIdentity): string {
  if (identity.type === 'claim') {
    const namespace = normalizedToken(identity.namespace);
    const stableId = normalizedToken(identity.stableId);
    if (namespace.length === 0 || stableId.length === 0) {
      throw new TypeError('Claim identity requires namespace and stable ID');
    }
    return `claim@1:${namespace}:${stableId}`;
  }

  if (identity.url !== null && identity.url.trim().length > 0) {
    return `repository@1:${normalizeRepositoryUrl(identity.url)}`;
  }
  if (identity.repositoryName !== null) {
    const repositoryName = normalizedRepositoryName(identity.repositoryName);
    if (repositoryName.length > 0) return `repository@1:${repositoryName}`;
  }
  throw new TypeError('Repository identity requires a URL or canonical repository name');
}

/** Collapse case variants of one model family into a single effective source bucket. */
export function normalizeSourceBucketId(modelFamily: string): string {
  const normalized = normalizedToken(modelFamily);
  if (!/^[a-z0-9][a-z0-9._-]*$/u.test(normalized)) {
    throw new TypeError('Model family must use letters, digits, dots, underscores, or hyphens');
  }
  return `model-family:${normalized}`;
}

/** Hash a value through the runtime's bounded canonical JSON representation. */
export function stableDigest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}
