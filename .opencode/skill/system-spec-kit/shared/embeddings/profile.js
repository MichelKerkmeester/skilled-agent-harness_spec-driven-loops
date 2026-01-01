// ───────────────────────────────────────────────────────────────
// PROFILE.JS: Embedding profile class and slug utilities
// ───────────────────────────────────────────────────────────────
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. UTILITY FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
function create_profile_slug(provider, model, dim) {
  const safe_model = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
  
  return `${provider}__${safe_model}__${dim}`;
}

/** Parse profile slug back to components */
function parse_profile_slug(slug) {
  const parts = slug.split('__');
  if (parts.length !== 3) return null;
  
  const dim = parseInt(parts[2], 10);
  if (isNaN(dim)) return null;
  
  return {
    provider: parts[0],
    model: parts[1],
    dim,
  };
}

/* ───────────────────────────────────────────────────────────────
   2. EMBEDDING PROFILE CLASS
   ─────────────────────────────────────────────────────────────── */

class EmbeddingProfile {
  constructor({ provider, model, dim, baseUrl = null }) {
    this.provider = provider;
    this.model = model;
    this.dim = dim;
    this.base_url = baseUrl;
    this.slug = create_profile_slug(provider, model, dim);
  }

  /** Get database path (legacy profile uses context-index.sqlite, others use slug) */
  get_database_path(base_dir) {
    if (this.provider === 'hf-local' && 
        this.model.includes('nomic-embed-text') && 
        this.dim === 768) {
      return `${base_dir}/context-index.sqlite`;
    }
    return `${base_dir}/context-index__${this.slug}.sqlite`;
  }

  to_string() {
    return `${this.provider}:${this.model}:${this.dim}`;
  }

  to_json() {
    return {
      provider: this.provider,
      model: this.model,
      dim: this.dim,
      base_url: this.base_url,
      slug: this.slug,
    };
  }
}

module.exports = {
  EmbeddingProfile,
  create_profile_slug,
  parse_profile_slug,
};
