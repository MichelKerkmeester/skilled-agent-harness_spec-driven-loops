---
title: "Implementation Summary: Needs-Rebuild Sentinel Corruption-Class Mishandling"
description: "Status: COMPLETE (Tier 1 shipped). The corruption-class .needs-rebuild sentinel is now distinguishable from the derived-only class and the wrong SQL repair path is skipped for it; verified by unit tests and a real forced-corruption boot reproduction. Tier 2 (in-band auto-recovery) remains explicitly deferred."
trigger_phrases:
  - "rebuild sentinel corruption handling status"
  - "034 complete"
  - "needs-rebuild sentinel impl summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/034-rebuild-sentinel-corruption-handling"
    last_updated_at: "2026-07-08T19:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented, tested, and boot-verified the Tier 1 sentinel-class fix"
    next_safe_action: "None required; Tier 2 in-band recovery is a genuinely separate future packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-034-rebuild-sentinel-corruption-handling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the operator want a dedicated launcher exit code for this failure mode? -> Not built here (Tier 2 candidate); the existing generic crash-loop guard already bounds retries regardless of exit code."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-rebuild-sentinel-corruption-handling |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: COMPLETE (Tier 1).** The `.needs-rebuild` sentinel's two failure classes — half-finished
checkpoint restores (derived-artifacts-only, safe to auto-repair) and physical page corruption
(detected by the post-crash `quick_check(1)` probe) — are now distinguishable via a shared
`source` constant, and the single real repair choke point (`repairNeedsRebuildSentinel`) skips
the wrong SQL-rebuild path when the sentinel is corruption-class, instead of blindly running
repair statements against tables the daemon itself already proved physically unsound. Tier 2
(true in-band auto-recovery within the same failed boot) remains explicitly out of scope — see
Known Limitations.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts` | Modify | Added exported `NEEDS_REBUILD_SENTINEL_SOURCE = { CORRUPTION, SWAP_RECOVERY }` constant. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Both sentinel writers now use the shared constant instead of raw string literals; the quick_check-failure throw is tagged `{ needsRebuildCorruption: true }`; `get_needs_rebuild_sentinel_path` is now exported. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts` | Modify | Added `get_needs_rebuild_sentinel_path` to the named re-export list, so `context-server.ts` (which only ever imports `vectorIndex` as a namespace from this file) can reach it — a small prerequisite the plan implied but didn't call out explicitly. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Additive corruption-aware log branch in the init catch block (`:1978-1986`ish), before the unchanged re-throw. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Modify | New `readNeedsRebuildSentinelSource(database)` helper; corruption-class skip branch inside `repairNeedsRebuildSentinel`, immediately after the existing `hasNeedsRebuildSentinel` early-return. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-needs-rebuild-sentinel.vitest.ts` | Modify | Added the corruption-source skip case and a dedicated `swap_done_recovery` side-by-side case. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store-durability.vitest.ts` | Modify | Added a real (not mocked) forced-corruption test asserting the thrown error carries `needsRebuildCorruption: true`. |
| `.opencode/skills/system-spec-kit/mcp_server/database/checkpoints/README.md` | Modify | Documented the two sentinel classes explicitly (§4 table) and the manual recovery procedure (§5). |

