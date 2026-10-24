---
title: "Goal: Phase 4: template-section-fill-guidance"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template section fill guidance goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance"
    last_updated_at: "2026-10-23T14:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: template-section-fill-guidance

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every core template section tell a weak model exactly what to write, and keep the hand-written examples aligned with the templates.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each `## ` section carries one `<!-- FILL: instruction GOOD: example WEAK: example -->` line immediately below the heading. |
| D2 | Every good and weak pair is about the same feature: a `--quiet` flag on `recommend-level.sh`. |
| D3 | An optional section may be deleted when it does not apply. A required section gets `N/A` and one reason. |
| D4 | The example drift guard delegates anchor comparison to `runtime/cli/utils/template-structure.js compare`. |
| D5 | The 14 example documents in the alignment table are aligned by the contract output. No example is regenerated, because each carries content. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run runtime/cli/tests/template-fill-guidance.vitest.ts` prints `Tests  16 passed (16)`
- [x] `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` prints `Tests  12 passed (12)` without `-u`
- [x] `bash runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`
- [x] The awk crossing command in `plan.md` section 3 prints nothing on every `.tmpl` under `templates`
- [x] `diff scratch/baseline/anchor-counts.txt scratch/baseline/anchor-counts-after.txt` prints nothing
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance --strict` prints `RESULT: PASSED`
- [x] `git status --porcelain` lists only the files in `spec.md` section 3 and this phase folder (read as the diff against `scratch/baseline/status-start.txt`, per AC-007: the start status already held phase 001 scratch leftovers and the conductor-owned parent `goal.md`)
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
| Phase opened | Done | Start commit `f333faaf9a`. T000: `rg -c YOUR_VALUE_HERE core/spec.md.tmpl` printed 61 and `locator-form.txt` holds `TOKEN=61`, so the post-003 locator form applies (phase 003 closed as `8b60bfc041`). |
| T002 start suite | Done | Fresh full suite, `suite-start.txt` last line `exit=0`. Vitest summaries: 276 passed of 279 files and 4162 tests passed in the first run, 181 passed of 184 files and 2067 tests passed in the second. |
| T003 anchor baseline | Done | 16 lines in `anchor-counts.txt` and `anchor-lists.txt`, identical to the frozen table (`diff` against a copy of the table printed nothing). |
| T004 golden baseline | Done | `Tests  12 passed (12)` before any edit. |
| T005 guards and fill test | Done | Three files written from the `tasks.md` blocks, `bash -n` exit 0, `chmod +x` applied. |
| T006 failing first | Done | `failing-first.txt` holds `fill test: 16 failed` and `drift guard: description holds an HTML comment tail`. Vitest printed `Tests  16 failed (16)` on the unedited tree. |
| T007 lane A | Done | `rg -c` printed 24 for `spec.md.tmpl` and 18 for `plan.md.tmpl`. Crossing command printed nothing. Level 2 render `open=10 close=10`. |
| T008 lane B | Done | `rg -c` printed tasks 22, implementation-summary 6, and addons acceptance 3, before-after 5, debug-delegation 5, decision-record 1, goal 4, handover 5, research 20, resource-map 11, roadmap 4, timeline 3 (61). Research Level 2 render `open=9 close=9`. |
| T009 lane C | Done | 14 example files aligned. `check-example-drift.sh` printed `EXAMPLE_DRIFT_OK`. |
| T010 golden refresh | Done | `-u` run `Tests  12 passed (12)`. Mutation probe `Tests  1 failed \| 11 passed (12)` and `exit=1`. After restoring and a second `-u` for the review fix, the plain run printed `Tests  12 passed (12)`. `git diff --name-only` on the snapshot folder printed one path and `rg -c '^exports\['` printed 25. |
| T011 to T013 | Done | Fill test `Tests  16 passed (16)`. Drift guard `EXAMPLE_DRIFT_OK`, wrapper `Tests  1 passed (1)`. `anchor-counts-after.txt` has 16 lines and `diff` against the baseline printed nothing (exit 0). |
| T017 and T015 review | Done | Inputs in `scratch/review/`. cli-devin swe-2-max returned 9 lines, 1 P1 and 8 P2. See the findings rows below. |
| T014 end suite | Done | Fresh full suite after the review fix, `suite-after.txt` last line `exit=0`. First run 276 passed of 279 files and 4162 tests, identical to the start. Second run 183 passed of 186 files and 2084 tests, which is 2 files and 17 tests above the start (16 fill tests plus 1 drift test). FAIL lines identical between the two files. |
| T016 close | Done | Validation, acceptance rows and the implementation summary are written. The commit hash is in `git log`. |
| Planning docs audited | Fixed | `scratch/verify/report.txt` findings applied, `scratch/verify/fixed.txt` lists each one |
| Start commit | Recorded | f333faaf9abbd10f50d7ef29ff98e6a352a0f449 |

