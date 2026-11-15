---
title: "VIB-GRD-001 -- Repo-guards spec-gate suite"
description: "This scenario validates that the Vibe repo-guards spec-gate suite passes: an interactive write is denied until the spec-folder question is answered, and a child dispatch is never denied."
version: 1.0.0.0
---

# VIB-GRD-001 -- Repo-guards spec-gate suite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-GRD-001`.

---

## 1. OVERVIEW

This scenario validates the spec-gate guard through the suite that exercises it. It focuses on the one guard that decides whether a write may proceed, and on the child-dispatch exemption that keeps a headless run from being blocked.

### Why This Matters

The spec gate is the guard that can stop a write, and its exemption is what keeps a dispatched child from waiting on a question nobody can answer. A regression in either direction is expensive: a gate that never denies lets an unscoped write through, and a gate that denies a child stalls every dispatch. The suite pins both behaviors in one run. A dispatched child loads the gate through the rendered home hooks, so the exemption is what lets its writes through; the documented dispatch shape sets `AI_SESSION_CHILD=1` for that reason.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the spec gate denies an interactive write until the question is answered and never denies a child dispatch.
- Real user request: `Run the repo-guards spec-gate suite and tell me whether an interactive write is still denied until the spec-folder question is answered, and whether a child dispatch is exempt.`
- Prompt: `Run the Vibe repo-guards spec-gate suite and report the pass and fail counts. Name the interactive case and the two child-exemption cases, and stop if any of them fails.`
- Expected execution process: Run the suite from the repository root -> read the three test lines -> read the summary counts -> read the exit code.
- Expected signals: The run exits `0`. The summary prints `tests 3`, `pass 3`, `fail 0`. The three cases are `an interactive session is denied a write until the spec-folder question is answered`, `a headless dispatch that inherits AI_SESSION_CHILD=1 is never denied` and `a session whose payload names a parent is never denied`.
- Evidence: The command transcript with the three test lines, the summary counts and the exit code.
- Desired user-visible outcome: A clear statement that the gate still denies an unanswered interactive write and still exempts a child dispatch.
- Pass/fail: PASS if the suite exits `0` with `pass 3` and `fail 0`. FAIL if any case fails, if a case is missing, or if the suite exits non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the suite from the repository root.
2. Read the three test lines before the summary.
3. Read the summary counts and the exit code.
4. Treat a missing case as a failure even when the suite exits `0`.

### Commands

```bash
node --test .vibe/plugins/repo-guards/tests/spec-gate.test.mjs
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Observed: the command exited `0` with `tests 3`, `pass 3`, `fail 0`, `cancelled 0`, `skipped 0` and `todo 0`.
- Observed: the three cases printed as `an interactive session is denied a write until the spec-folder question is answered`, `a headless dispatch that inherits AI_SESSION_CHILD=1 is never denied` and `a session whose payload names a parent is never denied`, all passing.
- Note: the bundle is a hook bundle declared in `.vibe/hooks.toml`, not a plugin package. A run's export can warn that no supported plugin manifest was found for the folder, which is expected for a hook bundle and does not change the guard result.
- Note: this suite covers the spec gate only. The other guards in the bundle have their own fixtures and are outside this scenario.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-GRD-001 | Repo-guards spec-gate suite | Prove the gate denies an unanswered write and exempts a child | `Run the Vibe repo-guards spec-gate suite and report the pass and fail counts. Name the interactive case and the two child-exemption cases, and stop if any of them fails.` | 1. `node --test .vibe/plugins/repo-guards/tests/spec-gate.test.mjs` -> 2. read the three test lines -> 3. read the summary counts and the exit code | Step 1: exit `0`, `tests 3`, `pass 3`, `fail 0`. Step 2: the interactive case and the two child-exemption cases pass | The command transcript with the three test lines, the summary counts and the exit code | PASS if the suite exits `0` with `pass 3` and `fail 0`. FAIL if a case fails or is missing | 1. Read the failing case name. 2. Confirm the classifier still reads `AI_SESSION_CHILD` and the parent id. 3. Confirm the hook declaration in `hooks.toml` still points at the bundle script |

### Failure Triage

1. Read the failing case name; each one names the input shape it exercises.
2. If the interactive case fails, confirm the classifier still denies a write while the gate is open.
3. If a child case fails, confirm the classifier still reads `AI_SESSION_CHILD=1` and the payload's parent id.
4. If all cases pass but a live run is still blocked, confirm `.vibe/hooks.toml` declares the guard and the run's folder is trusted.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the guard boundary |
| [SKILL.md](../../SKILL.md) | The hook bundle and the child-dispatch contract |
| [guards-and-hooks.md](../../references/guards-and-hooks.md) | The seven hook types, the spec-gate classification and the child exemption |
| [runtime-folder-and-sync.md](../../references/runtime-folder-and-sync.md) | The trust gate that decides whether a project hook loads |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/plugins/repo-guards/tests/spec-gate.test.mjs` | The suite this scenario runs |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | The guard under test |
| `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | The classifier the guard calls |
| `.vibe/hooks.toml` | The hook declaration that loads the bundle |

---

## 5. SOURCE METADATA

- Group: Guard Suites
- Playbook ID: VIB-GRD-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guards/spec-gate-suite.md`
