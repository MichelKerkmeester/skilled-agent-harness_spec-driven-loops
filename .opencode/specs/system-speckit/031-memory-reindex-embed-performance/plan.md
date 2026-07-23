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
    last_updated_at: "2026-07-23T12:23:33Z"
    last_updated_by: "orchestrator"
    recent_action: "Added Phase 5 hardening plan (REQ-007..011)"
    next_safe_action: "Implement Phase 5 items in ranked order, then restart daemon, then measure timings (Phase 4)"
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
This plan covers three related pieces of work in the same packet: (1) a data-integrity bug fix — a full
scan/reindex was found to write quality-loop auto-fixes (including destructive content trimming) back to
tracked source docs, violating ADR-001 — (2) five daemon/startup/MCP hardening items (REQ-007..011) found by
a 7-iteration `/deep:research` loop while closing (1), and (3) the packet's original objective, measuring and
optimizing mk-spec-memory reindex throughput. (1) is a hard prerequisite for (3), since Step 0 of the perf
work needs a scan that doesn't mutate the very files it is timing. (2) is planned but not yet implemented in
this pass — it hardens the same daemon/MCP surface (2) touched, ahead of (3)'s measurement work so the
measurement runs against a hardened daemon. (1) is executed and verified; (2) is planned (this pass); (3) has
not started.
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

