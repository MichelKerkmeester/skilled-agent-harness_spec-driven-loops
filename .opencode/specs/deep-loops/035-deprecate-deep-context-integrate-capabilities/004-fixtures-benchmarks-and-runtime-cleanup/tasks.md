---
title: "Tasks: Fixtures Benchmarks Archive And Runtime Cleanup"
description: "Task breakdown for phase 004 fixture, benchmark, compiler, and conditional runtime cleanup."
trigger_phrases:
  - "deep-context runtime cleanup tasks"
  - "deep-context fixture cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities/004-fixtures-benchmarks-and-runtime-cleanup"
    last_updated_at: "2026-07-04T18:32:06Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 004 fixture, benchmark, generated-contract, and runtime cleanup"
    next_safe_action: "Recover Spec Memory daemon and reindex packet metadata"
    blockers:
      - "Spec Memory daemon indexing is unavailable: socket absent."
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-004-tasks"
      parent_session_id: "2026-07-04-phase-004-contract-authoring"
    completion_pct: 100
    open_questions:
      - "Spec Memory reindex pending daemon recovery."
    answered_questions:
      - "Retain narrow historical context artifact compatibility with tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fixtures Benchmarks Archive And Runtime Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after inventory classification |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary file or surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 004 scaffold docs before editing.
- [x] T002 Inspect nested packet file state with Glob.
- [x] T003 Inspect runtime context references with Grep.
- [x] T004 Inspect benchmark/fixture context references with Glob/Grep.
- [x] T005 Confirm phases 002 and 003 verification evidence.
- [x] T006 Capture fresh runtime/fixture/benchmark inventory.
- [x] T007 Identify runtime and benchmark baseline test commands.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Update command contract compiler source lists.
- [x] T009 Regenerate compiled command contracts and manifest.
- [x] T010 Replace, archive, or mark inactive context behavior benchmark lanes.
- [x] T011 Replace, archive, or mark inactive skill benchmark context fixtures.
- [x] T012 Patch runtime scripts/libs to remove or narrowly retain context support.
- [x] T013 Update runtime tests for removed or retained compatibility behavior.
- [x] T014 Refresh runtime and workflow docs/metadata.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run baseline and post-change runtime tests.
- [x] T016 Run benchmark/skill-benchmark tests affected by fixture changes.
- [x] T017 Verify generated contracts no longer require missing deep-context files.
- [x] T018 Grep active runtime/docs/fixtures for unsupported standalone context references.
- [x] T019 Refresh `description.json` and `graph-metadata.json`.
- [x] T020 Run strict validation for phase 004.
- [x] T021 Run recursive strict validation from the parent packet.
- [x] T022 Update `implementation-summary.md` with verification evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Earlier phases have verification evidence.
- [x] Context runtime/fixture hits are classified.
- [x] Fixtures and compiler references no longer keep standalone context active.
- [x] Runtime context support is removed or retained with explicit tests.
- [x] Phase and recursive parent validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Phase 003**: `../003-discoverability-docs-mirrors-and-index/spec.md`
<!-- /ANCHOR:cross-refs -->
