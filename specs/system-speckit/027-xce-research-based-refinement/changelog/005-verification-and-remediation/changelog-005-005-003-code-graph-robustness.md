---
title: "Code-Graph Engine Robustness Remediation"
description: "All 8 P2 robustness and traceability findings in the mk-code-index code-graph engine fixed across four sources: orphan-cleanup atomicity and edge tombstoning, why-included and context-breadcrumb correctness, and symbol-bm25 add idempotency."
trigger_phrases:
  - "005/005/003 code-graph robustness changelog"
  - "cleanup orphans transaction tombstone fix"
  - "symbol bm25 add idempotency"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/003-code-graph-robustness` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This sub-phase fixed all 8 P2 robustness and traceability findings in the code-graph MCP engine. Each was confirmed against current code (none refuted) and fixed minimally with regression tests. Source changes span four files. The two correctness-neutral items (a dead ternary and an unreachable branch) are maintainability hardening, covered by existing tests and typecheck.

### Added

- Seven regression tests: two in `code-graph-tombstones.vitest.ts` (orphan edge tombstone plus atomicity), four in `code-graph-context-handler.vitest.ts` (ambiguous-from-INFERRED, same-depth edgeChain append, anchor-not-falsely-truncated, budget-not-propagated) and one in `symbol-bm25-resolver.vitest.ts` (addDocument idempotency).

### Changed

- `recordWhyIncluded` now derives ambiguity from edge evidence for neighbor entries and appends a second same-depth edge with min-confidence instead of discarding it.
- `finalize()` no longer stamps the always-complete depth-0 anchor breadcrumb with a section-level truncation reason, and the cross-section budget-truncation stamp was removed because why_included is structured data returned in full.
- `expandAnchor`'s unreachable file-anchor branch was replaced with a throwing invariant, removing the divergent why_included construction path.

### Fixed

- Orphan cleanup is now atomic: `cleanupOrphans()` runs inside a transaction and tombstones edges over the orphan symbol ids before the node DELETE, so edges orphaned by the delete are no longer missed.
- `buildWhyIncluded` replaced the inert ternary (both arms identical) with the literal neutral min-reduce seed.
- `symbol-bm25-resolver.addDocument` guards an already-present symbolId so a duplicate add no longer double-counts totalDocumentLength or re-appends postings.

### Verification

| Check | Result |
|-------|--------|
| Typecheck (system-code-graph) | PASS (npm run typecheck exit 0) |
| Targeted vitest (8 files on the 4 changed sources) | 82 / 82 pass |
| Whole-gate delta | 640 to 647 passing (+7); same 16 pre-existing environment failures in the same two files |
| Claim-falsifier (mutation, true-RED) | Confirmed for T001, T004 (both sub-fixes), T005, T006, T008 |
| Comment hygiene / alignment drift | PASS (0 violations on 4 sources; 153 files, 0 drift) |
| Spec validation | `validate.sh --strict` clean |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/code-graph-db.ts` | Modified | Atomic cleanupOrphans transaction plus edge tombstoning over orphan symbols |
| `handlers/query.ts` | Modified | Neutral min-reduce seed in buildWhyIncluded |
| `lib/code-graph-context.ts` | Modified | Breadcrumb, why_included ambiguity, edgeChain and dead-branch invariant |
| `lib/symbol-bm25-resolver.ts` | Modified | addDocument idempotency guard |

### Follow-Ups

- The shared parent review registry still shows these 8 findings without a remediation-status field. It was deliberately not mutated (shared by six concurrent sibling phases); per-finding status lives in this sub-phase and folds in at the parent.
