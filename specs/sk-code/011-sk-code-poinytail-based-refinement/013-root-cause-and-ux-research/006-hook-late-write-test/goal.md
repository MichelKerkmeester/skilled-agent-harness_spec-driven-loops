---
title: "Goal: Phase 6: hook-late-write-test"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/006-hook-late-write-test"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-006-hook-late-write-test"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: hook-late-write-test

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Pin, with one test that fails when the behavior changes, that a short-deadline spec-kit hook drops a payload its host writes after the 500 ms deadline, and ship it as system-spec-kit 2.7.2.1.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The test pins today's behavior; whether a late payload should be kept is not decided here. |
| D2 | One build-segment bump of system-spec-kit for this phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs 2>&1 | grep -E '^ℹ (tests|fail)'`, run from the repository root, prints `ℹ tests 40` and `ℹ fail 0`.
- [x] `grep -c 'drops a payload its host writes after the deadline' .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`, run from the repository root, prints 1.
- [x] `sed -n 5p .skilled/skills/system-spec-kit/SKILL.md`, run from the repository root, prints `version: 2.7.2.1`.
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check 2>&1 | tail -1`, run from the repository root, prints `PASS: 70 Hermes skill copies in sync`.
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check >/dev/null 2>&1; echo $?`, run from the repository root, prints 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/006-hook-late-write-test --strict`, run from the repository root, prints RESULT: PASSED.
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
| Before numbers | Done | Suite 39 tests, 39 pass |
| Test added | Done | cli-pi build; suite 40 tests, 40 pass |
| Failing run | Done | Mutant with `writeDelayMs: 100`: 1 fail, actual `{"received":{"prompt":"late prompt"}}`, expected `{}`; mutant file deleted after the run |
| Version and changelog | Done | cli-pi builds; `version: 2.7.2.1`; changelog VALID, 0 issues |
| Derived artifacts | Done | Hermes sync wrote 1 of 70, `--check` PASS; trigger index regenerated, `--check` exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Failing-before shape | The test pins existing behavior, so it cannot fail before it exists. Its discriminating run is a mutant that writes the payload at 100 ms, inside the deadline, which fails the `{}` assertion |
| Version collision risk | Other tracks may also bump system-spec-kit. This phase took 2.7.2.1 from the local folder; the merge must renumber if another track took it |
<!-- /ANCHOR:log -->
