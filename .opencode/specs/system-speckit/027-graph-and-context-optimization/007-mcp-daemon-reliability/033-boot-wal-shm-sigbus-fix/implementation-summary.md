---
title: "Implementation Summary: Boot-Time journal_mode Force-WAL SIGBUS Regression"
description: "Status: COMPLETE (Tier 1 fix shipped). The boot-time journal_mode health check no longer force-reverts the DELETE-mode SIGBUS mitigation back to WAL; verified by unit tests (red/green) and three real warm-restart boots against a live MCP handshake."
trigger_phrases:
  - "boot wal shm sigbus fix status"
  - "033 complete"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/033-boot-wal-shm-sigbus-fix"
    last_updated_at: "2026-07-08T18:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented and live-verified the journal_mode fix in startup-checks.ts"
    next_safe_action: "None required; SC-003 SIGBUS monitoring stays observational"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/startup-checks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/startup-checks.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-033-boot-wal-shm-sigbus-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the now-inert 300s checkpointAllWal() interval be guarded to skip the wal_checkpoint pragma call once journal_mode stays DELETE? -> No, left as-is per plan.md's own framing: SQLite documents wal_checkpoint as a harmless no-op on a non-WAL database, and the call is already try/catch-wrapped best-effort. Out of scope for this packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-boot-wal-shm-sigbus-fix |
| **Completed** | 2026-07-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: COMPLETE.** The boot-time health check that silently reverted the 2026-07-05
`journal_mode=DELETE` SIGBUS mitigation (commit `8807393bea`) back to `WAL` on every daemon
restart no longer does so. `DELETE` (and legacy `WAL`, for back-compat) are now treated as
valid, healthy states — no mutation. Any other, truly unexpected mode is logged but never
force-changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts` | Modify | Added `checkJournalMode(db)` — the DELETE-aware boot check, extracted as a small named function next to the pre-existing `checkSqliteVersion(db)` it's called alongside, matching that file's own "non-critical startup checks extracted from context-server.ts" idiom. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Replaced the unconditional force-WAL block (`:2207-2213`) with a call to `checkJournalMode(database)`; imports it from `./startup-checks.js`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/startup-checks.vitest.ts` | Modify | Added a `describe('checkJournalMode', ...)` block: 5 new unit tests (delete no-op, legacy-wal no-op, unexpected-value warn-without-mutate, case-insensitivity, missing/undefined result). |

### Deviation from the plan's literal file list (documented per this repo's deviation-recording rule)

`spec.md`/`plan.md` named `context-server.ts` and `tests/context-server.vitest.ts` as the two
files to change, with the regression test living in `context-server.vitest.ts`'s existing
`databaseMock`/`loadRuntimeHarness` scaffold. On investigation, that harness turned out to be
dead code: nothing in the file actually calls `loadRuntimeHarness()` (confirmed via
`grep -n "loadRuntimeHarness"`, exactly one definition, zero call sites, before this packet).
Attempting to exercise it surfaced a cascading chain of unrelated missing mock exports
(`getStartupEmbeddingProfile`, `ALLOWED_BASE_PATHS` on one of two duplicated `'../core'` mock
variants, `getDbPath`, and more beyond that) plus a real, unmocked `acquireDbInstanceLock()` call
that would perform genuine filesystem locking during a "unit" test. Patching all of that to make
a single new test pass would have meant repairing broad, pre-existing, out-of-scope test-harness
debt — a SCOPE LOCK violation.

