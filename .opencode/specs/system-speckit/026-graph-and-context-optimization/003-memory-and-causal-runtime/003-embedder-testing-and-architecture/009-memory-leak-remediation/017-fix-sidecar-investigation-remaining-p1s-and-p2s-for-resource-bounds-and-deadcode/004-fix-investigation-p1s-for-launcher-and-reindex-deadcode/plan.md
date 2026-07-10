---
title: "Implementation Plan: Launcher and Reindex P1 Finding Closure"
description: "Surgical CommonJS and TypeScript edits for F15, F49, and F105 with focused fixture coverage."
trigger_phrases:
  - "arc 010 003 004 implementation plan"
  - "launcher reindex p1 plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented F15, F49, F105"
    next_safe_action: "Run final verification and handoff"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0100030040100030040100030040100030040100030040100030040100030040"
      session_id: "010-003-004-launcher-reindex-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Launcher and Reindex P1 Finding Closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS launcher, TypeScript MCP server |
| **Framework** | Node.js, Vitest, better-sqlite3 |
| **Storage** | Filesystem owner-token state, SQLite reindex jobs |
| **Testing** | Vitest fixture suites plus TypeScript typecheck |

### Overview
Implement the smallest behavior changes that close the three P1 findings. The launcher gets atomic token publication and env filtering at the process boundary; reindex loses cancellation polling that has no production writer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified from sibling packets and finding registry.

### Definition of Done
- [x] All acceptance criteria met.
- [x] Tests passing for changed launcher and reindex surfaces.
- [x] Docs updated across spec, plan, tasks, checklist, decision record, and implementation summary.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical hardening inside existing launcher/reindex modules.

### Key Components
- **Owner-token publisher**: Creates a random temp token file, fsyncs it, and publishes it under an exclusive lock.
- **Child env builder**: Copies only allowed parent env keys and explicit sidecar overrides.
- **Reindex loop**: Processes batches without dead cancellation SELECTs.

### Data Flow
Launcher state flows from `stateDir()` to `.sidecar-owner-token`; child process config flows through `buildSidecarEnv()` into `spawn()`. Reindex jobs flow from queued/running to completed or failed; production mid-run cancellation is not advertised by this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `loadOrCreateOwnerToken` | Owns launcher owner-token creation | Add lock, random temp file, `wx`, fsync, rename | `ensure-rerank-sidecar.cjs:173-240`; F15 fixtures at `ensure-rerank-sidecar.vitest.ts:232-307` |
| `ensureRerankSidecar` spawn env | Passes env to sidecar process | Replace blanket inheritance with allowlist helper | `ensure-rerank-sidecar.cjs:124-139,383-391`; F49 fixture at `ensure-rerank-sidecar.vitest.ts:309-348` |
| `runJob` | Processes embedder reindex batches | Remove dead cancellation polling branches | `reindex.ts:338-388`; `embedder-reindex.vitest.ts` passed |
| `getCancellationStatus` | Status-only helper for dead polls | Delete | `rg getCancellationStatus reindex.ts` returns no source hit |

Required inventories:
- Same-class producers checked by reading F13/F69 sibling atomic-write decisions and `ensure-rerank-sidecar.cjs`.
- Consumers checked by `rg -n "getCancellationStatus|cancelJob|cancelled" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: owner token present/missing/concurrent, env allowed/disallowed/override, reindex queued/completed/failed paths.
- Security invariant: no unrelated parent env variable crosses the child-process boundary.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet.
- [x] Read sibling 010/003/001 and 010/002/001 precedent.
- [x] Read findings evidence for F15, F49, and F105.

### Phase 2: Core Implementation
- [x] Implement F15 atomic owner-token publish.
- [x] Implement F49 child env allowlist.
- [x] Implement F105 cancellation-poll deletion.
- [x] Add launcher fixture coverage.

### Phase 3: Verification
- [x] Run launcher vitest.
- [x] Run reindex and embedders vitest.
- [x] Run typecheck.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Atomic owner-token helper and env allowlist | `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` |
| Integration | Two Node processes racing token creation | Vitest fixture spawning `process.execPath` |
| Regression | Embedder reindex behavior | `mcp_server/tests/embedder-reindex.vitest.ts` and `mcp_server/tests/embedders/` |
| Static | MCP server types | `npm run typecheck --workspace=@spec-kit/mcp-server` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local Vitest under `mcp_server/node_modules` | Internal | Green | Use installed path when prompt's `node_modules/vitest` path is absent |
| better-sqlite3 test environment | Internal | Green | Reindex tests cover SQLite job table behavior |
| Spec validator | Internal | Green | Strict validation proves packet docs are complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Launcher cannot spawn sidecar because env filtering removed a required runtime variable, or owner-token creation fails on supported platforms.
- **Procedure**: Revert only this packet's code/doc changes; rerun launcher vitest, reindex vitest, typecheck, and strict validate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Research -> Implementation -> Fixture tests -> Verification -> Handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research | Existing finding registry and sibling packets | Implementation |
| Implementation | Research | Fixture tests |
| Fixture tests | Implementation | Verification |
| Verification | Fixture tests | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scaffold and read precedents |
| Core Implementation | Medium | Security-sensitive launcher edits plus dead-code deletion |
| Verification | Medium | Targeted tests, typecheck, strict validate |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration.
- [x] No feature flag required.
- [x] Verification commands captured in checklist.

### Rollback Procedure
1. Revert this packet's code changes.
2. Revert this packet's docs.
3. Rerun the verification command set.
4. Hand off any failure with exact command output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete no runtime data; owner-token files are backward-compatible plain text.
<!-- /ANCHOR:enhanced-rollback -->
