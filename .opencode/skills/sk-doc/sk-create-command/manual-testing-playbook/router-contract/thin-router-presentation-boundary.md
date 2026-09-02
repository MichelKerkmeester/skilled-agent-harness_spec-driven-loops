---
title: "CMR-001 -- Thin router and presentation boundary"
description: "This scenario validates the router and presentation ownership boundary for a split command without changing its behavior."
version: 1.0.0.1
---

# CMR-001 -- Thin router and presentation boundary

This document captures the ownership contract for a split mode-based command.

---

## 1. OVERVIEW

This scenario validates `CMR-001`. It focuses on keeping routing and visible wording in their respective files.

### Why This Matters

The router owns inputs, mode resolution, execution targets and the presentation boundary. The presentation asset owns startup prompts, dashboards, result templates and next-step wording. Moving wording must not alter gates, modes or permissions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMR-001`.

- Objective: split a command without changing routing semantics or permissions.
- Realistic user request: `Split this mode-based command so the router selects the workflow and the presentation asset owns the startup prompt and result text.`
- Prompt: `Split this mode-based command so the router selects the workflow and the presentation asset owns the startup prompt and result text.`
- Expected execution process: read the split reference and worked example, map each responsibility to the correct file and validate the router structure.
- Expected signals: the router carries `OWNED ASSETS` and `PRESENTATION BOUNDARY`, display wording moves to the presentation asset and modes and gates remain unchanged.
- Desired user-visible outcome: the split is behavior-preserving and reviewable by file ownership.
- Pass/fail: PASS if routing semantics, required inputs and permissions remain unchanged. FAIL if the router keeps display templates or the split changes behavior.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Split this mode-based command so the router selects the workflow and the presentation asset owns the startup prompt and result text.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMR-001 | Thin router and presentation boundary | Separate routing from display wording without a behavior change | `Split this mode-based command so the router selects the workflow and the presentation asset owns the startup prompt and result text.` | 1. `agent: Read references/router-presentation-split.md and state the two ownership sets` -> 2. `agent: Compare the draft router with assets/command-router-template.md` -> 3. `agent: Check that gates, modes and permissions are unchanged after the move` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/create/command.md --type command` | Step 1: router and presentation responsibilities are separated. Step 2: the canonical router sections are present. Step 3: routing semantics and permissions are unchanged. Step 4: validator output and exit status are captured | The prompt, ownership map, router section review, before and after behavior comparison and validator transcript | PASS if the router is thin, the presentation asset owns display text and behavior is unchanged. FAIL if display templates remain in the router or the split changes routing | 1. Check `OWNED ASSETS` and `PRESENTATION BOUNDARY`. 2. Search the router for dashboard or result templates. 3. Compare modes, gates and allowed tools before accepting the split |

### Commands

1. `agent: Read references/router-presentation-split.md and state the two ownership sets`
2. `agent: Compare the draft router with assets/command-router-template.md`
3. `agent: Check that gates, modes and permissions are unchanged after the move`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/create/command.md --type command`

### Expected

Step 1 assigns routing to the router and display wording to the presentation asset. Step 2 checks the canonical router structure. Step 3 compares behavior rather than file length. Step 4 records the shared structural check.

### Evidence

Capture the prompt, ownership map, router headings, before and after mode and gate comparison and validator output with its exit status.

### Pass / Fail

- **Pass**: only wording moves, routing semantics and permissions stay unchanged and the router owns the boundary sections.
- **Fail**: the router still owns display templates or the split changes inputs, modes, permissions or target selection.

### Failure Triage

1. List display content still present in the router.
2. Compare the pre-split and post-split mode and gate rules.
3. Check the presentation asset path in the owned-assets table.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Router contract and ownership |
| [`../../references/router-presentation-split.md`](../../references/router-presentation-split.md) | Behavior-preserving split rule |
| [`../../references/worked-example.md`](../../references/worked-example.md) | Complete router and presentation shape |
| [`../../assets/command-router-template.md`](../../assets/command-router-template.md) | Canonical router skeleton |

---

## 5. SOURCE METADATA

- Group: ROUTER CONTRACT
- Playbook ID: CMR-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `router-contract/thin-router-presentation-boundary.md`
