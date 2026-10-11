---
title: "Goal: Phase 5: stdin-late-write-coverage"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/005-stdin-late-write-coverage"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-015-005-stdin-late-write-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: stdin-late-write-coverage

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every short-deadline hook entry is proven to act on a payload written in time and to drop one written after its 500 ms deadline, and the hooks README records that risk.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One table drives both tests, and a third test ties it to the SHORT_HOST entries |
| D2 | A stub advisor stands in for the prompt entries so the test never waits on the real advisor |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`, run from the repository root, exits 0 with fail 0.
- [ ] `grep -c 'Residual risk of the 500 ms short-host deadline' .skilled/skills/system-spec-kit/runtime/hooks/README.md`, run from the repository root, prints 1.
- [ ] `python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/system-spec-kit --check --strict`, run from the repository root, prints `Result: PASS`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout/005-stdin-late-write-coverage --strict`, run from the repository root, prints RESULT: PASSED.
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
| Coverage and README | Done | suite 56/56; late write at 100 ms fails all seven late rows |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
