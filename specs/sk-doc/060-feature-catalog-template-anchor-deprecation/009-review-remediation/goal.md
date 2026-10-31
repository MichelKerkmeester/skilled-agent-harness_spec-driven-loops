---
title: "Goal: Phase 9: review-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/009-review-remediation"
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
# Goal: Phase 9: review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every confirmed finding from the packet's deep review and the two document handoffs from the tooling track.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Reuse the phase 005 key script. |
| D2 | Leave hub bumps to the master. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `package_skill.py --check --strict` prints Result: PASS for cli-codex, cli-cursor, mcp-code-mode and sk-design
- [x] No changelog entry under system-deep-loop/runtime lacks a version key
- [x] `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --repo-root . --report-only`, run from the repository root, reports 0 fail and 0 warn findings; the only remaining entries are `ignored_path_absent` notes, each naming a path a repository .gitignore covers
- [x] The parent goal criterion names sk-create-feature-catalog 1.0.5.0 and phase 003 names the sk-doc 2.3.2.0 target
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
| Keys | Done | 49 |
| Validators | Done | catalog 15 to 5; four strict FAIL to PASS |

### Deviations and findings

| Item | Note |
|------|------|
| Cascade | Renaming the sk-design heading exposed the missing rules subsections, which a second brief fixed. |
| Criterion 3 amended 2026-10-11 | The sk-code epic phase 014-skill-authoring-ux-research/016 made an absent ignored path a note, so the five findings became zero fail and zero warn findings |
<!-- /ANCHOR:log -->
