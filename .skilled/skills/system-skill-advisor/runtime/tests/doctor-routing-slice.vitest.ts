// ───────────────────────────────────────────────────────────────
// MODULE: Doctor Routing Slice
// ───────────────────────────────────────────────────────────────

// Scores only the doctor slice fixture, under the pinned force-local regime. It reads
// no other routing fixture, so the pinned fixture hashes are untouched, and a row is
// asserted only when its wave is active, so a half-shipped bridge cannot fail the gate
// before its commands exist.

import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type {
  AdvisorScoredRecommendation,
  AdvisorScoringOptions,
  AdvisorScoringResult,
} from '../lib/scorer/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../scripts/routing-accuracy');
const SLICE_PATH = join(ROUTING, 'doctor-prompts.jsonl');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const COMPATIBILITY_PATH = resolve(HERE, '../scripts/command-bridges/scoring-compatibility.json');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const DOCTOR_PREFIX = 'command-doctor-';

interface DoctorRow {
  readonly id: string;
  readonly prompt: string;
  readonly expected_top: string | null;
  readonly expected_second: string | null;
  readonly wave: string;
}

interface CompatibilityDoc {
  readonly typescript: readonly { readonly inventoryId: string }[];
}

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

// Freeze scoring to the reproducible filesystem projection: an empty DB dir makes the
// SQLite loader return null, semantic embeddings are disabled, and the native
// lane-ranking overrides are cleared so the top-1 decision is deterministic.
function freezeEvalEnv(): void {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-doctor-slice-'));
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
}

function activeTypescriptBridgeIds(): Set<string> {
  const doc = JSON.parse(readFileSync(COMPATIBILITY_PATH, 'utf8')) as CompatibilityDoc;
  return new Set(doc.typescript.map((entry) => entry.inventoryId));
}

// Control rows always run, so an unknown-intent regression is caught even with no
// doctor bridge shipped. A doctor wave runs only once every doctor bridge its rows
// expect is active, which turns the wave on with the bridge rather than before it.
function activeWaves(rows: readonly DoctorRow[], activeIds: ReadonlySet<string>): Set<string> {
  const active = new Set<string>(['control']);
  const referenced = new Map<string, Set<string>>();
  for (const row of rows) {
    if (row.wave === 'control') continue;
    const ids = referenced.get(row.wave) ?? new Set<string>();
    for (const value of [row.expected_top, row.expected_second]) {
      if (value !== null && value.startsWith(DOCTOR_PREFIX)) ids.add(value);
    }
    referenced.set(row.wave, ids);
  }
  for (const [wave, ids] of referenced) {
    if (ids.size > 0 && [...ids].every((id) => activeIds.has(id))) active.add(wave);
  }
  return active;
}

// Recommendations are ordered by confidence, so the doctor expectation for the second
// slot is the first doctor recommendation after the top pick, not the top pick itself.
function secondDoctor(
  recommendations: readonly AdvisorScoredRecommendation[],
  top: string | null,
): string | null {
  for (const recommendation of recommendations.slice(1)) {
    if (recommendation.skill.startsWith(DOCTOR_PREFIX)) return recommendation.skill;
  }
  return null;
}

let scoreAdvisorPrompt: (prompt: string, options: AdvisorScoringOptions) => AdvisorScoringResult;
let rows: DoctorRow[] = [];
let workspaceRoot = '';

describe('doctor routing slice', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../lib/scorer/fusion.js');
    const workspace = await import('../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as { readonly capturedAt: string };

    // The derived lane discounts each skill by its age at scoring time, so score at the
    // instant the accuracy baseline was captured; a later calendar day must not move a
    // row that no change touched.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${baseline.capturedAt}T00:00:00Z`));

    rows = readJsonl<DoctorRow>(SLICE_PATH);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('reads a well-formed slice', () => {
    const ids = new Set<string>();
    for (const row of rows) {
      expect(typeof row.id).toBe('string');
      expect(typeof row.prompt).toBe('string');
      expect(row.expected_top === null || typeof row.expected_top === 'string').toBe(true);
      expect(row.expected_second === null || typeof row.expected_second === 'string').toBe(true);
      expect(typeof row.wave).toBe('string');
      ids.add(row.id);
    }
    expect(ids.size).toBe(rows.length);
    expect(rows.some((row) => row.wave === 'control')).toBe(true);
  });

  it('scores every row of every active wave as expected', () => {
    const active = activeWaves(rows, activeTypescriptBridgeIds());
    const mismatches: string[] = [];
    let asserted = 0;
    for (const row of rows) {
      if (!active.has(row.wave)) continue;
      asserted += 1;
      const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot });
      const top = result.topSkill;
      const second = secondDoctor(result.recommendations, top);
      if (top !== row.expected_top || second !== row.expected_second) {
        mismatches.push(
          `${row.id} [${row.wave}] "${row.prompt}": top=${top} (want ${row.expected_top}), second=${second} (want ${row.expected_second})`,
        );
      }
    }
    expect(asserted).toBeGreaterThan(0);
    expect(mismatches).toEqual([]);
  });
});
