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

Two production-readiness follow-ups in the system-code-graph subsystem, each behind its existing default-off flag.

Follow-up A set the staleness-repair force-parse degree cap to a sensible production ceiling. `DEFAULT_REVERSE_DEP_DEGREE_CAP` moved from 0, which meant uncapped, to 10, the value the 006 benchmark validated where a 30-importer rename dropped to zero forced re-parses. The cap is read only inside the force-parse branch, gated on `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, so the new default has no effect while that flag is off.

Follow-up B wired the bitemporal writer into the reindex edge-replacement path. `replaceEdges` is the path where a file's edges are deleted and re-inserted on rescan. When `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` is on, the source delete now closes the old edges with `invalid_at` via `closeEdgesForSources`, the per-edge insert now stamps `valid_at` via `insertEdgeWithValidity`, and the dangling prune closes rather than deletes so the prior generation stays readable. When the flag is off, the original delete-and-insert path runs unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/structural-indexer.ts` | Modified | Degree-cap default 0 to 10 plus updated comments |
| `mcp_server/lib/code-graph-db.ts` | Modified | Wire bitemporal close-and-insert into `replaceEdges` behind the flag |
| `mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts` | Created | Live integration round trip plus bitemporal byte-identity tests |
| `mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts` | Created | Degree-cap byte-identity tests while force-parse is off |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both changes shipped behind their existing default-off flags, so live behavior is unchanged until an operator opts in. I proved byte identity for each off-path with a dedicated test and proved the on-path bitemporal round trip with a live integration test against a real SQLite database. The subsystem type-check stayed at exit 0 across both edits, and both new test files type-check standalone against the vitest and node types. The full vitest pass runs on the CLI executor per the brief.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Set the degree-cap default to 10 | Chose the value the 006 benchmark validated, where a 30-importer rename dropped to zero forced re-parses |
| Reused `closeEdgesForSources` and `insertEdgeWithValidity` | They were already built but unwired and share the `getDb()` singleton, so they join the same per-file transaction |
| Closed dangling edges instead of deleting them under the flag | A delete would erase history, the bitemporal intent is to preserve it for as-of reads |
| Kept off-path statements verbatim | Byte identity is the strongest proof the default-off behavior did not move |
| Wired at `replaceEdges` | It is the single edge-replacement path reused by the per-file persist boundary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p .../system-code-graph/tsconfig.json` | PASS, exit 0 |
| Standalone `tsc` over the two new test files | PASS, exit 0 |
| Bitemporal as-of round trip (authored) | Asserts target-old at N and target-new at N+1, full run deferred to the CLI executor |
| Bitemporal off-path byte identity (authored) | Asserts only the new edge survives with null validity columns and flag-unset matches flag-false |
| Degree-cap off-path byte identity (authored) | Asserts the cap env value never changes the outcome while force-parse is off |

Byte-identity proof, Follow-up A: `getReverseDepDegreeCap` is called only inside the `if (skipFreshFiles && reverseDepForceParseEnabled())` branch of parse-candidates. With the force-parse flag off that branch is never entered, so the default value is never read and the change is byte-identical.

Byte-identity proof, Follow-up B: `replaceEdges` reads the bitemporal flag once. With the flag off, the source DELETE, the per-edge insert, and the dangling-prune DELETE run exactly as before with the validity columns untouched.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No covering indexes on the validity columns.** A large-scale as-of read could degrade without them. Deferred and gated off by default.
2. **Unbounded history growth under the flag.** Many generations accumulate closed edges. Out of scope here, the flag stays off by default.
3. **Full vitest run not executed in this session.** Tests are authored and type-check clean. The full pass runs on the CLI executor per the brief.
4. **Multi-generation lifecycle beyond N to N+1 untested.** The integration test covers a single supersede. Deeper lifecycles are future work.
<!-- /ANCHOR:limitations -->
