---
title: "Implementation Plan: Code-Graph Edge-Staleness Correctness"
description: "Wire reverse-dependency invalidation into the code-graph scan loop (force-parse importers of a changed dependency, captured BEFORE replaceNodes) so refactored exports no longer silently orphan dependents' edges, plus the additive rename SUPERSEDES edge keyed on contentHash. Code is implemented default-off/tombstone-gated, fan-in benchmark acceptance remains pending."
trigger_phrases:
  - "code graph edge staleness plan"
  - "reverse-dep force-parse plan"
  - "rename supersedes edge plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/002-edge-staleness-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-staleness-correctness plan from 028/002 research"
    next_safe_action: "Implement path-filtered queryImportersOf + forceParse override"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-edge-staleness-correctness"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code-Graph Edge-Staleness Correctness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | System Code Graph MCP server (`.opencode/skills/system-code-graph/mcp_server/`) |
| **Storage** | SQLite, `code_nodes` + `code_edges` (`SCHEMA_VERSION = 5`, no temporal columns), off-by-default `code_graph_tombstones` table |
| **Testing** | Vitest (focused code-graph scan / indexer / db suites alongside each change) |

### Overview
Two candidates against the incremental scan are now implemented with guarded rollout. **Unit 1 (the correctness bug)** wires reverse-dependency invalidation into the scan loop: before the per-file skip, snapshot the stale set, expand it with a path-filtered importers query and force-parse those importers so their cross-file edges are re-derived against a changed dependency's new symbol ids, the capture MUST happen before any `replaceNodes`. It remains default-off behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` until the fan-in benchmark gate clears. **Unit 2 (`Q1-C2`)** adds an additive `SUPERSEDES` edge keyed on `contentHash` for renamed/moved symbols, preserving lineage without a schema migration when the tombstone lane is enabled. Q1-C2 is an additive no-migration edge.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Seams confirmed in live code: skip `structural-indexer.ts:2175`, `isFileStale` (content-hash-gated) `code-graph-db.ts:1042`, prune `code-graph-db.ts:1030`, reverse-dep `queryFileImportDependents` `code-graph-db.ts:1343` (read-path-only, one caller `handlers/query.ts:1017`), symbol id `indexer-types.ts:102`, content hash `indexer-types.ts:109`, tombstones `code-graph-db.ts:230-318`
- [x] HARD ORDERING CONSTRAINT understood: reverse-deps captured before `replaceNodes` (post-persist JOIN returns nothing)
- [x] Path-filtered importers query shape decided (not the full-table scan)
- [x] Fan-in re-parse cost flagged as a build-time benchmark before any default-on flip

### Definition of Done
- [x] Unit 1: refactored dependency re-derives dependents' edges in the same scan, body-edit control causes no extra parse, ordering gate proven
- [x] Unit 1: path-filtered `queryImportersOf` used in the scan loop, full-scan `queryFileImportDependents` retained for the read-path consumer
- [x] Unit 2: rename emits a `contentHash`-keyed `SUPERSEDES` edge, `SCHEMA_VERSION` unchanged, absent-edge queries byte-identical
- [x] Typecheck + focused suites green, `validate.sh --strict` passes. Typecheck, broad Vitest and strict validation passed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reverse-dependency force-parse behind a pre-persistence ordering gate (correctness), plus an additive structural edge (lineage). No schema migration, no read-path rewrite for Unit 1's default behavior until the benchmark clears default-on.

### Key Components
- **Scan driver** (the `skipFreshFiles` consumer at `structural-indexer.ts:2107`, skip at `:2175`): the site that gains a `forceParse: Set<string>` override of the `skipFreshFiles && !isFileStale(file)` short-circuit.
- **`queryFileImportDependents()`** (`code-graph-db.ts:1343`): the read-path reverse-dep query (one caller `handlers/query.ts:1017`). The scan loop gets a sibling **path-filtered `queryImportersOf(stalePaths)`** rather than reusing this full-table scan.
- **`replaceNodes` / `pruneDanglingEdges`** (`code-graph-db.ts:924` / `:1030`): the persistence + prune path the ordering gate must precede.
- **Tombstone machinery** (`code-graph-db.ts:230` gate, `:296`/`:316` inserts): the substrate the Q1-C2 `SUPERSEDES` edge reuses.

