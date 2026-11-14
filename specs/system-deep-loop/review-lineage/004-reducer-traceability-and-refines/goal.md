---
title: "Goal: Correct deep-review reducer dead ends and refinement counting"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reducer traceability and refines goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/review-lineage/004-reducer-traceability-and-refines"
    last_updated_at: "2026-11-14T17:20:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Build the planned reducer change and tests"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planner-004-reducer-traceability-and-refines"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Correct deep-review reducer dead ends and refinement counting

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the deep-review reducer report only real dead ends as BLOCKED and fold an explicitly linked refinement into its canonical finding.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `Traceability Checks` is not a dead-end source. Only explicit `Dead Ends` and `Ruled Out` or `Confirmed-Clean` entries feed the exhausted-approaches list. |
| D2 | `refines` is optional. A finding without it keeps today's content-based id-reuse behavior. |
| D3 | The reducer reads `refines` from `findingDetails[]` and `type:"finding"` delta rows, and accepts the observed `refinementOf` spelling as an alias. |
| D4 | A resolved refinement updates `lastSeen`, title, description and one transition, and does not create a second open finding. An unresolved id falls back to the ordinary insert path. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` exits 0 with no failing case.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines --strict` prints `RESULT: PASSED`.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines` exits 0.
- [ ] `rg -n "refines" .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` prints one line.
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
| Reducer change | Pending | Planned in `plan.md` and `tasks.md` |
| Tests | Pending | The new test file is planned, not written |

### Deviations and findings

| Item | Note |
|------|------|
| Markdown `Refines:` line | The numbered narrative is a fallback, and no run carries a machine link there. The structured row carries the link in the evidence run, so the plan keeps the parser change out of scope. |

<!-- /ANCHOR:log -->
