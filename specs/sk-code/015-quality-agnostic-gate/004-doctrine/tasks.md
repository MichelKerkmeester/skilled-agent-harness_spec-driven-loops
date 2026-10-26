---
title: "Tasks: Phase 4: doctrine"
description: "Ordered tasks for the sk-code doctrine amendment, each naming its file and a verify command with its expected output."
trigger_phrases:
  - "phase 4 doctrine tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 4: doctrine

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

Every path and command runs from the repository root. Paths are written in full, so each verify command runs as written.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Recheck every design line this phase repeats, after the earlier phases land. Read only. Files: `.skilled/skills/sk-code/shared/references/phase-detection.md`, `.skilled/skills/sk-code/shared/references/stack-detection.md`, `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, `.skilled/skills/sk-code/shared/references/workflow-verify.md`, `.skilled/skills/sk-code/shared/references/workflow-implement.md`, `.skilled/skills/sk-code/shared/references/workflow-debug.md`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md`, the three files in `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/`, `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` and `.skilled/skills/sk-code/sk-code-quality/SKILL.md`. Record any moved line in the packet log. Verify: `rg -n "No claim about an unsupported surface" .skilled/skills/sk-code/shared/references/phase-detection.md` prints one line starting `109:`.
- [ ] T002 Confirm the earlier phases landed. Read only. Files: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` (phase 002), `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` (phase 002) and `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` (phase 003). Verify: `ls .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md .skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` names all three paths with no error.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Shared doctrine

- [ ] T003 [P] Amend Iron Law 3 at line 109 of `.skilled/skills/sk-code/shared/references/phase-detection.md` to the ADR-001 text. It names the universal floor, the runner's built-in checks and `.sk-code/quality.json`, and nothing else. Verify: `rg -n "An UNKNOWN surface gets only the universal floor" .skilled/skills/sk-code/shared/references/phase-detection.md` prints one line starting `109:`.
- [ ] T004 [P] Amend the UNKNOWN row at line 32 and order step 4 at line 49 of `.skilled/skills/sk-code/shared/references/stack-detection.md` to the same rule. Verify: `rg -n "built-in checks" .skilled/skills/sk-code/shared/references/stack-detection.md` prints two lines, starting `32:` and `49:`.
- [ ] T005 Amend the UNKNOWN row at line 122 of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, so it names the universal floor and the built-in checks. Amend the restraint citation at line 57 to cite the repository's `AGENTS.md` and `.skilled/repo-rules/` when present. Verify: `rg -n "The universal floor in sections 3 to 5" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line starting `122:`, and `rg -n "Restraint Signals table in the repository" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line starting `57:`.
- [ ] T006 Add to `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` the review-severity sentence under section 2, and the universal floor definition at the top of section 3. The floor is sections 3 to 5, and every surface gets it, UNKNOWN included. Verify: `rg -n "universal floor is sections 3 to 5|Review keeps its ids" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints two lines.
- [ ] T007 Add `### Mechanical Floor (every surface)` at the top of section 3 of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, as a table with three rows: parse failure, merge-conflict markers and credential signature. The parse row marks a plain JavaScript finding as heuristic and states that it does not block. Verify: `rg -n "^### Mechanical Floor" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line, and `rg -n "heuristic and does not block" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line.
- [ ] T008 Convert the rule lists of sections 3 (P0), 4 (P1) and 5 (P2) of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` into tables. Each table keeps every rule's wording, and each table gets a `Review severity` column that carries the ADR-003 default. Verify: `rg -c "Review severity" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints `4`.
- [ ] T009 Replace workflow step 2 at lines 131 to 140 of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`. It runs `quality-gate.cjs` on the changed files, and the comment-hygiene check stays as one of its sensors. Verify: `rg -n "quality-gate.cjs" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line numbered from 131 to 140.

### Checklists and style

