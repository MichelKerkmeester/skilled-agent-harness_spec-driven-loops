---
title: "Implementation Summary: Code-Graph Engine Robustness Remediation"
description: "Planning-only status for this remediation sub-phase: 8 findings carried as tasks; no fixes applied yet."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/034-code-graph-scatter-from-027/002-code-graph-robustness"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "code-graph-robustness-impl"
    recent_action: "Fixed all 8 P2 code-graph findings; added 7 regression tests"
    next_safe_action: "Operator review; sibling-phase reconciliation at parent"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-code-graph-robustness-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Code-Graph Engine Robustness Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete — all 8 findings FIXED, verification green |
| **Date** | 2026-06-16 |
| **Findings carried** | 8 (8 fixed, 0 refuted) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 8 P2 robustness/traceability findings in the code-graph MCP engine were each confirmed against current code (none refuted) and fixed minimally, with regression tests. Source changes span 4 files:

- **`lib/code-graph-db.ts` — `cleanupOrphans()`** (T001 + T002): wrapped the body in `d.transaction()` (atomic record+delete, matching `removeFile`/`replaceNodes`/`replaceEdges`), and added `recordEdgeTombstonesForSymbols` over the orphan symbol_ids (`file_id NOT IN code_files`) BEFORE the node DELETE so edges orphaned by the node delete get tombstoned (previously `recordDanglingEdgeTombstones` alone missed them — those edges are not yet dangling while the orphan node is still present).
- **`handlers/query.ts` — `buildWhyIncluded`** (T003): replaced the inert ternary `edgeChain.length > 0 ? 1 : 1` (both arms identical) with the literal `1` neutral min-reduce seed.
- **`lib/code-graph-context.ts`** (T004/T005/T006/T007):
  - Removed the cross-section `stampContextTraceTruncation(sections, 'budget')` call (and the now-unused function) — `why_included` is structured data returned in full via `graphContext`, never truncated by the token budget.
  - `finalize()` no longer stamps the always-complete depth-0 anchor breadcrumb with a section-level `truncationReason`.
  - `recordWhyIncluded` now derives `ambiguous` from edge evidence (`evidenceClass==='INFERRED'`) for neighbor entries, OR-combined across same-depth edges.
  - `recordWhyIncluded` now appends a second same-depth edge to `edgeChain` (with min-confidence) instead of discarding it.
  - `expandAnchor`'s unreachable file-anchor branch (dead: `buildContext` handles file anchors inline before the sole call site) replaced with a throwing invariant, removing the divergent `why_included` construction path.
- **`lib/symbol-bm25-resolver.ts` — `addDocument`** (T008): early-return guard on an already-present `symbolId` so a duplicate add no longer double-counts `totalDocumentLength` or re-appends postings.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per `plan.md`: confirm → fix → verify. Each finding's cited file:line was re-opened and confirmed a real defect against current code before any edit (no Round-2 verdicts existed for these P2s — round2 covered the P1 code-defect set only). Fixes mirror existing correct sibling patterns (`cleanupOrphans` follows `removeFile`'s CG-003 transaction + tombstone ordering). Fail-closed-by-construction was preferred where it fit (T007 throwing invariant over a disciplinary comment).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- All 8 findings confirmed REAL against current code; none required refuting.
- Fixes mirror existing correct sibling patterns where available (cleanupOrphans ← removeFile).
- T003 (dead ternary) is behavior-preserving, so no new test was written — the existing `code-graph-query-handler.vitest.ts` already asserts `confidence: 1` for the empty edgeChain case. T007 (dead branch) is unreachable-by-construction; it is guarded by typecheck + existing file-anchor coverage rather than a vacuous test for dead code.
- The shared parent registry (`027/review/fresh-regression-75/...`) was NOT mutated: it is outside this sub-phase's SCOPE LOCK and shared by 6 concurrent sibling phases. Per-finding status lives here instead (003-V3).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run from `.opencode/skills/system-code-graph/`.

- **Typecheck**: `npm run typecheck` → clean (exit 0).
- **Targeted vitest** (8 files touching the 4 changed sources): 82/82 pass.
- **Whole-gate delta** (`npx vitest run mcp_server/`): baseline **640 pass / 16 fail / 1 skip (657)** → after **647 pass / 16 fail / 1 skip (664)** = **+7 passing**, with the SAME 16 failures in the SAME 2 pre-existing environment-failing files (`launcher-lease.vitest.ts` daemon-lease timeout; `lib/security-hardening.vitest.ts` `.opencode/.opencode/` mkdtemp ENOENT). None of the 4 changed files appear among the failures.
- **Regression tests added (7)**: 2 in `code-graph-tombstones.vitest.ts` (cleanupOrphans edge-tombstone + atomicity), 4 in `code-graph-context-handler.vitest.ts` (ambiguous-from-INFERRED, same-depth edgeChain append, anchor-not-falsely-truncated, budget-not-propagated), 1 in `symbol-bm25-resolver.vitest.ts` (addDocument idempotency).
- **Claim-falsifier (mutation, true-RED)**: confirmed for T001, T004 (both sub-fixes), T005, T006, T008 — each test fails when its fix is neutralized, then restored.
- **Comment hygiene**: exit 0 on all 4 changed source files. **Alignment drift**: PASS (153 files, 0 violations).
- **Spec validation**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/003-code-graph-robustness --strict`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- T003 and T007 are correctness-neutral (dead ternary / unreachable branch); their fixes are maintainability hardening, not behavior changes — covered by existing tests + typecheck, not new dedicated tests.
- 16 pre-existing full-suite failures (2 files) are environment-specific (daemon lease + IPC-socket mkdtemp) and outside this sub-phase's scope; they are unchanged by this work.
- The shared parent review registry still shows these 8 findings without a remediation-status field (deliberately not mutated — see Key Decisions); cross-phase reconciliation at the parent should fold in this sub-phase's status.
<!-- /ANCHOR:limitations -->
