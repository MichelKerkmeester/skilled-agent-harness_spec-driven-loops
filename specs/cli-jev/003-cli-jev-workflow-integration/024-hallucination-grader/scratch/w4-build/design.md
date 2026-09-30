# score-d4-agreement.cjs: build contract

Read-only reference for the build briefs. Each brief implements ONE section below and nothing else.
S = `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`
T = `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts`

Node CommonJS, standard library only, `'use strict'`, the file layout of `scorer/score-model-variant.cjs`
(box header, numbered section dividers, JSDoc on every exported function). No code comment names a spec
path, phase number or requirement id. The script never reads, logs or passes a key and holds none of the
strings `API_KEY`, `TYPESAFE`, `Bearer` or `Authorization`.

## 1. Constants (exported)

```js
const QUESTION = 'Does this output name a command-line flag, file or function that the task does not provide?';
const MARGIN_LINE = 'margin: 0.10';
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M (jev only)';
const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
const LABEL_GATE = 30;
const CLASS_GATE = 5;
const JEV_RERUNS = 3;
const DEFAULT_FIXTURES_DIR = path.resolve(__dirname, '../../../assets/model-benchmark/benchmark-fixtures');
const HALLUCINATION_CHECK = path.join(__dirname, 'deterministic', 'hallucination-flag.cjs');
const USAGE = 'usage: score-d4-agreement.cjs --outputs <dir> [--fixtures <dir>] [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]';
```

## 2. Census

- `listOutputs(outputsDir)` returns `Array<{ file, id }>` for every regular file in `outputsDir` (not
  recursive) whose name ends in `.md`, sorted by file name. `<id>.run<k>.md` (k a positive integer) gives
  id `<id>`; any other `<id>.md` gives id `<id>`. Test `/^(.+)\.run([1-9]\d*)\.md$/` first.
- `loadFixtures(fixturesDir)` returns `{ total, withAllowlist, byId }`. It reads every `*.json` file in
  `fixturesDir` (sorted). The key is the file's `id` field when it is a non-empty string, else the file
  name without `.json`. `byId` is a `Map` key -> parsed fixture. `withAllowlist` counts fixtures that have
  an own `allowlist` property. A file that does not parse throws `Error('cannot read fixture <name>: <msg>')`.
  A repeated key throws `Error('duplicate fixture id: <key>')`.
- `matchOutputs(outputs, fixtures)` returns `{ matched: Array<{ file, id, fixture }>, unmatched: Array<{ file, id }> }`,
  both in `outputs` order.

## 3. Labels

- `parseLabels(text)` returns `Map<fileName, 'yes'|'no'>`. One JSON object per line; blank lines are
  skipped; the row number is the 1-based line number. Errors (thrown as `Error`, message verbatim):
  - not JSON: `labels row <n>: not JSON`
  - `output` missing, not a non-empty string, or containing `/`: `labels row <n>: output must be a file name`
  - `hallucinated` not exactly `yes` or `no`: `labels row <n>: hallucinated must be yes or no, got <JSON.stringify(value)>`
  - an `output` already seen: `labels row <n>: duplicate output <output>`
- `sha256Hex(bufferOrString)` returns the lowercase hex SHA-256.

## 4. Deterministic baseline and state

- `buildState(fixture, outputText)` returns the text a model reads, sections joined by one blank line:
  `Task:\n<task>` when `fixture.task` is a string, `Visible spec:\n<visibleSpec>` when `fixture.visibleSpec`
  is a string, `Allowlist:\n<JSON.stringify(fixture.allowlist)>` when the fixture has an own `allowlist`,
  then always `Output:\n<outputText>`.
- `deterministicCall(fixture, outputPath)` returns `'yes'|'no'`. It writes `{ id, allowlist }` (allowlist =
  `fixture.allowlist || {}`) to a JSON file in a fresh `fs.mkdtempSync(os.tmpdir())` directory, runs
  `spawnSync(process.execPath, [HALLUCINATION_CHECK, fixtureJson, outputPath], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] })`,
  and removes the directory in `finally`. Non-zero exit or spawn error throws
  `Error('deterministic check failed on <basename>: <trimmed stderr, or exit <status>>')`; stdout whose
  trimmed JSON has no finite numeric `score` throws `Error('deterministic check failed on <basename>: unparseable result')`.
  Score below 1 returns `'yes'`, else `'no'`. It never returns a default.
