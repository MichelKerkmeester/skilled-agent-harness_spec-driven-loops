---
title: UX Laws for Authoring
description: The cognitive and perceptual laws that decide how an interface should be structured — target size, choice count, chunking, response budgets, grouping, emphasis and progressive disclosure.
trigger_phrases:
  - "fitts law target size"
  - "hicks law too many choices"
  - "chunk information into groups"
  - "progressive disclosure"
  - "why does this feel overwhelming"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# UX Laws for Authoring

The constraints a human brain and hand impose on an interface. Each one turns into a concrete structural decision.

---

## 1. OVERVIEW

### Core Principle

Hierarchy decides what the eye reaches first. These laws decide what should be on the screen at all, how it is grouped, and how long it may take to respond.

### When to Use

- Deciding how many options to show, or whether to split a flow into steps.
- A screen "feels overwhelming" and the hierarchy fixes did not resolve it.
- Sizing interactive targets, or deciding where a control belongs.
- Setting a response-time budget for an interaction that hits the network.

### Boundary With The Sibling Skill

`sk-design-md-generator/references/design-knowledge/cognitive-laws.md` covers eight of these same laws as **reading** vocabulary: it cites a law to explain why a captured surface reads the way it does. This document is the **authoring** direction — the same laws stated as decisions to make. Where both name a law, they agree; only the direction differs.

---

## 2. INPUT AND TARGETS

### Fitts's Law

Targets are faster to hit when they are larger and closer to where the pointer already is. A 16px icon button is a miss waiting to happen.

Size interactive targets to be comfortably hittable, and **expand the hit area with padding or a negative-inset pseudo-element rather than by growing the visual box**. The control can stay small and still be easy to hit.

Minimum sizes are contested across sources and reconciled in [`interaction-craft.md`](interaction-craft.md) Section 3: 44px for anything a thumb operates, 32px as the floor for a dense pointer-driven UI.

### Serial Position Effect

People remember the first and last items in a sequence best. Put the items that matter at the start or the end of a list, a nav, or a set of steps — never buried in the middle.

---

## 3. CHOICE AND COMPLEXITY

### Hick's Law

Decision time rises with the number of choices. Minimize what is visible at once: reduce options, group related actions, and defer the advanced ones.

### Miller's Law

Working memory is limited. Chunk data into groups of roughly five to nine so it can be scanned rather than read. A flat list of thirty items is thirty decisions; six groups of five is six.

### Progressive Disclosure

Show what matters now and reveal complexity later. This is Hick's Law applied over time rather than over a single screen.

### Tesler's Law

Complexity is conserved: every process has an irreducible amount, and the only question is who absorbs it. Move it to the system — defaults, inference, smart parsing — rather than pushing it onto the user as another field to fill in.

### Pareto Principle

Roughly 20% of the features carry 80% of the use. Prioritize accordingly: the critical few get the primary treatment, the rest earn their place or move behind disclosure.

### Cognitive Load

Minimize extraneous load — anything the user has to process that is not the task. Decorative complexity, inconsistent patterns and unexplained jargon are all load with no payoff.

---

## 4. RESPONSE AND FEEDBACK

### Doherty Threshold

An interface feels instant when it responds within about **400ms**. Past that, attention drifts and the user starts to feel they are waiting on the machine.

When the real work cannot finish inside the budget, fake the speed honestly: skeletons, optimistic updates, and progress indicators all preserve flow. An optimistic update that rolls back on error is covered in [`interaction-craft.md`](interaction-craft.md) Section 8.

Note the separation from motion timing. The 400ms here is the budget for the **system to respond**; the motion bands in [`motion-principles.md`](motion-principles.md) Section 5 govern how long the **animation** takes once it starts. They are different clocks.

### Goal-Gradient Effect

Motivation increases as a goal gets closer. Show progress toward completion — a step counter, a filled bar, a checklist — and the last steps get easier rather than harder.

### Zeigarnik Effect

Incomplete tasks stay in mind. Showing an unfinished state drives completion, which is why a half-filled profile prompt works and a silently incomplete one does not.

### Peak-End Rule

An experience is remembered by its most intense moment and its ending. Finish flows with a clear success state rather than dropping the user back where they started with no acknowledgement.

---

## 5. GROUPING AND EMPHASIS

These are the Gestalt principles, stated as decisions.

### Proximity

Group related elements spatially with tighter spacing. This is the same rule as "more space around a group than within it" in `SKILL.md` Section 4, reached from the perception side rather than the layout side.

### Similarity

Elements that behave alike should look alike. Two buttons with the same role and different treatments read as two different things.

### Common Region

A shared boundary — a card, a panel, a bordered block — groups whatever is inside it, and it groups more strongly than proximity does. Use it deliberately, and remember the border rules: if there is already a background change, the border is redundant.

### Uniform Connectedness

Visually connecting elements with a line or a frame binds them more strongly than proximity or similarity. This is why a stepper with a connecting line reads as one flow and a row of separate circles does not.

### Von Restorff Effect

The item that differs is the one remembered. Make the important element visually distinct — but only one, or the effect cancels itself out. This is the perceptual basis for "usually exactly one primary action per page".

### Law of Prägnanz

The eye simplifies complex shapes into the simplest form it can. Designs built from simple, regular forms are read faster and with less effort than intricate ones.

---

## 6. EXPECTATION

### Jakob's Law

People spend most of their time on other products, so they expect yours to work the way those do. Familiar patterns are not a lack of imagination; they are a transfer of learning the user already paid for.

Deviate only where the deviation earns something the familiar pattern cannot give.

### Postel's Law

Be liberal in what you accept and conservative in what you emit. Accept messy input — pasted phone numbers with spaces, dates in several formats, trailing whitespace — and normalize it rather than rejecting it. A validation error the system could have resolved itself is a defect.

### Aesthetic-Usability Effect

People perceive attractive interfaces as easier to use, and they forgive more of their flaws. That is a reason to finish the visual work, not a licence to let polish cover a broken hierarchy or an accessibility failure.

---

## 7. REFERENCES AND RELATED RESOURCES

- [`interaction-craft.md`](interaction-craft.md) — hit areas, feedback placement and optimistic updates, where several of these laws become implementation details.
- [`motion-principles.md`](motion-principles.md) — the motion clock, distinct from the Doherty response budget.
- [`build-procedure.md`](build-procedure.md) — the working order these constraints sit inside.
- `sk-design-md-generator/references/design-knowledge/cognitive-laws.md` — the reading-direction counterpart.
