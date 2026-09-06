---
title: "Feature Specification: Workspace Path Containment"
description: "The graph-metadata write guard classified a destination as spec-shaped and wrote it, so any path containing a specs segment was accepted - including one outside the repository. Membership is now proven against the configured roots."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Prove workspace membership in the graph-metadata write guard instead of pattern-matching a specs segment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 of 24 |
| **Predecessor** | `../010-goal-file-addon/spec.md` |
| **Successor** | `../012-repair-write-symlink-refusal/spec.md` |
| **Branch** | `scaffold/043-workspace-path-containment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`writeGraphMetadataFile` canonicalizes its destination, then asks a classifier whether the result may hold graph metadata. That classifier's containment test is `path.includes('/specs/')`. It proves the destination *looks* spec-shaped, never that it belongs to this workspace — so a destination anywhere on the filesystem satisfied it. Writing to a temporary directory outside the repository succeeded, while the guard's own error text says it refuses exactly that.

### Purpose

A write guard whose refusal means what it says: the destination is inside a configured specs root, not merely a path with the right word in it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root membership for the graph-metadata write boundary.
- A suite pinning both directions: a spec-shaped path outside the workspace, and a legitimate track symlinked into a sibling repository.

### Out of Scope
- The classifier itself. It has one caller and its looks-like-a-spec-document job is still wanted; what was missing is the membership proof beside it.
- The resume-ladder symlink-redirect gap and the repair script's scan-to-write gap. Same family, separate surfaces, tracked separately.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-server/lib/graph/graph-metadata-parser.ts` | Modify | Prove membership in a configured specs root before writing |
| `scripts/tests/graph-metadata-write-containment.sh` | Create | Pins the escape and the symlinked-track case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A spec-shaped destination outside every configured root is refused, and no file is created |
| REQ-002 | A destination inside a configured root is written as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A track symlinked into a sibling repository stays writable, because membership is measured before canonicalization |
| REQ-004 | The behaviour is pinned by a suite covering both directions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The demonstrated escape is refused and leaves nothing on disk.
- **SC-002**: Re-deriving an in-repo packet and a symlinked-repo packet both still succeed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Measuring membership after canonicalization would refuse every symlinked track | High — four sibling repositories mount their specs that way | Membership is measured on the resolved path; canonicalization stays for the parent-directory check |
| Risk | A symlink planted inside a configured root still redirects the write | Low | Creating one already requires write access to the repository; the guard's job is to stop arbitrary destinations, not to replace filesystem permissions |
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
