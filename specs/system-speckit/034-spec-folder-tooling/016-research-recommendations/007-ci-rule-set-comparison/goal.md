---
title: "Goal: Phase 7: ci-rule-set-comparison"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison"
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
# Goal: Phase 7: ci-rule-set-comparison

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Compare failing rule sets instead of verdicts in the changed-packet PR gate and pass the previous sweep artifact as a baseline to the weekly gate so regressions are detected accurately.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | When no baseline artifact exists on the first run of the weekly sweep, proceed without error and report all failures as the baseline for the next run |
| D2 | Built in wave 2 by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D3 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D4 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A test packet that fails different rule sets at base and head is reported as a regression in the PR gate
- [ ] The weekly sweep receives `--baseline` from a previous artifact and compares with it
- [ ] The PR gate output lists the failing rules by name for troubleshooting
- [ ] The first run of the weekly sweep handles missing baseline gracefully and reports all failures
- [ ] The rule set comparison logic passes with multiple test scenarios (pass-to-fail, fail-to-fail-different-rules, baseline-present, baseline-absent), each with expected outcomes recorded in implementation-summary.md
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
| Planning complete | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all validate --strict |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Phase is planned, not built |
<!-- /ANCHOR:log -->
