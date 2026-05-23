---
title: "Spec: 022/002 Jina-v3 swap + skill-graph reindex"
description: "Flip skill-advisor default from gemma to jina-embeddings-v3 using 022/001 pluggable layer; reindex skill-graph.sqlite; smoke-test semantic-shadow"
trigger_phrases:
  - "022/002 jina swap"
  - "skill-graph reindex"
  - "skill-advisor jina default"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Wait for 022/001 then swap + reindex"
    blockers: ["depends on 022/001"]
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022002"
      session_id: "022-002-jina-swap-and-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 022/002 Jina-v3 swap + skill-graph reindex

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (blocked on 022/001) |
| Level | 1 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After 022/001 ships the pluggable layer, skill-graph.sqlite still has gemma-encoded vectors in its (legacy) embedding cache. To activate jina-v3 in production, we need to: set `vec_metadata.active_embedder_name = jina-embeddings-v3`, reindex the skill-graph corpus with the new embedder, smoke-test that semantic-shadow lane returns sane top-K matches.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Operator runbook: stop daemon, call `setActiveEmbedder('jina-embeddings-v3')`, reindex
- Reindex script (or one-shot CLI) that re-embeds all skill metadata
- Smoke test: `skill_advisor.py recommend "memory save"` returns sane top-3 → expected to include system-spec-kit memory tools
- Smoke test: `lane-weight-sweep.vitest.ts` regression baseline still passes

Out of scope:
- Pluggable code (022/001)
- INSTALL_GUIDE docs (022/003)
- Multi-embedder benchmark (analog of 018/003 — separate packet if desired)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `vec_metadata.active_embedder_name` reads `jina-embeddings-v3` post-swap |
| R2 | Reindex completes without errors; row count preserved |
| R3 | semantic-shadow smoke test returns non-empty top-3 |
| R4 | `skill_advisor.py recommend "memory save"` includes `system-spec-kit` in top-3 |
| R5 | Existing skill-advisor test suite passes (regression baseline) |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 requirements met
- Operator runbook in `evidence/swap-runbook.md`
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Daemon hot-reload not supported**: operator must close skill-advisor daemon before swap. Documented.
- **Quality regression**: jina-v3 is text-tuned; skill metadata is short identifiers + descriptions. Risk is low (mk-spec-memory cat-24/409 proved jina-v3 works on similar surfaces), but reindex evidence captures top-3 for common queries to confirm.
- **Reindex time**: skill-graph corpus is small (~hundreds of entries vs tens of thousands for spec memory); estimate < 5 min.

Dependencies:
- 022/001 (BLOCKING — needs adapter layer)
- jina-v3 model pulled via Ollama (already done)
- skill-advisor daemon (operator restart required)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved 2026-05-21: no env-var bridge or daemon-startup auto-promotion will be built. Programmatic swap via `setActiveEmbedder()` is sufficient for all operator paths; an env-var bridge is not useful because no demonstrated need survived implementation and review.
<!-- /ANCHOR:questions -->
