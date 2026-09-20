---
title: "Feature Specification: Phase 3: containment-on-failed-lanes"
description: "Write containment runs for every lane immediately after its process ends, before the failure, missing-artifact, stop-policy and salvage gates decide the verdict, so a failed lane's out-of-scope writes are reported and quarantined too."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: containment-on-failed-lanes

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
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 13 |
| **Predecessor** | 009-baseline-deletion-detection |
| **Successor** | 011-restore-never-through-symlink |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Remediate the deep review findings on the fan-out write containment hardening specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The containment block ran only after every verdict gate passed. A lane that exited non-zero, timed out, or produced no artifacts threw at a gate first, so its out-of-scope writes were never compared, quarantined or reported, exactly where evidence matters most. The deep review rated it P1.

### Purpose
Every lane's writes are contained and reported, whatever its outcome; the verdict is decided afterwards and never changed by a containment finding.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Moving the containment step (snapshot comparison, quarantine, ledger events, contention drain) to the point where the lane process ends, in the same lifecycle step that stops the pollers
- Two stub-lane tests: non-zero exit and missing artifacts, both with an out-of-scope write

### Out of Scope
- The gates themselves - unchanged and still rethrow
- The advisory status for complete lanes - same logic, same result
- Retry attempts - each attempt's process end runs containment on its own pass

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Containment moved into the post-process lifecycle step, ahead of log saving, salvage and every verdict gate; `containmentFindings` still feeds only the post-gate advisory status |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | New describe block with two stub-lane tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Containment runs after the lane process ends regardless of exit code, artifacts or salvage outcome, and its ledger events and quarantine record are written before any gate rethrows |
| REQ-002 | A failed lane stays failed; a containment finding never changes a verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A complete lane's advisory path is unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The non-zero-exit test fails against the unmodified runner with no containment event, and passes after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Containment cost on a lane that will be retried | Low | One pass per attempt, each retained under its own pass directory |
| Risk | A containment error masking the lane's real failure | Low | The containment step never throws; the gates run after it unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No extra git calls; the same pass, earlier

### Security
- **NFR-S01**: A failed lane's writes are quarantined with the same canonical, per-pass writer

### Reliability
- **NFR-R01**: Verdict gates are byte-for-byte unchanged
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Non-zero exit with a stray write: violation event, quarantine record, lane failed
- Zero exit, no artifacts, stray write: same
- Complete lane with a stray write: advisory as before

### Error Scenarios
- Timeout: the process end still runs containment
- Salvage failure: containment already recorded

### State Transitions
- Partial completion: covered, that is the point
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One runner lifecycle move, one test file |
| Risk | 10/25 | Lane lifecycle ordering in the shared runner |
| Research | 3/20 | Finding located by the review |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


