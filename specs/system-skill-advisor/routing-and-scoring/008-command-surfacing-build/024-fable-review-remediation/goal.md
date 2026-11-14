---
title: "Goal: Phase 24: fable-review-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fable review remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/024-fable-review-remediation"
    last_updated_at: "2026-11-14T12:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 and T002, then lanes A and R"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-024-fable-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 24: fable-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Close the findings of the review of 2026-11-14, so a Codex run can show the workflow it opened, a refused command is not offered, a real request keeps its command and the measure counts only a read as a load.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The Codex reader keeps its record shape. `arguments` stays an object, one key is added, and every other consumer is checked by its own tests. |
| D2 | No task on `score-command-transcripts.mjs` starts before phases 022 and 023 are Complete and committed. |
| D3 | The corpus and the committed baseline are not edited. The relabel of rows sv-09, sv-11 and sv-12 waits on the operator. |
| D4 | A finding with no wrong output in a probe gets no code. The two skill label fallbacks and the plugin timing test are declined on their probe lines. |
| D5 | No rule is bent to make a stored run score better or a probe prompt print the expected head. A changed count is explained by the rule that moved it. |
| D6 | No model session, behaviour run or `AGENTS.md` edit. No rescored number is called a gain or the outcome. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed, and `node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs` reports `fail 0`.
- [x] `env -u AI_SESSION_CHILD npx vitest run tests/history-lookup-cli.vitest.ts tests/history-lookup-adapters-e2e.vitest.ts` in `.skilled/skills/system-spec-kit/runtime` reports 0 failed.
- [x] The mention probe `scratch/planning/probe-mention-reader.mts`, run from the repository root through the spec kit's `tsx` loader, prints `SHIPPED: 46 of 46 agree`.
- [x] `cmp scratch/floor-before.txt scratch/floor-after.txt` exits 0, with typed recall at least 24 of 44 and false offers 0 of 35 in both files.
- [x] `scratch/rescore-delta.txt` holds 12 lines of the form `<runtime> <arm> start` and 11 of the form `<runtime> <arm> workflow`, and the parent goal log holds the Codex start rate of both arms before and after.
- [x] `git -c core.fsmonitor=false diff --quiet <start commit> -- AGENTS.md` and the same check on `command-prompts.jsonl` and `command-routing-baseline.json` exit 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/024-fable-review-remediation --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14, at commit 47577daa6f with phases 022 and 023 uncommitted in the tree. Seven probes in `scratch/planning/` |
| Finding 1 reproduced | Recorded | `probe-codex-shell.mjs`: 58 of 58 Codex shell events of the before arm and 53 of 53 of the after arm hold no command text. With the body read the forecast is 4 of 16 loads before and 3 of 16 after, and 0 started in both arms |
| Findings 4, 5 and the P022 prompt reproduced | Recorded | `probe-mention-reader.mts`: shipped reader 40 of 46, planned edits 46 of 46. The CLI printed a command on the two refusals and the question, and none on the three requests |
| Finding 7 reproduced | Recorded | `probe-shell-read-rule.mjs`: a lone `rg` or `grep` scores `skill`, a heredoc line scores `skill`, `cd` then `cat SKILL.md` scores `none`. Stored runs: two loads rest on a search alone, one run holds each of the other two shapes |
| Planned edits checked | Recorded | `probe-shell-targets-planned.mjs` printed `RESULT: 18 of 18 agree` for the three shell-read edits and the Codex body reader |
| Level | Decided | `recommend-level.sh --loc 420 --files 12` printed Level 1. Level 2 chosen because the closure gate is `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Review findings in scope | 1, 4, 5, 6, the rest of 7 and the P022 reversal |
| Handled before this phase | 2, 3, 8, the `sed -i` part of 7 and the row-0 carry item |
| Declined on a probe | The OpenCode plugin label (same head with and without it), the Claude hook label fallback (0 of 10 CLI rows below the bars) and the plugin timing test (20 of 20 runs passed) |
| Waits on the operator | Finding 9. A relabel moves three rows into the false-offer tally, so the floor would read 0 of 38 where completion criterion 2 of the parent says 0 of 35 |
<!-- /ANCHOR:log -->
