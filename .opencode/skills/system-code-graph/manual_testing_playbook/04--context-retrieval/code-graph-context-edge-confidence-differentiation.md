---
title: "028 -- code_graph_context CALLS edge-confidence differentiation"
description: "Verify the default-off SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION flag replaces the uniform CALLS confidence tier with a real gradient, that AMBIGUOUS is recognized as weak evidence, that the scoping never touches non-CALLS edges, and that flag-off reads normalize a database previously touched by a flag-on scan."
trigger_phrases:
  - "028 edge confidence differentiation scenario"
  - "code graph edge confidence differentiation testing"
importance_tier: "important"
contextType: "verification"
version: 1.3.0.0
---

# 028 -- `code_graph_context` CALLS edge-confidence differentiation

## 1. OVERVIEW

This scenario validates the default-off `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` flag on `code_graph_context`'s `why_included` trace output. With the flag off, every `CALLS` edge carries the legacy uniform tier (`0.8` / `INFERRED` / `heuristic`). With the flag on, same-file call resolution and cross-file import-target resolution write a resolution-specific gradient instead: a single resolvable candidate gets `0.75`/`INFERRED`, multiple candidates get `0.35`/`AMBIGUOUS` (same-file) or `0.3`/`AMBIGUOUS` (cross-file). The 011 remediation fixed two correctness bugs this scenario also covers: `AMBIGUOUS` now counts as weak evidence everywhere `INFERRED` does, and the CALLS-only scoping never lets a non-`CALLS` edge (`IMPORTS`, `EXTENDS`, etc.) get pulled into the legacy-tier normalization. A database that was ever touched by a flag-on scan must still read back as the legacy tier once the flag is off again -- the stored differentiated value is not trusted while the flag is off.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `code_graph_context`'s `why_included` trace reports the real CALLS confidence gradient only while the flag is on, treats `AMBIGUOUS` as weak evidence, leaves non-CALLS edges untouched, and normalizes back to the legacy tier when the flag is off regardless of what a prior flag-on scan persisted.
- Real user request: `Validate that turning on SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION gives code_graph_context real CALLS confidence tiers instead of the flat 0.8 default, that ambiguous resolutions are flagged as weak evidence, and that turning the flag back off restores the legacy behavior even against an already-differentiated database.`
- Operator prompt: `Validate code_graph_context CALLS edge-confidence differentiation across flag on/off and a mid-session toggle, then report cited pass/fail evidence.`
- Expected execution process: Run a full scan with the flag off, call `code_graph_context` with `includeTrace:true` against an anchor with an unambiguous and an ambiguous same-file call target, repeat with the flag on, then flip the flag back off without a rescan and confirm the trace reads the legacy tier again.
- Expected signals: flag-off trace shows `confidence:0.8`, `evidenceClass:"INFERRED"` on every CALLS edge; flag-on trace shows `0.75/INFERRED` for the unambiguous target and `0.35/AMBIGUOUS` (or `0.3/AMBIGUOUS` for a cross-file import-target case) for the ambiguous target; a non-CALLS edge (e.g. `IMPORTS`) is unaffected by either flag state; flag-off-after-flag-on-scan still reads `0.8/INFERRED` for CALLS edges.
- Desired user-visible outcome: A concise verdict stating whether the gradient, the AMBIGUOUS weak-evidence classification, the CALLS-only scoping and the flag-off normalization all held.
- Pass/fail: PASS if all four behaviors hold as described. FAIL if the flag-off trace ever shows a differentiated value, if AMBIGUOUS is not treated as weak evidence, or if a non-CALLS edge's confidence/evidenceClass changes with the flag.

---

## 3. TEST EXECUTION

### Preconditions

- Disposable workspace copy with at least one symbol that has an unambiguous same-file call target and one that has two or more same-name call candidates in the same file (an ambiguous case).
- Code graph index is `fresh` (verify via `code_graph_status`).

### Commands

