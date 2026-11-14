---
title: "Feature Specification: Phase 8: hop-purpose-rule-parity"
description: "The four hops that carry a packet's purpose state three different rules. The relaunch note copies the whole Purpose and does not skip the scaffold sentence, the resume brief quotes one sentence, and each hop labels an inherited purpose differently. This phase gives the two model-followed hops the rule and the three line shapes the helper already prints."
trigger_phrases:
  - "hop purpose rule parity"
  - "phase 8 hop purpose rule parity"
  - "purpose line label shapes"
  - "relaunch note scaffold sentence"
  - "parent purpose label"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: hop-purpose-rule-parity

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/374-purpose-carry-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-purpose-reader-coverage |
| **Successor** | 009-compaction-purpose-folder |
| **Handoff Criteria** | The label check in Measured Behavior prints only `Parent purpose (` and `Goal objective:` lines, the scaffold check prints `1` for all five files and `nudge.test.cjs` prints `pass 89` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The purpose rule text in the relaunch command doc and its nudge, the `purpose_row` rule in the two resume workflow assets, the two purpose lines of the resume presentation file, the one test line that pins the nudge text and one assertion that pins the resume label. No change to the helper, to the compaction hook or to the continuity writer, which already print the three shapes.

**Dependencies**:
- Phase 007 lands first. The rule text written here names the purpose shapes that phase 007 teaches the helper to read. Built without 007, the model-followed hops would read a purpose the code hops still miss.

**Deliverables**:
- One purpose rule, in the same words, in `handoff.md`, `nudge.cjs` and both resume assets
- The three line shapes `Purpose:`, `Parent purpose (<parent folder>):` and `Goal objective:` on every hop
- A nudge test that pins both labels and the scaffold skip
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A packet's purpose is meant to read the same after every hop, so the next AI recognizes it as the one fixed line in a context that otherwise changes. Today the four hops follow three rules. The compaction hook and the continuity save print what `packet-purpose.ts` returns: one sentence, capped at 300 characters, as `Purpose:`, `Parent purpose (<folder>):` or `Goal objective:`. The resume brief quotes one sentence and labels an inherited one `Purpose (parent <name>)` and a goal one `Purpose (goal.md)`. The relaunch note copies the whole Purpose text and labels it `Purpose (<file>)` or `Purpose (from parent <file>)`.

The relaunch rule also has no skip for the scaffold sentence that begins "Keep parent documentation lean". A note written under a parent that still holds that sentence copies it word for word as the reason for the work.

