---
title: Visual Hierarchy
description: Building primary, secondary and tertiary tiers through weight and color rather than size — emphasis by de-emphasis, action styling, label suppression, and the weight-versus-contrast trade.
trigger_phrases:
  - "nothing draws the eye"
  - "everything competes for attention"
  - "primary secondary tertiary content"
  - "emphasize by de-emphasizing"
  - "how to style a destructive button"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Visual Hierarchy

The technique that does the most visible work. `SKILL.md` carries its operative core; this is the full method and the cases where it gets counterintuitive.

---

## 1. OVERVIEW

### Core Principle

A design looks designed because things are ranked, not because they are styled. When everything competes, the interface reads as noise no matter how good the individual values are.

### When to Use

- Nothing on the screen draws the eye, or everything does.
- One element will not stand out no matter what is added to it.
- Deciding how to style an action, especially a destructive one.
- Data reads like a database dump.
- An icon or a border is fighting the text next to it.

### The Three Tiers

Everything on screen sits in a pyramid: **primary**, **secondary**, **tertiary**. Assign every element to a tier before styling any of them. An element that cannot be assigned is usually one that should not be on the screen.

---

## 2. CARRY EMPHASIS WITH WEIGHT AND COLOR

**Size is not everything.** Leaning on font size alone produces primary content that is too big and secondary content that is too small — the classic symptom of a hierarchy built with one lever. Carry emphasis with **weight** and **color** instead, and keep sizes near the middle of the scale.

**Three text colors, maximum:**

- dark for primary content
- grey for secondary content
- lighter grey for tertiary content such as footnotes and copyright

All three carry real body-size text, so all three need 4.5:1. "Lighter grey" means the lightest shade that still clears it — roughly the middle of a nine-step ramp, not the pale end. The pale shades are for disabled states and large text only. The per-step mapping is in [`../assets/token-starter-set.md`](../assets/token-starter-set.md) Section 4.

A fourth text color is almost always a tier that was never decided.

---

## 3. EMPHASIZE BY DE-EMPHASIZING

When the important element will not stand out and there is nothing left to add to it, the problem is not the element. It is the competition.

Soften what competes instead: fade the inactive nav items, drop the sidebar's background color so the main content sits forward, reduce the weight of the repeated metadata on every row. The primary element gets more prominent without changing at all.

This is the single highest-yield move in the whole skill, and it is counterintuitive enough that most people reach for amplification first and end up with a screen where everything shouts.

---

## 4. ACTIONS

**Style actions by hierarchy, not by semantics.**

| Tier | Treatment | Count |
|---|---|---|
| Primary | Solid, high contrast | Usually exactly one per page |
| Secondary | Outline, or a low-contrast background | As many as the page genuinely needs |
| Tertiary | Styled like a link | The rest |

**Destructive does not mean a big red button.** The instinct is to style by what the action *means*; the rule is to style by what it *ranks*. If "Delete" is not the primary action on the page — and on a list or detail view it almost never is — give it tertiary treatment.

Then make it a big red primary button **inside the confirmation dialog**, where it genuinely is the primary action. The red arrives at the moment it carries information, instead of shouting from a screen where the user was not going to delete anything.

---

## 5. LABELS ARE A LAST RESORT

`label: value` gives every piece of data equal weight, which is the opposite of hierarchy. It reads as a database dump because that is structurally what it is.

Most data identifies itself:

- **By format.** `$19.99` is a price. `name@example.com` is an email. `(415) 555-0132` is a phone number. A label adds nothing.
- **By context.** The number under a product title in a cart is a quantity.

Where a label is genuinely needed, in order of preference:

1. **Fold it into the value.** "12 left in stock", not "In stock: 12". "3 bedrooms", not "Bedrooms: 3".
2. **Make it visibly secondary.** Smaller, lighter, or both — so the eye reaches the value first.

The exception is a spec-sheet page, where users scan *for the label* to find the row they want. There, emphasize the label instead, because the label is what is being searched.

---

## 6. BALANCE WEIGHT AGAINST CONTRAST

Weight and contrast are interchangeable currencies, and an element that reads wrong is usually holding too much of one.

**Too heavy?** Reduce contrast. A solid icon covers far more surface area than the text beside it and will out-shout it at the same color; soften the icon's color to compensate. Two elements at the same nominal contrast are not equally loud if one is a solid shape and the other is text.

**Too faint?** Add weight. When a 1px border is too subtle in a soft color but too harsh once darkened, keep the soft color and go to 2px. The problem was never the color.

Stated as one rule: **add weight to fix low contrast; reduce contrast to fix excess weight.**

---

## 7. VISUAL HIERARCHY IS NOT DOCUMENT HIERARCHY

Semantic markup and visual weight are separate decisions, and conflating them produces oversized page titles everywhere.

Section titles are usually **labels**, not headlines. An `h1` rendered at 16px is entirely correct when the heading exists for structure and assistive technology rather than for the eye. Sometimes the title should be visually hidden altogether, because the content already says what it is and a visible heading would only add a competitor to the primary content.

Choose the tag for the document outline. Choose the size, weight and color for the visual tier. They are allowed to disagree.

---

## 8. REFERENCES AND RELATED RESOURCES

- [`diagnosis-table.md`](diagnosis-table.md) Section 2 — the symptoms that resolve to a hierarchy failure, which is most of them.
- [`ux-laws.md`](ux-laws.md) Section 5 — the perceptual basis: Von Restorff for the single exception, proximity for grouping.
- [`../assets/token-starter-set.md`](../assets/token-starter-set.md) — which grey belongs to which text tier.
