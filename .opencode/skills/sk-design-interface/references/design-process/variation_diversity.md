---
title: "Variation Diversity (Seed of Thought)"
description: "A debiasing mechanism for producing multiple design directions: a committed random seed picks a non-median starting point inside a subject-grounded option space, then the remaining directions are spread to be genuinely distinct, with grounding and the anti-default critique still primary and never a style chooser."
trigger_phrases:
  - "give me N variations"
  - "show me design options"
  - "multiple design directions"
  - "five versions of the same layout"
  - "seed of thought debias"
importance_tier: normal
contextType: implementation
---

# Variation Diversity (Seed of Thought)

A debiasing mechanism for the one moment this skill is most likely to fail: when a brief asks for several directions at once. Read it only when producing two or more design directions. It does not replace the grounded, anti-default process in [`design_principles.md`](./design_principles.md). It protects that process from the median pull. When a single direction is wanted, this file does not apply.

---

## 1. OVERVIEW

### Core Principle

Asked for five variations, a model tends to return five versions of the same safe layout. It reaches for the median choice every time because that is where its training data is densest, and a better prompt alone does not move it off that center. The fix is not more randomness in place of judgment. It is a committed random seed that sets a non-median starting point inside an option space you have already grounded in the subject, so the first direction does not begin at the default and the rest are pushed apart from each other. Grounding, the critique against AI-default looks, and the quality floor stay primary throughout. The seed only breaks the tie that the median would otherwise win.

### When to Use

- Whenever the brief asks for more than one direction, a set of options, or "a few" layouts to compare.
- As the debiasing engine behind the pre-build direction gate in [`real_ui_loop.md`](./real_ui_loop.md) Section 7, which sketches and critiques two or three brief-specific directions before building.

### The Role of the Seed

The seed is a debiaser, not a decider. It changes where reasoning starts, never what survives. Every direction it points at must still be grounded in the subject, justified, and run through the anti-default critique. A direction is kept because it earns its place, never because the seed selected it.

---

## 2. THE GROUNDED OPTION SPACE

Before the seed touches anything, build the space it will index into. This is internal scaffolding for the agent, never a menu shown to the user.

- **Pick the diversity axis.** Choose the one axis most likely to collapse to a median for this brief: usually the layout concept or the signature move, sometimes the palette family or the type-pairing archetype. The other axes follow from the direction the seed lands on.
- **Enumerate grounded candidates.** List `M` candidates on that axis, each already defensible for this exact subject. Aim for `M` at least `N + 1` when `N` directions are wanted, so the median can always be excluded. If you cannot find `N + 1` candidates that are genuinely grounded, the brief is too thin: escalate rather than padding the list with defaults.
- **Name the median at index 0.** Order the candidates and put the one you would reach for on any similar brief first, at index 0. That is the AI-default for this axis (a centered hero over a three-column grid, a big number with a gradient accent, one of the three default palettes). Index 0 is the baseline you critique against, not a direction you ship.

The seed then works over the non-median set, the candidates at indices `1` through `M - 1`.

---

## 3. THE SEED-OF-THOUGHT PROCEDURE

Run this only after Step 0 (ground the subject) and the candidate set above exist. Commit the seed before you decide which direction you like, so the choice cannot be rationalised back toward the median.

1. **Commit the seed.** Generate a random 12-character alphanumeric string and write it down. Sum the ASCII value of every character. Record the string and the sum before going further.
2. **Pick the non-median start.** With `K = M - 1` non-median candidates, the starting position is `startPos = asciiSum mod K`. Read it as a 0-based position into the ordered non-median set (indices `1..M-1`). Direction 1 begins at that candidate, which can never be the median at index 0.
3. **Spread the rest.** Choose a `stride` coprime to `K` (for example the smallest of 7, 5, 3, 2 that shares no factor with `K`). Take positions `startPos`, `startPos + stride`, `startPos + 2*stride`, each `mod K`, until you have `N` distinct candidates. The coprime stride guarantees the picks fan across the option space instead of clustering next to each other.
4. **Report the trail.** Record the string, the sum, the start, the stride, and the selected indices in your thinking or the handoff note. This is for auditability, not a chooser surfaced to the user.

