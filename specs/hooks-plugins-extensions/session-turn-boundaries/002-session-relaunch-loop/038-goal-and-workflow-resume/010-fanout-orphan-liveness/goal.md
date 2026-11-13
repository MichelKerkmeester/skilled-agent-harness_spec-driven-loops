---
title: "Goal: Phase 10: fanout-orphan-liveness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout orphan liveness goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness"
    last_updated_at: "2026-11-13T09:00:00Z"
    last_updated_by: "planner"
    recent_action: "Planned the phase from research section 9 rank 2 and the code"
    next_safe_action: "Wait for the operator's go-ahead, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-fanout-orphan-liveness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: fanout-orphan-liveness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A fan-out re-run never starts a second process for a lineage whose recorded process is still alive, while a lineage whose process is gone is requeued as today.

### Decisions

Frozen choices. Changing one is an amendment. The parent packet's decisions bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The operator's constraint holds: nothing is built until the operator gives the go-ahead. |
| D2 | The double writer is reproduced first, in a `mkdtemp` root with the adapter shim, never in a real packet. If it does not reproduce, the phase changes no code. |
| D3 | A live label refuses the whole re-run with exit 3, before any orphan mark or dispatch. Skipping only the live label is ruled out, because the merge would read a lineage still being written. |
| D4 | The pid comes from a new `spawned` ledger row written in `onSpawn`, after the spawn. The `started` row stays as it is, because it fires before the spawn and has no pid. |
| D5 | Liveness probes the process group first, then the pid, with signal 0. `EPERM` counts as alive. A label with no `spawned` row is never live, so old ledgers behave as today. |
| D6 | Test first. Each must-fail test holds a recorded failing run before its source edit. |
| D7 | Four files change: `fanout-pool.cjs`, `fanout-run.cjs`, `tests/unit/fanout-pool.vitest.ts` and `tests/stress/cli-adapter/fanout.vitest.ts`. Signal handling and the nudge text stay out. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c 'alive=true' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/scratch/repro.txt` prints 2, recorded before any source edit.
- [ ] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/observability-events.vitest.ts tests/stress/cli-adapter/fanout.vitest.ts` exits 0.
- [ ] `rg -n 'second runner exit=3' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/scratch/repro-after.txt` prints 1 line.
- [ ] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/acceptance-criteria.md` prints 9.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | 2026-11-13: spec, plan, tasks, criteria and goal written from `research/research.md` sections 3, 7 and 9 and from the code lines cited in `spec.md` |
| Unit baseline | Done | 2026-11-13: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` printed `Tests 37 passed (37)` |
| T001 reproduction | Pending | Waits for the operator's go-ahead |
| Build | Pending | No test or source change yet |

### Deviations and findings

| Item | Note |
|------|------|
| The mark does not gate dispatch | The research reads the gap as a re-run that requeues a live lineage. The code is wider: `markOrphanedLineages` (fanout-run.cjs:3520) only writes `orphan_requeued` rows and charges a retry, and the run then dispatches every lineage (fanout-run.cjs:3478). So skipping a live label in `detectOrphanedLineages` alone would not stop the second writer. The plan adds the refusal in `fanout-run.cjs` (D3), which is a change outside the function the brief names |
| No pid-carrying record exists today | The research says the pid could come from "the pool's later liveness records". Those records live only in the in-memory map at fanout-run.cjs:3921 and die with the runner. The only ledger row with a pid is a post-exit orphan failure (fanout-pool.cjs:606), which is terminal. So the plan adds the `spawned` row (D4) |
| Pid reuse | Answered by the operator on 2026-11-13: "Refusal only". A refusal that names the label and the pid is enough, and no override is built |
<!-- /ANCHOR:log -->
