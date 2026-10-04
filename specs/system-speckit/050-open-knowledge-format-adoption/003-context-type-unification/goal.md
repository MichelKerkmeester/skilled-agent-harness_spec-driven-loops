---
title: "Goal: Phase 3: context-type-unification"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/003-context-type-unification"
    last_updated_at: "2026-10-04T09:20:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Added the operator UX and command-surface criterion"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: context-type-unification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make one contextType list govern every place doc frontmatter is checked, in both spec-kit and sk-doc, with no behavior lost. Done when: input-normalizer.ts and session-extractor.ts derive their contextType lists from shared/context-types.ts, and no retyped literal list remains; a test passes for behavior that depends on the review value and one for planning; a warn-only check in validator-registry.json and validate_document.py flags a fixture with an out-of-list value and fails no existing packet or skill doc; the distinct contextType count on spec docs falls from 33 to the canonical four plus aliases still present, in commits that each state a before and after count; the skill advisor test suite gives the same result before and after; before the warning ships, a full run over existing packets and skill docs prints zero new warnings, and a doc made by each /create:* workflow and each spec-kit template passes without one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Cleanup commits change frontmatter values only, in batches that each revert whole. |
| D2 | Every skill doc edited gets a bumped four-part version and a changelog entry. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] input-normalizer.ts and session-extractor.ts derive their contextType lists from shared/context-types.ts, and no retyped literal list remains
- [x] a test passes for behavior that depends on the review value and one for planning
- [x] a warn-only check in validator-registry.json and validate_document.py flags a fixture with an out-of-list value and fails no existing packet or skill doc
- [ ] the distinct contextType count on spec docs falls from 33 to the canonical four plus aliases still present, in commits that each state a before and after count
- [x] the skill advisor test suite gives the same result before and after
- [x] before the warning ships, a full run over existing packets and skill docs prints zero new warnings, and a doc made by each /create:* workflow and each spec-kit template passes without one
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
| Phase opened | Pending |  |
| phase 003 build | 5 of 6 criteria met | 33 to 12 distinct values, sweep 0 warnings, D1 proof 191 folders 0 changed, CLI and advisor suites at baseline; criterion 4 and AC-006 wait for the operator-approved commit |

### Deviations and findings

| Item | Note |
|------|------|
| None yet |  |
<!-- /ANCHOR:log -->
