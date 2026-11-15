---
title: "Implementation Plan: Phase 20: fork-session-guards"
description: "Reuse the fork compaction check in session-prime and add a PreToolUse guard keyed on agent_id, both built tests first by DeepSeek."
trigger_phrases:
  - "fork session guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: fork-session-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (`.mjs` hook), TypeScript (spec-kit runtime) |
| **Framework** | Claude Code SessionStart and PreToolUse hooks |
| **Storage** | None |
| **Testing** | node:test, Vitest |

### Overview
A live probe confirmed that tool-call payloads from sub-agents carry `agent_id`, which gives the CLI guard a reliable signal. `session-prime` gets a TypeScript port of the fork compaction check from phase 019.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard clauses in hooks

### Key Components
- **`subagent-guard.mjs`**: denies relaunch lifecycle commands from a call carrying `agent_id`.
- **`forkCompactedRecently` in `shared.ts`**: the fork compaction check, used by `session-prime` before recovery.

### Data Flow
PreToolUse Bash payload to the guard, then deny or pass. SessionStart compact payload to `session-prime`, then skip without output or clear when a fork just compacted.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Tests first for both changes. End-to-end runs fed handcrafted payloads to the built hooks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit, rerun `sync-hook-registrations.cjs` and rebuild the spec-kit runtime.
<!-- /ANCHOR:rollback -->

---

