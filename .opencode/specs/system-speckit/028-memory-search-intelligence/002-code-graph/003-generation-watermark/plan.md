---
title: "Implementation Plan: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)"
description: "Approach and sequencing for the staged code-graph generation watermark: ship the soft additive Q6-C2 counter on the freshness envelope first (bumped at the scanPromotable finalize), defer the hard Q6-C1 as-of-generation error gate behind the bi-temporal cluster decision."
trigger_phrases:
  - "code graph generation watermark plan"
  - "q6-c2 soft watermark sequencing"
  - "scan finalize generation bump plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/003-generation-watermark"
    last_updated_at: "2026-06-19T08:16:05Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Q6-C2 soft watermark and reconciled the hard-gate deferral"
    next_safe_action: "Keep Q6-C1 gated until Q1-C1 schema work has a named consumer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Code Graph, Generation Watermark (Q6-C2 → Q6-C1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | mk-code-index MCP server (`system-code-graph/mcp_server`) |
| **Storage** | SQLite `code-graph.sqlite`, `code_graph_metadata` KV table (existing, no migration) |
| **Testing** | Vitest, co-located in `mcp_server/lib` |

### Overview
Add a monotonic `generation` counter to the code graph in two staged candidates. **Q6-C2 (Wave-1, ship now):** a typed read/bump pair over the existing `code_graph_metadata` KV store, bumped once per promoted scan at the correct `scanPromotable` finalize block and surfaced as an additive `generation` field on the freshness envelope, non-breaking, no read-filter change, no migration. **Q6-C1 (Wave-2, defer):** the hard as-of-generation error gate that turns a stale read into an ERROR. DEFER-speculative (no named consumer, redundant with the shipped readiness gate) but documented because it supplies the monotonic close-out key the Q1-C1 bi-temporal cluster needs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..003)
- [x] Dependencies identified (`code_graph_metadata` present, Q1-C1 cluster gates Q6-C1)

