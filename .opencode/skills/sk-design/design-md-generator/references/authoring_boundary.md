---
title: Authoring Boundary
description: The line between values measured from a live site, values a brief provides, values inferred and values that are absent. It defines the source-of-truth labels that keep a Style Reference faithful to its tokens.json and route forward-authoring out of scope.
trigger_phrases:
  - authoring boundary
  - measured vs authored
  - source of truth labels
  - brief provided values
  - forward authoring out of scope
  - design md provenance
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Authoring Boundary

This mode extracts a live site and renders its real CSS into a Style Reference. Every numeric value is copied verbatim from `tokens.json`. That is the cardinal fidelity rule and it is absolute. This document draws the line around it. It names four origins a value can have, gives each a source-of-truth label and states plainly which origins this mode is allowed to write. Read it as a boundary map, not a feature. It adds no new capability and it does not relax the fidelity contract by one digit.

---

## 1. WHY THE BOUNDARY EXISTS

A Style Reference is trusted because a reader can assume every hex, pixel, weight, radius and shadow in it was measured from a running page. The moment a value with a different origin slips in unlabeled, that assumption breaks for the whole document and the reader can no longer tell ground truth from a guess.

The risk is not careless invention. It is the quiet drift where a plausible-looking value from a brief or a reasonable inference about direction gets written into a token table as if it were measured. The defense is a clear boundary plus a label on anything that is not a measured value.

This mode captures what already exists. It does not author a design from a brief. Keeping those two jobs separate is what this boundary protects.

---

## 2. THE FOUR ORIGINS

Every value a reader might want in a Style Reference comes from one of four origins. The first is the only one this mode writes into token tables.

### 2.1 Measured

A value read off the running page by the extractor and present in `tokens.json`. Hex codes, pixel sizes, font weights, border radii, box shadows, spacing steps, durations. These are the only values allowed in the Tokens tables, Surfaces, Elevation and the Quick Start blocks. They are copied verbatim, never rounded, never normalized, never concretized.

### 2.2 Brief-provided

A value the user supplied in the request rather than the site. A stakeholder might say the brand red is a specific hex or that the body font should be a named family, before any extraction confirms it on the page. A brief-provided value is a stated intent, not a measurement. It is not ground truth about the live surface and it never enters a token table as if the extractor found it.

### 2.3 Inferred

A characterization the writer derives from measured values. Naming a near-black `Obsidian Ink`, stating a color's role, calling the density spacious, listing Similar Brands. These are grounded inferences built on real tokens and the format already allows them. The line is exact: name and characterize what IS measured, never invent a fact, a value or an audience that is not.

### 2.4 Absent

A value the extractor did not capture. No dark palette, no shadow tokens, no imagery signal, no accessibility data. Absent is a real state with a real treatment in the format. A section with no backing data is omitted when conditional or stamped that no data was extracted. Absent is never filled by reaching for a brief-provided guess or by deriving a value the page never showed.

---

## 3. SOURCE-OF-TRUTH LABELS

Labels keep the four origins legible inside one document so the cardinal rule stays enforceable by inspection.

| Origin | Label in the document | Where it may appear |
|---|---|---|
| Measured | unlabeled, the default | Token tables, Surfaces, Elevation, Quick Start, characterizing prose |
| Brief-provided | stated as the brief's intent, never as a token | Prose context only, kept out of value tables |
| Inferred | `[INFERRED]` and cites the measured token it rests on | Names, roles, Similar Brands, characterizing prose |
| Absent | stamped that no data was extracted or the section omitted | The section that would have held the value |

Three rules govern the labels.

1. Measured is the default and carries no label. Because it is the default, anything that is NOT measured has to be marked, so an unlabeled value is a promise that the extractor measured it.
2. A brief-provided value never sits in a token table. It is not a measurement and the table is reserved for measurements. If a brief value needs recording, it belongs in prose as a stated intent, plainly distinct from the measured tokens.
3. An inferred claim names what is measured and cites the token under it. Inference characterizes real data. It never manufactures a value, and the citation is what lets a reader trace it back to ground truth.

---

## 4. WHAT THIS MODE WRITES

This mode writes measured values and grounded inferences about them. Nothing else reaches a token table.

- Measured values fill the Tokens tables, Surfaces, Elevation and the Quick Start, verbatim from `tokens.json`.
- Inferences supply evocative names, plain role statements and Similar Brands, each grounded in a measured token.
- Brief-provided values stay out of the value tables. They may set context in prose as a stated intent and they never wear the appearance of a measurement.
- Absent values are stamped or omitted, never backfilled.

The Quick Start exists because the output is ship-ready, and it is ship-ready precisely because every value in it was measured. A brief-provided or invented value in the Quick Start would hand a coding agent a fabricated token under the banner of ground truth, which is the exact failure the cardinal rule exists to prevent.

---

## 5. FORWARD-AUTHORING IS OUT OF SCOPE

Generating a Style Reference from a brief alone, with no live site to measure, is forward-authoring. It is OUT OF SCOPE for this mode and this document does not enable it.

Forward-authoring inverts the input contract. This mode starts from a running page and reports what is measurably there. Forward-authoring starts from a brief and proposes what should be there. A skill in the wider field, the Stitch design-taste skill, illustrates the forward-authoring shape: it turns a vibe and a set of directives into a `DESIGN.md` for screen generation with no extraction step and no measured source. That is a different job with a different contract, and treating its output and this mode's output as interchangeable is the category error this boundary guards against.

The reasons forward-authoring stays out are structural, not a matter of effort.

- Different input contract. Measured extraction needs a live, renderable URL. Forward-authoring needs only a brief. Folding both into one mode would blur the very assumption that makes a Style Reference trustworthy.
- Fidelity must not weaken. The cardinal rule binds every value to `tokens.json`. A brief-driven path has no `tokens.json` to bind to, so admitting it here would force a relaxation of the contract. That trade is refused.
- No second backend. This mode already extracts, writes, validates and reports through one pipeline. Forward-authoring is not a missing stage of that pipeline. It is a separate capability.

When a user wants a design authored from a brief with no site to measure, that is a separate future design-spec decision, routed away from this mode. Do not satisfy the request by loosening fidelity here. State that this mode captures an existing surface, and that brief-only authoring is a different contract handled elsewhere.

---

## 6. QUICK BOUNDARY CHECK

Run this before writing any value into a Style Reference.

```text
□ Is the value in tokens.json? If yes, it is measured. Copy it verbatim, no label.
□ Did it come from the brief, not the page? Keep it out of token tables. Note it as intent in prose only.
□ Is it a characterization of a measured value? Mark it [INFERRED] and cite the token.
□ Did the extractor not capture it? Stamp the section absent or omit it. Never backfill.
□ Are you authoring from a brief with no live site? Stop. That is forward-authoring, out of scope, route to the separate design-spec decision.
```

---

## 7. RELATED RESOURCES

- [design_md_format.md](design_md_format.md) - the Style Reference section specification and the Section 0 cardinal rules this boundary protects.
- [../assets/source_of_truth_router_card.md](../assets/source_of_truth_router_card.md) - the fill-in card that sorts each value into measured, brief-provided, inferred or absent before writing.
- [../assets/cardinal_rules_card.md](../assets/cardinal_rules_card.md) - the pre-validate fidelity checklist.
- [../../shared/register.md](../../shared/register.md) - the Brand-vs-Product register. This mode records the extracted surface's register, it does not author one from a brief.
