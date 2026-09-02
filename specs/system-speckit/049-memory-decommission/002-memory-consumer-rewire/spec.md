---
title: "Feature Specification: Phase 2: memory-consumer-rewire"
description: "Repoint AGENTS.md Gate 1 and every external consumer of the memory MCP surface at the trigger index and ripgrep conventions, while the old surface is still available to fall back to."
trigger_phrases:
  - "consumer rewire"
  - "gate 1 rewire"
  - "memory tool call sites"
  - "mcp consumer migration"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: memory-consumer-rewire

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Roughly 167 files outside the subsystem call the memory MCP surface, and `AGENTS.md` Gate 1 is the
most load-bearing of them. This phase repoints all of them at the phase-001 replacement while the
old surface still exists, so any gap surfaces as a behavioral difference rather than a hard failure.

**Key Decisions**: Rewire before deleting, so a mistake is a wrong answer rather than a missing tool; treat the 260 in-subsystem references as deletions, not rewrites.

**Critical Dependencies**: Phase 001 must have shipped a proven index and a written ripgrep contract.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `claude/speckit-memory-db-review-3gheky` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-trigger-index-replacement |
| **Successor** | 003-spec-memory-server-removal |
| **Handoff Criteria** | Zero references to `mcp__system_spec_memory__*` or the 41 tool names outside the subsystem tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the memory db decommission specification.

**Scope Boundary**: Change consumers only. Nothing is deleted in this phase and the MCP server keeps
running, which is the point: if a rewired consumer is wrong, it produces a different answer that can
be compared against the still-live original, instead of an error that only proves something is gone.

**Dependencies**:
- Phase 001 delivered `trigger-index.json` and `retrieval-conventions.md`

**Deliverables**:
- `AGENTS.md` Gate 1 rewritten against the index
- ~167 external consumer files repointed
- A named replacement writer for `_memory.continuity` frontmatter
- A residue sweep proving no external caller remains

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

427 files reference the memory MCP surface. 260 of them live inside `system-spec-kit` itself
(feature catalog, manual-testing playbook, references) and disappear with the subsystem. The
remaining ~167 are real external consumers — `AGENTS.md`, the `deep` and `speckit` command families,
agents in both `.opencode/` and `.claude/`, and several skills — and each one names tools that will
not exist after phase 003.

### Purpose

Every external consumer resolves retrieval through the phase-001 mechanisms, verified by a sweep
that returns empty, so that phase 003 deletes something nothing calls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `AGENTS.md` Gate 1: replace the `memory_match_triggers` gate action with the index lookup.
- The ~167 external consumer files, by area: `system-deep-loop` (25), `commands/deep` (21),
  `commands/create` (19), `cli-external-orchestration` (14), `system-skill-advisor` (13),
  `commands/speckit` (13), `sk-code` (12), `sk-doc` (10), `commands/memory` (6), `commands/doctor` (6),
  and the remaining single-file consumers.
- The `_memory.continuity` writer: name and wire whatever replaces the `memory_save` metadata refresh.
- A residue sweep script kept as the phase's proof.

### Out of Scope

- The 260 in-subsystem references — they are deleted with the tree in phase 003, not rewritten here.
- `system_skill_advisor`'s own tools. It is a separate server; only its *references to spec-memory*
  are in scope, not its own surface.
- Deleting anything — phase 003.
- Spec-doc content changes — phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Gate 1 mechanism; §5 tool table; §10 quick-reference rows |
| `.opencode/commands/{deep,speckit,create,memory,doctor}/**` | Modify | Command frontmatter `allowed-tools` and workflow steps |
| `.opencode/agents/*.md`, `.claude/agents/*.md` | Modify | Tool grants and retrieval instructions |
| `.opencode/skills/{system-deep-loop,sk-code,sk-doc,cli-external-orchestration}/**` | Modify | Retrieval references |
| `.opencode/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Continuity writer contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg 'mcp__system_spec_memory__'` returns no hits outside `.opencode/skills/system-spec-kit/mcp-server/` |
| REQ-002 | None of the 41 tool names appears as a live instruction outside the subsystem tree |
| REQ-003 | `AGENTS.md` Gate 1 names a mechanism that works with no daemon running |
| REQ-004 | `_memory.continuity` frontmatter has a named, working writer that does not depend on the MCP server |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Command `allowed-tools` frontmatter no longer grants removed tools |
| REQ-006 | Every rewired consumer's retrieval instruction is executable by hand from `retrieval-conventions.md` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Residue sweep returns empty outside the subsystem tree
- **SC-002**: A full session runs Gate 1 through Gate 5 with the daemon stopped and no degraded-mode notice
- **SC-003**: `/speckit:plan`, `/speckit:resume` and `/memory:save` complete end to end without the MCP server
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `_memory.continuity` currently written through the save path; no replacement writer exists yet | High — continuity is the canonical recovery chain | REQ-004 makes naming the writer a blocker, not a follow-up |
| Risk | 167 files is enough that a mechanical sweep will miss prose references | Med | Sweep by tool name AND by transport prefix; review each area's diff separately |
| Risk | `commands/memory/*` may not survive rewiring at all | Med — some are pure DB administration with no meaning after removal | Decide per command: rewire, or mark for deletion in phase 003 |
| Dependency | Phase 001 artifacts | Blocks everything here | Sequenced; phase 001 handoff criteria gate it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Gate 1 resolution stays under the 200ms budget set in phase 001

### Security
- **NFR-S01**: No consumer gains a broader tool grant than it held before

### Reliability
- **NFR-R01**: No consumer depends on a background service after this phase

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a consumer with no retrieval need loses the grant rather than gaining a replacement
- Maximum length: none applicable

### Error Scenarios
- Index file absent: the consumer says so plainly rather than silently returning nothing
- A consumer whose only purpose was DB administration: marked for deletion, not rewired

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~167, LOC: mostly prose, Systems: 6 command families |
| Risk | 14/25 | Auth: N, API: Y (tool grants), Breaking: Y |
| Research | 8/20 | Per-area consumer intent must be read, not assumed |
| Multi-Agent | 8/15 | Workstreams: rewire is parallelizable by area |
| Coordination | 10/15 | Dependencies: gates phase 003 entirely |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | No replacement continuity writer | H | M | Blocker requirement REQ-004 |
| R-002 | Prose references missed by a name-based sweep | M | H | Two-axis sweep plus per-area diff review |
| R-003 | A rewired consumer silently degrades | M | M | SC-002 full-session run with daemon stopped |

---

## 11. USER STORIES

### US-001: A session that never needs the daemon (Priority: P0)

**As a** framework operator, **I want** every gate and command to work with no background service, **so that** a fresh clone or a flapping daemon is not a degraded session.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Retrieval I can reproduce (Priority: P1)

**As a** framework operator, **I want** each consumer's retrieval step to be a command I can run myself, **so that** I can check what the agent saw.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Which of the six `/memory:*` commands survive as anything? `/memory:search` may become a thin ripgrep wrapper, while `/memory:manage` administers a database that will not exist.
- Does `_memory.continuity` stay in frontmatter at all, or does phase 004's convention move it? The two phases must not answer this differently.
<!-- /ANCHOR:questions -->

---
