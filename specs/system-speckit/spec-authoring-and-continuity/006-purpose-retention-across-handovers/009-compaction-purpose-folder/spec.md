---
title: "Feature Specification: Phase 9: compaction-purpose-folder"
description: "After a compaction the purpose line appears only when the Stop hook pinned exactly one packet, and the folder it reads is not held inside the project. This phase lets the recovery fall back to the folder the cached brief names, refuses a folder outside the project in both compaction adapters and makes the tests pass the repo-relative value real state holds."
trigger_phrases:
  - "compaction purpose folder"
  - "phase 9 compaction purpose folder"
  - "last spec folder containment"
  - "purpose line missing after compaction"
  - "folder named in brief"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: compaction-purpose-folder

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
| **Phase** | 9 of 10 |
| **Predecessor** | 008-hop-purpose-rule-parity |
| **Successor** | 010-problem-sentence-carry |
| **Handoff Criteria** | `hook-session-start.vitest.ts` prints `(27 tests)` and `history-locator-adapters.vitest.ts` prints `(19 tests)`, all passing, and the first Measured Behavior command prints no line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: How the two compaction adapters choose and check the folder they hand to the purpose helper: `buildPacketPurposeSection` and the compact branch in `runtime/hooks/claude/session-prime.ts`, `readPacketPurposeSection` in `runtime/hooks/pi/session-compact-context.ts`, and their two test files. No change to the Stop hook's folder detection, which also decides where an autosave writes, and none to the helper.

**Dependencies**:
- Phase 006 for the effect in this repository. The fallback reads the `Active spec folder:` line of the cached brief, and until edit E11 of phase 006 lands that line is printed only for `.opencode/specs/` paths. The tests of this phase do not depend on it.

**Deliverables**:
- A purpose line after a compaction for a session whose Stop hook pinned no packet, taken from the folder the cached brief names
- A folder outside the project refused by both adapters before any file is opened
- Compaction tests that pass a repo-relative folder, with four new tests
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The context recovered after a compaction opens with the packet's purpose only when hook state holds a `lastSpecFolder`. The Stop hook writes that field, and it writes nothing when the transcript tail names more than one packet (`session-stop.ts:234-238`). A session that works in a phase parent and one of its children names two folders, so it can stay unpinned for its whole life, and its recovery carries no purpose. The reviewer counted 26 of 31 state files on this machine with no pinned folder. This planning session could not read those files, so that count is the reviewer's.

The folder is also trusted too far. Both adapters resolve the stored value against the project root and open `spec.md` there, with no check that the result is still inside the project (`session-prime.ts:232`, `session-compact-context.ts:79`). The value comes from a file in the temp directory. The tests never exercise the real shape either: all three pass an absolute folder, where real state holds a repo-relative one.

### Purpose
Show the purpose after a compaction for a session the Stop hook never pinned to one packet, and make both compaction adapters refuse a folder that lies outside the project.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
All three ran from the worktree root on 2026-11-14 at `bd79708c2f`. The first lists the places a hook hands an unchecked folder to the purpose helper. The second shows what the Stop hook selects when the transcript names several packets. The third lists the folders the compaction tests store as `lastSpecFolder`, each a temp directory made with `mkdtempSync(join(tmpdir(), ...))`.
```text
$ rg -n 'resolvePacketPurpose\(resolve\(' .skilled/skills/system-spec-kit/runtime/hooks
.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:79:    const purpose = resolvePacketPurpose(resolve(cwd, specFolder));
.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:232:  const purpose = resolvePacketPurpose(resolve(projectRoot, lastSpecFolder));

$ rg -n -A4 'uniqueMatches.length === 1' .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts
234:  if (uniqueMatches.length === 1) {
235-    return uniqueMatches[0];
236-  }
237-
238-  return null;

$ rg -n 'lastSpecFolder: (packetDir|emptyDir)' .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts
.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts:174:          lastSpecFolder: packetDir,
.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts:204:          lastSpecFolder: emptyDir,
.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts:145:    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: packetDir }));
```

