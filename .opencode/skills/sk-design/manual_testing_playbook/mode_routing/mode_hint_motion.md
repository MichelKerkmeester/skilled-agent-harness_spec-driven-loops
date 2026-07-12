---
title: "MR-006: Mode Hint Override to Motion"
description: "Verify an explicit motion mode hint resolves the motion packet even when transform wording is present."
version: 1.0.0.0
---

# MR-006: Mode Hint Override to Motion

## 1. OVERVIEW

This scenario verifies that a mode hint such as `motion: ...` resolves the matching mode through the hub.

## 2. SCENARIO CONTRACT

**Realistic user request**: A designer wants the temporal feel of a menu transition improved and explicitly names the motion mode.

**Exact prompt**:
```text
motion: make the menu transition feel bolder and more deliberate.
```

**Expected mode resolution**: `motion`.

**Why**:
- `SKILL.md` states that a mode hint like `motion: ...` overrides dominant design intent.
- `mode-registry.json` lists `motion` aliases including `transitions`.
- `hub-router.json` maps `motion-temporal` keywords `transition design` and `smooth animation` to `motion`.
- Although `bolder` appears in `transformVerbRouting.interfaceAliases`, the explicit `motion:` hint and transition wording keep the mode at `motion`.

**Expected packet loaded**:
- `design-motion/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/sk_code_handoff.md` if implementation handoff is discussed

**Expected mode resources loaded or cited**:
- `design-motion/references/corpus_map.md`
- `design-motion/references/animation_decision_framework.md`
- `design-motion/references/motion_strategy.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected tool surface**: read-only. The `motion` registry entry allows `Read`, `Glob`, and `Grep`; it forbids `Write`, `Edit`, and `Bash`.

## 3. TEST EXECUTION

### Preconditions

1. `SKILL.md` contains the mode-hint routing rule.
2. `mode-registry.json` contains the `motion` mode.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-MR006-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, packet, resources, and response in `/tmp/skd-MR006-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `motion`, packet is `design-motion/SKILL.md`, and the response handles temporal design rather than static visual direction.
- **FAIL** iff `interface` wins solely because of `bolder`, or the AI ignores the `motion:` hint.

### Failure Triage

1. If `interface` wins, inspect the hub's mode-hint parsing and transform-verb precedence.
2. If the response lacks motion strategy, inspect `design-motion/references/motion_strategy.md` loading.
3. If the hint conflicts with future prompt wording, rerun with a transition-only prompt to isolate hint parsing from intent ambiguity.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-motion/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
