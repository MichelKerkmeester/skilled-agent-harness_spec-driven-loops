---
title: "Goal: Apply the configured review minIterations floor in convergence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review min iterations floor goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor"
    last_updated_at: "2026-11-17T14:34:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Apply the configured review minIterations floor in convergence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A deep-review run never stops before its configured `minIterations` floor, and a run with the shipped floor of 2 stops exactly where it does today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The proving case uses a floor above 2; no iteration-1 case is written, because real loop state cannot produce one. |
| D2 | The shipped floor value in `deep-review-config.json` is not changed. |
| D3 | No other slice is a prerequisite. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `npx vitest run` over `review-depth-convergence.vitest.ts` and `review-stop-path-replay.vitest.ts` exits 0 with the configured-floor case.
- [ ] The configured-floor case fails against the pre-change `convergence.cjs`.
- [ ] `grep -n "loopType === 'research' && minIterations" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` prints nothing.
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
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17; implementation not started |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No deviation from the directive recorded. |
<!-- /ANCHOR:log -->
