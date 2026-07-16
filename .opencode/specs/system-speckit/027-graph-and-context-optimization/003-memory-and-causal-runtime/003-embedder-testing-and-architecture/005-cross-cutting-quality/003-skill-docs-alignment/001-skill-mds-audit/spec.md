---
title: "Spec: 021/001 Skill MDs audit for stale 016-019 refs"
description: "Sweep all skill SKILL.md / README.md / references/ / assets/ for stale embedder defaults + outdated architecture claims"
trigger_phrases:
  - "021/001 skill mds audit"
  - "stale embedder references"
  - "skill docs sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/001-skill-mds-audit"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded audit packet"
    next_safe_action: "Dispatch Explore agent to sweep docs"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021001"
      session_id: "021-001-skill-mds-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 021/001 Skill MDs audit for stale 016-019 refs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned |
| Level | 1 |
| Owner | Explore agent (Sonnet) dispatched by main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 016-019 work changed defaults across two MCPs:
- mk-spec-memory: embeddinggemma-300m → nomic → jina-embeddings-v3 (text)
- CocoIndex: embeddinggemma-300m → jina-embeddings-v2-base-code

Plus the rescue layer landed (default-on per ADR-011). Skill docs may still reference the old defaults, the pre-rescue retrieval flow, or the pre-016 architecture.

Purpose: produce a complete audit CSV listing every stale reference with file:line + recommended fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- `.opencode/skills/*/SKILL.md` — all skills
- `.opencode/skills/*/README.md` — all skills
- `.opencode/skills/*/references/**/*.md` — all skills
- `.opencode/skills/*/assets/**/*.md` — all skills
- `AGENTS.md` (top-level if present)

Out of scope:
- Spec docs (packet-owned)
- skill `lib/`, `src/`, `mcp_server/` Python/TS code (covered by 020 deep-review)
- `changelog/` entries (intentionally historical)
- `manual_testing_playbook/**` (017 owned)
- `feature_catalog/**` (per-feature; review separately if needed)
- `z_archive/**` (frozen)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Audit CSV at `evidence/skill-docs-audit.csv` lists every stale ref |
| R2 | Each row: `path:line` + `current_text` + `recommended_fix` + `severity` (P0/P1/P2/P3) |
| R3 | Severity classification: P0=misleading defaults that break new-user setup; P1=outdated architecture claims; P2=minor naming inconsistencies; P3=cosmetic |
| R4 | P0/P1 findings get inline fixes in the same packet (one commit per skill); P2/P3 logged for backlog |
| R5 | Final `evidence/audit-summary.md` rolls up counts + flagged action items |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- audit-summary.md committed with counts
- All P0 + P1 fixes shipped in skill MDs
- P2/P3 backlog logged + linked from summary
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **False positives**: some refs to "gemma" are intentionally historical (e.g., 016/004 ADR-001 "rolled back mxbai" — gemma was the baseline). Mitigation: severity classifier respects "historical" / "baseline" / "ADR" context.
- **Scope creep**: Explore agent may pull in non-skill files. Mitigation: explicit allowlist in dispatch prompt.

Dependencies:
- Agent has access to `.opencode/skills/` tree
- Agent can write to `evidence/skill-docs-audit.csv`
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to extend audit to `.opencode/agents/*.md` and `.opencode/commands/*.md` files. Default: defer to follow-on packet — agent + command MDs typically don't carry embedder default refs.
<!-- /ANCHOR:questions -->
