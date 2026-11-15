---
title: "Implementation Plan: Vibe handover switch and live hop"
description: "Add vibe to the runtime list both flag readers share, guard that list against the relaunch loop's with a test, list the switch in the env docs, then run one Vibe hop live in tmux through skilled-loop."
trigger_phrases:
  - "vibe handover flag and live hop plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Vibe handover switch and live hop

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS and bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, the hooks vitest config for Pi, a tmux live probe |

### Overview
Two readers decide the relaunch flag, `hook-flags.cjs` and `hook-flags.sh`, and each holds its own runtime list. Adding `vibe` to both lets `SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED` answer, and a new test compares the list with the relaunch loop's so the next runtime cannot be left out the same way. A live tmux run through `skilled-loop vibe` then shows whether the command-only hop works end to end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/shared/hook-flags.test.cjs` prints `pass 30` and `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared flag resolver

### Key Components
- **`hook-flags.cjs` `RUNTIMES`**: the runtimes that own a per-runtime enable switch, read by the relaunch CLI and the Node adapters
- **`hook-flags.sh` runtime case**: the same list for shell callers

### Data Flow
A caller passes its runtime name. A name in the list checks `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` first, then the global switch, then the per-runtime default.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new flag test must fail on the old code and pass after the change. The relaunch, plugin, flag, Pi and goal suites run again on the final tree. The live run uses `scratch/harness/probe.sh vibe`, with a throwaway `VIBE_HOME` that trusts only this worktree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`tmux`, the Vibe CLI 3.1.2 and `MISTRAL_API_KEY` in the environment, for the live run only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a runtime that relied on the global-only answer behaves differently. Revert the one commit.
<!-- /ANCHOR:rollback -->

---
