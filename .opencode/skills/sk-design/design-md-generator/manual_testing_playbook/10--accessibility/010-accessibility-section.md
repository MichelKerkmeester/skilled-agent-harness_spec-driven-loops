---
title: "A11Y-001 -- Accessibility Section Fidelity"
description: "Validates the accessibility data in the v3 Style Reference mirrors the a11y data captured by a11y-extract.ts, with honest absence-notation when no a11y data exists. Tests that the Style Reference's Agent Prompt Guide and any flagged a11y problems reflect measured contrast ratios, focus indicators, and touch-target sizes without fabrication."
version: 1.0.0.7
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
Does the design system capture accessibility data?
```

# A11Y-001 -- Accessibility Section Fidelity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `A11Y-001`.

---

## 1. OVERVIEW

This scenario validates the accessibility data's presence and absence-honesty for `A11Y-001`. SKILL.md §4 ALWAYS rule 7 requires accessibility data in the output, noting absence rather than inventing values when no a11y data was captured. In the v3 Style Reference this data surfaces in the Agent Prompt Guide (Quick Color Reference) plus any flagged focus/contrast problems, rather than a numbered §9 Accessibility Contract. The capture mechanics are unchanged: `a11y-extract.ts` captures contrast ratios, focus indicator styles, minimum touch-target sizes, ARIA role statistics, and alt-text coverage into `tokens.json` under the `accessibility` object, and the Style Reference reflects exactly that data — populated where data exists, explicit absence notes where it does not.

The async accessibility pass (`extractA11yAsync(page)`) populates the page-dependent fields that were previously null: page language (`langAttribute`), skip-link presence (`skipLinkDetected`), tab order (`tabOrder`), alt-text coverage (`altTextCoverage`), plus reduced-motion support (`reducedMotionSupport`). The scenario can assert these fields appear in the Style Reference's a11y data when the async pass captured them.

Focus-indicator honesty: `focusIndicator` carries a `captured` boolean. On empty focus data it reports `captured: false` and `consistent: false` rather than fabricating `consistent: true`. A faithful Style Reference must NOT assert that focus indicators are "consistent" unless `focusIndicator.captured` is true; when capture failed, it must note the absence honestly.

### Why This Matters

Fabricated accessibility claims are worse than none. If the Style Reference claims contrast ratios that were never measured, downstream AI agents and developers build against false guarantees. Conversely, if real a11y data is captured but the Style Reference omits it, the design system reference loses critical accessibility information. This scenario guards against both fabrication and omission.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `A11Y-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the v3 Style Reference's a11y data mirrors a11y-extract.ts output faithfully, never inventing values
- Real user request: `Does the design system capture accessibility data?`
- Prompt: `Does the design system capture accessibility data?`
- Expected execution process: inspect `<--output>/tokens.json` for the `accessibility` object, then confirm the Style Reference's a11y data (Agent Prompt Guide plus any flagged focus/contrast problems) reflects exactly the captured fields (contrastPairs, focusIndicator with its `captured`/`consistent` flags, minTouchTarget, minFontSize, ariaRoleStats, reducedMotionSupport, tabOrder, langAttribute, skipLinkDetected, altTextCoverage)
- Expected signals: `tokens.json` either has a populated `accessibility` object (with at least `contrastPairs` and `focusIndicator`) OR has no `accessibility` key; the async fields (`langAttribute`, `skipLinkDetected`, `tabOrder`, `altTextCoverage`, `reducedMotionSupport`) are populated when the async pass captured them; `focusIndicator.captured` reflects whether focus styles were actually captured; the Style Reference mirrors whatever the tokens contain, using "Not captured" or "No data available" language when fields are absent, and never asserts focus indicators are "consistent" when `focusIndicator.captured` is false
- Desired user-visible outcome: the agent reports which a11y fields were captured and confirms the Style Reference matches, with no invented values
- Pass/fail: PASS if a11y data in tokens.json is reflected truthfully in the Style Reference OR if both lack a11y data and the Style Reference honestly notes the absence; FAIL if a11y data exists in tokens.json but the Style Reference omits or contradicts it OR contains values not present in tokens.json OR asserts focus indicators are "consistent" while `focusIndicator.captured` is false

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Accessibility checks stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. A prior extraction must have produced `<--output>/tokens.json` and a v3 Style Reference; if none exists, run the full extract-write pipeline first.

