---
title: "Implementation Summary: Memory Reindex + Embed Ingest Performance"
description: "Summarizes the completed scan write-back data-integrity fix. The packet's original reindex-performance objective is NOT covered by this summary and has not started."
trigger_phrases:
  - "memory reindex embed performance implementation summary"
  - "scan write-back fix summary"
  - "persistQualityLoopContent gating summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-22T17:15:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Documented the scan write-back fix"
    next_safe_action: "Restart daemon, then measure timings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit-031-memory-perf-handover-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Memory Reindex + Embed Ingest Performance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

**This summary covers only the data-integrity fix sub-scope (REQ-006). The packet's original objective —
measuring and optimizing reindex throughput (REQ-001–REQ-005) — has NOT started. The packet as a whole is
NOT complete.**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-memory-reindex-embed-performance |
| **Sub-scope Completed** | 2026-07-22 (scan write-back fix only) |
| **Level** | 2 |
| **Packet Status** | In progress — see spec.md METADATA |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fixed a data-integrity bug where a full `force` scan/reindex of the mk-spec-memory index wrote quality-loop
auto-fixes — including destructive content trimming — back to tracked source `.md` docs, violating ADR-01
("generated memory is search-only"). `indexMemoryFile()` hardcoded `persistQualityLoopContent: true`
regardless of caller; it now gates on the already-computed `indexingOrigin`, so scan-origin indexing never
persists to source docs while direct `memory_save` calls keep their legitimate auto-fix write-back. An
independent review then found that the daemon's own `startupScan()` and its file-watcher reindex callback
both bypassed this gate (they never marked themselves as scan-origin), so those two call sites were fixed
in the same pass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | Modified | One-line origin-aware gate on `persistQualityLoopContent`, plus a WHY comment (rewritten after review to drop a comment-hygiene violation) |
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | Modified | `startupScan()` and the file-watcher `reindexFn` now pass `{ fromScan: true }` to `indexSingleFile`, closing the P0 gap an independent review found |
| `.opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts` | Modified | Added `createSchemaBackedDb()` helper (now leak-free — returns `{ database, dbDir }` for cleanup), `loadRealMemorySaveWriteBackHarness()`, and a 2-test regression suite (`persistQualityLoopContent scan-origin write-back gating`) |
| `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts` | Modified | Relaxed the `T47d` source-pattern regex, which hardcoded the old 2-argument `indexSingleFile` call shape and broke when the P0 fix added a third argument |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md` | Modified | Added REQ-006 (covering all scan-like call sites, not just the explicit force-reindex path), scope addendum, answered/still-open questions, Level 1→2 |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/handover.md` | Modified | Marked the critical-bug section fixed with evidence, including the review-found gap; preserved the unresolved folder-renumbering caveat |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/{plan,tasks,checklist}.md` | Created/Modified | Level 2 documentation set, updated with the review findings and corrected overclaims |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root-caused via two independent code-reading passes before writing a single line — the fix is a one-line
change reusing a signal (`indexingOrigin`) the function already computed, not a new mechanism. Verified
against a real (not mocked) execution of the quality loop: a purpose-built harness runs the production
`memory_index` schema and the actual `runQualityLoop`/`attemptAutoFix` code, so the two regression tests
prove the fix works against the real auto-fix/trim logic, not an idealized mock. Confirmed no regressions by
running 8 adjacent test suites (185 tests) and bisecting the only failures via `git stash` to prove they
predate this change. Built and confirmed the compiled output contains the fix. The daemon restart — the
final step to make the fix live — is intentionally held given 3 concurrent daemon processes currently
serving other sessions on this shared repo.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Gate on `indexingOrigin` rather than add a new option/flag | The signal was already computed one line above the bug for provenance metadata; reusing it is the minimal, lowest-risk fix and matches an existing pattern in the same function. |
| Build a new, self-contained test harness rather than reuse the existing mocked-quality-loop harness | The existing `loadRealMemorySaveGuardHarness` mocks `runQualityLoop` to always return a fixed passing score with no `fixedContent`, so it can never exercise the write-back path this fix targets. |
| Use `vectorIndex.initializeDb()` for the regression DB instead of a bare `:memory:` handle | The real write transaction calls `markEnrichmentPending`, which needs the production `memory_index` schema (specifically `post_insert_enrichment_status`); a bare in-memory DB lacks it. |
| Leave the folder-renumbering side effect unfixed | Exhaustively searched for a scan-reachable rename/renumber mechanism and found none; fixing what can't be located would be guessing, not a real fix. Documented as an open, monitored risk instead. |
| Hold the daemon restart | Three concurrent `mk-spec-memory-launcher.cjs` processes were observed; restarting/killing any risks disrupting other active sessions on shared memory infrastructure. |
| Dispatch an independent review before treating the fix as done | A single-author fix that only tests the path it was written to fix risks missing sibling call sites; the review's P0 finding (daemon startup scan + file watcher bypassing the gate) confirmed this risk was real, not hypothetical. |
| Fix the review's P0 finding immediately rather than deferring it | The gap left the exact same destructive write-back reachable through ordinary daemon operation, not just the explicit force-reindex script — leaving it open would have meant shipping a fix that doesn't actually close the incident's root cause. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| New regression tests | Pass | 2/2 | Scan-origin: source file unchanged. Direct-origin: source file rewritten with trimmed content. |
| Independent review (GPT-5.6-Sol-Fast, high) | Requested changes → resolved | 1 P0, 1 P1, 2 P2 | P0 (startup-scan/watcher gap) and P1 (comment hygiene) fixed; both P2s (chunked-branch coverage documented as structurally unreachable, temp-dir leak fixed) resolved. |
| Full test file (`handler-memory-index.vitest.ts`) | Pass | 3/3 non-skipped | 28 tests remain skipped (pre-existing `MEMORY_DB_PATH` fixture gate, unrelated to this change) |
| `context-server.vitest.ts` + `context-server-error-envelope.vitest.ts` | Pass | 400/400 | Re-run after the P0 fix; one brittle source-pattern test (`T47d`) updated to allow the new argument |
| Adjacent suites (8 files) | Mostly pass | 583/588 (incl. above) | 5 failures in `resolveMemoryReference`, confirmed pre-existing via `git stash` bisection (identical failure with this fix removed) |
| Build | Pass | - | `npm run build` clean; `dist/handlers/memory-save.js` and `dist/context-server.js` both contain the compiled fixes |
| Daemon restart + live health check | Not done | - | Held pending operator input on which of 3 concurrent daemon processes to restart |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-DI01 | Scan/reindex never mutates source docs | Verified by regression test (byte-identical content) | Pass |
| NFR-DI02 | Direct `memory_save` auto-fix behavior unchanged | Verified by regression test (trimmed content still written) | Pass |
| NFR-DI03 | No regression in adjacent test suites | 583/588 pass; 5 pre-existing failures confirmed unrelated | Pass |
| NFR-DI04 | Fix covers every unattended/automatic indexing entry point, not only the one first found | `startupScan()` and file-watcher reindex both fixed after independent review found they bypassed the gate | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Daemon not yet restarted** — the fix is coded, tested, and built, but the currently-running daemon
   process(es) are still serving the pre-fix `dist/` in memory until restarted.
2. **Folder-renumbering mechanism unresolved** — the mis-numbered duplicate packet-folder side effect
   observed alongside the content-truncation bug was investigated exhaustively and its cause was not
   located in the reindex/scan code path. Treat as an open, monitored risk.
3. **CHK-FIX-004/006 deferred** — adversarial delimiter/path-style tests and hostile env-var override tests
   were judged not applicable / low-risk for this specific fix and were not executed (documented in
   checklist.md with reasons).
4. **Chunked write-back branch untested directly** — protected by the same shared gate as the tested
   standard branch (confirmed by reading the code), but the specific combination of oversized content +
   `fixedContent` + chunking is structurally unreachable given how the auto-fix trim step works, so no
   direct test exercises it. Documented in checklist.md rather than built as an artificial test.
5. **Other automatic indexing entry points beyond `startupScan`/file-watcher were not separately
   re-audited** — the review found and this pass fixed the two most significant ones; `memory_ingest_start`'s
   bulk-ingestion callback was reviewed and left as `'direct'` origin deliberately (it's caller-initiated,
   analogous to a batch of explicit saves, not an unattended background sweep), but this reasoning was not
   independently re-verified by a second reviewer.
6. **Packet remains open** — the original reindex-performance measurement objective (REQ-001–REQ-005) has
   not started.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Reuse the existing `loadRealMemorySaveGuardHarness` test harness | Wrote a new `loadRealMemorySaveWriteBackHarness` | The existing harness mocks `runQualityLoop` to never produce `fixedContent`, so it cannot exercise the write-back path at all. |
| Assume a bare `:memory:` SQLite handle would suffice for the new tests | Switched to `vectorIndex.initializeDb()` (real schema) | The real write transaction needs the production `memory_index` schema (`markEnrichmentPending`'s `post_insert_enrichment_status` column). |
| Restart the daemon as part of this pass | Held, undone | Discovered 3 concurrent daemon processes; restarting risks disrupting other active sessions on shared infra. |
| Consider the fix complete after the first regression suite passed | Dispatched an independent review before treating it as done, which found the daemon startup-scan/file-watcher gap | A fix that's only tested against the code path it was written against can miss sibling call sites; this one did, and the review caught it before it shipped incomplete. |
<!-- /ANCHOR:deviations -->
