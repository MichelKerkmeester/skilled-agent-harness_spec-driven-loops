// ───────────────────────────────────────────────────────────────
// MODULE: Independent Holdout Gate
// ───────────────────────────────────────────────────────────────

// Scores the frozen independent holdout and holds its top-1 accuracy at or
// above the committed baseline. Unlike the every-Nth-row holdout carved from the
// training corpus (retained elsewhere as a legacy secondary signal), this set is
// assembled from three separately-authored, real-labeled fixtures, so it
// measures generalization rather than memorization. No gold is invented: each
// row's label comes from its source fixture, and provenance is asserted per row.
//
// Independence is checked against every surface that scores prompts, not only
// the training corpus. Each surface declares the holdout source types it may
// share prompts with, through which of its corpora, and why. An undeclared
// overlap fails, a declared overlap that no longer exists fails, a declaration
// that no file backs fails, and a runtime file that reads a scored corpus
// without being declared here fails, so a new shared prompt or a new scoring
// surface is recorded instead of silently eroding the holdout.

import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';
import type { AdvisorScoringOptions, AdvisorScoringResult } from '../../lib/scorer/types.js';
import { HARDER_INTENT_PROMPT_CORPUS } from '../scorer/fixtures/harder-intent-prompt-corpus.js';
import { INTENT_PROMPT_CORPUS } from '../scorer/fixtures/intent-prompt-corpus.js';

// Independence floor: the honest holdout is meaningfully larger than a token
// sample even after dedup and training-collision removal.
const MIN_HOLDOUT_ROWS = 60;
const SOURCE_TYPES = ['holdout-harder', 'holdout-regression', 'holdout-delegation'] as const;
const VALID_SOURCE_TYPES = new Set<string>(SOURCE_TYPES);

type SourceType = typeof SOURCE_TYPES[number];
type CorpusId = 'labeled' | 'ambiguity' | 'intent' | 'harder' | 'golden' | 'regression' | 'delegation';

interface HoldoutRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
  readonly source_type: string;
  readonly origin_fixture: string;
}

interface Baseline {
  readonly metrics: { readonly holdout_top1: { readonly correct: number; readonly total: number } };
}

interface AllowedOverlap {
  // The corpora of the surface through which the shared rows arrive.
  readonly via: readonly CorpusId[];
  readonly reason: string;
}

interface ScoringSurface {
  readonly id: string;
  // Runtime-relative files that score this surface's corpora.
  readonly consumers: readonly string[];
  readonly corpora: readonly CorpusId[];
  // Holdout source types this surface may share prompts with, each with its reason.
  readonly allowedOverlap: Readonly<Partial<Record<SourceType, AllowedOverlap>>>;
}

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNTIME_ROOT = resolve(HERE, '../..');
const ROUTING = resolve(RUNTIME_ROOT, 'scripts/routing-accuracy');
const BASELINE_PATH = join(ROUTING, 'scorer-eval-baseline.json');
const HOLDOUT_PATH = join(ROUTING, 'holdout-prompts.jsonl');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';

// The text that marks a file as reading each corpus. The intent pattern
// excludes the harder corpus, whose name contains it.
const CORPUS_REFERENCE: Readonly<Record<CorpusId, RegExp>> = {
  labeled: /labeled-prompts/,
  ambiguity: /ambiguity-prompts/,
  intent: /(?<![-_A-Za-z])(?:intent-prompt-corpus|INTENT_PROMPT_CORPUS)/,
  harder: /harder-intent-prompt-corpus|HARDER_INTENT_PROMPT_CORPUS/,
  golden: /gate2-golden-prompts/,
  regression: /skill-advisor-regression-cases/,
  delegation: /executor-delegation-cases/,
};

