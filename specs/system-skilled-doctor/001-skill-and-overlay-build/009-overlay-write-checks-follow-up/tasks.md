---
title: "Tasks: Phase 9: overlay-write-checks-follow-up"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "overlay write checks follow up tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: overlay-write-checks-follow-up

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Each Phase 2 task is one brief to one DeepSeek V4.1 Flash agent at max thinking. The tag after the task id names its source: `R` plus a number is the review's Skilled item, `H` plus a number is the handover's item.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the fresh review (`research/fable-review.md`). Verify: `wc -l research/fable-review.md` prints 103.
- [x] T002 Read Barter's open handover at Barter commit `12f3cd4d4` and confirm the review's two headline claims. Verify: `gh run list --branch main --limit 25` shows `3b787637e1 failure Skill Doc Frontmatter`.
- [x] T003 Capture the baseline. Verify: `node --test tests/` in `.skilled/commands/doctor/scripts` printed `tests 1100`, `fail 0`, and the hook test file printed `tests 19`, `fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 R1 Cut the trigger phrases to 8 (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: the frontmatter check the Skill Doc Frontmatter workflow runs exits 0 on that file.
- [x] T005 H1 Take over a lock whose pid is dead (`overlay-engine.cjs`, `acquireLock`). Verify: tests for a dead pid, a live pid, no pid and a malformed lock pass.
- [x] T006 H2 Record layout link targets and retarget an own link (`overlay-engine.cjs`, `planLayoutLinks`, `applyLayoutLink`, the state writer). Verify: tests for an own link, a foreign link and a state file without the new key pass.
- [x] T007 H3 Record appended and inserted items and remove a dropped one (`overlay-engine.cjs`, the `json-entry` writer). Verify: tests for a dropped item, a hand-edited dropped item and a kept item pass.
- [x] T008 R4 Make `**/` match whole segments (`overlay-engine.cjs`, `globToRegExp`). Verify: a test shows `a/**/x.json` matching `a/x.json` and `a/b/x.json` and not `a/my-x.json`.
- [x] T009 R5 Leave `repin.exclude` paths alone under strict writes (`overlay-engine.cjs`, `strictWriteRefusal`, `stagedUnownedChanges`). Verify: a guard test and a commit check test on an excluded path print `allow`.
- [x] T010 R7 Compare normalised content in the commit check (`overlay-engine.cjs`, `stagedUnownedChanges`). Verify: a test stages a CRLF copy of an upstream LF file and `pre-commit` exits 0.
- [x] T011 H6 Flag a stale root-file overlay in `status` (`overlay-engine.cjs`). Verify: a test changes the upstream root file and `status` prints one line for it and exits 1.
- [x] T012 H4 List off-layout sources in `status` (`overlay-engine.cjs`). Verify: a test with one off-layout source reads one line and an unchanged exit code.
- [x] T013 H4 Add relayout as `apply --relayout` (`overlay-engine.cjs`). Verify: tests move a file, a directory, a `json-entry` and a `marked-section` with its base, and a present target exits 2 with nothing moved.
- [x] T014 R6 Add `status --audit` (`overlay-engine.cjs`). Verify: a test lists one unowned differing file and one missing upstream link, and lists nothing owned or generated.
- [x] T015 H5 Add the OpenCode adapter (`.skilled/hooks/overlay-guard/opencode/`). Verify: its test refuses an unowned write, allows an owned one and stays inert with no manifest.
- [x] T016 R8 Add the four groups of missing tests (`tests/overlay-engine-strict-writes.test.cjs`). Verify: the file's test count rises and `fail 0`.
- [x] T017 R9 Rejected with evidence: CI already runs the `overlay-guard` tests. The OpenCode Plugin Tests workflow collects every `node:test` file under `.skilled/hooks`. Verify: its run on `c57b7e4cef` printed `Collected 78 node:test hook files` and concluded `success`.
- [x] T018 Bring the command documents in line (`overlay.md`, `_routes.yaml`, `assets/doctor-overlay-*.yaml`, `assets/doctor-overlay-presentation.txt`, `command-contract.json`, `references/overlays.md`, `overlay-guard/README.md`, `.skilled/commands/README.txt`, `README.md`). Verify: `route-validate.sh` ends with `OK: route-validate` and the contract test prints `fail 0`.
- [x] T019 R10 Add playbook scenarios (`.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/`). Verify: `validate_document.py` prints `VALID` for each new file.
- [x] T020 Write the Barter handover (`handover-to-barter.md`). Verify: it names the four Barter items and the two deferred risks.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Rerun every gate. Verify: `node --test tests/` prints `fail 0`, `route-validate.sh` ends with `OK`, `sync-runtime-mirrors.cjs --check` prints `PASS` and `quality-gate.cjs` prints `"p0_blocking": 0`.
- [x] T022 Commit and push the implementation. Verify: `git ls-remote origin refs/heads/main` names the new commit and the Skill Doc Frontmatter run on it concludes `success`.
- [x] T023 Run `/deep:review` for 5 iterations on this phase. Verify: the `review/` folder holds 5 iteration records.
- [x] T024 Have a fresh Opus agent at high effort write the synthesis. Verify: the report exists in `review/` and lists each finding with a severity.
- [x] T025 Plan and fix each P0 and P1 finding, one brief per fix. Verify: `implementation-summary.md` lists each as fixed with a command or rejected with evidence.
- [ ] T026 Run `/local-skilled-alignment` on the work. Verify: its report lists 0 open findings.
- [ ] T027 Update the `v4.0.2.1` entry and write the `system-skilled-doctor` v1.1.6.0 note. Verify: `check_changelog_shape.py` prints `PASS` for both.
- [ ] T028 Commit, push, then delete and republish the `v4.0.2.1` tag and release. Verify: on origin the tag and `main` name one commit, and the release body equals the built notes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-017.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, state keys, docs and tests
- [ ] CHK-FIX-004 [P0] Path and lock fixes include adversarial tests
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile global-state variant executed where code reads process-wide state
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] N/A: no authentication or authorization is involved
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
