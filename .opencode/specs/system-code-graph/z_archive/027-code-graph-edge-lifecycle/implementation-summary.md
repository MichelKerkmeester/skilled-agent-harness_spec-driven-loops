---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked, refined and verdicted the code-graph edge-lifecycle cluster of three default-off flags. First pass: the edge-staleness repair behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE passes the fan-in rebind benchmark, rebind-correct on 3 of 3 labeled cases and discriminating on the importer-unchanged kind-flip case. Refinement pass: added a degree cap SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP that drops a hot 30-importer dependency from 30 forced re-parses to 0 and cuts the incremental scan from 37.07 ms to 21.10 ms while a low-fan-in dependency still rebinds, verdict GRADUATE post-refinement. Built the bitemporal smallest proving consumer behind SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS, a closeEdgesForSources writer that stamps invalid_at on a superseded edge plus an insertEdgeWithValidity writer and an asOfEdgesFrom reader, and the proving query passes, an as-of read at a past generation returns the old target while the current read returns the new one, byte-identical when off, verdict GRADUATE post-refinement. SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB stays CUT, the live data is already vocab-compliant so no producer can violate the CHECK. Typecheck clean, focused regression green, no default flipped."
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
    packet_pointer: "system-code-graph/027-code-graph-edge-lifecycle"
    last_updated_at: "2026-07-06T17:15:57.469Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Refined both flags, re-benchmarked, lifted to GRADUATE"
    next_safe_action: "Phase complete, refined verdicts live in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/edge-staleness-rebind-benchmark.mjs"
      - "scripts/edge-staleness-cost-benchmark.mjs"
      - "scripts/bitemporal-asof-benchmark.mjs"
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

Two passes. The first pass built a self-contained fan-in rebind benchmark for the code-graph edge-staleness repair, plus a read-only feasibility and consumer analysis for the two edge-lifecycle schema flags, and returned a verdict for each of the three. The second pass, on a coordinator go-ahead, implemented the two REFINE refinements behind their existing default-off flags and re-benchmarked them, lifting both to GRADUATE. The benchmarks are the deliverables the changelog said the staleness work was gated on, the fan-in re-parse benchmark that was never run, now run for both its correctness and its cost half.

The findings:

**The fan-in rebind benchmark passes.** The harness imports the shipped compiled scan handler and the code-graph DB lib, builds a fresh throwaway workspace and SQLite database per case, and indexes a labeled rename, kind-flip and move fixture. With `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` on, the cross-file edges rebind to the new symbol ids on 3 of 3 cases. The benchmark is deterministic across three repeated runs with zero run-to-run variance, which holds because the symbol id derives from a content hash of file path, qualified name and kind.

**The benchmark discriminates on the importer-unchanged case.** The kind-flip case imports `foo` as a function, then `foo` becomes a `const` while the importer file stays byte-identical. With the flag on, the importer is force-parsed (`filesIndexed=2`) and the `IMPORTS` edge rebinds from the function symbol to the variable symbol. With the flag off, the importer is skipped as fresh (`filesIndexed=1`, `filesSkipped=1`) and the edge is left stale (the result edge is null). That single case proves the repair is the thing that makes the rebind happen, not the ordinary incremental scan. The rename and move cases rebind under both flag states because the importer re-points its own import text, which makes the importer independently stale, so they are recorded as controls.

**The bitemporal columns are live but read by nothing.** The live `code_edges` carries the nullable `valid_at` and `invalid_at` columns (70427 edges, 69585 with `valid_at` set, 0 with `invalid_at` set, read-only). The read flag reader `codeGraphEdgeBitemporalReadsEnabled` exists but no caller reads it, and default writes still replace edges rather than closing them, which is why `invalid_at` is NULL everywhere. There is no measured value because there is nothing to read.

**The governance CHECK is dark and guards nothing live.** The live `code_edges` has no CHECK constraint, so the migration is genuinely default-off in production, and every `edge_type` value in the live graph is already inside the closed vocabulary. The only writers are the typed indexer edge-builders that emit a fixed enum, so no current producer can emit an out-of-vocab `edge_type`. The CHECK would reject nothing the type system does not already reject at compile time.

