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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/001-codegraph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
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
| **Spec Folder** | 010-graduation-follow-ups/001-codegraph-defaults-bitemporal |
| **Completed** | 2026-06-24 |
| **Level** | 2 |
| **Actual Effort** | 2.75 hours |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two production-readiness follow-ups in the system-code-graph subsystem, each behind its existing default-off flag, plus the deep-review fixes that made the bitemporal path correct on the real reindex.

Follow-up A set the staleness-repair force-parse degree cap to a production ceiling. `DEFAULT_REVERSE_DEP_DEGREE_CAP` moved from 0, which meant uncapped, to 10, an unbenchmarked midpoint chosen as a safe ceiling. The cap is read only inside the force-parse branch, gated on `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, so the new default has no effect while that flag is off. The correctness cost is recorded: above the cap a high-fan-in rename leaves all importer edges durably stale until each importer's next edit.

Follow-up B wired the bitemporal writer through the WHOLE real reindex path. The first attempt wired only `replaceEdges`, which the 011 deep review found was defeated, because `replaceNodes` runs first and hard-deleted the edges, `pruneDanglingEdges` is the production prune for a full scan and hard-deleted them too, and the live readers had no validity filter so they returned closed and open edges together. The corrected wiring, all gated on `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`:

- `replaceNodes` closes its edges instead of deleting them, since it owns the old symbol ids and runs before `replaceEdges`.
- `replaceEdges` closes the source edges and inserts the replacements with an open window.
- `pruneDanglingEdges` closes danglers instead of deleting them on the deferred full-scan prune.
- `queryEdgesFrom` and `queryEdgesTo` add `AND invalid_at IS NULL` so live reads return only the open edge.
- Loop-time writers stamp at the next generation, because the bump trails the persist loop, so a superseded edge lands in a window that is readable at the genuine pre-reindex generation. The post-bump dangling sweep stamps at the current generation. Both resolve to the same value for one scan.

When the flag is off, every one of these runs the original delete-and-insert with no validity columns touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/structural-indexer.ts` | Modified | Degree-cap default 0 to 10, comment records the hot-hub correctness cost and the unbenchmarked-midpoint rationale |
| `mcp_server/lib/code-graph-db.ts` | Modified | Close-not-delete in `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges`, live-reader validity filter, next-generation stamping helper, all flag-gated |
| `mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts` | Created | Real-scan integration round trip and off-path byte-identity tests |
| `mcp_server/tests/code-edge-bitemporal-readers.vitest.ts` | Created | Live-reader filter and close-not-delete unit tests with off-path byte identity |
| `mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts` | Created | Degree-cap byte-identity tests while force-parse is off |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both changes shipped behind their existing default-off flags, so live behavior is unchanged until an operator opts in. The 011 deep review failed the first bitemporal attempt, so before re-touching anything I confirmed each finding against the real code: `replaceNodes` deleting edges before the close, `pruneDanglingEdges` being the unconditional production prune, and the unfiltered live readers were all real. I then drove the corrected design with a probe that dumped the raw edge table across two real scans, which showed the original edges flipping from open to closed with a non-empty window and the new edges opening. I proved byte identity for each off-path with a dedicated test, the live-read filter and close-not-delete with unit tests, and the full round trip with a test that drives the real scan handler twice under the production bump ordering. The subsystem type-check stays at exit 0, all three new test files type-check standalone, and a focused run of the three new files passes 13 of 13. The full vitest pass runs on the CLI executor per the brief.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Set the degree-cap default to 10 | An unbenchmarked midpoint chosen as a safe ceiling, the fixture only contrasts 30 and 2 importers so it cannot distinguish any value between them |
| Closed edges in `replaceNodes`, not only `replaceEdges` | `replaceNodes` runs first and owns the old symbol ids, so it is where a stale edge actually gets superseded on a real reindex. Closing only in `replaceEdges` was defeated because the edges were already deleted |
| Made `pruneDanglingEdges` close under the flag | It is the production prune for a full scan, an unconditional delete there erased the edges the close had just preserved |
| Added a validity filter to the live readers | A closed edge stays in the table under the flag, so an unfiltered live read returned both the old and the new target |
| Stamped loop-time writes at the next generation | The bump trails the persist loop, so stamping at the current generation gave a zero-width window unreadable at any as-of. The next generation places the close strictly after the valid_at |
| De-scoped the public as-of query surface | The smaller correct option, `asOfEdgesFrom` is the tested as-of consumer, exposing an as-of parameter on the public tools is a larger change deferred rather than overclaimed as graduated |
| Kept off-path statements verbatim | Byte identity is the strongest proof the default-off behavior did not move |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p .../system-code-graph/tsconfig.json` | PASS, exit 0 |
| Standalone `tsc` over the three new test files | PASS, exit 0 |
| Focused vitest run of the three new files | PASS, 13 of 13 |
| Real-scan as-of round trip | PASS, `asOfEdgesFrom` at the pre-reindex generation returns the old target, the live read returns only the new target, the old edge is closed strictly after its valid_at |
| Live-reader filter | PASS, `queryEdgesFrom` and `queryEdgesTo` return only the open edge with the flag on, both edges with the flag off |
| Close-not-delete unit tests | PASS, `replaceNodes` and `pruneDanglingEdges` close under the flag and delete with the flag off |
| Bitemporal off-path byte identity | PASS, only the new edge survives with null validity columns and flag-unset matches flag-false |
| Degree-cap off-path byte identity | PASS, the cap env value never changes the outcome while force-parse is off |

Byte-identity proof, degree cap: `getReverseDepDegreeCap` is called only inside the `if (skipFreshFiles && reverseDepForceParseEnabled())` branch of parse-candidates. With the force-parse flag off that branch is never entered, so the default value is never read and the change is byte-identical.

Byte-identity proof, bitemporal: every changed site reads the bitemporal flag once and keeps its original statement on the off branch. `replaceNodes` deletes, `replaceEdges` deletes-and-inserts, `pruneDanglingEdges` deletes, and the live readers run their original query strings, all with the validity columns untouched. The off-path tests confirm a flag-off reindex leaves exactly the live edge with null `valid_at` and `invalid_at`, and that flag-unset and flag-false match.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No public as-of query surface.** `asOfEdgesFrom` is wired and tested but no public tool exposes an as-of parameter. The graduation claim is narrowed to a correct, tested writer plus live-read filter, not a consumable time-travel query API. Wiring the parameter onto `code_graph_query` or `code_graph_context` is deferred.
2. **Degree-cap 10 is not benchmark-distinguished.** The fixture only contrasts 30 and 2 importers, so any cap between them behaves the same on it. Ten is a safe unbenchmarked midpoint, a degree sweep is future work.
3. **Hot-hub staleness cost.** Above the cap a renamed high-fan-in dependency leaves all importer edges durably stale until each importer's next edit. This is the deliberate trade for bounded re-parse cost, recorded in the code comment.
4. **No covering indexes on the validity columns.** A large-scale as-of read could degrade without them. Deferred and gated off by default.
5. **Unbounded history growth under the flag.** Many generations accumulate closed edges. Out of scope here, the flag stays off by default.
6. **Full vitest suite not executed in this session.** The three new files pass a focused run and all type-check clean. The full pass runs on the CLI executor per the brief.
<!-- /ANCHOR:limitations -->
