---
title: "FIDELITY-001 -- Cardinal Verbatim-Value Rule Enforced"
description: "This scenario validates the cardinal verbatim-value rule for FIDELITY-001. It focuses on confirming DESIGN.md copies every hex, pixel, font weight, shadow, and radius verbatim from tokens.json with no estimation, 6-digit lowercase hex, L4 excluded, and L3 annotated."
---

# FIDELITY-001 -- Cardinal Verbatim-Value Rule Enforced

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FIDELITY-001`.

---

## 1. OVERVIEW

This scenario validates the cardinal verbatim-value rule for `FIDELITY-001`. It focuses on confirming every numeric CSS value in a written DESIGN.md matches `tokens.json` verbatim: no estimation, no rounding, no invention, 6-digit lowercase hex throughout, L4 (content) tokens excluded entirely, and L3 (campaign) tokens carrying a "Subject to change" annotation.

### Why This Matters

The cardinal rule is the skill's entire value proposition. A DESIGN.md that contains estimated, rounded, or invented values is not a hallucination-proof reference — it is a hallucination. The failure mode this guards against is a DESIGN.md that looks plausible but contains even one value that does not trace back to `tokens.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `FIDELITY-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm every numeric value in DESIGN.md matches tokens.json verbatim and format rules are satisfied
- Real user request: `Check that the DESIGN.md you wrote copies every value exactly from tokens.json — no estimates, no rounding.`
- Prompt: `Check that the DESIGN.md you wrote copies every value exactly from tokens.json — no estimates, no rounding.`
- Expected execution process: after a successful extraction, read both `tokens.json` and the written `DESIGN.md`; spot-check at least 5 hex values, 3 pixel values, 2 font weights, and 2 shadow definitions across the pair and confirm exact match; verify all hex codes in DESIGN.md are 6-digit lowercase; verify no L4 token appears in DESIGN.md; verify L3 tokens carry the "Subject to change" annotation
- Expected signals: every sampled value matches exactly; all hex codes use 6-digit lowercase; L4 tokens absent; L3 tokens annotated
- Desired user-visible outcome: the agent confirms fidelity with specific token-to-DESIGN.md pairings, listing the sampled values and their matches
- Pass/fail: PASS if every sampled value matches tokens.json verbatim AND all hex codes are 6-digit lowercase AND no L4 token values appear AND any L3 token is annotated; FAIL if any value is estimated/rounded OR a hex uses 3-digit/uppercase format OR an L4 token value appears OR an un-annotated L3 token appears

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Fidelity inspection is read-only and stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Waves 1 (SETUP-001 PASS) and 2 (EXTRACT-001 PASS) must be complete. A faithful DESIGN.md must exist, written from the Wave 2 tokens.json per the v2 format specification in `tool/resources/design-md-format.md`.

1. extract sample values from tokens.json: `bash: node -e "const t = require('./output/<domain>/tokens.json'); console.log('HEX:', t.colorTokens.slice(0,5).map(c=>c.hex)); console.log('PX:', t.spacingScale?.slice(0,3).map(s=>s.value)); console.log('WEIGHT:', t.typographyLevels?.slice(0,2).map(l=>l.fontWeight)); console.log('SHADOW:', t.shadowTokens?.slice(0,2).map(s=>s.value))"` (run from `tool/`)  # -> sample values printed
2. locate each sample value in DESIGN.md: `bash: rg '<sample-hex>' <DESIGN.md>` (repeat for each value)  # -> each value found verbatim
3. confirm 6-digit lowercase hex: `bash: rg -o '#[0-9a-fA-F]{3,8}' <DESIGN.md> \| sort -u`  # -> all hex codes are 6-digit lowercase; flag any 3-digit or uppercase
4. confirm L4 absence: search DESIGN.md for any value from tokens.json where `stabilityClass === "L4"` — confirm none appear  # -> zero L4 values in DESIGN.md
5. confirm L3 annotation: `bash: rg 'Subject to change' <DESIGN.md>`  # -> present for any L3 token section; if no L3 tokens exist, note it
6. agent reports the spot-check results with specific token-to-DESIGN.md pairings

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FIDELITY-001 | Verbatim-value fidelity | Verify DESIGN.md copies values verbatim from tokens.json, no estimation, 6-digit lowercase hex, L4 excluded, L3 annotated | `Check that the DESIGN.md you wrote copies every value exactly from tokens.json — no estimates, no rounding.` | 1. `read: output/<domain>/tokens.json` (extract 5 hex values, 3 px values, 2 font weights, 2 shadows) -> 2. `read: <DESIGN.md>` (find the same values) -> 3. confirm exact match for each pair -> 4. grep DESIGN.md for hex patterns, confirm all are 6-digit lowercase -> 5. `bash: rg -c 'L4' <DESIGN.md>` confirm zero or only in explanatory text, no L4 token values -> 6. `bash: rg 'Subject to change' <DESIGN.md>` confirm present for L3 tokens if any exist | Step 1: token values extracted from JSON. Step 2: same values found verbatim in DESIGN.md. Step 3: all sampled values match. Step 4: all hex codes 6-digit lowercase. Step 5: no L4 token values in DESIGN.md. Step 6: L3 tokens annotated if present | Transcript of the value-matching spot-checks, hex-format grep output, L4/L3 grep output | PASS if every sampled value matches tokens.json verbatim AND all hex codes are 6-digit lowercase AND no L4 token values appear AND any L3 token is annotated. FAIL if any value is estimated/rounded OR a hex uses 3-digit/uppercase format OR an L4 token value appears OR an un-annotated L3 token appears | 1. Pick values from different sections (color, typography, spacing, shadows). 2. If a mismatch is found, check whether tokens.json was edited after extraction. 3. If L4 values appear, check the cluster.ts L4 classification logic. 4. If no L3 tokens exist in the source, the annotation check does not apply (note it). |

### Optional Supplemental Checks

Run the full `validate.ts` against the DESIGN.md and confirm it passes (score 100, zero failures) as an additional fidelity gate. Check the extraction report at `output/<domain>/report.json` and confirm the token counts and stability-class distribution match what appears in DESIGN.md. Run `cd tool && npx vitest run` to confirm the clustering and validation unit tests pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../tool/scripts/cluster.ts` | Token classifier — assigns L1-L4 stability classes, determines which tokens reach DESIGN.md |
| `../../tool/scripts/validate.ts` | Fidelity validator — `checkFormatConsistency` verifies 6-digit lowercase hex, `checkPhantomColors` verifies hex provenance |
| `../../tool/scripts/types.ts` | Shared type definitions — `StabilityClassification`, `DesignTokens`, `ColorToken` |
| `../../tool/resources/design-md-format.md` | v2 DESIGN.md section specification — defines which sections receive L1/L2/L3 tokens |
| `../../tool/resources/writing-style-guide.md` | Voice and tone rules — mandates the "Subject to change" annotation for L3 tokens |
| `../../tool/resources/anti-patterns.md` | Common mistakes — invented values, wrong hex case, L4 leaks, dark-mode fabrication |
| `../../assets/cardinal_rules_card.md` | One-page fidelity checklist for pre-validate self-check |
| `../../SKILL.md` | §3 Cardinal Fidelity Rule, §4 ALWAYS rules 2-4, §4 NEVER rules 1-2 |

---

## 5. SOURCE METADATA

- Group: Fidelity
- Playbook ID: FIDELITY-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--fidelity/verbatim-value-fidelity.md`
