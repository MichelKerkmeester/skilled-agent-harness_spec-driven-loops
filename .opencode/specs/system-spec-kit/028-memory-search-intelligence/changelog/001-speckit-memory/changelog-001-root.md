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

This root rollup tracks the Memory MCP child phases for packet 028. The parent remains a phase container: detailed planning, implementation evidence and verification live in the child folders below. The rollup now reflects the corrected child status mix: one phase is planning-only, most are partial implementations and the complete phases are limited to the scopes their own verification supports. A closing flag-resolution reckoning sits after the phase builds, recorded in `changelog-001-022-keep-off-flag-reinvestigation.md`: it simulated every keep-off flag under a fair real-world load, kept 5 default-on, deleted 10 along with their code and validated the disposition across three deep-review rounds. A TRACK B new-feature arc then followed the reckoning, recorded in `changelog-001-023-new-feature-research-build.md`: the deleted-10 teachings drove research that found 4 candidates, eval-v2 was built and kept as the measurability gate, and 3 features were built default-off and fresh-Opus held because the append-not-displace pattern makes tail-additive recall zero at prod K by construction. The scoring and eval build then landed as children 025 through 028: the off-corpus false-confirm gate, the lexical-grounding floor, the envelope-fidelity enforcement and the four-flag scoring hardening. The flag-graduation benchmark in the sibling 005 track later graduated the earners to default-ON and deleted the one purely-informational flag.

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
| `008-edge-presence-currentness` | Partial, core shipped default-off | The C3-A edge-presence currentness candidate shipped behind SPECKIT_EDGE_PRESENCE_CURRENTNESS with its schema migration and a focused test. The four remaining currentness and temporal-recall candidates stay pending schema, benchmark and shared-infra evidence. Default recall stays byte-identical until the gate is enabled. |
| `009-derived-id-provenance` | Complete, default-off | Generated causal edges now carry a content-addressed derived ID behind schema version 40 with focused tests, reusing the shared hash primitive. Default behavior stays byte-identical until the gate is enabled. |
| `010-consolidation-cursor-clock` | Planned | The consolidation cursor and clock chain is scoped, with crash-safety and quality gates recorded. No candidate shipped. |
| `011-retention-forgetting` | Partial, two candidates shipped | Spare-only retention eligibility and the live incoming-edge allowlist shipped with deterministic tests behind their gates. The benchmark-gated, cascade and trust-gated candidates remain pending. |
| `012-procedural-reliability-benchmark` | Partial, safe core shipped default-off | The procedural reliability safe core shipped behind `SPECKIT_PROCEDURAL_OUTCOME_EMITTER` and `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` with focused tests. Default recall stays byte-identical and all four candidate promotions remain pending the benefit benchmark. |
| `013-enrichment-observability` | Complete | Background enrichment backlog gauges now expose pending, failed and oldest-pending age using existing health data. |
| `014-mem0-ranking-tweaks` | Partial | Declarative entity config and default-off cardinality penalty shipped. Content-hash reprocessing closed as no-transfer and the remaining candidates stay gated. |
| `015-summary-fusion-grounding` | Partial | The summary/community fusion lane and read-only grounding prelude shipped behind flags. Benchmark delta, retune and persistent hierarchy remain pending. |
| `016-iterative-agentic-recall` | Partial | The bounded agentic loop governor and default-off flag shipped. Router wiring and live benchmark remain pending. |
| `017-semantic-edge-layer` | Partial, substrate shipped | The semantic-edge substrate and a shadow retrieval primitive shipped behind default-off flags. The dedup-merge and invalidation-discovery consumers remain pending benchmark and safety evidence. |
| `018-sleeptime-consolidation` | Partial, safe core shipped | The bounded sleep-time governor and shadow agent scaffold shipped behind default-off flags. Off-turn dispatch, live archival writes and benchmark promotion remain pending. |
| `019-eval-harness-extension` | Partial | Optional diagnostics, label views and three corpus metric lanes shipped. The A8 promotion-gate work remains pending. |
| `020-eval-calibration-ab` | Partial, observe-only utilities shipped | Observe-only confidence calibration and lever A/B utilities shipped behind default-off flags. Promotion waits on held-out ECE and golden-set delta evidence from 019. |
| `021-residual-correctness` | Complete | Search score averaging now uses the calibrated relevance scale and maintenance marker TTL derives from the owner lease invariant. |
| `022-keep-off-flag-reinvestigation` | Milestone, after the phase builds | Flag-resolution reckoning that ran after the build program. Five flags kept default-on, derived-id provenance and confidence calibration on an unqualified win, retention forgetting and world-summary prelude on a no-harm guarantee and temporal edges as the additive graph lane. Ten flags deleted along with their code, procedural reliability recall among them after its de-rate fix moved only synthetic near-ties. A three-round deep review validated the disposition and caught an off-arm measurement bug. The full method lives in `007-kept-off-flag-resolution/`. |
| `023-new-feature-research-build` | Milestone, after the reckoning | TRACK B new-feature arc that read the deleted-10 teachings as a research input and found 4 candidates. eval-v2 was built and kept as the measurability gate, exposing an eval-vs-prod fidelity gap of eval-mode completeRecall@8 0.212 against prod-mode 0.036. Three features were built default-off and fresh-Opus held: deterministic-multihop at prod delta 0.000, lane-champion-backfill at 0.000 and redundant with RRF, and the true-citation-emitter on an under-counted positive label. The append-not-displace pattern is the key finding, tail-additive recall is zero at prod K by construction. The full method lives in `008-new-feature-research-build/`. |
| `024-reranker-research` | Research, no code | Reranker research that returned a CONDITIONAL-GO verdict on a proposed default-off `SPECKIT_CITATION_RERANK` lane. No code shipped. |
| `025-off-corpus-eval-fixture-gate` | Complete, enforcing | The off-corpus eval fixture and the `SPECKIT_FALSE_CONFIRM_MAX_RATE` CI gate shipped. The fixture reproduced the live 0.833 off-corpus false-confirm rate on nomic. The ceiling has since graduated to 0, so any off-corpus false confirm fails the gate. |
| `026-lexical-grounding-floor` | Complete, graduated default-on | The lexical-grounding floor shipped behind `SPECKIT_LEXICAL_GROUNDING_V1` and drove the off-corpus false-confirm rate from 0.833 to 0. The benchmark confirmed the rate holds on live data, so the flag graduated to default-ON. |
| `027-envelope-fidelity-enforcement` | Complete, graduated default-on | The `data.envelopeRender` fragment and the conditionally-mandatory render-slot contract shipped behind `SPECKIT_ENVELOPE_FIDELITY_V1` with a fidelity checker. A captured render corpus showed it flags every dropped render and passes every faithful one, so it graduated to default-ON. |
| `028-scoring-hardening` | Complete, three graduated and one deleted | Four verdict-path flags shipped: noise-floor `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`, cite-with-caveat `SPECKIT_CITE_WITH_CAVEAT_V1` and evidence-gap `SPECKIT_EVIDENCE_GAP_VERDICT_V1` all graduated to default-ON on a measured effect, and grounding-signal `SPECKIT_GROUNDING_SIGNAL_V1` was deleted as purely informational. The phase also proved the confidence-calibration re-fit is a non-fix. |

### Added

- Added a polished root status table that matches child phase evidence.
- Added the closing flag-resolution milestone row that records the keep 5 default-on and delete 10 reckoning.

### Changed

- Replaced generated placeholder summaries with grounded child-phase narratives.
- Corrected stale planning-only statuses for phases that now have partial implementation evidence.
- Updated the rollup to carry the final keep 5 and delete 10 outcome rather than the transitional four-flip state.

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
