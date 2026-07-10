---
title: "Feature Specification: Code-Graph Edge-Staleness Correctness (dependency-transitivity + rename SUPERSEDES)"
description: "Fix the one real correctness bug in the code-graph scan: a file whose DEPENDENCY changed (own content-hash stable) leaves stale/orphaned edges because queryFileImportDependents is wired only to the read path. Wire reverse-dependency invalidation into the scan loop so dependents re-index, and add the additive rename-lineage SUPERSEDES edge, both attacking the path-coupled symbol-id failure mode."
trigger_phrases:
  - "028 code graph edge staleness"
  - "cross-file edge staleness incremental scan"
  - "queryFileImportDependents scan loop"
  - "rename supersedes edge code graph"
  - "dependency transitivity reverse-dep invalidation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/002-edge-staleness-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-staleness-correctness impl-phase spec from 028/002 research"
    next_safe_action: "Plan reverse-dep force-parse with pre-replaceNodes ordering gate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-edge-staleness-correctness"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "What is the path-filtered importers query (queryFileImportDependents full-scans the edge table today)?"
      - "What is the fan-in re-parse cost on a hot high-importer file (needs a benchmark before flip)?"
    answered_questions:
      - "The skip is content-hash-gated (isFileStale code-graph-db.ts:1042), NOT mtime, the iter-022 mtime framing was corrected by 006/synthesis-04"
      - "queryFileImportDependents has exactly one non-test caller: handlers/query.ts:1017 (read-path only), CONFIRMED"
      - "Both candidates were unshipped before this phase. Implementation now lives in the 028 phase docs/code with benchmark acceptance still pending"
---

# Feature Specification: Code-Graph Edge-Staleness Correctness (dependency-transitivity + rename SUPERSEDES)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Pending - built default-off; fan-in benchmark gates default-on acceptance |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Phase** | `system-code-graph/001-code-graph-core` (research) |
| **Parent Packet** | system-code-graph/001-code-graph-core |
| **Subsystem** | Code Graph, structural retrieval intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph incremental scan silently loses cross-file edges when a file's *dependency* is refactored. Symbol IDs are path-coupled, `sha256(filePath + '::' + fqName + '::' + kind).slice(0,16)` (`indexer-types.ts:102,104`), so a rename, kind-flip or move of an exported symbol B mints a NEW id, while a dependent A that imports B is content-hash-stable and gets skipped by the incremental scan (`isFileStale` is **content-hash-gated, not mtime**, `code-graph-db.ts:1042`, skip site `structural-indexer.ts:2175`). Because cross-file edges are derived only from the parsed batch, A's outbound edge to B is never re-derived against B's new id. B's `replaceNodes` drops the old target node and `pruneDanglingEdges` (`code-graph-db.ts:1030`) physically deletes the now-dangling A→B edge. The relationship **silently vanishes until A itself changes**. The lever to fix it already exists but is wired to the wrong path: `queryFileImportDependents()` (`code-graph-db.ts:1343`) has exactly one non-test caller, `handlers/query.ts:1017`, a read-path / `detect_changes` consumer, so the scan loop never consults it.

### Purpose
Make the incremental scan dependency-transitive: when a dependency changes, force-re-parse its reverse-dependents so their cross-file edges are re-derived against the new symbol ids (no silent edge loss), and additionally preserve rename lineage with an additive `SUPERSEDES` edge so the rename signal is captured rather than discarded as delete+create.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, four candidate ids, two units

