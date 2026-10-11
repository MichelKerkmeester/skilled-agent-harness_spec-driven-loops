---
title: "Goal: Phase 2: retroactive-removal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "retroactive removal goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal"
    last_updated_at: "2026-10-10T20:30:00Z"
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
# Goal: Phase 2: retroactive-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove every existing copy of the feature catalog template-name comment from the repository's feature catalogs, and ship each owning skill or mode as a patch release, without changing any validation result.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One script in `scratch/` removes both spellings and runs once. |
| D2 | Every unit with its own `SKILL.md` or changelog whose catalog changed gets a patch bump and an entry. |
| D3 | Per-document build counts inside catalog files stay as they are. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git grep -E 'sk-doc-template: skill_asset_feature[_-]catalog' -- '.skilled/**/feature-catalog/**'` prints no match
- [x] `scratch/remove-template-anchor-report.json` records files_changed 548, markers_removed 548 and no inline copies
- [x] `validate_catalog_package.py --repo-root .` reports 761 violations (42 fail, 719 warn), the same as before the sweep
- [x] 27 new changelog entries exist, one per owning unit, each one patch above that unit's previous latest version
- [x] `compiled-route-guard.cjs`, `sync-skills-hermes.cjs --check` and `generate-trigger-index.mjs --check` all exit 0
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
| Sweep | Done | `files_changed=548 markers_removed=548 inline_copies_left=0` |
| Validator comparison | Done | Identical output modulo line numbers |
| Version bumps | Done | 27 entries, cli-classifier 0.8.1.0 through system-spec-kit 2.7.3.0 |
| Derived artifacts | Done | Guard all fresh, Hermes PASS, trigger index exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| `fanout-write-containment.md` | Fails `validate_document.py` for missing H2 separators, identically at HEAD. Left for its owner. |
| Hub manifests | The `refresh` tool rewrites only the runtime copy, so each was copied byte-for-byte to the authored root, as earlier commits did. |
<!-- /ANCHOR:log -->
