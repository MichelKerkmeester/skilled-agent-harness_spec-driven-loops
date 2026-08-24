---
title: "Phase 006/007-js-engine: Deep research to optimize the JS Engine mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, ox-alpha via cli-opencode/OpenRouter, early convergence allowed) investigating the JS Engine plugin API so the Notion-style task-timer button scripts documented in references/plugins/meta-bind/* are correct, with emphasis on the engine.* surface, the markdown builder, and the execution context (ctx/component/container) passed to a js action or JS Engine code block."
trigger_phrases:
  - "006 js-engine deep research"
  - "JS Engine reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/007-js-engine"
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
      session_id: "015-006-007-js-engine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/007-js-engine: JS Engine reference-docs deep research

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
| **Phase** | 7 of 7 |
| **Predecessor** | `006-meta-bind` |
| **Successor** | None |
| **Handoff Criteria** | `synthesis.md` written with a prioritized, evidence-cited edit table for the JS Engine execution-context gap, reconciled with the `006-meta-bind` sibling's metadata-write recipe, ready for the phase `009` apply pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian reference docs depend on the JS Engine plugin for Meta Bind `js` button actions, but the engine API, execution context, and frontmatter mutation path needed evidence from the real plugin and installed build. The headline gap: JS Engine injects a fixed execution-context object (`{ app, engine, component, container, context, obsidian }`) into every `js-engine` block and every Meta Bind `js`/`inlineJS` action, and this was entirely undocumented — without it an AI cannot know `app`, `context`, and `obsidian` are already in scope, so it cannot author a script that reads or writes the task note's frontmatter.

### Purpose
Research the real plugin (repository `mProjectsCode/obsidian-js-engine-plugin`, id `js-engine`, docs, and the installed compiled `main.js`) to confirm the `engine` API surface, the execution context object, and the frontmatter read/write path, then turn the findings into a prioritized, cited edit plan (`synthesis.md`) for phase 009, without editing any shipped doc during this research-only phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research the `mProjectsCode/obsidian-js-engine-plugin` repository, documentation, plugin identity, and installed `main.js`.
- Confirm the `engine` API surface (`engine.markdown` builder, `engine.importJs`, metadata access), execution context, frontmatter read/write behavior, and error/return conventions.
- Recommend additions or updates to the existing Meta Bind references (a dedicated JS Engine reference tree is not warranted given the thin slice the task-timer uses).
- Reconcile the metadata-write recipe with the `006-meta-bind` sibling research so phase 009 applies one coherent recipe, not two.

### Out of Scope
- Editing, creating, deleting, moving, or renaming shipped documentation under `references/plugins/` — that is phase `009-apply-plugin-doc-recs`.
- Implementing or testing the recommended documentation changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Update (this phase) | Deep-research loop output; progressive synthesis |
| `synthesis.md` | Update (this phase) | Fresh-reviewer prioritized edit table handed to phase 009 |
| `spec.md` | Update (this phase) | Re-leveled to Level 1 with retrospective plan/tasks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm the JS Engine API surface from authoritative evidence | Findings cite the repository, docs, or installed `main.js` for the relevant engine APIs |
| REQ-002 | Confirm the execution context and frontmatter mutation path | Findings distinguish verified behavior from inference and cite each key claim, and document the `{ app, engine, component, container, context, obsidian }` context object |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Identify documentation gaps and recommend the target reference location | Synthesis gives concrete additions or updates and confirms a dedicated `js-engine` tree is not warranted for the thin slice in use |
| REQ-004 | Reconcile the metadata-write recipe with `006-meta-bind` | Synthesis names the single coherent recipe both legs must converge on before phase 009 edits either doc |
| REQ-005 | Preserve the research-only boundary | No shipped mcp-obsidian documentation is modified by this run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` answers the API, context, frontmatter, and documentation-structure questions with source citations.
- **SC-002**: `synthesis.md` documents the execution-context object as the headline addable fact and confirms the two existing `engine.markdown` lines are correct for the installed version.
- **SC-003**: The cross-leg reconciliation with `006-meta-bind` is named explicitly so phase 009 lands one recipe, not two.
- **SC-004**: All writes remain inside this bound spec folder and its workflow-owned research packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed plugin build or source repository unavailable | API claims may remain partially verified | Use the other authoritative source and record the evidence gap |
| Dependency | Meta Bind and JS Engine version mismatch | Signatures may differ between documentation and installed behavior | Identify versions and distinguish source, docs, and installed-build evidence |
| Dependency | Shared deep-loop append gateway was mid-migration across three relaunches | Automated multi-iteration synthesis writeback could not complete | `research.md` documents the workaround: a mechanical, source-cited synthesis from a direct read of the installed `main.js` |
| Risk | Two sibling legs (`006-meta-bind`, `007-js-engine`) could recommend contradicting metadata-write recipes | Phase 009 could land two dueling recipes into the same target section | `synthesis.md` §5 names the required reconciliation before either edit lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The research confirmed the `engine` API surface, the execution-context object, and the frontmatter read/write path from a direct read of the installed `main.js` (v0.3.6, id `js-engine`); `synthesis.md` carries forward one residual coordination item — the cross-leg reconciliation with `006-meta-bind` on the metadata-write recipe — as an implementation note for phase 009, not an open research question.
<!-- /ANCHOR:questions -->

---

## 8. RESEARCH TOPIC

Investigated the JS Engine plugin API so the Notion-style task-timer button scripts documented in `references/plugins/meta-bind/*` are correct and complete for AI operation. The run researched the real plugin (repository `mProjectsCode/obsidian-js-engine-plugin`, id `js-engine`, docs, and the installed compiled `main.js`, v0.3.6, 246,813 bytes, minified). JS Engine is the scripting engine that Meta Bind's `js` button action and code blocks execute against, so its API surface is a dependency of the task-timer workflow.

## 9. RESEARCH CONTEXT

`research/research.md` is the canonical synthesis output. It records the provenance note explaining why the automated multi-iteration synthesis could not complete across three relaunches (DeepSeek v4 Flash primary, then GPT-5.6 Luna-fast fallback, then DeepSeek again — the shared deep-loop append gateway was mid-migration and deterministically rejected the workflow's lifecycle event shape) and why the file is instead a mechanical, source-cited synthesis authored from a direct read of the installed plugin.
