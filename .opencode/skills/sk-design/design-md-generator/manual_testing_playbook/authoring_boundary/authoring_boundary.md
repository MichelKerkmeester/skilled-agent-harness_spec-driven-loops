---
title: "BOUNDARY-001 -- Authoring Boundary Sorts Values By Origin"
description: "This scenario validates the authoring-boundary reference for BOUNDARY-001. It confirms a written v3 Style Reference keeps the four value origins legible: measured values sit unlabeled in token tables, brief-provided values stay out of the tables as stated intent, inferred claims carry [INFERRED] and cite a measured token, absent values are stamped or omitted, while a brief-only request with no live site is refused as out-of-scope forward-authoring."
contextType: reference
version: 1.0.0.1
expected_intent: EXTRACT_WRITE
expected_resources:
  - references/design_md_format.md
  - references/writing_style_guide.md
  - references/color_role_taxonomy.md
  - references/component_taxonomy.md
  - references/anti_patterns.md
  - references/authoring_boundary.md
  - references/extraction_workflow.md
  - references/troubleshooting.md
  - assets/design_md_prompt_template.md
  - assets/cardinal_rules_card.md
  - assets/source_of_truth_router_card.md
---

**Exact prompt**

```
The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site.
```

# BOUNDARY-001 -- Authoring Boundary Sorts Values By Origin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOUNDARY-001`.

---

## 1. OVERVIEW

This scenario validates the authoring boundary for `BOUNDARY-001`. The boundary names four origins a value can have and states which ones this mode is allowed to write. Measured values, read off the running page and present in `tokens.json`, are the only origin that enters a token table, and they enter unlabeled. Brief-provided values, supplied by the user rather than the page, stay out of every value table and live in prose as a stated intent. Inferred claims, characterizations built on measured values, carry an `[INFERRED]` marker and cite the measured token they rest on. Absent values, the ones the extractor never captured, are stamped as no-data or omitted, never backfilled. The boundary adds no new capability. It documents the line that keeps the cardinal fidelity rule enforceable by inspection.

### Why This Matters

A Style Reference is trusted because a reader can assume every hex, pixel, weight, radius and shadow in it was measured from a running page. The moment a value with a different origin slips in unlabeled, that assumption breaks for the whole document and the reader can no longer tell ground truth from a guess. The risk is not careless invention. It is the quiet drift where a plausible brief value or a reasonable inference gets written into a token table as if it were measured. This scenario proves the four origins stay legible so an unlabeled value remains a reliable promise that the extractor measured it.

---

## 2. SCENARIO CONTRACT

