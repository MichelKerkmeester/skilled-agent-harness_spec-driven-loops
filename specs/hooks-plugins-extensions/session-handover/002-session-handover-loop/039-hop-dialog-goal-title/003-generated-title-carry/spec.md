---
title: "Feature Specification: Phase 3: generated-title-carry"
description: "A Claude hop carried only a launch name or a /rename title. A session with neither has only the title Claude generates, and that title was not read, so the receiver got a new generated title and the operator lost track of which session continued which."
trigger_phrases:
  - "generated title carry"
  - "phase 3 generated title carry"
  - "ai-title session name hop"
  - "generated session title across a hop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: generated-title-carry

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
| **Branch** | `worktrees/366-hop-after-question-dialog` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-packet-goal-fallback |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 003-generated-title-carry --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title specification.

**Scope Boundary**: The Claude settings reader `readClaudeSettings` in `lib/context-usage.cjs`, its pass-through in `resolveSessionSettings` in `lib/relaunch-core.cjs`, the `name:` line of `prepare` in `bin/session-relaunch.cjs`, two test files and one README paragraph. Claude Code only.

**Dependencies**:
- Phase 012 of packet 038 built the name carry this phase extends: the `custom-title` read, the record's `name` field and the wrapper's numbering.
- `name_stem` and `append_name_arguments` in `.skilled/bin/skilled-loop` already turn a record name into `<stem> (2)` for the first receiver. They are reused unchanged.
- `latestTailEntry` in `lib/context-usage.cjs` already runs the tail search for the `custom-title` entry. The new search reuses it.

**Deliverables**:
- `readClaudeSettings` returns the last non-empty generated title as `generatedName`.
- `prepare` records that title as `name` when there is no custom title and no `SKILLED_LOOP_NAME`.
- Three tests, two of them failing before the source edit.
- One README sentence that names the fallback.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Claude hop carried only a launch `--name` or a `/rename` title, which Claude logs as a `custom-title` entry. A session started with no name and never renamed has only the title Claude generates, logged as `{"type":"ai-title","aiTitle":"..."}` entries. That title was not read, so the receiver started with no name, Claude gave it a new generated title and the operator could no longer tell which session continued which.

The operator asked for this on 2026-11-13, verbatim: "Also after in session handover the session name is reset and manually generated in ckaude code and maybe other runtimes too inwant to orevent that somehow and makensure same new with new number at end or something is auto set so user knows what is was doing".

### Purpose
A Claude receiver whose sender had only a generated title starts with that title and its hop number, such as `<title> (2)`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root against the parent of the fix commit.

```text
$ git show 7d6077678e^:.skilled/hooks/session-relaunch/bin/session-relaunch.cjs | rg -n "name: settings.name"
590:    name: settings.name || process.env.SKILLED_LOOP_NAME || null,
exit=0

$ git show 7d6077678e^:.skilled/hooks/session-relaunch/lib/context-usage.cjs | rg -n "custom-title"
244:      (entry) => entry.type === 'custom-title' && settingText(entry.customTitle) !== '',
exit=0

$ git show 7d6077678e^:.skilled/hooks/session-relaunch/lib/context-usage.cjs | rg -c "ai-title|aiTitle"
exit=1
```

Before the fix `prepare` took the name from the custom title or from `SKILLED_LOOP_NAME` and nothing else. The settings reader searched for `custom-title` and held no `ai-title` reference at all.

The orchestrator saw the gap live on 2026-11-13 in the operator's own Claude logs under `~/.claude/projects/`, which are not in the repository. Sender session `b8ee8a81-e316-4f1a-ba26-b9481c493496` held 55 `ai-title` entries reading "038-goal-and-workflow-resume handoff" and no `custom-title` entry. Its receiver `53e771b8-c072-45b2-b8e1-c6a16e34711f` was launched with no `--name`, its process line read `claude --model claude-fable-5-2 --effort medium [session-relaunch] claim and continue handoff ...`, `SKILLED_LOOP_NAME` was unset in it and it held 39 `ai-title` entries reading "038-goal-and-workflow-resume relaunch handoff". This is orchestrator observation, not a file in this packet.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Return the last non-empty `aiTitle` from `readClaudeSettings` as `generatedName`, and add the key only when the log holds one.
- Pass `generatedName` through `resolveSessionSettings`.
- Record the name in `prepare` as the custom title, else `SKILLED_LOOP_NAME`, else the generated title.
- Name the fallback in the session-relaunch README.

