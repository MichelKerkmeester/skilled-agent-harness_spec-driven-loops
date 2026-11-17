---
title: "Feature Specification: Changelog Layout Retrofit"
description: "Rewrite every skill and release changelog into the v4.1.0.0 layout with free models, then rebuild every GitHub release body to match."
trigger_phrases:
  - "changelog layout retrofit phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Changelog Layout Retrofit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/document-standards/003-changelog-system |
| **Predecessor** | 009-release-notes-layout-default |
| **Successor** | None |
| **Handoff Criteria** | Every in-scope entry passes the shape check and the fact lock, and every release body matches its entry or its rewritten body |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 made the v4.1.0.0 layout the default for new changelogs: short bullets under short paragraphs, a linked glance table, alert boxes, folded detail and one source line per paragraph. The 1,576 skill and release changelogs written before it keep the older layout of bold lead-in bullets, one paragraph per item and inline breaking markers. The 152 GitHub releases show those older bodies, and 92 of them have no entry in the repository at all. A reader moving between releases meets two layouts.

### Purpose
Every skill and release changelog, and every GitHub release body, reads in the v4.1.0.0 layout and still records exactly what shipped.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 1,576 skill and release changelogs: 62 Skilled release entries under `.skilled/changelog/skilled/`, including the `v1+/`, `v2+/` and `v3+/` generation folders, and 1,514 entries in skill changelog folders.
- The rewrite and fact-lock tooling, adapted from the voice rewrite in `../007-changelog-voice-rewrite/scratch/`.
- The 152 GitHub release bodies. The 60 with an entry are rebuilt from it with `build_release_notes.py`. The 92 without one are rewritten from their live body.
- Writing only with free models: Hy4 Flash Free at high thinking through cli-opencode, with Devin's free `glm-5-2` as the fallback.

### Out of Scope
- The 1,652 packet-local changelogs under `specs/`. They are deprecated history.
- Moving any release tag. Only release bodies change.
- Adding a fact to an old entry. A section the layout asks for but the source never recorded, such as How It Was Checked, stays out.
- Changelog `README.md` files and templates.

### Files to Change
[Summary table of files touched across all phases — for audit trail only; per-phase detail lives in each child's plan.md]

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `scratch/*` | Create | 001-layout-tooling-and-pilot | Scope lists, briefs, driver and the fact lock |
| `.skilled/changelog/skilled/**/*.md` (62) | Modify | 002-skilled-release-line | Rewritten in place |
| `.skilled/skills/<skill>/**/changelog/**/*.md` (1,514) | Modify | 003 to 012 | Rewritten in place, one phase per skill group |
| GitHub release bodies (152) | Modify | 013-github-release-notes-sync | Rebuilt or rewritten with `gh release edit` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-layout-tooling-and-pilot/ | Adapt the driver and fact lock, then pilot on 20 entries across every family | Pending |
| 2 | 002-skilled-release-line/ | 62 Skilled release entries | Pending |
| 3 | 003-sk-doc-changelogs/ | 306 sk-doc changelogs | Pending |
| 4 | 004-cli-external-orchestration-changelogs/ | 216 cli-external-orchestration changelogs | Pending |
| 5 | 005-sk-code-changelogs/ | 205 sk-code changelogs | Pending |
| 6 | 006-mcp-tooling-changelogs/ | 171 mcp-tooling changelogs | Pending |
| 7 | 007-system-spec-kit-changelogs/ | 169 system-spec-kit changelogs | Pending |
| 8 | 008-system-deep-loop-changelogs/ | 148 system-deep-loop changelogs | Pending |
| 9 | 009-system-skill-advisor-changelogs/ | 75 system-skill-advisor changelogs | Pending |
| 10 | 010-sk-design-changelogs/ | 71 sk-design changelogs | Pending |
| 11 | 011-sk-git-changelogs/ | 54 sk-git changelogs | Pending |
| 12 | 012-small-skill-changelogs/ | 99 changelogs: sk-prompt, cli-classifier, mcp-code-mode, cli-orca and system-skilled-doctor | Pending |
| 13 | 013-github-release-notes-sync/ | Rebuild 60 release bodies from entries and rewrite the 92 without one | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-layout-tooling-and-pilot | 002-skilled-release-line | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 002-skilled-release-line | 003-sk-doc-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 003-sk-doc-changelogs | 004-cli-external-orchestration-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 004-cli-external-orchestration-changelogs | 005-sk-code-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 005-sk-code-changelogs | 006-mcp-tooling-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 006-mcp-tooling-changelogs | 007-system-spec-kit-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 007-system-spec-kit-changelogs | 008-system-deep-loop-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 008-system-deep-loop-changelogs | 009-system-skill-advisor-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 009-system-skill-advisor-changelogs | 010-sk-design-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 010-sk-design-changelogs | 011-sk-git-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 011-sk-git-changelogs | 012-small-skill-changelogs | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
| 012-small-skill-changelogs | 013-github-release-notes-sync | The phase validates and its list shows no failed file | `validate.sh --strict` on the phase, then the driver state file |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- How many dispatches run at once. The pilot measures one dispatch's time and the gateway's limits before the full run.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
