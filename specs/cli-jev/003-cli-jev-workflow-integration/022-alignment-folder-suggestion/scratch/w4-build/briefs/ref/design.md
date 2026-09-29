# Alignment suggestion measurement: build contract (read only)

S = `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
T = `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts`
V = `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts` (read only, never edit)

Each brief builds one numbered section of S plus its cases in T. Sections a brief does not name stay as they are.

## 1. File conventions

- S is a TypeScript ES module in the `@spec-kit/cli` package (`"type": "module"`), run as
  `npx tsx evals/score-alignment-suggestion.ts ...` from `.skilled/skills/system-spec-kit/runtime/cli`.
- Header, exactly (the rule lines are `// ` plus 67 `─`, the same as V line 1):
  `// ───...───` / `// MODULE: Alignment Suggestion Measurement` / `// ───...───` / `//` /
  `// Counts below-50 alignment saves per save path and replays both validator paths,` /
  `// with zero model calls. Past a 30-row label gate, an opt-in Jev or Deem column picks` /
  `// one of the folders a save listed. The script holds no credential and reads none.`
- Section dividers as in V: `// ` + 67 `─`, `// N. NAME`, `// ` + 67 `─`. Sections in order:
  1 IMPORTS, 2 CONSTANTS AND TYPES, 3 LINE SCAN, 4 CENSUS, 5 PATH REPLAY, 6 TRANSCRIPTS AND ROWS,
  7 SCORER AND GATE, 8 KEEP RULE, 9 BACKEND GATES, 10 MODEL ARMS, 11 MAIN.
- Relative imports carry the `.js` suffix: `../spec-folder/alignment-validator.js`, `../utils/path-utils.js`,
  `../lib/esm-entry.js`. Node built-ins use the `node:` prefix.
- Strict TypeScript: no `any` (use `unknown` and narrow), explicit return types on every export, JSDoc on every
  export, camelCase functions, UPPER_SNAKE constants, single quotes, WHY comments only.
- No text containing `API_KEY`, `TYPESAFE`, `Bearer` or `Authorization` anywhere in S (a grep must find none).
- Entry: at the end of S, `if (isMainModule(import.meta.url)) { process.exitCode = await main(process.argv.slice(2)); }`.
- `REPO_ROOT = path.resolve(dirnameFromImportMeta(import.meta.url), '..', '..', '..', '..', '..', '..')` and
  `SPECS_ROOT = path.join(REPO_ROOT, 'specs')`.

T conventions: header `// MODULE: Alignment Suggestion Measurement Tests` between the same rule lines; imports
from `vitest` (`afterEach, describe, expect, it`) and `node:` built-ins; S imported as
`from '../evals/score-alignment-suggestion'`. Every temp dir is made with `mkdtempSync(join(tmpdir(), 'alignment-suggestion-'))`,
pushed to a `tempDirs` array and removed in `afterEach` with `rmSync(dir, { recursive: true, force: true })`.
Tests never read the real specs tree, the real transcripts or the network, and never spawn the repo's `cli-deem`.

## 2. Constants and types

```ts
export type SavePath = 'cli' | 'data';
export type Band = 'aligned' | 'moderate' | 'low' | 'infrastructure';
export interface AlignmentEvent { path: SavePath; band: Band; target: string | null; printedScore: number | null;
  alternatives: string[]; hardBlock: boolean; pick: string | null; }
export interface PathCounts { aligned: number; moderate: number; low: number; infrastructure: number; below50: number;
  withAlternatives: number; withoutAlternatives: number; hardBlocks: number; picks: number; }
```
Constants: `LABEL_GATE = 30`, `PASSES = 3`, `JEV_VERSION = 'jev 0.6.2'`,
`CHOICE_QUESTION = 'Which spec folder should this save go to?'`, `NONE_KEY = 'none_of_these'`,
`NONE_DESCRIPTION = 'None of these folders'`, `DEEM_MODEL = 'deem-0.8-v1'`, `DEEM_P50_MS = 65.6`,
`HEALTH_TIMEOUT_MS = 2000`, `CALL_TIMEOUT_MS = 90000`, `BACKOFF_MS = 2000`, `MARGIN_TEXT = '0.10'`.

