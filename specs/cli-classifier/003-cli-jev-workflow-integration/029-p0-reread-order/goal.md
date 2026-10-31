---
title: "Goal: Phase 29: p0-reread-order"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "p0 reread order goal"
  - "score-severity-replay completion criteria"
  - "severity replay keep rule"
  - "research r10 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order"
    last_updated_at: "2026-09-30T06:03:26Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build committed as 2239858286, closed at its label gate"
    next_safe_action: "Operator: name a label-sheet path, then label 20 P0 negatives"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-029-p0-reread-order"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A label-sheet path outside the repository, 20 labeled P0 negatives, then a live Deem run and a Jev run on the operator's yes"
      - "The six recorded P2 findings"
    answered_questions: []
---
# Goal: Phase 29: p0-reread-order

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem severity choice separates real P0 review findings from false ones better than the recorded severity, through one read-only script whose default run counts the P0 population with zero calls and whose model arms wait for 20 operator-labeled P0 negatives.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-severity-replay.cjs` and `runtime/tests/unit/score-severity-replay.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, scoring catalog and playbook. No registry, review workflow or `mode-adapters.ts` changes |
| D2 | Rows are the P0 findings of tracked review registries. Gold is the operator's label per row: `real`, `P1`, `P2` or `not_a_finding`. Fewer than 20 non-`real` labels stops every arm. No model writes a label |
| D3 | The baseline is the recorded severity, right on every `real` row. Above 90 percent right it prints `no headroom` |
| D4 | Keep rule per backend column, in order: at least 90 percent of labeled rows measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and a flip rate of at most 0.10 over three option orders |
| D5 | One `choice` per row over `P0`, `P1`, `P2` and `not_a_finding` in three left rotations. The state never holds the finding id. Jev receives only registries published at `origin/main` |
| D6 | The reread order and a one-`noul` validity funnel are reported per column and never decide. A keep serves nothing and never writes a severity |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` without `--jev` or `--deem` exits 0 and prints `registries:`, `findings:`, `transitions:`, `p0 rows:`, `phrases:` and `labels needed:`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] `--write-label-sheet` with a path inside the repository exits 2 and writes nothing. With `--jev --deem --out <dir>` and a labels file holding 19 negatives the script prints `stop: fewer than 20 labeled P0 negatives` and both stub logs stay empty. At 20 negatives a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`, and a stub `jev` whose `auth status --provider official` exits 3 gives `jev arm skipped: no credential`
- [x] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-severity-replay.vitest.ts` exits 0 with at least 22 passed tests and 0 failed
- [x] The phase closed on `stop: fewer than 20 labeled P0 negatives` or `no headroom`, or one live `--deem --out <dir>` run printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` with its commit pair and wrote a `calls.jsonl` in which no line holds a finding id
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
- [x] `validate_document.py` exits 0 on every changed skill doc, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12, `../001-deep-research/research/research.md` section 11 `### R10.` and `../004-deep-research-expansion/research/research.md` C27 and row 50 |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-30: the design and the briefs in `scratch/w4-build/briefs/`, run by the CLI executors of parent D5. The design ran on Devin `deepseek-v4-1-flash-max` before its daily quota ran out; code steps c1 to c7 and every code fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`, each checked by the test file, and d8 to d15 ran on Pi MiMo at `high`, written from `scratch/w4-session/docs/facts.txt`. Committed as `2239858286`, 16 files, not pushed. Source: `SE` sections 1, 3 and 5 |
| Baseline | Done | The runtime suite after 028 held 126 files and 2,456 tests; the final suite holds 127 files and 2,489 tests, this phase's one file and its 33 tests more, with no failure. Source: `SE` section 2 |
| Session verification from the final state | Done | With logging stubs first on `PATH`: the default run exits 0 in 3 s with `registries: 413`, `findings: 2771 (P0 96, P1 1298, P2 1377, other 0)`, the transition lines, `p0 rows: 95 in 37 registries (one 21, two or more 16)`, `labels needed: 20 P0 negatives among 95 P0 rows`, the baseline, question, margin, keep rule and power lines, and `stop: fewer than 20 labeled P0 negatives`; the stub log was never written. `--jev --deem --out <dir>` adds only `jev arm skipped: label gate` and `deem arm skipped: label gate`, calls no stub and writes only `report.json`; `--deem` without `--out` exits 2 before any call. `--write-label-sheet` refuses a path inside the repository with exit 2 and writes 95 empty-label rows outside it. `git status --porcelain` was equal before and after and the key grep exits 1. Source: `SE` section 2 |
| Tests | Done | `score-severity-replay.vitest.ts` prints `Tests 33 passed (33)`, against the floor of 22, and the runtime suite prints 127 files passed and 2,489 tests passed with no failure. Source: `SE` section 2 |
| Label gate stop recorded | Done | The final-state default run printed `stop: fewer than 20 labeled P0 negatives`, the accepted end of this build under parent D4 and parent criterion 2. Source: `SE` sections 2 and 6 |
| Docs and packages | Done | Eight docs landed (briefs d8 to d15) and `validate_document.py` exits 0 on each; `sync-skills-hermes.cjs` regenerated the Hermes copy and the session staged it; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3` with the new hub digest; the catalog package added one `packet_history_metadata` warning on the new F058 entry, a line every runtime entry carries; the playbook package printed `PASS ... scenarios=57 ... violations=0`, one scenario more than 028's 56; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`. Source: `SE` sections 1 and 4 |
| Review and fixes | Done | Code, read by Pi MiMo: `VERDICT: PASS`, REQ-001 to REQ-010 met, REQ-011 not checked, 6 P2. Docs, read by DeepSeek on Cline: `VERDICT: FAIL`, 1 P1 and 6 P2; the P1 closed by f1 (Pi MiMo) and the id-shape comment by c8f (DeepSeek), both rechecked `VERDICT: PASS`. The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `2239858286` feat(deep-loop): the script, its test, the eight docs, the Hermes copy and the three recompiled contracts, 16 files with both re-minted activation manifests, not pushed; the staged set passed the key grep (exit 1) and after the commit `compiled-route-guard.cjs` lists `system-deep-loop` fresh. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-30: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, corrected the `convergence.md` citation and the executor roster, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. A label-sheet path outside the repository, at least 20 labeled P0 negatives, then a live Deem run and a Jev run on the operator's yes. 2. The six P2 findings below. 3. A served form needs a later phase and the operator's call. Source: `SE` section 6 |
| Retired (2026-10-03) | Done | Phase 051 retired this feature on its last measurement: `verdict jev: stop (margin) K=95 M=95 A=73 B=73 W=7 L=7 F=7 p=0.6047`, run `~/.skilled/.labels/runs/050-029-jev-20261003`, Pi 380 (285 severity, 95 funnel), CLI 0. The CLI pair read `stop (margin) A=76 B=73` (`050-029-clipair-20261003`), the same line as the 2026-10-01 run. A keep needs at least 83 of 95 against the recorded severity's 73. Catalog entry F058, its index entry and playbook scenario DLR-058 now say retired, and the script and its tests stay as the record. This closes items 1 and 3 under Open for the operator. The P2 findings stay recorded and are not chased. Source: `../050-pi-default-review/002-feature-review-and-remeasure/goal.md` section 4; `../051-followups/spec.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Seam check (2026-09-29) | Every R10 citation resolves with no drift: `deep-review/references/protocol/completion-criteria.md:61-63` (severity coverage, `riskScore`, adversarial replay), `:75` (verdict logic) and `runtime/lib/blinded-adjudication/mode-adapters.ts:59` (`legacy-canonical-shadow-only`), `:63-72` (`createDeepReviewAdjudicationRequest`) |
| Census preview | Counted by this leaf with `node` over `git ls-files`: 412 registries, 2,852 findings, 95 at P0 in 36 registries (17 with two or more), 44 transitions into P0 at discovery and 0 out of P0. Over 3,270 tracked review iteration files, grok-04's five phrases hit 0, 1, 1, 1 and 1 files, none a rejected finding |
| Seam check correction (2026-09-30) | The seam row above named only the citations that still resolve. Design section 1 rechecked every R10 citation and found one moved: `convergence.md:398-400` to `:399-401`, because 398 is the table separator and the P0 to P2 description rows are 399 to 401. `spec.md` REQ-008 now cites `:399-401`. Source: `../w4-build/design.md` section 1; this closure pass |
| Census drift (2026-09-30) | The preview row above was recounted at design time and by the final run: 413 registries (not 412), 2,771 findings (not 2,852), 96 P0 objects deduped to 95 rows in 37 registries (not 95 in 36), 47 transitions into P0 and 0 out (not 44), 3,270 iteration files. Every count is computed at run time, so the preview is context, not a premise. Source: `SE` section 2; `../w4-build/design.md` section 1 |
| Executor substitution | The design ran on Devin `deepseek-v4-1-flash-max` before its daily quota ran out. Code steps c1 to c7 and every code fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`, each checked by the test file; the docs d8 to d15 ran on Pi MiMo at `high`. Source: `SE` section 1; `notes.md` |
| Fix c2f (test only) | Design section 3's `no headroom` case (30 rows, 28 real) could not pass the label gate first, since 2 negatives are fewer than 20. Ruling 5 and c2f use K 201, 20 negatives and 181 real (1810 > 1809). Source: `../w4-build/rulings.md` 5; `SE` section 1 |
| Fix c5f (test only) | c5 failed 1 of 27 with `ReferenceError: stubs is not defined` in a case table. c5f fixed the test only. Source: `SE` section 1; `notes.md` |
| Comment fix c8f | The docs review rated a JSDoc comment that gave `P2-001` as an example of an id shape at P2. Its reason was sound and the hygiene checker passed it, but the repository bans finding ids in code comments and an id-shaped literal falls in that class. c8f (DeepSeek, the code's author) keeps the reason without the literal; recheck `VERDICT: PASS`. The session had ruled the other way after the code review and this reverses that ruling. Source: `SE` section 3 |
| Docs review P1 closed | REQ-011 wants `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each to name the script, the gate and both switches, and the hub sentence on `SKILL.md:111` named only the script. f1 (Pi MiMo) rewrote it and its recheck covers all six docs, `VERDICT: PASS`. Source: `SE` section 3 |
| P2 findings recorded, not chased (parent D5) | 1. The `USAGE` comment says the line prints whenever the run cannot start, but nothing prints it. 2. A timed-out or exit-1/4 `jev auth test` stops as `usage error` and logs `unmeasured`, where REQ-009 gives `unmeasured_timeout` past 90 s. 3. `recorded` ranks only rows carrying a P0 probability, not the registry's own order. 4. The label-sheet refusal is lexical, not realpath, so a symlink into the tree gets past it. 5. The `an unreadable registry exits 2` test asserts only the `loadRegistries` throw, never `main`'s exit 2. 6. One of the 95 P0 rows comes from a test fixture registry under `deep-review/scripts/tests/fixtures/`. Source: `SE` section 3 |
| Completion rows amended at close | T017 is an operator item, because the label sheet goes to a path the operator names outside the repository. The `tasks.md` completion rows now carve out T017 beside T018, as parent D4 leaves the sheet path and every label to the operator. No goal criterion wording changed. Source: this closure pass; parent `goal.md` D4 |
| No build-evidence.md | The build left no `../w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header; this closure pass |
| Premise corrections at close | `spec.md`'s Status, description, handoff row, deliverables and Files to Change rows now record the build; `plan.md`'s roster states parent D5 and its step 6 records the gate stop; `tasks.md`'s notation carries the closure record. Recorded by this closure pass |
| Live Jev run (2026-10-01) | The operator said yes in chat to a live run on the labels phase 042 wrote (operator-delegated, parent D4). Jev passed its check, so only the Jev arm ran (parent D1). `score-severity-replay.cjs --labels ~/.skilled/.labels/029-labels.jsonl --jev --out ~/.skilled/.labels/runs/029-jev-20261001`, exit 0: `gate: open K=95 negatives=22`, `planned calls: 381`, 381 lines in `calls.jsonl`, `column jev: K=95 measured=95 unmeasured=0 p_loss=0.8867 latency_p50_ms=322 latency_p95_ms=381`, `verdict jev: stop (margin) K=95 M=95 A=76 B=73 W=7 L=4 F=6 p=0.2744 jev_version=0.6.2 provider=official model=jev-1.13.0`. Jev gets 76 of 95 right against the recorded severity's 73, under the 10% margin, so the reread order stays as built. The labels and the run output stay outside the repository |
<!-- /ANCHOR:log -->
