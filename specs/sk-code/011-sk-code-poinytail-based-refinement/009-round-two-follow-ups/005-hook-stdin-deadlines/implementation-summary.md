---
title: "Implementation Summary"
description: "Fourteen ESM hook scripts under .skilled/hooks/ now read stdin through the shared 3000 ms deadline reader, so a host that never closes stdin no longer holds a guard, and each hook still fails open exactly as before."
trigger_phrases:
  - "hook stdin deadlines implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines"
    last_updated_at: "2026-10-10T11:30:00Z"
    last_updated_by: "builder-005-hook-stdin-deadlines"
    recent_action: "Built 14 hook edits, helper header, deadline test and two READMEs, then verified"
    next_safe_action: "Orchestrator sets spec.md status, narrows the REQ-008 search and reruns criteria"
    blockers: []
    key_files:
      - ".skilled/hooks/shared/hook-stdin-deadline.test.mjs"
      - ".skilled/hooks/shared/hook-adapter-shared.cjs"
      - ".skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-hook-stdin-deadlines"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-hook-stdin-deadlines |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A host that leaves a hook's stdin open no longer holds the hook until the host's own timeout kills it. All fourteen ESM hook scripts under `.skilled/hooks/` now give up waiting after 3000 ms and take the fail-open path each one already had. The Fable subagent guard was the worst case: on the unchanged tree it ran until a 10 second kill timer, and it now exits 0 about 3 seconds after it starts.

### Phase 5: hook-stdin-deadlines

Thirteen of the hooks each carried a private `readStdin` that looped over `process.stdin` with no deadline, and the Fable guard read with a synchronous `fs.readFileSync(0)`. Each hook now deletes that reader and imports `readStdin` by name from the existing `hook-adapter-shared.cjs`, the same reader the eight CommonJS adapters already use. Every hook keeps its own `JSON.parse` inside its own `try`, so an empty or cut-off read throws and the existing `catch` takes the same exit as before. The Fable guard became `async`, awaits the read inside its existing `try` and keeps the entry call `main();`.

A new table-driven test spawns all fourteen hooks with stdin left open and never written, and checks that each exits 0 with its fail-open output between 2900 and 8000 ms after spawn. A second group of three tests pins the normal-payload path of the seven hooks that no other suite spawns. The helper's header comment and the two hooks READMEs now say that ESM adapters share the reader too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/goal/cursor/goal-inject.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/goal/devin/goal-inject.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | Modified | Import `readStdin`, delete the local reader |
| `.skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs` | Modified | Import `readStdin`, delete the synchronous reader, make `main` async and await the read |
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modified | Header comment only: names the ESM adapters and keeps the reason the system-spec-kit ESM sibling stays separate |
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Created | Deadline table test over the fourteen hooks plus a payload test for the seven no other suite spawns |
| `.skilled/hooks/shared/README.md` | Modified | ESM consumer row, directory tree, key files and validation command |
| `.skilled/hooks/README.md` | Modified | Tree comment, consumer sentence and validation block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The new test went first. Before any hook edit it printed `ℹ pass 3` and `ℹ fail 15`: the three payload tests passed and the fourteen deadline subtests plus their parent failed, so the test fails for the right reason. After the fourteen edits it printed `ℹ tests 18`, `ℹ pass 18` and `ℹ fail 0` in about 3.4 seconds.

Each hook was edited by exact text replacement, and each find text matched exactly once. Every file then showed a diff of 7 changed lines against the saved before copy, 13 for the Fable guard. Two scripts saved in `scratch/probe/` backed that up. `compare-inputs.mjs` ran each hook with empty, invalid, non-object, `null` and ignored stdin from both trees and printed `diffs=0`. `verify-exact-edits.mjs` rebuilt each hook from the saved copy with only the planned edits and printed `mismatches=0`.

