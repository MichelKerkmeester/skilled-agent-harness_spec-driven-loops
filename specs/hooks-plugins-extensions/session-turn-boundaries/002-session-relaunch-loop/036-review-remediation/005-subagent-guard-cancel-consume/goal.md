---
title: "Goal: Phase 5: subagent-guard-cancel-consume"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "subagent guard cancel consume goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/005-subagent-guard-cancel-consume"
    last_updated_at: "2026-11-12T13:02:34Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after one follow-up pass and an SWE review"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: subagent-guard-cancel-consume

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deny `cancel` and `consume` to a Claude sub-agent so it cannot withdraw or consume its parent's prepared hand-over.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `cancel` and `consume` join `claim`, `complete`, `keep` and `prepare` in `LIFECYCLE_COMMAND` at `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18`. |
| D2 | The denial text and the rest of the guard stay as they are, so the change is one regular expression and its test. |
| D3 | A call is denied only when the payload is a Bash call with a non-blank `agent_id`, which keeps the main session and read-only commands unaffected. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -n 'LIFECYCLE_COMMAND' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints line 18 with `(claim|complete|keep|prepare|cancel|consume)`.
- [x] `node --test --test-name-pattern 'denies cancel' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [x] `node --test --test-name-pattern 'denies consume' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [x] `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with no failing case.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume --strict --quiet` prints `RESULT: PASSED`.
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
| Phase 5 planning documents | Done | Five files written in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume` on 2026-11-12. The measured behavior is the `rg -n 'LIFECYCLE_COMMAND'` output in `spec.md` |
| Build, two passes | Done | DeepSeek V4.1 Flash at max through OpenCode Go. `scratch/red.txt` and `scratch/red-2.txt` hold the failing runs, `scratch/green.txt` the passing file (14 tests, 14 pass, 0 fail) |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: PASS with two P2. One fixed in the second pass, one recorded as a limitation |
| Suites | Done | Relaunch suite 855 of 855, OpenCode plugin 65 of 65, Pi 59 of 59, each exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Scope grew by one command | The review found `hand-over` open to a sub-agent. It writes a hop-history line and fires a notice, and only the wrapper calls it. REQ-005 adds it. The comment above the check was reworded to name every denied verb, although the plan froze it. The denial text stays as it is. |
| Builder changed | The operator asked on 2026-11-12 for DeepSeek V4.1 Flash at max through OpenCode Go as the worker, so this phase was not built by Luna. SWE still reviewed. |
<!-- /ANCHOR:log -->