### Data Flow
Incremental scan starts → snapshot stale set (content-hash changed files) → `queryImportersOf(stalePaths)` expands with reverse-dependents **(captured BEFORE any `replaceNodes`)** → importers added to `forceParse` → skip loop honors `forceParse` and re-parses importer A against dependency B's new symbol ids → A's cross-file edge re-derived to the new id (no silent vanish) → for a pure rename, additionally emit a `SUPERSEDES` edge keyed on matching `contentHash` from the old node to the new.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The fix touches a persistence-ordering + scan-skip boundary, so the producer/consumer inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| skip site (`structural-indexer.ts:2175`) | `if (skipFreshFiles && !isFileStale(file)) continue` | Update: honor a `forceParse` set that overrides the skip | Test: force-included importer re-parses, non-included fresh file still skipped |
| `isFileStale` (`code-graph-db.ts:1042`) | Content-hash-gated staleness predicate | Unchanged (confirms NOT mtime) | grep proof: predicate reads `currentContentHash`, not mtime |
| `queryFileImportDependents()` (`code-graph-db.ts:1343`) | Read-path reverse-dep (full-table scan) | Unchanged, retained for `handlers/query.ts:1017` | grep: one non-test caller remains, scan loop uses the new path-filtered query |
| `queryImportersOf(stalePaths)` (NEW, beside `:1343`) | n/a | Create: path-filtered importers query for the scan loop | Returns only importers of the changed paths |
| `replaceNodes` / `pruneDanglingEdges` (`code-graph-db.ts:924` / `:1030`) | Destructive replace + dangling prune | Unchanged, the ordering gate must run before these | Test: reverse-dep query post-`replaceNodes` returns empty |
| tombstone machinery (`code-graph-db.ts:230-318`) | Off-by-default delete tombstones | Reuse: substrate for the `SUPERSEDES` rename-lineage edge | `SUPERSEDES` edge keyed on `contentHash`, additive |

Required inventories:
- Same-class producers: `rg -n 'skipFreshFiles|isFileStale|forceParse|replaceNodes|pruneDanglingEdges' lib/`.
- Consumers of the reverse-dep query: `rg -n 'queryFileImportDependents|queryImportersOf' lib/ handlers/`.
- Algorithm invariant: a refactored dependency's reverse-dependents MUST re-derive their cross-file edges in the same scan, reverse-deps MUST be captured before persistence, a body-only edit MUST NOT trigger dependent re-parse.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm seams + the read-path-only usage of `queryFileImportDependents` (one caller `handlers/query.ts:1017`)
- [x] Decide the path-filtered `queryImportersOf(stalePaths)` shape (no full-table scan)
- [x] Confirm the HARD ORDERING CONSTRAINT (capture reverse-deps before `replaceNodes`)
- [x] Flag the fan-in re-parse benchmark as a build-time gate before default-on

### Phase 2: Core Implementation
- [x] Unit 1: add `queryImportersOf(stalePaths)` (path-filtered) to `code-graph-db.ts`
- [x] Unit 1: snapshot stale set + expand with reverse-deps + populate `forceParse` in the scan driver, BEFORE any `replaceNodes`
- [x] Unit 1: honor `forceParse` at the skip site (`structural-indexer.ts:2175`) so importers re-parse against new ids
- [x] Unit 2: emit a `contentHash`-keyed `SUPERSEDES` edge on rename instead of delete+create, reusing tombstone machinery, no `SCHEMA_VERSION` bump

