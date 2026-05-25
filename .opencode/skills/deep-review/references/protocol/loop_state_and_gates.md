---
title: Deep Review State Transitions and Quality Gates
description: State-transition rules, error handling, and review quality gates for the deep review loop.
---

# Deep Review State Transitions and Quality Gates

This reference defines how a review run moves between states and what must hold before it can stop: the state-transition rules, error handling, and the binary review quality gates.

---

## 1. STATE TRANSITIONS

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

## 2. ERROR HANDLING

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

## 3. REVIEW QUALITY GATES

Three binary gates must pass before a STOP decision is finalized. These gates are defined in `review_mode_contract.yaml` under `qualityGates` and are evaluated after the composite convergence score exceeds the `compositeStopScore` threshold.

### Gate Definitions

| Gate | Rule | Fail Action |
|------|------|-------------|
| **Evidence** | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, log `guard_violation`, continue loop |
| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation`, continue loop |
| **Coverage** | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, log `guard_violation`, continue loop |

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

When any gate fails, the STOP is overridden to CONTINUE and each violation is logged:

```json
{"type":"event","event":"guard_violation","gate":"<name>","iteration":N,"detail":"<reason>"}
```

---

