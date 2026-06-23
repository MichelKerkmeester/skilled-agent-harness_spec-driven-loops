---
title: "VALIDATE-001 -- Validator Passes On Faithful Style Reference And Flags Phantom Hexes"
description: "This scenario validates fidelity validation for VALIDATE-001. It focuses on confirming validate.ts recognizes the v3 Style Reference schema, passes a faithful Style Reference, and flags a planted phantom hex, a Quick Start phantom hex, and a mismatched Quick Start --page-max-width."
version: 1.0.0.7
---

# VALIDATE-001 -- Validator Passes On Faithful Style Reference And Flags Phantom Hexes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VALIDATE-001`.

---

## 1. OVERVIEW

This scenario validates fidelity validation for `VALIDATE-001`. It focuses on confirming `validate.ts` recognizes the v3 Style Reference schema, PASSES on a faithfully-written Style Reference (all hexes trace to tokens.json), and FAILS on one that contains a planted phantom hex — a hex value not present in tokens.json. The v3 `checkQuickStartFidelity` check additionally enforces the ship-ready Quick Start: every Quick Start hex must trace to tokens (a phantom Quick Start hex is a critical `quickstart-phantom-color` failure), and a Quick Start `--page-max-width` that disagrees with `tokens.spacingSystem.maxContentWidth` (the "100rem where tokens say 100%" fabrication class) is flagged as a `quickstart-maxwidth` warning. `isPass()` now also requires `claimsScore >= 80`. This is both a positive and negative control: the validator must not report false positives and must catch real fabrications.

### Why This Matters

The validator is the only automated gate between a written Style Reference and a hallucination-proof reference. A validator that misses phantom hexes lets fabricated values through; a validator that reports false positives erodes operator trust. The Quick Start is the copy-paste, ship-ready surface, so a phantom hex or a mismatched `--page-max-width` there is the highest-stakes fabrication — `checkQuickStartFidelity` is its precise backstop. The failure mode this scenario guards against is a validator that silently passes a Style Reference containing fabricated colors or a Quick Start that does not trace to tokens.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `VALIDATE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the validator recognizes the v3 schema and correctly distinguishes faithful from fabricated output, including Quick-Start fidelity
- Real user request: `Validate the Style Reference I just wrote against its tokens.json.`
- Prompt: `Validate the Style Reference I just wrote against its tokens.json.`
- Expected execution process: run `validate.ts` against a known-good v3 Style Reference + tokens.json pair; confirm PASS with values score 100, claims score >= 80, and zero phantom-hex failures. Then plant a single hex (`#ff0000`) in a copy that does not exist in tokens.json, re-run validation, and confirm a phantom-color failure. Then plant a Quick Start hex not in tokens and confirm a critical `quickstart-phantom-color` failure, and plant a `--page-max-width: 100rem` where tokens say `100%` and confirm a `quickstart-maxwidth` warning
- Expected signals: first run exits 0 with `passed: [...]`, `failures: []`, values 100, claims >= 80; planted-hex run exits non-zero with a phantom-color finding for `#ff0000`; planted Quick-Start-hex run reports a critical `quickstart-phantom-color` failure; planted max-width run reports a `quickstart-maxwidth` warning
- Desired user-visible outcome: the agent reports the faithful Style Reference passed validation and each planted fabrication (phantom hex, Quick Start phantom hex, mismatched `--page-max-width`) was correctly flagged
- Pass/fail: PASS if the faithful run passes with no phantom-hex failures and claims score >= 80 AND the planted runs flag `#ff0000`, the Quick Start phantom hex (critical), and the `--page-max-width` mismatch (warning); FAIL if the faithful run reports false positives OR any planted fabrication is not flagged

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Validation stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: A prior extraction (EXTRACT-001 or equivalent) must have produced a valid `tokens.json` at `<--output>/tokens.json` and a faithfully-written v3 Style Reference must exist. Confirm the Style Reference contains only hexes from tokens.json before starting.

