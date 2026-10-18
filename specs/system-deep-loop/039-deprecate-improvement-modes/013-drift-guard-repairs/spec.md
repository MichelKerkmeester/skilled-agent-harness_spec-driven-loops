---
title: "Feature Specification: Phase 13: drift-guard-repairs"
description: "Restore the routing drift checks by recapturing the corpus baseline and making router-sync check 1b honor Git ignore rules."
trigger_phrases:
  - "routing corpus baseline recapture"
  - "router-sync ignored files"
  - "drift guard repairs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: drift-guard-repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-residual-reference-sweep |
| **Successor** | None |
| **Handoff Criteria** | The corpus gate passes at its existing floors using the child baseline, and check 1b ignores ignored files while reporting non-ignored untracked docs. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This child closes two defects found after the residual reference sweep. The routing corpus gate stops before scoring because its holdout hash points to an older corpus. Router-sync check 1b also reports an ignored cache document as an orphan.

**Scope Boundary**: Recapture the baseline into this child and repoint the workflow without changing its floors. Update check 1b to use Git ignore rules and preserve reporting for untracked docs that are not ignored.

**Dependencies**:
- The router-sync and baseline recapture lanes run in parallel.
- Their evidence is recorded in `scratch/evidence/lane-01-router-sync-ignored.txt` and `scratch/evidence/lane-02-baseline-recapture.txt`.
- The operator's decisions and starting measurements are recorded in `scratch/evidence/decision-ledger.txt`.

**Decisions**:
- D6: Both push and pull request path filters follow the baseline repoint. See [decision-ledger.txt, line 20](scratch/evidence/decision-ledger.txt#L20).
- D7: Include the two sk-code-skilled documents in scope so their check 1b guidance matches the implementation. See [decision-ledger.txt, line 23](scratch/evidence/decision-ledger.txt#L23).

**Deliverables**:
- A check 1b fix with regression coverage for ignored and non-ignored files.
- A phase-local baseline recapture, including the capture script and six baseline files.
- A workflow pointer to the new baseline with the existing thresholds.
- Reviewed lane outputs and passing verification gates.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The drift workflow still checks a corpus hash from before four retired-mode rows were removed, so its pin check stops before scoring. Check 1b walks files on disk without Git ignore rules and reports the ignored `.pytest_cache/README.md` as an orphan. The decision ledger records the failing run, local measurements and operator decisions in `scratch/evidence/decision-ledger.txt`.

### Purpose
Make both drift checks pass with a fresh baseline in this child and the current CI floors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recapture the routing corpus baseline under this child and point the workflow to it.
- Keep all corpus gate thresholds unchanged.
- Filter check 1b's filesystem walk through Git ignore rules.
- Test that ignored cache docs are skipped and non-ignored untracked docs are still reported.
- Update the two sk-code-skilled docs to describe ignored-path filtering and the shared workflow allowlist.

### Out of Scope
- Raising or lowering CI floors.
- Editing corpus rows or `scorer-eval-baseline.json`.
- Editing the archived baseline.
- Changing the playbook walker or other router-sync legs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Apply Git ignore rules to check 1b. |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify | Cover ignored files and non-ignored untracked docs. |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/README.md` | Modify | Describe check 1b ignore behavior and its regression test. |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md` | Modify | Describe check 1b filtering and its allowlist. |
| `.github/workflows/routing-registry-drift.yml` | Modify | Read the child baseline and keep the current floors. |
| `specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/scripts/capture-top3.mjs` | Create | Capture the phase-local top-3 baseline evidence. |
| `specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/baseline/` | Create | Hold the six recaptured baseline files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The drift guard reads a full baseline recaptured into this child's `baseline/` directory. | The workflow pin check accepts the new baseline and corpus scoring passes with every current threshold unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Check 1b skips Git-ignored files and continues to report untracked docs that are not ignored. | The regression test shows that an ignored `.pytest_cache/README.md` is omitted and a non-ignored untracked doc is reported. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The corpus gate scores the recaptured corpus and passes at its existing floors.
- **SC-002**: Check 1b skips ignored files and reports a non-ignored untracked doc.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Git ignore rules | The check cannot distinguish ignored files without Git. | Preserve the full filesystem walk when Git is missing or the hub is not a repository. |
| Risk | The workflow keeps reading the archived baseline. | The hash gate stops before scoring. | Review the changed baseline path and run the workflow's pin and scoring checks. |
| Risk | A recapture changes corpus metrics. | Existing floors could fail if behavior regressed. | Record raw output and compare it against the local starting measurements before closeout. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope, baseline recapture and ignore behavior are set in `scratch/evidence/decision-ledger.txt`.
<!-- /ANCHOR:questions -->

---
