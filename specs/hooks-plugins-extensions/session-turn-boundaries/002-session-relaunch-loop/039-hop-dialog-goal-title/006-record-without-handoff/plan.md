---
title: "Implementation Plan: Phase 6: record-without-handoff"
description: "Make readRelaunchFile treat a parsed record with no handoff string as absent, test first at the read, the question guard and Stop, and keep the empty-string case readable so the wrapper's incomplete-record decline still holds."
trigger_phrases:
  - "record without handoff plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: record-without-handoff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the relaunch core and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record, a JSON file in the relaunch state directory, read only by this change |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
`readRelaunchFile` gains one check after the parse. A record that is not an object holding a string `handoff` returns null and logs `corrupt-relaunch-file`, the same outcome invalid JSON already had. The proof is three tests that fail before the edit, two that guard the cases that must not change and the whole relaunch and OpenCode plugin suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The research names the gap and the two code sites that read the record: `research/research.md` section 4, 001, third bullet

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validate at the read.

### Key Components
- **`readRelaunchFile` in `lib/relaunch-core.cjs`**: parses the record and now returns it only when it is an object with a string `handoff`. Every reader of a record goes through it: the Claude guard and Stop, the Codex Stop, the OpenCode plugins, the Pi adapter, the killer, the nudge and the CLI (`git grep readRelaunchFile f4cf59b93f`). One check covers them all, so the change reaches every runtime without an adapter edit. Without it each caller would need its own check.
- **`shouldRelaunch` in `lib/relaunch-core.cjs`**: unchanged. It keeps declining a record with an empty `handoff` as `incomplete-record`, which is why the read only rejects a non-string.

### Data Flow
A caller asks `readRelaunchFile` for a loop id. The file parses to a record. A record that is an object with a string `handoff` is returned as before. Anything else is logged as `corrupt-relaunch-file` and returned as null, so the guard sees no pending record and lets the dialog through, and Stop finds nothing to arm.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `readRelaunchFile` in `lib/relaunch-core.cjs` | Reads and parses one relaunch record | update | `scratch/green.txt:3` shows the read test passing |
| `claude/subagent-guard.mjs` | Denies a question dialog over a pending record and prints `record.handoff` | unchanged | `scratch/green.txt:6` shows the guard test passing with no guard edit |
| `claude/stop-arm.mjs` | Arms a pending record on Stop | unchanged | `scratch/green.txt:2` shows the Stop test passing with no Stop edit |
| Codex Stop, OpenCode plugins, Pi adapter, killer and nudge | Also read records through `readRelaunchFile` | unchanged | The Pi suite prints `Tests  62 passed (62)` and the relaunch and OpenCode plugin suites pass. No test here writes a record with no `handoff` for them |
| `shouldRelaunch` in `lib/relaunch-core.cjs` | Declines an incomplete record | unchanged | `scratch/green.txt:5` shows its test passing |
| Test fixtures that wrote a record by hand | Built records with no `handoff` | update | `git show f4cf59b93f` shows `handoff` added to seven fixtures |
| `README.md` of the session-relaunch hook | States the corrupt-file rule | update | `rg -n 'holds no .handoff. string' .skilled/hooks/session-relaunch/README.md` prints line 241 |

Required inventories:
- Same-class producers: the commit message states no writer produces a record without a `handoff`. This author did not audit the writers one by one, so the proof is the passing suites.
- Consumers of changed symbols: the callers of `readRelaunchFile` are not edited. A record they used to see as pending now reads as null, the value they already get for a missing file. This author read the guard and Stop outcomes in tests and did not trace every other caller's null path.
- Matrix axes: `handoff` (a non-empty string, an empty string, absent) crossed with the reader, the question guard and Stop. The five tests cover absent at all three and the empty string at the reader and at `shouldRelaunch`.
- Algorithm invariant: a record is read only when its `handoff` is a string. An empty string passes the read and fails `shouldRelaunch`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the pre-change reader and the two callers that print or arm from it. Implementation adds the four tests, confirms three fail, edits `readRelaunchFile`, gives the hand-written fixtures a `handoff` and states both cases in the README. Verification runs the five-test pattern, the whole relaunch and OpenCode plugin suites and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `readRelaunchFile` on a record with no `handoff` and on one with an empty `handoff` | `node:test` |
| Integration | The question guard and Stop run as hooks in a sandbox over a pending record with no note | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The new tests plus the existing `shouldRelaunch` test run first through `--test-name-pattern='no handoff|names no note|handoff is an empty string'`. They must show 2 pass and 3 fail, saved to `scratch/red.txt`. After the edit the same command must show 5 of 5, saved to `scratch/green.txt`. The whole relaunch and OpenCode plugin suites then run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `appendLog` in `lib/relaunch-core.cjs` | Internal | Green | The corrupt-file log line would not be written, though the read would still return null |
| `shouldRelaunch` empty-string decline | Internal | Green | Rejecting the empty string at the read would change this decline |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a real hand-over is read as absent after the edit, or any relaunch test fails because of it.
- **Procedure**: revert commit `f4cf59b93f`. No record format changes, so a record written before or after the revert still reads.
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
| Setup | The research that named the gap | Implementation |
| Implementation | The failing run saved to `scratch/red.txt` | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