1. `cd .opencode/skills/sk-design-md-generator/backend && npx ts-node scripts/validate.ts <path-to-faithful-style-reference.md> <--output>/tokens.json`  # -> exit 0, values 100, claims >= 80, failures array empty
2. copy the faithful Style Reference: `cp <faithful-style-reference.md> /tmp/planted.md`
3. append a phantom hex to the copy: `echo "" >> /tmp/planted.md && echo "Phantom test color: #ff0000" >> /tmp/planted.md`  # -> phantom hex planted in a prose line outside comments
4. `cd backend && npx ts-node scripts/validate.ts /tmp/planted.md <--output>/tokens.json`  # -> exit non-zero or failures non-empty, at least one phantom-color finding for ff0000
5. plant a Quick Start fabrication: in a fresh copy, add a `--color-*: #abcdef;` line (a hex not in tokens) inside the `### CSS Custom Properties` block, and change `--page-max-width` to `100rem` where tokens say `100%`; re-run validate.ts  # -> critical `quickstart-phantom-color` failure for `#abcdef` AND a `quickstart-maxwidth` warning
6. agent reports all results: faithful PASS, planted-hex FAIL with phantom-color finding, Quick-Start-planted FAIL with `quickstart-phantom-color` + `quickstart-maxwidth`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VALIDATE-001 | Fidelity validation | Verify `validate.ts` recognizes the v3 schema, passes on a faithful Style Reference, and flags a planted phantom hex, a Quick Start phantom hex, and a mismatched `--page-max-width` | `Validate the Style Reference I just wrote against its tokens.json.` | 1. `cd backend && npx ts-node scripts/validate.ts <faithful-style-reference.md> <--output>/tokens.json` -> 2. copy it, append `#ff0000` in a prose line -> 3. `cd backend && npx ts-node scripts/validate.ts <planted.md> <--output>/tokens.json` -> 4. plant a Quick Start hex not in tokens and a `--page-max-width: 100rem` where tokens say `100%`, re-run | Step 1: exit 0, values 100, claims >= 80, zero `phantom-color` failures. Step 2: phantom hex planted. Step 3: exit non-zero (or failures array non-empty), at least one `phantom-color` finding for `#ff0000`. Step 4: critical `quickstart-phantom-color` failure for the planted Quick Start hex AND a `quickstart-maxwidth` warning for the mismatched `--page-max-width` | Transcript of the validation runs, the planted snippets, and the phantom-color / quickstart-phantom-color / quickstart-maxwidth findings | PASS if the faithful run passes with no phantom-hex failures and claims score >= 80 AND the planted runs flag `#ff0000`, the Quick Start phantom hex (critical), and the `--page-max-width` mismatch (warning). FAIL if the faithful run reports false positives OR any planted fabrication is not flagged | 1. Confirm the faithful Style Reference contains only hexes from tokens.json. 2. Confirm the planted hexes are not in tokens.json (check manually). 3. Confirm `checkPhantomColors` and `checkQuickStartFidelity` produced the expected findings, and that `--page-max-width` is compared against `tokens.spacingSystem.maxContentWidth`. |

### Optional Supplemental Checks

Test additional negative controls: plant a 3-digit hex (`#333`) and confirm it is flagged as `hex-format`; plant an uppercase hex (`#FF0000`) and confirm it is flagged as `hex-format` (should be lowercase); plant a font weight word (`bold`) in backticks and confirm it is flagged as `weight-format` (should be numeric). Remove a required v3 Style Reference section (e.g. `## Quick Start` or `## Tokens — Colors`) and confirm `checkSectionCompleteness` reports it as a critical `missing-section` failure.

Prose-discipline / dual-score assertion: `validate.ts` reports two scores — `valuesScore` (hex/section/format/stability fidelity) and `claimsScore` (prose provenance) — and the score line prints `(values X/100, claims Y/100)`. Plant a prose line such as "the gradient replaces shadow elevation" (a `gradient-as-depth` claim) into a copy of the DESIGN.md whose `tokens.json` has no shadow tokens, re-run validation, and confirm a `prose-fabrication` WARNING is raised and `claimsScore` drops below `valuesScore`. Likewise, an asserted "focus indicators are consistent" with `focusIndicator.captured = false` (or `consistent = false`) in tokens.json should raise a `prose-fabrication` WARNING. These prose checks are WARNING-tier (never a hard fail), so the run can still pass on values while honestly lowering the claims score.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/validate.ts` | Fidelity validator — recognizes the v3 Style Reference schema; `checkPhantomColors`, `checkQuickStartFidelity` (Quick Start hex traceability + `--page-max-width` vs `tokens.spacingSystem.maxContentWidth`), `checkStabilityGating`, `checkUnknownFonts`, `checkFormatConsistency`, `checkSectionCompleteness`, plus semantic checks `checkProseDiscipline` and `checkSectionCoverage` (WARNING-tier); emits dual `valuesScore` + `claimsScore`; `isPass()` requires score >= 80 AND claimsScore >= 80 AND no critical failure |
| `../../backend/scripts/cluster.ts` | Token classifier — produces the colorTokens that validate.ts checks against |
| `../../backend/scripts/types.ts` | Shared type definitions — `DesignTokens`, `ValidationResult`, `ValidationIssue` |
| `../../references/design_md_format.md` | v3 Style Reference section specification — defines the named token tables, Components, Quick Start, and Similar Brands sections |
| `../../references/quality_checklist.md` | Pre-validate self-check list |
| `../../SKILL.md` | §3 VALIDATE phase definition and §4 ALWAYS rule 5 (run validate.ts before claiming completion) |

---

## 5. SOURCE METADATA

- Group: Validate
- Playbook ID: VALIDATE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--validate/phantom-hex-detection.md`
