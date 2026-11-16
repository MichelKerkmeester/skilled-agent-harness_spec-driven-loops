---
title: "Tasks: Phase 12: opencode-model-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode model carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: opencode-model-carry

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Probe real OpenCode 2 TUI launches for a model route (`scratch` probe in the session scratchpad). Verify: `OPENCODE_CONFIG_CONTENT` gives `deepseek-v4.1-flash`, `OPENCODE_CONFIG` and a `#high` suffix do not change the model or variant.
- [x] T002 Locate the sender's model in the store. Verify: `session_message` rows of type `assistant` hold `model: {providerID, id, variant}`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Read the latest assistant model (`.skilled/hooks/session-handover/lib/context-usage.cjs`). Verify: `resolveSessionSettings` on the probe session prints `llmgateway/deepseek-v4.1-flash`, and `''` for an unknown session.
- [x] T004 Add the OpenCode branch and store path (`.skilled/hooks/session-handover/lib/relaunch-core.cjs`). Verify: the store-read test passes.
- [x] T005 Carry the model on an OpenCode 2 hop (`.skilled/bin/skilled-loop`). Verify: `bash -n` exits 0 and the carry, merge and unparseable-text tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T006 Run the suites (`.skilled/hooks`). Verify: hand-over `pass 1119` (main 1115), hooks vitest `503 passed`, mirrors in sync.
- [x] T007 Negative control (`skilled-loop`, `relaunch-core.cjs`). Verify: with the carry and the reader off, `pass 10`, `fail 3`.
- [x] T008 Live control hop with the carry off (`scratch/harness/live-hop.sh`). Verify: the receiver lands on `llmgateway/deepseek-v4.1-flash-1017`.
- [x] T009 Three live hops with the carry on. Verify: each scores 5/5 with `modelCarry.kept: true` on `llmgateway/deepseek-v4.1-flash`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



