---
title: "Feature Specification: doc-divider-sweep-and-sk-prompt-cleanup"
description: "Add missing H2 section dividers across the 5 cli skill reference and asset docs to match the sk-doc template, and finish the phase-013 card relocation by scrubbing stale cli_prompt_quality_card references from sk-prompt SKILL.md."
trigger_phrases:
  - "divider sweep"
  - "h2 section divider"
  - "sk-prompt card reference cleanup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/014-doc-divider-sweep-and-sk-prompt-cleanup"
    last_updated_at: "2026-06-03T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dividers applied + verified; sk-prompt SKILL.md scrubbed"
    next_safe_action: "Validate then commit phase 014"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/cli-claude-code/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Divider scope = the 5 cli skills only (hub/sk-prompt extras reported, not swept here)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: doc-divider-sweep-and-sk-prompt-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-card-relocation-and-guard |
| **Successor** | None |
| **Handoff Criteria** | Every non-first H2 in the 5 cli skills' reference/asset docs is preceded by a `---` divider; sk-prompt SKILL.md carries no stale card references and renumbers cleanly; guard green; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 14 (cleanup) of spec 130. Two loose ends remained after the 010-013 alignment + relocation
work. First, many cli skill reference/asset docs still lacked the sk-doc `---` separator between
their numbered H2 sections (phase 012 aligned a named subset; the rule applies repo-wide). Second,
phase 013 moved the canonical CLI card to the hub but left four stale references inside
`sk-prompt/SKILL.md` (a prose mention, a broken Core-References link, an entire FAST-PATH ASSET
section, and a broken entry in the resource list).

**Scope Boundary**: divider insertion across the 5 cli skills' `references/` + `assets/` `*.md`
files, and the four card references in `sk-prompt/SKILL.md`. Divider edits add blank/`---` lines
only; no prose changes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc template requires a standalone `---` thematic break before every H2 section except the
first. 25 of the 42 reference/asset docs across the 5 cli skills were missing one or more such
dividers (188 gaps total), so the docs read as one unbroken wall and drift from the template.
Separately, `sk-prompt/SKILL.md` still referenced `cli_prompt_quality_card.md` after the phase-013
relocation, including a broken `./assets/` link and a whole section describing an asset that no
longer lives there.

### Purpose
Bring the cli skill docs into divider compliance with the sk-doc template, and complete the 013
relocation so `sk-prompt/SKILL.md` is accurate and link-clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Insert missing `---` dividers before every non-first H2 in the affected `*.md` files under
  `cli-{claude-code,codex,devin,gemini,opencode}/{references,assets}/`.
- `sk-prompt/SKILL.md`: reword the §1 prose card mention; drop the broken Core-References card link;
  remove the §8 FAST-PATH ASSET section and renumber §9/§10 → §8/§9; drop the card from the §9
  resource list. Version bump 2.1.0.0 → 2.1.1.0 + changelog.

### Out of Scope
- The 3 cli reference docs carrying unrelated pre-existing WIP content edits (left for owner review;
  dividers in them deferred to that commit) - scope lock on adjacent uncommitted work.
- The sk-prompt manual-testing-playbook's dangling card paths - reported as a follow-up, not swept here.
- Divider gaps in `sk-prompt` / `sk-prompt-models` docs - outside the user-named cli set.
- Any H2 renumbering or casing changes in the cli docs - divider-only edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-*/references/*.md`, `cli-*/assets/*.md` (22 clean files) | Modify | Insert `---` before non-first H2s |
| `sk-prompt/SKILL.md` | Modify | Scrub 4 stale card refs; renumber §8/§9; version 2.1.1.0 |
| `sk-prompt/changelog/v2.1.1.0.md` | Create | Record the card-reference scrub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dividers added | Every non-first H2 in the swept cli docs is preceded by a blank-padded `---`; re-scout reports 0 gaps |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Content untouched | Each swept file's non-blank/non-divider content is byte-identical to HEAD (only `---`/blank lines added) |
| REQ-003 | sk-prompt scrubbed | No `cli_prompt_quality_card` reference remains in `sk-prompt/SKILL.md`; sections renumber 1-9 with no gaps or dupes; no broken links |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Divider re-scout over the 5 cli skills reports 0 gaps.
- **SC-002**: Content-skeleton diff (non-blank/non-`---` lines) is empty for every swept file vs HEAD.
- **SC-003**: Adversarial per-skill divider audit (workflow) returns PASS for all 5 skills.
- **SC-004**: `sk-prompt/SKILL.md` is card-reference-free and renumbers cleanly; `validate.sh --recursive --strict` exit 0; card-sync guard green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A divider lands inside a code fence or before a first H2 | Med | Fence-aware deterministic fixer; dry-run audit of all 188 insertions; adversarial workflow re-audit |
| Risk | Divider edit silently alters prose | Med | Content-skeleton diff proves only blank/`---` lines were added |
| Risk | Pre-existing WIP in 3 files rides along in a commit | Med | Skeleton diff isolates the 3; committed separately / deferred to owner review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The model-profiles.json single-vs-split question is answered as a standalone recommendation (keep single registry), not actioned here.
<!-- /ANCHOR:questions -->
