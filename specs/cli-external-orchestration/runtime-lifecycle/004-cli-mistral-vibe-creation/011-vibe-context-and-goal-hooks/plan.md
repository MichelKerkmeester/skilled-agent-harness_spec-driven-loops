---
title: "Implementation Plan: Phase 11: vibe-context-and-goal-hooks"
description: "Add one Vibe session_start hook that composes the bound packet's goal chat_slice with the session-prime context into additional_context, register it in .vibe/hooks.toml, and prove it with a fixture test and a keyed dispatch."
trigger_phrases:
  - "vibe context and goal hooks plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: vibe-context-and-goal-hooks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules, TOML hook registration |
| **Framework** | Vibe 3.1.2 hooks and the shared goal core `.skilled/hooks/goal/lib/goal-core.cjs` |
| **Storage** | None. The goal state directory is read, never written |
| **Testing** | `node --test` fixture test and one keyed `vibe -p` dispatch |

### Overview
Two thin adapters follow the Devin and Cursor goal adapters. The goal adapter renders the bound packet's `chat_slice`, and the session-start adapter composes it with the session-prime context and answers the `session_start` event through `additional_context`. A fixture test proves byte equality with `goal.cjs packet`, and a keyed dispatch proves the first turn sees it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 008's settled hook wire format is recorded in its packet and `.vibe/hooks.toml` exists (`ls .vibe/hooks.toml` prints the path)
- [ ] `node .skilled/hooks/goal/bin/goal.cjs packet <fixture packet> --workspace "$PWD"` prints one `chat_slice=` line
- [ ] `MISTRAL_API_KEY` is exported in dispatched shells

### Definition of Done
- [ ] `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`
- [ ] A keyed dispatch's first reply contains the bound packet's Objective line
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Session-start context injection.

### Key Components
- **Goal adapter** (`goal/vibe/goal-inject.mjs`): resolves the packet and returns its `chat_slice`. Without it the hook has no goal text.
- **Session-start adapter** (`session-lifecycle/vibe/session-start.mjs`): composes the slice and session context into one `additional_context`. Without it nothing answers `session_start`.

### Data Flow
A `vibe -p` dispatch starts a session, Vibe fires `session_start`, the registered adapter reads the packet path, asks the goal adapter for the slice, adds the session-prime context and returns both as `additional_context`. That Vibe adds this text before the first model turn is a reading of the Vibe hooks source in research section 6, not yet observed, and T011 is the observation.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads phase 008's settled wire format and confirms `goal.cjs packet` prints a slice for the fixture packet. Implementation adds the goal adapter, the session-start adapter, the `hooks.toml` entry, the fixture test and the README rows. Verification runs the fixture test and one keyed dispatch bound to a packet. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` spawns the session-start adapter against a temporary state directory and checks three cases: a bound packet yields the exact `chat_slice`, no packet yields no goal heading, and malformed input yields an empty context with exit 0. The keyed dispatch then confirms the first turn sees the slice.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2` at `~/.local/bin/vibe`, Node.js, phase 008's `.vibe/hooks.toml` and wire format, and `MISTRAL_API_KEY` for the dispatch check. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the hook delays or breaks session start in a dispatch. Remove the `session_start` entry from `.vibe/hooks.toml`, which detaches both adapters without touching the guards phase 008 registered, then revert the phase's commit.
<!-- /ANCHOR:rollback -->

---
