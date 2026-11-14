---
title: "Goal: Phase 20: command-offer-fit-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "command offer fit guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards"
    last_updated_at: "2026-11-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 and record the before numbers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-020-command-offer-fit-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: command-offer-fit-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Withhold a command from a prompt where no command fits, so the model keeps the skill path the prompt asked for, while every request that gets its command today keeps it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every gate fails toward no offer. A gate may remove a command or stop a command row from passing, and it never adds a command or changes a skill row. |
| D2 | A floor line that moves stops the task. No word list, pattern or score is tuned to restore a floor or to move a probe. |
| D3 | The two cases the ranker scores inside the range of real toolkit problems stay as they are and are named in the summary, because a bar raised for two probes is tuning on the probes. |
| D4 | No renderer, handler, plugin, corpus row, committed baseline or `AGENTS.md` wording changes in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed with more passed tests than the start commit.
- [ ] The command capture prints typed recall at least 24 of 44, false offers 0 of 35, typed delivery 44 of 44, a plain tune count equal to the start commit's and a sealed plain count under the fixture regime equal to the start commit's.
- [ ] `node scratch/planning/probe-offers.mjs`, run from the repository root by its path in this folder, prints 8 lines that hold `command=/`, and none of them names `/speckit:save`, `/deep:research`, `/doctor:update`, `/doctor:env` or `/doctor:speckit`.
- [ ] `git diff --name-only` against the start commit names seven files under `.skilled`, three in `runtime/lib` and four in `runtime/tests`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14, commit 16c9757ac0. Probes in `scratch/planning/` print 26 command lines, 9 of them doctor commands |
| Level | Decided | `recommend-level.sh --loc 260 --files 8` printed Level 1. Level 2 chosen because the closure gate is `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Review findings in scope | A-4, A-5 in part, A-6 in part, A-8, B-3 and the first half of B-9 |
| Left out, with the probe line | `/doctor:mcp debug` at ranker score 10.009 and `/doctor:helper` beside `sk-code` at 9.761 |
<!-- /ANCHOR:log -->
