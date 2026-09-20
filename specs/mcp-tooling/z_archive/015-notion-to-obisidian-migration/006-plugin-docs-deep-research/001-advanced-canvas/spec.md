---
title: "Phase 006/001-advanced-canvas: Deep research to optimize the Advanced Canvas mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/advanced-canvas/* so an AI can operate the Advanced Canvas plugin more reliably at the file layer, with emphasis on the extended .canvas JSON schema (cross-portal edge serialization is currently VERIFY)."
trigger_phrases:
  - "006 advanced-canvas deep research"
  - "Advanced Canvas reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/001-advanced-canvas"
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
      session_id: "015-006-001-advanced-canvas"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/001-advanced-canvas: Advanced Canvas reference-docs deep research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | `002-claudian` |
| **Handoff Criteria** | `synthesis.md` written with a prioritized, evidence-cited P0/P1/P2 edit table for `references/plugins/advanced-canvas/*`, ready for the phase `009` apply pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped mcp-obsidian Advanced Canvas file-layer reference docs (`references/plugins/advanced-canvas/*`) carried a `VERIFY`-flagged unknown for the cross-portal (interdimensional) edge serialization shape and told the AI to never author it. Without resolving that flag against the real plugin, an AI operating the plugin either avoids a real capability or risks corrupting a `.canvas` file.

### Purpose
Research the real plugin (repository `developer-mike/obsidian-advanced-canvas`, the official Advanced JSON Canvas spec, and the installed compiled `main.js` v6.5.4) to resolve the cross-portal edge `VERIFY` flag, confirm the extended `.canvas` JSON node/edge keys, and identify missing workflows and gotchas — then turn the findings into a prioritized, cited edit plan (`synthesis.md`) for phase 009, without editing any shipped doc during this research-only phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the `VERIFY`-flagged cross-portal (interdimensional) edge serialization shape against the JSON-Canvas spec, TypeScript typings, and `main.js` v6.5.4.
- Confirm the extended `.canvas` JSON node/edge persistent keys against the real plugin.
- Identify missing workflows, gotchas, and any new reference document worth creating.
- Reduce the completed 4-iteration research loop into a prioritized (`P0`/`P1`/`P2`) edit table in `synthesis.md`, citing every claim to research evidence.

### Out of Scope
- Editing, creating, or deleting any shipped doc under `references/plugins/advanced-canvas/` or `feature-catalog/plugins/advanced-canvas.md` — that is phase `009-apply-plugin-doc-recs`.
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
| REQ-001 | Resolve the cross-portal edge serialization `VERIFY` flag | `research.md` confirms the `interdimensionalEdges` container and the `${portalId}-${nodeId}` endpoint-ID encoding, citing the spec, typings, and `main.js` |
| REQ-002 | Confirm the extended `.canvas` JSON persistent keys | Findings name every real persistent key (including `zIndex`, `interdimensionalEdges`, `collapsedData`) against the plugin source |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | Identify missing workflows and gotchas | `synthesis.md` lists concrete doc gaps distinct from the `VERIFY` correction |
| REQ-004 | Rank findings into a P0/P1/P2 edit table | `synthesis.md` cites each row to a research finding and a target file/section |
| REQ-005 | Preserve the research-only boundary | No shipped doc under `references/plugins/advanced-canvas/` or `feature-catalog/` is modified by this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` resolves the cross-portal edge `VERIFY` flag with cited evidence (spec + typings + `main.js` v6.5.4).
- **SC-002**: `synthesis.md` contains a prioritized P0/P1/P2 edit table naming every target file, including the `feature-catalog/plugins/advanced-canvas.md` gap the research's 4-doc scope missed.
- **SC-003**: No shipped doc was edited during this phase; all writes stayed inside this leg folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed plugin build `main.js` v6.5.4 | Version drift could invalidate confirmed keys | Cite the exact installed version; flag re-verification if the plugin updates |
| Risk | No `.canvas` file with a real portal existed in the vault during research | Endpoint-ID encoding is inferred from a runtime-rewrite line, not byte-verified | `synthesis.md` marks this INFERRED and recommends capturing one real portal file before promising exact hand-authoring syntax |
| Risk | Research's 4-doc scope missed a 5th shipped file | Stale `VERIFY` claim could persist uncorrected | `synthesis.md` explicitly extends the edit table to `feature-catalog/plugins/advanced-canvas.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The 4-iteration research loop resolved the cross-portal edge `VERIFY` flag; `synthesis.md` carries the one residual caveat (endpoint-ID encoding is INFERRED, not byte-verified) forward to phase 009 as an implementation note rather than an open question.
<!-- /ANCHOR:questions -->
