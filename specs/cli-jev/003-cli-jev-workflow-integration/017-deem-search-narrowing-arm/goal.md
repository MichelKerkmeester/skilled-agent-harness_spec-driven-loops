---
title: "Goal: Phase 17: deem-search-narrowing-arm"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deem search narrowing goal"
  - "score-track-narrowing completion criteria"
  - "track narrowing keep rule"
  - "deem spec track pick"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm"
    last_updated_at: "2026-09-28T22:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Ticked 7 of 7 criteria and logged the build, stop (margin)"
    next_safe_action: "None. The orchestrator commits the phase docs"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/acceptance-criteria.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-017-deem-search-narrowing-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: deem-search-narrowing-arm

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether one Deem or Jev `choice` that picks the spec track before search beats ripgrep and the trigger-index lookup at naming the right track, through one read-only script whose default run makes zero model calls and prints the baseline first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-track-narrowing.mjs` in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/`, new `tests/score-track-narrowing.vitest.ts` under `runtime/cli/`, one retrieval README row and, per parent D6, `system-spec-kit`'s `SKILL.md`, README, changelog, feature catalog and playbook through sk-doc. No hook, no Gate 1 change, no index or lookup edit |
| D2 | Questions are live packet `description.json` descriptions, answer is the track. Drop placeholders and any description holding a multi-word track slug or hub name. At most 20 rows per track, first by SHA-256 of the folder path. Both baselines ignore the question's own folder |
| D3 | The baseline is the better of ripgrep (distinct question tokens, path-only recipe over `specs`) and the lookup (first scoring `specs/` row), both at track level on identical rows |
| D4 | Spec REQ-004 is the keep rule, per backend column, checked in order: at least 90 percent of kept rows measured, a gain of at least 10 points over the baseline method on the measured rows, an exact one-sided sign test p below 0.05 on discordant rows and a flip rate of at most 0.10 over three calls per row. Else `verdict <backend>: stop (<reason>)`. A baseline above 0.90 prints `no headroom` and no arm calls. The verdict prints on stdout and in `report.json`. A live `verdict deem: keep` is the operator's keep that unlocks phase 009 (parent D4). Any verdict goes in this log for the parent's |
| D5 | Both arms ask 16 tracks plus `none` in three left rotations under one fixed `-q` instruction, track descriptions verbatim and hashed, no answer cache. Deem is preferred: the live run is `--deem` behind a passing `cli-deem health`, and a `--jev` run happens only on the operator's flag. No failover. The 20 paraphrase probes never decide |
| D6 | The Jev arm follows phase 002's gate: an identity line with the `jev` path and provider P first, then `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0, else a `jev arm skipped:` line and exit 0. One `--provider P` on every call, no key in any file, and a request carries only the question, the fixed `-q` instruction and the 17 options. A Jev keep holds only for its provider and model, a Deem keep for its commit pair |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` without `--deem` exits 0, prints `baseline lookup:`, `baseline ripgrep:`, `margin: 0.10` and either `no headroom` or `planned calls:`, and stub `cli-deem` and `jev` binaries first on `PATH` log zero calls
- [x] With `--deem` and a stub `cli-deem health` reporting backend `stub`, the script prints `deem arm skipped: stub backend`, and with `--jev` and a stub `jev` whose `auth status --provider official` exits 3, it prints a line naming the `jev` path and provider `official`, then `jev arm skipped: no credential`. Each run exits 0 and its other output is byte-identical to the default run
- [x] From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/score-track-narrowing.vitest.ts` exits 0 with at least 17 passed tests and 0 failed
- [x] Either the default run printed `no headroom`, or one `--deem --out <dir>` run against the local server printed `verdict deem: keep` or `verdict deem: stop (<reason>)` and wrote a `calls.jsonl` in which every line holds `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-track-narrowing.mjs` returns no match, and in a stub run that passes the Jev gate every logged `jev` call carries the same `--provider` value
- [x] `git status --porcelain` is the same before and after each script run, and the build commit `f7ae1ff44c` changes no path other than `score-track-narrowing.mjs`, `score-track-narrowing.vitest.ts`, the retrieval `README.md`, `system-spec-kit`'s `SKILL.md` and `README.md`, one new changelog file, one new catalog entry and one new playbook entry with their index files, the Hermes copy of that `SKILL.md` and this phase's build record with its report directories
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, authored 2026-09-27 from the orchestrator's phase brief, section `017-deem-search-narrowing-arm` |
| Build | Done | Released by the operator on 2026-09-28 (parent D3) and built after 008, 016 and 002 from `scratch/w3-build/briefs/`: 23 briefs in 24 dispatches. Committed as `f7ae1ff44c`. Rows below, and `W` is `scratch/w3-build`. Source: build record sections 2 and 3, session record |
| Wave 3 amendment | Done | 2026-09-28, by a spec leaf. Rows below, one per source |
| Baselines | Done | Before the first dispatch, HEAD `64968e9b58`: `cli` project 156 files and 1,569 tests passed, 19 skipped, exit 0. Index `--check` exit 0 with 0 stale, and a scratch rebuild matched the committed index on 12,386 paths. Playbook package PASS with 84 scenarios, catalog package 85 warn and 0 fail, root metadata 16/16, Hermes copies PASS 73. Source: build record section 5 |
| Briefs 01 to 12, the script and its test (T003 to T010, T016, T017) | Done | Cursor 01 to 05, Devin 06 to 12. Brief 06's Cursor attempt sat 23 minutes with no output and no file change, so it was killed (exit 143) and sent to Devin. The focused vitest count rose from 3 to 33. Source: build record section 3 |
| Briefs 13 to 22, the skill docs (T011, T019 to T021) | Done | Pi on Cline, 22 s to 133 s each, `validate_document.py` exit 0 after each. Brief 21 added the two switches to scenario 459 (REQ-014), and brief 22 removed a word the workflow-invariance test bans. Source: build record section 3 |
| Zero-call run (T013) | Done | `W/runs/zero-call-final`: exit 0, 1,944.1 s, no stub call, `git status` unchanged. `kept=256`, `baseline lookup: 17/256 right (0.0664)`, `baseline ripgrep: 68/256 right (0.2656)`, `baseline method: ripgrep 68/256 right` and `headroom: a 10-point gain fits above 68/256`, so the live run went ahead. Source: build record section 6 |
| Live Deem run (T014) | Done | `W/runs/deem-live-1`, 18:26:14Z to 19:02:58Z, exit 0, report at `W/runs/deem-live-1/out/`. `cli-deem health` before and after printed `torch`, `deem-0.8-v1`, `8cbabbb2c4a7...`/`c8a5523c5a7e...`. `column deem: rows=256 measured=256 unmeasured=0 unstable=209 abstained=0 flip_rate=0.6003 latency_p50_ms=703 latency_p95_ms=728`. `calls.jsonl` holds 810 lines, none missing a field. Source: build record section 6, session record |
| Verdict for the parent's log | Done | `verdict deem: stop (margin) K=256 M=256 A=10 B=68 W=5 L=63 F=461 p=1.000 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc`. The session recounted K, M, A and F from `calls.jsonl`: `10*(A-B)` is -580 against `M` 256, so the margin fails whatever W and L are. The cross-family reviewer recomputed the same verdict. It is a `stop`, not a `keep`, so phase 009 stays Planned (parent D4). Source: session record |
| Phase 009's deciding verdicts | Recorded | 002 Jev `kill` (decided 38, wins 11, losses 27), 002 Deem `kill` (decided 38, wins 8, losses 30) and 017 Deem `stop (margin)`. No Deem `keep` exists, so nothing unlocks 009 (parent D4). Source: session record, sections 002 and 017 |
| Jev run (T018) | Done, not requested | No `--jev` flag came from the operator by close, so no `--jev` run was made, as the D7 ruling below allows. The Jev arm is proven on stubs only. Source: build record section 1, session record |
| Cross-family review, round 1 | Done | Claude `review` agent over code by Grok, DeepSeek via Devin and DeepSeek via Pi on Cline: FAIL on one P1. `--deem` or `--jev` without `--out` was refused only after the zero-call report and a passing gate, while REQ-008 and AC-008 want exit 2 before any call. The reviewer recomputed `stop (margin)` independently. Source: session record |
| Brief 23, the P1 fix | Done | Devin `deepseek-v4-1-flash-max`, 94 s. The refusal now sits right after argument parsing. Host: `--deem` and `--jev` without `--out`, stub binaries first on `PATH`, each exit 2 in 0 s with empty stdout and no stub call. `node --check` exit 0, vitest file 33 passed, script SHA-256 `594e3eff...`. Source: session record, build record section 3 |
| Cross-family review, round 2 | Done | PASS. A diff against the live run's copy of the script (SHA-256 `b9197509...`) shows only the new check, the two removed late checks and comment wording. The zero-call path, both gates, both arms, the verdict code and `buildReport` are byte-identical, so `stop (margin)` stands for the final code. No open P0 or P1. Source: session record |
| Final gates | Done | `cli` project 157 files and 1,602 tests passed, 19 skipped, exit 0: +1 file, +33 tests, 0 new failures. Playbook package PASS with 85 scenarios, catalog package unchanged, root metadata 16/16, `validate_document.py` exit 0 on all 8 changed docs, `validate.sh --strict` on this phase `RESULT: PASSED`. Source: build record sections 4 and 5, session record |
| Host checks | Done | The session's recount of the live run, the key grep (exit 1), `validate_document.py` on the 8 docs, the vitest file (33 passed) and the scope check: only the build's paths plus the parent `goal.md` under its own amendment (`3cbe44727e`). Source: session record |
| Build commit | Done | `f7ae1ff44c`, 292 files: 11 build paths including the Hermes copy of `SKILL.md`, and 281 record files under `W`. The session then rebuilt the trigger index from `git archive HEAD` as `2d101bd6d8`: generate exit 0, 0 leaks, `--check` exit 0 with 23,317 documents, 0 stale, 0 obsolete and 0 untrusted. Source: session record |
| Phase docs | Done | Closure leaf, 2026-09-28: tasks, acceptance criteria, this log, `spec.md`, `plan.md` and `implementation-summary.md` record the evidence and correct the stale premises. Gate results are in `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| Owner and collisions | Owner is `system-spec-kit`, `runtime/cli/retrieval/`. `git log -5` on it shows the last branch change as `954ed7fde8` (2026-09-26, index regeneration). Main carries three index rebuilds from 2026-09-27 (`eaa02a56f5`, `04193b88d7`, `dd0933eeff`) that this branch lacks, touching `trigger-index.json` and the fixtures. This phase writes neither, but its lookup baseline depends on which index is committed, so a merge reruns the zero-call run |
| Own-folder exclusion | Not in the brief. A question is its own packet's description, which also sits in that packet's `spec.md` frontmatter, so a lexical baseline would find itself and win by construction. Excluding the question's own folder keeps the comparison fair |
| Probe gold | The 20 Latin paraphrase probes carry a trigger phrase, not a track. Their gold is derived from the exact query's scoring `specs/` rows on the fresh index, which gives a set, not one track, and at most 20 rows. That cannot resolve a 10-point margin, so the probes are reported and never decide (D5) |
| Stratification | Rough count by this leaf on 2026-09-27: 1,968 live packet descriptions, 84 placeholders, 187 name leaks, 1,697 usable. `system-speckit` alone has about 998 usable and `cli-orca` 1. A cap of 20 per track gives about 259 rows (estimate). The build recounts |
| Margin | 10 points, fixed here so the build cannot tune it. About 26 more right rows of about 259 (estimate). Above a 0.90 baseline no gain of 10 points fits, hence `no headroom` |
| Amendment 2026-09-27: Jev arm | Source: parent goal D1, "Two backends: every feature runs on Jev or Deem, dormant unless one is available", relayed by the coordinator with `sk-create-goal`'s `parent-and-nested-goals.md` section 6 (a child goal may not override a parent decision). The first plan was Deem only, which left the feature dormant when Jev was available and Deem was not. Changed: the objective names both backends, D4 is per column, D5 keeps Deem preferred with Jev on the operator's flag, D6 is new with phase 002's gate, criterion 2 adds the Jev skip, criterion 3 counts 17 tests and criterion 5 is new (no key, one provider). `spec.md` gained REQ-012 and REQ-013 and an amendment trace. The parent needs no amendment, since this change brings the child into line with D1 |
| Recorded decisions kept | The 10-point margin and the own-folder exclusion stand unchanged through the amendment |
| Latency estimate | The 65.6 ms p50 in `deem-local.md` was measured on 2-option requests. A 17-option request with long track descriptions is longer, so the arm reports its own p50 and p95 and labels the estimate |
| Scaffold numbering | The scaffold titled every document "Phase 8". This phase is Phase 17 of 17, as the titles and `spec.md` metadata now say |
| Criteria in the objective | The objective stays one sentence, as in the sibling phases. The criteria reach the evaluator verbatim through the chat slice, which carries section 3 unchanged |
| Semantic-probes line counts | Re-counted from the fixture: Latin exact 16 of 20, paraphrase 1 of 20, distractor 0 of 20, CJK 0 of 20 in each variant, stemming 4 of 5. The fixture's `topScoringPaths` still name `.opencode/skills/...` paths from its capture, so the gold is re-derived on the fresh index rather than read from it |
| Amendment 2026-09-28: keep rule (parent D4) | Source: parent D4, "A pre-fixed Deem `keep` in 002 or 017 unlocks 009", and its log row "New directive, wave 3". A keep here now has a consequence, so the rule must be complete before any run. Changed: D4 here names spec REQ-004 and the unlock. REQ-004 now names its inputs (K, M, A, B, W, L, F), lets the lookup win a baseline tie and defines a measured row as three submitted keys. It compares in integers with an exact p and prints a `keep rule:` line before any call and the verdict with its inputs in `report.json`. It also says a stub keep never counts and a change after the first model run voids earlier verdicts. A coverage condition (90 percent of kept rows measured) comes first. Without it a column with no measured row has no defined gain, and a keep could rest on the rows the backend happened to answer while the others left the comparison unseen, which matters once that keep unlocks 009. REQ-011, AC-011 and T012 go from 17 to 18 cases for `stop (coverage)`, and AC-004 covers it. The handoff row, SC-002, plan sections 1 and 4, T010, T013 and T014 name the unlock and the log. Criterion 4 already covers `keep` or `stop` and stays as written. Criterion 3 stays at "at least 17" as a floor below AC-011's 18, since no decision made it untrue |
| Amendment 2026-09-28: build roles (parent D5) | Source: parent D5. No builder, reviewer or release wording here contradicted it, so nothing was replaced. Added: plan section 4's "Who builds" paragraph (a fresh Opus 5.5 xhigh build orchestrator, single-change briefs, Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` and Cursor `grok-4.7-xhigh-fast` by Bash only, the parent orchestrator verifying, a cross-family review and path-scoped commits), plan step 8, the Definition of Done review line, T023, CHK-024 and T002's suite baseline |
| Amendment 2026-09-28: skill docs (parent D6) | Source: parent D6. The file list held only the retrieval `README.md` for `system-spec-kit`, the one skill this phase changes. Added with reasons in spec section 3: `SKILL.md`, the skill `README.md`, a changelog file, a feature-catalog entry and a manual-testing-playbook entry, each with its sk-doc mode. Also REQ-014, AC-014, T019 to T022, plan step 7 and CHK-042 raised to P1. D1 ("Three changed paths only") and criterion 6 (its path list) were amended because D6 made both untrue. REQ-006 and AC-006 now point at the section 3 paths. Code goes through sk-code's OpenCode route (spec section 3, T002, CHK-013) |
| Parent D1 confirmed (2026-09-28) | The Deem gate (REQ-005, `cli-deem health` within 2,000 ms), the Jev gate (REQ-012, `jev auth status --provider P`) and today's behavior with neither (REQ-001's zero-call default, SC-003, the scope boundary) were already stated. Nothing changed for D1 |
| Stale premises (2026-09-28) | Checked against the tree after the main merge `bbf2a8e4cd`. Corrected in place: `lookup-trigger-index.mjs:104-108` to `:107-111`, `:176` to `:179` and `generate-trigger-index.mjs:64-67` to `:76-79`. Still true: `rg-wrapper.mjs:210`, retrieval README `:78`, `deem_server.py:166` (`max_letters = 26`, with Deem's source now at `7cf293f`, newer than `deem-local.md`'s `6755b30`), `jev_cli/__init__.py:352` and `:378` in the installed 0.6.2, `research.md:1038` and `:449`, `deem-local.md:85` (65.6 ms), 16 spec tracks and `semantic-probes.json` read by no script. No longer true, each now in the spec's risks: this branch lacking main's three index rebuilds (merged), 010 Planned (Complete), a scratch `--out` build writing tracked fixtures (not since `a0368b4a58`) and a call shape without `-q` (`jev_cli/__init__.py:350` requires it, so REQ-007 now fixes one instruction and the `none` description, and D5 and D6 here name it) |
| Conflict named: T018 and parent D7 | T018 was `[B]`, blocked on the operator's `--jev` flag. The tasks file closes only with no `[B]` task left. Parent D7 stops the build only for an install yes or a missing credential. Resolved in D7's favor: T018 no longer blocks, and with no flag by close it is marked done as not requested with that reason logged. The Deem-first design and the flag itself are unchanged. The orchestrator can revert this |
| Extra: phase numbering | The spec said "Phase 17 of 17" with no successor. Phase 018 names this phase as its predecessor and the parent phase map lists 18 phases, so the metadata now says 17 of 18 with successor `018-worktree-provision-shared-link` |
| Budget gate | `goal.cjs packet` on this folder prints `packet_budget=unknown`, as it does on every sibling phase. A phase child that is not itself a phase parent carries no budget (`.skilled/hooks/goal/lib/goal-slice.cjs:309-319` and `:407-412`), so `ok` cannot print here without changing the phase's shape |
| Conflicts resolved by the session (2026-09-28) | The T018 and parent D7 conflict above was ruled in D7's favor, as written. The session also accepted the coverage condition this phase added to the keep rule, because it tightens the rule, was fixed before any run and stops a keep resting only on the rows a backend answered. Criterion 3's "at least 17" and AC-011's 18 do not conflict, because 18 passing tests meet both. Source: session record, conflicts named by spec leaves |
| Planned calls include the probes | REQ-008 said the planned calls are rows times 3, 768 on the real tree. The script asks the 14 gold-bearing probes too, so the probe line can report model hits (REQ-010), and it plans 3 × (256 + 14) = 810. The cross-family reviewer rated the code honest and asked for the spec to be amended rather than the code (round 1 P2). REQ-008 and NFR-P02 now say 3 times the rows plus the gold-bearing probes. Source: build record section 8, session record, review round 1 |
| Criterion 6 amended at close | It said `git status --porcelain` lists no changed path other than the allowed set. At close the build is committed, so `git status` cannot show its paths, and in this shared tree it lists the concurrent work of phases 003, 005 and 006. The criterion now reads the build commit, as phase 002 did at its close. It also names the Hermes copy of `SKILL.md`, which the session regenerated from a listed file with `sync-skills-hermes.cjs`, and this phase's build record, which holds the report directories. Evidence: `git show --name-only f7ae1ff44c` lists the ten build paths, `.hermes/skills/system-spec-kit/SKILL.md` and 281 files under `scratch/w3-build/`, and `git status --porcelain` was byte-identical before and after the zero-call and live runs (`cmp` exit 0 on each pair of status files). The session's rebuild of the trigger index, `2d101bd6d8`, is a separate commit from committed content, not a build write. Source: closure pass. The operator can revert this amendment |
| AC-007 and AC-013 amended at close | Both asked the stub Jev vitest run to show 17 `-o` pairs on each `choice` call. The fixture corpus holds two tracks, so its option set is 3, and 17 is the real tree's 16 tracks plus `none` (REQ-007). Both arms read one option set (`score-track-narrowing.mjs:1346-1348` and `:1658-1660`), which printed `options: 17` on the real tree. So the rows now ask for one `-o` pair per option of the run's own option set. A real-tree Jev call carrying 17 pairs is derived from that code, not observed, because no `--jev` run was made. The reviewer recorded the 3-option stub as a P2 under parent D5. Source: closure pass, session record. The operator can revert this amendment |
| Late `--out` refusal, fixed by brief 23 | The build first followed its brief, which pointed at phase 002's refusal after a passing gate, against REQ-008 and AC-008. That was the session's prompt error. Round 1 flagged it as P1, and brief 23 moved the check to right after argument parsing. The zero-call and live runs used the script with SHA-256 `b9197509...`. The final script, `594e3eff...`, differs only in where that refusal sits, and the keep rule did not change, so REQ-004's void clause does not apply and the live verdict stands. Source: build record sections 3 and 6, session record, review round 2 |
| Executors and the roster switch | Cursor ran 5 briefs plus the killed attempt of brief 06 on `grok-4.7-xhigh-fast`, Devin 8 on `deepseek-v4-1-flash-max` and Pi on Cline 10 on `cline-pass/cline-pass/deepseek-v4.1-flash` at xhigh. All but brief 23 ran before the operator's switch at about 20:30 local to Devin DeepSeek and Pi MiMo (parent D5, amended in `3cbe44727e`), and brief 23 ran on Devin DeepSeek after it. The `.status` lines from before the switch record no model. Source: build record section 3, session record |
| Deem updater schedule in the build prompt | The prompt said the Deem updater fires at :15 past 00, 06, 12 and 18Z. The plist uses `StartInterval` 21600, restarted by the 14:27:02Z bootstrap, so it fires near 20:27Z and 02:27Z. That was a session error, corrected mid-build at 18:22Z, and `runs/live-deem.sh` now holds from 20:17Z to 20:37Z and from 02:17Z to 02:37Z. The live run was 18:26Z to 19:03Z, outside both windows, with the commit pair unchanged. Source: session record, build record section 8 |
| Hermes copy regenerated by the session | `sync-skills-hermes.cjs --check` reported `DRIFT system-spec-kit` after the build changed `SKILL.md`. The session ran the sync (1 of 73 written), `--check` then printed `PASS: 73 Hermes skill copies in sync` and only `.hermes/skills/system-spec-kit/SKILL.md` changed. The build record says someone outside the build regenerated it. The session's record wins. Source: session record |
| Skill README paragraph | `spec.md` planned one line in the skill `README.md`. It is a four-line paragraph, because the file wraps at 100 columns and REQ-014 needs the name, the default and both switches. Source: build record section 8 |
| Version and changelog | `SKILL.md` went from 4.1.3.0 to 4.2.0.0 with `changelog/v4.2.0.0.md`, a minor bump for a new feature under sk-create-changelog's rules, matching how the last release moved `SKILL.md`. Source: build record sections 2 and 8 |
| Other build deviations | New skip lines `deem arm skipped: no headroom` and `jev arm skipped: no headroom`. Wall time goes to stderr so stdout stays byte-identical (NFR-R01). The script is 2,049 lines at `f7ae1ff44c` against the 450 to 550 LOC estimate, with JSDoc on every export. The retrieval README says "All six scripts" to stay true. The new catalog, playbook and changelog docs are byte copies of content files the orchestrator wrote to sk-doc's templates, which kept every brief under 90 lines. Scenario 459 proves the stub-backend skip through the vitest case. Baselines went to `W/baseline/` before the first dispatch. Source: build record section 8 |
| Hold rule widened mid-build | The coordinator exempted every path under a `/scratch/` directory from the live run's hold rule, and `runs/live-deem.sh` matches. The live run had already passed the stricter rule, with `git status --porcelain -- specs/` showing only `W`. Source: build record section 8, session record |
| Suite runs before the final one | The first full `cli` run failed one test, `tests/workflow-invariance.vitest.ts`, on the word "manifest" in the new catalog entry, fixed by brief 22. The second failed `progressive-validation.vitest.ts` T-PB2-07d on a 120 s timeout under load, and that file passed alone 52 of 52. The third and the final run passed. Source: build record section 4 |
| Zero-call race with the suite | The first final zero-call attempt exited 2, `ripgrep failed on deleted`, because the full `cli` suite removed its temp fixture under `specs/` mid-walk. The rerun alone passed. Never run the tool beside the `cli` suite (P2 finding). Source: build record sections 6 and 9 |
| Skill docs before the live run | Plan step 7 and T019 put the skill docs after the runs, so no doc names a verdict that did not print. Briefs 13 to 22 finished between 17:26Z and 17:53Z (`W/logs/*.status`), before the final zero-call run ended at 18:25:59Z and the live run began at 18:26:14Z. No doc names a verdict: `rg` for `verdict deem`, `stop (margin)`, `verdict jev` or `: keep` over the six narrowing docs exits 1, and the same pattern matches the live stdout. Source: closure pass |
| Fixture track count | T003 planned three tracks. The entry-point and arm fixtures hold two, `alpha-track` and `beta`, which is why the stub Jev call carries 3 options. Source: closure pass, read of the vitest file |
| Stratification and margin recount | The estimates above were about 259 rows and about 26 more right rows. The build counts 256 kept, 1,727 usable, 67 placeholder, 185 leak and 49 residual, and 10 points of 256 is 26 rows. The baseline method is ripgrep at 68 of 256, so a keep needed A of at least 94 (`10*(A-68) >= 256`). Deem got 10. Source: build record section 6 |
| Stale premises corrected at close | `spec.md` section 3 called the index "the fresh index from phase 010". The runs read the index committed at `64968e9b58` (`manifestHash` `fdebd12a...`). By the build's final check it was stale by three docs, phase 002's `implementation-summary.md` and this phase's two new skill docs, and the session rebuilt it as `2d101bd6d8` after the build commit. NFR-P01's ripgrep cost is no longer UNKNOWN: 1,944 s alone and 2,453 s under load. NFR-P02's "about 777 calls at 65.6 ms is about 51 s" became 810 calls at a measured p50 of 703 ms and p95 of 728 ms, about 9.5 minutes of calls, since the 2-option p50 does not hold at 17 options plus a spawn per call. `spec.md` named `v4.1.3.0.md` as the newest changelog "today", and the build wrote `v4.2.0.0.md`. `plan.md` listed phase 008 as Planned, and it is Complete. Each is corrected in place. Source: build record section 8, session record |
| A listed stale premise that does not hold | The build record says AC-014 and T022 name the wrong validator path. `.skilled/skills/sk-doc/scripts/validate_document.py` is a tracked symlink (git mode 120000) to `../shared/scripts/validate_document.py`, so the path as written runs the same validator, and it was left unchanged. Source: closure pass, `ls -la` and `git ls-files -s` |
| Changelog refresh | The phase metadata asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder, so nothing was refreshed, as phase 016 recorded at its close |
| Devin permission mode | The session's executor pre-flight records that cli-devin requires explicit approval for `--permission-mode dangerous`, read as given by parent D5 with D7 and logged for the operator. This phase's `.status` lines name the executor, and brief 23's the model, not the permission mode. Source: session record, executor pre-flight |
| Open P2s, recorded, not fixed (parent D5) | A reused `--out` dir truncates the earlier `calls.jsonl` and `report.json`. A model or backend recheck failure prints `server gone`. The stub-backend and wrong-model stubs exit 0 where the real `cli-deem` exits 3. No test covers a Deem exit-4 passing recheck, `server gone`, the Jev exit-4 backoff or the 90 s timeout. The stub Jev run sends 3 options, not 17. Round 2 added one: brief 23 removed the only assertions of the passing Deem health line (REQ-005) and of `JEV_PROVIDER` reaching the identity line and `auth status` (REQ-012). The live run printed the passing health line. A review nit: inside `jevGate` a local `path` shadows the `node:path` import, with no effect today. Source: session record, reviews rounds 1 and 2, build record section 9 |
| Finding: Deem answers by option position | Order 0 picks `agents` on 238 of 256 rows, order 1 mostly `hooks` or `cli-external-orchestration` and order 2 `cli-jev` on 208. That gives 209 unstable rows and a flip rate of 0.6003. Recorded, nothing tuned. Source: build record section 9 |
| Finding: `report.json` p | `report.json` renders p as a float (`0.9999999999999971`), while the keep decision uses the exact BigInt comparison and stdout prints `p=1.000`. Source: build record section 9 |
<!-- /ANCHOR:log -->
