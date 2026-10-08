---
title: "Goal: Phase 5 healer-phrase-seeding"
description: "Stop heal-spec-docs.cjs from writing trigger phrases that phrase-judge rejects as template defaults."
trigger_phrases:
  - "phase 5 healer phrase seeding goal"
  - "packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts"
      - ".skilled/skills/system-spec-kit/runtime/package.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.d.mts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5 healer-phrase-seeding

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop the upgrade path from writing any trigger phrase that phrase-judge rejects: heal-spec-docs refills an empty list from the slug seeder, and fill-frontmatter's `inferTriggerPhrases` emits only admissible phrases.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | An empty trigger_phrases list is refilled with the exact output of `seededPhrases` in template-phrase-cleanup.mjs. It is never left empty and never filled from template defaults |
| D2 | TEMPLATE_DEFAULTS is deleted from heal-spec-docs.cjs, not pinned in a test |
| D3 | Scope covers `inferTriggerPhrases` in frontmatter-migration.ts, and the upgrade test checks every negative judge class |
| D4 | Built in wave 1 by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D5 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D6 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -c TEMPLATE_DEFAULTS .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` prints 0
- [x] A create-root-numbering.vitest.ts case shows heal-spec-docs refills an empty list with exactly the `seededPhrases` output, Vitest exit code 0
- [x] An upgrade-legacy.vitest.ts case runs `--apply` on a fixture with an empty list and a missing key, and `judgeTriggerPhrase` returns null for every written phrase, Vitest exit code 0
- [x] `grep -n "'memory', 'indexing', 'context'" .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` finds nothing
- [x] `validate.sh --strict` on this packet prints RESULT: PASSED

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
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all completed; repair-derived and goal checks passed after goal.md creation |
| Healer refill from the slug seeder | Done | `TEMPLATE_DEFAULTS` gone (`grep -c` prints 0), `seededPhrases` exported, healer loads it with `require()` |
| `inferTriggerPhrases` filter | Done | Filters through `judgeTriggerPhrase`, fallback removed, returns `undefined` when nothing is admitted |
| Compiled-import fix | Done | Package export, `phrase-judge.d.mts` and package-path import; typecheck rc 0, build rc 0, the dist module imports |
| Healer pin test | Done | create-root-numbering.vitest.ts: 14 passed |
| Upgrade grade test | Done | upgrade-legacy.vitest.ts: 18 passed; rerun of both files 32 passed, rc 0 |
| Cross-family review | Done | Luna round 1: one P1 (grade loop skipped tasks and summary), fixed and passing |
| Wave 1 final gates | Done | cli suite rc 0 with 1,648 passed against a 1,639 baseline; `run check` rc 0; hook tests 184 run, 0 fail |
| Validate changes | Done | `validate.sh --strict` prints `RESULT: PASSED`; `check-goal.cjs` passes |

### Deviations and findings

| Item | Note |
|------|------|
| Empty-list policy decided | 2026-10-08, the operator chose to refill from the slug seeder. Recording the list as unknown was considered because it writes nothing, and rejected because the document could never be found by its own phrases. An earlier D1 had frozen "record as unknown" without an operator decision; it is replaced |
| Pin scope decided | 2026-10-08, the operator chose to delete TEMPLATE_DEFAULTS rather than pin it, which removes the old conflict with the pin-test criterion |
| Scope widened | 2026-10-08, the operator added `inferTriggerPhrases`, which writes single title tokens and a `memory`, `indexing`, `context` fallback the judge rejects |
| Compiled build broke on the judge import | The orchestrator found `ERR_MODULE_NOT_FOUND` for `dist/retrieval/lib/phrase-judge.mjs`: the first version imported the `.mjs` by a relative path. Fixed with a `runtime/package.json` export, a `phrase-judge.d.mts` file and a package-path import. Both files are now in spec.md Files to Change, and tasks.md carries T016 for them |
| Seeder loaded with `require()` | The plan said dynamic `import()`. `require()` works because the seeder has an `isDirectRun` guard and no top-level await, and the real healer runs under the pin test. Recorded in spec.md section 10 |
| llmgateway route failed on the upgrade test | D4 named the LLM Gateway route. The T015 brief failed there with the API error "reasoning_content in thinking mode must be passed back" and wrote nothing, so it was rerouted to the other DeepSeek lane (logged as DSO) under the parent goal's D7. The rest of the phase stayed on the planned route |
| Review fix applied | Luna's P1 showed the grade loop covered only spec and plan; the fixture now adds `implementation-summary.md` with an empty list and the loop grades all four document types |
| Another rejected-phrase writer | `scaffold-debug-delegation.sh` writes `debug`, `delegation`, `scaffold` and `task <id>`, three graded `single-token`. It is not on the upgrade path, so it is recorded as a follow-up, not fixed here |
| plan.md left unsynchronized | plan.md still says "dynamic `import()`" and its Definition of Ready and Done boxes are unticked; it was outside the closing file list, so CHK-040 in tasks.md stays open |
<!-- /ANCHOR:log -->

---

