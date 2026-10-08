---
title: "Goal: Phase 2: phase-scaffold-graph-metadata"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: phase-scaffold-graph-metadata

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the early exit in create.sh --phase mode and run graph-metadata derivation for parent and children before exit, so every phase scaffold passes strict validation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Call backfill-graph-metadata.ts for the parent and each child in create.sh --phase mode, before the original exit point |
| D2 | Refresh the parent's children_ids field from the newly created children directories |
| D3 | Add a --phase test case to scaffold-passes-its-own-gate.vitest.ts |
| D4 | Built in wave 1 by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D5 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D6 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] A phase parent scaffolded with --phase passes validate.sh --strict on GENERATED_METADATA_* rules (command: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent-path> --strict; exit status 0)
- [x] Each child of the parent passes validate.sh --strict on GENERATED_METADATA_* rules (command: for each child, bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child-path> --strict; exit status 0)
- [x] Parent's graph-metadata.json children_ids list contains all created children (command: node -e 'console.log(require("./graph-metadata.json").children_ids.length)'; count > 0)
- [x] scaffold-passes-its-own-gate.vitest.ts includes a --phase test case that creates parent with 2 children and validates all three (command: grep -n -e '--phase' <test-file>)
- [x] Full spec-kit test suite passes with no new failures (npm test in spec-kit directory)

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Backfill helper | Done | `backfill_graph_metadata` at `create.sh:885`; called from the phase block (`create.sh:1937`) and the root path (`create.sh:2034`) |
| Phase test case | Done | `scaffold-passes-its-own-gate.vitest.ts`: 6 passed; the phase case fails against HEAD `create.sh` |
| Phase scaffold check | Done | Throwaway `create.sh --phase` with two children: parent, `001-first` and `002-second` each `RESULT: PASSED` under `--strict`; `children_ids` lists both; folders removed |
| Cross-family review | Done | Luna round 1: two P2 findings, neither applied; reasons in `implementation-summary.md` |
| Full suite | Done | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` rc 0: 162 files passed, 1648 tests passed, 0 failed (baseline 161 files, 1639 passed) |
| Documents closed | Done | `validate.sh --strict` on this folder prints `RESULT: PASSED`; `check-goal.cjs` passes 5/5 |

### Deviations and findings

| Item | Note |
|------|------|
| Child loop removed, not reached | The old loop sat in the root path after the phase exit and never ran for `--phase`. The helper takes the children as arguments, so the loop was removed |
| One call for parent and children | The phase block makes a single helper call with the parent followed by the children, not a separate parent call |
| Helper defined ahead of the phase block | It sits in the helper section at `create.sh:885`, not in place of the old block |
| Suite numbers are wave wide | The full-suite run covers every wave 1 phase, so the delta against the baseline is not this phase alone |
<!-- /ANCHOR:log -->

---
