---
title: "Spec: 019/002 INSTALL_GUIDE + README updates for new-user embedder choice"
description: "Document the default + alternatives + swap runbook in INSTALL_GUIDE and README"
trigger_phrases:
  - "019/002 install guide"
  - "embedder onboarding docs"
  - "cocoindex chooser section"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded docs packet"
    next_safe_action: "Author INSTALL_GUIDE + README updates after 019/001 ships"
    blockers:
      - "depends on 019/001 registry module"
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019002"
      session_id: "019-002-install-guide-updates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 019/002 INSTALL_GUIDE + README updates

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (blocked on 019/001) |
| Level | 1 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A new user clones the repo and runs CocoIndex. They get jina-code by default (post-018/001). But they don't know:
- Why jina-code is the default
- What alternatives exist
- How to switch to a smaller / larger / different-category embedder
- That MPS auto-detects, no env var needed on Apple Silicon
- What the trade-offs are (RAM, latency, quality)

Purpose: document all of this in INSTALL_GUIDE + a short README pointer, sourced from 019/001's registry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Add "Choosing an embedder" section to `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`
- Document: default (jina-code + why), alternatives table (sourced from 019/001 registry), swap runbook (env var + daemon restart), MPS auto-detect note, kill switch
- Add "Embedder choice" 1-paragraph section to `.opencode/skills/mcp-coco-index/README.md` linking to INSTALL_GUIDE
- Cross-reference 018/001 ADR-001 (when it lands) for evidence-driven default justification

Out of scope:
- MCP-tool docs (no tools to document this packet)
- mk-spec-memory side (already documented in 016 README)
- Migration guide for users on old gemma index (covered by 018/001 swap-runbook.md)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | INSTALL_GUIDE has a "Choosing an embedder" section ≤ 5 min read |
| R2 | Alternatives table shows ≥ 4 candidates with dim / RAM / disk / category / notes |
| R3 | Swap runbook covers env var + daemon restart + first-use download caveat |
| R4 | MPS auto-detect mentioned with `COCOINDEX_CODE_DEVICE=cpu` kill switch |
| R5 | README has a short "Embedder choice" paragraph + link to INSTALL_GUIDE |
| R6 | All inline model names + sbert/ prefixes match 019/001 registry exactly |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 requirements met
- A new user can pick + activate a non-default embedder in <10 min following INSTALL_GUIDE
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Doc drift from registry**: if 019/001 registry adds/changes entries, INSTALL_GUIDE rots. Mitigation: link the registry source-of-truth + note "regenerate this table from registered_embedders.py"
- **Wall-of-text**: if section becomes long, new users skim past. Mitigation: lead with "use the default — change only if you need different trade-offs"

Dependencies:
- 019/001 registry module (BLOCKING)
- 018/001 swap-runbook.md (existing, cross-referenced)
- 018/003 ADR-001 (when it lands, cite for default justification)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the alternatives table be auto-generated from registry via a script, or hand-written? Lean hand-written (small, stable list).
<!-- /ANCHOR:questions -->