Instead, the journal_mode check was extracted into `startup-checks.ts` (which already hosts
`checkSqliteVersion`, called two lines above it in `context-server.ts`, and already has a clean,
working, isolated test file — `startup-checks.vitest.ts` — using plain hand-built mock objects,
no harness). This is the same extraction pattern the codebase already uses for the adjacent
check; it produces a genuinely working, isolated, fast unit test instead of either (a) leaving
the fix untested at the unit level, or (b) unboundedly repairing unrelated dead test scaffolding.
The safety property itself (REQ-001/002/004) is fully covered; only the *file* it lives in and
the *test file* it's verified in differ from the plan's literal list.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A one-block logic fix extracted into a small, directly-testable function
(`checkJournalMode(db)` in `startup-checks.ts`), called from `context-server.ts` in place of the
inline block. No new abstraction beyond the extraction itself; no new call site (same call
position in `main()`'s boot sequence, immediately after `checkSqliteVersion(database)`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document as a standalone sibling of `034-rebuild-sentinel-corruption-handling`, not merged | Independent root causes, no overlapping mechanism, non-adjacent line ranges in the same file; bundling would blur two very different verification stories (see spec.md Background). |
| Fix scoped to the health-check condition only, no change to `vector-index-store.ts`'s DELETE-mode writers | Those writers are already correct; the bug is that something else undoes them, not that they are wrong. |
| Treat crash-report monitoring as observational, not a same-session pass/fail | "No new SIGBUS reports" can only be confirmed over subsequent days of real usage — stating it as closed prematurely would violate the Iron Law (no completion claims beyond what was verified). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck (`npx tsc --noEmit --composite false -p tsconfig.json`) | PASS, 0 errors |
| Build (`npm run build` — `tsc --build && finalize-dist.mjs`) | PASS; `dist/startup-checks.js` and `dist/context-server.js` confirmed to contain the fix (`grep -n checkJournalMode dist/*.js`) |
| Unit tests (`vitest run mcp_server/tests/startup-checks.vitest.ts`) | PASS, 19/19 (14 pre-existing + 5 new `checkJournalMode` cases) |
| Red/green discrimination (REQ-004/T006) | CONFIRMED: temporarily reverted `checkJournalMode`'s body to the original unconditional-force logic — 4 of 5 new tests failed red (the 5th, the always-safe `wal`-unchanged case, correctly passed both ways since that branch was never buggy); restored the fix, all 19 green again. |
| Full boot-path regression (`context-server.vitest.ts` + `startup-checks.vitest.ts` + all `launcher-*.vitest.ts`) | 149 passed / 163 total (6 failed, 8 skipped). **Baseline-confirmed 0 regressions**: stashed this packet's 3 changed files and re-ran the identical suite against the unmodified tree — the same 6 tests failed identically (5 in `launcher-lease.vitest.ts`, a pre-existing PID-file/process-reaping issue in this sandboxed environment; 1 in `launcher-code-index-lifecycle.vitest.ts`, a static string-content assertion against `.opencode/bin/mk-code-index-launcher.cjs`, a file this packet never touches — confirmed clean via `git status`). Re-applied the fix afterward; diff intact. |
| Live restart-loop (SC-001/T008) | CONFIRMED via 3 real warm restarts of the compiled daemon (`node dist/context-server.js`) against an isolated scratch DB dir (`SPEC_KIT_DB_DIR` override — never touched the shared production daemon or any concurrent session's lease). A minimal MCP stdio client performed the real `initialize` handshake and a `tools/call` for `memory_stats` on each boot to force the (lazy, `registerInitTasks`-gated) DB-init path to actually run. All 3 boots: `[spec-kit] SQLite version: ... (meets 3.35.0+ requirement)` logged (confirms the code path was reached), zero `journal_mode`/force-related warnings, and `sqlite3 context-index.sqlite "PRAGMA journal_mode;"` read back `delete` after every boot. Scratch DB dir removed after verification. |
| `validate.sh --strict` | PASS, Errors: 0, Warnings: 0 (final run, post-doc-update) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SC-003 (observational SIGBUS crash-report monitoring) remains open by design.** "No new
   `walIndexReadHdr` SIGBUS crash reports" cannot be confirmed in the same implementation
   session — it requires a monitoring window over subsequent days of real daemon usage. Not
   claimed as closed here, per this repo's Iron Law (no completion claims beyond what was
   verified). Everything same-session-verifiable (the mechanism fix, the regression test's
   red/green proof, and the live restart-loop check) is verified and closed.
2. **Test-file deviation from the plan's literal list**, documented above under "What Was
   Built" — the regression coverage lives in `startup-checks.vitest.ts`, not
   `context-server.vitest.ts`, because the latter's named harness was dead/broken scaffolding.
   The safety property itself is fully covered either way.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
