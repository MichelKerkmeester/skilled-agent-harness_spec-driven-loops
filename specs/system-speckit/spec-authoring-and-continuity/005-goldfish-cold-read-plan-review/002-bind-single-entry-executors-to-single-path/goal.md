---
title: "Goal: Bind a one-entry executor matrix to the single-executor path"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path"
    last_updated_at: "2026-11-12T00:16:34Z"
    last_updated_by: "codex"
    recent_action: "Verified phase 002 baseline and closeout evidence"
    next_safe_action: "Proceed with phase 003-refuse-single-lineage-fanout-run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Bind a one-entry executor matrix to the single-executor path

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A deep-loop `--executors` matrix that expands to one lineage runs the single-executor path with all packet-level phases.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Docs only. No workflow YAML, script or test changes in this phase. |
| D2 | One lineage binds `config.executor`. Two or more bind `config.fanout`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] T011 counts 11 lines carrying the one-lineage branch across the four maintained sources, the feature catalog entry and both contracts, and prints `no old policy wording`.
- [x] T009 and T010 regenerate the research and review contracts, and a fresh compile of each matches the written contract.
- [x] Strict validation of this packet prints `RESULT: PASSED`.
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
| Phase opened | Done | spec.md records Created 2026-11-11. |
| Phase 2 closeout | Done | T001 confirmed the pre-edit HEAD counts 3, 3, 1 and 1. T002-T008 printed OK. T009/T010 each printed 2 and `diff -q` showed no difference. T011 printed 11 and no old policy wording. Final strict validation printed RESULT: PASSED (errors=0 warnings=0). |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and get rechecked against the reviewed spec |
| T001 pre-edit baseline | Confirmed from Git HEAD because the current working files contain the post-edit policy. The historical measured behavior is preserved in spec.md. |
<!-- /ANCHOR:log -->
