---
title: "Implementation Plan: Orphan Sweep Cursor and Corpus Identity Repair"
description: "Fix the never-persisted orphan-sweep cursor, then run three separately revertible corpus repairs: a count-verified dead-path row drain plus checkpoint-clean track-prefix identity heal and dup-hash collapse migrations, plus reconcile/discovery hardening."
trigger_phrases:
  - "orphan sweep cursor plan"
  - "dead path row drain"
  - "identity heal migration"
  - "dup hash collapse migration"
  - "restore by count verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-03T15:04:09Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 implementation plan with affected-surfaces addendum and rollback design"
    next_safe_action: "Execute Phase 1 verification and baseline capture before touching code"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-orphan-sweep-cursor-and-corpus-identity-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Orphan Sweep Cursor and Corpus Identity Repair

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), Node 22+ |
| **Framework** | spec-kit memory MCP server (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite via better-sqlite3 + sqlite-vec (~1.3GB production DB, 33,101 rows) |
| **Testing** | vitest (mcp_server test suite) + live-DB SQL count probes |

### Overview
Two code fixes and three data repairs. Code: persist the orphan-sweep cursor (`handlers/memory-index.ts:684` currently calls `sweepOrphanIndexRows({ limit: 200 })` with no cursor, report §3 #4) and harden `reconcileMoves`/path resolution/scope-prefix handling. Data: drain the 12,352 dead-path rows via the advancing sweep (deleting only file-absent rows with deletion-count reconciliation, no pre-drain checkpoint), then behind `checkpoint_create` snapshots repoint `system-spec-kit/*` rows to `system-speckit/*` where targets exist and collapse 12,280 dup-hash parents to one winner per logical key. The migration safety design is the core of this plan: cursor persistence is trivial code, but the repairs rewrite or delete ~12k rows and are planned as three separately revertible steps (ADR-004) with checkpoint-clean heal/collapse and a count-verified drain.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Confirm-before-fix evidence recorded for all 🟡 findings (#17, path resolution, scope prefix, discovery alignment)
- [ ] Baseline captured: vitest results + live-DB counts (orphan rows, dup-hash parents, cross-prefix pairs, per-prefix totals)
- [ ] Checkpoint create/restore drill passed on a DB copy

### Definition of Done
- [ ] All REQ-001..REQ-010 acceptance criteria met with evidence in checklist.md
- [ ] Vitest suite re-run whole; delta vs baseline reported
- [ ] Success gates verified by SQL (SQL-level invariant at 001-completion): orphan rows = 0, cross-prefix duplicate active rows = 0, 1 active row per logical key (search-level one-row-per-doc deferred to post-002)
- [ ] Checkpoint ids for heal/collapse recorded in implementation-summary.md; drain deletion counts reconciled against the baseline dead-row class (no drain checkpoint)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP server: handlers (tool surface) call lib/storage (index lifecycle) over a shared better-sqlite3 connection; schema and migrations live in lib/search/vector-index-schema.ts (SCHEMA_VERSION 41 today).

### Key Components
- **`sweepOrphanIndexRows` (lib/storage/incremental-index.ts:443)**: batch existence-check of stored paths; already returns `nextCursor`; gains a caller-supplied cursor and hardened path resolution.
- **`reconcileMoves` (lib/storage/incremental-index.ts:547)**: move detection and row repointing; gains `active_memory_projection` repoint (line 657 region), track-level rename support, and chunked-doc coverage.
- **Maintenance-state storage (new, vector-index-schema.ts migration)**: single-row keyed table persisting the sweep cursor across scans and restarts (ADR-003).
- **Identity-heal + dup-collapse migrations (vector-index-schema.ts)**: two one-shot, chunked, idempotent migrations honoring `idx_memory_logical_key_active_unique` (line 2402, partial: active rows only).
- **`near_duplicate_of` backfill (lib/storage/near-duplicate.ts)**: collapse writes `{id: winnerId, similarity, threshold}` JSON (matching the active writer at :141-146) onto deprecated losers (ADR-002).
- **Scope/discovery surfaces (handlers/memory-index-discovery.ts:97, lib/search/folder-discovery.ts:1304, lib/discovery/spec-document-finder.ts)**: legacy `specs/` prefix acceptance and one shared discovery contract.

### Data Flow
Scan (handlers/memory-index.ts) loads persisted cursor, runs sweep batch, persists `nextCursor`, and deletes rows whose resolved path is absent. Migrations run once at schema bump: classify each stale-prefix row via the decision tree (repoint / collapse / drain), then collapse remaining dup-hash groups. Reads are unaffected until rows disappear or repoint; phase 002's predicate later hides deprecated losers from lexical channels.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| handlers/memory-index.ts:684 (producer) | Calls `sweepOrphanIndexRows({ limit })` with no cursor; echoes `nextCursor` into scan results | update: load/persist cursor around the call | `rg -n "sweepOrphanIndexRows" .opencode/skills/system-spec-kit/mcp_server --glob '!**/dist/**'` shows all call sites carry cursor handling |
| lib/storage/incremental-index.ts:443 (owner) | Defines sweep: cursor default 0, path existence check, returns `nextCursor` | update: accept cursor contract, resolve relative paths against base before existence check | unit test: relative-path fixture not swept; cursor round-trip test |
| lib/storage/incremental-index.ts:547-700 (owner) | `reconcileMoves`: per-folder move matching; UPDATE at :657 region does not repoint `active_memory_projection`; LIMIT 2 guard on chunked docs; the repoint UPDATE (:665) and the chunked candidate select (:599-600) both carry `AND embedding_status != 'failed'`, skipping ~4,247 failed rows | update: projection repoint, track-level rename, chunked coverage, failed-embedding coverage | `rg -n "active_memory_projection\|embedding_status" .opencode/skills/system-spec-kit/mcp_server/lib --glob '!**/dist/**'` consumer inventory; move-then-reuse test; failed-embedding reconcile test (T031) |
| lib/search/vector-index-schema.ts (schema owner) | SCHEMA_VERSION 41; migration v28 precedent deprecates dup active rows; partial unique index at :2402 | update: new migrations (maintenance-state table, heal step, collapse step) | migration idempotency re-run test changes 0 rows; schema_version advances once per step |
| lib/storage/near-duplicate.ts (ACTIVE writer + reader of `near_duplicate_of`) | Save-time writer at :141-146 stores `{id, similarity, threshold}` JSON (gated by `isMemoryIdempotencyEnabled()`); reader `parseNearDuplicateHint` (+ response-builder.ts:386-390/:698-699). 0 rows populated today (ledger L1) but the code is live, not dead schema | update: backfill during collapse in the SAME JSON shape per ADR-002 (never a bare integer) | `rg -n "near_duplicate_of" .opencode/skills/system-spec-kit/mcp_server --glob '!**/dist/**'` consumer inventory before/after; assert the backfill JSON parses via `parseNearDuplicateHint` |
| handlers/memory-index-discovery.ts:97 (policy) | `normalizeSpecFolderScope` silently rejects legacy `specs/`-prefixed scopes (ledger agent F) | update: accept and normalize legacy prefix | scoped-search parity test legacy vs canonical scope |
| lib/search/folder-discovery.ts:1304 + lib/discovery/spec-document-finder.ts (same-class producers) | Two discovery surfaces with drifting base-path sets | update or prove aligned: T003 decides | `rg -n "getSpecsBasePaths\|findSpecDocuments" .opencode/skills/system-spec-kit/mcp_server --glob '!**/dist/**'` |
| handlers/memory-crud-health.ts (status consumer) | Reports `orphanFiles` from a 200-row sample as if total (ledger L2) | update: honest figure or explicit sampled label | health output vs raw SQL reconciliation after drain |
| lib/search/hybrid-search.ts:949 (downstream consumer) | Result dedup keys on row id only; benefits from corpus repair but code unchanged here | unchanged (result-time file-identity collapse belongs to phase 003) | note recorded; `rg -n "canonicalResultId" mcp_server/lib/search` |
| mcp_server tests (consumers) | Existing scan/reconcile/dedup tests encode current behavior | update: new tests for cursor, heal decision tree, collapse winner rule, projection repoint | vitest baseline delta report |
| docs: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` + skill references (consumers) | Describe scan/sweep behavior without cursor semantics | update if flags/behavior described there change | `rg -n "orphan" .opencode/skills/system-spec-kit --glob '*.md' --glob '!**/specs/**'` |

Required inventories:
- Same-class producers: `rg -n "sweepOrphanIndexRows|nextCursor|ORPHAN_SWEEP_LIMIT" .opencode/skills/system-spec-kit/mcp_server --glob '!**/dist/**' --glob '!**/node_modules/**'`.
- Consumers of changed symbols: `rg -n "reconcileMoves|active_memory_projection|near_duplicate_of|normalizeSpecFolderScope|getSpecsBasePaths|findSpecDocuments" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts' --glob '!**/dist/**'`.
- Matrix axes (heal decision tree): prefix of stored path {stale, current} x target file exists {yes, no} x current-prefix twin row exists {yes, no} x row is chunked child {yes, no}. Rows enumerated in tasks.md T016 before implementation.
- Algorithm invariant (path resolution): a stored path is classified orphaned only if its base-resolved absolute path does not exist; resolution must never escape the workspace base (adversarial cases: `..` segments, absolute stored paths, symlinked bases, case-variant prefixes).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm-Before-Fix Verification and Baseline
- [ ] Reproduce/confirm each 🟡 finding with quoted code or a failing probe (#17 projection, path resolution, scope prefix, discovery alignment)
- [ ] Capture vitest baseline and live-DB SQL baseline counts
- [ ] Checkpoint create/restore drill on a DB copy

### Phase 2: Orphan-Sweep Cursor Persistence (low blast, ships alone)
- [ ] Maintenance-state migration (cursor storage, ADR-003)
- [ ] Wire cursor load/advance/wraparound through handlers/memory-index.ts:684
- [ ] Unit tests: persist, resume-after-restart, wraparound

### Phase 3: Path-Resolution Hardening (must precede drain)
- [ ] Resolve relative stored paths against base in sweepOrphanIndexRows (REQ-008)
- [ ] Adversarial path tests (relative, absolute, `..`, case-variant)

### Phase 4: Dead-Path Row Drain (high blast, count-verified)
- [ ] Capture the baseline dead-row count; establish the file-absent delete guard (no pre-drain checkpoint: the drain spans ~24h of scheduled scans with the watcher live, so one checkpoint restore would lose a day of legitimate writes)
- [ ] Dry-run count vs baseline (12,352 expected class)
- [ ] Drain via advancing sweep deleting only file-absent rows; reconcile deletion count against the baseline (restore-by-count-verification); verify orphan rows = 0

### Phase 5: Identity-Heal Migration (high blast, checkpointed, separately revertible)
- [ ] `checkpoint_create`, record id
- [ ] Decision-tree classification (repoint / route-to-collapse / route-to-drain)
- [ ] Chunked idempotent repoint of stale-prefix rows; track-level rename support in reconcileMoves

### Phase 6: Dup-Hash Collapse (high blast, checkpointed, separately revertible)
- [ ] `checkpoint_create`, record id
- [ ] Winner heuristic validated on sampled pairs (OQ-1)
- [ ] Collapse: keep winner, deprecate losers, backfill `near_duplicate_of` (ADR-002); record loser ids for phase 002

### Phase 7: Reconcile and Discovery Hardening
- [ ] `active_memory_projection` repoint in reconcileMoves (REQ-005)
- [ ] Chunked-doc reconcile coverage (LIMIT 2 guard) (REQ-006)
- [ ] Legacy `specs/` prefix acceptance + discovery-surface alignment (REQ-009)

### Phase 8: Verification and Delta Report
- [ ] Re-run whole vitest gate; report delta vs baseline
- [ ] SQL success gates: orphan 0, cross-prefix dupes 0, 1 active row per logical key
- [ ] Health `orphanFiles` honesty check; scoped-search 1-row-per-doc probe; docs updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline-before-delta | Whole vitest gate + SQL counts captured BEFORE any change; identical gate re-run after; delta reported with real numbers, never asserted from memory | vitest, sqlite3 CLI probes |
| Unit | Cursor persist/advance/wraparound; path-resolution adversarial table; winner heuristic; heal decision tree per matrix row | vitest |
| Integration | Move-then-path-reuse projection repoint; track-rename reconcile; chunked parent reconcile; migration idempotent re-run (0 changes) | vitest + fixture DB |
| Data verification | Post-step SQL gates on the live DB: orphan count, cross-prefix pair count, active-rows-per-logical-key, loser `near_duplicate_of` coverage | sqlite3 read-only probes |
| Restore drill | checkpoint_create then restore on a DB copy; documented command sequence | checkpoint tooling |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| checkpoint_create / restore (handlers/checkpoints.ts, lib/storage/checkpoints.ts) | Internal | Green (exists; drill pending) | No safe path for destructive steps; phase halts before Phase 4 |
| Phase 002 shared active-row predicate | Internal (forward) | Yellow (not started) | Deprecated losers stay visible in lexical/graph channels until 002; user-visible dedup win partially deferred |
| Phase 011 daemon/CLI trust | Internal (recommended predecessor) | Yellow | Verification numbers less trustworthy; proceed with raw SQL probes as source of truth |
| Quiesced scans during migration steps | Internal (operational) | Green (scan pause achievable) | Row set shifts mid-migration; counts drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-step SQL verification fails (wrong counts, unique-index collision, valid rows missing), or search regressions attributable to the drain/heal/collapse.
- **Procedure**: The bounded heal and collapse migrations each record a `checkpoint_create` id BEFORE their first mutation; rollback restores that step's checkpoint only, preserving earlier completed steps (ADR-004). The dead-row drain records no restorable pre-drain checkpoint (it spans ~24h of scheduled scans with the watcher live); its rollback is restore-by-count-verification: because only file-absent rows are deleted, reconcile the deletion count against the baseline dead-row class and halt on divergence. Code changes revert by git (cursor persistence and reconcile hardening are additive and independently revertible). Dup-collapse losers are deprecated, not deleted, so a wrong winner reverses with an UPDATE swapping tiers, no restore needed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Verify+Baseline) ──► Phase 2 (Cursor) ──► Phase 3 (Path Hardening) ──► Phase 4 (Drain)
                                                                                    │
Phase 7 (Reconcile/Discovery) ◄── Phase 6 (Collapse) ◄── Phase 5 (Identity Heal) ◄─┘
                    │
                    └──► Phase 8 (Verification + Delta)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Verify+Baseline | None | All |
| 2 Cursor | 1 | 4 |
| 3 Path hardening | 1 | 4 (drain must not run on unhardened resolution) |
| 4 Drain | 2, 3, checkpoint drill | 5 |
| 5 Identity heal | 4 (dead rows removed first shrinks heal set) | 6 |
| 6 Dup collapse | 5 (heal exposes true twins) | 8 |
| 7 Reconcile/discovery | 1 (can start parallel to 4-6) | 8 |
| 8 Verification | 4, 5, 6, 7 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Verify + baseline | Med | 2-3 hours |
| 2 Cursor persistence | Low | 1-2 hours |
| 3 Path hardening | Low-Med | 1-2 hours |
| 4 Dead-row drain | Med (operational care) | 1-2 hours |
| 5 Identity-heal migration | High | 3-5 hours |
| 6 Dup-hash collapse | High | 3-5 hours |
| 7 Reconcile/discovery hardening | Med | 2-4 hours |
| 8 Verification + delta | Med | 1-2 hours |
| **Total** | | **14-25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created and id recorded before EACH of heal, collapse (bounded migrations); drain baseline dead-row count captured for count-verification (no drain checkpoint)
- [ ] Restore drill passed once on a DB copy (documented commands)
- [ ] Scans quiesced for the duration of each bounded migration step (heal, collapse); the drain runs with the watcher live across scheduled scans

### Rollback Procedure
1. Stop scans/daemon writes to the memory DB.
2. Identify the failed step. For heal/collapse: its recorded checkpoint id (implementation-summary.md log). For the drain: there is no checkpoint (it spans ~24h with the watcher live).
3. For a failed heal/collapse migration: restore that checkpoint via the checkpoint tooling (handlers/checkpoints.ts surface). For the drain: reconcile the deletion count against the baseline dead-row class and halt the sweep on divergence (restore-by-count-verification), since only file-absent rows were deleted.
4. Re-run the step's post-verification SQL to confirm the pre-step state returned.
5. For a wrong dup-collapse winner only: skip restore; swap tiers with a scoped UPDATE (losers are deprecated, not deleted) and clear the affected `near_duplicate_of` values.
6. Revert the code commit for the step if the defect is in migration logic, then reopen the matching tasks.

### Data Reversal
- **Has data migrations?** Yes: dead-row drain (deletes ~12,352 rows), identity heal (rewrites path/prefix identity on up to ~12,306 rows), dup collapse (deprecates losers across 12,280 dup-hash parents and backfills `near_duplicate_of`).
- **Reversal procedure**: Heal and collapse revert by per-step checkpoint restore (separately revertible by design, ADR-004); collapse is additionally reversible without restore via a tier-swap UPDATE because losers are retained as deprecated rows. The drain reverts by count-verification (delete only file-absent rows, reconcile counts) rather than checkpoint restore, because it spans ~24h of scheduled scans with the watcher live.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Maintenance-state│───►│ Cursor wiring    │───►│ Dead-row drain   │
│ migration (P2)   │    │ memory-index:684 │    │ (checkpointed)   │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
┌──────────────────┐                                     │
│ Path hardening   │─────────────────────────────────────┤
│ sweep :443 (P3)  │                                     ▼
└──────────────────┘                          ┌──────────────────┐
┌──────────────────┐                          │ Identity heal    │
│ Reconcile/discov.│──────────────┐           │ (checkpointed)   │
│ hardening (P7)   │              │           └────────┬─────────┘
└──────────────────┘              ▼                    ▼
                        ┌──────────────────┐ ┌──────────────────┐
                        │ Verification +   │◄│ Dup collapse     │
                        │ delta report (P8)│ │ (checkpointed)   │
                        └──────────────────┘ └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Maintenance-state migration | None | Cursor storage | Cursor wiring |
| Cursor wiring (handlers/memory-index.ts) | Maintenance-state | Advancing sweeps | Drain |
| Path hardening (incremental-index.ts:443) | Confirm-before-fix T002 | Safe orphan classification | Drain |
| Dead-row drain | Cursor + hardening + checkpoint | Orphan rows = 0 | Identity heal |
| Identity heal | Drain complete | Stale-prefix rows repointed | Dup collapse |
| Dup collapse | Heal complete | 1 active row per logical key + `near_duplicate_of` backfill | Verification |
| Reconcile/discovery hardening | T001/T003 evidence | Projection repoint, track renames, scope acceptance | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 verify + baseline** - 2-3h - CRITICAL
2. **Phase 3 path hardening** - 1-2h - CRITICAL (drain gate)
3. **Phase 4 dead-row drain** - 1-2h - CRITICAL
4. **Phase 5 identity-heal migration** - 3-5h - CRITICAL
5. **Phase 6 dup-hash collapse** - 3-5h - CRITICAL
6. **Phase 8 verification + delta** - 1-2h - CRITICAL

**Total Critical Path**: 11-19 hours

**Parallel Opportunities**:
- Phase 2 (cursor) and Phase 3 (path hardening) can run simultaneously after Phase 1.
- Phase 7 (reconcile/discovery hardening) can run parallel to Phases 4-6; only Phase 8 needs all of them.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline + confirmations complete | All 🟡 findings confirmed or reclassified; baseline numbers committed | End of Phase 1 |
| M2 | Cursor persisted and draining safely | Two scans advance the window; relative-path fixtures survive | End of Phase 3 |
| M3 | Corpus repaired | Orphan rows 0; cross-prefix dupes 0; 1 active row per logical key | End of Phase 6 |
| M4 | Phase verified and handed off | Vitest delta reported; checklist P0/P1 evidenced; loser ids handed to phase 002 | End of Phase 8 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR Index (full records in decision-record.md)

**ADR-001**: Dead-path row disposal: drain-then-delete via the advancing sweep, not deprecate-then-sweep.

**ADR-002**: `near_duplicate_of`: backfill on deprecated dup losers during collapse in the active `{id, ...}` JSON shape (matching the live writer/reader), not a bare integer; keep the column.

**ADR-003**: Cursor persistence: dedicated single-row maintenance-state table in the memory DB.

**ADR-004**: Migration packaging: drain, heal, and collapse as three separately revertible steps (checkpoint-clean heal/collapse, count-verified drain), not one combined migration.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