### Out of Scope
- Codex, Cursor and Devin - their launch lines have no name flag.
- The OpenCode session title - phase 013 of packet 038 owns it.
- A Pi live name - phase 012 of packet 038 ruled it out of scope.
- The wrapper's numbering in `.skilled/bin/skilled-loop` - it already yields `<stem> (2)` and is unchanged.
- A new relaunch record key - parent decision D3 allows no new record key, so the existing `name` field carries the value.
- A live hop - the unit and CLI tests plus the numbering phase 012 of packet 038 tested stand in for it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | `readClaudeSettings` also returns the last generated title as `generatedName` |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `resolveSessionSettings` passes `generatedName` on |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `prepare` falls back to `generatedName` for `name` |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modify | One reader test |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | One fallback test and one ranking test |
| `.skilled/hooks/session-relaunch/README.md` | Modify | One sentence on the generated title |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `readClaudeSettings` returns the last non-empty `aiTitle`, trimmed, as `generatedName`. The key is present only when the log holds such an entry, so every earlier result keeps its shape. A log that holds only a generated title returns an object, not null. The test `readClaudeSettings returns the last generated title beside the name` fails before the edit. |
| REQ-002 | `prepare` records `name` as the custom title, else `SKILLED_LOOP_NAME`, else the generated title, else null. The test `prepare falls back to the Claude generated title when nothing else names the session` fails before the edit. |
| REQ-003 | No module is added and no relaunch record key is added. The record's existing `name` field carries the value, and `.skilled/bin/skilled-loop` is unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A launch name and a custom title each outrank the generated title. The test `prepare ranks a launch name and a custom title above the generated title` covers both. |
| REQ-005 | The relaunch and OpenCode plugin suites, the goal suites and the Pi adapter suite pass at the final state. |
| REQ-006 | The session-relaunch README names the `ai-title` fallback. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 3 tests with 1 pass and 2 fail before the edit, and `scratch/green.txt` shows 359 of 359 across the three changed test files after it.
- **SC-002**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1536 of 1536.
- **SC-003**: `git show --stat 7d6077678e` lists six files, none under `.skilled/bin`, and no new file.
- **SC-004**: `validate.sh 003-generated-title-carry --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude's `ai-title` log entry shape | A renamed entry type or field would silently drop the fallback and the receiver would get a new title again | The reader test pins the shape. A change in Claude's log format shows up as a hop with an unnamed receiver |
| Risk | A generated title that ends in the sender's own hop number in brackets, such as "Fix bug (2)" at hop 2 | Low | `name_stem` would strip that number as if the wrapper wrote it. Inferred by the review, not reproduced. Recorded as a known limitation |
| Risk | One more tail search of the session log in `prepare` | Low | It is the same kind of search the custom-title read already makes. Inferred, not measured |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `prepare` makes one more tail search of the session log, bounded by the same `tailBytes` as the custom-title search. Not measured.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The generated title reaches the launch line through the record's `name` field, so the wrapper's existing check refuses a name that starts with `-` or holds a control character.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A log read that throws returns null as before, so `prepare` records the launch name or null.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a log with no `ai-title` entry leaves `generatedName` out of the result, and an entry whose title is only spaces is skipped.
- Maximum input: a title that changes between hops does not rename later receivers, because from hop 2 on the stem in `SKILLED_LOOP_NAME` outranks the generated title.
- Failure path: a transcript that cannot be read makes `readClaudeSettings` return null, and `resolveSessionSettings` returns empty values with no error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Three source lines of logic, two test files and one README sentence |
| Risk | 4/25 | A wrong rank would rename a receiver the operator had named |
| Research | 4/20 | One live sender and receiver pair read from the operator's logs |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a live Claude receiver show `<title> (2)` after a hop from a session with only a generated title? Not run. Decision: the unit and CLI tests plus the unchanged wrapper numbering that phase 012 of packet 038 tested stand in for it.
- Do Codex, Cursor or Devin need a name at all? Not in scope, because none of them has a name flag.
<!-- /ANCHOR:questions -->

---
