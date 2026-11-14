---
title: "Implementation Plan: Phase 4: agent-authoring-registry-step"
description: "Add one step to the agent authoring workflow that names the registry record and the roster rewrite, quote the error an author sees without it, and prove the step with a throwaway agent file that is removed again."
trigger_phrases:
  - "agent authoring registry step plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: agent-authoring-registry-step

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill document |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` assertions and `node .skilled/bin/sync-agent-roster.cjs --check` on a throwaway agent |

### Overview
Change one skill document. The ordered creation workflow in `sk-create-agent/SKILL.md` gains a registry step before validation, and the validation step quotes the error the roster check prints without a record. Prove it by following the new step with a throwaway agent file and watching the check pass, then remove the throwaway.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints no line
- [ ] The `sk-doc` hub's version rule has been read and the files it binds are named in `scratch/baseline.txt`
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` before any edit

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 holds
- [ ] `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 or more
- [ ] `git status --short .skilled/agents` prints no line
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow step addition.

### Key Components
- **The ordered creation workflow in `sk-create-agent/SKILL.md`**: The numbered steps an author follows. It gains one step and the later steps renumber.
- **`.skilled/agents/agent-registry.json`**: Read to list the record fields. It is edited only for the throwaway probe and restored.

### Data Flow
An author writes the agent file, adds the registry record, runs the roster script to rewrite the generated rosters and then runs the check. The check compares the agent files with the registry, so the record has to exist before it runs.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup saves the baseline, reads the `/create:agent` assets and the hub's version rule. Implementation adds the registry step and the error text to `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` and writes the changelog entry. Verification follows the new step with a throwaway agent, removes it, runs the hub checks and validates the folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node .skilled/bin/sync-agent-roster.cjs --check` must print `agent file without a registry record: zz-probe` with the throwaway file alone, and `agent-roster: OK` once the record is added and the rosters are rewritten. After the throwaway is removed it must print `agent-roster: OK` again and `git status --short .skilled/agents` must print no line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` and `rg`. No new package. The `sk-doc` hub's version rule in `.skilled/skills/sk-doc/SKILL.md` and the hub routing rule in `.skilled/repo-rules/skill-hub-routing.md` both apply, because the edit is to a mode packet inside a hub.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the hub's version or vocabulary check fails on main, or the new step sends an author to a registry field that does not exist. Revert the phase's one commit with `git revert`, which restores the workflow text and removes the changelog entry.
<!-- /ANCHOR:rollback -->

---
