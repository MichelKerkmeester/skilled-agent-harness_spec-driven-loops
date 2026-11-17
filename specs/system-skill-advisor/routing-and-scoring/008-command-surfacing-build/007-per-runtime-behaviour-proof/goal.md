---
title: "Goal: Per-runtime behaviour proof"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof"
    last_updated_at: "2026-11-12T22:20:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-352-command-surfacing-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Goal: Per-runtime behaviour proof

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Measure from real sessions on six runtimes whether a model that is offered a command starts it, before and after the brief and the Gate 2 rule land.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every live run happens in an arena: a throwaway clone with no git remote, with GitHub and git credentials off. |
| D2 | The before arm runs on the branch tip before phase 005 code lands. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `runs-pre.jsonl` and `runs-post.jsonl` in this phase scratch folder each hold 24 lines for each of claude, codex, opencode, pi, devin and dsh.
- [x] `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs --summary` over both logs prints a pre and a post start rate for all six runtimes.
- [x] In `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Goal authored | Done | `check-goal.cjs` passes on this folder |
| Criterion 1, 24 lines per runtime | Met 2026-11-13 | `jq -s 'group_by(.runtime) \| map({r: .[0].runtime, n: length})'` prints 24 for each of the six runtimes in `runs-pre.jsonl` and in `runs-post.jsonl`. `runs-pre-dsh-rerun.jsonl` holds 24 dsh lines |
| Criterion 2, start rates for six runtimes | Met 2026-11-13 | `score-command-transcripts.mjs --summary runs-pre.jsonl runs-post.jsonl --json` exits 0 and prints a pre and a post `startRate` for all six. Over `runs-pre.jsonl` dsh pre reads 4 of 12, over the rerun it reads 6 of 12 as in `summary.json` |
| Criterion 3, scorer tests | Met 2026-11-13 | `npx vitest run tests/command-transcript-score.vitest.ts` printed `Tests 61 passed (61)`, exit 0 |
| Criterion 4, strict validation | Met 2026-11-13 | `spec.md` Status is Complete and `validate.sh --strict` on this folder prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Closing decisions | AC-004, AC-005 and AC-007 waived and AC-010 superseded by ADR-005 to ADR-008 in `decision-record.md`. The Codex-only arm waits on the operator (ADR-010) |
| First DSH before arm | Ran with the advisor off. The summary uses the 24-row rerun |
<!-- /ANCHOR:log -->
