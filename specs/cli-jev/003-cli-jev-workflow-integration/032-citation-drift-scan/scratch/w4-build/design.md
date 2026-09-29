# Build Design: citation-drift-scan

Script `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, test `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`, labels `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`. Pattern for every section: `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` (1,479 lines, ES module, exported pure functions + `main()` guarded by the realpath check) and its `judge-agreement.test.mjs` (920 lines, `node --test`, stub binaries first on `PATH`). All names below are proposed.

## 1. Premises

| Premise (as the spec cites it) | Today | Status |
|---|---|---|
| `research.md:844-863` R24 block (`:844` heading, `:848` verdict `later`, `:857` keep-or-kill, `:863` promote-when) | same lines | ok |
| `research.md:478`, `:480`, `:114` (500 path-aware, dead 4 of 232, K10 counts) | same lines | ok |
| `research.md:1030`, `:1047`, `:1060`, `:1079`, `:1173` | same lines | ok |
| `check-ac-coverage.sh:437` `_ac_citation_resolves()` | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:437` | ok |
| `validate_catalog_package.py:494` `LINE_RANGE_SUFFIX_RE`, `:535` the strip | `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:494`, `:535` | ok |
| `validate_document.py:18-21` exits, `:1691-1692` sets | `.skilled/skills/sk-doc/shared/scripts/validate_document.py:18-21`, `:1691-1692` | ok |
| `deem-local.md:38` `noul` p50 60.5 ms, `:53` temperature 1.0, `:92` deterministic | same lines | ok |
| `../017-deem-search-narrowing-arm/spec.md:148` exit table | same line | ok |
| `../006-goal-criteria-lint/spec.md:166` Deem stability = commit pair | same line | ok |
| `../002-advisor-jev-tiebreak-arm/implementation-summary.md:104` calibration, `:107` reading | same lines | ok |
| `../003-goal-verifier-jev-shadow/goal.md:64` D9 payload gate | same line | ok |
| `.skilled/skills/cli-classifier/cli-deem/SKILL.md:49-57` health check | same lines | ok |
| `score-track-narrowing.mjs:1076-1080` (`deemCommand`) — the spec names the file only | resolved at `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1076-1080` | ok |
| 008 Complete `ee3a1b057c`; 009 Complete `ea883967d4`; `cli-usage/SKILL.md` present | `009-cli-jev-hub-move/spec.md` Status Complete | ok |
| `jev` 0.6.2 on `PATH` | `command -v jev` -> `~/.local/bin/jev`; `jev --version` -> `jev 0.6.2` (exit 0) | ok |
| Files to Change targets | `shared/scripts/README.md`, `scripts/tests/README.md`, `SKILL.md` + `.hermes` copy, `README.md`, `changelog/v2.2.2.0.md` (newest), `feature-catalog/document-validation/`, `feature-catalog.md`, `manual-testing-playbook/` + its index, `run-script-tests.sh` all exist | ok |
| The three Create rows | no `cite-drift*` name exists anywhere outside this phase folder and the retrieval fixtures | new |
| Sibling pattern | `judge-agreement.mjs` 1,479 lines, test 920 lines | ok |

## 2. Interface

### 2.1 CLI switches and exit codes

| Switch | Type | Rule |
|---|---|---|
| `--draw` | boolean | needs `--seed <n>` (an integer; a non-integer exits 2); writes the labels file; refuses (exit 2, stderr `draw: refusing to overwrite <path>, operator labels present`) when any row carries a non-null `labeler` |
| `--seed <n>` | string | read only with `--draw` |
| `--jev` | boolean | needs `--out <dir>`; else exit 2 before any call |
| `--deem` | boolean | needs `--out <dir>`; else exit 2 before any call |
| `--out <dir>` | string | the report directory; `report.json` is written only when `--jev` or `--deem` is set |
| `--labels <file>` | string | default `LABELS_PATH` beside the script |