### Phase 3: Verification
- [x] Reverse-dep re-derive test (rename B → A→B survives) + body-edit control (no extra A parse)
- [x] Ordering-gate test (post-`replaceNodes` reverse-dep query returns empty)
- [x] Rename→SUPERSEDES lineage test, absent-edge byte-identical query test
- [ ] Fan-in re-parse benchmark captured, typecheck + focused suite green, `validate.sh --strict`. Benchmark left pending by task constraint. Typecheck, broad Vitest and strict validation passed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reverse-dep re-derive: rename/kind-flip B → A→B `IMPORTS` survives, re-derived to new id | Vitest |
| Unit | Body-edit control: stable symbol_id → no extra A parse, A→B unchanged | Vitest |
| Unit | Ordering gate: reverse-dep query post-`replaceNodes` returns empty (proves before-persist capture is load-bearing) | Vitest |
| Unit | Q1-C2: rename emits a `contentHash`-keyed `SUPERSEDES` edge, absent-edge queries byte-identical, `SCHEMA_VERSION` unchanged | Vitest |
| Static | `queryFileImportDependents` read-path caller intact, scan loop uses the path-filtered query | rg grep gate |
| Benchmark | Fan-in re-parse cost on a hot high-importer file (gates default-on) | scan-perf fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Path-filtered `queryImportersOf` | Internal | Yellow (to build) | Reusing the full-table `queryFileImportDependents` causes a fan-in perf cliff |
| Fan-in re-parse benchmark | Internal | Yellow (unmeasured) | Gates the default-on decision for the staleness repair (regression-baseline rule) |
| Off-by-default tombstone machinery | Internal | Green (present, `code-graph-db.ts:230-318`) | Substrate for the Q1-C2 `SUPERSEDES` edge |
| HARD ORDERING CONSTRAINT (pre-`replaceNodes` capture) | Internal | Green (understood) | If violated, the JOIN returns nothing and the fix is a silent no-op |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: fan-in re-parse cost regresses scan latency, a focused test fails or the ordering gate proves unreliable.
- **Procedure**: revert the per-candidate scoped commit (Unit 1 and Unit 2 land as separate commits, either reverts alone). The reverse-dep force-parse can be feature-disabled to restore current skip behavior. The `SUPERSEDES` edge type is additive, leaving it in place unread is harmless. Existing queries are byte-identical without it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
                       │
   Unit 1 (staleness repair) ── needs queryImportersOf + ordering gate ──► benchmark gate
   Unit 2 (Q1-C2 SUPERSEDES) ── independent, additive, no migration
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core: Unit 1 (staleness) | Setup, path-filtered query | Benchmark, Verify |
| Core: Unit 2 (Q1-C2) | Setup, tombstone substrate | Verify |
| Verify | Core + benchmark gate | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core: Unit 1 (staleness repair, M) | Med | 5-8 hours |
| Core: Unit 2 (Q1-C2 SUPERSEDES, S) | Low | 3-4 hours |
| Benchmark (fan-in re-parse) | Med | 2-3 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **13-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Unit 1 and Unit 2 are separate scoped commits
- [ ] Reverse-dep force-parse is disable-able to restore current skip behavior
- [ ] `SUPERSEDES` edge confirmed additive (absent-edge queries byte-identical)
- [ ] Fan-in re-parse benchmark captured before any default-on flip, LEFT-PENDING: live benchmark/reindex/scan disallowed in this task.

### Rollback Procedure
1. Identify the regressing unit's scoped commit
2. `git revert` that commit (Unit 1 / Unit 2 are separable)
3. Re-run focused code-graph scan/indexer suite + the read-path caller grep
4. Leave the additive `SUPERSEDES` edge type in place if only Unit 1 reverts (unread = harmless)

### Data Reversal
- **Has data migrations?** No `SCHEMA_VERSION` bump (`code_edges` unchanged, `SUPERSEDES` rides the existing edge table / tombstone substrate).
- **Reversal procedure**: `SUPERSEDES` edges can be deleted by `edge_type` filter, the reverse-dep change is pure scan-ordering with no persisted state to migrate back.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research (PRIMARY)**: `../research/iterations/iteration-022.md` (build sketch, repro CONFIRMED), `../research/iterations/iteration-016.md`, `../research/iterations/iteration-002.md`, `../../research/synthesis/04-sibling-and-cross-cutting.md` (content-hash-gated correction).
- **Shipped record**: Wave-0 record and Wave-1 list.
