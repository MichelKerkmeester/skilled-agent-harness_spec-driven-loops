# Build design: leaf-route-replay

Script: `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` (proposed name).
Test: `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` (proposed).
Code route: sk-code OpenCode (`sk-code-opencode`). Docs route: sk-doc (parent D6). Sibling pattern for gates, keep rule, verdict line and tests: `scripts/score-clarify-default.cjs` (1566 lines) and `scripts/tests/score-clarify-default.test.cjs` (646 lines), both shipped in the same folder.
No code comment may carry a spec path, phase number or REQ id (comment hygiene).

## 1. Premises

Every `file:line` the spec cites, checked in today's tree:

| Cited | Check | State |
|---|---|---|
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:87-92` | `normalizeTargets` at 87, returns destinations | ok |
| `sk-doc/ROUTER.md:154-400` | python block, `INTENT_SIGNALS` 155, `RESOURCE_MAP` 176 | ok |
| `sk-code/ROUTER.md:316-597` | python block, 326 / 351 | ok |
| `mcp-tooling/ROUTER.md:89-144` | python block, 94 / 106 | ok |
| `cli-external-orchestration/ROUTER.md:88-133` | python block, 93 / 103 | ok |
| `system-deep-loop/ROUTER.md:66-105` | python block, 71 / 79 | ok |
| `sk-design/ROUTER.md:57-97` | python block, 63 / 71 | ok |
| `cli-classifier/ROUTER.md:45-55` | `stage1-only`, `INTENT_SIGNALS = {}` 52, `RESOURCE_MAP = {}` 54 | ok |
| `sk-doc:149`, `sk-design:52`, `mcp-tooling:84`, `system-deep-loop:61`, `cli-external-orchestration:83`, `cli-classifier:43`, `sk-code:608` | "router-replay parses" / "replay enforces" sentences | ok |
| `sk-doc/ROUTER.md:150-152` | path dual-read sentence | ok |
| `leaf-resource-contract.cjs:279` | `dualReadLegacyResource`; `:166` `compositeKey` | ok |
| `root-router-contract.cjs:139` | `extractDictBody`; `:263` `parseResourceMap` | ok |
| `validate-compiled-routing-scenarios.cjs:170-196` | `parseScenario` (170), returns `leafPairs` (191), `prompt` (193); `:304` `walkScenarioFiles` | ok |
| retired `b45ea54cea3^:.opencode/.../skill-benchmark/router-replay.cjs` | present via `git show` (741 lines); `:38` `AMBIGUITY_DELTA = 1`; `:449-463` `WORD_BOUNDARY_KEYWORDS` + `keywordHits`; `:465-476` `scoreIntents`; `:485-489` `selectIntents` | ok |

Numbers and seams checked today:

- Gold recount with the shipped parser (`walkScenarioFiles` + `parseScenario`): 56 rows with non-empty `leafPairs` and a prompt — sk-doc 25, mcp-tooling 15, system-deep-loop 6, cli-external-orchestration 5, sk-design 4, sk-code 1; cli-classifier 0. Matches the spec's 2026-09-29 count.
- Only `sk-doc` ships `leaf-manifest.json` and `leaf-aliases.json`; the other six hubs ship neither (checked). Shared-prefixed paths in those hubs resolve only through `mode-registry.json` packets, so unresolvable paths must be counted, not dropped.
- Each hub's `mode-registry.json` modes carry `workflowMode` + `packet` (sk-doc has 15; `sk-create-skill-parent` shares packet `sk-create-skill`).
- `cli-deem` repo copy exists at `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs`.
- 020 shipped `changelog/v1.4.0.0.md` (newest) and `SKILL.md` `version: 1.4.0.0`; the next changelog is `v1.5.0.0.md`.
- `validate_document.py` exists at `.skilled/skills/sk-doc/scripts/validate_document.py` with `--type skill|readme|changelog|playbook|playbook_feature|feature_catalog`.

## 2. Interface

### CLI switches and exit codes

| Switch | Rule | Exit |
|---|---|---|
| `--report <dir>` | optional; writes `<dir>/report.json` | 0 |
| `--transcripts <dir>` | optional; must be an existing directory, else `error:` line, exit 2 before other output | 2 |
| `--prose <file>` | optional; must be a readable file, else exit 2 before other output (proposed) | 2 |
| `--jev` / `--deem` | boolean; dormant without their gate | 0 |
| `--out <dir>` | required when `--jev` or `--deem` is set; missing prints `error: --jev and --deem need --out <dir>`, exit 2 before any output | 2 |
| unknown arg / missing value | `error:` + `USAGE`, exit 2 (sibling) | 2 |

Exit 0 covers every normal run, every skip line and every stop. `main(argv, deps)` returns the code; `require.main === module` sets `process.exitCode` (sibling shape).

### stdout lines

Fixed by the spec (quote exactly):
- `router reads: not measured` without `--transcripts`.
- `no headroom` (prints instead of running any gate; exit 0).
- `margin: 0.10` and one `keep rule:` line before any call.
- `jev: path=<path|none> provider=<P>` identity line, then `jev arm skipped: jev not on PATH` | `jev arm skipped: version` (+ `jev: found="<v>" path=<p>` details line) | `jev arm skipped: no credential`.
- `deem arm skipped: not reachable` | `stub backend` | `model` | `bad health response` (+ `deem: found="<x>"` details line on the last two).
- `replay verdict: keep` | `replay verdict: drop` | `replay verdict: stop (prose arm covers <P> of <N> rows)`, and the same line always ends with ` N=<N> P=<P> keyword_f1=<x|n/a> prose_f1=<y|n/a>`.
- `surface slice not replayed` for sk-code; `stage1-only` for cli-classifier.
- Verdict line: `verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<K> M=<M> SA=<SA> SB=<SB> W=<W> L=<L> F=<F> p=<p> baseline=<union|first>`, then Deem `model=<m> model_commit=<c> source_commit=<c>` or Jev `jev_version=<v> provider=<P> model=<m>`. Also written into `report.json`.
- `A stopped arm prints finished rows `partial` and no verdict` → `jev: partial_rows=<n>` / `deem: partial_rows=<n>` after the stop line.

Proposed formats (sibling shape; mark `(proposed)` in code comments only where the spec is silent):
- Per hub: `hub=<id> gold=<g> unscored=<u> unknown=<n> unresolvable=<r> tied=<t> precision=<p> recall=<p> f1=<f> exact=<e>`; `hub=cli-classifier stage1-only`; `hub=sk-code gold=1 unscored=1 surface slice not replayed` (its gold row is counted unscored, never scored).
- Totals: `total gold=56 scored=<n> tied=<t> mean_f1=<f> exact=<e>`. Means print `toPrecision(4)` (sibling `formatP`).
- Recount with the flag: `router reads: files=<F> reads=<R> bytes=<B>` then one `router read hub=<id> week=<YYYY-Www> reads=<r> bytes=<b>` per bucket, `week=unknown` when the line has no timestamp.
- Arms: `tied: K=<K>`; `baseline: <union|first>`; `keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(SA-SB) >= M, sign test p < 0.05, flips 10*F <= 3*M`; `instruction: -q "Which intent does this request need?"`.
- Jev payload line: `jev: payload=committed playbook prompts, intent keys and RESOURCE_MAP paths planned_calls=<3K+1> est_input_tokens=<ceil(chars/4)>`; then `jev: auth_test provider=<P> model=<m>`.
- Deem payload line: `deem: nothing leaves the machine planned_calls=<3K> est_wall_s=<(3K*DEEM_P50_MS/1000).toFixed(1)>`; health line `deem: health backend=<b> model=<m> model_commit=<c> source_commit=<c>`.

### Files written

- `<report dir>/report.json` (only with `--report`): per-hub rows, totals, the router-read count, the replay verdict, and `columns.{jev,deem}` verdict lines when the arms ran.
- `<out dir>/calls.jsonl` (only with a switch): one JSON line per spawn, fields `kind` (`auth_test`|`choice`), `backend`, `row_id`, `order`, `wall_ms`, `exit_code`, `pick`, `pick_prob`, `status` (`measured`|`unmeasured`|`unmeasured_timeout`), plus Deem `model`/`model_commit`/`source_commit` or Jev `jev_version`/`provider`/`model` (sibling record shape).
- `<out dir>/report.json` when `--report` is absent (proposed). Nothing else is written; no router, map, manifest or playbook is touched.

### Constants

`NONE_KEY = 'none_of_these'`; `AMBIGUITY_DELTA = 1`; `WORD_BOUNDARY_KEYWORDS = ['review','lcp','inp','cls']`; `HEADROOM_MIN_IMPROVABLE = 5` (fewer improvable tied rows → `no headroom`); coverage ratios `10*P >= 9*N` and `10*M >= 9*K`; margin `10*(SA-SB) >= M`; flips `10*F <= 3*M`; `MARGIN_LINE = 'margin: 0.10'`; `CHOICE_INSTRUCTION = 'Which intent does this request need?'`; `NONE_DESCRIPTION = 'None of these alone'`; `ORDERS = 3`; `JEV_VERSION = 'jev 0.6.2'`; `DEEM_MODEL = 'deem-0.8-v1'`; `HEALTH_TIMEOUT_MS = 2000`; `JEV_TIMEOUT_MS = 90000` (a spawn past it is `unmeasured_timeout`); `DEEM_TIMEOUT_MS = 90000`; `BACKOFF_MS = 2000`; `DEEM_P50_MS = 65.6`; `REPO_CLI_DEEM = '.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs'`. No 30-row label gate applies to this phase; its gates are headroom, coverage and the keep rule.

### Exported functions

Ported from the retired replay (same names and behavior; `git show` source only, no restore):
- `keywordHits(taskLower, kw)` → boolean; word-boundary regex for the four keywords, substring otherwise.
- `scoreIntents(taskLower, intents)` → `[{intent, score}]` desc; weight per hit; zero-score intents dropped.
- `selectIntents(scores)` → kept intent keys within `AMBIGUITY_DELTA` of the top; `[]` on no hit (`UNKNOWN`).

Parsing, conversion and scoring:
- `parseRouter(text)` → `{ state, intents, resourceMap, intentOrder }`; `router_state` from frontmatter, `INTENT_SIGNALS`/`RESOURCE_MAP` via `rootRouter.extractDictBody` + a quoted-key/list entry grammar (follows `parseResourceMap`); `intentOrder` is declaration order.
- `loadHubModes(repoRoot, hub)` → `[{workflowMode, packet}]` from `mode-registry.json`; `[]` on a read/parse failure.
- `loadAliasEntries(repoRoot, hub)` → array from `leaf-aliases.json`, `[]` when absent.
- `toPairs(paths, modes, aliases)` → `{ pairs, unresolvable }`; each path through `contract.dualReadLegacyResource`, pair key via `contract.compositeKey`.
- `loadGold(repoRoot, hub)` → `[{ id, prompt, pairs }]` via `scenarios.walkScenarioFiles` + `parseScenario`; rows with no prompt or empty `leafPairs` counted unscored.
- `scoreRow(predKeys, goldKeys)` → `{ precision, recall, f1, exact }` on composite-key sets; empty prediction scores 0.
- `runReplay(hubs, repoRoot)` → per-hub `{ gold, unscored, unknown, unresolvable, tied, precision, recall, f1, exact }` plus the sk-code and cli-classifier markers.

Recount, prose and the replay verdict:
- `countRouterReads(dir)` → `{ files, reads, bytes, byHubWeek }`; recursive sorted walk, one count per transcript line matching an escaped `"Read"` tool name with a `file_path` ending `ROUTER.md` (sibling's line-scan style); bytes from the paired `tool_result` found by `tool_use_id` (its `content` string length), 0 when unpaired; week from the line's timestamp, `unknown` otherwise; counts and bytes only, never text.
- `routerReadLines(count)` → the `router reads:` and per-bucket lines.
- `readProse(file)` → `Map<id, Set<compositeKey>>` + an unparsed-line count; each line is `<scenario id> <workflowMode>:<leafResourceId> [...]` (proposed).
- `replayVerdict(rows, prose)` → `{ outcome: 'keep'|'drop'|'stop', reason, N, P, keywordF1, proseF1, line }`; N = gold rows the keyword arm scored, P = those rows the prose file covers; coverage `10*P >= 9*N`, else the stop; otherwise compare the keyword arm's mean F1 on the P rows with the prose arm's mean F1 on the same rows (both `n/a` at P=0), `drop` below, else `keep`.

Arms and verdict (sibling shape, adapted to F1 sums):
- `which(name, env)`, `jevGate(ctx)`, `deemCommand(env, repoRoot)`, `readDeemHealth(cmd, env)`, `deemGate(ctx)` — byte-for-byte sibling behavior and line text; the arm ordering differs (below).
- `spawnCall(file, args, stdinText, env, timeoutMs)`, `writeCall(outDir, record)`, `rotations(keys)`, `optionArgs(keys, texts)`, `judgeChoice(result, keys)` — sibling.
- `intentTexts(router, keys)` → key → `RESOURCE_MAP` paths joined by commas; `none_of_these` → `NONE_DESCRIPTION` (proposed; two identical texts each gain their key, as the sibling's `describeModes` does).
- `chooseBaseline(rows)` → `{ choice: 'union'|'first', baseKeys: Map<id, Set<key>>, baseF1: Map<id, number> }`; the better F1 sum over K rows of the union and of the first tied intent in `intentOrder`; a tie goes to the union; the choice prints.
- `improvableCount(baseF1)` → rows with baseline F1 < 1.
- `tailP(n, k)`, `modalPick(answers)`, `decideVerdict({K,M,SA,SB,W,L,F})`, `formatP(p)`, `verdictLine(backend, counts, decision, suffix)` — sibling; `decideVerdict` checks coverage, kill (`P(X>=L) <= 0.05`), margin, sign test (`P(X>=W) < 0.05`, p=1 when W+L=0), flips, else keep.
- `runJevArm(rows, baseline, gate, ctx)` / `runDeemArm(rows, baseline, gate, ctx)` — three rotated `choice` calls per tied row; a pick of `none_of_these` or an `unstable` row keeps the union; per row `A`/`B` become the column's and the baseline's F1, W/L count rows higher/lower, `F += ORDERS - top`; exits follow 002's handling (Jev: 4 retried once after `BACKOFF_MS`, 2 `usage error`, 3 `key rejected`, 130 `interrupted`; Deem: 4 rechecks health then retries once, stops on `server gone` / `model commit changed mid-run`, 2 `usage error`, 3 `backend refused`, 130 `interrupted`); every spawn reaches `calls.jsonl` before a stop.
- `parseArgs(argv)`, `main(argv, deps)` — sibling; `main` order: parse → `--out` check → report lines → reads line → replay verdict → with a switch: `tied:`, `baseline:`, `margin:`, `keep rule:`, headroom → Jev gate/arm → Deem gate/arm. A failed Jev gate prints its skip line and never starts the Deem gate or arm (spec: a failed gate never starts the other backend).

## 3. Test cases

File: `scripts/tests/leaf-route-replay.test.cjs`, `node --test`, CommonJS, stubs written to a temp dir and put first on `PATH` (sibling helpers). One line per case: `name | input | expected`.

1. parseRouter reads an active block | synthetic `router_state: active` text with two intents and a map | `state='active'`, intents in declaration order, map lists intact
2. parseRouter reports a stage1-only block | `router_state: stage1-only`, `INTENT_SIGNALS = {}`, `RESOURCE_MAP = {}` | `state='stage1-only'`, both maps empty
3. keywordHits guards the four keywords | `preview`/`review`, `input`/`inp`, `2_javascript`/`javascript` | false, false, true
4. scoreIntents weights and sorts | A w4 one hit, B w2 two hits | `[{A,4},{B,4}]`
5. selectIntents keeps one point apart | scores A4 B3 / A4 B2 | `[A,B]` / `[A]`
6. selectIntents returns UNKNOWN | no hit | `[]`, row `UNKNOWN`, empty leaf set
7. toPairs resolves packet-qualified and alias paths | synthetic modes + aliases | two typed pairs, correct composite keys
8. toPairs counts an unresolvable path | `other/references/x.md` | `unresolvable: ['other/references/x.md']`
9. scoreRow partial set | pred 2 of gold 3 | precision 1, recall 0.6667, f1 0.8, exact false
10. scoreRow empty prediction | pred `[]`, gold 2 | precision 0, recall 0, f1 0, exact false
11. scoreRow exact match | equal sets | f1 1, exact true
12. countRouterReads finds one read | synthetic transcript line, Read on `.../ROUTER.md` + paired result | reads 1, bytes = result length, week `2026-W40`
13. countRouterReads prints no text | same dir | lines carry counts only, no transcript text
14. replayVerdict keeps | N=10, P=10, keyword mean >= prose mean | `replay verdict: keep N=10 P=10 ...`
15. replayVerdict drops | keyword mean < prose mean | `replay verdict: drop ...`
16. replayVerdict stops on coverage | P=0 of 10 / P=8 of 10 | `stop (prose arm covers 0 of 10 rows)` / `(8 of 10)`
17. no headroom at 4 improvable rows | K=5, 4 rows baseline F1 < 1 | `no headroom`, no gate line, stub log empty
18. headroom at 5 improvable rows | K=5, 5 rows baseline F1 < 1 | no `no headroom`; gates run
19. chooseBaseline prints the better arm | union sum > first sum, then a tie | `baseline: union`; tie also union
20. decideVerdict order | count sets for each arm | `keep`, `kill`, `stop (coverage)`, `stop (margin)`, `stop (sign test)`, `stop (flips)`
21. deem stub answering the gold keeps | 5 improvable tied rows, stub answers the gold intent | `verdict deem: keep K=5 M=5 ...`, `calls.jsonl` 15 lines
22. deem stub abstaining stops on margin | stub answers `none_of_these` | `verdict deem: stop (margin)`
23. a stub deem backend skips | health backend `stub` | `deem arm skipped: stub backend`, rest byte-identical, exit 0
24. a jev without a credential skips | `auth status` exit 3 | identity line then `jev arm skipped: no credential`, exit 0
25. jev off PATH and wrong version skip | no jev / `jev 0.5.0` | `jev not on PATH` / `version` + details line
26. a switch without --out exits 2 | `--deem` | exit 2, stdout empty
27. a stopped jev arm prints partial | stub choice exit 3 | `jev arm stopped: key rejected`, `jev: partial_rows=0`, no `verdict jev:`
28. without the flag the reads line prints not measured | run without `--transcripts` | `router reads: not measured`

## 4. Build steps

1. Setup (orchestrator): record `node --test` pass/fail on `scripts/tests/` as the baseline; recover the retired replay with `git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` to a scratch file outside the repository, read only; confirm 020's build is not running.
2. Devin — parser and keyword arm in `leaf-route-replay.cjs`: banner, `'use strict'`, imports (`node:child_process`, `crypto` if needed, `fs`, `path`, `./lib/root-router-contract.cjs`, `./lib/leaf-resource-contract.cjs`, `./validate-compiled-routing-scenarios.cjs`), constants block, `parseRouter`, `keywordHits`, `scoreIntents`, `selectIntents`; test cases 1-6 in the test file.
3. Devin — conversion, gold loader, scorer and report in the script: `loadHubModes`, `loadAliasEntries`, `toPairs`, `loadGold`, `scoreRow`, `runReplay`, the per-hub/total lines; test cases 7-11.
4. Devin — recount: `countRouterReads`, `routerReadLines`, the `router reads:` line and the `--transcripts` exit 2; test cases 12-13, 28.
5. Devin — replay verdict: `readProse`, `replayVerdict`, the `--prose` exit 2; test cases 14-16.
6. Devin — gates, arms and column verdict: `which`, `jevGate`, `deemCommand`, `readDeemHealth`, `deemGate`, `spawnCall`, `writeCall`, `rotations`, `optionArgs`, `judgeChoice`, `intentTexts`, `chooseBaseline`, `improvableCount`, `tailP`, `modalPick`, `decideVerdict`, `formatP`, `verdictLine`, `runJevArm`, `runDeemArm`, `parseArgs`, `main`, `module.exports`; test cases 17-27.
7. Orchestrator — run the zero-call replay on the real tree with stub `jev`/`cli-deem` first on `PATH` (`--report <dir>`); confirm 56 gold rows, `stage1-only`, `surface slice not replayed`, empty stub logs, and record the numbers and the replay verdict line in `goal.md`'s log.
8. Pi — `sk-create-skill/SKILL.md` (mode `sk-create-skill`): a `| Leaf-route replay | scripts/leaf-route-replay.cjs | ... |` row in the resources table (after the row at line 81) and a bullet in the resource list (after line 470); bump `version: 1.4.0.0` → `1.5.0.0`. MODEL: the two 020 rows in the same file. Facts: the script replays the ROUTER.md keyword block with zero calls, recounts reads behind `--transcripts`, and breaks ties only behind `--jev`/`--deem`.
9. Pi — `sk-create-skill/README.md` (mode `sk-create-readme`): a `### Replaying Stage-Two Leaf Routes` section after line 98 with the two command lines, a row in the verification table (after line 159) and a row in RELATED DOCUMENTS (after line 175); bump `version: 1.2.0.20` → `1.2.0.21`. MODEL: the `### Measuring Clarify Defaults` section, lines 89-98. Facts: zero-call default, the recount, the prose comparison, both arms dormant behind their gates, a `keep` serves nothing.
10. Pi — `sk-create-skill/changelog/v1.5.0.0.md` (mode `sk-create-changelog`): the next version after the newest entry (v1.4.0.0). MODEL: `changelog/v1.4.0.0.md`. Facts: the new script, the zero-call default, the recount, the prose arm and the replay verdict, the two tie-break arms and the keep rule, no serving.
11. Pi — `sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` (mode `sk-create-manual-testing-playbook`), SKL-008 (proposed), `version: 1.5.0.0`. MODEL: `parent-hub/count-clarify-and-stop-at-the-label-gate.md`. Facts: the exact prompt, the stub setup, the `--report` run, `stage1-only`, `router reads: not measured`, the replay stop line, and that no stub call is logged.
12. Pi — `sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` (same mode): section 8 heading `(SKL-004..SKL-008)`, the SKL-008 block after SKL-007, a row in section 9's test cross-reference, a row in section 10's index, the coverage sentence seven → eight scenarios, the coverage-boundary sentence, `version: 1.2.0.4` → `1.2.0.5`.
13. Pi — `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` (mode `sk-create-feature-catalog`), proposed name and category, `version: 2.2.0.1` (proposed). MODEL: `feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md`. Facts: the keyword arm and its zero-call default, the 56-row committed gold, the recount, the replay rule, the keep rule and the `surface slice not replayed` boundary.
14. Pi — `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` (same mode): a `### Leaf Route Replay` block under `## 2. PACKET ROUTING` (proposed placement; the mode decides), the frontmatter `description`/`last_updated` refresh, and the closing Note listing the new entry.
15. Pi — `sk-create-skill/scripts/README.md` and `sk-create-skill/scripts/tests/README.md` (mode `sk-create-readme`): one table row each, after the `score-clarify-default` rows (scripts README line 32, tests README line 26). MODEL: those rows.
16. Orchestrator — regenerate derived files: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` (write only on drift), `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` (rebuild when stale). The two `.../activation/sk-doc/manifest.json` copies are regenerated by the commit hook; never hand-edit them.

## 5. Proof plan

`S = .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`; `STUB` holds logging `jev`/`cli-deem` stubs; run from the repo root.

| Criterion (phase `goal.md`) | Command | Expected |
|---|---|---|
| 1 zero-call run, exit 0 | `PATH="$STUB:$PATH" node $S --report <dir>` | per-hub `gold=`, `tied=`, `exact=` with mean F1, `router reads: not measured`, `hub=cli-classifier stage1-only`, exit 0, both stub logs empty |
| 2 replay stop line | same run | `replay verdict: stop (prose arm covers 0 of 56 rows) N=56 P=0 ...` |
| 3 tests | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | exit 0, `# pass 28` (>= 18), `# fail 0`, including `verdict deem: keep`, `stop (margin)`, `no headroom` |
| 4 no key, read-only | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S`; `git status --porcelain` before/after criterion 1 | grep exit 1, no output; porcelain identical apart from `<dir>` outputs |
| 5 docs validate | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc> --type <type>` on SKILL.md, README.md, `changelog/v1.5.0.0.md` and the catalog entry | exit 0 (`VALID`) each |
| 6 phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay --strict` | `RESULT: PASSED` |

Accepted end states: the label gate / coverage stop line (`replay verdict: stop (prose arm covers ...)`) is a pass, not a failure; a `drop` or a column `kill` closes a rule and also exits 0.

## 6. Open questions

- `--out` vs `--report` split: the spec fixes only the exit-2 rule. (proposed) `--report` writes `report.json`; `--out` writes `calls.jsonl` and, when `--report` is absent, `report.json`; the operator may pass one directory for both.
- sk-code's gold row: (proposed) counted `unscored` and never scored, so N excludes it and the hub prints `surface slice not replayed` with no F1 fields.
- Feature-catalog placement: the spec calls the name and category proposed; (proposed) keep `packet-authored-registry-routing/leaf-route-replay.md` and let `sk-create-feature-catalog` relocate it if it disagrees.
- Prose line grammar and the transcript read pattern: the spec fixes neither. (proposed) `<id> <workflowMode>:<leafResourceId> ...` per line; one read per transcript line naming a Read on `ROUTER.md`, bytes from the paired `tool_result` by `tool_use_id`, `week=unknown` without a timestamp.
- Jev gate failure with `--jev --deem`: the spec's "a failed gate never starts the other backend" and parent D1's "Jev first, else Deem" read differently. (proposed) follow the phase spec: no Deem gate line and no Deem arm after a failed Jev gate.
- Playbook scenario id and file name: (proposed) `SKL-008`, `parent-hub/replay-stage-two-leaf-routes.md`.