What this does not measure: how often a real compaction finds no pinned folder. No real compaction has been run on this work, and this session could not start `node` to read hook state or run the hooks.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Refuse, in `buildPacketPurposeSection` and in the Pi adapter's `readPacketPurposeSection`, a folder that does not resolve to a path inside the project root.
- Add `folderNamedInBrief` beside `buildPacketPurposeSection` in `session-prime.ts`. Without it, a session with no pinned folder has no folder to read a purpose from, and extending `buildPacketPurposeSection` in place would mix reading a cached brief into a function that takes a folder.
- Use that folder in the compact branch when hook state holds no `lastSpecFolder`.
- Change the three compaction tests to store a repo-relative folder, and add four tests: a folder outside the project in each adapter, the brief fallback and the line the real brief writes.

### Out of Scope
- The Stop hook's `selectDetectedSpecFolder` - its result is also the autosave target, so choosing a folder for an ambiguous transcript there would change where saves write.
- A fallback for the Pi adapter - Pi has no PreCompact brief to read a folder from.
- Passing the purpose line through `sanitizeRecoveredPayload` - that function drops lines by their first words, and the purpose line always opens with the helper's own label, so it would never act. The one-line collapse and the 300-character cap already bound the text.
- Codex, Cursor and DSH adapters - they reach the same `session-prime.ts` code, and the reviewer read them at the adapter level only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | Containment in `buildPacketPurposeSection`, the new `folderNamedInBrief` and the compact branch |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Modify | Containment in `readPacketPurposeSection` |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modify | Two tests store a repo-relative folder, four new tests |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modify | One test stores a workspace-relative folder, one new test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Neither adapter hands the helper a folder outside the project | The first Measured Behavior command prints no line, and the tests `adds no purpose section for a last spec folder outside the project` and `adds no packet purpose for a last spec folder outside the workspace` pass |
| REQ-002 | A compaction with no pinned folder takes the purpose from the folder the cached brief names | The test `takes the purpose from the folder the cached brief names when no last folder is pinned` passes |
| REQ-003 | The compaction tests store the repo-relative value real state holds | The third Measured Behavior command prints no line, and `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `(27 tests)`, `(19 tests)` and `Tests  46 passed (46)` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The fallback reads the line the PreCompact brief really writes | The test `reads the folder line the PreCompact brief writes` passes inside the REQ-003 run |
| REQ-005 | The runtime still typechecks and builds | `npm run typecheck` and `npm run build` in `.skilled/skills/system-spec-kit/runtime` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The unchecked-resolve check goes from two lines to none.
- **SC-002**: `hook-session-start.vitest.ts` goes from 23 tests to 27 and `history-locator-adapters.vitest.ts` from 18 to 19, all passing.
- **SC-003**: The absolute-folder check goes from three lines to none.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 edit E11. The PreCompact brief names a `specs/` folder only after it lands | Without it the fallback finds no folder line for packets under `specs/`, and behavior stays as today | Build phase 006 first. The fallback test uses a hand-written brief, so this phase's tests pass either way |
| Risk | The brief names the most-referenced folder in the transcript tail, which may not be the packet the session is working on | Medium. The recovery would open with another packet's purpose | The brief already prints that folder as `Active spec folder:`, so the purpose line agrees with a line the recovery shows anyway, and a pinned `lastSpecFolder` always wins |
| Risk | The planned code was not run. This session could not start `node` | Medium. The brief may render its folder line with other spacing than the fallback expects | The test `reads the folder line the PreCompact brief writes` builds a real brief and stops the phase when the line does not match |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Fix the ambiguity in the Stop hook or fall back at recovery time? Decision: at recovery time. The Stop hook's choice is the autosave target, and a guess there writes continuity into the wrong packet. A guess at recovery time only chooses which purpose to show.
- Where does the fallback folder come from? Decision: the `Active spec folder:` line of the cached brief. It is already in hook state when the recovery runs, so no new state field is needed.
- How strict is the containment? Decision: the resolved folder must start with the resolved project root and a path separator. An absolute path elsewhere and a `..` escape both fail it, and a folder inside the project passes whatever its prefix.
- Do the tests create their packet under the test's working directory? Decision: yes, in a dot-prefixed temp folder removed in `finally`. The hook takes its project root from `process.cwd()`, so a packet in the system temp directory is outside the project by design.
<!-- /ANCHOR:questions -->

---
