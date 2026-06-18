---
title: "Tasks: Code-Graph Engine Robustness Remediation"
description: "One task per deep-review finding in this sub-phase (8 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/tasks.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code-Graph Engine Robustness Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] 003-S1 Capture the subsystem test/validation baseline. Targeted (5 files) 56/56 pass; full mcp_server 640 pass / 16 fail (2 pre-existing env files: launcher-lease, lib/security-hardening) / 1 skip.
- [x] 003-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing. All 8 confirmed REAL against current code (registry-described state still present; no Round-2 verdicts existed for these P2s — round2 covered P1s only).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [x] 003-T001 · `lib/code-graph-db.ts` cleanupOrphans — FIXED. Added recordEdgeTombstonesForSymbols over orphan symbol_ids (file_id NOT IN code_files) BEFORE the node DELETE, mirroring removeFile. Regression: code-graph-tombstones.vitest.ts "records edge tombstones for edges orphaned by cleanupOrphans node deletion" (true-RED verified by neutralizing the call). _[P2]_
- [x] 003-T002 · `lib/code-graph-db.ts` cleanupOrphans — FIXED. Wrapped body in d.transaction(() => {...})(); returns tx(). Matches removeFile/replaceNodes/replaceEdges. Regression: code-graph-tombstones.vitest.ts "cleanupOrphans is atomic ... no duplicate tombstone rows" (second sweep is no-op, exactly 1 edge tombstone). _[P2]_
- [x] 003-T003 · `handlers/query.ts` buildWhyIncluded — FIXED. Replaced dead ternary `edgeChain.length > 0 ? 1 : 1` with literal `1` + WHY comment. Behavior-identical (cosmetic). Covered by existing code-graph-query-handler.vitest.ts:1548 (empty edgeChain → confidence 1). _[P2]_
- [x] 003-T004 · `lib/code-graph-context.ts` finalize() + budget stamping — FIXED. (a) Removed the cross-section stampContextTraceTruncation(sections,'budget') call (why_included is returned in full via graphContext; deleted the now-unused fn). (b) finalize() no longer stamps the always-complete depth-0 anchor entry with a section-level truncationReason. Regression: 2 tests (budget not propagated; anchor not falsely flagged). _[P2]_
- [x] 003-T005 · `lib/code-graph-context.ts` recordWhyIncluded — FIXED. Derive ambiguous from edge evidence (evidenceClass==='INFERRED') for neighbor entries; OR-combined across same-depth edges. Regression: "marks a neighbor reached via an INFERRED edge as ambiguous and a STRUCTURED one as not" + updated existing INFERRED-neighbor assertion. _[P2]_
- [x] 003-T006 · `lib/code-graph-context.ts` recordWhyIncluded — FIXED. Same-depth re-discovery now appends the edge to edgeChain (was: strict `<`; equal-depth appends + min-confidence) instead of discarding. Regression: "keeps every same-depth edge in edgeChain ..." (edgeChain length 2, confidence collapses to min). _[P2]_
- [x] 003-T007 · `lib/code-graph-context.ts` expandAnchor — FIXED. Replaced the dead file-anchor branch (was unreachable: buildContext handles file anchors inline before the sole call site) with a throwing invariant + WHY comment, eliminating the divergent why_included construction path. Unreachable-by-construction → guarded by typecheck + existing file-anchor coverage (no vacuous test for dead code). _[P2]_
- [x] 003-T008 · `lib/symbol-bm25-resolver.ts` addDocument — FIXED. Early-return guard `if (this.symbolNumbersById.has(document.symbolId)) return;` so a duplicate add no longer double-counts totalDocumentLength or re-appends postings. Regression: symbol-bm25-resolver.vitest.ts "is idempotent when the same symbolId is added twice" (true-RED verified). _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] 003-V1 vitest per fix against a fixture graph DB. 7 new regression tests added (2 tombstones + 4 context + 1 bm25); T003 covered by existing test, T007 unreachable-by-construction. Mutation-checked (true-RED) for T001/T004/T005/T006/T008.
- [x] 003-V2 Whole-gate delta reported (no regressions). Full mcp_server: baseline 640 pass/16 fail/1 skip → after 647 pass/16 fail/1 skip = +7 passing, SAME 16 failures in SAME 2 pre-existing env files (launcher-lease, lib/security-hardening); none of my 4 files among the failures. Typecheck clean; alignment-drift PASS (153 files, 0 violations); comment-hygiene exit 0 on all 4 files.
- [x] 003-V3 Per-finding status recorded in implementation-summary.md (all 8 FIXED). Shared parent registry (`027/review/fresh-regression-75/...`) deliberately NOT mutated — it is outside this sub-phase's SCOPE LOCK and is shared by 6 concurrent sibling phases; status is carried in the sub-phase docs instead.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 8 findings resolved (all FIXED — none refuted; each confirmed a real defect against current code). Verification gate green (typecheck + alignment-drift PASS, targeted suite green, whole-gate delta +7 with no new regressions).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
