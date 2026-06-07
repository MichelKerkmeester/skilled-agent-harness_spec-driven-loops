---
title: "Feature Specification: system-spec-kit README"
description: "Restyle the system-spec-kit README into the narrative voice while keeping its reference-manual depth: reframe the top, sweep HVR, drop the version footer, preserve every reference block."
trigger_phrases:
  - "system-spec-kit readme"
  - "system-spec-kit narrative restyle"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/023-system-spec-kit-readme"
    last_updated_at: "2026-06-07T17:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped system-spec-kit README restyle; Batch E complete 3 of 3"
    next_safe_action: "Begin phase 024 (skills index README, last)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keep-depth restyle (not regenerate): reframe top + AT A GLANCE, sweep HVR (26 double-hyphen, prose semicolons, Oxford-comma lists), drop version footer, fix changelog link to directory, soften drift-prone counts (script counts, 294 features, command counts); keep verified 37 tools, 5 channels, 4 levels"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: system-spec-kit README

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
| **Phase** | 23 of 24 |
| **Predecessor** | 022-system-skill-advisor-readme |
| **Successor** | 024-skills-index-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; depth preserved; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23**, the third skill in Batch E (system-*) and the largest README in the repo (1084 lines).

**Scope Boundary**: Only `.opencode/skills/system-spec-kit/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A restyled `system-spec-kit/README.md` in the narrative voice that keeps its reference-manual depth.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-spec-kit README is a 1084-line reference manual with functional headers, no AT A GLANCE table, a stale version footer and pervasive house-voice violations (double-hyphen separators, Oxford-comma lists, prose semicolons). Its reference content is accurate and valuable, so the fix is a voice and framing restyle that keeps the depth, not a compression or a regenerate.

### Purpose

Restyle the README into the narrative voice while keeping its reference-manual depth. Reframe the top with an AT A GLANCE table and a problem-first OVERVIEW, sweep the house-voice violations across the body, drop the version footer, fix the stale changelog link and soften drift-prone counts, while preserving every verified reference block (the 37 MCP tools, the five-channel search, the four documentation levels, configuration, troubleshooting and FAQ).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Restyle `system-spec-kit/README.md` to the narrative voice, keeping the reference depth and correcting the stale facts.

### Out of Scope

- Any change to SKILL.md, ARCHITECTURE.md or the skill's behavior. Documentation only. The ARCHITECTURE.md ADR-007 cascade-order staleness is a separate fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/README.md` | Modify | Narrative-voice restyle that keeps the reference-manual depth |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README leads with the narrative framing | AT A GLANCE table as section 1, problem-first OVERVIEW, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Reference depth preserved | The 37 tools, five channels, four levels, configuration, troubleshooting and FAQ all retained |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, double-hyphen separators, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Stale facts corrected | Version footer dropped, changelog link points to the directory, drift-prone counts softened; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The 37 tools, the five channels, the four levels, the env vars and every reference block match SKILL.md and the source; every cited path resolves.
- **SC-003**: No prose double-hyphen separators, em dashes, semicolons or Oxford-comma lists remain.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Regenerating loses dense reference accuracy | Wrong error codes, schema details, env vars | Preserve the body in place, sweep HVR only; do not regenerate the reference content |
| Risk | HVR sweep misses an instance | Inconsistent voice | Host mapped all 26 double-hyphen and the Oxford-comma lines up front, then re-scans after the sweep |
| Dependency | deep-context gather in `context/` | Grounds the verification | Two-iteration sweep with cited evidence; 37 tools verified against tool-schemas.ts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The tool count, the levels, the env vars and the stale facts resolved during the gather.
<!-- /ANCHOR:questions -->
