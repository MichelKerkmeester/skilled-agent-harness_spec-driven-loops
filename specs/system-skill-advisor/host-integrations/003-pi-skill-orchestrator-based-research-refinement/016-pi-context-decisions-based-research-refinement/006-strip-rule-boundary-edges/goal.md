---
title: "Goal: Strip-Rule Boundary Edges"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "strip rule boundary edges goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/006-strip-rule-boundary-edges"
    last_updated_at: "2026-11-18T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 003 is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Strip-Rule Boundary Edges

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The advisor drops a pasted earlier reply only when an attribution header shows it is one, drops all of it and keeps the user's own text, with every case held in one fixture both scorers can read.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The exported name `stripLeadingPastedReply` and its call sites in the handler, the scorer entry and the bench do not change |
| D2 | A leading `>`, `"` or `“` is not a cue by itself. A cue is an attribution header, and `assistant` or `claude` followed by `response`, `reply` or `answer` counts as one |
| D3 | The plan does not pick first-marker or last-marker. Fewer failing fixture rows decides, then no new corpus strip, then the miss that keeps the ideal top skill. A tie after that goes to the operator |
| D4 | Every strip case lives in `runtime/tests/fixtures/pasted-reply-strip-cases.json`. The row the chosen rule misses keeps its ideal text in an `ideal` field and is named in the summary |
| D5 | The fixture test lands and fails on its five rows before the rule changes |
| D6 | Built by the parent's Luna swarm with the Vibe fallback. The conductor runs every check. Baseline files change only if routing moves, and then only through their own capture scripts after a rebuild |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts` exits 0 from the advisor runtime folder with all 17 fixture rows included
- [x] After the advisor build, `node specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/006-strip-rule-boundary-edges/scratch/count-corpus-strips.mjs` from the repository root prints `"jsonlChanged":["rr-paste-208"]` and `"harderChanged":[]`
- [x] `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` from the advisor runtime folder exits 0 and prints `"N":9` and `"H":5`
- [x] `rg -n 'Marker rule' specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/006-strip-rule-boundary-edges/implementation-summary.md` from the repository root prints one line naming the chosen rule and its remaining miss
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18. Measurements in `spec.md` Measured Behavior |
| Phase built | Done | `POLICY` 23 of 23; `COUNT` unchanged (`rr-paste-208` only, harder 0); `BENCH` N 9, H 5; summary line names last-marker and `two-markers-in-user-task`; strict validation `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Marker candidates tie on tests and corpus | Measured 2026-11-18: each misses one marker row and neither strips a new corpus prompt. The tie-break in `plan.md` section 3 was added so the plan still does not pick |
| Parent phase-map wording | The parent row for this phase says a task marker inside the reply no longer cuts early. That holds only if last-marker wins. If first-marker wins, phase 012 amends the row |
| Quote-led rows | Two rows were added beyond the brief, `quote-led-straight` and `quote-led-curly`, to pin D2. The shipped rule strips both, so the red run fails five rows, not three |
<!-- /ANCHOR:log -->
