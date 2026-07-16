---
title: "Implementation Plan: standalone save second-writer guard"
description: "Add daemon liveness detection before generate-context Step 11.5 imports the indexing runtime, keep standalone direct indexing only when the daemon is down, and document the MCP indexing follow-up."
trigger_phrases:
  - "standalone save second writer plan"
  - "Step 11.5 daemon guard plan"
  - "memory_index_scan operator contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented standalone save daemon guard"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Standalone Save Second-Writer Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript scripts workspace + Node runtime |
| **Framework** | Vitest, TypeScript project references, better-sqlite3 index runtime |
| **Storage** | `context-index.sqlite` owned by the daemon when mk-spec-memory is running |
| **Testing** | Focused scripts vitest plus scripts TypeScript build and strict packet validation |

### Overview
Step 11.5 currently acts like the daemon is never running. This plan adds a pre-import daemon guard so the standalone save process only writes the index when it is the sole writer. Daemon-up saves still persist docs before indexing; they skip direct reindexing and tell operators to run MCP `memory_index_scan`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code` OpenCode TypeScript route loaded.
- [x] `workflow.ts`, indexing API, launcher lease shape, launcher lease writer, scripts package scripts, and `/memory:save` command doc read.
- [x] Sibling 009 Level 2 packet structure reviewed.

### Definition of Done
- [ ] Scripts TypeScript build passes.
- [ ] Focused scripts vitest passes.
- [x] Daemon-up test proves Step 11.5 does not call the indexing runtime.
- [x] `/memory:save` docs state daemon-up/down operator contract.
- [ ] Packet strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only daemon liveness guard before DB-owning imports. The launcher lease remains a signal, not a lock: the save workflow reads the lease, probes PID liveness, and decides whether to skip the standalone direct indexing path before any second-writer connection can be opened.

### Key Components
- **`daemon-detect.ts`**: resolves `.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json`, parses `pid`/`ownerPid`, and reuses shared PID liveness.
- **`workflow.ts` Step 11.5**: calls the daemon detector before dynamic importing `@spec-kit/mcp-server/api/indexing`.
- **`/memory:save` command doc**: states the interim operator rule for daemon-up and daemon-down saves.

### Data Flow
canonical docs written -> Step 11.5 liveness probe -> daemon alive: skip direct indexing and log MCP follow-up -> daemon not alive: import indexing API and run existing standalone `initializeIndexingRuntime()` plus `reindexSpecDocs()`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `workflow.ts` Step 11.5 | Direct spec-doc indexing after save | Add daemon liveness guard before dynamic import; extract Step 11.5 helper for direct tests | Focused workflow vitest |
| `daemon-detect.ts` | New helper | Resolve launcher lease and share ESRCH-tolerant process liveness with workflow locks | Detector vitest |
| `/memory:save` doc | Operator contract | Document daemon-down standalone direct indexing and daemon-up MCP scan | Markdown/source inspection |
| `scripts/package.json` | Verification source | Confirm `npm run build` script | Scripts build |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `sk-code` and select OpenCode TypeScript verification route.
- [x] Read Step 11.5, workflow lock liveness, indexing API, launcher lease shape, launcher lease writer, package scripts, and command docs.
- [x] Read sibling 009 packet docs for Level 2 shape.

### Phase 2: Core Implementation
- [x] Add `scripts/core/daemon-detect.ts`.
- [x] Import shared `isProcessAlive` into `workflow.ts` and remove local duplicate.
- [x] Extract Step 11.5 logic into a testable helper.
- [x] Skip direct indexing when the daemon is alive.
- [x] Harden contention catch diagnostics.
- [x] Update `/memory:save` operator guidance.

### Phase 3: Verification
- [x] Add detector and workflow Step 11.5 tests.
- [ ] Run scripts build.
- [ ] Run focused scripts vitest.
- [ ] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Scripts TypeScript compilation | `npm run build` from `scripts` |
| Unit | Daemon lease liveness detector | `vitest run tests/daemon-detect.vitest.ts` |
| Regression | Step 11.5 daemon-up skip and contention diagnostic | `vitest run tests/workflow-step115-daemon-guard.vitest.ts` |
| Existing workflow | Canonical save metadata freshness test near Step 11.5 | `vitest run tests/workflow-canonical-save-metadata.vitest.ts` |
| Contract | Packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Launcher lease file | Internal | Present | Detector cannot know daemon state without it |
| `process.kill(pid, 0)` | Node runtime | Present | Liveness probe depends on platform process signaling semantics |
| MCP `memory_index_scan` | Runtime operator path | Present | Required for daemon-up indexing freshness |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Step 11.5 stops reindexing when daemon is down, detector misreports live leases, or docs/tests fail.
- **Procedure**: remove the daemon guard helper, restore the original Step 11.5 inline direct indexing block, remove the new tests/doc guidance, and rerun scripts build plus focused vitest.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (confirm) -> Phase 2 (implement) -> Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 1 hour |
| Verification | Medium | 0.75 hour |
| **Total** | | **~2.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No DB files modified.
- [x] No daemon, launcher, or SQLite pragma changes.
- [x] No launcher lease acquisition added.

### Rollback Procedure
1. Restore Step 11.5 direct indexing behavior.
2. Remove detector and tests.
3. Revert `/memory:save` operator doc additions.
4. Re-run scripts build, focused vitest, and strict packet validation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

