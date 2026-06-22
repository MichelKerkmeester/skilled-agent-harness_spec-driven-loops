---
title: "Validate"
description: "Check hex accuracy against tokens.json, confirm v2 core-section completeness, detect hex-format violations, and flag phantom colors."
trigger_phrases:
  - "validate DESIGN.md"
  - "hex accuracy check"
  - "section completeness"
  - "npx ts-node scripts/validate.ts"
  - "design md fidelity check"
importance_tier: "normal"
---

# Validate (validate.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Confirms that a DESIGN.md is faithful to its source `tokens.json` before any completion claim. The validator runs value-fidelity checks — hex accuracy (every hex in DESIGN.md traces to a token), section coverage (required v2 sections present; conditional sections present only when their backing tokens exist, otherwise stamped ABSENT), and format consistency (hex casing, phantom colors) — alongside semantic prose checks that catch invented narrative. It reports a dual score: a `valuesScore` for hex/section/format fidelity and a `claimsScore` for prose provenance. An unvalidated DESIGN.md is a draft. Validation is always run after the write phase and can also run standalone on an existing DESIGN.md + tokens.json pair.

---

## 2. HOW IT WORKS

### Invocation

```bash
npx ts-node scripts/validate.ts <DESIGN.md> <--output>/tokens.json
```

The first argument is the DESIGN.md path. The second is the tokens.json path. The validator reads both, parses DESIGN.md to extract all hex values, and cross-references each against the token source.

### Hex-accuracy check

The validator extracts every hex code from DESIGN.md (hex strings matching `#[0-9a-fA-F]{3,6}`) and checks each against two token sources:

- `tokens.colorTokens[].hex` -- all color tokens emitted by the extractor.
- `tokens.cssVariables[].value` -- all CSS custom property values.

Any hex in DESIGN.md that cannot be traced to one of these two sources is reported as a phantom color and must be removed or sourced before the document passes validation.

### Section-coverage check

The validator parses DESIGN.md section headings (`## N. Title`) and checks the required v2 sections are present. Conditional sections (Brand §0, Depth §6, Motion §6.5, Voice §7, Accessibility §9, State Matrix §11, Iconography §12) are data-driven: they are expected only when their backing tokens exist. Dark-mode section 2.5 is checked only when `tokens.darkMode.supported === true`. The semantic section-coverage check flags a high-risk section that is present while its backing tokens are empty and the section was not stamped ABSENT — that combination is the signature of fabricated content. A section with no backing data should be stamped ABSENT, not filled.

### Format-consistency check

The validator flags:

- Uppercase hex (`#1A1A2E`) as a casing violation.
- 3-digit hex shortcuts (`#333`, `#fff`) as an expansion violation.
- `rgb()` and `hsl()` function notation as an invariant violation (hex-only rule).
- Phantom colors: hex values in DESIGN.md with no matching token source.

### Prose-discipline check

A WARNING-tier semantic check flags interpretive prose that the tokens cannot support. It catches "gradient-as-depth" / "replaces shadow elevation" claims, comparison-to-other-systems framing ("unlike most systems" and similar), and an unbacked "focus is consistent" assertion (flagged when `tokens.json` shows `focusIndicator.captured === false` or `consistent === false`). These are warnings, not hard failures, but they drive down the `claimsScore`.

### Score and verdict

The validator produces a dual score with per-finding messages and a pass/fail verdict: `valuesScore` covers hex, section, and format fidelity; `claimsScore` covers prose provenance (the prose-discipline and section-coverage findings). Zero hex mismatches and zero missing required sections are needed for a values pass; a `claimsScore` below 80 surfaces prominently so invented prose cannot hide behind clean hex fidelity. Format violations are individually reported. The output guides targeted fixes in DESIGN.md before re-validation.

### Escalation triggers

Four conditions require escalation rather than automated correction:

- A hex mismatch where `tokens.json` itself contains an invalid-cased hex (e.g., `#1A1A2E` where the live CSS was `#1a1a2e`). Ask whether to correct `tokens.json` before re-validating.
- A missing section that the user intentionally removed. Offer to re-run extraction with different parameters.
- Manual edits to DESIGN.md that deviate from `tokens.json`. These break validation. Offer re-extraction.
- The validator reports errors that appear to be extractor bugs rather than write-phase errors.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `tool/scripts/validate.ts` | Script | Hex-accuracy checker, section-completeness checker, format-consistency checker, scoring engine |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/02--validate/phantom-hex-detection.md` | Manual playbook | Validator pass/fail scenario — confirms faithful DESIGN.md passes and phantom hexes are flagged |
| `tool/scripts/__tests__/validate.test.ts` | Automated test | Validation engine unit tests covering hex accuracy, section completeness, and format consistency |

---

## 4. SOURCE METADATA

- Group: VALIDATE
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--validate/validate.md`

Related references:
- [tool/resources/quality_checklist.md](../../tool/resources/quality_checklist.md) — pre-validate self-check list
- [write-design-md.md](../03--write-design-md/write-design-md.md) — the write phase that produces the DESIGN.md under validation
- [references/troubleshooting.md](../../references/troubleshooting.md) — failure modes and escalation guidance
