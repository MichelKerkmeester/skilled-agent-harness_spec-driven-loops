---
title: "Implementation Summary: OpenCode Temp Worker Reaping and Vitest Runaway Prevention"
description: "Layer 0 (launcher-lease vitest lifecycle fix) and Layer 1 (orphan-mcp-sweeper embedder-sidecar classification) shipped and verified. Activation, sweeper hardening, and the embedder demand-listener fix remain, several gated behind operator approval."
trigger_phrases:
  - "opencode temp worker reaping"
  - "session process cleanup"
  - "orphan worker reaping"
  - "vitest runaway prevention"
  - "mcp helper lifecycle"
  - "daemon reaper"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/040-opencode-temp-worker-reaping"
    last_updated_at: "2026-07-11T09:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Documented Layer 0 + Layer 1 as shipped/verified; promoted packet to Level 2 In Progress"
    next_safe_action: "Await operator go-ahead on activation, then build sweeper hardening"
    blockers:
      - "Operator approval needed for stop-hook live flip and launchd install"
      - "REQ-005 packet scoping decision pending"
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doc-update-030-daemon-reaper"
      parent_session_id: null
    completion_pct: 55
    open_questions:
      - "Should REQ-005 (demand-listener re-arm) ship in this packet or a new one?"
      - "Does launcher-ipc-bridge.vitest.ts's independently-scoped spawnLauncher helper share root cause A's leak risk profile? Not investigated."
    answered_questions:
      - "Which lifecycle hook owns the reap? -> existing stop-hook (SPECKIT_STOP_HOOK_ORPHAN_SWEEP), not activated live yet."
      - "Should the Vitest runaway guard be global or per-suite? -> Superseded; the real leak was one suite's daemon-lifecycle bug, fixed at the source."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-opencode-temp-worker-reaping |
| **Completed** | In Progress - shipped layers verified 2026-07-11; activation, sweeper hardening, and the embedder demand-listener fix remain |
| **Level** | 2 |
| **Actual Effort** | This session: investigation + two shipped fixes + operational recovery (~3-4 hours) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Chased down why `context-server.js` daemons kept piling up - 51 of them were alive when this investigation started, with start times spread across two days - and found the real source wasn't general worker sprawl, it was one test suite's lifecycle contract. `launcher-lease.vitest.ts` spawns a launcher that spawns its daemon detached and unref'd. Under the default-on daemon re-election, the launcher's shutdown path *releases* that daemon "for adoption" instead of killing it, so when the test's `afterEach` tore down the launcher and deleted the temp workspace, the daemon just kept running, reparented to pid 1. That one behavior accounted for roughly 97% of the pile-up.

Fixed it at the source in the test harness: `spawnLauncher` now defaults `SPECKIT_DAEMON_REELECTION=0`, so during these lifecycle tests the launcher owns and kills its own daemon child on exit - which is the actual contract these tests are asserting in the first place. Added a defense-in-depth hard-kill in `afterEach` on top of that, so even a test that flips re-election back on for its own purposes still can't leak. Re-ran the suite: 6/11 passing before, 10/11 after, with the four newly-passing tests being exactly the cleanup assertions the release-not-kill path was breaking. Captured a baseline first (the unmodified test failed the same 5 assertions) to be sure this wasn't a coincidental flip.

The second root cause was separate: the embedder runs in its own `hf-model-server` sidecar, started only by the owning launcher's demand listener. When re-election churn kills the owner minutes after it arms that listener, daemon adoption hands off the daemon but nobody re-arms the demand listener - so the sidecar's socket goes missing and every embedding call retries for 45-150 seconds before giving up. The actual full fix (re-arming the listener on adoption) is scoped but not built yet; what shipped this session is the piece that keeps the sweeper honest about the sidecar in the meantime: `orphan-mcp-sweeper.sh` now classifies `hf-model-server` and extends its existing "don't reap anything with more than one live unix-socket connection" rule to count `hf-embed.sock`, so a sidecar that's actually serving a peer gets preserved instead of becoming the next unknown-process problem.

On the operational side (not a code change, just cleanup): killed the 32 zombie daemons that had already accumulated, restarted the one that was wedged, rebuilt its native `better-sqlite3` module against the running Node's ABI, and confirmed the database came through clean.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Default off daemon re-election in the test's `spawnLauncher` helper; `afterEach` hard-kill of lease-recorded daemon/model-server pids before temp-root cleanup (commit `90a2462721`) |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modified | Classify the `hf-model-server` sidecar; extend the busy-preserve rule to count `hf-embed.sock` connections (commit `d4be07abbc`) |

No production runtime file was modified this pass - both fixes are test-harness and shell-script scoped. The operational cleanup (zombie kill, daemon restart, native module rebuild) touched running processes and the on-disk native module cache, not source files.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root-caused first, fixed second: traced both leak paths to specific lines before writing anything, so the fix targets the actual mechanism (release-not-kill under re-election, and the demand-listener ownership gap) rather than papering over the symptom with a generic worker-concurrency cap. What gives confidence this works is the baseline-then-fix discipline on Layer 0 - the unmodified test's 5 failures were captured first, so the jump to 10/11 after the fix is attributable to the change, not noise. Layer 1 leaned on the sweeper's existing socket-FD detection pattern rather than inventing new classification logic, then verified it against a real, live daemon with `--dry-run --verbose`, not just the unit-test fixtures.

