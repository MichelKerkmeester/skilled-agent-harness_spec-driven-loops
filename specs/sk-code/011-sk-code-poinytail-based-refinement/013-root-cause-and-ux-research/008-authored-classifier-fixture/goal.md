---
title: "Goal: Phase 8: authored-classifier-fixture"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/008-authored-classifier-fixture"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-authored-classifier-fixture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: authored-classifier-fixture

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the authored cli-classifier canary fixture match the served copy, so a compiled-route rebuild publishes a closure whose every hub canary passes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The served fixture is the truth; the authored copy is overwritten with its bytes. |
| D2 | No hub version bump; the master bumps each hub once at merge. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cmp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json; echo $?`, run from the repository root, prints 0.
- [x] `node specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/008-authored-classifier-fixture/scratch/t2-authored-canaries.cjs | tail -1`, run from the repository root, prints `all hubs failures 0`.
- [x] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs | tail -1`, run from the repository root, prints `all hubs failures 0`.
- [x] `node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1; echo $?; node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1; echo $?`, run from the repository root, prints 0 twice.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/008-authored-classifier-fixture --strict`, run from the repository root, prints RESULT: PASSED.
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
| Before numbers | Done | Authored runner: hubs 001 to 007 at 0 failures, then `GOLD_MISMATCH` for `deem-choice-single`, exit 1 |
| Fixture copied | Done | cli-pi build; cmp exit 0 |
| After | Done | Authored runner `all hubs failures 0`; served runner `all hubs failures 0`; all 55 traced files identical; `--check` 0; guard 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 001 claim corrected | Phase 001 said the authored and served copies were identical. That held for the harness only; this phase makes it true for the whole traced closure |
<!-- /ANCHOR:log -->
