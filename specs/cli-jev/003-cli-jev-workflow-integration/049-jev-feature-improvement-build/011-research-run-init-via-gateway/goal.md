---
title: "Goal: Fix: deep-research run open"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/011-research-run-init-via-gateway"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
      - ".skilled/commands/deep/assets/deep-research-confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Fix: deep-research run open

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the deep-research run open faults phase 048 recorded, so a deep-research fan-out runs without manual repair.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | Follow packet 039's pattern for deep-review, adapted to the research gateway's legacy upcaster |
| D2 | Fix at the producer: the workflow opens the run, not a repair of the guard |
| D3 | Runs opened before the change are not migrated |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `deep-research-run-open.vitest.ts` passes for both workflows and a fan-out lineage
- [x] `check-ledger-stem-producers.cjs` exits 0 with `deep_research.run_initialized` spoken
- [x] A real research run records its first iteration through the gateway with exit 0
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from 048's goal log |
| Build | Done | Luna on cli-codex, resumed once after the usage limit |
| Cross-family review | Done | DeepSeek on cli-pi: 0 P0, 1 P1 fixed (compiled contract), 2 P2 (temp dir fixed, lineage id recorded) |
| Real run (2026-10-03) | Done | `fanout-run.cjs`, one DeepSeek lineage, run `1791013368402-ajtzfh`, exit 0 in 2,383 s: config, iteration 1, synthesis_complete, no manual repair |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Compiled contract added to scope | Review P1: the workflow edits staled `compiled/deep-research.contract.md`. Regenerated with `compile-command-contracts.cjs --command deep/research --write` and added to Files to Change |
| Proof output not committed | The 1.7 MB proof run tree was moved to the session scratchpad. Its state log is kept as `scratch/run-open-proof-state.jsonl.txt` |
<!-- /ANCHOR:log -->
