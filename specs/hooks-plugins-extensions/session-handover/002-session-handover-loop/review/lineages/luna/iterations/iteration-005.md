# Iteration 5 — traceability

## Dimension

Traceability across the killer lifecycle: idle detection, SIGTERM and grace, timeout handling, and replacement-record identity.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/killer.cjs:146-185,480-509,547-634
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:329-354,403-415,430-442
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:331-427
- .skilled/bin/skilled-loop:423-436
- .skilled/hooks/session-relaunch/tests/killer.test.cjs:1195-1289,1291-1363,1442-1476
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:469-493
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:60-78,102-106,125-127
- specs/hooks/023-session-relaunch-loop/review-archive/20261019T144809Z/review-report.md:152-163,249-252
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-23
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/prompts/iteration-005.md:14-24

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **LUNA-FANOUT-P1-004 — timeout cleanup can disarm a newer armed record for the same handoff path**
   - **Case:** Killer K1 is waiting on handoff A. The same still-open note is prepared again while K1 owns the lock; a later Stop/idle event arms the replacement record for A and starts K2. K2 exits because K1 still owns the lock. When K1 times out, it treats the matching path as the unchanged record.
   - **File:** .skilled/hooks/session-relaunch/lib/killer.cjs:480-503.
   - **Evidence:** K1 captures watchedRecord before waiting at :547-550. recordTimeout re-reads the file, but considers it the same record when only current.handoff matches the old path at :480-491. It then calls core.unarm using expectedStatus: 'armed' and expectedHandoff at :496-503. unarm checks only those two fields at relaunch-core.cjs:430-441, so a replacement record with the same path, newly armed after K1 started, matches and is disarmed. preparePending overwrites the loop record with a new pending record at relaunch-core.cjs:329-353; armableRecord accepts pending records without checking the existing killer lock at :403-415; K2 then loses the live lock and exits at killer.cjs:347-361. With no killer left, the still-open runtime blocks the wrapper before its post-exit relaunch check (skilled-loop:423-432).
   - **Impact:** A repeated prepare for the same open note can turn the existing timeout fallback into a stranded automatic hop: the older killer disarms the replacement record even though the replacement killer never acquired the lock.
   - **findingClass:** concurrency
   - **scopeProof:** session-relaunch.cjs:418-427; relaunch-core.cjs:329-353,403-415,430-441; killer.cjs:347-361,480-503,547-554; skilled-loop:423-432.
   - **affectedSurfaceHints:** prepare -> pending record -> same-path re-arm -> killer lock ownership -> timeout cleanup -> wrapper relaunch.
   - **Recommendation:** Give each prepared record a stable generation/token and require timeout cleanup to match that identity before unarming or notifying. Add a regression case that replaces and re-arms the same handoff path while the original killer owns the lock, then verifies the replacement remains armed.
   - **Prior-review check:** R1-P2-002 covered a replacement with a different handoff path. Current code adds a path comparison and the existing regression tests that distinct-path case. The same-path replacement bypasses that comparison; the existing re-prepare test leaves the record pending and does not exercise re-arming before timeout.

### P2 Findings

None.

## Traceability Checks

- Phase 016 requires reviewing whether automatic handover fires every time and fixing confirmed P1 findings.
- The current killer checks hop cap and armed-record freshness before signaling, waits a fresh grace period after SIGTERM, and re-reads a record before timeout cleanup.
- The timeout supersession check now protects a different handoff path; it does not identify a new record that reuses the same path.

## Edge Cases and Ruled Out

- A transcript that remains missing beyond its grace window exits through the timeout path instead of signaling the target.
- Before SIGTERM, the killer rechecks hop cap, record freshness, target liveness, and loop ancestry; the target receives SIGTERM only after these checks.
- After SIGTERM, the killer waits the full signal grace window, then timeout cleanup protects a different current handoff path.
- The existing tests cover a re-prepared pending record and a different-path replacement that is already armed. They do not cover a same-path replacement that becomes armed while the original killer still holds its lock.
- The earlier archived timeout finding is not duplicated: its distinct-path failure is guarded in current code; this is the remaining same-path identity case.

## SCOPE VIOLATIONS

- scope_violation: the workflow step_graph_upsert writes shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: the workflow step_graph_convergence normally invokes convergence.cjs in write mode, which appends observability data to shared graph storage. No default write-mode graph command was run. Graph work remains graphless_fallback; maxIterationsReached is the configured stop policy.
- These are workflow mutations outside the authorized write surface, not product findings.

## EXECUTION CONFLICT

The reducer strategy continues to label some deferred directions BLOCKED after one attempt. The lead's steer requires all runtimes and chain stages; review continues against that steer and the configured ten-iteration cap.

## Next Focus

Trace the wrapper's relaunch decision, exit-code handling, cwd/model/flag carry, seed generation, and receiving-session claim across the automatic runtimes.

## Claim Adjudication

- **Finding:** LUNA-FANOUT-P1-004
- **claim:** A stale killer can mistake a newer armed record for its original record when both use the same handoff path, then disarm the replacement record after its killer loses the original lock.
- **evidenceRefs:** .skilled/hooks/session-relaunch/lib/killer.cjs:480-503,547-554; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:329-353,403-415,430-441; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:418-427; .skilled/bin/skilled-loop:423-432.
- **counterevidenceSought:** The current timeout replacement guard, unarm's expected-field checks, prepare's write path, armableRecord's pending branch, lock contention handling, and existing timeout regression tests were read. The current guard distinguishes handoff paths but not record generations; test cases cover a pending same-path replacement and an armed different-path replacement.
- **alternativeExplanation:** A repeated prepare could be considered an operator mistake, or the runtime could exit naturally before K1 times out. The CLI accepts a new prepare while the note remains open, and the specified condition leaves the wrapper waiting if the runtime stays open.
- **finalSeverity:** P1
- **confidence:** 0.97
- **downgradeTrigger:** A current identity comparison or equivalent lock protocol that prevents an older killer from unarming a newer armed record even when the handoff path is unchanged.

Review verdict: CONDITIONAL
