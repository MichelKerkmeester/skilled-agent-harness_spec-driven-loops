---
title: "Feature Specification: Retry a git call that lost an index.lock race with another session, and record on the ledger when one still failed"
description: "A git call inside write containment that loses to another session's index.lock retries with backoff before failing open, and an exhausted retry is recorded on the fan-out ledger as a warning naming the command."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retry a git call that lost an index.lock race with another session, and record on the ledger when one still failed

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `../spec.md` |
| **Predecessor** | `../003-publish-manifest-provenance/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every git call in the containment guard returned an empty result on any non-zero exit and discarded stderr, and every caller read empty as a clean tree. A neighbouring session holding `.git/index.lock` for a moment therefore made a snapshot or a detection silently empty, indistinguishable from a genuinely clean checkout.

### Purpose
Lock contention is waited out, and when it cannot be, the loss is visible on the ledger instead of looking like a clean tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A retrying git spawn in the containment module, retrying only index.lock losses
- A module-level drain of exhausted losses, and ledger warnings from the runner after each containment call
- Tests for the waited-out lock, the exhausted budget, and the ledger warning

### Out of Scope
- Other non-zero git exits - they are not transient and keep failing open on the first attempt
- The lane verdict - contention never changes it
- Git's own behaviour under a held lock - noted below as a test limitation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | `spawnGit` retries index.lock losses with 250, 500, 1000, 2000 ms backoff; the two direct hash-object spawns use it; `drainGitContentionWarnings()` exported |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Drains after each snapshot and the enforce call; appends `containment_git_contention` warnings to the ledger |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Two new tests with a real held lock |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | One stub-lane test asserting the ledger warning |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A git call whose stderr names index.lock retries with bounded backoff; a call that fails for any other reason returns on its first attempt exactly as before |
| REQ-002 | A call that spends its whole budget is recorded with its argv and attempt count, retrievable once through a drain |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The runner drains after each containment call and appends a `containment_git_contention` warning per entry; the lane's verdict is unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A lock held for two seconds no longer yields an empty snapshot
- **SC-002**: A lock held past the budget yields exactly one ledger warning and the lane completes
- **SC-003**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Retry stalls the loop | Low | The budget sums to under four seconds; unrelated failures never retry |
| Risk | Apple Git 2.50 skips the status refresh under a held lock, so `git status` does not reproduce the fatal on this machine | Med | Tests hold a real lock and shim only `git status` to emit the fatal; `git checkout` reproduces it for real and goes through the same wrapper |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No delay unless a call actually loses to index.lock; worst case under 4.5 s per call

### Security
- **NFR-S01**: The recorded command is git's argv, nothing more

### Reliability
- **NFR-R01**: Fail-open is preserved; the guard never throws on contention
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty stderr: no retry
- Lock released between attempts: the retry returns the real result
- Drain called twice: the second returns nothing

### Error Scenarios
- Spawn error: returned on the first attempt, never retried
- Lock held past the budget: fail-open result plus one recorded loss

### State Transitions
- Partial completion: contention during the pre-dispatch snapshot leaves the lane running
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two runtime files, two test files |
| Risk | 10/25 | Every containment git call passes through the new wrapper |
| Research | 5/20 | Git's lock semantics had to be checked against the source |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


