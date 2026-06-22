---
title: "Cardinal Rules Card"
description: "One-page checklist of the fidelity rules that keep a DESIGN.md hallucination-proof, for a pre-validate self-check."
trigger_phrases:
  - "design.md cardinal rules"
  - "fidelity checklist"
  - "verbatim value rule"
  - "design md pre-validate check"
importance_tier: "high"
contextType: "implementation"
---

# Cardinal Rules Card

A one-page checklist of the rules that make a v3 **Style Reference** trustworthy, for a quick self-check before running validation.

---

## 1. OVERVIEW

### Purpose

A Style Reference earns its value by being hallucination-proof AND ship-ready. These rules are the contract that property depends on; breaking any one turns the document back into a guess. Run this card before `validate.ts`.

### Usage

Read top to bottom against the draft Style Reference. The value-bearing sections (Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, Quick Start) are pre-rendered by `formatters-v3.ts` and pasted unchanged — verify you did not edit them. Every prose claim must be checkable with evidence in `tokens.json` or the facts block. Anything that cannot be checked is a claim to remove, not to estimate.

---

## 2. THE CHECKLIST

```text
□ Every hex, pixel, font-weight, shadow, and radius traces to a value in tokens.json
□ No value was estimated, rounded, normalized, or invented (no "100rem" where tokens say "100%")
□ All hex codes are 6-digit lowercase (#1a1a2e) - no #1A1A2E, #333, rgb(), hsl()
□ Pre-rendered sections (Tokens — Colors, Spacing & Shapes, Surfaces, Quick Start) pasted UNCHANGED
□ Colours are NAMED evocatively (Obsidian Ink, Voltage); each maps to a --color-<slug> token
□ Token column uses --color-<slug>, NEVER the extractor's --_color-primitives internal var
□ Components are NAMED by function (Primary CTA, Card, Badge) - no "Variant-N", no "div"
□ Quick Start CSS :root and Tailwind @theme: every hex/slug traces to a §3/§4/§5 token row
□ Quick Start --page-max-width matches tokens maxContentWidth (no concretized/invented value)
□ L1 + L2 tokens are in the main tables; L3 only in a "Subject to change" sub-table; L4 excluded
□ Elevation is FLAT (stated plainly) when 0 shadow tokens - never "gradient-as-depth"
□ Imagery section is stamped ABSENT (_No <X> data was extracted._) when no imagery signal
□ No frequency dump in prose - frequency decides prominence/role, it is never printed
□ No false SYSTEM asserted: no "focus is consistent" when focusIndicator.consistent is false
□ DO name confidently and infer Similar Brands (grounded inference); NEVER invent a fact or audience
□ Any necessary inference is labeled [INFERRED] and cites a token
□ validate.ts passes: score >= 80 AND claimsScore >= 80, zero hex mismatches, no missing sections
```

---

## 3. STABILITY CLASS QUICK REFERENCE

| Class | Keep? | Treatment |
|-------|-------|-----------|
| L1 Permanent | Yes | Main sections |
| L2 System | Yes | Main sections |
| L3 Campaign | Conditional | "Subject to change" annotation |
| L4 Content | No | Excluded |

---

## 4. RELATED RESOURCES

- [design_md_prompt_template.md](./design_md_prompt_template.md) - the WRITE-phase prompt that encodes these rules.
- [../references/troubleshooting.md](../references/troubleshooting.md) - what to do when validation fails.