const SCORING_SURFACES: readonly ScoringSurface[] = [
  {
    id: 'training-corpus',
    consumers: [
      'bench/scorer-calibration.bench.ts',
      'scripts/routing-accuracy/gate3-corpus-runner.mjs',
      'scripts/routing-accuracy/score-outcome-rerank.mjs',
      'scripts/routing-accuracy/score-routing-corpus.py',
      'tests/legacy/advisor-corpus-parity.vitest.ts',
      'tests/parity/python-ts-parity.vitest.ts',
      'tests/scorer/semantic-shadow-ablation.vitest.ts',
    ],
    corpora: ['labeled'],
    allowedOverlap: {},
  },
  {
    id: 'ambiguity-slice',
    consumers: [
      'scripts/routing-accuracy/derive-ambiguity-slice.mjs',
      'tests/scorer/ambiguity-slice.vitest.ts',
    ],
    corpora: ['labeled', 'ambiguity'],
    allowedOverlap: {},
  },
  {
    id: 'scorer-eval-baseline',
    consumers: [
      'scripts/routing-accuracy/capture-scorer-eval-baseline.mjs',
      'tests/parity/scorer-eval-baseline-ratchet.vitest.ts',
    ],
    corpora: ['labeled', 'ambiguity', 'delegation'],
    allowedOverlap: {
      'holdout-delegation': {
        via: ['delegation'],
        reason: 'its delegation bucket scores the fixture the holdout delegation rows come from',
      },
      'holdout-harder': {
        via: ['delegation'],
        reason: 'two delegation cases are also harder-corpus prompts, which the holdout files under holdout-harder',
      },
    },
  },
  {
    id: 'local-native-divergence-ratchet',
    consumers: [
      'scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs',
      'tests/parity/local-native-divergence-ratchet.vitest.ts',
    ],
    corpora: ['labeled', 'harder'],
    allowedOverlap: {
      'holdout-harder': {
        via: ['harder'],
        reason: 'it compares the two scorers on the harder corpus; it tunes nothing',
      },
    },
  },
  {
    id: 'lane-weight-sweep',
    consumers: ['tests/scorer/lane-weight-sweep.vitest.ts'],
    corpora: ['intent', 'harder'],
    allowedOverlap: {
      'holdout-harder': {
        via: ['harder'],
        reason: 'it reports lane-weight vectors over the harder corpus; no weight is chosen from it',
      },
      'holdout-delegation': {
        via: ['intent'],
        reason: 'two intent-corpus prompts are also executor-delegation cases',
      },
    },
  },
  {
    id: 'bm25-lexical-shadow',
    consumers: ['tests/scorer/bm25-lexical-shadow.vitest.ts'],
    corpora: ['intent'],
    allowedOverlap: {
      'holdout-delegation': {
        via: ['intent'],
        reason: 'two intent-corpus prompts are also executor-delegation cases',
      },
    },
  },
  {
    id: 'golden-prompts',
    consumers: ['tests/routing-golden-prompts.vitest.ts'],
    corpora: ['golden'],
    allowedOverlap: {
      'holdout-regression': {
        via: ['golden'],
        reason: 'golden cases are copied from regression cases, named by sourceCaseId',
      },
    },
  },
  {
    id: 'prompt-policy-gold-replay',
    consumers: ['tests/prompt-policy-gold-replay.vitest.ts'],
    corpora: ['labeled', 'golden'],
    allowedOverlap: {
      'holdout-regression': {
        via: ['golden'],
        reason: 'golden cases are copied from regression cases, named by sourceCaseId',
      },
    },
  },
  {
    id: 'regression-suite',
    consumers: ['stress-test/skill-advisor/python-compat-stress.vitest.ts'],
    corpora: ['regression'],
    allowedOverlap: {
      'holdout-regression': {
        via: ['regression'],
        reason: 'it replays the regression fixture the holdout regression rows come from',
      },
    },
  },
  {
    id: 'advisor-validate',
    consumers: ['handlers/advisor-validate.ts'],
    corpora: ['labeled', 'regression', 'delegation'],
    allowedOverlap: {
      'holdout-regression': {
        via: ['regression'],
        reason: 'it reports accuracy on the regression fixture; it tunes nothing',
      },
      'holdout-delegation': {
        via: ['delegation'],
        reason: 'it reports accuracy on the delegation fixture; it tunes nothing',
      },
      'holdout-harder': {
        via: ['delegation'],
        reason: 'two delegation cases are also harder-corpus prompts, which the holdout files under holdout-harder',
      },
    },
  },
  {
    id: 'executor-delegation-suite',
    consumers: ['tests/scorer/executor-delegation.vitest.ts'],
    corpora: ['delegation'],
    allowedOverlap: {
      'holdout-delegation': {
        via: ['delegation'],
        reason: 'it pins the delegation fixture the holdout delegation rows come from',
      },
      'holdout-harder': {
        via: ['delegation'],
        reason: 'two delegation cases are also harder-corpus prompts, which the holdout files under holdout-harder',
      },
    },
  },
];

