---
title: "Implementation Summary: Memory Reindex + Embed Ingest Performance"
description: "Summarizes the completed scan write-back data-integrity fix (REQ-006) and the completed daemon/startup/MCP hardening pass (REQ-007..011, Phase 7). The packet's original reindex-performance objective is NOT covered by this summary and has not started."
trigger_phrases:
  - "memory reindex embed performance implementation summary"
  - "scan write-back fix summary"
  - "persistQualityLoopContent gating summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-23T13:10:17Z"
    last_updated_by: "orchestrator"
    recent_action: "Documented completed Phase 7 hardening (REQ-007..011) build/test/decisions"
    next_safe_action: "Restart daemon, verify health, then measure per-stage timings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts"
      - ".opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/research.md"
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

**This summary covers the data-integrity fix sub-scope (REQ-006) and the daemon/startup/MCP hardening
sub-scope (REQ-007..011, Phase 7). The packet's original objective — measuring and optimizing reindex
throughput (REQ-001–REQ-005) — has NOT started. The packet as a whole is NOT complete.**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-memory-reindex-embed-performance |
| **Sub-scopes Completed** | 2026-07-22 (scan write-back fix, REQ-006); 2026-07-23 (daemon/startup/MCP hardening, REQ-007..011) |
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
5. **Correction (found by a later `/deep:research` pass): the async-ingest reasoning above was wrong.**
   `memory_ingest_start`'s worker callback was left as `'direct'` origin on the assumption that it is
   caller-initiated, analogous to a batch of explicit saves. A 7-iteration `/deep:research` loop
   (`research/research.md` §3) traced the actual call path and found ingest jobs are queued and, on daemon
   restart, **crash-replayed from scratch** — meaning the same destructive write-back this pass closed for
   `startupScan`/file-watcher is still reachable through unattended startup recovery, not just a live
   caller-initiated request. This is now tracked as REQ-008 / Phase 7 (planned, not yet implemented — see
   plan.md, tasks.md T037-T038).
6. **Daemon/startup/MCP hardening (REQ-007/009/010/011) — now implemented.** See the Phase 7 sections below
   for what was built, verified, and deviated from the original plan.
7. **Packet remains open** — the original reindex-performance measurement objective (REQ-001–REQ-005) has
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

---

<!-- ANCHOR:phase7-what-built -->
## Phase 7: Daemon/Startup/MCP Hardening (REQ-007..011) — What Was Built

Implemented all 5 hardening items from the 7-iteration `/deep:research` synthesis (`research/research.md` §17), ranked by impact/cost and executed in order:

- **REQ-007 (probe collapse)**: `maybeBridgeLeaseHolder()` (`launcher-ipc-bridge.cjs`) now forwards its own confirmed-alive deep probe as `initialReadyResult` through `bridgeStdioThroughSessionProxy` (`mk-spec-memory-launcher.cjs`) to `createSessionProxy().start()` (`launcher-session-proxy.cjs`), which skips a second redundant `waitForDaemonReady()` call on the warm-owner path only; reattach/cold-start paths (which never pass this option) are unaffected. `classifyOwnerLease()`'s synchronous `spawnSync('ps', ...)` now runs under a 2000ms default timeout (`mk-spec-memory-launcher.cjs`).
- **REQ-008 (async-ingest origin)**: the `memory_ingest_start` worker callback (`processFile` in `context-server.ts`) now passes `fromScan: true` on both its governed and provenance branches, closing the residual write-back gap the same way `startupScan`/file-watcher were closed earlier in this packet.
- **REQ-009 (background-job default)**: the `memory_index_scan` MCP tool now defaults `background: true` when the caller omits it, applied at the tool-dispatch boundary (`tools/lifecycle-tools.ts`) rather than inside `handleMemoryIndexScan` itself, so the CLI reindex command and the daemon's own boot-time drift-repair scan (both of which need synchronous completion) are unaffected.
- **REQ-010 (lease fencing)**: `buildOwnerLease` now mints a `leaseId` (crypto.randomUUID) per lease instance; `acquireOwnerLeaseFile()` re-validates the leaseId immediately before its reclaim unlink, and `refreshOwnerLeaseFile()`/`clearOwnerLeaseFile()` require it to match this process's own tracked leaseId before mutating — closing the exact TOCTOU race research §7.1 constructed.
- **REQ-011 (canonical socket default)**: `model-server-supervision.cjs` exports `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` (`/tmp/mk-hf-embed/hf-embed.sock`, matching both MCP configs' pinned value) and uses it as the empty-environment fallback instead of an unconditional `dbDir`-derived path; `options.dbDir` remains a valid explicit override.

### Files Changed (Phase 7)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | `maybeBridgeLeaseHolder()` forwards its probe result as `initialReadyResult` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | `bridgeStdioThroughSessionProxy` passthrough; bounded `ps` timeout; `leaseId` fencing across `buildOwnerLease`/`acquireOwnerLeaseFile`/`refreshOwnerLeaseFile`/`clearOwnerLeaseFile`/`respawnAfterDeadSocket` |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modified | `createSessionProxy`/`start()` honor `initialReadyResult` |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`PATH` constants; `resolveModelServerSocketPath` empty-env fallback; `createModelServerControl`'s own `dbDir` default removed |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | `resolveModelServerSocketPath` wrapper no longer forces its own long `dbDir` default (scope correction — see Deviations) |
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | Modified | `processFile` ingest callback passes `fromScan: true` |
| `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` | Modified | `memory_index_scan` dispatch defaults `background: true` |
| `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` | Modified | Updated `background` field description/default to match |
| 6 test files | Modified/Created | `launcher-session-proxy.vitest.ts`, `launcher-ipc-bridge-probe.vitest.ts`, `context-server.vitest.ts`, `lifecycle-tools-scan-default.vitest.ts` (new), `launcher-spec-memory-lifecycle.vitest.ts`, `embedders/launcher-model-server-cross-launcher.vitest.ts` |
<!-- /ANCHOR:phase7-what-built -->

---

<!-- ANCHOR:phase7-decisions -->
## Phase 7: Key Decisions

| Decision | Rationale |
|----------|-----------|
| Apply the REQ-009 background default at the MCP tool dispatch boundary (`lifecycle-tools.ts`), not inside `handleMemoryIndexScan` | Dozens of existing tests and two internal callers (CLI reindex, boot-time drift repair) call `handleMemoryIndexScan` directly and require synchronous foreground completion; changing the shared handler's default would have broken all of them for no benefit, since they aren't the "manual" callers the finding was about. |
| Preserve `options.dbDir` as an explicit override in `resolveModelServerSocketPath` rather than removing it | Test isolation and legitimate per-instance configuration depend on it; only the fallback-of-last-resort (nothing configured anywhere) needed to change. |
| Fix `createModelServerControl`'s own internal `dbDir` default and `mk-skill-advisor-launcher.cjs`'s wrapper, beyond the original REQ-011 scope | Both unconditionally reconstructed the long path whenever a caller omitted `dbDir`, making the new canonical constant unreachable through the actual bug path (the skill-advisor plugin bridge's filtered child env) — the same class of "affected-surfaces gap" this packet already learned to check for with REQ-006. |
| Use a `leaseId` (crypto.randomUUID) as the fencing token for REQ-010, not a full redesign of the election/respawn locking | Research's own severity recalibration (§7.1) established the SQLite sidecar lock is the real integrity boundary regardless; a minimal fencing token closes the specific TOCTOU window without introducing new locking machinery into a concurrency-sensitive area. |
| Simulate the REQ-010 interleaving via a call-counted `fs.readFileSync` spy with a side-effect write, rather than real multi-process orchestration | `acquireOwnerLeaseFile()` is synchronous with no injectable dependencies for cross-process timing; intercepting the shared `fs` module (the same object the launcher's own `require('fs')` resolves to) lets a single test process reproduce the exact interleaving deterministically. |
<!-- /ANCHOR:phase7-decisions -->

---

<!-- ANCHOR:phase7-verification -->
## Phase 7: Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| New regression tests (all 5 items) | Pass | 15 new tests across 6 files | Probe-collapse skip/no-regression/rejection (3), forwarding (1), source-pattern fromScan assertion (1), background-default (4), lease-fencing interleaving (1), canonical-default + skill-advisor cross-check (2), plus supporting assertions |
| Combined regression run (17 touched/new files) | Pass | 521 passed / 36 skipped | 0 new failures; one single-test flake on a real-subprocess test reproduced clean on isolated re-run and full re-run |
| Build | Pass | - | `npm run build` in `mcp-server/` exits 0; dist confirmed to contain `fromScan: true` (context-server.js), the background-default logic (tools/lifecycle-tools.js), and the updated schema description (tool-schemas.js) |
| Live empirical confirmation of REQ-009 | N/A (observational) | - | A `memory_index_scan` call made during this same session hung 2+ minutes in the foreground, then its background task later timed out and failed after exactly 1800s (30 minutes) with no response — an unplanned, real-world reproduction of the exact bug REQ-009 fixes |
| Daemon restart + live health check | Not done | - | Held pending operator input alongside the REQ-006 restart (3 concurrent daemon processes observed) |
<!-- /ANCHOR:phase7-verification -->

---

<!-- ANCHOR:phase7-limitations -->
## Phase 7: Known Limitations

1. **Daemon not yet restarted** — all 5 fixes are coded, tested, and built, but the currently-running daemon process(es) are still serving the pre-fix `dist/` until restarted (same held state as the REQ-006 fix).
2. **REQ-010's fencing narrows, does not eliminate, the OS-level race** — the `leaseId` re-validation happens immediately before the unlink syscall (no intervening `await` within this process), which closes the JS-level TOCTOU window research demonstrated. A sub-microsecond OS-level race between the re-validation read and the unlink syscall is theoretically still possible; research's own severity recalibration (§7.1) already established the SQLite sidecar lock is the true integrity backstop regardless, so this residual is accepted as proportionate rather than pursued with a full atomic compare-and-delete primitive.
3. **Items 6-8 from research's ranked list remain out of scope** — observability/transition-timing instrumentation, launcher-cleanup/daemon-discovery separation, and the "canonical runtime context envelope" migration direction are documented as follow-on/longer-term work, not attempted in this pass.
4. **REQ-010's real-world race frequency remains unmeasured** — research's own open question (§12) about how often the TOCTOU race actually fires under concurrent-session storms requires the deferred observability item (research §17 item 6) to answer; this pass fixes the mechanism, not the measurement.
<!-- /ANCHOR:phase7-limitations -->
