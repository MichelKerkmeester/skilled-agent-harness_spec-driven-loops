---
title: "Implementation Summary: Runtime Process Lifecycle Closure"
description: "Summary of the F41/F43/F51/F90/F110 runtime lifecycle remediation."
trigger_phrases:
  - "020 005 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle"
    last_updated_at: "2026-05-23T10:55:00Z"
    last_updated_by: "codex"
    recent_action: "Verified runtime lifecycle fixes"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0200050200050200050200050200050200050200050200050200050200050200"
      session_id: "020-005-runtime-process-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 005-fix-deferred-p2s-for-runtime-process-lifecycle |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Runtime lifecycle behavior is now explicit instead of accidental. Reindex startup fails before constructing work when no stable database directory exists, test-only paused startup moved behind a testables seam, duplicate signal handling became idempotent, and direct provider credential cache entries are cleared when the active adapter rotates.

### Reindex Startup And Testables

`startReindex()` now validates the main SQLite database has a file-backed directory before job construction. `:memory:` databases throw `InvalidDatabaseDirError` with a clear message, which removes the old silent vector-shard skip. Production `startReindex()` always auto-starts; tests use `reindex.testables.ts` for paused startup and cancellation fixtures.

### Router Signal And Credential Lifecycle

`registerShutdownHooks()` keeps the F53 best-effort shutdown model but adds an in-flight guard so duplicate SIGTERM/SIGINT/SIGHUP re-entry warns and no-ops. `getEmbedderAdapter()` now tracks the active adapter key and clears direct provider adapter cache entries when the key rotates, emitting a structured invalidation event that documents the stale window.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | DB-dir validation, internal paused-start seam, and invalid DB error |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.testables.ts` | Created | Test-only paused startup and cancel seam |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | Signal re-entry guard and adapter-rotation invalidation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts` | Modified | Test seams for invalidation listener and cache keys |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts` | Modified | F41/F43/F110 regression fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Modified | F51/F90 regression fixtures |
| `<this-folder>/*.md` | Modified/Created | Packet docs, checklist, ADRs, verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside the leaf scope and left frozen files untouched. Focused tests passed first, then the full requested embedders slice hit the known F48 random-ID flake once and passed on the allowed rerun. Typecheck passed after the runtime and test seam edits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Validate DB directory before reindex queue/resume | Reindex writes vector shards, so an in-memory DB cannot satisfy the runtime contract |
| Keep `cancelJob` live and document lifecycle | `index.ts` is a frozen live barrel consumer in this bucket, so removal would violate scope |
| Gate paused startup behind `reindex.testables.ts` | `autoStart=false` is a fixture control, not production behavior |
| Keep signal cleanup best-effort | This preserves the F53 baseline while preventing duplicate-signal recursion |
| Clear direct provider cache on active adapter rotation | Credential staleness is bounded to the next adapter resolution without sidecar restart scope creep |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS, errors 0 warnings 0 |
| Focused touched vitest files | PASS, 2 files, 14 tests |
| Requested embedders vitest | First run FAIL on known F48 flake; rerun PASS, 4 files, 49 tests |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASS, exit 0 |
| Final strict validation | PASS, errors 0 warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sidecar credential refresh is event-visible but not force-restarted.** Direct provider adapters are cleared on active adapter rotation. Existing sidecar worker processes are not restarted in this packet because `sidecar-worker.ts` and `sidecar-client.ts` are out of scope.
2. **`cancelJob` remains a production export.** This is intentional for 020/005 because `index.ts` is a frozen live barrel consumer. ADR-002 documents the cancellation lifecycle instead of editing the barrel.
<!-- /ANCHOR:limitations -->