// Runtime files that name a scored corpus without scoring it.
const NON_SCORING_REFERENCES: Readonly<Record<string, string>> = {
  'scripts/routing-accuracy/build-holdout.mjs': 'assembles the holdout from its source fixtures and scores nothing',
  'tests/migration-lineage-identity.vitest.ts': 'checks that an archived corpus path still resolves and scores nothing',
  'tests/parity/holdout-independent.vitest.ts': 'this gate',
  'tests/scorer/fixtures/harder-intent-prompt-corpus.ts': 'defines the harder corpus',
  'tests/scorer/fixtures/intent-prompt-corpus.ts': 'defines the intent corpus',
};

const SCANNED_EXTENSIONS = /\.(?:ts|mts|cts|mjs|cjs|js|py)$/;
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', 'coverage', '.vitest']);

function normalizeFamily(prompt: string): string {
  return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

function loadCorpusFamilies(): Record<CorpusId, Set<string>> {
  const families = (prompts: readonly string[]): Set<string> => new Set(prompts.map(normalizeFamily));
  const jsonlPrompts = (path: string): string[] => (
    readJsonl<{ prompt?: unknown }>(path)
      .map((row) => row.prompt)
      .filter((prompt): prompt is string => typeof prompt === 'string')
  );
  const delegation = JSON.parse(
    readFileSync(join(RUNTIME_ROOT, 'tests/parity/fixtures/executor-delegation-cases.json'), 'utf8'),
  ) as { cases: { prompt: string }[] };
  return {
    labeled: families(jsonlPrompts(join(ROUTING, 'labeled-prompts.jsonl'))),
    ambiguity: families(jsonlPrompts(join(ROUTING, 'ambiguity-prompts.jsonl'))),
    intent: families(INTENT_PROMPT_CORPUS.map((item) => item.prompt)),
    harder: families(HARDER_INTENT_PROMPT_CORPUS.map((item) => item.prompt)),
    golden: families(jsonlPrompts(join(RUNTIME_ROOT, 'scripts/fixtures/gate2-golden-prompts.jsonl'))),
    regression: families(jsonlPrompts(join(RUNTIME_ROOT, 'scripts/fixtures/skill-advisor-regression-cases.jsonl'))),
    delegation: families(delegation.cases.map((testCase) => testCase.prompt)),
  };
}

// Symbolic links are not followed: a linked directory belongs to another skill,
// and following one could walk outside the runtime or loop.
function listRuntimeSourceFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listRuntimeSourceFiles(path));
    else if (entry.isFile() && SCANNED_EXTENSIONS.test(entry.name)) files.push(path);
  }
  return files;
}

function readsCorpus(file: string, corpus: CorpusId): boolean {
  return CORPUS_REFERENCE[corpus].test(readFileSync(join(RUNTIME_ROOT, file), 'utf8'));
}

function freezeEvalEnv(): void {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-holdout-'));
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
}

