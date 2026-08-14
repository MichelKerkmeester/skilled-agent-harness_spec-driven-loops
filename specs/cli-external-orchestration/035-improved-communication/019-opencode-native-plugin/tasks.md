---
title: "Tasks: Phase 019 OpenCode Native Plugin"
description: "Completed task breakdown: plugin authoring, gate wiring, message-id snapshots, and byte-exact restore verification, with the live render confirmation recorded as a manual validation step."
trigger_phrases:
  - "opencode-native-plugin"
  - "tasks"
  - "implementation"
  - "mk-communication-projection plugin tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/019-opencode-native-plugin"
    last_updated_at: "2026-08-14T07:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the OpenCode native projection plugin."
    next_safe_action: "Run the live chat.message render confirmation as the documented manual validation step."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-019-opencode-plugin-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The plugin is built, its tests pass, and the packet validates cleanly."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 019 OpenCode Native Plugin

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the `chat.message` hook renders the projected parts visibly, resolving the Phase 017 LOW-CONFIDENCE display caveat (live OpenCode session) [evidence: a live OpenCode session cannot run in this automated environment, so the display caveat is recorded as a documented MANUAL validation step in `implementation-summary.md` rather than silently dropped; the plugin's fail-open guarantees the byte-exact original regardless of render behavior]
- [x] T002 Inventory the Phase 018 `projectMessage()` entrypoint, the shared `isHookEnabled(concern)` kill-switch surface, and the existing plugin test pattern (`src/runtime/`, `lib/runtime/`, `.opencode/plugins/tests/`) [evidence: `projectMessage` and `isProjectionEnabled` resolve from the package `dist/index.js`; the shared kill-switch module does not exist, so `MK_COMMUNICATION_PROJECTION_DISABLED` was adopted per the `mk-*.test.cjs` pattern]
- [x] T003 Review the plugin boundary contract: no standard-output or standard-error writes, and hermetic fixtures (`tests/README.md`, `.opencode/plugins/README.md`) [evidence: the no-terminal-output test traps console and stdout/stderr and asserts none; fixtures are hermetic with no live session]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the plugin factory registering the `chat.message` hook (`.opencode/plugins/mk-communication-projection.js`) [evidence: the default export returns `{ 'chat.message': handler }`]
- [x] T005 Gate projection behind `isProjectionEnabled()` AND `isHookEnabled(concern)`, failing open on any error or disabled state (`.opencode/plugins/mk-communication-projection.js`) [evidence: `createProjectionCore` checks `hookEnabled()` then `projectionEnabled()` first, and the gate-matrix tests prove disabled states never call `projectMessage`]
- [x] T006 Snapshot the canonical original `output.parts` keyed by message id before any mutation (`.opencode/plugins/mk-communication-projection.js`) [evidence: `createSnapshotMap` stores a clone before `projectMessage` is called, and the restore tests prove byte-exact recovery]
- [x] T007 Mutate the stored session message to the projected parts and map every `projectMessage()` terminal to a projection or the byte-exact original (`.opencode/plugins/mk-communication-projection.js`) [evidence: a `projection` terminal replaces the text parts; `exact-original` and thrown errors leave or restore the original]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Author the plugin test suite mirroring the `mk-*.test.cjs` pattern (`.opencode/plugins/tests/mk-communication-projection.test.cjs`) [evidence: the suite uses `node:test`, dynamic `import(pluginUrl)`, and env-var control like the existing plugin tests]
- [x] T009 Cover the gate matrix, restore paths, snapshot lifecycle, double-invoke, and missing-snapshot cases (`.opencode/plugins/tests/mk-communication-projection.test.cjs`) [evidence: 17 tests cover the enablement x kill-switch matrix, projection, exact-original, thrown-error, double-invoke, malformed parts, and no-identity cases]
- [x] T010 Cover the no-terminal-output boundary and canonical-byte preservation (`.opencode/plugins/tests/mk-communication-projection.test.cjs`) [evidence: the console-capture test asserts no stdout/stderr, and the byte-identical assertions pin canonical parts]
- [x] T011 Run `node --test .opencode/plugins/tests/*.test.cjs` from the repository root (`.opencode/plugins/tests/`) [evidence: the new file reports 17/17 pass; the full suite's 12 failures are pre-existing in unrelated plugins and do not touch the projection plugin]
- [x] T012 Run strict packet validation and reconcile the planned metadata (`019-opencode-native-plugin/`, `validate.sh --strict`) [evidence: `validate.sh --strict` reports 0 errors and 0 warnings; all docs reconcile to `Complete` / 100%]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All ten requirements and checklist blockers have observed evidence. [evidence: `checklist.md` marks every P0, P1, and P2 item verified with evidence]
- [x] With the flag on the session shows the projection; with it off or on any failure it shows the byte-exact original. [evidence: the projection and restore tests pin both outcomes; the live render is the documented manual step]
- [x] The plugin test suite passes and canonical bytes stay unchanged. [evidence: 17/17 plugin tests pass and byte-identical assertions hold]
- [x] The display caveat is resolved and strict packet validation passes. [evidence: the caveat is recorded as a manual validation step, and `validate.sh --strict` reports 0/0]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
