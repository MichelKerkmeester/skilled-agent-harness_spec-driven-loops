---
title: "Goal: Phase 10: decision-routing-vocabulary"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "decision routing vocabulary goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/010-decision-routing-vocabulary"
    last_updated_at: "2026-11-03T09:40:00Z"
    last_updated_by: "planning-worker"
    recent_action: "Logged the build and the close-out evidence"
    next_safe_action: "Commit only the system-spec-kit part of skill-graph.json"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: decision-routing-vocabulary

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A request to record something as a decision routes to system-spec-kit, while design and git prompts that mention a decision keep their routes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changes stay inside system-spec-kit's `graph-metadata.json` and `ROUTER.md`, the generated Hermes copy of that router and the compiled advisor artifacts, as the parent goal's amended D1 admits. No advisor code changes. |
| D2 | No bare `decision` signal or keyword. Every new phrase has at least two words. |
| D3 | Proof runs on the native advisor, `advisor_recommend`, against a live index. A Python fallback result or a stale-index result is not proof. |
| D4 | This child ships after 008, so routing never leads a user into the shared-state bug. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/bin/skill-advisor.cjs advisor_recommend` for "Record my chat reply as a decision" and for "record this as a decision" each lists `system-spec-kit` first at confidence 0.8 or higher and uncertainty 0.35 or lower, with freshness `live`.
- [x] "decision tree", "colour decision", "decision branch" and "architecture decision" each return the same skill list as the live pre-change control.
- [x] `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exits 0, and `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check system-spec-kit` prints `Result: PASS`.
- [ ] `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/010-decision-routing-vocabulary --strict` prints RESULT: PASSED.
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
| Planning docs | Done | spec, plan, tasks and acceptance criteria filled 2026-11-03 |
| Read-only baseline | Done | `spec.md` Measured Behavior: both decision prompts return `"recommendations":[]` at generation 2138 |
| Build | Done | 2026-11-03, built through cli-pi on the D6 fallback; the six live probes meet REQ-003 and REQ-004; see `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Stale advisor at baseline | The six probes ran at generation 2138 with `freshness: stale`, and the reach check met 39 probe errors. T002 rebuilds the index and records a live control before any edit. |
| Graph export carries six sk-doc signals | Another session left `sk-doc/graph-metadata.json` modified, so the export carries its six signals; the commit stages only the system-spec-kit part. |
| No live reach baseline | The reach check ran only stale before the edit, so no pre-change live reach row exists. |
| Trigger index left alone | Planning decision in `spec.md` Open Questions: no `trigger_phrases` entry and no index rebuild in this child. |
<!-- /ANCHOR:log -->
