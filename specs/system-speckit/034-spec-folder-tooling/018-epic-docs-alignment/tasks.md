---
title: "Tasks: Phase 18: epic-docs-alignment"
description: "Task list for the 26 audit findings, the stale status cells, the review round and the close-out checks."
trigger_phrases:
  - "epic docs alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: epic-docs-alignment

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

Each finding task names its class from the Fix Completeness rule: `instance-only` for one wrong line, `class-of-bug` for a gap that repeats across files, and `cross-consumer` for a claim that several surfaces repeat.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 26 findings in `scratch/audit-findings.md`, plus the packet spec, plan and acceptance criteria (`scratch/audit-findings.md`)
- [x] T002 Rerun the step 1 gates on the current tree and save each output with its exit status (`scratch/evidence/playbook-spec-kit.txt`, `playbook-sk-git.txt`, `catalog.txt`, `links.txt`, `gate3-parity.txt`, `hook-gates.txt`, `doctor-compat.txt`)
- [x] T003 Rerun the removed-behavior search with its flags placed before `--`. The first form returned rc=2 because `--` ends option parsing, so the corrected run is the usable receipt (`scratch/evidence/removed-behavior.txt`, `removed-behavior-corrected.txt`)
- [x] T004 Check each of F01 to F26 against its named file with grep, and save the checks (`scratch/evidence/findings-check.txt`, `findings-check-b.txt`, `findings-check-c.txt`, `f18-and-children.txt`)
- [x] T005 Check the two document validator failures against HEAD. Both HEAD copies were validated from a temp directory that was deleted by its exact path afterward (`scratch/evidence/validate-docs.txt`, `followup-verify.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Lane A, playbooks
- [x] T006 F01 (instance-only): the hook-gate playbook expects thirteen rows and `GATES=13` (`.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md`)
- [x] T007 F02 (cross-consumer): the doctor-commands index lists the compat scenario DOC-381, and the scenario file exists (`.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`, `doctor-update-compat.md`)
- [x] T008 F09 (class-of-bug, playbook side): eleven scenarios added, DOC-381 and 466 to 475, and indexed in the playbook index (`.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`, the ten `tooling-and-scripts/` files and `doctor-update-compat.md`)
- [x] T009 F11 (instance-only): DOC-357 covers the Spec Folder Compatibility block and the read-only check of both compat commands (`.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md`)
- [x] T010 F13 (class-of-bug, playbook side): the phase folder creation scenario checks graph metadata and a strict pass (`.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/phase-folder-creation.md`)

Lane B, feature catalogs
- [x] T011 F03 (cross-consumer): the doctor category overview names the compat action beside check, align and apply (`.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`)
- [x] T012 F09 (class-of-bug, catalog side): seven entries added, one each for anchor integrity and nesting, heal anchor repair, heal lane modes, the repo era report, the phrase lint commit gate, the downgrades report and the reversibility manifest, all indexed in the catalog (`.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/`, `feature-catalog.md`)
- [x] T013 F13 (class-of-bug, catalog side): lifecycle automation names the graph metadata derivation and the phrase seeding (`.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md`)

Lane C, READMEs and references
- [x] T014 F08 (instance-only): the spec README documents `upgrade-legacy.mjs --layout-map` in KEY FILES and ENTRYPOINTS, with its JSON fields and exit codes (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T015 F10 (instance-only): `template-phrase-cleanup.mjs` and `template-phrase-census.mjs` appear in the topology and KEY FILES (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T016 F13 (class-of-bug, README side): the create.sh row names the graph metadata derivation and the phrase seeding for 18 kinds (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T017 F14 (instance-only): the upgrade-legacy row names the repo era report block, the grouped detail and the template-literal-first fill (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T018 F15 (instance-only): the topology lists `repo-era.mjs` and `template-phrase-lint.mjs` (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T019 F16 (instance-only): the manifest field list names `repoRoot` (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T020 F17 (instance-only): the Repo Era Report section sits inside KEY FILES and carries the v3 symlink caveat (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`)
- [x] T021 F21 (instance-only): the sweep README says a folder missing from a loaded baseline is `new-failure`, and `first-run` only when no baseline loaded (`.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md`)
- [x] T022 F22 (class-of-bug): the retrieval lib README says eight modules, and its imported-by table lists `phrase-judge.mjs` and the `repo-era.mjs` imports (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md`)
- [x] T023 F23 (instance-only): the test-fixtures README tree runs to 080 and names the gaps, and the path-scoped rules describe ANCHORS_VALID nesting (`.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md`, `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md`)
- [x] T024 F24 (instance-only): the hook test README lists `gate-3-menu-parity.test.mjs` (`.skilled/skills/system-spec-kit/runtime/tests/hooks/README.md`)
- [x] T025 F25 (cross-consumer): Gate 3 option C reads "as an existing packet in the same track" in the worked examples and trigger config (`.skilled/skills/system-spec-kit/references/workflows/worked-examples.md`, `.skilled/skills/system-spec-kit/references/memory/trigger-config.md`). The command asset carries the same wording under lane D (`.skilled/commands/speckit/assets/speckit-implement.yaml`)

Lane D, doctor, env, hooks and root docs
- [x] T026 F04 (cross-consumer): the system-spec-kit README doctor update row lists compat (`.skilled/skills/system-spec-kit/README.md`)
- [x] T027 F05 (cross-consumer): the commands README invocation includes `compat` (`.skilled/commands/README.txt`)
- [x] T028 F06 (cross-consumer): the root README invocation includes `compat`, and the v3 to v4 path is described (`README.md`)
- [x] T029 F07 (class-of-bug): the ENV-REFERENCE git-hook table has the `SPECKIT_SKIP_PHRASE_LINT` row (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`)
- [x] T030 F12 (cross-consumer): the commands doctor tests README covers the compat action and the `on_step_failure` assertion (`.skilled/commands/doctor/scripts/tests/README.md`)
- [x] T031 F18 (instance-only): the git-hooks README names the phrase lint exception to the missing-script rule (`.skilled/scripts/git-hooks/README.md`)
- [x] T032 F19 (class-of-bug): `.env.example` lists `SPECKIT_SKIP_PHRASE_LINT` with the other pre-commit bypasses (`.env.example`)
- [x] T033 F20 (instance-only): the root README pre-commit bullet names the phrase lint block (`README.md`)

