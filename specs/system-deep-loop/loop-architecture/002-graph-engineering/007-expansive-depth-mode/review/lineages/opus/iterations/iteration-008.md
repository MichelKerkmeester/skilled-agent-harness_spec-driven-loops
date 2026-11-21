# Iteration 008 - Frontier node F-2-006: security

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-2-006 (depth 2), dimension security (availability of the lineage under its own log volume)
- Sources read before work: lineage steer.md (absent), frontier block for F-2-006 security, convergence decision for iteration 7 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2335, 2680-2695 (stdout cap), 2920-2926 (claude stream-json flags), 4765, 4786-4798 (dispatch options, live stdout)
- .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs readClaudeStreamFinalText doc comment

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The 20 MB stdout cap that kills a lineage now counts the full claude transcript, tool results included** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2686 -- Every lineage dispatch passes `maxBuffer: 20 * 1024 * 1024` (fanout-run.cjs:4791). Once stdout passes that size, the dispatcher sends SIGTERM to the lineage process (:2686-2689). Claude lineages now run with `--output-format stream-json --verbose` (:2922-2925). That stream carries every tool result, and the code says so: "Tool results in that log carry whole file bodies" (cli-guards.cjs readClaudeStreamFinalText). Under text output the cap bounded only the final answer. It now bounds every file the lineage read, so a long expansive review that reads large files, up to 24 iterations over files like the 5,348-line fanout-run.cjs, can be killed mid-iteration by its own reads. In the same handler `liveStdout` keeps growing after the cap trips, because `onOutput` runs before the `truncated` check (:2682-2683, 4795), so the progress copy is unbounded.
   Finding class: cross-consumer
   Scope proof: the cap is set once in the dispatch options (fanout-run.cjs:4791) and enforced in one data handler (:2681-2691); stream-json applies to every cli-claude-code lineage (:2922)
   Affected surface hints: fanout-run.cjs dispatch maxBuffer; fanout-run.cjs stdout data handler; cli-claude-code argv builder
   Case: a claude-opus review lineage at iteration 15 has streamed 20 MB of Read and Bash results, gets SIGTERM from its own runner, and is retried or failed as a timeout-like exit. The real transcript sizes are inferred; one measured long stream-json run would settle the margin.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- Every heartbeat re-parses the whole live stdout and every ledger frame (readLineageProgressFields via readLineagePassSummary, fanout-run.cjs:2398-2400). The cost grows linearly per beat and is bounded by the cap above, so it is not raised separately.

## Edge Cases
- `normalizeProgressHeartbeatMs` returns 0 for an unset cadence (fanout-run.cjs:2331-2335). With no heartbeat, no progress rows are taken and the live re-parse never runs.

## Confirmed-Clean Surfaces
- Log lines are parsed one at a time inside try/catch, so a malformed or hostile line is skipped without throwing (fanout-salvage.cjs readTimedToolEvents).

## Ruled Out
- A crafted log line crashing the pass judge: each parse is guarded.

## Next Focus
- Dimension: traceability
- Focus area: F-1-001 traceability (spec_code and checklist_evidence against the packet and the feature catalog)
- Reason: all four nodes have correctness and security; traceability is next
- Rotation status: security pass complete across nodes
- Required evidence: file:line on both the doc and the code side

Review verdict: PASS
