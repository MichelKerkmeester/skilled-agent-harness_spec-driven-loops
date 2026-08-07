---
title: "Implementation Summary"
description: "Three independent hardening fixes implemented and verified over the already-shipped package-011 self-healing implementation."
trigger_phrases:
  - "self-healing internals hardening"
  - "drift-suspect write latency guard"
  - "processing marker sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/020-self-healing-internals-hardening"
    last_updated_at: "2026-07-10T19:12:49.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-014-self-healing-internals-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F8: resolved to per-write busy_timeout pragma toggle (25ms)"
      - "F12: resolved to merge-all for multiple stale processing files"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-self-healing-internals-hardening |
| **Status** | Implemented; all three fixes (F8/F11/F12) built and verified per this document's Verification section |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All three fixes are implemented over the already-shipped package-011 (`011-automatic-drift-self-healing`)
implementation, per plan.md's approach with no deviation. A fourth candidate finding from the same review
round, F13, was investigated and refuted before this build started (see spec.md Out of Scope) and is not
carried by this packet.

### F8 -- bounded suspect-write timeout (implemented)

The synchronous drift-suspect INSERT triggered from the query-time existence filter
(`memory-search.ts:418`, calling `appendMemoryDriftSuspects`) now has its worst-case added latency bounded
to `DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS = 25` ms, well below the connection's `busy_timeout = 10000`
(`vector-index-store.ts:2132`), via a temporary per-write pragma toggle: the connection's current
`busy_timeout` is read, lowered to 25ms, the write is attempted inside the existing try/catch, and the
original value is restored unconditionally in a `finally`. This is a hard prerequisite before
`SPECKIT_QUERY_TIME_EXISTENCE_FILTER` (still default-off, unchanged by this packet) is ever graduated to
default-on in a future phase -- it is not itself a graduation of that flag.

### F12 -- stale processing-marker sweep (implemented)

`consumeMemoryDriftDirtyMarker` (`startup-checks.ts`) only restores its claimed
`.processing-<pid>-<timestamp>` marker file on a caught throw from within its own try block. A new function,
`sweepStaleMemoryDriftProcessingMarkers` (`startup-checks.ts`), wired into `context-server.ts`'s boot
sequence immediately before the existing `consumeMemoryDriftDirtyMarker` call, now recovers a stale
processing file left by a boot that was killed externally (e.g. by an MCP client init-timeout watchdog)
rather than by a catchable internal error. Merge policy: merge-all -- every stale `.processing-*` file found
is read, its entries merged (deduped by the existing `memoryDriftMarkerEntryKey`) into the canonical marker
path (merging into, not clobbering, a live marker if one exists), and the stale file removed; a
malformed/unreadable stale file is logged and skipped, not a boot failure.

### F11 -- suspect-queue read warning (implemented)

