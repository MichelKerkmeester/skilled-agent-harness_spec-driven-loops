---
title: "Implementation Plan: Recover the last findings object from alignment lane output"
description: "Replace the one-start findings scan with a per-brace matcher, keep the last top-level object with a findings array, prefer a lane object for lane callers, and prove the three lost-result shapes with failing-first tests."
trigger_phrases:
  - "alignment lane result parser plan"
  - "last findings object plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Recover the last findings object from alignment lane output

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None, a private CLI runner |
| **Storage** | Raw lane transcript, `lanes/A.json`, `critic.json` |
| **Testing** | `node:test` with `node:assert/strict` and a stub binary |

### Overview
Replace `findFindingsObject` with a matcher that starts fresh at every `{` and parses each balanced slice. Keep top-level candidates, choose the last one, and prefer one that carries `lane` when the caller is a lane. Extend the stub so each test writes an exact transcript and add one case for each lost-result shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The private runner resolves through `.skilled/commands/assets/local-skilled-alignment` and the source folder is git-ignored.
- [ ] `run-lanes.cjs:326-365` still holds the one-start scanner and line 358 still overwrites `findings`.
- [ ] The existing test stub can be extended without changing the runner argv cases.

### Definition of Done
- [ ] `node --test .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` exits 0 with the existing and new cases passing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/006-alignment-lane-result-parser --strict` prints `RESULT: PASSED`.
- [ ] The no-match reason still reads `no JSON object with findings`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single parser helper with a caller-supplied expectation.

### Key Components
- **`matchObjectEnd(text, start)`**: new helper. It starts `depth` 0, `inString` false and `escaped` false at the given `{`, then returns the index of the matching `}` or -1. String state is local to that start.
- **`findFindingsObject(rawText, options)`**: tries every `{`, calls `matchObjectEnd`, parses the slice and records valid candidates that have a `findings` array. It filters out candidates strictly contained in another candidate, then returns the last remaining candidate. When `options.expectLane` is true, the last top-level candidate with a nonempty string `lane` wins, with the plain last candidate as fallback.
- **`finalizeLane`**: passes `{ expectLane: state.id !== 'critic' }` to the parser. This is the only caller.
- **`writeStubBinary`**: gains a `raw` mode that writes `process.env.STUB_STDOUT` to stdout unchanged.

### Data Flow
The child process stdout and stderr are appended to `A.raw.txt` or `critic.raw.txt`. On a clean exit, `finalizeLane` reads that file and passes the text to `findFindingsObject`. The returned object is written to `A.json` or `critic.json`. A null result keeps the existing error path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `findFindingsObject` at `run-lanes.cjs:326-365` | Owns the one-start scan and last-any-object choice | Replace | Three new cases |
| `finalizeLane` call at `run-lanes.cjs:411` | Calls the parser with no options | Pass the lane expectation | Lane preference case |
| `lanes/A.json` | Lane result for the conductor | Shape unchanged | Existing valid-output case and new lane cases |
| `critic.json` | Critic result beside the lanes folder | Shape unchanged | New pretty-print case |
| `A.raw.txt` and `critic.raw.txt` | Hold the exact model output | Unchanged | Tests read the transcript only through the runner |
| `writeStubBinary` at `tests/run-lanes.test.cjs:29-56` | Emits one fixed lane JSON object | Add a raw transcript mode | New cases pass under the stub |
| Existing argv, timeout and watchdog cases | Exercise unrelated runner behavior | Not a consumer of the parser change | Full owning test file stays green |
| Tracked packet docs | Record a plan for ignored code | Create | This packet and its validation |

Required inventories:
- Callers of `findFindingsObject`: `rg -n "findFindingsObject" .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` returns the definition and one call at line 411.
- Transcript consumers: `rg -n "rawPath|\\.json|errorPath" .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` covers the lane and critic paths.
- Stub modes: `rg -n "STUB_MODE|mode ===" .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` lists every branch the test extension must preserve.
- Matrix axes: caller (lane or critic), transcript shape (prose brace, nested object, multi-line object), object order (one or several), lane key (present or absent) and parse outcome (valid or unclosed).
- Algorithm invariant: the returned value is the last top-level JSON object with a `findings` array, and for a lane it is the last such object that also carries `lane` when one exists.

The private path is ignored by `.gitignore:247` in the source repository (`/.skilled/commands/assets/local-*`). The packet docs are tracked in this repository. Rollback is restoring the backup copy the orchestrator made before the build.
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
| Unit through the runner | `findFindingsObject` called by `finalizeLane` for a lane | `node:test` with a stub binary that prints a fixed transcript |
| Unit through the runner | The same parser for the critic path | `--critic` with the same stub mode |
| Regression | Existing argv, timeout, watchdog and valid-output cases | `node --test .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` |

The three transcripts are short and synthetic:
1. `Diagnostic {partial "quoted` on one line, then `{"lane":"A","findings":[{"id":"L1"}]}`. Today the parser returns null.
2. `{"lane":"A","findings":[{"id":"L1"}]}` then `{"tool":"report","result":{"findings":[{"id":"wrong"}]}}`. Today the parser returns the nested object.
3. A prose line with an unmatched brace and quote, then a fenced pretty-printed `{"findings":[{"id":"C1"}]}` object. Today the parser returns null.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js built-in `node:test` and `child_process.spawnSync` | Internal | Green | The runner tests cannot execute |
| The private alignment folder symlink | Internal | Green | Edits land in the wrong folder or fail |
| The orchestrator backup copy of the runner and test | Internal | Green | Rollback cannot restore the pre-build bytes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A valid lane result is lost, a wrong object is written, or an existing runner case fails after the change.
- **Procedure**: Restore the backup copy the orchestrator made of `run-lanes.cjs` and `tests/run-lanes.test.cjs`, then rerun the owning test file. No tracked file is part of the code rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->
