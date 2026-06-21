---
title: "Write DESIGN.md"
description: "Compose the 17-section v2 DESIGN.md from tokens.json, copying every hex, pixel, font-weight, shadow, and radius verbatim under the cardinal fidelity rule."
trigger_phrases:
  - "write DESIGN.md"
  - "cardinal fidelity rule"
  - "verbatim value contract"
  - "6-digit lowercase hex"
  - "17-section design system reference"
importance_tier: "normal"
---

# Write DESIGN.md (Phase 2)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Produces the 17-section `DESIGN.md` that AI agents consume as a hallucination-proof design-system reference. This is the highest-risk phase: an agent reading `tokens.json` must transcribe every value without estimating, rounding, normalizing, or inventing. The cardinal fidelity rule is the single non-negotiable contract of the skill. The writer loads the v2 section specification from `tool/resources/design-md-format.md` and the voice/tone rules from `tool/resources/writing-style-guide.md` before composing. The write-phase prompt template (`assets/design_md_prompt_template.md`) and the cardinal rules card (`assets/cardinal_rules_card.md`) front-load the fidelity contract.

---

## 2. HOW IT WORKS

### Cardinal fidelity rule

Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in `DESIGN.md` must be copied verbatim from `tokens.json`. No estimation, no rounding, no invention, no close-enough substitution. If a value is not in `tokens.json`, it does not appear in the document. This rule is what makes `DESIGN.md` a trustworthy reference: every claim is traceable to a measured browser value.

### Hex format requirements

All hex codes must use 6-digit lowercase format. `#1a1a2e` is correct. `#1A1A2E` (uppercase), `#1a1a2` (3-digit), `#333` (3-digit shortcut), `rgb(26, 26, 46)`, and `hsl(240, 24%, 14%)` are all violations. The validator enforces this in Phase 3.

### Stability gating

L1 (permanent, brand-level) and L2 (system, component-level) tokens populate the main 17 sections. L3 (campaign, temporary) tokens appear only in the `Current Campaign Colors` table with a "Subject to change" annotation and the extraction date. L4 (content, image-derived, one-off) tokens are excluded entirely. Stability classes come from the cluster phase output in `tokens.json`.

### Dark-mode gate

A dark-mode section (section 2.5) appears only when `tokens.json` contains a detected dark-mode palette with populated `tokens.darkMode.variableDiff` entries. Never derive, infer, or fabricate a dark palette from the light tokens.

### Accessibility section

Section 9 (Accessibility Contract) is always present and drawn from `tokens.json` a11y data: contrast ratios, focus indicator styles, touch-target dimensions, ARIA patterns. If the extractor captured no a11y data, note the absence rather than inventing values.

### The 17-section contract

The v2 DESIGN.md format specifies 14 numbered core sections (0-13), one half-section (6.5 Motion System), and 4 optional sections (14-17). Every core section is present and non-empty. Section numbering follows the specification in `tool/resources/design-md-format.md` exactly. The file opens with two HTML comment lines (generation date, source URL, page count, framework detection, format version).

### Write-phase prompt

The prompt template in `assets/design_md_prompt_template.md` provides a ready-to-fill composition prompt. Fill the three placeholders (domain label, tokens.json path, DESIGN.md output path), load the format spec and writing style guide alongside, and hand to the writing agent. The prompt encodes all six cardinal rules inline so the run stays faithful.

### Pre-validate self-check

The cardinal rules card (`assets/cardinal_rules_card.md`) is a one-page checklist for a quick pre-validate self-check against the draft DESIGN.md. Every box must be checkable with evidence in `tokens.json`. Run this before `validate.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/design_md_prompt_template.md` | Script | Write-phase prompt encoding the cardinal rules and the 17-section contract |
| `assets/cardinal_rules_card.md` | Script | One-page fidelity checklist for pre-validate self-check |
| `tool/resources/design-md-format.md` | Shared | Authoritative v2 DESIGN.md section specification |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/03--fidelity/fidelity-001.md` | Manual playbook | Cardinal verbatim-value rule enforcement — confirms every value is copied verbatim with no estimation |
| (no automated test) | Automated test | Covered by the manual playbook scenario |

---

## 4. SOURCE METADATA

- Group: WRITE DESIGN.MD
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--write-design-md/write-design-md.md`

Related references:
- [tool/resources/writing-style-guide.md](../../tool/resources/writing-style-guide.md) — voice, tone, tense, and section-composition rules
- [tool/resources/anti-patterns.md](../../tool/resources/anti-patterns.md) — common DESIGN.md authoring mistakes
- [cluster-classify.md](../02--cluster-classify/cluster-classify.md) — the stability classes that gate token inclusion
- [validate.md](../04--validate/validate.md) — the hex-and-section validator that confirms fidelity
