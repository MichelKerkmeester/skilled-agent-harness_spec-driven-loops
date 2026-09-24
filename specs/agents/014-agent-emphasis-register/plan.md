---
title: "Implementation Plan: Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries"
description: "Amend the agent template first, then rewrite the 36 labelled sites in the nine affected agents in both authored trees, then regenerate the generated mirrors and prove each boundary survived."
trigger_phrases:
  - "agent emphasis register plan"
  - "agent template amendment"
  - "agent mirror regeneration"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions, TOML and Markdown generated mirrors |
| **Framework** | sk-create-agent template, runtime mirror generators |
| **Storage** | None |
| **Testing** | `check-agent-mirror-sync.cjs`, generator `--check` modes, mirror-sync vitest |

### Overview
The template changes first, because its `:814` check is what holds the labels in place. The nine agents then get the same rewrite in `.skilled/agents/` and `.claude/agents/`, one agent at a time, each with a before/after row per site. The `.codex`, `.pi` and Hermes mirrors are regenerated last, never hand-edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The `orchestrate.md` bare `MANDATORY` question in `spec.md` §7 is answered

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Mirror checks passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical source with generated mirrors.

### Key Components
- **`agent-template.md`**: the shape every new agent copies, and the checklist that audits existing ones.
- **`.skilled/agents/`**: canonical for `.codex` and `.pi`, and read by Hermes through its `.hermes/agents` symlink.
- **`.claude/agents/`**: a hand-kept fork in the Claude dialect, canonical for `.cursor` and `.devin`.

### Data Flow
An edit lands in `.skilled/agents/<name>.md` and by hand in `.claude/agents/<name>.md`. `sync-agents.cjs` writes `.codex/agents/<name>.toml`, `sync-agents-pi.cjs` writes `.pi/agents/<name>.md` and `sync-skills-hermes.cjs` writes `.hermes/skills/agent-<name>/SKILL.md`. `.cursor` and `.devin` follow `.claude` through symlinks.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The label search from REQ-001 runs over the template and both authored trees before and after, and the counts go in `implementation-summary.md`. The mirror checks in REQ-003 run from the final state. The before/after list is the test for REQ-002, because no script can tell a softened boundary from a reworded one.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The generators need the built `@spec-kit/shared` and `@spec-kit/runtime` packages. A worktree without them runs the main checkout's copies against the worktree root.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the packet's commits, then rerun the three generators so the mirrors match the restored canonical tree.
<!-- /ANCHOR:rollback -->

---
