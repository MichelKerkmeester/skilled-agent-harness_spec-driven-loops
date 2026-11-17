---
title: "Goal: Phase 27: review-pass-four-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review pass four remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation"
    last_updated_at: "2026-11-14T16:35:20Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 once phase 024 is Complete and before any phase 026 task"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-review-pass-four-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 27: review-pass-four-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Close the defects review pass four confirmed, so a refused or questioned command carries no offer, every run line records where its offered command sat, and a shell read of a command document counts as a start, before phase 026 freezes any stored number.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every number comes from a committed script or a review probe's output. No holdout prompt is printed. |
| D2 | Each fix is test first: the new case fails for the reason its task names, then passes. |
| D3 | No floor, eval line or committed baseline moves without a recapture the coordinator records in the decision record. |
| D4 | In the rescore only start counts may move. A moved load, followed, workflow, `unsafe` or loop count is a finding. |
| D5 | A moved start figure is restated in a new goal log row that names its limits. No closed phase is edited. |
| D6 | Every earlier summary and run line field keeps its name and its value rule. New facts arrive as new fields. |
| D7 | Phase 026 starts only after this phase is committed, because it freezes the stored numbers this phase moves. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed.
- [ ] `cmp` of the floor, fit and eval files before and after the fix prints nothing and exits 0.
- [ ] `scratch/repro-after.txt` prints no refused command on the three or-list refusal lines and holds `HAS offeredAs`.
- [ ] `scratch/rescore-delta.txt` holds 23 start lines and 11 workflow lines, and every moved run names its rule.
- [ ] The parent goal log holds a row that starts its evidence with `tuned rows, one run each, no brief reached Codex` for each set whose start lines moved, and one `Review pass four, confirming round` row.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14 at 679bf511cd. Findings from `../review/verify-4/report.md`, scope set by the coordinator, decisions P042 to P051 |
| Level | Decided | `recommend-level.sh --loc 380 --files 17` printed Level 1. Level 2 chosen because `acceptance-criteria.md` is the closure gate |
| Reproductions | Done at planning | The three confirmed P1, the `is the` question, the heredoc end word and the Codex read path reproduced by the verifier's probes, outputs in the spec's Measured Behavior block |

### Deviations and findings

| Item | Note |
|------|------|
| README statement | `The /doctor:update command is documented in the README` gets `/create:readme (start)` from the `sk-doc` route vocabulary, which the mention fixes cannot reach. Recorded as a P2 gap (P047) |
| Weak-cue bar | Phase 020 states 10 where the code and its own evidence use 9. A superseding note in this spec, not an erratum (P048) |
| Phase order | The run order is 024, 027, 026, 025. Phase 025 tasks T003, T012 and CHK-040 quote two lines this phase corrects, outside this phase's write scope (spec A13) |
<!-- /ANCHOR:log -->
