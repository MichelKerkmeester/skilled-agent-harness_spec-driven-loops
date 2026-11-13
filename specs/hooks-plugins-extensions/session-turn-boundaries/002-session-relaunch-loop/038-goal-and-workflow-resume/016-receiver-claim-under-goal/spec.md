---
title: "Feature Specification: Phase 16: receiver-claim-under-goal"
description: "A Claude receiver that starts on a carried goal gets its claim instructions only as SessionStart context. In five correctly timed live goal hops it claimed the note in two and answered PONG in three until Claude Code paused the goal, so the note stayed open. This phase first measures the claim rate under a goal that allows other work, and plans one change only if the receiver still skips the claim."
trigger_phrases:
  - "receiver claim under goal"
  - "phase 16 receiver claim under goal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: receiver-claim-under-goal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 17 |
| **Predecessor** | 015-pi-mode-and-descendant-walk |
| **Successor** | 017-handover-docs-and-harness |
| **Handoff Criteria** | The claim rate under a goal that allows other work is recorded from ten live runs, the decision gate in `goal.md` names its outcome, every acceptance row is Met or Waived by a decision record, and `validate.sh 016-receiver-claim-under-goal --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: The Claude receiver of a hop that carries a goal, and whether it claims its note. Live runs come first. A code change is planned only for the case the runs still show a skipped claim, and then only the recommended one in section 3. No change to the relaunch record format and no new module, per parent decision D3. Pi and OpenCode receivers are out, because they bind a goal record instead of starting on the goal command.

**Dependencies**:
- The live hop harness kept in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/`, copied into this phase's `scratch/harness/` before any edit.
- `tmux`, `node` and `claude` on the host. The 2026-11-13 runs used Claude Code 2.1.323 with `claude-sonnet-5-5`, and `claude --version` prints `2.1.323 (Claude Code)` today.
- The operator's greenlight before any step past planning.

**Deliverables**:
- Ten live goal hops under a goal that allows other work, with the claim rate stated as a count.
- A decision gate entry in `goal.md` that says whether the change is built.
- When the gate says build: the claim line appended to the Claude goal text after the slice, its tests, ten live runs under each of the two goals, and one README sentence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Claude receiver whose hop carries a goal starts on `/goal <slice>`, and its claim instructions arrive only as `SessionStart` start context (`.skilled/bin/skilled-loop:1213-1220`, `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:136-158`). In five correctly timed goal hops the goal carried every time, but the receiver claimed the note in only two, and in three it answered PONG until Claude Code paused the goal, so the note stayed `open` and the hand-over was lost. The harness goal says "reply PONG and do nothing else" (`make-goal.cjs:14` in the 028 harness), which competes with the claim, so the rate under a real goal that allows other work is unknown.

