---
title: "Goal: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pivot hygiene goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-pivot-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the divergent pivot's limits mean what they say: a seat cap with a stated scope, no guard that can never fire, and one retry for a transient council failure.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The seat-cap and retry tasks wait for `decision-record.md` ADR-001 to be Accepted. |
| D2 | `minRemainingIterations` stays readable in configs and persisted limits; only its unreachable check goes. |
| D3 | `council_agreement_failed` is never retried unless the operator widens it in ADR-001. |
| D4 | The retry is attempt 2 of the same pivot: seat ids stay `seat-001` to `seat-003`, attempt 1 keeps today's event ids and paths, and attempt 2 gets its own. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts` exits 0 with the new retry, attempt-identity, scoped-count, agreement and persisted-limit cases.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npm run typecheck` exits 0.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0 after both compiled contracts are regenerated.
- [x] `rg -l 'maxCouncilSeatOutputs' .skilled/skills/system-deep-loop/changelog` lists a changelog entry that states the per-attempt meaning.
- [x] `rg -l 'retry' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council` lists a retry scenario written through `/create:manual-testing-playbook`.
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
| ADR-001 operator decision | Done | 2026-11-17: 3 seat outputs per council attempt, at most one retry, so at most 6 per pivot (`decision-record.md` OD-001, OD-002) |
| Session save | Done | operator decisions written to decision-record.md |
| Baseline (T002) | Done | 2026-11-17, worktree 464 on integration tip `c898b3ad9a3`: `npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` 5 files, 50 passed; `npm run typecheck` exit 0 |
| T003, T004, T006 | Done | Go dispatches; divergent-pivot + CLI + multi-seat suites 28 passed, typecheck 0 |
| T005, T007-T013, T016, T017 | Done | 2026-11-17: the T002 suites plus `divergent-pivot-seat-scope.vitest.ts` 6 files, 61 passed (50 baseline + 11 new); typecheck 0; YAML suites pass; `check-contract-drift.cjs` OK. Criteria 1-4 checked. Criteria 5 and 6 (changelog, playbook) wait for @markdown in integration after merge |
| Playbook, changelog and catalog | Done | DLR-062 scenario, `changelog/v2.1.4.0.md` (system-deep-loop 2.1.4.0), and the two divergent catalog pages naming the one-time quorum retry. Both grep criteria are met, and the runtime playbook validator reports 0 violations |

### Deviations and findings

| Item | Note |
|------|------|
| Plan review 2026-11-17 | `../scratch/fable-5-2-plan-review.md` F012-1 to F012-3, X-1, X-4, X-7 and F014-2 applied: seat counting in both pivot scripts, the attempt identity for event ids, seat paths and the persisted config, the retry test moved to `divergent-pivot.vitest.ts`, both contracts regenerated, changelog and playbook tasks, decision leftovers fixed. No X-2 task: no agent changes. |
| Retry scope | Parent section 20 Slice L says one retry for `council_*` refusals. This phase retries only the three quorum failures (`failureReasonForQuorum`, `divergent-pivot.ts:719-728`), because agreement failure is a verdict, not a transient error. |
<!-- /ANCHOR:log -->
