# Iteration 004 - Frontier node F-2-006: correctness

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-2-006 (depth 2, child of F-1-001, admitted at iteration 1), dimension correctness
- Sources read before work: lineage steer.md (absent), frontier block for F-2-006, convergence decision for iteration 3 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:186-215 (readTimedToolEvents), readLineagePassSummary body
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1070-1109 (rotateLineageLog, redaction patterns), 4926-4935 (log save)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **One attempt whose log holds no timed event turns every pass of the lineage to unknown, including the passes of a later timed attempt** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:273 -- `readLineagePassSummary` marks the lineage `untimed` when any non-empty log returns null from `readTimedToolEvents`, then judges the joined logs as `''` (readLineagePassSummary, the `untimed` and `passEvidence(untimed ? '' : ...)` lines). The comment names the case it was written for: a plain-text log from before the stream-json switch. `readTimedToolEvents` also returns null for any stream-json or opencode log with no timed tool event (fanout-salvage.cjs:186-215). An attempt that dies before its first assistant turn produces exactly such a log, for example one that prints only the init event and a quota or auth error. Such attempts are the ones the pool retries. After that retry, the successful attempt's passes all report `unexamined:null` and `flaggedPasses` stays null for the rest of the run, although their own log is fully timed. The rule could judge per attempt, since each attempt's commits fall in its own time span.
   Finding class: instance-only
   Scope proof: readLineagePassSummary is the only caller that joins attempt logs (fanout-salvage.cjs), and rotateLineageLog keeps every prior attempt's log beside the current one (fanout-run.cjs:1070-1077)
   Affected surface hints: fanout-salvage.cjs readLineagePassSummary untimed rule; fanout-run.cjs rotateLineageLog
   Case: attempt 1 of a claude lineage exits on a quota error after printing only its init line, attempt 2 runs ten timed passes, and the progress row shows flagged passes unknown for all ten.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- Redaction of rotated logs keeps JSON lines valid: field values are replaced by a quoted `"<redacted>"`, and the URL pattern stops at a quote or backslash (fanout-run.cjs:1097-1108). A redacted `session_id` is still a string, so the claude branch's `typeof parsed.session_id` check still passes (fanout-salvage.cjs:207).

## Edge Cases
- Tool calls an attempt made after its last commit, before it died, fall into the window of the next attempt's first commit and are counted for that pass. A pass is the calls between two commits, so this is accepted.
- Log order on disk does not matter, because events are filtered by time per commit window.

## Confirmed-Clean Surfaces
- Live and on-disk logs do not double count: the running attempt's stdout reaches disk only at exit, and the prior `fanout-lineage.out` is rotated before the new one is written (fanout-run.cjs:4931-4933).

## Ruled Out
- Redaction corrupting JSON lines so tool calls go missing: replacements stay inside string values.

## Next Focus
- Dimension: security
- Focus area: F-1-001 security, the reducer's active node
- Reason: frontier round-robin
- Rotation status: F-2-006 correctness done
- Required evidence: file:line

Review verdict: PASS