### Purpose
State the claim rate under a goal that allows other work from ten live runs, and when that rate still shows a skip, plan the one change that makes a goal receiver claim its note in every run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ cd specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/scratch/live-hops-claude-2026-11-13 && for d in 2-* 6-* 7-* 8-* 9-*; do printf '%s %s goal-start-claim=%s claimed-lines=%s\n' "$d" "$(grep -h '^status:' $d/note-final.md)" "$(grep -c goal-start-claim $d/relaunch.log)" "$(grep -cE 'Z  claimed ' $d/history.txt)"; done
2-goal-no-ping-pass status: done goal-start-claim=1 claimed-lines=1
6-goal-fixed-harness-receiver-did-not-claim status: open goal-start-claim=1 claimed-lines=0
7-goal-fixed-harness-receiver-did-not-claim status: open goal-start-claim=1 claimed-lines=0
8-goal-fixed-harness-receiver-did-not-claim status: open goal-start-claim=1 claimed-lines=0
9-goal-fixed-harness-pass status: done goal-start-claim=1 claimed-lines=1
```

The start hook logged `goal-start-claim` in all five runs, so the claim text reached the receiver every time. The receiver claimed in two of five. Each receiver extract shows the start context entry `hook_additional_context event=SessionStart`, and its content array opens with `mk claude hook could not resolve; rebuild the spec-kit runtime or restore the missing adapter`, in the passing runs and the failing runs alike, so that drift line is a confounder, not the cause these five runs can show.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Copy the 028 harness into this phase's `scratch/harness/` and give its `make-goal.cjs` an `open` goal that allows other work, keeping the `pong` goal as the default.
- Run ten live goal hops under the `open` goal and state the claim rate as a count of ten.
- Record the decision gate in `goal.md`: ten of ten claims closes the phase with no code change, and any skipped claim builds the recommended change.
- When the gate says build: append one claim line after the goal slice in the Claude start prompt, test first, then run ten live hops under each goal.
- When the gate says build: rewrite the one README sentence that says only the `chat_slice` is sent.

### Candidate changes, for the build branch of the gate

| ID | Change | Gains | Costs | Verdict |
|----|--------|-------|-------|---------|
| A | Append one claim line after the slice in the `/goal` text the wrapper sends (`.skilled/bin/skilled-loop:1217` and `:1029`, budget checked in `.skilled/hooks/session-relaunch/lib/goal-handover.cjs:95-138`) | The claim becomes part of the goal condition, the only text the failing receivers kept obeying, and the goal's own Stop check sends it back on every blocked turn end. No record change and no module | Uses part of the 4,000-character limit (`goal-handover.cjs:21`), so a slice near the limit loses the line. The goal text is no longer the bare `chat_slice` that README line 183 promises. It must follow the slice, because the Claude goal resolver takes the first non-empty line as the headline (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:624`) | Recommended |
| B | A `UserPromptSubmit` reminder while the note is open, in `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` | Small, and the hook already reads `UserPromptSubmit` (`context-nudge.mjs:57`) | A receiver with no operator gets goal continuations, not prompts, so whether the hook fires at all is UNCONFIRMED. The failing receivers made no tool call, so the `PostToolUse` route never fires either | Rejected unless a live check shows the event fires |
| C | A `Stop` block with a claim reminder while the note is open, in `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Fires at every turn end, the same channel the goal uses | Adds blocked turn ends to a session Claude Code pauses after nine (playbook line 768), and how two blocking Stop hooks merge their reasons is UNCONFIRMED. `stop-arm.mjs` is also the file phase 014 changes | Second choice |
| D | The `SessionStart` hook claims the note itself through `core.claimHandoff` and delivers the note body | No model step for the claim | `claimed` stops proving the receiver took the note, and the note then stalls at `claimed` instead of `open`, because `complete` still needs the model. The start hook starts writing state | Rejected |
| E | Pass the claim instructions with `--append-system-prompt` on the goal receiver | Stronger placement than start context | The prompt lasts the whole session and asks for a claim the CLI refuses once the note is `claimed`. An operator's own `--append-system-prompt` must be merged | Rejected |

### Out of Scope
- Pi and OpenCode receivers - they bind a goal record instead of starting on the goal command.
- The relaunch record format and any new module - parent decision D3.
- The 028 harness in place and the Claude playbook section - this phase edits a copy, and phase 017 owns the harness and the handover docs.
- The drift line in the sandbox start context - it appeared in passing and failing runs alike, so it is recorded, not fixed here.
- Candidates B to E - section 3 rejects or defers them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal/scratch/harness/` | Create | Copy of the 028 harness, with an `open` goal mode in `make-goal.cjs`. Always |
| `.skilled/hooks/session-relaunch/lib/goal-handover.cjs` | Modify | Build branch only. `renderGoalSlice` takes a claim line, appends it after the slice when both fit 4,000 characters and drops the line, not the goal, when they do not |
| `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` | Modify | Build branch only. The two claim-line tests |
| `.skilled/bin/skilled-loop` | Modify | Build branch only. `render_goal_slice` passes the claim seed on the hop path and the manual-claim path |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modify | Build branch only. The goal-hop test asserts the claim line after the slice |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Build branch only. A goal condition that ends with the claim line still resolves its packet |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Build branch only. The line 183 sentence on what the start prompt carries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The phase's harness copy writes a goal that allows other work. `node scratch/harness/make-goal.cjs <dir> 3990 open` writes a `goal.md` whose slice holds no `PONG` and no `do nothing else`, and whose met condition names a file no step creates. `node scratch/harness/make-goal.cjs <dir> 3990` with no mode still writes the `pong` goal byte for byte as the 028 copy does. |
| REQ-002 | Ten live goal hops run under the `open` goal with the harness timing of 2026-11-13. Each run keeps `summary.txt`, `relaunch.log`, `history.txt`, `note-final.md` and the receiver extract under `scratch/live-open/<n>/`. A run counts only when `relaunch.log` holds a `goal-start-claim` line, so every counted run delivered the claim. |
| REQ-003 | The claim rate is stated as a count. `goal.md` section 4 holds one decision gate row that names the count of runs whose `history.txt` has a `claimed` line, out of the counted runs, and names the branch taken: close with no change at ten of ten, build change A otherwise. |
| REQ-004 | Build branch only. `renderGoalSlice` in `.skilled/hooks/session-relaunch/lib/goal-handover.cjs` takes a `claimLine` and returns the slice, a blank line and the claim line when the whole text fits 4,000 characters. Test `appends the claim line after the slice and keeps the headline first` in `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` asserts the exact text and that its first line is the slice's first line. Today the function takes no claim line. |
| REQ-005 | Build branch only. When the slice and the claim line together pass 4,000 characters, `renderGoalSlice` returns the slice alone and still `ok`, so the goal is kept and the start context remains the claim's route. Test `drops the claim line, not the goal, when the two pass the limit` in `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` sends a 3,990-character slice with a claim line and asserts the slice alone. |
| REQ-006 | Build branch only. `.skilled/bin/skilled-loop` passes the claim seed to `render_goal_slice` on the hop path (`:1215-1219`) and the manual-claim path (`:1026-1031`). Test `a Claude hop with a goal starts on the goal command and carries the claim in the environment` in `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` changes its argument assertion from `/goal ${GOAL_SLICE}` to the slice followed by the claim line, and keeps its `SKILLED_LOOP_CLAIM_SEED` and `SESSION_RELAUNCH_GOAL_PACKET` assertions. |
| REQ-007 | Build branch only. A Claude goal condition that ends with the claim line still resolves its packet. Test `a Claude goal that ends with the claim line still resolves its packet` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` writes a goal log whose condition is a slice plus the claim line and asserts the packet comes back. |
| REQ-008 | Build branch only. Ten live goal hops under the `pong` goal and ten under the `open` goal, each built with a 3,500-character slice so the claim line fits, each end with the note `done`, kept under `scratch/live-after/pong/<n>/` and `scratch/live-after/open/<n>/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Build branch only. The README sentence on line 183 that says only the `chat_slice` is sent names the claim line after it, and no other README line changes. |
| REQ-010 | Build branch only. The named guard tests keep their assertions and pass: `renders exactly the chat slice the goal command prints, without frontmatter or comments` and `sends a slice of exactly 4000 characters and refuses 4001` in `goal-handover.test.cjs`, `a Claude hop keeps the claim seed as its start prompt when no goal can be sent` in `skilled-loop-wrapper-claim-goal.test.cjs`, `compact-pointer delivers the claim at the start of a goal-command receiver` in `claude-adapters.test.cjs` and `finds a goal headline outside the packet lineage` in `relaunch-core.test.cjs`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `goal.md` section 4 holds a decision gate row with a claim count out of ten for the `open` goal, read from ten `history.txt` files under `scratch/live-open/`.
- **SC-002**: On the close branch, a decision record waives REQ-004 to REQ-010 and `git diff --name-only -- .skilled` prints nothing.
- **SC-003**: On the build branch, `node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- **SC-004**: On the build branch, all twenty runs under `scratch/live-after/` end with `status: done` in `note-final.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code and the Sonnet model stay at the 2026-11-13 versions | A newer version could change goal or start context handling between the two run sets | Record `claude --version` in each `summary.txt` and compare both run sets on the same version |
| Dependency | Phases 011, 012 and 014 edit `.skilled/bin/skilled-loop` or `stop-arm.mjs` | A shared file could carry two phases' edits at once | Build this phase after them, and keep change A inside `render_goal_slice` and its two callers |
| Risk | Ten runs cannot prove a rate of one | Medium | State the count, not a percentage, and treat any skip as a skip |
| Risk | The `open` goal is easier to satisfy than a real goal, so the sender meets it before `prepare` | Medium | Its met condition names a file no step creates, and REQ-002 counts only runs that relaunched |
| Risk | A slice near 4,000 characters loses the claim line, so a goal at the limit claims no better than today | Medium | REQ-005 keeps the goal and the start context route, the unit test pins the 3,990-character case, and the limit is named in the README sentence |
| Risk | The claim line breaks the Claude goal packet search | High | The line goes after the slice, and REQ-007 pins the search |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: change A adds one string join and one length check to a launch path.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The claim line carries only the claim seed the wrapper already builds, so no new value reaches the prompt. The slice control-character check (`goal-handover.cjs:136`) runs on the whole text.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A slice that fits today still sends a goal after change A, with or without the line.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a hop with no goal packet keeps the claim seed as its start prompt and gets no claim line, as `skilled-loop:1213-1220` does today.
- Maximum input: a 3,990-character slice plus the claim line passes 4,000, so the slice goes alone and the start context still carries the claim.
- Failure path: a receiver that skips the claim leaves the note `open`, and the run is a fail in the count.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One harness copy, and on the build branch six files with no new module |
| Risk | 8/25 | The start prompt of every Claude goal hop changes on the build branch |
| Research | 9/20 | Live runs decide the branch, and four candidates rest on unconfirmed runtime behaviour |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a Claude goal continuation fire `UserPromptSubmit`? Only candidate B needs the answer, and B is rejected unless a live check shows it fires.
- Does a short slice with the claim line claim in every `pong` run? REQ-008 answers it on the build branch.
<!-- /ANCHOR:questions -->

---
