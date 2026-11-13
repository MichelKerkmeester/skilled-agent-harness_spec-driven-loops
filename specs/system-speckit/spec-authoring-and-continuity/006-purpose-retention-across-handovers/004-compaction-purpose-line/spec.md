---
title: "Feature Specification: Phase 4: compaction-purpose-line"
description: "The context a session gets back after a compaction names the last spec folder and never opens its spec.md, so it carries no purpose. This phase adds one shared helper that reads the packet's purpose and leads the post-compaction context with it on Claude, Codex, Cursor, DSH and Pi."
trigger_phrases:
  - "compaction purpose line"
  - "phase 4 compaction purpose line"
  - "packet purpose after compaction"
  - "resolvePacketPurpose helper"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: compaction-purpose-line

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/371-purpose-retention-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-relaunch-goal-quote |
| **Successor** | 005-continuity-purpose-field |
| **Handoff Criteria** | `runtime/lib/spec/packet-purpose.ts` exports `resolvePacketPurpose` and `formatPacketPurpose`, the five test files in `plan.md` pass 71 of 71 and the runtime build and typecheck exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The context injected after a compaction, and the one helper that reads a packet's purpose. No change to the PreCompact cache, the resume brief, the relaunch note, the scaffold or the continuity block.

**Dependencies**:
- None blocking. Child 005 is planned after this phase and imports `resolvePacketPurpose` from `runtime/lib/spec/packet-purpose.ts`, so the export name and signature in `plan.md` are a contract once this phase ships.

**Deliverables**:
- A new module `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts`
- A `## Packet Purpose` section at the top of the compact output of `runtime/hooks/claude/session-prime.ts`
- The same section in the message `runtime/hooks/pi/session-compact-context.ts` sends
- Seven new tests and one added assertion across three test files
- Five README rows that name the new module and the new section
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The parent exists to keep a packet's problem, purpose and user need in front of the next session across relaunch hops and compactions, because the purpose is written once in `spec.md` and no hop reads it back.

Locally, a session that compacts gets back transcript fragments and the name of its last spec folder, and nothing that says why the work exists. On Claude, Codex, Cursor and DSH the context arrives through `runSessionStartHook` with `source: 'compact'` in `runtime/hooks/claude/session-prime.ts`. It wraps the brief cached at PreCompact and appends `Last active: <folder>` from hook state, and it never opens that folder's `spec.md`. Pi builds its own message in `runtime/hooks/pi/session-compact-context.ts` from the same hook state, with the same gap. All runtime paths here are under `.skilled/skills/system-spec-kit/`. The measurement below shows the result for this phase's own parent packet: five headings, the folder name and no purpose.

### Purpose
After a compaction on Claude, Codex, Cursor, DSH or Pi, the recovered context opens with one sentence quoted from the last active packet's purpose, so the session keeps why the work exists and not only what it touched.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
The script seeds one session the way PreCompact does (`buildMergedCompactResult` then `persistCompactResult`), sets `lastSpecFolder` to the parent packet, runs the built `session-prime.js` with `source: 'compact'` and counts `## Packet Purpose` headings and the parent's purpose text in what it prints.
```text
$ node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/004-compaction-purpose-line/scratch/measure-compact-brief.mjs "$PWD/.skilled/skills/system-spec-kit/runtime" specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers 2>/dev/null | rg -n '^## |^Last active|^--- '; echo "EXIT=$?"
1:## Recovered Context (Post-Compaction)
4:## Active Files & Structural Context
10:## Session State / Next Steps
21:## Recovery Instructions
24:## Active Spec Folder
25:Last active: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers
26:--- exit=0 purpose_heading=0 purpose_text=0
EXIT=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `runtime/lib/spec/packet-purpose.ts` with `resolvePacketPurpose` and `formatPacketPurpose`. Without it each surface would parse `spec.md` on its own, and child 005's save writer would carry a third copy of the same rule.
- Lead the compact output of `session-prime.ts` with a `## Packet Purpose` section on every compact branch, including the one with no cached brief. This one edit covers Claude directly and Codex, Cursor and DSH, which run the same built `session-prime.js`.
- Add the same section to the message the Pi `session_compact` handler sends.
- Add tests for the helper, the session-prime surface and the Pi surface, and name the new module and section in five READMEs.

### Out of Scope
- `runtime/hooks/claude/compact-inject.ts` - the PreCompact cache is cut to its budget and wrapped as recovered hook-cache text, and `session-prime` already holds the folder at the moment it prints, so a second copy there buys nothing.
- `runtime/hooks/devin/post-compaction.cjs` - `runtime/hooks/devin/README.md` line 42 says Devin 3000.12 does not pass `PostCompaction` output to the model, so a purpose line there would not reach it.
- OpenCode - its one post-compaction injection, `.opencode/plugins/session-history-lookup.js`, carries a history locator and knows no spec folder. The relaunch plugin's compaction text belongs to the relaunch note, which child 003 owns.
- A re-export of the helper from `runtime/api/index.ts` - nothing calls it through the API yet. Child 005 adds the line if its writer runs in `runtime/cli`, which reaches the runtime only through `@spec-kit/runtime/api`.
- The unfilled phase-parent purpose, the resume brief, the relaunch note's Goal and the continuity field - children 001, 002, 003 and 005. This phase only reads purposes. It still treats the older scaffold layout sentence, which 6 `spec.md` files under `specs/` carry in two wordings (5 of them outside `z_archive`), as no purpose.

