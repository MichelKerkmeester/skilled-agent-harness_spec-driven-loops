---
title: "Goal: Phase 18: create-sh-unknown-options"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "create sh unknown options goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options"
    last_updated_at: "2026-10-11T15:00:00Z"
    last_updated_by: "create-sh-unknown-options-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-018-create-sh-unknown-options"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: create-sh-unknown-options

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** create.sh refuses an option it does not know, before it writes anything, instead of adding it to the spec folder title.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One unknown-option error exiting 1; no alias for `--goal` and no did-you-mean table |
| D2 | A caller that passed a flag the parser lacks is fixed only when the flag was a silent bug; the parser is never widened to accept it |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --goal "X"`, run from the repository root, exits 1 and prints `Error: unknown option '--goal'` on stderr.
- [ ] `npx vitest run --config ../../vitest.config.ts --project cli tests/create-root-numbering.vitest.ts tests/create-track-refresh.vitest.ts tests/create-without-build.vitest.ts tests/create-unknown-options.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime/cli`, reports 4 test files and 32 tests passed.
- [ ] `grep -rn -- '--phase-count' .skilled/skills/system-spec-kit/manual-testing-playbook .skilled/skills/system-spec-kit/feature-catalog`, run from the repository root, prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options --strict`, run from the repository root, prints RESULT: PASSED.
- [ ] `git status --short`, run from the repository root, prints nothing.
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
| Caller sweep | Done | Commands, runtime and tests pass only parser flags; the literal-naming playbook scenario and catalog entry passed `--phase-count` |
| Fix | Done | `-?*)` branch above the catch-all; `create.sh --goal "My feature"` exits 1 with the error |
| Tests | Done | Old script: edge test fails, 1 of 2. Fixed script: create set 4 files, 32 tests passed, baseline 3 files, 30 tests |

### Deviations and findings

| Item | Note |
|------|------|
| Executable bit | The builder's write dropped create.sh from mode 755 to 644; the orchestrator restored 755 before testing |
| Dash-led titles | No caller passes a title starting with a dash, so refusing one is safe; a lone `-` still reads as title text |
<!-- /ANCHOR:log -->
