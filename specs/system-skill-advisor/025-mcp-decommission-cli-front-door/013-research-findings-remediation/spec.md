---
title: "Feature Specification: Phase 13: research-findings-remediation"
description: "The third research reading found one live defect and one claim that does not hold. This phase fixes the defect and records the refutation, so the packet's record says which findings survived contact with the repository."
trigger_phrases:
  - "research findings remediation"
  - "compat readme stale trigger phrase"
  - "check-side residue fix"
  - "refuted research finding record"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: research-findings-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `worktrees/052-swe-2-model-cutover` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-deep-research-glm-5-3 |
| **Successor** | None |
| **Handoff Criteria** | The confirmed defect is fixed, the refuted claim is recorded as refuted, and nothing from the three readings is left unacted or unexplained |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the deep review and research over the completed MCP decommission.

**Scope Boundary**: Only the findings the research phases produced, and only those that survived verification. The research phases themselves write no shipped change, which is why their output needed a phase that does.

**Dependencies**:
- Phase 012 produced both findings
- Phase 011's findings were verified and required no repair

**Deliverables**:
- The stale trigger phrase corrected, and the key-files table completed
- A record of which research claims held and which did not

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A research finding is a hypothesis about the repository until something run against the repository confirms it. Two of the third reading's claims were checkable in seconds, and they came apart in opposite directions. One is a live defect: a compatibility test README advertises "advisor plugin bridge tests" in the machine-read `trigger_phrases` that route retrieval, while the bridge and its suites were deleted by this packet. It is precisely the class that reading says a sweep cannot catch, because a presence check sees names that remain and not coverage that departed. The other claim names a gitignore entry that does not exist in the form described, at a line that holds something else, and treats an already-repaired state as current.

### Purpose

The one defect that survived verification is fixed, and the one that did not is written down as refuted rather than quietly dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The stale `trigger_phrases` entry in the advisor's compatibility test README
- That README's key-files table, which documented two of the four suites present
- The record of which research claims held

### Out of Scope
- **The gitignore patterns.** Two `mcp-server` patterns survive and are not dead: `mcp-code-mode` still has such a directory and they serve it. Changing them would break a working ignore rule to satisfy a refuted finding
- **The residue classes the readings only described.** Reconciling three taxonomies into one is a separate piece of work, and no reading claims the classes are defects in themselves
- **The research phases' own conclusions.** They stand as written; this phase acts on them rather than editing them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/runtime/tests/compat/README.md` | Modify | Trigger phrase naming a deleted suite replaced with two naming suites that exist; key-files table completed from two rows to four |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No trigger phrase names a suite that was deleted | The phrases name only suites present on disk |
| REQ-002 | The refuted claim is recorded with the evidence that refuted it | This packet states what was checked and what it returned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The README's key-files table covers every suite in its own directory tree | Four rows for four files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The compatibility suites still pass after the edit
- **SC-002**: The repository frontmatter gate reports no failures
- **SC-003**: `validate.sh --strict` on this phase reports `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Acting on a research finding that was never true | High | Both claims were checked against the tree before either was acted on; one was fixed and one was refused |
| Risk | Changing retrieval vocabulary breaks a lookup someone relies on | Low | The removed phrase named a deleted suite, so it could only ever have routed a reader to nothing |
| Dependency | The four compatibility suites on disk | Low | Listed directly rather than taken from the document being corrected |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the three residue taxonomies should be reconciled into one reference the next transport removal would find, or left as three independent readings.
- Whether anything else in the repository advertises a deleted suite in machine-read metadata; this phase fixed the one instance the research found, not the class.
<!-- /ANCHOR:questions -->

---
