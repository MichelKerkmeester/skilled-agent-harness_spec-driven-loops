---
title: "Feature Specification: 009 Skill Frontmatter Alignment (Phase Parent)"
description: "Phase parent for standardizing references/ and assets/ frontmatter across all 21 public-repo skills after a benefit investigation fixes the canonical contract."
trigger_phrases:
  - "skill frontmatter alignment"
  - "reference frontmatter standardization"
  - "trigger phrases in skill references"
  - "frontmatter benefit investigation"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment"
    last_updated_at: "2026-06-11T12:25:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All 22 phases complete; full corpus 355/355 contract-valid"
    next_safe_action: "Live daemon matchedDocs smoke after session cycle (145 T025)"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-skill-frontmatter-alignment-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator picked Option B: full block on all references/assets; skill advisor is the sole consumer; spec memory never indexes skill docs."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md - these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: 009 Skill Frontmatter Alignment (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/000-release-cleanup |
| **Predecessor** | 008-agents-md-alignment |
| **Successor** | None |
| **Handoff Criteria** | 001 fixes the canonical contract; each skill child then validates strictly with zero nonconforming docs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill reference and asset frontmatter has drifted into three incompatible practices: 103 of 369 docs under `.opencode/skills/*/references/` and `.opencode/skills/*/assets/` carry a detailed memory-style block (`trigger_phrases`, `importance_tier`, `contextType`), roughly 255 carry `title` + `description` only, and 11 carry no frontmatter at all. The detailed block has no runtime consumer on these doc types, and sk-doc's own guidance contradicts itself about what references should carry.

### Purpose
Fix one canonical frontmatter contract for skill references and assets (decided after the 001 investigation), then apply it skill by skill so guidance, templates, and practice agree across all 21 public-repo skills.

**Decided contract (operator, 2026-06-11 — Option B, advisor-as-consumer):** every reference/asset doc (READMEs exempt) carries the full block — `title`, `description`, `trigger_phrases` (3-8), `importance_tier` (constitutional|critical|important|normal|temporary|deprecated), `contextType` (planning|research|implementation|general). The skill advisor harvests this per-doc frontmatter as flag-gated routing signal with doc-level `matched_docs` pointers; Spec Kit Memory NEVER indexes skill docs (hard boundary).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Benefit investigation: what the detailed block buys, why it is unevenly distributed, what sk-doc skill-creation guidance prescribes (001).
- Canonical contract decision input for the operator, with a consumer audit as evidence.
- Per-skill frontmatter normalization of `references/**/*.md` and `assets/**/*.md` for all 21 skills (002-022).
- Updating the sk-doc frontmatter contract docs if the decided contract contradicts them (executed inside 016-sk-doc).

### Out of Scope
- Doc body content changes - frontmatter blocks only.
- SKILL.md, README.md, feature_catalog/, and manual_testing_playbook/ frontmatter - those carry their own template contracts.
- graph-metadata.json `derived.trigger_phrases` curation - owned by the skill-advisor registration flow.
- Building the advisor doc-harvest consumer - decided and in flight, but built in its own skilled-agent-orchestration packet (code change in system-skill-advisor/mcp_server), not in this docs-only subtree.
- Any Spec Kit Memory indexing of skill docs - permanently rejected by operator directive; the memory path gate stays closed.

