---
title: "Implementation Plan: Phase 5: trim-duplicated-and-dead-agent-text"
description: "Map every block to be removed against the line that keeps its rule, then cut the box-drawn summaries, the repeated sections of `code.md` and one list in `context.md`. Make the shared advisor block identical in every file and have the check compare it with the template."
trigger_phrases:
  - "trim duplicated and dead agent text plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: trim-duplicated-and-dead-agent-text

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown agent definitions plus one Node CommonJS script |
| **Framework** | None |
| **Storage** | One JSON file, `.skilled/agents/agent-registry.json` |
| **Testing** | `vitest` for the script, `rg` assertions for the agent files, `.skilled/bin/check-agent-mirror-sync.cjs` |

### Overview
Map every block to be removed against the line that keeps its rule, then cut the box-drawn summaries, the repeated sections of `code.md` and one list in `context.md`. Make the shared advisor block identical in every file and have the check compare it with the template.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 4 is closed and the outline check exits 0
- [ ] `scratch/removal-map.md` has a row for every block to be removed
- [ ] One dispatch each of `context`, `review` and `code` is recorded before any cut

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `wc -w .skilled/agents/*.md` prints a total of 50000 or lower
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 with the shared-block comparison on
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Map, then cut.

### Key Components
- **Removal map**: A table written before any cut. Without it nobody can show that a rule survived.
- **Shared advisor block**: One block held identical in eleven files and compared with the template's copy.
- **Agent template summary rule**: Amended so the template and the files agree.

### Data Flow
A maintainer lists a block in the removal map with its surviving line, removes the block, and regenerates the copies. CI compares each file's shared block with the template's and fails on a difference.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/agents/code.md` | Sections 10 and 11 repeat section 9 | update | REQ-006 count and the REQ-002 dispatch |
| Eight agent files with a box-drawn summary | Restate the file | update | REQ-004 search |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Requires a summary section and holds the advisor wording | update | REQ-008 |
| `.skilled/bin/sync-agent-roster.cjs` | Checks rosters, paths and outlines | update | REQ-005 test case |
| `.skilled/agents/design.md`, `markdown.md`, `debug.md`, `prompt-improver.md` | No restatement found | shared block only | `git diff --stat main` shows only the shared block changed |

Required inventories:
- Same-class producers: `rg -c '[│┌└├]' .skilled/agents/*.md` lists every file with box-drawn lines.
- Consumers of the removed sections: `rg -n -e '§10' -e '§11' .skilled/agents/code.md .skilled/agents/orchestrate.md` lists references into `code.md`.
- Matrix axes: each removed block by its surviving line. Row count is fixed in `scratch/removal-map.md` before the first cut.
- Algorithm invariant: the shared block in each file equals the template's copy byte for byte.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup writes the removal map and records three dispatches. Implementation removes the mapped blocks, aligns the shared block and amends the template. Verification recounts the words, reruns the three dispatches and runs the check and the mirror check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The shared-block comparison | `vitest` |
| Count assertion | Words per section and in total | `wc -w` and `awk` |
| Manual | One dispatch each of `context`, `review` and `code`, before and after | Claude Code Agent tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 4 closed | Internal | Yellow | The shared block has no section of its own to compare |
| A small fixed task to dispatch three agents on | Internal | Green | No before and after comparison |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An agent dispatched after the change refuses its task, loses a rule the removal map did not list, or the mirror check fails on main.
- **Procedure**: `git revert` the phase's commits on the worktree branch, then rerun the mirror generators so the runtime copies match again.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | Phase 4 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting the successor |
<!-- /ANCHOR:phase-deps -->

---

