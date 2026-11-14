---
title: "Implementation Plan: Phase 3: skill-binding-through-routers"
description: "Change six agent files so each names a skill's entry file and a load condition, after proving in a parity table that every removed path is still reachable. Extend the roster check to fail on a cited skill path that does not exist."
trigger_phrases:
  - "skill binding through routers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: skill-binding-through-routers

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
Change six agent files so each names a skill's entry file and a load condition, after proving in a parity table that every removed path is still reachable. Extend the roster check to fail on a cited skill path that does not exist.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 2 is closed and `sync-agent-roster.cjs --check` exits 0
- [ ] `scratch/route-parity.md` lists every path to be removed
- [ ] Each skill router has been run once for its agent's task

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0
- [ ] `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bind by entry point.

### Key Components
- **Agent skill tables**: The section of each agent file that names its skills. Six of them change.
- **Path check**: A new branch in the existing check mode. Without it a renamed skill file breaks an agent silently.

### Data Flow
An agent starts a task, reads the skill's entry file named in its own file, and follows the route that file returns. CI runs the check, which resolves every cited skill path against the disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/agents/design.md` | Cites four files inside `sk-code-frontend` | update | REQ-004 search |
| `.skilled/agents/markdown.md` | Cites template files inside `sk-doc` mode packets | update | REQ-005 search |
| `.skilled/agents/deep-review.md` | Cites the review doctrine file inside `sk-code-review` | update | REQ-006 search |
| `.skilled/agents/debug.md`, `context.md` and `prompt-improver.md` | Cite skill files without naming a load condition or an entry file | update | REQ-007 search |
| `.skilled/agents/orchestrate.md` | Cites a placeholder path that the new check reads as a real folder | update | The check exits 0 |
| `.skilled/skills/sk-code/ROUTER.md` and `.skilled/skills/sk-doc/ROUTER.md` | Select the leaf resources for a task | unchanged | Run once per agent in T002 and T003 |
| `.skilled/bin/sync-agent-roster.cjs` | Checks rosters against the registry | update | REQ-001 test case |
| `.skilled/agents/code.md` and `review.md` | Already load `sk-code` through its entry file | unchanged | `git diff --stat main` prints nothing for both |

Required inventories:
- Same-class producers: `rg -o '\.skilled/skills/[A-Za-z0-9_./-]+' .skilled/agents` lists every cited skill path.
- Consumers of the removed paths: `rg -l 'web-visual-values' .skilled` shows who else cites each file.
- Matrix axes: six agents by the paths each cites. Row count is fixed in `scratch/route-parity.md` before the first edit.
- Algorithm invariant: a cited path resolves inside the repository root. The cases are a missing file, a directory, a path with `..` and a placeholder in angle brackets.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup lists every cited skill path and writes the parity table by running each router. Implementation edits the six agent files and extends the check. Verification runs the check, the tests and the mirror check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The path check, including a missing path and a `..` path | `vitest` |
| Search assertion | Removed paths are gone from each agent | `rg` |
| Manual | One `design` dispatch resolves its references through the router | Claude Code Agent tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 2 closed | Internal | Yellow | No script to extend |
| `.skilled/bin/compiled-route.cjs` | Internal | Green | No way to prove a removed path is still reachable |
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
| Setup | Phase 2 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting the successor |
<!-- /ANCHOR:phase-deps -->

---

