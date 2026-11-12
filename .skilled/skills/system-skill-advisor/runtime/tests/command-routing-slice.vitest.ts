// ───────────────────────────────────────────────────────────────
// MODULE: Command Routing Slice
// ───────────────────────────────────────────────────────────────

// Ratchets live command routing against the committed capture. An aggregate can
// hold still while one row is gained and another lost, so the rows are compared
// one by one and the corpus hash pins the prompts the capture was measured
// against: a scoring change, a bridge-metadata change or a corpus edit has to
// surface here instead of drifting in silently.

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';
import { scoreCommandCorpus as captureCommandCorpus } from '../scripts/routing-accuracy/capture-command-routing-baseline.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING = resolve(HERE, '../scripts/routing-accuracy');
const CORPUS_PATH = join(ROUTING, 'command-prompts.jsonl');
const BASELINE_PATH = join(ROUTING, 'command-routing-baseline.json');
const RECAPTURE = 'node scripts/routing-accuracy/capture-command-routing-baseline.mjs --write';

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

// The capture script is plain JavaScript with no declaration file of its own, so
// the shape it returns is declared here and the import is cast to that shape
// rather than left implicitly `any` at every call site.
const scoreCommandCorpus = captureCommandCorpus as unknown as () => Promise<CommandRoutingBaseline>;

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

describe('command routing slice', () => {
  beforeAll(async () => {
    baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as CommandRoutingBaseline;
    corpus = readJsonl<CorpusRow>(CORPUS_PATH);
    // The capture owns its own environment projection and scoring clock, so it
    // re-scores under the same regime the baseline was recorded in. Doing that
    // setup again here would double it and let the two drift apart.
    live = await scoreCommandCorpus();
  }, 120_000);

  it('matches the captured baseline row by row', () => {
    // Corpus ids come first because a prompt added to the corpus but never
    // captured is absent from both sides and would be invisible to a comparison
    // of the two row maps alone.
    const ids = [
      ...new Set([...corpus.map((row) => row.id), ...Object.keys(baseline.rows), ...Object.keys(live.rows)]),
    ];
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
