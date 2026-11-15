---
title: "Tasks: Phase 11: vibe-context-and-goal-hooks"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe context and goal hooks tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: vibe-context-and-goal-hooks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`G` is `.skilled/hooks/goal/vibe`. `S` is `.skilled/hooks/session-lifecycle/vibe`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 008's settled hook wire format and record the `session_start` input fields and reply shape (`scratch/wire-format.md`). Verify: `rg -n 'additional_context' scratch/wire-format.md` prints at least one line.
- [x] T002 Confirm the hooks registration file exists (`.vibe/hooks.toml`). Verify: `ls .vibe/hooks.toml` prints the path.
- [x] T003 [P] Capture the fixture packet's slice (`scratch/slice.txt`). Verify: `node .skilled/hooks/goal/bin/goal.cjs packet <fixture packet> --workspace "$PWD" | rg -c '^chat_slice='` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the goal adapter that returns the packet's `chat_slice` (`G/goal-inject.mjs`). Verify: `node --check G/goal-inject.mjs` exits 0.
- [x] T005 Add the session-start adapter that composes slice and session context into one `additional_context` (`S/session-start.mjs`). Verify: `node --check S/session-start.mjs` exits 0.
- [x] T006 Add the fixture test for the bound, no-packet and malformed cases (`G/goal-vibe.test.mjs`). Verify: `node --test G/goal-vibe.test.mjs` prints `tests 3`.
- [x] T007 Register the session-start adapter as one `session_start` entry (`.vibe/hooks.toml`). Verify: `rg -c 'session_start' .vibe/hooks.toml` prints 1 and `vibe config schema` accepts the config under `--trust`.
- [x] T008 [P] Add the adapter READMEs and the Vibe matrix rows (`G/README.md`, `S/README.md`, `.skilled/hooks/goal/README.md`, `.skilled/hooks/session-lifecycle/README.md`). Verify: `rg -c 'vibe/' .skilled/hooks/goal/README.md .skilled/hooks/session-lifecycle/README.md` prints at least 1 for each file.
- [x] T009 Name the hook in the runtime contract (`.vibe/SYNC.md`). Verify: `rg -n 'session-start.mjs' .vibe/SYNC.md` prints a line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the fixture test (`G/goal-vibe.test.mjs`). Verify: `node --test G/goal-vibe.test.mjs` prints `pass 3` and `fail 0`.
- [x] T011 Run one keyed print-mode dispatch bound to a packet, with an isolated `VIBE_HOME` and `--output-dir`, asking the model to repeat its goal's Objective line (`scratch/first-turn/`). Verify: the reply contains that packet's Objective line, and `export.json` records `exit_code` 0.
- [x] T013 Render the hooks into a disposable home and wire the lineage adapter (`.vibe/plugins/repo-guards/render-home-hooks.cjs`, `fanout-run.cjs`). Verify: `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` prints `pass 2`; the cli-mistral-vibe unit cases pass 10 and the Vibe stress file passes 22 with 1 skipped.
- [x] T014 Run one keyed scratch-cwd dispatch with the rendered home hooks, `AI_SESSION_CHILD=1` and `VIBE_SPEC_FOLDER`, writing one file (`scratch/scratch-cwd-home-hooks/`). Verify: `export.json` records `0`/`finished`, `proof.txt` holds `ok`, the reply quotes the Objective line, and the journal's tool-call hook requests name the `user:` guard bindings.
- [x] T012 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the first-turn dispatch transcript is saved in `scratch/first-turn/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal core**: `.skilled/hooks/goal/lib/goal-core.cjs`
<!-- /ANCHOR:cross-refs -->

---