## 3. Line scan

`export function normalizeText(text: string): string`: turns the two-character escapes `\r\n` and `\n` into a real
newline, `\t` into a space and `\"` into `"`, and a real CRLF into LF. JSON logs hold the validator's output as one
escaped string, so this lets one line rule read both plain and JSON text.

Line rules, each tested against one normalized line. `P` below is the prefix `^\s*(?:Warning: )?`.
| Rule | Pattern | Result |
|---|---|---|
| CLI header | `Phase 1B Alignment: (.+) \((\d+)% match\)\s*$` (anywhere on the line) | header for path `cli`: target, printed score |
| Data header | `Alignment check: (.+) \((\d+)% match\)\s*$` (anywhere on the line) | header for path `data` |
| CLI decisions | whole line, P + `Content aligns with target folder` / `Moderate alignment \(\d+%\) - proceeding with caution` / `ALIGNMENT WARNING: Content may not match target folder` / `INFRASTRUCTURE ALIGNMENT WARNING`, then `\s*(?:"[,}\]].*)?$` | `cli` aligned / moderate / low / infrastructure |
| Data decisions | whole line, P + `Good alignment with selected folder` / `Moderate alignment - proceeding with caution` / `LOW ALIGNMENT WARNING \(\d+% match\)` / `INFRASTRUCTURE MISMATCH \(\d+% of files in \.(?:skilled\|opencode)\/\)`, then the same end | `data` aligned / moderate / low / infrastructure |
| Target line | `^\s*Target folder: (.+) \((\d+)% match\)\s*$` | fills a null target and printed score |
| List start | `^\s*(?:Better matching folders found\|Better matching alternatives):\s*$` | alternatives follow |
| List item | `^\s*\d+\. (.+) \((\d+)% match\)\s*$` | one alternative (only after a list start) |
| Hard block | `^\s*ALIGNMENT_HARD_BLOCK:` | hardBlock true |
| Pick | `^\s*Switching to: (.+?)\s*$`, or `^\s*(?:Continuing\|Proceeding) with "(.+)" as requested\s*$` | pick = group 1 |

`export function scanText(text: string): AlignmentEvent[]`: split `normalizeText(text)` on `\n`. Walk the lines. A header
line sets `header = { path, target, score, index }`. A decision line makes one event: target and printedScore come
from `header` when `header.path` equals the decision's path and the header is at most 8 lines back, else null; then
`header` is cleared. The band comes from the decision line only, never from a printed percentage. Aligned and moderate
events end there. A low or infrastructure event reads the following lines until the next header line, the next decision
line or 20 lines, whichever comes first, applying the Target, List, Hard block and Pick rules. Any other line counts as
nothing. Events are returned in text order.

## 4. Census

- `SOURCE_EXTENSIONS`: `.ts .tsx .mts .cts .js .mjs .cjs .jsx .py .sh .bash .zsh .rs .go .java .rb .c .h .cpp .swift .kt .php .lua`.
- `export function listTrackedCandidates(root: string): { files: string[]; skippedSource: number }`: `spawnSync('git',
  ['-C', root, 'grep', '-l', '-I', '-F', '-e', <each of the 8 decision phrases without P>], { encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024 })`. Status 1 means no candidate (empty list). Any status other than 0 or 1 throws
  `Error('git grep failed')`. Paths are joined to root; a path whose extension is in SOURCE_EXTENSIONS is dropped and counted.
- `export function censusFiles(files: string[]): { files: number; events: AlignmentEvent[] }`: reads each file as UTF-8
  and concatenates `scanText` results; `files` is the count read.
