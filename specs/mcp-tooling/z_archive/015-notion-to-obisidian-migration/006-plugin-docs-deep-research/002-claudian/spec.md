---
title: "Phase 006/002-claudian: Deep research to optimize the Claudian mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/claudian/* so an AI can operate the Claudian plugin more reliably at the file layer, with emphasis on the in-vault .claude/* config schemas (currently VERIFY beyond observed path strings)."
trigger_phrases:
  - "006 claudian deep research"
  - "Claudian reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Synthesized findings into synthesis.md prioritized edit table"
    next_safe_action: "Hand synthesis.md to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
      - "research/research.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-002-claudian"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/002-claudian: Claudian reference-docs deep research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 7 |
| **Predecessor** | `001-advanced-canvas` |
| **Successor** | `003-project-manager` |
| **Handoff Criteria** | `synthesis.md` written with a prioritized, evidence-cited P0/P1/P2 edit table for `references/plugins/claudian/*`, ready for the phase `009` apply pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped mcp-obsidian Claudian reference docs contained two load-bearing factual errors: they instruct operators to author/merge `.claude/mcp.json` to add an MCP server, while Claudian actively **deletes** that exact file at storage init and its own AGENTS.md forbids reading, writing, injecting, or migrating it — so following the shipped recipe produces a file Claudian removes. The docs also place `claudian-settings.json` under the legacy `.claude/` path instead of the current `.claudian/` path.

### Purpose
Research the real plugin (cloned `YishenTu/claudian` v2.2.4 repository and the installed compiled `main.js` v2.2.4) to correct the mcp.json write-vs-delete error and the settings-path error, resolve the remaining `VERIFY`-flagged config schemas (provider setup, MCP wiring, command/skill validation rules), and turn the findings into a prioritized, cited edit plan (`synthesis.md`) for phase 009, without editing any shipped doc during this research-only phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm the in-vault `.claude`/`.claudian` config schemas: `mcp.json` lifecycle, `claudian-settings.json` path and schema, `settings.json`, commands, skills.
- Confirm provider setup and MCP wiring behavior against the real plugin source.
- Correct the two P0 factual errors (mcp.json write-vs-delete; settings path) identified by this leg's own research.
- Reduce the completed 4-iteration research loop into a prioritized (`P0`/`P1`/`P2`) edit table in `synthesis.md`, citing every claim to research evidence.

### Out of Scope
- Editing, creating, or deleting any shipped doc under `references/plugins/claudian/` or `feature-catalog/plugins/claudian.md` — that is phase `009-apply-plugin-doc-recs`.
- Modifying the installed plugin or vault state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `research/research.md` | Update (this phase) | Deep-research loop output; 4-iteration progressive synthesis |
| `synthesis.md` | Update (this phase) | Fresh-reviewer prioritized edit table handed to phase 009 |
| `spec.md` | Update (this phase) | Re-leveled to Level 1 with retrospective plan/tasks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Confirm the mcp.json lifecycle against the real plugin | `research.md` confirms Claudian deletes `.claude/mcp.json` at storage init and its AGENTS.md forbids reading/writing/injecting/migrating it, citing `main.js` v2.2.4 |
| REQ-002 | Confirm the current `claudian-settings.json` path | `research.md` confirms `.claudian/claudian-settings.json` is current and `.claude/claudian-settings.json` is the legacy migration seam, citing `src/core/bootstrap/storagePaths.ts` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | Resolve remaining VERIFY-flagged config schemas | `research.md` documents the full `ClaudianSettings` schema, provider setup, and command/skill validation rules with `src/core/types/settings.ts` citations |
| REQ-004 | Rank findings into a P0/P1/P2 edit table | `synthesis.md` names `data-model.md` §5 and `workflows.md` §5 as the P0 correction targets, cites every row |
| REQ-005 | Preserve the research-only boundary | No shipped doc under `references/plugins/claudian/` or `feature-catalog/` is modified by this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` confirms both P0 factual errors (mcp.json write-vs-delete; settings path) with `main.js` v2.2.4 and source citations.
- **SC-002**: `synthesis.md` contains a prioritized P0/P1/P2 edit table naming `data-model.md §5` / `workflows.md §5` as the P0 correction targets.
- **SC-003**: No shipped doc was edited during this phase; all writes stayed inside this leg folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed plugin build `main.js` v2.2.4, matches manifest version | Version drift could invalidate confirmed schemas | Cite the exact installed version; flag re-verification if the plugin updates |
| Risk | Following the current shipped recipe actively destroys operator data (`mcp.json`) | Operators following stale docs lose their MCP config | `synthesis.md` ranks this correction P0, ahead of any additive gap |
| Risk | Settings-path error compounds with the mcp.json error | An AI reading both stale claims could target the wrong directory entirely | `synthesis.md` corrects both in the same edit-table pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The 4-iteration research loop confirmed both P0 factual errors and resolved nearly every prior `VERIFY` flag; `synthesis.md` carries the prioritized correction plan forward to phase 009.
<!-- /ANCHOR:questions -->
