---
title: "Feature Specification: Prove the targets, the rules and the gallery from the final state"
description: "Prove the whole packet from its final state, reconcile every document that now describes a corpus that has changed, and correct the parent packet that still claims completion while carrying active children."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Prove the targets, the rules and the gallery from the final state

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `010-corpus-expansion-and-gallery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four children changed the corpus from twenty-one forms with placeholder figures to twenty-six with
believable ones, a pointer resolver on every mark-carrying file, three new corpus rules and a
generated gallery. Several documents now describe a corpus that no longer exists, and the parent
packet still reads `Complete` although it acquired a phase parent with five children after it
closed.

### Purpose

Every claim in the packet matches what the corpus does, proven from the final state rather than
from the state each child left.

### Non-Goals

- Any further change to the corpus. This child proves and reconciles; it does not build.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The corpus gate run from the final state, after every child has landed.
- Reconciliation of every document that describes a corpus which has since changed.
- Strict validation across the phase parent and all five children.

### Out of Scope
- Any further change to the corpus. This child proves and reconciles; it does not build.
- The deferred items other children recorded. They are carried forward, not closed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../spec.md`, `../plan.md` | Modify | Parent status reconciled and the phase map extended |
| every child's generated metadata | Modify | Rebuilt from final content |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state, after every child has landed. |
| REQ-002 | Every rule this packet added has been watched failing on a deliberate mutation and restored byte-identically. |
| REQ-003 | `validate.sh --strict` is clean across the packet and every child. |
| REQ-004 | The parent packet's status is reconciled: it may not claim completion while carrying children that changed the corpus after it closed. |
| REQ-005 | Nothing is pushed or merged, and the working state is reported exactly. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Corpus gate `RESULT: PASSED`, 0 errors, from the final state.
- **SC-002**: Each of `pointer-reach` and `gallery` watched failing, restored, re-passed.
- **SC-003**: `validate.sh --strict` clean for the phase parent and all five children.
- **SC-004**: No document in the packet contradicts another about what the corpus contains.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
