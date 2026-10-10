---
title: "Goal: Phase 7: sk-code-script-kebab-names"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk code script kebab names goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/007-sk-code-script-kebab-names"
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
# Goal: Phase 7: sk-code-script-kebab-names

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Rename the sk-code-opencode snake_case scripts to kebab-case without breaking any caller.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Update every live reference before renaming; leave history as is. |
| D2 | Hand off the hub bump. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `package_skill.py --check --strict` prints Result: PASS for sk-code-opencode
- [x] Both tests pass, all four drift guards pass and the sk-code parent skill check prints OK
- [x] A grep of `.skilled` and `.hermes` outside changelogs finds none of the three old names
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
| Builder run | Done | 5 renames, 58 replacements |
| Verification | Done | package PASS, tests and guards green |

### Deviations and findings

| Item | Note |
|------|------|
| Manifest order | The rename changed the sort order of the generated leaf manifest, so a hand edit failed the byte check; the generator fixed it. |
<!-- /ANCHOR:log -->
