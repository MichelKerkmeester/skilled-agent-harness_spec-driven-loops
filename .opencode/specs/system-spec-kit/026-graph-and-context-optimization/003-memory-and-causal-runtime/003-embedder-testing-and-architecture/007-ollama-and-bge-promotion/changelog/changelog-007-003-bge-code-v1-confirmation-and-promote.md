---
title: "BGE-code-v1 confirmation closed as superseded by Nomic CodeRankEmbed"
description: "The promised 4-candidate re-baseline was never run. Pre-confirmation margin analysis invalidated the May 18 BGE-code-v1 baseline by showing the active pipx daemon lacked the reranker module. The packet closes as superseded with the later Nomic local-first promotion path as the production authority."
trigger_phrases:
  - "bge-code-v1 confirmation superseded"
  - "016/007/003 changelog"
  - "bge-code-v1 rebaseline closed"
  - "pre-confirmation margin analysis decision"
  - "nomic coderankembed supersedes bge-code-v1"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion`

### Summary

The BGE-code-v1 confirmation packet had promised a full 4-candidate re-baseline against the corrected pipeline after an evening instrumented bench invalidated the May 18 morning `11/18 = 61.1%` result. That earlier result was measured against a pipx daemon that did not have the reranker module installed, making the claimed hybrid+rerank baseline structurally false.

The re-baseline was never completed. No preserved `.csv`, `.jsonl` or `bench-*` artifacts were found under the packet. A cleanup dispatch in May 2026 produced `pre-confirmation-margin-analysis.md`, which documented the reranker failure mode (lexical-cue density over semantic role causing tests and reference docs to outrank implementations). It also produced `decision-record.md` (ADR-001), which formally closed the packet as superseded rather than complete.

Production embedder authority moved to the Nomic CodeRankEmbed path under the later local-first promotion work. Operators should consult that path and the broader bake-off decision record instead of this packet.

### Added

- `pre-confirmation-margin-analysis.md` documenting per-probe results for the 4 historically-unique probes (3, 10, 14, 18) with cross-encoder score margins against the corrected pipeline
- `decision-record.md` with ADR-001 formalizing the supersession and prohibiting retroactive artifact reconstruction
- `implementation-summary.md` acknowledging missing benchmark artifacts and pointing to the Nomic local-first authority
- `plan.md`, `tasks.md` and `checklist.md` backfilled to satisfy Level 2 contract for strict validation

### Changed

- Packet status updated from Planned to Superseded in `spec.md` metadata and `implementation-summary.md`
- Scope narrative in `spec.md` extended with a dispatch correction note citing the Nomic CodeRankEmbed supersession

### Fixed

- Missing Level 2 required files (`implementation-summary.md`, `decision-record.md`, `plan.md`, `tasks.md`, `checklist.md`) added so strict validation passes without phantom completion claims
- Ambiguous "Planned" status resolved to an explicit supersession record so memory search does not surface this packet as an active promotion authority

### Verification

| Check | Result |
|-------|--------|
| Search for preserved `.csv`, `.jsonl`, `bench-*` artifacts under packet | No artifacts found |
| Read `pre-confirmation-margin-analysis.md` | Confirms May 18 BGE-code-v1 baseline was invalidated by reranker absence in pipx daemon |
| Read `decision-record.md` ADR-001 | Accepted. Closes packet as superseded not complete. |
| Strict validation (`validate.sh --strict`) after backfill | Passed per 2026-05-21 cleanup dispatch |

### Files Changed

| File | What changed |
|------|--------------|
| `pre-confirmation-margin-analysis.md` (NEW) | Per-probe results for 4 unique probes with cross-encoder score margins. Documents systematic rerank failure mode. |
| `decision-record.md` (NEW) | ADR-001 supersession decision. Points operators to Nomic local-first authority. |
| `implementation-summary.md` (NEW) | Honest closure record. Acknowledges missing artifacts. Records supersession rationale. |
| `spec.md` | Status and scope narrative updated. Dispatch correction note added. |

### Follow-Ups

- Confirm the `benchmark-2026-05-18/` skill-local report under `mcp-coco-index` carries the erratum that the May 18 numbers were measured without the reranker firing.
- Investigate whether `BAAI/bge-reranker-v2-m3` is appropriate for code retrieval given the lexical-cue demotion pattern documented in `pre-confirmation-margin-analysis.md` section 4.
