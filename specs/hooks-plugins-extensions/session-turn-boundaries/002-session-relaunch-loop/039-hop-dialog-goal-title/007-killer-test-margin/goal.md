---
title: "Goal: Phase 7: killer-test-margin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "killer test margin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/007-killer-test-margin"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the killer test margin change, its load runs and the checks run in worktree 373"
    next_safe_action: "None. The code is committed as 8a113b68ae and awaits the operator's merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/tests/killer.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "8d16c027-15a3-4944-a1d2-eef7cc2cb0b8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: killer-test-margin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The killer test that checks a record stays armed when its target exits during the grace period passes on a busy machine, because its deadline leaves room for several late polls.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Only the test's `timeoutMs` changes, from 450 to 1000, with a two-line comment. No product code changes. |
| D2 | The failure is reproduced under load before the change. The load run at 450 ms is this child's red run, because the child changes a test. |
| D3 | The killer's polling and deadline logic in `lib/killer.cjs` stay as they are. |
| D4 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `parallel runs: 160, failed runs: 14` for the test at `timeoutMs: 450`.
- [x] `scratch/green.txt` shows `failed runs: 0` for both rounds of 160 runs at `timeoutMs: 1000`.
- [x] `git show --stat 8a113b68ae` lists one file, `.skilled/hooks/session-relaunch/tests/killer.test.cjs`, and `git show 8a113b68ae | rg -c '^new file'` prints nothing.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` reports 1543 of 1543 on the tree of that commit.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/007-killer-test-margin --strict` prints `RESULT: PASSED`.
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
| Research request | Done | The research of 2026-11-13 named the margin as the likely cause and ranked the fix 14 of 19. It could not reproduce the failure. See `../research/research.md` section 6 and section 9 |
| Poll interval confirmed | Done | `lib/killer.cjs:22` reads `POLL_INTERVAL_MS = 100` |
| Red run at 450 ms | Done | `scratch/red.txt:2`: `parallel runs: 160, failed runs: 14`. The sample failure at `scratch/red.txt:18` is `ENOENT` on `target-signal` |
| Change | Done | `8a113b68ae` on `worktrees/373-relaunch-gap-fixes`: `timeoutMs` 450 to 1000 and a two-line comment, 3 insertions and 1 deletion in one file |
| Green run at 1000 ms | Done | `scratch/green.txt:2` and `scratch/green.txt:3`: 160 runs and 0 failed, in two rounds |
| Whole killer file | Done | `scratch/green.txt:15` to `scratch/green.txt:18`: tests 64, pass 64, fail 0 |
| Whole suite | Done | The commit message records the relaunch and OpenCode plugin suites at 1543 of 1543, unchanged. Not rerun by this author and not saved |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the commit, the scratch runs and the research. Every criterion Met |
| Validation | Done | 2026-11-14: `repair-derived.cjs --apply` re-derived the graph metadata after a first strict run flagged stale generated metadata, then `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` |

### Deviations and findings

| Item | Note |
|------|------|
| No test failed first in the usual sense | The child changes a test, so parent D1 cannot ask for a test that fails before the edit. The load run at 450 ms is the red run |
| Cause confirmed for one machine | The research called the margin likely and not reproduced. The load run confirms it on an 18-core machine only. The saved failure shows the signal file missing and no `killer-timeout` log line |
| No live hop | The change is to a test and no runtime path changes, so a live hop was not judged needed. It is a known limitation in `implementation-summary.md` |
| Suite count not rerun | The 1543 count is the commit message's. The worktree now holds later commits, so a rerun here would show a different count and could not confirm that tree |
<!-- /ANCHOR:log -->
