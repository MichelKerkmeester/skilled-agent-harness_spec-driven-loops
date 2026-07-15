---
title: "Feature Specification: skills index README"
description: "Rewrite the .opencode/skills/README.md index in the narrative voice with a family-organized catalog of all 22 skills, fixing the stale count and the system-code-graph miscategorization."
trigger_phrases:
  - "skills index readme"
  - "skills library index rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-skill-readme-standardization/024-skills-index-readme"
    last_updated_at: "2026-06-07T19:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped skills index README; packet 135 complete 24 of 24"
    next_safe_action: "Packet 135 complete; no further phases"
    blockers: []
    key_files:
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Index runs last so it reflects the 22 rewritten child READMEs; catalog sourced from their verified one-liners; fixes the stale 21-count, the system-code-graph structural-not-semantic and system-not-mcp miscategorization, and drops per-skill version pins"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: skills index README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 24 |
| **Predecessor** | 023-system-spec-kit-readme |
| **Successor** | none (final phase) |
| **Handoff Criteria** | Index passes validate_document.py --type readme and HVR; every skill link resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24**, the final phase of the packet. It runs last so the index reflects the 22 child READMEs rewritten in phases 002 to 023.

**Scope Boundary**: Only `.opencode/skills/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the 22 rewritten skill READMEs (their verified one-liners are the catalog).

**Deliverables**: A rewritten `.opencode/skills/README.md` index in the narrative voice.

**Changelog**: The packet is covered by the v3.5.0.3 system-spec-kit changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skills index is a tabular reference card that has drifted: it counts 21 skill folders when there are 22, miscategorizes system-code-graph as a semantic-search MCP skill, lists it twice in the structure tree, references a non-existent skill, and pins per-skill version numbers that age immediately.

### Purpose

Rewrite the index in the narrative voice with a family-organized catalog of all 22 skills, each linking its own rewritten README, fixing the stale count and the system-code-graph miscategorization, preserving the routing and skill-creation guidance, and dropping the brittle counts and version pins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `.opencode/skills/README.md` to the narrative skeleton with the family catalog, correcting the stale facts.

### Out of Scope

- Any SKILL.md, skill behavior or code change. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/README.md` | Modify | Narrative-voice rewrite of the skills library index |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Index follows the narrative template | AT A GLANCE first, problem-first OVERVIEW, a family catalog, no table of contents |
| REQ-002 | Index passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Catalog complete and correct | All 22 skills in five families, each linking its README; system-code-graph is structural and in system-* |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Index is HVR-clean in prose | No prose em dashes, double-hyphen separators, semicolons, Oxford-comma lists or banned words |
| REQ-005 | Stale facts corrected | 22 not 21, no per-skill version pins, no duplicate or phantom skill entries; every skill link resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: Every skill link resolves and the catalog matches the 22-folder, five-family set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model repeats the stale system-code-graph semantic-search claim | Wrong categorization | Authoring prompt pinned the structural/system-* correction; host verifies the merged draft |
| Risk | A skill link does not resolve | Broken catalog | Host checks every `<skill>/README.md` link after the merge |
| Dependency | The 22 rewritten child READMEs | Source of the catalog one-liners | All shipped in phases 002 to 023 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The skill set, the families and the stale facts were verified against the rewritten READMEs and the directory tree.
<!-- /ANCHOR:questions -->
