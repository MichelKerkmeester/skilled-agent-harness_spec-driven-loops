// ───────────────────────────────────────────────────────────────
// MODULE: Local-vs-Native Routing Divergence Ratchet
// ───────────────────────────────────────────────────────────────

// A non-writing differential gate. It compares the strict top-1 routing
// decision of the local Python scorer (analyze_prompt) against the native
// TypeScript scorer (scoreAdvisorPrompt) over a union prompt corpus, and
// ratchets every current divergence against an approved-divergence ledger.
// The ledger is the honest current-state baseline: new drift fails CI, and a
// divergence that has since resolved must be removed from the ledger rather
// than silently lingering. Gold preservation is covered elsewhere; this gate
// exists because large local-vs-native disagreement on harder prompts was
// otherwise invisible.
//
// Regime: a pass shows harness-regime parity, not live-daemon parity. The
// local side is the Python scorer in a subprocess. The native side is the
// in-process TypeScript scorer under VITEST, where the semantic-shadow lane
// substitutes deterministic fixture vectors for real embeddings. Both read a
// skill graph indexed fresh from this checkout into a temporary directory,
// never the daemon's live database, and both score at a pinned instant. A
// prompt the live daemon routes differently can still pass here.

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { AdvisorScoringOptions, AdvisorScoringResult } from '../../lib/scorer/types.js';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';
import { HARDER_INTENT_PROMPT_CORPUS } from '../scorer/fixtures/harder-intent-prompt-corpus.js';

// Top-1 normalization: a strict abstention (no passing recommendation) is the
// sentinel string "none" on both the local and native sides so divergence
// comparison stays apples-to-apples.
const NONE = 'none';

// Default: the Python step is required. This is a CI gate, not the opportunistic
// CLI-parity skip — a missing interpreter must fail loudly. Set
// SPECKIT_PARITY_REQUIRE_PYTHON=0 only in a genuinely python-less environment,
// where the whole suite is then skipped rather than run against empty state.
const REQUIRE_PYTHON = process.env.SPECKIT_PARITY_REQUIRE_PYTHON !== '0';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface CorpusEntry {
  readonly id: string;
  readonly corpus: 'labeled' | 'harder';
  readonly prompt: string;
  readonly gold: string;
}

interface PythonRow {
  readonly prompt: string;
  readonly top: string | null;
}

interface LedgerEntry {
  readonly id: string;
  readonly corpus: 'labeled' | 'harder';
  readonly promptHash: string;
  readonly gold: string;
  readonly localTop: string;
  readonly nativeTop: string;
  readonly reason: string;
  readonly approvedAt: string;
}

interface Ledger {
  readonly schemaVersion: number;
  readonly scoringInstant?: string;
  readonly entries: readonly LedgerEntry[];
}

interface DivergenceRow {
  readonly id: string;
  readonly corpus: 'labeled' | 'harder';
  readonly prompt: string;
  readonly promptHash: string;
  readonly gold: string;
  readonly localTop: string;
  readonly nativeTop: string;
}

function findWorkspaceRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  const sentinel = '.skilled/skills/system-spec-kit/SKILL.md';
  const candidate = findAdvisorWorkspaceRoot(start, { maxDepth: 12, sentinel });
  if (!existsSync(resolve(candidate, sentinel))) {
    throw new Error('Unable to locate workspace root.');
  }
  return candidate;
}

const WORKSPACE_ROOT = findWorkspaceRoot();
const LABELED_CORPUS_PATH = resolve(
  WORKSPACE_ROOT,
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl',
);
const SKILL_ADVISOR_PY = resolve(
  WORKSPACE_ROOT,
  '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py',
);
const LEDGER_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  'fixtures/local-native-approved-divergences.json',
);

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function promptHash(prompt: string): string {
  return `sha256:${sha256(prompt)}`;
}

// Stable id for the harder fixture (which carries no native id): harder:<first
// 12 hex of the prompt's sha256>. Labeled rows keep their existing id.
function harderId(prompt: string): string {
  return `harder:${sha256(prompt).slice(0, 12)}`;
}

function loadLabeledCorpus(): CorpusEntry[] {
  return readFileSync(LABELED_CORPUS_PATH, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow)
    .map((row) => ({
      id: row.id,
      corpus: 'labeled' as const,
      prompt: row.prompt,
      gold: row.skill_top_1 === 'none' ? NONE : row.skill_top_1,
    }));
}

