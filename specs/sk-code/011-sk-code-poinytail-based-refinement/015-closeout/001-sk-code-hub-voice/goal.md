---
title: "Goal: Phase 1: sk-code-hub-voice"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/001-sk-code-hub-voice"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-015-001-sk-code-hub-voice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: sk-code-hub-voice

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The sk-code hub SKILL.md passes the human-voice scan with 0 hard blockers and routes exactly as before.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Meaning is frozen: only punctuation and sentence joins change |
| D2 | The hub is bumped once for the whole closeout, to 2.2.10.0 |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md`, run from the repository root, prints `hard blockers:          0`.
- [ ] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`, run from the repository root, prints `router-sync: 5/5 checks passed` and exits 0, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` prints `OK: parent-skill-check` and exits 0.
- [ ] `node .skilled/bin/compiled-route-guard.cjs`, run from the repository root, exits 0 and lists `sk-code` as `fresh`.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs`, run from the repository root, prints `positives 15/17 negatives-false-positive 0/5` or better.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout/001-sk-code-hub-voice --strict`, run from the repository root, prints RESULT: PASSED.
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
| Phase planned | Done | spec.md, plan.md, tasks.md and this goal written by the orchestrator |
| Sentences rewritten, hub bumped | Done | scan 36 to 0; batteries 15/17 and 14/17, as at baseline |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