```python
# Seed of thought over a grounded, median-excluded option space.
# candidates[0] is the named AI-default for this axis (the critique baseline).
M = len(candidates)
K = M - 1                       # non-median set: indices 1..M-1
ascii_sum = sum(ord(c) for c in seed)   # seed = random 12-char alphanumeric
start = ascii_sum % K
stride = next(s for s in (7, 5, 3, 2) if gcd(s, K) == 1)
positions = [(start + i * stride) % K for i in range(N)]
directions = [candidates[1 + p] for p in positions]   # never candidates[0]
```

---

## 4. HOW IT COMBINES WITH GROUNDING AND CRITIQUE

The seed sits inside the existing process, it does not bypass it.

- **Grounding is upstream and non-negotiable.** Step 0 names the subject, audience, and the page's one job before any candidate exists, and every candidate is drawn from the subject's own world. The seed only orders and selects within that grounded set. It can never introduce an ungrounded option, because there are none in the space.
- **The critique holds the veto.** Run the Step 2 critique against AI-default looks on each selected direction. If a direction collapses toward a default cluster or cannot be justified from the subject, advance to the next position in the spread and re-ground there. The seed sets the start, the critique decides what survives.
- **The quality floor still gates the build.** Each direction that goes to a real render must clear the floor in [`ux_quality_reference.md`](./ux_quality_reference.md): responsive, visible focus, reduced motion respected.

The difference from the raw recipe is the index space. The raw recipe indexes into "the variation options," which for a median-biased model are already N safe versions of one layout. This indexes into a subject-grounded set with the median removed, so the index lands on something that is distinct by construction and grounded by construction.

---

## 5. WORKED MINI-EXAMPLE

**Brief:** a landing page for a boutique letterpress studio. Audience: clients commissioning custom print. The page's one job: show the craft is worth a premium. Three directions wanted, so `N = 3`.

**Diversity axis:** layout concept. Grounded candidate set, `M = 5`, median at index 0:

| Index | Candidate |
|-------|-----------|
| 0 (median) | Centered hero headline over a three-column feature grid |
| 1 | Full-bleed press-bed grid, each cell a printed specimen |
| 2 | Horizontal carriage scroll that travels like a press carriage |
| 3 | Proof-sheet layout with a wide left rail of registration marks |
| 4 | Stacked impression layers that gain ink depth on scroll |

**Seed:** `K7m2QpZ9rD4x`. ASCII sum = 983. Non-median set size `K = 4`.

- `start = 983 mod 4 = 3` -> non-median position 3 -> candidate index 4 (stacked impression layers). Direction 1 is non-median.
- `stride`: smallest of 7, 5, 3, 2 coprime to 4 is 3.
- Positions: 3, (3 + 3) mod 4 = 2, (2 + 3) mod 4 = 1 -> candidate indices 4, 3, 2.

**Three directions:** stacked impression layers, proof-sheet with registration-mark rail, horizontal carriage scroll. The median (index 0) and the press-bed grid (index 1) are not produced. Index 0 is held as the critique baseline.

**Critique gate:** all three ground in letterpress craft and survive the anti-default critique, none is one of the three default palettes or the centered-hero median. Had the carriage scroll flattened into a generic horizontal scroller, the next position would advance to candidate index 1 (press-bed grid) and re-ground there. The seed broke the median pull, the critique kept the result honest.

---

## 6. GUARDRAILS

- **Never a style chooser.** The candidate set and the seed math live in the agent's reasoning and the handoff trail. The user is never shown a pick-a-vibe or pick-a-layout menu. The seed indexes into a grounded space, it does not surface that space as a selectable list.
- **Never a reusable preset.** The candidates are generated from this subject. If the same option set could be dropped onto a different brief, it has become a preset and must not ship, the same bar the parity protocol sets in [`real_ui_loop.md`](./real_ui_loop.md) Sections 7 and 8.
- **Never overrides grounding.** A seed selection that fails the critique is dropped, not kept. The seed has no authority over what is correct for the subject.
- **Single direction is out of scope.** When one design is wanted, the standard critique against defaults already does the debiasing. Do not invent extra variations to justify a seed.

---

## 7. RELATED RESOURCES

- [design_principles.md](./design_principles.md) owns the grounded, anti-default process this mechanism protects.
- [real_ui_loop.md](./real_ui_loop.md) Section 7 is the pre-build direction gate this mechanism debiases, and Sections 7 and 8 set the no-preset guardrail.
- [ux_quality_reference.md](./ux_quality_reference.md) is the objective floor each produced direction must clear before it ships.
