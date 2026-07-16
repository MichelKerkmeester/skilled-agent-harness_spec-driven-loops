---
title: "Continuity Memory Runtime Phase 005: Memory search runtime bugs"
description: "Findings phase cataloguing 17 defects in /memory:search observed during live conversation and confirmed via direct MCP probes. P0 fixes for Cluster 1-3 landed in-nacket (truncation wrapper, intent classifier drift, rendering vocabulary)."
trigger_phrases:
  - "phase 005 changelog"
  - "memory search runtime bugs"
  - "truncation wrapper fix"
  - "intent classifier drift"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/005-memory-search-runtime-bugs` (Level 1)
> Parent packet: `027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

A live /memory:search session against the indexed-continuity runtime exposed contract violations across the retrieval, output rendering, and causal-graph subcommands. The empty-arguments gate fired correctly, but every downstream stage produced at least one observable defect.

The audit produced 17 defect requirements (4 P0, 7 P1, 6 P2). Three P0 clusters were remediated in-phase: the truncation wrapper sanity guard (Cluster 1), intent classifier centroid-only confidence floor at 0.30 (Cluster 2), and forbidden-phrase enforcement in the command spec (Cluster 3). Clusters 4-7 (P1/P2) remain deferred to a follow-up remediation packet.

### Added

- Sanity-guard early return in enforceTokenBudget: when actualTokens/budgetTokens is below 0.50, results are returned unmodified.
- preservedAfterStructural snapshot threaded through the structural truncation loop so fallbackToStructuredBudget preserves survivors before falling through to zero-fill.
- Centroid-only confidence floor at 0.30 in classifyIntent that fires only when winning intent has zero keyword and zero regex-pattern evidence.
- classificationKind annotation on dual-classifier output: meta.intent is task-intent (authoritative for rendering). Data.queryIntentRouting is backend-routing (authoritative for channel selection).
- Forbidden Phrase Enforcement subsection in .opencode/commands/memory/search.md with substitution table, mandatory pre-render gate, and verification grep.

### Changed

- enforceTokenBudget now re-derives returned-count metadata from the actual emitted payload, eliminating the mismatch where returnedResultCount=2 shipped alongside count:0,results:[].
- Intent classifier for "Semantic Search" now returns understand (was fix_bug at 0.098). Single-keyword classification stays at legacy 0.08 floor so existing regression suite keeps passing.
- 17 defects catalogued in spec.md with REQ-001 through REQ-017, grouped into 7 root-cause clusters in plan.md.

### Fixed

- Cluster 1: truncation dropping results to zero at 2% budget usage. After fix, under-budget calls return truncated:false with full results preserved.
- Cluster 2: intent classifier returning fix_bug for "Semantic Search" at confidence 0.098. After fix, confident fallback to understand.
- Cluster 2: dual-classifier dissonance. After fix, meta.intent and data.queryIntentRouting are annotated with classificationKind and a seeAlso cross-pointer.
- Cluster 3: output rendering using forbidden "Auto-triggered memories" phrase. After fix, spec mandates canonical vocabulary with verification grep.

### Verification

- Targeted vitest suites: 200 passing tests (token-budget-enforcement, memory-context, handler-causal-graph, intent-classifier, intent-routing, gate-d-regression-intent-routing).
- Inline runtime probes via node against freshly-built dist:
  - classifyIntent("Semantic Search") to understand.
  - classifyIntent("Find stuff related to semantic search") to understand (stability).
  - classifyIntent("fix the login bug") to fix_bug (single-keyword regression-safe).
  - enforceTokenBudget under-budget: truncated:false, full results preserved.
  - enforceTokenBudget true over-budget: returnedResultCount matches data.results.length.
- validate.sh --strict: PASS (0 errors, 0 warnings).

### Files Changed

| File | What changed |
|------|--------------|
| `spec.md` (NEW) | Bug catalog with REQ-001..017 and live probe evidence. |
| `plan.md` (NEW) | 7 root-cause clusters with change surface per cluster. |
| `tasks.md` (NEW) | Findings-packet tasks + deferred remediation tasks. |
| `implementation-summary.md` (NEW) | Phase closeout with Cluster 1-3 fix evidence. |
| `description.json` (NEW) | Memory-indexer metadata. |
| `graph-metadata.json` (NEW) | Graph traversal metadata. |
| `mcp_server/handlers/memory-context.ts` | enforceTokenBudget sanity guard and preservedAfterStructural snapshot. |
| `mcp_server/lib/search/intent-classifier.ts` | Centroid-only 0.30 confidence floor. ClassificationKind annotation. |
| `.opencode/commands/memory/search.md` | Forbidden Phrase Enforcement subsection with substitution table. |

Packet-level reference: `7a987e8827`.

### Follow-Ups

- **Clusters 4-7 (P1/P2) deferred** to a follow-up remediation packet: causal-stats output hygiene, state hygiene, folder discovery and channel health, quality fallback and edge growth.
- **CocoIndex daemon health** was not directly probed. REQ-012 verification blocked until daemon is runnable.
- **Stability corpus** deferred. A 20-paraphrase corpus exists informally via the 80% accuracy test at intent-classifier.vitest.ts:T060.
