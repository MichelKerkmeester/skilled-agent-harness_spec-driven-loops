---
title: "Tasks: verification and docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: verification and docs

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

**Variables.** `F` is `.skilled/commands/doctor/scripts/tests/fixtures/agents-md`. `E` is `scratch/e2e`. `D` is `.skilled/commands/doctor`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'run-all' scratch/baseline.txt` prints at least `1`.
- [ ] T002 Resolve the three documentation locations (`D/scripts/README.markdown`, the playbook, the changelog). Verify: the three resolved paths are written into `scratch/doc-locations.txt`.
- [ ] T003 Confirm children 001 to 004 pass (`specs/agents/021-doctor-agents-md/001-doctor-agents-md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Copy each fixture to a temporary directory and run the check (`E`). Verify: nine transcripts exist and each names its fixture's state.
- [ ] T005 Run the plan on every copy (`E`). Verify: each transcript carries either `NOTHING TO DO` or a plan digest.
- [ ] T006 Reconcile the two engines per fixture (`E`). Verify: every `pure` or `adopted` result pairs with `NOTHING TO DO`, and every other result pairs with a plan.
- [ ] T007 [P] Add the two manual rows at the resolved playbook location. Verify: `rg -c 'agents-md' <resolved playbook file>` prints at least `2`.
- [ ] T008 Answer both manual rows from a live session or record an unknown with its reason. Verify: each row carries either an observation or `UNKNOWN` with a reason.
- [ ] T009 Add the script README rows (`D/scripts/README.markdown`). Verify: `rg -c 'agents-md' D/scripts/README.markdown` prints at least `1`.
- [ ] T010 Add the changelog entry at its resolved location. Verify: `rg -c 'agents-md' <resolved changelog file>` prints at least `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun every baseline command from the final tree (`scratch/baseline.txt`). Verify: each prints the same pass line it printed before the work started.
- [ ] T012 Run the recursive phase gate (`specs/agents/021-doctor-agents-md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`.
- [ ] T013 Confirm the change list (`git status --porcelain`). Verify: the list names only files named by children 001 to 005.
- [ ] T014 Confirm no local-only path appears (`git status --porcelain`). Verify: `rg -n 'local-' <(git status --porcelain)` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The recorded manual answers are quoted in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Children 001 to 004 pass. Verify: the recursive gate exits 0.
- [ ] CHK-002 [P0] The baseline is recorded. Verify: `rg -c 'check-rule-copies' scratch/baseline.txt` prints at least `1`.
- [ ] CHK-003 [P1] The three documentation locations are resolved. Verify: `wc -l scratch/doc-locations.txt` prints `3`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No engine file changed in this child. Verify: `git status --porcelain -- .skilled/commands/doctor/scripts/agents-md-*.cjs` prints nothing.
- [ ] CHK-011 [P0] No route file changed in this child. Verify: `git status --porcelain -- .skilled/commands/doctor/_routes.yaml` prints nothing.
- [ ] CHK-012 [P1] Documentation rows use the family's existing heading levels. Verify: the new rows render under their existing parent heading.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] Nine transcripts exist. Verify: `ls scratch/e2e | wc -l` prints `9`.
- [ ] CHK-022 [P1] Every baseline command reran. Verify: `rg -c 'RESULT: PASSED' scratch/baseline.txt` prints at least `1`.
- [ ] CHK-023 [P1] The two manual rows carry an answer or a recorded unknown. Verify: both rows are non-empty.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No transcript carries a real consumer path. Verify: `rg -n 'Users/|/home/' scratch/e2e` prints nothing.
- [ ] CHK-031 [P0] No documentation row names a local-only skill or command. Verify: `rg -n 'local-' <the three resolved documentation files>` prints nothing.
- [ ] CHK-032 [P1] No credential appears in a transcript. Verify: `rg -ni 'token|secret|password' scratch/e2e` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The script README names the three scripts. Verify: `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints at least `1`.
- [ ] CHK-041 [P1] The changelog entry names the three targets. Verify: the entry names `check`, `embed` and `restore`.
- [ ] CHK-042 [P2] The resolved locations are recorded. Verify: `scratch/doc-locations.txt` names all three.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Transcripts live under `scratch/e2e/`. Verify: `find scratch/e2e -type f | wc -l` prints `9`.
- [ ] CHK-051 [P1] Temporary fixture copies are removed. Verify: `git status --porcelain` lists no temporary path.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
