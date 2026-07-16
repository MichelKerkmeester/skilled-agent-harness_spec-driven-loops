# Iteration 001 - Correctness

## Focus
Fan-out concurrency correctness in `fanout-run.cjs` and `fanout-pool.cjs`.

## Findings
### P1
- **F001**: Fan-out CLI worker serializes lineages despite the concurrency cap - `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` - `runCappedPool` can admit multiple async workers, but the injected `async` worker executes `spawnSync` before it yields. Because `spawnSync` blocks the event loop, the first worker does not return a promise to the pool until its subprocess exits, so the `while (active < concurrency)` loop cannot actually start the next CLI lineage concurrently. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:311`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174`]

### P0
None.

### P2
None.

## Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "fanout-run serializes CLI lineage execution despite a configured concurrency cap",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:311",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344",
    ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174"
  ],
  "counterevidenceSought": "Checked fanout-pool admission logic and fanout-run tests for real subprocess overlap assertions.",
  "alternativeExplanation": "The pool primitive itself is concurrent for workers that yield; the defect is specifically the synchronous subprocess call inside the injected worker.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if fanout-run changes to non-blocking subprocess execution or tests prove overlapping subprocess start/end timestamps under concurrency > 1."
}
```

## Notes
The pool primitive's unit tests prove the injected worker shape can be concurrent when it yields. They do not prove the real `fanout-run.cjs` subprocess worker overlaps.

Review verdict: CONDITIONAL