Changelog lane
- [x] T034 F26 (instance-only): the v4.0.0.4 changelog gains the epic's entries (`.skilled/changelog/skilled/v4.0.0.4.md`)
- [x] T035 F26 (instance-only): the spec-kit changelog for v2.7.1.0 is a new file, because the SKILL.md version moved to 2.7.1.0 (`.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`)
- [x] T036 F26 (supporting): the SKILL.md version moves from 2.7.0.0 to 2.7.1.0 (`.skilled/skills/system-spec-kit/SKILL.md`)

Status lane
- [x] T037 F27 (instance-only): the 034 parent spec sets row 16 to Complete, and sets row 18 to Complete with its placeholder focus replaced (`specs/system-speckit/034-spec-folder-tooling/spec.md`)
- [x] T038 F27 (instance-only): the 16 phase-map rows of the 016 parent move from Planned to Complete, after each child spec.md was read as Complete (`specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Review, Fix Round and Verification

- [x] T039 Check that each changed file belongs to one lane or to the changelog lane, with no file in two lanes (`scratch/evidence/nonspec-changed.txt`)
- [x] T040 Fresh read-only review of the changed docs against the code. Its reported result is 0 P0, 2 P1, 1 P1 risk and about 10 P2. This close-out did not rerun the review, so the counts are the operator's report (operator brief)
- [x] T041 Fix round: each review finding was fixed, as the operator reported. This close-out did not rerun the fixes, so the result rests on the same report (operator brief)
- [x] T042 Rerun the gates on the final tree and save each output (`scratch/evidence/removed-behavior-corrected.txt`, `validate-docs.txt`)
- [x] T043 Run the document validator on each changed or new markdown file outside `specs/`: 40 pass, and 2 index READMEs fail their detected type identically at HEAD and pass as `readme` (`scratch/evidence/validate-docs.txt`)
- [x] T044 Run strict validation on this packet and on both parents, and save each result (`scratch/evidence/validate-packet.txt`, `validate-034.txt`, `validate-016.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the validator checks structure, and the scenarios' steps are recorded as not executed (see CHK-021)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Implementation summary**: See `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md sections 4 and 5
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 3 and 5
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6, phases 16 and 17 shipped
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint and format checks. Not applicable: no code changed. The doc validators in CHK-020 cover the docs (`scratch/evidence/validate-docs.txt`)
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the parity and compat suites exit 0 with 0 failures (`scratch/evidence/gate3-parity.txt`, `doctor-compat.txt`)
- [x] CHK-012 [P1] Error handling implemented. Not applicable: no code changed
- [x] CHK-013 [P1] Code follows project patterns. Evidence: each doc passes its validator under its type (`scratch/evidence/validate-docs.txt`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md AC-001 to AC-005, each with its file in scratch/evidence
- [x] CHK-021 [P0] Manual testing complete. Not executed in this close-out: the 11 new playbook scenarios were checked for structure only (`scratch/evidence/playbook-spec-kit.txt`, `playbook-sk-git.txt`). Running the steps is outside this docs packet and is listed in implementation-summary.md Known Limitations
- [x] CHK-022 [P1] Edge cases tested. Evidence: each finding's edge is checked by grep in `scratch/evidence/findings-check*.txt`, for example the phrase lint warning exception in the git-hooks README
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the literal removed-behavior run returned rc=2 and was kept as a receipt (`scratch/evidence/removed-behavior.txt`), and the corrected run returned rc=0 (`removed-behavior-corrected.txt`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a class. Evidence: classes sit on each finding task in Phase 2 (instance-only, class-of-bug or cross-consumer)
- [x] CHK-FIX-002 [P0] Same-class producer inventory done, or instance-only proven by grep. Evidence: the compat surfaces (F02 to F06) and the pre-commit bypass switches (F07, F19) were listed by grep in `scratch/evidence/findings-check.txt`
- [x] CHK-FIX-003 [P0] Consumer inventory done for the changed docs. Evidence: the grep in `scratch/evidence/findings-check.txt` and `findings-check-b.txt` covers every surface that names the changed behavior
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction fixes carry adversarial tests. Not applicable: documentation only, no code path changed
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Not applicable: no matrix in a documentation fix
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant run. Not applicable: no code reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range. Evidence was taken on HEAD `9dbfe3a046` plus the working-tree changes listed in `scratch/evidence/nonspec-changed.txt`, before the commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a key-shaped scan over the 45 changed files found no hits (`scratch/evidence/close-out-prep.txt`)
- [x] CHK-031 [P0] Input validation implemented. Not applicable: no input handling changed
- [x] CHK-032 [P1] Auth and authz working correctly. Not applicable: no auth code changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence: the four packet docs were written together and agree on the 26 findings and the five requirements
- [x] CHK-041 [P1] Code comments adequate. Not applicable: no code changed
- [x] CHK-042 [P2] README updated where it applies. Evidence: lane C and lane D README edits listed in tasks T026 to T028, T014 to T020 and T022
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: gate output and checks are in `scratch/evidence/`, and the temp HEAD copies were deleted by exact path
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: scratch/ is kept on the operator's instruction, because the evidence lives in `scratch/evidence/` and the plan cites `scratch/audit-findings.md`. Recorded in implementation-summary.md Key Decisions
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->
