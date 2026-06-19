---
title: "Implementation Summary: Code-Graph Edge-Staleness Correctness"
description: "Planning-only record for the code-graph edge-staleness correctness phase: both candidates (reverse-dependency force-parse staleness repair + additive rename SUPERSEDES edge) are PENDING and unimplemented. This summary captures the planned scope, the seam evidence, and the gates that block each candidate."
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
    recent_action: "Author edge-staleness-correctness impl-summary (planning-only)"
    next_safe_action: "Implement Unit 1 path-filtered queryImportersOf + forceParse override"
    blockers:
      - "Fan-in re-parse cost UNMEASURED — benchmark gates default-on for the staleness repair"
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
| **Completed** | Not yet — planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. This is a planning-only spec folder for the single real correctness bug in the Code Graph subsystem. Both candidates are PENDING and neither shipped in the Wave-0 record (030 §14). The plan attacks the path-coupled-symbol-id failure mode from two angles: re-deriving a refactored dependency's reverse-dependents in the same scan (the bug), and preserving rename lineage with an additive edge.

### Unit 1 — Reverse-dependency staleness repair (planned, PENDING)

When you refactor an exported symbol (rename, kind-flip, or move), its dependents currently lose their cross-file edges silently. The planned change snapshots the stale set at scan start, expands it with a path-filtered reverse-dependents query, and force-parses those importers so their edges re-derive against the dependency's new symbol ids. The capture must happen before any `replaceNodes`, or the join finds nothing. This is benchmark-gated: the fan-in re-parse cost on a hot high-importer file is unmeasured.

### Unit 2 — Rename SUPERSEDES edge (planned, PENDING)

A pure rename is preserved as lineage rather than discarded as delete+create. The planned `SUPERSEDES` edge is keyed on matching `contentHash` across the rename and rides the existing edge table plus the off-by-default tombstone substrate, so it adds no schema migration and leaves existing queries byte-identical when absent.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Planned | No code changes have been made; see spec.md §3 Files to Change for the planned set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase is planned but unimplemented. Delivery, when it happens, ships the two units as separate scoped commits behind the per-candidate gates in checklist.md: the staleness repair needs the fan-in re-parse benchmark before any default-on flip; the SUPERSEDES edge is additive and reversible (delete by `edge_type`). The seam evidence below was confirmed against live code during planning.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix by re-deriving dependents (force-parse), not by guarding the prune | A prune-guard leaves true dangling edges, which is strictly worse than the bug. Re-deriving against the dependency's new ids is the only correct fix (research iter-022). |
| Capture reverse-deps BEFORE `replaceNodes` | `queryFileImportDependents` inner-joins live target nodes, so after persistence the edge already dangles and the query returns nothing. The ordering is a hard correctness gate. |
| Add a path-filtered `queryImportersOf`, not reuse the existing full-table scan | The existing `queryFileImportDependents` scans the whole `code_edges` table with no path filter — reusing it in the scan loop is the fan-in perf cliff. |
| Q1-C2 SUPERSEDES is additive, no schema migration | Keyed on `contentHash`, riding the existing edge table and tombstone substrate, so `SCHEMA_VERSION` stays 5 and absent-edge queries stay byte-identical. |
| Exclude Q1-C1 bi-temporal columns and Q6 generation watermark | DEFER-speculative: no consumer wants as-of/time-travel, the safety is redundant with the shipped readiness gate, and neither fixes this bug (synthesis 04/01). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seam: skip site `structural-indexer.ts:2175` (`skipFreshFiles && !isFileStale(file)`) | PASS (confirmed in live code) |
| Seam: `isFileStale` content-hash-gated `code-graph-db.ts:1042` (NOT mtime) | PASS (confirmed — corrects the iter-022 mtime framing) |
| Seam: `queryFileImportDependents` read-path-only, one caller `handlers/query.ts:1017` | PASS (confirmed — grep shows a single non-test caller) |
| Seam: symbol id `indexer-types.ts:102`, content hash `indexer-types.ts:109`, prune `code-graph-db.ts:1030`, tombstones `code-graph-db.ts:230-318` | PASS (confirmed in live code) |
| `validate.sh --strict` on this folder | PASS (target state; run before any completion claim) |
| Unit tests (reverse-dep re-derive, ordering gate, Q1-C2 lineage) | NOT RUN — code unimplemented |
| Fan-in re-parse benchmark | NOT RUN — gates default-on |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Both candidates are unimplemented.** This folder is planning-only; no code exists yet.
2. **Fan-in re-parse cost is unmeasured.** The staleness repair stays gate-able / non-default until a benchmark on a hot high-importer file clears default-on (regression-baseline rule).
3. **No benefit number is benchmarked.** Per the 028 research, every leverage tag is structural inference, never a measured delta.
4. **Q1-C2 needs the path-coupling left intact.** The lower-risk SUPERSEDES edge is chosen over decoupling symbol ids from paths (Q2-C2, L/high-conflict), so renames remain path-coupled and are repaired by lineage rather than prevented.
<!-- /ANCHOR:limitations -->