**Unit 1, `CG-edge-staleness-repair` / `CG-edge-staleness-dependency-transitivity` (IMPLEMENTED default-off, benchmark gate pending):**
- Before the per-file skip loop, snapshot the stale set and **expand it with reverse-dependents** so a dependency change drags its importers back into the parse batch.
- Force-include importer files via a `forceParse: Set<string>` that overrides the `skipFreshFiles && !isFileStale(file)` short-circuit (`structural-indexer.ts:2175`), so A re-parses against B's new ids.
- **HARD ORDERING CONSTRAINT:** capture reverse-deps **BEFORE** any `replaceNodes` on B, post-persist, the JOIN on `code_nodes target` returns nothing because the edge already dangles (`queryFileImportDependents` INNER-JOINs live target nodes, `code-graph-db.ts:1346-1357`).
- Add a **path-filtered** importers query (`queryImportersOf(stalePaths)`). The existing `queryFileImportDependents()` full-scans the entire `code_edges` table with no path filter, which is the fan-in cost driver (`code-graph-db.ts:1344-1360`).
- Status note: implemented behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`. Default behavior remains unchanged until the fan-in benchmark clears.

**Unit 2, `Q1-C2` / `Q1-C2-supersedes-edge` (IMPLEMENTED tombstone-gated, no schema migration):**
- A renamed/moved symbol emits a `SUPERSEDES` edge keyed on matching `contentHash` (`sha256(content).slice(0,12)`, `indexer-types.ts:109`) across the rename, instead of pure delete+create, preserving rename lineage for impact queries.
- Strictly additive: a new edge type on the existing schema. Reuses the off-by-default tombstone machinery (`code-graph-db.ts:230` env gate `SPECKIT_CODE_GRAPH_TOMBSTONES`, `:296`/`:316` inserts) as the substrate. No `SCHEMA_VERSION` bump.
- Status note: emitted only when the existing tombstone lane is enabled. Absent-edge/default-off read paths remain unchanged.

### Out of Scope
- **Q1-C1 (`code_edges` bi-temporal `valid_at`/`invalid_at` columns)**, DEFER-speculative. No consumer wants as-of/time-travel, its safety is redundant with the shipped readiness gate and it does NOT fix this bug (synthesis `04`/`01`, 030 spec.md:48). Schema-migration cluster, separate phase.
- **Q6-C1 / Q6-C2 (generation watermark)**, DEFER-speculative (redundant with the readiness gate, no consumer, `01-go-candidates` Wave-0 corrections). Not part of the correctness bug.
- **Q3-C1 (seeded PPR impact ranking)**, net-new ranking machinery, Wave-2. Read-side ranking, not the scan-loop staleness fix.
- **Q2-C2 (content-address edge endpoints / decouple symbol id from path)**, L/high-conflict. Would obviate Q1-C2 but forces a different reindex granularity and risks cross-file fq_name collisions (iter-002 finding 11). The path-coupling is load-bearing for file-scoped `replaceNodes(fileId,...)`.
- **Prune-guard alternative** (skip the prune instead of re-deriving), rejected: leaves true dangling edges, worse than the bug (iter-022 rejected alternatives).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Adds default-off `forceParse: Set<string>` that overrides the `skipFreshFiles && !isFileStale(file)` skip, and re-derives cross-file edges for force-included importers. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Adds path-filtered `queryImportersOf(stalePaths)` beside `queryFileImportDependents()`, preserves inbound edges for surviving symbol ids and emits tombstone-gated `SUPERSEDES` lineage keyed on matching `contentHash`. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | Carries `forceParsedFiles` through the persistence skip gate so force-parsed importers are not discarded as fresh. |
| `.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts` | Created | Reverse-dep re-derive test, body-edit control, post-`replaceNodes` ordering test, tombstone-gated `SUPERSEDES` lineage test, absent-edge default test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `CG-edge-staleness-repair`: a dependency change re-derives its reverse-dependents' cross-file edges in the SAME incremental scan. | Index A (`import {foo} from './b'`) + B (`export function foo`), mutate B → `export const foo = () => {}` (kind-flip → new symbol_id), touch ONLY B, run incremental scan, assert the A→B `IMPORTS` edge survives, re-derived to B's new id. Seam confirmed: skip at `structural-indexer.ts:2175`, prune at `code-graph-db.ts:1030`. |
| REQ-002 | Reverse-dependents are captured BEFORE any `replaceNodes` on the changed dependency. | A test that runs the reverse-dep query post-`replaceNodes` returns empty (proving the ordering gate is load-bearing), and the production path captures reverse-deps before persistence. `queryFileImportDependents` INNER-JOINs live nodes (`code-graph-db.ts:1346-1357`). |
| REQ-003 | Body-only edits do NOT trigger dependent re-parse (the bug is the refactor class only, rename/kind-flip/move). | Control test: a body-only edit of `foo` (stable symbol_id) causes no extra A parse and leaves A→B unchanged. Symbol id is `sha256(filePath::fqName::kind)` (`indexer-types.ts:102`), stable id ⇒ target survives. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Path-filtered importers query replaces the full-table scan for the scan-loop path. | `queryImportersOf(stalePaths)` returns only importers of the changed paths, and `queryFileImportDependents()` (the full-scan, `code-graph-db.ts:1344-1360`) remains for the read-path consumer (`handlers/query.ts:1017`). Fan-in re-parse cost benchmarked on a hot high-importer file before flipping default-on. |
| REQ-005 | `Q1-C2`: a renamed/moved symbol emits a `SUPERSEDES` edge keyed on matching `contentHash`, instead of pure delete+create, additive, no schema migration. | Rename a symbol (path/fqName change, content unchanged), assert a `SUPERSEDES` edge links old→new node keyed on `contentHash` (`indexer-types.ts:109`), `SCHEMA_VERSION` unchanged (stays 5), existing read paths byte-identical when the edge is absent. |
| REQ-006 | The change is reversible and additive: Q1-C2 is off the staleness path, and the staleness repair is gate-able (default behavior unchanged until benchmarked). | Each candidate is a separate scoped commit, reverse-dep force-parse can be disabled to restore current skip behavior and the `SUPERSEDES` edge type does not alter existing query results. |

### Implementation Status

| Candidate | Status | Evidence |
|-----------|--------|----------|
| `CG-edge-staleness-repair` / dependency-transitivity | IMPLEMENTED default-off | `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, `edge-staleness-correctness.vitest.ts`, broad Vitest 7 files, 135 passed, 1 skipped |
| `Q1-C2` / `Q1-C2-supersedes-edge` | IMPLEMENTED tombstone-gated | `SPECKIT_CODE_GRAPH_TOMBSTONES`, `SCHEMA_VERSION` unchanged at 5, tombstone-on/off tests |
| Fan-in benchmark acceptance | LEFT-PENDING | Live benchmark/reindex/scan disallowed in this task, default-off flag remains the safety gate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A refactor of an exported symbol (rename / kind-flip / move) no longer silently orphans its dependents' edges, they are re-derived in the same incremental scan (the correctness bug closed).
- **SC-002**: Body-only edits incur no extra dependent re-parse (no perf regression on the common case), and the reverse-dep expansion fires only for the refactor class.
- **SC-003**: Rename lineage is preserved by an additive `SUPERSEDES` edge with zero schema migration and zero change to existing query results when absent.
- **SC-004**: The fan-in re-parse cost on a hot high-importer file is measured (path-filtered query, not full-table scan) before any default-on flip.
- **SC-005**: `validate.sh --strict` on this phase folder passes, typecheck + focused code-graph scan/indexer suites green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reverse-deps captured AFTER `replaceNodes` on B | Edge already dangles, the JOIN returns nothing, fix becomes a no-op | HARD ORDERING GATE: snapshot reverse-deps before persistence (REQ-002), and test the post-persist path returns empty |
| Risk | Full-table `queryFileImportDependents` reused in the scan loop | High fan-in file re-parses its whole dependent set every scan, a perf cliff | Add a path-filtered `queryImportersOf(stalePaths)`, and benchmark hot-file fan-in cost before default-on (REQ-004) |
| Risk | Force-parse over-expands (parses unchanged dependents on body edits) | Perf regression on the common path | Trigger reverse-dep expansion only when a dependency's symbol ids change (refactor class), not on stable-id body edits (REQ-003 control) |
| Risk | `detect_changes` consumers observe indexed-count > edited-count | Downstream consumers may assume 1:1 edit→index | Document the transitive re-index in the scan contract, consumers already tolerate batch re-derivation |
| Risk | Prune-guard alternative chosen instead of re-derive | Leaves true dangling edges, strictly worse than the bug | Rejected in spec scope, re-derive (force-parse) is the correct fix (iter-022) |
| Dependency | Off-by-default tombstone machinery (`code-graph-db.ts:230-318`) | Substrate for the Q1-C2 `SUPERSEDES` edge / rename lineage | Reuse the existing machinery, Q1-C2 is additive and does not require enabling tombstones for the core edge |
| Dependency | Benchmark harness for fan-in re-parse cost | Gates the default-on decision for the staleness repair | Capture a baseline per the regression-baseline rule before flipping default behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The reverse-dep expansion MUST use a path-filtered query, not the existing full-`code_edges`-table scan. Fan-in re-parse cost on a hot high-importer file is benchmarked before any default-on flip.
- **NFR-P02**: Body-only edits add zero extra parse work (the common case is untouched, expansion is refactor-class-only).

