---
title: "Goal: Phase 18: dsh-single-executor-hardening"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh single executor hardening goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/018-dsh-single-executor-hardening"
    last_updated_at: "2026-11-14T11:27:25Z"
    last_updated_by: "scaffold"
    recent_action: "Planned the phase"
    next_safe_action: "Build the phase with /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-018-dsh-single-executor-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: dsh-single-executor-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make a single DeepSeek Harness lineage in deep review and research run clean, refuse where it cannot run and record what it did.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs and the files C6's chosen option adds there first. |
| D2 | Each fix sits where the fault is produced: the runner, the fan-out home helper, the reducer and the graph upsert, not the step that observed it. |
| D3 | Every executor kind other than the harness keeps today's stdout echo and env behavior. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] REQ-001 to REQ-003: the two named suites print `16 passed (16)` and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` (T009, T015)
- [ ] REQ-004 to REQ-007: the fan-out, reducer and upsert suites print no failure with three more tests passed (T016)
- [ ] REQ-008: the four version fields read `1.6.26.0` and the route guard prints `system-deep-loop            fresh` (T012, T018)
- [ ] REQ-009: C6 is built as chosen or recorded as deferred (T014)
- [ ] The full deep-loop suite shows only the known `fanout-pool.vitest.ts` timing failure and typecheck exits 0 (T017)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | 2026-11-14 at `1bedb33577`, baselines in `plan.md` section 5 |
| C6 choice | Pending | The operator picks Option A, Option B or defer from `spec.md` section 10 |
| Phase built | Pending | Seven items need no decision and can start |

### Deviations and findings

| Item | Note |
|------|------|
| Already fixed | Fable B-P1-1 and B-P1-2 and the timeout-margin half of B-P2-1 shipped in `1bedb33577`. The scaffold-docs half of B-P2-4 was closed in phase 017 |
| C8 cause corrected | The first reading blamed the coverage rule. The live graph read-only shows eight DIMENSION nodes for four dimensions and only `COVERS` edges, so the fix moved to the graph upsert |
| Dropped | The claim-adjudication miss at `review-report.md:202` sits in the orchestrator's matcher, and the run wrote a corrected event itself |
<!-- /ANCHOR:log -->
