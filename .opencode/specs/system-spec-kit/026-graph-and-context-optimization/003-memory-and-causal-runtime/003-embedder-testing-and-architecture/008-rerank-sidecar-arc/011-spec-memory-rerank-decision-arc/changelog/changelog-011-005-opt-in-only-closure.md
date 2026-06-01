---
title: "Spec: spec-memory rerank opt-in-only closure"
description: "Terminal verdict for arc 011: flipped SPECKIT_CROSS_ENCODER to default OFF, gated the WEIGHT_RERANKER confidence penalty behind an isRerankerExpected() helper, superseded 7 sibling rerank packets. Closed the rerank decision arc with an evidence trail."
trigger_phrases:
  - "opt-in-only closure"
  - "spec-memory rerank default off"
  - "WEIGHT_RERANKER conditional penalty"
  - "rerank decision arc closure"
  - "isRerankerExpected helper"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc`

### Summary

After four HOLD verdicts across the rerank arc, including a bge-v2-m3 trial that returned literally identical numbers to the OFF baseline at 19x the latency, the operator closed arc 011 with a documented decision: keep the shared sidecar framework because cocoindex has a working default consumer, but make spec-memory reranking explicit opt-in. The `WEIGHT_RERANKER=0.20` boolean penalty in `confidence-scoring.ts` was silently dragging `requestQuality` confidence down across every `memory_search` call even when no reranker was involved. This phase patched the default flag to OFF, introduced `isRerankerExpected()` to gate the penalty on intentional operator configuration, added 3 targeted Vitest cases covering the opt-in boundary, updated skill docs. It swept supersede statuses across 7 sibling packets. The arc is closed and reversible: all existing opt-in code paths remain intact.

### Added

- `isRerankerExpected()` exported from `search-flags.ts`, returning true only when a cloud provider key is configured (`SPECKIT_CROSS_ENCODER=true` or `RERANKER_LOCAL=true`).
- `scoring-opt-in.vitest.ts` with 3 assertions: default-off quality, opt-in-with-unavailable-reranker confidence gap, cloud-key opt-in confidence gap.
- "Reranking (opt-in)" documentation block in `.opencode/skills/system-spec-kit/SKILL.md` explaining the OFF-by-default decision and the env vars to enable it.

### Changed

- `search-flags.ts`: `SPECKIT_CROSS_ENCODER` default flipped from true to false. Inline comment updated to reflect OFF default.
- `confidence-scoring.ts`: `WEIGHT_RERANKER * rerankerFactor` application changed from unconditional to `isRerankerExpected() ? WEIGHT_RERANKER * rerankerFactor : 0`. Penalty fires only when reranker was opted-in.
- `.opencode/skills/system-rerank-sidecar/SKILL.md`: consumers clarified as cocoindex (default) and spec-memory (opt-in via `SPECKIT_CROSS_ENCODER=true` or `RERANKER_LOCAL=true`).
- Seven sibling packets marked superseded in frontmatter and `graph-metadata.json` with `manual.superseded_by` pointing to this packet.
- Arc 011 parent and arc 008 parent phase maps updated to record the closure verdict.

### Fixed

- `memory_search` results no longer receive a 20% confidence penalty when no reranker is configured or expected. The silent quality drain is gone for default operator deployments.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/scoring-opt-in.vitest.ts` | 3 of 3 passed |
| `npx vitest run tests/cross-encoder-extended.vitest.ts` | 34 of 34 passed |
| Full Vitest suite (`npx vitest run tests/`) | 157 failures, below the <=168 ceiling baseline |
| `validate.sh --strict` on `011/005-opt-in-only-closure/` | Exit 0 |
| `validate.sh --strict` on `011/002-bge-v2-m3-trial/` | Exit 0 |
| `validate.sh --strict` on `011/003-domain-tuned-finetune/` | Exit 0 |
| `validate.sh --strict` on `011/004-retrieval-and-fixture-audit/` | Exit 0 |
| `validate.sh --strict` on `008/005-promote-qwen-as-default/` | Exit 0 |
| `validate.sh --strict` on `008/007-spec-memory-mps-rerank-promotion/` | Exit 0 |
| `validate.sh --strict` on `008/008-cap-rerank-top-k/` | Exit 0 |
| `validate.sh --strict` on `008/009-fp16-rerank/` | Exit 0 |
| `validate.sh --strict` on `011-spec-memory-rerank-decision-arc/` | Exit 0 |
| `validate.sh --strict` on `008-rerank-sidecar-arc/` | Exit 0 |

### Files Changed

| File | Action | Notes |
|------|--------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Changed | `SPECKIT_CROSS_ENCODER` default set to false. `isRerankerExpected()` helper added and exported. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Changed | `WEIGHT_RERANKER` penalty gated behind `isRerankerExpected()`. Import of `isRerankerExpected` added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts` | Added (NEW) | Three Vitest assertions: default-off. local opt-in. cloud opt-in scoring behavior. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Changed | "Reranking (opt-in)" section added with OFF-by-default rationale and enablement instructions. |

### Follow-Ups

- The full Vitest suite retains a 157-failure baseline below the <=168 ceiling. Investigate the remaining failures in a dedicated remediation packet if the count grows.
- Retrieval and fixture quality were intentionally out of scope. Revisit the 011/004 audit work if spec-memory reranking is opted back in by an operator.
- Confirm that the `system-rerank-sidecar` skill SKILL.md update from the original commit persists after the subsequent skill removal in commit `696c889887`.
