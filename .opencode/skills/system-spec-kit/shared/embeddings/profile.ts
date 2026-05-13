// ---------------------------------------------------------------
// MODULE: Profile
// ---------------------------------------------------------------

import type { ParsedProfileSlug, ProfileJson } from '../types.js';

// ---------------------------------------------------------------
// 1. UTILITY FUNCTIONS
// ---------------------------------------------------------------

/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
export function createProfileSlug(provider: string, model: string, dim: number, dtype?: string | null): string {
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();

  const safeDtype = dtype
    ? dtype.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase()
    : null;

  return safeDtype
    ? `${provider}__${safeModel}__${dim}__${safeDtype}`
    : `${provider}__${safeModel}__${dim}`;
}

/** Parse profile slug back to components */
export function parseProfileSlug(slug: string): ParsedProfileSlug | null {
  const parts = slug.split('__');
  if (parts.length !== 3 && parts.length !== 4) return null;

  const dim = parseInt(parts[2], 10);
  if (isNaN(dim)) return null;

  return {
    provider: parts[0],
    model: parts[1],
    dim,
    dtype: parts[3] ?? null,
  };
}

// ---------------------------------------------------------------
// 2. EMBEDDING PROFILE CLASS
// ---------------------------------------------------------------

interface EmbeddingProfileOptions {
  provider: string;
  model: string;
  dim: number;
  dtype?: string | null;
  baseUrl?: string | null;
}

/** Provides embedding profile. */
export class EmbeddingProfile {
  provider: string;
  model: string;
  dim: number;
  dtype: string | null;
  baseUrl: string | null;
  slug: string;

  constructor({ provider, model, dim, dtype = null, baseUrl = null }: EmbeddingProfileOptions) {
    this.provider = provider;
    this.model = model;
    this.dim = dim;
    this.dtype = dtype;
    this.baseUrl = baseUrl;
    this.slug = createProfileSlug(provider, model, dim, dtype);
  }

  /** Get database path (legacy profile uses context-index.sqlite, others use slug) */
  getDatabasePath(baseDir: string): string {
    if (this.provider === 'hf-local' &&
        this.model.includes('nomic-embed-text') &&
        this.dim === 768 &&
        this.dtype === null) {
      return `${baseDir}/context-index.sqlite`;
    }
    return `${baseDir}/context-index__${this.slug}.sqlite`;
  }

  toFilename(): string {
    // dtype is part of the sqlite filename when present, preventing mixed-precision reuse.
    return `context-index__${this.slug}.sqlite`;
  }

  toDisplayString(): string {
    return this.dtype
      ? `${this.provider}:${this.model}:${this.dim}:${this.dtype}`
      : `${this.provider}:${this.model}:${this.dim}`;
  }

  equals(other: EmbeddingProfile): boolean {
    return this.provider === other.provider
      && this.model === other.model
      && this.dim === other.dim
      && this.dtype === other.dtype
      && this.baseUrl === other.baseUrl;
  }

  toJson(): ProfileJson {
    return {
      provider: this.provider,
      model: this.model,
      dim: this.dim,
      dtype: this.dtype,
      baseUrl: this.baseUrl,
      slug: this.slug,
    };
  }
}
