---
title: "Tasks: Phase 005 Cross-CLI Playbook Execution Harness"
description: "Task ledger for authoring cross-stack scenarios, root playbook updates, and cross-CLI runner scripts."
trigger_phrases:
  - "phase 005 tasks"
  - "cross-cli harness tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/005-playbook-cross-cli-execution"
    last_updated_at: "2026-05-05T10:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Tracked Phase 005 setup tasks"
    next_safe_action: "Complete harness verification"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Phase 005 Cross-CLI Playbook Execution Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T-### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read existing Packet 069 phase docs, sk-code router docs, and playbook scenario exemplars.
- [x] T-002 Create Phase 005 Level 2 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
- [x] T-003 Create canonical `description.json` and `graph-metadata.json`.
- [x] T-004 Create `implementation-summary.md` after verification evidence is available.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-005 [P] Create `07--cross-stack-routing/001-webflow-plus-motion-dev.md`.
- [x] T-006 [P] Create `07--cross-stack-routing/002-non-webflow-plus-motion-dev.md`.
- [x] T-007 [P] Create `07--cross-stack-routing/003-opencode-plus-motion-dev.md`.
- [x] T-008 [P] Create `07--cross-stack-routing/004-decision-matrix-routing.md`.
- [x] T-009 [P] Create `07--cross-stack-routing/005-snippet-reuse-cross-stack.md`.
- [x] T-010 [P] Create `07--cross-stack-routing/006-cwv-gates-animation-heavy.md`.
- [x] T-011 [P] Create `07--cross-stack-routing/007-prefers-reduced-motion.md`.
- [x] T-012 Update root playbook canonical artifacts, overview count, TOC, Section 13, automated-test notes, feature cross-reference table, and footer totals.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-013 Create `prompts/universal_test_prompt.md`.
- [x] T-014 Create `scripts/run_codex.sh`.
- [x] T-015 Create `scripts/run_copilot.sh`.
- [x] T-016 Create `scripts/run_gemini.sh`.
- [x] T-017 Create `scripts/run_opencode.sh`.
- [x] T-018 Create `scripts/run_matrix.sh`.
- [x] T-019 Set runner scripts executable.
- [x] T-020 Run Phase 005 strict validation.
- [x] T-021 Run parent Packet 069 recursive strict validation.
- [x] T-022 Confirm scenario files and executable scripts exist.
- [x] T-023 Run required `run_codex.sh SD-001` smoke test; result failed because nested Codex could not connect to the OpenAI API from this sandbox.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All setup tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remain.
- [x] Validation commands and smoke-test outcome are recorded in `implementation-summary.md`.
- [ ] Checklist P0 items are marked with evidence where executable in this sandbox; final critical-path routing verdict remains Phase D work.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Root Playbook**: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md`
<!-- /ANCHOR:cross-refs -->
