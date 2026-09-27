---
title: "Tasks: Phase 12: goal-send-and-dedupe"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal send rule tasks"
  - "goal template cut tasks"
  - "goal nesting pointer tasks"
  - "phase 012 verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: goal-send-and-dedupe

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the operator's approval of this scope and the answer to open question 1 in `goal.md`'s log (`goal.md`). Evidence: after setting the parent goal the operator said "okay work on goal" on 2026-09-26. Open question 1 was not answered, so the recommended default holds: older parents are cut at their next amendment, with no renderer change.
- [x] T002 Rerun the baselines in `acceptance-criteria.md` (V3 12, V7 `3156 2823`, V8 11, V9 0, V10 9, V13 2, sk-create-goal tests 15 of 15, `goal-slice` tests 21 of 21) and list any `goal.md` already dirty under `specs/` for V26. Evidence: re-run during planning on 2026-09-26, all matching the scope analysis. The only dirty `goal.md` files under `specs/` were this packet's parent and child.
- [x] T003 [P] Run the advisor on "author a nested goal.md for phase 3" and keep the output, to compare after T011. Evidence: no before-run was kept. Instead the advisor source settles it: `skill_advisor_runtime.py:54` parses only `SKILL.md` frontmatter and no advisor file reads system-spec-kit's intent keywords. After the edit the prompt routes to sk-doc at 0.847, system-spec-kit 0.125.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Make section 3 the one full cut order with a first cut for legacy author instructions, rewrite section 4 as the send rule from `scratch/scope-analysis.md` section 5, delete the 3,735 figure in section 6 and bump the version (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`). Evidence: section 3 is "CUT IN THIS ORDER" with a legacy step 3, section 4 lists the five things a sent goal never contains, section 6 states 1,624, 1,004 and 956. Version 1.1.0.0, `validate_document.py` VALID, HVR 0 hard blockers.
- [x] T005 Remove the blockquote, the Operator copy section and the criteria introduction, and add the `GOAL_AUTHORING` pointer comment after `HVR_REFERENCE` (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`). Evidence: V3 prints 0.
- [x] T006 Carry the same removal and comment into each template block and rewrite each "Fixed prose" row (`.skilled/skills/sk-doc/sk-create-goal/assets/goal-*-template.md`). Evidence: V7 prints `1624 1218`. The sk-create-goal suite passes 15 of 15.
- [x] T007 Regenerate the golden snapshot and read its diff (`.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`). Evidence: one snapshot updated, 12 of 12 pass. The diff is the removed text plus the pointer line.
- [x] T008 Add the owner line, point sections 3, 4 and 5 to sk-create-goal, delete the "template carries this rule" sentence, correct section 6 and bump the version (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`). Evidence: V8 0 and V20 0. The three sk-create-goal links resolve. Version 3.12.0.0, VALID, HVR 0.
- [x] T009 Admit `/create:goal` at `:61`, drop "packet goal", "goal.md" and "nested goal" from `:160`, point `:485` to the send rule and say the objective slice is injected (`.skilled/skills/system-spec-kit/SKILL.md`). Evidence: V21 1, V22 0. `SKILL.md` VALID.
- [x] T010 [P] Point "How to Fix" to the cut order and `/create:goal` (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md`). Evidence: the link resolves from `references/validation/`.
- [x] T011 [P] Add `/create:goal` to Option D, the phase table and the quick reference, and correct the `--with-goal` fact (`references/structure/phase-definitions.md`, `phase-system.md`, `references/workflows/quick-reference.md`, `references/templates/template-guide.md`, `README.md`). Evidence: V11 shows 1 in `phase-definitions.md`, V19 prints 1.
- [x] T012 Replace the `packet_goal` precedence, budget, payload and child-rule text with pointers, and add the `/create:goal` step to `:with-phases` and Option D (`.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`). Evidence: all three parse, V10 prints 0, V11 prints 4 for plan and 4 for complete.
- [x] T013 [P] Point the resume payload to the send rule (`.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml`). Evidence: both parse.
- [x] T014 [P] Point the four "playbook order" lines to section 3 (`.skilled/commands/create/assets/create-goal-auto.yaml`, `create-goal-confirm.yaml`). Evidence: both parse, V8 prints 0.
- [x] T015 [P] Point the sk-create-goal README cut section and `parent-and-nested-goals.md:133` to sections 3 and 4, describe the playbook in `SKILL.md:156` and bump versions (`.skilled/skills/sk-doc/sk-create-goal/`). Evidence: SKILL, README and `parent-and-nested-goals.md` at 1.2.0.0.
- [x] T016 Replace the send-rule sentences with the three-sentence rule, the pointer and the authoring owner, and read the diff line by line (`AGENTS.md`). Evidence: one line changed, V13 0, V14 1. No other file carries the old sentence.
- [x] T017 Key the resend reminder on `packet_budget=ok`, keep "4000 characters" and update the assertion (`.skilled/hooks/goal/lib/goal-slice.cjs`, `goal-slice.test.cjs`). Evidence: V24 21 of 21. Cursor 15 of 15 and Devin 3 of 3 also pass.
- [x] T018 [P] Correct the `--with-goal` help and name `/create:goal` in the help and both next-step blocks, echo text only (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Evidence: `bash -n` passes, V12 prints 2, and no test pins the old text.
- [x] T019 Cut the parent goal to the new fixed text, measure it at 3,000 or fewer and resend its chat slice (`specs/sk-doc/060-create-goal-mode/goal.md`). Evidence: V16 `packet_durable_chars=2944`, `packet_budget=ok`, V15 4 of 4. The chat slice was not pasted, because the operator asked this session to stop sending goals.
- [x] T020 Regenerate the Hermes mirrors and the trigger index, and add one changelog entry each to sk-create-goal and system-spec-kit. Evidence: `sync-skills-hermes.cjs` rewrote 2 of 71 copies and `--check` passes 71. The mode changelog is `sk-create-goal/changelog/v1.2.0.0.md`. The trigger index is T030. system-spec-kit got no entry, because its changelog is one narrative file per release and this change does not open one.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run V1 to V26 from `acceptance-criteria.md` and record each result against its baseline. Evidence: every command prints its target (V1 lines 54 and 66, V3 0, V7 `1624 1218`, V8 0, V9 14, V10 0, V11 4, 4 and 1, V12 2, V13 0, V14 1, V15 4 of 4, V16 2944 ok, V19 1, V20 0, V21 1, V22 0, V23 0, V26 this packet only). The five runtime-mirror checks all pass.
- [x] T022 Compare the advisor output for the T003 prompt, and confirm or refute the `--level phase-parent --with-goal` hypothesis in a temporary folder. Evidence: both hypotheses confirmed. The advisor never reads the intent keywords, per T003. A scratch-repo `create.sh --level phase-parent --with-goal` wrote a parent goal whose placeholder row fails `SPECDOC_SUFFICIENCY_006`, which `/create:goal` now fills. The probe wrote nothing into `.skilled`, with a dirty count of 29 before and after.
- [x] T023 Run recursive strict validation on the parent, refresh the metadata and write the nested changelog at close. Evidence: `generate-description.js` and `repair-derived.cjs` refreshed this phase and the parent, recursive strict validation prints `RESULT: PASSED` for 13 folders and the nested changelog is `../changelog/changelog-060-012-goal-send-and-dedupe.md`.
- [x] T024 Correct every claim that the durable slice is injected, and name `/create:goal` where goal authoring is described (`README.md`, `.opencode/plugins/README.md`, `.skilled/hooks/goal/README.md`, system-spec-kit `README.md`, `feature-catalog/`, `references/config/hook-system.md`, `references/validation/phase-checklists.md`). Evidence: V27 prints 0 from 8, and V28 prints 4, 1 and 1.
- [x] T025 Add fix hints to `SPECDOC_SUFFICIENCY_005` and `006`, assert them, update the documented examples and rebuild the runtime `dist` (`runtime/lib/validation/spec-doc-structure.ts`, `runtime/tests/spec-doc-structure.vitest.ts`, `references/validation/validation-rules.md`). Evidence: HEAD baseline 30 of 30, after 30 of 30. The build exits 0, and `validate.sh` stopped reporting a stale orchestrator.
- [x] T026 Add the `phase-add` line to the implement workflow and correct `/spec_kit:plan` to `/speckit:plan` in the lines this phase touched (`speckit-implement.yaml`, `create.sh`, `phase-system.md`). Evidence: V29, the YAML parses and `bash -n` passes.
- [x] T027 Give `parent-and-nested-goals.md` an overview without renumbering its sections, so the section 6 pointers still hold. Evidence: VALID with 0 issues, where HEAD fails.
- [x] T028 Point the OpenCode goal test at the repository-root `specs/` (`.opencode/plugins/tests/opencode-goal-tool-path.test.cjs`). Evidence: 15 of 15, from 14.
- [x] T029 Re-mint the sk-doc route and rerun the mirror, manifest and validation gates after the follow-up edits.
- [x] T030 Regenerate the trigger index last, in a scratch worktree at HEAD with this phase's files applied, then copy the published files back (V30).
- [x] T031 Run five deep-review iterations on MiMo v2.6 Pro at high thinking and write `review/review-report.md`. Evidence: verdict CONDITIONAL, P0 0, P1 2, P2 19.
- [x] T032 State the budget boundary once in section 2, point the fifteen restatements at it and make `check-goal.cjs` use `budgetApplies` (`budget-and-handoff.md`, `check-goal.cjs`). Evidence: AC-024.
- [x] T033 Match leading comments linearly, add the `frontmatter-fence` check and the authoring rule, and carry the five-check count through the docs (`goal-slice.cjs`, `check-goal.cjs`, `authoring-standards.md`). Evidence: AC-025.
- [x] T034 Refuse an unknown leading flag, exit 1 on failure, judge a missing path by its deepest existing ancestor and keep the reminder on one line (`goal.cjs`, `goal-slice.cjs`). Evidence: AC-026.
- [x] T035 [P] Add packet path containment and the data-not-instructions rule to `/create:goal` (`goal.md`, both workflow YAMLs). Evidence: AC-027.
- [x] T036 [P] Align the mode with sk-doc: enum `contextType`, the changelog row, the compact `v1.0.0.0.md` and SCG-007's request. Evidence: AC-028.
- [x] T037 [P] Grade SCG-004 on the six-step cut order and seed SCG-005 with the asset wording. Evidence: AC-029.
- [x] T038 Re-point every moved line citation, name the objective slice in the hooks docs, re-mint the sk-doc route and regenerate only this mode's Hermes copy. Evidence: AC-030, route guard `sk-doc fresh`.
- [x] T039 Run all eight playbook scenarios on MiMo and record the run in a new dated benchmark folder (`benchmark/reports/2026-09-26--manual-testing-playbook--create-goal--review-remediation/`). Evidence: AC-031.
- [x] T040 Rewrite relative links in the Hermes skill generator and regenerate every copy whose source is committed or this phase's own (`sync-skills-hermes.cjs`, its test). Evidence: AC-034.
- [x] T041 Gate the `/create:goal` handoff on a passing goal checker, so an open finding ends the run with `STATUS=FAIL` and no chat slice (both workflow YAMLs, `SKILL.md`, `README.md`). Evidence: AC-032, SCG-005 attempt 2.
- [x] T042 Verify every goal surface on a runtime without a native goal command, and fix what the live runs expose (the OpenCode plugin, the Pi extension, the Cursor, Devin and Hermes hooks). Evidence: AC-033.
- [x] T043 Stop every Pi end-of-turn message from starting another turn (`goal-context.ts`, `completion-evidence.ts`, their tests). Evidence: AC-035.
- [x] T044 Skip a file named `AGENTS.md` in `validate_document.py` as an instruction file, with a test that fails on HEAD (`validate_document.py`, `test_instruction_file_exclusion.py`). Evidence: AC-036.
- [x] T045 Teach `validate_document.py` the surface-packet shape, keyed on WHEN THE HUB BUNDLES THIS, with a test that fails on HEAD (`validate_document.py`, `template-rules.json`, `test_surface_packet_sections.py`). Evidence: AC-037.
- [x] T046 Close the remaining issues: a `---` divider before each `mcp-tooling/SKILL.md` section with its route re-minted and its Hermes copy regenerated, the cli-pi scenario count, three semicolons in `review/review-report.md` and the frozen README manifest. Evidence: AC-038.
- [x] T047 Align the three create-goal changelogs with sk-create-changelog (`sk-create-goal/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md`). Evidence: AC-039.
- [x] T048 Write the sk-doc v2.2.0.0, mcp-tooling v1.8.0.1 and cli-pi v1.5.11.1 entries, bump every version carrier, re-mint the three routes and regenerate the three Hermes copies. Evidence: AC-040.
- [x] T049 Link every unreached skill changelog folder under `.skilled/changelog/`, and turn sk-design's single link into a folder with `parent` and one link per mode. Evidence: AC-041.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion `Met` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Scope analysis**: See `scratch/scope-analysis.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] The operator approved the scope and answered open question 1 The operator said "okay work on goal". Open question 1 took the recommended default.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The template and its three asset copies change together, and the parity test passes V4 15 of 15.
- [x] CHK-011 [P0] The pointer comment names no packet, phase or task id The comment names only the mode's `SKILL.md` path.
- [x] CHK-012 [P1] Each edited YAML parses, and only the named keys changed All seven YAMLs parse with `yaml.safe_load`.
- [x] CHK-013 [P1] `create.sh` changes are echo text only `bash -n` passes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met 41 of 41 Met.
- [x] CHK-021 [P0] sk-create-goal tests, `goal-slice` tests and the golden snapshot pass 15 of 15, 21 of 21, 12 of 12.
- [x] CHK-022 [P1] The two hypotheses in `spec.md` are confirmed or refuted with output See T022.
- [x] CHK-023 [P1] No `goal.md` outside this packet changed V26.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The budget restatements are `class-of-bug`, the budget check is `cross-consumer`, the comment match is `algorithmic`, the path, reminder and frontmatter fixes are parser and path hardening, and the doc and citation fixes are `matrix/evidence`. The CLI and YAML fixes are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. The restatement sweep found one more copy, system-spec-kit's `README.md:236`, and fixed it. V32 prints 0. The sweep for the Pi turn-end steer found one more sender, `completion-evidence.ts`, and fixed it. No other Pi extension sends at `turn_end` or `agent_end`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Two programs run `goal.cjs` outside its tests, and neither reads its exit status as failure: Pi's `pi.exec`, which resolves with a code and grades the text, and the Hermes `repo-guards` plugin, whose every call uses `check=False`. `goal-core.test.cjs` already read `error.stdout`, and `goal.test.cjs` now does too.
- [x] CHK-FIX-004 [P0] Path and parser fixes carry adversarial tests: a missing path under a symlinked parent that leaves the workspace, a folder name carrying a line break, 2,000 fence-less comments and an inner frontmatter fence.
- [x] CHK-FIX-005 [P1] Matrix axes listed: 21 findings, all 21 fixed, across seven workstreams.
- [x] CHK-FIX-006 [P1] Hostile environment variant run. `SPECKIT_GENERATOR_HARDENING=0` passes the checker and slice suites 42 of 42.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree against HEAD `fa4f76d881` for the review fixes and `05231a01ea` for the final gates. Nothing is committed yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any edited file
- [x] CHK-031 [P0] Other sessions' files are left unstaged Nothing is staged, and the diff lists only this phase's files.
- [x] CHK-032 [P1] No session-goal state is written The goal command was never run with a write action.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree
- [x] CHK-041 [P1] Every pointer names a section that says what the pointer promises Every pointer names a section whose heading matches it.
- [x] CHK-042 [P2] The P2 items in `spec.md` stay recorded, not fixed The P2 items stay listed in `spec.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Temporary measurement scripts and folders removed before completion The scratch probe repo sits in the session scratchpad, outside the repository.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---
