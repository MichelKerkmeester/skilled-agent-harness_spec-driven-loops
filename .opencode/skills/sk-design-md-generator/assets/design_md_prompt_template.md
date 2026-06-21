---
title: "DESIGN.md Write-Phase Prompt Template"
description: "Copy-paste prompt for the WRITE phase: turns an extracted tokens.json into a fidelity-checked 17-section DESIGN.md."
trigger_phrases:
  - "design.md write prompt"
  - "compose design.md from tokens"
  - "write phase prompt template"
  - "design md generation prompt"
importance_tier: "normal"
contextType: "implementation"
---

# DESIGN.md Write-Phase Prompt Template

Copy-paste prompt for Phase 2 (WRITE) that composes a 17-section `DESIGN.md` from an extracted `tokens.json`.

---

## 1. OVERVIEW

### Purpose

The WRITE phase is where hallucination risk is highest: an agent reading `tokens.json` must transcribe every value without estimating. This template front-loads the cardinal rules and the section contract so the run stays faithful.

### Usage

Fill the three placeholders (`<DOMAIN>`, `<TOKENS_JSON_PATH>`, `<DESIGN_MD_PATH>`), then hand the prompt to the writing agent. Load `tool/resources/design_md_format.md` (the section spec) and `tool/resources/writing_style_guide.md` (voice) alongside it.

---

## 2. TEMPLATE

```text
Write a DESIGN.md for <DOMAIN> from the extracted tokens.

Source of truth: <TOKENS_JSON_PATH>. Output: <DESIGN_MD_PATH>.
Read tool/resources/design_md_format.md for the 17-section v2 specification and
tool/resources/writing_style_guide.md for voice before writing.

CARDINAL RULES (non-negotiable):
1. Every hex, pixel, font-weight, shadow, and radius MUST be copied verbatim from the
   tokens. Never estimate, round, normalize, or invent a value. If a value is not in the
   tokens, it does not appear in the document.
2. Hex codes: 6-digit lowercase only (#1a1a2e, never #1A1A2E, #333, rgb(), or hsl()).
3. Stability gates: L1 + L2 tokens go in the main sections; L3 tokens appear only with a
   "Subject to change" annotation; L4 tokens are excluded entirely.
4. Dark mode: include a dark-mode section ONLY if the tokens contain a detected dark
   palette. Never derive a dark palette from the light one.
5. Accessibility: include the accessibility section from the tokens' a11y data
   (contrast, focus, touch-target). If no a11y data was captured, note the absence
   rather than inventing values.
6. Keep all 17 sections; do not collapse or rename them.

After writing, validate:
  npx ts-node scripts/validate.ts <DESIGN_MD_PATH> <TOKENS_JSON_PATH>
Resolve every hex mismatch and missing section before reporting completion.
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
