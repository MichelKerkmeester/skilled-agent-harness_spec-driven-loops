---
title: "Tasks: Core document diff and snapshot MVP"
description: "Actionable setup, implementation, and verification tasks for the portable text and Markdown document diff MVP."
trigger_phrases:
  - "document diff MVP tasks"
  - "text markdown diff tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/002-core-diff-and-snapshot-mvp"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Created the MVP task scaffold"
    next_safe_action: "Resolve T001 and T002 after phase 001 audit closure"
    blockers:
      - "Phase 001 command-owned audit closure"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-002-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Core document diff and snapshot MVP

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

**Task Format**: `T### [P?] Description (target surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Close the phase 001 command-owned audit before production writes (phase 001)
- [ ] T002 Select the portable package location and publish/export boundary (package root)
- [ ] T003 Configure TypeScript builds and tests for Node 22 and 24 (package root)
- [ ] T004 [P] Add seed text and Markdown fixtures with expected canonical output (fixtures)
- [ ] T005 [P] Pin jsdiff, unified, and remark dependencies with a lockfile (package manifest)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Implement canonical document and node types, diagnostics, and provenance (core model)
- [ ] T007 Implement NFC, newline, whitespace, and safe attribute normalization (core normalization)
- [ ] T008 Implement deterministic occurrence IDs, content hashes, and subtree hashes (core hashing)
- [ ] T009 [P] Implement plain-text extraction (text adapter)
- [ ] T010 [P] Implement Markdown extraction through remark/mdast (Markdown adapter)
- [ ] T011 Implement deterministic add, delete, and replacement diff actions with jsdiff (diff engine)
- [ ] T012 Implement escaped unified HTML with inlined CSS, anchors, summary, and CSP foundation (report renderer)
- [ ] T013 Implement immutable basic capture and explicit before/after comparison (snapshot boundary)
- [ ] T014 Expose the research-defined public API and initial compare command (library and CLI)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Prove canonical JSON, hashes, diff actions, and HTML are deterministic across repeated runs (golden fixtures)
- [ ] T016 Prove capture and compare never modify source bytes (integration tests)
- [ ] T017 Run hostile text/Markdown escaping and no-network report checks (security smoke)
- [ ] T018 Run tests on Node 22 and 24 and record baseline timing and memory (CI matrix)
- [ ] T019 Update the phase summary with actual package paths, results, and limitations (phase docs)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and tasks are complete with test evidence.
- [ ] No blocked tasks remain.
- [ ] The portable core works without OpenCode.
- [ ] Source-integrity, report-security, and runtime-matrix checks pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research**: `../001-research-and-requirements/research/research.md`
- **Next gate phase**: `../003-validation-security-and-quality-gates/spec.md`
<!-- /ANCHOR:cross-refs -->