1. **Flag off baseline:** with `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` unset, run `code_graph_scan({ incremental:false })`, then:
   ```jsonc
   mcp__mk_code_index__code_graph_context({
     queryMode: "neighborhood",
     subject: "<anchor symbol with an unambiguous and an ambiguous CALLS target>",
     includeTrace: true
   })
   ```
   Expected: every CALLS entry in `why_included` reports `confidence:0.8`, `detectorProvenance:"heuristic"`, `evidenceClass:"INFERRED"`.

2. **Flag on, full rescan:** set `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION=true`, rescan (`code_graph_scan({ incremental:false })`), then repeat the same `code_graph_context` call.
   Expected: the unambiguous CALLS target reports `confidence:0.75`, `evidenceClass:"INFERRED"`; the ambiguous CALLS target reports `confidence:0.35` (same-file) or `0.3` (cross-file import-target), `evidenceClass:"AMBIGUOUS"`. A same-call `IMPORTS` or other non-CALLS edge in the same trace is unaffected -- unchanged confidence/evidenceClass from step 1.

3. **Flag off again, no rescan:** unset `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` (do not rescan, so the database still holds the differentiated values written in step 2), then repeat the `code_graph_context` call.
   Expected: every CALLS entry reports the legacy tier again (`confidence:0.8`, `evidenceClass:"INFERRED"`), proving flag-off reads normalize rather than trust the persisted differentiated value.

### Expected

Flag-off trace is uniform `0.8/INFERRED` for all CALLS edges regardless of what the database currently holds; flag-on trace shows the real gradient (`0.75` unambiguous, `0.35`/`0.3` ambiguous) with `AMBIGUOUS` recognized as weak evidence; non-CALLS edges never change with the flag.

### Evidence

The three `why_included` trace payloads (flag-off baseline, flag-on, flag-off-after-flag-on-scan), with the CALLS and non-CALLS edge entries called out for each.

### Pass / Fail

- **Pass**: gradient appears only while the flag is on, AMBIGUOUS is weak evidence, non-CALLS edges are unaffected in every state, and flag-off-after-flag-on-scan reads the legacy tier.
- **Fail**: flag-off ever shows a differentiated value, AMBIGUOUS is missed as weak evidence, a non-CALLS edge's metadata changes with the flag, or flag-off-after-flag-on-scan still shows the differentiated value.

### Failure Triage

Inspect `normalizedContextEdgeMetadata` and `formatContextEdge` in `mcp_server/lib/code-graph-context.ts` (CALLS-only scoping, legacy-tier fallback when `isCodeGraphEdgeConfidenceDifferentiationEnabled()` is false). Cross-check the write side in `mcp_server/lib/structural-indexer.ts` (`buildDifferentiatedCallsEdgeMetadata`, same-file gradient) and `mcp_server/lib/cross-file-edge-resolver.ts` (`resolveCrossFileCallEdges`, cross-file gradient and the `0.75/INFERRED` same-name-only downgrade from the prior `0.9/EXTRACTED`). Confirm the enable check in `mcp_server/lib/edge-confidence-flags.ts`.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Flag gate: `mcp_server/lib/edge-confidence-flags.ts`
- Read-path normalization: `mcp_server/lib/code-graph-context.ts`
- Write-path gradient: `mcp_server/lib/structural-indexer.ts`, `mcp_server/lib/cross-file-edge-resolver.ts`
- Catalog counterpart: `../../feature_catalog/09--edge-confidence-and-provenance/edge-confidence-differentiation.md`, `../../feature_catalog/09--edge-confidence-and-provenance/edge-evidence-classification.md`
- Automated test cross-reference: `mcp_server/tests/code-graph-context-handler.vitest.ts` (AMBIGUOUS classification, mid-session toggle, flag-off normalization of a previously-differentiated database, IMPORTS-unaffected checks)
- Decision rationale: `decision-record.md` ADR-001 in `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/011-edge-confidence-review-remediation/`

---

## 5. SOURCE METADATA

- Group: Context Retrieval
- Playbook ID: 028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--context-retrieval/code-graph-context-edge-confidence-differentiation.md`
