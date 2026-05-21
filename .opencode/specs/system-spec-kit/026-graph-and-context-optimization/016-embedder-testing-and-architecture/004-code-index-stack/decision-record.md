---
title: "Decision Record Index: 004 Code Index Stack"
description: "Cross-link index for CocoIndex pipeline ADRs stored in sibling packet decision records."
trigger_phrases:
  - "CocoIndex ADR index"
  - "004 code index stack decisions"
  - "ADR-016 ADR-017 ADR-018 ADR-019 ADR-020 ADR-021 ADR-023"
importance_tier: "important"
contextType: "decision"
---

# Decision Record Index: 004 Code Index Stack

The canonical ADR bodies for the 013-018 CocoIndex pipeline arc remain in `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` for historical continuity. This file is the stack-local index so future operators looking from `004-code-index-stack/` can find them without knowing that earlier storage choice.

| ADR | Packet | Decision | Canonical record |
|---|---|---|---|
| ADR-016 | `013-bench-harness-and-fixture-audit` | Bench harness hardening + corrected fixture contract | `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md#adr-016-bench-harness-hardening--fixture-audit` |
| ADR-017 | `014-mirror-dedup-canonical-preference` | Canonical mirror dedup before rerank | `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md#adr-017-canonical-mirror-dedup-before-cocoindex-rerank` |
| ADR-018 | `015-code-aware-chunking-tree-sitter-stage-b` | Tree-sitter code-aware chunking | `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md#adr-018-tree-sitter-code-aware-chunking-for-cocoindex-code` |
| ADR-019 | `016-query-expansion-identifier-bridging` | Deterministic query expansion, default-false after regression | `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md#adr-019-deterministic-query-expansion-for-cocoindex-identifier-bridging` |
| ADR-020 | `017-hybrid-fusion-empirical-recalibration` | RRF defaults `(K=60,V=0.9,F=0.5)` from 7-cell bge-code-v1 evidence | `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md#adr-020-empirical-rrf-recalibration--fusion-params-are-a-no-op-on-the-corrected-015-candidate-set` |
| ADR-021 | `018-rerank-matrix-rebench` | Jina v3 reranker default with BGE retained as opt-in | `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md#adr-021-final-reranker-verdict-on-the-corrected-pipeline--closes-the-6-packet-arc` |
| ADR-022 | `020-deep-review-p1-p2-remediation` | Hybrid additive boost scaling below calibrated RRF | `020-deep-review-p1-p2-remediation/decision-record.md#adr-022-scale-hybrid-path-class-boosts-below-calibrated-rrf` |
| ADR-023 | `020-deep-review-p1-p2-remediation` | Nomic CodeRankEmbed promotion traceability | `020-deep-review-p1-p2-remediation/decision-record.md#adr-023-document-nomic-coderankembed-promotion` |

Numbering note: ADR-016 and ADR-017 are present in the embedder bake-off decision record. Earlier review confusion came from looking in the `004-code-index-stack/` folder, which did not have this local index.
