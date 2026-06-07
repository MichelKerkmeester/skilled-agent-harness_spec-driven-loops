---
title: "Skill README standardization"
description: "Phase parent: rewrite all 22 skill READMEs plus the skills index into the changelog/root-README narrative voice, and update the sk-doc skill-README template so new skills follow that voice from the start."
trigger_phrases:
  - "skill readme standardization"
  - "skill readme rewrite"
  - "narrative readme voice"
  - "skill readme template"
  - "skills index readme"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization"
    last_updated_at: "2026-06-07T13:05:42Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped phases 001-014 (Batch C complete: all 3 mcp skills)"
    next_safe_action: "Phase 015: rewrite sk-code-review README"
    blockers: []
    key_files:
      - "spec.md"
      - "013-mcp-click-up-readme/spec.md"
      - "014-mcp-code-mode-readme/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-bootstrap"
      parent_session_id: null
    completion_pct: 58
    open_questions: []
    answered_questions:
      - "Model role: dual-draft + merge (DeepSeek v4 Pro max and MiMo v2.5 Pro high gather as deep-context seats AND each drafts, orchestrator merges)"
      - "Style: full narrative rewrite to the changelog voice (~280-420 lines)"
      - "system-spec-kit README: restyle but keep reference-manual depth"
      - "Sequencing: lock the template in phase 001, then mass-produce all 22 + index in family batches (no per-skill sign-off gate)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Skill README standardization (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-07 |
| **Updated** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repo root `README.md` and the recent `system-spec-kit` changelogs read in one warm, human-centered narrative voice: a problem-first opener, an "At a Glance" table near the top, outcome-named section headers, sparse tables, honest trade-off notes, and a verification closer. The 22 skill READMEs do not. They are tabular reference cards with functional headers, a buried "Key Statistics" block instead of an At-a-Glance, no human-problem opener, and no verification section. They also drift in length (228 to 1084 lines) and structure, so a reader moving between skills re-learns the layout each time. New skills inherit the old shape because the sk-doc skill-README template still encodes it.

### Purpose

Rewrite all 22 skill READMEs and the `.opencode/skills/README.md` index into the changelog/root-README narrative voice, and update the sk-doc skill-README template (and any reference that describes README structure) so new skills are authored in that voice from the start. Context per skill is gathered with the `deep-context` loop and authored with DeepSeek v4 Pro and MiMo v2.5 Pro via cli-opencode, so each README is grounded in the skill's real files and capabilities rather than invented.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The sk-doc skill-README template + standard, plus a golden-example README that makes the standard concrete (phase 001).
- A full narrative rewrite of every skill's `README.md` (phases 002 to 023, one per skill).
- A narrative rewrite of the `.opencode/skills/README.md` skills index (phase 024).

### Out of Scope

- Any `SKILL.md` runtime file, skill behavior, routing logic, code, or non-README docs. This packet is documentation-only.
- The Barter mirror sync of the rewritten READMEs (a later sync per the framework-sync convention).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` | Modify | 001 | Rewrite to the narrative skeleton + writing rules + validation checklist |
| `.opencode/skills/<skill>/README.md` (×22) | Modify | 002-023 | Full narrative rewrite, one skill per phase |
| `.opencode/skills/README.md` | Modify | 024 | Rewrite the skills index in the same voice |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Phase children are created lazily as each is executed. The rows below are the planned roadmap.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-readme-template-and-standard/` | Rewrite the sk-doc skill-README template to the narrative voice; ship the sk-git golden-example README as the concrete exemplar | Complete |
| 002 | `002-cli-claude-code-readme/` | Rewrite `cli-claude-code` README | Complete |
| 003 | `003-cli-codex-readme/` | Rewrite `cli-codex` README | Complete |
| 004 | `004-cli-devin-readme/` | Rewrite `cli-devin` README | Complete |
| 005 | `005-cli-opencode-readme/` | Rewrite `cli-opencode` README | Complete |
| 006 | `006-deep-ai-council-readme/` | Rewrite `deep-ai-council` README | Complete |
| 007 | `007-deep-context-readme/` | Rewrite `deep-context` README | Complete |
| 008 | `008-deep-improvement-readme/` | Rewrite `deep-improvement` README | Complete |
| 009 | `009-deep-loop-runtime-readme/` | Rewrite `deep-loop-runtime` README | Complete |
| 010 | `010-deep-research-readme/` | Rewrite `deep-research` README | Complete |
| 011 | `011-deep-review-readme/` | Rewrite `deep-review` README | Complete |
| 012 | `012-mcp-chrome-devtools-readme/` | Rewrite `mcp-chrome-devtools` README | Complete |
| 013 | `013-mcp-click-up-readme/` | Rewrite `mcp-click-up` README | Complete |
| 014 | `014-mcp-code-mode-readme/` | Rewrite `mcp-code-mode` README | Complete |
| 015 | `015-sk-code-review-readme/` | Rewrite `sk-code-review` README | Planned |
| 016 | `016-sk-code-readme/` | Rewrite `sk-code` README | Planned |
| 017 | `017-sk-doc-readme/` | Rewrite `sk-doc` README | Planned |
| 018 | `018-sk-git-readme/` | Finalize `sk-git` README (golden example authored in 001) | Planned |
| 019 | `019-sk-prompt-small-model-readme/` | Rewrite `sk-prompt-small-model` README | Planned |
| 020 | `020-sk-prompt-readme/` | Rewrite `sk-prompt` README | Planned |
| 021 | `021-system-code-graph-readme/` | Rewrite `system-code-graph` README | Planned |
| 022 | `022-system-skill-advisor-readme/` | Rewrite `system-skill-advisor` README | Planned |
| 023 | `023-system-spec-kit-readme/` | Rewrite `system-spec-kit` README (restyle, keep reference-manual depth) | Planned |
| 024 | `024-skills-index-readme/` | Rewrite `.opencode/skills/README.md` index | Planned |

| 2 | 002-cli-claude-code-readme/ | [Phase 2 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before its README is committed.
- Phase 001 locks the template and voice. Phases 002 to 024 conform to it with no further sign-off gate.
- Phases 002 to 023 run in family batches (cli-*, deep-*, mcp-*, sk-*, system-*) with parallel fan-out inside a batch. Each child folder carries its own continuity so a crashed run resumes that skill only.
- Phase 024 runs last so the index reflects the rewritten children.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002+ | Template + golden example shipped and conformant | sk-doc `extract_structure.py` and HVR pass, `validate.sh --strict` on 001 |
| 002-023 | 024 | All 22 skill READMEs rewritten and committed | Per-phase `validate.sh --strict`, then spot-check headers across families |
| 001-readme-template-and-standard | 002-cli-claude-code-readme | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at parent level. Model role, style depth, system-spec-kit handling, and sequencing were resolved at planning (see frontmatter `answered_questions`). Per-phase questions belong to each child packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: this file is the only authored document at the parent level
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer
