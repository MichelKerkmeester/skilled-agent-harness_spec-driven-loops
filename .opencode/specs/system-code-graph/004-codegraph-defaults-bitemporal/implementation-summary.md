---
title: "Implementation Summary: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring"
description: "What was built for the degree-cap production default and the bitemporal reindex wiring, with byte-identity and integration evidence."
trigger_phrases:
  - "degree cap summary"
  - "bitemporal summary"
  - "reindex wiring summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/004-codegraph-defaults-bitemporal"
    last_updated_at: "2026-07-06T17:28:25.179Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed both follow-ups with tsc clean and tests authored"
    next_safe_action: "Run the full vitest suite on the CLI executor"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-010-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
@4-codegraph-defaults-bitemporal |
| **Completed** | 2026-06-24 |
| **Level** | 2 |
| **Actual Effort** | 2.75 hours |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Production-readiness follow-ups in the system-code-graph subsystem: the degree-cap default, the bitemporal writer wired through the whole real reindex path, the deep-review fixes that made that path correct, and four residual items from a follow-up review.

The degree cap is now set on benchmark evidence. A degree-sweep benchmark over importer counts five through twenty-five showed rebind cost is linear with no cost knee and cheap through the measured range, while correctness improves monotonically with the cap. `DEFAULT_REVERSE_DEP_DEGREE_CAP` is 15, the value that fully repairs the common-to-moderate refactor at negligible cost while still bounding the unmeasured hundred-plus-importer tail. The hot-hub correctness cost is recorded: above the cap a high-fan-in rename leaves all importer edges durably stale until each importer's next edit.

The bitemporal writer is wired through the WHOLE real reindex path, all gated on `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`:

- `replaceNodes` closes its edges instead of deleting them, since it owns the old symbol ids and runs before `replaceEdges`.
- `replaceEdges` closes the source edges and inserts the replacements with an open window.
- `pruneDanglingEdges` closes danglers instead of deleting them on the deferred full-scan prune.
- `queryEdgesFrom` and `queryEdgesTo` add `AND invalid_at IS NULL` so live reads return only the open edge.
- Loop-time writers stamp at the next generation, because the bump trails the persist loop, so a superseded edge lands in a window readable at the genuine pre-reindex generation.

The four follow-up items, all flag-gated:

- The ensure-ready auto-index path now bumps the generation after its persist loop, so two consecutive ensure-ready reindexes write at distinct generations and a superseded edge gets a non-empty window instead of a zero-width one.
- `recordSupersedesLineage` stamps a valid_at at the next generation, so a SUPERSEDES lineage edge is as-of readable instead of being dropped for a NULL valid_at. invalid_at stays open because lineage is not later superseded.
- `code_graph_query` takes an optional `asOf` generation that routes the relationship reads through the as-of readers (`asOfEdgesFrom` and a new inbound mirror `asOfEdgesTo`), with the dangling-edge exclusion skipped for as-of so a closed edge to a deleted target still surfaces. The preserved history is now consumable.
- The degree-cap default was chosen from the benchmark above.