Exit codes: `0` = the report printed, a skipped or stopped arm included; `2` = bad invocation, unreadable input, a `--draw` over operator labels, or a missing `--out` — all before any call; `130` = interrupted (a `SIGINT` on the process group; a child's own `130` maps to that arm's stop line and the script still exits 0). `parseArgs({strict: true, allowPositionals: false})`; any parse error prints the message to stderr and returns 2, as the sibling does.

### 2.2 stdout lines (verbatim formats)

Census, always, before anything else:

```
skill <skill>: citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> dead=<n>
citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> refused=<n> dead=<n> commit=<sha12>
cite dead: <doc>:<line> -> <target>:<line>
margin: 0.10
keep rule: coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M
```

One `skill` line per skill, sorted by skill name. One `cite dead:` line per dead citation, sorted by doc then line. `margin:` and `keep rule:` print on every run, before any call.

Label gate, comparators and headroom, in this order:

```
stop: fewer than 40 labeled rows
comparator flag-nothing: <right>/<K> = <ratio>
comparator identifier-overlap: <right>/<K> = <ratio>
baseline method: <flag-nothing|identifier-overlap>
headroom: baseline=<ratio> margin=0.10
instruction: "Does the cited code window still show what the citing sentence claims?" sha256=<hex>
no headroom
underpowered: winnable=<n>
```

The run prints the `stop:` line when fewer than 40 rows carry a verdict, and stops there. With 40 or more it prints the two comparator lines, the baseline method and the headroom line; when `10*right > 9*K` it prints `no headroom` instead of the headroom line; when `K - right < 5` it prints `underpowered: winnable=<n>`. The `instruction:` line prints once, at the `planned` gate only, so the fixed `-q` text and its SHA-256 are on stdout before any call. Neither the `no headroom` nor the `underpowered` run calls a backend or writes a report.

Draw mode, one line: `draw: path=<p> seed=<n> commit=<sha12> rows=40 live=20 constructed=20`.

Deem arm:

```
deem: health backend=<b> model=<m> model_commit=<c> source_commit=<c>
deem arm skipped: not reachable|stub backend|model|bad health response
deem: found=<json>                                  (after `model` and `bad health response` only)
deem: nothing leaves the machine; planned calls: <K>; estimated wall time: <x> s at 60.5 ms per call, the noul p50 in deem-local.md
column deem: rows=<K> measured=<M> unmeasured=<n> latency_p50_ms=<n|none> latency_p95_ms=<n|none>
brier deem: <value>
flips: not applicable (deem noul)
deem arm stopped: backend refused|server gone|model commit changed mid-run|usage error|interrupted
deem: partial rows=<n>
requalify: model commit changed
```

Jev arm:

```
jev: path=<p> provider=<P>
jev arm skipped: jev not on PATH|version|no credential
jev: found=<json> path=<p>                            (after `version` only)
jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: <3K+1>; estimated input tokens: <n>
jev: auth test provider=<P> model=<m>
column jev: rows=<K> measured=<M> unmeasured=<n> latency_p50_ms=<n|none> latency_p95_ms=<n|none>
brier jev: <value>
jev arm stopped: key rejected|usage error|interrupted|auth test failed
jev: partial rows=<n>
requalify: model changed
```

Verdict line, one per column, last, exactly the sibling's shape plus the new counts:

```
verdict <backend>: <keep|kill (precision)|stop (coverage)|stop (margin)|stop (sign test)|stop (flips)> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> TP=<TP> FP=<FP> F=<F|n/a> p=<p> labels_sha256=<sha12> <suffix>
```

The suffix is `model=<m> model_commit=<c> source_commit=<c>` for Deem and `jev_version=0.6.2 provider=<P> model=<m>` for Jev. `p` is the sign-test p. A stopped arm prints no verdict and no column line.

### 2.3 Files written

| Path | When | Body |
|---|---|---|
| `--labels <file>` (default `LABELS_PATH`) | `--draw` only | 40 JSON lines, no text: `{id, doc, doc_line, target, target_line, window_start, window_end, commit, claim_sha12, window_sha12, kind, verdict, labeler}` |
| `<out>/calls.jsonl` | first call of an arm | one line per call: `{rowId, rerun, wallMs, exitCode, backend, probability, flag, status}`; Deem adds `modelId`, `modelCommit`, `sourceCommit`; Jev adds `jevVersion`, `provider`, `model`. `status` is `measured`, `unmeasured` or `unmeasured_timeout` |
| `<out>/report.json` | after the arms | `{census, commit, labels:{path,sha256,rows,labeled}, comparators, baselineMethod, headroom, winnable, keepRule, margin, columns, stopped, skipped}` |

