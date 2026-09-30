# Build design: 028-confirm-mode-stop-hint (`score-stop-hint.cjs`)

Read: parent `goal.md` D1–D7; this phase's `spec.md` §3–§4, `plan.md` §3–§5, `tasks.md`, `goal.md` §1–§3;
sibling `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` (`buildReport` :1508, `gate.label`, `columns`/`stopped`/`skipped`/`requalify`)
and `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts`; `sk-code` → `sk-code-opencode` (JavaScript references, `sk-code-quality` comment hygiene);
`sk-doc` modes `sk-create-skill`, `sk-create-readme`, `sk-create-changelog`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook`.

## 1. Premises

| Cited by | `file:line` | Check |
|---|---|---|
| spec §2 | `.skilled/commands/deep/assets/deep-research-confirm.yaml:1325-1354` | ok: `gate_post_iteration:` :1325, `on_D:` :1354 |
| spec §2 | `deep-research-confirm.yaml:1349-1353` | ok: `on_C:` :1349, `append_to_jsonl` `manualStop` :1351, `proceed_to` :1353 |
| spec §7 | `deep-research-confirm.yaml:1328-1345` | ok: `present: |` :1328 through `D) Cancel entirely` :1345 |
| spec §2 | `007-classifier-deep-research/research/research.md:421` | ok: `| R9, the confirm-mode stop suggestion | Waits on R8 | Keeps | Stays later |` |
| spec §Phase Context | `007-classifier-deep-research/research/research.md` section 12 | ok: R9 row :698, rank 13, `later`, judgment `none at use time`, backend `none` |
| spec §Phase Context | `001-deep-research/research/research.md` section 11 `### R9.` | moved: `### R9.` at :784 (record's seam column still quotes `:1316-1345`; the live gate is :1325-1354, the drift already logged in `goal.md`) |
| spec §Phase Context | `001-deep-research/research/research.md:1274` | ok: `| R9 confirm-mode suggestion | R8 yields a signal with precision of at least 0.9 |` |
| spec §Files | `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | ok: 1,938 lines, CommonJS; `buildReport` :1508-1539 writes `gate.label` and `columns`/`stopped`/`skipped`/`requalify` |
| spec §Files | `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | ok: 1,082 lines; `createRequire` + injected `main(argv, deps)` + stub-`PATH` pattern |
| brief | `/private/tmp/…/w4v/027/c2a-out/report.json` | ok: 5,721 bytes; `gate.label.passed=false`, `lineages[16]`, `columns/stopped/skipped/requalify` empty, no `calls.jsonl` — a stopped report, so the real run is expected to stop |
| spec §Files | `runtime/scripts/README.md`, `runtime/README.md`, `SKILL.md`, `runtime/changelog/v1.5.0.1.md`, `runtime/feature-catalog/{feature-catalog.md,scoring/}`, `runtime/manual-testing-playbook/{manual-testing-playbook.md,scoring/}` | ok: all exist; scripts README already holds an uncommitted `score-stop-rater.cjs` row; catalog 54 entries / scoring 2 / F055 highest; playbook 54 scenarios / scoring 2 / DLR-055 highest |

## 2. Interface

**Script.** `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` (create; propose ~250–350 LOC).
CommonJS, `'use strict'`, stdlib only: `node:fs`, `node:path`, `node:crypto`, `node:util` (`parseArgs`). No `node:child_process`, no spawn, no git, no cwd walk, no temp file; nothing is read from the real repository, so a default run is milliseconds.

**Switches.**

| Switch | Rule | Exit |
|---|---|---|
| `--rater-report <dir>` | Required. Reads `<dir>/report.json`; hashes the bytes it parses. Missing switch → `--rater-report <dir> is required`; missing file → `rater report not found: <path>`; bad JSON → `rater report is not JSON: <path>`; `lineages` not an array → `rater report has no lineage list: <path>`; a lineage without numeric `gold`/`lastIteration` → `rater report lineage <i> is missing gold or lastIteration` (exact strings proposed; the spec fixes only "a named error") | 2 on stderr, before any stdout |
| `--jev` | Adds the `jev` column from 027's recorded rater stops | 0 |
| `--deem` | Adds the `deem` column | 0 |
| `--out <dir>` | Optional; writes `<dir>/report.json` (proposed). Absent → nothing is written. `(proposed)` refuse with exit 2 at parse time when its resolved `report.json` is the `--rater-report` file, so a run can never overwrite its input | 0 / 2 |
| unknown switch, positional | `parseArgs({strict:true, allowPositionals:false})` error | 2 on stderr |

