---
title: Deep Review State Transitions and Quality Gates
description: State-transition rules, error handling, and review quality gates for the deep review loop.
trigger_phrases:
  - "review state transitions"
  - "review quality gates"
  - "tiered error recovery"
  - "review iteration status enum"
importance_tier: normal
contextType: implementation
version: 1.11.0.3
---

# Deep Review State Transitions and Quality Gates

This reference defines how a review run moves between states and what must hold before it can stop: the state-transition rules, error handling, and the binary review quality gates.

---

## 1. OVERVIEW

### Purpose

This reference defines the state machine that controls a deep-review run and the gates that must pass before the loop can stop. It pairs transition rules with error recovery and binary quality gates so operators can distinguish safe STOP decisions from forced continuation.

### When to Use

- Checking how a review run moves from initialization through iteration, synthesis, save, and completion.
- Debugging pause, stuck-recovery, timeout, malformed state, or repeated failure behavior.
- Verifying quality-gate requirements before accepting a convergence STOP decision.
- Updating workflow logic that emits guard violations or recovery actions.

### Key Principle

STOP is only final after convergence and quality gates agree.

| Gate | Requirement |
|------|-------------|
| Evidence | Active findings cite concrete `file:line` evidence and avoid inference-only claims. |
| Scope | Findings stay inside the declared review target and configured boundaries. |
| Coverage | Required dimensions and traceability protocols are complete before STOP. |

---

## 2. STATE TRANSITIONS

```
[INITIALIZED] --> config + strategy + state created, scope discovered
    |
[ITERATING] --> @deep-review agent dispatched, executing review cycle
    |
[EVALUATING] --> iteration complete, checking convergence
    |
    |-- newFindingsRatio >= threshold --> [ITERATING]
    |-- stuck_count >= 2 --> [STUCK_RECOVERY]
    |-- converged + gates pass --> [SYNTHESIZING]
    |-- max_iterations reached --> [SYNTHESIZING]
    |
[STUCK_RECOVERY] --> change granularity / protocol replay / escalate severity
    |
    |-- recovered (new P0/P1 or coverage advance) --> [ITERATING]
    |-- still stuck + dimensions covered --> [SYNTHESIZING] (gaps documented)
    |-- still stuck + dimensions remaining --> [ITERATING] (next dimension)
    |
[PAUSED] --> sentinel detected, loop suspended
    |
    |-- sentinel removed --> [ITERATING] (resume)
    |
[SYNTHESIZING] --> finding dedup, severity reconcile, replay validate, compile report
    |
[SAVING] --> memory context preservation via generate-context.js
    |
[COMPLETE] --> all artifacts created, loop finished
```

### Iteration Status Enum

`complete | timeout | error | stuck | insight`

- `complete`: Normal iteration with findings processed
- `timeout`: Iteration exceeded budget limits
- `error`: Iteration failed with unrecoverable error
- `stuck`: Iteration produced no meaningful new findings
- `insight`: Low `newFindingsRatio` but important finding that changes the verdict trajectory

---

## 3. ERROR HANDLING

| Error | Phase | Action |
|-------|-------|--------|
| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
| State file missing | Init/Loop | Apply state recovery cascade (Section 6) |
| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
| Agent dispatch failure (API overload, timeout) | Loop | Escalate through recovery tiers in order |
| Memory save fails | Save | Preserve the current `review/` packet as backup, then log the error |
| Iteration file not written | Loop | Mark iteration as failed, log error, continue to next |

### Tiered Error Recovery

Five escalating tiers, attempted in order:

| Tier | Trigger | Action | Max Attempts |
|------|---------|--------|-------------|
| 1 | Tool/source failure | Retry with alternative source or broader pattern | 2 per source |
| 2 | Focus exhaustion (2+ low-value iterations on same focus) | Pivot to different dimension or file set | 2 pivots |
| 3 | State corruption | Reconstruct JSONL from iteration files | 1 attempt |
| 4 | Agent dispatch failure | Direct mode fallback (reference-only unless runtime supports it) | 1 attempt |
| 5 | Repeated systemic failure | Escalate to user with diagnostic summary | 1 attempt |

---

## 4. REVIEW QUALITY GATES

Evidence, Scope, and Coverage are the contract-level binary gates defined in `review-mode-contract.yaml` under `qualityGates`, evaluated after the composite convergence score exceeds the `compositeStopScore` threshold. They are necessary but not sufficient on their own: the review-specific legal-stop decision expands them into a **9-gate bundle** (`convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, `graphlessFallbackGate`) emitted by `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`. STOP is legal only when the full 9-gate bundle passes together. The authoritative gate model, event shape, and evaluation pseudocode live in `references/convergence/convergence.md` §6 "Legal-Stop Gate Bundle"; the 3-gate table and pseudocode below illustrate the contract-level layer only, not the complete STOP-legality check.

### Gate Definitions

| Gate | Rule | Fail Action |
|------|------|-------------|
| **Evidence** | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, continue loop (persisted via the `blocked_stop` event below) |
| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, continue loop (persisted via the `blocked_stop` event below) |
| **Coverage** | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, continue loop (persisted via the `blocked_stop` event below) |

### Gate Evaluation Pseudocode

```
function checkReviewQualityGates(state, config, coverage):
  violations = []

  // Evidence gate
  for f in state.findings where f.status == "active":
    if not f.hasFileLineCitation or f.evidenceType == "inference-only":
      violations.push({ gate: "evidence", findingId: f.id,
                        detail: "Active finding lacks evidence or is inference-only" })

  // Scope gate
  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
  for f in state.findings where f.status == "active":
    if f.filePath not in reviewScope:
      violations.push({ gate: "scope", findingId: f.id,
                        detail: "Finding outside declared review scope" })

  // Coverage gate
  if coverage.dimensionCoverage < 1.0:
    violations.push({ gate: "coverage",
                      detail: "Not all configured review dimensions are covered" })
  if not coverage.requiredProtocolsCovered:
    violations.push({ gate: "coverage",
                      detail: "Required traceability protocols are incomplete" })

  if len(violations) > 0:
    return { passed: false, violations }
  return { passed: true }
```

The contract-level check above is illustrative; it is the review-specific 9-gate bundle that actually gates STOP. When that bundle fails, the workflow does not silently override STOP to CONTINUE -- it persists a first-class `blocked_stop` event with the failing gate names and the full `gateResults` bundle:

```json
{"type":"event","event":"blocked_stop","mode":"review","run":N,"blockedBy":["<gate-name>", "..."],"gateResults":{"...":"..."},"recoveryStrategy":"<reason>","timestamp":"<ISO-8601>","sessionId":"<session-id>","generation":N}
```

Full event shape and the complete 9-gate `gateResults` schema: `references/state/state-jsonl.md` "Blocked-Stop Event" and `references/convergence/convergence.md` §6.

---
