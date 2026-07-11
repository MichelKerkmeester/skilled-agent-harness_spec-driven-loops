---
title: "design-motion"
description: "The temporal layer of sk-design: decide whether an interaction animates, then choreograph timing, easing, presence and reduced motion."
trigger_phrases:
  - "motion design"
  - "animation strategy"
  - "AnimatePresence patterns"
  - "reduced motion"
contextType: implementation
version: 1.0.1.0
---

# design-motion

> Decide whether an interaction should move at all, then make the motion that survives that gate feel deliberate.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Animation, transitions, micro-interactions, AnimatePresence exits and reduced-motion behavior |
| **Invoke with** | `sk-design` motion routing, or keywords like `animation`, `transition`, `AnimatePresence`, `reduced motion` |
| **Works on** | An interaction, a state change or a surface, read against its Brand-vs-Product motion budget |
| **Produces** | A purpose, a timing and easing choice, a reduced-motion path and a handoff ready for `sk-code` |

---

## 2. OVERVIEW

### Why This Skill Exists

Most over-animated interfaces fail at one question they never asked: should this animate at all. Designers reach for easing and duration while the real problem is that a hundred-times-a-day action got motion it cannot afford. The result feels slow, busy and decorated rather than clear. Motion sensitivity and frame drops then compound the damage on the devices that can least handle it.

This mode owns the temporal layer of the `sk-design` family. It puts a restraint gate before any timing choice, then carries the choreography through to a reduced-motion path and a clean handoff. It is the standards surface that the `audit` mode cites when it scores motion performance and accessibility.

### What It Does

The work starts at the restraint gate in `references/animation_decision_framework.md`, which decides whether an interaction earns motion using frequency, the keyboard rule, a named purpose and the register motion-budget dial. A choice that survives the gate gets choreographed: purpose, timing, easing, material and a reduced-motion equivalent. Three fill-in cards turn that into a build, and the result hands to `sk-code`. For the visual story a motion moment serves, start in `interface`. For findings-first scoring of a shipped build, use `audit`.

---

## 3. HOW IT WORKS

The flow runs gate first, choreography second, verification last. Skipping the gate is what produces motion slop, so it leads.

**Read the budget.** `../shared/register.md` sets whether the surface is Brand or Product. A Product surface gets state transitions and no page-load choreography. A Brand surface can afford one well-rehearsed moment. An unlabeled internal surface is treated as Product.

**Run the restraint gate.** `references/animation_decision_framework.md` runs four checks in order and stops at the first no. Frequency: a 100-plus-times-a-day action is never animated. Input: a keyboard-driven action stays instant. Purpose: name one reason from feedback, orientation, focus, continuity, perceived performance or earned delight. Register: confirm the choice fits the budget dial.

**Choreograph what survives.** Pick timing and easing from `references/motion_strategy.md`, keep feedback under `300ms` and make exits faster than entrances. Define the reduced-motion equivalent that preserves the state change without the movement.

**Spec it with a card, then verify.** Fill the matching card, run the presence checklist for any exit and clear the performance card before handoff.

**Use the private procedure card when interaction states dominate.** The maintainer-facing card in [`procedures/interaction_states_pass.md`](./procedures/interaction_states_pass.md) supports state-by-state evidence gathering after the public `motion` mode is chosen. It is not a user-selectable route.

### The Three Cards

The cards convert a motion decision into a build-ready spec and two pre-handoff gates.

| Card | Use it to |
|---|---|
| [`assets/motion_pattern_cards.md`](./assets/motion_pattern_cards.md) | Fill one card per pattern, naming owner, single purpose, states and reduced-motion path |
| [`assets/animate_presence_checklist.md`](./assets/animate_presence_checklist.md) | Pass-or-fail every `AnimatePresence` exit for wrappers, keys, mode and nested exits |
| [`assets/motion_performance_failure_card.md`](./assets/motion_performance_failure_card.md) | Catch frame-dropping patterns before review, from layout thrash to unbounded blur |

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this mode when a request involves animation, transitions, hover or focus or active feedback, loading motion, gestures or an `AnimatePresence` exit. Use it to set a motion budget for a surface, to review a transition plan or to spec a pattern for the build team. Stay out of it for static color, type or layout work, which belongs to `foundations`, and for inventing the visual direction, which belongs to `interface`. A findings-first motion-performance review belongs to `audit`, which cites this mode rather than replacing it.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | Routes motion-family prompts to this mode |
| `interface` | Defines the visual story this mode choreographs |
| `foundations` | Supplies static tokens and layout constraints |
| `audit` | Scores motion performance and accessibility using these rules |
| `sk-code` | Implements the choreographed motion in the target stack |

---

## 5. VERIFICATION

The mode ships a manual testing playbook. Run it against the live skill and the on-disk references, with verdicts of PASS, PARTIAL, FAIL or SKIP.

| Check | Result |
|---|---|
| [`manual_testing_playbook/`](./manual_testing_playbook/manual_testing_playbook.md) | Ten scenarios across `strategy`, `presence`, `reduced-motion`, `micro-interactions`, `decision` and `advanced-craft` categories |
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py --check .opencode/skills/sk-design` | Exit 0, the parent skill packages cleanly |

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`references/animation_decision_framework.md`](./references/animation_decision_framework.md) | The restraint gate that decides whether an interaction animates at all |
| [`references/motion_strategy.md`](./references/motion_strategy.md) | Purpose, timing, easing, staging and motion materials |
| [`references/micro_interactions.md`](./references/micro_interactions.md) | Feedback, loading, gestures, delight and morphing icons |
| [`references/animate_presence_patterns.md`](./references/animate_presence_patterns.md) | The reasoning and code behind `AnimatePresence` exits |
| [`references/performance_reduced_motion.md`](./references/performance_reduced_motion.md) | Compositor safety, FLIP, scroll motion and reduced-motion alternatives |
| [`assets/motion_pattern_cards.md`](./assets/motion_pattern_cards.md) | Fill-in spec cards for the common motion patterns |
| [`assets/animate_presence_checklist.md`](./assets/animate_presence_checklist.md) | Pass-or-fail checklist for shipping an exit animation |
| [`assets/motion_performance_failure_card.md`](./assets/motion_performance_failure_card.md) | Build-side card of frame-dropping patterns and their fixes |
| [`procedures/interaction_states_pass.md`](./procedures/interaction_states_pass.md) | Maintainer-facing procedure card for interaction-state evidence after `motion` is selected |
| [`../shared/register.md`](../shared/register.md) | The Brand-vs-Product register that sets the motion budget |
