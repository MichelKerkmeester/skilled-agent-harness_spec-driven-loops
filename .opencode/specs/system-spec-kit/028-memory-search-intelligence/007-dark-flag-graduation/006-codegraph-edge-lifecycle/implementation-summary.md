---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the code-graph edge-lifecycle cluster of three default-off flags and returned a verdict for each. The edge-staleness repair behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE passes the fan-in rebind benchmark it was gated on, rebind-correct on 3 of 3 labeled cases with the flag on and discriminating on the importer-unchanged kind-flip case where it rebinds under the flag and stays stale without it, verdict REFINE pending a degree-capped fan-in cost ceiling. SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS has the valid_at and invalid_at columns live but no read consumer and default writes still replace edges so invalid_at is 0 on all 70427 edges, verdict REFINE with the smallest consumer named as a close-and-insert reindex writer feeding an as-of edge reader. SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB has only its migration as a consumer, the live code_edges has no CHECK and every edge_type is already vocab-compliant so no current producer can violate it, verdict CUT-or-REFINE with the smallest consumer named as an untyped external edge-ingest validator. The benchmark is read-only by construction and never opens the live graph. No default is flipped."
trigger_phrases:
  - "code graph edge lifecycle verdict"
  - "edge staleness rebind benchmark result"
  - "code graph bitemporal consumer verdict"
  - "code graph governance vocab verdict"
  - "reverse dependency force parse rebind"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/006-codegraph-edge-lifecycle"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the fan-in rebind benchmark and authored the three verdicts"
    next_safe_action: "Phase complete, verdicts live in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/edge-staleness-rebind-benchmark.mjs"
      - "results/staleness-metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A self-contained fan-in rebind benchmark for the code-graph edge-staleness repair, plus a read-only feasibility and consumer analysis for the two edge-lifecycle schema flags, and a graduate, refine or cut verdict for each of the three. The benchmark is the deliverable the changelog said the staleness work was gated on, the fan-in re-parse benchmark that was never run.

The findings:

**The fan-in rebind benchmark passes.** The harness imports the shipped compiled scan handler and the code-graph DB lib, builds a fresh throwaway workspace and SQLite database per case, and indexes a labeled rename, kind-flip and move fixture. With `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` on, the cross-file edges rebind to the new symbol ids on 3 of 3 cases. The benchmark is deterministic across three repeated runs with zero run-to-run variance, which holds because the symbol id derives from a content hash of file path, qualified name and kind.

**The benchmark discriminates on the importer-unchanged case.** The kind-flip case imports `foo` as a function, then `foo` becomes a `const` while the importer file stays byte-identical. With the flag on, the importer is force-parsed (`filesIndexed=2`) and the `IMPORTS` edge rebinds from the function symbol to the variable symbol. With the flag off, the importer is skipped as fresh (`filesIndexed=1`, `filesSkipped=1`) and the edge is left stale (the result edge is null). That single case proves the repair is the thing that makes the rebind happen, not the ordinary incremental scan. The rename and move cases rebind under both flag states because the importer re-points its own import text, which makes the importer independently stale, so they are recorded as controls.

**The bitemporal columns are live but read by nothing.** The live `code_edges` carries the nullable `valid_at` and `invalid_at` columns (70427 edges, 69585 with `valid_at` set, 0 with `invalid_at` set, read-only). The read flag reader `codeGraphEdgeBitemporalReadsEnabled` exists but no caller reads it, and default writes still replace edges rather than closing them, which is why `invalid_at` is NULL everywhere. There is no measured value because there is nothing to read.

**The governance CHECK is dark and guards nothing live.** The live `code_edges` has no CHECK constraint, so the migration is genuinely default-off in production, and every `edge_type` value in the live graph is already inside the closed vocabulary. The only writers are the typed indexer edge-builders that emit a fixed enum, so no current producer can emit an out-of-vocab `edge_type`. The CHECK would reject nothing the type system does not already reject at compile time.

**Verdicts.** Edge-staleness repair: REFINE, correct on rebind but the fan-in COST half of the gate is still unmeasured, the named refinement is a degree-capped force-parse so a rename of a high-fan-in dependency does not trigger a whole-graph re-parse. Bitemporal reads: REFINE, the schema is a sound foundation but the smallest proving consumer is a close-and-insert reindex writer feeding an as-of edge reader, neither built in this pass. Governance vocab: CUT-or-REFINE, the honest read is CUT because no live producer can violate the CHECK, and the only consumer that would flip it to a win is an untyped external edge-ingest validator that does not exist.

