// ───────────────────────────────────────────────────────────────
// MODULE: Command Routing Slice
// ───────────────────────────────────────────────────────────────

// Ratchets live command routing against the committed capture. An aggregate can
// hold still while one row is gained and another lost, so the rows are compared
// one by one and the corpus hash pins the prompts the capture was measured
// against: a scoring change, a bridge-metadata change or a corpus edit has to
// surface here instead of drifting in silently.

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFitRowsUnique as captureAssertFitRowsUnique,
  scoreCommandCorpus as captureCommandCorpus,
} from '../scripts/routing-accuracy/capture-command-routing-baseline.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../scripts/routing-accuracy');
const CORPUS_PATH = join(ROUTING, 'command-prompts.jsonl');
const BASELINE_PATH = join(ROUTING, 'command-routing-baseline.json');

// A host with its own hub vocabulary routes some rows differently from upstream.
// It keeps its own capture in a `.host.json` file beside the upstream one, and
// the ratchet reads that file whenever it exists. Every row stays guarded on the
// host, including the rows its vocabulary moved.
function capturePath(upstreamPath: string): string {
  const hostPath = upstreamPath.replace(/\.json$/, '.host.json');
  return existsSync(hostPath) ? hostPath : upstreamPath;
}

const BASELINE_READ_PATH = capturePath(BASELINE_PATH);
// The capture prints its JSON to stdout, so a host writes its own file by
// redirecting that output rather than through `--write`, which targets upstream.
const RECAPTURE = BASELINE_READ_PATH === BASELINE_PATH
  ? 'node scripts/routing-accuracy/capture-command-routing-baseline.mjs --write'
  : 'node scripts/routing-accuracy/capture-command-routing-baseline.mjs > scripts/routing-accuracy/command-routing-baseline.host.json';

// The capture projects these nine names to score reproducibly. A harness imports
// the module and scores in process, so the projection has to be undone before
// the call returns or it silently changes how every later test scores.
const PROJECTED_ENV = [
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
  'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC',
  'VITEST',
  'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  'PYTHONDONTWRITEBYTECODE',
  'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON',
  'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON',
  'SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW',
  'SPECKIT_PRIVATE_SKILL_ROOTS',
] as const;

type ProjectedEnv = Readonly<Record<(typeof PROJECTED_ENV)[number], string | undefined>>;

function readProjectedEnv(): ProjectedEnv {
  return Object.fromEntries(PROJECTED_ENV.map((name) => [name, process.env[name]])) as ProjectedEnv;
}

interface CorpusRow {
  readonly id: string;
  readonly row_type: string;
  readonly split: string;
}

interface SplitTally {
  readonly rows: number;
  readonly top1: number;
  readonly top3: number;
}

interface CommandTally {
  readonly typed: SplitTally;
  readonly plain: { readonly tune: SplitTally; readonly holdout: SplitTally };
}

interface StageTally {
  readonly total: number;
  readonly own: number;
  readonly ownerLed: number;
  readonly routed: number;
  readonly withCommand: number;
  readonly attached: number;
  readonly neither: number;
}

interface FitTally {
  readonly carried: number;
  readonly total: number;
}

interface CommandRow {
  readonly expected_command: string | null;
  readonly top: string | null;
  readonly top1: boolean;
  readonly top3: boolean;
  readonly offered: boolean;
}

interface CommandRoutingBaseline {
  readonly schemaVersion: number;
  readonly capturedAt: string;
  readonly capturedAtSha: string;
  readonly corpusSha256: string;
  readonly bridgeCounts: Readonly<Record<string, number>>;
  readonly metrics: Readonly<Record<string, unknown>>;
  readonly unreachable: readonly string[];
  readonly commands: Readonly<Record<string, CommandTally>>;
  readonly rows: Readonly<Record<string, CommandRow>>;
  readonly attachedMetrics: Readonly<Record<string, unknown>>;
}

interface PromptRow {
  readonly id: string;
  readonly row_type: string;
  readonly prompt: string;
}

// The capture script is plain JavaScript with no declaration file of its own, so
// the shape it returns is declared here and the import is cast to that shape
// rather than left implicitly `any` at every call site.
const scoreCommandCorpus = captureCommandCorpus as unknown as () => Promise<CommandRoutingBaseline>;

// The duplicate guard reads whole corpus rows, so its input is declared apart
// from the captured result rather than typed as a row of that result.
const assertFitRowsUnique = captureAssertFitRowsUnique as unknown as (rows: readonly PromptRow[]) => void;

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line) as T);
}

// A row that vanished from one side has no JSON to print, and an absent row is
// exactly the drift worth naming, so it is labelled instead of rendered empty.
function rowJson(rows: Readonly<Record<string, CommandRow>>, id: string): string {
  return Object.hasOwn(rows, id) ? JSON.stringify(rows[id]) : '<missing>';
}

let live: CommandRoutingBaseline;
let baseline: CommandRoutingBaseline;
let corpus: CorpusRow[] = [];
let envBefore: ProjectedEnv;
let envAfter: ProjectedEnv;

