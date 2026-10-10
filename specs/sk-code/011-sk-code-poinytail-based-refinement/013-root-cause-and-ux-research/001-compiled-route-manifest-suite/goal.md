---
title: "Goal: Phase 1: compiled-route-manifest-suite"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/001-compiled-route-manifest-suite"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-001-compiled-route-manifest-suite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: compiled-route-manifest-suite

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the compiled-route rebuild trace every hub from its authored source and make the manifest suite pass on a clean checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The served runtime copy stays untouched; only the authored copy and the test change. |
| D2 | The test reads the expected hub count from `sync.HUBS` instead of a literal. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1; echo $?`, run from the repository root, prints 0.
- [x] `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs 2>&1 | grep -E '^ℹ (pass|fail)'`, run from the repository root, prints `ℹ pass 42` and `ℹ fail 0`.
- [x] `node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1; echo $?`, run from the repository root, prints 0.
- [x] `diff specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs; echo $?`, run from the repository root, prints 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/001-compiled-route-manifest-suite --strict`, run from the repository root, prints RESULT: PASSED.
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
| Before numbers | Done | `--check` exit 1; manifest 42 tests, 26 pass, 16 fail |
| Harness line deleted | Done | cli-pi build; `--check` exit 0, `all 7 hubs resolve`; manifest then 28 pass, 14 fail, every failure the 6-hub pin |
| Hub count derived | Done | cli-pi build; manifest 42 pass, 0 fail |
| Chain | Done | guard exit 0, all hubs fresh; `--verify` move-simulation OK, all 7 hubs |

### Deviations and findings

| Item | Note |
|------|------|
| Research correction | The research put 15 of 16 failures on the closure error. That error ran first and masked the hub-count pin, which then failed 14 tests on its own. Both causes were real, and both are fixed here |
| Move-simulation | In a scratch copy the move-simulation failed for every hub; in the real worktree it prints OK. The scratch failure came from the copy's location |
<!-- /ANCHOR:log -->
