---
title: "Spec: 021/002 Root README update for 016-019 architecture"
description: "Refresh root README.md with current embedder defaults + architecture summary + link to canonical pluggability narrative"
trigger_phrases:
  - "021/002 root readme"
  - "root readme refresh"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch markdown agent (Sonnet) to update README"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021002"
      session_id: "021-002-root-readme-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 021/002 Root README update

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned |
| Level | 1 |
| Owner | markdown agent (Sonnet) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Repo root `README.md` (if it exists) likely doesn't mention the 016-019 changes: pluggable embedder architecture, jina-v3 for mk-spec-memory, jina-code for CocoIndex, rescue layer default-on, MPS auto-detect on Apple Silicon. New visitors landing on the repo should see the current architecture without spelunking.

Purpose: refresh root README with current state + link to canonical embedder-pluggability narrative.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` (root)
- 1-paragraph "Embedder architecture" section (or absorb into existing intro)
- Cross-links to mcp-coco-index INSTALL_GUIDE + system-spec-kit pluggability narrative (when 021/003 ships)
- Update any "powered by gemma"-style claims to current defaults

Out of scope:
- Sub-project READMEs (021/001 covers those)
- CHANGELOG entries (historical)
- root AGENTS.md / CLAUDE.md
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Root README mentions both MCPs' current embedder defaults |
| R2 | Links to canonical pluggability narrative (021/003 output) |
| R3 | No stale "gemma is default" claims remain |
| R4 | Refresh stays minimal — keep README scanable |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 4 requirements met
- README diff stays under 100 LOC unless current README is severely outdated
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Root README may not exist** — if not, ship a minimal one
- **Agent over-rewrites** — scope creep into restructuring. Mitigation: dispatch prompt limits to "minimal diff for accuracy + linkage"

Dependencies:
- 021/003 narrative (cross-reference target — can land first OR concurrently)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If root README does NOT exist, do we ship a brand-new one? Default: yes, minimal viable (overview + cross-links).
<!-- /ANCHOR:questions -->
