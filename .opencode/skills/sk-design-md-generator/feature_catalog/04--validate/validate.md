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

Confirms that a DESIGN.md is faithful to its source `tokens.json` before any completion claim. The validator runs three checks: hex accuracy (every hex in DESIGN.md traces to a token), section completeness (all required v2 core sections present and non-empty), and format consistency (hex casing, phantom colors, missing sections). An unvalidated DESIGN.md is a draft. Validation is always run after the write phase and can also run standalone on an existing DESIGN.md + tokens.json pair.

---

## 2. HOW IT WORKS

### Invocation

```bash
npx ts-node scripts/validate.ts <DESIGN.md> output/<domain>/tokens.json
```

The first argument is the DESIGN.md path. The second is the tokens.json path. The validator reads both, parses DESIGN.md to extract all hex values, and cross-references each against the token source.

### Hex-accuracy check

The validator extracts every hex code from DESIGN.md (hex strings matching `#[0-9a-fA-F]{3,6}`) and checks each against two token sources:

- `tokens.colorTokens[].hex` -- all color tokens emitted by the extractor.
- `tokens.cssVariables[].value` -- all CSS custom property values.

Any hex in DESIGN.md that cannot be traced to one of these two sources is reported as a phantom color and must be removed or sourced before the document passes validation.

### Section-completeness check

The validator parses DESIGN.md section headings (`## N. Title`) and checks the required v2 core sections are present. The core section set covers sections 0 through 13, plus section 6.5 (Motion System). Sections 11 (State Matrix) and 12 (Iconography) are specifically checked. Dark-mode section 2.5 is checked only when `tokens.darkMode.supported === true`. The validator also confirms that each required section contains non-whitespace content.

### Format-consistency check

The validator flags:

- Uppercase hex (`#1A1A2E`) as a casing violation.
- 3-digit hex shortcuts (`#333`, `#fff`) as an expansion violation.
- `rgb()` and `hsl()` function notation as an invariant violation (hex-only rule).
- Phantom colors: hex values in DESIGN.md with no matching token source.

### Score and verdict

The validator produces a score with per-finding messages and a pass/fail verdict. Zero hex mismatches and zero missing sections are required for a pass. Format violations are individually reported. The output guides targeted fixes in DESIGN.md before re-validation.

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
- [tool/resources/quality-checklist.md](../../tool/resources/quality-checklist.md) — pre-validate self-check list
- [write-design-md.md](../03--write-design-md/write-design-md.md) — the write phase that produces the DESIGN.md under validation
- [references/troubleshooting.md](../../references/troubleshooting.md) — failure modes and escalation guidance
