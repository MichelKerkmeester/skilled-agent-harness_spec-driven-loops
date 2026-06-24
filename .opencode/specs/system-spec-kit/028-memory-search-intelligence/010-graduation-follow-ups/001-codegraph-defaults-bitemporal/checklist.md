---
title: "Verification Checklist: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring"
description: "Verification evidence for the degree-cap default and the bitemporal reindex wiring, each behind its existing flag."
trigger_phrases:
  - "degree cap checklist"
  - "bitemporal checklist"
  - "reindex checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/001-codegraph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified all P0 and P1 items with evidence"
    next_safe_action: "Run the full vitest suite on the CLI executor"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-010-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md sections 2 through 4 capture both gaps and the five P0 requirements
- [x] CHK-002 [P0] Reindex edge-replacement path located
  - **Evidence**: `replaceEdges` in code-graph-db.ts, called from `persistIndexedFileResult` in ensure-ready.ts
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Type-check passes
  - **Evidence**: `npx tsc --noEmit --composite false -p .opencode/skills/system-code-graph/tsconfig.json` exits 0
- [x] CHK-011 [P0] Degree-cap default set to a safe ceiling
  - **Evidence**: `DEFAULT_REVERSE_DEP_DEGREE_CAP = 10` in structural-indexer.ts, recorded as an unbenchmarked midpoint the fixture cannot distinguish, with the hot-hub correctness cost noted in the comment
- [x] CHK-012 [P1] Off-path statements kept verbatim
  - **Evidence**: The else branches in `replaceNodes`, `replaceEdges`, `pruneDanglingEdges`, and the live readers hold the original DELETE and query strings unchanged
- [x] CHK-013 [P1] No artifact ids or spec paths in code comments
  - **Evidence**: New comments carry durable WHY only, no packet or spec ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Real-scan integration test authored and passing
  - **Evidence**: `code-edge-bitemporal-reindex.vitest.ts` drives the scan handler twice under the production bump ordering, asserts `asOfEdgesFrom` at the pre-reindex generation returns the old target and the live read returns only the new target
- [x] CHK-021 [P0] Live-reader filter and close-not-delete covered
  - **Evidence**: `code-edge-bitemporal-readers.vitest.ts` asserts `queryEdgesFrom` and `queryEdgesTo` drop closed edges under the flag and that `replaceNodes` and `pruneDanglingEdges` close under the flag and delete with it off
- [x] CHK-022 [P0] Byte-identity tests authored for every change
  - **Evidence**: The reindex test proves the off-path keeps only the new edge with null validity columns and flag-unset matches flag-false, the readers test proves the off-path delete, the degree-cap test proves the cap env value never changes the outcome while force-parse is off
- [x] CHK-023 [P1] New test files type-check and the focused run passes
  - **Evidence**: Standalone `tsc` over the three `.vitest.ts` files exits 0, a focused vitest run of the three files passes 13 of 13
- [x] CHK-024 [P1] Full vitest suite deferred to the CLI executor
  - **Evidence**: Per the brief the CLI executor runs the full pass, this work confirms tsc and the focused run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] 011 deep-review P0 blockers closed
  - **Evidence**: P0-1 live-reader filter added, P0-2 `pruneDanglingEdges` closes under the flag, P0-3 `replaceNodes` closes under the flag, all confirmed against the real code before fixing and proven by the real-scan test
- [x] CHK-026 [P0] Off-by-one and zero-width lifetime fixed
  - **Evidence**: Loop-time writes stamp at the next generation, the real-scan probe showed the old edge window [G+1, G+2) readable at the pre-reindex generation
- [x] CHK-027 [P1] As-of read consumer scoped honestly
  - **Evidence**: `asOfEdgesFrom` kept as the tested consumer, the public query-surface parameter deferred and recorded as not graduated rather than overclaimed
- [x] CHK-028 [P1] Degree-cap claim softened and cost recorded
  - **Evidence**: Spec and code comment call 10 an unbenchmarked midpoint and record the hot-hub staleness cost above the cap
- [x] CHK-029 [P1] Default-off invariant preserved across all sites
  - **Evidence**: Byte-identity tests confirm no live behavior change while either flag is off
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new secrets or external surfaces
  - **Evidence**: Both changes are internal to the code-graph indexer
- [x] CHK-031 [P1] No default-on behavior change
  - **Evidence**: Both flags stay off by default, proven by the byte-identity tests
- [x] CHK-032 [P1] Scope respected
  - **Evidence**: Only `.opencode/skills/system-code-graph/**` and the 010/001 phase folder were touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, and tasks synchronized
  - **Evidence**: All three reflect the two changes, the same file list, and the same test set
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: The generation helper, each close-not-delete branch, the live-reader filter, and the degree-cap default each carry a WHY comment
- [x] CHK-042 [P2] Description and graph metadata generated
  - **Evidence**: description.json and graph-metadata.json generated by the spec-kit generators
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left outside scratch
  - **Evidence**: All work landed in the source files, the new test files, and the phase folder
- [x] CHK-051 [P1] Phase folder complete
  - **Evidence**: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json all present
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