The existing suites that spawn or pin these hooks still pass (78 node:test and 5 vitest, the same as the baselines taken first). The change is edited in the worktree and not committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the CommonJS `readStdin` through a named import and add no second helper | Node reads the names from the helper's `module.exports` object literal, so the fourteen ESM hooks share the eight CommonJS adapters' reader with no copy to drift. The header comment now tells the next editor to keep that assignment a literal of bare names |
| Keep the default 3000 ms deadline at every call site | Every wired host timeout is 5 s or more (shortest 5 s over 15 wired entries), so a longer deadline would race the host and a shorter one has no case. `readStdin(` is called with no argument on all 14 lines |
| Leave each hook's `JSON.parse` and fail-open exit where they were | Only the way stdin is read changes. A cut-off read fails the parse, and the existing `catch` returns the output the hook already gave on bad input |
| Make the Fable guard `async` and await the read inside its existing `try` | The guard has no `process.exit`, and the helper pauses stdin on both paths, so the event loop drains and the process ends. A rejected read lands in the same `catch` that an empty read did before |
| Leave the system-spec-kit runtime readers alone | They are TypeScript built to dist plus ESM files owned by that skill, and they include its own ESM sibling `lib/hook-adapter-shared.mjs`. They are recorded as a follow-up |
| Add no version bump and no changelog entry | The sk-code and sk-doc contracts read before editing apply version authority at hub roots, and `.skilled/hooks/` is not a skill packet. Neither README carries a version field |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Criterion 1: `rg -n "for await \(const chunk of process\.stdin\)\|readFileSync\(0" .skilled/hooks` | PASS. Printed nothing, exit 1 |
| Criterion 2: `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` | PASS. Exit 0, `ℹ tests 18`, `ℹ pass 18`, `ℹ fail 0`, 14 passing subtests |
| Criterion 3: `compare-inputs.mjs` then `verify-exact-edits.mjs` against `scratch/before/` | PASS. `diffs=0` then `mismatches=0`, exit 0 |
| Criterion 4: nine existing node:test files, then the Codex dispatch vitest file | PASS. `ℹ pass 78`, `ℹ fail 0` and `Tests  5 passed (5)`, exit 0 |
| Criterion 5: `node --check` loop over the files that import `readStdin`, the helper and the new test | PASS. Printed only `syntax ok` |
| Criterion 6: `validate.sh` on this folder with `--strict` | PASS. `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Held-open Fable guard (the 10 second hang from before) | PASS. `code=0 signal=null stdout="" ms=3034` |
| REQ-008: `rg -n "timeoutMs" .skilled/hooks --glob '*.mjs'` | NOT MET AS WRITTEN. Prints one line from an unrelated file, see Known Limitations. No hook passes `timeoutMs` to `readStdin` |
| Scope: `git status --porcelain -- .skilled/hooks` against the Phase 1 snapshot | PASS. 17 ` M` lines, 1 `??` line (the new test), 0 removed lines |
| `verify_alignment_drift.py --root .skilled/hooks` | PASS. `Errors: 0`, `Warnings: 0`, 138 files scanned. It reads only tracked files, so it has not scanned the new test |
| `check-placeholders.sh` on this folder | FAIL. 3 matches, all `[REPO_ROOT]` in `plan.md` lines 326, 335 and 346, see Known Limitations |
| README validators on both READMEs | PASS. `VALID` and `Total issues: 0`, and no added line holds a semicolon or an em dash |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A host that writes its payload slower than 3000 ms is cut short.** The parse fails and the hook takes its fail-open path, so a guard that would have denied approves. This applies to the preflight guards under `dispatch/{claude,codex,devin}` (block-severity rules) and to `task-dispatch/cursor`. The audit hooks drop a log line and the goal hooks skip an injection. No host write latency was measured, so 3000 ms is a judgment shared with the CommonJS adapters.
2. **The REQ-008 search cannot print nothing.** `rg -n "timeoutMs" .skilled/hooks --glob '*.mjs'` matches `classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:160`, where a classifier request carries its own `timeoutMs`. That file is tracked, unchanged and present in the saved before copy. The search does not look at `readStdin` calls, so the pattern needs narrowing, for example `readStdin\([^)]`, which printed nothing and exited 1.
3. **Other unbounded readers remain under `.skilled/skills/system-spec-kit/runtime/hooks/`.** `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0"` finds 15 matches in 15 files there: six TypeScript files built to dist and nine `.mjs` or `.cjs` files, including its ESM sibling `lib/hook-adapter-shared.mjs`. The Cursor `dispatch/cursor/post-tool-use.mjs` and `post-edit-quality/cursor/post-tool-use.mjs` are symlinks into that tree, so the search over `.skilled/hooks` does not see them. They belong to system-spec-kit and are another owner's change.
4. **The named import is confirmed on Node v26.8.2 only.** The repo floor of 20.11.0 is inferred to behave the same because Node reads CommonJS export names from the same literal shape. If an older Node prints `Named export 'readStdin' not found`, the fallback is `createRequire(import.meta.url)('../../shared/hook-adapter-shared.cjs')`.
5. **The deadline test is timing based.** It spawns fourteen Node processes at once and allows 8000 ms. If a loaded gate ever trips it, raise only `LATEST_EXIT_MS`.
6. **`check-placeholders.sh` cannot print `PASS` for this folder.** It reports 3 placeholder patterns, all `[REPO_ROOT]` at `plan.md` lines 326, 335 and 346. They are the array literals `workspace_roots: [REPO_ROOT]` inside the verbatim test file that `plan.md` quotes, so they are code and not template text. `plan.md` is outside the builder's scope, so it was left alone. `validate.sh --strict` does not run this scan and passes.
7. **The drift verifier has not scanned the new test.** It reads only files git tracks, so the check on the new file waits until it is staged.
<!-- /ANCHOR:limitations -->

---
