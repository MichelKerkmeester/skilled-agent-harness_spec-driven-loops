# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the code was written by DeepSeek V4.1 Flash through Devin; you are MiMo through Pi). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

## What to look for

- Correctness against each requirement in the phase `spec.md`.
- Dormancy (parent D1): with neither Jev nor Deem available, behavior is exactly today's. A Jev arm runs only behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0. A Deem arm runs only behind `--deem` after `cli-deem health` passes. Either failing prints one skip line and changes nothing.
- The zero-call first slice runs with no model call.
- The keep rule is fixed in code before any run: coverage, a margin over the baseline, an exact one-sided sign test at 0.05, a flip bound, and one verdict line `verdict <backend>: keep|kill|stop (...)`. Check the sign test arithmetic on one case by hand.
- Label gate: where the scorer needs operator labels, it prints `stop: fewer than N labeled rows` and no label file was written by a model.
- Secrets: no key, token or `.env` read, and no request that sends one. Jev gets no secret.
- Comment hygiene: no spec path, packet or phase number, REQ, task, ADR or finding id in a code comment.
- Tests: happy path plus one edge case per public surface, stubbed backends for both arms, and no test that asserts nothing or mirrors the implementation.
- Docs: each changed skill doc says what the code does, no more, and names the switches and the gate as the code spells them.

Skip style nits a formatter would settle.

## Severity

- P0: wrong behavior, data loss, a secret leak or a broken build.
- P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, dormancy broken, or a doc that states something the code does not do.
- P2: everything else worth fixing.

## Report (under 400 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Then one line per requirement: `REQ-xxx met|not met|not checked - why`. End with exactly one line `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.

## Appendix: the diff under review

