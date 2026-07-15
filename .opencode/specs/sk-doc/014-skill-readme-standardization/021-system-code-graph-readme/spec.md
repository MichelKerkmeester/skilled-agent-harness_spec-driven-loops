---
title: "Feature Specification: system-code-graph README"
description: "Rewrite the system-code-graph skill README in the narrative voice, leading with the structural half of code intelligence and the false-safe readiness contract."
trigger_phrases:
  - "system-code-graph readme"
  - "system-code-graph narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-skill-readme-standardization/021-system-code-graph-readme"
    last_updated_at: "2026-06-07T15:16:11Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped system-code-graph README via deep-context + dual-draft"
    next_safe_action: "Begin phase 022 (system-skill-advisor README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "DeepSeek verification found no stale facts; voice-only rewrite preserving the eight MCP tools, the four-value freshness model and the false-safe contract; one prose semicolon fixed in the merge"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: system-code-graph README

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
| **Phase** | 21 of 24 |
| **Predecessor** | 020-sk-prompt-readme |
| **Successor** | 022-system-skill-advisor-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21**, the first skill in Batch E (system-*).

**Scope Boundary**: Only `.opencode/skills/system-code-graph/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `system-code-graph/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-code-graph README is a tabular reference card with no problem-first entry point. Its facts are accurate (the deep-context verification found no stale claims), but it does not lead with the distinctive value: the structural half of code intelligence that answers "what does this code touch" and refuses to answer on a stale graph.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the structural index, the eight MCP tools, the false-safe readiness contract and the boundary with Grep and memory_search, preserving the verified facts and changing only the voice and structure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `system-code-graph/README.md` to the narrative skeleton, preserving the accurate facts.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/README.md` | Modify | Narrative-voice rewrite of the structural code-intelligence README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Core facts preserved | Eight MCP tools, the four-value freshness model with blocked as a refusal payload, the false-safe contract and the three workflows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Boundary correct | Structural, not text (Grep) and not spec-docs (memory_search); boots independently of mk-spec-memory; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The tools, the freshness model, the false-safe contract and the boundary match SKILL.md and the schemas; every cited path resolves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model mislabels blocked as a freshness value | Inaccurate readiness model | Authoring prompt pinned the four-value model with blocked as the refusal payload; host confirmed the draft states it correctly |
| Risk | Model invents a tool or path | Broken reference | Host verified all cited paths resolve and the eight-tool set matches the schemas |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence; verification found no stale facts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The tools, the readiness model and the boundary verified during the gather.
<!-- /ANCHOR:questions -->
