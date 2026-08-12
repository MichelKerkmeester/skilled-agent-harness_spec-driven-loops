---
title: "DIA-004 -- Primitive variants"
description: "This scenario validates the on-demand primitive variants for `DIA-004`. It focuses on annotation callouts, the sketchy displacement filter, the terminal skin, and the monochrome icon library."
version: 1.0.0.0
---

# DIA-004 -- Primitive variants

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DIA-004`.

---

## 1. OVERVIEW

This scenario validates the on-demand primitive variants for `DIA-004`. It focuses on annotation callouts, the sketchy displacement filter, the terminal skin, and the monochrome icon library.

### Why This Matters

The primitives are the packet's editorial register — the difference between a diagram that looks like every other technical diagram and one that reads as a designed artifact. Each primitive carries a hard constraint that is easy to get subtly wrong: the sketchy filter must displace shapes and never text or the labels become illegible; callouts are capped at two and live in the margins; the terminal skin stays monospace with a single accent; icons inherit `currentColor` so the skin drives their color. This scenario checks those constraints directly, because a variant that breaks its own rule degrades the whole diagram.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DIA-004` and confirm the expected signals without contradictory evidence.

- Objective: verify the on-demand primitives are applied correctly — callouts, sketchy filter, terminal skin, and icon library
- Real user request: `Make a loop diagram for my newsletter post about compounding habits — hand-drawn style, with a couple of annotations.`
- Prompt: `Create a loop diagram as a self-contained HTML file in a sketchy, hand-drawn register with two annotation callouts and an editorial light layout. Save it to docs/compounding-loop.html.`
- Expected execution process: the agent loads `references/type-loop.md` plus the requested primitives on demand (`references/primitive-sketchy.md` and `references/primitive-annotation.md`), applies the displacement filter to shape groups only, adds at most two italic-serif callouts with dashed leaders, and keeps all text outside the filtered group.
- Expected signals: the `sketchy` filter wraps shapes but no `<text>` element is inside the filtered group; callout count ≤ 2 with dashed `stroke-dasharray="4,3"` leaders and landing dots; page title and names use the correct type roles; an optional terminal variant swaps tokens 1:1 to `terminal-*` with one accent.
- Desired user-visible outcome: a hand-drawn-register loop diagram with crisp, unfiltered labels and at most two editorial callouts.
- Pass/fail: PASS if the filter is applied to shapes only, callouts are ≤ 2 and placed in margins, text is legible and unfiltered, and (when the terminal variant is checked) the skin uses `terminal-*` tokens with a single accent; FAIL if text is inside the filtered group, more than two callouts appear, the terminal variant introduces a second accent, or a non-terminal skin uses JetBrains Mono.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a loop diagram as a self-contained HTML file in a sketchy, hand-drawn register with two annotation callouts and an editorial light layout. Save it to docs/compounding-loop.html.`

### Commands

1. `agent: Read references/style-guide.md, references/type-loop.md, references/primitive-sketchy.md, and references/primitive-annotation.md (on demand)`
2. `agent: Copy assets/template.html to docs/compounding-loop.html`
3. `agent: Apply the sketchy turbulence/displacement filter to shape groups only; keep all text as siblings outside the filtered group`
4. `agent: Add at most two italic Instrument Serif callouts with dashed Bézier leaders and landing dots in the margins`
5. `agent: Run the taste gate and audit the filter grouping, callout count, and typography`

### Expected

Step 3 produces a `<g filter="url(#sketchy)">` containing only shapes, with every `<text>` outside it. Step 4 yields exactly two callouts in the margins, each an italic serif with a dashed leader. Step 5 confirms the loop diagram stays within the budget and no forbidden font (JetBrains Mono) appears. If the operator also requests the terminal variant, step 2 is repeated from `assets/template-terminal.html` and the audit checks `terminal-*` tokens with one accent and a monospace title prefixed with `# `.

### Evidence

Capture the prompt used, the output path `docs/compounding-loop.html`, an excerpt of the SVG showing the `<g filter="url(#sketchy)">` group boundaries with no `<text>` inside, the callout count and their leader `stroke-dasharray`, a grep for `JetBrains Mono` (must be absent), and a screenshot. For the terminal variant, capture the token swap audit and the titlebar dot colors.

### Pass / Fail

- **Pass**: shapes are filtered and text is not, callouts are ≤ 2 with dashed leaders in margins, typography roles are correct, and the terminal variant (if checked) uses a single accent on `terminal-*` tokens.
- **Fail**: text sits inside the filtered group, more than two callouts appear, the terminal variant shows a second accent, or JetBrains Mono appears in a non-terminal skin.

### Failure Triage

1. If text looks wobbly, the filter was applied to a group containing `<text>` — move text to sibling groups outside the filtered group and re-verify.
2. If more than two callouts are present, drop to the two that carry the most editorial weight; callouts are commentary, not labels.
3. For a terminal variant with a second accent, revert the extra color to `terminal-ink` or `terminal-muted` and confirm the titlebar shows one `terminal-accent` dot.

### Optional Supplemental Checks

Add a `terminal` sub-check: request the loop diagram again with the terminal skin and confirm the fixed nine-token palette (independent of any onboarded brand) is used throughout.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/diagram-generation/primitive-variants.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `references/primitive-annotation.md` | Callout grammar and rules |
| `references/primitive-sketchy.md` | Displacement-filter grammar and tuning |
| `references/primitive-terminal.md` | Terminal-skin tokens and rules |
| `references/primitive-icons.md` | Icon library and `currentColor` convention |

---

## 5. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Playbook ID: DIA-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `diagram-generation/primitive-variants.md`