Exit codes: `0` = printed columns/verdicts, or the gate stop; `2` = every parse/read/shape/refusal error. No other code. With both switches the `jev` column is handled and printed before the `deem` column (parent D1). Column print order: `legacy`, `sources`, `jev`, `deem`.

**stdout lines, in order** (after the gate passes; `requalify` and skip lines as shown):
1. `keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)` — one line, sibling pattern.
2. `column <name>: measured <M> hints <W+L> right <W> wrong <L> no hint <M-(W+L)> saved <S>` (exact field order proposed; the `column <name>:` prefix and the six facts are REQ-003).
3. `verdict <name>: keep|kill|stop (<reason>) K=<K> M=<M> W=<W> L=<L> saved=<S> p=<p> report=<sha12>` + ` <rater>` for a model column. `(proposed)` `p` = the tail the decision turned on: `kill` → P(X≥L), every other outcome → P(X≥W), `formatP` = `toPrecision(4)`. `<rater>`: jev `jev_version=<v> provider=<p> model=<m>`; deem `model=<m> model_commit=<c> source_commit=<c>` (027's column fields; subject-name label proposed).
4. `stop: rater report has no confirmed gold` — printed when `report.gate?.label?.passed !== true`; nothing else, no report written, exit 0.
5. `jev column skipped: rater report has none` / `deem column skipped: rater report has none` — column absent, or 027 recorded it under `skipped` or `stopped`; replaces that column's lines; all other output byte-identical.
6. `requalify: rater changed` — printed immediately before a model column's verdict when a prior `<out>/report.json` recorded a different rater identity for it. Only with `--out`.

**Files.** Read `<rater-report>/report.json` (SHA-256 of the read bytes); write `<out>/report.json` whole, only when the gate passed and `--out` is given. No other write.

**Exported functions.**

| Function | Signature → behavior |
|---|---|
| `sha256(file)` | `string` → 64-hex digest of the file bytes |
| `readRaterReport(dir)` | `{ report, path, sha256 }`; throws named `Error` on missing/unparseable/ill-shaped |
| `gateStopLine(report)` | `string\|null` → `NO_GOLD_LINE` unless `gate.label.passed === true` |
| `hintFor(lineage, stop)` | `{ hint, right, wrong, saved }`; `t = stop` when numeric and `< lastIteration`, else `null`; right `gold <= t`, wrong `t < gold`, saved `lastIteration - t` on a right hint |
| `countColumn(lineages, column)` | `{ column, K, M, hints, W, L, noHint, saved }`; `M` = lineages whose `stops[column]` is numeric (all `K` for `legacy`/`sources`); `hints = W+L` |
| `binomialTail(successes, trials)` | `{ num: bigint, den: bigint, p: number }`; sibling's exact BigInt coefficient sum |
| `decideVerdict({ column, K, M, W, L, F, C })` | `{ outcome, reason, pWin, pLoss }`; first failed check in the spec's order (coverage → kill → precision → savings → sign test → flips (jev only)) |
| `formatP(p)` / `columnLine(counts)` / `verdictLine(summary, raterSuffix)` | formatted lines above |
| `selectColumns(report, { jev, deem })` | ordered `[{ column, skip, skipLine }]` |
| `raterSuffix(report, column)` | identity string, `''` for `legacy`/`sources` |
| `hintLine(column)` | `**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>` (`<t>` literal, proposed) |
| `readStoredReport(outDir)` | parsed prior report or `null` (sibling pattern) |
| `buildReport(parts)` / `writeReport(outDir, report)` | report object / written path or `null` |
| `main(argv, deps = {})` | `Promise<number>`; deps `{ out, err, env }` (env so tests inject `PATH` without touching `process.env`) |

**Report shape (proposed; the spec fixes only that each verdict line and each kept column's hint line live in it).**
`{ generated, rater: { path, sha256 }, gate: { passed: true, line: null }, columns: { <name>: { K, M, hints, W, L, noHint, saved, outcome, reason, p, verdict, hintLine?, rater?, requalify? } }, skipped: { <name>: <skip line> }, requalify: { <name>: string|null } }`.

**Keep Rule (spec §4, fixed before any evaluation).** Inputs `K` = `report.lineages.length` when the gate passed; `M`/`W`/`L` from `countColumn`; baseline = today's screen (never wrong, saves nothing).
`pWin = binomialTail(W, W+L)`, `pLoss = binomialTail(L, W+L)`; in order:
1. `10*M >= 9*K` else `stop (coverage)`;
2. `20n * pLoss.num < pLoss.den` → `kill`;
3. `10*W >= 9*(W+L)` else `stop (precision)`;
4. `5*W >= M` else `stop (savings)`;
5. `20n * pWin.num < pWin.den` else `stop (sign test)` (`pWin` is 1 when `W+L = 0`);
6. `column === 'jev' && !(10*F <= C)` else `stop (flips)`, `F`/`C` from `report.columns.jev`;
7. `keep`.

**Constants.** `REPORT_FILE = 'report.json'`; `NO_GOLD_LINE`; `SKIP_SUFFIX = 'column skipped: rater report has none'`; `REQUALIFY_LINE = 'requalify: rater changed'`; `DEFAULT_COLUMNS = ['legacy','sources']`; `MODEL_COLUMNS = ['jev','deem']`; `SHA_CHARS = 12`; `COVERAGE_FLOOR = 0.9`; `KILL_ALPHA = 0.05`; `PRECISION_FLOOR = 0.9`; `SAVINGS_FLOOR = 0.2`; `SIGN_ALPHA = 0.05`; `FLIP_CEILING = 0.10`; `KEEP_RULE_LINE`; `KEEP_HINT_TEMPLATE`; `USAGE = 'node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--deem] [--out <dir>]'`.
No timeout constant and no label-gate size: the script spawns no process and does not re-apply 027's gates — it reads 027's gate decision; the only carried-in 027 threshold is the 0.10 flip ceiling.

## 3. Test cases

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts` (create; vitest config already includes `tests/**/*.{vitest,test}.ts`).
Fixtures are JSON written into `os.tmpdir()` dirs by helpers in the file (spec T003/T004); no git repository and no tracked tree is read, so no commit flags, no `maxBuffer`, and no count read from the real repository is involved. Model columns are exercised only through their recorded stops, never a live backend.

| # | name | input | expected |
|---|---|---|---|
| 1 | reader accepts a gated report | fixture A (`gate.label.passed=true`, 20 lineages) | `{ report, path, sha256 }`; `sha256` is 64 hex of the file bytes |
| 2 | reader refuses a missing report | dir with no `report.json` | exit 2; stderr `rater report not found: …`; stdout empty |
| 3 | reader refuses an unparseable report | `report.json` = `{` | exit 2; stderr `rater report is not JSON: …` |
| 4 | gate stop prints the stop line and exits 0 | fixture S (`gate.label.passed=false`) | stdout exactly `stop: rater report has no confirmed gold`; no `verdict ` line; exit 0 |
| 5 | an unarmed report stops too | fixture with `gate.label` null | same stop line; exit 0 |
| 6 | hint is right inside the gold window | lineage `g=1,r=3,stop=2` | hint 2, right, saved 1 |
| 7 | hint is wrong before gold | lineage `g=3,r=5,stop=1` | hint 1, wrong, saved 0 |
| 8 | a stop at the recorded last iteration raises no hint | lineage `g=1,r=2,stop=2` | no hint; `M` counts the lineage, `hints` does not |
| 9 | a stop past the recorded last iteration raises no hint | lineage `g=2,r=6,stop=7` | no hint |
| 10 | an unmeasured stop raises no hint and trims M | `stops.legacy: null` on one of two lineages | `M=1`; no hint from the null |
| 11 | column lines print measured hints right wrong no hint saved | fixture A default | two lines via the `main` seam, format §2-2, e.g. `column legacy: measured 20 hints 19 right 18 wrong 1 no hint 1 saved 18` |
| 12 | default run prints legacy and sources only | fixture A default | no `column jev:`/`column deem:` and no `verdict jev:`/`verdict deem:` |
| 13 | `--jev`/`--deem` skip a report with no rater columns and leave the rest byte-identical | fixture B (no rater columns), default run then `--jev --deem` | both skip lines print; removing them leaves the default run's lines identical |
| 14 | `--jev` skips a column 027 stopped | fixture D (`stopped.jev`) | `jev column skipped: rater report has none` |
| 15 | `--deem` skips a column 027 skipped | fixture C (`skipped.deem`) | `deem column skipped: rater report has none` |
| 16 | verdict keep | K=20 M=20 W=18 L=1 | `verdict legacy: keep K=20 M=20 W=18 L=1 saved=18 p=3.815e-5 report=<sha12>` |
| 17 | verdict kill | K=20 M=20 W=0 L=5 | `verdict legacy: kill … p=0.03125 …` |
| 18 | verdict stop (precision) | K=20 M=20 W=17 L=3 | `verdict legacy: stop (precision) …` |
| 19 | verdict stop (coverage) | `--jev`, K=20 M=17 | `verdict jev: stop (coverage) …` |
| 20 | verdict stop (savings) | K=20 M=20 W=1 L=0 | `verdict legacy: stop (savings) …` |
| 21 | verdict stop (sign test) | K=20 M=20 W=4 L=0 | `verdict legacy: stop (sign test) …` |
| 22 | verdict stop (flips) on jev | K=20 M=20 W=5 L=0 F=2 C=10 | `verdict jev: stop (flips) …` |
| 23 | jev keep when the flip rate holds | K=20 M=20 W=5 L=0 F=1 C=10 | `verdict jev: keep …` with the rater suffix |
| 24 | a kept column writes the proposed hint line | fixture A `--out <dir>` | `report.columns.legacy.hintLine` = `**Stop hint**: legacy replay says this loop found its last new cited source by iteration <t>` |
| 25 | report.json holds every verdict line | fixture A `--out <dir>` | each `report.columns.<name>.verdict` equals the stdout line |
| 26 | requalify prints before the verdict | stored `<out>/report.json` on an older deem pair | `requalify: rater changed` line immediately before `verdict deem: …`; `report.requalify.deem` set |
| 27 | stub jev and cli-deem log nothing in any mode | stub binaries first on injected `PATH`, default and `--jev --deem` runs | exit 0; stub log file never exists |
| 28 | the script holds no spawn of a rater | script source text | no match for `/spawn.*(jev|cli-deem)/` |

Verdict fixtures are reachable through the gates in order (arithmetic against all earlier checks):

| case | K/M/W/L | F/C | earlier gates | lands on |
|---|---|---|---|---|
| 16 keep | 20/20/18/1 | – | coverage 200≥180; p_loss=1−2⁻¹⁹≈1; precision 180≥171; savings 90≥20; p_win=20/2¹⁹≈3.81e-5<0.05 | keep |
| 17 kill | 20/20/0/5 | – | coverage ✓; p_loss=1/2⁵=0.03125<0.05 | kill |
| 18 stop (precision) | 20/20/17/3 | – | coverage ✓; p_loss≈0.9998; 10·17=170<9·20=180 | precision |
| 19 stop (coverage) | 20/17 | – | 10·17=170<9·20=180 | coverage |
| 20 stop (savings) | 20/20/1/0 | – | coverage ✓; p_loss=1; precision 10≥9; 5·1=5<20 | savings |
| 21 stop (sign test) | 20/20/4/0 | – | coverage ✓; p_loss=1; precision 40≥36; savings 20≥20; p_win=1/2⁴=0.0625≥0.05 | sign test |
| 22 stop (flips) | 20/20/5/0 | 2/10 | coverage ✓; p_loss=1; precision 50≥45; savings 25≥20; p_win=1/2⁵=0.03125<0.05; 10·2=20>10 | flips |
| 23 jev keep | 20/20/5/0 | 1/10 | as 22 but 10·1≤10 | keep |

The `W+L = 0` clause in the sign test is unreachable through the gates on a gated report: 027 needs 5 confirmed reads, so `K >= 5`; coverage forces `M >= 0.9K >= 5`; savings forces `5W >= M >= 5`, so `W >= 1` whenever the sign test is reached. Implement it defensively; do not write a fixture for it. A `legacy`/`sources` coverage case is likewise unreachable on a real 027 report (`stopFor` returns a stop for every non-empty series, so `M = K`); case 19 uses the realistic shape, a `jev` column with null stops.

## 4. Build steps

Order: `c1 → c2 → c3 → c4 → c5 → d1 → d2 → d3 → d4 → d5 → d6 → d7`. No step calls a function a later step adds. Code steps follow sk-code's OpenCode surface (`sk-code-opencode` JavaScript references, `sk-code-quality` comment hygiene; no spec path, phase number or id in a comment). Doc steps follow sk-doc modes. `d1`–`d6` touch files phases 027, 029 and 030 also touch, so the orchestrator runs their doc steps one after another (parent D3), 027's first.

`c1` — Report reader. Executor: DeepSeek (D5 chain). File `S` (create). Constant block; `sha256`; `readRaterReport`; `gateStopLine`; `main` with `parseArgs`, the two refusals and the gate stop; stub `USAGE`. `V` (create) tests 1–5. Check: `npx vitest run tests/unit/score-stop-hint.vitest.ts` → 5 passed.
`c2` — Hint counter. File `S`. `hintFor`, `countColumn`, `columnLine`; `main` prints the two default column lines after a passed gate. `V` tests 6–11. Check: 11 passed.
`c3` — Column selector and skips. File `S`. `selectColumns`; `--jev`/`--deem` add their columns; skip line when absent/`skipped`/`stopped`. `V` tests 12–15. Check: 15 passed.
`c4` — Keep Rule, verdict and requalify. File `S`. `binomialTail`, `formatP`, `decideVerdict`, `raterSuffix`, `verdictLine`, `readStoredReport`; `main` prints verdicts and `REQUALIFY_LINE`. `V` tests 16–23, 26. Check: 24 passed.
`c5` — Report, hint line, no-call guard. File `S`. `hintLine`, `buildReport`, `writeReport`; `main` writes only with `--out`. `V` tests 24, 25, 27, 28. Check: 28 passed; `node --check` on `S` exits 0.
`d1` — `.skilled/skills/system-deep-loop/SKILL.md`. Mode `sk-create-skill`. Insert one sentence in the §3 Backend paragraph after :111's promoted-plumbing clause. MODEL: that same paragraph, plus `deep-improvement/SKILL.md`'s appended scorer sentence. Facts: the runtime holds an offline `score-stop-hint.cjs` that replays a stop-rater report and says whether a replayed stop would have made a good confirm-mode hint; it calls no model and changes no gate.
`d2` — `.skilled/skills/system-deep-loop/runtime/README.md`. Mode `sk-create-readme`. Insert one sentence after :48 (§3 PUBLIC SURFACE) naming the script, its `--rater-report <dir>` input, the `--jev`/`--deem` column switches and `--out <dir>`. MODEL: the appended-sentence shape of `deep-improvement/README.md`'s `score-verdict-fallback.cjs` sentence. Facts: no model call; the gate is unchanged.
`d3` — `.skilled/skills/system-deep-loop/runtime/scripts/README.md`. Mode `sk-create-readme` (code folder). Insert one row in §3 FILES alphabetically before the `score-stop-rater.cjs` row (:52). MODEL: that row. Facts: reads one stop-rater report, prints per-column hint counts and one Keep-Rule verdict per column, switches as in `d2`, no model call.
`d4` — `.skilled/skills/system-deep-loop/runtime/changelog/v1.5.0.2.md`. Mode `sk-create-changelog`. MODEL: `v1.5.0.1.md`; next version after the newest at planning (v1.5.0.1) is v1.5.0.2 (proposed). Facts: new offline hint evaluator plus its tests; no runtime behavior and no gate change.
`d5` — `runtime/feature-catalog/scoring/stop-hint-replay.md` (create) and `runtime/feature-catalog/feature-catalog.md`. Mode `sk-create-feature-catalog`. MODEL: `scoring/convergence-score-delta.md` for the entry and its §6 SCORING index block; `sk-create-frontmatter` owns the 4-part `version`. Facts: script path, `--rater-report <dir>` input, `--jev`/`--deem`/`--out` switches, no model call, Keep Rule pointer. Index edits: one `###` block in §6, the §1 scoring row count and the "N entries" sentence each incremented by one from the values read at doc time; id is the lowest free `F0NN` at doc time (F056 now; 027's doc step runs first and may take it).
`d6` — `runtime/manual-testing-playbook/scoring/stop-hint-replay.md` (create) and `runtime/manual-testing-playbook/manual-testing-playbook.md`. Mode `sk-create-manual-testing-playbook`. MODEL: `scoring/convergence-score-delta.md` (DLR-040) for the scenario and its index block. Facts: fixture run and stub no-call scenario from §3 cases 1–5, 13, 27; expected signals, evidence and failure triage per the template. Index edits: one `### DLR-0NN | …` block in the SCORING section, the category intro count and the "N deterministic scenarios" sentence each incremented by one; id is the lowest free `DLR-0NN` at doc time (DLR-056 now).
`d7` — Generated copies. Conditional (spec §Files last row). After `d6`, run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` and let the pre-commit mirror gate run; regenerate only the copies that report stale, and name each touched copy in the build record.

## 5. Proof plan

| Goal criterion | Command | Expected |
|---|---|---|
| 1: gated default run prints both zero-call columns and their verdicts, stubs log zero | stub `jev`/`cli-deem` first on `PATH`; `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <gated fixture dir>` | exit 0; `column legacy:`, `column sources:`, `verdict legacy:`, `verdict sources:`; stub log absent |
| 2: gate stop and skip lines | gate-stop fixture, then fixture B with `--jev --deem` | `stop: rater report has no confirmed gold`, no verdict, exit 0; both skip lines, remainder byte-identical to the default run |
| 3: tests | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-stop-hint.vitest.ts` | exit 0; 28 passed, 0 failed (≥10) |
| 4: real run | `node … --rater-report <027 dir> --jev --deem` | `verdict legacy:` and `verdict sources:` plus one verdict per recorded rater column, or the accepted end state `stop: rater report has no confirmed gold` — the only 027 report in this tree (`/private/tmp/…/w4v/027/c2a-out/report.json`) has `gate.label.passed=false`, so today the stop line is the expected result |
| 5: no side effects | `git status --porcelain` before/after each run; `git diff --stat .skilled/commands/deep/assets/`; `git show --name-only <build commit>` | identical status; empty diff; only `system-deep-loop` files, generated copies and this phase folder |
| 6: docs and packet | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc> --type <readme\|skill\|changelog\|feature_catalog\|playbook_feature>`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint --strict` | each exit 0 `VALID`; `RESULT: PASSED` |

## 6. Open questions

1. REQ-007's `<t>`: the only coherent single value is the live iteration, so keep `<t>` literal in the stored line and fill it in the later live gate. `(proposed)`
2. `K`: read `K = report.lineages.length` (027 writes `census.sampled` equal to it). `(proposed)` Do not refuse a census/lineage count mismatch; 027's report format fixes equality.
3. `--out` equal to `--rater-report`: refuse with exit 2 before any output, else a run overwrites the report it reads and destroys 027's evidence. `(proposed)`
4. Gate stop with `--out`: write nothing, even when `--out` is given — the run closes at the stop line. `(proposed)`
5. Model column availability: available when `report.columns[<name>]` exists and the column is not under `stopped`/`skipped`; individual null stops are unmeasured and only lower `M`. `(proposed)`
6. `report=<sha12>`: first 12 hex of the SHA-256 of the `report.json` bytes read (the spec says SHA-256; the line says sha12). `(proposed)`
7. Doc ids and versions: F/DLR numbers and the catalog/playbook version are the lowest free values read at doc time, after 027's doc step (F056/DLR-056 and `1.4.0.15` at design time). The real verdict run stays open until a 027 report passes its label gate; the phase is allowed to close on the stop line. `(proposed)`
