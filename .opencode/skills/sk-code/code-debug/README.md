---
title: code-debug
description: The sk-code root-cause debugging mode that reproduces failures, localizes the source cause, applies one-cause fixes, and escalates after repeated failed attempts.
trigger_phrases:
  - "debug"
  - "root cause"
  - "fix bug"
  - "test failure"
  - "build failure"
importance_tier: important
contextType: implementation
version: 1.0.0.1
---

# code-debug

> Turns a failing symptom into a verified fix path: reproduce it, capture evidence, trace to root cause, edit one cause at a time, then hand the result to `code-verify`.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Failing tests, build failures, runtime errors, console errors, regressions, and failed quality or verification gates |
| **Invoke with** | `debug`, `root cause`, `fix bug`, `failing`, `error`, `test failure`, `build failure` |
| **Works on** | WEBFLOW/browser failures and OPENCODE script, config, test, language, hook, or tool failures |
| **Produces** | A minimal root-cause fix in existing files plus reproduction and handoff evidence |

---

## 2. OVERVIEW

### Why This Mode Exists

Bug fixing fails when it starts with guesses. A failing assertion, console error, or broken UI is often downstream of an earlier state. Without a reproducible symptom and a named cause, edits become random retries and the system can get worse while appearing busy.

### What It Does

`code-debug` runs the Phase 2 loop: reproduce the symptom, capture exact evidence, trace backward to root cause, apply one-cause fixes in existing scoped files, and rerun the original reproduction step. It can use `Task` for bounded parallel investigation but treats every result as a hypothesis until confirmed locally. It does not write new files or claim completion.

---

## 3. QUICK START

**Step 1: Capture the symptom.** Record the command, exit code, stack trace, console output, viewport, or user interaction that demonstrates the failure.

**Step 2: Load the checklist.** Use [`assets/universal-debugging_checklist.md`](./assets/universal-debugging_checklist.md) for every non-trivial debugging session. For Webflow/browser failures, add [`assets/webflow-debugging_checklist.md`](../code-webflow/assets/webflow-debugging_checklist.md) and [`references/webflow-debugging/debugging_workflows.md`](../code-webflow/references/debugging/debugging_workflows.md).

**Step 3: Fix one cause.** State the evidence-tied root cause, edit only the scoped file, and rerun the original reproduction step.

**Step 4: Hand off.** Send changed code through `code-quality`, then `code-verify` for final evidence.

---

## 4. HOW IT WORKS

The mode treats debugging as a controlled experiment. One symptom is reproduced, one cause is hypothesized, one cause is changed, and the original symptom is checked again. If three fixes fail for the same symptom, automatic retries stop and the mode escalates with evidence and a recommended next action.

### Evidence First

Every debug session starts with exact evidence. For OPENCODE, that is usually a command and output. For WEBFLOW, it is usually browser, console, network, viewport, or interaction evidence.

### Escalation Discipline

Before another fix for the same symptom, the mode must state a one-sentence root cause tied to evidence. If it cannot, it escalates instead of guessing. Spec conflicts and contradictory validators also escalate as a single decision request.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Use it when a concrete failure exists and the cause is not yet proven. Skip it for planned implementation, quality-only checks, final verification, or findings-first review.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that routes debug workflows here |
| `code-implement` | Receives handback when the root cause is missing behavior or broader implementation |
| `code-quality` | Runs after a debug fix changes code |
| `code-verify` | Proves the fix with non-mutating evidence |
| `code-review` | Reviews likely defects without applying author-side fixes |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Reproduction | Rerun the original failing command, browser interaction, or test after each fix |
| Quality after fix | Hand changed files to `code-quality` for checklist and comment hygiene |
| Final evidence | Hand to `code-verify`; this mode does not make done or works claims |
| Escalation | After three failed fixes, report attempts, current evidence, and one recommended next action |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract for the debug mode |
| [`assets/universal-debugging_checklist.md`](./assets/universal-debugging_checklist.md) | Surface-agnostic debugging workflow |
| [`assets/webflow-debugging_checklist.md`](../code-webflow/assets/webflow-debugging_checklist.md) | Webflow/browser debugging checklist |
| [`references/webflow-debugging/debugging_workflows.md`](../code-webflow/references/debugging/debugging_workflows.md) | Browser and frontend debugging workflows |
| [`references/webflow-debugging/error_recovery.md`](../code-webflow/references/debugging/error_recovery.md) | Webflow/frontend recovery patterns |
| [`../shared/references/universal/error_recovery.md`](../shared/references/universal/error_recovery.md) | Shared error recovery discipline |
| [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) | Lifecycle transitions into and out of debugging |
