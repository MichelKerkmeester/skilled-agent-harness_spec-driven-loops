---
title: "Feature Specification: Skill Anchor + TOC Removal"
description: "Remove Table of Contents blocks and HTML comment anchors from all skill docs, and update sk-doc standards/templates/config so they are not reintroduced."
trigger_phrases:
  - "skill anchor toc removal"
  - "remove table of contents from skills"
  - "remove anchors from skill docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All four phases complete; cleanup verified"
    next_safe_action: "Commit the change set (on request)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-117-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Anchor scope: remove both TOC blocks AND ANCHOR comment delimiters"
      - "File scope: comprehensive — references/, assets/, feature_catalog/, manual_testing_playbook/, and root docs"
      - "Execution: deterministic script primary; CLI-Devin/SWE-1.6 for edge cases + verification"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill Anchor + TOC Removal

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | skilled-agent-orchestration/116-deep-skill-evolution |
| **Successor** | None |
| **Handoff Criteria** | All in-scope skill docs free of TOC blocks + comment anchors; sk-doc standards/templates/config no longer reintroduce them; verification proves zero residue |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill documentation under `.opencode/skills/` has accumulated navigational scaffolding the user
wants removed: `## TABLE OF CONTENTS` blocks (384 in-scope files) and `ANCHOR:name` HTML
comment delimiters (~688 in-scope files). A naive delete would regress because the sk-doc standards,
templates, and `template_rules.json` config currently mandate/allow these — cleaned docs would be
re-flagged by `validate_document.py` or regenerated with TOCs.

### Purpose
Remove TOC blocks and comment anchors from all in-scope skill markdown, AND flip the source of
truth (standards + templates + validator config) first so the removal is durable and future
generation stays clean.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All markdown under `.opencode/skills/**`: `references/`, `assets/` (incl. sk-doc doc templates), `feature_catalog/`, `manual_testing_playbook/`, and root docs (`README.md`, `ARCHITECTURE.md`, `SKILL.md`, etc.).
- sk-doc standards (`core_standards.md`), creation references, and `template_rules.json` `tocRequired` flags.
- `.opencode/commands/create/feature-catalog.md` and `.opencode/commands/create/testing-playbook.md` TOC requirements.

### Out of Scope
- `.opencode/skills/system-spec-kit/templates/**` — spec-folder generation templates whose `ANCHOR` markers are a consumed generation standard (carved out, preserved).
- All non-markdown source files (`.py`, `.js`, `.ts`, `.sh`) — anchor-parsing/emitting code is untouched.
- Spec instances/research artifacts under `.opencode/specs/**` and `specs/**` (except this 117 packet).
- The `.opencode/specs/skilled-agent-orchestration/` mirror.

### Files to Change
Per-phase detail lives in each child's plan.md. Summary:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `sk-doc/assets/template_rules.json` | Modify | 001 | Flip `tocRequired` false for readme/install_guide/playbook |
| `sk-doc/references/global/core_standards.md` | Modify | 001 | TOC policy → Never for all types |
| `sk-doc/assets/**` templates (5) | Modify | 001 | Strip TOC + anchors from doc templates |
| `sk-doc/references/*creation.md` + `commands/create/*.md` | Modify | 001 | Remove TOC mandate from prose/contracts |
| `.opencode/skills/**/*.md` (~384 TOC, ~688 anchor) | Modify | 002, 003 | Bulk-remove TOC blocks + comment anchors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-standards-templates-config/` | Flip standards/templates/config first (regression prevention) | Complete |
| 2 | `002-toc-removal/` | Bulk-remove `## TABLE OF CONTENTS` blocks across in-scope files | Complete |
| 3 | `003-anchor-comment-removal/` | Bulk-remove `ANCHOR` comment delimiters across in-scope files | Complete |
| 4 | `004-verification-reconciliation/` | Prove zero residue, validate, reconcile completion metadata | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phase 001 (standards) MUST complete before 002/003 (bulk edits) to prevent regression
- Use `/spec_kit:resume specs/skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal/[NNN-phase]/` to resume

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `tocRequired:false` set; standards/templates stripped | `validate_document.py` exit 0 on a sample README |
| 002 | 003 | Zero `## TABLE OF CONTENTS` in scope | `rg -l -i "table of contents"` → only carve-outs |
| 003 | 004 | Zero `ANCHOR` in scope | `rg -l -- "<!-- ANCHOR"` → only spec-kit/templates |
| 004 | done | All checks green; metadata reconciled | `validate.sh --strict` on packet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. Scope decisions resolved at planning (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
