---
title: "Phase 006/006-meta-bind: Deep research to optimize the Meta Bind mcp-obsidian reference docs"
description: "One deep-research run (ox-alpha via cli-opencode/OpenRouter, early convergence allowed) investigating what to add, update, or create in references/plugins/meta-bind/* so an AI can operate the Meta Bind plugin more reliably at the file layer, with emphasis on resolving the VERIFY-flagged now() timestamp-expression grammar and the js action signature used by the Notion-style task-timer buttons."
trigger_phrases:
  - "006 meta-bind deep research"
  - "Meta Bind reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind"
    last_updated_at: "2026-08-22T14:00:00Z"
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
      session_id: "015-006-006-meta-bind"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/006-meta-bind: Meta Bind reference-docs deep research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | `005-notion-bases` |
| **Successor** | `007-js-engine` |
| **Handoff Criteria** | `synthesis.md` written with a prioritized, evidence-cited P0/P1/P2 edit table for `references/plugins/meta-bind/*`, ready for the phase `009` apply pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped Meta Bind docs teach a correctness bug: they stamp a button-written timestamp with `value: "=now()"`, citing it as "the documented pattern." Meta Bind has no `now()` function and no `=`-prefixed expression language — `=now()` is a Dataview convention misapplied. This appears at 10 sites across 4 of the 5 shipped files. Secondary gaps: the `js`-action signature is documented wrong, and the JS-Engine-to-Meta-Bind metadata coupling plus the "enable JavaScript" prerequisite are missing.

### Purpose
Research the real plugin (repository `mProjectsCode/obsidian-meta-bind-plugin`, id `obsidian-meta-bind-plugin`, official docs, and the installed compiled `main.js`) to resolve the `now()`-style timestamp expression grammar and the `js` inline-button action signature, confirm input-field and button-block syntax, and turn the findings into a prioritized, cited edit plan (`synthesis.md`) for phase 009, without editing any shipped doc during this research-only phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the `now()`-style timestamp expression grammar: the correct form is an `updateMetadata` action with `evaluate: true` and a plain-JavaScript `value: "new Date().toISOString()"`.
- Resolve the precise signature and options of the `js` inline-button action (script path resolution, arguments passed, coupling to the JS Engine plugin).
- Confirm input-field and button-block syntax against the real plugin.
- Identify missing workflows and gotchas.
- Reduce the completed research into a prioritized (`P0`/`P1`/`P2`) edit table in `synthesis.md`, citing every claim to research evidence.

### Out of Scope
- Editing, creating, or deleting any shipped doc under `references/plugins/meta-bind/` or `feature-catalog/plugins/meta-bind.md` — that is phase `009-apply-plugin-doc-recs`.
- Modifying the installed plugin or vault state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `research/research.md` | Update (this phase) | Deep-research loop output; progressive synthesis |
| `synthesis.md` | Update (this phase) | Fresh-reviewer prioritized edit table handed to phase 009 |
| `spec.md` | Update (this phase) | Re-leveled to Level 1 with retrospective plan/tasks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Correct the `=now()` correctness bug across every shipped instance | `research.md` confirms the `updateMetadata` + `evaluate: true` + `new Date().toISOString()` pattern, citing the official docs (`/reference/buttonactions/updatemetadata/`), and `synthesis.md` locates all 10 sites across 4 files |
| REQ-002 | Confirm the `js` inline-button action signature | Findings document script path resolution, arguments passed, and the JS Engine coupling (`engine.getPlugin(...).api`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | Confirm input-field and button-block syntax | Findings validate current shipped syntax against the real plugin, correcting any drift |
| REQ-004 | Rank findings into a P0/P1/P2 edit table | `synthesis.md` cites each row to a research finding and a target file/section |
| REQ-005 | Preserve the research-only boundary | No shipped doc under `references/plugins/meta-bind/` or `feature-catalog/` is modified by this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` resolves the `now()` timestamp expression grammar and the `js` action signature with citations to the official docs.
- **SC-002**: `synthesis.md` ranks the `=now()` correctness bug as P0 across all 10 shipped sites.
- **SC-003**: No shipped doc was edited during this phase; all writes stayed inside this leg folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed compiled `main.js` (v1.5.1) was not parsed during this run | The correction direction is confirmed, but exact `evaluate` handling and `js` file-resolution base are not byte-verified | `synthesis.md` flags a `main.js` confirmation pass as a residual pre-ship check |
| Risk | The shipped `=now()` pattern is a correctness bug an AI would faithfully reproduce | Every button-timestamp authored from the current docs silently fails | `synthesis.md` ranks this P0 and lists all 10 sites, not just the first occurrence |
| Risk | JS-Engine-to-Meta-Bind metadata coupling is undocumented | An AI cannot author a working script without this coupling | `synthesis.md` names the coupling as a required addition, cross-referenced with leg `007-js-engine` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The research resolved both VERIFY-flagged unknowns (timestamp grammar, `js` action signature); `synthesis.md` carries one residual pre-ship check forward (confirm `evaluate` handling in the installed v1.5.1 `main.js`) plus a required cross-leg reconciliation with `007-js-engine` on the metadata-write recipe.
<!-- /ANCHOR:questions -->
