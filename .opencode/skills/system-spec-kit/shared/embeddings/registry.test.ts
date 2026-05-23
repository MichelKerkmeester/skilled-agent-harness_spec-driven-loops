// ───────────────────────────────────────────────────────────────────
// MODULE: Registry — canonical-fallback invariant tests (ADR-013/014)
// ───────────────────────────────────────────────────────────────────
// Runner: `node --experimental-vm-modules .../registry.test.js` after tsc.
// Standalone assertions (no Vitest dependency) — mirrors the
// boolean-expr.test.ts + quality-extractors.test.ts convention in
// sibling directories.
//
// What this locks in:
// - MANIFESTS[0] is the canonical model per ADR-013/014 operator override.
// - getCanonicalFallback('ollama') returns MANIFESTS[0].name.
// - getCanonicalFallback('hf-local') returns the HF path form ('nomic-ai/<name>').
// - getCanonicalFallback('voyage' | 'openai') returns the documented cloud strings.
// - The function NEVER returns the legacy BAAI/bge-base-en or jina default
//   (catches stale-default regressions before they hit production).
// ---------------------------------------------------------------

import {
  EmbedderNotConfiguredError,
  getCanonicalFallback,
  listManifests,
  MANIFESTS,
} from './registry.js';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    console.error(`FAIL: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`  ok: ${label}`);
  }
}

const ADR_CANONICAL_NAME = 'nomic-embed-text-v1.5';
const ADR_HF_LOCAL_FORM = 'nomic-ai/nomic-embed-text-v1.5';
const LEGACY_BANNED = [
  'BAAI/bge-base-en-v1.5',
  'BAAI/bge-base-en',
  'jina-embeddings-v3',
];

console.log('=== registry.test: canonical-fallback invariants ===');

// 1. MANIFESTS is non-empty (required for local-provider derivation)
assert(MANIFESTS.length > 0, 'MANIFESTS is non-empty');
assert(listManifests().length === MANIFESTS.length, 'listManifests matches MANIFESTS');

// 2. MANIFESTS[0] matches ADR-013/014 consensus
assert(
  MANIFESTS[0]?.name === ADR_CANONICAL_NAME,
  `MANIFESTS[0].name === '${ADR_CANONICAL_NAME}' (ADR-013/014 operator override)`,
);
assert(MANIFESTS[0]?.dim === 768, 'MANIFESTS[0].dim === 768');
assert(MANIFESTS[0]?.backend === 'ollama', "MANIFESTS[0].backend === 'ollama'");

// 3. getCanonicalFallback derives from MANIFESTS[0] for local providers
assert(
  getCanonicalFallback('ollama') === ADR_CANONICAL_NAME,
  `getCanonicalFallback('ollama') === '${ADR_CANONICAL_NAME}'`,
);
assert(
  getCanonicalFallback('hf-local') === ADR_HF_LOCAL_FORM,
  `getCanonicalFallback('hf-local') === '${ADR_HF_LOCAL_FORM}'`,
);

// 4. Cloud providers return their documented canonical strings
assert(
  getCanonicalFallback('voyage') === 'voyage-code-3',
  "getCanonicalFallback('voyage') === 'voyage-code-3'",
);
assert(
  getCanonicalFallback('openai') === 'text-embedding-3-small',
  "getCanonicalFallback('openai') === 'text-embedding-3-small'",
);

// 5. Regression guard: no caller ever gets a legacy/banned default
for (const provider of ['ollama', 'hf-local', 'voyage', 'openai'] as const) {
  const result = getCanonicalFallback(provider);
  for (const banned of LEGACY_BANNED) {
    assert(
      !result.includes(banned),
      `getCanonicalFallback('${provider}') does NOT return banned legacy '${banned}'`,
    );
  }
}

// 6. EmbedderNotConfiguredError is exported and inherits from Error
assert(
  new EmbedderNotConfiguredError('test') instanceof Error,
  'EmbedderNotConfiguredError extends Error',
);
assert(
  new EmbedderNotConfiguredError('test').name === 'EmbedderNotConfiguredError',
  'EmbedderNotConfiguredError.name is set',
);

console.log('=== registry.test: DONE ===');