let scoreAdvisorPrompt: (prompt: string, options: AdvisorScoringOptions) => AdvisorScoringResult;
let mergedSkillForAlias: (skillId: string) => string;
let skillMatchesAlias: (actual: string, expected: string) => boolean;
let workspaceRoot = '';

function isTop1Correct(top: string | null, goldRaw: string): boolean {
  const gold = goldRaw === 'none' ? null : goldRaw;
  const expected = gold === null ? null : mergedSkillForAlias(gold);
  const actual = top === null ? null : mergedSkillForAlias(top);
  return actual === expected
    || (actual !== null && expected !== null && skillMatchesAlias(actual, expected));
}

let HOLDOUT: HoldoutRow[] = [];
let CORPUS_FAMILIES: Record<CorpusId, Set<string>>;
let BASELINE: Baseline;
let HOLDOUT_CORRECT = 0;

// Holdout rows each surface scores, keyed by source type and the corpus that carries them.
function surfaceOverlap(surface: ScoringSurface): Map<string, { sourceType: SourceType; corpus: CorpusId; ids: string[] }> {
  const overlap = new Map<string, { sourceType: SourceType; corpus: CorpusId; ids: string[] }>();
  for (const row of HOLDOUT) {
    const family = normalizeFamily(row.prompt);
    const sourceType = row.source_type as SourceType;
    for (const corpus of surface.corpora) {
      if (!CORPUS_FAMILIES[corpus].has(family)) continue;
      const key = `${sourceType}|${corpus}`;
      const entry = overlap.get(key) ?? { sourceType, corpus, ids: [] };
      entry.ids.push(row.id);
      overlap.set(key, entry);
    }
  }
  return overlap;
}

