---
title: "Goal: Phase 1: deep-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research"
    last_updated_at: "2026-11-06T09:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-001-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce two lineages of evidence-cited research on running DeepSeek Harness as the `cli-deepseek-harness` mode, merged into one synthesis and a ranked plan for the build phases.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase produces findings only. No file outside `research/` changes |
| D2 | Two lineages of ten iterations each, `cli-codex` `gpt-6-luna` `xhigh` and `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` `max` |
| D3 | Lineage conflicts are settled against the dsh source clone at commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/orchestration-summary.json` reports 2 of 2 lineages succeeded and 0 failed
- [x] `research/findings-registry.json` reports 20 iterations completed
- [x] `research/research.md` and `research/phase-plan.md` exist and the plan has 13 phase sections
- [x] `research/deep-research-config.json` has `status` `complete`
- [x] `validate.sh` on the phase folder with `--strict` prints `RESULT: PASSED`
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
| Two-lineage research and synthesis | Done | `node -e` read printed `{"succeeded":2,"total":2,"failed":0,"configStatus":"complete","iterations":20,"keyFindings":145,"convergence":0.875}` on 2026-11-06 |

### Deviations and findings

| Item | Note |
|------|------|
| Lineage timestamp anomalies | The run summary flags five `deepseek` state-log entries as after the window. The lineage still succeeded and its iterations are complete |
<!-- /ANCHOR:log -->
