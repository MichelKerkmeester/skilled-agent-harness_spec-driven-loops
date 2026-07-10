---
title: Workflow Reference - Debugging
description: Shared debugging workflow doctrine for sk-code — root-cause diagnosis and scoped repair after a symptom, failing command, runtime error, quality failure, or verification failure, consumed by every surface packet.
trigger_phrases:
  - "sk-code debugging workflow"
  - "debug workflow doctrine"
  - "root-cause diagnosis"
  - "scoped repair workflow"
importance_tier: important
contextType: general
version: 1.0.0.1
---

# Workflow Reference - Debugging

Shared debugging workflow doctrine for `sk-code`. This reference covers root-cause diagnosis and scoped repair after a symptom, failing command, runtime error, quality failure, or verification failure appears. It is consumed by surface packets and defines no skill identity or surface-specific standards.

---

## 1. OVERVIEW

### Purpose

Debugging is the controlled experiment phase. It reproduces or tightly characterizes the symptom, captures exact evidence, traces the symptom backward to a source cause, applies one-cause fixes, and sends the result back through quality and verification.

### When to Use

- Diagnosing a failing test, build failure, runtime exception, console error, broken interaction, layout regression, command failure, or inconsistent runtime behavior.
- Recovering from failed implementation, failed quality, failed verification, or a concrete regression.
- Tracing a symptom backward before changing code.
- Applying a minimal bug fix to already-scoped files after the root cause is identified.
- Dispatching a bounded parallel investigation when the search space is broad but the symptom is concrete.
- Enforcing the three-strike escalation rule after repeated failed fixes for the same symptom.

### When Not to Use

- The work is planned implementation or refactoring without a failing symptom; use the implementation phase.
- The work is an author-side quality gate with no concrete failing behavior; use the quality phase.
- The work is final non-mutating evidence after a fix; use the verification phase.
- The user wants findings-first review output rather than author-side repair.
- The task is documentation-only prose with no failing behavior.

---

## 2. WORKFLOW

### Debug Loop

1. Resolve the active surface and lifecycle phase through shared references. If the surface is unknown, ask for runtime and verification commands before changing code.
2. Reproduce the symptom. If it cannot be reproduced, collect the exact command, logs, inputs, state, or interaction steps needed to narrow it.
3. Capture evidence verbatim: command, exit code, stack trace, console output, failing assertion, path, viewport, input, or observed behavior.
4. Localize the fault by tracing backward from symptom to immediate cause to source cause.
5. State the current hypothesis and the evidence that would confirm or refute it.
6. Change one cause at a time, keeping the fix as small as the evidence supports.
7. Rerun the original reproduction step after every fix.
8. If the fix changes code, return through quality before final verification.
9. Hand the fixed state to verification with the reproduction command, before/after result, and residual risk.

### Four-Phase Checklist Substance

Use the universal debugging checklist as the detailed walk-through, not as content to duplicate wholesale:

| Phase | Required Discipline |
| --- | --- |
| Root Cause Investigation | Reproduce reliably, capture exact output, identify the failing layer, note last-known-good state, and inspect what changed. |
| Pattern Analysis | Search exact error strings, separate symptom from cause, trace backward, and compare against similar past issues. |
| Hypothesis Testing | State one hypothesis, predict confirming/refuting evidence, test one variable, and document the observed result. |
| Fix | Fix at source, add or preserve regression coverage when appropriate, and rerun the original reproduction step. |

### One-Cause Fix Rule

Debugging is a controlled experiment. A single edit may touch several lines, but it must address one named cause. Do not bundle unrelated cleanup, speculative hardening, or convenience refactors into a debug fix. If two independent causes are confirmed, fix and verify them sequentially.

### Bounded Investigation

Use a parallel investigation only for bounded diagnosis, not unsupervised rewriting. The subtask must include the exact symptom, evidence already captured, files or directories to inspect, forbidden edits, and expected return shape. Treat the result as a hypothesis until confirmed against local reproduction.

---

## 3. DISCIPLINE

### Always

- Always reproduce or tightly characterize the symptom before editing.
- Always capture exact evidence instead of paraphrasing failures.
- Always trace symptom to source cause before applying a fix.
- Always state a one-sentence evidence-tied root cause before a second fix attempt for the same symptom.
- Always change one cause at a time.
- Always rerun the original reproduction step after every fix.
- Always send code changes through quality before final verification.
- Always treat parallel investigation output as a hypothesis until local evidence confirms it.

### Never

- Never create new files as part of debugging.
- Never scaffold new planned behavior; switch to implementation when requested behavior does not exist.
- Never apply multiple speculative fixes at once.
- Never treat symptom disappearance as proof without rerunning the original reproduction step.
- Never silently work around a spec or requirement conflict.
- Never continue automatic retries after three failed fixes for the same symptom.
- Never claim done, works, fixed, passing, or complete from debugging alone.

### Escalate If

- The symptom cannot be reproduced and available evidence is insufficient to localize it.
- Surface detection is ambiguous or the active runtime is unsupported.
- Three fixes fail for the same symptom.
- Implementation evidence contradicts an approved spec or user requirement.
- Independent validators or reviewers contradict each other on a blocking result.
- Security-sensitive validation, filesystem behavior, or production data handling is unclear.

---

## 4. HANDOFF BOUNDARIES

- Implementation receives the task when the root cause shows requested behavior was never implemented or new files are required.
- Quality receives the changed code after a debug fix.
- Verification receives the original reproduction step, before/after observations, commands, and residual risks.
- Review owns non-mutating critique when the user wants diagnosis without repair.

A debug handoff is ready when the original symptom is reproduced or characterized, the root cause is tied to evidence, one cause was fixed at a time, and the original reproduction step now passes or escalation explains why it cannot.
