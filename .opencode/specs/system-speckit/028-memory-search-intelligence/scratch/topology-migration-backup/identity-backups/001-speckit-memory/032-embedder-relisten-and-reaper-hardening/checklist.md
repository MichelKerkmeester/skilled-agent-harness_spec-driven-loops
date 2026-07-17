---
title: "Verification Checklist: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Verification Date: 2026-07-11 - WS1-WS5 implemented, full regression 84/84, two adversarial-review rounds resolved."
trigger_phrases:
  - "verification"
  - "checklist"
  - "embedder relisten reaper hardening"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/028-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T11:16:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "WS1-WS5 verified; checklist reconciled to shipped state"
    next_safe_action: "Path-scoped commit + push"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Status note**: WS1-WS5 implemented and verified 2026-07-11. Full regression 84/84 (twice, under load); typecheck clean; WS3 empirically proven (5 lsof shapes + real listener discriminator) and live-dry-run safe; two adversarial-review rounds resolved.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` §4 REQUIREMENTS (REQ-001 through REQ-008)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (phases + affected-surfaces addendum)
- [x] CHK-003 [P1] Dependencies identified and available - `mk-spec-memory-launcher.cjs`/`hf-local.ts`/`orphan-mcp-sweeper.sh` paths located; adversarial reviewer used twice (GPT-5.6-sol)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks - `node --check` on the launcher and `bash -n` on the sweeper both clean; `npm run typecheck` clean for hf-local.ts
- [x] CHK-011 [P0] No console errors or warnings - vitest suites run clean (84/84)
- [x] CHK-012 [P1] Error handling implemented - WS1 re-arm wrapped in a non-fatal `try/catch`; WS2 fail-fast throws an actionable error; sweeper preserves on every ambiguous probe
- [x] CHK-013 [P1] Code follows project patterns - comment-hygiene scans clean (no spec/packet/ticket ids); reuses existing launcher/sweeper idioms and constants (e.g. `HF_MODEL_SERVER_SOCKET_FILE_NAME`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met - WS1-WS5 implemented and verified; see `implementation-summary.md` Verification table (84/84)
- [x] CHK-021 [P0] Automated testing complete - 84/84 across launcher-lease, 3x model-server, hf-local-client, orphan-sweeper suites (twice, under load)
- [x] CHK-022 [P1] Edge cases tested - stale-socket takeover (WS5), pid-reuse (WS3 reclassify-before-TERM/KILL), same-DB duplicate + mis-group guard, tri-state lsof (`(deleted)`/fail/empty)
- [x] CHK-023 [P1] Error scenarios validated - WS2 no-spawn-authority fail-fast + expired-heartbeat + dead-lock/pid cases in `hf-local-client.vitest.ts`; TCP-target retains normal timeout
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - WS1 class-of-bug (every adoption via `bridgeOrReportLeaseHeld`); WS3 patches class-of-bug in sweeper decision logic; WS2 algorithmic (retry-vs-fail-fast); WS5 test-isolation
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - WS1 re-arm placed at the single central chokepoint (`bridgeOrReportLeaseHeld`) covering all bridge/adopt paths; fresh-owner path unchanged
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers - `writeLease` callers traced (owner-only via `writeLeaseForOwnedContextChild`); `has_daemon_socket_fd`/tri-state consumers updated; hf-local retry-loop consumer confirmed
- [x] CHK-FIX-004 [P0] Adversarial-case tests for the process killer - pid-reuse (reclassify), same-DB dual-daemon, mis-group (foreign socket), `(deleted)`/failed/empty lsof all covered in orphan-sweeper tests
- [x] CHK-FIX-005 [P1] Matrix axes listed - WS1 lifecycle x socket-state covered by model-server suites; WS3 marker/singleton/reclassify/tri-state matrix in `orphan-sweeper-ipc-preserve.vitest.ts`
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed - divergent-`SPECKIT_IPC_SOCKET_DIR` bridge test; lsof-failure/empty variants; live dry-run against real process table
- [x] CHK-FIX-007 [P1] Evidence pinned to concrete diffs - `implementation-summary.md` lists the 8 changed files with per-file purpose; test counts pinned to the finalize run (84/84)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - `grep -rniE 'secret|token|password|api[_-]?key'` over the changed files returns no literal credentials
- [x] CHK-031 [P0] Input validation implemented - sweeper resolves DB dirs defensively (unknown -> preserve); hf-local validates lease/lock/pid liveness; launcher gates on `path.isAbsolute` and non-tcp before path derivation
- [x] CHK-032 [P1] Auth/authz - N/A: `grep -rniE 'auth|login|token'` over the changed files confirms no auth surface in this internal process-lifecycle tooling
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - `implementation-summary.md` + this checklist reconciled to shipped state; `spec.md` continuity updated
- [x] CHK-041 [P1] Code comments adequate - durable-WHY comments on the WS1 re-arm in `bridgeOrReportLeaseHeld`, the lease guard, the sweeper guards, and the divergent-dir limitation; hygiene-clean
- [x] CHK-042 [P2] README updated - WS4 staged-activation runbook added to `.opencode/scripts/README.md`, verified against `session-cleanup.sh` + the plist
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - no `scratch/` directory in this packet; working files kept in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion - no packet `scratch/` to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-11. WS1-WS5 implemented and verified; full regression 84/84 (twice, under load), typecheck clean, WS3 empirically proven and live-dry-run safe, two adversarial-review rounds resolved. Deferred to post-merge (documented, non-blocking): the WS1 adoption-live stress test (needs a built `dist/`) and the packet-025 `memory_index_scan` (needs the fix on `main` + daemon restart).
<!-- /ANCHOR:summary -->
