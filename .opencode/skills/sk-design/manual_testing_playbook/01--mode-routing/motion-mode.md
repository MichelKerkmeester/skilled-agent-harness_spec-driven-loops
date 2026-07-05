---
title: "MR-003: Motion Mode Routing"
description: "Verify temporal interaction requests resolve to motion and load the design-motion packet."
version: 1.0.0.0
---

# MR-003: Motion Mode Routing

## 1. OVERVIEW

This scenario verifies that animation, micro-interaction, and reduced-motion requests route through the `sk-design` hub to `workflowMode: motion`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A UI team wants interaction feedback and accessible motion alternatives for a command menu.

**Exact prompt**:
```text
Design the hover micro-interactions and reduced-motion fallback for this command menu.
```

**Expected mode resolution**: `motion`.

**Why**:
- `mode-registry.json` lists `motion` aliases including `motion design`, `animate this`, `micro-interactions`, `transitions`, `AnimatePresence`, `exit animation`, `reduced motion`, and `motion performance`.
- `hub-router.json` maps `motion-aliases` keywords `micro-interactions` and `reduced motion`, plus `motion-temporal` keyword `hover effect`, to `motion`.

**Expected packet loaded**:
- `design-motion/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/sk_code_handoff.md` if implementation handoff is discussed

**Expected mode resources loaded or cited**:
- `design-motion/references/corpus_map.md`
- `design-motion/references/animation_decision_framework.md`
- `design-motion/references/micro_interactions.md`
- `design-motion/references/performance_reduced_motion.md`
- `design-motion/assets/motion_pattern_cards.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: read-only. The `motion` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: motion` and `packet: design-motion`.
2. `hub-router.json` contains the `motion-aliases`, `motion-temporal`, and `motion-feel` vocabulary classes.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MR003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, loaded paths, tool calls, and response in `/tmp/skd-MR003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `motion`, packet is `design-motion/SKILL.md`, and motion decision plus reduced-motion resources are loaded.
- **FAIL** iff `interface` invents visual direction instead, `audit` performs a review instead of choreography, or mutating tools are used.

### Failure Triage

1. If `audit` wins, verify the prompt did not include `audit`, `review`, `score`, or `performance audit` wording.
2. If `interface` wins, verify the temporal terms `micro-interactions`, `hover`, and `reduced-motion` were preserved.
3. If reduced-motion resources are missing, inspect `design-motion/SKILL.md` `RESOURCE_MAP.PERFORMANCE`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-motion/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
