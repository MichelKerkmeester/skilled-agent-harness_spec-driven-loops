---
title: "Validate"
description: "Check hex accuracy against tokens.json, confirm v3 Style Reference section completeness, verify Quick-Start fidelity, detect hex-format violations, and flag phantom colors."
trigger_phrases:
  - "validate DESIGN.md"
  - "hex accuracy check"
  - "v3 section completeness"
  - "quick start fidelity"
  - "npx ts-node scripts/validate.ts"
  - "design md fidelity check"
importance_tier: "normal"
version: 1.0.0.7
---

# Validate (validate.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Confirms that a DESIGN.md is faithful to its source `tokens.json` before any completion claim. The validator is v3-schema-aware: it detects the v3 Style Reference (by the `## Tokens — Colors` heading or a `— Style Reference` header) and checks the v3 required-section set, while still recognizing the legacy v1/v2 schemas for older docs. It runs value-fidelity checks — hex accuracy (every hex in DESIGN.md traces to a token), section coverage (required v3 sections present), Quick-Start fidelity (every Quick Start hex traces to a token, `--page-max-width` matches `tokens.json`), and format consistency (hex casing, phantom colors) — alongside semantic prose checks that catch invented narrative. It reports a dual score: a `valuesScore` for hex/section/format fidelity and a `claimsScore` for prose provenance, and `isPass()` requires `claimsScore >= 80`. An unvalidated DESIGN.md is a draft. Validation is always run after the write phase and can also run standalone on an existing DESIGN.md + tokens.json pair.

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

The validator detects the schema version (v3 carries the `## Tokens — Colors` heading or a `— Style Reference` header) and checks the matching required-section set. The v3 required sections are: Tokens — Colors, Tokens — Typography, Tokens — Spacing & Shapes, Components, Do's and Don'ts, Surfaces, Elevation, Layout, Agent Prompt Guide, Similar Brands, and Quick Start. Older v1/v2 docs are matched against their legacy section lists. The semantic section-coverage check additionally flags a high-risk section that is present while its backing tokens are empty and the section was not stamped ABSENT — that combination is the signature of fabricated content. A section with no backing data should be stamped ABSENT (or, for Elevation, rendered FLAT), not filled.

### Quick-Start fidelity check

`checkQuickStartFidelity` enforces the ship-ready Quick Start block: every hex inside `## Quick Start` must trace to `tokens.colorTokens` — a phantom Quick Start hex is a failure — and the `--page-max-width` value must match `tokens.spacingSystem.maxContentWidth`. This is the precise backstop for the "100rem where tokens say 100%" value-fabrication class: a Quick Start that disagrees with the tokens is caught here rather than slipping through as ship-ready CSS.

### Format-consistency check

The validator flags:

- Uppercase hex (`#1A1A2E`) as a casing violation.
- 3-digit hex shortcuts (`#333`, `#fff`) as an expansion violation.
- `rgb()` and `hsl()` function notation as an invariant violation (hex-only rule).
- Phantom colors: hex values in DESIGN.md with no matching token source.

### Prose-discipline check

A WARNING-tier semantic check flags interpretive prose that the tokens cannot support. It catches "gradient-as-depth" / "replaces shadow elevation" claims, comparison-to-other-systems framing ("unlike most systems" and similar), and an unbacked "focus is consistent" assertion (flagged when `tokens.json` shows `focusIndicator.captured === false` or `consistent === false`). These are warnings, not hard failures, but they drive down the `claimsScore`.

### Score and verdict

The validator produces a dual score with per-finding messages and a pass/fail verdict: `valuesScore` covers hex, section, format, and Quick-Start fidelity; `claimsScore` covers prose provenance (the prose-discipline and section-coverage findings). Zero hex mismatches, zero missing required sections, and a faithful Quick Start are needed for a values pass; `isPass()` additionally requires `claimsScore >= 80`, so invented prose cannot hide behind clean hex fidelity — a `claimsScore` below 80 fails the verdict and surfaces prominently. Format violations are individually reported. The output guides targeted fixes in DESIGN.md before re-validation.

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
| `backend/scripts/validate.ts` | Script | v3-schema-aware hex-accuracy checker, v3 section-completeness checker, Quick-Start fidelity checker (`checkQuickStartFidelity`), format-consistency checker, dual-score engine (`isPass` requires `claimsScore >= 80`) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/validate/phantom_hex_detection.md` | Manual playbook | Validator pass/fail scenario — confirms faithful DESIGN.md passes and phantom hexes are flagged |
| `backend/tests/validate.test.ts` | Automated test | Validation engine unit tests covering hex accuracy, section completeness, and format consistency |

---

## 4. SOURCE METADATA

- Group: VALIDATE
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `validate/validate.md`

Related references:
- [references/quality_checklist.md](../../references/quality_checklist.md) — pre-validate self-check list
- [write-design-md.md](../write_design_md/write_design_md.md) — the write phase that produces the DESIGN.md under validation
- [references/troubleshooting.md](../../references/troubleshooting.md) — failure modes and escalation guidance
