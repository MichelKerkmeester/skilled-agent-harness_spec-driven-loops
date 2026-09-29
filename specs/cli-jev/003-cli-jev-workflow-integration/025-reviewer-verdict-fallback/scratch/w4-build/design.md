# score-verdict-fallback.cjs: build design

S = `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`.
New: `S/lib/score-verdict-fallback.cjs` (read-only measurement script, `'use strict'`, Node
CommonJS, standard library only) and `S/tests/verdict-fallback.vitest.ts`.
Layout follows the shipped sibling `S/scorer/score-d4-agreement.cjs`: box header, numbered section
dividers, JSDoc on every exported function. The script reads, stores, logs and passes no key and
holds none of `API_KEY`, `TYPESAFE`, `Bearer`, `Authorization`. No code comment names a spec path,
phase number or requirement id. Sibling functions reused unchanged in behavior: `binomialTail`,
`formatP`, `which`, `deemCommand`, `readDeemHealth`, `deemGate`, `spawnCall`, `createCallLog`,
`readStoredReport`, `nearestRank`.

## 1. Premises

Each `file:line` the spec cites, checked today (HEAD `b5e71ae777` plus the uncommitted 024 build in the tree):

| Cite | State | Text found |
|---|---|---|
| `S/lib/reviewer-scorer.cjs:11` | ok | `VERDICTS = new Set(['pass', 'fail', 'block'])` |
| `S/lib/reviewer-scorer.cjs:117-123` | ok | `extractVerdict`; `:119` the one-line `(pass\|fail\|block)` regex; `:120` `matches.at(-1)` |
| `S/lib/reviewer-scorer.cjs:155-167` | ok | `classifyWithGrader`; `:156` returns `none` unless `grader === 'llm'` |
| `S/lib/reviewer-scorer.cjs:171` | ok | `if (!extracted.verdict) extracted = classifyWithGrader(...)` |
| `S/lib/reviewer-scorer.cjs:192` | ok | `fixtureCase.reviewer_output \|\| dispatchPrompt(...)` |
| `S/lib/reviewer-scorer.cjs:203` | ok | 16-char `outputHash` (no output text is kept) |
| `S/lib/reviewer-scorer.cjs:336` | ok | `extractVerdict` exported (`:333-341`) |
| `S/lib/reviewer-scorer.cjs:98-105` | ok | `applyCase` merge |
| `S/lib/reviewer-scorer.cjs:67-205`, `:231-236`, `:273-292` | ok | `loadProfile`..`runCase`, D1..D5, `main` |
| `assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:74-76`, `:82-90` | ok | deterministic replay; verdict contract |
| `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:206` | ok | reviewer-scorer route command |
| `.skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml:228` | ok | same route command |
| `deep-improvement/SKILL.md:222-224` | ok | Scoring bullet at `:222`; `:223`/`:224` are Promotion/Hardening |
| `deep-improvement/SKILL.md:118` | ok | `MODEL_BENCHMARK` resource row naming `reviewer-schema.md` |