### Files to Change

All paths are under `.skilled/skills/system-spec-kit/runtime/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/spec/packet-purpose.ts` | Create | `resolvePacketPurpose` and `formatPacketPurpose` |
| `hooks/claude/session-prime.ts` | Modify | Import the helper, add `buildPacketPurposeSection`, lead the compact sections with it |
| `hooks/pi/session-compact-context.ts` | Modify | Read the helper from the built copy and add the section before `## Active Spec Folder` |
| `tests/packet-purpose.vitest.ts` | Create | Four tests: packet, ancestor, goal and a missing folder |
| `tests/hook-session-start.vitest.ts` | Modify | Two tests: the purpose leads the output, and no section without a `spec.md` |
| `tests/history-locator-adapters.vitest.ts` | Modify | One Pi test with a purpose and one assertion in the no-session test |
| `lib/spec/README.md` | Modify | Name the second implementation file and its two entrypoints |
| `lib/MODULE-MAP.md` | Modify | Add the key-file row under `spec/` |
| `lib/README.md` | Modify | Add the key-file row |
| `hooks/claude/README.md` | Modify | Say the compact output opens with the packet purpose |
| `hooks/pi/README.md` | Modify | Say the compact message carries the packet purpose |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The compact output of `session-prime` opens with `## Packet Purpose` and one sentence from the last spec folder's `### Purpose` when that text is authored | The test `leads the compact recovery with the packet purpose` passes, and the measurement script in `scratch/` prints `purpose_heading=1 purpose_text=1` after the build |
| REQ-002 | A missing spec folder, a missing or unreadable `spec.md` and any helper failure add no section, leave the rest of the output as it is and never fail the hook | The test `adds no purpose section when the last spec folder has no spec.md` passes, and `resolvePacketPurpose` returns null for a missing folder |
| REQ-003 | `resolvePacketPurpose` applies the purpose rule in order: the packet's own purpose, then the nearest enclosing phase parent's labelled as the parent's, then the packet's `goal.md` Objective, then null. A template token, a bracketed prompt, `UNKNOWN` and both wordings of the scaffold layout sentence count as no purpose | The four tests in `tests/packet-purpose.vitest.ts` pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The Pi `session_compact` message carries the same `## Packet Purpose` section, and none when no session id is known | The test `names the packet purpose of the last active spec folder` passes and the no-session test asserts no `## Packet Purpose` |
| REQ-005 | The existing suites stay green and the runtime still builds and typechecks | The five-file Vitest run in `plan.md` prints `Tests  71 passed (71)`, and the build and the typecheck exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: After `npm --prefix .skilled/skills/system-spec-kit/runtime run build`, the measurement command in the Measured Behavior block prints `--- exit=0 purpose_heading=1 purpose_text=1` where it printed `purpose_heading=0 purpose_text=0`.
- **SC-002**: The five-file Vitest run prints `Test Files  5 passed (5)` and `Tests  71 passed (71)`, up from 4 files and 64 tests before the change.
- **SC-003**: `git status --short` lists only the eleven files in the Files to Change table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime `dist` build. Every covered runtime but Pi runs `dist/hooks/claude/session-prime.js`, and Pi loads the helper from `dist/lib/spec/packet-purpose.js` | Without a build the hooks run the old code and Pi shows no purpose | Build before the tests, and the Pi import fails open to no section, as its locator write already does |
| Risk | `lastSpecFolder` is set by the Stop hook from transcript paths, so it can name the previous packet for one turn after a switch | Medium. The recovered context would quote the wrong packet's purpose | The section stays one labelled sentence, the folder is still named below it and `/speckit:resume` stays the recovery pointer. No new detection is added here |
| Risk | A long purpose spends budget the recovered brief needs, and token pressure can shrink the compact budget to 200 tokens | Low | The helper keeps the first sentence and caps it at 300 characters. A prototype over 3,292 live spec folders returned no sentence over 300 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Open question: `detectSpecFolder` in `runtime/hooks/claude/compact-inject.ts` matches only `.opencode/specs/` paths, so the PreCompact brief never prints its own `Active spec folder:` line in this repository, where packets live under `specs/`. The full, unfiltered output of the measurement script shows the Session State section without that line. This phase does not depend on it and does not fix it. Should a separate packet fix it?
- Open question: Devin delivers its post-compaction lookup offer on the next `UserPromptSubmit` because it drops `PostCompaction` output. Should the purpose ride the same marker later? Decision for this phase: no, Devin is left out.
- Does a phase parent whose own purpose is the scaffold sentence count as having no purpose? Decision: yes. The helper then walks to its own parent, and a prototype over the live tree resolved such a parent to its parent's authored purpose.
<!-- /ANCHOR:questions -->

---
