---
title: "Implementation Plan: Phase 1: fix-agent-contract-contradictions"
description: "Edit eight agent files so each contract agrees with its permissions and with the other files, regenerate the runtime copies, and prove each fix with a search that printed a line before and prints none after."
trigger_phrases:
  - "fix agent contract contradictions plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: fix-agent-contract-contradictions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown agent definitions with YAML frontmatter |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` assertions and `.skilled/bin/check-agent-mirror-sync.cjs` |

### Overview
Edit eight agent files so each contract agrees with its permissions and with the other files, regenerate the runtime copies, and prove each fix with a search that printed a line before and prints none after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `scratch/baseline.txt` holds the Measured Behavior output from this worktree
- [ ] The workflow line that runs each council script is listed in `scratch/council-script-owners.md`
- [ ] The runtimes that register named agents are listed from the crosswalk

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `rg -n -e 'RETURN is .DONE.' -e 'Skip steps 3-5' -e 'all custom agents use the general subagent type' .skilled/agents` prints no line
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place text correction.

### Key Components
- **`.skilled/agents/*.md`**: The canonical agent definitions. Eight of them change.
- **Runtime copies**: Six generated trees that must match the canonical files after the edit.

### Data Flow
An operator or a workflow dispatches an agent. The runtime loads that agent's file from its own tree. The file's permissions and rules decide what the agent may do, so both must agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/agents/ai-council.md` | Owns the council's persistence and delegation rules | update | REQ-001, REQ-008 and REQ-009 searches |
| `.skilled/commands/deep/assets/deep-ai-council-auto.yaml` | Runs the gateway script at line 66 | unchanged | `rg -n 'append-mode-event' .skilled/commands/deep/assets/deep-ai-council-auto.yaml` prints line 66 |
| `.skilled/agents/orchestrate.md` | Owns the dispatch instruction every orchestrated run follows | update | REQ-002 search and the REQ-003 probe |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Dispatches `code` and reads its return | not a consumer of the `DONE` wording | `rg -n 'RETURN' .skilled/commands/speckit/assets/speckit-implement.yaml` checked in T004 |
| Six runtime trees | Carry the copies each runtime loads | update | Mirror check |

Required inventories:
- Same-class producers: `rg -n -i -e 'general-purpose' -e '"general"' .skilled/agents` lists every dispatch instruction before one is changed.
- Consumers of the return vocabulary: `rg -n -e 'RETURN:' -e 'DONE' .skilled/commands .skilled/agents/orchestrate.md`.
- Matrix axes: eight contradictions by eleven files. Each contradiction lists the files it touches in `scratch/baseline.txt`.
- Algorithm invariant: N/A, no parser or path logic changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and reads the council workflow and the crosswalk. Implementation edits the eight agent files and regenerates the copies. Verification reruns every search and the mirror check, and runs one test dispatch.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Search assertion | Each contradiction, before and after | `rg` |
| Mirror parity | All six runtime trees | `.skilled/bin/check-agent-mirror-sync.cjs` |
| Manual | One `context` dispatch on Claude Code asked to write a file | Claude Code Agent tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `.skilled/bin/check-agent-mirror-sync.cjs` | Internal | Green | No proof the runtime copies match |
| The Codex and Pi generators named in the crosswalk | Internal | Green | Two trees stay stale until they run |
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting the successor |
<!-- /ANCHOR:phase-deps -->

---

