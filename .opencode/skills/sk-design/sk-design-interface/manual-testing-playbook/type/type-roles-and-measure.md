---
title: Type Roles And Measure Scenario
description: Manual scenario verifying role-based typography, scale, pairing, measure, and data text guidance.
trigger_phrases:
  - "test typography roles"
  - "test type measure"
  - "foundations type scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: TYPE
expected_resources:
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/type/typography-system.md
---

# FOUND-TYPE-001 | Type Roles And Measure

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-TYPE-001`.

**Exact prompt**

```text
Define typography for a dense analytics app with long labels, metrics, and a small marketing header.
```

---

## 1. OVERVIEW

This scenario validates role-based typography, scale bounding, measure, and data-text guidance in `interface`'s `foundations` static-system subworkflow. It confirms roles are defined before fonts are picked and that web-font loading, OpenType, and light-on-dark compensation are all addressed.

### Why This Matters

Typography chosen font-first produces a system that cannot absorb long labels, localization expansion, or dense metric tables. Defining roles first, bounding the fluid scale, and compensating light-on-dark across all three axes is what makes the system implementable rather than decorative.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a dense analytics typography request resolves in the foundations subworkflow with roles before fonts, bounded fluid scale, tabular numerals for metrics, and explicit web-font and OpenType guidance.
- Real user request: `Set up the typography for our analytics app. The labels run long, there are a lot of metrics, and there's a small marketing header at the top.`
- Prompt: `Define typography for a dense analytics app with long labels, metrics, and a small marketing header.`
- Expected execution process: Load `../../references/foundations/type/typography-system.md`; define display, heading, body, caption, utility, and data roles; name measure and line-height constraints; include tabular numerals for metrics; check web-font loading performance covering `font-display`, metric-matched fallbacks, critical-only preload, and whether a variable font is earned by at least three weights or axes; bound any `clamp()` type scale so the maximum is no more than about 2.5x the minimum; specify OpenType features only where they serve the content; include light-on-dark optical compensation across line height, letter spacing, and weight.
- Expected signals: Roles are named before any font choice; measure and line-height constraints are stated; metrics use tabular numerals; `clamp()` maximums stay within roughly 2.5x the minimum; web-font, OpenType, non-Latin, and light-on-dark guidance all appear.
- Desired user-visible outcome: A role-based type system that survives long labels and localization, reads well in dense data, and is directly implementable by `sk-code`.
- Pass/fail: PASS if roles precede fonts, the fluid scale is bounded, tabular numerals cover metrics, and web-font, OpenType, non-Latin, and light-on-dark guidance are present; FAIL if fonts are chosen before roles, expressive display type leaks outside identity moments, long labels and expansion are unaddressed, or the `clamp()` maximum exceeds roughly 2.5x the minimum.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `references/foundations/type/typography-system.md`.
2. Define display, heading, body, caption, utility, and data roles.
3. Name measure and line-height constraints.
4. Include tabular numerals for metrics.
5. Check web-font loading performance: `font-display`, metric-matched fallbacks, critical-only preload, and whether a variable font is earned by at least three weights or axes.
6. Bound any `clamp()` type scale so the maximum is no more than about 2.5x the minimum.
7. Specify OpenType features only where they serve the content: fractions, real small caps, deliberate ligatures, kerning, and uppercase tracking.
8. Include light-on-dark optical compensation across line height, letter spacing, and weight.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-TYPE-001 | Typography role system and measure | Confirm roles precede fonts, the fluid scale is bounded, and metric, web-font, and light-on-dark guidance are explicit | `Define typography for a dense analytics app with long labels, metrics, and a small marketing header.` | bash: rg -n "measure" ../../references/foundations/type/typography-system.md -> bash: rg -n "register" ../../../shared/register.md -> agent: produce the typography system | Step 1: role, measure, and scale rules found; Step 2: register posture found; Step 3: output names the six roles before any font, bounds the `clamp()` scale, and specifies tabular numerals | Terminal transcript, the produced type system, the role table, the web-font and OpenType notes, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically fonts chosen before roles or an unbounded fluid scale | 1. Re-read `../../references/foundations/type/typography-system.md` for role ordering and measure constraints; 2. Recompute the `clamp()` maximum-to-minimum ratio against the 2.5x bound; 3. Re-run with a long localized label and confirm expansion is addressed |

### Pass Criteria

- Does not pick fonts before roles.
- Keeps expressive display type limited to identity moments.
- Addresses long labels and localization expansion.
- Any fluid type uses deliberate `clamp()` values with a maximum no more than about 2.5x the minimum.
- Web-font guidance covers `font-display`, metric-compatible fallbacks, critical above-the-fold preload only, and a variable-font threshold based on three or more weights or axes.
- OpenType guidance includes fractions, real small caps, ligature control, `font-kerning: normal`, and 0.05em-0.12em tracking only for short uppercase labels or eyebrows.
- Light-on-dark type compensates across all three axes: line height, letter spacing where needed, and weight.
- Checks non-Latin scripts beyond RTL and expansion, including line height, weight, fallback fonts, and glyph shaping for CJK, Arabic, Devanagari, and similar systems.
- Provides implementable role guidance for `sk-code`.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../references/foundations/type/typography-system.md` | Type roles, scale, measure, web-font, and OpenType rules |
| `../../../shared/register.md` | Register posture that sets type density and expressiveness |

---

## 5. SOURCE METADATA

- Group: Type
- Playbook ID: FOUND-TYPE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `type/type-roles-and-measure.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
