---
title: "Goal: Forward the Claude config dir on single-executor research cli-claude-code dispatch"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "research claude config dir goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir"
    last_updated_at: "2026-11-17T14:34:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Forward the Claude config dir on single-executor research cli-claude-code dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A single-executor deep-research run on `cli-claude-code` runs under the configured Claude config dir, and a run with no configured dir behaves as it does today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The config-dir flag is optional on research and stays required on review. |
| D2 | Fan-out dispatch is not changed; it already routes the config dir (research §13 D2). |
| D3 | No other slice is a prerequisite. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `npx vitest run` over `cli-claude-code.vitest.ts`, `cli-matrix.vitest.ts` and `combo-matrix.vitest.ts` exits 0 with the new research config-dir cases.
- [ ] The new research config-dir case fails against the pre-change `dispatch-iteration.cjs`.
- [ ] `grep -n "claude-config-dir" .skilled/commands/deep/assets/deep-research.yaml` prints the `if_cli_claude_code` command line.
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
| Inherited `CLAUDE_CONFIG_DIR` with no configured dir | Open question: should research strip it? Not in scope, because stripping it changes every default research run. |
<!-- /ANCHOR:log -->
