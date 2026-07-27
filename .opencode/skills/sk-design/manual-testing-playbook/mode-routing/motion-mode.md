---
title: "MDR-003: Motion-Flavored Temporal Routing"
description: "Verify temporal-interaction (animation/micro-interaction/reduced-motion) requests still resolve to interface now that the standalone motion mode is retired."
version: 1.1.0.0
id: MDR-003
expected_workflow_mode: interface
expected_leaf_resources: []
---

# MDR-003: Motion-Flavored Temporal Routing

---

## 1. OVERVIEW

This scenario verifies that a temporal-interaction request (the kind that used to route to the retired `motion` mode) still routes through the `sk-design` hub to `workflowMode: interface`, since the `design-motion` capability folded into `interface`.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A UI team wants interaction feedback and accessible motion alternatives for a command menu.

**Exact prompt**:
```text
Design the hover micro-interactions and reduced-motion fallback for this command menu.
```

**Expected mode resolution**: `interface`.

**Why**:
- `mode-registry.json` lists only `interface`, `md-generator`, and `design-mcp-open-design` as modes; `motion` no longer exists as a mode, and its aliases (`motion design`, `animate this`, `micro-interactions`, `transitions`, `AnimatePresence`, `exit animation`, `reduced motion`, `motion performance`) were merged into `interface`'s alias list.
- `hub-router.json` routes the `motion-aliases`, `motion-temporal`, `motion-runtime`, and `motion-feel` vocabulary classes into `interface`'s `routerSignals`.

**Expected packet loaded**:
- `design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/sk-code-handoff.md` if implementation handoff is discussed

**Expected mode resources loaded or cited**:
- `design-interface/references/motion/animation-decision-framework.md` (the restraint gate, loaded first per `MOTION_DECISION`/temporal intents)
- `design-interface/references/motion/micro-interactions.md`
- `design-interface/references/motion/performance-reduced-motion.md`
- `design-interface/assets/motion/motion-pattern-cards.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: read-only. The `interface` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

---

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains a mode with `workflowMode: interface` and `packet: design-interface`.
2. `hub-router.json` contains the `motion-aliases`, `motion-temporal`, and `motion-feel` vocabulary classes routed under `interface`.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MDR003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the resolved `workflowMode`, loaded resources, tool calls, and response in `/tmp/skd-MDR003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `interface`, packet is `design-interface/SKILL.md`, the restraint gate and reduced-motion resources are loaded, and no mutating tool is used.
- **FAIL** iff `md-generator` resolves instead, the restraint gate is skipped before timing/easing guidance, or mutating tools are used.

### Failure Triage

1. If `md-generator` wins, check whether the prompt was accidentally rewritten to emphasize extraction language.
2. If the temporal terms `micro-interactions`, `hover`, and `reduced-motion` did not route correctly, re-check `design-interface/SKILL.md`'s `MOTION_*` `INTENT_SIGNALS` keywords.
3. If reduced-motion resources are missing, inspect `design-interface/SKILL.md` `RESOURCE_MAP.MOTION_PERFORMANCE`.

---

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

---

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
