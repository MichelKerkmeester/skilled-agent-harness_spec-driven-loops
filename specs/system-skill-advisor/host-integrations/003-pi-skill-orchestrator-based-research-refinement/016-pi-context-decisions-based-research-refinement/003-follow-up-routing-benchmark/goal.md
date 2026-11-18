---
title: "Goal: Follow-Up Routing Benchmark with Floor Counter"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "follow-up routing benchmark goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark"
    last_updated_at: "2026-11-18T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phases 002 and 004 are complete"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Follow-Up Routing Benchmark with Floor Counter

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure whether weak follow-ups route away from the session task on the confidence floor, and guard against them only when a rule fixed in advance says so.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The measurement lives in `runtime/bench/scorer-calibration.bench.ts`, with no diagnostics-schema or baseline change |
| D2 | The decision rule in `spec.md` section 4 is fixed before the first bench run |
| D3 | The flag pass-through and the guard are built only on a ship decision. Stored route receipts stay out of this phase |
| D4 | Built by the parent's Luna swarm with the Vibe fallback, in the waves `../delegation-strategy.md` section 4 gives this phase. The three bench briefs run in series on one file, and the conductor applies the decision rule |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` exits 0 from the advisor runtime folder and prints the floor counts and the `advisor-follow-up-routing` line - evidence: phase 012 run exited 0 and printed `advisor-scorer-calibration` with the floor counts and `advisor-follow-up-routing`
- [x] `implementation-summary.md` records `N`, `H`, `C`, `Hsame`, the ids of the `C` rows and the branch of the rule taken - evidence: `rg -n 'Decision rule outcome'` prints line 80, `N` = 9, `H` = 5, `C` = 19, branch over-suppresses
- [x] On a ship decision only, `npx vitest run tests/hooks tests/schemas tests/handlers` exits 0 from the advisor runtime folder - evidence: not applicable, the rule took over-suppresses (`implementation-summary.md:80`); the same command still exited 0 in phase 012 with 379 passed
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED` - evidence: phase 012 run after the metadata repair printed `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18 |

### Deviations and findings

| Item | Note |
|------|------|
| Pass-through moved behind the gate | The brief listed it first. The bench does not need it, so it is built only when the guard ships |
| The simple guard has collateral | Planning probes show a full refactor task meets the guard condition. The rule counts that as `C` |
<!-- /ANCHOR:log -->
