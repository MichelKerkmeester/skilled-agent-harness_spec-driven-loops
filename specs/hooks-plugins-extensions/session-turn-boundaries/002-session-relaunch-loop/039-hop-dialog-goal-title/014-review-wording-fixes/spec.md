---
title: "Feature Specification: Phase 14: review-wording-fixes"
description: "One README sentence, three code comments and one command document say something the relaunch code does not do, and one limit of the ended-goal mark is written nowhere. A reader who trusts them looks for a goal, a record writer or a retry that does not exist."
trigger_phrases:
  - "review wording fixes"
  - "phase 14 review wording fixes"
  - "relaunch comments and README corrected after review"
  - "goal_ended in the handoff command document"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: review-wording-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-conformance-stamp-pin |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 014-review-wording-fixes --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Close what two reviews of the eleven relaunch fixes confirmed specification.

**Scope Boundary**: Wording only. One README sentence, comment lines in three code files, one sentence in the handoff command document and one limitation row in the summary of phase 10. No line that runs changes, so no behavior changes.

**Dependencies**:
- Phase 11 bounded the goal fallback to the note's folder and its parent. The README sentence this phase corrects predates that bound.
- Phase 5 added the stamp that lets a prompt withdraw a record Stop could not arm. The Stop comment this phase corrects predates that stamp. The test note it corrects, at `tests/claude-adapters.test.cjs:959`, was written by the phase 5 commit `eaf24f999e` itself and repeats the old phrase beside the new stamp.
- Phase 10 added the `goal_ended` note field that the handoff command document does not name.
- The handoff command document changed on `main` after this branch started. `main` is in this branch as merge commit `be56fabc7b`, so its edit is made on the merged tree.

**Deliverables**:
- Five corrected texts and one added limitation, each with a search that proves it.
- A saved run of five existing tests that confirms what the corrected Stop comment says.
- A tree that holds `main`: `git merge-base --is-ancestor main HEAD` exits 0, and the trigger index and mirror checks pass on it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two reviews of 2026-11-14 found texts that say something the code does not do. The orchestrator checked each against the code.

The session-relaunch README says a Claude session that never had a goal leaves the field out "when no packet in the note's lineage has an unfinished `goal.md`" (`.skilled/hooks/session-relaunch/README.md:309`). Since phase 11 the code tries the note's folder and its parent only (`lib/relaunch-core.cjs:678`). A reader who misses a `Goal packet:` line would look for a grandparent goal the code never considers.

The comment in `readRelaunchFile` says every writer stamps the note, "an empty one for a record that has none left" (`lib/relaunch-core.cjs:1299`). No writer does that. `preparePending` is the one place the core sets `handoff` (`lib/relaunch-core.cjs:1028`).

The Stop adapter says a record whose payload has no transcript path "stays pending for the next Stop" (`claude/stop-arm.mjs:132` to `:134`), and the test note for that path repeats it (`tests/claude-adapters.test.cjs:959`). The comment is older than phase 5. The note was written by the phase 5 commit `eaf24f999e`, in the same change that added the stamp. Since phase 5 the record is stamped, and the operator's next prompt withdraws a stamped record (`lib/withdraw.cjs:26` to `:28`, called from `claude/context-nudge.mjs:63`). The next Stop retries only when it comes without a typed prompt.

The same phrase stands a third time at `tests/claude-adapters.test.cjs:708`. That note sits in the background-task test (`:683`) and was written by `5c0b9372d9` on 2026-10-24, before phase 5. It is right, because a task that reports back is not a typed prompt and the next Stop does retry. It stays as it is.

The handoff command document, which a model reads when it writes a note by hand, names `goal_packet` as owned by `prepare` and `keep` and never names `goal_ended` (`.skilled/commands/speckit/handoff.md:127` to `:129`). A hand-written value is removed without a word.

The ended-goal mark is matched on the session id that claimed the note (`lib/relaunch-core.cjs:639`). A receiver whose session id changes after the claim loses the mark. The summary of phase 10 records the moved note and not the session id.

