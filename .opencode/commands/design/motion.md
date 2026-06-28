---
description: Animation, transitions, micro-interactions, AnimatePresence, reduced motion. sk-design motion mode.
argument-hint: "<component-state> [--library]"
allowed-tools: Read, Glob, Grep
---

# /design:motion

Thin bridge into the `sk-design` parent skill's `motion` mode.

## 1. PURPOSE

Pin the `motion` mode of the `sk-design` parent hub to design purposeful animation and micro-interactions. The hub owns routing
across modes; this command loads the `motion` mode directly. If the request spans more
than `motion`, defer to the hub's routing instead of forcing this mode.

## 2. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-motion/SKILL.md` -- the `motion` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `motion` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`