Nothing else is ever written. The default run writes no file.

### 2.4 Exported functions

```
sha256Hex(text) -> hex
headCommit(repoRoot) -> 40-hex                     # git -C <root> rev-parse HEAD
listTrackedFiles(repoRoot) -> Set<path>            # git -C <root> ls-files -z
extractCitations(text, doc) -> [{doc, line, sentence, target, targetLine, targetLineEnd|null}]
resolveCitation(citation, {tracked, repoRoot, skillRoot}) -> {status, path|null, endLine|null}
buildCensus(repoRoot, tracked) -> {commit, perSkill, total, dead[], refused}
drawRows({census, repoRoot, commit, seed}) -> row[]
readWindow(repoRoot, commit, path, start, end) -> string[]   # git show <commit>:<path>, 1-based inclusive
parseLabels(text) -> row[]
labelCounts(rows) -> {labeled, live, constructed}
identifierTokens(sentence, target) -> string[]
flagByIdentifierOverlap(sentence, windowText, target) -> boolean
scoreComparators(rows, windows) -> {flagNothing, identifierOverlap, baselineMethod, headroom, winnable}
summaryLines(input) -> {lines, gate}                # gate: stop | no headroom | underpowered | planned
binomialTail(k, n) -> {p, below}                    # BigInt, 20n*num < den
decideVerdict({backend, K, M, A, B, W, L, TP, FP, F}) -> {verdict, p}
verdictLine(summary, labelsSha, suffix) -> string
brierScore(probabilities) -> number|null
nearestRank(values, q) -> number|null
spawnCall(file, args, stdinText, env, timeoutMs) -> Promise<{code, stdout, stderr, wallMs, timedOut}>
createCallLog(outDir) -> {append(record)}
which(name, env) -> string|null
deemCommand(env) -> string[]                        # PATH `cli-deem`, else the repo copy under node
readDeemHealth(cmd, env) -> {ok:true, backend, model, modelCommit, sourceCommit} | {ok:false, reason, found}
deemGate(ctx) -> {passed, cmd, reason?}
jevGate(ctx) -> {passed, path, provider, reason?}
runDeemArm(plan, gate, ctx) -> Promise<{column}|{stopped, partialRows}>
runJevArm(plan, gate, ctx) -> Promise<{column}|{stopped, partialRows}>
readStoredReport(outDir) -> object|null
buildReport(input) -> object
main(argv, deps) -> Promise<0|2>                    # deps: repoRoot, out, err, env, timeoutMs, backoffMs
```

Behavior rules that are not obvious from the signatures:

