---
title: "Feature Specification: Skilled release changelog: the framework release line and findable changelogs"
description: "Gives the Skilled framework a release-notes line of its own apart from the system-spec-kit changelog, then makes every changelog in the repository as findable and searchable as a spec document."
trigger_phrases:
  - "skilled release changelog"
  - "framework release line"
  - "changelog findability"
  - "searchable changelogs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog"
    last_updated_at: "2026-09-27T15:13:12Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Both phases built and verified, phase 1 pushed and phase 2 being committed"
    next_safe_action: "None once phase 2's commits and the index rebuild are pushed"
    blockers: []
    key_files:
      - "specs/sk-doc/061-skilled-release-changelog/001-release-line-split/implementation-summary.md"
      - "specs/sk-doc/061-skilled-release-changelog/002-changelog-findability/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: Skilled release changelog: the framework release line and findable changelogs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | None - this is a top-level phase parent |
| **Parent Packet** | sk-doc/061-skilled-release-changelog |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | The framework release notes have their own line under `.skilled/changelog/skilled/`, and system-spec-kit writes its own changelog again. Every changelog in the repository can be found by Gate 1 and `/speckit:search` the way a spec document can, and the tools and docs around changelogs match what ships |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit changelog was serving as the repository's global release notes. Its v4 entries describe the whole framework, the skill's own history stops at 3.9.0.0 and sk-create-changelog treats that folder as the home of the release notes. Changelogs are also hard to find: of the 544 changelog files under `.skilled/skills/`, 52 carry `trigger_phrases`, so Gate 1's trigger index and `/speckit:search` reach few of them, while spec documents carry the metadata that makes them findable.

### Purpose
Give the Skilled framework one release line of its own, restore system-spec-kit's component changelog, and then make every changelog as findable and searchable as a spec document, both the entries sk-create-changelog writes from now on and the ones already in the repository. A last phase brings the tools and docs next to that work in line with it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The framework release line at `.skilled/changelog/skilled/`, one entry per Skilled release
- system-spec-kit's own component entries from 4.0.0.0 on
- sk-create-changelog support for the release line, then search metadata in every entry it writes
- A search-metadata pass over every existing changelog in the repository
- Retrieval coverage, so the trigger index and `/speckit:search` reach changelogs
- The surfaces next to that work: hub resolution in `/create:changelog`, the validator's type detection, the nested generator's escaping and the docs, catalogs and playbooks that describe them

### Out of Scope
- Changelogs inside `.worktrees/` checkouts, which belong to other sessions
- The Barter coder copy of the framework, which is a separate tree
- Restoring the `00--opencode-environment` history, which was deleted before this work

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/changelog/skilled/**` | Create | 001-release-line-split | Framework release notes, one entry per Skilled release |
| `.skilled/skills/system-spec-kit/changelog/v4.*.md` | Create | 001-release-line-split, 002-changelog-findability, 003-adjacent-alignment | The skill's own entries, then one each for the nested generator's phrase and its escaping |
| `.skilled/skills/sk-doc/sk-create-changelog/**`, `.skilled/commands/create/**` | Modify | 001-release-line-split, 002-changelog-findability, 003-adjacent-alignment | Release-line support, then search metadata in the output, then hub resolution |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/**` | Modify | 001-release-line-split | The release line as a corpus root |
| `.skilled/skills/system-spec-kit/templates/changelog/*.md`, `runtime/cli/spec-folder/nested-changelog.ts`, its vitest and `references/workflows/nested-changelog.md` | Modify | 002-changelog-findability, 003-adjacent-alignment | The nested generator writes an identity phrase in place of the template defaults, then escapes what it pastes |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `shared/assets/template-rules.json`, `scripts/tests/test_changelog_validator.py`, `changelog/` | Modify, Create | 002-changelog-findability, 003-adjacent-alignment | A frontmatter check for changelog entries, then type detection by folder, and the hub's entries for both |
| `.skilled/changelog/skilled/**/v*.md`, `.skilled/skills/**/changelog/**/v*.md`, `specs/**/changelog/**/changelog-*.md` | Modify | 002-changelog-findability | Search metadata on every existing entry, frontmatter only |
| `README.md`, `PUBLIC-RELEASE.md`, `.skilled/skills/sk-git/references/finish-workflows.md` | Modify | 001-release-line-split | References to the release line |
| `.skilled/skills/sk-doc/feature-catalog/**`, `sk-create-frontmatter/assets/frontmatter-templates.md`, system-spec-kit `feature-catalog/**`, `manual-testing-playbook/**` and `runtime/cli/retrieval/lib/README.md` | Modify, Create | 003-adjacent-alignment | Catalog entries, a playbook scenario and reference docs that describe the changelog work |
| `.opencode/SYNC.md`, `.opencode/README.md`, `.skilled/changelog/skilled/v4.0.0.2.md`, two packets' `graph-metadata.json` | Modify | 003-adjacent-alignment | Rows for links that exist, the release's Changelogs section and `parent_id` as JSON null |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-release-line-split/ | Give the Skilled release notes their own line under `.skilled/changelog/skilled/`, restore system-spec-kit's component changelog, teach sk-create-changelog the release line and keep Gate 1 finding the notes | Complete |
| 2 | 002-changelog-findability/ | Make every changelog as findable and searchable as a spec document: search metadata in what sk-create-changelog writes, the same metadata on every existing changelog, and retrieval coverage to match | Complete |
| 3 | 003-adjacent-alignment/ | Bring the surfaces next to the changelog work in line with it: hub resolution in `/create:changelog`, the validator's type detection, the nested generator's escaping and the docs, catalogs and playbooks that describe them | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-release-line-split | 002-changelog-findability | Phase 1's edits to sk-create-changelog, the retrieval roots and the moved notes have landed, so phase 2 changes those files on a stable base | Phase 1's lanes have stopped and `validate.sh --strict` passes on `001-release-line-split` |
| 002-changelog-findability | 003-adjacent-alignment | Phase 2's entries, validator check and generator phrase have landed, so phase 3 fixes the surfaces next to them on a stable base | Phase 2 is committed and pushed, and `validate.sh --strict` passes on `002-changelog-findability` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. Phase 2's research answered both questions this packet opened with. A changelog entry needs the same five keys a spec document carries, `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`, because retrieval reads only the entry's own frontmatter. The trigger index has no byte budget, and the limit it enforces is cold lookup time, 200 ms at p95 and max. A trial with every entry completed grew the index by 7.3 percent and stayed under 110 ms.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
