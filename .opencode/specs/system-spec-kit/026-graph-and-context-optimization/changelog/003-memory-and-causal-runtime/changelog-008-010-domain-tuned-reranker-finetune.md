---
title: "008/010 Domain-Tuned Reranker Fine-Tune Scaffold"
description: "Deferred reranker fine-tune packet for spec-memory corpus ranking after cheaper rerank experiments fail to promote."
trigger_phrases:
  - "008/010 domain fine-tune"
  - "spec-memory reranker fine-tune"
  - "cross-encoder fine-tune scaffold"
  - "rerank sidecar final candidate"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

This phase is a scaffold for the most expensive remaining rerank-sidecar hypothesis: fine-tuning a small cross-encoder on spec-memory's own structured markdown corpus. It exists because prior off-the-shelf reranker benchmarks either missed latency gates, crashed on memory pressure or regressed hit rate against the positional fallback.

Execution is deferred. The packet says not to run the fine-tune unless cheaper rerank experiments produce HOLD verdicts and the larger research arc still needs a final candidate. The spec frontmatter later marks the packet as superseded by a sibling path, so this changelog records the scaffold rather than a shipped training run.

### Added

- Packet scaffold for synthetic query generation, hard-negative mining, fine-tune training, benchmark evaluation and decision closeout.
- Planned gates for hit-rate improvement against OFF baseline and p95 latency within the sidecar budget.
- Explicit limitations for synthetic queries, single-corpus tuning, fixture reuse, offline evaluation and future corpus drift.

### Changed

- None. No training scripts, model artifacts, sidecar defaults or search flags were changed by this scaffold.

### Fixed

- None. This packet did not ship a reranker fix or default flip.

### Verification

| Check | Result |
|---|---|
| Implementation status | Scaffold only. No fine-tune, benchmark artifact or default flip shipped. |
| Execution gate | Blocked on packet 008 and 009 verdicts plus research convergence. |
| Supersession status | Spec continuity says this path was superseded by 011/003 and should not execute. |
| Planned training verification | Data generation, fine-tune, benchmark and strict validation commands recorded as future-only steps. |
| Strict packet validation | No explicit completed validation result recorded in packet artifacts. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Added | Defined the deferred fine-tune hypothesis, gates, scope, risks and supersession note. |
| `plan.md` | Added | Planned data generation, fine-tuning, evaluation, decision gates, publish path and rollback. |
| `tasks.md` | Added | Listed blocked setup, training, benchmark, promote-path and closeout tasks. |
| `implementation-summary.md` | Added | Captured the scaffold-only status, planned deliverables, decisions and known limitations. |
| `description.json` | Added | Added packet metadata for discovery. |
| `graph-metadata.json` | Added | Added graph metadata for packet traversal. |

### Follow-Ups

- Do not execute this path while the spec continuity points to 011/003 as the replacement.
- If the supersession is reversed, confirm packet 008 and 009 verdicts before generating training data.
- Keep training data and model artifacts reproducible and out of the repo unless a later packet changes that policy.
- Record a PROMOTE or HOLD verdict with benchmark evidence before changing rerank defaults.
