---
title: "Tasks: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104"
description: "Task list for closing nine rerank sidecar filesystem durability P2 findings."
trigger_phrases:
  - "020 003 tasks"
  - "F22 F28 F59 F66 F67 F72 F89 F103 F104 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability"
    last_updated_at: "2026-05-23T10:31:09Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200030200030200030200030200030200030200030200030200030200030200"
      session_id: "020-003-filesystem-durability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold Level 2 packet docs (`<this-folder>/`)
- [x] T002 Read parent 020 spec and halt-on-first-regression rule (`../spec.md`)
- [x] T003 Read Bucket 1 and Bucket 6 ADR templates (`../001-*/decision-record.md`, `../002-*/decision-record.md`)
- [x] T004 Read F15 atomic-write baseline ADR
- [x] T005 Read full source/test files for allowed edit surface
- [x] T006 Strict-validate scaffold before source edits (`validate.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add `fsyncDirOf(path)` and wire it after atomic renames (`ensure-rerank-sidecar.cjs`)
- [x] T008 Standardize temp suffixes on `crypto.randomBytes(16).toString('hex')` (`ensure-rerank-sidecar.cjs`)
- [x] T009 Validate `RERANK_SIDECAR_STATE_DIR` at launcher entry (`ensure-rerank-sidecar.cjs`)
- [x] T010 Open log files with `0600` (`ensure-rerank-sidecar.cjs`)
- [x] T011 Spawn logging child with `stdio: ['ignore', logFd, logFd]` (`ensure-rerank-sidecar.cjs`)
- [x] T012 Normalize health payload fields and types (`ensure-rerank-sidecar.cjs`)
- [x] T013 Add internal dependency injection hook (`ensure-rerank-sidecar.cjs`)
- [x] T014 Make `skipIfDisabled` semantics consistent (`ensure-rerank-sidecar.cjs`)
- [x] T015 Split the largest launcher function into focused helpers (`ensure-rerank-sidecar.cjs`)
- [x] T016 Add regression fixtures (`ensure-rerank-sidecar.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run requested bin vitest command equivalent through installed local runner
- [x] T018 Run requested embedders vitest command
- [x] T019 Run mcp-server typecheck
- [x] T020 Fill checklist, decision record, and implementation summary
- [x] T021 Run final strict spec validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Requested verification commands exit 0 or equivalent local runner evidence is documented where the prompt runner path is absent
- [x] Parent halt-on-first-regression rule was honored
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Scope**: See `../spec.md`
- **Predecessor ADRs**: See `../001-fix-deferred-p2s-for-test-only-and-shared-exports/decision-record.md` and `../002-fix-deferred-p2s-for-env-and-config-behavior/decision-record.md`
- **F15 Baseline**: See predecessor atomic-write ADR once located during setup
<!-- /ANCHOR:cross-refs -->