**The refinement pass lifted both REFINE verdicts to GRADUATE.** The two REFINE refinements were then implemented behind their existing default-off flags and re-benchmarked. The staleness COST half is now measured: a new degree cap `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` (default 0, uncapped) reads the importer fan-in degree from the existing `queryFileDegrees` and drops a refactored dependency from the force-parse expansion above the cap. The cost benchmark shows a hot 30-importer dependency goes from 30 forced re-parses to 0 under a degree-10 cap, with the incremental scan dropping from 37.07 ms to 21.10 ms, while a low-fan-in dependency under the same cap still rebinds. The bitemporal smallest proving consumer was built: `closeEdgesForSources` stamps `invalid_at` on a superseded edge with the current generation instead of deleting it, `insertEdgeWithValidity` stamps `valid_at` on a fresh edge, and `asOfEdgesFrom` filters the validity window. The bitemporal benchmark proves the as-of read answers correctly about a rebound edge, an as-of read at the past generation returns the old target and the current read returns the new one, with the close-and-insert recording exactly one closed edge. Both refinements are byte-identical when their flag is off, proven directly in the benchmarks.

**Verdicts.** Edge-staleness repair: GRADUATE post-refinement, both correctness (3 of 3 rebinds) and cost (degree cap bounds the hot fan-in to 0 forced re-parses) are measured, with the cap defaulting to uncapped so the force-parse path stays byte-identical until the flip. Bitemporal reads: GRADUATE post-refinement, the close-and-insert writer and the as-of reader make the columns load-bearing and the proving query passes, byte-identical when off, with the remaining step being to wire the writer into the reindex edge-replace path. Governance vocab: CUT, the honest read is CUT because no live producer can violate the CHECK, and the only consumer that would flip it to a win is an untyped external edge-ingest validator that does not exist, so it stays cut and untouched.

This phase ships its refinements behind the existing default-off flags and flips no default. The first pass ran the gated benchmark and resolved the staleness correctness question, and the refinement pass built the degree cap and the bitemporal consumer, re-benchmarked both, and lifted the two REFINE verdicts to GRADUATE.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

First pass. Setup confirmed the shipped `dist/handlers/scan.js` and `dist/lib/code-graph-db.js` import cleanly and `better-sqlite3` resolves from the code-graph node_modules, read the force-parse path in `structural-indexer.ts`, the `queryImportersOf` lookup and the cross-file edge resolver to confirm the rebind mechanism and the default-off gate, and inspected the live `code_edges` schema read-only. The core wrote `scripts/edge-staleness-rebind-benchmark.mjs`, which builds a fresh throwaway workspace and SQLite database per case, runs a full scan to record the baseline cross-file edge, mutates the dependency so its symbol identity shifts, re-scans incrementally with the flag set ON and then OFF, and scores the rebind over a labeled rename, kind-flip and move fixture, writing `results/staleness-metrics.json`.

