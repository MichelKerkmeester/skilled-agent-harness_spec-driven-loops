---
title: "Goal: Phase 3: stale-jev-canary"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/003-stale-jev-canary"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-003-stale-jev-canary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: stale-jev-canary

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every compiled-routing hub canary pass by removing the cli-external case for a transport that now lives in the cli-classifier hub, from both the live fixture and its authored copy.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The case is deleted, not moved: the cli-classifier fixture already holds a case for the same prompt. |
| D2 | The live and authored fixture copies stay byte-identical. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs | tail -1`, run from the repository root, prints `all hubs failures 0`.
- [x] `grep -c 'jev-transport-single' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json`, run from the repository root, prints 0 for both files.
- [x] `diff .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json; echo $?`, run from the repository root, prints 0.
- [x] `node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1; echo $?`, run from the repository root, prints 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/003-stale-jev-canary --strict`, run from the repository root, prints RESULT: PASSED.
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
| Before numbers | Done | all-canaries: cli-external 15 cases, 1 failure; `all hubs failures 1` |
| Case removed | Done | cli-pi build; both files 14 cases, diff exit 0 |
| Chain | Done | `all hubs failures 0`; guard exit 0; `--check` exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Archived compiled gold left | `compiled/route-gold.typed.json` in the archive still lists the case. It is a historical build output, not an input the rebuild reads |
<!-- /ANCHOR:log -->
