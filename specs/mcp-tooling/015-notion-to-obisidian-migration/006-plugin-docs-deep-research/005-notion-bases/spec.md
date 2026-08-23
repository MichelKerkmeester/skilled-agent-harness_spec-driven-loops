---
title: "Phase 006/005-notion-bases: Deep research to optimize the Notion Bases mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/notion-bases/* so an AI can operate the Notion Bases plugin more reliably at the file layer, with emphasis on the _database.md schema and per-column YAML key spelling (currently VERIFY)."
trigger_phrases:
  - "006 notion-bases deep research"
  - "Notion Bases reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/005-notion-bases"
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
      session_id: "015-006-005-notion-bases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/005-notion-bases: Notion Bases reference-docs deep research

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
| **Phase** | 5 of 7 |
| **Predecessor** | `004-dataview` |
| **Successor** | `006-meta-bind` |
| **Execution** | Autonomous deep research, native executor, maximum 4 iterations |
| **Handoff Criteria** | `synthesis.md` written with a prioritized, evidence-cited P0/P1/P2 edit table for `references/plugins/notion-bases/*`, ready for the phase `009` apply pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian Notion Bases file-layer reference tree omitted exact plugin syntax needed for reliable AI-authored files. Worse than a gap: every guessed relation/rollup/lookup/subtask/view key in the shipped docs maps to a *different* real source key, copied verbatim across three shipped files plus the index, and the mandatory database marker `notion-bases: true` is documented nowhere.

### Purpose
Research the real plugin (`bgarciamoura/obsidian-notion-bases-plugin`, installed v1.12.0 per `manifest.json`) to resolve the `_database.md` per-column YAML key spelling, document embed/view/rollup/lookup edge cases, and turn the findings into a prioritized, cited edit plan (`synthesis.md`) for phase 009, without editing any shipped doc during this research-only phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the `_database.md` per-column YAML key spelling against v1.12.0 source evidence (`src/types.ts`, `src/database-manager.ts`).
- Confirm the mandatory `notion-bases: true` database marker is documented.
- Investigate embed and view edge cases at the file layer.
- Investigate rollup and lookup configuration gotchas.
- Reduce the completed research into a prioritized (`P0`/`P1`/`P2`) edit table in `synthesis.md`, citing every claim to research evidence.

### Out of Scope
- Editing or implementing shipped files under `references/plugins/notion-bases/` — that is phase `009-apply-plugin-doc-recs`.
- Changing the installed mcp-obsidian plugin or vault state.
- Producing implementation code instead of cited research findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Update (this phase) | Iteration evidence, state, and synthesized findings |
| `synthesis.md` | Update (this phase) | Fresh-reviewer prioritized edit table handed to phase 009 |
| `spec.md` | Update (this phase) | Re-leveled to Level 1 with retrospective plan/tasks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify the exact per-column YAML key spelling | Evidence from `src/types.ts`/`src/database-manager.ts` resolves the VERIFY flag: every relation/rollup/lookup/subtask/view key confirmed against the real plugin source |
| REQ-002 | Confirm the mandatory `notion-bases: true` marker is documented | Findings state the marker is required for the plugin to recognize a file as a database, and note it is missing from all shipped docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Document embed and view edge cases | Findings identify file-layer syntax, limitations, and failure-prone combinations with citations |
| REQ-004 | Document rollup and lookup gotchas | Findings identify relation/property prerequisites and value-shape pitfalls with citations |
| REQ-005 | Recommend reference-doc changes | `synthesis.md` names concrete additions, updates, or new documents without editing shipped docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The research packet contains cited iteration artifacts and canonical `research/research.md`.
- **SC-002**: `research.md` resolves the per-column YAML key spelling `VERIFY` flag against `src/types.ts`/`src/database-manager.ts`.
- **SC-003**: `synthesis.md` ranks the wrong-keys finding as P0 and names the mandatory `notion-bases: true` marker gap.
- **SC-004**: The final packet passes targeted strict spec validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Upstream repository or docs may change | Version-specific claims could drift | Prefer v1.12.0 source, installed artifacts, and dated URLs |
| Dependency | Compiled plugin may be minified | Exact key spelling may be difficult to locate | Triangulate source, docs, tests, and runtime artifacts |
| Risk | An AI authoring `_database.md` from the current shipped docs produces frontmatter the plugin silently ignores | Silent data loss on migrated databases | `synthesis.md` ranks the wrong-keys correction P0, ahead of any additive gap |
| Risk | Similar terms may refer to different layers (database vs view vs embed) | AI guidance could encode the wrong schema | Separate database, view, embed, rollup, and lookup evidence |
| Risk | The shared deep-loop append gateway was mid-migration during this run | Automated multi-iteration synthesis writeback could not complete | `research.md` documents the workaround: a mechanical reduction of the completed iteration-001 findings, all still source-cited |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The completed iteration-001 findings (18 findings, all cited to the real plugin repository) resolved the per-column YAML key spelling and the mandatory-marker gap; `synthesis.md` carries the prioritized edit plan forward to phase 009.
<!-- /ANCHOR:questions -->

---

## 8. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Every finding must carry a source or explicit inference marker.
- **NFR-002**: Research artifacts must remain inside this bound packet.
- **NFR-003**: Shipped mcp-obsidian documentation must remain unchanged.

---

## 9. EDGE CASES

- Contradictory source claims must be preserved and resolved only when evidence supports resolution.
- Missing optional plugin files or unavailable memory must be recorded as evidence gaps, not treated as confirmation.
- Embed and view behavior may differ between standalone, embedded, and relation-backed contexts.
- Rollup and lookup values may depend on relation cardinality and property type.

---

## 10. RESEARCH CONTEXT

`research/research.md` is the canonical source for synthesized findings; it also records the provenance note explaining why the automated multi-iteration synthesis writeback could not complete (a mid-migration deep-loop append-gateway rejection, out of this leg's scope to fix) and why the file is instead a mechanical, source-cited reduction of the confirmed iteration-001 findings.
