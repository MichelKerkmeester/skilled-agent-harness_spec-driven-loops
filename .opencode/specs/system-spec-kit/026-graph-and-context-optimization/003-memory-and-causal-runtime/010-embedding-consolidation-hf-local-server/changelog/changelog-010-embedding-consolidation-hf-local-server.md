

---
title: "Embedding consolidation and hf-local model server"
description: "Phase parent for embedding consolidation and hf-local model server re-architecture. Consolidated embedding stack on single default model and re-architected hf-local provider as launcher-supervised local HTTP model server."
trigger_phrases:
  - "embedding consolidation"
  - "hf-local model server"
  - "launcher supervision"
  - "nomic embed text"
  - "local embedding provider"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary
The embedding stack exposed too many local model choices across separate registries, dimension maps, provider defaults, type strings, and docs. The hf-local provider loaded transformers inside daemon/sidecar execution paths instead of using launcher-owned, health-probed local-service shape.

### Added
- Phase parent for embedding consolidation and hf-local model server re-architecture
- All 6 child phases implemented: nomic-only consolidation, hf-model-server, hf-local-http-client, launcher-supervision, retire-sidecar, skill-advisor-shared-wiring
- Consolidated embedding stack on single default model (nomic-ai/nomic-embed-text-v1.5)

### Changed
- Re-architected hf-local provider as launcher-supervised local HTTP model server

### Fixed
- None.

### Verification
Not recorded in source docs.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision/` | Created | Phase folder for launcher supervision child |

### Follow-Ups
- None.