No file-list deviation from the plan this time — every file it named was the right one; the only
addition (`vector-index.ts`'s re-export list) is a small, necessary prerequisite for T007's
export to actually be reachable from `context-server.ts`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Exactly as planned: a shared sentinel-source constant, an error tag on the quick_check-failure
throw, additive boot-time logging, and a corruption-class skip branch inside the single existing
`repairNeedsRebuildSentinel` choke point — no new consumer, no new call sites, no attempt at
in-band auto-recovery.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document as a standalone sibling of `033-boot-wal-shm-sigbus-fix`, not merged | Independent root causes, no overlapping mechanism, non-adjacent line ranges across different files; bundling would blur two very different verification stories (see spec.md Background). |
| Explicitly defer true in-band auto-restore-and-retry as Tier 2 rather than attempt it | `restoreCheckpointV2`/`reopenActiveDatabase` depend on `vector-index-store.ts`'s module-singleton connection state, unreachable in this exact failure mode without a real refactor — new-capability work, not a bug fix. |
| Fix the one real consumer choke point (`repairNeedsRebuildSentinel`), not each of its three callers | Protects all three real call sites through a single change, no per-caller duplication. |
| State the Tier-2 gap honestly in every completion doc | Per the Iron Law: no completion claims beyond what was verified. Tier 1 improves signal quality and stops the wrong repair path from running against physically corrupt tables, but does not restore boot capability after a genuine corruption event. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck (`npx tsc --noEmit --composite false -p tsconfig.json`) | PASS, 0 errors |
| Build (`npm run build`) | PASS; `dist/lib/search/vector-index-types.js`, `dist/lib/search/vector-index-store.js`, `dist/lib/storage/checkpoints.js`, `dist/context-server.js` all confirmed via `grep` to contain the fix |
| Unit tests: `checkpoint-needs-rebuild-sentinel.vitest.ts` | PASS, 4/4 (2 pre-existing + corruption-skip case + swap-recovery side-by-side case) |
| Unit tests: `vector-index-store-durability.vitest.ts` | PASS, 4/4 (3 pre-existing + real forced-corruption tag test) |
| Full boot-path regression (`context-server.vitest.ts`, `vector-index-store-durability.vitest.ts`, `checkpoint-needs-rebuild-sentinel.vitest.ts`, `startup-checks.vitest.ts`, all `launcher-*.vitest.ts`, `handler-memory-index*.vitest.ts`, `vector-index-store.vitest.ts`) | 588/632 passed, 44 skipped/failed. **Baseline-confirmed 0 regressions**: stashed this packet's 6 source + 3 test files, re-ran the identical suite against the unmodified tree — the same 8 tests failed identically (5 `launcher-lease.vitest.ts` process-reaping, 2 `handler-memory-index*.vitest.ts`, 1 `launcher-code-index-lifecycle.vitest.ts` static-string-check — none touch this packet's files). Re-applied the fix afterward; diff intact (9 files, +284/-12 lines). |
| Corruption-vs-derived-only side by side (REQ-003/SC-002) | CONFIRMED: same `createHealthyDatabase` fixture, corruption-source sentinel → `attempted: false, cleared: false`, sentinel persists; `swap_done_recovery`-source sentinel → `attempted: true, cleared: true`, sentinel clears — proves the skip is driven by `source`, not by fixture health. |
| Real forced quick_check failure (REQ-002) | CONFIRMED via direct byte-level corruption of a real SQLite file (not a mock): overwrote 8KB past the file header on a real schema-backed DB, triggered a genuine `btreeInitPage()` corruption error from SQLite itself; the thrown `VectorIndexError` carries `needsRebuildCorruption === true`. |
| Real boot-level reproduction (T015/CHK-023) | CONFIRMED the sentinel-write mechanism (REQ-001/002) fires correctly on a real compiled-daemon boot against a disposable, physically corrupted scratch DB (never touched the shared production daemon), reproduced twice consecutively with identical results (sentinel `source: post_crash_integrity_probe`, real corruption detail text, exit code 1 both times — no silent progress between boots). **Finding, not glossed over**: the specific new log lines in `context-server.ts`'s catch block did not fire in this reproduction because a separate, pre-existing code path (`runBootFtsIntegrityCheckAttempt`, scheduled via a 0ms timer, independently calling `vectorIndex.getDb()` when the same `.unclean-shutdown` marker is present) reached the corrupted DB first and surfaced via the generic `Uncaught exception` handler instead. See "Discovered During Verification" below. |
| `validate.sh --strict` | PASS, Errors: 0, Warnings: 0 (final run, post-doc-update) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:lessons -->
## Discovered During Verification (not in the original investigation or plan)

The live boot-level reproduction surfaced a real architectural detail neither the source
investigation nor this packet's own plan had analyzed: **`initialize_db()` has more than one
real, independent trigger path.** The plan scoped its additive logging to exactly the call site
it investigated — `registerInitTasks`'s callback in `context-server.ts` (`:1978-1986`), reached
via `ensureMemoryRuntimeInitialized` on the first real MCP tool dispatch. That is correct and
works exactly as designed when it is the first caller to reach `initialize_db()`.

However, `vectorIndex.getDb()` is documented in-repo as "an initializing accessor" — calling it
also triggers `initialize_db()` if not already open. A completely separate, pre-existing
mechanism, `scheduleBootFtsIntegrityCheck()` → `runBootFtsIntegrityCheckAttempt()`, calls
`getDb()` directly, gated on the exact same `.unclean-shutdown` marker this packet's corruption
probe also gates on, scheduled via `registerTimeout(fn, 0)` (an effectively-immediate timer).
In the live reproduction, this timer consistently won the race against any external MCP client's
real round-trip latency, so the corruption was detected via `getDb()`'s direct call, not via the
`registerInitTasks` path this packet's logging protects.

**This does not weaken the actual fix** (REQ-001-004: the sentinel-source constant, the error
tag, and the repair-skip branch) — those all live inside `initialize_db()`/`repairNeedsRebuildSentinel`
themselves and fire identically regardless of which caller reaches them first, confirmed by the
same reproduction. It only means REQ-005's specific new log lines are less likely, in practice, to
be the ones an operator actually sees for this exact trigger condition (unclean-shutdown marker +
corrupt DB) — the generic uncaught-exception handler's stack trace still surfaces the sentinel
write and the underlying SQLite error either way, just without this packet's added
manual-restore pointer. Extending the same style of logging to `runBootFtsIntegrityCheckAttempt`'s
catch path (or elsewhere) is a small, separable candidate for a future follow-up — **not
attempted here**, since it was never part of this packet's investigated scope and adding it now
would be uncontrolled scope expansion mid-implementation rather than a planned fix.
<!-- /ANCHOR:lessons -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Tier 2 (true in-band auto-recovery) is not built.** The daemon still refuses to boot
   (correctly, fail-safe) after a genuine corruption event, with only a manual recovery path
   available (documented in `database/checkpoints/README.md` §5). Tier 1 makes corruption
   distinguishable, stops the wrong (derived-only) repair path from running against physically
   corrupt tables, and adds boot-time logging for one of at least two real trigger paths — it does
   not add automatic recovery. This must not be implied as solved.
2. **REQ-005's additive logging is caller-path-dependent** (see "Discovered During Verification"
   above) — confirmed correct by code review and would fire for its named call site, but in the
   live reproduction a separate, pre-existing, out-of-scope code path reached the corruption
   first in practice. The core detection/tagging/skip-branch fix (REQ-001-004) is unaffected and
   fully verified either way.
<!-- /ANCHOR:limitations -->
