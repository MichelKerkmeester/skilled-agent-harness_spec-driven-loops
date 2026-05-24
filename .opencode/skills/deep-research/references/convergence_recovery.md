---
title: Convergence Recovery Reference
description: Stuck recovery, tiered error recovery, and escalation behavior for deep-research loops.
---

# Convergence Recovery Reference

This reference covers what happens after convergence detects no progress, workflow errors, or unrecoverable state problems. The stop contract lives in `convergence.md`.

---

## 1. OVERVIEW

### Purpose

Define recovery behavior for stuck loops, transient failures, state inconsistencies, and unrecoverable deep-research errors.

### When to Use

Load this reference when `stuckCount` reaches the configured threshold, when recovery events appear in JSONL, or when an operator needs the escalation ladder.

### Core Principle

Recovery must be visible in packet state. The workflow records pivots and failures instead of silently changing direction.

---

## 2. STUCK RECOVERY TRIGGER

Stuck recovery starts when `stuckCount >= config.stuckThreshold`. `stuckCount` excludes `thought` iterations and stops counting when an `insight` iteration appears.

The workflow emits or records recovery state rather than silently changing focus. Recovery attempts should be visible in the JSONL event stream, strategy file, registry, and dashboard.

---

## 3. RECOVERY PROCESS

| Step | Action | Output |
|------|--------|--------|
| 1 | Analyze why progress stalled | failure mode |
| 2 | Widen or pivot focus | next focus |
| 3 | Select recovery strategy | recovery prompt/context |
| 4 | Evaluate recovery iteration | reset stuck count or escalate |
| 5 | Document result | JSONL event + strategy update |

Failure mode classification:

| Failure Mode | Signal | Typical Response |
|--------------|--------|------------------|
| Search exhausted | Repeated sources and repeated findings | Try alternate source classes or related domains |
| Too narrow | Same focus repeats with low novelty | Widen to parent question |
| Too broad | Findings are shallow or disconnected | Narrow to one unresolved key question |
| Contradictory evidence | Contradiction density is high | Resolve contradiction before STOP |
| State drift | Strategy/registry/JSONL disagree | Reconstruct state before continuing |

---

## 4. RECOVERY STRATEGIES

### Try Opposites

Use when prior searches shared assumptions. Ask the next iteration to investigate contrary evidence, failure cases, or rejected approaches.

### Combine Prior Findings

Use when high-value findings exist but do not answer the remaining question. Ask the next iteration to synthesize the two highest-novelty findings into a more specific question.

### Audit Low-Value Iterations

Use when iterations repeat. Ask the next iteration to inspect the last low-value passes, list repeated assumptions, and choose a distinct path.

### Selection Logic

```text
if repeated same focus:
  use Try Opposites
elif high-novelty findings are disconnected:
  use Combine Prior Findings
elif repeated low-value passes:
  use Audit Low-Value Iterations
else:
  widen focus one level and continue
```

---

## 5. RECOVERY EVALUATION

Recovery succeeds when the next evidence iteration does at least one of:

- finds material new evidence;
- answers or narrows a key question;
- resolves a contradiction;
- eliminates a plausible approach with evidence;
- produces an `insight` that changes the strategy.

Recovery fails when it repeats prior sources/findings, produces no new evidence, and does not narrow the search space. After repeated recovery failure, the loop may stop with open gaps or escalate to the user, depending on the configured workflow mode.

---

## 6. TIERED ERROR RECOVERY

| Tier | Use When | Action |
|------|----------|--------|
| 1. Retry Source | A source fetch or file read fails once | Retry or use an equivalent source |
| 2. Focus Pivot | The route is stale or unproductive | Choose a nearby unresolved focus |
| 3. State Reconstruction | JSONL or derived state is inconsistent | Rebuild from iteration markdown and valid JSONL records |
| 4. Direct Mode Fallback | Executor or dispatch path fails repeatedly | Use the workflow-supported fallback path |
| 5. User Escalation | State cannot be reconstructed or all automatic paths fail | Halt with the blocker and recovery options |

State reconstruction details live in `state_reducer_registry.md`.

---

## 7. ESCALATION CONDITIONS

Escalate instead of continuing automatically when:

- three or more consecutive timeouts suggest infrastructure failure;
- JSONL corruption cannot be reconstructed from iteration files;
- all approaches are exhausted but required questions remain open;
- findings expose credentials, proprietary data, or another security concern;
- all recovery tiers have been tried and failed.

The escalation should include the current packet path, latest iteration, failed gate or recovery tier, and the next safe manual action.