- `chooseBaseline(rows)`, rows `Array<{ file, label, check }>`, returns
  `{ method, majorityClass, checkRight, majorityRight, right, calls }`. `majorityClass` is `'yes'` when yes
  labels outnumber no labels, else `'no'`. `method` is `'check'` when `checkRight >= majorityRight`, else
  `'majority'`. `right` is the chosen method's count. `calls` is a `Map` file -> the chosen method's call.

## 5. Keep rule

- `binomialTail(successes, trials)` returns `{ num, den, p }` (BigInt num and den, number p) for the exact
  one-sided chance of `successes` or more in `trials` fair coin flips. `trials === 0` gives `{ num: 1n, den: 1n, p: 1 }`.
  Below 0.05 is tested as `20n * num < den`, never with a float.
- `decideVerdict({ backend, K, M, A, B, W, L, F })` returns `{ outcome, reason, pWin, pLoss }`, first
  failing check wins: coverage `10*M >= 9*K` else stop `coverage`; kill when p_loss (tail of L in W+L) is
  below 0.05 (`outcome: 'kill'`, reason null); margin `10*(A-B) >= M` else stop `margin`; sign test p_win
  (tail of W in W+L) below 0.05 else stop `sign test`; flips only when `backend === 'jev'`: `10*F <= 3*M`
  else stop `flips`; otherwise keep.
- `formatP(p)` returns `p.toPrecision(4)`.
- `summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix)`: rows `Array<{ file, label }>`,
  answers `Map<file, Array<number|null>>`, baselineCalls `Map<file, 'yes'|'no'>`. Expected answers per row:
  1 for deem, `JEV_RERUNS` for jev. A row is measured when its array has exactly that length and every entry
  is a finite number in [0, 1]. A value at 0.5 or more is `yes`. The jev call is the class named at least
  twice; F adds `3 - (count of that class)` per measured jev row. A = measured rows where the column call
  equals the label, B = measured rows where the baseline call equals the label, W = only column right,
  L = only baseline right. Returns `{ backend, K, M, unmeasured, A, B, W, L, F, pWin, pLoss, outcome, reason, line }`
  with `F` null for deem, and `line` =
  `verdict <backend>: <keep|kill|stop (<reason>)> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> F=<F or n/a> p_win=<formatP> p_loss=<formatP> labels_sha256=<labelsSha>`
  plus `' ' + suffix` when suffix is a non-empty string.

## 6. Zero-call report (main)

`async function main(argv, deps = {})` returns the exit code. deps: `out` and `err` line writers (default
stdout / stderr plus `\n`), `env` (default `process.env`), `timeoutMs` (default 90000), `backoffMs` (default 2000).
`node:util` `parseArgs`, strict, no positionals: `outputs`, `fixtures`, `labels`, `out` (string), `deem`,
`jev`, `accept-payload` (boolean). Exit 2 (message on `err`, nothing on `out`) for: a parse error; no
`--outputs` (print `USAGE`); `--deem` or `--jev` without `--out` (`--deem needs --out <dir> so every call is recorded`,
or the `--jev` form when only `--jev` is set); any census, fixture, labels or deterministic-check error (its message).
Labeled rows are the matched outputs, in file order, that the labels map names. Lines on `out`, in order:

```
outputs: <n>
matched: <m>
unmatched: <u>
allowlist: <withAllowlist> of <total>
labels: none                       (or: labels: sha256=<hex of the file bytes> rows=<map size>)
labeled: <K> (yes <Y>, no <N>)
labels dropped: <map size - K>
baseline check: right <checkRight> of <K>
baseline majority: <majorityClass> right <majorityRight> of <K>
baseline method: <method> right <right> of <K>
question: <QUESTION>
margin: 0.10
<KEEP_RULE_LINE>
<POWER_LINE>
<gate line>
```