- `extractCitations`: `CITATION_RE = /(?<![\w./-])([A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?/g` over prose only; a line inside a fenced block (a ```` ``` ```` or `~~~` fence toggled per file) is skipped. `sentence` is the trimmed source line; `claim_sha12` is `sha256Hex(sentence).slice(0,12)`.
- `resolveCitation`, in order, against `tracked` only: the citing file's own folder, the repository root, the skill root (`.skilled/skills/<skill>` of the citing doc), then a unique basename across `tracked`. Zero candidates -> `unresolved`; more than one by basename -> `ambiguous`; a basename starting `.env`, or a path outside `tracked` -> `refused`, never opened; a tracked path absent on disk -> `missing`; `targetLineEnd` past the file's last line -> `past_end`; else `in_range`.
- `buildCensus` reads each tracked `.skilled/skills/**/*.md` through `git show HEAD:<path>` (never the worktree) and returns per-skill counts, the totals, the `dead` list (`missing` + `past_end`) and the `refused` count.
- `drawRows` samples 20 `in_range` citations across skills (skills sorted, one pick per skill per pass, seeded `mulberry32(seed)`) and builds 20 more from 20 further citations: the window centre is the cited line + 60 wrapped into `[1, L]`, the wrapped gap from the cited line must be at least 20, and a file with fewer than 80 lines is skipped and the next candidate taken. Live rows carry `verdict` and `labeler` null; constructed rows carry `verdict: contradicts` and `labeler: construction`. `window_sha12` is `sha256Hex(windowText).slice(0,12)`.
- `identifierTokens`: every backticked span in the sentence, split on `[^A-Za-z0-9_]+`, tokens of two or more characters, with the target's own basename removed.
- `flagByIdentifierOverlap`: true only when the token set is non-empty and no token appears in the window text (the cited line - 10 to + 10, clamped).
- Labels map `supports` -> clean, `partial` and `contradicts` -> drifted. `baselineMethod` is the comparator right on more labeled rows, `flag-nothing` on a tie.
- `decideVerdict` checks five conditions in order and prints the first that fails: coverage `10*M >= 9*K`; precision `TP+FP >= 1 && 5*TP >= 4*(TP+FP)`; margin `10*(A-B) >= M`; sign test `binomialTail(W, W+L).below`; stability, for Jev `10*F <= 3*M`, for Deem always true with `flips: not applicable (deem noul)`.
- `runDeemArm`: one `noul` per labeled non-dead row, state `JSON.stringify({sentence, target, window})` on stdin, closed after writing, `-q INSTRUCTION`; the modal flag over the reruns is not needed (one call). Exits: 1 or HTTP 400 -> `unmeasured`; 2 -> stop `usage error`; 3 -> stop `backend refused`; 4 -> one health recheck, then `model commit changed mid-run` or `server gone`; 130 -> stop `interrupted`. Answer read at `answers.answer.noul`.
- `runJevArm`: `jev auth test --provider P` once, then 3 `noul` calls per row with no cache, `--provider P` on every call; `model` comes from the auth-test JSON. Exits: 1 or a malformed answer -> `unmeasured`; 2 -> stop `usage error`; 3 after the gate -> stop `key rejected`; 4 -> one retry after `BACKOFF_MS`; a spawn past `CALL_TIMEOUT_MS` -> `unmeasured_timeout`; 130 -> stop `interrupted`.
- `main`: zero calls, zero writes and zero file reads beyond the labels file unless `--jev`/`--deem` is set; `--draw` never reads the census beyond the draw; a failed gate leaves every earlier line byte-identical and exits 0.

### 2.5 Constants

`SCRIPT_DIR`, `REPO_ROOT` (five levels up), `SKILL_ROOT`, `LABELS_PATH`, `CITATION_RE`, `FENCE_RE`, `LABEL_GATE = 40`, `LIVE_ROWS = 20`, `CONSTRUCTED_ROWS = 20`, `CONSTRUCT_OFFSET_LINES = 60`, `CONSTRUCT_MIN_GAP_LINES = 20`, `CONSTRUCT_MIN_FILE_LINES = 80`, `WINDOW_RADIUS_LINES = 10`, `FLAG_THRESHOLD = 0.5`, `MARGIN_LINE`, `KEEP_RULE_LINE`, `USAGE`, `INSTRUCTION = 'Does the cited code window still show what the citing sentence claims?'`, `JEV_VERSION = 'jev 0.6.2'`, `JEV_RERUNS = 3`, `CALL_TIMEOUT_MS = 90000`, `BACKOFF_MS = 2000`, `DEEM_MODEL = 'deem-0.8-v1'`, `DEEM_P50_MS = 60.5`, `HEALTH_TIMEOUT_MS = 10000`. No key literal and no key variable name anywhere; the words `API_KEY`, `TYPESAFE`, `Bearer` and `Authorization` appear in no comment, string or identifier.

## 3. Test cases

Fixture: a temp git repository with two skill folders, docs holding in-range, past-end, ambiguous, fenced and `.env` citations, plus stub `jev` and `cli-deem` binaries that log one line per call (the sibling's `stubMain` shape). One line per case: `name | input | expected`.

| name | input | expected |
|---|---|---|
| extract prose | a doc with `` `src/a.ts:12` `` in prose | one citation, target `src/a.ts`, line 12 |
| extract fenced skip | the same text inside a fence | zero citations |
| resolve order | a target present beside the citing doc and at the repo root | the citing folder's copy wins |
| resolve ambiguous basename | two tracked files share a basename | status `ambiguous` |
| resolve unresolved | a path in no candidate | status `unresolved` |
| dead missing target | a tracked path absent on disk | status `missing`, one `cite dead:` line |
| dead past end | `target:999` on a 10-line file | status `past_end`, one `cite dead:` line |
| refused `.env` | a citation whose basename starts `.env` | status `refused`, never opened |
| refused untracked | a citation outside `git ls-files` | status `refused`, counted |
| comparator flags | a sentence whose token is absent from the window | flagged |
| comparator no token | a sentence with no backticked code token | not flagged |
| comparator token present | the token appears in the window | not flagged |
| draw reproducible | `--draw --seed 1` twice into two paths | byte-identical, 40 rows, no text field |
| draw refuses labels | a file holding a `labeler: operator` row | exit 2, file unchanged |
| label gate 39 | 39 labeled rows | `stop: fewer than 40 labeled rows`, zero calls |
| instruction printed | a 40-row labeled file with headroom | one `instruction:` line carrying the fixed `-q` text and its SHA-256, before any call |
| default zero calls | the default run, stubs first on `PATH` | exit 0, both stub logs empty, no file written |
| deem gate pass | stub health `torch` / `deem-0.8-v1` | `deem: health ...` then the arm |
| deem stub backend | stub health exit 3 with `stub` | `deem arm skipped: stub backend`, exit 0, earlier lines byte-identical |
| deem exit 4 changed pair | a call exits 4, the recheck returns a new pair | `deem arm stopped: model commit changed mid-run` |
| jev gate pass | stub `--version` `jev 0.6.2`, `auth status` exit 0 | identity line then the arm |
| jev no credential | stub `auth status` exit 3 | identity line then `jev arm skipped: no credential`, exit 0 |
| jev one provider | a passing stub, 3 reruns over one row | every stub `jev` call after `--version` carries `--provider official` |
| jev exit 3 after gate | a stub that exits 3 on `noul` | `jev arm stopped: key rejected`, no verdict |
| `--out` required | `--jev` without `--out` | exit 2, no call, no file |
| verdict keep | all five conditions met | `verdict deem: keep` |
| verdict kill precision | `TP+FP >= 1` and `5*TP < 4*(TP+FP)` | `kill (precision)` |
| verdict stop coverage | 2 of 10 rows unmeasured | `stop (coverage)` |
| verdict stop margin | `10*(A-B) < M` | `stop (margin)` |
| verdict requalify | a stored report with a different Deem pair | `requalify: model commit changed` before the verdict |
| no headroom | baseline right on 19 of 20 | `no headroom`, no call |
| underpowered | baseline wrong on 4 rows | `underpowered: winnable=4`, no call |

Both arms are driven by stubs only; no case touches a live backend or the network.

## 4. Build steps

Order note: the verdict functions (plan step 6) land before the arms (plan step 5), because each arm prints its column's verdict line; the plan's own checks are unchanged. Steps 1 and 9 to 11 are the session's; every other step is one change for one executor.

1. **Baseline (session).** Record `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs`, output and exit code, before any change.
2. **Census, dead check, refusal (Devin).** Create `cite-drift-scan.mjs` sections 1-2: constants, `sha256Hex`, `headCommit`, `listTrackedFiles`, `extractCitations`, `resolveCitation`, `buildCensus`, plus the `main()` skeleton that prints the census lines and returns 0. In the new `test-cite-drift-scan.mjs`: the fixture builder (temp git repo, two skills, stub bins) and the cases `extract prose`, `extract fenced skip`, `resolve order`, `resolve ambiguous basename`, `resolve unresolved`, `dead missing target`, `dead past end`, `refused .env`, `refused untracked`. Check: those cases pass.
3. **Draw (Devin).** Add `drawRows`, `parseLabels`, `labelCounts` and the `--draw`/`--seed` switch handling to the same two files, with cases `draw reproducible`, `draw refuses labels`. Check: both pass and two same-seed draws are byte-identical.
4. **Comparators, label gate, summary (Devin).** Add `identifierTokens`, `flagByIdentifierOverlap`, `scoreComparators`, `summaryLines`, `MARGIN_LINE`, `KEEP_RULE_LINE`, `INSTRUCTION` and the `instruction:` line, with cases `comparator flags`, `comparator no token`, `comparator token present`, `label gate 39`, `instruction printed`, `no headroom`, `underpowered`, `default zero calls`. Check: all pass and the default run spawns nothing.
5. **Keep rule and verdict (Devin).** Add `binomialTail`, `decideVerdict`, `verdictLine`, `brierScore`, `nearestRank`, with cases `verdict keep`, `verdict kill precision`, `verdict stop coverage`, `verdict stop margin`, `verdict requalify`. Check: all pass.
6. **Deem gate and arm (Devin).** Add `which`, `deemCommand`, `readDeemHealth`, `deemGate`, `spawnCall`, `createCallLog`, `runDeemArm`, `readStoredReport`, `buildReport` and the `--deem`/`--out` handling, with cases `deem gate pass`, `deem stub backend`, `deem exit 4 changed pair`, `--out` required. Check: all pass and the `report.json` keys match 2.3.
7. **Jev gate and arm (Devin).** Add `jevGate`, `runJevArm` and the `--jev` handling, with cases `jev gate pass`, `jev no credential`, `jev one provider`, `jev exit 3 after gate`. Check: all pass.
8. **README rows (Pi, one doc each).** `shared/scripts/README.md`: two rows in the section 2 table after the `frontmatter-version.mjs` row (`:23`), modelled on that row — `cite-drift-scan.mjs` (what it does, the zero-call default, `--jev`/`--deem`) and `cite-drift-labels.jsonl` (the 40-row sample). `scripts/tests/README.md`: one row in the section 4 table after `test-frontmatter-version.mjs` (`:73`), modelled on that row. Mode for both: `sk-create-readme`. Check: `validate_document.py --type readme` exits 0 on each.
9. **Label gate and runs (session + operator).** `--draw --seed <n>` on the real tree, commit the drawn file, the operator labels the 20 live rows (no model writes a label). Then one zero-call run, then, unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes; each verdict or skip line, with p50, p95 and what it was measured on, goes into `goal.md`'s log.
10. **Skill docs (Pi, one doc each).** Each states the script, its zero-call default and both switches, and names no verdict; they are written even if the phase holds at the label gate. In order:
    - `SKILL.md`, mode `sk-create-skill` (hub variant): one sentence in the section 3 "Shared backbone" paragraph (`:154`), modelled on that paragraph.
    - `.hermes/skills/sk-doc/SKILL.md`: regenerate with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, not authored.
    - `README.md`, mode `sk-create-readme`: one row in the section 8 checks table (`:187-192`), modelled on the `README structure` row.
    - `changelog/v2.2.3.0.md`, mode `sk-create-changelog` (global, patch bump from the newest `v2.2.2.0.md`; re-derive at build), modelled on `changelog/v2.2.2.0.md`: the six frontmatter fields, the narrative opening, at-a-glance bullets, upgrade note.
    - `feature-catalog/document-validation/citation-drift-scan.md`, mode `sk-create-feature-catalog`, modelled on `document-validation/goal-criteria-lint.md`: sections 1 to 4, `title: "Citation Drift Scan"`, the SOURCE FILES tables (implementation: the script and the labels file; validation: the test as `Node test` and the playbook scenario as `Manual playbook`).
    - `feature-catalog/feature-catalog.md`, same mode: one H3 block in section 4, modelled on the `Goal Criteria Lint` block (`:98-106`) — the H3 title must equal the leaf's `title`, and its `#### Description` paragraph must normalize-equal the leaf's `description`.
    - `manual-testing-playbook/document-validation/citation-drift-scan.md`, mode `sk-create-manual-testing-playbook`, modelled on `sk-create-goal/manual-testing-playbook/goal-authoring/lint-goal-criteria.md`: sections 1 to 5, `SD-021`, the zero-call run and a stub-backend skip, no `stage:` or `expected_*` fields.
    - `manual-testing-playbook/manual-testing-playbook.md`, same mode: one category row and one scenario row, modelled on the existing tables.
    Check: `validate_document.py` exits 0 on each changed doc.
11. **Verification, review, commit (session).** Run the proof plan in section 5, the sk-doc suite against step 1's baseline, a cross-family review of the script and test, then path-scoped commits. The pre-commit hook re-mints and stages the hub's compiled-route manifest when `SKILL.md` is staged; that regenerated file is expected and is not hand-edited.

## 5. Proof plan

| Criterion (this phase's `goal.md`) | Command | Expected |
|---|---|---|
| The default run exits 0 and prints the census and dead count, and stubs log zero calls | `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` with the stub bins first on `PATH` | exit 0; `citations=` and `dead=` lines; `stop: fewer than 40 labeled rows` (or `baseline:` plus `headroom:` once labeled); both stub logs empty; `git status --porcelain` unchanged |
| The two skip lines, each exit 0, other output byte-identical | the same run with `--deem --out <tmp>` and a stub health reporting `stub`; then with `--jev --out <tmp>` and a stub `auth status --provider official` exiting 3 | `deem arm skipped: stub backend`; the `jev: path=... provider=official` line then `jev arm skipped: no credential`; each exit 0; `diff` against the default run shows only those lines |
| The test file exits 0 with at least 18 passed and 0 failed | `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | exit 0, `# fail 0`, `# pass` at least 18 |
| One verdict line per backend whose gate passed, with per-call records; or `no headroom`/`underpowered` | after the operator's labels: `--jev --out <dir>` and `--deem --out <dir>` | one `verdict <backend>:` line per column that ran; every `calls.jsonl` line carries `wallMs` and `exitCode`, Deem lines `modelCommit` and `sourceCommit`, Jev lines `provider` and `model`; or the zero-call run printed `no headroom` or `underpowered` |
| No key grep match, no workspace change, docs valid | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script; `git status --porcelain` before and after each run; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc> --type <readme\|skill\|changelog\|asset>` per changed doc | no match; identical status apart from the report directory; exit 0 per doc |
| Spec validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan --strict` | `RESULT: PASSED` |

The label gate stop line is an accepted end state for criterion 4, per parent D4.

## 6. Open questions

| Open | Answer |
|---|---|
| Which playbook category | `document-validation/`, mirroring the feature-catalog group (proposed) |
| The scenario sits inside a routing-gold root (`.skilled/skills/sk-doc/manual-testing-playbook` is listed in `playbook-corpus-manifest.json`) | It carries no `stage:` or `expected_*` fields, so `validate-playbook-topology.cjs` reports it `unenrolled` -> SKIP and `validate-playbook-package.cjs` excludes the whole root from the operator contract; both stay exit 0. Accepted (proposed) |
| The hub playbook root says "no mocks, no stubs" | That policy binds routing scenarios; the stub step here is a `PATH` stub that refuses at the Deem gate, not a mocked model. The scenario says so in its own note; the root line stays (proposed) |
| Files too short for the 60-line offset | A candidate whose file has fewer than 80 lines is skipped and the next taken (proposed) |
| Which `labeler` value the operator's rows carry | `operator` (proposed); any non-null value blocks `--draw` from overwriting |
| The plan's steps 5 and 6 | Verdict functions before the arms; the plan's checks unchanged (proposed, stated in section 4) |
| `--draw`'s stdout line and the `--out` refusal wording | As in 2.2 and 2.1 (proposed) |
| The next changelog version | `v2.2.3.0.md`, a patch bump from `v2.2.2.0`; the build re-derives it and increments the build segment if the file exists (proposed) |
| `scripts/tests/README.md` says `Code files \| 8`, and `check_derived_readme_counts.py` already fails on both READMEs today | Pre-existing; the two rows are added and the stale statistic is left alone, recorded as a finding for the parent log (proposed) |