- `export function summarizeEvents(events: AlignmentEvent[]): Record<SavePath, PathCounts>`: per path, one count per band;
  `below50` = low + infrastructure (both take the validator's warning branch); `withAlternatives` / `withoutAlternatives`
  split the below50 events by `alternatives.length > 0`; `hardBlocks` and `picks` count events with hardBlock true and
  pick non-null.
- `export function formatPathLines(label: string, counts: Record<SavePath, PathCounts>): string[]`: two lines, cli first:
  `<label> path <cli|data>: aligned=<n> moderate=<n> low=<n> infrastructure=<n> below50=<n> with_alternatives=<n> without_alternatives=<n> hard_blocks=<n> picks=<n>`.

## 5. Path replay

- `REPLAY_DATA: AlignmentCollectedData = { recentContext: [{ request: 'quantum lattice orchard telemetry' }], observations: [] }`.
- `export async function replayPath(path: SavePath, root: string, target: string): Promise<{ numberedFolders: number;
  decision: Band | null; alternatives: string[] }>`: counts `readdirSync(root)` names matching `/^\d{3}-/` that V's
  exported `isArchiveFolder` rejects (0 when root is missing). Then, with `console.log` swapped for a collector and
  `process.stdout.isTTY` and `process.stdin.isTTY` both redefined to `false` (`Object.defineProperty`, configurable),
  it awaits V's `validateContentAlignment(REPLAY_DATA, target, root)` for `cli` or `validateFolderAlignment(...)` for
  `data`. A `finally` restores `console.log` and both original property descriptors (deletes the property when there
  was none). The first event of `scanText(collected.join('\n'))` gives decision and alternatives ([] and null when none).
- `export function buildSyntheticTree(): { root: string; target: string }`: a `mkdtempSync(join(tmpdir(), 'alignment-replay-'))`
  dir holding empty folders `001-billing-export`, `002-quantum-lattice-orchard`, `003-quantum-telemetry` and `z_archive`;
  target `001-billing-export`. The caller removes it.
- Replay lines, printed by main after the census lines (probe on 2026-09-29: the real specs root gives 0 and 0):
  `replay cli: validateContentAlignment root=specs numbered_folders=<n> decision=<band|none> alternatives listed: <n>` (root SPECS_ROOT, target `000-replay-target`),
  `replay data: validateFolderAlignment root=synthetic numbered_folders=<n> decision=<band|none> alternatives listed: <n>` (the synthetic tree, removed in a finally).

## 6. Transcripts and rows

- `export function extractSessionSummary(text: string): string | null`: finds `"sessionSummary"\s*:\s*"((?:[^"\\]|\\.)*)"`;
  on a match returns `JSON.parse('"' + group + '"')` (null when that throws or is empty). On no match it unescapes one level
  (`\\` + `"` becomes `"`, `\\` + `\\` becomes `\\`) and tries again, at most 3 levels, then returns null.
- `export function scanTranscriptFile(text: string): Array<AlignmentEvent & { state: string | null }>`: parse each line as JSON.
  First pass: every object anywhere in a record with `type === 'tool_use'`, a string `id` and an `input` goes into a map id to
  `JSON.stringify(input)`. Second pass per line: a record holding objects with `type === 'tool_result'` and a string
  `tool_use_id` is scanned only in those blocks' `content` (a string, or the `text` of array items), each paired with
  `extractSessionSummary(map.get(tool_use_id) ?? '')`. Any other JSON record is scanned whole, paired with
  `extractSessionSummary(line)`. Identical events (same JSON) inside one record count once, because one output echoed into
  two fields is one save. When no line parses as JSON, `scanText(text)` runs over the whole text with state null.
- `export function listTranscriptFiles(dir: string): string[]`: recursive, sorted, files ending `.jsonl .json .log .txt .out`.
- `--transcripts <dir>` prints `transcripts: files=<n> events=<n>` and `formatPathLines('transcripts', ...)`. Without it main
  prints `transcript events: not measured`. Only counts are printed; no text from a transcript reaches stdout or stderr.
- `--rows-out <file>` (needs `--transcripts`): one JSON line per transcript event whose band is low or infrastructure and whose
  alternatives are non-empty, in scan order: `{"id":"row-0001","path":"data","target":"<t>","alternatives":["<a>"],"state":<string|null>,"gold":<string|null>,"label":""}`.
  `gold` is the event's pick when it equals the target or an alternative, else null. Prints `rows written: <n> state_null=<k>`.

## 7. Scorer and gate (`--score <rows file>`)

- A row is `{ id: string; path: string; target: string; alternatives: string[]; state: string | null; gold: string | null; label: string }`.
  A line that fails JSON or this shape prints `bad row at line <n>` to stderr and exits 2. Options of a row:
  `[target, ...alternatives, NONE_KEY]`.
- A non-empty trimmed `label` outside the options is foreign: after reading every row, stderr gets
  `foreign label in rows: <id>, <id>` and the exit is 2, before any stdout.
- Effective label: the trimmed label when non-empty, else `gold` when it is in the options, else none. Callable rows are
  labeled rows whose `state` is a non-empty string. `K` = callable count.
- Lines in order: `rows: total=<n> labeled=<n> callable=<K> state_null=<n>`; under 30 labeled rows
  `stop: fewer than 30 labeled rows (<n> labeled)` and exit 0; under 30 callable rows
  `stop: fewer than 30 callable rows (<K> with a state)` and exit 0. No arm runs after a stop, whatever the switches.
- Baseline, chosen before any call over the labeled rows: target correct count vs top-alternative correct count (answer
  `alternatives[0]`); `top` only when strictly greater. Prints `baseline: target=<a> top=<b> chosen=<target|top>`.
- Headroom over the K rows: when `10 * right > 9 * K` for the chosen baseline, print
  `no headroom baseline_right=<right> K=<K>` and exit 0 with no arm. Else print `margin: 0.10`, then
  `keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M`,
  then `question: Which spec folder should this save go to?`.

## 8. Keep rule

- `export function binomTail(n: number, k: number): number`: P(X >= k), X ~ Binomial(n, 0.5); 1 when k <= 0, 0 when k > n.
- `export function modalPick(picks: Array<string | null>): { pick: string | null; flips: number }`: over three picks. Null when
  any pick is null. The key given at least twice is the pick and flips = 3 minus its count; three different keys give
  pick `unstable` and flips 2.
- `export interface VerdictCounts { K: number; M: number; A: number; B: number; W: number; L: number; F: number }`.
  M counts rows whose three picks are all non-null. Over those M rows: A = modal pick equals the label (`unstable` is wrong),
  B = baseline answer equals the label, W = column right and baseline wrong, L = baseline right and column wrong, F = sum of flips.
- `export function countVerdict(rows: Row[], picks: Record<string, Array<string | null>>, chosen: 'target' | 'top'): VerdictCounts`:
  K = rows.length (the callable rows); a row is measured when picks[row.id] holds three non-null picks; modalPick gives its
  pick and flips; the label is effectiveLabel(row); the baseline answer is row.target or row.alternatives[0].
- `export function decideVerdict(c: VerdictCounts): { verdict: string; p: number }`, in this order:
  1 `10*M < 9*K` gives `stop (coverage)`; 2 `binomTail(W+L, L) <= 0.05` with W+L > 0 gives `kill` and p is that tail;
  3 `10*(A-B) < M` gives `stop (margin)`; 4 p = W+L === 0 ? 1 : binomTail(W+L, W), p >= 0.05 gives `stop (sign test)`;
  5 `10*F > 3*M` gives `stop (flips)`; 6 `keep`. p is the sign-test p except for `kill`; coverage uses p = 1.
- `export function verdictLine(backend: 'jev' | 'deem', c: VerdictCounts, v: { verdict: string; p: number }, baseline: 'target' | 'top', extra: string): string`:
  `verdict <backend>: <verdict> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> F=<F> p=<p.toFixed(4)> baseline=<baseline> <extra>`.
  extra is `model=<m> model_commit=<c> source_commit=<s>` for Deem and `jev_version=<v> provider=<p> model=<m>` for Jev.

## 9. Backend gates

- `which(name, env)`: first executable regular file named `name` in `env.PATH` (split on `path.delimiter`), else null.
- `export function jevGate(ctx: { out: (l: string) => void; env: NodeJS.ProcessEnv; acceptPayload: boolean }): { passed: boolean; path: string | null; provider: string }`:
  provider = `env.JEV_PROVIDER || 'official'`; prints `jev: path=<path|none> provider=<P>`; then in order, each failure printing
  one line and returning passed false: not on PATH `jev arm skipped: jev not on PATH`; `jev --version` first stdout line not
  `jev 0.6.2`: `jev arm skipped: version` then `jev: found=<JSON.stringify(found)> path=<path>`; `jev auth status --provider <P>`
  non-zero: `jev arm skipped: no credential`; acceptPayload false: `jev arm skipped: payload not accepted`.
  spawnSync with `stdio: ['ignore', 'pipe', 'pipe']`, `encoding: 'utf8'`, `timeout: HEALTH_TIMEOUT_MS * 5`, the given env.
- `deemCommand(env)`: `[path]` when `cli-deem` is on PATH, else `[process.execPath, <REPO_ROOT>/.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs]`.
- `export function readDeemHealth(cmd: string[], env: NodeJS.ProcessEnv)`: `health` with `timeout: HEALTH_TIMEOUT_MS`. A spawn
  error or timeout or exit 4: `not reachable`. Exit 3: stderr JSON `error` containing `stub` gives `stub backend`, containing
  `refused model` gives `model`, else `bad health response`. Exit 0: stdout JSON, else `bad health response`; `backend` containing
  `stub` gives `stub backend`; `backend` neither `torch` nor starting `ensemble:` gives `bad health response`; `model` not DEEM_MODEL
  gives `model`; `ok !== true` or an empty `model_commit` or `source_commit` gives `bad health response`. Returns
  `{ ok: true, backend, model, modelCommit, sourceCommit }` or `{ ok: false, reason, found }`.
- `export function deemGate(ctx: { out; env })`: passes with `deem: health backend=<b> model=<m> model_commit=<c> source_commit=<s>`,
  else prints `deem arm skipped: <reason>` and, for `model` and `bad health response`, `deem: found=<JSON.stringify(found)>`.

## 10. Model arms

- `spawnCall(file, args, stdinText, env, timeoutMs)` as a Promise: stdout, stderr, code (-1 when killed without one, 127 on a
  spawn error), wallMs, timedOut (SIGKILL at timeoutMs). `writeCall(outDir, record)` appends one JSON line to `<outDir>/calls.jsonl`.
- `buildDescriber(specsRoot): (folder: string) => string`: a folder with a `/` reads `<specsRoot>/<folder>/description.json`;
  a bare name reads the one directory of that basename under specsRoot holding a `description.json` (walk once, cached).
  The string `description` is used verbatim; a missing file, a non-string or two same-named folders fall back to the name.
- Per callable row, keys = `[target, ...alternatives, NONE_KEY]`, text = describe(key) (NONE_DESCRIPTION for NONE_KEY); two keys
  with the same text get ` [<key>]` appended. For order 0, 1, 2 the keys rotate left by order: args
  `choice [--provider P] -q CHOICE_QUESTION -o <key>=<text> ...`, stdin = the row's state and nothing else. Fresh call each time.
- Cost lines before the first call. Jev: `jev: payload=operator session summaries and folder descriptions planned_calls=<3K+1> est_input_tokens=<ceil(chars/4)>`
  (chars = 3 x sum over rows of state + question + every `key=text`). Deem:
  `deem: nothing leaves the machine planned_calls=<3K> est_wall_s=<(3K * DEEM_P50_MS / 1000).toFixed(1)>`.
- Jev first calls `jev auth test --provider P` (model from its stdout JSON `model`, else `unknown`). Exits for both: 0 with stdout JSON
  `answers.answer.choice` among the row's keys is `measured` (pick_prob = `answers.answer.probabilities[choice]` or null); any other
  0 or other code is `unmeasured`; a timeout is `unmeasured_timeout`. Exit 4: Jev waits BACKOFF_MS and retries once; Deem rereads
  health, stops with `deem arm stopped: server gone` or `deem arm stopped: model commit changed mid-run`, else retries once.
  Exit 2 stops with `<b> arm stopped: usage error`, exit 3 with `jev arm stopped: key rejected` / `deem arm stopped: backend refused`,
  exit 130 with `<b> arm stopped: interrupted`. A stop prints the line and `<b>: partial_rows=<finished>` and no verdict.
- calls.jsonl record: `{ backend, row_id, order, wall_ms, exit_code, pick, pick_prob, status, options_hash }` plus Deem
  `model, model_commit, source_commit` or Jev `jev_version, provider, model`. `options_hash` = first 16 hex of sha256 over the
  `key=text` lines joined by newlines. Never the state.
- After the last row: VerdictCounts over the callable rows, `decideVerdict`, and the `verdictLine` on stdout.
- `export async function runArm(backend: 'jev' | 'deem', rows: Row[], chosen: 'target' | 'top', gate: { cmd: string[];
  provider?: string; model?: string; modelCommit?: string; sourceCommit?: string }, ctx: { out; env; timeoutMs; backoffMs;
  outDir: string; describe: (folder: string) => string }): Promise<{ line: string; verdict: string; counts: VerdictCounts; p: number }
  | { stopped: string; partialRows: number }>`: rows are the callable rows. For Jev, gate.cmd is `[jevPath]` and gate.provider
  is set; for Deem, gate.cmd is deemCommand(env) and the three identity fields come from the passed health check, so deemGate
  returns `{ passed: true, cmd, model, modelCommit, sourceCommit }` when it passes.
- main in score mode: with `--jev`, jevGate then the Jev arm when it passed; with `--deem`, deemGate then the Deem arm. One
  backend's skip or stop never starts or changes the other. At the end, `<out>/report.json` holds rows counts, baseline and one
  entry per run column (`{ line, verdict, counts, p }` or `{ stopped, partialRows }`).

## 11. Main

`export async function main(argv: string[], deps: MainDeps = {}): Promise<number>` with
`MainDeps = { out?: (line: string) => void; err?: (line: string) => void; env?: NodeJS.ProcessEnv; repoRoot?: string;
specsRoot?: string; trackedFiles?: () => { files: string[]; skippedSource: number }; describe?: (folder: string) => string;
timeoutMs?: number; backoffMs?: number }`. Defaults: stdout and stderr writers adding `\n`, `process.env`, REPO_ROOT,
SPECS_ROOT, `listTrackedCandidates(repoRoot)`, `buildDescriber(specsRoot)`, CALL_TIMEOUT_MS, BACKOFF_MS.

parseArgs (`node:util`, strict, no positionals): `report`, `transcripts`, `rows-out`, `score`, `out` (strings), `jev`, `deem`,
`accept-payload` (booleans). Refusals, in order, each one stderr line and exit 2 before any stdout:
1 parse error `usage error: <message>`; 2 `--rows-out` without `--transcripts`: `--rows-out needs --transcripts <dir>`;
3 `--score` with `--report`, `--transcripts` or `--rows-out`: `--score runs alone`; 4 `--jev` or `--deem` without `--score`:
`--jev and --deem need --score <rows file>`; 5 `--jev` or `--deem` without `--out`: `--jev and --deem need --out <dir> so every call is recorded`;
6 each of `--report`, `--rows-out`, `--out` whose resolved path is inside repoRoot (`isPathInsideRoot` from `../utils/path-utils.js`):
`refused: --<flag> path is inside the repository`; 7 `--transcripts` naming a path that does not exist: `transcripts path not found`.

Census mode (no `--score`) prints in order: `census source: tracked files via git grep, source code skipped`,
`committed: files=<n> events=<n> skipped_source=<n>`, the two `committed path` lines, the two replay lines, the transcript lines
or `transcript events: not measured`, the rows line when `--rows-out`, then writes `<report>/report.json` (counts only) when
`--report` is given. Exit 0. It never spawns `jev` or `cli-deem`.
