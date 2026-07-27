---
title: "Tasks: Hook adapter shared boilerplate and Claude/Codex fix"
description: "Task breakdown for the shared stdin/parse helper extraction, the Claude/Codex alias fix, and the migration of Q6-sampled adapters."
trigger_phrases:
  - "hook adapter shared boilerplate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/014-hook-adapter-shared-boilerplate-and-claude-codex-fix"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Execute T001-T012 in order."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hook adapter shared boilerplate and Claude/Codex fix

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

- [ ] T001 Create `hook-adapter-shared.mjs` exporting `readStdin()`/`parseJsonFailOpen()`. [EVIDENCE: `node --check` passes.]
- [ ] T002 Create `hook-adapter-shared.cjs` as its CommonJS twin. [EVIDENCE: `node --check` passes.]
- [ ] T003 [P] Confirm both helpers are byte-behavior-identical to the boilerplate they replace. [EVIDENCE: micro-test comparing old inline vs. new shared-import behavior.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Apply `firstNonBlankString()` to Claude's `spec-gate-enforce.mjs`. [EVIDENCE: `node --check` passes; existing Claude spec-gate suite unchanged.]
- [ ] T005 Apply `firstNonBlankString()` to Codex's `spec-gate-enforce.mjs`, diff-reviewed to confirm `apply_patch` parsing untouched. [EVIDENCE: `node --check` passes; existing Codex spec-gate suite unchanged; diff shows no `apply_patch` branch changes.]
- [ ] T006 Add a discriminating masking-regression test row to Claude's spec-gate test suite. [EVIDENCE: row fails on the pre-fix adapter, passes after.]
- [ ] T007 Add a discriminating masking-regression test row to Codex's spec-gate test suite. [EVIDENCE: row fails on the pre-fix adapter, passes after.]
- [ ] T008 [P] Migrate all 4 runtimes' `spec-gate-enforce.mjs` to import the shared helper. [EVIDENCE: grep finds no inline boilerplate remaining in these 4 files.]
- [ ] T009 [P] Migrate `task-dispatch-guard.cjs` (claude, devin) to import the shared CJS helper. [EVIDENCE: grep finds no inline boilerplate remaining.]
- [ ] T010 [P] Migrate `mcp-route-guard.cjs` (per-runtime) to import the shared helper. [EVIDENCE: grep finds no inline boilerplate remaining.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run every migrated adapter's existing test suite; confirm unchanged pass counts. [EVIDENCE: `node --test` reports the same pass counts as before migration for every affected suite.]
- [ ] T012 Run phase 014 strict and recursive parent strict validation. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 014 and the 029 parent.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 tasks have command-backed evidence.
- [ ] No blocked implementation tasks remain.
- [ ] Runtime, configuration, docs, and recursive packet gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
