---
title: "Feature Specification: deferred-cleanup-entangled-playbook-assets"
description: "Land the 3 deferred entangled cli reference docs (permission-mode typo fix, model-profiles path repoint, MiniMax-M3 row plus dividers), repoint the sk-prompt manual-testing-playbook dangling card paths to the hub, and remove the extra leading divider from 6 asset docs."
trigger_phrases:
  - "deferred cleanup"
  - "entangled doc landing"
  - "playbook card path repoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/015-deferred-cleanup-entangled-playbook-assets"
    last_updated_at: "2026-06-03T13:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Entangled docs landed; playbook repointed; asset dividers removed"
    next_safe_action: "Validate then commit phase 015"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/references/cli_reference.md"
      - ".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cli-devin permission-mode dedup is a correct typo fix, not lossy (Devin has 2 modes per its README)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deferred-cleanup-entangled-playbook-assets

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
| **Phase** | 15 of 15 |
| **Predecessor** | 014-doc-divider-sweep-and-sk-prompt-cleanup |
| **Successor** | None |
| **Handoff Criteria** | The 3 entangled docs land with content verified safe; the sk-prompt playbook card paths resolve to the hub; the 6 asset docs carry no extra leading divider; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 15 (final cleanup) of spec 130. It closes three loose ends that phase 014 deliberately
deferred or reported. The 3 entangled cli reference docs carried unrelated uncommitted content
edits at the 014 sweep, so 014 held them back. The sk-prompt manual-testing-playbook still pointed
at the moved card via dangling paths (more phase-013 relocation fallout). And 6 asset docs carried
a leading `---` before section 1 that the sk-doc asset template omits.

**Scope Boundary**: the 3 entangled docs, the sk-prompt playbook's card file paths, and the 6
asset docs' leading divider. Playbook prose (scenario descriptions) and the README permission-mode
typos are out of scope.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three deferred items remained after 014. First, the divider fixes for `cli-devin/cli_reference.md`,
`cli-devin/quota-fallback.md` and `cli-opencode/cli_reference.md` were held back because each
carried unrelated content WIP that needed review before landing. Second, the sk-prompt playbook had
9 dangling references to `cli_prompt_quality_card.md` at its old sk-prompt path (the card moved to
the hub in phase 013), including two bash commands that would now find nothing. Third, 6 asset docs
had a leading `---` before section 1 that the asset template does not use, leaving them inconsistent
with their sibling asset docs.

### Purpose
Land the verified-safe entangled edits, make the playbook card paths resolve again, and bring the
asset docs into leading-divider consistency with the sk-doc asset template.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Land `cli-devin/references/cli_reference.md` (permission-mode typo dedup to the 2 real Devin modes, plus the matching version-drift wording), `cli-devin/references/quota-fallback.md` (model-profiles.json path repoint + its dividers) and `cli-opencode/references/cli_reference.md` (MiniMax-M3 row + its dividers).
- Repoint the 9 dangling card paths in `sk-prompt/manual_testing_playbook/**` to `sk-prompt-models/assets/cli_prompt_quality_card.md`.
- Remove the leading `---` before section 1 in 6 asset docs (`prompt_templates.md` x5 + `cli-devin/assets/deep-loop-iter-template.md`).
- Version bumps + changelogs for the 6 affected skills.

### Out of Scope
- Playbook scenario prose / logic - only the broken card file paths are repointed.
- README.md permission-mode typos (`dangerous` or `dangerous`) in cli-devin - reported as a separate follow-up.
- Any divider changes beyond removing the asset leading divider.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-devin/references/cli_reference.md` | Modify | Permission-mode typo fix + version-drift wording |
| `cli-devin/references/quota-fallback.md` | Modify | model-profiles.json path repoint + dividers |
| `cli-opencode/references/cli_reference.md` | Modify | MiniMax-M3 row + dividers |
| `sk-prompt/manual_testing_playbook/**` (7 files) | Modify | Repoint 9 dangling card paths to the hub |
| 6 `cli-*/assets/*.md` | Modify | Remove leading `---` before section 1 |
| 6 `cli-*/SKILL.md` + 6 `changelog/v*.md` | Modify/Create | Version bumps + changelogs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Entangled docs land safely | Content-skeleton diff shows only the intended content edits; each verified correct (Devin has 2 modes; the repoint path is the real one; the MiniMax row is additive) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Playbook paths resolve | grep finds 0 old `sk-prompt/assets/cli_prompt_quality_card` or `../../assets/cli_prompt_quality_card.md`; both new hub paths resolve on disk |
| REQ-003 | Asset leading dividers removed | first-H2 check shows the 6 assets carry no leading `---`; only `---`/blank lines removed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 3 entangled docs' content changes are individually verified safe and landed.
- **SC-002**: 0 dangling card paths remain in the sk-prompt playbook; both hub paths resolve.
- **SC-003**: The 6 asset docs have no leading `---`; the strict divider scout stays +0.
- **SC-004**: `validate.sh --recursive --strict` exit 0; card-sync guard green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The cli-devin permission edit drops a real mode | Med | Confirmed against cli-devin README (states 2 modes); the deleted row was a phantom duplicate `dangerous` |
| Risk | Playbook repoint breaks a working path | Low | Exact-string replacement; both new paths verified to resolve; old-path grep returns 0 |
| Risk | Asset divider removal deletes content | Low | Deterministic removal of the `---`/blank only; content-skeleton diff unaffected; strict scout stays +0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The cli-devin README permission-mode typos remain as a reported follow-up, not part of this phase.
<!-- /ANCHOR:questions -->
