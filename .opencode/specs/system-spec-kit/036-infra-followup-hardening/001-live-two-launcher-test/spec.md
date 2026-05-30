---
title: "Feature Specification: Live coverage for the F2 clean-close reap barrier"
description: "End-to-end test of reapLeaseChildBeforeRespawn — the F2 clean-close barrier that decides whether a reaped context-server child handed off the DB cleanly before a replacement daemon boots. Closes the live-coverage gap that 031/009 and 032/001 left open, using deterministic real-child reaps (no flaky launcher-lifecycle spawning)."
trigger_phrases:
  - "live two-launcher reap test"
  - "F2 clean-close barrier coverage"
  - "reapLeaseChildBeforeRespawn test"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/001-live-two-launcher-test"
    last_updated_at: "2026-05-30T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built + verified the live reap test; 5/5 green"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-reap.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003601"
      session_id: "036-001-spec"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Chose direct reap-function coverage over real two-launcher spawning: spawning launchers is the exact flake that got launcher-lease.vitest.ts skipped; testing reapLeaseChildBeforeRespawn against throwaway children + a real marker is deterministic and covers the same F2 logic."
---
# Feature Specification: Live coverage for the F2 clean-close reap barrier

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed (2026-05-30) |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-spec-kit/036-infra-followup-hardening |
| **Predecessor** | system-spec-kit/032-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing |
| **Successor** | None |
| **Handoff Criteria** | New vitest covers all four reap branches and is green; `node --check` launcher passes; no flaky launcher-process spawning; strict-validate exit 0. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The F2 clean-close barrier (`reapLeaseChildBeforeRespawn` in `mk-spec-memory-launcher.cjs`, shipped in 032/001) decides whether a possibly-dirty DB is handed to a replacement daemon. Its pure helpers (`cleanCloseAfterReap`, `uncleanShutdownMarkerPath`) are unit-tested, but the reap orchestration itself — SIGTERM, the SIGKILL escalation, and the marker-based clean-close determination — had zero live coverage. The only real-process launcher suite (`launcher-lease.vitest.ts`) is entirely `describe.skip`'d as a "known launcher process lifecycle flake," so the safety-critical path was untested.

### Purpose
Add deterministic end-to-end coverage of the reap path without reintroducing the launcher-spawn flake that got the existing suite skipped.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Export `reapLeaseChildBeforeRespawn` (+ `uncleanMarkerPresent`) from the launcher for testability.
- New `launcher-clean-close-reap.vitest.ts` exercising the four reap outcomes against real throwaway child processes and a real marker file (location pinned via `MEMORY_DB_PATH`).

### Out of Scope
- Spawning real `mk-spec-memory-launcher` processes (the swarm's original sketch) — deliberately avoided as flake-prone; the reap function carries the F2 logic and is tested directly.
- Un-skipping the legacy `launcher-lease.vitest.ts` suite — independent decision, untouched.
- Any production behavior change — the launcher edit is export-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Export `reapLeaseChildBeforeRespawn` + `uncleanMarkerPresent` (export-only; no logic change) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-reap.vitest.ts` | Create | Live reap-barrier test (4 branches) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live reap coverage | Test calls the real `reapLeaseChildBeforeRespawn` and asserts the four outcomes: already-dead, graceful-clean (cleanClose true), graceful-dirty (marker survives → cleanClose false), ignore-SIGTERM (SIGKILL escalation → cleanClose false). |
| REQ-002 | Deterministic, non-flaky | No reliance on real launcher-process lifecycle; the marker is a file the test owns via `MEMORY_DB_PATH`; an `unknown-eperm` liveness platform skips-with-reason rather than asserting the wrong branch. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Export-only production change | The launcher diff adds names to `module.exports` only; `node --check` passes; no behavior change. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `launcher-clean-close-reap.vitest.ts` is green (5/5), exercising every clean/unclean/killed branch of the F2 barrier.
- **SC-002**: The test is deterministic — the SIGKILL-escalation case completes within a bounded deadline via the real grace constant, with no fixed sleeps in assertions.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reaping real child processes is environment-sensitive | Flake | Children are trivial `node -e` stubs the test fully controls; assertions are on return value + marker file, not timing; `unknown-eperm` liveness skips-with-reason |
| Risk | Exporting an internal function widens the surface | Minor | Export-only; the `require.main` guard means importing never runs `main()`; verified no auto-spawn on require |
| Risk | SIGKILL-escalation case waits the full 7s grace | Slow test | Bounded 20s per-test deadline; only one case pays the grace; total suite ~8.5s |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Whole suite completes in well under the per-test deadline (~8.5s observed), dominated by the single intentional SIGKILL-grace case.

### Security
- **NFR-S01**: No new external input; child stubs are fixed inline scripts, not user data.

### Reliability
- **NFR-R01**: Deterministic across runs — outcomes are driven by the child's SIGTERM behavior and a test-owned marker file, not wall-clock timing.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Already-dead child: reap returns `child-already-dead`, `cleanClose` derived from the marker (absent → clean).
- Graceful exit + marker removed: `cleanClose` true.
- Graceful exit + marker survives: `cleanClose` false (exited but DB close unconfirmed).
- Ignores SIGTERM → SIGKILL: `killed` true → `cleanClose` always false even with no marker.

### Error Scenarios
- Platform hides process liveness (`unknown-eperm`): the live-child cases skip-with-reason; no false assertion.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 1 export-only launcher edit + 1 new test file |
| Risk | 10/25 | Real child reaps, but test-owned + deterministic; launcher logic untouched |
| Research | 6/20 | Reap seams + bridge probe pre-mapped by the scope/verify swarm |
| **Total** | **22/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The original "spawn two real launchers" design was deliberately narrowed to direct reap-function coverage to avoid the documented launcher-lifecycle flake.

<!-- /ANCHOR:questions -->
