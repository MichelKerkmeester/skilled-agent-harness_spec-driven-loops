---
title: "Tasks: Text PDF, lifecycle CLI, and cross-platform state"
description: "Implementation queue for truthful PDF text extraction, the portable CLI, and safe cross-platform snapshot storage."
trigger_phrases:
  - "PDF CLI tasks"
  - "snapshot lifecycle tasks"
  - "cross-platform state tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode/005-pdf-cli-and-cross-platform-state"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the PDF, CLI, and snapshot lifecycle scaffold"
    next_safe_action: "Wait for validation gates, then run implementation intake"
    blockers:
      - "Phase 003 gates and stable phase 004 contracts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-005-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Text PDF, lifecycle CLI, and cross-platform state

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 003 gates and phase 004 adapter contracts are ready
- [ ] T002 Freeze CLI commands, options, exit codes, and machine-readable output
- [ ] T003 [P] Define the versioned state schema and platform path policy
- [ ] T004 [P] Add PDF, crash, race, permission, symlink, retention, and corruption fixtures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement page-aware text-PDF extraction behind the adapter boundary
- [ ] T006 Preserve page and position provenance in canonical sidecars
- [ ] T007 Emit unsupported-content, reading-order, and fidelity diagnostics
- [ ] T008 Enforce file-size, page-count, time, and memory limits
- [ ] T009 Prove removing the PDF adapter leaves the portable core unchanged

### Snapshot state and CLI

- [ ] T010 Implement Linux, macOS, and Windows state-directory resolution
- [ ] T011 Implement private permissions, real-path validation, and unsafe-link refusal
- [ ] T012 Implement SHA-256 addressing, deduplication, temporary writes, flush, and atomic commit
- [ ] T013 Implement per-document locks, timeout, owner checks, and stale-lock recovery
- [ ] T014 Implement version and age retention with deterministic dry-run cleanup
- [ ] T015 Implement integrity checks, orphan recovery, and disk-space safeguards
- [ ] T016 Implement capture, compare, explicit compare, list, cleanup, status, and config commands
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run PDF fixture and malformed-input tests
- [ ] T018 Run crash, race, permission, symlink, retention, corruption, and low-disk tests
- [ ] T019 Run Node.js 22 and 24 tests on Linux, macOS, and Windows
- [ ] T020 Re-run phase 003 security, license, accessibility, and performance gates
- [ ] T021 Verify source immutability and exact dry-run versus cleanup selection
- [ ] T022 Update CLI, state schema, capability tier, and fidelity documentation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] tasks remain
- [ ] PDF output is deterministic and limitations are visible
- [ ] State mutation and cleanup gates pass on every supported platform
- [ ] The standalone CLI contract is frozen for phase 006
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research**: `../001-research-and-requirements/research/research.md`
- **Quality gates**: `../003-validation-security-and-quality-gates/spec.md`
<!-- /ANCHOR:cross-refs -->
