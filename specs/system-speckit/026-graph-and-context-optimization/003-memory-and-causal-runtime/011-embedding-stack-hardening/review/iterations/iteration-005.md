# Iteration 005

## Dimension

correctness (deep revisit + cross-phase integration): embed path 001-004, daemon shutdown/WAL 009/010/012, and single-writer/lease systems 002/005/013.

## Files Reviewed

- `.opencode/bin/lib/model-server-supervision.cjs:20`
- `.opencode/bin/lib/model-server-supervision.cjs:591`
- `.opencode/bin/lib/model-server-supervision.cjs:649`
- `.opencode/bin/lib/model-server-supervision.cjs:675`
- `.opencode/bin/lib/model-server-supervision.cjs:995`
- `.opencode/bin/lib/model-server-supervision.cjs:1153`
- `.opencode/bin/lib/model-server-supervision.cjs:1200`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:392`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:649`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1491`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1641`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:421`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411`
- `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts:104`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:220`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server.vitest.ts:249`

## Findings by Severity

### P0

No new P0 findings.

### P1

#### DR-005-P1-001 [P1] Lazy model-server respawn locks expire while the live listener still owns them

- File: `.opencode/bin/lib/model-server-supervision.cjs:591`
- Claim: The lazy hf-model-server demand listener holds `hf-embed-respawn.lock` for the whole listener lifetime, but `isRespawnLockStale` treats any lock older than `RESPAWN_LOCK_STALE_MS` as stale even when the recorded owner process is still alive.
- Evidence: `RESPAWN_LOCK_STALE_MS` is 60000 at `.opencode/bin/lib/model-server-supervision.cjs:20`. The stale predicate only returns early for dead PIDs, then returns true when `nowMs - startedAtMs > staleMs` at `.opencode/bin/lib/model-server-supervision.cjs:591`. `acquireRespawnLockFileAt` unlinks and reacquires any lock considered stale at `.opencode/bin/lib/model-server-supervision.cjs:649`. The same module documents that the demand respawn lock is intentionally held across the bind plus idle-listener window, released only on demand spawn, shutdown, or listen failure at `.opencode/bin/lib/model-server-supervision.cjs:1153`.
- Impact: A second launcher started more than 60 seconds after the first lazy listener can reclaim the first listener's still-live lock instead of returning `model-server-respawn-lock-held`. That reopens the cross-launcher race the lock was introduced to prevent: duplicate demand listeners can bind/reclaim the same socket and later spawn competing model-server children.
- Counterevidence sought: I checked the lock release sites and tests. The lock is released on demand spawn at `.opencode/bin/lib/model-server-supervision.cjs:1200`, on listener stop through `releaseDemandRespawnLock` at `.opencode/bin/lib/model-server-supervision.cjs:995`, and on shutdown via `mk-skill-advisor-launcher.cjs:392`. The cross-launcher test verifies immediate second-start blocking at `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:220`, but I found no coverage for an older lock whose owner PID is still live.
- Alternative explanation: The age threshold might have been intended for orphan cleanup. That works for short critical sections, but it conflicts with the current long-lived listener lock design explicitly documented at `.opencode/bin/lib/model-server-supervision.cjs:1153`.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 only if another active guard proves a second launcher cannot reach `acquireDemandRespawnLock` after 60 seconds while the first listener is still alive, or if the demand-listener lock is changed to a short-lived critical-section lock.
- Recommendation: Treat age-only expiry as stale only when the recorded PID is dead or unreadable, or use separate stale policies for short respawn critical sections and long-lived demand-listener ownership.

### P2

No new P2 findings.

## Traceability Checks

- `spec_code`: covered. The new P1 is in committed code and tied to the phase 002/005 model-server liveness and cross-launcher lock contract.
- `checklist_evidence`: partial. Existing test coverage proves immediate second-launcher blocking but does not exercise the live-owner older-than-60s path.
- `skill_agent`: pending. No new skill/agent doc finding in this pass.
- `agent_cross_runtime`: pending. No new cross-runtime doc finding in this pass.
- `feature_catalog_code`: partial. The lock behavior is code-visible; no resource-map.md is present for a catalog coverage gate.
- `playbook_capability`: pending. No playbook-specific finding in this pass.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL with advisories. One new P1 was found in the model-server respawn lock lifecycle. Prior P1/P2 findings remain open and were not re-reported.

## Next Dimension

Convergence follow-up: verify whether any remaining prior P1s can be escalated by interaction with DR-005-P1-001, especially cross-launcher startup and daemon single-writer fail-open behavior.
