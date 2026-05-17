---
title: "019: CocoIndex embedder registry parity (phase parent)"
description: "Bring CocoIndex's embedder selection up to parity with 016's mk-spec-memory pluggable architecture. Two children: declarative registry of vetted code embedders + INSTALL_GUIDE/README updates so new-user onboarding picks the right embedder by default."
trigger_phrases:
  - "019 cocoindex embedder registry"
  - "cocoindex pluggable parity"
  - "new-user embedder onboarding"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-cocoindex-embedder-registry"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded registry-parity packet"
    next_safe_action: "Implement 001 declarative registry"
    blockers: []
    key_files:
      - "001-declarative-registry/spec.md"
      - "002-install-guide-updates/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019000"
      session_id: "019-cocoindex-embedder-registry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# 019: CocoIndex embedder registry parity (phase parent)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The 016 packet shipped a pluggable embedder architecture for mk-spec-memory: `EmbedderAdapter` interface, `MANIFESTS` registry, MCP tools (`embedder_list` / `embedder_set` / `embedder_status`), dim-tagged `vec_<dim>` schema, crash-resume swap orchestrator. A new user can swap embedders without code/schema changes.

CocoIndex has no equivalent. Its embedder is set via `COCOINDEX_CODE_EMBEDDING_MODEL` env var with the `sbert/` prefix convention — but there's no catalog of vetted choices, no documentation surface for the swap flow, and no first-install path that nudges new users toward a sensible default.

This packet closes that gap with a **minimal viable parity** approach: a declarative registry listing vetted code-embedder candidates (dim, size, RAM, MPS-compatibility, notes) plus INSTALL_GUIDE/README updates so a fresh-clone user picks jina-code (per 018 ADR-001) without having to discover the swap mechanism on their own.

Note: this is intentionally NOT full parity with 016. CocoIndex doesn't get MCP-tool surface (`embedder_set` etc) in this packet — that's a future enhancement if operator demand surfaces.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:scope -->
## 2. SCOPE

In scope:
- Declarative embedder registry (Python module or YAML) listing 4-6 vetted code-embedder candidates with metadata (dim, RAM, MPS, notes, install_command)
- INSTALL_GUIDE update: default = jina-code, with a section listing alternatives + how to switch via `COCOINDEX_CODE_EMBEDDING_MODEL` env var
- README.md update: explain CocoIndex's embedder choice + link to INSTALL_GUIDE
- Optional: small validation script that reads the registry + verifies each candidate's HF model exists

Out of scope:
- MCP tool parity (no `cocoindex_embedder_set` etc) — defer to future packet if demanded
- Auto-swap mechanism via daemon hot-reload — daemon restart remains operator-driven
- LiteLLM API-backed embedders (Voyage, OpenAI) — local-only by policy
- mk-spec-memory side — already done in 016
<!-- /ANCHOR:scope -->

<!-- ANCHOR:children -->
## 3. CHILDREN

| Child | Purpose |
|---|---|
| `001-declarative-registry` | Author the registry module/YAML + optional validation script |
| `002-install-guide-updates` | README + INSTALL_GUIDE updates with default + alternatives + swap runbook |
<!-- /ANCHOR:children -->

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

- 018/001 already shipped — CocoIndex default now jina-code (commit 8f909d229)
- 018/003 benchmark + ADR-001 — will inform whether jina-code remains the registry's primary recommendation
- This packet does not modify config.py; only adds metadata + docs
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- Registry lists at minimum: gemma (baseline), jina-code (default), CodeRankEmbed, bge-code, jina-v2-base (text), one larger high-quality option (e.g., SFR-Embedding-Code-2B)
- Each entry has: model_name, dim, ~RAM, ~disk, ~download URL, MPS-compatible boolean, notes (when to prefer)
- INSTALL_GUIDE has a "Choosing an embedder" section operator-readable in <5 min
- README links to the chooser section
- New user reading the INSTALL_GUIDE can pick + activate a non-default embedder in <10 min
<!-- /ANCHOR:success -->
