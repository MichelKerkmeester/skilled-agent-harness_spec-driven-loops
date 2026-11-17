---
title: "Goal: Support custom review dimensions end to end (D10)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review dimension coverage goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive; awaiting the operator decision"
    next_safe_action: "Capture the REQ-004 baseline (T002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-review-dimension-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Support custom review dimensions end to end (D10)

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let a review run use its own dimension names from setup to stop, so no run can silently lose its clean stop and its pivot to a dimension name the loop does not know.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No implementation task starts until `decision-record.md` ADR-001 is Accepted. |
| D2 | Runs whose configured names are all canonical, the four-name default or any canonical subset, keep identical registries, dashboards, prompt packs and verdicts. |
| D3 | A custom name is supported on every surface that names the four (`spec.md` §3), not only in the reducer. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/divergent-pivot.vitest.ts` exits 0 with a case where a configured `performance` dimension is covered and the run reaches `all_dimensions_clean`.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts tests/unit/prompt-pack.vitest.ts` exits 0 with no fixture edits, and its pass count equals the baseline in this goal's log plus the new cases.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0 after the review compiled contract is regenerated.
- [x] `rg -n -i 'all (4|four) dimensions|four review dimensions' .skilled/skills/system-deep-loop/deep-review/references .skilled/skills/system-deep-loop/deep-review/README.md` prints nothing.
- [x] `/doctor:runtime-mirrors` reports all five `deep-review` agent mirrors in sync with `.skilled/agents/deep-review.md`.
- [ ] `rg -l 'performance' .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` lists a custom-dimension scenario written through `/create:manual-testing-playbook`.
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
| Phase docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `decision-record.md` |
| ADR-001 operator decision | Done | 2026-11-17: support custom dimensions (`decision-record.md` OD-001) |
| Session save | Done | operator decisions written to decision-record.md |
| Build 2026-11-17 (autonomous) | Done | Go lane, worktree 468, commits `45462106508` to `a762572c909`. Baseline: 8 suites 93 passed; the four REQ-004 suites 42. After: 100 and 48. Every custom case fails against the pre-change reducer. Contract drift OK, snapshot check OK, all agent mirrors in sync. Playbook and changelog wait for `@markdown` in integration. |

### Deviations and findings

| Item | Note |
|------|------|
| Review pivot test home | No review-pivot vitest suite exists today; the support branch adds its case to `divergent-pivot.vitest.ts`. |
| Plan review 2026-11-17 | `../scratch/fable-5-2-plan-review.md` F008-1 to F008-3, X-1, X-2, X-6, X-7 and F014-2 applied: every four-name surface added, contract regeneration, mirror sync, changelog and playbook tasks, the enforce-option rollback trigger replaced, task and REQ ids renumbered. |
<!-- /ANCHOR:log -->
