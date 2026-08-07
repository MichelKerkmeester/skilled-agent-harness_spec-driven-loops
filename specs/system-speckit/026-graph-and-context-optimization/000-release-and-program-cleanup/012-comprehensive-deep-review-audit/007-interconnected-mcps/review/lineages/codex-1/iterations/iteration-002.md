# Iteration 002 - Correctness

## Scope
Focused pass over fan-out pool and CLI worker implementation.

## Findings

### P1

- **F002**: `spawnSync` in the fan-out worker serializes CLI lineages - `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` - The pool admits multiple async workers while `active < concurrency` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174], but the worker body performs the actual CLI run with `spawnSync` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344]. Because `spawnSync` blocks the Node event loop until the child exits, the pool cannot schedule the second worker concurrently during a real long-running CLI lineage. The integration test provides `concurrency: 2` [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:92], but only asserts directories, ledger, and summary, not overlapping execution.

## Claim Adjudication

```json
{
  "findingId": "F002",
  "claim": "The fan-out CLI runner serializes real CLI lineages even when fanout.concurrency is greater than one.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344",
    ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:92"
  ],
  "counterevidenceSought": "Checked fanout-pool for async admission and fanout-run for asynchronous subprocess execution; the runner uses spawnSync, not spawn or runAuditedExecutorCommandAsync.",
  "alternativeExplanation": "The pool primitive itself is correct and unit-tested; the defect is specifically in the injected worker used by fanout-run.cjs.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if fanout-run is intentionally documented as a serial runner and concurrency is only a queue-width setting, but current docs call it a concurrency-capped fan-out path.",
  "transitions": []
}
```

## Verdict Rationale
This iteration found an active P1. The issue does not corrupt review content by itself, but it breaks the advertised fan-out behavior and makes concurrency settings misleading.

Review verdict: CONDITIONAL