Operators run the exact steps for `BOUNDARY-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a written Style Reference keeps the four value origins legible and never lets a non-measured value pose as a measured one
- Real user request: `The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site.`
- Prompt: `The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site.`
- Expected execution process: read both `tokens.json` and the written Style Reference. Confirm every value in a token table traces to a measured token in `tokens.json`. Confirm the brief-provided red and font are NOT placed in a token table as if measured, and appear only as a stated intent in prose if at all. Confirm every inferred claim (colour names, roles, Similar Brands) carries an `[INFERRED]` marker and cites a measured token. Confirm any value the extractor did not capture is stamped as no-data or omitted, never backfilled from the brief
- Expected signals: token tables contain only measured values, all unlabeled. The brief-provided red and font do not sit in any token table. Inferred claims are marked `[INFERRED]` with a cited token. Absent sections are stamped or omitted. No brief value is concretized into a measurement
- Desired user-visible outcome: the agent records the brief values as a stated intent in prose, keeps them out of the token tables, sources every tabled value from `tokens.json` and states that brief-provided values are not measurements

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Boundary inspection is read-only and stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Waves 1 (SETUP-001 PASS) and 2 (EXTRACT-001 PASS) must be complete. A faithful v3 Style Reference must exist, written from the Wave 2 tokens.json per the v3 format specification in `references/design_md_format.md`. A brief that supplies at least one value not measured on the page (for example a brand hex or a font family) drives the boundary call.

1. list the measured colours and fonts from tokens.json: `bash: node -e "const t = require('./<--output>/tokens.json'); console.log('HEX:', t.colorTokens.map(c=>c.hex)); console.log('FONTS:', (t.typographyLevels||[]).map(l=>l.fontFamily))"` (run from the repo root)  # -> the set of measured values
2. confirm the brief-provided values are NOT in a token table: `bash: rg '#ff0000|Inter' <style-reference.md>`  # -> any hit sits in prose as a stated intent, never in a Tokens table row. If the brief value was also measured, the measured token is the source of truth and the brief value is context
3. confirm every token-table value is measured: read the Tokens tables in the Style Reference and confirm each value appears in the step 1 measured set  # -> zero tabled values without a measured source
4. confirm inferred claims are marked: `bash: rg '\[INFERRED\]' <style-reference.md>`  # -> colour names, roles and Similar Brands that characterize measured values carry [INFERRED] and cite the token they rest on
5. confirm absent values are stamped or omitted: pick a dimension the extractor did not capture (for example a dark palette or shadow tokens when none exist) and confirm the section is stamped no-data or omitted, never backfilled from the brief  # -> absent state is honest
6. agent reports the origin sort for each doubtful value, naming the measured token, the brief intent, the inference or the absence

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOUNDARY-001 | Authoring boundary | Verify the Style Reference keeps measured, brief-provided, inferred and absent values legible, with only measured values in token tables and the brief-provided red/font kept out of the tables | `The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site.` | 1. `read: <--output>/tokens.json` (collect measured hexes and font families) -> 2. `read: <style-reference.md>` (locate the brief values) -> 3. confirm the brief-provided `#ff0000` and `Inter` are NOT in any token table -> 4. `bash: rg '\[INFERRED\]' <style-reference.md>` confirm inferred claims cite a measured token -> 5. confirm every token-table value traces to tokens.json -> 6. confirm any absent dimension is stamped or omitted, never backfilled | Step 1: measured set collected. Step 2: brief values located. Step 3: brief values absent from token tables (prose-only if present). Step 4: inferred claims marked and cited. Step 5: every tabled value measured. Step 6: absent dimensions stamped or omitted | Transcript of the measured-set listing, the brief-value grep, the token-table trace, the [INFERRED] grep and the absent-section check | PASS if token tables contain only measured values AND the brief-provided red and font are kept out of the tables AND every inferred claim is marked `[INFERRED]` with a cited token AND absent values are stamped or omitted. FAIL if a brief-provided value sits in a token table as if measured OR an inferred claim is unmarked or uncited OR an absent value is backfilled from the brief | 1. If a brief value sits in a token table, move it to prose as a stated intent or remove it, because the table is reserved for measurements. 2. If a brief value was also measured, confirm the measured token is the tabled source and the brief value is context. 3. If an inferred claim is unmarked, add `[INFERRED]` and cite the measured token it rests on. 4. If an absent value was backfilled, replace it with a no-data stamp or omit the section. 5. Cross-check the call against `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md`. |

### Optional Supplemental Checks

Walk the Quick Boundary Check in `references/authoring_boundary.md` against the draft and confirm every box passes. The Quick Start is the ship-ready surface, so confirm no brief-provided or inferred value reached it, since a fabricated token under the banner of ground truth is the exact failure the cardinal rule prevents. Run `validate.ts` and confirm `claimsScore >= 80`, the prose-provenance signal that an inferred claim without a cited measured token would lower.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/authoring_boundary.md` | The four origins (measured, brief-provided, inferred, absent), the source-of-truth labels and why forward-authoring stays out of scope |
| `../../assets/source_of_truth_router_card.md` | Fill-in card that sorts each value by origin before writing |
| `../../assets/cardinal_rules_card.md` | One-page fidelity checklist for pre-validate self-check |
| `../../backend/scripts/formatters-v3.ts` | Deterministic v3 emitters that emit measured values verbatim into the token tables so unlabeled stays a measured promise |
| `../../backend/scripts/validate.ts` | Fidelity validator. `checkPhantomColors` verifies hex provenance and `claimsScore` checks prose provenance |
| `../../references/design_md_format.md` | v3 Style Reference section specification and the Section 0 cardinal rules the boundary protects |
| `../../references/writing_style_guide.md` | Voice and tone rules for grounded inference, no invented facts or audiences |
| `../../SKILL.md` | §1 WHEN TO USE, §2 SMART ROUTING boundary loading rule, §3 Cardinal Fidelity Rule, §5 References |

---

## 5. SOURCE METADATA

- Group: Authoring Boundary
- Playbook ID: BOUNDARY-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `authoring-boundary/authoring-boundary.md`