describe('independent holdout gate', () => {
  beforeAll(async () => {
    freezeEvalEnv();
    const fusion = await import('../../lib/scorer/fusion.js');
    const aliases = await import('../../lib/scorer/aliases.js');
    const workspace = await import('../../lib/utils/workspace-root.js');
    scoreAdvisorPrompt = fusion.scoreAdvisorPrompt;
    mergedSkillForAlias = aliases.mergedSkillForAlias;
    skillMatchesAlias = aliases.skillMatchesAlias;
    workspaceRoot = workspace.findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    HOLDOUT = readJsonl<HoldoutRow>(HOLDOUT_PATH);
    CORPUS_FAMILIES = loadCorpusFamilies();
    BASELINE = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

    HOLDOUT_CORRECT = HOLDOUT.filter((row) => (
      isTop1Correct(scoreAdvisorPrompt(row.prompt, { workspaceRoot }).topSkill, row.skill_top_1)
    )).length;
  }, 120_000);

  it('is a non-trivial, provenance-tagged set', () => {
    expect(HOLDOUT.length).toBeGreaterThanOrEqual(MIN_HOLDOUT_ROWS);
    for (const row of HOLDOUT) {
      expect(VALID_SOURCE_TYPES.has(row.source_type), `unknown source_type: ${row.source_type}`).toBe(true);
      expect(row.origin_fixture.length, `missing origin_fixture on ${row.id}`).toBeGreaterThan(0);
    }
  });

  it('shares prompts with a scoring surface only where the overlap is declared', () => {
    const undeclared: string[] = [];
    for (const surface of SCORING_SURFACES) {
      for (const { sourceType, corpus, ids } of surfaceOverlap(surface).values()) {
        if (!surface.allowedOverlap[sourceType]?.via.includes(corpus)) {
          undeclared.push(`${surface.id} scores ${sourceType} rows through ${corpus}: ${ids.join(', ')}`);
        }
      }
    }
    expect(
      undeclared,
      'Holdout rows scored by a surface that does not declare the overlap. Drop the rows from the '
      + `holdout, or declare the overlap with its reason:\n  ${undeclared.join('\n  ')}`,
    ).toEqual([]);
  });

  it('declares no overlap that no longer exists', () => {
    const stale: string[] = [];
    for (const surface of SCORING_SURFACES) {
      const overlap = surfaceOverlap(surface);
      for (const [sourceType, allowance] of Object.entries(surface.allowedOverlap) as [SourceType, AllowedOverlap][]) {
        for (const corpus of allowance.via) {
          if (!surface.corpora.includes(corpus) || !overlap.has(`${sourceType}|${corpus}`)) {
            stale.push(`${surface.id} -> ${sourceType} through ${corpus}`);
          }
        }
      }
    }
    expect(stale, `Declared overlaps with no shared holdout row (remove them):\n  ${stale.join('\n  ')}`).toEqual([]);
  });

  it('backs every declaration with a file that reads it', () => {
    const unbacked: string[] = [];
    for (const surface of SCORING_SURFACES) {
      for (const consumer of surface.consumers) {
        if (!existsSync(join(RUNTIME_ROOT, consumer))) continue;
        if (!surface.corpora.some((corpus) => readsCorpus(consumer, corpus))) {
          unbacked.push(`${surface.id}: ${consumer} reads none of ${surface.corpora.join(', ')}`);
        }
      }
      for (const corpus of surface.corpora) {
        const live = surface.consumers.filter((consumer) => existsSync(join(RUNTIME_ROOT, consumer)));
        if (!live.some((consumer) => readsCorpus(consumer, corpus))) {
          unbacked.push(`${surface.id}: no consumer reads ${corpus}`);
        }
      }
    }
    for (const file of Object.keys(NON_SCORING_REFERENCES)) {
      const corpora = Object.keys(CORPUS_REFERENCE) as CorpusId[];
      if (!existsSync(join(RUNTIME_ROOT, file)) || !corpora.some((corpus) => readsCorpus(file, corpus))) {
        unbacked.push(`non-scoring exemption ${file} no longer names a scored corpus`);
      }
    }
    expect(unbacked, `Declarations no file backs (correct or remove them):\n  ${unbacked.join('\n  ')}`).toEqual([]);
  });

  it('declares every runtime file that reads a scored corpus', () => {
    const declared = new Map<string, Set<CorpusId>>();
    for (const surface of SCORING_SURFACES) {
      for (const consumer of surface.consumers) {
        const corpora = declared.get(consumer) ?? new Set<CorpusId>();
        for (const corpus of surface.corpora) corpora.add(corpus);
        declared.set(consumer, corpora);
      }
    }
    const missingConsumers = [...declared.keys()].filter((consumer) => !existsSync(join(RUNTIME_ROOT, consumer)));
    expect(missingConsumers, `Declared consumers that no longer exist: ${missingConsumers.join(', ')}`).toEqual([]);

    const undeclared: string[] = [];
    for (const path of listRuntimeSourceFiles(RUNTIME_ROOT)) {
      const file = relative(RUNTIME_ROOT, path).split('\\').join('/');
      if (NON_SCORING_REFERENCES[file] !== undefined) continue;
      const text = readFileSync(path, 'utf8');
      for (const [corpus, pattern] of Object.entries(CORPUS_REFERENCE) as [CorpusId, RegExp][]) {
        if (pattern.test(text) && !declared.get(file)?.has(corpus)) undeclared.push(`${file} reads ${corpus}`);
      }
    }
    expect(
      undeclared,
      `Runtime files that read a scored corpus but are not declared as a scoring surface:\n  ${undeclared.join('\n  ')}`,
    ).toEqual([]);
  });

  it('holds top-1 at or above the committed baseline', () => {
    const baselineCorrect = BASELINE.metrics.holdout_top1.correct;
    expect(
      HOLDOUT_CORRECT,
      `holdout top-1 regressed: live=${HOLDOUT_CORRECT}/${HOLDOUT.length} baseline=${baselineCorrect}. `
      + 'A drop means a scorer or metadata change hurt generalization.',
    ).toBeGreaterThanOrEqual(baselineCorrect);
  });
});
