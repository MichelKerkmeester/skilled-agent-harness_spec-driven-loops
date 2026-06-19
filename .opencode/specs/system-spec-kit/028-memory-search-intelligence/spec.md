---
title: "Feature Specification: Memory Search Intelligence Phase Parent"
description: "Phase parent for the four subsystem research and implementation-planning tracks."
trigger_phrases:
  - "028 memory search intelligence"
  - "external memory systems research"
  - "galadriel aionforge mining"
  - "memory retrieval improvements"
  - "028 implementation phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence"
    last_updated_at: "2026-06-19T06:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Collapsed to four subsystem phase parents"
    next_safe_action: "Resume subsystem parents 001-004"
    blockers: []
    key_files:
      - "spec.md"
      - "research/roadmap.md"
      - "001-speckit-memory/research/merged-research-index.md"
      - "001-speckit-memory/spec.md"
      - "002-code-graph/spec.md"
      - "003-skill-advisor/spec.md"
      - "004-deep-loop/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-memory-search-intelligence-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Children 001-004 record their implementation child maps."
      - "Research-only phases 005-008 were folded into subsystem research archives."
      - "Packet 030 is the Wave-0 SHIPPED done-evidence record and remains intentionally separate."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Memory Search Intelligence Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-16 |
| **Updated** | 2026-06-19 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 028 owns the planning record that turns external memory-system research into implementation sub-phases for internal retrieval surfaces. Its four top-level children are subsystem phase parents so the research inputs, candidate plans and child validation state are easy to navigate.

### Purpose
Provide the root purpose, child map and cross-packet boundary for packet 028. This parent routes the four subsystem children to their implementation child maps and records packet 030 as the Wave-0 SHIPPED done-evidence record.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for packet 028 subsystem phase parents.
- Phase-documentation map updates for children 001 through 004.
- Merged research archive pointers for the removed research-only phases.
- A pointer to packet 030 as the Wave-0 SHIPPED done-evidence record.

### Out of Scope
- Editing packet 030.
- Implementing any PENDING candidate.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify | parent | Root purpose and child map |
| `description.json` | Refresh | parent | Search metadata for the parent |
| `graph-metadata.json` | Refresh | parent | Child identity and parent graph metadata |
| `001-speckit-memory/research/merged-research-index.md` | Create | 001 | Research archive routing index |
| `001-speckit-memory/spec.md` | Modify | 001 | Memory MCP subsystem phase-parent map |
| `002-code-graph/spec.md` | Modify | 002 | Code Graph subsystem phase-parent map |
| `003-skill-advisor/spec.md` | Modify | 003 | Skill Advisor subsystem phase-parent map |
| `004-deep-loop/spec.md` | Modify | 004 | Deep Loop subsystem phase-parent map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-speckit-memory/` | Spec-Kit Memory MCP research plus 21 implementation child plans | Phase parent |
| 002 | `002-code-graph/` | Code Graph research plus 8 implementation child plans | Phase parent |
| 003 | `003-skill-advisor/` | Skill Advisor research plus 7 implementation child plans | Phase parent |
| 004 | `004-deep-loop/` | Deep Loop Runtime research plus 6 implementation child plans | Phase parent |

### Phase Transition Rules

- Children 001 through 004 are subsystem phase parents. Their direct child folders own implementation specs, plans, tasks and validation evidence.
- Research-only material from former children 005 through 008 lives under subsystem `research/from-*` archives.
- Run strict validation on a subsystem parent and its direct implementation children before using it as an implementation source.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | subsystem parent | Select a subsystem from children 001 through 004 | Subsystem `spec.md` lists all direct implementation children |
| subsystem parent | implementation child | Select the next PENDING candidate group | Child `spec.md` names gate, scope and evidence |
| implementation child | root | Child reaches strict validation green | `validate.sh <child> --strict` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:wave-0-pointer -->
## 4. WAVE-0 DONE-EVIDENCE POINTER

Packet `030-memory-search-intelligence-impl` is the Wave-0 SHIPPED record for candidates already marked DONE in the 028 implementation child specs. It is intentionally separate from packet 028 and was not modified by this planning pass.
<!-- /ANCHOR:wave-0-pointer -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

- None for parent wiring. Candidate questions live in the subsystem child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Roadmap**: `research/roadmap.md`
- **Subsystem parents**: `001-speckit-memory/`, `002-code-graph/`, `003-skill-advisor/`, `004-deep-loop/`
- **Merged research index**: `001-speckit-memory/research/merged-research-index.md`
- **Graph metadata**: `graph-metadata.json`
