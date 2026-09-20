---
title: "Phase 006/004-dataview: Deep research to optimize the Dataview mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/dataview/* so an AI can operate the Dataview plugin more reliably at the file layer, with emphasis on DQL/DataviewJS query patterns and frontmatter conventions for AI-authored queries."
trigger_phrases:
  - "006 dataview deep research"
  - "Dataview reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/004-dataview"
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
      session_id: "015-006-004-dataview"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/004-dataview: Dataview reference-docs deep research

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
| **Phase** | 4 of 7 |
| **Predecessor** | `003-project-manager` |
| **Successor** | `005-notion-bases` |
| **Handoff Criteria** | `synthesis.md` written with a prioritized, evidence-cited P0/P1/P2 edit table for `references/plugins/dataview/*`, ready for the phase `009` apply pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped mcp-obsidian Dataview reference docs are a disciplined file-layer contract but are materially thin on the query language itself: the DataviewJS API section documents roughly 5 methods against the plugin's real ~30+, and two existing statements (inline-field multiline continuation, and an implied fixed DQL command-resolution order) are contradicted by the plugin's actual behavior.

### Purpose
Research the real plugin (`blacksmithgu/obsidian-dataview` repository and official documentation) to confirm DQL grammar, DataviewJS API surface, and frontmatter/inline-field conventions most relevant to an AI authoring queries against migrated notes, then turn the findings into a prioritized, cited edit plan (`synthesis.md`) for phase 009, without editing any shipped doc during this research-only phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm DQL query grammar, command ordering (written-order execution, not a fixed resolution order), and source-combination syntax.
- Confirm inline-field and frontmatter type-inference rules, including the multiline-continuation contradiction.
- Expand DataviewJS API coverage beyond the 5 currently-documented methods (Query, Render, Markdown-string, Utility, Query-evaluation, DataArray, File-I/O surfaces).
- Reduce the completed research iterations into a prioritized (`P0`/`P1`/`P2`) edit table in `synthesis.md`, citing every claim to research evidence.

### Out of Scope
- Editing, creating, or deleting any shipped doc under `references/plugins/dataview/` or `feature-catalog/plugins/dataview.md` — that is phase `009-apply-plugin-doc-recs`.
- Modifying the installed plugin or vault state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `research/research.md` | Update (this phase) | Deep-research loop output; progressive synthesis across iterations |
| `synthesis.md` | Update (this phase) | Fresh-reviewer prioritized edit table handed to phase 009 |
| `spec.md` | Update (this phase) | Re-leveled to Level 1 with retrospective plan/tasks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Correct the inline-field multiline-continuation claim | `research.md` confirms an inline-field value is terminated by the line break, and multiline text is possible only via the YAML frontmatter pipe (`\|`) |
| REQ-002 | Correct the implied fixed DQL command-resolution order | `research.md` confirms DQL data commands execute in written order and may be duplicated, contradicting the shipped fixed-order claim |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | Expand the DataviewJS API surface | `synthesis.md` organizes the ~30+ real methods by surface group (Query, Render, Markdown-string, Utility, Query-evaluation, DataArray, File-I/O) with a worked example each |
| REQ-004 | Rank findings into a P0/P1/P2 edit table | `synthesis.md` cites each row to a research iteration/finding and a target file/section |
| REQ-005 | Preserve the research-only boundary | No shipped doc under `references/plugins/dataview/` or `feature-catalog/` is modified by this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` resolves both P0 contradictions (multiline inline-fields; DQL command order) with citations to the official docs.
- **SC-002**: `synthesis.md` contains a prioritized P0/P1/P2 edit table, headlined by the DataviewJS API expansion as the single largest gap.
- **SC-003**: No shipped doc was edited during this phase; all writes stayed inside this leg folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Official Dataview docs and repository availability | Version drift could invalidate confirmed API signatures | Cite dated URLs and the repository reference used |
| Risk | Two shipped statements directly contradict the plugin's real behavior | An AI following the current docs could author invalid queries or misjudge resolution order | `synthesis.md` ranks both as P0 corrections, flagged for Logic-Sync review before phase 009 edits them |
| Risk | The plugin exposes far more DataviewJS surface than documented | An AI under-uses the plugin's real capability | `synthesis.md` organizes the full surface by group rather than an unstructured dump |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The research re-verified every research-cited anchor against the live shipped files (the staleness warning in the research did not materialize) and resolved both P0 contradictions; `synthesis.md` carries the prioritized edit plan forward to phase 009.
<!-- /ANCHOR:questions -->
