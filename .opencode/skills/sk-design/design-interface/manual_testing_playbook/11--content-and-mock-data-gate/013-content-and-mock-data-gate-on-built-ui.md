---
title: "ID-013 -- Content and mock-data gate on a built UI"
description: "This scenario validates the copy and mock-data content gate for `ID-013`. It focuses on confirming a built interface is swept against copy_and_mock_data.md, no lorem, no AI-tell phrasing, plausible names and numbers, one copy register matched to the posture, and descriptive unique image seeds, where each check is a pass or fail sweep run over the real strings rather than from memory."
contextType: reference
version: 1.0.0.0
id: ID-013
expected_intent: COPY_MOCK_DATA
expected_resources:
  - references/design-process/design_principles.md
  - ../shared/register.md
  - references/design-process/copy_and_mock_data.md
---

# ID-013 -- Content and mock-data gate on a built UI

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-013`.

**Exact prompt**

```
Sweep this built page for content tells: lorem, AI-tell phrasing, fake-precise numbers, mixed copy register, and lazy image seeds, then tell me what fails.
```

---

## 1. OVERVIEW

This scenario validates the copy and mock-data content gate for `ID-013`. It focuses on confirming a built interface is swept against `references/design-process/copy_and_mock_data.md` across no lorem, no AI-tell phrasing, plausible names and numbers, one copy register matched to the posture, and descriptive unique image seeds, where each check is a pass or fail sweep run over the real strings rather than from memory.

### Why This Matters

ID-013 catches the content defaults that make a well-designed page still announce itself as machine-made. A grounded palette and a clean layout do not save a page that ships "Jane Doe" in a testimonial, `99.99%` in a stat block, "Elevate your workflow" in a headline, a lorem paragraph in a card, or three placeholder images all seeded `image`. Copy is design material, so it gets the same intentionality as spacing and color, and the checks here are sweeps to run rather than impressions to recall. The fake-precision rule fails in both directions, an invented engineering-precise number and a fake-perfect round number are both tells. The one-copy-register rule inherits the Brand-vs-Product posture, so the register is named first and held across the surface. This gate is authored once here and the audit mode points at it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a built UI is swept against `references/design-process/copy_and_mock_data.md` Sections 2 through 7 for lorem and placeholder filler, banned AI-tell phrasing, plausible names and brands, grounded or marked-mock numbers, one copy register matched to the posture, state-copy voice and formulas, and descriptive unique image seeds, with each check a pass or fail sweep.
- Real user request: `Read the copy and the mock data on this page and flag anything that reads as AI-generated before I ship.`
- Prompt: `Sweep this built page for content tells: lorem, AI-tell phrasing, fake-precise numbers, mixed copy register, and lazy image seeds, then tell me what fails.`
- Expected execution process: Supply a real built UI as the fixture so the sweeps have concrete strings, numbers, and image sources. Load `references/design-process/copy_and_mock_data.md`, run the sweeps in Sections 2 through 7, grep the rendered strings for lorem and the banned filler list, run the copy self-audit over every visible string, scan every name, brand, avatar, and date, list every number and confirm each is grounded in the brief or marked mock, name the one copy register and confirm the posture matches, verify state-copy voice and the error, empty-state, and CTA formulas, and list every image seed to confirm each is descriptive and unique. Report each failing check with the offending string or value and a concrete fix.
- Expected signals: Step 1: the rendered strings are swept for lorem, the banned filler list, and exclamation marks in status copy; Step 2: every number is listed and confirmed grounded or marked mock, the copy register is named and matched to the posture, and error/empty/CTA copy follows the formulas; Step 3: each failure names the offending string, number, or seed with a specific fix
- Desired user-visible outcome: a pass/fail content report keyed to the `copy_and_mock_data.md` rules, each failing string or value named, the copy register stated, and a concrete fix for each finding.
- Pass/fail: PASS if the report sweeps the real strings, lists every number with its grounding, names the single copy register, verifies state-copy voice plus error/empty/CTA formulas, and cites `references/design-process/copy_and_mock_data.md` for each finding; FAIL if the sweep relies on memory rather than the real strings, a number is left unchecked for grounding, a state-copy formula is skipped, or a section of the gate is skipped

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain content-gate language.
2. Confirm a real built render is available so the copy, numbers, and image seeds can be swept rather than recalled.
3. Execute the deterministic steps exactly as written, running each sweep over the real strings.
4. Compare the produced report against the cited `copy_and_mock_data.md` rules, including the fake-precision rule in both directions.
5. Return a concise final verdict that names any memory-based sweep or any ungrounded number left unchecked when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-013 | Content and mock-data gate on a built UI | Confirm a built UI is swept against references/design-process/copy_and_mock_data.md Sections 2 through 7 for lorem and placeholder filler, banned AI-tell phrasing, plausible names and brands, grounded or marked-mock numbers, one copy register matched to the posture, state-copy formulas, and descriptive unique image seeds, with each check a pass or fail sweep. | `Sweep this built page for content tells: lorem, AI-tell phrasing, fake-precise numbers, mixed copy register, and lazy image seeds, then tell me what fails.` | bash: rg -n "banned marketing filler" references/design-process/copy_and_mock_data.md -> agent: sweep the rendered strings, list every number for grounding, name the copy register, verify state-copy formulas, and list every image seed -> bash: rg -n "copy_and_mock_data" SKILL.md | Step 1: the rendered strings are swept for lorem, the banned filler list, and exclamation marks in status copy; Step 2: every number is listed and confirmed grounded or marked mock, the copy register is named and matched to the posture, and error/empty/CTA formulas are checked; Step 3: each failure names the offending string, number, or seed with a specific fix | Terminal transcript, the content gate report, and the per-section swept pass/fail list | PASS if the report sweeps the real strings, lists every number with its grounding, names the single copy register, verifies state-copy formulas, and cites references/design-process/copy_and_mock_data.md for each finding; FAIL if the sweep relies on memory, a number is left unchecked for grounding, a state-copy formula is skipped, or a section of the gate is skipped | 1. Re-read references/design-process/copy_and_mock_data.md Sections 2 through 8; 2. Confirm SKILL.md Section 2 loaded the content gate for placeholder content and copy; 3. Re-run the sweeps over the real strings, numbers, state copy, and image seeds |

### Optional Supplemental Checks

If the primary run passes, repeat the register check on a Brand surface and a Product surface and confirm the single allowed register flips by posture, expressive for Brand and plain for Product, while the lorem and fake-precision sweeps stay identical. Confirm the copy self-audit rewrites any flagged string rather than leaving it in place. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/design-process/copy_and_mock_data.md` | The content gate: no lorem, no AI-tell phrasing, plausible names and numbers, the fake-precision rule, one copy register, and image-seed discipline |
| `../../SKILL.md` | Section 2 loads the content gate when writing placeholder content, names, or numbers, and Section 5 lists it as a core reference |
| `../../assets/interface_preflight_card.md` | The fill-in card whose content boxes derive from this gate |
| `../../shared/register.md` | The Brand-vs-Product posture that fixes which single copy register applies |

---

## 5. SOURCE METADATA

- Group: Content And Mock-Data Gate
- Playbook ID: ID-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--content-and-mock-data-gate/content-and-mock-data-gate-on-built-ui.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