Census inputs re-checked: `reviewer-regression.json` names the four `reviewer-*` fixtures; the four
hold 8 cases (2 each, visible + hidden), every case carries a recorded `reviewer_output`, and all
8 resolve to `expectedVerdict: fail`. No `reviewer-report.json` exists in the worktree.
`changelog/` newest is `v1.18.0.0.md` (024's file, on disk, uncommitted), so the next version is
`v1.19.0.0`; the spec's `v1.9.0.0.md at planning` premise is stale. The sibling script and its test
exist at the cited paths.

## 2. Interface

**Script:** `S/lib/score-verdict-fallback.cjs`. **Imports:** `{ extractVerdict }` from
`./reviewer-scorer.cjs` (never copied); `{ DEFAULT_PROFILES_DIR, fixturePathFor }` from
`../../lib/profile-resolve.cjs`. Sections: 1 IMPORTS, 2 CONSTANTS, 3 CENSUS, 4 BASELINES,
5 KEEP RULE, 6 DEEM GATE, 7 JEV GATE, 8 ARM HELPERS, 9 ARMS, 10 REPORT, 11 MAIN, 12 EXPORTS +
CLI ENTRYPOINT.

**Constants (section 2):**

```js
const QUESTION = 'Which verdict does this reviewer output give?';                       // (proposed)
const OPTION_PAIRS = [['pass', 'The reviewer approves the change'],                     // (proposed)
  ['fail', 'The reviewer rejects the change and names what must change'],
  ['block', 'The reviewer says it cannot give a verdict']];
const ORDERS = 3;                       // name order, rotated left by 1, then by 2
const LABEL_GATE = 12;                  // labeled regex-miss outputs below which no arm opens
const MARGIN_LINE = 'margin: 0.10';
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M';
const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
const DEEM_P50_MS = 65.6;               // the choice p50 in deem-local.md:87
const HEALTH_TIMEOUT_MS = 10000;        // spawn cap; cli-deem applies its own 2,000 ms HTTP timeout
const JEV_VERSION = 'jev 0.6.2';
const DEFAULT_PROFILE = path.resolve(__dirname, '../../../assets/model-benchmark/benchmark-profiles/reviewer-regression.json');
const REPO_CLI_DEEM = path.resolve(__dirname, '../../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
const USAGE = 'usage: score-verdict-fallback.cjs [--profile <path-or-id>] [--outputs <file>] [--reports <dir>]... [--jev] [--deem] [--out <dir>] [--accept-payload]';
```

**CLI switches** (`node:util` `parseArgs`, strict, no positionals): `--profile` string, default
`DEFAULT_PROFILE`; `--outputs` string (JSONL); `--reports` string with `multiple: true`;
`--jev`/`--deem`/`--accept-payload` booleans; `--out` string. Exit 2, message on stderr, nothing on
stdout, for: a parse error; `--deem` or `--jev` without `--out` (`--deem needs --out <dir> so every
call is recorded`, or the `--jev` form); any unreadable profile, fixture, outputs file or report; a
bad outputs row. Exit 0 otherwise. A bare run makes zero model calls and writes no file.

**stdout, in order** (`(proposed)` where the spec fixes no text):

```
fixture cases: <n> hits: <h> misses: <m>
fixture no recorded output: <x>                       (only when x > 0)          (proposed)
outputs rows: <n> hits: <h> misses: <m>               (only with --outputs)      (proposed)
report <path>: pattern=<p> llm-grader=<l> none=<n>    (one per --reports dir)    (proposed)
labeled: <K> (pass <x>, fail <y>, block <z>)                                     (proposed)
baseline majority: <class> right <n> of <K>                                      (proposed)
baseline loose: right <n> of <K>                                                 (proposed)
baseline method: <majority|loose> right <n> of <K>                               (proposed)
baseline unknown: right 0 of <K>                                                 (proposed)
question: <QUESTION>                                                             (proposed)
options: 3 sha256=<hex>                                                          (proposed)
orders: 3, name order then rotated left by 1 and by 2                            (proposed)
margin: 0.10
<keep rule line>
<power line>
<gate line>
```

**Gate line, first match:** `K < 12` -> `stop: fewer than 12 labeled regex-miss outputs`;
`pass` 0 -> `stop: no labeled pass output`; `fail` 0 -> `stop: no labeled fail output`; `block` 0 ->
`stop: no labeled block output`; `10*right > 9*K` -> `no headroom`; else
`planned calls: jev <3K+1>, deem <3K>` (proposed). Only `planned calls:` opens the arms; a closed
gate with a switch set prints `<backend> arm skipped: label gate` or `no headroom`.

**Files written:** `<out>/report.json` (only when `--jev` or `--deem`), `<out>/calls.jsonl`
(created on the first append). Nothing else; `git status --porcelain` is unchanged except an
operator-named report directory.

**Functions:**

- §3 `sha256Hex(input)` -> lowercase hex digest.
- §3 `resolveProfile(arg)` -> the arg from cwd when it exists, else
  `<DEFAULT_PROFILES_DIR>/<arg>.json`, mirroring `reviewer-scorer.cjs:67-71`.
- §3 `loadFixtureCases(profilePath)` -> `Array<{ fixtureId, name, output: string|null }>`: read the
  profile, resolve its `fixtureDir` as `reviewer-scorer.cjs:73-86` does, read each named fixture
  with `fixturePathFor`, and merge each case as `applyCase` does (`tests` when non-empty else
  `[{ name: id }]`, plus `hidden_tests`; the case overrides the fixture).
- §3 `censusFixtures(cases)` -> `{ total, hits, misses, noOutput }`; a case with no `reviewer_output`
  is `noOutput` and never dispatched; a case with an output is a hit when `extractVerdict(output).verdict`
  is non-null, else a miss.
- §3 `parseOutputs(text)` -> `Array<{ id, output, label, expectedVerdict }>`; one JSON object per
  line, blank lines skipped; errors naming the 1-based row: `outputs row <n>: not JSON`,
  `outputs row <n>: id must be a non-empty string`, `outputs row <n>: output must be a string`,
  `outputs row <n>: label must be pass, fail or block, got <JSON.stringify(value)>`,
  `outputs row <n>: duplicate id <id>` (proposed messages; `expectedVerdict` is kept, never scored).
- §3 `censusOutputs(rows)` -> `{ total, hits, misses, kept }`, kept = the regex-miss rows.
- §3 `censusReports(dirs)` -> `Array<{ path, pattern, llmGrader, none }>` counting
  `per_test[].verdictMethod` across `rows` (else `fixtures`) of each `<dir>/reviewer-report.json`.
- §4 `loosePick(text)` -> the last whole word `pass|fail|block` anywhere in the text, case-insensitive
  (`/\b(pass|fail|block)\b/gi`, last match, lowercased), else null.
- §4 `chooseBaseline(rows)` -> `{ majorityClass, majorityRight, looseRight, method, right, calls }`;
  the majority class of the labels (a tie goes to the class earliest in pass, fail, block -
  proposed); `method` is `loose` when `looseRight >= majorityRight`, else `majority`; `calls` is a
  Map id -> the chosen method's pick.
- §5 `binomialTail(successes, trials)` -> `{ num, den, p }`, exact BigInt tail; below 0.05 is
  `20n * num < den`.
- §5 `decideVerdict({ K, M, A, B, W, L, F })` -> `{ outcome, reason, pWin, pLoss }`, first failure
  wins: coverage `10*M >= 9*K`; kill when the loss tail of L in W+L is below 0.05; margin
  `10*(A-B) >= M`; sign test when the win tail of W in W+L is below 0.05; flips `10*F <= 3*M`
  (both backends); else keep.
- §5 `formatP(p)` -> `p.toPrecision(4)`.
- §5 `modalPick(answers)` -> `{ pick, top }`: the key named at least twice; three different picks
  give `{ pick: null, top: 1 }` (unstable).
- §5 `summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix)` -> counts plus
  `line`. A row is measured when its answer array holds exactly `ORDERS` submitted keys; a measured
  row is right when its modal pick equals the label (unstable is a miss); `F` adds `ORDERS - top`
  per measured row; `line` =
  `verdict <backend>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p_win=<p> p_loss=<p> labels_sha256=<hash>`
  plus `' ' + suffix` when non-empty.
- §6 `which(name, env)`, `deemCommand(env)`, `readDeemHealth(cmd, env)`, `deemGate(ctx)`: the
  sibling's behavior. Pass: `deem: health backend=<b> model=<m> model_commit=<mc> source_commit=<sc>`.
  Skips: `deem arm skipped: not reachable`, `stub backend`, `model` (then `deem: found=<JSON>`),
  `bad health response` (then `deem: found=<JSON>`).
- §7 `trackedFile(dir, name)` -> `git ls-files -z -- <name>` run with cwd `dir`; a git failure means
  not tracked. `jevGate(ctx)` -> identity line `jev: path=<path|none> provider=<P>`, P =
  `env.JEV_PROVIDER` or `official`; then `which('jev')`, `jev --version` exactly `jev 0.6.2`
  (else `jev arm skipped: version` + `jev: found=<JSON.stringify(found)> path=<path>`),
  `jev auth status --provider P` exit 0 (else `jev arm skipped: no credential`), and the outputs
  file untracked without `--accept-payload` (else `jev arm skipped: payload not accepted`).
- §8 `nearestRank(values, q)`, `spawnCall(file, args, stdinText, env, timeoutMs)` (stdin written
  then closed; timeout kills and resolves once), `createCallLog(outDir)`, `readStoredReport(outDir)`:
  the sibling's behavior.
- §9 `runDeemArm(plan, gate, ctx)` / `runJevArm(plan, gate, ctx)`: notice line, then per row
  `ORDERS` fresh calls. Deem args `choice -q <QUESTION> -o <key>=<description>` x3, in the three
  rotations; jev args `choice --provider P -q <QUESTION> -o ...` x3, after one
  `jev auth test --provider P` (model from its JSON `model`, else `unknown`). Deem notice:
  `deem: nothing leaves the machine; planned calls: <3K>; estimated wall time: <(3K*65.6/1000).toFixed(1)> s at 65.6 ms per call, the choice p50 from deem-local.md`.
  Jev notice: `jev: payload: <committed|untracked> reviewer outputs; planned calls: <3K+1>; estimated input tokens: <ceil(3*sum(output.length + QUESTION.length + sum(key.length + description.length + 1))/4)>`.
  Answer = stdout JSON `answers.answer.choice`, a submitted key. Exit 4 rechecks health (deem) or
  backs off once (jev) and retries once; a malformed answer or a spent retry leaves that call
  `unmeasured`; 2 stops as `usage error`, 3 as `backend refused` (deem) or `key rejected` (jev),
  130 as `interrupted`, a timeout as `unmeasured_timeout`; a stop prints `<backend>: partial rows=<n>`
  and no verdict. After a finished arm: `column <backend>: K=<K> measured=<M> unmeasured=<K-M> latency_p50_ms=<n|none> latency_p95_ms=<n|none>`
  (nearest rank), a requalify line when `<out>/report.json` holds a different deem commit pair
  (`requalify: model commit changed`) or jev provider/model (`requalify: model changed`), then the
  verdict line. Deem suffix `model=<id> model_commit=<mc> source_commit=<sc>`; jev suffix
  `jev_version=0.6.2 provider=<P> model=<model>`.
- §10 `buildReport(parts)` -> `{ question, optionsSha256, labelsSha256, census, labeled, baseline, gate, columns, stopped, skipped, requalify }`;
  `optionsSha256 = sha256Hex(JSON.stringify({ question: QUESTION, options: OPTION_PAIRS }))` (proposed).
  Column buckets carry the verdict line, K/M/A/B/W/L/F, both p values and the latency.
- §11 `main(argv, deps)` -> exit code; deps `out`, `err`, `env`, `timeoutMs` (default 90000, the
  Jev 90 s cap), `backoffMs` (default 2000). `calls.jsonl` line: `{ backend, output, order, attempt,
  wallMs, exitCode, pick, status }` plus `modelId, modelCommit, sourceCommit` (deem) or
  `jevVersion, provider, model` (jev); the auth-test line carries `output: null, order: null`.

## 3. Test cases

`S/tests/verdict-fallback.vitest.ts`; helpers as the sibling test: `tempDir`, `writeFixtures`,
`writeOutputs`, `stubDir`, `runMain` (deps injected, `timeoutMs: 5000`, `backoffMs: 1`).

| # | name | input | expected |
|---|---|---|---|
| 1 | `fixtures: merges visible and hidden cases` | temp profile, 2 fixtures, one case output `Looks fine to ship.` | `cases` N, `misses: 1` (no verdict line counts as a miss) |
| 2 | `fixtures: a case with no reviewer_output` | case without output | `noOutput: 1`; stub logs empty |
| 3 | `outputs: parses one labeled row per line` | 12-row JSONL | 12 rows, `expectedVerdict` kept |
| 4 | `outputs: a bad label exits 2 naming the row` | row 2 `label: "maybe"` | exit 2, err `outputs row 2: label must be pass, fail or block, got "maybe"` |
| 5 | `reports: counts per_test verdictMethod` | report with pattern/llm-grader/none | `{ pattern: 1, llmGrader: 1, none: 1 }` |
| 6 | `gate: 11 labeled misses prints the stop line` | 11 labeled misses | `stop: fewer than 12 labeled regex-miss outputs` |
| 7 | `gate: a missing block label prints its stop line` | 12 misses, no `block` | `stop: no labeled block output` |
| 8 | `loose: takes the last whole word, case-insensitive` | `please fail this.` / `BLOCK the release` / `Looks fine to ship.` | `fail` / `block` / null |
| 9 | `baselines: the better method wins, loose on a tie` | 12 labels, loose right on more | `method: loose`, `right` set |
| 10 | `headroom: a saturated baseline` | loose right on all 12 | `no headroom`, no call |
| 11 | `default run: calls no stub and writes no file` | bare run, stubs first on PATH | exit 0, census lines + stop line, no stub log, no file |
| 12 | `deem gate: a fake health passes` | stub health torch/deem-0.8-v1/m1/s1 | `deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1` |
| 13 | `deem gate: a stub backend skips byte-identically` | stub health `stub` | census lines + `deem arm skipped: stub backend` only |
| 14 | `jev gate: exit 0 passes` | stub version 0.6.2, `auth status` 0 | identity line; arm runs with `--accept-payload` |
| 15 | `jev gate: exit 3 prints no credential` | stub `auth status` exit 3 | `jev arm skipped: no credential` |
| 16 | `jev gate: an untracked outputs file without --accept-payload` | temp outputs, `--jev` | `jev arm skipped: payload not accepted` |
| 17 | `arms: --deem without --out exits 2 before any call` | `--deem` | exit 2, err `--deem needs --out <dir> so every call is recorded`, stub log empty |
| 18 | `verdict: keep` | stub answers modal-right, gain >= 10 pts | `verdict deem: keep K=...` line, `report.json` column |
| 19 | `verdict: kill` | stub answers the baseline beats | `verdict deem: kill ...` |
| 20 | `verdict: stop (margin)` | small gain | `verdict deem: stop (margin) ...` |
| 21 | `verdict: stop (coverage)` | one row short one order | `verdict deem: stop (coverage) ...` |
| 22 | `verdict: stop (flips)` | stub flips one order on enough rows | `verdict deem: stop (flips) ...` |
| 23 | `jev arm: keep on stub answers` | jev stub table, `--accept-payload` | `verdict jev: keep ... jev_version=0.6.2 provider=official model=stub-model` |
| 24 | `report: a skipped arm is recorded, no calls.jsonl` | `--deem`, stub health | `report.skipped.deem`, `calls.jsonl` absent |
| 25 | `report: requalify prints before the verdict` | stored report.json with old pair | `requalify: model commit changed` then the verdict line |

## 4. Build steps

1. **Code (Devin) - skeleton, constants, fixture census.** `S/lib/score-verdict-fallback.cjs` §1-3:
   imports, the constants block, `sha256Hex`, `resolveProfile`, `loadFixtureCases`, `censusFixtures`.
   Tests 1, 2.
2. **Code (Devin) - outputs parser.** §3 `parseOutputs`, `censusOutputs`. Tests 3, 4.
3. **Code (Devin) - reports reader.** §3 `censusReports`. Test 5.
4. **Code (Devin) - baselines.** §4 `loosePick`, `chooseBaseline`. Tests 8, 9.
5. **Code (Devin) - keep rule and column.** §5 `binomialTail`, `decideVerdict`, `formatP`,
   `modalPick`, `summarizeColumn`. Tests 18-22 (verdict arms on stub answers, one case each).
6. **Code (Devin) - zero-call main.** §11 `main`: switches, census stdout, gate lines, headroom,
   `planned calls:`, no file. Tests 6, 7, 10, 11.
7. **Code (Devin) - Deem gate.** §6 `which`, `deemCommand`, `readDeemHealth`, `deemGate`. Tests 12, 13.
8. **Code (Devin) - Deem arm.** §8 `nearestRank`, `spawnCall`, `createCallLog`; §9 `runDeemArm`
   (three orders, exit table, partial rows, latency line). Tests 17, 24 and the deem arm of 18-22.
9. **Code (Devin) - Jev gate and arm.** §7 `trackedFile`, `jevGate`; §9 `runJevArm`. Tests 14, 15,
   16, 23 and a jev flips case.
10. **Code (Devin) - report and requalify.** §8 `readStoredReport`, §10 `buildReport`, the `--out`
    rule, the requalify lines. Tests 25 and the `report.json` assertions of 13, 18, 24.
11. **Doc (Pi) - `S/lib/README.md`.** Mode `sk-create-readme`. MODEL: the `reviewer-scorer.cjs` row
    (`lib/README.md:36`). Facts: one KEY FILES row for `score-verdict-fallback.cjs` (census,
    baselines, label gate, `--jev`/`--deem` arms, `--out` report), and the Boundaries `Exports`
    clause "No module has a CLI main()" amended so it stays true of the one entrypoint.
12. **Doc (Pi) - `S/tests/README.md`.** Mode `sk-create-readme`. MODEL: the `d4-agreement.vitest.ts`
    row (`tests/README.md:49`). Facts: one row for `verdict-fallback.vitest.ts` with its test count,
    and the "Current state" count line updated to the measured suite total across 15 files.
13. **Doc (Pi) - `deep-improvement/SKILL.md`.** Mode `sk-create-skill`. MODEL: the Scoring bullet at
    `SKILL.md:222` with 024's sentence. Facts: one appended sentence naming the script, its
    zero-call default, the 12-label gate and the two switches; `version:` frontmatter -> 1.19.0.0.
14. **Doc (Pi) - `deep-improvement/README.md`.** Mode `sk-create-readme`. MODEL: the Lane B
    paragraph (`README.md:108`). Facts: one appended line naming the script and its switches.
15. **Doc (Pi) - `changelog/v1.19.0.0.md`.** Mode `sk-create-changelog`. MODEL:
    `changelog/v1.18.0.0.md`. Facts: the script, the zero-call census, the label gate, the two arms,
    the keep rule; version 1.19.0.0; spec folder line.
16. **Doc (Pi) - `feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md`.** Mode
    `sk-create-feature-catalog`. MODEL: `feature-catalog/scoring-system/hallucination-grader-agreement.md`.
    Facts: overview, how it works (census, baselines, gate, arms), source files (script, test,
    playbook scenario), metadata group Model-benchmark mode; version 1.19.0.0.
17. **Doc (Pi) - `feature-catalog/feature-catalog.md`.** Mode `sk-create-feature-catalog`. MODEL:
    the "Hallucination grader agreement" block and section 5. Facts: one index block under
    section 5, the category row 5 -> 6 features with the script in the runtime surface, the
    section lead sentence; `version:` -> 1.19.0.0.
18. **Doc (Pi) - `manual-testing-playbook/model-benchmark-mode/<scenario>.md`.** Mode
    `sk-create-manual-testing-playbook`. MODEL:
    `manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md`. Facts: scenario
    MB-052 (proposed) covering the census on the fixtures and a stub-backend skip, with the exact
    commands and expected lines; `feature_id: "MB-052"`, category, version 1.19.0.0.
19. **Doc (Pi) - `manual-testing-playbook/manual-testing-playbook.md`.** Mode
    `sk-create-manual-testing-playbook`. MODEL: the `5D-051` index block and section 15. Facts: one
    index block under section 15, "covers 7" -> "covers 8", the release-readiness subtotal 46 -> 47
    with MB-052.

## 5. Proof plan

| Criterion | Command | Expected |
|---|---|---|
| 1 zero-call default | stub `cli-deem` and `jev` (each appends one line to its log) first on `PATH`; `node S/lib/score-verdict-fallback.cjs` | exit 0; `fixture cases: 8 hits: 8 misses: 0`; `stop: fewer than 12 labeled regex-miss outputs`; both logs absent |
| 2 arm skips byte-identical | stub `cli-deem health` -> backend `stub`, then `... --deem --out <dir>`; stub `jev` `auth status --provider official` exit 3, then `... --jev --out <dir>` | exit 0; `deem arm skipped: stub backend`; identity line + `jev arm skipped: no credential`; the rest `cmp`-identical to run 1 |
| 3 suite | from `S/..` (`scripts/`): `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` | exit 0, `>= 16 passed`, `0 failed`; whole `model-benchmark/tests/` fails nothing beyond T002's baseline |
| 4 label gate or verdict | the census above (accepted end state) or, past 12 labeled misses, `... --deem --out <dir>` | `stop:` line, or one `verdict deem:` line and `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit`, `sourceCommit` |
| 5 read-only, no key | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' S/lib/score-verdict-fallback.cjs`; `git status --porcelain` before/after each run | no match; identical output |
| 6 spec gates | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback --strict` | `RESULT: PASSED` |

## 6. Open questions

1. How the operator collects regex-miss outputs: the census reads the `--outputs` file the operator
   names; no scorer change is made and an opt-in output save is a later phase (proposed).
2. The `--grader llm` classifier as a column: out of scope; the census reports its `llm-grader`
   counts from named reports instead (proposed).
3. The meaning of `block`: the fixed description above, printed with its hash; the owner confirms at
   review and a change before the first run is an amendment (proposed).
4. The switch names the spec leaves open: `--profile`, and `multiple: true` for `--reports`
   (proposed).
5. `lib/README.md` says "No module has a CLI main()"; the new script is an entrypoint, so that
   clause is amended in the same doc step (proposed).
6. A `--reports` dir without `reviewer-report.json` exits 2 naming the file (proposed).
7. The majority-class tie-break: earliest in the fixed order pass, fail, block (proposed).
8. The changelog version: `v1.19.0.0`, the next after 024's `v1.18.0.0.md`; the spec's
   `v1.9.0.0.md` premise is stale (proposed).
9. The playbook scenario id `MB-052` and the folder `model-benchmark-mode/` (proposed).
10. The stdout lines the spec does not fix are the `(proposed)` lines in section 2; the gate, keep
    rule, verdict line and gates follow the sibling and the spec verbatim.
