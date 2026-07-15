---
title: "Feature Specification: sk-prompt-playbook-forkability-decouple"
description: "Decouple the sk-prompt manual-testing-playbook from sk-prompt-models and cli skills so the skill is fully forkable: reframe the 2 card-centric escalation scenarios to test sk-prompt's own surface, repoint all hub-card source refs, scrub the stale §8 reference, and genericize cli-* operational mentions."
trigger_phrases:
  - "sk-prompt playbook forkability"
  - "playbook decouple"
  - "card-centric scenario reframe"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/016-sk-prompt-playbook-forkability-decouple"
    last_updated_at: "2026-06-03T14:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Playbook decoupled from hub + cli; scenarios reframed"
    next_safe_action: "Validate then commit phase 016"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-prompt/manual_testing_playbook/06--escalation-tiers/cli-card-five-question-fast-path.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Move SP-023/024 to the hub, remove, or reframe? -> reframe (hub has no playbook; behaviors are observable from sk-prompt's own docs)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-prompt-playbook-forkability-decouple

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
| **Phase** | 16 of 16 |
| **Predecessor** | 015-deferred-cleanup-entangled-playbook-assets |
| **Successor** | None |
| **Handoff Criteria** | The sk-prompt playbook has zero references to sk-prompt-models or cli-* skills; reframed scenarios test sk-prompt's own surface and their rg targets resolve; validate_document.py VALID on all touched files; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 16 (forkability cleanup) of spec 130. sk-prompt is meant to be a standalone, forkable
framework engine, but a forkability audit found its manual-testing-playbook still depended on
`sk-prompt-models` (the relocated `cli_prompt_quality_card.md`) in nine places, including two
`rg` test steps and a disk-resolution assertion that would fail in a standalone fork, plus a stale
`§8 fast-path asset` reference (the section phase 014 removed) and a few `cli-*` mentions.

**Scope Boundary**: the sk-prompt playbook only (root + the escalation-tier and framework-selection
scenarios that referenced the card). No changes to sk-prompt's engine, the hub, or the cli skills.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two playbook scenarios (`SP-023` CLI card fast path, `SP-024` escalation thresholds) tested the CLI
prompt-quality card, a CLI-dispatch concern that left sk-prompt when the card moved to the hub in
phase 013. Their `rg` steps read the hub card, a disk-resolution precondition asserted the hub card
exists, and six source-ref rows pointed outside sk-prompt. A standalone sk-prompt fork would have
failed those scenarios. The playbook also carried a stale `§8` reference and `cli-*` names.

### Purpose
Make the playbook self-contained so a standalone sk-prompt fork runs clean, by reframing the two
card-centric scenarios to test sk-prompt's own inline/escalation surface and repointing every
reference to sk-prompt's own docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reframe `SP-023` to test sk-prompt's inline CLEAR fast path (no `@prompt-improver` dispatch) anchored on `patterns_evaluation.md`.
- Reframe `SP-024` to test sk-prompt's escalation to `@prompt-improver` anchored on `SKILL.md` §7 + §4.
- Repoint/remove the hub-card source refs in `SP-019`, `SP-021`, `SP-025`, `SP-026`.
- Root playbook: drop the card from coverage note, test model, disk-resolution; fix the stale `§8` to `§7`; reframe §12 SP-023/024 descriptions; update §15 catalog; genericize `cli-*` operational mentions.
- sk-prompt version bump 2.1.2.0 -> 2.1.3.0 + changelog.

### Out of Scope
- The `cli-card-five-question-fast-path.md` filename slug - retained to avoid catalog-link churn; title/content reframed.
- A playbook for the hub to host card-fast-path coverage - separate concern (the hub has no playbook).
- Any change to sk-prompt's engine, the hub, or cli skills.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `manual_testing_playbook/manual_testing_playbook.md` | Modify | Coverage/test-model/preconditions/§12/§15 + cli genericization |
| `06--escalation-tiers/023,024,025,026/*.md` | Modify | Reframe SP-023/024; repoint SP-025/026 refs |
| `05--framework-selection/019,021/*.md` | Modify | Remove redundant hub-card source refs |
| `SKILL.md` + `changelog/v2.1.3.0.md` | Modify/Create | Version bump + changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero cross-skill reliance | grep across the playbook for `sk-prompt-models`, `cli_prompt_quality_card`, and every `cli-*` skill returns 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Reframed scenarios resolve | SP-023/024 `rg` steps target sk-prompt's own files and match content (CLEAR dims; escalation terms) |
| REQ-003 | Structure intact | `validate_document.py` reports VALID on the root playbook + all 6 touched feature files; 28 scenarios preserved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Token grep for `sk-prompt-models` / `cli_prompt_quality_card` / `cli-*` across the playbook = 0.
- **SC-002**: All `rg` targets in the playbook point only at `.opencode/skills/sk-prompt/`; the reframed SP-023/024 targets resolve.
- **SC-003**: `validate_document.py` VALID on all touched files; `validate.sh --recursive --strict` exit 0; card-sync guard green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reframed scenario tests a behavior sk-prompt does not actually have | Med | Anchored on sk-prompt's real surface (CLEAR in patterns_evaluation; @prompt-improver in SKILL.md §7); rg targets verified to resolve |
| Risk | Reframe changes SP-024 critical-path semantics | Low | SP-024 keeps its ID + critical-path status; still tests escalation to @prompt-improver, just anchored on sk-prompt's own docs |
| Risk | Filename slug stays card-named | Low | Cosmetic; title + content reframed; renaming would churn catalog links for no functional gain |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The hub (sk-prompt-models) has no playbook; if card-fast-path coverage is wanted there, that is a separate follow-up.
<!-- /ANCHOR:questions -->
