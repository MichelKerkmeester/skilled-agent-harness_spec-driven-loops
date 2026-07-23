---
title: "Tasks: Memory Reindex + Embed Ingest Performance"
description: "Task breakdown for the scan write-back fix (complete) and the original reindex-performance objective (not started)."
trigger_phrases:
  - "memory reindex embed performance tasks"
  - "scan write-back fix tasks"
  - "persistQualityLoopContent gating tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-23T12:23:33Z"
    last_updated_by: "orchestrator"
    recent_action: "Added Phase 7 tasks (T034-T047) for the 5 daemon/startup/MCP hardening items"
    next_safe_action: "Implement Phase 7 tasks in ranked order, then restart daemon, then measure timings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit-031-memory-perf-handover-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Tasks: Memory Reindex + Embed Ingest Performance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Root-cause investigation (~1 hour):

- [x] T001 [P] Trace the write-back call path from the scan entry point to `finalizeMemoryFileContent` (`mcp-server/handlers/memory-save.ts`, `mcp-server/handlers/memory-index.ts`) [30m]
- [x] T002 [P] Trace `persistQualityLoopContent`'s legitimate original purpose (direct `memory_save` auto-fix persistence) (`mcp-server/handlers/memory-save.ts`, `feature-catalog/memory-quality-and-indexing/`) [20m]
- [x] T003 Search for the separate folder-renumbering mechanism (`fs.rename`/`fs.mkdir` call sites, `mcp-server/lib`, `mcp-server/handlers`, `scripts/`) — not found, documented as unresolved [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Fix + regression tests (~1.5 hours):

- [x] T004 Apply origin-aware gate: `persistQualityLoopContent: indexingOrigin !== 'scan'` (`mcp-server/handlers/memory-save.ts`) [5m]
- [x] T005 Author `createSchemaBackedDb()` helper using the real `vectorIndex.initializeDb()` schema (`mcp-server/tests/handler-memory-index.vitest.ts`) [20m]
- [x] T006 Author `loadRealMemorySaveWriteBackHarness()` — mocks hard-validation gates only, leaves `quality-loop.js` real (`mcp-server/tests/handler-memory-index.vitest.ts`) [30m]
- [x] T007 Build an oversized/low-quality fixture that scores below the 0.6 quality threshold and triggers the real budget-trim auto-fix (`mcp-server/tests/handler-memory-index.vitest.ts`) [15m]
- [x] T008 Test: scan-origin index leaves the source file byte-identical (`mcp-server/tests/handler-memory-index.vitest.ts`) [15m]
- [x] T009 Test: direct-origin index still rewrites the source file with the trimmed content (`mcp-server/tests/handler-memory-index.vitest.ts`) [10m]
- [x] T010 Run the new regression suite in isolation; fix mock-shape and DB-lifecycle issues found along the way (`saveTimeReconsolidation` shape, `vectorIndex.closeDb()` lifecycle) [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verification + build (~30 minutes):

- [x] T011 Run the new tests in isolation via `npx vitest run tests/handler-memory-index.vitest.ts` — 2 tests passed [2m]
- [x] T012 Run the full `handler-memory-index.vitest.ts` file — no new failures [2m]
- [x] T013 Run 8 adjacent test files (185 tests) to check for regressions [3m]
- [x] T014 Bisect the 5 `resolveMemoryReference` failures via `git stash` — confirmed pre-existing, unrelated [5m]
- [x] T015 `npm run build` in `mcp-server/`; confirm `dist/handlers/memory-save.js` contains the fix [3m]
- [ ] T016 [B] Restart the mk-spec-memory daemon and verify health — blocked on operator input (3 concurrent daemon processes observed) [pending]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation

- [x] T017 Update `spec.md:93` (REQ-006, scope addendum, answered/open questions, Level 1→2) [15m]
- [x] T018 Update `handover.md:44` (mark the critical-bug section fixed with evidence; preserve the unresolved folder-renumbering caveat) [15m]
- [x] T019 Author `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` for Level 2 [30m]
- [ ] T020 [B] Regenerate `description.json` / `graph-metadata.json` via the canonical scripts once available [pending]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Original Perf Objective (not started)

- [ ] T021 Instrument per-stage timings (parse/scrub/summary/chunk/embed/write) over a ~200-memory sample
- [ ] T022 Identify the dominant stage with evidence
- [ ] T023 Spec and implement the optimization for the measured-dominant stage only, behind a feature flag
- [ ] T024 Measure throughput improvement + zero recall regression
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Independent Review + Remediation (~1 hour)

- [x] T025 Dispatch an independent review (GPT-5.6-Sol-Fast, high effort) against the fix, tests, and docs (`.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts`, `mcp-server/tests/handler-memory-index.vitest.ts`, this packet's docs) [10m]
- [x] T026 [B] Verify the review's P0 finding directly by reading `context-server.ts:1729` and `context-server.ts:2485` — confirmed both call `indexSingleFile(filePath, false)` with no `fromScan` flag, defaulting to `'direct'` origin [10m]
- [x] T027 Fix both call sites: pass `{ fromScan: true }` (`mcp-server/context-server.ts:1729`, `:2485`) [5m]
- [x] T028 Fix comment-hygiene violations flagged by review: remove the "ADR-001" citation from `memory-save.ts:2971` and the "T520" citation from `handler-memory-index.vitest.ts:1615` [10m]
- [x] T029 Fix a brittle source-pattern test broken by T027 (`context-server.vitest.ts` `T47d`, hardcoded the old 2-argument call shape) [5m]
- [x] T030 Fix the leaked temp-directory issue the review found in `createSchemaBackedDb()` — return `{ database, dbDir }` and remove `dbDir` in both tests' `finally` blocks; removed 10 pre-existing leaked directories [10m]
- [x] T031 Re-run the full regression surface: `handler-memory-index.vitest.ts`, `context-server.vitest.ts`, `context-server-error-envelope.vitest.ts`, plus the 8 previously-checked adjacent suites — 583 passed, 5 pre-existing unrelated failures, 0 new failures [5m]
- [x] T032 Rebuild `mcp-server/` and confirm `dist/context-server.js` + `dist/handlers/memory-save.js` contain both fixes [3m]
- [x] T033 Correct the packet docs' overclaiming the review flagged (checklist.md CHK-FIX-003/005 consumer-inventory and matrix claims; handover.md/spec.md scope) [15m]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Daemon/Startup/MCP Hardening (planned, not started)

Source: `research/research.md` §17 ranked list, items 1-5 (items 6-8 deferred as follow-on/longer-term, out of scope here). Recommended order: 007 → 008 → 009 → 010 → 011.

**REQ-007 — Probe collapse (~1.5h)**
- [ ] T034 [P] Thread `maybeBridgeLeaseHolder()`'s successful readiness result through to the session-proxy start path so the warm-owner branch skips a redundant `waitForDaemonReady()` (`.opencode/bin/lib/launcher-ipc-bridge.cjs:463-485`, `.opencode/bin/lib/launcher-session-proxy.cjs:374-397,842-865`) [45m]
- [ ] T035 Add a bounded timeout around the synchronous `ps` call in `classifyOwnerLease()`'s `readParentPid()` (`.opencode/bin/mk-spec-memory-launcher.cjs:460-497`) [20m]
- [ ] T036 Test: reattach path still runs its own independent probe (no regression); warm-owner path measurably skips the duplicate round-trip [25m]

**REQ-008 — Async-ingest non-persisting origin (~30m)**
- [ ] T037 Pass an explicit non-persisting/scan-equivalent origin from the `memory_ingest_start` async worker callback into `indexSingleFile`/`indexMemoryFile` (`.opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts:128-132`, `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` `processFile`) [15m]
- [ ] T038 Test: async-ingest source-immutability, mirroring the existing `handler-memory-index.vitest.ts` scan/direct regression pattern (`.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts:2568-2574` currently only regex-checks sync semantics — extend or add a new test) [15m]

**REQ-009 — Background-job default (~45m)**
- [ ] T039 Identify manual/maintenance `memory_index_scan` call sites currently defaulting to foreground (`.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts`) [15m]
- [ ] T040 Default those call sites to `background: true`, reusing the existing job-status/progress/cancel path (`memory-index.ts:2088-2147`, `memory-index-scan-jobs.ts:41-142`) — do not touch `db-instance-lock.ts` [20m]
- [ ] T041 Test: background-default scan returns a job ID immediately; poll confirms status/progress reporting works [10m]

**REQ-010 — Lease fencing (~2-3h)**
- [ ] T042 Add a `leaseId`/generation token to the owner-lease structure; require it for refresh, release, and cleanup (`.opencode/bin/mk-spec-memory-launcher.cjs:432-547`) [1h]
- [ ] T043 Re-read and re-validate the lease under the existing election/respawn lock immediately before stale removal, closing the TOCTOU window research §7.1 identified [45m]
- [ ] T044 Test: construct the exact two-launcher interleaving from research §7.1 (both classify stale, one delayed) and confirm the delayed launcher can no longer unlink the other's fresh lease [45m]

**REQ-011 — Canonical socket default (~30m)**
- [ ] T045 Export `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` constants in `.opencode/bin/lib/model-server-supervision.cjs`, matching the `/tmp/mk-hf-embed/hf-embed.sock` value already pinned in `opencode.json`/`.claude/mcp.json` [15m]
- [ ] T046 Use the new constants in the empty-environment fallback (`:469-479`) instead of `options.dbDir`; do not repurpose `SPECKIT_IPC_SOCKET_DIR` [10m]
- [ ] T047 Update `tests/embedders/launcher-model-server-cross-launcher.vitest.ts` to assert the exact default and its Darwin-safe byte length (<104 bytes) [15m]
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Data-integrity fix: all Phase 1–2 tasks marked `[x]`
- [x] Independent review dispatched and its P0/P1/P2 findings resolved (Phase 6)
- [x] No unexpected regressions in adjacent suites
- [ ] Daemon restart still pending (T016, blocked on operator input)
- [ ] Perf-measurement objective (Phase 5 in plan.md / Phase 5 tasks) not started — packet remains open
- [ ] Daemon/startup/MCP hardening (Phase 7, T034-T047) not started — planned this pass, recommended to execute before the perf-measurement objective
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Handover**: See `handover.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