### Definition of Ready (for Phase 5 hardening, REQ-007..011)
- [x] Root cause confirmed for all 5 items by primary-source code evidence (`research/research.md` §3-§7, 7-iteration `/deep:research` loop, GPT-5.6-Sol-Fast high effort)
- [x] Fix approach concrete and file:line-scoped for all 5 items (`research/research.md` §17)
- [x] Severity claims adversarially re-verified, not just asserted (REQ-010's lease race was independently re-checked and recalibrated in iteration 6)
- [x] Scope-analysis tool confirms flat Level 2 plan, not phase decomposition (`recommend-level.sh`: phase_score 10 < 25 threshold, recommended_level 2 < 3 threshold)

### Definition of Done (for Phase 5 hardening)
- [ ] All 5 items implemented per their REQ
- [ ] Regression test per item (source-immutability for REQ-008; probe-collapse behavior for REQ-007; lease-fencing interleaving for REQ-010; socket-path length assertion for REQ-011; background-job default for REQ-009)
- [ ] No regressions in existing launcher/MCP/scan test suites
- [ ] Build passes, dist reflects all 5 fixes
- [ ] Daemon restarted + health verified
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

### Phase 5 Components (Daemon/Startup/MCP Hardening, REQ-007..011)

- **REQ-007 — Probe collapse**: `maybeBridgeLeaseHolder()` (`launcher-ipc-bridge.cjs:463-485`) must pass its successful readiness result forward so `createSessionProxy().start()` (`launcher-session-proxy.cjs:374-397,842-865`) skips a redundant `waitForDaemonReady()` on the warm-owner path only; reattach paths keep their independent probe. `classifyOwnerLease()`'s `readParentPid()` (`mk-spec-memory-launcher.cjs:460-497`) gets a bounded timeout around its synchronous `ps` call.
- **REQ-008 — Async-ingest origin**: `memory_ingest_start`'s worker callback (`memory-ingest.ts:128-132` → `context-server.ts` `processFile`) gains the same `{ fromScan: true }`-equivalent origin argument already applied to `startupScan`/file-watcher in Phase 2, closing the last open call site of the `persistQualityLoopContent` gate.
- **REQ-009 — Background-job default**: manual/maintenance `memory_index_scan` call sites switch their default to `background: true`, reusing the already-shipped job-status/progress/cancel infrastructure (`memory-index.ts:2088-2147`, `memory-index-scan-jobs.ts:41-142`) instead of adding new streaming/timeout machinery.
- **REQ-010 — Lease fencing**: the stale-lease-reclamation and heartbeat-refresh paths in `mk-spec-memory-launcher.cjs` (`:432-547`) gain a `leaseId`/generation token; stale removal re-reads and re-validates under the existing election/respawn lock instead of trusting an earlier classification read.
- **REQ-011 — Canonical socket default**: new exported constants `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` in `model-server-supervision.cjs` (mirroring the `/tmp/mk-hf-embed/hf-embed.sock` value already pinned in `opencode.json`/`.claude/mcp.json`) replace the `options.dbDir`-derived empty-environment fallback at `:469-479`.
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

### Phase 5: Daemon/Startup/MCP Hardening (planned, not started)

Ranked order from `research/research.md` §17 (highest impact/lowest cost first); recommended execution order is 007 → 008 → 009 → 010 → 011, since 007 directly explains the observed MCP failure and has no dependency on the others.

- [ ] REQ-007: Collapse duplicate MCP startup probes; bound the synchronous `ps` call
- [ ] REQ-008: Make async ingest non-persisting (close the residual write-back gap)
- [ ] REQ-009: Default manual/maintenance scans to the `background: true` job path
- [ ] REQ-010: Fence the owner-lease stale-reclamation/heartbeat race with a leaseId/generation token
- [ ] REQ-011: Ship the canonical short model-socket default
- [ ] Regression test per item; no regressions in existing launcher/MCP/scan suites
- [ ] Build + daemon restart + health verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (new) | `persistQualityLoopContent` scan-vs-direct gating, real quality-loop execution | Vitest, `mcp-server/tests/handler-memory-index.vitest.ts` |
| Regression (existing, re-run) | Adjacent memory-save/quality-loop/dedup/provenance suites | Vitest, 8 files, 185 tests |
| Manual | `git diff`/`git stash` bisection to confirm pre-existing failures aren't caused by this fix | Bash |
| Regression (Phase 5, new) | REQ-008 async-ingest source-immutability (mirrors REQ-006 pattern) | Vitest, `handler-memory-index.vitest.ts` or a new ingest-focused spec |
| Regression (Phase 5, new) | REQ-011 socket-path length assertion on the empty-env fallback | Vitest, `tests/embedders/launcher-model-server-cross-launcher.vitest.ts` |
| Regression (Phase 5, new) | REQ-010 lease-fencing interleaving scenario (the exact TOCTOU sequence research §7.1 constructed) | Vitest or a targeted script exercising `mk-spec-memory-launcher.cjs`'s lease functions |
| Manual (Phase 5) | REQ-007 warm-owner startup timing before/after (verify reduced round-trips, reattach path unaffected) | Manual daemon restart + timing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp-server` build toolchain (tsc) | Internal | Green | Cannot verify compiled fix reaches `dist/` |
| `vectorIndex.initializeDb()` (real schema init) | Internal | Green | Regression test would need hand-rolled schema instead |
| mk-spec-memory daemon restart | Internal | **Blocked** | Fix is coded/tested/built but not yet live in the running daemon; other concurrent sessions currently hold daemon processes |
| `research/research.md` (7-iteration `/deep:research` synthesis) | Internal | Green | Phase 5's requirements/design all cite this doc; without it REQ-007..011 would need re-derivation |
| `recommend-level.sh` scope-analysis script | Internal | Green | Confirmed Phase 5 stays a flat Level 2 plan (phase_score 10 < 25, level 2 < 3) rather than a phase-decomposed packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the origin-based gate turns out to suppress a legitimate write-back some other caller depended on.
- **Procedure**: revert the single-line change in `memory-save.ts` (`persistQualityLoopContent: indexingOrigin !== 'scan'` → `true`); the change has no schema/data migration, so a plain code revert is sufficient. Regression tests would need to be reverted or updated alongside it.

### Phase 5 Rollback (per item, each independently revertible — no shared migration)

| Item | Trigger | Procedure |
|------|---------|-----------|
| REQ-007 | Probe collapse causes the session proxy to attach before the daemon is actually ready on some code path | Revert the readiness hand-off; session proxy resumes its own independent `waitForDaemonReady()` call |
| REQ-008 | The non-persisting origin unexpectedly breaks a legitimate ingest auto-fix use case | Revert the origin argument on the ingest callback; ingest returns to prior (unsafe but previously-shipped) behavior |
| REQ-009 | A caller depended on the foreground scan's synchronous return value/timing | Revert the default back to foreground; `background: true` remains available as an explicit opt-in (unchanged existing behavior) |
| REQ-010 | The leaseId/generation token introduces a new startup failure mode | Revert to the prior classify/remove/create sequence; the SQLite sidecar lock (unchanged by this item) continues to prevent actual data loss |
| REQ-011 | The new canonical socket default conflicts with an existing deployment's environment assumptions | Revert `model-server-supervision.cjs`'s fallback to the prior `options.dbDir`-derived path; no schema/data migration involved |
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `launcher-ipc-bridge.cjs` `maybeBridgeLeaseHolder()` | Producer of warm-owner readiness result | Update — must forward result to session proxy | `rg -n "maybeBridgeLeaseHolder\|waitForDaemonReady" .opencode/bin/lib/*.cjs .opencode/bin/*.cjs` |
| `launcher-session-proxy.cjs` `createSessionProxy().start()` | Consumer that currently re-probes independently | Update — skip probe on warm-owner path only | Manual daemon restart timing; reattach-path test unaffected |
| `mk-spec-memory-launcher.cjs` `classifyOwnerLease()`/lease functions | Producer of owner-lease state + `ps` classification | Update — bounded `ps` timeout (REQ-007); leaseId/generation token (REQ-010) | `rg -n "classifyOwnerLease\|readParentPid\|leaseId" .opencode/bin/mk-spec-memory-launcher.cjs` |
| `memory-ingest.ts` async worker callback | Consumer of `indexSingleFile`, currently omits origin | Update — add non-persisting origin argument | `rg -n "indexSingleFile" .opencode/skills/system-spec-kit/mcp-server/handlers/*.ts` |
| `memory-index.ts` manual/maintenance scan call sites | Producer of scan invocation defaults | Update — default `background: true` | `rg -n "memory_index_scan\|background:" .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts` |
| `model-server-supervision.cjs` empty-env fallback | Producer of model-socket path | Update — canonical constant, not `dbDir`-derived | `rg -n "DEFAULT_MODEL_SERVER_SOCKET\|resolveModelServerSocketPath" .opencode/bin/lib/model-server-supervision.cjs` |
| `mk-skill-advisor-bridge.mjs` `createChildEnv()` | Consumer reachable via `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1` | Not a consumer to change — REQ-011 fixes the fallback it reaches, not this bridge itself | `rg -n "createChildEnv\|HF_EMBED_SERVER_URL" .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` |
| `handler-memory-index.vitest.ts` / launcher + cross-launcher test suites | Existing regression coverage | Extend — one new test per REQ item | `npx vitest run` against each touched suite |

Required inventories:
- Same-class producers: `rg -n 'persistQualityLoopContent|fromScan' .opencode/skills/system-spec-kit/mcp-server/handlers/*.ts` — confirms REQ-008 is the only remaining caller (research §3 already performed this sweep twice independently; re-run here is a cheap re-confirmation, not new investigation).
- Consumers of changed symbols: `rg -n 'waitForDaemonReady|classifyOwnerLease|DEFAULT_MODEL_SERVER_SOCKET' . --glob '*.cjs' --glob '*.ts'`.
- Matrix axes: probe path (warm-owner / reattach) × ready-state (ready / not-ready); lease state (fresh / stale / contended) × actor count (single / two racing launchers); scan mode (foreground / background) × caller (manual / maintenance).
- Algorithm invariant (REQ-010, concurrency-sensitive): no launcher may unlink a lease it did not itself just re-validate as stale at unlink time; adversarial case is the exact two-launcher interleaving research §7.1 constructed (both classify stale, one is delayed, the delayed one must not unlink the other's fresh lease).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Root-Cause) ──> Phase 2 (Fix + Tests) ──> Phase 3 (Build + Docs) ──> Phase 5 (Hardening) ──> Phase 4 (Perf Measurement)
```

Phase 5 is documented as "Phase 4" in the doc's original numbering order (perf measurement was scoped first) but is recommended to execute *before* Phase 4 in practice, since Phase 4's Step 0 measurement should run against a hardened daemon rather than one with a known startup race (REQ-007) and a known operability hang (REQ-009).

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Root-Cause | None | Fix + Tests |
| Fix + Tests | Root-Cause | Build + Docs |
| Build + Docs | Fix + Tests | Hardening, Perf Measurement |
| Hardening (Phase 5) | Build + Docs | None directly; recommended before Perf Measurement |
| Perf Measurement | Build + Docs (+ daemon restart); recommended after Hardening | None |
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
| REQ-007 Probe collapse | Medium (two cooperating CJS modules + a bounded-timeout wrapper) | ~1.5 hours |
| REQ-008 Async-ingest origin | Low (mirrors the already-shipped REQ-006 pattern) | ~30 minutes |
| REQ-009 Background-job default | Low (reuses shipped job infrastructure) | ~45 minutes |
| REQ-010 Lease fencing | Medium-High (concurrency-sensitive; needs the exact interleaving test) | ~2-3 hours |
| REQ-011 Canonical socket default | Low | ~30 minutes |
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
