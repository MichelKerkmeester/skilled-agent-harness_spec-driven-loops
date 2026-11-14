---
title: "Implementation Plan: Phase 3: orchestrate-task-package-agent-names"
description: "Change one line in the orchestrator's task template so it points at the generated routing table instead of listing agents by hand, regenerate the runtime copies and prove it with the roster and mirror checks."
trigger_phrases:
  - "orchestrate task package agent names plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: orchestrate-task-package-agent-names

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definition |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` assertions, `sync-agent-roster.cjs --check` and `check-agent-mirror-sync.cjs` |

### Overview
Change one line in `.skilled/agents/orchestrate.md`. The `Agent:` line of the task template stops listing names and points at the routing table the roster script already generates in the same file. Prove it with two searches and the two checks that guard the agent files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sed -n 211p .skilled/agents/orchestrate.md` still prints the eight-name line
- [x] The command that writes the runtime copies is named in `scratch/baseline.txt`
- [x] The operator's answer on the pointer or the generated line is recorded in `spec.md` section 7

### Definition of Done
- [x] Every requirement in `spec.md` section 4 holds
- [x] `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`
- [x] `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single value change.

### Key Components
- **The `Agent:` line in `.skilled/agents/orchestrate.md`**: The one hand-typed roster left in the file. It becomes a bracketed instruction like the template lines around it.
- **The generated `routing-table` block in the same file**: Already written from `agent-registry.json`. It becomes the only list of agents the template relies on, and it is not edited.

### Data Flow
The orchestrator fills the task template for each delegation. For the `Agent:` field it reads the routing table in section 2 of its own file, picks the agent whose task type fits and writes that name. A new agent reaches the table through the registry, so the template needs no edit when the roster grows.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup saves the baseline and finds the command that writes the runtime copies. Implementation changes the one line in `.skilled/agents/orchestrate.md` and regenerates the copies. Verification runs the two searches, the roster check and the mirror check, and validates the folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`rg -c '^├─ Agent: @code . @context' .skilled/agents/orchestrate.md` prints no line after the change and 1 before it, which is the negative control. `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync`, both at exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `rg` and the repository's own mirror sync. No new package and no change to `sync-agent-roster.cjs`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the orchestrator writes a task package with an agent name the routing table does not hold, or the mirror check fails on main. Revert the phase's one commit with `git revert`, which restores the line and the runtime copies together.
<!-- /ANCHOR:rollback -->

---
