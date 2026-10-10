---
title: "Feature Specification: Phase 5: hook-stdin-deadlines"
description: "Fourteen ESM hook scripts under .skilled/hooks/ still wait on stdin with no deadline, so a host that never closes stdin holds each guard until the host's own timeout kills it. This phase routes each reader through the existing shared helper's 3000 ms deadline, keeps every hook's fail-open behavior and adds a table-driven test that proves both."
trigger_phrases:
  - "hook stdin deadlines"
  - "phase 5 hook stdin deadlines"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: hook-stdin-deadlines

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/005-hook-stdin-deadlines` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-agents-md-pointers |
| **Successor** | None |
| **Handoff Criteria** | Every completion criterion in `goal.md` passes on a rerun, and the scope check shows only the files in the table below changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Round two follow-ups specification.

**Scope Boundary**: The stdin reader in each of the fourteen ESM hook scripts under `.skilled/hooks/`, the header comment of the shared helper they now import, and the docs and test that describe and pin it. The CommonJS adapters already read through the helper and stay untouched.

**Dependencies**:
- The helper `readStdin({ timeoutMs = 3000 })` in `.skilled/hooks/shared/hook-adapter-shared.cjs`, committed by the earlier stdin-deadline phase of this packet (`../../007-follow-up-fixes/004-hook-stdin-deadline/`). Its code does not change here.
- The existing hook suites listed in `plan.md` section 5 must keep passing.

**Deliverables**:
- Fourteen hook scripts that read stdin through the shared helper
- A header comment on the helper that names the ESM hooks and keeps the reason the system-spec-kit ESM sibling stays separate
- `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`, a table-driven node:test file
- The two hooks READMEs that describe the helper, corrected

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Thirteen hook scripts under `.skilled/hooks/` read stdin with `for await (const chunk of process.stdin)` and `task-dispatch/claude/fable-subagent-guard.mjs` reads it with `fs.readFileSync(0, 'utf8')` (line 24). Neither form has a deadline, so a host that leaves stdin open keeps the script running until the host's own timeout kills it, and a guard meant to fail open hangs the tool call instead. The earlier stdin-deadline phase gave the CommonJS adapters a deadline through `hook-adapter-shared.cjs`; these fourteen ESM scripts were left over. Measured on the unchanged tree with stdin left open and never written, all fourteen ran until the test's kill timer (15 of 18 tests in the planner's run of the new test failed), and the Fable guard alone ran until a 10000 ms kill.

### Purpose
Each of the fourteen hooks gives up waiting at the shared 3000 ms deadline and takes the fail-open path it already has.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the local reader in thirteen hooks with an import of `readStdin` from `hook-adapter-shared.cjs`, and delete the local copy
- Make the Fable guard's synchronous read asynchronous through the same helper, with its fail-open result on a read failure unchanged
- Update the helper's header comment, which says it serves CommonJS adapters only, so it names the ESM hooks and keeps the sibling's reason
- Add one table-driven test that spawns each of the fourteen hooks with stdin left open and never written, plus a payload test for the seven hooks no other suite spawns
- Correct the two hooks READMEs that list the helper's consumers and the validation commands

### Out of Scope
- The readers under `.skilled/skills/system-spec-kit/runtime/hooks/` and its `lib/hook-adapter-shared.mjs`: TypeScript built to dist plus ESM files owned by system-spec-kit, recorded as a follow-up in `plan.md` section 6
- The two Cursor hooks `dispatch/cursor/post-tool-use.mjs` and `post-edit-quality/cursor/post-tool-use.mjs`: symlinks into the system-spec-kit runtime that still read stdin with `for await`, same follow-up
- What any hook does with a payload: only the way stdin is read changes
- A shorter deadline for any hook: every wired host timeout is 5 s or more, so the 3000 ms default stands everywhere

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs` | Modify | Import `readStdin`, delete local reader (lines 35-39) |
| `.skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs` | Modify | Import `readStdin`, delete local reader (lines 36-40) |
| `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | Modify | Import `readStdin`, delete local reader (lines 43-47) |
| `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Modify | Import `readStdin`, delete local reader (lines 38-42) |
| `.skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | Modify | Import `readStdin`, delete local reader (lines 42-46) |
| `.skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | Modify | Import `readStdin`, delete local reader (lines 34-38) |
| `.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs` | Modify | Import `readStdin`, delete local reader (lines 34-38) |
| `.skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` | Modify | Import `readStdin`, delete local reader (lines 44-48) |
| `.skilled/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs` | Modify | Import `readStdin`, delete local reader (lines 40-44) |
| `.skilled/hooks/goal/cursor/goal-inject.mjs` | Modify | Import `readStdin`, delete local reader (lines 47-51) |
| `.skilled/hooks/goal/devin/goal-inject.mjs` | Modify | Import `readStdin`, delete local reader (lines 36-40) |
| `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | Modify | Import `readStdin`, delete local reader (lines 57-61) |
| `.skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | Modify | Import `readStdin`, delete local reader (lines 58-62) |
| `.skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs` | Modify | Import `readStdin`, delete the synchronous reader (lines 22-28), make `main` async and await the read (lines 77 and 81) |
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modify | Header comment only (lines 4-10); no code line changes |
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Create | Deadline table test and payload test |
| `.skilled/hooks/shared/README.md` | Modify | Consumers, directory tree, key files and validation text |
| `.skilled/hooks/README.md` | Modify | Tree comment (line 109), consumer sentence (line 177) and validation block (lines 194-203) |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines/tasks.md`, `goal.md`, `implementation-summary.md` | Modify | Task checkboxes, goal log evidence, summary |
| `scratch/` inside this packet | Create | Status snapshots and command output; not product files. The planner already saved `scratch/before/`, `scratch/baseline/` and `scratch/probe/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No script under `.skilled/hooks/` reads stdin without a deadline | `rg -n "for await \(const chunk of process\.stdin\)\|readFileSync\(0" .skilled/hooks` prints nothing and exits 1 |
| REQ-002 | With stdin left open and never written, each of the fourteen hooks exits 0 with its fail-open output, no sooner than 2900 ms and before 8000 ms after spawn | `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` prints `ℹ pass 18` and `ℹ fail 0` and exits 0, with 14 subtests passing |
| REQ-003 | Every hook handles empty, invalid, non-object, null and ignored stdin, and a normal payload, exactly as before | `compare-inputs.mjs` against the saved before copy prints `diffs=0`; the payload test and the existing hook suites pass (78 node:test, 5 vitest) |
| REQ-004 | `fable-subagent-guard.mjs` reads through the helper asynchronously and keeps its fail-open result when the read fails | `main` is `async`, the read is `await readStdin()` inside the existing `try`, `readFileSync` is gone, and the `ignored` stdin case in `compare-inputs.mjs` shows no difference |
| REQ-005 | Every edited or created JavaScript file passes the syntax check | `node --check` exits 0 with no output on each of the sixteen files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | One reader, no second helper: each hook imports `readStdin` from `../../shared/hook-adapter-shared.cjs` and keeps no local reader | The import appears in 14 `.mjs` files, `function readStdin` appears in none, and `find .skilled/hooks -name 'hook-adapter-shared*' -not -type l` lists only the helper and its test |
| REQ-007 | The helper's header comment names the ESM hooks and keeps the reason the system-spec-kit ESM sibling stays separate, and no code line changes | Every changed line in the helper is a `//` comment, `independent ESM sibling` appears once, and `require(` appears nowhere in the file |
| REQ-008 | The default 3000 ms deadline stands at every call site | `rg -n "readStdin\([^)]" .skilled/hooks --glob '*.mjs'` prints nothing and exits 1, so no hook passes its own deadline; the wired host timeouts are 5 s or more |
| REQ-009 | The two hooks READMEs describe the ESM consumers and the new test, and still validate | `validate_document.py` prints `VALID` and `Total issues: 0` for both, and the added lines hold no em dash and no semicolon |
| REQ-010 | Only the files in the table above change | The `git status --porcelain -- .skilled/hooks` snapshot differs from the Phase 1 copy by exactly 17 ` M` lines and one `??` line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A host that never closes a hook's stdin no longer holds any of the fourteen guards: each exits 0 about 3 seconds after it starts, with the output it already gives on bad input, not at the host's timeout.
- **SC-002**: All 22 Node hook adapters under `.skilled/hooks/` that parse a raw stdin payload read it through the one shared reader: the 8 CommonJS adapters that already did and the 14 ESM hooks fixed here.
- **SC-003**: No hook changes what it does with a payload: the five odd-input cases give the same exit status, signal and output as the saved before copy, and every existing hook suite still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A host writes its payload slower than 3000 ms. The read is cut, the parse fails, and a guard that would have denied approves: `dispatch/{claude,codex,devin}` preflight (block-severity rules) and `task-dispatch/cursor`. The audit hooks drop a line and the goal hooks skip an injection | Med | No host write latency was measured, so 3000 ms is a judgment shared with the CommonJS adapters. Every wired host timeout is 5 s or more (shortest 5 s over 15 wired entries; unit inferred to be seconds), so a longer deadline would race the host. The residual risk goes into `implementation-summary.md` |
| Risk | The named import `import { readStdin } from '...cjs'` depends on Node reading the names from the helper's `module.exports` object literal | Med | Confirmed on Node v26.8.2 (the repo floor, 20.11.0, is inferred to behave the same because Node's CommonJS export detection reads this literal shape). The new header comment tells the next editor to keep that assignment a literal of bare names. Fallback if an older Node fails: `createRequire(import.meta.url)('../../shared/hook-adapter-shared.cjs')`, shown in `plan.md` section 3 |
| Risk | The Fable guard becomes async; an unexpected throw now rejects instead of throwing | Low | Both end with exit 1 and a printed error. Every fail-open path (kill-switch, bad payload, wrong tool, read failure) returns inside the existing `try` or before it |
| Risk | The new test spawns fourteen Node processes at once and joins the `.skilled/scripts/run-node-tests.mjs` gate | Low | It took 3.4 s in the planner's run and the upper bound is 8000 ms, so start-up under load has 5 s of room; raise only `LATEST_EXIT_MS` if a loaded gate ever trips it |
| Risk | The Cursor shims read stdin for up to 3 s and then spawn a child that waits up to 5 s (preflight and task guard) or 3 s (MCP guard) | Low | Worst case is 8 s and 6 s, inside Cursor's wired 10 s timeout |
| Dependency | Node, `rg`, `diff` and `rsync` in the builder's sandbox | Low | `rsync` is needed only to recreate `scratch/before/`, which the planner already saved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The 3000 ms default, the async Fable entry point (`main();` stays the call, no top-level await) and the reuse of the CommonJS helper are fixed by this spec. The parent `spec.md` calls the helper a shared ESM helper; this phase reuses the existing CommonJS file instead, as the operator's brief requires.
<!-- /ANCHOR:questions -->

---
