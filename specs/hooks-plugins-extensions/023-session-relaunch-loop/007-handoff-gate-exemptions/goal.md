---
title: "Goal: Phase 7: handoff-gate-exemptions"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "handoff gate exemptions goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions"
    last_updated_at: "2026-10-19T11:46:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the live run 10 evidence and the verification state"
    next_safe_action: "Operator reviews the uncommitted worktree diff and decides on the home CLAUDE.md copy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: handoff-gate-exemptions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude, Pi or OpenCode session with no Gate 3 answer hands off near the context limit and finishes the work in a fresh session without an operator prompt, because the spec gate and the framework gate rules treat a relaunch handoff note as gitignored runtime state.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A write under `.skilled/skills/.state/` is exempt from the spec gate, except a concern's `README.md` directly under that folder, which stays gated. |
| D2 | The framework fix lives in the trigger text of AGENTS.md Gate 2 and Gate 3. The Gate 3 classifier and the sk-doc router do not change. |
| D3 | The repo `opencode.json` pins `llmgateway/deepseek-v4.1-flash` with variant `max` for the default model and for the `build` and `plan` agents. |
| D4 | The live proof is run 10 on Claude, Pi and OpenCode with no Gate 3 answer in the prompt. The Codex, Cursor, Devin and Hermes reruns are out of scope. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `spec-gate-core.test.mjs` ends with `fail 0` and exit 0, and its exemption test failed before the fix (AC-001, AC-002)
- [x] `AGENTS.md` line 70 and line 75 carry the runtime-state sentences (AC-003, AC-004)
- [x] `opencode.json` pins the default model and the `max` variant for `build` and `plan` (AC-005)
- [x] Run 10 shows zero operator prompts on Claude, Pi and OpenCode, and each handoff note reads `status: done` (AC-006 to AC-009)
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder and recursively for the parent
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
| Phase 007 docs authored (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`) | Done | This folder |
| Exemption test red, then green | Done | `spec-gate-core.test.mjs:896`. The red run showed an actual `deny` where `allow` was expected |
| Exemption in `spec-gate-core.mjs` | Done | `spec-gate-core.mjs:71`, `:1576` to `:1578` |
| AGENTS.md Gate 2 and Gate 3 sentences | Done | `AGENTS.md:70`, `:75` |
| `opencode.json` default model and variant | Done | `opencode.json:3`, `:6` to `:7`, `:10` to `:11` |
| Live run 10 on Claude, Pi and OpenCode | Done | `evidence/live-run10-2026-10-19/`, and the run folder `2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions` |
| Run folder, index row and three playbook pointers | Done | `benchmark/reports/README.md` and `manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md` |
| Parent phase row, parent binding rows and 006 pointers | Done | `../spec.md` phase map row 7, `../goal.md` section 2, and `../006-deep-review-2-remediation/spec.md` and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding table had no 006 row | Parent-and-nested-goals §3 step 6 requires one row per direct phase child. The parent `goal.md` gained both the 006 and 007 rows |
| Claude and OpenCode receiver answers come from captures taken before the wrapper exit | `sr-claude10-receiver-pane.txt` and `sr-oc10-receiver-pane.txt` hold the 248-line answers. The exit captures do not |
| The Pi gap is 113.6 s | The sending session re-read its note after the prepare line. The killer waited for idle as designed, so the gap is model time |
| The OpenCode leg of run 10 ran the repo default model | The operator asked on 2026-10-19 for DeepSeek V4.1 Flash max as the OpenCode default, so the leg launched without `-m` to prove it. Parent D7 amendment 3 records this. The Claude and Pi legs keep `gpt-6-luna` |
<!-- /ANCHOR:log -->
