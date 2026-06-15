---
title: "ID-003 -- Quality-floor gate on a built UI"
description: "This scenario validates Quality-floor gate on a built UI for `ID-003`. It focuses on confirming a built interface is checked against the objective quality floor in ux_quality_reference.md."
---

# ID-003 -- Quality-floor gate on a built UI

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-003`.

---

## 1. OVERVIEW

This scenario validates Quality-floor gate on a built UI for `ID-003`. It focuses on confirming a built interface is checked against the objective quality floor in `ux_quality_reference.md`.

### Why This Matters

ID-003 is the safety net under every distinctive choice. A bold aesthetic that fails contrast, hides focus, ignores reduced motion, ships tiny tap targets, or breaks on mobile is not a bold choice, it is a defect. The quality floor is objective and applies regardless of direction, so this gate is what keeps deviation from becoming an excuse for inaccessible UI.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a built UI is graded against the `ux_quality_reference.md` floor across contrast, focus, reduced motion, touch targets, and responsive behavior.
- Real user request: `Before I ship this landing page, tell me what accessibility or quality issues it has.`
- Prompt: `Check this finished landing page against the accessibility and quality floor and tell me what fails before I ship.`
- Expected execution process: Supply a real built UI as the fixture (for example a built page like `.opencode/specs/skilled-agent-orchestration/150-mcp-open-design/009-design-skill-integration-test/designs/mimo/01-meridian-roasters.html`, or any rendered HTML the operator provides) so the gate has something concrete to grade. Load `references/design-process/ux_quality_reference.md`, apply it as the pass/fail gate after the direction is set, and report each failing rule across the five floor areas with a concrete fix.
- Expected signals: Step 1: the five floor areas (contrast, focus, reduced motion, touch targets, responsive) are each evaluated; Step 2: each failure names the broken rule; Step 3: each failure includes a specific fix
- Desired user-visible outcome: a pass/fail gate report keyed to the `ux_quality_reference.md` rules, naming each failing rule with the specific floor it breaks and how to fix it.
- Pass/fail: PASS if the report evaluates all five floor areas and cites `references/design-process/ux_quality_reference.md` for each finding; FAIL if any floor area is skipped or a finding is given with no rule citation

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain quality-gate language.
2. Confirm the design direction is already set so the gate runs after, not instead of, the look.
3. Execute the deterministic steps exactly as written.
4. Compare the produced report against the cited `ux_quality_reference.md` rules.
5. Return a concise final verdict that names any skipped floor area when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-003 | Quality-floor gate on a built UI | Confirm a built UI is graded against the ux_quality_reference.md floor across contrast, focus, reduced motion, touch targets, and responsive behavior. | `Check this finished landing page against the accessibility and quality floor and tell me what fails before I ship.` | bash: rg -n "Color contrast" references/design-process/ux_quality_reference.md -> agent: grade the built UI against the floor -> bash: rg -n "quality floor" SKILL.md | Step 1: the five floor areas are each evaluated; Step 2: each failure names the broken rule; Step 3: each failure includes a specific fix | Terminal transcript, the gate report, and the per-area pass/fail list | PASS if the report evaluates all five floor areas and cites references/design-process/ux_quality_reference.md for each finding; FAIL if any floor area is skipped or a finding lacks a rule citation | 1. Re-read references/design-process/ux_quality_reference.md Sections 1-4; 2. Confirm SKILL.md Quality Floor note was loaded; 3. Re-run the gate covering all five floor areas |

### Optional Supplemental Checks

If the UI under test includes charts, also apply the data-visualization rules from `ux_quality_reference.md` Section 6 (chart-to-data-shape match, non-color series differentiation, data-volume thresholds). Keep supplemental evidence separate from the primary verdict.

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
| `../../SKILL.md` | The Quality Floor note and ALWAYS rule 5 |
| `../../references/design-process/ux_quality_reference.md` | The objective quality floor: accessibility, motion, touch, responsive, forms, charts |

---

## 5. SOURCE METADATA

- Group: Quality Floor Gate
- Playbook ID: ID-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--quality-floor-gate/quality-floor-gate-on-built-ui.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
