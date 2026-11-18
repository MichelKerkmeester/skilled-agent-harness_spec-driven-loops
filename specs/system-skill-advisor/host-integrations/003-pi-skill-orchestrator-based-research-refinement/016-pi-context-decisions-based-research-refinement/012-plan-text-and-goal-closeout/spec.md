---
title: "Feature Specification: Plan Text and Goal Closeout"
description: "Phases 002, 003 and 004 shipped, but their plan text still states three things that are false: a rebuild order, a bench command that prints nothing and a three-file diff that held per phase only. This doc-only phase fixes that text, adds the daemon socket caveat to the delegation strategy, ticks the child and parent goals with fresh evidence and records the operator answers in a decision record."
trigger_phrases:
  - "plan text and goal closeout"
  - "phase 12 plan text and goal closeout"
  - "pi-context-decisions packet closeout"
  - "advisor socket dir caveat"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Plan Text and Goal Closeout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 013-drift-guard-probe-script-errors |
| **Successor** | None |
| **Handoff Criteria** | Every child goal and the parent goal have each criterion ticked with evidence the conductor ran, the parent spec says Complete and the recursive strict validation of the packet prints `RESULT: PASSED`. This is the last phase of the packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the pi-context-decisions refinement packet. It builds last, after 013, because it ticks the goals of every other phase.

`P` is the parent folder `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/`. `A` is `.skilled/skills/system-skill-advisor/`.

**Scope Boundary**: Spec docs, plus one decision record the continuity writer creates. The conductor edits every doc itself. Code, test and fixture changes come only from a review finding confirmed against the code under D6, each written by a Luna leaf and listed in Files to Change.

**Dependencies**:
- Phases 006 to 011 and 013 complete, so their goals can be ticked and the drift-guard gate is green.
- The finish sequence in the parent goal's D6: merge to `main` through sk-git, rebuild and restart the advisor, run the criteria, push. Parent criteria 1 and 6 can only pass after it.

**Deliverables**:
- True plan text in the 002, 003 and 004 docs, with every ticked evidence line left as it is.
- A daemon socket caveat in `P/delegation-strategy.md`, with each claim cited.
- Ticked completion criteria and `completion_pct: 100` in the 002, 003 and 004 goals.
- `decision-record.md` in this folder, holding the operator answers, 9 at planning.
- Ticked parent goal criteria, parent Status Complete and every phase-map row Complete.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four pieces of packet text are wrong or missing.

1. **Rebuild order in 002.** T009 recaptures the eval baseline before the T013 rebuild (`P/002-pasted-context-stripping/tasks.md:68`, `:76`), and the plan says the same (`P/002-pasted-context-stripping/plan.md:92`, `P/delegation-strategy.md:107`). The capture script loads the scorer from `dist/runtime` (`A/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:47`, `:119`), so against a stale build it scored the new row wrong (`P/002-pasted-context-stripping/implementation-summary.md`, Verification row T009).
2. **Bench command in 003.** `BENCH` and three acceptance lines use the bare bench command and say it prints the bench lines (`P/003-follow-up-routing-benchmark/tasks.md:28`, `spec.md:138`, `plan.md:45`, `goal.md:59`). It prints none without `--reporter=verbose`, as Measured Behavior shows.
3. **Diff scope in 004.** SC-002, the goal criterion, T007 and the plan say `git diff --stat` lists only three files (`P/004-crash-path-fallback/spec.md:132`, `goal.md:61`, `tasks.md:64`, `plan.md:45`, `plan.md:73`, `P/delegation-strategy.md:116`). That held per phase only. Phase 002's uncommitted changes shared the worktree (`P/004-crash-path-fallback/tasks.md:65`).
4. **Socket caveat.** `P/delegation-strategy.md` says nothing about the daemon socket. The 002 build pointed `SPECKIT_IPC_SOCKET_DIR` at `/tmp/sa474` (`P/002-pasted-context-stripping/tasks.md:80`). Each checkout already gets its own socket, and the override can drop the CLI to the local scorer:
   - With the variable unset, the CLI shim sets it to `/tmp/system-skill-advisor` (`.skilled/bin/skill-advisor.cjs:25`, `:88-89`). The socket helper then appends the first 12 hex digits of a SHA-256 of the advisor database folder's real path (`.skilled/bin/lib/launcher-ipc-bridge.cjs:103-109`, `:139-154`). That folder sits inside each checkout (`launcher-ipc-bridge.cjs:91-98`).
   - With the variable set elsewhere, the CLI computes its socket from the variable alone (`A/runtime/skill-advisor-cli.ts:1364`). Its launcher finds the owner lease held, in the shared database folder, and bridges to a current-build holder instead of binding the new socket (`.skilled/bin/system-skill-advisor-launcher.cjs:989-993`). A holder launched before the current build is recycled instead (`:961-970`), so the claim holds only while a current-build daemon holds the lease. The 5-second cold-start wait closes (`A/runtime/skill-advisor-cli.ts:36`, `:1354-1357`), and the CLI answers from the local scorer with `degraded: true` and `source: local-scorer` (`:1574-1590`). This chain is INFERRED from the code. Task T009 confirms it live.

