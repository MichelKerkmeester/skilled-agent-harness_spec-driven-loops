---
title: "Goal: Phrase cleanup hardening"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phrase cleanup hardening

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Implement atomic writes in the cleanup tool, add seed recipes for all 18 template document kinds, and integrate a pre-commit phrase-judge lint that validates staged frontmatter.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Atomic write strategy: write to temp file in the same directory, then rename (POSIX rename is atomic) |
| D2 | All 18 template kinds will have seed recipes in the pin test, not in a separate data file |
| D3 | The pre-commit lint blocks only `template-default` and `editor-fallback` on newly added phrases, warns on every other negative class, and is bypassed with `SPECKIT_SKIP_PHRASE_LINT=1`. Decided 2026-10-08 by the operator |
| D4 | No-frontmatter files are routed to a fixer, not silently skipped |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Atomic write test passes and confirms no partial writes on error
- [ ] All 18 template document kinds have seed recipes in the pin test
- [ ] Create.sh seeding recognizes all 18 kinds and applies the correct phrases
- [ ] A hook test shows an added `template-default` phrase blocks the commit, an added `single-token` phrase only warns, and `SPECKIT_SKIP_PHRASE_LINT=1` skips the lint
- [ ] All existing cleanup, census, and create.sh tests pass with no regression
- [ ] Integration test confirms cleanup, seeding, and linting work together
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
| Discover 18 template kinds | Pending | Tasks T001 |
| Implement atomic write | Pending | Tasks T003 |
| Add seed recipes to pin test | Pending | Tasks T006 |
| Update create.sh seeding | Pending | Tasks T007 |
| Create pre-commit lint | Pending | Tasks T009 |
| Run all tests | Pending | Tasks T011 |

### Deviations and findings

| Item | Note |
|------|------|
| Lint posture decided | 2026-10-08, the operator chose to block only `template-default` and `editor-fallback` on newly added phrases and warn on every other class, with a `SPECKIT_SKIP_*` bypass. A full block was considered and rejected because the research ruled out turning phrase warnings into errors on author-declared phrases. This replaces the earlier `--no-verify`-only bypass decision |
<!-- /ANCHOR:log -->