### Security
- **NFR-S01**: No new untrusted-content surface, the change touches scan-ordering and an additive structural edge only, no recalled content is rendered.

### Reliability
- **NFR-R01**: The reverse-dep capture is correctness-gated on ordering (before `replaceNodes`). A missing/empty reverse-dep set degrades to current behavior (no edge re-derived) rather than corrupting the graph.
- **NFR-R02**: The `SUPERSEDES` edge is additive, absence leaves all existing queries byte-identical, presence only adds lineage.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty reverse-dep set (no importers of the changed file): no force-parse, behavior identical to today.
- High fan-in dependency (many importers): path-filtered query bounds the JOIN, force-parse set may be large, this is the benchmarked cost (REQ-004 / NFR-P01).
- Rename with content change (not a pure rename): `contentHash` differs, so no `SUPERSEDES` edge is keyed, treated as delete+create (correct, it is a genuine change, not a rename).

### Error Scenarios
- Reverse-dep query runs after `replaceNodes` (mis-ordered): returns empty → edge silently still vanishes. Guarded by REQ-002 ordering test.
- A dependency and its dependent both change in the same scan: both parse normally, reverse-dep expansion is idempotent (already-in-batch files are not double-parsed).
- Tombstone machinery disabled: the core re-derive still works (force-parse is independent of tombstones), only the rename-lineage substrate for Q1-C2 relies on it.

