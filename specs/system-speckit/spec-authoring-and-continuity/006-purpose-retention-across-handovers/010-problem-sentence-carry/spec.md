---
title: "Feature Specification: Phase 10: problem-sentence-carry"
description: "The purpose line a packet carries after a compaction says what the work delivers, and often not why it exists or for whom. The Problem Statement holds that and no hop carries it. This phase adds one Problem line under the Purpose line in the context recovered after a compaction."
trigger_phrases:
  - "problem sentence carry"
  - "phase 10 problem sentence carry"
  - "problem line after compaction"
  - "problem statement beside the purpose"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: problem-sentence-carry

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/374-purpose-carry-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-compaction-purpose-folder |
| **Successor** | None |
| **Handoff Criteria** | `hook-session-start.vitest.ts` prints `(28 tests)`, `packet-purpose.vitest.ts` prints `Tests  9 passed (9)` and `history-locator-adapters.vitest.ts` prints `(19 tests)`, all passing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: One new field and one new function in the purpose helper, and the `## Packet Purpose` section the two compaction adapters print. The stored `packet_purpose` value, the resume brief and the relaunch note stay as they are.

**Dependencies**:
- Phase 007 lands first. The new `problemIn` function calls `paragraphAfter`, which phase 007 creates.
- Phase 009 lands first. Two search texts in `plan.md` are lines that phase 009 writes in the two adapters and in the Claude test file.

**Deliverables**:
- `resolvePacketPurpose` returns the first sentence of the Problem Statement beside the purpose
- A `Problem:` line under the purpose line in the context recovered after a compaction, for Claude, Codex, Cursor, DSH and Pi
- One new test and five extended assertions
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The operator reported that the core reason, problem or user need of a packet is lost across handovers and compactions. The five built phases carry one sentence of the Purpose. A Purpose says what the work delivers. The reason it exists and whom it serves sit in the Problem Statement, which the spec template asks for as "what breaks, and for whom", and no hop reads it. After a compaction the next AI therefore sees what to build and not the pain it answers. The independent review names this as the way the work is narrower than the need.

### Purpose
After a compaction, show the first sentence of the packet's Problem Statement under its purpose line, so the recovered context says why the work exists as well as what it delivers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Both ran from the worktree root on 2026-11-14 at `bd79708c2f`. The first counts, per file, the lines that mention a problem in the helper and the two compaction adapters. `rg -c` prints no line for a file with no match, and it printed nothing at all. The second counts the live `spec.md` files that have a `### Problem Statement` heading, out of the 2963 that phase 007's Measured Behavior counts.
```text
$ rg -c -i 'problem' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts

$ rg -l '^\s*###\s+Problem Statement\s*$' specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | wc -l
    2656
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add a `problem` field to the value `resolvePacketPurpose` returns: the first sentence under `### Problem Statement` in the folder the purpose came from, or null.
- Add `formatPacketProblem` beside `formatPacketPurpose`. Extending `formatPacketPurpose` in place fails, because the continuity writer stores its result in `packet_purpose` (`runtime/cli/core/workflow.ts:615`), which holds one line of at most 512 characters, and a second sentence would push inherited lines over that limit.
- Print the `Problem:` line under the purpose line in `buildPacketPurposeSection` and in the Pi adapter.
- Extend five assertions and add one test.
- Name the new line in three README rows.

### Out of Scope
- A Problem line in the continuity save - the stored value is capped at 512 characters and no default path renders it.
- A Problem row in the resume brief and a Problem line in the relaunch note - a resume reads the packet's `spec.md` itself, and a relaunch note's Goal section already asks the session to say what it works toward. A compaction is the one hop where nothing else supplies the problem.
- A problem read from a combined `## PROBLEM & PURPOSE` section - there the purpose line phase 007 reads is already the problem paragraph, unless the author labelled a purpose.
- A problem for a packet whose purpose came from `goal.md` - a goal file has no Problem Statement.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | Modify | The `problem` field, `problemIn` and `formatPacketProblem` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | The section prints the Problem line |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Modify | The section prints the Problem line |
| `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts` | Modify | Four assertions name the `problem` field |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modify | One new test |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modify | One fixture and one assertion |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` | Modify | One row for `formatPacketProblem` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | Modify | The `session-prime.ts` row names the Problem line |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md` | Modify | The `session-compact-context.ts` row names the Problem line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The helper returns the problem sentence beside the purpose, and null where the packet states none | `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `Tests  9 passed (9)` with the four extended assertions |
| REQ-002 | The context recovered after a compaction prints the Problem line under the purpose line | The test `adds the problem under the purpose line` passes, and `hook-session-start.vitest.ts` prints `(28 tests)` |
| REQ-003 | The Pi adapter prints the same line | `history-locator-adapters.vitest.ts` prints `(19 tests)`, all passing, with the extended assertion |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The stored `packet_purpose` value is unchanged | `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/thin-continuity-record.vitest.ts runtime/tests/authored-continuity-snapshot.vitest.ts`, run from the runtime folder, passes with the test counts captured in task T002, and `git status --short` does not list `runtime/cli/core/workflow.ts` |
| REQ-005 | The runtime still typechecks and builds | `npm run typecheck` and `npm run build` in the runtime folder exit 0, and `rg -c 'formatPacketProblem' dist/lib/spec/packet-purpose.js` prints `1` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The first Measured Behavior command prints a count for all three files, where it prints nothing today.
- **SC-002**: `hook-session-start.vitest.ts` goes from 27 tests to 28, with the new test asserting the exact two-line section.
- **SC-003**: The two continuity test files pass with the same counts as before the edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 007 and 009. This phase calls a function 007 creates and edits lines 009 writes | Built out of order, four search texts match nothing | T001 checks for both before any edit |
| Risk | The operator approved a design that quotes the Purpose only. This phase widens it | Medium. The work may not be wanted | It is a separate phase with no later phase depending on it, so it can be dropped whole |
| Risk | The section grows from one line to two, each up to 300 characters | Low. It leads the recovered context and the budget cut drops trailing sections first | The section stays first, and the new test asserts the output starts with both lines |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does the operator want the problem carried as well as the purpose? Default taken for this plan: yes, because the original report names the problem and the user need beside the purpose. The operator approved a design that quotes the Purpose only (decision Q003 in the parent's `decision-record.md`), so this needs their yes before the build. A no drops this phase and changes no other phase.
- Which hops get the Problem line? Decision: the compaction recovery only. It is the hop where code prints the line and nothing else supplies the problem. The reasons for the other three hops are in Out of Scope.
- One line or a second field? Decision: a second line from a second function. `formatPacketPurpose` stays one line because its result is stored.
- Whose problem is shown for an inherited purpose? Decision: the parent's, from the same `spec.md` the purpose came from, so the two lines belong together.
<!-- /ANCHOR:questions -->

---
