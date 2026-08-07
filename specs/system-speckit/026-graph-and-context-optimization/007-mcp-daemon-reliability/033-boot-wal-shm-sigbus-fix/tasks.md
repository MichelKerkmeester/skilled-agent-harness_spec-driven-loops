---
title: "Tasks: Boot-Time journal_mode Force-WAL SIGBUS Regression"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "boot wal shm sigbus fix tasks"
  - "journal_mode force wal regression tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/033-boot-wal-shm-sigbus-fix"
    last_updated_at: "2026-07-08T16:02:23Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only task list from plan.md"
    next_safe_action: "Plan approval, then execute Phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-033-boot-wal-shm-sigbus-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Boot-Time journal_mode Force-WAL SIGBUS Regression

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Re-confirm `journal_mode` writers/readers against the working tree via `rg -n "journal_mode" .opencode/skills/system-spec-kit/mcp_server`, in case a concurrent session has touched either file since this plan was written (.opencode/skills/system-spec-kit/mcp_server) — confirmed unchanged: `:817`/`:1575`/`:2130` still DELETE writers, `:2208`/`:2211` still the target reader/mutator.
- [x] T002 Re-read commit `8807393bea` (`git show 8807393bea`) and re-confirm the target block (`context-server.ts:2207-2213`) is still unchanged since that commit — confirmed via `git show --stat` (only `vector-index-store.ts` touched) and direct `Read` of the live block.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the unconditional `if (journalMode !== 'wal') { forceWAL() }` block with a DELETE-aware check: no mutation when `journalMode === 'delete'`; warn only (no mutation) for any other unexpected value (.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2207-2213) — implemented as `checkJournalMode(db)`, extracted into `startup-checks.ts` (see implementation-summary.md for why) and called from `context-server.ts`.
- [x] T004 Add a durable-WHY comment on the replaced block explaining the WAL/-shm SIGBUS mechanism this check deliberately avoids reintroducing, without embedding any spec/packet/commit id (.opencode/skills/system-spec-kit/mcp_server/context-server.ts) — JSDoc comment on `checkJournalMode` in `startup-checks.ts` plus a short pointer comment at the `context-server.ts` call site; no ids embedded.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Add a regression test to `context-server.vitest.ts` asserting `database.pragma('journal_mode = WAL')` is never called when the mocked `PRAGMA journal_mode` result is `'delete'` (.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts) — **deviation**: added to `tests/startup-checks.vitest.ts` instead; `context-server.vitest.ts`'s `loadRuntimeHarness` was dead/unexercised scaffolding requiring a cascade of unrelated mock repairs (documented in implementation-summary.md). 5 new tests, 19/19 total pass.
- [x] T006 Confirm the new test fails red against a stashed/reverted copy of the original unconditional-force block, then passes against the fix — proves the test discriminates — confirmed: 4/5 new tests failed red against the reverted unconditional-force logic (5th correctly passed both ways, always-safe branch); restored fix, 19/19 green.
- [x] T007 Add a second case: mocked `journal_mode` of an unexpected third value (e.g., `'truncate'`) still logs a warning and does not call `.pragma('journal_mode = WAL')` (.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts) — added in `startup-checks.vitest.ts` (same deviation as T005).
- [x] T008 Start the daemon fresh and warm-restart it multiple times; run `PRAGMA journal_mode` after each boot and confirm it reads `delete` every time (manual, real daemon process) — 3 real warm restarts of `dist/context-server.js` against an isolated scratch DB, driven by a real MCP `initialize` + `tools/call(memory_stats)` handshake to force the lazy DB-init path; `PRAGMA journal_mode` read `delete` after all 3 boots, zero force-WAL warnings logged.
- [x] T009 Run the full boot-path regression set (`context-server.vitest.ts` + `launcher-*.vitest.ts`) and confirm 0 regressions — 149/163 passed; the 6 failures baseline-confirmed pre-existing (stash-compared against the unmodified tree, identical failures) and unrelated to this packet's files.
- [x] T010 `validate.sh --strict` for this packet — PASS, Errors: 0, Warnings: 0.
- [x] T011 Document the SIGBUS crash-report monitoring window as ongoing/observational in `implementation-summary.md` — explicitly not claimed as a closed success criterion until actually observed over multiple days — done; SC-003 stated as open by design in implementation-summary.md's Known Limitations.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] T006's fixed-vs-reverted comparison ran and produced the expected, opposite outcomes
- [x] Tests + syntax verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Related sibling (independent root cause, same test pass)**: `../034-rebuild-sentinel-corruption-handling/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