### Deviations and findings

| Item | Note |
|------|------|
| Phase numbering | The packet has nine phases. The docs work is `007-playbook-catalog-readme-alignment`, and `006-speckit-command-and-agent-alignment` owns the commands and agents. |
| Phase 002 dependency | Phase 002 rewrites the 18 leaked example descriptions, rows K-01 to K-18, before this phase runs. The drift guard's three description rules pass only on the post-002 tree. |
| Phase 003 dependency | Phase 003 converts every bare hint in the five named templates to the `[YOUR_VALUE_HERE: ...]` form. T001 records the token count and the repair blocks give both the pre-token and the post-003 locator form. |
| Fenced-code scanner hits | `check-placeholders.sh` on the planning tree reports 22 hits, all quoted template text inside fenced blocks. The scanner skips only the fence delimiter lines, not the fenced body, so the hits are a known false positive rather than an unfilled placeholder. The post-003 forms carry the token and are not counted. The remaining hits are the pre-token fallback forms in the same blocks. |
| Derived metadata refresh | After the doc edits the validator reported `SOURCE_FINGERPRINT_MISMATCH` and a stale derived description in `graph-metadata.json`. The validator's own `repair-derived.cjs --apply` re-derived `graph-metadata.json` only. No authored doc outside the allowed list changed. |
| Executors | Per the conductor, the execution agent worked lanes T007, T008 and T009 itself, one after another, and dispatched no subagent. The fill lines were inserted by a script that parses rows A01 to C61 of `plan.md` and the fix blocks S1 to S4 and R1 to R3, so the text is copied from the plan and not retyped. Wording about Task subagents, OpenCode, DeepSeek and cli-codex in the phase docs is history and was left in place. |
| S3 and S4 ordering | T007 step 2 and the S3 and S4 replacements collide, because S3 and S4 already carry the FILL lines for the four open-questions headings (A07, B13, B14, B15). S1 to S4 were applied first, then step 2 ran for every other spec heading. Spec total 24 and each heading carries exactly one FILL line. |
| Suite runs | Both suites ran fresh in the background with `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000`, about 40 minutes each. Phase 003's suite was not reused. The two vitest summaries are the count of record. The per-line check marks in the two files differ in the reporter's own selection, so they were not used as a result diff. |
| T006 locator bug | The block in `tasks.md` starts with `cd "$S" &&`, which makes every later relative `$S` path fail (`cp: No such file` on the first attempt). The block was rerun with `$WORKTREE/$S` paths. The first attempt printed `fill test: 10 failed` because `grep -c 'needs one FILL line'` counts error lines, not tests, and vitest groups repeated messages. Vitest itself printed `Tests  16 failed (16)`, so the count line now reads the vitest summary. Every one of the 16 tests failed on a missing FILL line, so the test catches the break. |
| T010 order | As the brief said, `-u` ran first, then the probe, then the restore, then the plain run. The golden test before `-u` printed `Tests  5 failed \| 7 passed (12)`, which is the stale snapshot. The mutation printed the expected `1 failed \| 11 passed (12)`, so the one-failure expectation held. The review fix changed three fill lines and a second `-u` printed `Snapshots  6 updated` and `12 passed`. |
| Counts | `rg -c` over several files prints `path:count`. Each file was counted on its own. |
| Status check | `git status --porcelain` was compared with `scratch/baseline/status-start.txt`. The parent `goal.md` is conductor-owned and is left out of the commit. |
| Anchor handoff | The operator approved that core `spec.md.tmpl` does not gain `risk-matrix` or `user-stories` anchors. The alignment table removes those two anchors from the level-3 spec example instead. This resolves phase 001 ledger rows L-A-015 and L-A-016. |
| Review attempt | One cli-devin swe-2-max dispatch (`--permission-mode auto`, `AI_SESSION_CHILD=1`) ran to completion with no rate-limit message, `T015.err` is empty. The reviewer called the line total 141 where `rg -c` gives 131, so its count is wrong. Every other statement it made was checked against the files. |
| T015 finding 1 (P1) | `core/plan.md.tmpl:## L2: ENHANCED ROLLBACK`. The applicability table in `plan.md` requires "Delete the whole section when the packet ships no deployable service" and row B21 lacked it. Confirmed by reading the table. Fixed: B21 and the template line now end with that sentence. |
| T015 finding 2 (P2) | `core/spec.md.tmpl:## L2: NON-FUNCTIONAL REQUIREMENTS`. The applicability table says "Write `N/A` and one reason, or delete the whole section" and rows B01 and B02 omitted the delete half. Confirmed. Fixed in both headings (L2 and Level 3 share the text). |
| T015 findings 3 to 8 (P2) | `L2: EDGE CASES`, `L2: COMPLEXITY ASSESSMENT`, `FIX ADDENDUM: AFFECTED SURFACES`, `L3+: Architecture Verification`, `L3+: Documentation Verification`, `L3+: Sign-Off`. These sections are optional in the contract, but the applicability table covers only five sections and none of these. Not applied. ADR-006 says every optional section may be deleted, and the contract marks 20 or more optional anchors (also phase-deps, effort, dependency-graph, critical-path, milestones, ai-execution, perf-verify and others), so a full ADR-006 pass is a wider edit than the frozen plan tables. Proposed for the operator: one sentence per optional section, in a later phase, with the optional list taken from the contract. Resolved by the amendment on 2026-10-24 for these six sections. The other optional anchors, such as phase dependencies and effort estimation, still have no escape. |
| T015 finding 9 (P2) | `examples/level-3+/implementation-summary.md` prints `out_of_order_anchor` for verification and limitations. Confirmed in `T015-contract.txt`. Not applied: it needs a content move that the frozen alignment table does not list, the guard checks only missing and extra anchors, and the order was already out of line before this phase. Recorded for the operator. Resolved by the amendment on 2026-10-24: the two sections were moved after Key Decisions. |
| Plan rows updated | Rows B01, B02 and B21 in `plan.md` section 3 now carry the same text as the templates, so the doc of record matches the shipped lines. |
| Changelog | Generated after validation with `nested-changelog.js ... --write` into `../changelog/changelog-054-004-template-section-fill-guidance.md`, as the operator decided. |
| Handoff at close | Phase 005 may assume every core `## ` section carries exactly one `<!-- FILL: ... -->` line (70 lines in the four core templates, 61 in the ten addons), the fill test pins the anchor count per level and document, and `check-example-drift.sh` exits 0 on the 21 shipped examples. Phase 006 may assume the commands and agents can name the card, the token and the guards (`check-example-drift.sh`, `template-fill-guidance.vitest.ts`). Phase 007 may assume the authoring docs describe the same three things. Open for later: whether a gate rejects a leftover FILL comment (spec 12 defers it to phase 005), and the ADR-006 sweep over the other optional sections. |
| Amendment on 2026-10-24: P2 fixes | Operator decision, 2026-10-24: "Fix now, before 009" for the seven phase 004 P2 findings that were recorded and not applied. Six fill lines gained a non-applicable escape: `L2: EDGE CASES` and `L2: COMPLEXITY ASSESSMENT` ("Write `N/A` with one reason, or delete the whole section."), `FIX ADDENDUM: AFFECTED SURFACES` ("Write `N/A` or delete the whole addendum when no fix surface applies."), and the Level 3+ `Architecture Verification`, `Documentation Verification` and `Sign-Off` sections. Plan rows B03, B05, B18, B39, B43 and B44 and five new applicability rows carry the same text, and `scratch/amend/check-plan-equals-shipped.py` printed `PLAN_EQUALS_SHIPPED` for all 70 core fill lines. The Level 3 headings `## 8. EDGE CASES` and `## 9. COMPLEXITY ASSESSMENT` keep their old text, because the contract gives them no required or optional anchor at Level 3. Example order: in `examples/level-3+/implementation-summary.md` the Verification Results and Known Limitations sections now follow Key Decisions. The sorted lines of the file are identical before and after, so it is a pure move, and the contract no longer prints `out_of_order_anchor` (count 0). DeepSeek lane: one cli-pi dispatch (`llmgateway/deepseek-v4.1-flash-1017`, `--thinking max`) failed before it wrote anything, with a 402 daily pacing allowance billing error that resets in 19 hours (`scratch/amend/B.err`, `B-result.txt`). The file was untouched, so the executor made the move from a script and wrote the file once. Checks: the golden snapshot ran `-u` (`Snapshots  6 updated`), the plain rerun printed `Tests  12 passed (12)`, and its diff holds 11 changed lines, all fill lines in their rendered levels. Fill test `Tests  16 passed (16)`. `EXAMPLE_DRIFT_OK`, wrapper `Tests  1 passed (1)`. Full suite exit=0 and `SUITE_MATCH` against phase 006 (276 files and 4162 tests in the first run, 184 files and 2085 tests in the second, the 10 FAIL lines differ only in timings). Review: one read-only cli-devin swe-2-max dispatch returned `NO FINDINGS` (`scratch/amend/review.raw.txt`). Evidence is in `scratch/amend/`. |
<!-- /ANCHOR:log -->
