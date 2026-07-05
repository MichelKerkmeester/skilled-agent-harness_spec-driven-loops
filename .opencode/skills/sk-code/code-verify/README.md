---
title: code-verify
description: The non-mutating sk-code verification mode that runs surface-appropriate commands, reports baseline deltas, and gates completion claims with fresh evidence.
trigger_phrases:
  - "verify"
  - "verification"
  - "Iron Law"
  - "baseline delta"
  - "claim falsifier"
importance_tier: important
contextType: implementation
version: 1.0.0.1
---

# code-verify

> Runs last and edits nothing: fresh commands, browser or runtime evidence, baseline delta, blind spots, and only the claims the evidence actually proves.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Final verification, Iron Law evidence, baseline deltas, mutation checks, claim falsifiers, and done-claim gates |
| **Invoke with** | `verify`, `done`, `works`, `complete`, `fixed`, `passing`, `Iron Law`, `baseline delta` |
| **Works on** | WEBFLOW/browser verification and OPENCODE alignment, tests, stack-folder, script, config, and language verification |
| **Produces** | Non-mutating evidence report with commands, exit codes, current result, delta, blind spots, and handback if anything fails |

---

## 2. OVERVIEW

### Why This Mode Exists

Completion claims are only as good as the evidence behind them. A code read can miss runtime behavior. A unit test can miss wiring. A green command can hide a regression that was already present. `code-verify` exists to make the claim boundary explicit and evidence-based.

### What It Does

`code-verify` consumes shared surface detection, loads the universal pre-claim checklist, runs the surface-appropriate commands, records fresh output, compares against the baseline, names blind spots, and applies mutation or claim-falsifier checks when tests are new or changed. It never edits files. Any defect is handed back to `code-debug`, `code-quality`, or `code-implement`.

---

## 3. QUICK START

**Step 1: Load the pre-claim gate.** Start with [`assets/universal-verification_checklist.md`](./assets/universal-verification_checklist.md).

**Step 2: Select the surface command set.** Use Webflow verification assets for browser/frontend work. Use [`assets/scripts/verify_alignment_drift.py`](./assets/scripts/verify_alignment_drift.py) plus targeted tests for OpenCode work.

**Step 3: Run fresh evidence.** Capture command names, exit codes, test counts, browser observations, current result, and any failures.

**Step 4: Report the delta.** Compare against the baseline captured before implementation. If no baseline exists, make only narrow claims tied to fresh evidence.

---

## 4. HOW IT WORKS

The mode runs after implementation, quality, and debugging. It reads the handoff, runs the current command set, climbs the verification ladder, names blind spots, and gates final claims. It is deliberately non-mutating: a failed verifier is not fixed here.

### Iron Law Evidence

No done, works, complete, fixed, passing, or ready claim is allowed without fresh surface-appropriate evidence. For Webflow, that includes script and browser evidence when runtime behavior changed. For OpenCode, that includes alignment drift evidence and targeted tests where applicable.

### Baseline Delta

Verification reports baseline, current result, delta, and claim scope. No baseline means no broad no-regressions claim.

### Handback

Failures go to the owning sibling: root-cause failures to `code-debug`, missing behavior to `code-implement`, and author-side quality failures to `code-quality`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Use it for final evidence and completion-claim gating. Skip it when the task requires editing, creating files, debugging a failure, or producing a findings-first review.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that routes verification workflows here |
| `code-implement` | Receives handback when behavior or build work is missing |
| `code-quality` | Runs before verification and receives quality handbacks |
| `code-debug` | Repairs failing commands, tests, or browser checks |
| `code-review` | Reviews code when the user wants findings instead of final evidence |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Universal pre-claim gate | Load and walk [`assets/universal-verification_checklist.md`](./assets/universal-verification_checklist.md) |
| OpenCode alignment drift | `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py --root <changed-scope>` |
| Stack-folder integrity | `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py` when surface-router integrity is in scope |
| Webflow verification | Use [`assets/webflow-verification_checklist.md`](../webflow/assets/webflow-verification_checklist.md) and [`references/webflow-verification/verification_workflows.md`](../webflow/references/verification/verification_workflows.md) |
| Verifier tests | `python3 .opencode/skills/sk-code/code-verify/assets/scripts/test_verify_alignment_drift.py` when the alignment verifier changes |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract for the non-mutating verify mode |
| [`assets/universal-verification_checklist.md`](./assets/universal-verification_checklist.md) | Required pre-claim gate |
| [`assets/webflow-verification_checklist.md`](../webflow/assets/webflow-verification_checklist.md) | Webflow/browser verification checklist |
| [`assets/performance_loading_checklist.md`](./assets/performance_loading_checklist.md) | Performance loading checklist |
| [`assets/scripts/verify_alignment_drift.py`](./assets/scripts/verify_alignment_drift.py) | OpenCode alignment drift verifier |
| [`assets/scripts/verify_stack_folders.py`](./assets/scripts/verify_stack_folders.py) | Stack-folder integrity verifier |
| [`references/webflow-verification/verification_workflows.md`](../webflow/references/verification/verification_workflows.md) | Webflow/browser verification workflows |
| [`references/webflow-verification/performance_checklist.md`](../webflow/references/verification/performance_checklist.md) | Webflow performance verification details |
| [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) | Lifecycle transitions into verification |
