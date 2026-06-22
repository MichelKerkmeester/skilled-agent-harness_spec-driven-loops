---
title: "VALIDATE-001 -- Validator Passes On Faithful DESIGN.md And Flags Phantom Hexes"
description: "This scenario validates fidelity validation for VALIDATE-001. It focuses on confirming validate.ts correctly passes a faithful DESIGN.md and correctly flags a planted phantom hex not present in tokens.json."
---

# VALIDATE-001 -- Validator Passes On Faithful DESIGN.md And Flags Phantom Hexes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VALIDATE-001`.

---

## 1. OVERVIEW

This scenario validates fidelity validation for `VALIDATE-001`. It focuses on confirming `validate.ts` PASSES on a faithfully-written DESIGN.md (all hexes trace to tokens.json) and FAILS on a DESIGN.md that contains a planted phantom hex — a hex value not present in tokens.json. This is both a positive and negative control: the validator must not report false positives and must catch real fabrications.

### Why This Matters

The validator is the only automated gate between a written DESIGN.md and a hallucination-proof reference. A validator that misses phantom hexes lets fabricated values through; a validator that reports false positives erodes operator trust. The failure mode this scenario guards against is a validator that silently passes a DESIGN.md containing fabricated colors.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `VALIDATE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the validator correctly distinguishes faithful from fabricated output
- Real user request: `Validate the DESIGN.md I just wrote against its tokens.json.`
- Prompt: `Validate the DESIGN.md I just wrote against its tokens.json.`
- Expected execution process: run `validate.ts` against a known-good DESIGN.md + tokens.json pair; confirm PASS with score 100 and zero phantom-hex failures. Then plant a single hex (`#ff0000`) in a copy of the DESIGN.md that does not exist in tokens.json, re-run validation, and confirm a phantom-color failure for that hex
- Expected signals: first run exits 0 with `passed: [...]`, `failures: []`, score 100; second run exits non-zero (or reports failures) with a phantom-color finding for `#ff0000`
- Desired user-visible outcome: the agent reports the faithful DESIGN.md passed validation and the planted phantom hex was correctly flagged
- Pass/fail: PASS if the faithful run passes with no phantom-hex failures AND the planted run flags `#ff0000` as a phantom color; FAIL if the faithful run reports false positives OR the planted run does not flag the phantom hex

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Validation stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: A prior extraction (EXTRACT-001 or equivalent) must have produced a valid `tokens.json` at `<--output>/tokens.json` and a faithfully-written DESIGN.md must exist. Confirm the DESIGN.md contains only hexes from tokens.json before starting.

1. `cd .opencode/skills/sk-design-md-generator/tool && npx ts-node scripts/validate.ts <path-to-faithful-DESIGN.md> <--output>/tokens.json`  # -> exit 0, score 100, failures array empty
2. copy the faithful DESIGN.md: `cp <faithful-DESIGN.md> /tmp/planted-DESIGN.md`
3. append a phantom hex to the copy: `echo "" >> /tmp/planted-DESIGN.md && echo "Phantom test color: #ff0000" >> /tmp/planted-DESIGN.md`  # -> phantom hex planted in a prose line outside comments
4. `cd tool && npx ts-node scripts/validate.ts /tmp/planted-DESIGN.md <--output>/tokens.json`  # -> exit non-zero or failures non-empty, at least one phantom-color finding for ff0000
5. agent reports both results: faithful PASS, planted FAIL with phantom-color finding

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VALIDATE-001 | Fidelity validation | Verify `validate.ts` passes on faithful DESIGN.md and flags a planted phantom hex | `Validate the DESIGN.md I just wrote against its tokens.json.` | 1. `cd tool && npx ts-node scripts/validate.ts <faithful-DESIGN.md> <--output>/tokens.json` -> 2. copy DESIGN.md, append `#ff0000` in a prose line -> 3. `cd tool && npx ts-node scripts/validate.ts <planted-DESIGN.md> <--output>/tokens.json` | Step 1: exit 0, score 100, zero `phantom-color` failures. Step 2: phantom hex planted. Step 3: exit non-zero (or failures array non-empty), at least one `phantom-color` finding for `#ff0000` | Transcript of both validation runs, the planted DESIGN.md snippet, and the phantom-color finding | PASS if the faithful run passes with no phantom-hex failures AND the planted run flags `#ff0000` as a phantom color. FAIL if the faithful run reports false positives OR the planted run does not flag the phantom hex | 1. Confirm the faithful DESIGN.md contains only hexes from tokens.json. 2. Confirm the planted hex is not in tokens.json (check manually). 3. Confirm the validator's `checkPhantomColors` produced the expected finding. |

### Optional Supplemental Checks

Test additional negative controls: plant a 3-digit hex (`#333`) and confirm it is flagged as `hex-format`; plant an uppercase hex (`#FF0000`) and confirm it is flagged as `hex-format` (should be lowercase); plant a font weight word (`bold`) in backticks and confirm it is flagged as `weight-format` (should be numeric). Remove a required v2 core section from the DESIGN.md and confirm `checkSectionCompleteness` reports it as missing.

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
| `../../tool/scripts/validate.ts` | Fidelity validator — `checkPhantomColors`, `checkStabilityGating`, `checkUnknownFonts`, `checkFormatConsistency`, `checkSectionCompleteness`, plus semantic checks `checkProseDiscipline` and `checkSectionCoverage` (WARNING-tier); emits dual `valuesScore` + `claimsScore` |
| `../../tool/scripts/cluster.ts` | Token classifier — produces the colorTokens that validate.ts checks against |
| `../../tool/scripts/types.ts` | Shared type definitions — `DesignTokens`, `ValidationResult`, `ValidationIssue` |
| `../../tool/resources/design_md_format.md` | v2 DESIGN.md section specification — defines the 17 required sections |
| `../../tool/resources/quality_checklist.md` | Pre-validate self-check list |
| `../../SKILL.md` | §3 VALIDATE phase definition and §4 ALWAYS rule 5 (run validate.ts before claiming completion) |

---

## 5. SOURCE METADATA

- Group: Validate
- Playbook ID: VALIDATE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--validate/phantom-hex-detection.md`
