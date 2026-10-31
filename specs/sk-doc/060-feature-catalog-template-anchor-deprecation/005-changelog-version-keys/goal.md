---
title: "Goal: Phase 5: changelog-version-keys"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "changelog version keys goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys"
    last_updated_at: "2026-10-10T22:00:00Z"
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
# Goal: Phase 5: changelog-version-keys

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every changelog entry in the skills the anchor sweep touched a frontmatter version key equal to its file name.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One script in `scratch/` inserts the key and runs once. |
| D2 | Hub bumps are handed off, not made, because their JSON version fields belong to another owner. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `package_skill.py --check --strict` over the 28 touched units reports 0 missing-version findings
- [x] `git show --numstat --format= caafc08377 -- '*/changelog/v*.md' | awk '$1==1 && $2==0' | wc -l` prints 217, one added `version:` line and no deleted line in each of 217 changelog entries
- [x] Each of the ten non-hub units changed here has a new changelog entry one patch above its previous latest
- [x] `validate.sh --strict` on this phase prints RESULT: PASSED
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
| Builder run | Done | changed=217 already_had=145 no_frontmatter=0 |
| Verification | Done | 217 lines matched, 0 findings left |

### Deviations and findings

| Item | Note |
|------|------|
| Persona | The brief inlined a condensed persona instead of the 46 KB agent file, to keep the brief short as the operator asked. |
| Criterion 2 amended 2026-10-11 | A working-tree diff of the phase no longer exists after its commit. The phase commit caafc08377 holds the same count |
<!-- /ANCHOR:log -->
