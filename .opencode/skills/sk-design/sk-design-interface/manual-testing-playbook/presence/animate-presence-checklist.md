---
title: AnimatePresence Checklist Scenario
description: Manual scenario verifying the pass-or-fail exit checklist catches wrapper, key, first-render, mode, presence-hook and nested-exit failures.
trigger_phrases:
  - "test animate presence checklist"
  - "exit checklist scenario"
  - "presence pass fail test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_PRESENCE
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/animate-presence-patterns.md
  - assets/motion/animate-presence-checklist.md
---

# MOTION-PRESENCE-002 | AnimatePresence Checklist

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-PRESENCE-002`.

**Exact prompt**

```text
Here is a list component with conditional motion rows and a modal. Run the exit checklist before we ship.
```

---

## 1. OVERVIEW

This scenario validates the pass-or-fail exit checklist walked box by box over real code: exit wiring, keys, first render, mode, presence hooks, and nested exits, with a `file:line` recorded for every failure.

### Why This Matters

A checklist that is skimmed rather than walked produces false confidence before ship. Marking each box pass or fail against real code, and pointing each failure to its fix rather than restating the reasoning, is what makes this a gate instead of a summary.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the exit checklist is walked section by section over the supplied component, each box marked pass or fail, and every failure recorded with a `file:line` and routed to its fix.
- Real user request: `We're about to ship this list with conditional motion rows plus a modal. Can you run the exit checklist over it first?`
- Prompt: `Here is a list component with conditional motion rows and a modal. Run the exit checklist before we ship.`
- Expected execution process: Load `../../assets/motion/animate-presence-checklist.md` and walk every section in order — exit wiring, keys, first render, mode, presence hooks, nested exits; mark each box pass or fail and record a `file:line` for any fail; point each fail to its fix in `../../references/motion/animate-presence-patterns.md` rather than restating the reasoning inline.
- Expected signals: Every checklist section is walked in order; each box carries a binary pass or fail mark; each fail carries a `file:line`; fixes are cited from the patterns reference; findings use the audit findings format.
- Desired user-visible outcome: A completed exit checklist with a concrete, located defect list the team can fix before shipping.
- Pass/fail: PASS if every section is walked, each box is marked binary, and every fail has a `file:line` plus a cited fix; FAIL if a conditional `motion.*` element with an `exit` prop outside an `AnimatePresence` goes unflagged, array-index keys are accepted, or a fail is recorded without a `file:line`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `assets/motion/animate-presence-checklist.md` and walk every section in order: exit wiring, keys, first render, mode, presence hooks, nested exits.
2. Mark each box pass or fail and record a `file:line` for any fail.
3. Point each fail to its fix in `references/motion/animate-presence-patterns.md` rather than restating the reasoning inline.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-PRESENCE-002 | AnimatePresence checklist | Confirm every checklist section is walked with binary marks and a `file:line` for each failure | `Here is a list component with conditional motion rows and a modal. Run the exit checklist before we ship.` | bash: rg -n "exit" ../../assets/motion/animate-presence-checklist.md -> bash: rg -n "AnimatePresence" ../../references/motion/animate-presence-patterns.md -> agent: walk the exit checklist over the supplied component | Step 1: checklist sections found; Step 2: fix rules found; Step 3: every box marked pass or fail with a `file:line` on each fail | Terminal transcript, the completed checklist, the located defect list, the cited fixes, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically an unflagged out-of-wrapper `exit` prop or an accepted index key | 1. Re-read `../../assets/motion/animate-presence-checklist.md` and confirm no section was skipped; 2. Confirm every fail carries a `file:line`; 3. Re-run on a component with a known array-index key and confirm it is rejected |

### Pass Criteria

- Flags any conditional `motion.*` element with an `exit` prop that sits outside an `AnimatePresence`.
- Rejects array-index keys and confirms stable, unique data-ID keys per sibling.
- Confirms `mode` matches the case and that `wait` shortens each phase, then checks `initial={false}` for default-state first mounts.
- Records a `file:line` for every fail and reports it in the audit findings format from the patterns reference.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../assets/motion/animate-presence-checklist.md` | Pass-or-fail exit checklist walked box by box |
| `../../references/motion/animate-presence-patterns.md` | Fix reference and audit findings format |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Presence
- Playbook ID: MOTION-PRESENCE-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `presence/animate-presence-checklist.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
