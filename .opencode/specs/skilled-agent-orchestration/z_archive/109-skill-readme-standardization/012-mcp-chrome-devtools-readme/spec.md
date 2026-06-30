---
title: "Feature Specification: mcp-chrome-devtools README"
description: "Rewrite the mcp-chrome-devtools skill README in the narrative voice, leading with the dual-path browser orchestrator (bdg CLI and Code Mode MCP)."
trigger_phrases:
  - "mcp-chrome-devtools readme"
  - "mcp-chrome-devtools narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/012-mcp-chrome-devtools-readme"
    last_updated_at: "2026-06-07T12:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped mcp-chrome-devtools README via deep-context + dual-draft"
    next_safe_action: "Begin phase 013 (mcp-click-up README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-chrome-devtools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Heavy internal drift resolved to authoritative values: dropped all version lines, used SKILL.md bdg command forms, softened the contested CDP count and MCP tool count, used @latest and Node 18+"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mcp-chrome-devtools README

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
| **Phase** | 12 of 24 |
| **Predecessor** | 011-deep-review-readme |
| **Successor** | 013-mcp-click-up-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12**, the first skill in Batch C (mcp-*).

**Scope Boundary**: Only `.opencode/skills/mcp-chrome-devtools/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `mcp-chrome-devtools/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-chrome-devtools README is a tabular reference card with a table of contents and no problem-first entry point. It carries significant internal drift against the SKILL.md and INSTALL_GUIDE: a version line that disagrees across three documents, a CDP method count stated as both 300+ and 644, an MCP tool count stated as 7, 12 and 26, a pinned MCP package version against the install guide's `@latest`, a stale Node 14.x+ requirement and bdg command forms that differ from the SKILL.md quick reference.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the dual-path browser orchestrator (the fast bdg CLI and the Code Mode MCP path) and the routing rule, with every drifted fact dropped or resolved to its authoritative value.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `mcp-chrome-devtools/README.md` to the narrative skeleton; lead with the two paths and the routing rule.

### Out of Scope

- Any change to SKILL.md, INSTALL_GUIDE.md or the skill's behavior. Documentation only. (The SKILL-vs-INSTALL_GUIDE drift is noted for a later reconciliation packet.)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-chrome-devtools/README.md` | Modify | Narrative-voice rewrite of the dual-path orchestrator README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Leads with the distinctive value | QUICK START shows the bdg install plus a command and a `call_tool_chain()` MCP example; HOW IT WORKS covers the routing rule and both paths |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Drift dropped or resolved | No version line; SKILL.md bdg command forms; no contested CDP or MCP count; `@latest` and Node 18+; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The two paths, the routing rule and the command surface match SKILL.md; every cited path resolves and no contested count or version is pinned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft repeats a drifted fact (version, 300+/644, bdg shorthand) | Inaccurate README | Authoring prompt forbade each drifted value explicitly; host scanned the draft and confirmed zero leaks |
| Risk | Model cites the INSTALL_GUIDE bdg shorthand instead of SKILL.md forms | Wrong commands | Context report pinned the SKILL.md forms as authoritative; host grepped for the shorthand and found none |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence; host cross-checked counts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the README. The SKILL.md-vs-INSTALL_GUIDE command and count drift is real but out of scope here; note it for a later reconciliation packet.
<!-- /ANCHOR:questions -->