When the flag is off, every one of these runs the original delete-and-insert or live read with no validity columns touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/structural-indexer.ts` | Modified | Degree-cap default set to 15 from the benchmark, comment records the sweep and the hot-hub cost |
| `mcp_server/lib/code-graph-db.ts` | Modified | Close-not-delete in `replaceNodes`, `replaceEdges`, `pruneDanglingEdges`, live-reader filter, next-generation stamping, lineage-edge valid_at, `asOfEdgesTo`, all flag-gated |
| `mcp_server/lib/ensure-ready.ts` | Modified | Bump the generation after the auto-index persist loop under the flag |
| `mcp_server/handlers/query.ts` | Modified | Optional `asOf` parameter routing relationship reads through the as-of readers, dangling exclusion skipped for as-of |
| `mcp_server/tool-schemas.ts` | Modified | Document the `asOf` parameter on `code_graph_query` |
| `mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts` | Created | Real-scan integration round trip and off-path byte-identity tests |
| `mcp_server/tests/code-edge-bitemporal-readers.vitest.ts` | Created | Live-reader filter and close-not-delete unit tests with off-path byte identity |
| `mcp_server/tests/code-edge-bitemporal-followups.vitest.ts` | Created | Ensure-ready bump, lineage validity, and `code_graph_query asOf` tests with off-path byte identity |
| `mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts` | Created | Degree-cap byte-identity tests while force-parse is off |
| `benchmark/degree-cap-sweep.mjs` | Created | The degree-sweep cost benchmark, results in `benchmark/degree-cap-sweep-results.json` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Everything shipped behind the existing default-off flags, so live behavior is unchanged until an operator opts in. For each follow-up finding I confirmed the symptom against the real code before touching it: the ensure-ready path genuinely never bumped the generation, `recordSupersedesLineage` genuinely wrote NULL validity, and `asOfEdgesFrom` genuinely had no production caller. The degree cap was set from a real benchmark, not a guess: a degree-sweep script drove the real scan handler at each importer count and cap, and the recorded data shows linear cheap cost with no knee, so 15 maximizes correctness in the measured range while bounding the extreme tail. The probe that validated the bitemporal wiring dumped the raw edge table across two real scans and showed the old edges flipping to closed with a non-empty window. Verification: `tsc` exits 0, all four new test files type-check standalone, the four bitemporal and degree-cap files pass 19 of 19, and the nine code-graph test files that exercise the changed code pass 90 of 90. A full-suite run leaves only five files failing, all proven environmental: four `code-index-cli-*` daemon tests that fail under the live session daemon holding the owner lease (they load the unchanged compiled dist and pass on a clean checkout), and one `ipc-socket-drift` byte-identity guard that fails on the clean checkout too. None of the five import the changed code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Set the degree-cap default to 15 from the benchmark | The sweep shows cost is linear and cheap with no knee through importer count twenty-five while correctness improves with the cap, so 15 fully repairs the common-to-moderate refactor at negligible cost while still bounding the unmeasured hundred-plus-importer tail. The fixture's trivial files understate production per-importer cost, which argued against going higher |
| Bumped the generation on the ensure-ready path under the flag | The auto-index read path never bumped, so two ensure-ready reindexes wrote at the same generation and collapsed a superseded edge to a zero-width window. Bumping gates on the flag so the counter is untouched when off |
| Stamped lineage edges with a valid_at under the flag | `asOfEdgesFrom` requires valid_at IS NOT NULL, so NULL-stamped lineage edges were silently excluded from every as-of read |
| Wired `asOf` onto `code_graph_query`, not `code_graph_context` | The relationship operations are the smallest correct surface, a handful of edge reads. The context multi-hop traversal has many read sites and is a far larger change for the same value |
| Skipped the dangling exclusion for as-of reads | A historical edge can legitimately point at a node the current graph has dropped, so dropping it as dangling would defeat the time-travel read. The mapper already renders a null endpoint by its symbol id |
| Added `asOfEdgesTo` | The inbound relationship operations needed a symmetric as-of reader, `asOfEdgesFrom` only covers outbound |
| Kept off-path statements verbatim and gated every site on a single flag read | Byte identity is the strongest proof the default-off behavior did not move |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p .../system-code-graph/tsconfig.json` | PASS, exit 0 |
| Standalone `tsc` over the four new test files | PASS, exit 0 |
| Bitemporal and degree-cap files (4 files) | PASS, 19 of 19 |
| Code-graph files that exercise the changed code (9 files) | PASS, 90 of 90 |
| Full suite excluding the daemon-contention CLI tests and the drift guard | PASS, 712 of 712 (1 skipped) |
| Ensure-ready bump | PASS, two ensure-ready reindexes give a non-empty as-of window with the flag on, the generation is untouched with the flag off |
| Lineage validity | PASS, a SUPERSEDES edge carries a valid_at and is as-of readable with the flag on, NULL validity with the flag off |
| `code_graph_query asOf` | PASS, the as-of query returns the old target while the default query returns the new, an asOf with the flag off matches the default query |
| Degree-sweep benchmark | RAN, results recorded in `benchmark/degree-cap-sweep-results.json`, cap set to 15 on the evidence |

Byte-identity proof, degree cap: `getReverseDepDegreeCap` is called only inside the `if (skipFreshFiles && reverseDepForceParseEnabled())` branch of parse-candidates. With the force-parse flag off that branch is never entered, so the default value is never read and the change is byte-identical.

Byte-identity proof, bitemporal: every changed site reads the bitemporal flag once and keeps its original statement on the off branch. `replaceNodes` deletes, `replaceEdges` deletes-and-inserts, `pruneDanglingEdges` deletes, the lineage writer inserts with NULL validity, the live readers run their original query strings, the ensure-ready path does not bump, and a query without `asOf` runs the live reader plus the full dangling exclusion. The off-path tests confirm each of these, including flag-unset versus flag-false.

Excluded-test analysis: a full-suite run leaves five files failing, none of which import the changed code. Four are `code-index-cli-*` daemon-process tests that spawn the launcher against the unchanged compiled dist and fail with exit 69 while the live session code-graph daemon holds the owner lease, confirmed because they pass on a clean checkout where the lease is free. The fifth is `lib/ipc-socket-drift`, a byte-identity drift guard between a local copy and a shared canonical source that fails on the clean checkout too. Both are pre-existing or environmental, not regressions from this work.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **As-of exposed only on `code_graph_query` relationship operations.** The `code_graph_context` multi-hop traversal stays live-only, since wiring as-of through its many read sites is a far larger change for the same value. Deferred by choice.
2. **Degree-cap benchmark uses trivial importer files.** The cost curve shape (linear, no knee) is trustworthy, but the absolute milliseconds understate production per-importer cost, which is why 15 is preferred over a higher cap. A benchmark over realistic importer files would tighten the absolute numbers.
3. **Hot-hub staleness cost.** Above the cap a renamed high-fan-in dependency leaves all importer edges durably stale until each importer's next edit. This is the deliberate trade for bounded re-parse cost, recorded in the code comment.
4. **No covering indexes on the validity columns.** A large-scale as-of read could degrade without them. Deferred and gated off by default.
5. **Unbounded history growth under the flag.** Many generations accumulate closed edges. Out of scope here, the flag stays off by default.
6. **Five full-suite test files fail environmentally.** Four `code-index-cli-*` daemon tests fail under the live session daemon lease, one `ipc-socket-drift` guard fails on the clean checkout. None import the changed code, confirmed by running them on a clean checkout.
<!-- /ANCHOR:limitations -->
