---
title: "Feature Specification: Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences"
description: "Every skill changelog and Skilled release entry is rewritten to the Human Voice Rules, with shorter sentences and the same facts."
trigger_phrases:
  - "changelog voice rewrite phase parent spec"
  - "rewrite changelogs to human voice"
  - "shorter changelog sentences"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite"
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

# Feature Specification: Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/document-standards/003-changelog-system |
| **Predecessor** | 006-remove-release-size-limit |
| **Successor** | None |
| **Handoff Criteria** | Every phase child validates strict, and every file in `scratch/scope-list.txt` passes the sentence rules and the voice scan or is recorded as an exception |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog standard caps a sentence at 22 words and an entry at 10 words a sentence on average. Of the 1,573 skill and release changelogs, 1,322 break one of those two rules. Their sentences average 12.8 words, and 3,756 sentences run past 22. 55 files also carry a word the Human Voice Rules ban. A reader has to work through long, dense sentences to learn what a release changed. The Human Voice Rules also forbid editing a released changelog, so no voice pass could fix them until that rule changes.

### Purpose
Every skill and release changelog reads in short, plain sentences that pass the sentence rules and the voice scan, and still records exactly what shipped.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 1,571 files in `scratch/scope-list.txt`: every skill changelog under `.skilled/skills/**/changelog/` and every Skilled release entry under `.skilled/changelog/skilled/`, including the `v1+/`, `v2+/` and `v3+/` generation folders. Two `system-spec-kit/templates/changelog/` files were dropped from the original 1,573 on 2026-11-15, because they are templates and not release entries. The operator decided this.
- An amendment to the voice rule that forbids editing a released changelog, so an operator-approved retrofit recorded in a spec packet may edit one.
- The rewrite and fact-check tooling, adapted from the earlier skill changelog retrofit.
- The GitHub release bodies of the Skilled releases whose entry changes, synced with `gh release edit`.

### Out of Scope
- Packet-local changelogs under `specs/`. They are deprecated and sit inside shipped spec packets.
- Moving any release tag. Only the release bodies change.
- Shape rules other than the two sentence rules, such as the spec-folder line label and a missing How It Was Checked section. Fixing those would add facts to old entries. A rewrite must not add a new failure of them.
- Changelog `README.md` files, the changelog templates and the design-style bundle named `changelog`.
- Changes to sk-create-changelog's own contract. Its NEVER rule 2, never overwrite an existing changelog, governs creation. This packet overwrites on purpose, as the operator asked, and records that here, as the earlier retrofit did.

### Files to Change
[Summary table of files touched across all phases — for audit trail only; per-phase detail lives in each child's plan.md]

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Modify | 001-voice-rule-tooling-and-pilot | Lets an operator-approved retrofit edit a released changelog |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | Modify | 001-voice-rule-tooling-and-pilot | Same carve-out in NEVER rule 2 |
| `scratch/*` | Create | 001-voice-rule-tooling-and-pilot | Scope list, measurement, briefs and driver |
| `.skilled/changelog/skilled/**/*.md` (62) | Modify | 002-skilled-release-line | Rewritten in place |
| `.skilled/skills/<skill>/**/changelog/**/*.md` (1,511) | Modify | 003 to 012 | Rewritten in place, one phase per skill group |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-voice-rule-tooling-and-pilot/ | Amend the voice rule, adapt the rewrite and fact-check tooling, and pilot it on 20 files | Complete |
| 2 | 002-skilled-release-line/ | 62 Skilled release entries, then sync the 52 published release bodies | Complete |
| 3 | 003-sk-doc-changelogs/ | 298 sk-doc changelogs | Complete |
| 4 | 004-system-spec-kit-changelogs/ | 167 system-spec-kit changelogs | Complete |
| 5 | 005-sk-code-changelogs/ | 204 sk-code changelogs | Pending |
| 6 | 006-cli-external-orchestration-changelogs/ | 212 cli-external-orchestration changelogs | Pending |
| 7 | 007-system-deep-loop-changelogs/ | 160 system-deep-loop changelogs | Pending |
| 8 | 008-mcp-tooling-changelogs/ | 171 mcp-tooling changelogs | Pending |
| 9 | 009-system-skill-advisor-changelogs/ | 74 system-skill-advisor changelogs | Pending |
| 10 | 010-sk-design-changelogs/ | 71 sk-design changelogs | Pending |
| 11 | 011-sk-git-changelogs/ | 54 sk-git changelogs | Pending |
| 12 | 012-small-skill-changelogs/ | 98 changelogs of sk-prompt, cli-classifier, mcp-code-mode, cli-orca and system-skilled-doctor | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-voice-rule-tooling-and-pilot | 002-skilled-release-line | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 002-skilled-release-line | 003-sk-doc-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 003-sk-doc-changelogs | 004-system-spec-kit-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 004-system-spec-kit-changelogs | 005-sk-code-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 005-sk-code-changelogs | 006-cli-external-orchestration-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 006-cli-external-orchestration-changelogs | 007-system-deep-loop-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 007-system-deep-loop-changelogs | 008-mcp-tooling-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 008-mcp-tooling-changelogs | 009-system-skill-advisor-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 009-system-skill-advisor-changelogs | 010-sk-design-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 010-sk-design-changelogs | 011-sk-git-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
| 011-sk-git-changelogs | 012-small-skill-changelogs | Every file in the phase list passes or is restored, with each restore recorded | `validate.sh --strict` on the finished phase, then `measure-voice.py` on its list |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which model runs the rewrite and which runs the fact check? Decision: DeepSeek Flash at high effort through Mistral Vibe rewrites, and `gpt-6-luna` at `xhigh` on the `fast` tier through cli-codex checks facts. The high effort is a temporary, operator-approved exception to the Vibe roster's `max` pin, set per dispatch and never in `.vibe/config.toml`.
- Do the 55 files with hard blockers include entries that only name a term they removed? Phase 001 lists each one and records it as an exception or a fix.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
