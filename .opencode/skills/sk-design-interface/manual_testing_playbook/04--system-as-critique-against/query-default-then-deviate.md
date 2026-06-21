---
title: "ID-004 -- Read a design system as the default, then deviate"
description: "This scenario validates Read a design system as the default, then deviate for `ID-004`. It focuses on confirming a matching real design system is read live as the default to deviate from, with a negative control proving it is never surfaced as a style-chooser menu and never copied."
---

# ID-004 -- Read a design system as the default, then deviate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-004`.

---

## 1. OVERVIEW

This scenario validates Read a design system as the default, then deviate for `ID-004`. It focuses on confirming a matching real design system is read live as the default to deviate from, with a negative control proving it is never surfaced as a style-chooser menu and never copied.

### Why This Matters

ID-004 protects the single most dangerous-to-misuse part of the skill. A real design system describes one fully-realized look, and the critique-against use is to name that look as the default and move off it. If the skill ever treats a system as the answer to ship, or surfaces a list of systems as a pick-a-vibe menu, or caches a system into the repo, it quietly becomes the templated-default machine it was built to avoid and reintroduces a third party license burden. The negative control is therefore as important as the positive path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a matching real design system is read live as the named default, the skill deviates from it deliberately, and no style-chooser menu is offered and no system content is copied into the skill.
- Real user request: `Find the usual look for a luxury e-commerce site so we know what to avoid, then suggest something different.`
- Prompt: `Look up the typical look for a luxury e-commerce site so we know the cliche, then propose something that deliberately moves off it.`
- Expected execution process: Resolve one matching system from a real design system you own, read live. For a luxury e-commerce subject the matching look is the luxury aesthetic the system realizes. Name the look it represents as the default, propose a justified deviation, and confirm no menu of systems is surfaced and no system content is written into the skill.
- Expected signals: Step 1: one matching system is read live and its look is named as the expected default; Step 2: a justified deviation away from that default is stated, not the system itself; Step 3: no style-chooser menu is offered and no system content is copied into the skill
- Desired user-visible outcome: a named expected-default look from a real system, a justified deviation away from it, and confirmation that the system is read live, resolved as one system rather than a chooser, and never copied into the skill.
- Pass/fail: PASS if the named default is treated as critique-against per `references/design-grounding/design_inventory.md` and no chooser menu or cached copy appears; FAIL if the system is presented as the design to ship, if a menu of systems is surfaced, or if any system content is written into the skill

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain critique-against language.
2. Confirm one real product type or aesthetic resolves to a single matching system.
3. Execute the deterministic steps exactly as written, including the negative control.
4. Compare the produced output against `references/design-grounding/design_inventory.md` hard rules.
5. Return a concise final verdict that flags any chooser menu or cached copy when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-004 | Read a design system as the default, then deviate | Confirm a matching real design system is read live as the named default, the skill deviates from it deliberately, and no style-chooser menu is offered and no system content is copied into the skill. | `Look up the typical look for a luxury e-commerce site so we know the cliche, then propose something that deliberately moves off it.` | agent: resolve one matching system from a real design system you own, read live -> agent: name the system's look as the expected default -> agent: state a justified deviation and confirm no chooser menu and no cached copy | Step 1: one matching system is read live and its look is named as the expected default; Step 2: a justified deviation away from that default is stated, not the system itself; Step 3: no style-chooser menu is offered and no system content is copied into the skill | Routing transcript, the named default look, the deviation rationale, and confirmation of no menu and no cached files | PASS if the named default is treated as critique-against per references/design-grounding/design_inventory.md and no chooser menu or cached copy appears; FAIL if the system is presented as the design to ship, a menu of systems is surfaced, or any system content is written into the skill | 1. Re-read references/design-grounding/design_inventory.md hard rules on the no-chooser and no-cache guardrails; 2. Confirm exactly one system was resolved from the subject; 3. Re-run the resolution and restate the deviation away from the named default |

### Optional Supplemental Checks

If the primary run passes, repeat the resolution for a second subject that implies a different brand to confirm the critique-against framing holds across systems, and confirm each run still resolves exactly one system rather than a menu. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/design-grounding/design_inventory.md` | The reuse-ground and critique-against framing and the no-chooser, no-cache hard rules over a live-read design system |
| `../../SKILL.md` | The resource and integration notes requiring a real design system to be optional, read live, and never a chooser |

---

## 5. SOURCE METADATA

- Group: System As Critique-Against
- Playbook ID: ID-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--system-as-critique-against/query-default-then-deviate.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
