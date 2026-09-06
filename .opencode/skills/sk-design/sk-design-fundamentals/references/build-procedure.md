---
title: Build Procedure
description: The order to work in when designing something new — start from a feature, work in grayscale, shrink the canvas, and choose each value by elimination.
trigger_phrases:
  - "where do i start designing"
  - "design a new screen"
  - "grayscale first"
  - "choose a value by elimination"
  - "how much white space"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Build Procedure

Seven steps for designing something that does not exist yet. They govern the order of work, not the values — the scales in `SKILL.md` decide those.

---

## 1. OVERVIEW

### Core Principle

Most bad interfaces come from designing in the wrong order: the shell before the feature, color before hierarchy, the desktop before the phone. Fixing the order removes most of the work.

### When to Use

- Starting a screen, page or component from nothing.
- Stuck on a layout decision that will not resolve.
- Deciding how much white space something needs.
- Choosing between two adjacent values on a scale.

### When Not to Use

Improving something that exists already. That is [`diagnosis-table.md`](diagnosis-table.md), which starts from the complaint instead.

---

## 2. THE SEVEN STEPS

### 1. Start with a feature, not a layout

Nobody can choose between a top nav and a sidebar before knowing what is in the product. Design one real piece of functionality — the search form, the message composer, the row of a list — and let the shell emerge from what the features turn out to need.

Designing the shell first produces a shell that the features then have to fit into, which is backwards and shows.

### 2. Detail comes later

Work in **grayscale first**. Removing color forces hierarchy to come from spacing, contrast and size, which are the things that actually carry it. A layout that reads correctly in grayscale reads correctly in color; the reverse is not true, because color can prop up a hierarchy that does not exist.

Typefaces, shadows and icons wait until the layout works.

### 3. Do not over-invest in low fidelity

Sketches, wireframes and mockups are disposable. Nobody can use a static picture of an app, so their only job is to explore ideas cheaply. Once the decision is made, abandon them and build the real thing rather than polishing an artifact that will be thrown away.

### 4. Design the smallest useful version, then build it

Work in short design-to-code cycles. The screen in a browser tells the truth; the mockup does not.

Do not imply functionality that is not ready to build. A comment box with an attachments zone that cannot ship yet blocks the whole feature — either build the attachment or remove its affordance.

### 5. Choose by elimination

When picking a value from a scale, do not evaluate it in isolation. Guess the step that seems right, then compare it against the neighbour on each side. Two of the three will be obviously wrong, which makes the decision fast and repeatable.

If an outer option wins, re-run the comparison with that as the new middle. Stop when the middle wins.

This works because a constrained scale makes adjacent values distinguishable. It is also why the spacing scale keeps neighbours about 25% apart: on a linear scale the comparison is meaningless.

### 6. Start with too much white space and remove it

Adding space until something stops looking bad gives the **minimum** acceptable amount. Starting generous and trimming gives the **right** amount. The two rarely land in the same place.

Dense interfaces such as dashboards and data tables are legitimate, but as a deliberate decision made once, not as the default that emerges from never having had enough space to begin with.

### 7. Shrink the canvas

A small component designed on a 1400px artboard sprawls, because the space is there to fill. Start at about 400px and design the mobile layout first, where the constraints are real and every element has to earn its space.

Then bring it to a large screen and relax only what genuinely felt cramped. That is less than expected, and the discipline survives into the desktop layout.

---

## 3. WHAT THE PROCEDURE DOES NOT DECIDE

The steps govern order and process. Every actual value still comes from a scale:

- Spacing, type, weight, color, elevation, radius, opacity and duration are in `SKILL.md` Section 3.
- Palette construction is in [`color-system.md`](color-system.md).
- Hierarchy technique is in `SKILL.md` Section 3, and it is what step 2's grayscale pass is testing.

A procedure followed with invented values produces the same amateur result in a better order.

---

## 4. REFERENCES AND RELATED RESOURCES

- [`diagnosis-table.md`](diagnosis-table.md) — the counterpart for surfaces that already exist.
- [`ux-laws.md`](ux-laws.md) — the cognitive constraints that explain why several of these steps work.
- [`color-system.md`](color-system.md) — where step 2's deferred color decision gets made.
