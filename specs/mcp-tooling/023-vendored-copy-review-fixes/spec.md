---
title: "Feature Specification: Vendored copy review fixes for mcp-click-up and mcp-figma"
description: "A deep review of the copies Product Owner vendors found 8 P1 and 16 P2 defects in mcp-click-up and mcp-figma: documented commands the CLI does not have, scripts that report success after doing nothing, repo-root lookups that only work at one folder depth and stale metadata. Fix every mcp-click-up and mcp-figma finding from that review in the shared skills, so the vendored copies can be pulled back."
trigger_phrases:
  - "vendored copy review fixes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/023-vendored-copy-review-fixes"
    last_updated_at: "2026-10-21T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Opened the fix phase"
    next_safe_action: "Apply the fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Vendored copy review fixes for mcp-click-up and mcp-figma

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `main` |
| **Parent Spec** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A deep review of the copies Product Owner vendors found 8 P1 and 16 P2 defects in mcp-click-up and mcp-figma: documented commands the CLI does not have, scripts that report success after doing nothing, repo-root lookups that only work at one folder depth and stale metadata.

### Purpose
Fix every mcp-click-up and mcp-figma finding from that review in the shared skills, so the vendored copies can be pulled back.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The mcp-click-up and mcp-figma findings recorded in Product Owner's specs/018-product-owner-deep-review phases 003 and 004
- Their tests and feature-catalog entries that restate a changed fact

### Out of Scope
- Other mcp-tooling packets
- Commits and pushes, which wait on the operator

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/mcp-tooling/mcp-click-up/ | Modify | doctor.sh, cupt add documentation, install guide, router, feature catalog, pinning |
| .skilled/skills/mcp-tooling/mcp-figma/ | Modify | tool surface, extract command, scripts, links, metadata, pinning |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Fix every mcp-click-up and mcp-figma P1 finding at its named site |
| REQ-002 | Fix every P2 finding, or record why it does not hold |
| REQ-003 | Every changed script passes a direct run or its test |
| REQ-004 | The mcp-tooling hub and both packets pass their validators |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every finding in scope is fixed or recorded with the reason it was not.
- **SC-002**: The gates that own the changed files pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | Order of work | Follow tasks.md |
| Risk | A fix changes behaviour a gate or mirror relies on | Med | Rerun the owning gates after each batch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No secrets, board URLs or Barter flows in any changed file.

### Reliability
- **NFR-R01**: Each fix is a working-tree edit to a tracked file, reverted with `git checkout -- <path>`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- A finding does not hold when its fix site is opened: it is recorded as not fixed, with the reason.

### State Transitions
- Partial batch: tasks.md shows which findings are fixed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Many small fixes across one packet tree |
| Risk | 8/25 | Docs and scripts, reversible |
| Research | 4/20 | Findings already checked |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