The child goals of 002, 003 and 004 still show every criterion unticked and `completion_pct: 0` (`P/002-pasted-context-stripping/goal.md:23`, `:59-62`, the same lines in 003 and 004). The nine operator answers live only in `P/spec.md` continuity `answered_questions`, and no decision record holds them.

### Purpose
Every packet doc states what is true, every goal criterion carries evidence and the packet closes Complete.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 in worktree 474.

```text
$ cd .skilled/skills/system-skill-advisor/runtime
$ SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts 2>&1 | grep -c '^advisor-'
0
$ SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose 2>&1 | grep -o '^advisor-[a-z-]*'
advisor-scorer-calibration
advisor-follow-up-routing
advisor-scorer-calibration-duration
$ cd -
$ git show --name-only --format= 31469e5ee4e cfad65c7c72
.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts
.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts
.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
$ node -e 'console.log(require("crypto").createHash("sha256").update(require("fs").realpathSync.native(".skilled/skills/system-skill-advisor/runtime/database")).digest("hex").slice(0,12))'
436f32069853
$ ls /tmp/system-skill-advisor/436f32069853/
daemon-ipc.sock
```

Both bench runs exited 0. The two commits are phase 004's own, so its three-file claim holds per commit. The hash matches a live socket folder, which confirms the per-checkout socket for this worktree.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the order text in 002 so the build comes before T009, without touching any `[x]` or Evidence line.
- Add `--reporter=verbose` to every 003 line that runs the bench and expects its lines.
- Reword the 004 three-file claim to the phase's own commits.
- Add the socket caveat to `P/delegation-strategy.md` section 5, and fix its two wave rows for 002 and 004.
- Tick the 002, 003 and 004 goal criteria from fresh conductor runs, and set their `completion_pct` to 100.
- Record the operator answers, 9 at planning, through `/speckit:save` `--full-auto`, targeting this folder.
- Tick the parent goal criteria after the finish sequence, and set the parent spec and every phase-map row to Complete.
- Run a read-only review of every phase in four lanes, on Opus 5.5 medium through claude2 and DeepSeek V4.1 Flash max through cli-mistral-vibe, record each finding with a verdict, and fix any confirmed defect test first.

