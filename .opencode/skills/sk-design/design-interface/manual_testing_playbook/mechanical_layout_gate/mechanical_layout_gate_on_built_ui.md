---
title: "ID-012 -- Mechanical layout gate on a built UI"
description: "This scenario validates the mechanical anti-default layout gate for `ID-012`. It focuses on confirming a built interface is graded against the countable layout rules in mechanical_defaults.md, hero line count, gapless bento math, the eyebrow ceiling, button contrast, and section spacing, where each check is binary and counted rather than estimated."
contextType: reference
version: 1.0.0.0
id: ID-012
expected_intent: MECHANICAL_PREFLIGHT
expected_resources:
  - references/design_process/design_principles.md
  - ../shared/register.md
  - references/design_process/mechanical_defaults.md
  - references/design_process/copy_and_mock_data.md
  - references/design_process/brief_to_dials.md
  - assets/interface_preflight_card.md
---

# ID-012 -- Mechanical layout gate on a built UI

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-012`.

**Exact prompt**

```
Run the mechanical layout gate over this built page: count the hero lines, the bento cells, the eyebrows, and check button contrast, then tell me what fails.
```

---

## 1. OVERVIEW

This scenario validates the mechanical anti-default layout gate for `ID-012`. It focuses on confirming a built interface is graded against the countable layout rules in `references/design_process/mechanical_defaults.md` across the hero line count, gapless bento math, the eyebrow ceiling, button contrast, and section spacing, where each check is binary and counted rather than estimated.

### Why This Matters

ID-012 catches the structural AI tells a taste read cannot. A page can pass the aesthetic critique, a memorable signature, a grounded palette, a justified risk, and still ship a four-line hero, a bento grid with a dead cell, an eyebrow above every section, and a button the same color as its label. Those are mechanical failures, not taste failures, so the gate must compute and count rather than judge. The eyebrow ceiling is a literal `ceil(sectionCount / 3)` count, the bento check is content items against grid cells, and button contrast is a ratio against the real background the element sits on, never against an assumed white. This gate is authored once here and the audit mode points at it, so its rules must read as binary pass or fail with a single failing check blocking delivery.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a built UI is graded against `references/design_process/mechanical_defaults.md` Sections 2 through 6, counting the hero lines, the bento cells against content, the eyebrows against the `ceil(sectionCount / 3)` ceiling, the button contrast ratios, and the layout repetition, with each check binary.
- Real user request: `Check this page for the mechanical layout mistakes that make a site look AI-built before I ship it.`
- Prompt: `Run the mechanical layout gate over this built page: count the hero lines, the bento cells, the eyebrows, and check button contrast, then tell me what fails.`
- Expected execution process: Supply a real built UI as the fixture so the counts are concrete. Load `references/design_process/mechanical_defaults.md`, walk Sections 2 through 6 as binary checks, count the hero lines at desktop and at the narrowest width, count content items against bento cells, count eyebrows against `ceil(sectionCount / 3)`, compute each button contrast ratio against its real background, and confirm at most one repeat per layout family and at most two consecutive zigzag splits. Report each failing check with the counted value and a concrete fix.
- Expected signals: Step 1: the hero line count, subtext word count, bento cell-to-content count, and eyebrow count are each computed, not estimated; Step 2: each button and form control contrast ratio is computed against its real background; Step 3: each failure names the broken rule with its counted value and a specific fix
- Desired user-visible outcome: a pass/fail layout report keyed to the `mechanical_defaults.md` rules, with the countable checks shown as actual counts, each failing rule named, and a concrete fix for each.
- Pass/fail: PASS if the report counts the countable checks, computes contrast against the real background, and cites `references/design_process/mechanical_defaults.md` for each finding; FAIL if any countable check is estimated rather than counted, contrast is computed against assumed white, or a section of the gate is skipped

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain layout-gate language.
2. Confirm a real built render is available so the hero lines, bento cells, and eyebrows can be counted.
3. Execute the deterministic steps exactly as written, counting rather than estimating each countable check.
4. Compare the produced report against the cited `mechanical_defaults.md` rules and the `ceil(sectionCount / 3)` math.
5. Return a concise final verdict that names any estimated count or any contrast computed against assumed white when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-012 | Mechanical layout gate on a built UI | Confirm a built UI is graded against references/design_process/mechanical_defaults.md Sections 2 through 6, counting the hero lines, the bento cells against content, the eyebrows against the ceil(sectionCount / 3) ceiling, the button contrast ratios, and the layout repetition, with each check binary. | `Run the mechanical layout gate over this built page: count the hero lines, the bento cells, the eyebrows, and check button contrast, then tell me what fails.` | bash: rg -n "ceil\(sectionCount / 3\)" references/design_process/mechanical_defaults.md -> agent: count the hero lines, bento cells, and eyebrows and compute each button contrast ratio against its real background -> bash: rg -n "mechanical_defaults" SKILL.md | Step 1: the hero line count, subtext word count, bento cell-to-content count, and eyebrow count are each computed, not estimated; Step 2: each button and form control contrast ratio is computed against its real background; Step 3: each failure names the broken rule with its counted value and a specific fix | Terminal transcript, the layout gate report, and the per-section counted pass/fail list | PASS if the report counts the countable checks, computes contrast against the real background, and cites references/design_process/mechanical_defaults.md for each finding; FAIL if a countable check is estimated, contrast is computed against assumed white, or a section of the gate is skipped | 1. Re-read references/design_process/mechanical_defaults.md Sections 2 through 7; 2. Confirm SKILL.md Section 2 loaded the layout gate for the final mechanical pass; 3. Re-run the gate counting every countable check and computing contrast against the real background |

### Optional Supplemental Checks

If the primary run passes, repeat the eyebrow count on a page with a different section count to confirm the `ceil(sectionCount / 3)` ceiling is recomputed rather than carried over, and confirm the gate holds at both a Brand and a Product register since the mechanical checks apply to both postures. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../references/design_process/mechanical_defaults.md` | The mechanical layout gate: hero line count and max-width fix, gapless bento math, the eyebrow and meta-label ban, button contrast, and section spacing |
| `../../SKILL.md` | Section 2 loads the layout gate for the final mechanical pass, and Section 5 lists it as a core reference |
| `../../assets/interface_preflight_card.md` | The fill-in card whose layout boxes derive from this gate |

---

## 5. SOURCE METADATA

- Group: Mechanical Layout Gate
- Playbook ID: ID-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mechanical-layout-gate/mechanical-layout-gate-on-built-ui.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