### Definition of Done
- [x] Q6-C2 acceptance criteria met (REQ-001..004): counter persists, bumps at finalize, additive/non-breaking
- [x] Tests passing: two-scan increment, unset→0, envelope carries counter, node/edge set unchanged
- [x] Q6-C1 design + DEFER-speculative gate documented (REQ-005), no Q6-C1 code
- [x] Docs reconciled (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive metadata over an existing KV store + a single in-finalize side-effect. No schema migration, off the `code-graph-db.ts` transaction chokepoint for Q6-C2.

### Key Components
- **`code-graph-db.ts` KV helpers**: `getCodeGraphGeneration()` / `bumpCodeGraphGeneration()` beside the existing `getMetadata`/`setMetadata` and `setLastGitHead`/`getLastGitHead` exports (~`:556-627`). The KV table stores strings only, so the counter is `String(n+1)` read back with `Number.parseInt`-with-fallback (the pattern at `:241`).
- **`handlers/scan.ts` finalize block**: the `if (scanPromotable)` region (~`:666-679`) where `setLastGitHead`/`setCodeGraphScope`/`recordCandidateManifest` already run after a successful promotion, the one site that fires for both `full_scan` and `selective_reindex`.
- **`code-graph-context.ts` freshness envelope**: `computeFreshness()` (~`:320`) and the envelope type (~`:52`), surfaced at the main result (`:258`) and empty-fallback (`:285`).

### Data Flow
A promoted scan finalizes → `bumpCodeGraphGeneration()` upserts `graph_generation = n+1` in `code_graph_metadata`. A later query calls `computeFreshness()`, which reads `getCodeGraphGeneration()` (default 0) and stamps `generation` onto the freshness envelope. No consumer branches on `generation` (Q6-C2). Q6-C1 (deferred) would add an as-of-generation read that errors when the requested generation is unsatisfiable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase corrects a REFUTED bump-site claim (`ensure-ready.ts:497`), so it touches scan-finalize, persistence and the public freshness envelope, affected-surfaces inventory required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/scan.ts` `scanPromotable` block (~`:666-679`) | Post-promotion finalize: `setLastGitHead`, `setCodeGraphScope`, `recordCandidateManifest` | update, add `bumpCodeGraphGeneration()` here | `rg -n 'scanPromotable' handlers/scan.ts`, confirm fires after both full + incremental promotion |
| `ensure-ready.ts:497` `setLastGitHead(currentHead)` | git-HEAD bookkeeping inside the `headChanged && headScope==='out-of-scope'` `freshness:'fresh'` branch | NOT a consumer, explicitly excluded (REFUTED bump site) | `sed -n '495,499p' ensure-ready.ts` shows it is the out-of-scope-HEAD return-fresh branch |
| `code-graph-db.ts` KV helpers (~`:556-627`) | `get/setMetadata`, `setLastGitHead`, scope helpers over `code_graph_metadata` | update, add typed generation read/bump | `rg -n 'setMetadata\|getMetadata\|code_graph_metadata' code-graph-db.ts` |
| `code-graph-context.ts` freshness envelope (`:52`, `:258`, `:285`, `:320`) | Sole builder + 2 surfacing sites of the freshness object | update, add `generation` field | `rg -n 'computeFreshness\|freshness' code-graph-context.ts` |
| `handlers/query.ts:903-915` binary readiness gate | Blocks reads on `freshness !== 'fresh'` | unchanged for Q6-C2, the gate Q6-C1 would later replace | `sed -n '903,915p' handlers/query.ts` |

Required inventories:
- Generation token absence (confirms PENDING): `rg -n 'bumpCodeGraphGeneration\|getCodeGraphGeneration\|graph_generation' .opencode/skills/system-code-graph/mcp_server` → expect zero hits before this phase.
- Consumers of the freshness envelope: `rg -n 'freshness' .opencode/skills/system-code-graph/mcp_server --glob '*.ts'`, confirm none branch on a `generation` field.
- Invariant (apply-once G2): a non-promoting rescan of unchanged content MUST NOT bump the counter, only `scanPromotable` finalize bumps.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the live `scanPromotable` finalize line range in `handlers/scan.ts` and the freshness envelope type line in `code-graph-context.ts`
- [x] Confirm the `Number.parseInt`-with-fallback precedent and the KV helper export block, note `code_graph_metadata` stores strings only
- [x] Confirm zero existing `graph_generation`/`*CodeGraphGeneration` tokens before implementation

### Phase 2: Core Implementation (Q6-C2)
- [x] Add `getCodeGraphGeneration()` (read `graph_generation` → `parseInt || 0`) and `bumpCodeGraphGeneration()` (`setMetadata('graph_generation', String(n+1))`) to `code-graph-db.ts`, exported beside the existing helpers
- [x] Call `graphDb.bumpCodeGraphGeneration()` once inside the `if (scanPromotable)` finalize block in `handlers/scan.ts`
- [x] Add `generation: number` to the freshness envelope type and stamp it from `getCodeGraphGeneration()` (default 0) in `computeFreshness()`

### Phase 3: Verification
- [x] Unit: unset → 0, one promoted scan → 1, two → 2, non-promoting scan → unchanged
- [x] Behavior: a context query result carries `metadata.freshness.generation` equal to the counter, and the returned node/edge set is byte-identical to baseline (no read-filter change)
- [x] `tsc` clean, Vitest green, docs reconciled, Q6-C1 design + DEFER gate recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `getCodeGraphGeneration`/`bumpCodeGraphGeneration` (unset→0, increment, malformed→0) | Vitest |
| Integration | scan → finalize bump → `computeFreshness().generation`, full vs selective both bump, non-promoting scan no-op | Vitest (in-memory or temp sqlite) |
| Manual | run `code_graph_scan` twice, observe `generation` advance in the context envelope | mk-code-index MCP / `code-index.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `code_graph_metadata` KV table | Internal | Green | Present (`code-graph-db.ts:193`/`:456`). Q6-C2 cannot store the counter without it |
| `scanPromotable` finalize block | Internal | Green | Present (`handlers/scan.ts` ~`:666-679`), the only correct bump site |
| Q1-C1 bi-temporal columns + `SCHEMA_VERSION` 5→6 | Internal | Red (deferred) | Gates Q6-C1 hard gate. Q6-C2 ships independently |
| Named consumer for as-of-generation reads | Product | Red (none) | DEFER-speculative gate for Q6-C1 (synthesis `01`/`04`) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Q6-C2 envelope change observed by an unexpected consumer, or the bump fires on a non-promoting scan.
- **Procedure**: `git revert` the Q6-C2 commit. `code-graph.sqlite` is a rebuildable cache so a stale `graph_generation` row is harmless and re-derives on the next scan (`code_graph_scan`).
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm seams) ──► Phase 2 (Q6-C2 implement) ──► Phase 3 (Verify)
                                                              │
Q6-C1 (DEFER-speculative) ◄── gated on Q1-C1 cluster + named consumer
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm seams | None | Q6-C2 implement |
| Q6-C2 implement | Confirm seams | Verify |
| Verify | Q6-C2 implement | None |
| Q6-C1 (deferred) | Q1-C1 columns + named consumer | (none this phase) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm seams | Low | 0.5 hour |
| Q6-C2 implement | Low | 1-2 hours |
| Verification | Low | 1 hour |
| Q6-C1 design doc | Low | (already captured in spec) |
| **Total** | | **~3-4 hours (Q6-C2 only)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration (Q6-C2 is KV-only), confirmed
- [ ] No feature flag needed (additive, non-breaking)
- [ ] Baseline node/edge result set captured for byte-identity comparison

### Rollback Procedure
1. `git revert` the Q6-C2 commit (3 source files + test).
2. Leave `graph_generation` row in `code_graph_metadata`, it is inert once the reader is gone, or delete the KV row via the existing metadata helper.
3. Smoke test: `code_graph_context` returns its prior freshness envelope, `code_graph_scan` succeeds.

### Data Reversal
- **Has data migrations?** No (KV write only, no schema change).
- **Reversal procedure**: N/A, `code-graph.sqlite` is a rebuildable cache. Worst case is a full `code_graph_scan`.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`.
- **Task breakdown**: See `tasks.md`.
