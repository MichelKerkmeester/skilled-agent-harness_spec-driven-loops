---
title: "Implementation Plan: Memory Reindex + Embed Ingest Performance"
description: "Plan covering the scan write-back data-integrity fix (executed) and the original reindex-performance measurement objective (not yet started)."
trigger_phrases:
  - "memory reindex embed performance plan"
  - "scan write-back fix plan"
  - "persistQualityLoopContent gating plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-22T17:15:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Planned and executed the scan write-back fix"
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
# Implementation Plan: Memory Reindex + Embed Ingest Performance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mk-spec-memory MCP server) |
| **Component** | `mcp-server/handlers/memory-save.ts` — memory indexing/save pipeline |
| **Storage** | better-sqlite3 (`memory_index` + related tables) |
| **Testing** | Vitest |

### Overview
This plan covers two related pieces of work in the same packet: (1) a data-integrity bug fix — a full
scan/reindex was found to write quality-loop auto-fixes (including destructive content trimming) back to
tracked source docs, violating ADR-001 — and (2) the packet's original objective, measuring and optimizing
mk-spec-memory reindex throughput. (1) is a hard prerequisite for (2), since Step 0 of the perf work needs a
scan that doesn't mutate the very files it is timing. (1) is executed and verified in this pass; (2) has not
started.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (for the fix)
- [x] Root cause confirmed by reading the actual code, not assumed
- [x] Fix approach validated against the existing `indexingOrigin` provenance pattern already in the function
- [x] Legitimate direct-save behavior identified and preserved by design

