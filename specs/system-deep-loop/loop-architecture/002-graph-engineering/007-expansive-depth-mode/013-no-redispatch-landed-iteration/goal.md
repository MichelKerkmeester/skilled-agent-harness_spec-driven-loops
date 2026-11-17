---
title: "Goal: Stop redispatch_once from re-running an iteration that already landed"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "no redispatch landed iteration goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-013"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Stop redispatch_once from re-running an iteration that already landed

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A deep-loop iteration that already landed is never dispatched a second time because of a verify failure that only a landed iteration can return.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fix is a reason filter in both workflow YAMLs; `verify-iteration.cjs` is not changed. |
| D2 | The excluded reasons are `executor_missing`, `findings_not_enumerated` and `ledger_backing_missing`, the non-route-proof reasons returned after the delta check; route-proof reasons keep their redispatch as the one named exception, which the existing append-only verify case depends on. |
| D3 | No other slice is a prerequisite. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `grep -n 'redispatch_once:.*executor_missing, findings_not_enumerated or ledger_backing_missing'` prints one line in each of `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml`.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts tests/unit/loop-counters-derivation.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the new cases.
- [x] The YAML assertion in `verify-iteration.vitest.ts` fails against the pre-change YAMLs.
- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0.
- [ ] The `runtime/manual-testing-playbook` index lists a no-redispatch scenario written by `/create:manual-testing-playbook`.
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
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Baseline | Done | 2026-11-17 in worktree 466 at `c898b3ad9a3`: the four suites pass 108 in 4 files |
| Implementation | Done | `fd802c23af4` (skip clause in both rules plus the verify-iteration cases) and `f58d2e58872` (command notes, landed-then-error fixtures, both contracts regenerated). The four suites pass 115. The grep prints `deep-research.yaml:1683` and `deep-review.yaml:1772`. `check-contract-drift.cjs` prints `OK commands=2` |
| Fail before | Done | The YAML assertion printed `2 failed \| 43 passed` against the pre-change YAMLs |
| Playbook and changelog | Pending | Written by `@markdown` in the integration worktree after merge (T011, T012) |

### Deviations and findings

| Item | Note |
|------|------|
| Other post-delta reasons | Amended 2026-11-17 (D2 and the objective): `findings_not_enumerated` and `ledger_backing_missing` join `executor_missing`. Phase 006 makes the research `findings_not_enumerated` gate live, both reasons are returned after the delta check (`verify-iteration.cjs:533-550`, `:582-590`), and both leaf definitions refuse to overwrite a landed iteration or delta file, so a redispatch for them is wasted. `gateway_bypass_detected` is declared but never returned and is not named. Confirmed by the operator 2026-11-17 (`decision-record.md` ADR-001), which also closes the X-5 coupling with phase 006. |
| Open questions 2026-11-17 | Both `spec.md` §7 questions took their recommended defaults (`decision-record.md` OD-002): the route-proof redispatch is unchanged, and the still-fails error row keeps superseding the landed record. |
| Vibe child cannot run tests | The repository's Vibe hooks deny `node` and `vitest` inside the child, so each brief asked for the edit only, and the orchestrator ran every check. |
| Plan review amendments 2026-11-17 | Applied the Fable 5.2 plan review: shared literal clause because the two rules differ today; `command_note` lines updated; `stop-policy-yaml-parity` dropped from the test plan; a landed-plus-error-row fixture pins the still-fails consequence; test commands run from `runtime/`; both contracts regenerated; the playbook scenario goes through `/create:manual-testing-playbook`. |
<!-- /ANCHOR:log -->
