---
title: "Implementation Plan: Phase 3: generated-title-carry"
description: "Read the title Claude generates for a session and record it as the hop name when no custom title and no launch name exist, test first, so the wrapper's existing numbering names the receiver <title> (2)."
trigger_phrases:
  - "generated title carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: generated-title-carry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the relaunch core, the CLI and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The Claude session log, read only, and the relaunch record's existing `name` field |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
`readClaudeSettings` gains a second tail search for the last `ai-title` entry and reports it apart as `generatedName`. `resolveSessionSettings` passes it on and `prepare` uses it as the last fallback for `name`. The proof is two tests that fail before the edit, one ranking test, the three changed test files and the whole relaunch suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `git show 7d6077678e^:.skilled/hooks/session-relaunch/lib/context-usage.cjs | rg -c 'ai-title|aiTitle'` prints nothing, so no source read the generated title before the fix

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ranked name fallback.

### Key Components
- **`readClaudeSettings` in `lib/context-usage.cjs`**: finds the last non-empty `aiTitle` with `latestTailEntry` and adds `generatedName` to its result only when one exists. Without it no source reads the generated title.
- **The `name:` line of `prepare` in `bin/session-relaunch.cjs`**: ranks the custom title, then `SKILLED_LOOP_NAME`, then the generated title. Without it the reader's value never reaches the record.

### Data Flow
`prepare` calls `resolveSessionSettings`, which calls `readClaudeSettings` on the sender's log. The record's `name` takes the first non-empty value of the custom title, `SKILLED_LOOP_NAME` and the generated title. `consume` prints the name and the wrapper runs `name_stem`, exports the stem as `SKILLED_LOOP_NAME` and launches the receiver with `--name "<stem> (2)"`. From hop 2 on the exported stem outranks any newer generated title.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `readClaudeSettings` in `lib/context-usage.cjs` | Reads model, effort and custom title from the Claude log | update | `scratch/green.txt:28` shows the reader test passing |
| `resolveSessionSettings` in `lib/relaunch-core.cjs` | Hands the reader's values to `prepare` | update | `rg -n 'generatedName' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints lines 767 and 786 |
| `prepare` in `bin/session-relaunch.cjs` | Writes the record's `name` | update | `scratch/green.txt:345` and `scratch/green.txt:346` show both prepare tests passing |
| `name_stem` and `append_name_arguments` in `.skilled/bin/skilled-loop` | Strip the sender's number and add the receiver's | unchanged | `git show --stat 7d6077678e` lists no file under `.skilled/bin` |
| The relaunch record schema | Holds `name` since phase 012 of packet 038 | unchanged | `rg -n 'generatedName' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints only line 592, the `name:` line |

Required inventories:
- Same-class producers: `rg -n 'generatedName' .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` prints lines in `context-usage.cjs`, `relaunch-core.cjs` and the one `name:` line in `session-relaunch.cjs`.
- Consumers of changed symbols: `prepare` is the one caller that reads `generatedName`. The record's `name` field and its readers are unchanged.
- Matrix axes: custom title (present, absent), `SKILLED_LOOP_NAME` (set, unset), generated title (present, absent, blank). The three new tests cover the fallback row and both ranking rows.
- Algorithm invariant: the generated title is used only when the custom title and `SKILLED_LOOP_NAME` are both empty.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the pre-change `prepare` and settings reader and the wrapper's numbering. Implementation adds three tests to `context-usage.test.cjs` and `session-relaunch-cli.test.cjs`, then edits the reader, the pass-through and the `name:` line until they pass. Verification runs the changed test files, the whole relaunch, goal and Pi suites and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `readClaudeSettings` on written Claude logs | `node:test` |
| Integration | `prepare` run as a CLI in a sandbox with a written Claude log | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The three new tests run first and must show 1 pass and 2 fail, saved to `scratch/red.txt`. After the edit `env -u AI_SESSION_CHILD node --test` over `context-usage.test.cjs`, `session-relaunch-cli.test.cjs` and `relaunch-core.test.cjs` must show 359 of 359, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `latestTailEntry` in `lib/context-usage.cjs` | Internal | Green | The reader would need its own tail search |
| `name_stem` and `append_name_arguments` in `.skilled/bin/skilled-loop` | Internal | Green | The receiver would not get its hop number |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a receiver whose sender was named or renamed starts with the generated title, or any relaunch test fails after the edit.
- **Procedure**: revert commit `7d6077678e`. No record format changes, so a record written before the revert still reads.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The name carry built in phase 012 of packet 038 | Implementation |
| Implementation | The pre-change reader confirmed blind to `ai-title` | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
