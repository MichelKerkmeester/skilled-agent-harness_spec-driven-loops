---
title: "Implementation Summary: Substrate stress-harness hardening [template:level_3/implementation-summary.md]"
description: "Final state of the three harness fixes; full stress suite green (24 files / 87 tests)."
trigger_phrases:
  - "substrate harness implementation summary"
  - "harness hardening done"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/038-substrate-harness-hardening"
    last_updated_at: "2026-05-31T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented all three harness fixes + tests; full stress suite green (24 files / 87 tests)."
    next_safe_action: "Optional: implement the temp SPECKIT_CODE_GRAPH_DB_DIR hermetic-CI lever (ADR-003 deferred)."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-harness-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-038"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Substrate stress-harness hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-substrate-harness-hardening |
| **Completed** | 2026-05-31 |
| **Level** | 3 |
| **Actual Effort** | ~2.5 hours |
| **LOC Added** | ~90 (harness, net of 11 deleted) + 83 (new test) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the three residual risks from packet 037, all in `run-substrate-stress-harness.mjs`, with new behavioral tests.

### Process-start-time identity
A lease PID is accepted as owner only if alive AND its start time matches the lease within 2s (`processStartedAt`, `leaseOwnerMatch`); liveness-only fallback when start time is unreadable.

### Run-id TSV + EPERM sidecar
A trailing `run_id` column identifies the producing run; on EPERM the current rows go to a run-id sidecar instead of silently keeping the stale file.

### Maintainer-mode suppression
`CODE_INDEX_INDEX_SUPPRESSION` (maintainer mode + five INDEX_* = false) is spread into the code-index child env so a clean-env run cannot trigger the tree-wide scan.

### Hermetic lever + testable EPERM (initially deferred, now done)
Opt-in `SPECKIT_SUBSTRATE_HERMETIC=1` gives the code-index child its own within-repo throwaway DB dir (`hermeticCodeIndexDbDir` / `hermeticCodeIndexExtras`) so it acquires its own lease and connects without contending with a live operator daemon — the safe path for clean-env / CI verification. The EPERM fallback was refactored into `writeSummaryWithFallback(payload, { write, warn })` so the sidecar redirect is unit-testable via an injected writer.

### Files Changed

| File | Action | Purpose | LOC |
|------|--------|---------|-----|
| `.../stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | All three fixes + exported testable helpers | +90/-11 |
| `.../stress_test/substrate/substrate-harness-hardening.vitest.ts` | Created | Unit coverage for the three behaviors | 83 |
| **Total** | | | **~162 net** |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Confirmed fix sites + reusable helpers (Explore agents) and authored the Level 3 packet.
2. Applied the three fixes smallest-first (suppression → TSV → identity), reusing the launcher's `ps`/`/proc` probe shape and set-if-absent env semantics.
3. Added a separate pure-logic vitest (`substrate-harness-hardening.vitest.ts`) importing exported helpers, keeping it isolated from the subprocess test.
4. Verified with the targeted substrate files then the full `npm run stress`; generated metadata; strict-validated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Process-start-time identity | Accepted | Recycled PID can no longer mask a crash as SKIP |
| ADR-002 | Run-id TSV + EPERM sidecar | Accepted | Current evidence never lost; stale distinguishable |
| ADR-003 | Maintainer/INDEX suppression in child env | Accepted | Clean-env run cannot rewrite tree graph-metadata |

Implementation-time choices: `ps -o lstart=` for portability; `run_id` as trailing column for backward compatibility; suppression as an exported constant for testability.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Details |
|-----------|--------|---------|
| Unit (hardening) | Pass | `substrate-harness-hardening.vitest.ts` — 8 cases (identity/TSV/env) |
| Behavioral (runner) | Pass | `substrate-runner-harness.vitest.ts` — live-owner SKIP intact |
| Regression (full) | Pass | `npm run stress` → 24 files / 90 tests green |
| Clean-env (hermetic) | Pass | `SPECKIT_SUBSTRATE_HERMETIC=1` run: code-index connected, 403/404/407 PASS, daemon `ready` with NO maintainer-mode forcing line, isolated temp DB, no tree writes |

| REQ | Status |
|-----|--------|
| REQ-001 start-time mismatch → FAIL | Pass |
| REQ-002 no silent stale TSV; run-id present | Pass |
| REQ-003 maintainer/INDEX off in child | Pass |
| REQ-004 existing live-owner SKIP preserved | Pass |
| REQ-005 new behaviors covered by tests | Pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Start-time check depends on `ps`** — when unavailable, falls back to liveness-only (prior behavior; recycled-PID guard inactive there).
2. **Linux start-time** uses `ps -o lstart=`; the `/proc` field-22 path was not needed.
3. **Mem-side clean-env (410 runs for real)** still requires stopping the operator mem daemon — the hermetic lever isolates only the code-index DB (mk-spec-memory's lease path is not env-relocatable). Code-index clean-env path is fully verified.

Follow-up items now CLOSED (initially deferred): the temp `SPECKIT_CODE_GRAPH_DB_DIR` hermetic lever (opt-in `SPECKIT_SUBSTRATE_HERMETIC=1`) and the EPERM-fallback test (now via injectable-writer `writeSummaryWithFallback`) are both implemented and verified.
<!-- /ANCHOR:limitations -->

---
