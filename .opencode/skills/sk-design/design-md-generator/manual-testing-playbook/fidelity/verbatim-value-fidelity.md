---
title: "FIDELITY-001 -- Cardinal Verbatim-Value Rule Enforced"
description: "This scenario validates the cardinal verbatim-value rule for FIDELITY-001. It focuses on confirming the v3 Style Reference copies every hex, pixel, font weight, shadow, radius, and layout max-width verbatim from tokens.json (so 100% stays 100%, never 100rem) with no estimation, 6-digit lowercase hex, L4 excluded, and L3 under the Subject-to-change sub-table."
version: 1.0.0.7
expected_intent: EXTRACT_WRITE
expected_resources:
  - references/design-md-format.md
  - references/writing-style-guide.md
  - references/color-role-taxonomy.md
  - references/component-taxonomy.md
  - references/anti-patterns.md
  - references/authoring-boundary.md
  - references/extraction-workflow.md
  - references/troubleshooting.md
  - assets/design-md-prompt-template.md
  - assets/cardinal-rules-card.md
  - assets/source-of-truth-router-card.md
  - references/quality-checklist.md
  - references/examples/stripe/DESIGN.md
  - references/examples/stripe/writing-notes.md
  - references/examples/vercel/DESIGN.md
  - references/examples/vercel/writing-notes.md
  - references/examples/linear/DESIGN.md
  - references/examples/linear/writing-notes.md
  - references/examples/supabase/DESIGN.md
  - references/examples/supabase/writing-notes.md
  - references/examples/editorial-exemplar.md
---

**Exact prompt**

```
Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding.
```

