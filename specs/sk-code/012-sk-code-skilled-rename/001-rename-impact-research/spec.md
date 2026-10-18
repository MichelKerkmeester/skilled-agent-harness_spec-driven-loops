---
title: "Feature Specification: Phase 1: rename-impact-research"
description: "Deep research that maps every reference to the sk-code-opencode surface and produces the ordered, test-guarded plan for giving it the name sk-code-skilled."
trigger_phrases:
  - "rename impact research"
  - "phase 1 rename impact research"
  - "sk-code-skilled rename research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: rename-impact-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/144-sk-code-skilled-rename` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-skill-and-routing-rename |
| **Handoff Criteria** | `research/research.md` lists every load-bearing surface with file evidence, the rename order, the verification commands and the exclusions, and the operator accepts it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-code-skilled rename. It changes no file outside this phase folder.

**Scope Boundary**: read-only investigation of the repository. Writes go only to `research/` and this phase's docs.

**Dependencies**:
- The `devin` CLI with model `deepseek-v4-1-flash-max`, dispatched through `/deep:research` with executor `cli-devin`

**Deliverables**:
- `research/research.md`: the synthesized inventory and rename plan
- `research/iterations/`: five iteration records

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The name `sk-code-opencode` is wired into the skill folder, the sk-code hub registry and router, the system-skill-advisor DB and compiled routes, runtime mirrors, scripts, tests and about 1,300 markdown files. A blind search-and-replace risks breaking hub routing, advisor scoring, drift guards and fixtures, and risks rewriting the OpenCode runtime's own names (`.opencode/`, `cli-opencode`), which must stay.

### Purpose
Produce an evidence-backed map of every place the name lives and an ordered rename plan that phases 002 and 003 can execute without breaking a gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every spelling of the identity: `sk-code-opencode`, a bare `code-opencode`, and any snake, title-case or path form
- Load-bearing surfaces: folder paths, registries, routers, `graph-metadata.json`, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors (`.hermes/`, `.claude/`, `.codex/` and others)
- Markdown references, split into live docs and history (changelogs, `z_archive/`, research logs)
- How generated artifacts (advisor DB, trigger index, compiled routes) are rebuilt after the rename

### Out of Scope
- Making any rename change - that is phases 002 and 003
- References to the OpenCode runtime itself - those keep their names

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory every load-bearing reference with file evidence | `research.md` lists each surface with `path:line` sources and a count per category |
| REQ-002 | Separate the surface's names from the OpenCode runtime's names | `research.md` states the match patterns that hit the surface and the ones that must be excluded |
| REQ-003 | Give an ordered rename plan with a verification command per step | `research.md` has a step list covering folder moves, registry and router edits, advisor DB rebuild and tests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Quantify history references and recommend keep or rewrite | `research.md` counts changelog, archive and research-log hits and recommends a policy |
| REQ-005 | Decide whether bare `code-opencode` shares the identity | `research.md` gives the evidence and a recommendation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five research iterations complete on `deepseek-v4-1-flash-max` and `research.md` is synthesized
- **SC-002**: Each load-bearing claim in `research.md` carries a source tag that resolves
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin CLI auth and the DeepSeek model | No iterations run | Probe with a trivial read-only call before the loop |
| Risk | One model's inventory misses a surface | Med | Phase 002 re-checks the inventory with its own search before editing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Keep or rewrite history references (changelogs, archived specs, research logs)?
- Does the bare `code-opencode` spelling take the name `code-skilled`?
- Deep-research topic: map every sk-code-opencode reference and spelling and plan an ordered, test-guarded rename to sk-code-skilled, excluding the OpenCode runtime's own names.

### Research Context

Deep research is active for this topic (5 iterations, cli-devin `deepseek-v4-1-flash-max`). `research/research.md` is the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- Both forms are the identity: prefixed `sk-code-opencode` becomes `sk-code-skilled`, and bare `code-opencode` (routing classes, changelog alias, benchmark ids, fixtures) becomes `code-skilled`.
- Compiled routing reads the hub JSONs at route time, so it needs no code change; only one test and one canary fixture pin the name.
- `.opencode/`, `.claude/` and `.devin/` skills are symlinks into `.skilled/skills`; only `.hermes/skills/` is a materialized mirror and is re-synced.
- Generated artifacts rebuild with their own tools: `advisor_rebuild --trusted --force true`, the compiled-route sync and guard, `sync-runtime-mirrors.cjs`, and `generate-trigger-index.mjs` with its `--check` mode.
- Never match on the bare `opencode` token; the safe patterns and the 12-step ordered plan are in research.md §4 and §6.
- About 92% of the 11,282 matching lines are history. The research recommends keeping history unchanged, which conflicts with the request to rename every markdown reference; the operator decides before phase 003.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
