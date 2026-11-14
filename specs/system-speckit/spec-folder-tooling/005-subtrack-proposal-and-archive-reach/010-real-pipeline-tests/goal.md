---
title: "Goal: Phase 10: real-pipeline-tests"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "real pipeline tests goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/010-real-pipeline-tests"
    last_updated_at: "2026-11-14T06:11:03Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied the plan verification of 2026-11-14"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-real-pipeline-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: real-pipeline-tests

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Add one suite that runs the relocation pipeline and a renumbering restore with the true writers, and that fails when a pipeline step is removed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No script under test changes in this phase. A defect the suite exposes is recorded in section 4 and raised to the operator. |
| D2 | The suite never writes to the real checkout. A writer that writes under its own location runs from a copy in the temp repository. |
| D3 | Every assertion reads a value a true writer wrote. The two stubbed suites keep their stubs. |
| D4 | The floor is one happy path and one edge case per surface. No case is added per branch. |
| D5 | No code comment names a spec path, a packet number or a finding id. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From `.skilled/skills/system-spec-kit/runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate-real-pipeline.vitest.ts` exits 0
- [ ] The same command exits 1 against a scratch copy of `relocate.mjs` with its call to `migrate-generated-json` removed
- [ ] The suite holds four cases: a map applied twice, a rerun after a late step failed once, a rerun after the identity step failed once and a renumbering restore
- [ ] `git status --porcelain -- specs .skilled/skills/sk-doc/shared/scripts .skilled/skills/system-spec-kit/runtime/data .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures` prints the same lines in the real checkout before and after the suite runs
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure absent from the baseline
- [ ] `validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` for the parent and all ten children
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
| Planning documents authored | Done | `spec.md`, `plan.md` and `tasks.md` in this folder, 2026-11-14 |
| The two stubbed suites before any change | Done | `relocate.vitest.ts` and `archive-track.vitest.ts`: `Test Files  2 passed (2)`, `Tests  77 passed (77)`, exit 0, 31.66 s, on 2026-11-14 |
| Implementation | Pending | Not started. Waits for the phase 006, 007 and 008 commits |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: writer inputs | Which files each true writer loads from outside its own folder, and whether it writes under the working directory or under its own location, is UNKNOWN. T002 lists both, and the list decides what the temp repository copies and what runs in place. |
| Open question: run time | How long one apply with the true writers takes is UNKNOWN. T003 measures it. |
| Finding by standing | A10 is the reviewer's inference from reading. T001 runs the mutation against the two existing suites before the new suite is written. |
| Plan verified 2026-11-14 | Verifier findings 10, 11 and 15 are applied. The guard now reads four paths. The verifier named two, `specs` and `.skilled/skills/sk-doc/shared/scripts`. The other two were added from reading `generate-trigger-index.mjs:93-96`, which places the trigger index and its sidecar files under `runtime/data` and `runtime/cli/retrieval/fixtures`. That reading was not run, and T002 confirms it. Without phase 006 a rerun after a failed redirect step exits 0 with `nothing to do`, so the resume case asserts the missing `ok` line and not the exit status. |
<!-- /ANCHOR:log -->