// The live capture is what the next recapture writes, so a holdout id it
// publishes is caught before it reaches the committed baseline.
function publishedHoldoutIds(capture: CommandRoutingBaseline, holdoutIds: ReadonlySet<string>): string[] {
  const attached = capture.attachedMetrics as {
    readonly attachedRows: Readonly<Record<string, string>>;
    readonly typedRows: Readonly<Record<string, unknown>>;
    readonly needsModeRows?: readonly string[];
  };
  return [
    ...new Set(
      [
        ...Object.keys(capture.rows),
        ...Object.keys(attached.attachedRows),
        ...Object.keys(attached.typedRows),
        ...(attached.needsModeRows ?? []),
      ].filter((id) => holdoutIds.has(id)),
    ),
  ].sort();
}

describe('command routing slice', () => {
  beforeAll(async () => {
    baseline = JSON.parse(readFileSync(BASELINE_READ_PATH, 'utf8')) as CommandRoutingBaseline;
    corpus = readJsonl<CorpusRow>(CORPUS_PATH);
    // The capture owns its own environment projection and scoring clock, so it
    // re-scores under the same regime the baseline was recorded in. Doing that
    // setup again here would double it and let the two drift apart.
    envBefore = readProjectedEnv();
    live = await scoreCommandCorpus();
    envAfter = readProjectedEnv();
  }, 120_000);

  it('leaves the caller environment as it found it', () => {
    // A projection that outlives the call changes how every later test scores.
    expect(envAfter).toEqual(envBefore);
  });

  it('matches the captured baseline row by row', () => {
    // Corpus ids come first because a prompt added to the corpus but never
    // captured is absent from both sides and would be invisible to a comparison
    // of the two row maps alone. A holdout id is left out on both sides: its
    // outcome is withheld from publication, so it has no row to compare.
    const holdoutIds = new Set(corpus.filter((row) => row.split === 'holdout').map((row) => row.id));
    const ids = [
      ...new Set([...corpus.map((row) => row.id), ...Object.keys(baseline.rows), ...Object.keys(live.rows)]),
    ].filter((id) => !holdoutIds.has(id));
    const drifted: string[] = [];
    for (const id of ids) {
      const baselineJson = rowJson(baseline.rows, id);
      const liveJson = rowJson(live.rows, id);
      if (baselineJson !== liveJson) drifted.push(`${id}: baseline ${baselineJson} live ${liveJson}`);
    }
    expect(
      drifted,
      `command routing rows drifted from the committed baseline; re-capture with \`${RECAPTURE}\` when the change is intended`,
    ).toEqual([]);
  });

  it('publishes no holdout row', () => {
    // The split exists to keep a holdout prompt's outcome unseen, so the
    // published maps may carry its counts but never the row they were counted
    // from.
    const holdoutIds = new Set(corpus.filter((row) => row.split === 'holdout').map((row) => row.id));
    // An empty set would make the check pass on a corpus that no longer marks
    // its holdout rows.
    expect(
      holdoutIds.size,
      'the corpus marks no holdout row, so this check would pass without testing anything',
    ).toBeGreaterThan(0);
    const publishedBaseline = publishedHoldoutIds(baseline, holdoutIds);
    expect(
      publishedBaseline,
      `the baseline publishes a per-row outcome for ${publishedBaseline.length} holdout ids`,
    ).toEqual([]);
    const publishedLive = publishedHoldoutIds(live, holdoutIds);
    expect(
      publishedLive,
      `the live capture publishes a per-row outcome for ${publishedLive.length} holdout ids`,
    ).toEqual([]);
  });

  it('finds a holdout id in any published map', () => {
    // Each published map is a place a holdout outcome can surface, so the guard
    // has to read all four rather than the one map a case happens to check.
    const capture = {
      rows: { 'made-up-holdout-01': {} },
      attachedMetrics: {
        attachedRows: {},
        typedRows: { 'made-up-holdout-02': {} },
        needsModeRows: ['made-up-holdout-03'],
      },
    } as unknown as CommandRoutingBaseline;
    const holdoutIds = new Set(['made-up-holdout-01', 'made-up-holdout-02', 'made-up-holdout-03']);
    expect(publishedHoldoutIds(capture, holdoutIds)).toEqual([
      'made-up-holdout-01',
      'made-up-holdout-02',
      'made-up-holdout-03',
    ]);
  });

  it('refuses a fit row that repeats another row', () => {
    // A fit row shares the corpus with every other row, so a prompt that already
    // exists would count one request twice. Case and whitespace do not make two
    // prompts different, so a reflowed copy still names the row it repeats.
    expect(() =>
      assertFitRowsUnique([
        { id: 'fit-skill-only-91', row_type: 'skill-only', prompt: 'Rename  the Helper function' },
        { id: 'made-up-92', row_type: 'plain', prompt: 'rename the helper function' },
      ]),
    ).toThrow('fit row fit-skill-only-91 repeats row made-up-92');
    expect(() =>
      assertFitRowsUnique([
        { id: 'fit-skill-only-91', row_type: 'skill-only', prompt: 'Rename  the Helper function' },
        { id: 'made-up-92', row_type: 'plain', prompt: 'rename the other function' },
      ]),
    ).not.toThrow();
  });

  it('splits each plain row into one reach stage', () => {
    // A plain row leaves the path to its command at one stage, so the stage
    // counts have to partition the split and narrow toward the rows a command
    // actually carried. Reading the same split's plain tally proves both views
    // count the same rows rather than two different row sets.
    const attached = live.attachedMetrics as {
      readonly plain: Readonly<Record<'tune' | 'holdout', { readonly own: number; readonly attached: number }>>;
      readonly plain_stages: Readonly<Record<'tune' | 'holdout', StageTally>>;
    };
    for (const split of ['tune', 'holdout'] as const) {
      const stage = attached.plain_stages[split];
      expect(stage.own + stage.ownerLed + stage.neither).toBe(stage.total);
      expect(stage.attached).toBeLessThanOrEqual(stage.withCommand);
      expect(stage.withCommand).toBeLessThanOrEqual(stage.routed);
      expect(stage.routed).toBeLessThanOrEqual(stage.ownerLed);
      expect(stage.own).toBe(attached.plain[split].own);
      expect(stage.attached).toBe(attached.plain[split].attached);
    }
  });

  it('counts the sealed fit rows and publishes none', () => {
    // A fit row asks whether the head carries a command where none fits, so its
    // counts are kept apart from every recall tally and its outcome is never
    // published row by row: one corpus then answers both questions.
    const attached = live.attachedMetrics as {
      readonly fit: {
        readonly skillOnly: FitTally;
        readonly decline: FitTally & { readonly byKind: Readonly<Record<string, FitTally>> };
      };
      readonly attachedRows: Readonly<Record<string, string>>;
      readonly typedRows: Readonly<Record<string, unknown>>;
    };
    const { skillOnly, decline } = attached.fit;
    expect(skillOnly.total).toBe(24);
    expect(decline.total).toBe(24);
    expect(Object.keys(decline.byKind).sort()).toEqual(['app-problem', 'question', 'refusal', 'small-edit']);
    for (const [kind, tally] of Object.entries(decline.byKind)) {
      expect(tally.total, `decline kind ${kind} counts ${tally.total} rows`).toBe(6);
    }
    for (const tally of [skillOnly, decline, ...Object.values(decline.byKind)]) {
      expect(tally.carried).toBeLessThanOrEqual(tally.total);
    }
    // A published fit row would expose the outcome the sealed split withholds.
    const published = [
      ...Object.keys(live.rows),
      ...Object.keys(attached.attachedRows),
      ...Object.keys(attached.typedRows),
    ].filter((id) => id.startsWith('fit-'));
    expect(published, `the baseline publishes a per-row outcome for ${published.length} fit ids`).toEqual([]);
  });

  it('matches the captured totals', () => {
    expect(live.metrics).toEqual(baseline.metrics);
    expect(live.unreachable).toEqual(baseline.unreachable);
    // `capturedAtSha` is deliberately not compared: it names the commit of the
    // checkout that ran the capture, not anything the scorer decided.
    expect(live.commands).toEqual(baseline.commands);
    // The attached keys sit outside `metrics` and `commands` by design: they
    // measure what a hub's own compiled route adds on the same rows, kept apart
    // so the bridge numbers above cannot absorb a row the route reached.
    expect(
      live.attachedMetrics,
      `command routing attached reach drifted from the committed baseline; re-capture with \`${RECAPTURE}\` when the change is intended`,
    ).toEqual(baseline.attachedMetrics);
  });

  it('pins the corpus the baseline was captured against', () => {
    // Row comparison can only catch a prompt that stopped routing as expected.
    // The corpus hash catches the other direction: an edited, added or removed
    // prompt that leaves every surviving row untouched.
    expect(live.corpusSha256).toBe(baseline.corpusSha256);
  });

  it('has a typed row and both plain splits for every command file', () => {
    // A command with an empty split carries no evidence either way, so its
    // recall reads as a pass while the corpus never exercised it.
    const uncovered = Object.keys(live.commands).filter((command) => {
      const tally = live.commands[command];
      return tally.typed.rows < 1 || tally.plain.tune.rows < 1 || tally.plain.holdout.rows < 1;
    });
    expect(uncovered).toEqual([]);
  });
});

describe('host capture selection', () => {
  let dir = '';
  let upstream = '';

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'command-routing-host-'));
    upstream = join(dir, 'command-routing-baseline.json');
    writeFileSync(upstream, '{}\n');
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('reads the upstream capture when no host capture sits beside it', () => {
    expect(capturePath(upstream)).toBe(upstream);
  });

  it('reads the host capture when one sits beside the upstream one', () => {
    const host = join(dir, 'command-routing-baseline.host.json');
    writeFileSync(host, '{}\n');
    expect(capturePath(upstream)).toBe(host);
  });
});
