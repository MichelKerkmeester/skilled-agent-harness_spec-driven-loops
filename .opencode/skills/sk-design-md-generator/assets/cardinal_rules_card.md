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

A one-page checklist of the rules that make a `DESIGN.md` trustworthy, for a quick self-check before running validation.

---

## 1. OVERVIEW

### Purpose

A `DESIGN.md` earns its value by being hallucination-proof. These rules are the contract that property depends on; breaking any one turns the document back into a guess. Run this card before `validate.ts`.

### Usage

Read top to bottom against the draft `DESIGN.md`. Every box must be checkable with evidence in `tokens.json`. Anything that cannot be checked is a value to remove or escalate, not to estimate.

---

## 2. THE CHECKLIST

```text
□ Every hex, pixel, font-weight, shadow, and radius traces to a value in tokens.json
□ No value was estimated, rounded, normalized, or invented
□ All hex codes are 6-digit lowercase (#1a1a2e) - no #1A1A2E, #333, rgb(), hsl()
□ L1 + L2 tokens are in the main sections
□ L3 tokens appear only with a "Subject to change" annotation
□ L4 (content / image-derived) tokens are excluded entirely
□ A dark-mode section exists ONLY if tokens.json has a detected dark palette
□ The accessibility section is drawn from tokens.json a11y data (or notes its absence)
□ Required sections are present; conditional sections appear ONLY when their backing tokens exist
□ Any section with no backing data is stamped ABSENT (_No <X> data was extracted._), never invented
□ No interpretive claim - a relationship, cause, consistency, or named principle - lacks a backing token
□ No "gradient-as-depth", "focus is consistent", or "unlike most systems" without token evidence
□ Any necessary inference is labeled [INFERRED] and cites a token
□ validate.ts passes with zero hex mismatches and zero missing required sections
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
