---
title: "Goal: Phase 5: slow-and-failing-tests"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
    last_updated_at: "2026-10-23T14:15:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "002-rebuild-fanout-removal baseline pending; the 001 dataset stands in as provisional"
      - "runtime/cli/dist and the deep-loop and advisor trees are not installed in this worktree"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: slow-and-failing-tests

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Cut the spec-kit check job's slowest step by proving file parallelism safe and flipping or sharding the CLI vitest project, and turn the three workflows' stale failure counts into a current, root-caused signal without adding a retry.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The probe runs on a copy of the config that differs at one setting, and the copy is deleted before the real file is touched. |
| G2 | Only the `cli` project flips. The root project and the other three `fileParallelism` sites stay serial. |
| G3 | The fallback is a two-way shard inside the existing step, with both halves' status propagated. No job count or check name changes. |
| G4 | The setting's comment states behaviour, never a packet id, an R-id or a phase number. |
| G5 | The failure counts are re-pulled at execution time; the research phase's numbers are a sanity check, not a source. |
| G6 | Causes are fixed. No retry, rerun or `continue-on-error` is added, and a failed run is never rerun to manufacture a streak. |
| G7 | A workflow that stays red gets a filed root cause naming the test, the class and the first failing SHA. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -cE '^outcome: (parallel|shard)$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md` returns `1`
- [ ] `test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts` exits `0`
- [ ] `grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.ts` returns `1`, or `grep -c -- '--shard=' .github/workflows/spec-kit-check.yml` returns `2`
- [ ] `grep -c '^all_green: true$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md` returns `1`
- [ ] `grep -c '| closed |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` returns `5`
- [ ] `grep -cE '^(deep-loop-runtime|diagram-corpus|skill-advisor-stress): all_green=true count=10$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` returns `3`
- [ ] `grep -c 'check-contract-drift' .github/workflows/deep-loop-runtime.yml` returns `1`
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
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T040, `acceptance-criteria.md` AC-001 to AC-011, `decision-record.md` ADR-001 to ADR-010 |
| Probe | Pending | `scratch/r19-probe.md` is not written |
| Config flip or shard | Pending | `vitest.config.ts:67` still reads `fileParallelism: false` |
| Re-check | Pending | `scratch/r21-recheck.md` is not written |
| Implementation | Pending | No file named by `tasks.md` has changed |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
