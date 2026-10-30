---
title: "Goal: Phase 4: convert-plain-skill"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "convert plain skill goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/004-convert-plain-skill"
    last_updated_at: "2026-10-30T09:10:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Recorded the closed completion criteria"
    next_safe_action: "Proceed with phase 005 integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: convert-plain-skill

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Convert a plain agent skill into a class S root that passes the strict format gate without losing any of its original content.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Stage under the frontmatter name by copy, never move or rename the source. |
| D2 | Metadata comes from a temp `init_skill.py` run; only absent files are copied. |
| D3 | A failed V8 gate stops convert before any integration write. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `package_skill.py --check --strict` on the converted plain fixture prints `Result: PASS`
- [x] `ci-skill-root-metadata.cjs --skill <fixture>` exits 0 on the converted plain fixture
- [x] `sk-skill-convert.cjs preserve --snapshot <dir>` passes on the plain fixture and fails on the dropped-line fixture
- [x] With 7 approved phrases the plan stops with `INTENT_SIGNALS_BELOW_FLOOR`
- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` exits 0
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
| Phase planned | Done | spec.md, plan.md, tasks.md authored |
| V1 to V8 implemented | Done | `sk-skill-convert.cjs` runs the stages in order and the suite drives them end to end |
| Preservation gate | Done | `preserve --snapshot` passes on the converted fixture and names the lost line on the dropped-line copy |
| Format gates | Done | `Result: PASS` from the strict package check and exit 0 from the root-metadata check on the converted fixture |

### Deviations and findings

| Item | Note |
|------|------|
| Staged copy removed on a failed run | The plan's rollback promises it and an abandoned half-converted root would face every gate, so a failure after staging removes the tree the run created and keeps only the snapshot |
| Interpreter resolved through the context | An absolute Homebrew path does not exist off macOS, so the scaffolder and both validators take the configured `python3` |
<!-- /ANCHOR:log -->