### Definition of Done (for the fix)
- [x] Fix applied and minimal
- [x] Regression tests added and passing (both directions: scan doesn't write, direct still writes)
- [x] No regressions in adjacent test suites
- [x] Build passes, dist reflects the fix
- [ ] Daemon restarted + health verified (held — see §7 Rollback / Session Notes)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Origin-aware option gating — reuse an already-computed provenance signal (`indexingOrigin`) to control a
side-effecting option (`persistQualityLoopContent`), rather than introducing a new flag or parameter.

### Key Components
- **`indexMemoryFile()`** (`memory-save.ts`) — single non-legacy entry point for both scan and direct
  indexing; computes `indexingOrigin` and now uses it to gate the write-back option it passes to
  `processPreparedMemory`.
- **`processPreparedMemory()`** (`memory-save.ts`) — runs the real quality loop (`runQualityLoop`) and, when
  `persistQualityLoopContent && finalizedFileContent`, calls `finalizeMemoryFileContent()` to write the
  auto-fixed content back to the source file (backup → temp-write → rename).
- **`indexMemoryFileFromScan()` / `indexSingleFile()`** (`memory-index.ts`) — the only scan-reachable callers;
  both route through `indexMemoryFile`, so gating there closes the write-back for every scan path.

### Data Flow (scan path, post-fix)
1. `runMemoryIndexScan({force: true})` discovers files and calls `indexSingleFile(..., fromScan: true)` per file.
2. `indexSingleFile` → `indexMemoryFileFromScan` → `indexMemoryFile(..., origin: 'scan')`.
3. `indexMemoryFile` computes `indexingOrigin = 'scan'` and passes `persistQualityLoopContent: false` to `processPreparedMemory`.
4. The quality loop still runs and scores the content (so indexing/search quality metadata is unaffected), but `shouldPersistFinalizedFile` evaluates false, so `finalizeMemoryFileContent()` is never called — the source `.md` file is untouched.
5. Direct `memory_save` calls (no `fromScan`) compute `indexingOrigin` as non-`'scan'`, so `persistQualityLoopContent` stays `true` and the legitimate auto-fix write-back is preserved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Root-Cause Investigation
- [x] Two independent code-reading passes traced the write-back mechanism to `memory-save.ts`
- [x] Confirmed `indexMemoryFile` hardcoded `persistQualityLoopContent: true` regardless of caller
- [x] Confirmed `indexingOrigin` was already computed but unused for this gate
- [x] Confirmed the legitimate purpose of the flag (direct `memory_save` auto-fix persistence) via the feature catalog
- [x] Searched exhaustively for the separate folder-renumbering mechanism — not found; documented as unresolved

### Phase 2: Fix + Regression Tests
- [x] Applied the one-line origin-aware gate with a WHY comment
- [x] Authored a schema-backed test harness (`loadRealMemorySaveWriteBackHarness`) that exercises the real quality-loop/write-back path, not a mocked one
- [x] Added two regression tests (scan-origin: unchanged; direct-origin: rewritten with trimmed content), both passing
- [x] Verified no regressions in 8 adjacent test suites (185 tests; 5 pre-existing unrelated failures confirmed via stash bisection)

### Phase 3: Build + Docs
- [x] `npm run build` in `mcp-server/`; confirmed the compiled fix is in `dist/`
- [x] Updated spec.md, handover.md, this plan, tasks.md, checklist.md, implementation-summary.md
- [ ] Daemon restart + health verification — held pending operator input (see §7)

### Phase 4: Original Perf Objective (not started)
- [ ] Step 0: instrument per-stage timings on a ~200-memory sample
- [ ] Identify the dominant stage with evidence
- [ ] Optimize only the measured-dominant stage, behind a feature flag
- [ ] Measure throughput improvement + zero recall regression
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (new) | `persistQualityLoopContent` scan-vs-direct gating, real quality-loop execution | Vitest, `mcp-server/tests/handler-memory-index.vitest.ts` |
| Regression (existing, re-run) | Adjacent memory-save/quality-loop/dedup/provenance suites | Vitest, 8 files, 185 tests |
| Manual | `git diff`/`git stash` bisection to confirm pre-existing failures aren't caused by this fix | Bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp-server` build toolchain (tsc) | Internal | Green | Cannot verify compiled fix reaches `dist/` |
| `vectorIndex.initializeDb()` (real schema init) | Internal | Green | Regression test would need hand-rolled schema instead |
| mk-spec-memory daemon restart | Internal | **Blocked** | Fix is coded/tested/built but not yet live in the running daemon; other concurrent sessions currently hold daemon processes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the origin-based gate turns out to suppress a legitimate write-back some other caller depended on.
- **Procedure**: revert the single-line change in `memory-save.ts` (`persistQualityLoopContent: indexingOrigin !== 'scan'` → `true`); the change has no schema/data migration, so a plain code revert is sufficient. Regression tests would need to be reverted or updated alongside it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Root-Cause) ──> Phase 2 (Fix + Tests) ──> Phase 3 (Build + Docs) ──> Phase 4 (Perf Measurement)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Root-Cause | None | Fix + Tests |
| Fix + Tests | Root-Cause | Build + Docs |
| Build + Docs | Fix + Tests | Perf Measurement |
| Perf Measurement | Build + Docs (+ daemon restart) | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Root-Cause Investigation | Medium (two independent deep-reads) | ~1 hour |
| Fix + Regression Tests | Medium (schema-backed harness authoring) | ~1.5 hours |
| Build + Docs | Low | ~30 minutes |
| Perf Measurement (Phase 4, not started) | Medium-High | Not yet estimated |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Regression tests pass before considering the fix landed
- [x] Build verified (dist contains the fix)
- [ ] Daemon restarted from fresh dist (held — see §6 Dependencies)

### Rollback Procedure
1. **Immediate**: revert the one-line change in `memory-save.ts`
2. **Revert tests**: remove or adjust the new regression describe block in `handler-memory-index.vitest.ts` if the gate itself is reverted
3. **Rebuild**: `npm run build` in `mcp-server/`
4. **Verify**: confirm `dist/handlers/memory-save.js` no longer contains the origin-based gate
5. **Restart**: restart the daemon from the reverted dist

### Data Reversal
- **Has data migrations?** No — the fix changes indexing behavior only, not schema.
- **Reversal procedure**: not applicable; no data was migrated by this change.
<!-- /ANCHOR:l2-rollback -->