### Purpose
The README, the three comments and the handoff command document say what the relaunch code does, and the summary of phase 10 names the session id the ended-goal mark depends on.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root on 2026-11-14 at commit `be1aebb9f3`. Each command prints one of the texts or the code beside it. The last shows that `main` is not yet in this branch.

```text
$ rg -n -o "no packet in the note's lineage" .skilled/hooks/session-relaunch/README.md
309:no packet in the note's lineage
exit=0

$ rg -n 'lineage\.slice\(0, 2\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
678:    const nearby = lineage.slice(0, 2);
exit=0

$ sed -n '1299,1301p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
  // Every writer stamps the note a record hands over, an empty one for a record that has
  // none left. A record with no such field was not written here, and reading it as pending
  // would let a Stop arm a hop that has no note to claim.
exit=0

$ rg -n '\bhandoff: ' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
1028:    handoff: handoffPath,
exit=0

$ rg -n 'stays pending for the next Stop' .skilled/hooks/session-relaunch
.skilled/hooks/session-relaunch/claude/stop-arm.mjs:133:  // path can never finish arming: the record stays pending for the next Stop
.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:708:  // The record stays pending for the next Stop and gains only the deferral mark.
.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:959:  // The record stays pending for the next Stop, and the mark lets a prompt withdraw it.
exit=0

$ rg -c 'goal_ended' .skilled/commands/speckit/handoff.md
exit=1

$ rg -c 'goal_ended' .skilled/hooks/session-relaunch/README.md
2
exit=0

$ git merge-base --is-ancestor main HEAD
exit=1
```

The README names the whole lineage at line 309 while the code slices two folders at line 678. The core sets `handoff` on one line. The phrase about the next Stop stands in three places. Two are stale, the Stop comment and the test note at line 959, and the note at line 708 is right. The handoff command document holds no `goal_ended`, and the README holds it twice. That a prompt withdraws a stamped record is read from the code and from the names of existing tests. No test was run here, and the first setup task runs them.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the README sentence at line 309 to name the note's spec folder and its parent.
- Correct the comment at `lib/relaunch-core.cjs:1299` to name `preparePending` as the one writer of the note path.
- Correct the comment at `claude/stop-arm.mjs:132` and the test note at `tests/claude-adapters.test.cjs:959` to say the record is marked so a prompt withdraws it, and that a Stop with no typed prompt tries again.
- Add one sentence to the handoff command document that `prepare` and `keep` own `goal_ended`, on a tree that holds `main`.
- Add one limitation to the summary of phase 10: the mark is matched on the claiming session id.
- Confirm that `git merge-base --is-ancestor main HEAD` exits 0, and check the trigger index and the runtime mirrors on that tree.

