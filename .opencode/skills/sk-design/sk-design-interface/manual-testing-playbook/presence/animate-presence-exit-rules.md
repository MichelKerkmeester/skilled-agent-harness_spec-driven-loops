---
title: AnimatePresence Exit Rules Scenario
description: Manual scenario verifying exit wrapper, exit prop, stable key, mode, and nested-exit guidance.
trigger_phrases:
  - "test AnimatePresence"
  - "test exit animations"
  - "presence rules scenario"
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

# MOTION-PRESENCE-001 | AnimatePresence Exit Rules

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-PRESENCE-001`.

**Exact prompt**

```text
Review this modal/list transition plan for AnimatePresence correctness before implementation.
```

---

## 1. OVERVIEW

This scenario validates review of a modal and list transition plan against the `AnimatePresence` correctness rules: exit wrapper, exit prop, stable key, mode, nested exits, and presence hook placement.

### Why This Matters

Exit animations fail silently — the element simply disappears — and the cause is almost always structural: a missing wrapper, an index key, or a mode mismatch. Catching these at plan review is far cheaper than debugging a component that "sometimes doesn't animate out."

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a transition-plan review checks wrapper, exit prop, stable key, mode, nested exits, and presence hook placement, and returns concrete guidance or `file:line` findings.
- Real user request: `Before we build this, can you check our modal and list transition plan for AnimatePresence problems?`
- Prompt: `Review this modal/list transition plan for AnimatePresence correctness before implementation.`
- Expected execution process: Load `../../references/motion/animate-presence-patterns.md`; check wrapper, exit prop, stable key, mode, nested exits, and presence hook placement; produce concrete guidance or `file:line` findings when code is provided.
- Expected signals: Missing wrappers and exit props are flagged; index keys on animated lists are rejected; `wait` duration and `popLayout` list use are explained; `propagate` is mentioned for nested coordinated exits where relevant.
- Desired user-visible outcome: A review that names each correctness problem and the fix, so the implementation lands with working exit animations the first time.
- Pass/fail: PASS if wrapper, exit-prop, key, mode, and nested-exit checks are all applied with concrete guidance; FAIL if a missing wrapper or exit prop goes unflagged, index keys are accepted for animated lists, or mode behavior is not explained.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `references/motion/animate-presence-patterns.md`.
2. Check wrapper, exit prop, stable key, mode, nested exits, and presence hook placement.
3. Produce concrete guidance or file:line findings when code is provided.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-PRESENCE-001 | AnimatePresence exit rules | Confirm the transition plan is reviewed against wrapper, exit-prop, key, mode, and nested-exit correctness rules | `Review this modal/list transition plan for AnimatePresence correctness before implementation.` | bash: rg -n "AnimatePresence" ../../references/motion/animate-presence-patterns.md -> bash: rg -n "register" ../../../shared/register.md -> agent: review the modal and list transition plan | Step 1: exit wrapper, key, and mode rules found; Step 2: register posture found; Step 3: review flags each correctness problem with a concrete fix | Terminal transcript, the reviewed plan, the findings list with `file:line` where code was supplied, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically an accepted index key or an unflagged missing wrapper | 1. Re-read `../../references/motion/animate-presence-patterns.md` for wrapper and key rules; 2. Re-run against a plan with a known index key and confirm it is rejected; 3. Confirm `wait` and `popLayout` guidance matches the supplied case |

### Pass Criteria

- Flags missing wrappers and exit props.
- Rejects index keys for animated lists.
- Explains `wait` duration and `popLayout` list use.
- Mentions `propagate` for nested coordinated exits when relevant.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../references/motion/animate-presence-patterns.md` | Exit wrapper, key, mode, and nested-exit correctness rules |
| `../../assets/motion/animate-presence-checklist.md` | Pass-or-fail exit checklist for the same surface |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Presence
- Playbook ID: MOTION-PRESENCE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `presence/animate-presence-exit-rules.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