```diff
diff --git a/.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts b/.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts
new file mode 100644
index 0000000000..902c1fe8a9
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts
@@ -0,0 +1,1567 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Alignment Suggestion Measurement
+// ───────────────────────────────────────────────────────────────────
+//
+// Counts below-50 alignment saves per save path and replays both validator paths,
+// with zero model calls. Past a 30-row label gate, an opt-in Jev or Deem column picks
+// one of the folders a save listed. The script holds no credential and reads none.
+
+// ───────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ───────────────────────────────────────────────────────────────────
+
+import { spawn, spawnSync } from 'node:child_process';
+import { createHash } from 'node:crypto';
+import { accessSync, appendFileSync, constants, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
+import { tmpdir } from 'node:os';
+import * as path from 'node:path';
+import { parseArgs } from 'node:util';
+import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';
+import { isArchiveFolder, validateContentAlignment, validateFolderAlignment, type AlignmentCollectedData } from '../spec-folder/alignment-validator.js';
+import { isPathInsideRoot } from '../utils/path-utils.js';
+import type { Dirent } from 'node:fs';
+
+// ───────────────────────────────────────────────────────────────────
+// 2. CONSTANTS AND TYPES
+// ───────────────────────────────────────────────────────────────────
+
+/** Which validator produced a save: the interactive CLI path or the data path. */
+export type SavePath = 'cli' | 'data';
+
+/** Alignment band read from a decision line, never from a printed percentage. */
+export type Band = 'aligned' | 'moderate' | 'low' | 'infrastructure';
+
+/** One alignment save recovered from validator output. */
+export interface AlignmentEvent {
+  path: SavePath;
+  band: Band;
+  target: string | null;
+  printedScore: number | null;
+  alternatives: string[];
+  hardBlock: boolean;
+  pick: string | null;
+}
+
+/** Per-path census totals over a set of events. */
+export interface PathCounts {
+  aligned: number;
+  moderate: number;
+  low: number;
+  infrastructure: number;
+  below50: number;
+  withAlternatives: number;
+  withoutAlternatives: number;
+  hardBlocks: number;
+  picks: number;
+}
+
+const LABEL_GATE = 30;
+const PASSES = 3;
+const JEV_VERSION = 'jev 0.6.2';
+const CHOICE_QUESTION = 'Which spec folder should this save go to?';
+const NONE_KEY = 'none_of_these';
+const NONE_DESCRIPTION = 'None of these folders';
+const DEEM_MODEL = 'deem-0.8-v1';
+const DEEM_P50_MS = 65.6;
+const HEALTH_TIMEOUT_MS = 2000;
+const CALL_TIMEOUT_MS = 90000;
+const BACKOFF_MS = 2000;
+const MARGIN_TEXT = '0.10';
+
+const REPO_ROOT = path.resolve(dirnameFromImportMeta(import.meta.url), '..', '..', '..', '..', '..', '..');
+const SPECS_ROOT = path.join(REPO_ROOT, 'specs');
+
+// ───────────────────────────────────────────────────────────────────
+// 3. LINE SCAN
+// ───────────────────────────────────────────────────────────────────
+
+const CLI_HEADER = /Phase 1B Alignment: (.+) \((\d+)% match\)\s*$/;
+const DATA_HEADER = /Alignment check: (.+) \((\d+)% match\)\s*$/;
+
+const CLI_ALIGNED = /^\s*(?:Warning: )?Content aligns with target folder\s*(?:"[,}\]].*)?$/;
+const CLI_MODERATE = /^\s*(?:Warning: )?Moderate alignment \(\d+%\) - proceeding with caution\s*(?:"[,}\]].*)?$/;
+const CLI_LOW = /^\s*(?:Warning: )?ALIGNMENT WARNING: Content may not match target folder\s*(?:"[,}\]].*)?$/;
+const CLI_INFRASTRUCTURE = /^\s*(?:Warning: )?INFRASTRUCTURE ALIGNMENT WARNING\s*(?:"[,}\]].*)?$/;
+
+const DATA_ALIGNED = /^\s*(?:Warning: )?Good alignment with selected folder\s*(?:"[,}\]].*)?$/;
+const DATA_MODERATE = /^\s*(?:Warning: )?Moderate alignment - proceeding with caution\s*(?:"[,}\]].*)?$/;
+const DATA_LOW = /^\s*(?:Warning: )?LOW ALIGNMENT WARNING \(\d+% match\)\s*(?:"[,}\]].*)?$/;
+const DATA_INFRASTRUCTURE = /^\s*(?:Warning: )?INFRASTRUCTURE MISMATCH \(\d+% of files in \.(?:skilled|opencode)\/\)\s*(?:"[,}\]].*)?$/;
+
+const TARGET_LINE = /^\s*Target folder: (.+) \((\d+)% match\)\s*$/;
+const LIST_START = /^\s*(?:Better matching folders found|Better matching alternatives):\s*$/;
+const LIST_ITEM = /^\s*\d+\. (.+) \((\d+)% match\)\s*$/;
+const HARD_BLOCK = /^\s*ALIGNMENT_HARD_BLOCK:/;
+const PICK_SWITCH = /^\s*Switching to: (.+?)\s*$/;
+const PICK_REQUESTED = /^\s*(?:Continuing|Proceeding) with "(.+)" as requested\s*$/;
+
+interface HeaderHit {
+  path: SavePath;
+  target: string;
+  score: number;
+  index: number;
+}
+
+interface DecisionHit {
+  path: SavePath;
+  band: Band;
+}
+
+function matchHeader(line: string): { path: SavePath; target: string; score: number } | null {
+  const cli = CLI_HEADER.exec(line);
+  if (cli) return { path: 'cli', target: cli[1], score: Number(cli[2]) };
+  const data = DATA_HEADER.exec(line);
+  if (data) return { path: 'data', target: data[1], score: Number(data[2]) };
+  return null;
+}
+
+function matchDecision(line: string): DecisionHit | null {
+  if (CLI_ALIGNED.test(line)) return { path: 'cli', band: 'aligned' };
+  if (CLI_MODERATE.test(line)) return { path: 'cli', band: 'moderate' };
+  if (CLI_LOW.test(line)) return { path: 'cli', band: 'low' };
+  if (CLI_INFRASTRUCTURE.test(line)) return { path: 'cli', band: 'infrastructure' };
+  if (DATA_ALIGNED.test(line)) return { path: 'data', band: 'aligned' };
+  if (DATA_MODERATE.test(line)) return { path: 'data', band: 'moderate' };
+  if (DATA_LOW.test(line)) return { path: 'data', band: 'low' };
+  if (DATA_INFRASTRUCTURE.test(line)) return { path: 'data', band: 'infrastructure' };
+  return null;
+}
+
+/**
+ * Turns JSON-style escapes into real characters, so one line rule can read plain
+ * validator output and the same output embedded in a JSON log.
+ */
+export function normalizeText(text: string): string {
+  return text
+    .replace(/\\r\\n|\\n/g, '\n')
+    .replace(/\\t/g, ' ')
+    .replace(/\\"/g, '"')
+    .replace(/\r\n/g, '\n');
+}
+
+function fillFromLines(lines: string[], decisionIndex: number, event: AlignmentEvent): void {
+  const limit = Math.min(lines.length, decisionIndex + 21);
+  let listStarted = false;
+  for (let j = decisionIndex + 1; j < limit; j++) {
+    const line = lines[j];
+    if (matchHeader(line) || matchDecision(line)) break;
+
+    const target = TARGET_LINE.exec(line);
+    if (target) {
+      if (event.target === null) event.target = target[1];
+      if (event.printedScore === null) event.printedScore = Number(target[2]);
+      continue;
+    }
+
+    if (LIST_START.test(line)) {
+      listStarted = true;
+      continue;
+    }
+
+    const item = LIST_ITEM.exec(line);
+    if (item && listStarted) {
+      event.alternatives.push(item[1]);
+      continue;
+    }
+
+    if (HARD_BLOCK.test(line)) {
+      event.hardBlock = true;
+      continue;
+    }
+
+    const pick = PICK_SWITCH.exec(line) ?? PICK_REQUESTED.exec(line);
+    if (pick) event.pick = pick[1];
+  }
+}
+
+/**
+ * Scans validator output and returns one event per decision line, in text order.
+ * A band comes from the decision line only, never from a printed percentage.
+ */
+export function scanText(text: string): AlignmentEvent[] {
+  const lines = normalizeText(text).split('\n');
+  const events: AlignmentEvent[] = [];
+  let header: HeaderHit | null = null;
+
+  for (let i = 0; i < lines.length; i++) {
+    const line = lines[i];
+
+    const hit = matchHeader(line);
+    if (hit) {
+      header = { ...hit, index: i };
+      continue;
+    }
+
+    const decision = matchDecision(line);
+    if (!decision) continue;
+
+    const event: AlignmentEvent = {
+      path: decision.path,
+      band: decision.band,
+      target: null,
+      printedScore: null,
+      alternatives: [],
+      hardBlock: false,
+      pick: null,
+    };
+
+    if (header && header.path === decision.path && i - header.index <= 8) {
+      event.target = header.target;
+      event.printedScore = header.score;
+    }
+    header = null;
+
+    if (decision.band === 'low' || decision.band === 'infrastructure') {
+      fillFromLines(lines, i, event);
+    }
+
+    events.push(event);
+  }
+
+  return events;
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 4. CENSUS
+// ───────────────────────────────────────────────────────────────────
+
+/** File extensions treated as source code: a save printed from one is not conversation output. */
+const SOURCE_EXTENSIONS = new Set([
+  '.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs', '.jsx', '.py', '.sh', '.bash', '.zsh',
+  '.rs', '.go', '.java', '.rb', '.c', '.h', '.cpp', '.swift', '.kt', '.php', '.lua',
+]);
+
+/** The eight decision texts as plain strings, for a fixed-string `git grep`. */
+const DECISION_PHRASES = [
+  'Content aligns with target folder',
+  'Moderate alignment (',
+  'ALIGNMENT WARNING: Content may not match',
+  'INFRASTRUCTURE ALIGNMENT WARNING',
+  'Good alignment with selected folder',
+  'Moderate alignment - proceeding',
+  'LOW ALIGNMENT WARNING',
+  'INFRASTRUCTURE MISMATCH (',
+];
+
+/**
+ * Lists tracked files whose text mentions a decision phrase, dropping source files so
+ * the census counts conversation saves rather than the code that prints them.
+ */
+export function listTrackedCandidates(root: string): { files: string[]; skippedSource: number } {
+  const args = ['-C', root, 'grep', '-l', '-I', '-F'];
+  for (const phrase of DECISION_PHRASES) args.push('-e', phrase);
+  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
+  if (result.status !== 0 && result.status !== 1) throw new Error('git grep failed');
+
+  const files: string[] = [];
+  let skippedSource = 0;
+  for (const line of result.stdout.split('\n')) {
+    if (line === '') continue;
+    if (SOURCE_EXTENSIONS.has(path.extname(line))) {
+      skippedSource += 1;
+      continue;
+    }
+    files.push(path.join(root, line));
+  }
+  return { files, skippedSource };
+}
+
+/** Reads each file as UTF-8 and returns every event it holds, with the count of files read. */
+export function censusFiles(files: string[]): { files: number; events: AlignmentEvent[] } {
+  const events: AlignmentEvent[] = [];
+  for (const file of files) {
+    events.push(...scanText(readFileSync(file, 'utf8')));
+  }
+  return { files: files.length, events };
+}
+
+function emptyCounts(): PathCounts {
+  return {
+    aligned: 0,
+    moderate: 0,
+    low: 0,
+    infrastructure: 0,
+    below50: 0,
+    withAlternatives: 0,
+    withoutAlternatives: 0,
+    hardBlocks: 0,
+    picks: 0,
+  };
+}
+
+/**
+ * Totals events per save path: one count per band, plus below-50, alternatives,
+ * hard-block and pick counts.
+ */
+export function summarizeEvents(events: AlignmentEvent[]): Record<SavePath, PathCounts> {
+  const counts: Record<SavePath, PathCounts> = { cli: emptyCounts(), data: emptyCounts() };
+  for (const event of events) {
+    const pathCounts = counts[event.path];
+    pathCounts[event.band] += 1;
+    if (event.band === 'low' || event.band === 'infrastructure') {
+      pathCounts.below50 += 1;
+      if (event.alternatives.length > 0) pathCounts.withAlternatives += 1;
+      else pathCounts.withoutAlternatives += 1;
+    }
+    if (event.hardBlock) pathCounts.hardBlocks += 1;
+    if (event.pick !== null) pathCounts.picks += 1;
+  }
+  return counts;
+}
+
+/** Formats one count line per save path, cli first. */
+export function formatPathLines(label: string, counts: Record<SavePath, PathCounts>): string[] {
+  return (['cli', 'data'] as const).map((savePath) => {
+    const c = counts[savePath];
+    return `${label} path ${savePath}: aligned=${c.aligned} moderate=${c.moderate} low=${c.low} infrastructure=${c.infrastructure} below50=${c.below50} with_alternatives=${c.withAlternatives} without_alternatives=${c.withoutAlternatives} hard_blocks=${c.hardBlocks} picks=${c.picks}`;
+  });
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 5. PATH REPLAY
+// ───────────────────────────────────────────────────────────────────
+
+/** Collected-data fixture for the replay: one topic-rich request and no observations. */
+const REPLAY_DATA: AlignmentCollectedData = {
+  recentContext: [{ request: 'quantum lattice orchard telemetry' }],
+  observations: [],
+};
+
+/**
+ * Replays one validator path over a root and returns the numbered folders it saw
+ * plus the decision and alternatives the validator printed, with no model call.
+ */
+export async function replayPath(
+  savePath: SavePath,
+  root: string,
+  target: string
+): Promise<{ numberedFolders: number; decision: Band | null; alternatives: string[] }> {
+  let numberedFolders: number;
+  try {
+    numberedFolders = readdirSync(root).filter((name) => /^\d{3}-/.test(name) && !isArchiveFolder(name)).length;
+  } catch {
+    numberedFolders = 0;
+  }
+
+  const collected: string[] = [];
+  const originalLog = console.log;
+  const stdoutIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
+  const stdinIsTTY = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
+
+  try {
+    console.log = (...args: unknown[]) => {
+      collected.push(args.map((arg) => String(arg)).join(' '));
+    };
+    Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
+    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
+    if (savePath === 'cli') await validateContentAlignment(REPLAY_DATA, target, root);
+    else await validateFolderAlignment(REPLAY_DATA, target, root);
+  } finally {
+    console.log = originalLog;
+    if (stdoutIsTTY === undefined) delete (process.stdout as { isTTY?: boolean }).isTTY;
+    else Object.defineProperty(process.stdout, 'isTTY', stdoutIsTTY);
+    if (stdinIsTTY === undefined) delete (process.stdin as { isTTY?: boolean }).isTTY;
+    else Object.defineProperty(process.stdin, 'isTTY', stdinIsTTY);
+  }
+
+  const first = scanText(collected.join('\n'))[0];
+  return {
+    numberedFolders,
+    decision: first ? first.band : null,
+    alternatives: first ? first.alternatives : [],
+  };
+}
+
+/**
+ * Builds a throwaway tree shaped like a specs root, so the data replay lists
+ * alternatives without reading the real specs. The caller removes the tree.
+ */
+export function buildSyntheticTree(): { root: string; target: string } {
+  const root = mkdtempSync(path.join(tmpdir(), 'alignment-replay-'));
+  for (const name of ['001-billing-export', '002-quantum-lattice-orchard', '003-quantum-telemetry', 'z_archive']) {
+    mkdirSync(path.join(root, name));
+  }
+  return { root, target: '001-billing-export' };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 6. TRANSCRIPTS AND ROWS
+// ───────────────────────────────────────────────────────────────────
+
+/** Transcript file extensions: JSONL records, JSON logs and captured plain output. */
+const TRANSCRIPT_EXTENSIONS = new Set(['.jsonl', '.json', '.log', '.txt', '.out']);
+
+/** The save call's summary key, one escape level deep inside a JSON payload. */
+const SESSION_SUMMARY = /"sessionSummary"\s*:\s*"((?:[^"\\]|\\.)*)"/;
+
+/** Visits every JSON object inside a parsed value, arrays included. */
+function walkJsonObjects(value: unknown, visit: (record: Record<string, unknown>) => void): void {
+  if (Array.isArray(value)) {
+    for (const item of value) walkJsonObjects(item, visit);
+    return;
+  }
+  if (value === null || typeof value !== 'object') return;
+  const record = value as Record<string, unknown>;
+  visit(record);
+  for (const key of Object.keys(record)) walkJsonObjects(record[key], visit);
+}
+
+/**
+ * Reads the session summary a save call carried. The summary sits inside a string that
+ * is itself escaped in the surrounding payload, so a miss unwraps one escape level and
+ * retries, up to three levels.
+ */
+export function extractSessionSummary(text: string): string | null {
+  let candidate = text;
+  for (let attempt = 0; attempt < 4; attempt++) {
+    if (attempt > 0) candidate = candidate.replace(/\\(["\\])/g, '$1');
+    const match = SESSION_SUMMARY.exec(candidate);
+    if (!match) continue;
+    try {
+      const value: unknown = JSON.parse(`"${match[1]}"`);
+      return typeof value === 'string' && value !== '' ? value : null;
+    } catch {
+      return null;
+    }
+  }
+  return null;
+}
+
+/**
+ * Scans one transcript file. Every JSON line yields the saves it holds, each paired with
+ * the summary of the tool call that produced the output; a record with no tool_result is
+ * scanned whole. A file with no JSON line is scanned as validator output with a null state.
+ */
+export function scanTranscriptFile(text: string): Array<AlignmentEvent & { state: string | null }> {
+  const records: Array<{ line: string; record: unknown }> = [];
+  for (const line of text.split('\n')) {
+    try {
+      records.push({ line, record: JSON.parse(line) as unknown });
+    } catch {
+      // not JSON: only the whole-text fallback below reads such a line
+    }
+  }
+  if (records.length === 0) return scanText(text).map((event) => ({ ...event, state: null }));
+
+  const toolUses = new Map<string, string>();
+  for (const { record } of records) {
+    walkJsonObjects(record, (object) => {
+      if (object.type === 'tool_use' && typeof object.id === 'string' && 'input' in object) {
+        toolUses.set(object.id, JSON.stringify(object.input));
+      }
+    });
+  }
+
+  const events: Array<AlignmentEvent & { state: string | null }> = [];
+  for (const { line, record } of records) {
+    const blocks: Array<{ toolUseId: string; text: string }> = [];
+    walkJsonObjects(record, (object) => {
+      if (object.type !== 'tool_result' || typeof object.tool_use_id !== 'string') return;
+      const content = object.content;
+      if (typeof content === 'string') blocks.push({ toolUseId: object.tool_use_id, text: content });
+      else if (Array.isArray(content)) {
+        for (const item of content) {
+          if (item === null || typeof item !== 'object') continue;
+          const itemText = (item as Record<string, unknown>).text;
+          if (typeof itemText === 'string') blocks.push({ toolUseId: object.tool_use_id, text: itemText });
+        }
+      }
+    });
+
+    const found: Array<AlignmentEvent & { state: string | null }> = [];
+    if (blocks.length > 0) {
+      for (const block of blocks) {
+        const state = extractSessionSummary(toolUses.get(block.toolUseId) ?? '');
+        for (const event of scanText(block.text)) found.push({ ...event, state });
+      }
+    } else {
+      const state = extractSessionSummary(line);
+      for (const event of scanText(line)) found.push({ ...event, state });
+    }
+
+    // One output echoed into two fields is one save, so identical events count once.
+    const seen = new Set<string>();
+    for (const event of found) {
+      const key = JSON.stringify(event);
+      if (seen.has(key)) continue;
+      seen.add(key);
+      events.push(event);
+    }
+  }
+
+  return events;
+}
+
+/** Lists the transcript files under a directory: recursive, sorted, by extension. */
+export function listTranscriptFiles(dir: string): string[] {
+  const files: string[] = [];
+  for (const entry of readdirSync(dir, { withFileTypes: true })) {
+    const full = path.join(dir, entry.name);
+    if (entry.isDirectory()) files.push(...listTranscriptFiles(full));
+    else if (entry.isFile() && TRANSCRIPT_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
+  }
+  return files.sort();
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 7. SCORER AND GATE
+// ───────────────────────────────────────────────────────────────────
+
+/** One labeled save row: the folders a save listed plus the label to score against. */
+export interface Row {
+  id: string;
+  path: string;
+  target: string;
+  alternatives: string[];
+  state: string | null;
+  gold: string | null;
+  label: string;
+}
+
+/** True when a parsed JSON value carries every field the row shape requires. */
+function isRow(value: unknown): value is Row {
+  if (value === null || typeof value !== 'object') return false;
+  const record = value as Record<string, unknown>;
+  return (
+    typeof record.id === 'string' &&
+    typeof record.path === 'string' &&
+    typeof record.target === 'string' &&
+    Array.isArray(record.alternatives) &&
+    record.alternatives.every((item) => typeof item === 'string') &&
+    (record.state === null || typeof record.state === 'string') &&
+    (record.gold === null || typeof record.gold === 'string') &&
+    typeof record.label === 'string'
+  );
+}
+
+/**
+ * Parses a rows file: one JSON row per line, blank lines skipped. The first line
+ * that fails JSON or the row shape ends the parse with its 1-based line number.
+ */
+export function parseRows(text: string): { rows: Row[] } | { error: string } {
+  const rows: Row[] = [];
+  const lines = text.split('\n');
+  for (let i = 0; i < lines.length; i++) {
+    if (lines[i].trim() === '') continue;
+    let value: unknown;
+    try {
+      value = JSON.parse(lines[i]) as unknown;
+    } catch {
+      return { error: `bad row at line ${i + 1}` };
+    }
+    if (!isRow(value)) return { error: `bad row at line ${i + 1}` };
+    rows.push(value);
+  }
+  return { rows };
+}
+
+/** The folder keys a row offers, target first and the none-of-these key last. */
+export function rowOptions(row: Row): string[] {
+  return [row.target, ...row.alternatives, NONE_KEY];
+}
+
+/** The row's label when it names an option, else its gold pick when that names one, else none. */
+export function effectiveLabel(row: Row): string | null {
+  const label = row.label.trim();
+  if (label !== '') return label;
+  if (row.gold !== null && rowOptions(row).includes(row.gold)) return row.gold;
+  return null;
+}
+
+/** Ids of rows whose non-empty trimmed label names no option of that row. */
+export function foreignLabelIds(rows: Row[]): string[] {
+  return rows
+    .filter((row) => {
+      const label = row.label.trim();
+      return label !== '' && !rowOptions(row).includes(label);
+    })
+    .map((row) => row.id);
+}
+
+/**
+ * Picks the scoring baseline over the rows that carry an effective label: the target
+ * answer, unless the top alternative is strictly more often right.
+ */
+export function chooseBaseline(rows: Row[]): { target: number; top: number; chosen: 'target' | 'top' } {
+  let target = 0;
+  let top = 0;
+  for (const row of rows) {
+    const label = effectiveLabel(row);
+    if (label === null) continue;
+    if (row.target === label) target += 1;
+    if (row.alternatives[0] === label) top += 1;
+  }
+  return { target, top, chosen: top > target ? 'top' : 'target' };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 8. KEEP RULE
+// ───────────────────────────────────────────────────────────────────
+
+/**
+ * Upper tail P(X >= k) of a binomial with n trials and p = 0.5, summed as
+ * C(n, i) * 0.5^n over i = k..n.
+ */
+export function binomTail(n: number, k: number): number {
+  if (k <= 0) return 1;
+  if (k > n) return 0;
+  let tail = 0;
+  for (let i = k; i <= n; i++) tail += binomialCoefficient(n, i) * 0.5 ** n;
+  return tail;
+}
+
+/** C(n, k) as the multiplicative product of (n - k + j) / j for j = 1..k. */
+function binomialCoefficient(n: number, k: number): number {
+  let coefficient = 1;
+  for (let j = 1; j <= k; j++) coefficient = (coefficient * (n - k + j)) / j;
+  return coefficient;
+}
+
+/**
+ * Reduces one row's passes to a single answer: the key given at least twice, `unstable`
+ * when all three differ, or nothing when any pass gave no answer.
+ */
+export function modalPick(picks: Array<string | null>): { pick: string | null; flips: number } {
+  const counts = new Map<string, number>();
+  for (const pick of picks) {
+    if (pick === null) return { pick: null, flips: 0 };
+    counts.set(pick, (counts.get(pick) ?? 0) + 1);
+  }
+  for (const [key, count] of counts) {
+    if (count >= 2) return { pick: key, flips: 3 - count };
+  }
+  return { pick: 'unstable', flips: 2 };
+}
+
+/**
+ * Counts the keep rule needs: callable rows K, measured rows M, the right counts
+ * A and B, the disagreements W and L, and flips F.
+ */
+export interface VerdictCounts {
+  K: number;
+  M: number;
+  A: number;
+  B: number;
+  W: number;
+  L: number;
+  F: number;
+}
+
+/**
+ * Counts the keep rule over the callable rows: a row is measured when all three passes
+ * answered, and each measured row compares its modal pick and the baseline answer to
+ * its effective label.
+ */
+export function countVerdict(rows: Row[], picks: Record<string, Array<string | null>>, chosen: 'target' | 'top'): VerdictCounts {
+  const counts: VerdictCounts = { K: rows.length, M: 0, A: 0, B: 0, W: 0, L: 0, F: 0 };
+  for (const row of rows) {
+    const rowPicks = picks[row.id];
+    if (rowPicks === undefined || rowPicks.length !== PASSES || rowPicks.some((pick) => pick === null)) continue;
+
+    const { pick, flips } = modalPick(rowPicks);
+    const label = effectiveLabel(row);
+    const baselineAnswer = chosen === 'target' ? row.target : row.alternatives[0];
+    const columnRight = pick === label;
+    const baselineRight = baselineAnswer === label;
+
+    counts.M += 1;
+    counts.F += flips;
+    if (columnRight) counts.A += 1;
+    if (baselineRight) counts.B += 1;
+    if (columnRight && !baselineRight) counts.W += 1;
+    if (baselineRight && !columnRight) counts.L += 1;
+  }
+  return counts;
+}
+
+/**
+ * Applies the keep rule in order: coverage, kill, margin, sign test, flips, keep.
+ * The p value is the sign-test tail, except a kill reports its tail and coverage reports 1.
+ */
+export function decideVerdict(c: VerdictCounts): { verdict: string; p: number } {
+  if (10 * c.M < 9 * c.K) return { verdict: 'stop (coverage)', p: 1 };
+
+  const killP = binomTail(c.W + c.L, c.L);
+  if (c.W + c.L > 0 && killP <= 0.05) return { verdict: 'kill', p: killP };
+
+  const signP = c.W + c.L === 0 ? 1 : binomTail(c.W + c.L, c.W);
+  if (10 * (c.A - c.B) < c.M) return { verdict: 'stop (margin)', p: signP };
+  if (signP >= 0.05) return { verdict: 'stop (sign test)', p: signP };
+  if (10 * c.F > 3 * c.M) return { verdict: 'stop (flips)', p: signP };
+  return { verdict: 'keep', p: signP };
+}
+
+/**
+ * One verdict line: the counts, the p value at four decimals, the baseline and the
+ * backend identity.
+ */
+export function verdictLine(
+  backend: 'jev' | 'deem',
+  c: VerdictCounts,
+  v: { verdict: string; p: number },
+  baseline: 'target' | 'top',
+  extra: string
+): string {
+  return `verdict ${backend}: ${v.verdict} K=${c.K} M=${c.M} A=${c.A} B=${c.B} W=${c.W} L=${c.L} F=${c.F} p=${v.p.toFixed(4)} baseline=${baseline} ${extra}`;
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 9. BACKEND GATES
+// ───────────────────────────────────────────────────────────────────
+
+/** First executable regular file named `name` on `env.PATH`, else null. */
+function which(name: string, env: NodeJS.ProcessEnv): string | null {
+  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
+    if (dir === '') continue;
+    const candidate = path.join(dir, name);
+    try {
+      if (!statSync(candidate).isFile()) continue;
+      accessSync(candidate, constants.X_OK);
+      return candidate;
+    } catch {
+      // missing, unreadable or not executable: try the next PATH entry
+    }
+  }
+  return null;
+}
+
+/**
+ * Gates the Jev arm: the CLI must sit on PATH at the pinned version, hold a credential
+ * for the provider, and the operator must have accepted sending payloads. The checks
+ * carry identity only; no key, provider secret or row text is passed to them.
+ */
+export function jevGate(ctx: { out: (line: string) => void; env: NodeJS.ProcessEnv; acceptPayload: boolean }): { passed: boolean; path: string | null; provider: string } {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const jevPath = which('jev', ctx.env);
+  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
+  if (jevPath === null) {
+    ctx.out('jev arm skipped: jev not on PATH');
+    return { passed: false, path: null, provider };
+  }
+
+  const version = spawnSync(jevPath, ['--version'], {
+    stdio: ['ignore', 'pipe', 'pipe'],
+    encoding: 'utf8',
+    timeout: HEALTH_TIMEOUT_MS * 5,
+    env: ctx.env,
+  });
+  const found = (version.stdout ?? '').split('\n')[0];
+  if (found !== JEV_VERSION) {
+    ctx.out('jev arm skipped: version');
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
+    return { passed: false, path: jevPath, provider };
+  }
+
+  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], {
+    stdio: ['ignore', 'pipe', 'pipe'],
+    encoding: 'utf8',
+    timeout: HEALTH_TIMEOUT_MS * 5,
+    env: ctx.env,
+  });
+  if (auth.status !== 0) {
+    ctx.out('jev arm skipped: no credential');
+    return { passed: false, path: jevPath, provider };
+  }
+
+  if (!ctx.acceptPayload) {
+    ctx.out('jev arm skipped: payload not accepted');
+    return { passed: false, path: jevPath, provider };
+  }
+
+  return { passed: true, path: jevPath, provider };
+}
+
+/** The Deem CLI to probe: the one on PATH, else the repo script under the running Node. */
+export function deemCommand(env: NodeJS.ProcessEnv): string[] {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs')];
+}
+
+/**
+ * Reads Deem health through its CLI: only a torch or ensemble backend on the pinned
+ * model with non-empty commits counts as healthy. The probe carries no row text and
+ * no credential.
+ */
+export function readDeemHealth(
+  cmd: string[],
+  env: NodeJS.ProcessEnv
+): { ok: true; backend: string; model: string; modelCommit: string; sourceCommit: string } | { ok: false; reason: string; found: unknown } {
+  const run = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
+    stdio: ['ignore', 'pipe', 'pipe'],
+    encoding: 'utf8',
+    timeout: HEALTH_TIMEOUT_MS,
+    env,
+  });
+
+  if (run.error !== undefined || run.signal !== null || run.status === 4) {
+    return { ok: false, reason: 'not reachable', found: null };
+  }
+
+  const stdout = (run.stdout ?? '').trim();
+
+  if (run.status === 3) {
+    let errorText = '';
+    try {
+      const parsed = JSON.parse((run.stderr ?? '').trim()) as unknown;
+      if (parsed !== null && typeof parsed === 'object') {
+        const error = (parsed as Record<string, unknown>).error;
+        if (typeof error === 'string') errorText = error;
+      }
+    } catch {
+      // a non-JSON stderr falls through to the generic reason below
+    }
+    if (errorText.includes('stub')) return { ok: false, reason: 'stub backend', found: errorText };
+    if (errorText.includes('refused model')) return { ok: false, reason: 'model', found: errorText };
+    return { ok: false, reason: 'bad health response', found: (run.stderr ?? '').trim() };
+  }
+
+  if (run.status !== 0) {
+    return { ok: false, reason: 'bad health response', found: (run.stderr ?? '').trim() };
+  }
+
+  let parsed: unknown;
+  try {
+    parsed = JSON.parse(stdout) as unknown;
+  } catch {
+    return { ok: false, reason: 'bad health response', found: stdout };
+  }
+  if (parsed === null || typeof parsed !== 'object') {
+    return { ok: false, reason: 'bad health response', found: stdout };
+  }
+
+  const record = parsed as Record<string, unknown>;
+  const backend = record.backend;
+  const model = record.model;
+  if (typeof backend !== 'string') return { ok: false, reason: 'bad health response', found: stdout };
+  if (backend.includes('stub')) return { ok: false, reason: 'stub backend', found: backend };
+  if (backend !== 'torch' && !backend.startsWith('ensemble:')) {
+    return { ok: false, reason: 'bad health response', found: stdout };
+  }
+  if (typeof model !== 'string' || model !== DEEM_MODEL) {
+    return { ok: false, reason: 'model', found: typeof model === 'string' ? model : stdout };
+  }
+
+  const modelCommit = record.model_commit;
+  const sourceCommit = record.source_commit;
+  if (record.ok !== true || typeof modelCommit !== 'string' || modelCommit === '' || typeof sourceCommit !== 'string' || sourceCommit === '') {
+    return { ok: false, reason: 'bad health response', found: stdout };
+  }
+
+  return { ok: true, backend, model, modelCommit, sourceCommit };
+}
+
+/**
+ * Runs the Deem gate: a healthy backend prints its identity and hands the arm its command
+ * and identity; any other answer prints why the arm is skipped.
+ */
+export function deemGate(
+  ctx: { out: (line: string) => void; env: NodeJS.ProcessEnv }
+): { passed: false } | { passed: true; cmd: string[]; model: string; modelCommit: string; sourceCommit: string } {
+  const cmd = deemCommand(ctx.env);
+  const health = readDeemHealth(cmd, ctx.env);
+  if (!health.ok) {
+    ctx.out(`deem arm skipped: ${health.reason}`);
+    if (health.reason === 'model' || health.reason === 'bad health response') {
+      ctx.out(`deem: found=${JSON.stringify(health.found)}`);
+    }
+    return { passed: false };
+  }
+
+  ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
+  return { passed: true, cmd, model: health.model, modelCommit: health.modelCommit, sourceCommit: health.sourceCommit };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 10. MODEL ARMS
+// ───────────────────────────────────────────────────────────────────
+
+/** One backend call: its streams, exit code, wall time and whether the timeout killed it. */
+interface CallResult {
+  stdout: string;
+  stderr: string;
+  code: number;
+  wallMs: number;
+  timedOut: boolean;
+}
+
+/** One calls.jsonl line: what a call was and what it returned, never the row state. */
+interface CallRecord {
+  backend: 'jev' | 'deem';
+  row_id: string | null;
+  order: number | null;
+  wall_ms: number;
+  exit_code: number;
+  pick: string | null;
+  pick_prob: number | null;
+  status: string;
+  options_hash: string | null;
+  model?: string | null;
+  model_commit?: string | null;
+  source_commit?: string | null;
+  jev_version?: string;
+  provider?: string;
+}
+
+/** One call's classification: the measured pick, or a null pick with why it was not measured. */
+interface Classification {
+  pick: string | null;
+  pickProb: number | null;
+  status: string;
+}
+
+/** One call step's outcome for the row loop: the measured pick, or the stop that ended the arm. */
+type StepOutcome = { pick: string | null } | { stop: string };
+
+/** One arm run's outcome: its verdict line, or the stop line with the rows finished before it. */
+type ArmOutcome =
+  | { line: string; verdict: string; counts: VerdictCounts; p: number }
+  | { stopped: string; partialRows: number };
+
+/** The classification of a call that produced no usable pick. */
+const UNMEASURED: Classification = { pick: null, pickProb: null, status: 'unmeasured' };
+
+/** Directory entries of `dir`, or none when it cannot be read. */
+function readEntries(dir: string): Dirent[] {
+  try {
+    return readdirSync(dir, { withFileTypes: true });
+  } catch {
+    return [];
+  }
+}
+
+/**
+ * Builds the folder describer the arms send. A folder that names its own path reads that
+ * folder's description.json; a bare name reads the one folder of that name under the specs
+ * root that holds one. A missing file, a non-string description or two folders with the
+ * same name fall back to the folder name. The name index is built once.
+ */
+export function buildDescriber(specsRoot: string): (folder: string) => string {
+  let byName: Map<string, string[]> | null = null;
+
+  const indexByName = (): Map<string, string[]> => {
+    if (byName !== null) return byName;
+    const index = new Map<string, string[]>();
+    const walk = (dir: string): void => {
+      const entries = readEntries(dir);
+      if (entries.some((entry) => entry.isFile() && entry.name === 'description.json')) {
+        const name = path.basename(dir);
+        index.set(name, [...(index.get(name) ?? []), dir]);
+      }
+      for (const entry of entries) {
+        if (entry.isDirectory()) walk(path.join(dir, entry.name));
+      }
+    };
+    walk(specsRoot);
+    byName = index;
+    return index;
+  };
+
+  return (folder: string): string => {
+    let file: string | null = null;
+    if (folder.includes('/')) {
+      file = path.join(specsRoot, folder, 'description.json');
+    } else {
+      const dirs = indexByName().get(folder) ?? [];
+      if (dirs.length === 1) file = path.join(dirs[0], 'description.json');
+    }
+    if (file !== null) {
+      try {
+        const parsed = JSON.parse(readFileSync(file, 'utf8')) as unknown;
+        if (parsed !== null && typeof parsed === 'object') {
+          const description = (parsed as Record<string, unknown>).description;
+          if (typeof description === 'string') return description;
+        }
+      } catch {
+        // Unreadable or unparseable file: fall back to the folder name
+      }
+    }
+    return folder;
+  };
+}
+
+/**
+ * Runs one backend call and resolves with its streams, exit code, wall time and whether
+ * the timeout killed it. A signal death reads as -1 and a spawn error as 127, so every
+ * call still leaves a record.
+ */
+function spawnCall(
+  file: string,
+  args: string[],
+  stdinText: string,
+  env: NodeJS.ProcessEnv,
+  timeoutMs: number
+): Promise<CallResult> {
+  return new Promise((resolve) => {
+    const started = Date.now();
+    const child = spawn(file, args, { stdio: ['pipe', 'pipe', 'pipe'], env });
+    let stdout = '';
+    let stderr = '';
+    let timedOut = false;
+    let settled = false;
+    let timer: NodeJS.Timeout | undefined;
+
+    const settle = (code: number): void => {
+      if (settled) return;
+      settled = true;
+      if (timer !== undefined) clearTimeout(timer);
+      resolve({ stdout, stderr, code, wallMs: Date.now() - started, timedOut });
+    };
+
+    timer = setTimeout(() => {
+      timedOut = true;
+      child.kill('SIGKILL');
+    }, timeoutMs);
+
+    child.stdout.on('data', (chunk: Buffer) => {
+      stdout += chunk.toString('utf8');
+    });
+    child.stderr.on('data', (chunk: Buffer) => {
+      stderr += chunk.toString('utf8');
+    });
+    child.on('error', () => settle(127));
+    child.on('close', (code, signal) => settle(code ?? (signal !== null ? -1 : 127)));
+    child.stdin.on('error', () => {
+      // The child may exit before its input is written; the exit code carries the outcome
+    });
+    child.stdin.end(stdinText);
+  });
+}
+
+/** Appends one call record to `<outDir>/calls.jsonl`, the run's audit trail. */
+function writeCall(outDir: string, record: CallRecord): void {
+  mkdirSync(outDir, { recursive: true });
+  appendFileSync(path.join(outDir, 'calls.jsonl'), `${JSON.stringify(record)}\n`);
+}
+
+/** Parses stdout as JSON, or null when it is not JSON. */
+function tryJson(text: string): unknown {
+  try {
+    return JSON.parse(text) as unknown;
+  } catch {
+    return null;
+  }
+}
+
+/** Reads `answers.answer.choice` and its probability from a call's stdout JSON. */
+function readAnswer(parsed: unknown): { choice: string | null; probability: number | null } {
+  if (parsed === null || typeof parsed !== 'object') return { choice: null, probability: null };
+  const answers = (parsed as Record<string, unknown>).answers;
+  if (answers === null || typeof answers !== 'object') return { choice: null, probability: null };
+  const answer = (answers as Record<string, unknown>).answer;
+  if (answer === null || typeof answer !== 'object') return { choice: null, probability: null };
+  const record = answer as Record<string, unknown>;
+  if (typeof record.choice !== 'string') return { choice: null, probability: null };
+
+  let probability: number | null = null;
+  const probabilities = record.probabilities;
+  if (probabilities !== null && typeof probabilities === 'object') {
+    const value = (probabilities as Record<string, unknown>)[record.choice];
+    if (typeof value === 'number') probability = value;
+  }
+  return { choice: record.choice, probability };
+}
+
+/** Classifies one call: only a 0 whose stdout names one of the row's keys is measured. */
+function classifyCall(result: CallResult, keys: string[]): Classification {
+  if (result.timedOut) return { pick: null, pickProb: null, status: 'unmeasured_timeout' };
+  if (result.code !== 0) return UNMEASURED;
+
+  const answer = readAnswer(tryJson(result.stdout));
+  if (answer.choice === null || !keys.includes(answer.choice)) return UNMEASURED;
+  return { pick: answer.choice, pickProb: answer.probability, status: 'measured' };
+}
+
+/** Waits `ms` before a retry. */
+function sleep(ms: number): Promise<void> {
+  return new Promise((resolve) => {
+    setTimeout(resolve, ms);
+  });
+}
+
+/** The `key=text` option lines of one row, with a shared text disambiguated by its key. */
+function buildOptionLines(row: Row, describe: (folder: string) => string): string[] {
+  const keys = rowOptions(row);
+  const texts = keys.map((key) => (key === NONE_KEY ? NONE_DESCRIPTION : describe(key)));
+  const shared = new Map<string, number>();
+  for (const text of texts) shared.set(text, (shared.get(text) ?? 0) + 1);
+  return keys.map((key, index) => {
+    const text = texts[index];
+    return `${key}=${(shared.get(text) ?? 0) > 1 ? `${text} [${key}]` : text}`;
+  });
+}
+
+/**
+ * Runs one arm over the callable rows: one call per pass with the options rotated, every
+ * call recorded under `<outDir>/calls.jsonl`, then the keep rule over the picks. A stop
+ * line ends the arm with the rows finished so far, and no verdict.
+ */
+export async function runArm(
+  backend: 'jev' | 'deem',
+  rows: Row[],
+  chosen: 'target' | 'top',
+  gate: { cmd: string[]; provider?: string; model?: string; modelCommit?: string; sourceCommit?: string },
+  ctx: {
+    out: (line: string) => void;
+    env: NodeJS.ProcessEnv;
+    timeoutMs: number;
+    backoffMs: number;
+    outDir: string;
+    describe: (folder: string) => string;
+  }
+): Promise<ArmOutcome> {
+  const provider = gate.provider ?? 'official';
+  const optionLines = rows.map((row) => buildOptionLines(row, ctx.describe));
+
+  if (backend === 'jev') {
+    const perRow = rows.reduce(
+      (sum, row, index) =>
+        sum + (row.state ?? '').length + CHOICE_QUESTION.length + optionLines[index].reduce((lineSum, line) => lineSum + line.length, 0),
+      0
+    );
+    ctx.out(`jev: payload=operator session summaries and folder descriptions planned_calls=${3 * rows.length + 1} est_input_tokens=${Math.ceil((3 * perRow) / 4)}`);
+  } else {
+    const calls = 3 * rows.length;
+    ctx.out(`deem: nothing leaves the machine planned_calls=${calls} est_wall_s=${((calls * DEEM_P50_MS) / 1000).toFixed(1)}`);
+  }
+
+  let jevModel = 'unknown';
+  if (backend === 'jev') {
+    const auth = await spawnCall(
+      gate.cmd[0],
+      [...gate.cmd.slice(1), 'auth', 'test', '--provider', provider],
+      '',
+      ctx.env,
+      ctx.timeoutMs
+    );
+    if (auth.code === 0) {
+      const parsed = tryJson(auth.stdout);
+      if (parsed !== null && typeof parsed === 'object') {
+        const model = (parsed as Record<string, unknown>).model;
+        if (typeof model === 'string') jevModel = model;
+      }
+    }
+    writeCall(ctx.outDir, {
+      backend,
+      row_id: null,
+      order: null,
+      wall_ms: auth.wallMs,
+      exit_code: auth.code,
+      pick: null,
+      pick_prob: null,
+      status: 'auth',
+      options_hash: null,
+      jev_version: JEV_VERSION,
+      provider,
+      model: jevModel,
+    });
+    if (auth.code !== 0) {
+      const stopped = auth.code === 3 ? 'jev arm stopped: key rejected' : 'jev arm stopped: auth test failed';
+      ctx.out(stopped);
+      ctx.out(`${backend}: partial_rows=0`);
+      return { stopped, partialRows: 0 };
+    }
+  }
+
+  const callRecord = (
+    row: Row,
+    order: number,
+    result: CallResult,
+    step: Classification,
+    optionsHash: string
+  ): CallRecord => {
+    const base = {
+      backend,
+      row_id: row.id,
+      order,
+      wall_ms: result.wallMs,
+      exit_code: result.code,
+      pick: step.pick,
+      pick_prob: step.pickProb,
+      status: step.status,
+      options_hash: optionsHash,
+    };
+    if (backend === 'deem') {
+      return { ...base, model: gate.model ?? null, model_commit: gate.modelCommit ?? null, source_commit: gate.sourceCommit ?? null };
+    }
+    return { ...base, jev_version: JEV_VERSION, provider, model: jevModel };
+  };
+
+  const callArgs = (order: number, lines: string[]): string[] => {
+    const rotated = lines.map((_, index) => lines[(index + order) % lines.length]);
+    const args = ['choice'];
+    if (backend === 'jev') args.push('--provider', provider);
+    args.push('-q', CHOICE_QUESTION);
+    for (const line of rotated) args.push('-o', line);
+    return args;
+  };
+
+  const runStep = async (
+    row: Row,
+    order: number,
+    args: string[],
+    optionsHash: string,
+    keys: string[]
+  ): Promise<StepOutcome> => {
+    const attempt = (): Promise<CallResult> =>
+      spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], row.state ?? '', ctx.env, ctx.timeoutMs);
+    let result = await attempt();
+
+    if (result.code === 4) {
+      if (backend === 'deem') {
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) {
+          writeCall(ctx.outDir, callRecord(row, order, result, UNMEASURED, optionsHash));
+          return { stop: 'deem arm stopped: server gone' };
+        }
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          writeCall(ctx.outDir, callRecord(row, order, result, UNMEASURED, optionsHash));
+          return { stop: 'deem arm stopped: model commit changed mid-run' };
+        }
+      } else {
+        await sleep(ctx.backoffMs);
+      }
+      result = await attempt();
+    }
+
+    const step = classifyCall(result, keys);
+    writeCall(ctx.outDir, callRecord(row, order, result, step, optionsHash));
+
+    if (result.code === 2) return { stop: `${backend} arm stopped: usage error` };
+    if (result.code === 3) return { stop: backend === 'jev' ? 'jev arm stopped: key rejected' : 'deem arm stopped: backend refused' };
+    if (result.code === 130) return { stop: `${backend} arm stopped: interrupted` };
+    return { pick: step.pick };
+  };
+
+  const picks: Record<string, Array<string | null>> = {};
+  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
+    const row = rows[rowIndex];
+    const lines = optionLines[rowIndex];
+    const optionsHash = createHash('sha256').update(lines.join('\n')).digest('hex').slice(0, 16);
+    const keys = rowOptions(row);
+    const rowPicks: Array<string | null> = [];
+
+    for (let order = 0; order < PASSES; order++) {
+      const step = await runStep(row, order, callArgs(order, lines), optionsHash, keys);
+      if ('stop' in step) {
+        ctx.out(step.stop);
+        ctx.out(`${backend}: partial_rows=${rowIndex}`);
+        return { stopped: step.stop, partialRows: rowIndex };
+      }
+      rowPicks.push(step.pick);
+    }
+    picks[row.id] = rowPicks;
+  }
+
+  const counts = countVerdict(rows, picks, chosen);
+  const decided = decideVerdict(counts);
+  const extra = backend === 'deem'
+    ? `model=${gate.model ?? ''} model_commit=${gate.modelCommit ?? ''} source_commit=${gate.sourceCommit ?? ''}`
+    : `jev_version=${JEV_VERSION} provider=${provider} model=${jevModel}`;
+  const line = verdictLine(backend, counts, decided, chosen, extra);
+  ctx.out(line);
+  return { line, verdict: decided.verdict, counts, p: decided.p };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 11. MAIN
+// ───────────────────────────────────────────────────────────────────
+
+/** Injected dependencies of `main`, each optional so tests replace I/O, roots and scan input. */
+export interface MainDeps {
+  out?: (line: string) => void;
+  err?: (line: string) => void;
+  env?: NodeJS.ProcessEnv;
+  repoRoot?: string;
+  specsRoot?: string;
+  trackedFiles?: () => { files: string[]; skippedSource: number };
+  describe?: (folder: string) => string;
+  timeoutMs?: number;
+  backoffMs?: number;
+}
+
+const MAIN_OPTIONS = {
+  report: { type: 'string' },
+  transcripts: { type: 'string' },
+  'rows-out': { type: 'string' },
+  score: { type: 'string' },
+  out: { type: 'string' },
+  jev: { type: 'boolean' },
+  deem: { type: 'boolean' },
+  'accept-payload': { type: 'boolean' },
+} as const;
+
+/**
+ * Runs one census pass: every refusal first, then committed counts and the optional
+ * counts report. It never spawns jev or cli-deem, so it makes no model call.
+ */
+export async function main(argv: string[], deps: MainDeps = {}): Promise<number> {
+  const out = deps.out ?? ((line: string) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line: string) => process.stderr.write(`${line}\n`));
+  const repoRoot = deps.repoRoot ?? REPO_ROOT;
+  const trackedFiles = deps.trackedFiles ?? (() => listTrackedCandidates(repoRoot));
+
+  let report: string | undefined;
+  let transcripts: string | undefined;
+  let rowsOut: string | undefined;
+  let score: string | undefined;
+  let outDir: string | undefined;
+  let jev = false;
+  let deem = false;
+  let acceptPayload = false;
+  try {
+    const { values } = parseArgs({ args: argv, options: MAIN_OPTIONS, strict: true, allowPositionals: false });
+    report = values.report;
+    transcripts = values.transcripts;
+    rowsOut = values['rows-out'];
+    score = values.score;
+    outDir = values.out;
+    jev = values.jev === true;
+    deem = values.deem === true;
+    acceptPayload = values['accept-payload'] === true;
+  } catch (error) {
+    err(`usage error: ${error instanceof Error ? error.message : String(error)}`);
+    return 2;
+  }
+
+  if (rowsOut !== undefined && transcripts === undefined) {
+    err('--rows-out needs --transcripts <dir>');
+    return 2;
+  }
+  if (score !== undefined && (report !== undefined || transcripts !== undefined || rowsOut !== undefined)) {
+    err('--score runs alone');
+    return 2;
+  }
+  if ((jev || deem) && score === undefined) {
+    err('--jev and --deem need --score <rows file>');
+    return 2;
+  }
+  if ((jev || deem) && outDir === undefined) {
+    err('--jev and --deem need --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  const guardedPaths: Array<[string, string | undefined]> = [
+    ['report', report],
+    ['rows-out', rowsOut],
+    ['out', outDir],
+  ];
+  for (const [flag, value] of guardedPaths) {
+    if (value !== undefined && isPathInsideRoot(repoRoot, path.resolve(value))) {
+      err(`refused: --${flag} path is inside the repository`);
+      return 2;
+    }
+  }
+
+  if (transcripts !== undefined && !existsSync(transcripts)) {
+    err('transcripts path not found');
+    return 2;
+  }
+
+  if (score !== undefined) {
+    if (!existsSync(score)) {
+      err('rows file not found');
+      return 2;
+    }
+
+    const parsedRows = parseRows(readFileSync(score, 'utf8'));
+    if ('error' in parsedRows) {
+      err(parsedRows.error);
+      return 2;
+    }
+
+    const foreign = foreignLabelIds(parsedRows.rows);
+    if (foreign.length > 0) {
+      err(`foreign label in rows: ${foreign.join(', ')}`);
+      return 2;
+    }
+
+    const labeled = parsedRows.rows.filter((row) => effectiveLabel(row) !== null);
+    const callable = labeled.filter((row) => row.state !== null && row.state !== '');
+    const stateNull = parsedRows.rows.filter((row) => row.state === null).length;
+    out(`rows: total=${parsedRows.rows.length} labeled=${labeled.length} callable=${callable.length} state_null=${stateNull}`);
+    if (labeled.length < LABEL_GATE) {
+      out(`stop: fewer than ${LABEL_GATE} labeled rows (${labeled.length} labeled)`);
+      return 0;
+    }
+    if (callable.length < LABEL_GATE) {
+      out(`stop: fewer than ${LABEL_GATE} callable rows (${callable.length} with a state)`);
+      return 0;
+    }
+
+    const baseline = chooseBaseline(labeled);
+    out(`baseline: target=${baseline.target} top=${baseline.top} chosen=${baseline.chosen}`);
+
+    const right = callable.filter((row) => {
+      const answer = baseline.chosen === 'target' ? row.target : row.alternatives[0];
+      return answer === effectiveLabel(row);
+    }).length;
+    if (10 * right > 9 * callable.length) {
+      out(`no headroom baseline_right=${right} K=${callable.length}`);
+      return 0;
+    }
+
+    out(`margin: ${MARGIN_TEXT}`);
+    out('keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M');
+    out(`question: ${CHOICE_QUESTION}`);
+
+    const env = deps.env ?? process.env;
+    const columns: { jev?: ArmOutcome; deem?: ArmOutcome } = {};
+    const armCtx = {
+      out,
+      env,
+      timeoutMs: deps.timeoutMs ?? CALL_TIMEOUT_MS,
+      backoffMs: deps.backoffMs ?? BACKOFF_MS,
+      outDir: outDir ?? '',
+      describe: deps.describe ?? buildDescriber(deps.specsRoot ?? SPECS_ROOT),
+    };
+
+    const jevGateResult = jev ? jevGate({ out, env, acceptPayload }) : null;
+    const deemGateResult = deem ? deemGate({ out, env }) : null;
+    if (jevGateResult !== null && jevGateResult.passed && jevGateResult.path !== null) {
+      columns.jev = await runArm(
+        'jev',
+        callable,
+        baseline.chosen,
+        { cmd: [jevGateResult.path], provider: jevGateResult.provider },
+        armCtx
+      );
+    }
+    if (deemGateResult !== null && deemGateResult.passed) {
+      columns.deem = await runArm(
+        'deem',
+        callable,
+        baseline.chosen,
+        {
+          cmd: deemGateResult.cmd,
+          model: deemGateResult.model,
+          modelCommit: deemGateResult.modelCommit,
+          sourceCommit: deemGateResult.sourceCommit,
+        },
+        armCtx
+      );
+    }
+
+    if (jev || deem) {
+      mkdirSync(armCtx.outDir, { recursive: true });
+      const payload = {
+        rows: { total: parsedRows.rows.length, labeled: labeled.length, callable: callable.length, stateNull },
+        baseline,
+        columns,
+      };
+      writeFileSync(path.join(armCtx.outDir, 'report.json'), `${JSON.stringify(payload, null, 2)}\n`);
+    }
+    return 0;
+  }
+
+  out('census source: tracked files via git grep, source code skipped');
+  const tracked = trackedFiles();
+  const census = censusFiles(tracked.files);
+  const counts = summarizeEvents(census.events);
+  out(`committed: files=${census.files} events=${census.events.length} skipped_source=${tracked.skippedSource}`);
+  for (const line of formatPathLines('committed', counts)) out(line);
+
+  const specsRoot = deps.specsRoot ?? SPECS_ROOT;
+  const cliReplay = await replayPath('cli', specsRoot, '000-replay-target');
+  out(`replay cli: validateContentAlignment root=specs numbered_folders=${cliReplay.numberedFolders} decision=${cliReplay.decision ?? 'none'} alternatives listed: ${cliReplay.alternatives.length}`);
+
+  const tree = buildSyntheticTree();
+  let dataReplay: { numberedFolders: number; decision: Band | null; alternatives: string[] };
+  try {
+    dataReplay = await replayPath('data', tree.root, tree.target);
+  } finally {
+    rmSync(tree.root, { recursive: true, force: true });
+  }
+  out(`replay data: validateFolderAlignment root=synthetic numbered_folders=${dataReplay.numberedFolders} decision=${dataReplay.decision ?? 'none'} alternatives listed: ${dataReplay.alternatives.length}`);
+
+  let transcriptReport: {
+    files: number;
+    events: number;
+    paths: Record<SavePath, PathCounts>;
+    rowsWritten: number | null;
+    stateNull: number | null;
+  } | null = null;
+
+  if (transcripts !== undefined) {
+    const transcriptFiles = listTranscriptFiles(transcripts);
+    const transcriptEvents: Array<AlignmentEvent & { state: string | null }> = [];
+    for (const file of transcriptFiles) transcriptEvents.push(...scanTranscriptFile(readFileSync(file, 'utf8')));
+    const transcriptCounts = summarizeEvents(transcriptEvents);
+    out(`transcripts: files=${transcriptFiles.length} events=${transcriptEvents.length}`);
+    for (const line of formatPathLines('transcripts', transcriptCounts)) out(line);
+
+    let rowsWritten: number | null = null;
+    let stateNull: number | null = null;
+    if (rowsOut !== undefined) {
+      const rows = transcriptEvents
+        .filter((event) => (event.band === 'low' || event.band === 'infrastructure') && event.alternatives.length > 0)
+        .map((event, index) => {
+          const pick = event.pick;
+          const gold = pick !== null && (pick === event.target || event.alternatives.includes(pick)) ? pick : null;
+          return {
+            id: `row-${String(index + 1).padStart(4, '0')}`,
+            path: event.path,
+            target: event.target,
+            alternatives: event.alternatives,
+            state: event.state,
+            gold,
+            label: '',
+          };
+        });
+      mkdirSync(path.dirname(rowsOut), { recursive: true });
+      const rowLines = rows.map((row) => JSON.stringify(row));
+      writeFileSync(rowsOut, rowLines.length > 0 ? `${rowLines.join('\n')}\n` : '');
+      rowsWritten = rows.length;
+      stateNull = rows.filter((row) => row.state === null).length;
+      out(`rows written: ${rowsWritten} state_null=${stateNull}`);
+    }
+
+    transcriptReport = {
+      files: transcriptFiles.length,
+      events: transcriptEvents.length,
+      paths: transcriptCounts,
+      rowsWritten,
+      stateNull,
+    };
+  } else {
+    out('transcript events: not measured');
+  }
+
+  if (report !== undefined) {
+    mkdirSync(report, { recursive: true });
+    const payload = {
+      committed: {
+        files: census.files,
+        events: census.events.length,
+        skippedSource: tracked.skippedSource,
+        paths: counts,
+      },
+      replay: [
+        {
+          path: 'cli',
+          fn: 'validateContentAlignment',
+          root: 'specs',
+          numberedFolders: cliReplay.numberedFolders,
+          decision: cliReplay.decision,
+          alternativesListed: cliReplay.alternatives.length,
+        },
+        {
+          path: 'data',
+          fn: 'validateFolderAlignment',
+          root: 'synthetic',
+          numberedFolders: dataReplay.numberedFolders,
+          decision: dataReplay.decision,
+          alternativesListed: dataReplay.alternatives.length,
+        },
+      ],
+      transcripts: transcriptReport,
+    };
+    writeFileSync(path.join(report, 'report.json'), `${JSON.stringify(payload, null, 2)}\n`);
+  }
+
+  return 0;
+}
+
+if (isMainModule(import.meta.url)) {
+  process.exitCode = await main(process.argv.slice(2));
+}
diff --git a/.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts b/.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts
new file mode 100644
index 0000000000..2cfc5aef98
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts
@@ -0,0 +1,772 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Alignment Suggestion Measurement Tests
+// ───────────────────────────────────────────────────────────────────
+
+import { afterEach, describe, expect, it } from 'vitest';
+import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
+import { tmpdir } from 'node:os';
+import { delimiter, join, resolve } from 'node:path';
+import { binomTail, buildSyntheticTree, chooseBaseline, countVerdict, decideVerdict, deemGate, formatPathLines, jevGate, main, modalPick, parseRows, replayPath, scanText, scanTranscriptFile, summarizeEvents, verdictLine } from '../evals/score-alignment-suggestion';
+
+const tempDirs: string[] = [];
+
+const REPO = resolve(__dirname, '..', '..', '..', '..', '..', '..');
+
+afterEach(() => {
+  for (const dir of tempDirs.splice(0)) {
+    rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+describe('line scan', () => {
+  it('bands each event by its decision line, not its printed percentage', () => {
+    const text = [
+      '   Phase 1B Alignment: 040-alpha-beta (40% match)',
+      '   Warning: Moderate alignment (55%) - proceeding with caution',
+      '   Phase 1B Alignment: 050-gamma (80% match)',
+      '   Warning: INFRASTRUCTURE MISMATCH: Work is on .skilled/skill/',
+      '   Warning: INFRASTRUCTURE ALIGNMENT WARNING',
+    ].join('\n');
+
+    expect(scanText(text)).toEqual([
+      { path: 'cli', band: 'moderate', target: '040-alpha-beta', printedScore: 40, alternatives: [], hardBlock: false, pick: null },
+      { path: 'cli', band: 'infrastructure', target: '050-gamma', printedScore: 80, alternatives: [], hardBlock: false, pick: null },
+    ]);
+  });
+
+  it('reads a data-path low event with its alternatives and a pick', () => {
+    const text = [
+      '   Alignment check: 001-billing-export (0% match)',
+      '',
+      '   Warning: LOW ALIGNMENT WARNING (0% match)',
+      '   The selected folder "001-billing-export" may not match conversation content.',
+      '',
+      '   Better matching alternatives:',
+      '   1. 003-quantum-telemetry (100% match)',
+      '   2. 002-quantum-lattice-orchard (100% match)',
+      '   3. Continue with "001-billing-export" anyway',
+      '   4. Abort and specify different folder',
+      '   Proceeding with "001-billing-export" as requested',
+    ].join('\n');
+
+    expect(scanText(text)).toEqual([
+      { path: 'data', band: 'low', target: '001-billing-export', printedScore: 0, alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'], hardBlock: false, pick: '001-billing-export' },
+    ]);
+  });
+
+  it('counts unknown and decorated lines as nothing', () => {
+    const text = [
+      '   Warning: Something unrelated',
+      '⚠️  LOW ALIGNMENT WARNING',
+      '- below this triggers LOW ALIGNMENT WARNING',
+      "console.log('   Content aligns with target folder');",
+    ].join('\n');
+
+    expect(scanText(text)).toEqual([]);
+  });
+
+  it('reads a JSON-escaped cli-path log with a hard block and no list', () => {
+    const text = JSON.stringify({
+      output: [
+        '   Phase 1B Alignment: 001-research (0% match)',
+        '',
+        '   Warning: ALIGNMENT WARNING: Content may not match target folder',
+        '   Target folder: 001-research (0% match)',
+        '',
+        '   ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)',
+      ].join('\n'),
+    });
+
+    expect(scanText(text)).toEqual([
+      { path: 'cli', band: 'low', target: '001-research', printedScore: 0, alternatives: [], hardBlock: true, pick: null },
+    ]);
+  });
+
+  it('finds a header that shares its line with a JSON key', () => {
+    const text = JSON.stringify({
+      output: [
+        '   Alignment check: 007-zeta (10% match)',
+        '',
+        '   Warning: LOW ALIGNMENT WARNING (10% match)',
+      ].join('\n'),
+    });
+
+    expect(scanText(text)).toEqual([
+      { path: 'data', band: 'low', target: '007-zeta', printedScore: 10, alternatives: [], hardBlock: false, pick: null },
+    ]);
+  });
+
+  it('ignores validator source quoted in a document', () => {
+    const text = [
+      '    Warning: INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);',
+      "   Warning: ALIGNMENT WARNING: Content may not match target folder');",
+    ].join('\n');
+
+    expect(scanText(text)).toEqual([]);
+  });
+
+  it('reads a decision line that ends a JSON string', () => {
+    const text = JSON.stringify({ output: '   Phase 1B Alignment: 010-x (90% match)\n' + '   Content aligns with target folder', exit: 0 });
+
+    expect(scanText(text)).toEqual([
+      { path: 'cli', band: 'aligned', target: '010-x', printedScore: 90, alternatives: [], hardBlock: false, pick: null },
+    ]);
+  });
+});
+
+describe('census', () => {
+  it('summarizes events per path', () => {
+    const counts = summarizeEvents([
+      { path: 'cli', band: 'low', target: null, printedScore: null, alternatives: ['x', 'y'], hardBlock: false, pick: 'x' },
+      { path: 'cli', band: 'low', target: null, printedScore: null, alternatives: [], hardBlock: true, pick: null },
+      { path: 'cli', band: 'infrastructure', target: null, printedScore: null, alternatives: [], hardBlock: false, pick: null },
+      { path: 'cli', band: 'moderate', target: null, printedScore: null, alternatives: [], hardBlock: false, pick: null },
+      { path: 'data', band: 'aligned', target: null, printedScore: null, alternatives: [], hardBlock: false, pick: null },
+    ]);
+
+    expect(counts.cli).toEqual({ aligned: 0, moderate: 1, low: 2, infrastructure: 1, below50: 3, withAlternatives: 1, withoutAlternatives: 2, hardBlocks: 1, picks: 1 });
+    expect(counts.data).toEqual({ aligned: 1, moderate: 0, low: 0, infrastructure: 0, below50: 0, withAlternatives: 0, withoutAlternatives: 0, hardBlocks: 0, picks: 0 });
+    expect(formatPathLines('committed', counts)[0]).toBe('committed path cli: aligned=0 moderate=1 low=2 infrastructure=1 below50=3 with_alternatives=1 without_alternatives=2 hard_blocks=1 picks=1');
+  });
+
+  it('a census run makes no model call and writes counts only', async () => {
+    const logsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const stubDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const reportDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const specsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(logsDir, stubDir, reportDir, specsDir);
+
+    const a = join(logsDir, 'a.log');
+    writeFileSync(a, [
+      '   Phase 1B Alignment: 001-research (0% match)',
+      '',
+      '   Warning: ALIGNMENT WARNING: Content may not match target folder',
+      '   Target folder: 001-research (0% match)',
+      '',
+      '   ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)',
+    ].join('\n'));
+
+    const b = join(logsDir, 'b.txt');
+    writeFileSync(b, [
+      '   Phase 1B Alignment: 902-e2e/001-phase-1 (60% match)',
+      '   Warning: Moderate alignment (60%) - proceeding with caution',
+    ].join('\n'));
+
+    for (const name of ['jev', 'cli-deem']) {
+      const stub = join(stubDir, name);
+      writeFileSync(stub, `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`);
+      chmodSync(stub, 0o755);
+    }
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--report', reportDir], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      env: { ...process.env, PATH: stubDir + delimiter + process.env.PATH },
+      trackedFiles: () => ({ files: [a, b], skippedSource: 1 }),
+      specsRoot: specsDir,
+    });
+
+    expect(code).toBe(0);
+    expect(out).toContain('committed: files=2 events=2 skipped_source=1');
+    expect(out).toContain('committed path cli: aligned=0 moderate=1 low=1 infrastructure=0 below50=1 with_alternatives=0 without_alternatives=1 hard_blocks=1 picks=0');
+    expect(out).toContain('replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0');
+    expect(out).toContain('replay data: validateFolderAlignment root=synthetic numbered_folders=3 decision=low alternatives listed: 2');
+    expect(out).toContain('transcript events: not measured');
+    expect(existsSync(join(stubDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(stubDir, 'cli-deem.log'))).toBe(false);
+    const report = JSON.parse(readFileSync(join(reportDir, 'report.json'), 'utf8')) as { committed: { events: number } };
+    expect(report.committed.events).toBe(2);
+  });
+
+  it('--report inside the repository is refused before any output', async () => {
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--report', join(REPO, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md', 'report-dir')], {
+      trackedFiles: () => ({ files: [], skippedSource: 0 }),
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+    });
+
+    expect(code).toBe(2);
+    expect(out).toEqual([]);
+    expect(err).toEqual(['refused: --report path is inside the repository']);
+  });
+});
+
+describe('path replay', () => {
+  it('the cli path lists no alternative on a root with no numbered folder', async () => {
+    const dir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(dir);
+    mkdirSync(join(dir, 'cli-jev'));
+    mkdirSync(join(dir, 'sk-doc'));
+
+    await expect(replayPath('cli', dir, '000-replay-target')).resolves.toEqual({
+      numberedFolders: 0,
+      decision: 'low',
+      alternatives: [],
+    });
+  });
+
+  it('the data path lists the higher-scoring siblings and restores the terminal flags', async () => {
+    const before = [process.stdout.isTTY, process.stdin.isTTY];
+    const tree = buildSyntheticTree();
+    tempDirs.push(tree.root);
+
+    await expect(replayPath('data', tree.root, tree.target)).resolves.toEqual({
+      numberedFolders: 3,
+      decision: 'low',
+      alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'],
+    });
+    expect([process.stdout.isTTY, process.stdin.isTTY]).toEqual(before);
+  });
+});
+
+function transcriptDir(): string {
+  const dir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+  tempDirs.push(dir);
+
+  const output = [
+    '   Alignment check: 001-billing-export (0% match)',
+    '',
+    '   Warning: LOW ALIGNMENT WARNING (0% match)',
+    '   The selected folder "001-billing-export" may not match conversation content.',
+    '',
+    '   Better matching alternatives:',
+    '   1. 003-quantum-telemetry (100% match)',
+    '   2. 002-quantum-lattice-orchard (100% match)',
+    '   3. Continue with "001-billing-export" anyway',
+    '   4. Abort and specify different folder',
+  ].join('\n');
+
+  const lines = [
+    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'toolu_1', name: 'Bash', input: { command: "node generate-context.js --json '" + JSON.stringify({ specFolder: '001-billing-export', sessionSummary: 'Paired summary text' }) + "'" } }] } }),
+    JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: output }] }, toolUseResult: { stdout: output } }),
+    JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'toolu_9', content: output }] }, toolUseResult: { stdout: output } }),
+  ];
+
+  writeFileSync(join(dir, 's1.jsonl'), lines.join('\n'));
+  return dir;
+}
+
+describe('transcripts and rows', () => {
+  it('pairs an event with the save call that produced it', () => {
+    const dir = transcriptDir();
+    const events = scanTranscriptFile(readFileSync(join(dir, 's1.jsonl'), 'utf8'));
+
+    expect(events).toHaveLength(2);
+    expect(events[0].state).toBe('Paired summary text');
+    expect(events[1].state).toBeNull();
+    expect(events.map((event) => event.band)).toEqual(['low', 'low']);
+    expect(events[0].alternatives).toHaveLength(2);
+    expect(events[1].alternatives).toHaveLength(2);
+  });
+
+  it('a transcript census prints counts and no transcript text', async () => {
+    const dir = transcriptDir();
+    const specsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(specsDir);
+    const out: string[] = [];
+    const err: string[] = [];
+
+    const code = await main(['--transcripts', dir], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      trackedFiles: () => ({ files: [], skippedSource: 0 }),
+      specsRoot: specsDir,
+    });
+
+    expect(code).toBe(0);
+    expect(out).toContain('transcripts: files=1 events=2');
+    expect(out).toContain('transcripts path data: aligned=0 moderate=0 low=2 infrastructure=0 below50=2 with_alternatives=2 without_alternatives=0 hard_blocks=0 picks=0');
+    expect(out).not.toContain('transcript events: not measured');
+    expect(out.join('\n')).not.toContain('Paired summary text');
+    expect(out.join('\n')).not.toContain('quantum');
+  });
+
+  it('the rows writer leaves every label empty and a null state when no save call pairs', async () => {
+    const dir = transcriptDir();
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const specsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir, specsDir);
+    const rowsFile = join(rowsDir, 'rows.jsonl');
+    const out: string[] = [];
+    const err: string[] = [];
+
+    const code = await main(['--transcripts', dir, '--rows-out', rowsFile], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      trackedFiles: () => ({ files: [], skippedSource: 0 }),
+      specsRoot: specsDir,
+    });
+
+    expect(code).toBe(0);
+    expect(out).toContain('rows written: 2 state_null=1');
+
+    const rows = readFileSync(rowsFile, 'utf8').trim().split(/\n/).map((line) => JSON.parse(line) as Record<string, unknown>);
+    expect(rows).toHaveLength(2);
+    expect(rows[0]).toEqual({
+      id: 'row-0001',
+      path: 'data',
+      target: '001-billing-export',
+      alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'],
+      state: 'Paired summary text',
+      gold: null,
+      label: '',
+    });
+    expect(rows[1].id).toBe('row-0002');
+    expect(rows[1].state).toBeNull();
+    expect(rows[1].label).toBe('');
+  });
+
+  it('--rows-out inside the repository is refused before any output', async () => {
+    const dir = transcriptDir();
+    const out: string[] = [];
+    const err: string[] = [];
+
+    const code = await main(
+      ['--transcripts', dir, '--rows-out', join(REPO, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md', 'rows.jsonl')],
+      { out: (line) => out.push(line), err: (line) => err.push(line), trackedFiles: () => ({ files: [], skippedSource: 0 }) }
+    );
+
+    expect(code).toBe(2);
+    expect(out).toEqual([]);
+    expect(err).toEqual(['refused: --rows-out path is inside the repository']);
+  });
+});
+
+function writeRows(dir: string, specs: Array<{ label: string; state?: string | null }>): string {
+  const rowsFile = join(dir, 'rows.jsonl');
+  const rows = specs.map((spec, index) => ({
+    id: `row-${String(index + 1).padStart(4, '0')}`,
+    path: 'data',
+    target: '001-a',
+    alternatives: ['002-b', '003-c'],
+    state: spec.state === undefined ? 'pick:001-a' : spec.state,
+    gold: null,
+    label: spec.label,
+  }));
+  writeFileSync(rowsFile, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
+  return rowsFile;
+}
+
+describe('scorer and gate', () => {
+  it('stops below 30 labeled rows and runs no arm, even with a switch', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const stubDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir, stubDir, outDir);
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 29 }, () => ({ label: '001-a' })),
+      { label: '' },
+    ]);
+
+    for (const name of ['jev', 'cli-deem']) {
+      const stub = join(stubDir, name);
+      writeFileSync(stub, `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`);
+      chmodSync(stub, 0o755);
+    }
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f, '--deem', '--out', outDir], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      env: { ...process.env, PATH: stubDir + delimiter + process.env.PATH },
+    });
+
+    expect(code).toBe(0);
+    expect(out).toEqual([
+      'rows: total=30 labeled=29 callable=29 state_null=0',
+      'stop: fewer than 30 labeled rows (29 labeled)',
+    ]);
+    expect(existsSync(join(stubDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(stubDir, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('passes the gate at 30 labeled rows', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir);
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 27 }, () => ({ label: '001-a' })),
+      ...Array.from({ length: 3 }, () => ({ label: '002-b' })),
+    ]);
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });
+
+    expect(code).toBe(0);
+    expect(out).toEqual([
+      'rows: total=30 labeled=30 callable=30 state_null=0',
+      'baseline: target=27 top=3 chosen=target',
+      'margin: 0.10',
+      'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M',
+      'question: Which spec folder should this save go to?',
+    ]);
+  });
+
+  it('rejects a foreign label by row id', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir);
+
+    const f = writeRows(rowsDir, Array.from({ length: 30 }, (_, index) => ({
+      label: index === 3 ? '999-elsewhere' : index === 6 ? 'bogus' : '001-a',
+    })));
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });
+
+    expect(code).toBe(2);
+    expect(out).toEqual([]);
+    expect(err).toEqual(['foreign label in rows: row-0004, row-0007']);
+  });
+
+  it('the baseline stays with the target on a tie', () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir);
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 15 }, () => ({ label: '001-a' })),
+      ...Array.from({ length: 15 }, () => ({ label: '002-b' })),
+    ]);
+
+    const parsed = parseRows(readFileSync(f, 'utf8'));
+    if ('error' in parsed) throw new Error(parsed.error);
+
+    expect(chooseBaseline(parsed.rows)).toEqual({ target: 15, top: 15, chosen: 'target' });
+  });
+
+  it('prints no headroom when the baseline is right on more than 90 percent', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir);
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 28 }, () => ({ label: '001-a' })),
+      ...Array.from({ length: 2 }, () => ({ label: '002-b' })),
+    ]);
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });
+
+    expect(code).toBe(0);
+    expect(out[out.length - 1]).toBe('no headroom baseline_right=28 K=30');
+    expect(out.some((line) => line.startsWith('margin:'))).toBe(false);
+  });
+});
+
+describe('keep rule', () => {
+  it('binomTail gives exact tails', () => {
+    expect(binomTail(10, 10)).toBeCloseTo(1 / 1024, 12);
+    expect(binomTail(5, 0)).toBe(1);
+    expect(binomTail(3, 4)).toBe(0);
+    expect(binomTail(3, 2)).toBeCloseTo(0.5, 12);
+  });
+
+  it('modalPick finds the mode, an unstable row and a missing answer', () => {
+    expect(modalPick(['a', 'a', 'b'])).toEqual({ pick: 'a', flips: 1 });
+    expect(modalPick(['a', 'a', 'a'])).toEqual({ pick: 'a', flips: 0 });
+    expect(modalPick(['a', 'b', 'c'])).toEqual({ pick: 'unstable', flips: 2 });
+    expect(modalPick(['a', null, 'a'])).toEqual({ pick: null, flips: 0 });
+  });
+
+  it('counts a column over measured rows only', () => {
+    const rowsText = [
+      { id: 'r1', path: 'data', target: '001-a', alternatives: ['002-b', '003-c'], state: 's', gold: null, label: '001-a' },
+      { id: 'r2', path: 'data', target: '001-a', alternatives: ['002-b', '003-c'], state: 's', gold: null, label: '002-b' },
+      { id: 'r3', path: 'data', target: '001-a', alternatives: ['002-b', '003-c'], state: 's', gold: null, label: '001-a' },
+    ]
+      .map((row) => JSON.stringify(row))
+      .join('\n');
+
+    const parsed = parseRows(rowsText);
+    if ('error' in parsed) throw new Error(parsed.error);
+
+    const picks = {
+      r1: ['001-a', '001-a', '002-b'],
+      r2: ['002-b', '002-b', '002-b'],
+      r3: ['001-a', null, '001-a'],
+    };
+
+    expect(countVerdict(parsed.rows, picks, 'target')).toEqual({ K: 3, M: 2, A: 2, B: 1, W: 1, L: 0, F: 1 });
+  });
+
+  it('keeps a column that beats the baseline', () => {
+    const c = { K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 0 };
+
+    expect(decideVerdict(c).verdict).toBe('keep');
+    expect(decideVerdict(c).p).toBeCloseTo(1 / 1024, 12);
+    expect(verdictLine('deem', c, decideVerdict(c), 'target', 'model=deem-0.8-v1 model_commit=m1 source_commit=s1')).toBe(
+      'verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0010 baseline=target model=deem-0.8-v1 model_commit=m1 source_commit=s1'
+    );
+  });
+
+  it('kills a column the baseline beats', () => {
+    const c = { K: 30, M: 30, A: 5, B: 27, W: 0, L: 22, F: 0 };
+    const v = decideVerdict(c);
+
+    expect(v.verdict).toBe('kill');
+    expect(v.p).toBeCloseTo(2 ** -22, 15);
+
+    const line = verdictLine('jev', c, v, 'target', 'jev_version=jev 0.6.2 provider=official model=m');
+    expect(line.startsWith('verdict jev: kill K=30')).toBe(true);
+    expect(line).toContain(' p=0.0000 baseline=target jev_version=jev 0.6.2');
+  });
+
+  it('stops on margin and on coverage', () => {
+    expect(decideVerdict({ K: 30, M: 30, A: 27, B: 27, W: 0, L: 0, F: 0 })).toEqual({ verdict: 'stop (margin)', p: 1 });
+    expect(decideVerdict({ K: 30, M: 26, A: 26, B: 20, W: 6, L: 0, F: 0 })).toEqual({ verdict: 'stop (coverage)', p: 1 });
+  });
+
+  it('stops on the sign test and on flips', () => {
+    const sign = decideVerdict({ K: 30, M: 30, A: 30, B: 27, W: 3, L: 0, F: 0 });
+
+    expect(sign.verdict).toBe('stop (sign test)');
+    expect(sign.p).toBeCloseTo(0.125, 12);
+    expect(decideVerdict({ K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 10 }).verdict).toBe('stop (flips)');
+  });
+});
+
+function makeBackendStubs(): string {
+  const dir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+  tempDirs.push(dir);
+
+  const jev = `#!/bin/sh
+echo "$*" >> "$(dirname "$0")/jev.log"
+case "$1" in
+  --version) echo "\${STUB_JEV_VERSION:-jev 0.6.2}"; exit 0 ;;
+  auth) if [ "$2" = status ]; then exit "\${STUB_JEV_AUTH:-0}"; fi; echo '{"model":"stub-model"}'; exit 0 ;;
+  choice) read -r state; case "$state" in pick:*) k="\${state#pick:}"; printf '{"model":"stub-model","answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}}}\\n' "$k" "$k"; exit 0 ;; esac; exit 1 ;;
+esac
+exit 1
+`;
+  const cliDeem = `#!/bin/sh
+echo "$*" >> "$(dirname "$0")/cli-deem.log"
+case "$1" in
+  health)
+    case "\${STUB_DEEM_HEALTH:-ok}" in
+      ok) echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0 ;;
+      unreachable) exit 4 ;;
+      stub) echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0 ;;
+      model) echo '{"ok":true,"backend":"torch","model":"other-model","model_commit":"m1","source_commit":"s1"}'; exit 0 ;;
+      bad) echo 'not json'; exit 0 ;;
+    esac ;;
+  choice) read -r state; case "$state" in pick:*) k="\${state#pick:}"; printf '{"answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}}}\\n' "$k" "$k"; exit 0 ;; esac; exit 1 ;;
+esac
+exit 1
+`;
+
+  writeFileSync(join(dir, 'jev'), jev);
+  chmodSync(join(dir, 'jev'), 0o755);
+  writeFileSync(join(dir, 'cli-deem'), cliDeem);
+  chmodSync(join(dir, 'cli-deem'), 0o755);
+  return dir;
+}
+
+describe('backend gates', () => {
+  it('the jev gate passes a stub with a credential and an accepted payload', () => {
+    const stub = makeBackendStubs();
+    const out: string[] = [];
+    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH };
+    const result = jevGate({ out: (line) => out.push(line), env, acceptPayload: true });
+
+    expect(result.passed).toBe(true);
+    expect(result.provider).toBe('official');
+    expect(out).toEqual([`jev: path=${join(stub, 'jev')} provider=official`]);
+  });
+
+  it.each([
+    {
+      name: 'jev not on PATH',
+      jevPath: 'none',
+      extraEnv: {},
+      acceptPayload: true,
+      suffix: (_stub: string) => ['jev arm skipped: jev not on PATH'],
+    },
+    {
+      name: 'version',
+      jevPath: 'stub',
+      extraEnv: { STUB_JEV_VERSION: 'jev 0.5.0' },
+      acceptPayload: true,
+      suffix: (stub: string) => ['jev arm skipped: version', `jev: found="jev 0.5.0" path=${join(stub, 'jev')}`],
+    },
+    {
+      name: 'no credential',
+      jevPath: 'stub',
+      extraEnv: { STUB_JEV_AUTH: '1' },
+      acceptPayload: true,
+      suffix: (_stub: string) => ['jev arm skipped: no credential'],
+    },
+    {
+      name: 'payload not accepted',
+      jevPath: 'stub',
+      extraEnv: {},
+      acceptPayload: false,
+      suffix: (_stub: string) => ['jev arm skipped: payload not accepted'],
+    },
+  ])('the jev gate skips on $name', ({ jevPath, extraEnv, acceptPayload, suffix }) => {
+    const stub = makeBackendStubs();
+    const emptyDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(emptyDir);
+    const searchPath = jevPath === 'none' ? emptyDir : stub + delimiter + process.env.PATH;
+    const out: string[] = [];
+    const result = jevGate({ out: (line) => out.push(line), env: { ...process.env, ...extraEnv, PATH: searchPath }, acceptPayload });
+    const found = jevPath === 'none' ? 'none' : join(stub, 'jev');
+
+    expect(result.passed).toBe(false);
+    expect(out).toEqual([`jev: path=${found} provider=official`, ...suffix(stub)]);
+  });
+
+  it('the deem gate passes a healthy stub', () => {
+    const stub = makeBackendStubs();
+    const out: string[] = [];
+    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH, STUB_DEEM_HEALTH: 'ok' };
+    const result = deemGate({ out: (line) => out.push(line), env });
+
+    expect(result.passed).toBe(true);
+    expect(out).toEqual(['deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1']);
+  });
+
+  it.each([
+    { health: 'unreachable', expected: ['deem arm skipped: not reachable'] },
+    { health: 'stub', expected: ['deem arm skipped: stub backend'] },
+    { health: 'model', expected: ['deem arm skipped: model', 'deem: found="other-model"'] },
+    { health: 'bad', expected: ['deem arm skipped: bad health response', 'deem: found="not json"'] },
+  ])('the deem gate skips on $health', ({ health, expected }) => {
+    const stub = makeBackendStubs();
+    const out: string[] = [];
+    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH, STUB_DEEM_HEALTH: health };
+    const result = deemGate({ out: (line) => out.push(line), env });
+
+    expect(result.passed).toBe(false);
+    expect(out).toEqual(expected);
+  });
+});
+
+describe('model arms', () => {
+  it('a Deem column that answers each label keeps', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir, outDir);
+    const stub = makeBackendStubs();
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 20 }, () => ({ label: '001-a', state: 'pick:001-a' })),
+      ...Array.from({ length: 10 }, () => ({ label: '002-b', state: 'pick:002-b' })),
+    ]);
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f, '--deem', '--out', outDir], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      env: { ...process.env, PATH: stub + delimiter + process.env.PATH },
+      describe: (folder) => folder,
+    });
+
+    expect(code).toBe(0);
+    expect(out).toContain('deem: nothing leaves the machine planned_calls=90 est_wall_s=5.9');
+    expect(out[out.length - 1]).toBe(
+      'verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0010 baseline=target model=deem-0.8-v1 model_commit=m1 source_commit=s1'
+    );
+    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8').trim().split(/\n/);
+    expect(calls).toHaveLength(90);
+    expect(calls.some((line) => line.includes('pick:'))).toBe(false);
+    const report = JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8')) as { columns: { deem: { verdict: string } } };
+    expect(report.columns.deem.verdict).toBe('keep');
+  });
+
+  it('a Deem column that always answers the target stops on margin', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir, outDir);
+    const stub = makeBackendStubs();
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 27 }, () => ({ label: '001-a', state: 'pick:001-a' })),
+      ...Array.from({ length: 3 }, () => ({ label: '002-b', state: 'pick:001-a' })),
+    ]);
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f, '--deem', '--out', outDir], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      env: { ...process.env, PATH: stub + delimiter + process.env.PATH },
+      describe: (folder) => folder,
+    });
+
+    expect(code).toBe(0);
+    expect(out[out.length - 1].startsWith('verdict deem: stop (margin) K=30 M=30 A=27 B=27 W=0 L=0 F=0 p=1.0000 baseline=target')).toBe(true);
+  });
+
+  it('a Jev payload skip leaves the Deem output byte-identical', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const outDir1 = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const outDir2 = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir, outDir1, outDir2);
+    const stub = makeBackendStubs();
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 20 }, () => ({ label: '001-a', state: 'pick:001-a' })),
+      ...Array.from({ length: 10 }, () => ({ label: '002-b', state: 'pick:002-b' })),
+    ]);
+
+    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH };
+    const firstOut: string[] = [];
+    const firstErr: string[] = [];
+    const firstCode = await main(['--score', f, '--deem', '--out', outDir1], {
+      out: (line) => firstOut.push(line),
+      err: (line) => firstErr.push(line),
+      env,
+      describe: (folder) => folder,
+    });
+    const secondOut: string[] = [];
+    const secondErr: string[] = [];
+    const secondCode = await main(['--score', f, '--jev', '--deem', '--out', outDir2], {
+      out: (line) => secondOut.push(line),
+      err: (line) => secondErr.push(line),
+      env,
+      describe: (folder) => folder,
+    });
+
+    expect(firstCode).toBe(0);
+    expect(secondCode).toBe(0);
+    expect(secondOut).toContain('jev arm skipped: payload not accepted');
+    expect(secondOut.filter((line) => !line.startsWith('jev'))).toEqual(firstOut);
+    const jevLog = readFileSync(join(stub, 'jev.log'), 'utf8').trim().split(/\n/);
+    expect(jevLog.some((line) => line.startsWith('choice'))).toBe(false);
+  });
+
+  it('a Jev column with an accepted payload reports its cost and verdict', async () => {
+    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
+    tempDirs.push(rowsDir, outDir);
+    const stub = makeBackendStubs();
+
+    const f = writeRows(rowsDir, [
+      ...Array.from({ length: 20 }, () => ({ label: '001-a', state: 'pick:001-a' })),
+      ...Array.from({ length: 10 }, () => ({ label: '002-b', state: 'pick:002-b' })),
+    ]);
+
+    const out: string[] = [];
+    const err: string[] = [];
+    const code = await main(['--score', f, '--jev', '--accept-payload', '--out', outDir], {
+      out: (line) => out.push(line),
+      err: (line) => err.push(line),
+      env: { ...process.env, PATH: stub + delimiter + process.env.PATH },
+      describe: (folder) => folder,
+    });
+
+    expect(code).toBe(0);
+    expect(out.some((line) => line.startsWith('jev: payload=operator session summaries and folder descriptions planned_calls=91 est_input_tokens='))).toBe(true);
+    expect(out[out.length - 1]).toBe(
+      'verdict jev: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0010 baseline=target jev_version=jev 0.6.2 provider=official model=stub-model'
+    );
+  });
+});
```
