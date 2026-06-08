# Deep Review Report — gpt55-1 Fanout Lineage

## Executive Summary

**Verdict:** CONDITIONAL  
**Stop reason:** `maxIterationsReached` (`config.maxIterations=1`)  
**Scope:** 12-file target covering daemon re-election, stale-reclaim reap, hook portability, cleanup scripts, and durability tests.  
**Active findings:** P0=0, P1=1, P2=2.  
**hasAdvisories:** true.

This lineage found one release-relevant P1: the recently added stale-reclaim reap path relies on an owner-lease mutex that the stale-existing-lease branch does not actually provide. The remaining P2s are bounded hardening and test-matrix gaps on the same release/reap surface.

## Planning Trigger

Route to remediation planning for F001 before claiming release readiness. The issue is not a P0 in this pass because no live reproducer was executed and downstream checks can narrow the window, but the implementation contradicts its own single-writer mutex claim in the branch that now reaps and respawns the daemon.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence |
|----|----------|-----------|-------|----------|
| F001 | P1 | correctness | Stale-owner reclaim is not the spawn mutex the reap fix relies on | `.opencode/bin/mk-spec-memory-launcher.cjs:456-467`, `:468-481`, `:1482-1502`, `:1522-1530` |
| F002 | P2 | correctness | Re-election release path does not await or escalate model-server shutdown | `.opencode/bin/mk-spec-memory-launcher.cjs:1372-1384`, `.opencode/bin/lib/model-server-supervision.cjs:347-356`, `.opencode/bin/mk-spec-memory-launcher.cjs:1402-1417` |
| F003 | P2 | traceability | Live test misses secondary-connected fresh-reap composition | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:183-208`, `:210-243` |

## Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Stale-owner reclaim serialization | F001 | Replace tmp+rename+reread stale reclaim with a true atomic mutation lock or compare-and-swap. Ensure only one fresh launcher can enter reap/respawn for an existing stale owner lease. |
| Release-path shutdown hardening | F002 | Mirror normal shutdown's await-and-SIGKILL behavior for the model-server sidecar, or document an intentional best-effort release policy. |
| Durability matrix completion | F003 | Add a live test with owner + secondary connected, owner release, then fresh session stale-reclaim/reap, and assert secondary recovery plus single DB writer. |

## Spec Seed

Add this requirement to the daemon reliability packet that owns the reap fix:

> A fresh session reclaiming an existing stale owner lease MUST acquire an atomic spawn/reap mutex before signalling the recorded daemon child or writing a replacement daemon lease. Concurrent fresh sessions after owner disposal MUST result in at most one replacement daemon and no orphaned extra WAL writer.

## Plan Seed

1. Inventory every owner-lease mutation path in `mk-spec-memory-launcher.cjs` and decide whether to share the existing respawn lock or introduce an owner-lease mutation lock.
2. Change the stale-existing owner-lease reclaim branch to use the selected atomic guard before `reapLeaseChildBeforeRespawn()`.
3. Add a concurrent fresh-session reclaim durability test that starts multiple fresh launchers after owner disposal and asserts exactly one SQLite opener.
4. Add the secondary-connected fresh-reap matrix row from F003.
5. Re-run the daemon re-election durability tests and launcher lease tests.

## Traceability Status

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Reap/release behavior exists, but F001 contradicts the O_EXCL mutex claim in the shared context and inline comment. |
| checklist_evidence | partial | hard | The local packet checklist is template-only; no checked claim overstates completion, but it cannot prove the recent daemon changes. |
| feature_catalog_code | not run | advisory | Catalog/docs were outside the 12-file target for this lineage. |
| playbook_capability | not run | advisory | Playbook docs were outside the 12-file target for this lineage. |

## Deferred Items

- F002 can be handled as hardening if F001 is fixed first.
- F003 is a test-gap advisory unless it exposes a secondary reconnect failure when implemented.
- Hook-command portability appeared sound in this pass; no hook finding recorded.

## Audit Appendix

| Field | Value |
|-------|-------|
| Iterations | 1 |
| Dimensions covered | correctness, security, traceability, maintainability |
| JSONL records | config, iteration, synthesis_complete |
| Final verdict | CONDITIONAL |
| Release-readiness state | in-progress |
| Artifact dir | `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/review/lineages/gpt55-1` |

Replay note: this lineage stopped because `maxIterations=1`, not because legal convergence gates passed. The parent fan-out merge should apply strongest restriction across lineages.
