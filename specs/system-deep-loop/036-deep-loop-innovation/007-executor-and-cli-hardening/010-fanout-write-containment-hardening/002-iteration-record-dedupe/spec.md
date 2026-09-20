---
title: "Feature Specification: Deduplicate iteration state records by iteration and prefer the routed record, so a completed lane is not rejected"
description: "The forced-depth validator collapses duplicate iteration records before checking the set, and the deep-research references no longer instruct a direct write to the state log."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deduplicate iteration state records by iteration and prefer the routed record, so a completed lane is not rejected

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
| **Predecessor** | `../001-never-fatal-untracked/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two of four research lanes, on two executor kinds, finished all three iterations and were still rejected with `duplicate state records for iterations: 1,2,3,1,2,3`. The leaf appended each record directly and again through the append gateway, because three reference lines told it to write the state log itself.

### Purpose
A completed lane is never rejected for recording an iteration twice, and no reference instructs a direct write to the state log.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deduplication of iteration records by number inside `forcedDepthIterationViolation`, preferring the copy that carries route-proof fields
- The four reference lines that instructed a direct append to `deep-research-state.jsonl`
- Unit tests for the tolerated duplicate, the still-detected gap and the still-fatal duplicate file on disk

### Out of Scope
- The append gateway itself - it already writes a correct record
- Duplicate iteration files on disk - an extra artifact stays a violation
- The reducer - it reads the log through its own path and is unchanged

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `retainIterationRecords` collapses repeated iteration numbers; the validator checks the collapsed set |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Two replaced assertions and two new tests |
| `.opencode/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | Modify | Iteration step names the append gateway |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | Config-record and resume-event steps name the append gateway |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md` | Modify | Audit-event sentence names the append gateway |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Regenerate | Recompiled because it digests the two protocol docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Iteration records with the same number collapse to one before the 1..cap set check, retaining the copy with route-proof fields and otherwise the first |
| REQ-002 | A log with a genuine gap still fails with the expected-set message; a duplicate iteration file on disk still fails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | No reference under deep-research/references instructs a direct write to the state log |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 1,2,3,1,2,3 log with routed and unrouted copies validates and the routed copies are retained
- **SC-002**: Both retained real lineages replay to no violation at cap 3
- **SC-003**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A duplicate masks a missing iteration | Low | The gap test proves 1,2,2 at cap 3 still fails |
| Dependency | Route-proof fields on gateway-written records | Green | Fallback retains the first copy when neither carries them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One pass over the state records; no extra I/O

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: The validator never throws on malformed records; non-iteration records are skipped as before
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty log: unchanged, returns null
- All copies unrouted: the first copy is retained
- Duplicate files on disk: still a violation

### Error Scenarios
- Gap plus duplicate (1,2,2 at cap 3): fails with the expected-set message
- Out-of-range record: still fails the set check

### State Transitions
- Partial completion: not affected; the validator runs at settle time
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function, four docs, tests |
| Risk | 8/25 | Settle-time validator on the shared runner |
| Research | 4/20 | Root cause established by the parent's research |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


