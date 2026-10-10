---
title: "Goal: Feature catalog template-anchor deprecation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation"
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
# Goal: Feature catalog template-anchor deprecation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Retire the `sk-doc-template: skill_asset_feature_catalog` comment from the feature catalog mode and from every feature catalog in the repository, then repair the validator findings the sweep surfaced, with each changed skill versioned.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The comment is removed outright in both spellings, with no compatibility path, because no code reads it. |
| D2 | One deterministic script kept in phase 2's scratch removes the existing copies, run once. |
| D3 | The other template-name comments are removed the same way in their own phase. |
| D4 | Each finding is fixed or dropped with a recorded reason; tooling fixes are handed off. |
| D5 | Hub version bumps are handed off, because their JSON version fields belong to another owner. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-source-deprecation | `001-source-deprecation/goal.md` |
| 002-retroactive-removal | `002-retroactive-removal/goal.md` |
| 003-feature-catalog-findings | `003-feature-catalog-findings/goal.md` |
| 004-leftover-template-comments | `004-leftover-template-comments/goal.md` |
| 005-changelog-version-keys | `005-changelog-version-keys/goal.md` |
| 006-skill-package-doc-findings | `006-skill-package-doc-findings/goal.md` |
| 007-sk-code-script-kebab-names | `007-sk-code-script-kebab-names/goal.md` |
| 008-remediation-deep-review | `008-remediation-deep-review/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git grep -E 'sk-doc-template: skill_asset_feature[_-]catalog' -- .skilled .hermes ':!**/changelog/**'` prints no match
- [x] `validate_catalog_package.py --report-only` reports 15 findings, down from 761, each recorded with a reason
- [x] sk-create-feature-catalog reads version 1.0.2.0, and every other skill or mode whose catalog changed has a bumped `SKILL.md` version and a matching new changelog entry
- [x] `sync-skills-hermes.cjs --check` and the trigger index check both pass
- [x] Each child goal's criteria pass
- [x] `validate.sh --recursive --strict` on this packet prints RESULT: PASSED for the parent and every child
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
| 001-source-deprecation | Done | Mode grep exits 1, mode at 1.0.2.0 |
| 002-retroactive-removal | Done | 548 files swept, 27 units bumped |
| 004 to 007 | Done | 97 comments, 217 version keys, six package fixes, three renames |
| 003-feature-catalog-findings | Done | 761 findings to 15 |

### Deviations and findings

| Item | Note |
|------|------|
| Origin | Commit `7d7650471d` added the comment to the template and 588 snippets in one sweep. |
| Criterion 1 scope | Changelog entries name the removed comment, so the grep excludes `changelog/` paths. |
<!-- /ANCHOR:log -->
