---
title: "Goal: Phase 17: release-changelog"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/017-release-changelog"
    last_updated_at: "2026-10-11T19:00:00Z"
    last_updated_by: "release-changelog-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-017-release-changelog"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 17: release-changelog

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The v4.0.0.4 release entry names every change from the refinement epic and the catalog anchor track that an external user would notice or act on.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The sk-create-changelog contract governs voice, sections and what to leave out |
| D2 | Other sessions' entries in the file stay as they are |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c 'SPECKIT_SKIP_SKILL_AUTHORING\|router-replay-lib.cjs\|Node.js 20.19\|sk-doc-template' .skilled/changelog/skilled/v4.0.0.4.md`, run from the repository root, prints 4 or more.
- [ ] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/changelog/skilled/v4.0.0.4.md`, run from the repository root, prints `hard blockers:          0` and a mechanical ceiling of 97/100 or higher.
- [ ] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/changelog/skilled/v4.0.0.4.md`, run from the repository root, prints VALID.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/017-release-changelog --strict`, run from the repository root, prints RESULT: PASSED.
- [ ] `git status --short`, run from the repository root, prints nothing.
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
| Inventory | Done | 114 commits carry either Spec trailer; 92 are not spec, chore or merge commits |
| Entry | Done | Two existing sections extended, five sections added, five Upgrade Notes lines |
| Voice and validators | Done | HVR 0 hard blockers and 97/100 before and after; validate_document VALID |

### Deviations and findings

| Item | Note |
|------|------|
| Glance list kept at 12 | The template caps it at 12 and the file already had 12, so the epic is summarized in a third opening paragraph instead |
| No skill versions named | No Skilled release entry names skill versions, so the entry follows the file's convention |
<!-- /ANCHOR:log -->
