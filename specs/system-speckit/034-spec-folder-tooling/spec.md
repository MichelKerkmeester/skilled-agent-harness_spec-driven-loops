---
title: "Feature Specification: Spec folder tooling: canonical root, numbering, track roots and archive"
description: "Create.sh, archive.sh and the track root lists keep packets where they live."
trigger_phrases:
  - "spec folder tooling"
  - "create.sh canonical specs root"
  - "track root children"
  - "track aware archive"
  - "phase aware archive"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling"
    last_updated_at: "2026-10-06T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Group the 5 packets under one phase parent"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
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

# Feature Specification: Spec folder tooling: canonical root, numbering, track roots and archive

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None, track root `specs/system-speckit/` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates strict at its slot, every live reference points at the child path and the timeline names each packet's first and last commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scripts that create, number and archive spec packets disagreed with where packets live. After the back-link to the specs folder was removed, create.sh wrote new packets into a stray tree nobody reads. Without a track it numbered a new packet from its short name alone, so differently named packets all started at 001. Fifteen of eighteen track roots listed children that did not match the packets on disk. archive.sh moved a track packet or a phase out of its own track or parent and refreshed no list.

### Purpose
Make create.sh, archive.sh and the track root lists agree with the tree: new packets written under the canonical specs root, numbers counted from the highest number in use, track-root children equal to the packets on disk with a gate that blocks a push that breaks it, and archive and restore that keep a packet inside its track or a phase inside its parent.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Packet creation under the canonical specs root
- Root numbering that ignores the track
- Track-root children lists and the push-time check
- Track-aware and phase-aware archive and restore

### Out of Scope
- Spec folder content templates
- The validator rule set
- Goal and continuity writers

### Files to Change
Each child keeps its own plan and file list. This table is the audit trail of the phases.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-create-canonical-specs-root/` | Existing packet | 001 | Write new packets under the canonical specs root |
| `002-root-numbering-without-track/` | Existing packet | 002 | Number root packets from the highest number in use |
| `003-track-root-children/` | Existing packet | 003 | Keep track-root children equal to the packets on disk |
| `004-track-aware-archive/` | Existing packet | 004 | Archive and restore a packet inside its own track |
| `005-phase-aware-archive/` | Existing packet | 005 | Archive and restore a phase inside its parent |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-create-canonical-specs-root/` | Write new packets under the canonical specs root | Complete |
| 2 | `002-root-numbering-without-track/` | Number root packets from the highest number in use | Complete |
| 3 | `003-track-root-children/` | Keep track-root children equal to the packets on disk | Complete |
| 4 | `004-track-aware-archive/` | Archive and restore a packet inside its own track | Complete |
| 5 | `005-phase-aware-archive/` | Archive and restore a phase inside its parent | Complete |
| 6 | `006-series-parent-rule-and-sibling-listing/` | Name the series parent and list recent packets before a new one | Complete |
| 7 | `007-series-parent-review-and-hardening-research/` | Review Phase 6 and research how to harden it | Complete |
| 8 | `008-series-parent-review-fixes/` | Fix the Phase 7 review findings | Complete |
| 9 | `009-gate-3-menu-series-parent/` | Name the series parent in the Gate 3 menu | Complete |
| 10 | `010-trigger-index-ci-rebuild/` | Rebuild the trigger index in CI after a push | In Progress |
| 11 | `011-template-phrase-census-and-cleanup/` | Report and clean the spec and acceptance criteria template phrases | Complete |
| 12 | `012-template-phrase-cleanup-round-two/` | Clean the remaining templates' phrases, partial lists and cut-off phrases | Complete |
| 13 | `013-corpus-wide-validation-repair/` | Repair every live and archived packet until the corpus passes strict validation | Complete |
| 14 | `014-spec-auto-healing-research/` | Research how to harden these changes and heal old-format specs automatically | Complete |
| 15 | `015-archive-current-location-and-ignored-files/` | Keep archived packets on their current path through moves, and skip git-ignored files in the index | Complete |
| 16 | `016-research-recommendations/` | Plan each of the 16 research recommendations as its own child phase | Complete |
| 17 | `017-heal-cli-and-compat-yaml-simplification/` | Apply the phase 16 overengineering research: pin the refusal order, drop the lane-mode CLI's `--mode` and `--json`, merge the compat action's failed-step fields | Complete |
| 18 | 018-epic-docs-alignment/ | Bring the playbooks, feature catalogs, READMEs, doctor docs and release changelogs in line with the epic's tooling | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-create-canonical-specs-root` | `002-root-numbering-without-track` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `002-root-numbering-without-track` | `003-track-root-children` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `003-track-root-children` | `004-track-aware-archive` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `004-track-aware-archive` | `005-phase-aware-archive` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `005-phase-aware-archive` | `006-series-parent-rule-and-sibling-listing` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `006-series-parent-rule-and-sibling-listing` | `007-series-parent-review-and-hardening-research` | Phase 6 is committed, so the review has a fixed target | `validate.sh --strict` passes on each child |
| `007-series-parent-review-and-hardening-research` | `008-series-parent-review-fixes` | The review report lists the findings to fix | `validate.sh --strict` passes on each child |
| `008-series-parent-review-fixes` | `009-gate-3-menu-series-parent` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `009-gate-3-menu-series-parent` | `010-trigger-index-ci-rebuild` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `010-trigger-index-ci-rebuild` | `011-template-phrase-census-and-cleanup` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `011-template-phrase-census-and-cleanup` | `012-template-phrase-cleanup-round-two` | Phase 11's tools and phrase lists exist to extend | `validate.sh --strict` passes on each child |
| `012-template-phrase-cleanup-round-two` | `013-corpus-wide-validation-repair` | Phase 12's cleanup tool exists to run over the archive | `validate.sh --strict` passes on each child |
| `013-corpus-wide-validation-repair` | `014-spec-auto-healing-research` | Phase 13's repair is the change set the research analyzes | `validate.sh --strict` passes on each child |
| `014-spec-auto-healing-research` | `015-archive-current-location-and-ignored-files` | Phase 14 recommends the archive fix and the operator picks current-location semantics | `validate.sh --strict` passes on each child |
| `015-archive-current-location-and-ignored-files` | `016-research-recommendations` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `016-research-recommendations` | `017-heal-cli-and-compat-yaml-simplification` | Phase 16 is shipped and its research names the four changes | `validate.sh --strict` passes on each child |
| 017-heal-cli-and-compat-yaml-simplification | 018-epic-docs-alignment | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Timeline**: See `timeline.md` for the order the phases shipped in and the number map
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
