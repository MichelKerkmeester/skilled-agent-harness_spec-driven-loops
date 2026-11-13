---
title: "Goal: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title"
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
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title"
    last_updated_at: "2026-11-13T18:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Merged the packet into main and pushed it"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "c94686c5-0bc1-4208-81e9-35feb056d30a"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude Code session that hands over cannot park its hop behind a question dialog, starts its receiver on the unfinished goal of its packet when it set no goal itself and keeps its generated title in the next session.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One child per fix. Each code change lands with a test that failed first |
| D2 | Every child changes Claude Code only. Pi, OpenCode, Codex, Cursor and Devin stay as they are |
| D3 | No child adds a module or a relaunch record key |
| D4 | Nothing is merged or pushed without the operator |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-sender-dialog-after-prepare | `001-sender-dialog-after-prepare/goal.md` |
| 002-packet-goal-fallback | `002-packet-goal-fallback/goal.md` |
| 003-generated-title-carry | `003-generated-title-carry/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title --recursive --strict` prints `RESULT: PASSED` four times and never `RESULT: FAILED`
- [x] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/*/acceptance-criteria.md` prints no line
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0
- [x] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` both print `PASS`
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
| Operator answers | Done | 2026-11-13, through the question tool. "Fix the dialog-after-prepare hop", with design "Refuse the dialog (Recommended)". Goal rule "The note's packet goal (Recommended)", then "Skip finished goal docs (Recommended)". Spec folder "Move to new packet 039 (Recommended)", which replaced the earlier answers that put the three children under packet 038 |
| Code commits | Done | Written on branch `worktrees/366-hop-after-question-dialog`: `9d0c5368d1` for child 001, `c461b79a71` and `085449ab6a` for child 002, `7d6077678e` for child 003 |
| Parent goal authored | Done | 2026-11-13, from `spec.md` and the three child goals. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` and `goal.cjs packet` printed `packet_durable_chars=2932` and `packet_budget=ok` |
| Criterion 1 | Done | 2026-11-13 in worktree 366: recursive strict validation printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` for this packet and for children 001, 002 and 003, exit 0 |
| Criterion 2 | Done | 2026-11-13: the `rg -c` command printed no line and exited 1, which is ripgrep's no-match status |
| Criterion 3 | Done | 2026-11-13 at commit `085449ab6a`: exit 0, tests 1536, pass 1536, fail 0. Main held 1524 before the three fixes |
| Criterion 4 | Done | 2026-11-13: exit 0, tests 200, pass 200, fail 0 |
| Criterion 5 | Done | 2026-11-13: exit 0, 1 test file passed, 62 of 62 tests passed |
| Criterion 6 | Done | 2026-11-13: `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` and `PASS: 256 mirrors across 10 trees are in sync.`, both exit 0 |
| Merge and push | Done | 2026-11-13: the operator answered "Merge to main locally (Recommended)", "Push after tests pass (Recommended)" and "Remove it after the merge (Recommended)". The merge commit on main is `bc670ffc21`. The gate on the merged tree: relaunch and OpenCode plugin suites 1536 of 1536, goal suites 200 of 200, Pi adapter suite 62 of 62, both sync checks `PASS`. Main was then pushed to origin, and worktree 366 and its branch were removed |

### Deviations and findings

| Item | Note |
|------|------|
| Why this packet exists | The three children were first written under packet 038. Its goal was at 3,996 of 4,000 characters and could not bind three more children, so the operator chose a new packet with its own goal |
| Reworded commits | The `Spec:` line of the three code commits named the packet 038 paths. They were reworded to this packet's children with the trees unchanged. The first kept `Commit-Id` 0013887. The second and third were replayed and now carry 0013892 and 0013893 in place of 0013888 and 0013889 |
| No live hop | No child ran a live hop. Each child's known limitations name what a live run would confirm |
<!-- /ANCHOR:log -->