Gate line, first match: `K < 30` -> `stop: fewer than 30 labeled outputs`; `Y < 5` -> `stop: fewer than 5 labeled yes outputs`;
`N < 5` -> `stop: fewer than 5 labeled no outputs`; `10*right > 9*K` -> `no headroom`; else
`planned calls: jev <3K+1>, deem <K>`. Only the last opens the arms. The default run (no `--jev`, no
`--deem`) spawns nothing but the deterministic check, writes no file and returns 0.

## 7. Arms (order: Jev block, then Deem block)

With `--jev`: run the Jev gate (section 8). With `--deem`: run the Deem gate (section 9). A gate that
fails prints its skip line and the arm is skipped. A passing gate with a closed gate line prints
`<backend> arm skipped: label gate` (a `stop:` line) or `<backend> arm skipped: no headroom`. Only an open
gate runs the arm. A skipped or failed Jev gate never starts Deem and the reverse. After the arms, when
`--jev` or `--deem` was set, write `<out>/report.json` (section 10). Exit 0.

## 8. Jev gate

Provider P = `env.JEV_PROVIDER` or `official`. Print `jev: path=<which('jev') or none> provider=<P>`.
Then, first failure wins, each printing one skip line: not on PATH -> `jev arm skipped: jev not on PATH`;
`jev --version` first stdout line not exactly `jev 0.6.2` -> `jev arm skipped: version` then
`jev: found=<JSON.stringify(found)> path=<path>`; `jev auth status --provider P` exit not 0 ->
`jev arm skipped: no credential`; any labeled output not tracked by git and no `--accept-payload` ->
`jev arm skipped: payload not accepted`. Tracked = the names `git ls-files -z -- <names>` prints when run
with `cwd` = the outputs dir; a git failure means none tracked.

## 9. Deem gate

Port `readDeemHealth`, `deemCommand` and `which` from
`.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1024-1186` unchanged in
behavior (repo copy fallback `path.resolve(__dirname, '../../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs')`).
Pass: `deem: health backend=<b> model=<m> model_commit=<mc> source_commit=<sc>`. Skips:
`deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` (then
`deem: found=<JSON>`), `deem arm skipped: bad health response` (then `deem: found=<JSON>`).

## 10. Arms, call log and report

Port `spawnCall` and `createCallLog` from score-track-narrowing.mjs:1190-1250. Each labeled row's state is
`buildState(fixture, file text)`, written to the child's stdin, then closed.
Deem arm: print `deem: nothing leaves the machine; planned calls: <K>; estimated wall time: <(K*60.5/1000).toFixed(1)> s at 60.5 ms per call, the noul p50 from deem-local.md`,
then per row one `cli-deem noul -q <QUESTION>`. Jev arm: print
`jev: payload: <committed|untracked> benchmark outputs and fixture task text; planned calls: <3K+1>; estimated input tokens: <ceil(3*sum(state.length + QUESTION.length)/4)>`,
then `jev auth test --provider P` (model from its JSON `model`, else `unknown`), then per row
`JEV_RERUNS` calls of `jev noul --provider P -q <QUESTION>`. The answer is stdout JSON
`answers.answer.noul`. Exit handling, retries, stop lines and `partial rows=<n>` follow
score-track-narrowing.mjs:1302-1455 (deem) and 1565-1760 (jev), with the output file name in place of the
row id and the noul value in place of the pick. Status per call: `measured` (a number in [0, 1]), `failed`
(exit 0 without such a number), `unmeasured`, `unmeasured_timeout`. Every `calls.jsonl` line holds
`backend, output, rerun, attempt, wallMs, exitCode, noul, status`, plus `modelId, modelCommit, sourceCommit`
(deem) or `jevVersion, provider, model` (jev). After a finished arm print
`column <backend>: K=<K> measured=<M> unmeasured=<K-M> latency_p50_ms=<n|none> latency_p95_ms=<n|none>`
(nearest rank), then for deem `flips: n/a (commit pair)`, then a requalify line when `<out>/report.json`
from an earlier run holds a different deem commit pair (`requalify: model commit changed`) or jev
provider or model (`requalify: model changed`), then the verdict line. Deem suffix
`model=<id> model_commit=<mc> source_commit=<sc>`; jev suffix `jev_version=0.6.2 provider=<P> model=<model>`.
`report.json`: `{ question, labelsSha256, census, labeled, baseline, gate, columns, stopped, skipped, requalify }`.
