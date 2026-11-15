---
title: "Implementation Plan: Phase 9: research-fixes-and-core-consolidation"
description: "Fix the research run's verified findings with a failing-first test each, move the decisions every adapter repeated into the core, add a conformance table across the adapters and correct the doc drift."
trigger_phrases:
  - "research fixes and core consolidation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: research-fixes-and-core-consolidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM, Pi TypeScript, Bash wrapper, Node built-ins only |
| **Framework** | None; hook adapters per runtime over one shared core |
| **Storage** | Handoff notes under `.skilled/skills/.state/session-relaunch/handoffs/`, relaunch records under the per-user runtime state directory |
| **Testing** | `node --test` on explicit files, vitest for Pi |

### Overview
Tests come first for every finding, then the smallest change in the file that owns the behavior. Where several adapters made the same decision, the decision moves into `nudge.cjs` or `relaunch-core.cjs` and each adapter keeps only its host-event parsing and delivery. A conformance table then runs the same cases through every adapter, so a future drift fails one shared test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One runtime-neutral core with thin per-runtime adapters. A decision two adapters need lives in the core. An adapter parses its host's event, asks the core, and delivers the answer in its host's envelope.

### Key Components
- **`nudge.cjs`**: `CLI_COMMAND`, `normalizeSpecFolder`, `specFolderInput`, `seedInstructions` and `nudgeDecision`, the order every nudge adapter applies.
- **`relaunch-core.cjs`**: `noteState` for every note reader, `resolveKillerTarget` for the Claude arm path, and the record checks.
- **`session-relaunch.cjs consume`** and **`skilled-loop`**: the note state travels from consume to the wrapper, which relaunches only an open note.

### Data Flow
An adapter reads usage, asks `nudgeDecision`, and prints `handoffText` with the folder `specFolderInput` resolved. The model writes the note and runs `prepare`. The arm event resolves the kill target and arms the record. After exit the wrapper asks `should-relaunch`, consumes the record with its note state, and seeds the next session only for an open note. That session's first prompt goes through `seedInstructions`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shouldRelaunch` (core) | Freshness gate for the CLI and `handoffPending` | update: `incomplete-record` after the stale and hop checks | core test; `handoffPending` still reads only `stale` |
| `updateFrontmatter` (core) | Claim, complete, supersede writes | update: spaced keys | core test |
| `noteState`, `resolveKillerTarget` (core) | New | create | core tests; a search for each name lists the CLI, plugin and Claude Stop callers |
| `handoffText`, `ensureHandoffDir` (nudge) | Note instructions for five adapters | update: normalized folder, lstat before chmod | nudge tests, conformance table |
| Nudge helpers (nudge) | New | create | nudge tests; five adapters import them |
| `resolveWindow` (context usage) | Claude window | update: walk to the repo root | context-usage tests |
| `consume`, `handoffPathWithinRepo` (CLI) | Wrapper input, path guard | update: `note` field, broken-note answer, real directory | CLI tests |
| `skilled-loop` relaunch branch | Seeds the next session | update: open note only, `incomplete-record` decline | wrapper tests |
| Claude `stop-arm.mjs` | Arms and spawns the killer | update: resolved target, guard on every path | Claude adapter tests |

Required inventories:
- Same-class producers: `rg -n "CLI_COMMAND = " .skilled/hooks/session-relaunch .opencode/plugins` lists only `nudge.cjs`.
- Consumers of changed symbols: `rg -n "shouldRelaunch\(|consume --loop-id|plannedNotePath\(|handoffText\(" .skilled .opencode`.
- Matrix axes: adapter (Claude, Codex, Hermes, OpenCode, Pi) by case (well-formed seed, malformed seed, invalid carried folder, bound folder, invalid folder, pending handoff, hop cap); note state (missing, invalid, open, claimed, done) by reader (consume, OpenCode nudge, OpenCode seed).
- Algorithm invariant: the wrapper seeds a session only when consume reports the note `open`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core, nudge, context usage and CLI | `node --test` |
| Integration | Adapters as child processes, the OpenCode plugin in process, the wrapper with a stub runtime | `node --test` |
| Conformance | One case table across Claude, Codex, Hermes and OpenCode, mirrored for Pi | `node --test`, vitest |
| Red proof | Every pre-phase source swapped in from HEAD, then restored | `git show`, `cmp` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../research/research.md` verification table | Internal | Green | The fix list would rest on unverified findings |
| `ps` for the process table | External | Green | The Claude arm would leave records pending |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a session-relaunch suite fails after merge, or a live hop regresses.
- **Procedure**: revert the phase 009 commit. Stored records and notes keep their format, and the new `note` field in consume output is ignored by an older wrapper.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (research verified) ──► Red tests ──► Fixes + shared helpers ──► Conformance ──► Docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The research report | Red tests |
| Red tests | Setup | Fixes |
| Fixes and shared helpers | Red tests | Conformance, Verify |
| Conformance | Fixes | Verify |
| Docs | Fixes | Verify |
| Verify | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done with the research verification |
| Core Implementation | Med | A few hours |
| Verification | Med | One full gate run and a red swap |
| **Total** | | **About half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` already turns the concern off
- [x] Monitoring alerts set: not applicable to a local hook

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` if a hop misbehaves.
2. Revert the phase 009 commit.
3. Rerun the session-relaunch suites and the Pi suite.
4. Tell the operator which finding the revert reopens.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
