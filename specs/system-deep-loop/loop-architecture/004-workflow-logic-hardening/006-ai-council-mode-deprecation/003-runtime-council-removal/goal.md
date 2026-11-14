---
title: "Goal: Phase 3: runtime-council-removal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "runtime council removal goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/003-runtime-council-removal"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-split-003-runtime-council-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: runtime-council-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove every council file the divergent pivot does not read from the deep-loop runtime, and keep the pivot, the suite and the typecheck passing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `runtime/lib/council/multi-seat-dispatch.cjs`, its test and the `pathContainsAiCouncil` guard stay. The divergent pivot logic is not edited. |
| D2 | Every other council file in the `plan.md` D4 table is removed only after its named caller check prints nothing. |
| D3 | A shared library loses its council member and keeps its research and review entries unchanged. |
| D4 | Every deleted file is tracked and reverts through `git revert`. Untracked council graph databases stay on disk. |
| D5 | The suite is compared with the start numbers in `../scratch/gate-baseline.md`, and only tests of removed code are deleted. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0.
- [ ] `ls .skilled/skills/system-deep-loop/runtime/lib/council` prints `README.md` and `multi-seat-dispatch.cjs` only.
- [ ] `git ls-files .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts` prints nothing.
- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` with `--loop-type council` prints an `INPUT_VALIDATION` error starting `loopType must be` that does not name `council`.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test && npm run typecheck` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
| Child docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14 when phase 006 was split into five children. Implementation has not started. |

### Deviations and findings

| Item | Note |
|------|------|
| Ids carried from the parent | Task, requirement, criterion and checklist ids keep the numbers they had in phase 006 before the split, so this child's ids do not start at 001. |
<!-- /ANCHOR:log -->