### State Transitions
- Partial scan / crash mid-reindex: force-parse set is recomputed on the next scan from the current edge table, no persisted partial state to reconcile.
- Symbol kind-flip (`function foo` → `const foo`): new symbol_id ⇒ refactor class ⇒ reverse-dep expansion fires (REQ-001).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Files: ~3 prod + tests. LOC: ~150-300. Systems: incremental scan loop + edge-write/prune + tombstone substrate |
| Risk | 12/25 | Auth: N. API: N (internal lib). Breaking: ordering-gate + perf if full-scan reused. SUPERSEDES is additive |
| Research | 8/20 | Seams CONFIRMED in live code. Repro CONFIRMED (narrowed to refactor class). Fan-in cost UNMEASURED (needs-benchmark) |
| **Total** | **33/70** | **Level 2** (single correctness bug + additive edge, no schema migration) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- What is the exact shape of the path-filtered `queryImportersOf(stalePaths)` (the current `queryFileImportDependents` full-scans the whole `code_edges` table, `code-graph-db.ts:1344-1360`)?
- What is the fan-in re-parse cost on a hot high-importer file, and at what fan-in does default-on become a perf regression (needs a benchmark per the regression-baseline rule)?
- Does the `SUPERSEDES` edge need the tombstone machinery ENABLED (`SPECKIT_CODE_GRAPH_TOMBSTONES`) or can it ride the existing edge table as a new `edge_type` value (closed-vocab CHECK is a separate Wave, today `edge_type` is `TEXT` with no CHECK)?
- Is there a deterministic tie-break when one rename could match multiple `contentHash`-equal candidates (e.g. a copy-then-rename)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research (PRIMARY)**: `../research/research.md`, `../research/iterations/iteration-022.md` (CG-incremental-edge-staleness-repair build sketch, repro CONFIRMED), `../research/iterations/iteration-016.md` (the gap), `../research/iterations/iteration-002.md` (Q1-C2 SUPERSEDES candidate), `../../research/roadmap.md` (BROADENING §5 + MEMORY-SYSTEMS addenda), `../../research/synthesis/01-go-candidates.md` (Wave-1 row), `../../research/synthesis/04-sibling-and-cross-cutting.md` (CG-edge-staleness correction: content-hash-gated, not mtime).
- **Wave-0 shipped record**: Wave-0 record (neither candidate is in the done table, CG dependency-transitivity is listed in §Wave-1 at `the Wave-1 list`).