### Out of Scope
- Reading a record with an empty `handoff` as absent: review B named it as hardening. Phase 6 chose to keep the empty string readable because `shouldRelaunch` declines it as `incomplete-record` and a wrapper test depends on that. No writer produces the shape.
- Any change to what the ended-goal mark matches on: whether a session id changes on `/clear` is not confirmed, so the limit is written down and the code waits for that check.
- A Purpose line in the session-relaunch README and any change to `GOAL_GUIDANCE` in `lib/nudge.cjs`: both belong to the purpose-carry packet `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/`.
- The comment on the background-task path at `claude/stop-arm.mjs:141` to `:143` and the test note on the same path at `tests/claude-adapters.test.cjs:708`: a task that reports back is not a typed prompt, so that Stop does retry and both are right.
- Merging or pushing without the operator: parent decision D4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/README.md` | Modify | Line 309 says "when neither the note's spec folder nor its parent has" in place of "when no packet in the note's lineage has" |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Comment lines 1299 to 1301 only |
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | Comment lines 132 to 134 only |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Comment line 959 only |
| `.skilled/commands/speckit/handoff.md` | Modify | One sentence after line 129 on `goal_ended`, written after `main` is merged |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Generated | Rebuilt by `generate-trigger-index.mjs` after `main` is merged, when its `--check` exits 1. Never edited by hand |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` | Modify | One more row under Known Limitations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The README sentence on a missing `Goal packet:` line names the note's spec folder and its parent. `rg -c "no packet in the note's lineage" .skilled/hooks/session-relaunch/README.md` prints nothing with exit 1, and `rg -c "neither the note's spec folder nor its parent" .skilled/hooks/session-relaunch/README.md` prints 1. |
| REQ-002 | The comment in `readRelaunchFile` names no writer of an empty `handoff`. `rg -c 'an empty one for a record' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1, and the comment names `preparePending`. |
| REQ-003 | The phrase "stays pending for the next Stop" is gone from the Stop adapter and from the test note at `tests/claude-adapters.test.cjs:959`, after five existing tests have shown that the path stamps the record and that a prompt withdraws a stamped record while a task that reports back does not. The note at `:708` keeps the phrase, because on the background-task path the next Stop does retry. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The handoff command document says `prepare` and `keep` own `goal_ended`. `rg -c 'goal_ended' .skilled/commands/speckit/handoff.md` prints 1, and the edit is made on a tree where `git merge-base --is-ancestor main HEAD` exits 0. |
| REQ-005 | The summary of phase 10 names the session id as a limit of the ended-goal mark. `rg -c 'matched on the session id' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` prints 1. |
| REQ-006 | The three code files change in comment lines only. For each, the changed lines of the first commit of this phase all start with `//` after their indent, `node --check` exits 0, and the relaunch and OpenCode plugin suites pass with the baseline count. |
| REQ-007 | `git merge-base --is-ancestor main HEAD` exits 0, and on that merged tree the trigger index check and the mirror check both pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled/hooks/session-relaunch` prints one line, which starts with `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:708:`. That is the note on the background-task path, which is right and stays. The stale note at `:959` is gone.
- **SC-002**: `scratch/withdraw-tests.txt` shows 5 of 5 for the five existing tests that back the corrected Stop comment.
- **SC-003**: `rg -c 'goal_ended' .skilled/commands/speckit/handoff.md` prints 1 on a tree that holds `main`.
- **SC-004**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count.
- **SC-005**: `validate.sh 014-review-wording-fixes --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `main` merged into this branch, done as merge commit `be56fabc7b` | The handoff command document is edited on the merged tree, because `main` added seven lines four lines below the edit | `git merge-base --is-ancestor main HEAD` exits 0 before the handoff task starts, so no task of this phase waits on the merge |
| Risk | A comment edit changes a line that runs | High | Each code file is checked: every changed line of the first commit of this phase starts with `//`, `node --check` exits 0 and the whole suite runs |
| Risk | The corrected Stop comment is itself wrong, because a prompt does not withdraw the record | Med | Five existing tests run first. If any fails, the comment and the note at `:959` stay as they are and the failure is reported |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: no line that runs changes.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: comments and documents only.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: The suite count after the edit equals the baseline, which shows no test was added, removed or broken.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A: no code path takes input in this phase.
- Maximum input: the phrase about the next Stop stands in three places. The two on the missing transcript path are corrected and the one on the background-task path stays, so the search for it prints that one line.
- Failure path: if one of the five tests fails, the Stop comment and the note at `:959` are left unchanged, the task is marked `[B]` and the failing output is saved in `scratch/`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Six files and one generated index, about fifteen lines of text, no line that runs |
| Risk | 3/25 | A comment edit that touches code, and one edit that waits on a merge |
| Research | 3/20 | Five review findings, each checked against the code |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a Claude session id change on `/clear`? Not confirmed. Decision: the limit is written into the summary of phase 10, and comparing `CLAUDE_CODE_SESSION_ID` before and after `/clear` answers it.
- May `main` be merged into this branch now? Answered by the operator on 2026-11-14: "Merge before building (Recommended)". `main` is in this branch as merge commit `be56fabc7b`, and `git merge-base --is-ancestor main HEAD` exits 0 there. T011 finds nothing left to merge unless `main` has moved since.
<!-- /ANCHOR:questions -->

---
