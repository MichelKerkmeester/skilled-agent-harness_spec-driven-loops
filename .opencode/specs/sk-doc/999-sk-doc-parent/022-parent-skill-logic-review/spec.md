---
title: "Feature Specification: Parent-skill logic deep review"
description: "A one-round Fable-5 xhigh deep review of the parent-hub pattern — the create-skill doctrine, its four implementations (sk-doc, sk-code, sk-design, deep-loop-workflows), and the system-skill-advisor integration — to surface bugs, inconsistencies, and refinements."
trigger_phrases:
  - "parent skill logic review"
  - "999 sk-doc phase 022"
  - "parent hub deep review"
importance_tier: "normal"
contextType: "research"
parent: "sk-doc/999-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/022-parent-skill-logic-review"
    last_updated_at: "2026-07-07T15:48:20.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Dispatched Fable-5 xhigh review of the parent-hub pattern"
    next_safe_action: "Collect review-report.md; summarize; validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parent-skill logic deep review

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `sk-doc/999-sk-doc-parent` |
| **Depends On** | none |
| **Predecessor** | `021-flatten-asset-subfolders/` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent-hub (parent-skill) pattern — one advisor identity, a `mode-registry.json`, a `hub-router.json`, one `graph-metadata.json`, and nested mode/surface packets — is scaffolded by `create-skill` and implemented independently by four hubs (sk-doc, sk-code, sk-design, deep-loop-workflows) and consumed by the skill advisor. Independent implementation invites drift: divergent registry fields, one-identity-invariant violations, router/registry mismatches, and advisor-integration gaps that no single doc catches.

### Purpose
Run one exhaustive Fable-5 review (xhigh reasoning, deep-review style, single round) that reads the doctrine, the four implementations, and the advisor integration, and produces a detailed, evidence-backed report (`review-report.md`) of bugs, inconsistencies, invariant violations, and prioritized refinements.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The create-skill parent-skill doctrine (SKILL.md, `references/parent_skill/`, `assets/parent_skill/` templates).
- The four hub implementations' `SKILL.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`.
- The system-skill-advisor discovery + scorer + advisorRouting consumption of parent hubs.
- A written, prioritized (P0/P1/P2) review report with file:line evidence and a cross-hub consistency matrix.

### Out of Scope
- Implementing the fixes the review recommends (a follow-up per finding).
- Renaming/re-pointing the migrated 999 parent's other phases (operator's separate migration).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `022-parent-skill-logic-review/review-report.md` | Add | The Fable-5 review deliverable |
| `022-parent-skill-logic-review/{spec,plan,tasks,implementation-summary}.md` | Add | Level-1 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The review covers the doctrine, all 4 hubs, and the advisor | `review-report.md` addresses create-skill + sk-doc/sk-code/sk-design/deep-loop + system-skill-advisor |
| REQ-002 | Findings are evidence-backed + prioritized | Every finding cites file:line and carries a P0/P1/P2 severity |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A cross-hub consistency matrix is included | Rows = doctrine invariants/fields; columns = the 4 hubs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` exists with prioritized, file:line-backed findings + a cross-hub matrix + an advisor-integration section.
- **SC-002**: `validate.sh --strict` passes for this folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Review asserts an issue that's actually runtime-correct | False positive | Report distinguishes CONFIRMED (file:line) from SUSPECTED (needs runtime check) |
| Dependency | Fable-5 agent completion | Report is the deliverable | Single-round dispatch; summary captured on completion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Findings are analysis, not yet applied; each P0/P1 becomes a candidate follow-up phase once triaged.
<!-- /ANCHOR:questions -->
