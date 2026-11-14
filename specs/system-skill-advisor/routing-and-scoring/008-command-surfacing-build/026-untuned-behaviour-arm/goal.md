---
title: "Goal: Phase 26: untuned-behaviour-arm"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "untuned behaviour arm goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/026-untuned-behaviour-arm"
    last_updated_at: "2026-11-14T15:37:14Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 once phase 024 is Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-026-untuned-behaviour-arm"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 26: untuned-behaviour-arm

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** State from committed scripts, against a target fixed before the first session, whether models on six runtimes take the right workflow more often with the advisor on than off, on requests nobody tuned for.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every number comes from a committed script's output. No holdout prompt and no fresh prompt is printed. |
| D2 | The 36 fresh rows are written once by a blind author and frozen by hash at the first session. None is edited, replaced or removed after. |
| D3 | The target, the sign test and the miss rule are in the parent goal log before the first session. A miss is logged as not shown, with no rerun for its result and no tuning. |
| D4 | The arms differ only in the advisor switch: one arena commit per runtime, the same `AGENTS.md` text, the same models and the order off 1, on 1, off 2, on 2. |
| D5 | Every session runs in a throwaway arena with no remote and no credentials, and the sessions this phase starts stay at or under 900. |
| D6 | Every earlier summary field keeps its name and its value. New facts arrive as new fields. |
| D7 | The review and the step reader are read-only judgments and are never stated as printed numbers. B-5 and the B-6 edit are not built here. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed.
- [ ] `cmp` of the stored-arm summaries before and after the harness change prints nothing and exits 0, with and without `--pair pre,post`.
- [ ] `jq -c '.pooled | [.from, .to, (.p | type)]' scratch/summary-arm.json` prints `["off","on","number"]`.
- [ ] `git diff --numstat` of `behaviour-fresh-prompts.jsonl` against the freeze commit prints nothing, and the run logs under `scratch/runs/` hold at most 900 lines.
- [ ] `scratch/arm-evidence.txt` holds 12 lines that start with `followed`, 1 with `pooled`, 12 with `starts`, 12 with `delivery`, 2 with `floor` and 6 with `limit:`.
- [ ] The parent goal log holds the rows `Live brief cost`, `Fresh rows frozen`, `Arm target`, `Arm verdict`, `Step reader` and `B-5 trigger`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/026-untuned-behaviour-arm --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14 at 400c90e158. Design from the Fable decision report sections 1, 2, 5 and 6 and decisions P033 to P041 |
| Level | Decided | `recommend-level.sh --loc 750 --files 7` printed Level 1. Level 2 chosen because `acceptance-criteria.md` is the closure gate |
| Live brief cost | Pending | T001 runs first and gives a number or a decline |

### Deviations and findings

| Item | Note |
|------|------|
| Switch names | The report's `SKILL_ADVISOR_HOOK_DISABLED` and `SKILL_ADVISOR_PLUGIN_DISABLED` are read by nothing. The runner sets the `SYSTEM_` names itself (spec A2) |
| Review order | The short review runs before the arena build, not after the step reader, so a runner fault is found before 864 sessions are spent (spec A12) |
| Skill-only owners | Skill-only rows name one of the nine skills that own a command, because the scorer reads any other skill as no owner (spec A6) |
| Phase order | The parent handoffs read 024 to 026 to 025. Phase 025's own metadata still names 024 as its predecessor, outside this phase's write scope (spec A18) |
<!-- /ANCHOR:log -->
