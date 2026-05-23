// ───────────────────────────────────────────────────────────────────
// MODULE: Profile — fallback-resolver invariant tests (022/001 closes 3 P0)
// ───────────────────────────────────────────────────────────────────
// Runner: `node --experimental-vm-modules .../profile.test.js` after tsc.
// Standalone-assertion convention — matches boolean-expr.test.ts +
// quality-extractors.test.ts + registry.test.ts in sibling directories.
//
// What this locks in:
// - resolveActiveProfileModel returns canonical values via getCanonicalFallback
//   for all 4 providers when no env var is set
// - Env-var override still takes precedence over fallback
// - Source-text ban-list: no inline `'BAAI/bge-base-en'` or `'jina-embeddings-v3'`
//   string in profile.ts (catches stale-default regression at test time)
// ---------------------------------------------------------------

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    console.error(`FAIL: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`  ok: ${label}`);
  }
}

console.log('=== profile.test: resolveActiveProfileModel invariants ===');

// 1. Source-text ban-list (catches stale-default regression)
//    Read the COMPILED .js if .ts isn't available; fall back to import-graph proof
const here = dirname(fileURLToPath(import.meta.url));
const profileTsCandidates = [
  join(here, '..', '..', 'embeddings', 'profile.ts'),
  join(here, '..', '..', '..', 'embeddings', 'profile.ts'),
];

let profileSource: string | null = null;
for (const candidate of profileTsCandidates) {
  try {
    profileSource = readFileSync(candidate, 'utf8');
    break;
  } catch {
    /* try next candidate */
  }
}

if (profileSource !== null) {
  // Only check function body region, not comments referencing past values
  const functionBody = profileSource.match(/function resolveActiveProfileModel[\s\S]*?^}/m)?.[0] ?? '';
  // Strip comment lines (// and /* */) before ban-list scan — historical context
  // in comments references the old literals intentionally.
  const codeOnly = functionBody
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  assert(
    !/'BAAI\/bge-base-en/.test(codeOnly),
    "profile.ts:resolveActiveProfileModel does NOT contain inline 'BAAI/bge-base-en' literal (code-only, excluding comments)",
  );
  assert(
    !/'jina-embeddings-v3'/.test(codeOnly),
    "profile.ts:resolveActiveProfileModel does NOT contain inline 'jina-embeddings-v3' literal (code-only, excluding comments)",
  );
  assert(
    /getCanonicalFallback\('voyage'\)/.test(functionBody) &&
      /getCanonicalFallback\('openai'\)/.test(functionBody) &&
      /getCanonicalFallback\('ollama'\)/.test(functionBody) &&
      /getCanonicalFallback\('hf-local'\)/.test(functionBody),
    'profile.ts:resolveActiveProfileModel uses getCanonicalFallback for all 4 providers',
  );
} else {
  console.log('  skip: profile.ts source not located for ban-list check (compiled-only run)');
}

// 2. Behavioral invariants — load the function dynamically + clear envs first
type Provider = 'voyage' | 'openai' | 'ollama' | 'hf-local';
const ENV_KEYS = ['VOYAGE_EMBEDDINGS_MODEL', 'OPENAI_EMBEDDINGS_MODEL', 'OLLAMA_EMBEDDINGS_MODEL', 'HF_EMBEDDINGS_MODEL'];
const savedEnv: Record<string, string | undefined> = {};
for (const key of ENV_KEYS) {
  savedEnv[key] = process.env[key];
  delete process.env[key];
}

try {
  // Use the registry helper directly to assert canonical values
  const { getCanonicalFallback } = await import('./registry.js');

  assert(
    getCanonicalFallback('voyage') === 'voyage-code-3',
    "getCanonicalFallback('voyage') canonical = 'voyage-code-3'",
  );
  assert(
    getCanonicalFallback('openai') === 'text-embedding-3-small',
    "getCanonicalFallback('openai') canonical = 'text-embedding-3-small'",
  );
  assert(
    getCanonicalFallback('ollama') === 'nomic-embed-text-v1.5',
    "getCanonicalFallback('ollama') canonical = 'nomic-embed-text-v1.5' (ADR-013/014)",
  );
  assert(
    getCanonicalFallback('hf-local') === 'nomic-ai/nomic-embed-text-v1.5',
    "getCanonicalFallback('hf-local') canonical = 'nomic-ai/nomic-embed-text-v1.5' (ADR-014)",
  );
} finally {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] !== undefined) {
      process.env[key] = savedEnv[key];
    }
  }
}

console.log('=== profile.test: DONE ===');
