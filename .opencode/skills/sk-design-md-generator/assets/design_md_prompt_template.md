---
title: "DESIGN.md Write-Phase Prompt Template"
description: "Copy-paste prompt for the WRITE phase: turns an extracted tokens.json into a fidelity-checked v3 Style Reference."
trigger_phrases:
  - "design.md write prompt"
  - "compose style reference from tokens"
  - "write phase prompt template"
  - "design md generation prompt"
importance_tier: "normal"
contextType: "implementation"
---

# DESIGN.md Write-Phase Prompt Template

Copy-paste prompt for Phase 2 (WRITE) that composes a v3 **Style Reference** from an extracted `tokens.json`.

---

## 1. OVERVIEW

### Purpose

The WRITE phase used to be where hallucination risk was highest: an agent reading `tokens.json` could estimate a value. In v3 the value-bearing sections are pre-rendered deterministically, so the agent writes prose only and never emits a value. This template front-loads that division of labour and the v3 section contract so the run stays faithful and reads like a named, confident, restrained design-system handoff.

### Usage

**Run the builder first (mandatory).** Run `npx ts-node backend/scripts/build-write-prompt.ts <TOKENS_JSON_PATH>`. It pre-renders the deterministic value sections — `## Tokens — Colors`, `## Tokens — Spacing & Shapes`, `## Surfaces`, and `## Quick Start` — directly from the tokens via `backend/scripts/formatters-v3.ts` (a hue+lightness colour-namer and emitters), and emits a FACTS block (type scale, shadow/gradient/dark-mode/focus honesty) for the prose sections. Its output IS the prompt: paste the PRE-RENDERED sections into the doc UNCHANGED — never rewrite a value, a colour name, a token slug, or the Quick Start — and write only the prose sections it asks for.

Then fill the three placeholders (`<DOMAIN>`, `<TOKENS_JSON_PATH>`, `<DESIGN_MD_PATH>`) and hand the prompt below to the writing agent. Load `references/design_md_format.md` (the section spec) and `references/writing_style_guide.md` (voice) alongside it.

---

## 2. TEMPLATE

```text
Write a v3 Style Reference for <DOMAIN> from the extracted tokens.

Source of truth: <TOKENS_JSON_PATH>. Output: <DESIGN_MD_PATH>.
First run: npx ts-node backend/scripts/build-write-prompt.ts <TOKENS_JSON_PATH>
That output gives you the PRE-RENDERED value sections and a FACTS block — it is your
working material. Read references/design_md_format.md for the section order and
references/writing_style_guide.md for voice before writing.

VOICE: named, confident, restrained — like a design-system handoff, not an extraction
report. DO assign evocative colour names, name components by function, and infer a
Similar Brands list (grounded inference is welcome). NEVER assert a SYSTEM the data
contradicts.

CARDINAL RULES (non-negotiable):
1. Paste the PRE-RENDERED sections (Tokens — Colors, Tokens — Spacing & Shapes, Surfaces,
   Quick Start) UNCHANGED. Do not rewrite a value, a colour name, a token slug, or the
   Quick Start. You write PROSE ONLY.
2. Every value you write elsewhere (Typography, Components, Agent prompts) must come from
   the FACTS block or a pre-rendered section. Never invent or concretize a value — no
   "100rem" when the fact says "100%".
3. Hex codes: 6-digit lowercase only (#1a1a2e, never #1A1A2E, #333, rgb(), or hsl()).
4. Colours are NAMED (Obsidian Ink, Voltage) with --color-<slug> tokens — never the
   extractor's --_color-primitives internal var. Components are NAMED by function
   (Primary CTA, Card, Badge) — never "Variant-N" or "div".
5. No mechanical noise: no frequency dumps ("border 9685"), no raw DOM tags. Frequency
   decides prominence/role; it is never printed.
6. Elevation is FLAT (stated plainly, with how depth is achieved instead) when there are
   0 shadow tokens — never "gradient-as-depth". Imagery is stamped ABSENT
   (`_No <X> data was extracted._`) when there is no imagery signal. Dark-mode prose only
   if the tokens detect a dark palette.
7. NEVER assert an interpretive claim the data contradicts: no "focus is consistent" when
   focusIndicator.consistent is false, no "unlike most systems". If an inference is
   genuinely useful, label it [INFERRED] and cite the token it rests on. Similar Brands is
   explicitly inferential and allowed.

After writing, validate:
  npx ts-node scripts/validate.ts <DESIGN_MD_PATH> <TOKENS_JSON_PATH>
isPass requires score >= 80 AND claimsScore >= 80. checkQuickStartFidelity verifies every
Quick Start hex traces to a token and --page-max-width matches tokens.maxContentWidth.
Resolve every failure before reporting completion.
```

---

## 3. PLACEHOLDER GUIDE

**`<DOMAIN>`**:
- The human label for the source site (e.g. `Stripe`, `stripe.com`).

**`<TOKENS_JSON_PATH>`**:
- The extractor output, e.g. `<--output>/tokens.json`.

**`<DESIGN_MD_PATH>`**:
- Where the document is written, e.g. `<--output>/DESIGN.md`.

---

## 4. RELATED RESOURCES

- [cardinal_rules_card.md](./cardinal_rules_card.md) - the fidelity rules as a standalone checklist.
- [../references/extraction_workflow.md](../references/extraction_workflow.md) - the full three-phase workflow.
