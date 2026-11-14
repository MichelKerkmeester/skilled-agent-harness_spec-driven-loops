---
title: "Feature Specification: Phase 12: review-agent-gates"
description: "The review agent's self-checks contradict each other and leave a low-confidence review with no exit. Its final-line checker is named but never run, and it carries gate types no caller sends and an advisory score restated nine times. This phase fixes the four review findings it owns."
trigger_phrases:
  - "review agent gates"
  - "phase 12 review agent gates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: review-agent-gates

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 14 |
| **Predecessor** | 011-debug-agent-revert-and-handoff |
| **Successor** | 013-context-markdown-design-fixes |
| **Handoff Criteria** | Each of review-2, review-3, review-4 and review-6 has a shipped fix or a recorded close with a command output behind it, and the roster and mirror checks pass after the `review.md` edit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the agent alignment follow-ups packet.

**Scope Boundary**: The `@review` agent definition, `.skilled/agents/review.md`, its `.claude/agents/review.md` fork and the Pi, Codex and harness copies the sync scripts generate from it. The sk-code review mode, its checker scripts, the `/speckit:implement` and `/speckit:complete` review entries and `orchestrate.md` do not change. Findings review-1 (the fast-path `Max 5 tool calls`) and review-5 (the untrusted-content rule) and the shared self-score rule belong to phase 6 and are not planned here.

**Dependencies**:
- Phase 6 (`006-shared-agent-contract`) builds first. It owns the fast-path budget at `review.md:63` and the self-score rule this phase applies to the advisory score.
- Phase 11 (`011-debug-agent-revert-and-handoff`) is the predecessor in the build order. It edits no file this phase edits.

**Deliverables**:
- Self-check question 6 that agrees with the fast path's skip of the adversarial self-check
- An exit for a review whose verification gap cannot be closed
- A step 7 that runs the mode's two report checkers on the finished report
- One gate type in place of three, and a shorter advisory score that follows the phase 6 rule
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fast-path review skips the adversarial self-check (`review.md:386`), and self-check question 6 then answers NO, which `:364` turns into DO NOT SEND. A review with a gap it cannot close has no way out either. The LOW row at `:372` and the recovery at `:380` both say fix it first, while the result block at `:290` defines `low_confidence` for exactly that report. Step 7 never runs the final-line and findings checkers that `:250` relies on, although both read stdin and the agent has Bash. The Gate Types table at `:229-233` lists `pre_execution` and `mid_execution`, which nothing sends, and the advisory score takes 19 lines and is declared non-deciding on nine lines.

