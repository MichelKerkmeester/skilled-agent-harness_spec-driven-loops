---
title: Advanced Craft Popover And Tooltip Scenario
description: Manual scenario verifying origin-aware popovers, instant follow-up tooltip behavior and advanced CSS entry guidance.
trigger_phrases:
  - "test advanced motion craft"
  - "origin aware popover scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_ADVANCED_CRAFT
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/animation-decision-framework.md
  - references/motion/advanced-craft.md
  - references/motion/performance-reduced-motion.md
---

# MOTION-ADVANCED-001 | Advanced Craft Popover And Tooltip

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-ADVANCED-001`.

**Exact prompt**

```text
Tune the popover and tooltip motion for a dense toolbar. The first tooltip can wait, but adjacent tooltips should feel instant.
```

---

## 1. OVERVIEW

This scenario validates advanced motion craft: origin-aware popover movement tied to the trigger edge, delayed-first/instant-warm tooltip timing across a dense toolbar, and the proposal gate for ambitious effects.

### Why This Matters

Tooltips that re-delay on every adjacent target make a dense toolbar feel sluggish, and popovers that animate from nowhere feel detached from the control that opened them. Getting origin and warm-cluster timing right is what makes a toolbar feel precise rather than merely animated.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm popover motion is origin-aware, tooltip timing is delayed-first and instant-warm, advanced CSS entry guidance is correctly scoped, and ambitious effects are proposed before being built.
- Real user request: `Our toolbar tooltips feel slow when you move along the row. Tune the popover and tooltip motion — the first one can wait, the rest shouldn't.`
- Prompt: `Tune the popover and tooltip motion for a dense toolbar. The first tooltip can wait, but adjacent tooltips should feel instant.`
- Expected execution process: Route to `interface` (the temporal/motion task lane); load `../../references/motion/advanced-craft.md` after the register and restraint gate; specify origin-aware popover movement from the trigger edge; specify delayed first tooltip and instant warm follow-up behavior; include reduced-motion and slow-motion debugging checks; if the effect becomes ambitious, expensive, or technically extraordinary, require a proposal before implementation.
- Expected signals: The register and restraint gate run before advanced craft is loaded; popover origin is tied to the trigger or owning edge; tooltip follow-up is immediate while the cluster is warm; `@starting-style` is scoped to CSS mounted entries only; Framer Motion shorthand is caveated under load; high-ambition effects trigger a proposal.
- Desired user-visible outcome: A toolbar where popovers feel anchored to their triggers and tooltips keep up with the pointer across adjacent controls.
- Pass/fail: PASS if popover origin, warm-cluster tooltip timing, correctly scoped CSS entry guidance, and the proposal gate are all present; FAIL if popover origin is detached from the trigger, warm follow-up re-delays, `@starting-style` is suggested outside CSS mounted entries, or an ambitious effect is built without a proposal.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Route to `interface` (the temporal/motion task lane).
2. Load `references/motion/advanced-craft.md` after the register and restraint gate.
3. Specify origin-aware popover movement from the trigger edge.
4. Specify delayed first tooltip and instant warm follow-up behavior.
5. Include reduced-motion and slow-motion debugging checks.
6. If the effect becomes ambitious, expensive, or technically extraordinary, require a proposal before implementation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-ADVANCED-001 | Advanced craft popover and tooltip timing | Confirm origin-aware popovers, warm-cluster tooltip timing, scoped CSS entry guidance, and the proposal gate | `Tune the popover and tooltip motion for a dense toolbar. The first tooltip can wait, but adjacent tooltips should feel instant.` | bash: rg -n "frequency" ../../references/motion/animation-decision-framework.md -> bash: rg -n "popover" ../../references/motion/advanced-craft.md -> bash: rg -n "reduced motion" ../../references/motion/performance-reduced-motion.md -> agent: tune the popover and tooltip motion | Step 1: restraint gate found and run first; Step 2: origin-aware popover and warm-cluster tooltip rules found; Step 3: reduced-motion checks found; Step 4: output ties popover origin to the trigger and keeps warm follow-up instant | Terminal transcript, the tuned popover and tooltip spec, the origin mapping, the warm-cluster timing, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically a detached popover origin or a re-delaying warm follow-up | 1. Re-read `../../references/motion/advanced-craft.md` for origin and warm-cluster rules; 2. Confirm `@starting-style` was scoped to CSS mounted entries only; 3. Re-run across adjacent toolbar targets and confirm follow-up tooltips are immediate |

### Pass Criteria

- Popover origin is tied to the trigger or owning edge.
- Tooltip follow-up timing is immediate while the cluster is warm.
- `@starting-style` is suggested only for CSS mounted entries.
- Framer Motion shorthand is caveated under load.
- High-ambition effects are proposed before building, naming the effect, served user moment, materials, performance budget, and reduced-motion fallback.
- No extra motion is added beyond the interaction need.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../references/motion/advanced-craft.md` | Origin-aware popovers, warm-cluster tooltip timing, and CSS entry guidance |
| `../../references/motion/animation-decision-framework.md` | Restraint gate run before advanced craft is loaded |
| `../../references/motion/performance-reduced-motion.md` | Reduced-motion and slow-motion debugging checks |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Advanced Craft
- Playbook ID: MOTION-ADVANCED-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `advanced-craft/advanced-craft-popover-tooltip.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
