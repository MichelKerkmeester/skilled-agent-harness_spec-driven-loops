---
title: "Goal: Phase 4: claude-start-claim"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claude start claim goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/004-claude-start-claim"
    last_updated_at: "2026-11-12T22:42:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-claude-start-claim"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: claude-start-claim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** With the Claude relaunch switch off, a startup that carries the wrapper's claim seed still delivers the claim, and the master and concern kill switches still keep the hook silent.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D5 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The startup claim decision resolves before the Claude per-runtime enable switch. The master switch and the concern kill switch still return early. |
| D2 | The fix stays in `compact-pointer.mjs`. The wrapper's prompt swap and the seed format are unchanged. |
| D3 | The existing claim guards keep their assertions. The new test is added beside them. |
| D4 | `README.md` line 179 is phase 007's work. This phase does not edit it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [ ] `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | Five docs authored from the phase brief on 2026-11-13 |
| Baseline | Done | `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` shows the three start-claim tests failing before the change |
| Implementation | Pending | No source change yet |

### Deviations and findings

| Item | Note |
|------|------|
| None | - |
<!-- /ANCHOR:log -->