### Out of Scope
- Any code, test or fixture, except the fix for a review finding confirmed against the code, which joins Files to Change when it is confirmed.
- Rewriting `[x]` marks or Evidence lines in 002, 003 or 004 - they record what ran.
- Goal ticks for 001, 005 to 011 and 013 - each of those phases ticks its own goal when it completes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `P/002-pasted-context-stripping/tasks.md` | Modify | T009 description at `:68`: build first, with the reason |
| `P/002-pasted-context-stripping/plan.md` | Modify | Implementation Phases sentence at `:92`: build before the recaptures |
| `P/002-pasted-context-stripping/goal.md` | Modify | Tick criteria `:59-62`. `completion_pct` at `:23` to 100 |
| `P/003-follow-up-routing-benchmark/tasks.md` | Modify | `BENCH` definition at `:28` gains `--reporter=verbose` |
| `P/003-follow-up-routing-benchmark/spec.md` | Modify | REQ-001 acceptance at `:138` gains `--reporter=verbose` |
| `P/003-follow-up-routing-benchmark/plan.md` | Modify | Definition of Done at `:45` gains `--reporter=verbose` |
| `P/003-follow-up-routing-benchmark/goal.md` | Modify | Criterion `:59` gains `--reporter=verbose`. Tick `:59-62`. `completion_pct` at `:23` to 100 |
| `P/003-follow-up-routing-benchmark/implementation-summary.md` | Modify | Drift-guard row at `:102` names only the 008 review probes, not the `.vibe` fixtures |
| `P/004-crash-path-fallback/spec.md` | Modify | SC-002 at `:132` names the phase's own commits |
| `P/004-crash-path-fallback/plan.md` | Modify | Definition of Done at `:45` and the phases line at `:73` |
| `P/004-crash-path-fallback/tasks.md` | Modify | T007 description at `:64`. Evidence at `:65` stays |
| `P/004-crash-path-fallback/goal.md` | Modify | Criterion `:61` reworded. Tick `:59-62`. `completion_pct` at `:23` to 100 |
| `P/delegation-strategy.md` | Modify | Wave rows at `:107` and `:116`. New socket bullet in section 5 after `:136` |
| `012-plan-text-and-goal-closeout/evidence/review/` | Create | The review prompts, the two launchers and each lane's handback, kept as the scripts this phase ran |
| `A/hooks/claude/user-prompt-submit.ts` | Modify | Review fixes: receipts follow the `directive-lifecycle` flag, a shown floored or degraded route writes no receipt and clears one for another skill, delivery state set after input validation, crash path silent for a payload with no prompt, `writeHookOutput` exported with a stream seam and committing only on a clean write |
| `A/hooks/lib/route-receipt.ts` | Modify | `remove(sessionId)` on the receipt store and both implementations |
| `A/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Strip a leading pasted reply before the 10,000-character cut |
| `A/runtime/lib/skill-advisor-brief.ts` | Modify | Strip before the newline fold and the cut |
| `A/runtime/scripts/skill_advisor.py` | Modify | Strip at the entry of `recommend_with_native_advisor` |
| `A/hooks/dsh/prompt-advisor.mjs` | Modify | Log a named session's clock rotation that returned false |
| `A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Seven tests for the hook fixes |
| `A/runtime/tests/hooks/route-receipt.vitest.ts` | Modify | Two tests for `remove` |
| `A/runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` | Modify | One test for a pasted reply past the cut |
| `A/runtime/tests/legacy/advisor-brief-producer.vitest.ts` | Modify | Two tests for the brief's routed prompt |
| `A/runtime/tests/python/test_skill_advisor.py` | Modify | One native-entry strip check |
| `A/hooks/tests/dsh-prompt-advisor.test.mjs` | Modify | Two tests for the unmoved clock log |
| `A/runtime/tests/fixtures/pasted-reply-strip-cases.json` | Modify | Row `newline-marker` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Line 382: when the threshold variable is read |
| `P/002-pasted-context-stripping/implementation-summary.md` | Modify | Known Limitations 1 to 4 marked with the phase that fixed each |
| `P/004-crash-path-fallback/implementation-summary.md` | Modify | Known Limitations 2 and 3 marked fixed |
| `P/007-python-scorer-strip-parity/implementation-summary.md` | Modify | Known Limitation 1 marked fixed, citation moved to `:1588` |
| `P/009-crash-fallback-edge-cases/implementation-summary.md` | Modify | Known Limitation 1 narrowed to the disabled-hook case |
| `P/011-route-receipts-build/implementation-summary.md` | Modify | Known Limitation 7 gains the weak-reading probe, new limitation 8 |
| `012-plan-text-and-goal-closeout/decision-record.md` | Create | Written by the continuity writer from one `operatorDecisions` entry per operator answer |
| `P/goal.md` | Modify | Tick criteria `:92-97`. `completion_pct` at `:24` to 100. One LOG row |
| `P/spec.md` | Modify | Status at `:65` to Complete. Rows 6 to 13 at `:142-149` to Complete. `completion_pct` at `:29` to 100 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 002, 003 and 004 text is true | `rg -n 'run build' P/002-pasted-context-stripping/tasks.md` prints the T009 line. `rg -c 'reporter=verbose' P/003-follow-up-routing-benchmark/tasks.md` prints 2. `rg -n 'git diff --stat. lists' P/004-crash-path-fallback/spec.md` prints nothing |
| REQ-002 | Ticked work stays as it ran | `git diff -U0` on the 002 folder and the 003 and 004 `tasks.md` files adds or removes no `  - Evidence:` line and no `[x]` mark |
| REQ-003 | Child goals close | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` prints `RESULT: PASSED` for 002, 003 and 004. Each goal has no `- [ ]` line and shows `completion_pct: 100` |
| REQ-004 | The packet closes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh P --recursive --strict --quiet` prints `RESULT: PASSED` for all fourteen folders, `P/goal.md` has no `- [ ]` line and `P/spec.md` has no `Planned` row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The socket caveat is cited and true | `rg -n 'SPECKIT_IPC_SOCKET_DIR' P/delegation-strategy.md` prints the new bullet, and task T009's live check prints `local-scorer` |
| REQ-007 | Every phase is reviewed before the finish | `evidence/review/` holds one Opus and one DeepSeek handback for each of the four lanes, each opening with a `FINDINGS:` line, and `implementation-summary.md` gives every finding a verdict. A confirmed defect has a test that failed before its fix and passes after it |
| REQ-006 | The operator answers are recorded where a phase holds them | `012-plan-text-and-goal-closeout/decision-record.md` holds one operator-decision row per `answered_questions` line in `P/spec.md`, 9 at planning, and `test -e P/decision-record.md` exits 1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in the 002, 003, 004 and parent goals is ticked, each with evidence from a run in this phase.
- **SC-002**: The parent spec's Status row and all thirteen phase-map rows read Complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 006 to 011 change the strip rule, the hook and its tests | Counts in the 002, 003 and 004 summaries, such as 235 of 235, no longer match | Each tick quotes a fresh run from this phase, never a summary number |
| Dependency | Phase 009 edits `ENV-REFERENCE.md` | 004's criterion "prints line 382" can move | Task T012 runs the check. A moved line is recorded as a deviation in the 004 goal LOG with both line numbers |
| Risk | The 004 commit hashes change if the branch is rebased before the merge | Low | D6 names a merge, which keeps hashes. A rebase reruns the check with the new hashes |
| Risk | The T009 live probe spawns a launcher that bridges to the running daemon | Low | It uses a short throwaway socket folder, removed afterwards. `pgrep -f system-skill-advisor-launcher` before and after shows no extra process left |
| Risk | Parent criteria 1 and 6 need `main` and `origin/main` | The ticks cannot land in the worktree | Ticks for those two land in a closeout commit on `main` after the push, as tasks T019 to T023 order it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The parent goal's D6 orders the finish as merge, rebuild and restart, criteria, push. Criterion 6 needs the push first. Recommended default: merge, rebuild, restart, run criteria 1 to 5 on `main`, push, run criterion 6, then commit the parent ticks on `main` and push that commit.
- Phase 013's planning found that the 003 summary names `.vibe` fixtures among the drift-guard errors (`P/003-follow-up-routing-benchmark/implementation-summary.md:102`). They are WARN only. Recommended default: fix that row here, as Files to Change lists.
- The answers in `P/spec.md` came from session `db37536c-37e4-472c-8a05-521b8fec328d`. The writer wants each entry's exact question text. Recommended default: run the Claude sweep on that session's transcript first and use its keys and question text. For an answer the sweep does not list, use the topic before the comma in the answer line as the question and the line's words as the answer. Say in `why` that the source is `P/spec.md` continuity.
<!-- /ANCHOR:questions -->

---
