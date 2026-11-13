---
title: "Implementation Plan: Phase 8: review-advisories"
description: "Fix the nine P2 advisories in four work packages, A to D, one dispatch each, test first. Each package owns its files, and the named guard suites keep their assertions."
trigger_phrases:
  - "review advisories plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: review-advisories

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the hooks and ESM in the OpenCode plugin |
| **Framework** | None, Node built-in modules |
| **Storage** | JSON state files in the relaunch state directory and Markdown notes with YAML frontmatter |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
The phase closes the nine P2 advisories in four work packages. Each package adds its failing test first, then the smallest source change that turns it green, in the order A, B, C and D. The proof is the four test files, the named guard tests and one strict validation run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Phases 001 to 007 are Complete
- [x] The four test files pass at baseline

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`
- [x] Every named guard test in `REQ-010` still passes
- [x] `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints one line
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test-first package sequence.

### Key Components
- **`claude/compact-pointer.mjs`**: emits the start claim under the event the caller names.
- **`lib/relaunch-core.cjs`**: owns the note goal record and the Claude goal reason.
- **`lib/nudge.cjs`**: builds the handoff text, the command prefix and the hop verdict.
- **`.opencode/plugins/opencode-goal.js`**: binds the hop goal and writes the OpenCode record.
- **`.skilled/hooks/session-relaunch/README.md`**: states when Claude Code uses `SessionStart`.

### Data Flow
A startup payload reaches `claimAfterGoalStart`, which now emits `SessionStart`. A note reaches `recordGoalPacket` under a lock, which now refuses a note that is not open. A Claude goal log reaches `claudeGoalPacketResult`, which now names an empty goal. `handoffText` builds model-facing text, so the session id and the cwd are stripped before the print. `commandPrefix` builds a command the model runs, so an unsafe `node ` value is quoted as one path. `hopLimitReached` decides whether the nudge speaks, and now reads an invalid count as the limit reached. The plugin binds a goal and writes a record path that `resolveGoalPacketResult` reads back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude/compact-pointer.mjs` | Produces the start claim through `payloadEventName` | update | `node --test --test-name-pattern 'names the SessionStart event on a start claim' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `lib/relaunch-core.cjs` | Owns `recordGoalPacket` and `claudeGoalPacketResult` | update | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` |
| `lib/nudge.cjs` | Produces the note text, the command prefix and the hop verdict | update | `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` |
| `.opencode/plugins/opencode-goal.js` | Produces the OpenCode record and owns the packet variable delete | update | `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` |
| `.skilled/hooks/session-relaunch/README.md` | Documents one use of `SessionStart` | update | `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` |
| `payloadEventName` in `lib/relaunch-core.cjs` | Infers the event for the compaction emit | unchanged | `node --test --test-name-pattern 'compact-pointer points a compacted session' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `goalRecordFor` in `lib/relaunch-core.cjs` | Builds the OpenCode record path | unchanged | The contract test in `REQ-008` |
| `bin/session-relaunch.cjs` | Parses `SKILLED_LOOP_HOPS` for `prepare` | unchanged | `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` |

Required inventories:
- Finding classes: the start claim event, the note status, the empty goal reason and the packet variable are `instance-only`. The raw frontmatter values and the command prefix are `class-of-bug`. The hop count is `cross-consumer`. The record path is `test-isolation`. The README line is `matrix/evidence`.
- Same-class producers: `rg -n 'session_id: |cwd: ' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints the two template lines before the edit.
- Consumers of changed symbols: `rg -n 'commandPrefix|hopLimitReached|recordGoalPacket' .skilled/hooks/session-relaunch .opencode/plugins`.
- Matrix axes: package (A, B, C, D), runtime (Claude, OpenCode), event source (startup, compact), note status (open, claimed), hop value (unset, empty, valid, invalid) and session id or cwd (clean, line break).
- Algorithm invariant: a frontmatter value never adds a line, a note that is not open is never written, and a command prefix is quoted unless every character is in the safe set.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the four test files and records the baseline. Implementation builds package A, then B, then C, then D, with each failing test recorded before its source edit. Verification runs the four test files, the named guards and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The start claim, the note record, the goal reason, the note text, the command prefix and the hop verdict | `node:test` |
| Integration | The plugin bind read back by the core resolver | `node:test` |
| Manual | N/A: no user interface and no service | None |

The seven must-fail tests run first as `env -u AI_SESSION_CHILD node --test --test-name-pattern '<title>' <file>` and each must exit 1 with its assertion failure. The contract test may pass at once. After the source edit, the same command must exit 0 with `fail 0`. The full gate is `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 Complete | Internal | Green | The tree would not hold the shipped wording the review examined |
| The four test files | Internal | Green | There would be no place for the must-fail tests |
| Node.js test runner | Internal | Green | No test can run |
| `rg` | Internal | Green | The README check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a guard test fails after a package change, or a package changes the relaunch record format.
- **Procedure**: revert that package's one local commit on `worktrees/358-handover-goal-resume`. No data or config is migrated.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► A ──► B ──► C ──► D ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 to 007 Complete | A |
| A | Setup | B |
| B | A | C |
| C | B | D |
| D | C | Verification |
| Verification | D | Close |
<!-- /ANCHOR:phase-deps -->

---
