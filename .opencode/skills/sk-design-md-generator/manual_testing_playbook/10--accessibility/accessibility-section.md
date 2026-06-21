---
title: "A11Y-001 -- Accessibility Section Fidelity"
description: "Validates the accessibility section in DESIGN.md mirrors the a11y data captured by a11y-extract.ts, with honest absence-notation when no a11y data exists. Tests that DESIGN.md §9 Accessibility Contract reflects measured contrast ratios, focus indicators, and touch-target sizes without fabrication."
---

# A11Y-001 -- Accessibility Section Fidelity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `A11Y-001`.

---

## 1. OVERVIEW

This scenario validates the accessibility section's presence and absence-honesty for `A11Y-001`. SKILL.md §4 ALWAYS rule 7 requires an accessibility section in DESIGN.md, noting absence rather than inventing values when no a11y data was captured. The test confirms `a11y-extract.ts` captures contrast ratios, focus indicator styles, minimum touch-target sizes, ARIA role statistics, and alt-text coverage into `tokens.json` under the `accessibility` object, and that DESIGN.md §9 Accessibility Contract reflects exactly that data — populated fields where data exists, explicit absence notes where it does not.

### Why This Matters

A fabricated accessibility section is worse than none. If DESIGN.md claims contrast ratios that were never measured, downstream AI agents and developers build against false guarantees. Conversely, if real a11y data is captured but DESIGN.md omits it, the design system reference loses critical accessibility information. This scenario guards against both fabrication and omission.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `A11Y-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm DESIGN.md §9 mirrors a11y-extract.ts output faithfully, never inventing values
- Real user request: `Does the design system capture accessibility data?`
- Prompt: `Does the design system capture accessibility data?`
- Expected execution process: inspect `<--output>/tokens.json` for the `accessibility` object, then confirm DESIGN.md §9 Accessibility Contract reflects exactly the captured fields (contrastPairs, focusIndicator, minTouchTarget, minFontSize, ariaRoleStats, reducedMotionSupport, tabOrder, langAttribute, skipLinkDetected, altTextCoverage)
- Expected signals: `tokens.json` either has a populated `accessibility` object (with at least `contrastPairs` and `focusIndicator`) OR has no `accessibility` key; DESIGN.md §9 mirrors whatever the tokens contain, using "Not captured" or "No data available" language when fields are absent
- Desired user-visible outcome: the agent reports which a11y fields were captured and confirms DESIGN.md §9 matches, with no invented values
- Pass/fail: PASS if a11y data in tokens.json is reflected truthfully in DESIGN.md §9 OR if both lack a11y data and §9 honestly notes the absence; FAIL if a11y data exists in tokens.json but §9 omits or contradicts it OR §9 contains values not present in tokens.json

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Accessibility checks stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. A prior extraction must have produced `<--output>/tokens.json` and `DESIGN.md`; if none exists, run the full extract-write pipeline first.

1. `bash: ls <--output>/tokens.json <--output>/DESIGN.md` (run from `tool/`)  # -> both files exist
2. `bash: node -e "const t = require('./<--output>/tokens.json'); const a = t.accessibility; if (!a) { console.log('NO_ACCESSIBILITY_OBJECT'); } else { console.log('contrastPairs:', a.contrastPairs?.length ?? 0, '| focusIndicator:', JSON.stringify(a.focusIndicator?.style ?? {}), '| minTouchTarget:', JSON.stringify(a.minTouchTarget), '| minFontSize:', a.minFontSize, '| ariaRoleStats:', a.ariaRoleStats ? Object.keys(a.ariaRoleStats).length : 0, 'roles', '| reducedMotionSupport:', a.reducedMotionSupport, '| tabOrder:', JSON.stringify(a.tabOrder), '| langAttribute:', a.langAttribute, '| skipLinkDetected:', a.skipLinkDetected, '| altTextCoverage:', JSON.stringify(a.altTextCoverage)) }"` (run from `tool/`)  # -> prints a11y field counts
3. agent reads `<--output>/DESIGN.md` §9 Accessibility Contract
4. agent compares step 2 output against step 3 content, reporting field-by-field matches
5. if tokens.json has no `accessibility` object, agent confirms DESIGN.md §9 notes absence explicitly

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| A11Y-001 | Accessibility section fidelity | Verify DESIGN.md §9 mirrors a11y-extract.ts output, never invents values, and honestly notes absence | `Does the design system capture accessibility data?` | 1. verify both tokens.json and DESIGN.md exist -> 2. `node -e "...` inspect accessibility fields from tokens.json -> 3. agent reads DESIGN.md §9 -> 4. agent compares field-by-field | Step 1: tokens.json and DESIGN.md present. Step 2: node script prints a11y field counts (or NO_ACCESSIBILITY_OBJECT). Step 3: DESIGN.md §9 contains either populated a11y data or explicit absence note. Step 4: every value in §9 traces to a field in tokens.json | Node inspect output of tokens.json accessibility fields, DESIGN.md §9 text excerpt, field-by-field comparison table | PASS if DESIGN.md §9 faithfully mirrors tokens.json accessibility data (populated when present, honest absence note when absent) with zero invented values. FAIL if DESIGN.md §9 contains values not in tokens.json OR omits a11y data that tokens.json contains OR is missing entirely when a11y data exists | 1. If accessibility object is missing from tokens.json, confirm `extract.ts` calls `extractA11y()` during Phase 1 (contrast + focus + touch-target + ARIA stats from DOM collections). 2. If tabOrder/langAttribute/skipLinkDetected/altTextCoverage are missing, confirm `extract.ts` calls `extractA11yAsync(page)` which runs Playwright page-dependent checks. 3. If DESIGN.md §9 is missing, verify the WRITE phase loaded `SKILL.md` §4 ALWAYS rule 7 and `tool/resources/design_md_format.md` §9 specification. 4. If §9 fabricates data, rerun the write phase with explicit instruction "every a11y value must come from tokens.json verbatim." |

### Optional Supplemental Checks

To test absence-honesty directly, extract from a minimal site with no interactive elements (e.g., a single-paragraph page) and confirm `tokens.json` has no `accessibility` object and DESIGN.md §9 reads "No accessibility data was captured" or equivalent. To test a full a11y capture, extract from a WCAG-compliant site like gov.uk or a known design-system page and confirm contrast ratios, ARIA roles, and touch-target sizes are populated and traceable.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../tool/scripts/a11y-extract.ts` | Accessibility extraction: contrast pairs, focus indicators, touch-target sizes, ARIA stats, tab order, lang attribute, skip-link detection, alt-text coverage |
| `../../tool/scripts/extract.ts` | Extraction orchestrator: calls extractA11y (synchronous) and extractA11yAsync (Playwright page-dependent) during Phase 1 |
| `../../tool/scripts/cluster.ts` | Provides wcagContrast() used by the pipeline for contrast ratio computation |
| `../../tool/scripts/types.ts` | A11yTokens type: focusIndicator, contrastPairs, minTouchTarget, minFontSize, ariaRoleStats, reducedMotionSupport, tabOrder, langAttribute, skipLinkDetected, altTextCoverage |
| `../../SKILL.md` | §4 ALWAYS rule 7 (accessibility section required, note absence if no data) |
| `../../tool/resources/design_md_format.md` | §9 Accessibility Contract specification |

---

## 5. SOURCE METADATA

- Group: Accessibility
- Playbook ID: A11Y-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--accessibility/accessibility-section.md`
