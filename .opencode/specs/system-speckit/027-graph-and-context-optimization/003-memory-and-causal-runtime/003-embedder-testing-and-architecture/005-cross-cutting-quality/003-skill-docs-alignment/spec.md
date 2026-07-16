---
title: "021: Skill docs alignment for 016-019 changes (phase parent)"
description: "Sweep all skill SKILL.md / README / references / assets for stale embedder defaults + claims that drifted across 016-019 work. Refresh root README. Author canonical embedder-pluggability narrative covering mk-spec-memory + CocoIndex out-of-box for new users."
trigger_phrases:
  - "021 skill docs alignment"
  - "skill md audit 016-019"
  - "embedder pluggability narrative"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded docs-alignment packet"
    next_safe_action: "Dispatch parallel native agents to fill evidence"
    blockers: []
    key_files:
      - "001-skill-mds-audit/spec.md"
      - "002-root-readme-update/spec.md"
      - "003-embedder-pluggability-narrative/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021000"
      session_id: "021-skill-docs-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# 021: Skill docs alignment for 016-019 changes (phase parent)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This session shipped large architectural changes (pluggable embedders 016, retrieval rescue 016/004 ADR-009/010/011, Nomic/CodeRankEmbed current default, CocoIndex CodeRankEmbed swap, registered_embedders + INSTALL_GUIDE 019/001+002) but the broader documentation surface — skill MDs, references/, assets/, the root README — wasn't audited for stale references.

Two failure modes:
1. **Stale defaults**: skill docs still say "gemma" or "nomic" in places where current state is Nomic/CodeRankEmbed for mk-spec-memory and CocoIndex, Qwen sidecar rerank for CocoIndex, and gemma-active/deferred-alignment for skill-advisor
2. **Missing architecture narrative**: nowhere documents the unified "pluggable embedder out-of-box for new users" story across both MCPs

This packet closes both gaps via three parallel children dispatched as native Opus/Sonnet agents.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:scope -->
## 2. SCOPE

In scope:
- Audit `.opencode/skills/*/SKILL.md` for stale embedder/architecture refs
- Audit `.opencode/skills/*/README.md` same
- Audit `.opencode/skills/*/references/**` same
- Audit `.opencode/skills/*/assets/**` same
- Refresh root `README.md`
- Author canonical `embedder-pluggability.md` narrative (lives in `system-spec-kit/references/` or similar)

Out of scope:
- The skill code itself (lib/, src/) — already covered by 020 deep-review (when dispatched)
- Spec docs under `.opencode/specs/**` — packet-owned, not skill-level
- Vendor/`node_modules`/`.venv` — frozen
- `z_archive/**` — frozen
- Skill changelog entries — not authoritative current-state docs
<!-- /ANCHOR:scope -->

<!-- ANCHOR:children -->
## 3. CHILDREN

| Child | Purpose | Agent |
|---|---|---|
| `001-skill-mds-audit` | Sweep all `.opencode/skills/*/{SKILL.md,README.md,references/**,assets/**}` for stale gemma/nomic refs + outdated architecture claims | Explore (Sonnet) |
| `002-root-readme-update` | Refresh root `README.md` with current embedder defaults + architecture summary | markdown (Sonnet) |
| `003-embedder-pluggability-narrative` | Author canonical narrative doc covering 016-019 architecture + "any embedder works out of the box" for new users | markdown (Opus, deeper synthesis) |
<!-- /ANCHOR:children -->

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

- 016 packet (pluggable embedder architecture — source of truth for MANIFESTS pattern)
- 016/004 ADRs 009/010/011/012 (rescue layer + jina ratification)
- 018/001 (CocoIndex jina-code swap + MPS auto-detect)
- 019/001 (registered_embedders module)
- 019/002 (CocoIndex INSTALL_GUIDE updates — narrative consumer)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- Audit CSV lists every doc reference to stale defaults (gemma, nomic-text without rescue context, etc) with file:line + recommended fix
- Stale refs in skill MDs/READMEs fixed in-place
- Root README has current embedder defaults + 1-paragraph architecture summary + link to canonical narrative
- Canonical `embedder-pluggability.md` exists, ≤ 600 LOC, covers both MCPs, includes:
  - Default for each MCP (Nomic/CodeRankEmbed bi-encoder paths, CocoIndex Qwen rerank sidecar, mk-spec-memory reranker opt-in)
  - Registry mechanism (MANIFESTS for mk-spec-memory, registered_embedders for CocoIndex)
  - Swap mechanism (MCP tool for mk-spec-memory, env var + reset for CocoIndex)
  - Operating modes (rescue layer, MPS auto-detect, kill switches)
- All affected packets strict-validate PASSED
<!-- /ANCHOR:success -->
