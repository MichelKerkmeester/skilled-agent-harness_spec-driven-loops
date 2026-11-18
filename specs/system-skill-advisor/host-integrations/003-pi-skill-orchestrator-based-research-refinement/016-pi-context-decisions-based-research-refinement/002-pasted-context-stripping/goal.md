---
title: "Goal: Pasted-Context Stripping Before Scoring"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pasted context stripping goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/002-pasted-context-stripping"
    last_updated_at: "2026-11-18T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 by re-running the probe pair"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Pasted-Context Stripping Before Scoring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A task that follows a pasted earlier reply routes the same as the task alone, on every runtime.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One stripping rule, in `runtime/lib/prompt-policy.ts`, called in the recommend handler before the embedding and cache key, and at the entry of `scoreAdvisorPrompt` |
| D2 | No change to the hooks, the OpenCode plugin or the Python local scorer |
| D3 | One new row in `labeled-prompts.jsonl`. Each baseline it moves changes by that row only |
| D4 | Built by the parent's Luna swarm with the Vibe fallback, in the waves `../delegation-strategy.md` section 4 gives this phase. The conductor fixes the function name before wave 1 and runs every check |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The Measured Behavior command in `spec.md` prints `sk-code` first on both lines, from a daemon started after the rebuild
- [ ] `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` exits 0 from the advisor runtime folder
- [ ] The new corpus row routes `sk-doc` before the change and `sk-code` after it
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Placement differs from the brief | The brief named `runtime/lib/skill-advisor-brief.ts`. No runtime hook reaches that file, so the plan strips in the recommend handler and at the scorer entry. `plan.md` section 3 holds the evidence |
<!-- /ANCHOR:log -->
