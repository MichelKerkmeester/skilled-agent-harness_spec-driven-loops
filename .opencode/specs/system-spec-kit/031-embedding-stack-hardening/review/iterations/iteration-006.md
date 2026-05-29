# Iteration 006 - Correctness/Security Stabilization

## Dimension

correctness/security (single-writer-lease lifecycle deepening + final saturation sweep)

## Files Reviewed

- `.opencode/bin/lib/model-server-supervision.cjs:811`
- `.opencode/bin/lib/model-server-supervision.cjs:817`
- `.opencode/bin/lib/model-server-supervision.cjs:1082`
- `.opencode/bin/lib/model-server-supervision.cjs:1091`
- `.opencode/bin/lib/model-server-supervision.cjs:1153`
- `.opencode/bin/lib/model-server-supervision.cjs:1168`
- `.opencode/bin/lib/model-server-supervision.cjs:1198`
- `.opencode/bin/lib/model-server-supervision.cjs:1200`
- `.opencode/bin/lib/model-server-supervision.cjs:1267`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:650`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:58`
- `.opencode/bin/hf-model-server.cjs:146`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:272`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:835`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411`
- `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:105`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:220`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:331`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server.vitest.ts:104`

## Findings by Severity

### P0

None.

### P1

#### DR-006-P1-001 - Demand-triggered model-server spawn failures strand the lazy listener

- File: `.opencode/bin/lib/model-server-supervision.cjs:1198`
- Severity: P1
- Finding class: cross-consumer
- Claim: `handleModelServerDemand` removes the demand listener before it knows the real model server launched. If `launch()` returns `false` because the child has no PID, the response still says `state: "loading"` with `launched: false`, but the lazy listener has already been closed and unlinked, so later clients have no listener to hit. If `spawnFn` throws synchronously, `releaseDemandRespawnLock()` is skipped because the lock release sits after the launch call with no `finally`.
- Evidence: `releaseModelServerDemandListenerForSpawn({ keepRespawnLock: true })` runs before `getSupervisor().launch()` at `.opencode/bin/lib/model-server-supervision.cjs:1198-1200`. The listener release path clears `state.demandServer`, clears `state.demandTarget`, unlinks the socket, and only keeps the respawn lock because `keepRespawnLock` is true at `.opencode/bin/lib/model-server-supervision.cjs:1082-1091`. `launch()` can fail without launching a usable child: it assigns `state.child = spawnFn(...)` at `.opencode/bin/lib/model-server-supervision.cjs:811`, then returns `false` when `state.child.pid` is not a positive integer at `.opencode/bin/lib/model-server-supervision.cjs:817-820`. The demand response still reports loading after that branch at `.opencode/bin/lib/model-server-supervision.cjs:1201-1204`.
- Counterevidence sought: Checked the model-server tests for failed spawn/no-PID demand coverage and found only successful lazy spawn expectations (`launcher-model-server.vitest.ts:104-123`) plus cross-launcher winner/booting-window coverage (`launcher-model-server-cross-launcher.vitest.ts:220-223`, `331-365`). The existing tests do not assert listener re-arm or lock release when demand-triggered launch fails.
- Alternative explanation: Most normal `child_process.spawn` failures for a missing target are emitted asynchronously, and the default target is `process.execPath`, so the bad branch may be rare. But the implementation explicitly treats no-PID child creation as a possible launch failure, and that branch currently tears down the only lazy listener before returning `launched: false`.
- Final severity: P1
- Confidence: 0.82
- Downgrade trigger: Downgrade if the launcher can prove `spawnFn` cannot return a no-PID child or throw synchronously in supported runtimes, or if another production path immediately re-arms the demand listener after `launched: false`.
- Recommendation: Keep the demand listener and respawn lock lifecycle in a `try/finally` around launch, and on `launched === false` either re-arm the demand listener before responding or return a fail-closed error that preserves/restarts the listener for later demand.
- Scope proof: `rg -n "releaseModelServerDemandListenerForSpawn|getSupervisor\\(\\)\\.launch|spawnFn|spawn\\(|releaseDemandRespawnLock" .opencode/bin/lib/model-server-supervision.cjs .opencode/skills/system-spec-kit/mcp_server/tests/embedders` shows this demand handler is the only path that removes the lazy listener immediately before launch; the test suite covers success, cross-launcher lock contention, and booting-window backoff, but not failed demand launch recovery.
- Affected surface hints: ["lazy demand listener", "respawn lock", "model-server spawn", "cross-launcher availability"]

### P2

None.

## Traceability Checks

- Core `spec_code`: covered for the reviewed single-writer/lease lifecycle paths.
- Core `checklist_evidence`: partial; this pass did not reopen prior checklist-evidence findings.
- Overlay `skill_agent`: pending; no new overlay-specific finding.
- Overlay `agent_cross_runtime`: pending; no new overlay-specific finding.
- Overlay `feature_catalog_code`: partial; no new feature-catalog drift found in this pass.
- Overlay `playbook_capability`: pending; no new overlay-specific finding.

## Verdict

CONDITIONAL, `hasAdvisories=true`.

The final sweep found one new P1 in the demand-spawn failure lifecycle. The previously reported stale respawn-lock age bug, TCP exposure, workflow fail-open lock path, provider override, reindex cancellation, and documentation drift remain active but were not re-reported.

## Next Dimension

Convergence/synthesis candidate after reducer validation. If another pass runs, focus only on adjudicating whether `DR-006-P1-001` combines with `DR-005-P1-001` into one remediation workstream or needs a separate fix path.
