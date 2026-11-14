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
    last_updated_at: "2026-11-14T07:29:41Z"
    last_updated_by: "markdown-agent"
    recent_action: "Passed the six completion criteria and logged the commits of children 012 to 014"
    next_safe_action: "Operator decides merge and push of branch worktrees/373-relaunch-gap-fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "8d16c027-15a3-4944-a1d2-eef7cc2cb0b8"
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

**Objective:** A Claude Code session that hands over cannot park its hop behind a question dialog, starts its receiver on the unfinished goal of its packet when it set no goal itself and keeps its generated title in the next session. The research gaps the operator chose to close are closed: a changed wrapper says so before a hop, a hand-over Stop cannot arm stops blocking questions, a goal the operator ended stays ended and the documents say what the code does.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One child per code fix. Each code change lands with a test that failed first. The five document fixes share one child |
| D2 | Children 001 to 003 change Claude Code only. Children from 004 may also change the shared wrapper, the shared relaunch core, tests and documents. No child edits a Pi, OpenCode, Codex, Cursor or Devin adapter |
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
| 004-wrapper-change-notice | `004-wrapper-change-notice/goal.md` |
| 005-parked-record-escape | `005-parked-record-escape/goal.md` |
| 006-record-without-handoff | `006-record-without-handoff/goal.md` |
| 007-killer-test-margin | `007-killer-test-margin/goal.md` |
| 008-history-test-database-env | `008-history-test-database-env/goal.md` |
| 009-document-corrections | `009-document-corrections/goal.md` |
| 010-goal-ending-carry | `010-goal-ending-carry/goal.md` |
| 011-goal-fallback-bound | `011-goal-fallback-bound/goal.md` |
| 012 | `012-wrapper-notice-log/goal.md` |
| 013 | `013-conformance-stamp-pin/goal.md` |
| 014 | `014-review-wording-fixes/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title --recursive --strict` prints `RESULT: PASSED` fifteen times and never `RESULT: FAILED`
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
| Criterion 1, children 001 to 003 | Done | 2026-11-13 in worktree 366: recursive strict validation printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` for this packet and for children 001, 002 and 003, exit 0 |
| Criterion 2, children 001 to 003 | Done | 2026-11-13: the `rg -c` command printed no line and exited 1, which is ripgrep's no-match status |
| Criterion 3, children 001 to 003 | Done | 2026-11-13 at commit `085449ab6a`: exit 0, tests 1536, pass 1536, fail 0. Main held 1524 before the three fixes |
| Criterion 4, children 001 to 003 | Done | 2026-11-13: exit 0, tests 200, pass 200, fail 0 |
| Criterion 5, children 001 to 003 | Done | 2026-11-13: exit 0, 1 test file passed, 62 of 62 tests passed |
| Criterion 6, children 001 to 003 | Done | 2026-11-13: `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` and `PASS: 256 mirrors across 10 trees are in sync.`, both exit 0 |
| Merge and push, children 001 to 003 | Done | 2026-11-13: the operator answered "Merge to main locally (Recommended)", "Push after tests pass (Recommended)" and "Remove it after the merge (Recommended)". The merge commit on main is `bc670ffc21`. The gate on the merged tree: relaunch and OpenCode plugin suites 1536 of 1536, goal suites 200 of 200, Pi adapter suite 62 of 62, both sync checks `PASS`. Main was then pushed to origin, and worktree 366 and its branch were removed |
| Reopened for the research gaps | Done | 2026-11-14, through the question tool. Work chosen: "Wrapper notice + safety fixes (Recommended), Document fixes, Goal continuity". Spec folder: "New children of 039". Workspace: "A) Create a git worktree (Recommended)", which is worktree 373 on branch `worktrees/373-relaunch-gap-fixes`. Amendment: "8 children, docs batched (Recommended)", which changed the objective, D1 and D2 and added eight binding rows |
| Code commits, children 004 to 011 | Done | 2026-11-14 on branch `worktrees/373-relaunch-gap-fixes`: `89e246760e` for child 004, `eaf24f999e` for 005, `f4cf59b93f` for 006, `8a113b68ae` for 007, `94af61c540` for 008, `aee4ae8080` for 010 and `eba587cae7` for 011. The relaunch and OpenCode plugin suites passed on the tree of each commit, from 1538 of 1538 after the first to 1548 of 1548 after the last |
| Review remediation planned | Done | 2026-11-14: two independent reviewers read all eleven fixes (replies `review-A.txt` and `review-B.txt` in the orchestrator's scratchpad) and the orchestrator checked their findings against the code. Every finding has one disposition. **New children:** `012-wrapper-notice-log` takes A's transient wrapper note and B's false note on an unreadable file. `013-conformance-stamp-pin` takes A's conformance case that pins neither behavior. `014-review-wording-fixes` takes B's false README sentence at line 309, the comment at `relaunch-core.cjs:1299` (A and B), B's stale Stop comment with its test notes, A's missing `goal_ended` in `handoff.md`, A's session id dependency of the ended-goal mark as a recorded limit, and the trial merge of `main` both reviews ask for. **Handed to packet `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/`:** one shared purpose resolver (A item 4, B item 4), the ended goal that returns as the note's purpose and the three lineage walks (A finding 5, B item 5), and the Purpose line in the session-relaunch README (A item 3). **Later packet:** the stamp moved into the core so Codex gets it (A item 5), a guard for `ExitPlanMode`, permission prompts and the question tools of Pi, OpenCode and Codex, the unstamped record an operator interrupt leaves after `prepare`, a change to what the ended-goal mark matches on, and B's simpler rule that a session carries only what its claimed note carried. **Rejected:** B's P1 that Claude Code 2.1.325 writes no `ai-title`, refuted by 40 transcripts on account 1 that hold the entry. B's hardening that reads an empty `handoff` as absent, against decision D2 of child 006. B's note for a changed settings file, because a hop starts a process that reads its settings fresh, which is inferred. The cost of the sibling-note scan, which nobody measured. A's point that the empty-string test could not fail first, which child 006 already states. B's point that the sk-git sentence is unrelated, because the operator chose "Document fixes". A's points that child 004 only reports and that only Claude reads `goal_ended`, both by design. **Not planned here:** B's P1 that the documents of children 004 to 011 are untracked, which is the commit step already pending. **For the operator:** whether `goal_ended` stays a note field before the merge, the merge of `main` into this branch, and the live hops no child ran. The criterion 1 count moved from twelve to fifteen. Decisions D1 to D4 are word for word as before. The objective names no new outcome, because it already covers the wrapper note and documents that say what the code does. The three binding rows took the slice to 4,082 characters. Two cuts brought it to 3,994 at `packet_budget=ok`: the new rows carry the short labels `012`, `013` and `014`, as rows 038 and 039 of the 002 parent do, and the objective says "The research gaps" for "The gaps the 2026-11-13 research found that". The durable text changed, so the chat slice is resent once. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` for this packet and for each new child |
| Verifier corrections and operator answers | Done | 2026-11-14: a verifier checked the plan of children 012 to 014 (reply `verify-reply.txt` in the orchestrator's scratchpad) and found 012 ready and 013 and 014 in need of a fix first. **Corrections:** child 013 gained a third mutation, the mark taken off the Claude entry, which proves the branch where a runtime that should not stamp starts stamping. In child 014 the test note at `claude-adapters.test.cjs:708` stays, because it sits on the background-task path and is right, and only the stale note at `:959` changes. Child 014 now lands in two commits, the wording fixes with its packet documents first and the `handoff.md` sentence with a rebuilt trigger index second, and the trigger index joined its Files to Change. `011-goal-fallback-bound/spec.md` names its successor and "11 of 14". `completion_pct` is 70 here and in `spec.md`, since eleven of fourteen children are built and documented and none is closed. **Operator answers of 2026-11-14, word for word:** "Merge before building (Recommended)" for the merge of `main`, which is in this branch as merge commit `be56fabc7b`. "Keep it (Recommended)" for `goal_ended`. "Accept both (Recommended)" for the two D1 readings, which are child 014 as a second document child whose comment edits have no test that failed first, and child 012 holding two findings. "Fix plan, build 012 now (Recommended)". **The `ai-title` dispute is settled:** the verifier held that 40 transcripts with no version named could not refute reviewer B. The orchestrator then counted in the live session transcript `b726ec67-1d85-4833-b219-c038e184d696.jsonl`: `"version":"2.1.325"` in all 566 versioned entries and 40 `"type":"ai-title"` entries. Reviewer B's P1 is refuted on 2.1.325. Decisions D1 to D4 are unchanged, and no durable text changed, so the slice stays at 3,994 characters |
| Merge of main | Done | 2026-11-14: `main` is merged into this branch as `be56fabc7b`. The baseline on the merged tree is 1548 of 1548, exit 0, with nothing else running |
| Child 012 commit | Done | 2026-11-14: commit `94e83013fa` (`Commit-Id` 0013978) changes four files and adds no new file. The same suite gave 1550 of 1550, exit 0 |
| Child 013 commit | Done | 2026-11-14: commit `c69f278cfc` (`Commit-Id` 0013980) changes one file. The orchestrator's own suite run gave 1550 of 1550, exit 0 |
| Operator instruction | Done | 2026-11-14: the operator instructed that the orchestrator checks each built child itself. The orchestrator runs each child's commit check against the landed commit |
| Completion criteria, children 001 to 014 | Done | 2026-11-14 at `45459c0c71` in worktree 373, run one after another with nothing else running. Criterion 1: `RESULT: PASSED` fifteen times, no `FAILED`, exit 0. Criterion 2: the `rg -c` command printed no line, exit 1. Criterion 3: tests 1550, pass 1550, fail 0, exit 0, from 1536 when children 001 to 003 closed. Criterion 4: tests 200, pass 200, fail 0, exit 0, unchanged. Criterion 5: `Tests  62 passed (62)`, exit 0, unchanged. Criterion 6: `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` and `PASS: 256 mirrors across 10 trees are in sync.`, both exit 0 |
| Commits, children 012 to 014 | Done | 2026-11-14 on branch `worktrees/373-relaunch-gap-fixes`: `94e83013fa` for child 012, `c69f278cfc` for 013, `d5c5bc84d3` for the documents of children 004 to 013, and `3be5a9835d` and `45459c0c71` for 014. The orchestrator checked each child itself before its commit, on the operator's instruction. The rebuilt trigger index is committed on its own at the end, as this repository does |

### Deviations and findings

| Item | Note |
|------|------|
| Why this packet exists | The three children were first written under packet 038. Its goal was at 3,996 of 4,000 characters and could not bind three more children, so the operator chose a new packet with its own goal |
| Reworded commits | The `Spec:` line of the three code commits named the packet 038 paths. They were reworded to this packet's children with the trees unchanged. The first kept `Commit-Id` 0013887. The second and third were replayed and now carry 0013892 and 0013893 in place of 0013888 and 0013889 |
| No live hop | No child ran a live hop. Each child's known limitations name what a live run would confirm |
| Amended child 002 | Child 002 chose to skip finished goal documents and not to carry a goal's ending. Children 010 and 011 amend that choice: a Claude goal that ended is marked in the note and stays ended one hop later, and the fallback stops at the parent of the note's folder. The operator approved it as "Goal continuity" on 2026-11-14 |
| One commit per child | The seven code children changed fifteen files, six of them shared between children. Each commit was built from the final tree with the later children's edits taken out, and the last tree equals the final tree byte for byte |
| Drift guards | 2026-11-14: `run-all-drift-guards.sh` failed one guard, `alignment-drift`, with 44 findings, 23 errors and 21 warnings on Pi extensions, OpenCode plugins, `skilled-loop-shell.sh` and research scripts. Main at `bd79708c2f` fails the same guard with the same counts, and no flagged file is changed by this branch, so the finding predates it and is left to its owners. The other three guards passed |
<!-- /ANCHOR:log -->