The remaining work (activation, hardening, the demand-listener fix) is deliberately staged rather than rushed: activation is an operator-gated flip of existing flags/cron, and the two remaining code changes touch either delicate process-killer logic or production daemon lifecycle - both flagged for a follow-up pass rather than bundled into this one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fix the test-harness default rather than build a generic Vitest runaway guard | Investigation showed a single, specific lifecycle bug (release-not-kill under re-election), not general worker sprawl - a concurrency cap would have bounded the symptom without fixing the cause |
| Default-off re-election scoped to the test harness (`spawnLauncher` in the test file), not the production launcher default | The tests' actual contract is single-owner lifecycle; changing the production-wide default was out of scope and higher blast radius than this fix needed |
| Extend the sweeper's existing socket-FD rule rather than write new sidecar-detection logic | Reuses a pattern already proven against the daemon itself; lower risk than inventing a parallel detection mechanism |
| Defer stop-hook/launchd activation to the operator | Both are one-line flag/install flips with real production reach; dry-run log review before going live is the appropriate gate, not something to self-approve |
| Recommend the embedder demand-listener fix as a separate packet | It changes production daemon lifecycle ownership semantics - high blast radius, deserves its own scoped review rather than riding along with this packet's test-harness-scoped fixes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Unit (launcher-lease) | Pass | 10/11 (was 6/11) | 1 remaining failure is pre-existing and unrelated (dead-socket adoption timeout, reproduces identically with/without this fix) |
| Unit (sweeper) | Pass | 3/3 + 4/4 | `orphan-sweeper-ipc-preserve.vitest.ts` and `launcher-stop-hook-orphan-sweep.vitest.ts` |
| Manual (live dry-run) | Pass | - | `--dry-run --verbose` against the real daemon: pid 42293 preserved (`reason=active-ipc-socket-connection`), only genuinely orphaned ~2.4h helpers flagged |
| Operational (DB integrity) | Pass | - | `PRAGMA integrity_check = ok`, 12,801 memories intact after daemon rebuild |
| Checklist | Partial | 14/18 items verified | 4 items explicitly deferred to REQ-003/004/005, see `checklist.md` |

### Test Coverage Summary

| File | Before | After |
|------|--------|-------|
| `launcher-lease.vitest.ts` | 6/11 passing | 10/11 passing |
| `orphan-sweeper-ipc-preserve.vitest.ts` | N/A (new coverage for sidecar) | 3/3 passing |
| `launcher-stop-hook-orphan-sweep.vitest.ts` | N/A (new coverage for sidecar) | 4/4 passing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | No 45-150s embedder retry-then-fail after the demand-listener fix | Not applicable yet - fix not built | Pending |
| NFR-R01 | Daemon SQLite store intact through operational recovery | `PRAGMA integrity_check = ok`, 12,801 memories intact | Pass |
| NFR-R02 | `afterEach` hard-kill runs regardless of earlier test-assertion outcome | Confirmed defense-in-depth, not status-conditional | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The packet is not complete.** REQ-003 (stop-hook/launchd activation), REQ-004 (sweeper hardening: maintenance-marker respect, singleton rule, pid-reuse re-check), and REQ-005 (embedder demand-listener re-arm) are all scoped but not built. `memory_index_scan` will keep hanging on a missing `hf-embed.sock` until REQ-005 ships.
2. **`launcher-ipc-bridge.vitest.ts` was not investigated.** It has its own independently-scoped `spawnLauncher` helper (different signature from the one fixed here); whether it shares root cause A's leak risk profile is an open question, not assumed answered.
3. **The stop-hook and launchd cron reaper are not live.** Both mechanisms already existed before this phase; this phase did not activate them - that is explicitly staged behind operator review of dry-run logs.
4. **The embedder demand-listener gap is unresolved.** The sweeper now knows how to *classify* the `hf-model-server` sidecar safely, but nothing yet re-arms the demand listener on daemon adoption, so the wedge that caused this investigation's original `memory_index_scan` hang can still recur until REQ-005 ships.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Original scaffold envisioned a generic "session-scoped reaper" and a "Vitest runaway-worker guard" (concurrency cap + stale-worker reaping) | Built a targeted fix for one specific test-lifecycle bug (release-not-kill under re-election) plus sweeper sidecar classification | Investigation found the actual leak was a single, precise lifecycle contract violation, not generic worker sprawl - a concurrency cap would have bounded the symptom rather than fixing the cause |
| Original scaffold implied this phase would fully close out reaping | This pass ships 2 of 5 requirements (REQ-001, REQ-002); REQ-003/004/005 remain, several operator-gated | Root-cause investigation surfaced more precisely-scoped remaining work than the original scaffold anticipated; recorded as pending phases/tasks rather than force-completed |

<!-- /ANCHOR:deviations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 addendum
- Honest In Progress status: shipped layers verified, remaining work explicitly scoped
- Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
