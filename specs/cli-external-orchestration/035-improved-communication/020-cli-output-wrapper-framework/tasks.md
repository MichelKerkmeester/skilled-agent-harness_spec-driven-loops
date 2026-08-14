---
title: "Tasks: Phase 020 CLI-Output Wrapper Framework"
description: "Planned task breakdown for the mode and adapter inventory, the parameterized wrapper entrypoint, incremental stream capture and normalization, the projectMessage() feed with a fail-open byte-exact original passthrough, the launch/registration pattern, and wrapper verification."
trigger_phrases:
  - "cli-output-wrapper-framework"
  - "tasks"
  - "implementation"
  - "wrapper framework tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/020-cli-output-wrapper-framework"
    last_updated_at: "2026-08-14T07:56:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the CLI-output wrapper framework and verified the package gate."
    next_safe_action: "Proceed to phase 021 Claude Code wrapper wiring."
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
      session_id: "phase-020-cli-output-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "Every task is complete with observed evidence recorded in the checklist."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 020 CLI-Output Wrapper Framework

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

- [x] T001 Inventory the headless, stream, and print launch modes for Claude Code, Codex, Devin, Cursor, and Pi (`src/runtimes/*.ts`, `docs/support-matrix.md`)
- [x] T002 Inventory the per-runtime adapter envelope shapes and the Phase 017 wrapper seam contract (`src/runtimes/`, `017-runtime-wiring-feasibility-and-contract/spec.md`)
- [x] T003 Review the Phase 018 `projectMessage()` entrypoint, the Phase 016 `isProjectionEnabled()` gate, and the Phase 019 native plugin as the proven seam model (`src/runtime/`, `src/config/enablement.ts`, `019-opencode-native-plugin/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the wrapper entrypoint parameterized by runtime (`src/wrapper/`)
- [x] T005 Author the runtime launcher for headless, stream, and print modes (`src/wrapper/`)
- [x] T006 Implement incremental stream capture and envelope normalization through the per-runtime adapters (`src/wrapper/`, `src/runtimes/`)
- [x] T007 Wire the `isProjectionEnabled()` gate, the `projectMessage()` feed, and the fail-open byte-exact original passthrough (`src/wrapper/`)
- [x] T008 Author the launch/registration pattern operators invoke (`bin/` or package alias)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Author the wrapper test suite covering entrypoint resolution and stage order (`test/wrapper/`)
- [x] T010 Cover the gate matrix, incremental capture, envelope normalization, and fail-open fallback paths (`test/wrapper/`)
- [x] T011 Cover the incapable-runtime, unexpected-shape, mid-stream-exit, and double-invoke edge cases (`test/wrapper/`)
- [x] T012 Prove the no-terminal-pollution boundary and canonical-byte preservation (`test/wrapper/`)
- [x] T013 Run `npm run check` from the package directory and strict packet validation (`020-cli-output-wrapper-framework/`, `validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All ten requirements and checklist blockers have observed evidence.
- [x] The wrapper projects one wrapper-target runtime end-to-end with the exact-original fallback intact.
- [x] Every disabled, failed, or incapable state passes the byte-exact original through.
- [x] The wrapper test suite and the package gate pass and strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
