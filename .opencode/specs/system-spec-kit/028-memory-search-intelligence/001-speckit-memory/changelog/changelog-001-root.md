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

This root rollup tracks the Memory MCP child phases for packet 028. The parent remains a phase container: detailed planning, implementation evidence and verification live in the child folders below. The rollup now reflects the corrected child status mix: several phases are planning-only, several are partial implementations and the complete phases are limited to the scopes their own verification supports.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-corpus-reindex-gate-zero` | Guard shipped, reindex superseded | Embedding coverage now gates ablation runs. Live evidence showed full vector coverage, so the manual reindex was not run for its original purpose. |
| `002-determinism-content-id-foundation` | Partial, five shipped and four gated | Shared content-id primitives, stable ANN ordering, deterministic tie-breaks, active-channel bonus plumbing and rank-time decay shipped. Configured mode, render serialization and identity-hardening remain gated. |
| `003-retrieval-class-routing` | Partial, routing spine shipped | The query path now carries a retrieval class, uses it for graph preservation and feeds default-off class profiles into fusion. Recall-shape and graph-context work remain pending. |
| `004-graceful-degradation` | Complete | Embedder outages now degrade to lexical search with explicit metadata while the successful embedding path remains unchanged. |
| `005-recall-render-escaper` | Partial, five done and one gated | Recall rendering, capture-side injection flagging, CAS polish and residual-retention disclosure shipped. System-kind exclusion remains gated on substrate evidence and live-database validation. |
| `006-redteam-probe-gate` | Partial, MCP-server lane shipped | The MCP-server security gate, fixtures, selector and sanitized denial audit shipped. The sibling prompt-pack probe remains pending. |
| `007-bitemporal-window` | Partial, schema foundation shipped | Schema version 38 adds the causal and lineage bi-temporal window with migration coverage. Event-time invalidation, chronology behavior and transaction-time recall remain pending consumers. |
| `008-edge-presence-currentness` | Planned | The phase is a Level-3 re-plan for currentness and temporal recall candidates. No production code shipped. |
| `009-derived-id-provenance` | Complete, default-off | Generated causal edges now carry a content-addressed derived ID behind schema version 40 with focused tests, reusing the shared hash primitive. Default behavior stays byte-identical until the gate is enabled. |
| `010-consolidation-cursor-clock` | Planned | The consolidation cursor and clock chain is scoped, with crash-safety and quality gates recorded. No candidate shipped. |
| `011-retention-forgetting` | Partial, two candidates shipped | Spare-only retention eligibility and the live incoming-edge allowlist shipped with deterministic tests behind their gates. The benchmark-gated, cascade and trust-gated candidates remain pending. |
| `012-procedural-reliability-benchmark` | Planned | Procedural reliability remains benchmark-first. The phase freezes the candidate set and promotion gate. |
| `013-enrichment-observability` | Complete | Background enrichment backlog gauges now expose pending, failed and oldest-pending age using existing health data. |
| `014-mem0-ranking-tweaks` | Partial | Declarative entity config and default-off cardinality penalty shipped. Content-hash reprocessing closed as no-transfer and the remaining candidates stay gated. |
| `015-summary-fusion-grounding` | Partial | The summary/community fusion lane and read-only grounding prelude shipped behind flags. Benchmark delta, retune and persistent hierarchy remain pending. |
| `016-iterative-agentic-recall` | Partial | The bounded agentic loop governor and default-off flag shipped. Router wiring and live benchmark remain pending. |
| `017-semantic-edge-layer` | Partial, substrate shipped | The semantic-edge substrate and a shadow retrieval primitive shipped behind default-off flags. The dedup-merge and invalidation-discovery consumers remain pending benchmark and safety evidence. |
| `018-sleeptime-consolidation` | Partial, safe core shipped | The bounded sleep-time governor and shadow agent scaffold shipped behind default-off flags. Off-turn dispatch, live archival writes and benchmark promotion remain pending. |
| `019-eval-harness-extension` | Partial | Optional diagnostics, label views and three corpus metric lanes shipped. The A8 promotion-gate work remains pending. |
| `020-eval-calibration-ab` | Partial, observe-only utilities shipped | Observe-only confidence calibration and lever A/B utilities shipped behind default-off flags. Promotion waits on held-out ECE and golden-set delta evidence from 019. |
| `021-residual-correctness` | Complete | Search score averaging now uses the calibrated relevance scale and maintenance marker TTL derives from the owner lease invariant. |

### Added

- Added a polished root status table that matches child phase evidence.

### Changed

- Replaced generated placeholder summaries with grounded child-phase narratives.
- Corrected stale planning-only statuses for phases that now have partial implementation evidence.

### Fixed

- Removed raw task markers and checklist-style artifact labels from the rollup prose.

### Verification

- Strict validation on the 028 root: PASS.
- Em-dash scan on the changelog folder: PASS, 0 matches.

### Files Changed

| File | Action |
|---|---|
| `changelog-001-root.md` | Polished |

### Follow-Ups

- Keep future rollups tied to child phase evidence rather than generated placeholder summaries.
