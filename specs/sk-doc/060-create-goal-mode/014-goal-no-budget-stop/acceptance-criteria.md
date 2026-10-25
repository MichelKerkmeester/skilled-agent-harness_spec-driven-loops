---
title: "Acceptance Criteria: Phase 14: goal-no-budget-stop"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal no budget stop acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/014-goal-no-budget-stop"
    last_updated_at: "2026-10-24T16:47:40Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Met every criterion except the sk-code drift-guard wrapper"
    next_safe_action: "Run the sk-code drift-guard wrapper, then close the packet"
    blockers: []
    key_files:
      - ".opencode/plugins/opencode-goal.js"
      - ".skilled/hooks/goal/lib/goal-core.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-goal-no-budget-stop"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 14: goal-no-budget-stop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/014-goal-no-budget-stop
**Level:** 2
**Status:** Complete
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the OpenCode plugin, When searched for the two env variables, `maxAutoTurns`, `maxWallMs` and the four status line names, Then none remain | V1 prints 0, from a baseline of 26 at HEAD. Cited: `.opencode/plugins/opencode-goal.js:3097`, the comment that says the budget figure is a reading only | Met | - |
| AC-002 | REQ-001 | Given a goal that passes its token budget, its turn count or its elapsed time, When the OpenCode goal suites run, Then the rewritten tests assert that the goal keeps running | V2 passes 151 of 151, from 152 of 152. Twelve tests that asserted the old stops were rewritten, and one pair of cap tests became one test. Cited: `.opencode/plugins/tests/opencode-goal-continuation.test.cjs:531` for turns, `.opencode/plugins/tests/opencode-goal-continuation.test.cjs:752` for time and `.opencode/plugins/tests/opencode-goal-continuation.test.cjs:833` for the token budget | Met | - |
| AC-003 | REQ-002 | Given the shared core, When a goal records a token budget and keeps running, Then nothing ends or silences it, and the core code is unchanged | V3 passes 87 of 87 with the new test `a recorded token budget never ends or silences a goal that keeps running`. `git status` lists no change to `goal-core.cjs`, the Pi, Cursor and Devin hooks or the Hermes plugin. Cited: `.skilled/hooks/goal/lib/goal-core.test.cjs:293` | Met | - |
| AC-004 | REQ-003 | Given a `budget_limited` record an older version wrote and a goal that records a budget, When the plugin resumes and reports them, Then the record resumes to `active` and the usage line still shows the budget | V2 includes the lifecycle test `a goal an older version left budget-limited resumes without raising the budget` at `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs:438`, which resumes a record at 105 tokens over a budget of 100 to `active` with `continuationSuppressed` false. The usage line holds `tokens ${tokensUsed}/${tokenBudget}` at `.opencode/plugins/opencode-goal.js:3098` | Met | - |
| AC-005 | REQ-004 | Given the status output, When the capabilities test sets both retired variables and reads status, Then none of the four limit lines appear and the usage line ends in `iteration N` with no ratio | V2 includes the `doesNotMatch` assertion on the four names at `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs:233`. The usage line at `.opencode/plugins/opencode-goal.js:3098` ends in `iteration ${autoTurnsUsed}` | Met | - |
| AC-006 | REQ-005 | Given the rewritten and new tests, When run against the pre-change plugin, Then they fail where the plugin stopped a goal | V4 negative control: 10 of the rewritten or new tests fail against the pre-change plugin | Met | - |
| AC-007 | REQ-006 | Given the env docs and the docs under `.skilled`, When searched for the retired variables, Then the env docs hold none and only playbook steps that say the variables change nothing remain, and the plugin doc and command doc say no limit applies | V5 prints 0, from 4 at HEAD. V6 prints 3, from 14 at HEAD, all in the system-spec-kit and system-skill-advisor playbooks, each saying the variables are retired and change nothing. `.skilled/hooks/goal/goal-plugin.md:44` says "No token budget, turn count or elapsed time ends, pauses or silences a goal" and `.skilled/commands/goal-opencode.md:52` says "No budget, turn count or elapsed time limits continuation" | Met | - |
| AC-008 | REQ-001 | Given the changed code files, When the sk-code drift-guard wrapper runs, Then it exits 0 | `run-all-drift-guards.sh` printed `all 4 guards PASSED` and exited 0 on the final state | Met | - |
| AC-009 | REQ-007 | Given this spec folder, When `validate.sh` runs with `--strict`, Then it prints `RESULT: PASSED` | V8 prints `Errors: 0  Warnings: 0` and `RESULT: PASSED` for this folder. V9 prints `RESULT: PASSED` for the parent and all 14 phase folders. `repair-derived.cjs --apply` refreshed the derived `graph-metadata.json` of this folder and of the parent first | Met | - |

### Verification commands

Run from the repository root. Counts use `wc -l`, so a clean result prints 0 rather than nothing.

```bash
# V1, expected 0 (HEAD prints 26)
rg -n "OPENCODE_GOAL_MAX_AUTO_TURNS|OPENCODE_GOAL_MAX_WALL_MS|maxAutoTurns|maxWallMs|max_auto_turns|remaining_auto_turns|max_wall_ms|remaining_wall_ms" .opencode/plugins/opencode-goal.js | wc -l
# V2
node --test .opencode/plugins/tests/opencode-goal-*.test.cjs
# V3
node --test .skilled/hooks/goal/lib/goal-core.test.cjs
git status --short -- .skilled/hooks/goal .hermes/plugins
# V4, negative control: put HEAD's plugin (git show HEAD:.opencode/plugins/opencode-goal.js) in a scratch copy of the repository and rerun V2 there
# V5, expected 0 (HEAD prints 4)
rg -n "OPENCODE_GOAL_MAX_AUTO_TURNS|OPENCODE_GOAL_MAX_WALL_MS" .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | wc -l
# V6, expected 3 (HEAD prints 14)
rg -n "OPENCODE_GOAL_MAX_AUTO_TURNS|OPENCODE_GOAL_MAX_WALL_MS" .skilled -g '!**/changelog/**' | wc -l
# V7, the sk-code drift-guard wrapper
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
# V8
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/014-goal-no-budget-stop --strict
# V9
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --strict --recursive
```

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All nine criteria are met, each against a baseline taken before the change. Nothing is consciously left out.
<!-- /ANCHOR:closure -->
