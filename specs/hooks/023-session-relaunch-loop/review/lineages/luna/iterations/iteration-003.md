# Iteration 3 — correctness

## Dimension

Correctness: handoff note metadata, prepare, and receiving seed continuity.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/nudge.cjs:83-149, 191-233
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-193, 331-441
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:214-288, 329-354
- .skilled/bin/skilled-loop:93-105, 507-510
- .skilled/commands/speckit/handoff.md:21-27, 55-61, 78-81, 127-132
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:105-114
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-23

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **LUNA-FANOUT-P1-002 — prepare drops the bound packet path before the receiving session seed is built**
   - **Case:** A session has an answered Gate 3 packet path or Skip value, writes a valid handoff note with that spec_folder, and runs prepare inside skilled-loop.
   - **File:** .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:418-427.
   - **Evidence:** prepare reads the note's spec_folder at :364-370 and validates it at :372-375. The in-loop call to core.preparePending passes loopId, handoffPath, sessionId, runtime, name, cwd, hops, and env, but omits specFolder. preparePending serializes only its declared fields at relaunch-core.cjs:329-354. skilled-loop later reads record.spec_folder at :93-104 and appends a seed suffix only when that field exists at :507-510. The receiving seed parser returns an empty spec folder when the suffix is absent at nudge.cjs:191-204, and the handoff command defines empty as Gate 3 never answered at handoff.md:131.
   - **Impact:** Every automatic hop from a bound packet loses the packet path or explicit Skip answer. The receiving session does not receive the prior Gate 3 answer and skips /speckit:resume; it may ask Gate 3 again and resume without the saved packet continuity.
   - **findingClass:** data-loss
   - **scopeProof:** session-relaunch.cjs:364-427; relaunch-core.cjs:329-354; skilled-loop:93-105,507-510; nudge.cjs:191-204,225-233.
   - **affectedSurfaceHints:** prepare -> pending record -> skilled-loop seed -> seedInstructions -> receiving session.
   - **Recommendation:** Include the validated spec_folder in the pending record and keep the wrapper's record reader as the single consumer. Add a producer-to-consumer test that prepares a note, passes the persisted record through skilled-loop, and asserts the receiving seed includes both a packet path and the explicit Skip value.
   - **Prior-review check:** DS-010/DS-011 concerned documenting input variables and adapter test coverage. This current omission is in the preparePending record path; the relevant producer and consumer code still show it today.

### P2 Findings

None.

## Traceability Checks

- The handoff command defines spec_folder as the sending session's Gate 3 answer and instructs the receiver to resume the packet only when a path is present. The phase 016 review requires reliable handoff behavior on the automatic runtimes.
- Checklist evidence and full command-template conformance remain assigned to later passes.

## Edge Cases and Ruled Out

- prepare rejects lexical and realpath escapes from the handoffs directory.
- An explicit --runtime value that conflicts with SKILLED_LOOP_RUNTIME is rejected before a pending record is created.
- This finding is distinct from the earlier DS-010/DS-011 findings; it is a current producer-consumer omission in the record passed to skilled-loop.

## SCOPE VIOLATIONS

- scope_violation: the workflow step_graph_upsert runs upsert.cjs against shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: the workflow step_graph_convergence normally invokes convergence.cjs in write mode, which appends observability data to the shared graph database. No default write-mode graph command was run. Graph work remains graphless_fallback; maxIterationsReached is the configured stop policy.
- These are workflow mutations outside the authorized write surface, not product findings.

## EXECUTION CONFLICT

The reducer strategy had labeled deferred runtime work as BLOCKED after one iteration. The lead's steer requires all runtimes and chain stages; review continues against that steer and the configured ten-iteration cap.

## Next Focus

Arm event handlers and killer-spawn/re-arm behavior on Claude Stop, Pi agent_end, OpenCode session.idle, Codex Stop, and Hermes on_session_end.

## Claim Adjudication

- **Finding:** LUNA-FANOUT-P1-002
- **claim:** The automatic prepare producer omits spec_folder from the persisted record even though skilled-loop consumes that field to build the receiving seed.
- **evidenceRefs:** .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:364-427; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:329-354; .skilled/bin/skilled-loop:93-105,507-510; .skilled/hooks/session-relaunch/lib/nudge.cjs:191-204,225-233; .skilled/commands/speckit/handoff.md:127-132.
- **counterevidenceSought:** The current prepare caller, pending-record schema, wrapper reader, seed parser, handoff command, and prior review summaries were checked. None carries the packet path around the record.
- **alternativeExplanation:** The behavior would be correct only if another live path injects the same suffix after skilled-loop consumes the record; the reviewed wrapper builds the seed from consumed_record_json and no such source was found.
- **finalSeverity:** P1
- **confidence:** 0.99
- **downgradeTrigger:** A current prepare-to-wrapper path that populates record.spec_folder or independently derives the Gate 3 answer before building the seed.

Review verdict: CONDITIONAL