---
title: "Spec: 019/001 Declarative embedder registry for CocoIndex"
description: "Catalog of vetted code-embedder candidates with metadata for new-user selection"
trigger_phrases:
  - "019/001 declarative registry"
  - "embedder catalog"
  - "vetted code embedders"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded registry packet"
    next_safe_action: "Author registry.py + validation script"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019001"
      session_id: "019-001-declarative-registry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 019/001 Declarative embedder registry for CocoIndex

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned |
| Level | 1 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex's only embedder-selection surface today is `COCOINDEX_CODE_EMBEDDING_MODEL` env var. No catalog. A new user must know:
- Which models exist
- What their dim / RAM / disk costs are
- Whether they run on Metal
- Which are general-text vs code-tuned
- The exact sbert/ prefix string to use

This is operator-archaeology. Compare to mk-spec-memory's `MANIFESTS` array which lists all 8 vetted embedders.

Purpose: ship a CocoIndex equivalent — a declarative registry that can be read by humans (and future tools) without diving into HuggingFace.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Author `cocoindex_code/registered_embedders.py` (or `.yml`) with 4-6 vetted candidates
- Per candidate: model_name (sbert string), dim, ~RAM-MB, ~disk-MB, mps_compatible (bool), category (text|code), notes
- A small `registered_embedders` Python API: `list_embedders()`, `get_embedder_metadata(name)`, `default_embedder()`
- Optional: `validate_registry.py` script that verifies each candidate's HF model page is reachable

Out of scope:
- MCP-tool wiring (`cocoindex_embedder_set` etc) — future packet
- Daemon hot-reload of embedder choice
- LiteLLM API-backed entries (Voyage, OpenAI) — local-only policy
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Registry lists at minimum: gemma (baseline), jina-code (default), CodeRankEmbed, bge-code, jina-v2-base-en (alt text), one large high-quality option |
| R2 | Each entry has all 7 metadata fields: model_name, dim, ram_mb, disk_mb, mps_compatible, category, notes |
| R3 | Python API exposed in `cocoindex_code/registered_embedders.py` |
| R4 | Default entry matches `_DEFAULT_MODEL` from config.py (currently jina-code) |
| R5 | Unit tests cover: registry has ≥ 4 entries; default is jina-code; metadata schema is well-formed |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 requirements met
- `from cocoindex_code.registered_embedders import list_embedders; list_embedders()` works in REPL
- pytest passes
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Metadata drift**: model RAM/disk numbers change as HF re-uploads. Document that registry numbers are best-effort snapshots
- **Subjective "category" / "notes" fields**: avoid by linking to authoritative HF model card URLs
- **Registry stays unused**: if no consumer reads it (no MCP tools, no install script wiring), it's dead code. Mitigation: 019/002 wires INSTALL_GUIDE to read it for the alternatives section

Dependencies:
- `cocoindex_code/config.py` (registry must align with `_DEFAULT_MODEL`)
- 019/002 (INSTALL_GUIDE updates) is the primary consumer
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- YAML vs Python module: lean toward Python (typed dataclass, importable from tests). YAML if we want operator-editable without Python knowledge.
<!-- /ANCHOR:questions -->
