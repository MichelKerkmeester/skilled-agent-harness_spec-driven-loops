#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: STUDY Selection and Guarded Hydration
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { buildLockedFacts } from './build-write-prompt';
import { resolveCapabilities, schemaDigest, V3_SCHEMA } from './schema-v3';
import { transformStudyExemplar } from './study-exemplars';

import type { StyleReferenceSchema } from './schema-v3';
import type {
  StudyCandidate,
  StudyContext,
  StudyHydration,
} from './study-exemplars';
import type { DesignTokens } from './types';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

interface StudyQueryResult {
  readonly ok: boolean;
  readonly generationHash?: string;
  readonly cards?: readonly StudyCandidate[];
}

export interface StudyRetrievalSurface {
  query(request: Record<string, unknown>): StudyQueryResult;
  hydrate(request: Record<string, unknown>): StudyHydration;
}

export type StudyPreparationResult =
  | { readonly ok: true; readonly context: StudyContext }
  | { readonly ok: false; readonly error: string };

// ───────────────────────────────────────────────────────────────
// 2. RETRIEVAL ADAPTER
// ───────────────────────────────────────────────────────────────

const STYLE_LIBRARY_CLI = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'styles',
  '_engine',
  'style-library.mjs',
);
const RETRIEVAL_TIMEOUT_MS = 120_000;
const RETRIEVAL_BUFFER_BYTES = 16 * 1024 * 1024;

function invokeRetrieval<T>(command: 'query' | 'hydrate', request: Record<string, unknown>): T {
  const result = spawnSync(
    process.execPath,
    [STYLE_LIBRARY_CLI, command, '--request', JSON.stringify(request)],
    {
      cwd: path.dirname(STYLE_LIBRARY_CLI),
      encoding: 'utf-8',
      timeout: RETRIEVAL_TIMEOUT_MS,
      maxBuffer: RETRIEVAL_BUFFER_BYTES,
    },
  );
  if (result.status !== 0 || result.error || result.signal !== null) {
    throw new Error(`STUDY ${command} failed under the checked retrieval surface.`);
  }
  return JSON.parse(result.stdout) as T;
}

export const defaultStudyRetrievalSurface: StudyRetrievalSurface = Object.freeze({
  query: (request: Record<string, unknown>) => (
    invokeRetrieval<StudyQueryResult>('query', request)
  ),
  hydrate: (request: Record<string, unknown>) => (
    invokeRetrieval<StudyHydration>('hydrate', request)
  ),
});

// ───────────────────────────────────────────────────────────────
// 3. PREPARATION
// ───────────────────────────────────────────────────────────────

/** Select up to three candidates, then hydrate exactly one matched artifact pair. */
export function prepareStudyContext(
  tokens: DesignTokens,
  lockedFacts: string,
  schema: StyleReferenceSchema = V3_SCHEMA,
  retrieval: StudyRetrievalSurface = defaultStudyRetrievalSurface,
): StudyPreparationResult {
  try {
    const targetCapabilities = [...resolveCapabilities(tokens, schema)]
      .filter((capability) => [
        'components', 'imagery', 'layout', 'motion', 'shadows', 'spacing', 'surfaces',
      ].includes(capability));
    const query = retrieval.query({
      text: ['design system structure semantic roles restrained prose', ...targetCapabilities]
        .join(' '),
      requiredFacets: ['tokens', 'provenance'],
      exclusions: ['license-restricted'],
      needs: targetCapabilities,
      usage: 'reference',
      limit: 3,
    });
    const candidate = query.cards?.[0];
    if (!query.ok || !query.generationHash || !candidate) {
      return { ok: false, error: 'no-eligible-study-candidate' };
    }
    if (candidate.generationHash !== query.generationHash) {
      return { ok: false, error: 'generation-mismatch' };
    }
    const hydration = retrieval.hydrate({
      id: candidate.id,
      generationHash: candidate.generationHash,
      mode: 'audit',
      includes: ['DESIGN.md', 'design-tokens.json'],
      usage: 'reference',
      maxBytes: 128 * 1024,
    });
    if (!hydration.ok) return { ok: false, error: hydration.error ?? 'study-hydration-failed' };
    return {
      ok: true,
      context: transformStudyExemplar(
        candidate,
        hydration,
        lockedFacts,
        schemaDigest(schema),
      ),
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'study-preparation-failed',
    };
  }
}

// ───────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────

if (require.main === module) {
  const tokensPath = process.argv[2];
  if (!tokensPath) {
    process.stderr.write('Usage: study-prepare.ts <tokens.json>\n');
    process.exit(1);
  }
  try {
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8')) as DesignTokens;
    const result = prepareStudyContext(tokens, buildLockedFacts(tokens));
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stdout.write(`${JSON.stringify({ ok: false, error: message })}\n`);
  }
}