1. `bash: ls <--output>/tokens.json <--output>/<style-reference>.md` (run from the repo root)  # -> both files exist
2. `bash: node -e "const t = require('./<--output>/tokens.json'); const a = t.accessibility; if (!a) { console.log('NO_ACCESSIBILITY_OBJECT'); } else { console.log('contrastPairs:', a.contrastPairs?.length ?? 0, '| focusIndicator.captured:', a.focusIndicator?.captured, '| focusIndicator.consistent:', a.focusIndicator?.consistent, '| focusIndicator.style:', JSON.stringify(a.focusIndicator?.style ?? {}), '| minTouchTarget:', JSON.stringify(a.minTouchTarget), '| minFontSize:', a.minFontSize, '| ariaRoleStats:', a.ariaRoleStats ? Object.keys(a.ariaRoleStats).length : 0, 'roles', '| reducedMotionSupport:', a.reducedMotionSupport, '| tabOrder:', JSON.stringify(a.tabOrder), '| langAttribute:', a.langAttribute, '| skipLinkDetected:', a.skipLinkDetected, '| altTextCoverage:', JSON.stringify(a.altTextCoverage)) }"` (run from the repo root)  # -> prints a11y field counts including focusIndicator.captured/consistent
3. agent reads the Style Reference's a11y data (Agent Prompt Guide plus any flagged focus/contrast problems)
4. agent compares step 2 output against step 3 content, reporting field-by-field matches
5. if tokens.json has no `accessibility` object, agent confirms the Style Reference notes the absence explicitly

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| A11Y-001 | Accessibility section fidelity | Verify the v3 Style Reference's a11y data mirrors a11y-extract.ts output, never invents values, and honestly notes absence | `Does the design system capture accessibility data?` | 1. verify both tokens.json and the Style Reference exist -> 2. `node -e "...` inspect accessibility fields from tokens.json -> 3. agent reads the Style Reference's a11y data -> 4. agent compares field-by-field | Step 1: tokens.json and the Style Reference present. Step 2: node script prints a11y field counts (or NO_ACCESSIBILITY_OBJECT). Step 3: the Style Reference contains either populated a11y data or an explicit absence note. Step 4: every reported a11y value traces to a field in tokens.json | Node inspect output of tokens.json accessibility fields, Style Reference a11y text excerpt, field-by-field comparison table | PASS if the Style Reference faithfully mirrors tokens.json accessibility data (populated when present, honest absence note when absent) with zero invented values. FAIL if it contains a11y values not in tokens.json OR omits a11y data that tokens.json contains OR is missing entirely when a11y data exists | 1. If accessibility object is missing from tokens.json, confirm `extract.ts` calls `extractA11y()` during Phase 1 (contrast + focus + touch-target + ARIA stats from DOM collections). 2. If tabOrder/langAttribute/skipLinkDetected/altTextCoverage are missing, confirm `extract.ts` calls `extractA11yAsync(page)` which runs Playwright page-dependent checks. 3. If the a11y data is missing from the Style Reference, verify the WRITE phase loaded `SKILL.md` §4 ALWAYS rule 7 and the v3 format spec (`references/design_md_format.md`). 4. If the a11y prose fabricates data, rerun the write phase with explicit instruction "every a11y value must come from tokens.json verbatim." |

### Optional Supplemental Checks

To test absence-honesty directly, extract from a minimal site with no interactive elements (e.g., a single-paragraph page) and confirm `tokens.json` has no `accessibility` object and the Style Reference reads "No accessibility data was captured" or equivalent. To test a full a11y capture, extract from a WCAG-compliant site like gov.uk or a known design-system page and confirm contrast ratios, ARIA roles, and touch-target sizes are populated and traceable.

To test focus-indicator honesty, extract from a site where focus styles cannot be captured and confirm `focusIndicator.captured` is `false` and `consistent` is `false` in tokens.json — then confirm the Style Reference does NOT claim focus indicators are "consistent" and instead notes the absence (and confirm `validate.ts` raises a `prose-fabrication` warning if it does). To test the async fields, extract from a site with a `lang` attribute and a skip link and confirm `langAttribute`, `skipLinkDetected`, `tabOrder`, and `altTextCoverage` are populated in tokens.json and mirrored in the Style Reference's a11y data.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/a11y-extract.ts` | Accessibility extraction: contrast pairs, focus indicators, touch-target sizes, ARIA stats, tab order, lang attribute, skip-link detection, alt-text coverage |
| `../../backend/scripts/extract.ts` | Extraction orchestrator: calls extractA11y (synchronous) and extractA11yAsync (Playwright page-dependent) during Phase 1 |
| `../../backend/scripts/cluster.ts` | Provides wcagContrast() used by the pipeline for contrast ratio computation |
| `../../backend/scripts/types.ts` | A11yTokens type: focusIndicator, contrastPairs, minTouchTarget, minFontSize, ariaRoleStats, reducedMotionSupport, tabOrder, langAttribute, skipLinkDetected, altTextCoverage |
| `../../SKILL.md` | §4 ALWAYS rule 7 (accessibility section required, note absence if no data) |
| `../../references/design_md_format.md` | v3 Style Reference section specification — §12 Agent Prompt Guide (where captured a11y data and flagged problems surface) |

---

## 5. SOURCE METADATA

- Group: Accessibility
- Playbook ID: A11Y-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--accessibility/accessibility-section.md`