# FIDELITY-001 -- Cardinal Verbatim-Value Rule Enforced

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FIDELITY-001`.

---

## 1. OVERVIEW

This scenario validates the cardinal verbatim-value rule for `FIDELITY-001`. It focuses on confirming every numeric CSS value in a written v3 Style Reference matches `tokens.json` verbatim: no estimation, no rounding, no invention, 6-digit lowercase hex throughout, the layout max-width carried verbatim (a measured `100%` stays `100%`, never invented as `100rem`), L4 (content) tokens excluded entirely, and L3 (campaign) tokens placed under the "Subject to change" sub-table. The deterministic emitters (`formatters-v3.ts`, pre-rendered by `build-write-prompt.ts`) emit each value verbatim, which is what makes this fidelity guarantee structural rather than prompt-dependent.

### Why This Matters

The cardinal rule is the skill's entire value proposition. A Style Reference that contains estimated, rounded, or invented values is not a hallucination-proof reference — it is a hallucination. The canonical failure this guards against is the value-fabrication class: a measured `max-width: 100%` re-rendered as `100rem`. The failure mode this guards against is a Style Reference that looks plausible but contains even one value that does not trace back to `tokens.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `FIDELITY-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm every numeric value in the Style Reference matches tokens.json verbatim and format rules are satisfied
- Real user request: `Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding.`
- Prompt: `Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding.`
- Expected execution process: after a successful extraction, read both `tokens.json` and the written Style Reference; spot-check at least 5 hex values, 3 pixel values, 2 font weights, and 2 shadow definitions across the pair and confirm exact match; specifically confirm the layout max-width is carried verbatim (`100%` stays `100%`, never `100rem`); verify all hex codes are 6-digit lowercase; verify no L4 token appears; verify L3 tokens appear under the "Subject to change" sub-table
- Expected signals: every sampled value matches exactly; the layout max-width is verbatim; all hex codes use 6-digit lowercase; L4 tokens absent; L3 tokens under the "Subject to change" sub-table
- Desired user-visible outcome: the agent confirms fidelity with specific token-to-Style-Reference pairings, listing the sampled values and their matches
- Pass/fail: PASS if every sampled value matches tokens.json verbatim (including the layout max-width) AND all hex codes are 6-digit lowercase AND no L4 token values appear AND any L3 token is under the "Subject to change" sub-table; FAIL if any value is estimated/rounded (e.g. `100%` rendered as `100rem`) OR a hex uses 3-digit/uppercase format OR an L4 token value appears OR an un-grouped L3 token appears

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Fidelity inspection is read-only and stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Waves 1 (SETUP-001 PASS) and 2 (EXTRACT-001 PASS) must be complete. A faithful v3 Style Reference must exist, written from the Wave 2 tokens.json per the v3 format specification in `references/design-md-format.md`.

1. extract sample values from tokens.json: `bash: node -e "const t = require('./<--output>/tokens.json'); console.log('HEX:', t.colorTokens.slice(0,5).map(c=>c.hex)); console.log('PX:', t.spacingScale?.slice(0,3).map(s=>s.value)); console.log('WEIGHT:', t.typographyLevels?.slice(0,2).map(l=>l.fontWeight)); console.log('SHADOW:', t.shadowTokens?.slice(0,2).map(s=>s.value)); console.log('MAXWIDTH:', t.spacingSystem?.maxContentWidth)"` (run from the repo root)  # -> sample values printed, including the layout max-width
2. locate each sample value in the Style Reference: `bash: rg '<sample-hex>' <style-reference.md>` (repeat for each value, including the max-width — confirm `100%` is not rendered as `100rem`)  # -> each value found verbatim
3. confirm 6-digit lowercase hex: `bash: rg -o '#[0-9a-fA-F]{3,8}' <style-reference.md> \| sort -u`  # -> all hex codes are 6-digit lowercase; flag any 3-digit or uppercase
4. confirm L4 absence: search the Style Reference for any value from a tokens.json token whose `stability.layer === "content"` (the L4 layer) — confirm none appear  # -> zero L4 values
5. confirm L3 grouping: `bash: rg 'Subject to change' <style-reference.md>`  # -> present for any L3 token sub-table; if no L3 tokens exist, note it
6. agent reports the spot-check results with specific token-to-Style-Reference pairings

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FIDELITY-001 | Verbatim-value fidelity | Verify the v3 Style Reference copies values verbatim from tokens.json, no estimation, 6-digit lowercase hex, L4 excluded, L3 under the "Subject to change" sub-table, and the layout max-width carried verbatim (`100%` not `100rem`) | `Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding.` | 1. `read: <--output>/tokens.json` (extract 5 hex values, 3 px values, 2 font weights, 2 shadows, and `spacingSystem.maxContentWidth`) -> 2. `read: <style-reference.md>` (find the same values, including max-width) -> 3. confirm exact match for each pair, including max-width -> 4. grep for hex patterns, confirm all are 6-digit lowercase -> 5. `bash: rg -c 'L4' <style-reference.md>` confirm zero or only in explanatory text, no L4 token values -> 6. `bash: rg 'Subject to change' <style-reference.md>` confirm present for L3 tokens if any exist | Step 1: token values extracted from JSON. Step 2: same values found verbatim. Step 3: all sampled values match, including max-width. Step 4: all hex codes 6-digit lowercase. Step 5: no L4 token values. Step 6: L3 tokens under the "Subject to change" sub-table if present | Transcript of the value-matching spot-checks, hex-format grep output, L4/L3 grep output | PASS if every sampled value matches tokens.json verbatim (including the layout max-width) AND all hex codes are 6-digit lowercase AND no L4 token values appear AND any L3 token is under the "Subject to change" sub-table. FAIL if any value is estimated/rounded (e.g. `100%` rendered as `100rem`) OR a hex uses 3-digit/uppercase format OR an L4 token value appears OR an un-grouped L3 token appears | 1. Pick values from different sections (color, typography, spacing, shadows, layout). 2. If a mismatch is found, check whether tokens.json was edited after extraction. 3. If L4 values appear, check the cluster.ts L4 classification logic. 4. If no L3 tokens exist in the source, the sub-table check does not apply (note it). 5. If max-width is mis-rendered, confirm the deterministic `formatters-v3.ts` emitter is wired through `build-write-prompt.ts`. |

### Optional Supplemental Checks

Run the full `validate.ts` against the Style Reference and confirm it passes (values 100, claims >= 80, zero failures) as an additional fidelity gate, including a clean `checkQuickStartFidelity` (no `quickstart-phantom-color`, no `quickstart-maxwidth`). Check the extraction report at `<--output>/report.json` and confirm the token counts and stability-class distribution match what appears in the Style Reference. Run `cd backend && npx vitest run` to confirm the clustering and validation unit tests pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/cluster.ts` | Token classifier — assigns L1-L4 stability classes, determines which tokens reach the Style Reference |
| `../../backend/scripts/build-write-prompt.ts` | Pre-renders the deterministic v3 value sections (calls `formatters-v3.ts`) so the writer adds prose only — the structural source of the verbatim guarantee |
| `../../backend/scripts/formatters-v3.ts` | Deterministic v3 emitters — emit every hex/size/weight/radius/max-width verbatim (`100%` stays `100%`) |
| `../../backend/scripts/validate.ts` | Fidelity validator — `checkFormatConsistency` verifies 6-digit lowercase hex, `checkPhantomColors` verifies hex provenance, `checkQuickStartFidelity` verifies Quick Start hex traceability + `--page-max-width` |
| `../../backend/scripts/types.ts` | Shared type definitions — `StabilityClassification`, `DesignTokens`, `ColorToken` |
| `../../references/design-md-format.md` | v3 Style Reference section specification — defines the named token tables and which receive L1/L2/L3 tokens |
| `../../references/writing-style-guide.md` | Voice and tone rules — named/confident/restrained voice, no frequency dumps, and the "Subject to change" sub-table for L3 tokens |
| `../../references/anti-patterns.md` | Common mistakes — invented values, wrong hex case, L4 leaks, dark-mode fabrication |
| `../../assets/cardinal-rules-card.md` | One-page fidelity checklist for pre-validate self-check |
| `../../SKILL.md` | §3 Cardinal Fidelity Rule, §4 ALWAYS rules 2-4, §4 NEVER rules 1-2 |

---

## 5. SOURCE METADATA

- Group: Fidelity
- Playbook ID: FIDELITY-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fidelity/verbatim-value-fidelity.md`
