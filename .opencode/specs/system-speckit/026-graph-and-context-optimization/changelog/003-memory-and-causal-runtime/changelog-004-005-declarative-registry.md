---
title: "004/005 Declarative Registry Scaffold"
description: "Planned CocoIndex embedder registry packet for vetted local model metadata, registry accessors and default alignment tests."
trigger_phrases:
  - "004/005 declarative registry"
  - "CocoIndex embedder catalog"
  - "registered_embedders scaffold"
  - "jina-code default alignment"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

This phase is a pre-implementation scaffold for a declarative CocoIndex embedder registry. The planned work is a typed `registered_embedders.py` module with model metadata, a default accessor that matches `config.py` and unit tests for schema coverage.

No runtime implementation has shipped yet. The packet records the target shape, the model metadata requirements and the verification commands future implementation must satisfy.

### Added

- Packet scaffold for a CocoIndex embedder registry with 4 to 6 vetted local model candidates.
- Planned API surface for `list_embedders()`, `get_embedder_metadata(name)` and `default_embedder()`.
- Task list for metadata survey, Python module authoring, manifest population and registry tests.

### Changed

- None. Runtime CocoIndex source was not changed by this scaffold.

### Fixed

- None. This packet documents planned work and does not close a shipped defect yet.

### Verification

| Check | Result |
|---|---|
| Implementation status | No implementation shipped. Packet artifacts report completion at 0 percent. |
| Planned registry test | `python -m pytest tests/test_registered_embedders.py -v` recorded as future verification only. |
| Planned import smoke | `list_embedders()` and `default_embedder()` import smoke recorded as future verification only. |
| Strict packet validation | No explicit completed validation result recorded in packet artifacts. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Added | Defined the problem, scope, requirements, success criteria and risks for the registry packet. |
| `plan.md` | Added | Planned the Python registry module, manifest shape, schema tests and default-alignment gates. |
| `tasks.md` | Added | Listed the pending implementation and verification tasks for the registry module. |
| `implementation-summary.md` | Added | Captured the pre-implementation placeholder, planned artifacts and future verification commands. |
| `description.json` | Added | Added packet metadata for discovery. |
| `graph-metadata.json` | Added | Added graph metadata for packet traversal. |

### Follow-Ups

- Survey current HuggingFace model-card metadata for dimension, size and Apple Silicon compatibility.
- Build `cocoindex_code/registered_embedders.py` with typed metadata and manifest accessors.
- Add `tests/test_registered_embedders.py` to enforce schema shape and default alignment.
- Run the planned pytest, import smoke and strict packet validation once implementation lands.
