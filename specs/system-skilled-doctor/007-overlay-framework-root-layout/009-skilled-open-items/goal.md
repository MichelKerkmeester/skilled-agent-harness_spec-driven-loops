---
title: "Goal: Phase 9: close the four Skilled-side open items of the overlay layout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "skilled open items goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/009-skilled-open-items"
    last_updated_at: "2026-11-20T16:45:56Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-skilled-open-items"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: close the four Skilled-side open items of the overlay layout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Each of the four Skilled-side open items of the overlay layout is confirmed and fixed at its source with a test, or rejected with evidence, and the fixes are merged on local Skilled main.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Code changes are built on `worktrees/481-overlay-framework-root-layout` and merged into local Skilled main; nothing is pushed. |
| D2 | Each item is a hypothesis: it is confirmed before it is fixed, and a narrower or false one is recorded with the evidence. |
| D3 | Any new deep-loop runner input is optional, and absent means today's behavior. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 on Skilled main with more than 262 tests.
- [x] `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` exits 0 on Skilled main with more than 93 tests.
- [x] The system-deep-loop fan-out and terminal-gate vitest files exit 0 on Skilled main with more than 178 tests.
- [x] `rg -n 'generate-context.js --json' .skilled/skills/sk-git/references/large-reorg-playbook.md` prints one line.
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`.
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
| Goal authored | Done | Planned with the phase scaffold on 2026-11-20 |
| Four fixes merged | Done | Local main merge `1ac1fba6a25`; engine 263/263, release-update 95/95, deep-loop 341/341 |

### Deviations and findings

| Item | Note |
|------|------|
| record-base hypothesis | Narrower than stated: a stale `FETCH_HEAD` was read after the fetch; the fetch into the project stays because check, align and apply need the pin's objects there |
| Playbook form | The proposed `--json '{"specFolder":...}'` form aborts with `INSUFFICIENT_CONTEXT_ABORT`; the line adds `sessionSummary` |
<!-- /ANCHOR:log -->
