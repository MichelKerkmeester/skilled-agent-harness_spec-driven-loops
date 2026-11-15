---
title: "Feature Specification: Phase 2: git-hook-review-residuals"
description: "A five-iteration deep review of the live git hooks left ten P2 findings that the phase 1 fixes do not cover: a legacy hook that passes on a checker crash, a hardcoded spec path in a machine-wide hook, a shell rules probe that disagrees with the validator, unbounded contract regexes, duplicated attribution keys, and four doc drifts."
trigger_phrases:
  - "git hook review residuals"
  - "rules probe validator parity"
  - "contract regex backtracking"
  - "authored routing manifest path"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: git-hook-review-residuals

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/075-git-hook-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-git-hook-review-fixes |
| **Successor** | 003-hook-docs-and-standards-alignment |
| **Handoff Criteria** | Every residual finding is fixed or recorded as not needing a change, the hook suites and node tests pass, and validate.sh --strict passes on this child and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the git hook review work in this packet.

**Scope Boundary**: The ten P2 findings of the 2026-10-02 deep review (`../001-git-hook-review-fixes/review/review-report.md`) that phase 1 does not fix, plus the one finding that review got wrong. Phase 1's changes are the base.

**Dependencies**:
- Phase 1 changes in worktree 075 (uncommitted).
- The deep-review report and its iteration files.

**Deliverables**:
- Code fixes for R4-P2-001, R4-P2-005, R5-P2-001, R2-P2-002, R4-P2-002.
- Doc fixes for R3-P2-001 to R3-P2-005.
- A recorded no-change verdict for R4-P2-006.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The legacy pre-commit treats a crashed comment checker as a pass. The machine-wide pre-commit names one spec packet's path, so archiving that packet breaks every routing commit. The node-free "rules declared" probe uses a different heading test and a different directory order from the validator, so the two can disagree. A contract regex can backtrack without bound. The stamper's attribution keys can drift from the template's. Four docs say things the code does not do.

### Purpose
Every gate fails closed on a crash, names no packet path of its own, and agrees with the validator, and the docs match the code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R4-P2-001: the legacy hook blocks when the checker exits with anything other than 0, 1 or 2.
- R4-P2-005: the authored routing program path is defined once, in the route layout module, and read from there by the hook, the guard and the sync tool.
- R5-P2-001: the shell probe follows the validator's resolution order and heading test.
- R2-P2-002: the validator CLI switches V8 to its linear-time regex engine when a pattern backtracks excessively.
- R4-P2-002: a test fails when the stamper's attribution keys differ from the commit template's `forbiddenKeys`.
- R3-P2-001, -002, -005: the parent acceptance criteria name `skgit.contractDir`, record re-verification at this state, and say Complete.
- R3-P2-003: the feature catalog describes the Commit-Id copy rule phase 1 shipped.
- R3-P2-004: the CI reference gate map lists the gates the hooks run.

### Out of Scope
- R4-P2-006 (the source-root block copied into nine scripts): no change. `source-root-selection.test.sh` already checks every copy byte for byte, so the review's claim that only a comment guards the invariant is wrong.
- The deep-review workflow's gateway defect: a separate system-deep-loop packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/git/pre-commit` | Modify | Block on a checker crash |
| `.skilled/bin/lib/compiled-route-layout.cjs` | Modify | Export the authored program dir |
| `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs` | Modify | Read that export |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Read that export |
| `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | Modify | Validator-parity probe |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Modify | Linear-time regex fallback |
| `.skilled/scripts/git-hooks/tests/*.test.sh`, `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Modify | Regression and drift tests |
| `../acceptance-criteria.md`, `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md`, `.skilled/skills/sk-git/references/continuous-integration.md` | Modify | Doc fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-001 | The legacy pre-commit blocks when the comment checker exits with a code other than 0, 1 or 2. |
| REQ-002 | No machine-wide hook names a spec packet path; the authored routing program dir has one definition. |
| REQ-003 | `mcg_repo_declares_rules` returns the same answer as the validator for a tab after the heading hashes, a `.sk-git/` folder without the template, and a `skgit.contractDir` that points nowhere. |
| REQ-004 | A catastrophic contract pattern finishes in under a second in `validate-message.mjs`. |
| REQ-005 | A test fails when the stamper's forbidden keys differ from the commit template's. |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-006 | The parent acceptance criteria, the feature catalog and the CI reference match the code. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every new test fails on the phase 1 state and passes after this phase.
- **SC-002**: All hook suites, the sk-git node tests and the compiled-route tests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Moving the authored path breaks the route guard in CI | Med | Run the compiled-route tests and the guard before and after |
| Risk | The V8 flag changes a regex result | Low | It only swaps engines after excessive backtracking; the shipped patterns are tested |
| Dependency | DeepSeek V4.1 Flash via cli-opencode | Implementation stalls | One change per dispatch; every diff checked before the next |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The probe change adds no process start; it stays grep and test only.

### Security
- **NFR-S01**: A hostile contract template cannot hang the commit-msg or pre-push gate.

### Reliability
- **NFR-R01**: A crashed checker never reads as a clean commit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A rules heading written `##\tEnforced rules` counts as declared, as it does for the validator.

### Error Scenarios
- `skgit.contractDir` points at a missing directory: the probe reports rules declared, so the gate runs the validator, which reports the broken contract.
- The checker is missing (exit 127) in the legacy hook: blocked, naming the exit code.

### State Transitions
- The routing program packet is archived: one constant changes, and the hook, guard and sync tool follow it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 12 files, small edits |
| Risk | 10/25 | Hooks and the route guard |
| Research | 6/20 | V8 regex fallback measured |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
