---
title: "Goal: Phase 6: remediation-deep-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "remediation deep review goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review"
    last_updated_at: "2026-10-10T21:17:03Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-012-006-remediation-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: remediation-deep-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Review the remediation commits `1d078f3356..d1741a28f7` in five deep-review iterations and record every confirmed defect in them with its evidence and smallest fix.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `/deep:review:auto` with `--max-iterations=5 --stop-policy=max-iterations`, executor cli-pi `deepseek-v4.1-flash` at `max` on DevPass; `cline-pass/deepseek-v4.1-flash` only if DevPass is limited |
| D2 | The review changes no product file |
| D3 | A finding stays only when a rerun command or a read line proves it, marked CONFIRMED |
| D4 | The sk-vision `resolves a built entry` failure is environmental here and is not a finding |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review/review/deep-review-state.jsonl` prints 5, and `grep -l '"kind":"cli-pi"' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review/review/dispatch-receipts/*.completion.json | wc -l` prints at least 5
- [ ] `grep -c 'CONFIRMED' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review/review/review-report.md` prints at least 1
- [ ] `git show --stat --format= HEAD -- . ':!specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review' ':!.skilled/skills/system-spec-kit/runtime/data' ':!.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures'` prints nothing for the phase commit
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review --strict` prints `RESULT: PASSED`
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
| Five iterations | Done | 5 iteration records, 5 cli-pi receipts, all on DevPass |
| Review report | Done | `review/review-report.md`: P0 0, P1 0, P2 4 CONFIRMED |
| Strict validation | Done | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Iteration driver | The auto YAML's per-iteration steps run through a scratch driver script, the same route the parent review used |
| 011 epic goal count | Criterion 2 of the 011 goal expects 41 completed summaries; this phase makes it 42. Left to the master orchestrator, outside this phase's scope |
<!-- /ANCHOR:log -->
