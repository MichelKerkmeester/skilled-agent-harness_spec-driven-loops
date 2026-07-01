---
title: "Implementation Summary: Code-Graph Edge-Staleness Correctness"
description: "Implementation record for the code-graph edge-staleness correctness phase: both candidates (reverse-dependency force-parse staleness repair + additive rename SUPERSEDES edge) are built default-off / tombstone-gated with unit coverage. The fan-in re-parse benchmark that gates default-on for the staleness repair is still pending, so the phase stays below acceptance."
trigger_phrases:
  - "code graph edge staleness summary"
  - "reverse-dep force-parse status"
  - "rename supersedes edge status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/002-edge-staleness-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built both units default-off / tombstone-gated with unit coverage"
    next_safe_action: "Run the fan-in re-parse benchmark before any default-on flip"
    blockers:
      - "Fan-in re-parse cost UNMEASURED - benchmark gates default-on for the staleness repair"
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
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Code-Graph Edge-Staleness Correctness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/002-edge-staleness-correctness` |
| **Status** | pending — fan-in re-parse benchmark gates default-on |
| **Completed** | Built default-off / tombstone-gated; fan-in benchmark gates default-on (pending) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both candidates are built and unit-covered, shipped default-off / tombstone-gated, for the single real correctness bug in the Code Graph subsystem. They attack the path-coupled-symbol-id failure mode from two angles: re-deriving a refactored dependency's reverse-dependents in the same scan (the bug), and preserving rename lineage with an additive edge. The staleness repair stays gate-able until the fan-in re-parse benchmark clears it for default-on, the SUPERSEDES edge only emits when the tombstone substrate is enabled.

### Unit 1 - Reverse-dependency staleness repair (built, benchmark-gated for default-on)

When you refactor an exported symbol (rename, kind-flip or move), its dependents would otherwise lose their cross-file edges silently. The scan snapshots the stale set at scan start, expands it with a path-filtered reverse-dependents query (`queryImportersOf`, `code-graph-db.ts:1915`) and force-parses those importers (`structural-indexer.ts:2233-2324`) so their edges re-derive against the dependency's new symbol ids. The capture happens before `replaceNodes`, or the join would find nothing. Default-on stays benchmark-gated: the fan-in re-parse cost on a hot high-importer file is unmeasured.

### Unit 2 - Rename SUPERSEDES edge (built, tombstone-gated)

A pure rename is preserved as lineage rather than discarded as delete+create. The `SUPERSEDES` edge (`recordSupersedesLineage`, `code-graph-db.ts:1499`) is keyed on matching `contentHash` across the rename and rides the existing edge table plus the off-by-default tombstone substrate, so it adds no schema migration and leaves existing queries byte-identical when the tombstone substrate is off.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `structural-indexer.ts` | Modified | Snapshots reverse-dependents via `queryImportersOf` before `replaceNodes` and force-parses them so importer edges re-derive against new symbol ids |
| `code-graph-db.ts` | Modified | Path-filtered `queryImportersOf`, `SUPERSEDES` lineage (`collectSupersedesCandidates` / `recordSupersedesLineage`) keyed on `contentHash`, gated by the off-by-default tombstone substrate |
| `indexer-types.ts`, `config-defaults.ts`, `handlers/scan.ts` | Modified | Force-parsed-files plumbing + default-off config wiring |
| `tests/edge-staleness-correctness.vitest.ts` | Added | 5 unit tests: force-parse on identity change, body-only no-op, capture-before-replace ordering, SUPERSEDES lineage tombstone on/off |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as default-off code in commit `c1f2466811`. The staleness repair runs in the scan path but stays benchmark-gated before any default-on flip, the SUPERSEDES edge only emits when the tombstone substrate is enabled and is additive and reversible (delete by `edge_type`). Both units carry unit coverage, and the seam evidence below is confirmed against live code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix by re-deriving dependents (force-parse), not by guarding the prune | A prune-guard leaves true dangling edges, which is strictly worse than the bug. Re-deriving against the dependency's new ids is the only correct fix (research iter-022). |
| Capture reverse-deps BEFORE `replaceNodes` | `queryFileImportDependents` inner-joins live target nodes, so after persistence the edge already dangles and the query returns nothing. The ordering is a hard correctness gate. |
| Add a path-filtered `queryImportersOf`, not reuse the existing full-table scan | The existing `queryFileImportDependents` scans the whole `code_edges` table with no path filter - reusing it in the scan loop is the fan-in perf cliff. |
| Q1-C2 SUPERSEDES is additive, no schema migration | Keyed on `contentHash`, riding the existing edge table and tombstone substrate, so `SCHEMA_VERSION` stays 5 and absent-edge queries stay byte-identical. |
| Exclude Q1-C1 bi-temporal columns and Q6 generation watermark | DEFER-speculative: no consumer wants as-of/time-travel, the safety is redundant with the shipped readiness gate and neither fixes this bug (synthesis 04/01). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seam: skip site `structural-indexer.ts:2175` (`skipFreshFiles && !isFileStale(file)`) | PASS (confirmed in live code) |
| Seam: `isFileStale` content-hash-gated `code-graph-db.ts:1042` (NOT mtime) | PASS (confirmed - corrects the iter-022 mtime framing) |
| Seam: `queryFileImportDependents` read-path-only, one caller `handlers/query.ts:1017` | PASS (confirmed - grep shows a single non-test caller) |
| Seam: symbol id `indexer-types.ts:102`, content hash `indexer-types.ts:109`, prune `code-graph-db.ts:1030`, tombstones `code-graph-db.ts:230-318` | PASS (confirmed in live code) |
| `validate.sh --strict` on this folder | PASS |
| Unit tests (reverse-dep re-derive, ordering gate, SUPERSEDES lineage on/off) | PASS - `edge-staleness-correctness.vitest.ts`, 5 tests |
| Fan-in re-parse benchmark | NOT RUN - gates default-on for the staleness repair |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Default-on for the staleness repair is not yet accepted.** Both units ship default-off / tombstone-gated, the fan-in re-parse benchmark has not cleared the staleness repair for default-on and the SUPERSEDES edge only emits when the tombstone substrate is enabled.
2. **Fan-in re-parse cost is unmeasured.** The staleness repair stays gate-able / non-default until a benchmark on a hot high-importer file clears default-on (regression-baseline rule).
3. **No benefit number is benchmarked.** Per the 028 research, every leverage tag is structural inference, never a measured delta.
4. **Q1-C2 needs the path-coupling left intact.** The lower-risk SUPERSEDES edge is chosen over decoupling symbol ids from paths (Q2-C2, L/high-conflict), so renames remain path-coupled and are repaired by lineage rather than prevented.
<!-- /ANCHOR:limitations -->
