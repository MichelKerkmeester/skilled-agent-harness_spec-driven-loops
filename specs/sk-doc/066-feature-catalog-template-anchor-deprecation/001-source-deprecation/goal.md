---
title: "Goal: Phase 1: source-deprecation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "source deprecation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/001-source-deprecation"
    last_updated_at: "2026-10-10T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: source-deprecation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop the sk-create-feature-catalog mode from stamping the `<!-- sk-doc-template: skill_asset_feature_catalog -->` comment into new catalog files, and ship that change as a versioned mode release.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The marker is removed outright, with no optional field or compatibility path, because no code reads it. |
| D2 | This phase touches only the sk-create-feature-catalog packet and its Hermes copy. Existing catalog files belong to phase 2. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -rn 'sk-doc-template' .skilled/skills/sk-doc/sk-create-feature-catalog --exclude-dir=changelog` prints no match
- [x] `validate_document.py` exits 0 on both feature catalog assets, `references/examples.md` and the mode's `SKILL.md`
- [x] The mode's `test_validator_fixtures.py` prints ALL PASS
- [x] The mode's `SKILL.md` reads `version: 1.0.2.0` and `changelog/v1.0.2.0.md` exists
- [x] `sync-skills-hermes.cjs --check` prints PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Reader inventory | Done | git grep over code and config found no reader |
| Template edits | Done | grep over the mode exits 1 |
| Version and Hermes | Done | `SKILL.md:5`, `PASS: 70 Hermes skill copies in sync` |

### Deviations and findings

| Item | Note |
|------|------|
| Other stray `sk-doc-template:` comments | Found in system-skill-advisor and a few playbooks. No template emits them, so they stay out of scope and are reported to the operator. |
<!-- /ANCHOR:log -->