### Purpose
Every review the agent can produce has a send path its own rules allow, its report passes through the checkers that grade it, and the file states only the gate type and score rules a caller uses.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git diff 09f1d6499a c1dbb1bcc4 -- .skilled/agents/review.md .claude/agents/review.md | wc -l
0
$ wc -l .skilled/agents/review.md .claude/agents/review.md
462 .skilled/agents/review.md
447 .claude/agents/review.md
909 total
$ rg -n 'Skip in Fast Path mode|Did I run adversarial self-check|If ANY is NO' .skilled/agents/review.md
362:6. Did I run adversarial self-check on all P0/P1 findings?
364:If ANY is NO → DO NOT SEND. Fix verification gaps first.
386:**When:** Required for all P0/P1 findings before they enter the final report. Skip in Fast Path mode (low complexity reviews).
$ rg -n 'Missing key verification steps|Fix gaps|insufficient evidence -> .low_confidence.' .skilled/agents/review.md | cut -c1-110
290:Map `failure_type` from existing severity vocabulary only: any P0 blocker -> `p0`, unresolved P1 required 
372:| **LOW**    | Missing key verification steps              | DO NOT send until fixed |
380:**Violation Recovery:** STOP → State "I need to verify my findings" → Run verification → Fix gaps → Then s
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js < .skilled/skills/sk-code/sk-code-review/scripts/tests/fixtures/review-output/status-commented-open-p1.md; echo "exit=$?"
FAIL: Review status "COMMENTED" contradicts P1 finding 1, which blocks approval
exit=1
$ rg -n 'final-line checker' .skilled/agents/review.md; rg -c 'check-review-final-line|check-review-findings' .skilled/agents/review.md; echo "exit=$?"
250:The mode's final-line checker fails a report where they disagree.
exit=1
$ ls .skilled/skills/sk-code/sk-code-review/scripts/*.js
.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js
.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js
.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
$ rg -n 'readFileSync\(0' .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js; rg -n 'readCliInput\(' .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js
269:    return inputPath === null ? fs.readFileSync(0, 'utf8') : fs.readFileSync(inputPath, 'utf8');
150:  const text = readCliInput('check-review-findings.js');
$ bash <step-7 command with the report of pr-shape-valid.md in its heredoc>
OK: review output ends on the exact status line
OK: findings are numbered once and each carries a Case line
final-line=0 findings=0
$ bash <step-7 command with the report of status-commented-open-p1.md in its heredoc>
OK: review output ends on the exact status line
FAIL: Review status "COMMENTED" contradicts P1 finding 1, which blocks approval
final-line=0 findings=1
$ bash <step-7 command with the report of overall-contradicts-status.md in its heredoc>
FAIL: Overall assessment "REQUESTED_CHANGES" contradicts the final status line "Review status: APPROVED"
FAIL: Review status "APPROVED" contradicts P0 finding 1, which blocks approval
final-line=1 findings=1
$ sed -n '168,186p' .skilled/agents/review.md | wc -l
19
$ sed -n '/^### Advisory Score/,/^## 7\./p' .skilled/agents/review.md | wc -l
23
$ rg -n 'score is advisory|no score, band|never the verdict|No score threshold|score traceable|Let a score|with the score advisory|Never let the score|No score turns' .skilled/agents/review.md | cut -c1-90
24:Read-only code review specialist that applies the sk-code review mode to PRs and code c
153:The gate result is this table read off the findings. It is not a second verdict, and n
170:The score is information for the reader, never the verdict and never a gate. It sums f
223:**Input**: gate_type (pre/mid/post_execution), task_id, artifact (code/file path), con
303:- Derive the verdict from severity alone, and keep the advisory score traceable to its
317:- Let a score, band or threshold decide the verdict
358:2. Does the verdict follow from the findings' severity alone, with the score advisory?
426:**Never let the score decide**
429:- No score turns a pass into a fail, or a fail into a pass
$ rg -n 'pre_execution|mid_execution|pre/mid' .skilled/agents/review.md | cut -c1-80
223:**Input**: gate_type (pre/mid/post_execution), task_id, artifact (code/file 
231:| **pre_execution**  | Before task starts | Scope validation, pattern check 
232:| **mid_execution**  | At checkpoint      | Progress validation, early issue
460:- `.skilled/agents/orchestrate.md`: the dispatcher for review-gate validatio
$ rg -n 'gate_type' .skilled/agents/orchestrate.md .skilled/commands --glob '!**/create-*'
.skilled/commands/speckit/assets/speckit-implement.yaml:277:    review_mode: "Gate Validation with gate_type post_execution. One dispatch per run, and one more after a REQUESTED_CHANGES verdict."
.skilled/commands/speckit/assets/speckit-implement.yaml:574:        gate_type: post_execution
.skilled/commands/speckit/assets/speckit-complete.yaml:300:    review_mode: "Gate Validation with gate_type post_execution. One dispatch per run, and one more after a REQUESTED_CHANGES verdict."
.skilled/commands/speckit/assets/speckit-complete.yaml:984:        gate_type: post_execution
$ rg -n 'mid_execution' .skilled .claude --glob '!**/z_archive/**'
.skilled/agents/review.md:232:| **mid_execution**  | At chec
.claude/agents/review.md:217:| **mid_execution**  | At check
```

The step-7 command is the one `plan.md` section 3 gives, run from the repository root with the fixture text from `.skilled/skills/sk-code/sk-code-review/scripts/tests/fixtures/review-output/` as the heredoc body. The `create-*` workflow files are excluded from the `gate_type` search because their `gate_type: SOFT_BLOCK` is a workflow gate, not a review gate type.

**Finding classification**:
- review-2: reproduced. `:386` skips the self-check in the fast path, `:362` asks whether it ran and `:364` blocks the send on a NO.
- review-3: reproduced. `:372` and `:380` have no exit for a gap that cannot be closed, and `:290` defines `low_confidence`. The reviewer's fix, send as `COMMENTED`, is not planned: the findings checker fails a `COMMENTED` status over an open P1 (exit 1 above), and `COMMENTED` maps to PASS at `:150`.
- review-4: reproduced. Both checkers exist, read stdin and print the failure the report would carry. `review.md` names neither script and no step runs one.
- review-6: partly reproduced. The score section is 19 lines and nine lines declare the score non-deciding. `orchestrate.md` sends no `gate_type`, but `/speckit:implement` and `/speckit:complete` send `post_execution`, so only the `pre_execution` and `mid_execution` rows have no sender.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- review-2: make self-check question 6 accept a fast-path review that skipped the adversarial self-check
- review-3: give the LOW confidence row, the `:364` rule and the violation recovery one exit: send the report with the gap on its `Not checked:` line and confidence LOW
- review-4: make step 7 run `check-review-final-line.js` and `check-review-findings.js` on the finished report through stdin, and fix the report on a non-zero exit
- review-6: drop the `pre_execution` and `mid_execution` gate rows and their two mentions, stop naming `@orchestrate` as the gate caller at `:137` and `:221`, merge the two score tables, drop the repeated "Never let the score decide" block and apply the phase 6 self-score rule
- Carry the edit through the `.claude` fork and the three generated runtime copies

### Out of Scope
- review-1 and review-5, and the shared self-score rule itself - phase 6 owns them
- Removing the advisory score - it is a shipped output field that `:225`, `speckit-implement.yaml:583`, the `pr-shape-valid.md` checker fixture and the sk-code feature catalog all name
- Changing the checker scripts, the review mode or the `/speckit:*` verdict handling - the findings are about the agent text, and the checkers already behave as the agent says
- Making a LOW-confidence review fail the gate - that changes the verdict table and its consumers, so it waits for the operator answer in section 7

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/review.md` | Modify | Question 6, the LOW row and its exit, step 7, the gate types and the advisory score |
| `.claude/agents/review.md` | Modify | The same edits by hand, anchored by text because the fork runs 15 lines behind |
| `.pi/agents/review.md` | Regenerate | Rewritten by `sync-agents-pi.cjs` |
| `.codex/agents/review.toml` | Regenerate | Rewritten by `codex/sync-agents.cjs` |
| `.dsh/agents/review.patch.yml` | Regenerate | Rewritten by `sync-agents-dsh.cjs` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `@review` copies agree after the edit. | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync`, both exit 0, and `wc -l .skilled/agents/review.md` prints 600 or less |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | review-2: self-check question 6 holds for a fast-path review that skipped the adversarial self-check. | `rg -c 'or is this a Fast Path review' .skilled/agents/review.md .claude/agents/review.md` prints 1 for each file |
| REQ-003 | review-3: a gap that cannot be closed is sent with confidence LOW and named on the `Not checked:` line, and the verdict still follows the Section 6 table. | `rg -c 'DO NOT send until fixed' .skilled/agents/review.md` prints nothing and exits 1, and `rg -c 'cannot be closed' .skilled/agents/review.md` prints 2 or more |
| REQ-004 | review-4: step 7 runs both report checkers on the finished report through stdin and fixes the report on a non-zero exit. | `rg -c 'check-review-final-line.js' .skilled/agents/review.md` prints 1 or more where it printed 0, and the step 7 command run on `pr-shape-valid.md` prints `final-line=0 findings=0` and on `status-commented-open-p1.md` prints `findings=1` |
| REQ-005 | review-6: the gate type list holds only `post_execution`, the type a caller sends, and the file names the callers that send it. | `rg -c 'pre_execution\|mid_execution\|pre/mid' .skilled/agents/review.md` prints nothing and exits 1, `rg -c 'post_execution' .skilled/agents/review.md` prints 1 or more, and `rg -c 'invoked by orchestrator for review gate' .skilled/agents/review.md` exits 1 |
| REQ-006 | review-6: the advisory score keeps its five dimensions in one table, and the repeated non-deciding block is gone. | `sed -n '/^### Advisory Score/,/^## 7\./p' .skilled/agents/review.md \| wc -l` prints 15 or less where it printed 23, plus any lines REQ-007 adds, which `implementation-summary.md` names, and `rg -c 'Never let the score decide' .skilled/agents/review.md` prints nothing |
| REQ-007 | review-6: the advisory score follows the self-score rule phase 6 ships. | The rule's anchor text, taken from phase 6's `implementation-summary.md`, matches one line of `review.md` under `rg -n`, or this phase's `implementation-summary.md` records that phase 6 shipped no rule that applies to the review score |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each owned finding id has a row in `implementation-summary.md` with the command that shows it fixed or closed.
- **SC-002**: The step 7 command passes `pr-shape-valid.md` and fails `status-commented-open-p1.md` and `overall-contradicts-status.md`, as it does in the Measured Behavior block.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 6 edits the same file and writes the self-score rule | Line numbers move and REQ-007 has no rule to apply until phase 6 ships | Phase 1 re-runs the Measured Behavior commands after phase 6 lands, every edit is anchored by text, and REQ-007 closes on a recorded no-op when phase 6 ships no rule for this score |
| Dependency | Phase 6 sets the fast-path tool budget | Step 7 adds one Bash call to every review, the fast path included | The phase 6 budget is read before the step 7 edit, and the extra call is named in this phase's summary for phase 6 to count |
| Risk | A report that holds the line `REVIEW_EOF` ends the heredoc early | Medium | The step names the delimiter and tells the agent to pick another when the report holds it |
| Risk | The `.claude` fork drifts from the canonical file | Low | The fork is edited by text anchor, and the mirror check runs before the phase closes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a LOW-confidence review with no P0 or open P1 pass the gate? Default taken in this plan: yes. The status still follows the Section 6 table, and the gap travels on the `Not checked:` line and in `confidence: LOW`. Making it fail would change the verdict table and the `/speckit:implement` and `/speckit:complete` verdict handling, which this phase does not own.
- The phase 6 self-score rule is not written yet, because phase 6 is still at its scaffold. REQ-007 waits on it and invents no wording.
<!-- /ANCHOR:questions -->

---
