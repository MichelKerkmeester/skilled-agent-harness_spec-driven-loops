# Iteration 1 — correctness

## Dimension

Correctness: common Claude usage-tail parsing and threshold-to-nudge delivery.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/context-usage.cjs:18, 38-114
- .skilled/hooks/session-relaunch/claude/context-nudge.mjs:69-107
- .skilled/hooks/session-relaunch/lib/nudge.cjs:394-457
- .skilled/hooks/session-relaunch/tests/context-usage.test.cjs:182-198
- specs/hooks/023-session-relaunch-loop/spec.md:116-119
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:165-175
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-23

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **LUNA-FANOUT-P1-001 — A Claude transcript row larger than the 256 KiB tail silently suppresses the nudge**
   - **Case:** While Claude is running inside skilled-loop, the newest main-chain assistant JSONL record is larger than 262144 bytes and its token usage has crossed the configured nudge threshold.
   - **File:** .skilled/hooks/session-relaunch/lib/context-usage.cjs:46-47; .skilled/hooks/session-relaunch/claude/context-nudge.mjs:73-75.
   - **Evidence:** readTail starts exactly at size minus tailBytes without aligning the start to a JSONL newline. readClaudeFill drops the first line when that clipped fragment fails JSON parsing; if the record is the only assistant entry in the tail, it returns null. The Claude adapter treats null as done and never evaluates nudgeDecision. A previous, smaller assistant row can also be selected instead, leaving the threshold check based on stale usage. The current long-transcript test uses a complete final row sized to fit its chosen tail.
   - **Impact:** Under this condition, the automatic handover nudge does not fire at the threshold. Because the hook returns normally, there is no explicit usage-parse signal for the caller to surface.
   - **findingClass:** silent-failure
   - **scopeProof:** .skilled/hooks/session-relaunch/lib/context-usage.cjs:38-47, 94-114; .skilled/hooks/session-relaunch/claude/context-nudge.mjs:69-91.
   - **affectedSurfaceHints:** Claude UserPromptSubmit and PostToolUse nudge delivery; shared transcript-tail reader.
   - **Recommendation:** Read backward to a complete record boundary with a bounded expansion strategy, or expose an explicit parse/truncation error and handle it so the hook cannot silently treat an unreadable newest usage row as below threshold.
   - **Prior-review check:** Earlier review material noted that an initial partial tail line is dropped. That did not cover a final assistant record larger than the fixed tail; the same current clipping behavior is still present.

### P2 Findings

None.

## Traceability Checks

- Core spec: phase 013 states the nudge must run only inside skilled-loop; phase 016 asks that the automatic hop fire on each automatic runtime. The reviewed null-usage return creates a silent missed-hop edge case; no contradiction was found in the cited requirements.
- Checklist evidence: deferred to the later traceability passes.
- Cross-runtime adapter parity: deferred to later iterations.

## Edge Cases and Ruled Out

- The 80% default and +5% reminder boundary are expressed in shared nudge logic; the adapter passes the measured ratio into that logic.
- The prior long-transcript case is covered only when the complete final JSONL row fits within the requested tail. It does not exercise a single oversized final row.
- The previous review's partial-first-line observation is not treated as closed for this distinct oversized-row condition.

## SCOPE VIOLATIONS

The workflow's step_seed_coverage_graph would write to shared coverage-graph storage outside this lineage. I skipped that mutation under the task's lineage-only write boundary and used the documented graphless fallback. This is an execution-scope conflict, not a product finding. The legacy migration step was not run because the checked root review directory had no loose legacy iteration files to move.

## Next Focus

Correctness of nudge suppressions, re-nudge state, pending handoff/open-note checks, and hop-cap behavior across the automatic runtime adapters.

## Claim Adjudication

- **Finding:** LUNA-FANOUT-P1-001
- **claim:** A newest Claude assistant JSONL row larger than the fixed 262144-byte tail can be discarded before its usage is evaluated, resulting in a quiet missed nudge.
- **evidenceRefs:** .skilled/hooks/session-relaunch/lib/context-usage.cjs:46-47, 94-114; .skilled/hooks/session-relaunch/claude/context-nudge.mjs:73-91.
- **counterevidenceSought:** The existing long-transcript test confirms parsing when the target row fits within the tail; no repository evidence of an upstream maximum row size below the configured tail was found.
- **alternativeExplanation:** If Claude guarantees every assistant transcript row is smaller than 262144 bytes, this path is unreachable in practice; that size guarantee is not established in the reviewed repository material.
- **finalSeverity:** P1
- **confidence:** 0.84
- **downgradeTrigger:** A documented and enforceable upstream row-size bound below 262144 bytes, or a current reader path that expands/retries to recover the complete newest record.

Review verdict: CONDITIONAL