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

Produces the v2 `DESIGN.md` that AI agents consume as a hallucination-proof design-system reference. This is the highest-risk phase: an agent reading `tokens.json` must transcribe every value without estimating, rounding, normalizing, or inventing. The cardinal fidelity rule is the single non-negotiable contract of the skill. The writer loads the v2 section specification from `tool/resources/design_md_format.md` and the voice/tone rules from `tool/resources/writing_style_guide.md` before composing. The write-phase prompt template (`assets/design_md_prompt_template.md`) and the cardinal rules card (`assets/cardinal_rules_card.md`) front-load the fidelity contract.

To remove the AI from the highest-risk value tables, the phase runs `tool/scripts/build-write-prompt.ts` first: it pre-renders the deterministic value sections (§2 Color, §3 Typography, §6 Depth) directly from tokens via `tool/scripts/formatters.ts` and emits a PRESENT/ABSENT manifest for the data-gated sections. The WRITE phase pastes those pre-rendered tables unchanged and writes prose only for the remaining sections.

---

## 2. HOW IT WORKS

### Cardinal fidelity rule

Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in `DESIGN.md` must be copied verbatim from `tokens.json`. No estimation, no rounding, no invention, no close-enough substitution. If a value is not in `tokens.json`, it does not appear in the document. This rule is what makes `DESIGN.md` a trustworthy reference: every claim is traceable to a measured browser value.

### Doc-as-view value rendering

The value-bearing tables are rendered deterministically, not authored by the AI. `tool/scripts/formatters.ts` renders §2 Color, §3 Typography, and §6 Depth straight from tokens — functional naming, L4 excluded, zero AI in those tables. `tool/scripts/build-write-prompt.ts` pre-renders those sections and emits a PRESENT/ABSENT manifest for the data-gated sections; the WRITE phase runs it first and pastes the pre-rendered tables unchanged. The AI composes only the interpretive and non-value sections, and must obey the manifest: PRESENT sections are written from tokens, ABSENT sections are stamped, not invented.

### Hex format requirements

All hex codes must use 6-digit lowercase format. `#1a1a2e` is correct. `#1A1A2E` (uppercase), `#1a1a2` (3-digit), `#333` (3-digit shortcut), `rgb(26, 26, 46)`, and `hsl(240, 24%, 14%)` are all violations. The validator enforces this in Phase 3.

### Stability gating

L1 (permanent, brand-level) and L2 (system, component-level) tokens populate the main 17 sections. L3 (campaign, temporary) tokens appear only in the `Current Campaign Colors` table with a "Subject to change" annotation and the extraction date. L4 (content, image-derived, one-off) tokens are excluded entirely. Stability classes come from the cluster phase output in `tokens.json`.

### Dark-mode gate

A dark-mode section (section 2.5) appears only when `tokens.json` contains a detected dark-mode palette with populated `tokens.darkMode.variableDiff` entries. Never derive, infer, or fabricate a dark palette from the light tokens.

### Accessibility section

Section 9 (Accessibility Contract) is gated on `a11yTokens` presence and drawn from `tokens.json` a11y data: contrast ratios, focus indicator styles, touch-target dimensions, page language, skip-link presence, tab order, alt-text coverage, reduced-motion support, and ARIA patterns. The focus-indicator claim is provenance-checked: `focusIndicator.captured` and `focusIndicator.consistent` must be true before the document may call focus "consistent." If the extractor captured no a11y data, stamp the section ABSENT rather than inventing values.

### Data-driven sections

Conditional sections are gated on token presence, not authored to fill a fixed count. Brand (§0), Depth (§6), Motion (§6.5), Voice (§7), Accessibility (§9), State Matrix (§11), and Iconography (§12) are written only when their backing tokens exist; when a section has no backing tokens it is stamped ABSENT with a one-line `_No <X> data was extracted._` instead of being invented. Interpretive claims — relationships, named principles, or calling something "consistent" — must cite a real token value or be labeled `[INFERRED]`. The earlier fabrication mandates have been removed: there is no required comparative framing, no required named principle, and no rule that "all 17 sections must be present and non-empty." Anti-pattern AP-29 (Interpretive Fabrication) governs this contract.

### Section numbering and header

The v2 DESIGN.md format specifies numbered core sections plus conditional and optional sections, with section numbering following the specification in `tool/resources/design_md_format.md` exactly. The file opens with two HTML comment lines (generation date, source URL, page count, framework detection, format version).

### Write-phase prompt

The WRITE phase runs `tool/scripts/build-write-prompt.ts` first to pre-render the deterministic value sections and the PRESENT/ABSENT manifest. The prompt template in `assets/design_md_prompt_template.md` then provides a ready-to-fill composition prompt for the remaining sections. Fill the three placeholders (domain label, tokens.json path, DESIGN.md output path), load the format spec and writing style guide alongside, paste the pre-rendered tables unchanged, and hand to the writing agent. The prompt encodes all six cardinal rules inline so the run stays faithful.

### Pre-validate self-check

The cardinal rules card (`assets/cardinal_rules_card.md`) is a one-page checklist for a quick pre-validate self-check against the draft DESIGN.md. Every box must be checkable with evidence in `tokens.json`. Run this before `validate.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `tool/scripts/build-write-prompt.ts` | Script | Pre-renders the deterministic value sections and emits the PRESENT/ABSENT manifest; run first by the WRITE phase |
| `tool/scripts/formatters.ts` | Script | Deterministic doc-as-view renderers for §2 Color, §3 Typography, and §6 Depth from tokens (functional naming, L4 excluded) |
| `assets/design_md_prompt_template.md` | Script | Write-phase prompt encoding the cardinal rules and the section contract |
| `assets/cardinal_rules_card.md` | Script | One-page fidelity checklist for pre-validate self-check |
| `tool/resources/design_md_format.md` | Shared | Authoritative v2 DESIGN.md section specification |
| `tool/resources/anti_patterns.md` | Shared | Authoring anti-patterns including AP-29 Interpretive Fabrication |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/03--fidelity/verbatim-value-fidelity.md` | Manual playbook | Cardinal verbatim-value rule enforcement — confirms every value is copied verbatim with no estimation |
| `tool/scripts/__tests__/formatters.test.ts` | Automated test | Doc-as-view formatter unit tests for §2 Color, §3 Typography, and §6 Depth rendering |
| `tool/scripts/__tests__/build-write-prompt.test.ts` | Automated test | Pre-render and PRESENT/ABSENT manifest unit tests |

---

## 4. SOURCE METADATA

- Group: WRITE DESIGN.MD
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--write-design-md/write-design-md.md`

Related references:
- [tool/resources/writing_style_guide.md](../../tool/resources/writing_style_guide.md) — voice, tone, tense, and section-composition rules
- [tool/resources/anti_patterns.md](../../tool/resources/anti_patterns.md) — common DESIGN.md authoring mistakes
- [cluster-classify.md](../02--cluster-classify/cluster-classify.md) — the stability classes that gate token inclusion
- [validate.md](../04--validate/validate.md) — the hex-and-section validator that confirms fidelity