### Files to Change
Planned future implementation scope for audit only. Per-phase detail lives in each child folder.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/<skill>/references/**/*.md` | Future Modify | 002-022 (one child per skill) | Normalize frontmatter to the canonical contract |
| `.opencode/skills/<skill>/assets/**/*.md` | Future Modify | 002-022 (one child per skill) | Normalize frontmatter to the canonical contract |
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | Future Modify | 016-sk-doc | Reconcile the knowledge-file frontmatter rule with the decided contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-frontmatter-benefit-investigation/ | Evidence-based investigation: who consumes the detailed frontmatter block, why 103 of 369 docs have it and the rest do not, what sk-doc skill creation prescribes, and a contract recommendation. | Complete |
| 2 | 002-cli-claude-code/ | Apply the canonical contract to cli-claude-code (0/4 references, 0/2 assets carry the detailed block). | Complete |
| 3 | 003-cli-codex/ | Apply the canonical contract to cli-codex (1/5 references, 0/2 assets carry the detailed block). | Complete |
| 4 | 004-cli-opencode/ | Apply the canonical contract to cli-opencode (0/7 references, 0/2 assets carry the detailed block). | Complete |
| 5 | 005-deep-ai-council/ | Apply the canonical contract to deep-ai-council (15/15 references, 2/3 assets carry the detailed block). | Moved to `system-deep-loop/053-skill-frontmatter-standardization/001-deep-ai-council-frontmatter-alignment/` |
| 6 | 006-deep-context/ | Apply the canonical contract to deep-context (0/10 references, 0/1 assets carry the detailed block). | Complete |
| 7 | 007-deep-improvement/ | Apply the canonical contract to deep-improvement (17/23 references, 8/11 assets carry the detailed block). | Moved to `system-deep-loop/053-skill-frontmatter-standardization/002-deep-improvement-frontmatter-alignment/` |
| 8 | 008-deep-loop-runtime/ | Apply the canonical contract to deep-loop-runtime (4/4 references carry the detailed block; no assets). | Moved to `system-deep-loop/053-skill-frontmatter-standardization/003-deep-loop-runtime-frontmatter-alignment/` |
| 9 | 009-deep-research/ | Apply the canonical contract to deep-research (0/13 references, 0/2 assets carry the detailed block). | Moved to `system-deep-loop/053-skill-frontmatter-standardization/004-deep-research-frontmatter-alignment/` |
| 10 | 010-deep-review/ | Apply the canonical contract to deep-review (3/10 references, 0/2 assets carry the detailed block). | Moved to `system-deep-loop/053-skill-frontmatter-standardization/005-deep-review-frontmatter-alignment/` |
| 11 | 011-mcp-chrome-devtools/ | Apply the canonical contract to mcp-chrome-devtools (0/3 references carry the detailed block; no assets). | Complete |
| 12 | 012-mcp-click-up/ | Apply the canonical contract to mcp-click-up (3/3 references carry the detailed block; no assets). | Complete |
| 13 | 013-mcp-code-mode/ | Apply the canonical contract to mcp-code-mode (0/5 references, 0/2 assets carry the detailed block). | Complete |
| 14 | 014-sk-code/ | Apply the canonical contract to sk-code (12/68 references, 7/27 assets carry the detailed block). | Complete |
| 15 | 015-sk-code-review/ | Apply the canonical contract to sk-code-review (0/10 references carry the detailed block; no assets). | Complete |
| 16 | 016-sk-doc/ | Apply the canonical contract to sk-doc (2/14 references, 7/25 assets) AND reconcile frontmatter_templates.md with the decided contract. | Complete |
| 17 | 017-sk-git/ | Apply the canonical contract to sk-git (0/7 references, 0/3 assets carry the detailed block). | Complete |
| 18 | 018-sk-prompt/ | Apply the canonical contract to sk-prompt (0/2 references, 0/3 assets carry the detailed block). | Complete |
| 19 | 019-sk-prompt-models/ | Apply the canonical contract to sk-prompt-models (0/12 references, 0/2 assets carry the detailed block). | Complete |
| 20 | 020-system-code-graph/ | Apply the canonical contract to system-code-graph (6/7 references carry the detailed block; no assets). | Complete |
| 21 | 021-system-spec-kit/ | Apply the canonical contract to system-spec-kit (2/41 references, 0/4 assets carry the detailed block). | Complete |

Phase 021-system-skill-advisor (canonical contract for system-skill-advisor, 14/15 references) moved to `system-skill-advisor/010-skill-advisor-frontmatter-alignment/` on 2026-07-07.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Phases 002-022 are mutually independent once 001's contract decision is recorded; they may run in any order or in parallel sessions

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-frontmatter-benefit-investigation | 002-022 (any skill child) | Canonical contract decided by operator and recorded in 001 implementation-summary.md | strict validation for 001-frontmatter-benefit-investigation |
| any skill child | next skill child | Prior phase validates and updates its handoff notes | strict validation for the prior skill child |
<!-- /ANCHOR:phase-map -->