function loadHarderCorpus(): CorpusEntry[] {
  return HARDER_INTENT_PROMPT_CORPUS.map((entry) => ({
    id: harderId(entry.prompt),
    corpus: 'harder' as const,
    prompt: entry.prompt,
    gold: entry.expectedSkill === 'none' ? NONE : entry.expectedSkill,
  }));
}

// Union corpus: labeled rows followed by harder-fixture rows. Both id spaces are
// disjoint by construction (labeled ids vs the harder: prefix).
function loadCorpus(): CorpusEntry[] {
  return [...loadLabeledCorpus(), ...loadHarderCorpus()];
}

function loadLedger(): Ledger {
  const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) as Ledger;
  return ledger;
}

// Local (Python) strict top-1 for every prompt in one subprocess. Mirrors the
// python-subprocess pattern in python-ts-parity.vitest.ts: importlib-load
// skill_advisor.py, read JSON prompts from stdin, print JSON [{prompt, top}].
// confidence_only=False yields the strict (dual-threshold) decision, so an
// empty result maps to the "none" sentinel.
function runPython(prompts: readonly string[]): PythonRow[] {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
prompts = json.loads(sys.stdin.read())
out = []
for prompt in prompts:
    recs = mod.analyze_prompt(prompt=prompt, confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False, show_rejections=False)
    out.append({'prompt': prompt, 'top': recs[0]['skill'] if recs else None})
print(json.dumps(out))
`;
  const result = spawnSync('python3', ['-c', script, WORKSPACE_ROOT], {
    input: JSON.stringify(prompts),
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      SPECKIT_SKILL_ADVISOR_FORCE_LOCAL: '1',
    },
    maxBuffer: 1024 * 1024 * 16,
  });
  if (result.error || result.status !== 0) {
    const detail = result.error ? String(result.error) : (result.stderr || result.stdout);
    throw new Error(
      `Local Python scorer failed (exit ${result.status}). The local-vs-native parity ratchet is a CI gate and must not silently skip. Detail: ${detail}`,
    );
  }
  return JSON.parse(result.stdout) as PythonRow[];
}

// Freeze the native ranking env so the TS top-1 is deterministic across
// machines/CI (lane-weight and lexical-shadow overrides would otherwise shift
// ranking). Done before any scoreAdvisorPrompt call.
function freezeNativeEnv(): void {
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
}

// Imported in beforeAll, after the graph directory is set: the native projection
// reads SYSTEM_SKILL_ADVISOR_DB_DIR once, when its module loads.
let scoreAdvisorPrompt: (prompt: string, options: AdvisorScoringOptions) => AdvisorScoringResult;
let closeDb: () => void = () => {};

function nativeTop(prompt: string): string {
  return scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE_ROOT }).topSkill ?? NONE;
}

// The derived lane discounts each skill by its age at scoring time, so a
// ledgered top-1 can flip with the calendar alone. Score at the instant the
// ledger records, the one its capture scored at, so a later day cannot move a
// decision that no change touched. The instant moves only when the ledger is
// recaptured, which re-scores every entry at the new instant.
function ledgerScoringInstant(ledger: Ledger): Date {
  const instant = new Date(ledger.scoringInstant ?? Number.NaN);
  if (typeof ledger.scoringInstant !== 'string' || Number.isNaN(instant.getTime())) {
    throw new Error(
      `Cannot pin the scoring clock: the ledger's scoringInstant is ${String(ledger.scoringInstant)}. `
      + 'Recapture the ledger with capture-local-native-divergence-ledger.mjs --write.',
    );
  }
  return instant;
}

// Index this checkout's skill graph into a throwaway directory and point both
// scorers at it. Each scorer otherwise reads whatever database the local daemon
// last built, or none at all in CI, so one commit passed on a machine with a
// built graph and failed on a clean runner.
async function indexFreshSkillGraph(): Promise<string> {
  const dbDir = mkdtempSync(join(tmpdir(), 'advisor-divergence-'));
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
  const skillGraphDb = await import('../../lib/skill-graph/skill-graph-db.js');
  closeDb = skillGraphDb.closeDb;
  closeDb();
  const indexed = skillGraphDb.indexSkillMetadata(resolve(WORKSPACE_ROOT, '.skilled/skills'));
  closeDb();
  // Fail on a missing graph here: an empty directory would score both sides
  // without a graph and surface later as unrelated divergences.
  if (indexed.indexedNodes === 0 || !existsSync(join(dbDir, 'skill-graph.sqlite'))) {
    throw new Error(`Indexing the skill graph into ${dbDir} produced no graph (${indexed.indexedNodes} nodes).`);
  }
  scoreAdvisorPrompt = (await import('../../lib/scorer/fusion.js')).scoreAdvisorPrompt;
  return dbDir;
}

function pythonReachable(): boolean {
  const probe = spawnSync('python3', ['-c', 'import sys; print(sys.version)'], { encoding: 'utf8' });
  return !probe.error && probe.status === 0;
}

// Module-scoped state computed once in beforeAll so each ratchet rule can assert
// against the same single subprocess run.
let CORPUS: CorpusEntry[] = [];
let DIVERGENCES: DivergenceRow[] = [];
let DIVERGENCE_BY_ID: Map<string, DivergenceRow> = new Map();
let CORPUS_IDS: Set<string> = new Set();
let LEDGER: Ledger = { schemaVersion: 1, entries: [] };
let SCORING_INSTANT: Date | null = null;
let FRESH_DB_DIR: string | null = null;
const PREVIOUS_DB_DIR = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;

const SKIP_WITHOUT_PYTHON = !REQUIRE_PYTHON && !pythonReachable();

describe.skipIf(SKIP_WITHOUT_PYTHON)('local-vs-native routing divergence ratchet (eval gate)', () => {
  beforeAll(async () => {
    // Fail loudly when python is unavailable and required, instead of skipping.
    if (!pythonReachable()) {
      throw new Error(
        'python3 is unavailable but the local-vs-native parity ratchet requires it. '
        + 'This is a CI gate (unlike the CLI-parity skip). Install python3, or set '
        + 'SPECKIT_PARITY_REQUIRE_PYTHON=0 only in a genuinely python-less environment.',
      );
    }
    if (!existsSync(SKILL_ADVISOR_PY)) {
      throw new Error(
        `skill_advisor.py not found at ${SKILL_ADVISOR_PY}. The local-vs-native parity ratchet `
        + 'is a CI gate and cannot run without the local scorer.',
      );
    }

    freezeNativeEnv();
    CORPUS = loadCorpus();
    CORPUS_IDS = new Set(CORPUS.map((entry) => entry.id));
    LEDGER = loadLedger();
    SCORING_INSTANT = ledgerScoringInstant(LEDGER);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(SCORING_INSTANT);
    FRESH_DB_DIR = await indexFreshSkillGraph();

    const python = runPython(CORPUS.map((entry) => entry.prompt));
    // Map python results by prompt (the subprocess echoes the prompt back); the
    // corpus and python order match, but keying by prompt is robust to reorder.
    const pythonByPrompt = new Map<string, string>();
    for (const row of python) {
      pythonByPrompt.set(row.prompt, row.top ?? NONE);
    }

    DIVERGENCES = [];
    for (const entry of CORPUS) {
      const localTop = pythonByPrompt.get(entry.prompt) ?? NONE;
      const nativeTopSkill = nativeTop(entry.prompt);
      if (localTop !== nativeTopSkill) {
        DIVERGENCES.push({
          id: entry.id,
          corpus: entry.corpus,
          prompt: entry.prompt,
          promptHash: promptHash(entry.prompt),
          gold: entry.gold,
          localTop,
          nativeTop: nativeTopSkill,
        });
      }
    }
    DIVERGENCE_BY_ID = new Map(DIVERGENCES.map((row) => [row.id, row]));

    console.log(
      `local-native-divergence-ratchet ${JSON.stringify({
        corpusSize: CORPUS.length,
        labeled: CORPUS.filter((entry) => entry.corpus === 'labeled').length,
        harder: CORPUS.filter((entry) => entry.corpus === 'harder').length,
        currentDivergences: DIVERGENCES.length,
        ledgerEntries: LEDGER.entries.length,
      })}`,
    );
  // The single Python subprocess (loads the skill graph) plus ~215 in-process
  // native scoring calls run past vitest's default 10s hook timeout.
  }, 60_000);

  afterAll(() => {
    vi.useRealTimers();
    closeDb();
    if (FRESH_DB_DIR) rmSync(FRESH_DB_DIR, { recursive: true, force: true });
    if (PREVIOUS_DB_DIR === undefined) delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    else process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = PREVIOUS_DB_DIR;
  });

  it('scores at the pinned ledger instant, not the wall clock', () => {
    expect(SCORING_INSTANT, 'the scoring clock was never pinned').not.toBeNull();
    expect(new Date().toISOString()).toBe(SCORING_INSTANT?.toISOString());
  });

  // An approval dated after the pin was observed at a later instant than the
  // one the gate replays, so it is not evidence for this replay.
  it('pins no earlier than the newest approval', () => {
    const newest = LEDGER.entries.map((entry) => entry.approvedAt).sort().at(-1) ?? '';
    expect(SCORING_INSTANT?.toISOString().slice(0, 10) >= newest, `scoringInstant precedes approval ${newest}`).toBe(true);
  });

  it('scores against the freshly indexed skill graph', () => {
    expect(FRESH_DB_DIR, 'no temporary skill graph was indexed').not.toBeNull();
    expect(process.env.SYSTEM_SKILL_ADVISOR_DB_DIR).toBe(FRESH_DB_DIR);
    expect(existsSync(join(FRESH_DB_DIR ?? '', 'skill-graph.sqlite'))).toBe(true);
  });

  it('uses a non-trivial union corpus and a well-formed ledger', () => {
    expect(CORPUS.length).toBeGreaterThan(190);
    expect(CORPUS.filter((entry) => entry.corpus === 'harder').length).toBe(HARDER_INTENT_PROMPT_CORPUS.length);
    expect(LEDGER.schemaVersion).toBe(1);
    expect(Array.isArray(LEDGER.entries)).toBe(true);
  });

  // Rule (d): no duplicate ledger ids.
  it('ledger has no duplicate ids', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const entry of LEDGER.entries) {
      if (seen.has(entry.id)) dupes.push(entry.id);
      seen.add(entry.id);
    }
    expect(
      dupes,
      `Duplicate ledger ids: ${dupes.join(', ')}. Each approved divergence must appear once.`,
    ).toEqual([]);
  });

  // Rule (e): every ledger id must exist in the current corpus.
  it('every ledger id exists in the corpus', () => {
    const orphans = LEDGER.entries
      .filter((entry) => !CORPUS_IDS.has(entry.id))
      .map((entry) => entry.id);
    expect(
      orphans,
      `Ledger ids absent from the corpus (stale entries — remove them): ${orphans.join(', ')}`,
    ).toEqual([]);
  });

  // Rule (a): every current divergence must be approved in the ledger. A new
  // local-vs-native disagreement is unreviewed drift and fails the gate.
  it('every current divergence is recorded in the ledger (no new drift)', () => {
    const ledgerIds = new Set(LEDGER.entries.map((entry) => entry.id));
    const unapproved = DIVERGENCES.filter((row) => !ledgerIds.has(row.id)).map((row) => (
      `${row.id} [${row.corpus}] local=${row.localTop} native=${row.nativeTop} (gold=${row.gold})`
    ));
    expect(
      unapproved,
      'New local-vs-native routing divergence(s) not in the approved ledger '
      + `(add them with an honest reason, or fix the drift):\n  ${unapproved.join('\n  ')}`,
    ).toEqual([]);
  });

  // Rule (b): every ledger entry must still be divergent. A now-agreeing entry
  // must be removed so the ledger stays an honest current-state baseline.
  it('every ledger entry is still divergent (resolved entries removed)', () => {
    const resolved = LEDGER.entries
      .filter((entry) => CORPUS_IDS.has(entry.id) && !DIVERGENCE_BY_ID.has(entry.id))
      .map((entry) => `${entry.id} [${entry.corpus}] (ledger: local=${entry.localTop} native=${entry.nativeTop})`);
    expect(
      resolved,
      'Ledger entries that no longer diverge (local and native now agree — remove them):\n  '
      + resolved.join('\n  '),
    ).toEqual([]);
  });

  // Rule (c): a ledger entry's recorded promptHash/localTop/nativeTop must match
  // the current output. A changed mismatch is a different decision and needs
  // explicit review, not silent ledger drift.
  it('ledger entries match current promptHash and local/native tops', () => {
    const mismatches: string[] = [];
    for (const entry of LEDGER.entries) {
      const current = DIVERGENCE_BY_ID.get(entry.id);
      if (!current) continue; // covered by rules (b)/(e)
      if (entry.promptHash !== current.promptHash) {
        mismatches.push(`${entry.id}: promptHash ledger=${entry.promptHash} current=${current.promptHash}`);
      }
      if (entry.localTop !== current.localTop) {
        mismatches.push(`${entry.id}: localTop ledger=${entry.localTop} current=${current.localTop}`);
      }
      if (entry.nativeTop !== current.nativeTop) {
        mismatches.push(`${entry.id}: nativeTop ledger=${entry.nativeTop} current=${current.nativeTop}`);
      }
    }
    expect(
      mismatches,
      'Ledger entries whose recorded divergence changed (review and re-approve):\n  '
      + mismatches.join('\n  '),
    ).toEqual([]);
  });
});
