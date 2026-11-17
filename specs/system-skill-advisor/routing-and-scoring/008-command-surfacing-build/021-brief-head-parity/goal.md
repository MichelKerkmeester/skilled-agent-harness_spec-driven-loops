---
title: "Goal: Phase 21: brief-head-parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "brief head parity goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity"
    last_updated_at: "2026-11-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 and record the before numbers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-021-brief-head-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 21: brief-head-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give every runtime's model the same brief head for the same prompt, with a policy word on every printed command and no command or row id it could misread.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The head row is fixed in the recommend handler, the producer every runtime shares. The OpenCode plugin sends `compiledRouteTopOnly`, the option every hook already sends, so the partner row is the same too. No option is invented for one runtime. |
| D2 | No head wording changes. The strings around the label stay as measured, and a wording change waits on the operator with the behaviour arm decision. |
| D3 | A higher plain tune count is reported as a gain and the committed baseline is recaptured by the coordinator with its own script. A lower floor stops the task. |
| D4 | No scorer file, attach module, corpus row or `AGENTS.md` wording changes in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed and `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reports `fail 0`.
- [ ] The two-path head probe `scratch/planning/probe-heads.mts` in this folder prints `same head: true` for all 17 prompts and no line that holds `command-doctor-`.
- [ ] No probe line ends with an `Also:` command that has no policy word in parentheses, and no line prints `Also: /doctor:update`.
- [ ] The command capture prints typed recall at least 24 of 44, false offers 0 of 35, typed delivery 44 of 44, and a plain tune count and a sealed plain count not below the start commit's.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14, commit 16c9757ac0. `scratch/planning/probe-heads.before.txt` prints `same head: true` 13 times and `same head: false` twice |
| Level | Decided | `recommend-level.sh --loc 220 --files 9` printed Level 1. Level 2 chosen because the closure gate is `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Review findings in scope | A-2, A-3 through the handler, A-7 and the second half of B-9 |
| Found by the planning probe | OpenCode prints `use command-doctor-sk-skill-convert 0.95/0.12 pass.` when the first CLI row does not pass |
| Not reproduced | B-10: the head reads `use sk-doc → /create:agent (start)`, the owning skill first |
| Waiting on the operator | B-5, the head wording, and B-6, the Gate 2 policy sentences in `AGENTS.md` |
<!-- /ANCHOR:log -->
