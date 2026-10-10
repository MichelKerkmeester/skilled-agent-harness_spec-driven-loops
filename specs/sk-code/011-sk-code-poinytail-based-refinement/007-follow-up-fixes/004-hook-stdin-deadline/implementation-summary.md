---
title: "Implementation Summary"
description: "The shared CommonJS stdin reader now resolves at a 3000 ms deadline, so a hook whose host never closes stdin returns on its own instead of waiting for the host to kill it."
trigger_phrases:
  - "hook stdin deadline implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline"
    last_updated_at: "2026-10-10T07:50:00Z"
    last_updated_by: "builder"
    recent_action: "Deadline reader, test file and adapter switch built; criteria 1 to 5 pass"
    next_safe_action: "Orchestrator reviews the uncommitted diff and decides the commit"
    blockers: []
    key_files:
      - ".skilled/hooks/shared/hook-adapter-shared.cjs"
      - ".skilled/hooks/shared/hook-adapter-shared.test.cjs"
      - ".skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs"
      - ".skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs"
      - ".skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs"
      - ".skilled/hooks/shared/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-hook-stdin-deadline"
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
| **Spec Folder** | 004-hook-stdin-deadline |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A CommonJS hook whose host never closes stdin now returns about 3 seconds after it starts, with whatever payload it has read by then. Before this change the shared reader waited for the stream to close, so the hook ran until the host's own timeout killed it. On the unchanged helper, a pipe held open for 8 seconds kept the read going for 7984 ms. On the changed helper the same probe resolves at 3003 ms, and the process exits with status 0 and no signal.

### Phase 4: hook-stdin-deadline

The reader in `hook-adapter-shared.cjs` now settles on whichever comes first: the end of stdin, or the 3000 ms deadline with the bytes read so far. Either path clears the timer, removes its listeners and pauses stdin, so the process can exit on its own. A stream error still rejects, as the old loop did.

Three post-edit adapters carried identical copies of the old reader, so a fix in the shared helper alone would not have reached them. Their local copies are deleted and they require the shared helper instead. All eight CommonJS adapters under `.skilled/hooks/` that read stdin now go through one function. Their existing `JSON.parse` inside a try block still handles bad input exactly as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modified | `readStdin({ timeoutMs = 3000 } = {})` replaces the unbounded `for await` loop with a deadline and listener cleanup |
| `.skilled/hooks/shared/hook-adapter-shared.test.cjs` | Created | Two `node:test` cases: a never-closed stdin resolves at the deadline and its process exits; complete input comes back whole |
| `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | Modified | Local `readStdin` deleted; requires the shared helper |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` | Modified | Local `readStdin` deleted; requires the shared helper |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | Modified | Local `readStdin` deleted; requires the shared helper |
| `.skilled/hooks/shared/README.md` | Modified | Describes the deadline (overview line and key-files row), adds the test file row, and adds the three post-edit adapters to the helper's consumer list |
| `scratch/before/` | Created earlier by the planner | Pre-change copies of the six files the change touches or must leave alone |
| `scratch/baseline/` | Created earlier by the planner | Hook-suite and shell-test output recorded before the edits |
| `scratch/after/` | Created | After-change four-suite output (`combined.txt`) and the full test-file run (`criterion-1.txt`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines were recorded before the first edit. The four hook suites reported 66 pass and 0 fail with exit 0, the shell parse test printed its pass line with exit 0, and the validator reported Errors: 0 and Warnings: 1 with RESULT: PASSED. The hang was reproduced on the unchanged helper at 7984 ms.

After the edits, every goal criterion was rerun from the final tree. The two new test cases ran both as a whole file and by name, the hang reproduction and the adapter-level exit were measured again, and the four existing suites and the shell test were rerun unchanged. The change is uncommitted in the worktree, for the orchestrator to review and commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The deadline lives in the shared helper, and the three local copies are deleted rather than patched | One reader means one fix reaches every CommonJS adapter. Patching three copies would leave the same hang to be fixed again in each file. |
| The deadline resolves with the partial text and does not reject | A stalled host leaves the adapter with partial input, which the existing fail-open parse path already handles. Rejecting would turn every slow host into an error inside each hook. |
| A stream error still rejects | The old loop rejected on error, and an error is not a timeout, so the behavior stays the same. |
| The three post-edit adapters keep their `JSON.parse` inside a try block | Their bad-input handling is their own today. Switching them to `parseJsonFailOpen` would change behavior outside this phase. |
| The ESM sibling `system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` stays byte-identical | It serves system-spec-kit's own spec-gate adapters. Its deadline is a named follow-up, so this phase leaves it alone. |
| The README consumer list gained the three post-edit adapters | The list named only two guard concerns, which became false once the post-edit adapters required the helper. This line sits outside the three edits the plan named, so the orchestrator should confirm it. |

---
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal criterion 1: `node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs` | PASS. `ℹ pass 2`, `ℹ fail 0`, exit 0. The never-closed case passed in 3042 ms; the complete-input case passed in 38 ms |
| Goal criterion 2: `grep -n "async function readStdin"` over the three post-edit adapters | PASS. No lines, exit 1 |
| Goal criterion 3: four hook suites (`node --test` over the post-edit, route-guard, hook-flags and plugin suites) | PASS. `ℹ tests 66`, `ℹ pass 66`, `ℹ fail 0`, exit 0 |
| Goal criterion 4: `grep -n "require("` over the helper | PASS. No lines, exit 1 |
| Goal criterion 5: `bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh` | PASS. `Post-edit adapter parse regression fixture passed`, exit 0 |
| Goal criterion 6: `validate.sh <folder> --strict` | PASS. `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` |
| Hang reproduction on the changed helper (same probe as the baseline) | 3003 ms, previously 7984 ms; the read returned `{"tool_name":"Write"` |
| Devin post-edit adapter, pipe held open, payload `{"tool_name":"Read"}` | `code=0 signal=null ms=3028`, no kill |
| Shared README wording and table rows | The overview line and key-files row name the 3000 ms deadline; the test file row is present; `grep -c "Twenty-eight"` prints 0 |
| ESM sibling unchanged | `cmp` against `scratch/before/` exits 0 with no output |
| CommonJS consumers of the helper | Nine files: three MCP route guards, two task-dispatch guards, three post-edit adapters, and the new test file |
| Helper dependencies | `grep -n "require("` prints nothing; the helper imports nothing |
| Scope of the diff | Five tracked files modified and one file created under `.skilled/hooks/`. The worktree also holds another builder's change to `.skilled/hooks/git/pre-commit`, which this phase did not touch |

---
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A slow host gets cut.** A host that writes its payload more than 3000 ms after starting is cut at the deadline. The fail-open parse then returns `null`, and a task-dispatch or MCP guard can approve a call it would have checked. The 3000 ms value is a judgment, because no host write latency was measured. The complete-input case pins whole-input return for a prompt host, not for a slow one.
2. **Other stdin readers still have no deadline.** Fourteen ESM or synchronous readers under `.skilled/hooks/` and the readers under `system-spec-kit/runtime/hooks/` keep the unbounded pattern. `task-dispatch/claude/fable-subagent-guard.mjs` reads synchronously, so a deadline there needs a different approach. These are named follow-ups in `plan.md` section 6.
3. **The adapter-level exit was measured on one adapter.** The held-pipe exit check ran on the Devin post-edit adapter. The Claude and Codex adapters use the same reader and are exercised by the plugin suite, which spawns them directly, but their held-pipe timing was not measured separately.
<!-- /ANCHOR:limitations -->

---
