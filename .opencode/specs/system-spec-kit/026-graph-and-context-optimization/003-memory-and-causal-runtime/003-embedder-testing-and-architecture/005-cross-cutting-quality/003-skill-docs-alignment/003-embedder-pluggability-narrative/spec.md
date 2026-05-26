---
title: "Spec: 021/003 Embedder-pluggability narrative for new users"
description: "Author canonical doc covering mk-spec-memory + CocoIndex embedder architecture, out-of-box for any embedder + first-install + swap mechanism"
trigger_phrases:
  - "021/003 embedder pluggability"
  - "out-of-box embedder narrative"
  - "any embedder works"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch markdown agent (Opus, deep synthesis) to author narrative"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021003"
      session_id: "021-003-embedder-pluggability-narrative"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 021/003 Embedder-pluggability narrative

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned |
| Level | 1 |
| Owner | markdown agent (Opus, deeper synthesis) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The "support all embedders out of the box for new users" promise is now achieved across two MCPs but nowhere documents it cohesively. mk-spec-memory has the 016 EmbedderAdapter + MANIFESTS + MCP-tool swap. CocoIndex has registered_embedders.py + env var + reset/reindex. These are different mechanisms with the same goal.

A new user / contributor / packet author needs a single canonical document that explains:
- What embedders are supported (per MCP)
- Why the defaults are chosen
- How to swap
- How the architecture handles dim mismatches / re-indexing / device selection / kill switches
- The trade-offs (RAM, latency, quality, language coverage)

Purpose: ship that canonical document.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- New file at `.opencode/skills/system-spec-kit/references/embedder-pluggability.md`
- Sections:
  1. **OVERVIEW** — the two-MCPs / two-embedders / two-mechanisms picture
  2. **mk-spec-memory side** — current default (jina-v3 text + rescue), MANIFESTS registry, MCP tools, dim-tagged vec_<dim> schema, ADR trail (009-012)
  3. **CocoIndex side** — current default (jina-code), registered_embedders, env var swap, MPS auto-detect, COCOINDEX_CODE_DEVICE kill switch
  4. **Operating modes** — first-install flow, swap flow, rollback flow, device selection logic
  5. **Out-of-box support matrix** — table of supported embedders × MCP × backend (Ollama HTTP vs SentenceTransformers vs LiteLLM)
  6. **Trade-offs** — RAM, latency, dim, quality per category
- Cross-links from CocoIndex INSTALL_GUIDE + root README

Out of scope:
- Implementing new pluggability features (016 + 019 are the implementation)
- API-backed embedders (Voyage, OpenAI) — mentioned but not endorsed
- Migration guides (already covered by 018/001 swap-runbook)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Document is ≤ 600 LOC (skill-md cap per memory note feedback_skill_md_size_caps) |
| R2 | Covers both mk-spec-memory + CocoIndex equally — neither is a footnote |
| R3 | Out-of-box matrix shows which embedders work with which MCP without code changes |
| R4 | ADR-009/010/011/012 cited for mk-spec-memory rationale |
| R5 | 018 ADR-001 (when shipped) cited for CocoIndex rationale; or note "ADR pending" with the empirical sample we have |
| R6 | Cross-links to: CocoIndex INSTALL_GUIDE §4, registered_embedders.py, 016/004 decision-record.md |
| R7 | A new user reading this document can pick + swap embedders in either MCP without further reference |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 7 requirements met
- Document linked from CocoIndex INSTALL_GUIDE + root README
- Read-through test: new contributor can swap embedders in <10 min
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Doc rot risk** — if 016 architecture evolves, this doc needs updating. Mitigation: agent emits short "last validated against" footer linking to specific commits
- **Wall-of-text** — covering both MCPs may bloat. Mitigation: 600 LOC cap + section anchors for scannability
- **Opus over-architects** — may add hypothetical features. Mitigation: dispatch prompt restricts to "current state as of commit hash X" with no speculation

Dependencies:
- 019/001 registry (CocoIndex side)
- 016/004 decision-record.md (mk-spec-memory side)
- 018/001 cocoindex_code/config.py
- markdown agent (Opus) with read access to all of above
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to include a worked example "I'm a new user on Mac M2 with 16 GB RAM, what should I do?" Could push doc over 600 LOC. Defer to agent's judgment.
<!-- /ANCHOR:questions -->
