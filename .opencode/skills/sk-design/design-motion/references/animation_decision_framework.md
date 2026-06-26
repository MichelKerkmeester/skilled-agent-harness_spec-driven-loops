---
title: Animation Decision Framework
description: The restraint gate that decides whether an interaction animates at all, keyed to how often the user sees it and to the register motion-budget dial.
trigger_phrases:
  - "should this animate"
  - "animation decision"
  - "motion restraint gate"
  - "animation frequency"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Animation Decision Framework

The first motion question is not which easing or how long. It is whether this should animate at all. Frequency decides. An action a user triggers a hundred times a day is never animated. An action they trigger once is where delight can live. This gate is the strongest lever against motion slop, because most over-animated interfaces fail here, not at the timing scale.

---

## 1. OVERVIEW

### Purpose

Decide whether an interaction earns motion before any timing, easing or material is chosen. This reference owns the restraint gate. Timing, easing and material live in `motion_strategy.md`, and this gate runs before them. If the gate says do not animate, no later choice matters.

### When to Use

- Deciding whether a new interaction gets motion or stays instant.
- Reviewing an interface that feels busy, laggy or over-animated.
- Resolving a request to "add animation everywhere" against the register.
- Setting the motion budget for a surface before choreography starts.

---

## 2. THE FREQUENCY GATE

How often a user sees an animation decides whether it should exist. The more often an action repeats, the more a delay costs and the faster motion turns from polish into friction.

| Frequency | Examples | Decision |
| --- | --- | --- |
| 100+ times per day | command palette toggle, keyboard shortcuts, frequent navigation | No animation. Ever. |
| Tens of times per day | hover effects, list navigation, repeated toggles | Remove or reduce hard. |
| Occasional | modals, drawers, toasts | Standard state transition. |
| Rare or first time | onboarding, first success, celebration, empty state | Delight is allowed here. |

A high-frequency action with motion feels slow even when the duration is short, because the user is waiting on the same delay over and over. Removing the animation makes the interface feel faster without changing a single load time.

---

## 3. THE KEYBOARD RULE

Never animate keyboard-initiated actions. A keyboard shortcut exists so a power user can move at speed. Animation on a keyboard action is a delay inserted exactly where the user asked for none. These actions repeat hundreds of times a day, so the cost compounds.

The clearest example is a command palette with no open or close animation. It appears instantly because it is used constantly. That is the correct experience, not a missing detail.

Apply the rule to anything a keystroke drives:
- Command palette and quick-switcher open and close.
- Shortcut-driven panel and sidebar toggles.
- Keyboard list and menu navigation.
- Any action whose primary path is a keystroke, even when a click can also trigger it.

If a click-driven version of the same control wants a small transition, keep the keyboard path instant and let the pointer path carry the motion.

---

## 4. PURPOSE TEST

If the gate allows motion, the animation still needs one reason to exist. Name it before specifying anything. A valid purpose is one of:

- **Feedback.** A press scales down to confirm the interface heard the user.
- **Spatial continuity.** A toast enters and leaves from the same edge so a swipe to dismiss feels obvious.
- **State indication.** A control morphs to show it changed state.
- **Orientation.** A transition shows where a panel came from or went to.
- **Preventing a jarring change.** An element that would otherwise pop in or out gets a short transition so the change does not read as broken.
- **Explanation.** A marketing or onboarding moment shows how something works.

If the only reason is that it looks cool and the user will see it often, do not animate. Looks-cool is a valid reason exactly once, in the rare or first-time tier, never in the high-frequency tiers.

---

## 5. REGISTER COUPLING

This gate reads the motion-budget dial set by the Brand-vs-Product register in `../shared/register.md`. The register decides the ceiling, this gate decides each case under it.

- **Product surface.** App UI, admin, dashboards, tools, settings and forms. Motion conveys feedback, reveal, loading and view changes through short state transitions. No page-load choreography. Most interactions on a Product surface sit in the high-frequency or tens-per-day tiers, so the gate trims aggressively and the default answer leans toward less motion.
- **Brand surface.** Marketing pages, landing pages, campaigns and portfolios. Motion is voice, so one well-rehearsed entrance is allowed and scroll motion is reserved for a moment that earns it. A Brand surface is seen less often per user, which is what makes a single choreographed moment affordable. It is still one moment, not motion on every section.

When a surface is unlabeled and internal, treat it as Product and let the gate trim. Reach for the Brand allowance only when the surface is clearly the thing being sold.

---

## 6. APPLYING THE GATE

Run the gate in order and stop at the first no.

1. **Frequency.** How often does the user see this? At 100-plus per day the answer is no. In the tens per day, cut it or reduce it hard.
2. **Input.** Is a keystroke the primary trigger? If yes, keep it instant.
3. **Purpose.** Name the one reason. If the reason is looks-cool and the tier is not rare or first-time, the answer is no.
4. **Register.** Confirm the choice fits the motion-budget dial for the surface. A Product surface does not get a Brand entrance just because the gate allowed a transition.

A motion choice that survives all four steps is worth choreographing. Hand it to `motion_strategy.md` for timing, easing and material. A choice that fails any step ships as an instant state change, which is the right outcome, not a downgrade.

### Worked Calls

- **Command palette toggle.** 100-plus per day, keyboard-driven. No animation. Instant open and close.
- **Primary button press.** Occasional to frequent, but feedback is the purpose and the motion is local and sub-`150ms`. Animate the press, keep it tiny.
- **Settings drawer.** Occasional, orientation is the purpose, pointer-driven. Standard state transition.
- **Onboarding success.** First-time, delight is allowed. Choreograph one moment.
- **Row hover on a dense data table used all day.** Tens per day. Reduce to a near-instant color or background change, no movement, so it never slows a scanning power user.