### Purpose
Make the relaunch note and the resume brief state the purpose by the same rule and in the same three line shapes that the compaction recovery and the continuity save already print.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Both ran from the worktree root on 2026-11-14 at `bd79708c2f`. The first lists every purpose label shape written in the command docs, the relaunch nudge and the helper. The second counts, per file, the lines that name the scaffold sentence. `rg -c` prints no line for a file with no match, so `handoff.md` and `nudge.cjs` are absent from the second output.
```text
$ rg -n -o "Purpose \(parent|Purpose \(from parent|Parent purpose \(|Purpose \(goal\.md\)|Purpose \(<file>\)|Goal objective:" .skilled/commands/speckit .skilled/hooks/session-relaunch/lib .skilled/skills/system-spec-kit/runtime/lib/spec | sort
.skilled/commands/speckit/assets/speckit-resume-auto.yaml:139:Purpose (goal.md)
.skilled/commands/speckit/assets/speckit-resume-auto.yaml:139:Purpose (parent
.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:158:Purpose (goal.md)
.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:158:Purpose (parent
.skilled/commands/speckit/assets/speckit-resume-presentation.txt:128:Purpose (goal.md)
.skilled/commands/speckit/assets/speckit-resume-presentation.txt:128:Purpose (parent
.skilled/commands/speckit/handoff.md:134:Purpose (<file>)
.skilled/commands/speckit/handoff.md:135:Purpose (from parent
.skilled/hooks/session-relaunch/lib/nudge.cjs:25:Purpose (<file>)
.skilled/hooks/session-relaunch/lib/nudge.cjs:27:Purpose (from parent
.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:137:Parent purpose (
.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:139:Goal objective:

$ rg -c -F 'Keep parent documentation lean' .skilled/commands/speckit/handoff.md .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts
.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:1
.skilled/commands/speckit/assets/speckit-resume-auto.yaml:1
.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Replace the relaunch purpose rule in `handoff.md` and in `GOAL_GUIDANCE` in `nudge.cjs` with the helper's rule: one sentence, 300 characters, the scaffold sentence skipped, and the helper's three line shapes.
- Replace `purpose_row` in both resume assets with the same rule and the same three shapes, and name the purpose shapes phase 007 reads.
- Reword the two purpose lines of the resume presentation file to match.
- Update the one assertion in `nudge.test.cjs` that pins the old `from parent` label, so it pins both new labels and the scaffold skip.
- Add one assertion in `test-phase-command-workflows.js` that both resume assets keep the `Parent purpose (<repo-relative parent folder>)` label in `purpose_row`, so a later edit cannot bring back a fourth label shape unnoticed.

### Out of Scope
- A command that prints the purpose line, for the two model-followed hops to run - editing the four rule texts in place gives the same line today, and no caller needs a second entry point to the helper.
- A test that compares the four rule texts with the helper's code - the texts are prose a model follows, and the label check in Measured Behavior already shows a stray shape.
- The record of the 2026-11-14 live resume run in `002-resume-purpose-row/tasks.md` task T073, which quotes the old `Purpose (parent ...)` label - it records what that run printed.
- The helper's own labels - they are already stored in live continuity blocks and asserted by three test files, so the two text rules move to them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/handoff.md` | Modify | The four Goal lines that state the purpose rule |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | `GOAL_GUIDANCE` states the same rule |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | One assertion pins the new labels and the scaffold skip |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Modify | `purpose_row` states the same rule |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Modify | `purpose_row` states the same rule |
| `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` | Modify | The Purpose row and the paragraph under the brief |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modify | One assertion per resume asset pins the shared `purpose_row` label |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hop writes a label shape other than the helper's three | The first Measured Behavior command prints twelve lines, each `Parent purpose (` or `Goal objective:`, two per file for the six files, and no line with `Purpose (parent`, `Purpose (from parent`, `Purpose (goal.md)` or `Purpose (<file>)` |
| REQ-002 | Every hop skips the scaffold sentence | The second Measured Behavior command prints `1` for each of the five files |
| REQ-003 | The relaunch note quotes one sentence, not the whole Purpose | `rg -c -F 'first sentence' .skilled/commands/speckit/handoff.md .skilled/hooks/session-relaunch/lib/nudge.cjs` prints `1` for each file, where it prints no line for either today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The relaunch tests still pass with the new nudge text | `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` prints `pass 89`, `fail 0` and `EXIT=0` |
| REQ-005 | The resume assets still load, the command checks hold and the resume label is pinned | The YAML load prints `yaml ok`, `test-phase-command-workflows.js` prints `Result: passed=150 failed=0` (148 before E9) and the four mirror checks print their baseline `PASS` lines |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The label check goes from five shapes across six files to two, `Parent purpose (` and `Goal objective:`, in every file.
- **SC-002**: The scaffold check prints `1` for `handoff.md` and `nudge.cjs`, where it prints no line for either today.
- **SC-003**: `nudge.test.cjs` still prints `pass 89`, with the changed assertion checking four substrings in place of three.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007. The rule text names the purpose shapes its reader accepts | Built first, this phase makes the resume brief and the relaunch note read purposes the compaction hook still misses | Build 007 first. The phase map's handoff row names the check |
| Risk | The resume brief and the relaunch note are written by a model that follows prose, so no test proves the line it prints | Medium. A model can still shorten or relabel the line | The rule gives the exact line shape in backticks, and phase 002 task T072 already defines the live resume check the operator can rerun |
| Risk | Phase 006 edits the `reply_format` line directly above `purpose_row` in both resume assets | Low. The two edits touch different lines | Each search text in `plan.md` is one whole line, and T004 confirms it still matches once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which label shape wins? Decision: the helper's. It is the only shape code produces. Two live continuity blocks already store it, and `hook-session-start.vitest.ts`, `history-locator-adapters.vitest.ts` and `save-continuity-write.vitest.ts` assert it. Moving the helper to a text rule's shape would change stored data and three test files. Moving the two text rules changes nothing stored.
- Whole Purpose or one sentence in the relaunch note? Decision: one sentence, capped at 300 characters. A note that copies a three-paragraph Purpose cannot read the same as the one-sentence line on the other hops.
- Should the relaunch line still name the file it was copied from? Decision: no for the packet's own purpose, because the note's `spec_folder` field already names the packet. An inherited line names the parent folder, as the helper does.
- Should the two model-followed hops run a command that prints the line? Decision: no. That adds an entry point to the helper for a result four text edits give today.
<!-- /ANCHOR:questions -->

---
