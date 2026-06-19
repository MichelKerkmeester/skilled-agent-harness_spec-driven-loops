---
title: "Changelog: Spec-Kit Memory MCP Phase Parent [001-speckit-memory/root]"
description: "Chronological changelog for the Spec-Kit Memory MCP Phase Parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory` (Level 2)

### Summary

> Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-corpus-reindex-gate-zero` | Draft | Shipped: - C9-4 assertEmbeddingCoverage guard (DONE): added inspectEmbeddingCoverage + assertEmbeddingCoverage in lib/eval/ablation-framework.ts, wired beside assertGroundTruthAlignment at the runner. Default threshold is 100 percent of unique golden parent IDs, requiring both memory_index.embedding_status = 'success' and a vec_memories row. The failure message references the reindex/reconcile remediation and scripts/evals/map-ground-truth-ids.ts --write. 59 ablation tests pass; typecheck and validate.sh --strict green. |
| `002-determinism-content-id-foundation` | In Progress | This sub-phase is the determinism keystone of the Spec-Kit Memory MCP retrieval-intelligence work. Five candidates — the two content-id primitives, the content-derived comparator/output tiebreak (C5-B), the ANN below-RRF tiebreak, the byte-identical bonusOverChannels param (C-X1 'active'), and the rank-time decay clock (C6-A) — were implemented and committed in the flat Wave-0 packet (030). They establish the shared total-comparator, the centralized SHA-256 content-id formula, and the byte-identical-by-default fusion seams that the three sibling subsystems (Code Graph 002, Skill Advisor 003, Deep Loop 004) byte-compare against. Four further candidates remain gated PENDING and were deliberately not built. |
| `003-retrieval-class-routing` | Partial implementation: C2-A/C2-C/C2-B done; recall-shape and C-G2 pending | C2-A, C2-C, and the C2-B mechanism are built in the Memory MCP search path. The implemented slice adds a deterministic retrieval-class axis, consumes it in query routing, and wires default-off retrieval profiles into the pre-fusion ranking seam without changing flags-off behavior. |
| `004-graceful-degradation` | Complete | An embedder outage no longer takes Memory recall down with it. When the embedder returns a null or empty embedding, the search pipeline now degrades to lexical (BM25/FTS) candidate generation and reports embedder_available:false / vector_search_skipped:true, instead of throwing inside Stage-1 and being swallowed to empty candidates. You still get results — just the lexical tier — and the response tells you the dense channel was skipped. |
| `005-recall-render-escaper` | Implemented except gated M-system-kind-exclusion | This phase now has real code for every ungated candidate in the write→recall→prompt trust spine plus the adjacent CAS polish and retention disclosure. Build state per candidate: |
| `006-redteam-probe-gate` | Partial Implementation | Implemented the MCP-server portion of this sub-phase: one named red-team probe gate under mcp_server/tests/security/, deterministic fixtures, a run-tests.mjs security selector, npm selector forwarding, and no-querytext denial-audit sanitization in governance persistence. |
| `007-bitemporal-window` | Draft | This phase carries the Memory MCP's causal + lineage edges toward a correct bi-temporal window. One candidate is already live; the other four are planned against confirmed seams and await implementation. The headline that matters: superseded facts will close at the time they actually became stale, not the time we happened to notice, so "what did we believe as of date X" stops lying. |
| `008-edge-presence-currentness` | Draft | This is a re-plan: no production code has been shipped in this phase. The deliverable is the Level-3 planning set (spec, plan, tasks, checklist, decision-record) that converts the 028 research roadmap into a sequenced, gate-aware implementation plan for the five edge-presence-currentness candidates. |
| `009-derived-id-provenance` | Draft | Nothing is built yet. This is the planning re-plan for candidate C4-B (content-addressed derived_id for derived causal artifacts). The candidate is PENDING behind a schema-migration gate; this file is a placeholder that will be replaced with the real delivery narrative once the build lands. It exists now only because a Level-3 packet requires it. |
| `010-consolidation-cursor-clock` | Draft | Nothing has shipped yet. This sub-phase plans the longest Memory consolidation chain from packet 028 — receipts default-on (C4-A), an explicit per-item consolidation cursor (C4-C), a clock-driver around the existing cursor (C-G1), plus the crash-safety hardening (contiguous-prefix-stop, durable-retry, transport-idempotency, dead-letter) and two quality candidates (detail-retention-guard, turn-cadence-trigger). The candidate roster and per-candidate STATUS live in spec.md §4 and tasks.md; the sequencing in plan.md; the three open decisions in decision-record.md. |
| `011-retention-forgetting` | Draft | This sub-phase is the planning surface for the Spec-Kit Memory MCP's retention, recall-diversity, and erasure-surface result-shaping candidates. It does not ship code yet. What exists now is a faithful, research-cited plan: eight candidates pulled from the 028/001 deep-research record, each with a confirmed seam and an explicit PENDING status checked against the 030 Wave-0 shipped record. None of the eight shipped in Wave-0, so every one is open work. |
| `012-procedural-reliability-benchmark` | Draft (all candidates PENDING / benchmark-gated) | Nothing was implemented. This is a planning-only re-plan. The authored artifacts are the spec-folder docs (spec / plan / tasks / checklist / decision-record / this summary) that capture the four candidates, their gates, and the prerequisite chain. |
| `013-enrichment-observability` | Complete | This sub-phase turns the silent background enrichment backlog into something an operator can watch. When the Memory MCP saves a row it commits immediately and defers the entity/graph enrichment to an async, concurrency-capped scheduler. If that scheduler stalls or backs up, nothing surfaces it. The fix is a small set of read-side gauges that ride columns the schema already carries, so observing the backlog adds no new state and needs no migration. |
| `014-mem0-ranking-tweaks` | Planned | Nothing yet — planning-state. The phase plans the Mem0 ranking + extraction bundle: query-length BM25 sigmoid calibration, entity cardinality penalty, spaCy lemmatization, declarative regex entity config, multi-pass cascade extraction, write-time LLM memory-linking, separate entity-store boost, and the verify-first content-hash reprocessing trigger. |
| `015-summary-fusion-grounding` | In Progress | Nothing is implemented yet. This sub-phase is a re-plan output: it scopes two paired retrieval-intelligence candidates over the already-built summary/community substrate, both PENDING (neither appears in the Wave-0 shipped record 030-memory-search-intelligence-impl/spec.md §14). |
| `016-iterative-agentic-recall` | Draft | Nothing is built yet. When this packet runs, you will be able to opt a complex memory_context request into an agentic, reason-act-observe retrieval loop that iteratively calls the existing memory tools and refines its own query, while every existing deterministic caller stays exactly as it is today. The headline constraint shapes the whole build: the loop puts an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path that has no loop or cost governor anywhere, so the first thing built is the governor, not the strategy. |
| `017-semantic-edge-layer` | Draft | Nothing is built yet. When this packet runs, the causal graph's edges stop being exact-key-blind SQLite rows and start carrying fact text plus a relationship vector, so edges can be retrieved by semantic similarity and inform dedup, invalidation, and ranking. The shape of the build is fixed by one constraint: the memory-ID graph has no episode model and runs no LLM in the synchronous insert path, so the substrate is added at consolidation-time, off the foreground turn, and never touches the synchronous insertEdge txn. |
| `018-sleeptime-consolidation` | Draft | Nothing is built yet. When this packet runs, the Memory MCP will gain a background, cadence-gated reorganization pass: after a foreground turn, a sleep-time agent reorganizes recent transcripts into archival memory through a bounded tool-chain, while the synchronous on-save reconsolidation every existing caller depends on stays exactly as it is today. The headline constraint shapes the whole build — this pass mutates archival memory off-turn, the highest-tail-risk move in the Memory subsystem — so it is built default-off, shadow/dry-run by default, and the very first thing built is the governor, not the agent. |
| `019-eval-harness-extension` | C9 implemented; A8 pending | Built: - C9-1 single-pass diagnostic emit — runAblation now accepts array returns or { results, diagnosticRows }, emits optional baseline diagnosticSnapshots, and computes request-quality verdicts from computeResultConfidence + assessRequestQuality while preserving array-compatible direct callers. - C9-2 three-way label tagging — added pure label-view derivation plus a single memory_index metadata lookup for importance_tier and created_at; citability derives non-citable expectation from the hard_negative query category. - C9-3 three corpus metric lanes — added gate-verdict confusion P/R/F1, ECE + Brier + reliability bins, and cold-appearance-rate + cold-precision; runAblation reports them under optional corpusMetrics. |
| `020-eval-calibration-ab` | Draft | Nothing is implemented yet. This sub-phase is a re-plan output: it scopes the two measurement-gated retrieval-intelligence candidates the 008-retrieval-evaluation campaign converged on as the eval-harness's first consumers. Both are PENDING — neither appears in the Wave-0 shipped record (030-memory-search-intelligence-impl/spec.md §14). |
| `021-residual-correctness` | DONE | This phase implements two always-on correctness residuals the 008 retrieval-evaluation campaign surfaced. Both are Wave-0, independent, schema-free, and reversible. Packet 030 remains untouched; this phase carries the implementation record. |

### Added

- No new additions recorded.

### Changed

- > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