This phase writes no production code-graph file and flips no default. It runs the gated benchmark, resolves the staleness correctness question with a measured number, and names the smallest proving consumer for the two schema flags without building a speculative one.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup confirmed the shipped `dist/handlers/scan.js` and `dist/lib/code-graph-db.js` import cleanly and `better-sqlite3` resolves from the code-graph node_modules, read the force-parse path in `structural-indexer.ts`, the `queryImportersOf` lookup and the cross-file edge resolver to confirm the rebind mechanism and the default-off gate, and inspected the live `code_edges` schema read-only. The core wrote `scripts/edge-staleness-rebind-benchmark.mjs`, which builds a fresh throwaway workspace and SQLite database per case, runs a full scan to record the baseline cross-file edge, mutates the dependency so its symbol identity shifts, re-scans incrementally with the flag set ON and then OFF, queries the cross-file edges and scores the rebind. It encodes the labeled rename, kind-flip and move fixture, with the kind-flip keeping the importer byte-identical to isolate the force-parse path, and writes the per-case and aggregate rows to `results/staleness-metrics.json`, the single source for the data tables and the staleness verdict. Verification confirmed the benchmark is deterministic across repeated runs, that the bitemporal read flag has no consumer and the live `code_edges` has no governance CHECK, and authored the three verdicts in `benchmark-results.md` grounded strictly in the metrics and the confirmed code facts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Drive the shipped handler and lib, not a reimplementation.** The harness imports the compiled production scan handler and DB lib and runs them against a throwaway graph, so the rebind it measures is the rebind the server performs, not a hand-rolled approximation of it.
- **Read-only by construction, never the live graph.** The harness only ever calls `initDb` on a fresh temp directory and never references the live `code-graph.sqlite`, so the production graph is read-only by construction rather than by convention.
- **Isolate the force-parse path with an importer-unchanged case.** A rename that also edits the importer makes the importer independently stale, so the kind-flip case keeps the importer byte-identical, which is the only case that proves the repair rather than the ordinary incremental scan.
- **Name the smallest proving consumer, do not build it.** The bitemporal and governance flags await a consumer, so the verdicts name the smallest one that would prove each worthwhile and stop there, since building a speculative consumer is out of scope and would itself need a benchmark.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node scripts/edge-staleness-rebind-benchmark.mjs` runs the fan-in rebind benchmark over the labeled three-case fixture and exits 0, rebind-correct on 3 of 3 cases with the flag on and discriminating on the kind-flip case.
- The benchmark is deterministic across three repeated runs with zero run-to-run variance, every run reports `cases=3 reboundOn=3 discriminating=1 importerUnchangedDiscriminating=1`.
- `results/staleness-metrics.json` records per case the baseline edge, the rebound edge, the files indexed under each flag state, and whether the importer-unchanged case discriminates.
- The live `code_edges` carries `valid_at` and `invalid_at` (70427 edges, 69585 with `valid_at`, 0 with `invalid_at`), has no CHECK constraint, and every `edge_type` is in the closed vocabulary, all read-only.
- The bitemporal read flag reader has no caller outside its own definition, confirmed by `rg` over `lib/`.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The fan-in COST is not measured, only correctness.** The benchmark proves the rebind is correct and that the force-parse path is the thing that makes it happen, but it does not measure the re-parse time of a hot high-importer file. The staleness verdict is REFINE precisely because the cost half of the gate remains, and the named refinement is a degree-capped force-parse before any flip.
- **Three labeled cases, small fixtures.** The rebind-correctness rate is measured on a rename, a kind-flip and a move over small synthetic fixtures. They establish that the repair rebinds cross-file edges correctly, but a production rename of a real high-fan-in module would exercise the cost path the small fixtures do not.
- **The two schema-flag verdicts are feasibility plus consumer-naming, not a measured win.** The bitemporal and governance flags have no consumer to benchmark, so their verdicts rest on a read-only schema analysis and a named smallest consumer rather than a measured number. Building those consumers and benchmarking them is a follow-up, not this phase.
- **The governance read leans CUT on present evidence.** The CUT-or-REFINE verdict reflects that no live producer can violate the CHECK today. If an external or untyped edge writer is ever added the verdict flips to REFINE, but absent that path the migration guards nothing.
<!-- /ANCHOR:limitations -->
