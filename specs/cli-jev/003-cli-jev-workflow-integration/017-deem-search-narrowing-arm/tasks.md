---
title: "Tasks: Phase 17: deem-search-narrowing-arm"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "track narrowing tasks"
  - "score-track-narrowing tasks"
  - "deem narrowing verification"
  - "track baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: deem-search-narrowing-arm

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Evidence comes from two records. The build record is `scratch/w3-build/build-evidence.md`, with its briefs, logs, baselines and runs beside it, and `W` below is `scratch/w3-build`. The orchestrator session's record holds its host checks, the two cross-family review rounds and the commits. It wins where the two differ, because it reran the gates from the final state. `S` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` and `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`. The build is committed as `f7ae1ff44c`, and the session rebuilt the trigger index from committed content afterwards as `2d101bd6d8`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Phase 010 is Complete (2026-09-27). Rebuild the index to scratch with `generate-trigger-index.mjs --out`, `--manifest`, `--diagnostics` and `--variants` all pointing into scratch, and diff its path set against `runtime/data/trigger-index.json`. Expect 0 missing and an unchanged `git status --porcelain` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Evidence: at HEAD `64968e9b58` the orchestrator rebuilt the index into `W/baseline/` with all four flags pointing there, and the scratch build matched the committed index on its 12,386 indexed paths (`W/baseline/fresh-build.json`, build record section 5). `generate-trigger-index.mjs --check` printed `trigger index matches the corpus` with 23,316 documents, 0 stale (0 missing from the index), 0 obsolete and 0 untrusted (`W/baseline/check.txt`). `git status --porcelain` before and after the rebuild is byte-identical (`cmp` of `W/baseline/status-before-fresh.txt` and `W/baseline/status-after-fresh.txt` exit 0, closure pass)
- [x] T002 Read the owner's contracts before writing: the retrieval `README.md`, `lookup-trigger-index.mjs`, `lib/rg-lane.mjs`, `lib/normalize.mjs`, `measure-cold-lookup.mjs` and `tests/trigger-index.vitest.ts`, and route the code write through sk-code's OpenCode route (`sk-code-opencode`). Record the `cli` vitest project's pass and fail counts as the baseline before any code change (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/`). Evidence: the briefs build on those contracts by name: brief 01 cites `lib/normalize.mjs` and `measure-cold-lookup.mjs`, brief 02 `loadIndex` and brief 03 `lib/rg-lane.mjs` with `pathOnlyRecipe` and `runRecipe`. Every code brief tells its executor to read `.skilled/skills/sk-code/SKILL.md` and follow the route it resolves (`W/briefs/`). Baseline before the first dispatch: `Test Files 156 passed | 3 skipped (159)`, `Tests 1569 passed | 19 skipped (1588)`, exit 0, 7m47s (`W/baseline/cli-vitest.txt`, `W/baseline/cli-vitest.time`)
- [x] T003 [P] Build the vitest fixture corpus: three tracks, packets with clean, placeholder and leaking descriptions, and an index built with the package's `generate()` (`.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`). Evidence: brief 01 (cursor, 450 s) created T, whose `indexFor` builds each fixture index with the package's `generate()` and whose test-set cases cover clean, placeholder and leaking descriptions (focused vitest 3 passed, `W/logs/01.vitest.txt`). Deviation: the entry-point and arm fixtures, `smallCorpus` and `keepCorpus`, hold two tracks, `alpha-track` and `beta`, not three, so a stub model call there carries 3 options, the two tracks plus `none` (closure pass, read of T)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Test-set builder: walk live packet folders, apply the placeholder and multi-word-name leak filters, keep at most 20 rows per track by SHA-256 of the folder path, print kept, placeholder, leak and residual-exposure counts (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`). Evidence: brief 01 (cursor, 450 s), focused vitest 3 passed. On the real tree the zero-call run printed `test set: tracks=16 kept=256 usable=1727 placeholder=67 leak=185 residual=49` and one `track:` line per track, none with `kept` above 20 (`W/runs/zero-call-final/stdout.txt`)
- [x] T005 Lookup baseline: `lookup()` with limit 0, own-folder rows removed, first scoring `specs/` row gives the track, print `manifestHash` (same file). Evidence: brief 02 (cursor, 290 s), focused vitest 5 passed, including "ignores every row inside the question's own folder". The real tree printed `baseline lookup: 17/256 right (0.0664)` and `index manifestHash: fdebd12ad1be...` (build record section 6)
- [x] T006 Ripgrep baseline: path-only recipe over `specs` per distinct 3-plus-character token with a per-token cache, distinct-token file score, tie rule, own-folder exclusion (same file). Evidence: brief 03 (cursor, 211 s), focused vitest 7 passed, including "picks the track of the file matching the most distinct tokens" and "breaks a tie by file count, then by track name, and abstains on no match". The real tree printed `baseline ripgrep: 68/256 right (0.2656)`
- [x] T007 Zero-call output: both accuracies on identical rows, the better one as baseline, the paraphrase-probe line, the headroom line with `no headroom` above 0.90, the 10-point margin printed as a constant, no file written (same file). Evidence: briefs 04 and 05 (cursor, 9 and 10 passed) and 07 (devin, 567 s, 18 passed). The real tree printed `baseline method: ripgrep 68/256 right`, `margin: 0.10`, the `keep rule:` line, `headroom: a 10-point gain fits above 68/256` and `paraphrase probes: total=20 gold-less=6 lookup=0/14 ripgrep=8/14`. Vitest "prints no headroom when the baseline is right on more than 90 percent" and "default run prints the zero-call report, spawns no model binary and writes no file" pass
- [x] T008 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, `--out` required, the payload notice (same file). Was blocked on phase 008, which is Complete (`ee3a1b057c`, closed in `9aea8cdc56`). Evidence: brief 08 (devin, 477 s), focused vitest 21 passed. Vitest "skips a stub backend with the rest of the output byte-identical" and "skips an unreachable server, a wrong model and a body that is not json" pass. Brief 23 moved the `--out` refusal to right after argument parsing, and "refuses --deem without --out before any output or call" passes. The live run printed `deem: health backend=torch model=deem-0.8-v1 model_commit=8cbabbb2... source_commit=c8a5523c...` and the notice `deem: nothing leaves the machine; planned calls: 810; ...`
- [x] T009 Deem arm: the fixed `-q` instruction printed verbatim, 17 options from the track descriptions and the fixed `none` description with their SHA-256 printed, three left rotations, modal pick, `unstable`, `none` as abstention, the exit table and `calls.jsonl` records with the commit pair (same file). Was blocked on phase 008, now Complete. Evidence: brief 09 (devin, 530 s), focused vitest 24 passed. The live run printed `instruction: -q "Which spec track is this text about?"`, `options: 17 sha256=5562c17c...` with `none="None of these tracks"` and the three orders. Its `calls.jsonl` holds 810 lines, 270 row ids each with orders 0, 1 and 2, and every line carries the commit pair (build record section 6, session host recount). Vitest "stops when the commit pair changes after exit 4, or when the backend refuses" and "marks exit-1 calls unmeasured and stops on coverage" pass. No test covers a passing exit-4 recheck or `server gone` (review P2, open)
- [x] T016 Jev gate behind `--jev`: identity line with the `jev` path and provider P first, then `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P`, the three skip lines, `--out` required, the payload notice without a dollar figure (same file). Evidence: brief 11 (devin, 130 s), focused vitest 30 passed. Vitest "prints the jev path and provider official first, then skips with no credential", "skips a jev that is missing or reports another version" and "refuses --jev without --out before any output or call" pass. The payload line holds `payload:` and `estimated input tokens:` and no `$` ("runs every jev call under one provider and prints keep on stub answers")
- [x] T017 Jev arm: one `jev auth test --provider P`, the same `-q` instruction, 17 options and three rotations as the Deem arm with no answer cache, the question on stdin and closed, the same `--provider P` on every call, the 90 s spawn cap, phase 002's exit handling and `calls.jsonl` lines carrying the `jev` version, provider and model (same file). Evidence: brief 12 (devin, 352 s), focused vitest 33 passed. Both arms build their `-o` pairs from one option set (`plan.options.pairs`, S:1346-1348 and S:1658-1660), which is 17 on the real tree. In the stub run, 18 `choice` lines for 6 rows all carry `--provider official` and the fixed `-q`, and all 19 `calls.jsonl` records carry `jevVersion`, `provider` and `model`. The 90 s default is `deps.timeoutMs ?? 90000` (S:1890), read, not run. No test covers the Jev exit-4 backoff or the 90 s timeout, and the stub run sends the fixture's 3 options, not 17 (review P2s, open). No live `--jev` run was made (T018)
- [x] T010 Verdict per backend column, exactly spec REQ-004: the baseline method with the lookup winning a tie, measured rows as those with three submitted keys, coverage, margin, sign test and flips in that order with integer counts and an exact p, the `margin: 0.10` and `keep rule:` lines before any call, `verdict <backend>: keep` or `verdict <backend>: stop (<reason>)` on stdout and in that column of `report.json` with K, M, A, B, W, L, F and p, `requalify: model commit changed` on a new Deem pair and `requalify: model changed` on a new Jev provider or model (same file). Evidence: brief 06 (the cursor attempt sat 23 minutes with no output and was killed, exit 143, then devin in 354 s, 15 passed) and brief 10 (devin, 595 s, 27 passed). Vitest "prints keep on stub answers that clear all four conditions", "prints stop (margin) on a gain under ten points", "prints stop (coverage) with 2 of 10 kept rows unmeasured and every measured pick right", "stops on the sign test and on flips, and counts unstable and none as wrong", "writes report.json whose deem column matches the stdout verdict" and both requalify cases pass. The live `report.json` Deem column holds the verdict, its reason, K, M, A, B, W, L, F and p, and its `line` equals the stdout verdict line (closure pass, read of the file)
- [x] T011 README: add the script row and tree line, and note that it reads the probe queries of `semantic-probes.json` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`). Evidence: brief 13 (pi on Cline, 104 s), `rg -c 'score-track-narrowing'` 3 and `validate_document.py` exit 0 (`W/logs/13.vd.txt`). Deviation: the README now says "All six scripts" instead of "All five", to stay true
- [x] T019 After the runs, one sentence in the retrieval section of `SKILL.md` and one line in the retrieval section of `README.md`, each naming the script, its zero-call default and its two switches, through sk-doc (parent goal D6) (`.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/skills/system-spec-kit/README.md`). Evidence: briefs 14 and 15 (pi on Cline, 48 s and 50 s). Each doc names `score-track-narrowing`, `--deem` and `--jev` once and the zero-call default, and `validate_document.py` exits 0 on both. `SKILL.md` also moved from version 4.1.3.0 to 4.2.0.0. Deviations: the README line is a four-line paragraph, because the file wraps at 100 columns and REQ-014 needs the name, the default and both switches. The skill docs were written before the live Deem run, not after it: briefs 13 to 22 finished between 17:26Z and 17:53Z (`W/logs/*.status`) and the live run started at 18:26:14Z. No doc names a verdict: `rg` for `verdict deem`, `stop (margin)`, `verdict jev` or `: keep` over the six narrowing docs exits 1, and the same pattern matches the live run's stdout (closure pass)
- [x] T020 [P] The next changelog version file through `sk-create-changelog` (parent goal D6) (`.skilled/skills/system-spec-kit/changelog/`). Evidence: brief 16 (pi on Cline, 35 s) created `changelog/v4.2.0.0.md` from a literal content file under `W/briefs/content/`, `cmp` exit 0 and `validate_document.py` exit 0. A minor bump for a new feature, matching how the last release moved `SKILL.md`
- [x] T021 [P] One feature-catalog entry and its index row through `sk-create-feature-catalog`, and one manual-testing-playbook scenario covering the zero-call run and a stub-backend skip with its index row through `sk-create-manual-testing-playbook` (parent goal D6) (`.skilled/skills/system-spec-kit/feature-catalog/retrieval/`, `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/`). Evidence: briefs 17 to 20 (pi on Cline) created `feature-catalog/retrieval/track-narrowing-measurement.md` with its index block under section 8 and scenario 459, `manual-testing-playbook/retrieval/track-narrowing-measurement.md`, with its row in section 7.8. Brief 21 added one line naming both switches to the scenario, and brief 22 replaced the word "manifest" on catalog line 32 with `manifestHash`, which `tests/workflow-invariance.vitest.ts` requires. `validate-playbook-package.cjs --package system-spec-kit` printed `PASS` with `scenarios=85` (84 at baseline), and the catalog package stayed at 85 warn, 0 fail. Scenario 459 proves the stub-backend skip through the vitest case
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Vitest: at least 18 cases, a happy path plus one edge case for each changed surface, the Deem exit 4 changed-pair case, the requalify case, the Jev key-rejected case, one `--provider` value on every logged `jev` call and `stop (coverage)` with 2 of 10 kept rows unmeasured. Run from `runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli tests/score-track-narrowing.vitest.ts` (`.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`). Evidence: after brief 23 the build ran it and printed `Tests 33 passed (33)`, exit 0 (`W/logs/23.vitest.txt`), and the orchestrator session's host rerun gave 33 passed, exit 0. T holds 33 cases, each named in the list above
- [x] T013 One zero-call run on the real tree with stub `cli-deem` and `jev` first on `PATH`. Record both accuracies, the kept row count and the headroom line in `goal.md`'s log. A `no headroom` line is the phase's verdict for the parent goal's log (parent goal D4). Evidence: `W/runs/zero-call-final` exited 0 in 1,944.1 s wall, the stub dir held no `calls.log` and `git status --porcelain` was the same before and after (`cmp` exit 0, closure pass). It printed `kept=256`, `baseline lookup: 17/256 right (0.0664)`, `baseline ripgrep: 68/256 right (0.2656)` and `headroom: a 10-point gain fits above 68/256`, so the live run went ahead. The first final attempt exited 2 because the full `cli` suite removed its temp fixture under `specs/` mid-walk, and the rerun alone passed. Recorded in `goal.md`'s log
- [x] T014 Unless T013 printed `no headroom`, one `--deem --out <dir>` run against the served instance. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log for the parent goal's log. A `verdict deem: keep` here is the operator's keep that unlocks phase 009, and any other verdict still closes the phase (parent goal D4). Evidence: `W/runs/deem-live-1`, 18:26:14Z to 19:02:58Z, exit 0, printed `verdict deem: stop (margin) K=256 M=256 A=10 B=68 W=5 L=63 F=461 p=1.000` with model `deem-0.8-v1` and pair `8cbabbb2c4a7...`/`c8a5523c5a7e...`, the same pair in `cli-deem health` before and after. Report at `W/runs/deem-live-1/out/`, latency p50 703 ms and p95 728 ms. The session recounted K, M, A and F from `calls.jsonl`, and the cross-family reviewer recomputed the verdict independently. It is a `stop`, so phase 009 stays Planned. Recorded in `goal.md`'s log
- [x] T018 Only when the operator passes `--jev`, one `--jev --out <dir>` run. Record the identity line, the verdict line, provider, model and p50 and p95 in `goal.md`'s log. The build never waits for the flag (parent goal D7): with no flag by close, mark this task done as not requested and log that reason. Done as not requested: no `--jev` flag came from the operator by close, so no `--jev` run was made and the Jev arm is proven on stubs only (build record section 1, session record, the D7 ruling in `goal.md`'s log)
- [x] T015 `git status --porcelain` shows only the paths in spec section 3 and the report directory. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match. Evidence: the build's final `git status --porcelain` listed only its ten paths and `W` (build record section 7), and the session's host check found only the build's paths plus the parent `goal.md` under the session's own amendment, committed as `3cbe44727e`. At close the build is committed: `git show --name-only f7ae1ff44c` lists the ten paths, the Hermes copy `.hermes/skills/system-spec-kit/SKILL.md` that the session regenerated with `sync-skills-hermes.cjs`, and 281 files under `W` (closure pass). The key grep exits 1 with no match (build and session)
- [x] T022 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every skill doc T011 and T019 to T021 changed (parent goal D6). Evidence: exit 0 on all 8 changed docs, rerun by the session with `SKDOC_SKIP_VALIDATION` unset (`W/final/validate-document.txt`). The two index files keep the `document_type_fallback` warning they had at baseline. The named path is a tracked symlink to `../shared/scripts/validate_document.py` (git mode 120000), so the command as written runs the same validator
- [x] T023 A cross-family review of the script and its test leaves no open P0 or P1 finding and the `cli` vitest project fails nothing beyond T002's baseline. Then the parent orchestrator commits with path-scoped commits (parent goal D5). Evidence: round 1 (Claude `review` agent, code by Grok, DeepSeek via Devin and DeepSeek via Pi on Cline) returned FAIL on one P1, the `--out` refusal after the zero-call report and a passing gate. Brief 23 (devin, 94 s) fixed it, and round 2 returned PASS with no open P0 or P1. The final `cli` project run printed `Test Files 157 passed | 3 skipped (160)` and `Tests 1602 passed | 19 skipped (1621)`, exit 0: +1 file, +33 tests and 0 new failures against T002's baseline (`W/final/cli-vitest.txt`). Commits: build `f7ae1ff44c` (292 files) and trigger index `2d101bd6d8`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The zero-call run and the live `--deem` run ran on the real tree, and the session reran the refusal check with stub binaries first on `PATH`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Build record**: See `scratch/w3-build/build-evidence.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-014
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 and 4
- [x] CHK-003 [P1] Dependencies identified and available: phase 010's index, phase 008's `cli-deem` and, for `--jev`, `jev` 0.6.2 with a credential. Evidence: the index `--check` exited 0 with 0 stale (T001). Phase 008 is Complete, and `cli-deem health` answered with `torch` before and after the live run. No `--jev` run was made (T018), so the Jev dependency was not needed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `node --check` on S exits 0 with no output, the comment-hygiene grep for requirement, task, phase or packet ids in S and T finds nothing, and T runs clean in the `cli` vitest project (build record section 4)
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the live run's stderr holds one line, `wall time: 2202.0 s`, and the zero-call run's stderr its own wall time only (`W/runs/deem-live-1/stderr.txt`). Wall time goes to stderr so stdout stays byte-identical run to run
- [x] CHK-012 [P1] Error handling implemented: every `cli-deem` exit has one handling. Evidence: exits 1, 3 and 4 with a changed pair are tested (T009), and exit 2, 130 and a passing exit-4 recheck have code paths. Open P2s, recorded under parent D5: a model or backend recheck failure prints `server gone`, no test covers a passing exit-4 recheck or `server gone`, and the stub-backend and wrong-model stubs exit 0 where the real `cli-deem` exits 3
- [x] CHK-013 [P1] Code follows project patterns through sk-code's OpenCode route: MODULE banner, exported pure functions, `isMainModule`, no spec path or requirement id in comments. Evidence: `// MODULE: Track Narrowing Measurement` at S:3, `isMainModule` imported at S:30 and used at S:2047, JSDoc on every export (build record section 8) and the comment-hygiene grep finds nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 14 of 14 Met, AC-007 and AC-013 after a logged wording amendment
- [x] CHK-021 [P0] Manual testing complete: one zero-call run and, unless `no headroom`, one `--deem` run. Evidence: T013 and T014
- [x] CHK-022 [P1] Edge cases tested: leak drop, own-folder exclusion, `no headroom`, stub backend skip. Evidence: vitest "drops a description that names a track or a hub and counts it", "ignores every row inside the question's own folder", "prints no headroom when the baseline is right on more than 90 percent" and "skips a stub backend with the rest of the output byte-identical" pass
- [x] CHK-023 [P1] Error scenarios validated: exit 4 with a changed commit pair. Evidence: vitest "stops when the commit pair changes after exit 4, or when the backend refuses" passes
- [x] CHK-024 [P1] A cross-family review leaves no open P0 or P1 finding, and the `cli` vitest project fails nothing beyond its recorded baseline (parent goal D5). Evidence: T023
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Classes: the review P1, the late `--out` refusal, is `instance-only`. It came from the session's build prompt, which pointed at phase 002's refusal after a passing gate, and 002's own spec wants that order (its review round 3 PASS). Brief 22's banned word is `instance-only`. The recorded P2s are `matrix/evidence` (untested exits, the 3-option stub) and `instance-only` (`server gone` wording, a reused `--out` dir)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `grep -c "needs --out <dir> so every call is recorded"` on S prints 2, both inside the new early check (brief 23), and a grep over the six narrowing docs finds no line saying the refusal follows the gate (build record section 4)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `rg -l score-track-narrowing .skilled --glob '*.{ts,mjs,js,cjs}'` lists S and T only, so nothing else imports S. Phase 009 consumes the verdict line and its `report.json` column, never the code. The docs that describe the refusal were checked in CHK-FIX-002
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: the one fix moves an argument check and adds no path, parser or redaction logic. Its cases cover `--deem`, `--deem --out ''` and `--jev`, each exit 2 with empty stdout and no stub log
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` names four axes. Deem state: none, stub, wrong model, unreachable, not JSON and healthy are each a case. Jev state: not on `PATH`, wrong version, no credential, passing and key rejected are each a case. Switches: `--deem`, `--jev` and neither are cases, and both together has no case. Headroom: above and below 0.90 are cases, and a switch under `no headroom` is read from S:1968-1970 and S:1990-1992, not tested
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: S reads `PATH` and `JEV_PROVIDER` through an injected env. The cases run with stub binaries first on `PATH`, with `JEV_PROVIDER` removed and, in the Jev refusal case, set to `openrouter`. Since brief 23 that case refuses before the identity line, so no case asserts `JEV_PROVIDER` reaching the identity line or `auth status` (review round 2 P2, open)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: the runs used S with SHA-256 `b9197509...`, the final S is `594e3eff...` (`W/final/script-sha-after-refusal-fix.txt`, and the closure pass's `shasum` matched), and the build is commit `f7ae1ff44c`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S exits 1 with no match (build and session)
- [x] CHK-031 [P0] Input validation implemented: option count and `--out` checked before any call. Evidence: `--deem` or `--jev` without `--out` exits 2 with empty stdout and no stub call, on the real tree and in vitest (`W/runs/refusal-check/`). The option cap is `MAX_TRACKS = 25` (S:48), and `buildOptions` throws past it (S:193-194) before any call. No case covers the cap
- [x] CHK-032 [P1] Auth/authz working correctly: `jev auth status --provider P` gates the Jev arm, `jev` resolves its own key and the script passes none to either binary. Evidence: the no-credential case skips with only `--version` and `auth status --provider official` logged, the key grep finds nothing and every logged stub call carries no key
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan, tasks, acceptance criteria, goal and summary agree on Complete, and the stale premises are corrected in each
- [x] CHK-041 [P1] Code comments adequate. Evidence: JSDoc on every export, and the header states the exit codes, which brief 23 updated for the early refusal
- [x] CHK-042 [P1] The retrieval README and `system-spec-kit`'s `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook updated through sk-doc, with `validate_document.py` exiting 0 on each (parent goal D6). Evidence: T011, T019 to T022
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the orchestrator wrote only under `W`, and the stub `cli-deem` and `jev` dirs of the zero-call runs were removed after their checks (build record section 2)
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: `W` is kept on purpose as the build record, committed in `f7ae1ff44c` as 281 files, as sibling phases keep theirs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-28. CHK-051 keeps `scratch/w3-build/` as a recorded deviation, and the review's P2s stay open under parent D5
<!-- /ANCHOR:summary -->

---

