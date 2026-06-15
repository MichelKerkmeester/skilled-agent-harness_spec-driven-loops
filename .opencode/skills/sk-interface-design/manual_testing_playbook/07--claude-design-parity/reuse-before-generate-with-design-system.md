---
title: "ID-008 -- Reuse before generate when a design system is present"
description: "This scenario validates Reuse before generate when a design system is present for `ID-008`. It focuses on confirming the parity loop searches the active system's registered components before authoring net-new, with a negative control proving no style-preset menu exists."
---

# ID-008 -- Reuse before generate when a design system is present

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-008`.

---

## 1. OVERVIEW

This scenario validates Reuse before generate when a design system is present for `ID-008`. It focuses on confirming the parity loop searches the active system's registered components before authoring net-new, with a negative control proving no style-preset menu exists.

### Why This Matters

ID-008 is the strongest move toward parity and the one most likely to drift back into AI defaults. When a design system exists, the parity loop must build from it: reuse a registered component or token before inventing markup, and flag raw colors, one-off spacing, inline overrides, or a hand-rolled component that bypasses a system one. The negative control matters as much as the positive path. The protocol forbids a style chooser, so if a pick-a-vibe or preset menu ever appears, the skill has become the templated generator it exists to resist.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the parity loop reuses the active system's registered components before authoring net-new, and that no style-preset or pick-a-vibe menu is offered.
- Real user request: `We already have a design system; reuse what fits before building anything new for this section.`
- Prompt: `Build this pricing section using our existing design system; reuse the components and tokens we already have before making anything new.`
- Expected execution process: Use a real Open Design system read live as the active system (built-in systems at `/Applications/Open Design.app/Contents/Resources/open-design/design-systems/<name>/`, for example `professional`, each with tokens.css and components.html). Follow `references/design-process/claude_design_parity.md` Section 3, search that system's registered components and tokens for a fit before authoring net-new, run the adherence check for raw values and bypassed components, and confirm no style-preset menu is presented.
- Expected signals: Step 1: the registered components and tokens are searched before any net-new markup; Step 2: a fitting component or token is reused, or net-new is justified only because nothing fit; Step 3: no style-preset, pick-a-vibe, or theme-swap menu is offered
- Desired user-visible outcome: a result that reuses the system's components and tokens where they fit, justifies any net-new authoring against the gap, and offers no choosable style axis.
- Pass/fail: PASS if reuse-before-generate is followed per `references/design-process/claude_design_parity.md` Section 3 and no style-preset menu appears; FAIL if net-new markup is authored without searching the system first, or if a pick-a-vibe or preset menu is offered

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain reuse-before-generate language.
2. Confirm a design system is present so adherence and reuse apply rather than free-axis invention.
3. Execute the deterministic steps exactly as written, including the negative control.
4. Compare the produced output against `references/design-process/claude_design_parity.md` Sections 3 and 8.
5. Return a concise final verdict that flags any preset menu or unsearched net-new authoring when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-008 | Reuse before generate when a design system is present | Confirm the parity loop reuses the active system's registered components before authoring net-new, and that no style-preset menu is offered. | `Build this pricing section using our existing design system; reuse the components and tokens we already have before making anything new.` | bash: rg -n "Reuse before generate" references/design-process/claude_design_parity.md -> agent: search the active system and reuse before authoring net-new -> bash: rg -n "No style presets" references/design-process/claude_design_parity.md | Step 1: registered components and tokens are searched before net-new markup; Step 2: a fitting component or token is reused, or net-new is justified only because nothing fit; Step 3: no style-preset, pick-a-vibe, or theme-swap menu is offered | Terminal transcript, the reuse decision text, and confirmation no preset menu was presented | PASS if reuse-before-generate is followed per references/design-process/claude_design_parity.md Section 3 and no style-preset menu appears; FAIL if net-new is authored without searching the system first, or a preset menu is offered | 1. Re-read references/design-process/claude_design_parity.md Section 3 on reuse-before-generate and the adherence check; 2. Re-read Section 8 guardrails forbidding style presets; 3. Re-run the search-first step and confirm no preset menu is produced |

### Optional Supplemental Checks

If the primary run passes, repeat with a request that names a component the system already provides and confirm the loop reuses it rather than re-authoring an equivalent. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/design-process/claude_design_parity.md` | Section 3 reuse-before-generate and adherence check, Section 8 no-style-presets guardrail |
| `../../references/design-process/design_principles.md` | The anti-default mandate the reuse move serves |

---

## 5. SOURCE METADATA

- Group: Claude Design Parity
- Playbook ID: ID-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--claude-design-parity/reuse-before-generate-with-design-system.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
