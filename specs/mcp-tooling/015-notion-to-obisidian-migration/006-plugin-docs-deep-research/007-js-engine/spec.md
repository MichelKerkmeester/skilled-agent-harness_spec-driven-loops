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
    recent_action: "scaffolded as bound spec_folder for the JS Engine deep-research run"
    next_safe_action: "run /deep:research:auto bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-007-js-engine"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Phase 006/007-js-engine: JS Engine reference-docs deep research

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-22 |
| **Branch** | `007-js-engine` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-obsidian reference docs depend on the JS Engine plugin for Meta Bind `js` button actions, but the engine API, execution context, and frontmatter mutation path need evidence from the real plugin and installed build.

### Purpose

Produce a cited research synthesis that identifies the smallest reliable documentation updates while keeping shipped documentation unchanged during this research run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Research the `mProjectsCode/obsidian-js-engine-plugin` repository, documentation, plugin identity, and installed `main.js`.
- Confirm the `engine` API surface, execution context, metadata access, frontmatter read/write behavior, and error or return conventions.
- Recommend additions or updates to the existing Meta Bind references or a dedicated JS Engine reference tree.

### Out of Scope

- Editing, creating, deleting, moving, or renaming shipped documentation under `references/plugins/`.
- Implementing or testing the recommended documentation changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create/update | Workflow-owned research artifacts and synthesis only |
| `spec.md` | Bounded update | Workflow-owned research anchors and findings context only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm the JS Engine API surface from authoritative evidence | Findings cite the repository, docs, or installed `main.js` for the relevant engine APIs |
| REQ-002 | Confirm the execution context and frontmatter mutation path | Findings distinguish verified behavior from inference and cite each key claim |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Identify documentation gaps and recommend the target reference location | Synthesis gives concrete additions or updates and records unresolved questions |
| REQ-004 | Preserve the research-only boundary | No shipped mcp-obsidian documentation is modified by this run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The final `research/research.md` answers the API, context, frontmatter, and documentation-structure questions with source citations.
- **SC-002**: The workflow completes through convergence or the configured four-iteration cap with valid state and route-proof records.
- **SC-003**: All writes remain inside this bound spec folder and its workflow-owned research packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed plugin build or source repository unavailable | API claims may remain partially verified | Use the other authoritative source and record the evidence gap |
| Dependency | Meta Bind and JS Engine version mismatch | Signatures may differ between documentation and installed behavior | Identify versions and distinguish source, docs, and installed-build evidence |
| Risk | Research evidence could be mistaken for authorization to edit shipped docs | Scope violation | Keep all workflow writes packet-local and report recommendations only |
<!-- /ANCHOR:risks -->

---

## 7. RESEARCH TOPIC

Investigate the JS Engine plugin API so the Notion-style task-timer button scripts documented this session in `references/plugins/meta-bind/*` are correct and complete for AI operation. The run researches the real plugin (repository `mProjectsCode/obsidian-js-engine-plugin`, id `js-engine`, docs, and the installed compiled `main.js`). JS Engine is the scripting engine that Meta Bind's `js` button action and code blocks execute against, so its API surface is a dependency of the task-timer workflow.

What should be added, updated, or created (in `references/plugins/meta-bind/*`, or a dedicated `references/plugins/js-engine/*` tree if warranted) so an AI can reliably author JS Engine scripts for Meta Bind buttons? Confirm against the real plugin: the `engine` API surface exposed to scripts (e.g. `engine.markdown` builder, `engine.importJs`, metadata access), the execution context object (the `ctx`/`component`/`container`/`app` arguments passed into a `js` action or `js-engine` code block), how a script resolves and reads/writes note frontmatter (the timestamp the task-timer button records), and error/return conventions. Identify missing workflows and gotchas. Research only; do not edit the shipped docs.

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- [ ] Optimize the mcp-obsidian docs for the JS Engine plugin, the scripting engine behind Meta Bind's js button action. Research the real plugin (repo mProjectsCode/obsidian-js-engine-plugin, id js-engine, docs, and the installed main.js) to confirm the engine API surface exposed to scripts (engine.markdown builder, engine.importJs, metadata access), the execution context object (ctx/component/container/app) passed into a js action or js-engine code block, and how a script reads and writes note frontmatter (the timestamp the task-timer records). Recommend concrete additions or updates to references/plugins/meta-bind/ or a dedicated references/plugins/js-engine/ tree if warranted.
- [ ] JS Engine plugin API surface confirmation (engine.markdown, engine.importJs, metadata access)
- [ ] JS Engine execution context (ctx/component/container/app) passed into js action / js-engine code block
- [ ] How JS Engine scripts read/write note frontmatter
- [ ] Error handling and return conventions
- [ ] Gaps in current mcp-obsidian meta-bind docs and whether a dedicated js-engine tree is warranted
<!-- /ANCHOR:questions -->

---

## 9. RESEARCH CONTEXT

Deep-research is active for the JS Engine plugin reference-docs optimization topic. The canonical research artifacts live under `research/` in this folder. This `spec.md` tracks bounded pre-init context only; `research/research.md` is the canonical synthesis output.
The normalized research topic is tracked here while this deep-research run is active; `research/research.md` remains canonical.