Refinement pass. The staleness refinement added a degree cap in `lib/structural-indexer.ts`: a `getReverseDepDegreeCap` reader for `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` (default 0), and a filter that drops a refactored dependency from the force-parse expansion when its `queryFileDegrees` importer degree exceeds the cap. The bitemporal refinement added three functions to `lib/code-graph-db.ts` behind the existing bitemporal-reads flag: `closeEdgesForSources` (stamp `invalid_at` with the current generation), `insertEdgeWithValidity` (stamp `valid_at` on a fresh edge), and `asOfEdgesFrom` (filter `valid_at <= asOf AND (invalid_at IS NULL OR invalid_at > asOf)`). The cost benchmark `scripts/edge-staleness-cost-benchmark.mjs` and the consumer benchmark `scripts/bitemporal-asof-benchmark.mjs` exercise these against throwaway graphs and write `results/cost-metrics.json` and `results/bitemporal-metrics.json`. Verification confirmed typecheck clean, the focused code-graph regression suite green (21 targeted plus 105 in the broader sweep), the refinements byte-identical when their flag is off, and authored the refined verdicts in `benchmark-results.md` grounded strictly in the metrics.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Drive the shipped handler and lib, not a reimplementation.** The harness imports the compiled production scan handler and DB lib and runs them against a throwaway graph, so the rebind it measures is the rebind the server performs, not a hand-rolled approximation of it.
- **Read-only by construction, never the live graph.** The harness only ever calls `initDb` on a fresh temp directory and never references the live `code-graph.sqlite`, so the production graph is read-only by construction rather than by convention.
- **Isolate the force-parse path with an importer-unchanged case.** A rename that also edits the importer makes the importer independently stale, so the kind-flip case keeps the importer byte-identical, which is the only case that proves the repair rather than the ordinary incremental scan.
- **Name the smallest proving consumer first, then build the approved ones.** The first pass named the smallest consumer for each schema flag and stopped, since building a speculative consumer is out of scope. On the coordinator go-ahead the bitemporal consumer was built and the governance one was not, matching the GRADUATE versus CUT split, so no speculative code landed.
- **Keep every refinement behind its existing flag and default it to inert.** The degree cap defaults to 0 (uncapped) and the bitemporal consumer no-ops when its flag is off, so both refinements are byte-identical to the prior default and no production behavior changes until a separate flip.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node scripts/edge-staleness-rebind-benchmark.mjs` runs the fan-in rebind benchmark and exits 0, rebind-correct on 3 of 3 cases and discriminating on the kind-flip case, deterministic across runs (`cases=3 reboundOn=3 discriminating=1 importerUnchangedDiscriminating=1`).
- `node scripts/edge-staleness-cost-benchmark.mjs` exits 0, the degree cap drops a hot 30-importer dependency from 30 forced re-parses to 0 and the incremental scan from 37.07 ms to 21.10 ms, while a low-fan-in dependency still rebinds, deterministic on the forced counts (30 and 0).
- `node scripts/bitemporal-asof-benchmark.mjs` exits 0, the as-of read at the past generation returns the old target and the current read returns the new one, the close-and-insert records 1 closed edge, and flag-off is a no-op with NULL validity columns matching the live read.
- Typecheck is clean (`npm run typecheck`), and the focused code-graph regression suite is green, 21 targeted tests across staleness, bitemporal, governance and cross-file plus 105 in the broader indexer and scan sweep, no regression from the two production edits.
- Both refinements are byte-identical when their flag is off, proven directly in the benchmarks and by the unchanged correctness benchmark with the cap at its default.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The cost numbers come from synthetic fan-out fixtures, not the live graph.** The degree cap is measured on a 30-importer hot dependency and a 2-importer low one built in temp workspaces. They prove the cap bounds the blast radius and a low-fan-in dependency still rebinds, but the absolute scan times would shift with the live graph's real file sizes and importer distribution. The cap CEILING that a flip should use is a tuning decision the benchmark informs but does not fix.
- **The bitemporal consumer is built and benchmarked but not yet wired into reindex.** `closeEdgesForSources` and `insertEdgeWithValidity` exist and pass the proving query, but the production edge-replace path in `replaceEdges` and `replaceNodes` still hard-deletes superseded edges. Wiring the close-and-insert into that path behind the flag is the remaining step before the flag flips, a small change the GRADUATE verdict recommends but does not enact.
- **Governance stays CUT.** No live producer can violate the CHECK today, so the migration guards nothing and the verdict is CUT. If an external or untyped edge writer is ever added the verdict would warrant a revisit, but absent that path it stays cut and untouched.
- **No default is flipped.** Both refinements ship behind their existing default-off flags with inert defaults (the degree cap at 0, the bitemporal consumer no-op when off). The GRADUATE verdicts are recommendations with evidence, and each flip remains a separate evidence-gated decision outside this phase.
<!-- /ANCHOR:limitations -->
