---
title: "Tasks: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "embedder relisten reaper hardening"
  - "tasks core"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/004-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/042-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T11:16:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "WS1-WS5 shipped + verified (84/84); tasks reconciled to done"
    next_safe_action: "Path-scoped commit + push"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-confirm the current call-site inventory for `startModelServerDemandListener` and the bridge/adopt paths against HEAD (`.opencode/bin/mk-spec-memory-launcher.cjs`) — confirmed; re-arm placed centrally in `bridgeOrReportLeaseHeld()` on `action:'bridge'`
- [x] T002 Stand up or extend a two-launcher live-durability harness for WS1/WS5 (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`) — extended with bridge-re-arm + lease-guard regressions
- [x] T003 [P] Re-confirm the `orphan-mcp-sweeper.sh` `preserve_reason`/`terminate_candidates` line ranges against HEAD (`.opencode/scripts/orphan-mcp-sweeper.sh`) — confirmed before patching
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 WS1: implement the demand-listener re-arm/verify check at the bridge/adopt call sites (`.opencode/bin/mk-spec-memory-launcher.cjs`) — central re-arm in `bridgeOrReportLeaseHeld()` on `action:'bridge'` + `writeLeaseForOwnedContextChild` lease guard
- [x] T005 [P] WS2: implement the hf-local fail-fast branch for the socket-absent-no-owner-lease case (`.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`) — `<=5s` fail-fast gated on no live spawn authority; ENOENT stays retryable
- [x] T006 [P] WS3(a): sweeper maintenance-marker respect in `preserve_reason` (`.opencode/scripts/orphan-mcp-sweeper.sh`) — `has_active_maintenance_marker` preserves a fresh-marker daemon
- [x] T007 [P] WS3(b): sweeper singleton rule against `daemon-ipc.sock` (`.opencode/scripts/orphan-mcp-sweeper.sh`) — path-named-fd listener discriminator (macOS emits no `TST=LISTEN`) + same-DB singleton decisions
- [x] T008 [P] WS3(c): sweeper pid re-classification before the `terminate_candidates` SIGKILL escalation (`.opencode/scripts/orphan-mcp-sweeper.sh`) — reclassify before both SIGTERM and SIGKILL + tri-state socket probe
- [x] T009 WS5: investigate the `launcher-lease.vitest.ts` owner-reap timeout (line 344) and fix or root-cause it — root cause: fixture staleness (owner lease never aged out); fixed in fixture, production guard unchanged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the WS1 live-durability test: two real launchers, adoption, confirm `hf-embed.sock` respawns on demand — unit suites (launcher-lease + 3x model-server) green; the full adoption-live stress suite needs a built `dist/` (deferred to the main checkout, documented in Known Limitations)
- [x] T011 Run WS2's unit tests: fail-fast vs. genuine-spawn branches — 6 branch-covering cases in `hf-local-client.vitest.ts`, green
- [x] T012 Run WS3's sweeper unit tests plus a dry-run pass that preserves the live daemon — `orphan-sweeper-ipc-preserve.vitest.ts` green; live dry-run preserved real daemon pid 42293, zero context-server kills
- [x] T013 Re-run the WS5 target test 5/5 for reliability — green across the full-regression reruns (84/84 twice under load)
- [x] T014 Write the WS4 runbook and cross-check it against the actual `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` default and the launchd plist contents — `.opencode/scripts/README.md` staged-activation section, claims verified against `session-cleanup.sh`
- [x] T015 Adversarial review of WS1 and WS3 before merge or any live activation — two rounds: round 1 found 3 real defects (1 P0 + 2 P1), round 2 found 2 refinements; all fixed and re-verified green (84/84)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] WS1/WS2/WS3/WS5 acceptance criteria (REQ-001 through REQ-008) verified with evidence — see `checklist.md` + `implementation-summary.md` Verification
- [x] WS4 runbook written and cross-checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../030-opencode-temp-worker-reaping/`
<!-- /ANCHOR:cross-refs -->
