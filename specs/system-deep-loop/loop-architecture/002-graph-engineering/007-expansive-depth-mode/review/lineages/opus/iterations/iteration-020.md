# Iteration 020 - Recovery: primary evidence for the claude stream-json event shape

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: recovery (convergence for iteration 19 returned BLOCKED on dimensionCoverageGate, recorded by the script)
- Strategy: settle the one finding that rested on inference, OPUS-F001-P2-001, with a read of the installed CLI
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- /Users/michelkerkmeester/.local/share/claude/versions/2.1.329 (the installed claude CLI binary that ~/.local/bin/claude resolves to; read-only byte search)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:207-215 (the claude branch of readTimedToolEvents)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None new.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- The CLI bundle builds its SDK stream events with a top-level ISO `timestamp`. One constructor emits `parent_tool_use_id:null,session_id:r,uuid:L(),timestamp:new Date().toISOString()`. The message mapper's `case"assistant"` branch emits `parent_tool_use_id:null,uuid:r.uuid,timestamp:r.timestamp,error:r.error,...`, and the `user` branch emits `timestamp:e.timestamp` likewise. There are 59 `parent_tool_use_id` sites in the binary. These are the fields `readTimedToolEvents` reads: `parsed.timestamp` parsed as ISO, gated on a string `session_id` and type `assistant`/`user` (fanout-salvage.cjs:207-209).
- Resolution: OPUS-F001-P2-001 is resolved. Its premise, that no evidence shows the key the timer reads, is cleared by the installed CLI's own event builder. The finding was raised as inference with a stated confirm-or-clear test ("one captured real stream-json log would confirm or clear it"). The CLI source is equivalent primary evidence. The residual risk is a future CLI release that drops the key; the fixture at fanout-pass-evidence.vitest.ts:69 would not notice that, but it is a version-pinning concern, not an active defect.

## Edge Cases
- The search covered one installed version, 2.1.329. A lineage run under another claude version is not proven by this read.

## Confirmed-Clean Surfaces
- None new.

## Ruled Out
- Claude stream-json events lacking a top-level timestamp: the installed CLI emits it.

## Next Focus
- Dimension: security (recovery)
- Focus area: OPUS-F001-P2-003 (stamp omission): check whether the verifier or reducer rejects an iteration record without `timestamp`, which would downgrade it
- Reason: escalation review of remaining inference-adjacent findings
- Rotation status: recovery passes until maxIterations
- Required evidence: file:line

Review verdict: CONDITIONAL
