---
title: "Tasks: Needs-Rebuild Sentinel Corruption-Class Mishandling"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rebuild sentinel corruption handling tasks"
  - "needs-rebuild sentinel source constant tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/034-rebuild-sentinel-corruption-handling"
    last_updated_at: "2026-07-08T16:02:23Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only task list from plan.md"
    next_safe_action: "Plan approval, then execute Phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-034-rebuild-sentinel-corruption-handling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Needs-Rebuild Sentinel Corruption-Class Mishandling

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Re-confirm the current sentinel writers (`rg -n "post_crash_integrity_probe|swap_done_recovery" .opencode/skills/system-spec-kit/mcp_server`) and `repairNeedsRebuildSentinel`'s three real callers (`rg -n "repairNeedsRebuildSentinel|runCheckpointNeedsRebuildRepair" .opencode/skills/system-spec-kit/mcp_server`) against the working tree, in case a concurrent session has touched any of these files since this plan was written (.opencode/skills/system-spec-kit/mcp_server) — confirmed unchanged: writers at `:1340`/`:1366`, callers at `context-server.ts:2250`/`:2451` (plan cited `:2253`/`:2454`, off by a few lines due to unrelated drift, same functions) and `handlers/memory-index.ts:292`.
- [x] T002 Re-confirm the `speckitInitHardFail` tag idiom's exact shape at `context-server.ts:2071-2074` as the pattern to mirror for the new `needsRebuildCorruption` tag — confirmed: `Object.assign(new Error(...), { speckitInitHardFail: true })`, read via `(err as { speckitInitHardFail?: boolean }).speckitInitHardFail`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add exported `NEEDS_REBUILD_SENTINEL_SOURCE = { CORRUPTION: 'post_crash_integrity_probe', SWAP_RECOVERY: 'swap_done_recovery' }` (.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts)
- [x] T004 [P] Replace the raw `'swap_done_recovery'` literal with the shared constant at the restore-recovery sentinel writer (.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:~1328-1340)
- [x] T005 [P] Replace the raw `'post_crash_integrity_probe'` literal with the shared constant in `write_needs_rebuild_sentinel_for_corruption` (.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1352-1375)
- [x] T006 Tag the quick_check-failure throw with `{ needsRebuildCorruption: true }`, mirroring the `speckitInitHardFail` idiom from T002 (.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:~2172-2174)
- [x] T007 Export `get_needs_rebuild_sentinel_path` (currently private) (.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1217) — also added to `vector-index.ts`'s named re-export list (a prerequisite the plan didn't explicitly call out, since `context-server.ts` only ever imports `vectorIndex` as a namespace from `vector-index.js`, never directly from `vector-index-store.js`).
- [x] T008 Add the additive corruption-aware log branch to the init catch block, before the unchanged re-throw — name the sentinel path (via T007's export) and point to the manual-restore doc (.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1978-1986)
- [x] T009 Add `readNeedsRebuildSentinelSource(database): string | null` helper (best-effort JSON read via the existing `getNeedsRebuildSentinelPathForDatabase` path, matching the file's established defensive try/catch style; fails safe to `null` on any read error) (.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
- [x] T010 Add the corruption-class skip branch inside `repairNeedsRebuildSentinel`, immediately after the existing `hasNeedsRebuildSentinel` early-return: if `readNeedsRebuildSentinelSource(database) === NEEDS_REBUILD_SENTINEL_SOURCE.CORRUPTION`, skip `runDerivedArtifactRebuilds`, return `{ sentinelPresent: true, attempted: false, cleared: false, summary: null, error: null }` with a warn log (.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2021-2079)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 `node --check` (or project TS build) on all touched files — `npx tsc --noEmit --composite false -p tsconfig.json`: 0 errors.
- [x] T012 Extend `checkpoint-needs-rebuild-sentinel.vitest.ts` with a corruption-source case: write a sentinel with `source: NEEDS_REBUILD_SENTINEL_SOURCE.CORRUPTION` against the file's existing `createHealthyDatabase` fixture; assert `attempted === false`, `cleared === false`, sentinel file still present (.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-needs-rebuild-sentinel.vitest.ts) — added, passes.
- [x] T013 Re-run that suite's existing derived-only/`swap_done_recovery`-equivalent cases unmodified; confirm 0 regressions — proves the skip branch does not leak into the working path — both pre-existing cases pass unmodified; also added a dedicated `swap_done_recovery`-source side-by-side case for extra rigor. 4/4 tests pass in the file.
- [x] T014 Extend `vector-index-store-durability.vitest.ts`: force a quick_check failure, catch the thrown `VectorIndexError`, assert `error.needsRebuildCorruption === true` (.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store-durability.vitest.ts) — added, using REAL physical byte-level corruption (not a mock) against a real SQLite file; passes. 4/4 tests pass in the file.
- [x] T015 Manual/scripted forced-corruption boot against a disposable DB copy: confirm the new log line names the sentinel path and points to the manual-restore doc, and that the daemon's exit code/behavior is byte-identical to before this change — performed via a real compiled-daemon boot (isolated scratch DB, `SPEC_KIT_DB_DIR` override, never touched the shared production daemon), corrupted with real byte-level page corruption, booted twice. Sentinel written correctly both times (`source: post_crash_integrity_probe`, real `btreeInitPage()` error text). **Finding, documented honestly**: in this exact reproduction, the corruption was reached via a separate pre-existing code path (`runBootFtsIntegrityCheckAttempt`'s own `getDb()` call, racing ahead via a 0ms timer, gated on the same `.unclean-shutdown` marker) rather than this packet's new catch-block log branch at `context-server.ts:1978-1986` — see implementation-summary.md for the full analysis. The core sentinel/tag mechanism (T003-T010) is fully confirmed working via this same reproduction; only the specific NEW LOG LINES's real-world firing rate is caller-dependent. Exit behavior (code 1, uncaught-exception handler) was identical across both boots either way.
- [x] T016 Full boot-path regression set — `context-server.vitest.ts`, `vector-index-store-durability.vitest.ts`, `checkpoint-needs-rebuild-sentinel.vitest.ts`, `launcher-*.vitest.ts` — green — 588/632 passed (44 skipped/failed); the 8 failures are baseline-confirmed pre-existing (stash-compared against the unmodified tree: 5 in `launcher-lease.vitest.ts`, 2 in `handler-memory-index*.vitest.ts`, 1 in `launcher-code-index-lifecycle.vitest.ts` — none touch this packet's files).
- [x] T017 `validate.sh --strict` for this packet — PASS, Errors: 0, Warnings: 0.
- [x] T018 Update `database/checkpoints/README.md` to document the two sentinel classes explicitly (.opencode/skills/system-spec-kit/mcp_server/database/checkpoints/README.md) — added a two-class table (§4) and a manual-recovery procedure (§5).
- [x] T019 Document the Tier-2 gap explicitly in `implementation-summary.md`/`checklist.md` — recovery from a genuine corruption event still requires a manual, out-of-band step; no auto-recovery claim — done in both.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] T012/T013's corruption-vs-derived-only comparison both ran and produced the expected, opposite outcomes
- [x] Tests + syntax verification passed
- [x] Tier-2 gap stated honestly in every completion doc (no implied auto-recovery)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Related sibling (independent root cause, same test pass)**: `../033-boot-wal-shm-sigbus-fix/`
<!-- /ANCHOR:cross-refs -->