- [ ] T010 [P] Retitle `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` as the SKILLED house checklist. Change the title and description at lines 2 and 3, the first two trigger phrases at lines 5 and 6, the heading at line 14 and the intro at line 16. The intro names the SKILLED condition. Verify: `rg -n "^# SKILLED House Code Quality Checklist" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints `14:`, and `rg -n "apply to all code files" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints no line.
- [ ] T011 [P] Replace the operator-private skill id with "an operator-private Webflow surface skill" in `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` at lines 37 and 57, and in `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` at line 40. Verify: `rg -l "local-" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` prints nothing, and `rg -c "operator-private Webflow surface skill" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` prints `2`.
- [ ] T012 [P] Move CHK-CSS-09 at line 65 of `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` from `[P0]` to `[P2]`. Its neighbours CHK-CSS-10 and CHK-CSS-11 stay at P1. Verify: `rg -n "CHK-CSS-09" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` prints one line starting `65:` that contains `[P2]`.
- [ ] T013 [P] Replace `Gate Result: [PASS/BLOCKED]` at lines 53 and 76 of `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` with the runner gate values `NO_BLOCKER_FOUND`, `BLOCKED`, `NOTHING_CHECKED`, `UNVERIFIED` and `ERROR`. Verify: `rg -n "Gate Result" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` prints lines starting `53:` and `76:`, and each names `NO_BLOCKER_FOUND`.
- [ ] T014 [P] Replace the two lines that name this user's projects in `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` at lines 40 and 105 with neutral pointers to the repository's `AGENTS.md`, when present. Verify: `rg -n -F "this user's projects" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints no line, `rg -n -F "project CLAUDE.md" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints no line, and `rg -n "when present" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints lines starting `40:` and `105:`.
- [ ] T015 Add one sentence above the P0 table at lines 190 to 196 of `.skilled/skills/sk-code/sk-code-quality/SKILL.md`. It links to standards section 3 at `../shared/references/universal/code-quality-standards.md`, and it says the tier rules and the P0 categories live there. In the same file, replace ESCALATE IF item 1, "Surface detection is ambiguous after reading `../shared/references/stack-detection.md`", with "A required P0 check is UNVERIFIED and only the operator can name or install its tool", because the amended Iron Law 3 no longer blocks an UNKNOWN surface. Verify: `rg -n -F 'Surface detection is ambiguous' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints no line, and `rg -n "tier rules and the P0 categories" .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints one line starting `192:`.

### Handoffs

- [ ] T016 [P] Name the runner in the handoff lines of `.skilled/skills/sk-code/shared/references/workflow-implement.md` at lines 41 and 119, and of `.skilled/skills/sk-code/shared/references/workflow-debug.md` at lines 41 and 147. Each line says the `sk-code-quality` mode runs `quality-gate.cjs` first. Verify: `rg -n "quality-gate.cjs" .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md` prints four lines, starting `41:` and `119:` for the implement file, and `41:` and `147:` for the debug file.
- [ ] T017 Amend `.skilled/skills/sk-code/shared/references/workflow-verify.md`. Line 55 states that the quality config names quality checks only, so it never supplies the verification command set. Line 56 reads the runner's `gate`, `checker_outputs` and `unverified` fields, and any field that still reads `PENDING_AGENT_JUDGMENT`. It hands back to quality when the gate is not `NO_BLOCKER_FOUND`, and it names the three readers of the run verdict: this step, the @code RETURN `Quality Gate` field and `sk-code-review` as input evidence. Line 47 keeps its wording, and line 55 keeps "before claiming anything", so phase 005 can confirm both lines unchanged in meaning. This phase is the only one that edits `workflow-verify.md` (ADR-004). Verify: `rg -n "never supplies" .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line starting `55:`, and `rg -n "checker_outputs" .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line starting `56:`.

### Versions and changelogs

- [ ] T018 Bump the frontmatter `version` in eleven files: `phase-detection.md`, `stack-detection.md`, `code-quality-standards.md`, `workflow-verify.md`, `workflow-implement.md`, `workflow-debug.md` and `universal-checklist.md`, all under `.skilled/skills/sk-code/`, then `naming-init-formatting-and-css.md`, `overview-header-and-comments.md`, `verification-quick-reference-and-related.md` and `code-style-guide.md`, all under `.skilled/skills/sk-code/sk-code-quality/`. Each moves one patch step above its value at T001. Verify: `rg -n "^version:" .skilled/skills/sk-code/shared/references/phase-detection.md .skilled/skills/sk-code/shared/references/stack-detection.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/shared/references/workflow-verify.md .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints a version above its T001 value for each of the eleven files.
- [ ] T019 Bump the package versions and write their changelogs. Files: `.skilled/skills/sk-code/SKILL.md` line 5, `.skilled/skills/sk-code/hub-router.json` line 3, `.skilled/skills/sk-code/mode-registry.json` line 3 and `.skilled/skills/sk-code/description.json` line 4, each from its value at T001, which is 3.3.0.0 once phases 001 to 003 land, so one patch step gives 3.3.1.0. Then `.skilled/skills/sk-code/sk-code-quality/SKILL.md` line 5, from its value at T001 (1.7.0.0 once phases 001 to 003 land), and `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` line 5, from 2.0.1.0 to 2.0.2.0. Each package that changed gets one new real file in its own `changelog/` folder, named for its new version. Symlinks are not allowed. Verify: `rg -n "^version:" .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints three values, each above its starting value, and `rg -n "\"version\"" .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/description.json` prints the same new hub value in each file.
- [ ] T020 Write the packet changelog entry `changelog-015-004-doctrine.md` in `specs/sk-code/015-quality-agnostic-gate/changelog/`. This file sits outside this folder and is written only at landing. Verify: `ls specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-004-doctrine.md` prints that path with no error.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Ask `sk-code-review` to confirm each row of the review-severity column in `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` against `.skilled/skills/sk-code/sk-code-review/references/review-core.md` section 2. Record each changed row in ADR-003 with the reviewer's reason. Verify: the review reply names every row, `rg -c "Review severity" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` still prints `4`, and ADR-003 lists every changed row.
- [ ] T022 Run the document validator on each changed Markdown file. Files: the eleven edited docs, `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` and the three new changelog files. Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` exits 0 for each file.
- [ ] T023 Run the drift-guard umbrella, then scan the changed doctrine for credential values. Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, and its last line reads `run-all-drift-guards: all 4 guards PASSED`. The baseline at authoring time was that line with 10 non-blocking warnings. Also `rg -n "AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}" .skilled/skills/sk-code/shared .skilled/skills/sk-code/sk-code-skilled/assets/checklists .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist` prints no line.
- [ ] T024 Confirm released changelog entries did not change. Verify: `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git diff --numstat HEAD -- .skilled/skills/sk-code/changelog .skilled/skills/sk-code/sk-code-quality/changelog .skilled/skills/sk-code/sk-code-skilled/changelog` prints no row whose second column is not `0`.
- [ ] T025 Refresh the derived packet metadata. Files: `description.json`, `graph-metadata.json` and this folder. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/sk-code/015-quality-agnostic-gate/004-doctrine --apply` exits 0.
- [ ] T026 Run the strict packet validator after T025. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/004-doctrine --strict --no-recursive` prints `RESULT: PASSED` as its last line, with `Errors: 0`.
- [ ] T027 Fill `implementation-summary.md` with the files, the commands and their results. Set each acceptance row to `Met` only with its observed evidence. Files: `specs/sk-code/015-quality-agnostic-gate/004-doctrine/implementation-summary.md` and `specs/sk-code/015-quality-agnostic-gate/004-doctrine/acceptance-criteria.md`. Verify: `rg -n "^\| AC-" specs/sk-code/015-quality-agnostic-gate/004-doctrine/acceptance-criteria.md` prints all sixteen rows, and each Status cell reads `Met`.
- [ ] T028 Check that the scratch folder holds only its placeholder file. Verify: `ls -A specs/sk-code/015-quality-agnostic-gate/004-doctrine/scratch` prints `.gitkeep` only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T021 review confirmation and T027 evidence)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`, whose AC rows give the grep forms for each task
- **Decisions**: See `decision-record.md` for ADR-001 to ADR-004
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-014 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (sections 1 to 3)
- [ ] CHK-003 [P1] Dependencies identified and available. Phases 001 to 003 are not landed. Checked by T002
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] This phase changes no code file. `git diff --name-only HEAD` lists only `.md` and `.json` paths for the doctrine change
- [ ] CHK-011 [P0] N/A. No code runs in this phase, so no console output exists to check
- [ ] CHK-012 [P1] N/A. The phase adds no code, so no error handling changes
- [ ] CHK-013 [P1] Each edited doc keeps its own heading and table shape, checked by T022
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-016)
- [ ] CHK-021 [P0] Manual testing complete. `sk-code-review` confirmed the review-severity column (T021)
- [ ] CHK-022 [P1] Edge cases tested. The empty-input case in spec.md is covered by AC-001 and AC-004
- [ ] CHK-023 [P1] Error scenarios validated. A reviewer change to a row is recorded in ADR-003 (T021)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class. The findings in the packet log are: class-of-bug for the operator-private id, cross-consumer for Iron Law 3 and instance-only for the CHK-CSS-09 severity.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete. Seven other tracked files name the operator-private id. They are listed in the open questions as outside this phase.
- [ ] CHK-FIX-003 [P0] The consumer inventory for Iron Law 3 covers `stack-detection.md`, `workflow-verify.md` and `sk-code-quality/SKILL.md`. Checked by T004 and T017. The UNKNOWN escalation line in `sk-code-quality/SKILL.md` is checked by T015.
- [ ] CHK-FIX-004 [P0] N/A. The phase changes no parser, path or redaction code. The parser floor is built by phase 002.
- [ ] CHK-FIX-005 [P1] N/A. The phase has no matrix axes.
- [ ] CHK-FIX-006 [P1] N/A. The phase reads no process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence cites the landing commit, not a branch range. Checked at landing.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. The signature grep in T023 prints no line
- [ ] CHK-031 [P0] N/A. The phase adds no input path
- [ ] CHK-032 [P1] N/A. The phase adds no auth or authorization path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same lines, requirements and AC rows
- [ ] CHK-041 [P1] N/A. The phase adds no code comment
- [ ] CHK-042 [P2] N/A. No README sits in the changed set
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The design source sits outside the repository, and nothing from it is copied into the tree
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Checked by T028
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

