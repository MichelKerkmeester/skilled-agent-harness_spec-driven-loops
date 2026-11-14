---
title: "Goal: Recover the last findings object from alignment lane output"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "alignment lane result parser goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "commands/006-alignment-lane-result-parser"
    last_updated_at: "2026-11-14T17:25:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Build the planned parser change and tests"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planner-006-alignment-lane-result-parser"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Recover the last findings object from alignment lane output

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Recover the last top-level findings object from every alignment lane transcript, with a lane preference for lane callers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each `{` is a fresh parse start with its own string and escape state. An unclosed start is skipped. |
| D2 | Only top-level parsed objects with a `findings` array are candidates. The last candidate wins. |
| D3 | A lane call prefers the last candidate with a nonempty `lane` value. The critic call takes the last candidate. |
| D4 | The private runner and its test are ignored code. The packet docs are tracked, and rollback restores the orchestrator backup copy. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` exits 0 with no failing case.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/006-alignment-lane-result-parser --strict` prints `RESULT: PASSED`.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/commands/006-alignment-lane-result-parser` exits 0.
- [ ] `rg -n "matchObjectEnd|expectLane" .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` prints the helper and the caller option.
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
| Packet planned | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal exist |
| Parser change | Pending | Planned in `plan.md` and `tasks.md` |
| Tests | Pending | Three cases are planned, not written |

### Deviations and findings

| Item | Note |
|------|------|
| Pretty-printed critic transcript | The observed miss is reproduced with the same prose brace and quote shape that broke lane B, because a clean pretty-printed object alone already parses today. The case still proves the multi-line recovery path. |

<!-- /ANCHOR:log -->