`readMemoryDriftSuspects`'s catch block (`memory-drift-healing.ts:98`) now logs a single `console.warn`
naming the failure (using the same `error instanceof Error ? error.message : String(error)` safe
stringification pattern used elsewhere in this codebase) before falling back to `[]`, unchanged from today's
return value.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts` | Modified | F11: log the swallowed read error in `readMemoryDriftSuspects`'s catch block |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | F8: added `DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS` constant and the pragma-toggle-and-restore wrapper around the `appendMemoryDriftSuspects` call site (`:418`) |
| `.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts` | Modified | F12: added `sweepStaleMemoryDriftProcessingMarkers` and the `MemoryDriftProcessingSweepResult` type |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | F12: wired the sweep into the boot sequence immediately before the existing marker-consume call |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-drift-healing.vitest.ts` | Modified | F11 tests: forced-read-failure warning, successful-read silence |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-drift-suspect-write-timeout.vitest.ts` | Created | F8 tests: baseline mechanism proof, REQ-001 fast-fail bound, busy_timeout restore, normal write, non-timeout failure |
| `.opencode/skills/system-spec-kit/mcp_server/tests/startup-checks.vitest.ts` | Modified | F12 unit tests: no-op paths, merge-all, malformed file, live-marker merge |
| `.opencode/skills/system-spec-kit/mcp_server/tests/startup-checks-processing-marker-sigkill.vitest.ts` | Created | F12 acceptance test: the exact confirmed SIGKILL-mid-consume repro, via a real spawned child process |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All three fixes were implemented directly per plan.md's approach, with no deviation and no need to fall back
to F8's documented deferred-write alternative -- the pragma-toggle mechanism worked as designed. Each fix is
independently shippable and additive: none introduces a new feature flag, a new abstraction, or a new
always-on process. F8 touches the search hot path and received the most verification weight (two dedicated
lock-contention tests plus a busy_timeout-restore test); F11 and F12 are small, low-risk additions to
already-existing error-handling and boot-check surfaces, each covered by dedicated tests including F12's
real-SIGKILL acceptance test.

`npm run typecheck` and `npm run build` (`tsc --build && finalize-dist.mjs`) both ran clean (0 errors) after
the source edits; `dist/` was confirmed to contain the compiled changes (`DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS`
in `dist/handlers/memory-search.js`, `sweepStaleMemoryDriftProcessingMarkers` in `dist/startup-checks.js` and
wired into `dist/context-server.js`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

These are the design decisions the spec and plan locked, plus two resolved during implementation.

| Decision | Why |
|----------|-----|
| Fix all three findings as real code changes, not defer-and-monitor notes | Each finding's own text asks for a concrete, narrowly scoped fix (a log line for F11, a sweep for F12), and the fixes are cheap relative to the value of closing them |
| F8 gets P0 treatment inside this packet despite being flag-gated OFF today | It is a hard prerequisite before `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` can ever be graduated; leaving it unfixed would be a landmine for that future decision |
| F13 dropped from scope after verification | Tested and refuted, then independently reconfirmed refuted by a structural code-walk showing the scenario is structurally impossible in this codebase (spec.md Out of Scope) |
| F8's mechanism: per-write `busy_timeout` pragma toggle (25ms), not a new timer or watcher | `better-sqlite3` is fully synchronous and Node is single-threaded, so a toggle-and-restore around one statement is safe and requires no new infrastructure; confirmed working during implementation, no need for the documented deferred-write fallback |
| F12's sweep reuses `consumeMemoryDriftDirtyMarker` for actual consumption rather than duplicating its scoped-scan logic | The sweep's only new responsibility is getting a stale file back into the shape the existing, already-correct consumer already knows how to handle |
| F12's merge policy: merge-all, not restore-most-recent-only | Every stale claim file represents entries a killed boot never finished processing; none are individually recoverable later, so merging all of them (deduped) avoids silently losing any entry's chance at Layer 2 auto-healing |
| F8's no committed "two-process lock-contention test" existed to literally reuse | Grepped the full repo for `10293`/`busy_timeout`-based suspect-write tests; none existed. Rebuilt the exact mechanism (two independent connections to the same on-disk file contending for a write lock) following this codebase's own established convention from `n3lite-consolidation.vitest.ts` ("mirrors a separate CLI front-door process") rather than inventing a new pattern |
| F12's SIGKILL repro uses a real spawned child process (via the `tsx` loader already vendored under `scripts/node_modules`), not a simulated on-disk state | The spec's acceptance criterion explicitly calls for an actual external SIGKILL after the real rename-claim; simulating the on-disk state directly would prove less than what was asked for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All figures below are confirmed by directly executed commands in this session, not inferred.

| Check | Result |
|-------|--------|
| `npm run typecheck` (`tsc --noEmit --composite false`) | PASS, 0 errors |
| `npm run build` (`tsc --build && finalize-dist.mjs`) | PASS, 0 errors; `dist/` confirmed to contain the compiled F8/F12 changes |
| F8 implementation | Done -- `memory-search.ts` pragma-toggle around `appendMemoryDriftSuspects` |
| F11 implementation | Done -- `memory-drift-healing.ts` catch-block warning |
| F12 implementation | Done -- `startup-checks.ts` `sweepStaleMemoryDriftProcessingMarkers`, wired in `context-server.ts` |
| Package 011 regression suites, unchanged (`memory-drift-healing.vitest.ts`, `memory-roadmap-flags.vitest.ts`, `orphan-sweep-corpus-repair.vitest.ts`, `startup-checks.vitest.ts`) | **PASS** -- 0 regressions (re-run fresh as the final check) |
| New F8/F11/F12 tests (`memory-search-drift-suspect-write-timeout.vitest.ts`, `startup-checks-processing-marker-sigkill.vitest.ts`, plus additions to `memory-drift-healing.vitest.ts` and `startup-checks.vitest.ts`) | **PASS** |
| Combined total for the above six suite files | **54/54 tests PASS** |
| Broader blast-radius run: every test file in `mcp_server/tests/` that imports `memory-search.ts`, `startup-checks.ts`, `context-server.ts`, or `memory-drift-healing.ts` (36 files total, including the six above) | 27 files fully pass; 9 files have 20 pre-existing failures. **Confirmed pre-existing and unrelated to this packet** by diffing this packet's actual source delta against the pre-011 `HEAD` commit: the failing tests concern input-validation error-message wording (`memory-search-integration.vitest.ts`), a BM25 fallback cascade (`memory-search-integration.vitest.ts`), a `statSyncCalls` micro-count assertion (`search-hot-path-performance.vitest.ts`), token-budget enforcement math (`token-budget-enforcement.vitest.ts`), and stale module line-count ceilings (`modularization.vitest.ts`, failing on files this packet never touched too, e.g. `core/db-state.js`, `handlers/memory-index.js`). None of these paths intersect this packet's actual diff, which is limited to: an import + a 4-line constant + a ~15-line pragma-toggle wrapper in `memory-search.ts`; one warning line in `memory-drift-healing.ts`; one new function (~105 lines) plus its wiring in `startup-checks.ts`/`context-server.ts`. The working tree already carried substantial uncommitted package-011/012+ work before this session started (confirmed via `git diff HEAD`: `startup-checks.ts` was 184 lines at `HEAD` vs. 430 lines including this packet's own +105); the pre-existing failures predate this packet. |
| Full monorepo suite (`vitest run`, ~684 files, `fileParallelism: false`) | **Attempted, inconclusive.** Started in the background; progressed cleanly through ~600+ files (confirmed passing tests in the log, including unrelated `scripts/tests/*` and `../system-deep-loop/**` suites) before stalling with 0% CPU for 35+ seconds partway through `scripts/tests/`. Given this session's explicit constraint that shared daemon infrastructure may be live under other concurrent sessions, the stalled run was killed rather than risk holding a lock or resource other sessions depend on, instead of waiting indefinitely. The narrower, still-thorough 36-file blast-radius run above is the operative full-relevant-suite evidence for this packet's actual code delta. |
| Spec-kit doc-set (`validate.sh --strict`) | See below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No committed baseline test existed to literally reuse for F8 or F12.** Both "confirmed exact repro"
   tests referenced by spec.md/tasks.md were rebuilt from the described mechanism (two-connection lock
   contention; SIGKILL after the rename-claim), following this codebase's own established test conventions,
   rather than extending a pre-existing test file -- because no such file existed in the repo at the time of
   this implementation (confirmed by a repo-wide grep for `10293`, `busy_timeout`, and `SIGKILL` scoped to
   `mcp_server` before starting).
2. **F8's fast-fail bound (25ms) is a fixed constant, not configurable.** The spec's target was "under 100ms";
   25ms was chosen to leave comfortable headroom (a ~30ms measured worst case in testing) while still giving
   a normal, non-contended write a realistic chance to succeed. Not exposed as an env var/flag, matching
   NFR-R01 (no new capability flag).
3. **The full monorepo test suite (~684 files) was not completed end-to-end** in this session -- it stalled
   partway through an unrelated suite and was killed rather than risk contending with other concurrent
   sessions' live daemon state. The 36-file blast-radius run (every test that imports the four touched
   modules) is the operative full-relevant-suite evidence; see Verification above for what it covered and
   what it found.
4. **No hard blocking dependency**, but F8's fix has a *forward* dependency: it must land before any future
   phase graduates `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` to default-on. That graduation decision itself is
   explicitly out of scope for this phase, and this packet does not change the flag's default (confirmed
   unchanged in `capability-flags.ts`).
<!-- /ANCHOR:limitations -->
