# Iteration 005 - Frontier node F-1-001: security

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-001 (depth 1), dimension security
- Sources read before work: lineage steer.md (absent), frontier block for F-1-001 security, convergence decision for iteration 4 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:100-111, readClaudeStreamFinalText
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:884-895, 1624-1631, 1904-1909, 4760-4778
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:98-108
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:290-295
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:342-348

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **A lineage that leaves `timestamp` off its iteration records escapes every stamp check the fan-out runs on it** -- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:101 -- The projection adds `claimedTimestamp` only when the model's record carries a string `timestamp` (deep-review-state-contract.ts:294). The window check then falls back to the projected `timestamp`, which is the gateway clock (lineage-timestamp-window.ts:101-103), and the completion check does the same (:313). The pass judge falls back to the event's `occurred_at` (fanout-salvage.cjs:346-348). Neither the review ledger schema nor the projection requires a stamp on an iteration record (no `timestamp` rule in deep-review-ledger-schema.ts). Lineage output is the untrusted side of this boundary. A worker that fabricates records therefore passes the `before_window`, `after_window`, `stamped_after_completion` and `future_stamp` checks by omitting the one field they judge. Only the commit-gap rule still sees batching. The workflow requires the field (the prompt pack's iteration schema lists `timestamp`), so a missing stamp could be reported as its own anomaly instead of being judged on the gateway's time.
   Finding class: cross-consumer
   Scope proof: the three stamp consumers are lineage-timestamp-window.ts:101 and :313 and fanout-salvage.cjs:346; claimedTimestamp has one producer at deep-review-state-contract.ts:294 for review
   Affected surface hints: lineage-timestamp-window.ts checkLineageTimestampWindow and checkLineageCompletion; fanout-salvage.cjs readLineageCommits; deep-review-state-contract.ts iteration projection
   Case: a review lineage hands the gateway iteration records with no timestamp key, written in a batch after the fact but spaced more than 15 s apart, and the run reports no timestamp anomaly and no flagged pass.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- `readClaudeStreamFinalText` reads only top-level stream events with a string `session_id`, and it skips assistant blocks that carry a `parent_tool_use_id`. Text quoted inside a tool result is nested in a JSON string and never stands as its own line, so file content cannot raise a pending-question or quota decision (cli-guards.cjs readClaudeStreamFinalText).

## Edge Cases
- `writeLineageValues` reads the model-written config, which a lineage could replace with a symlink. `atomicWriteJson` renames a temp file over the path (fanout-run.cjs:1904-1909), which replaces the link itself rather than writing through it. That is safe.
- Spreading a parsed config that holds an own `__proto__` key defines an own property and does not pollute a prototype (fanout-run.cjs:890).
- Lineage label validation predates the range, so it was not examined.

## Confirmed-Clean Surfaces
- `fanoutRunnerPidOf` runs `ps` through spawnSync with an argv array and a numeric pid (fanout-run.cjs:1008-1015), so there is no shell injection.

## Ruled Out
- Symlink write-through on the config rewrite: rename replaces the link.

## Next Focus
- Dimension: security
- Focus area: F-1-003 security (stop signalling of pids read from the ledger)
- Reason: frontier round-robin
- Rotation status: F-1-001 correctness and security done
- Required evidence: file:line

Review verdict: PASS
