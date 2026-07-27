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
    last_updated_at: "2026-07-27T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA); all tasks verified complete."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "hook-adapter-shared.mjs", "hook-adapter-shared.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Claude and Codex had no existing spec-gate test files; new spec-gate-claude.test.mjs and spec-gate-codex.test.mjs were created mirroring the Devin/Cursor precedent."]
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

- [x] T001 Create `hook-adapter-shared.mjs` exporting `readStdin()`/`parseJsonFailOpen()`. [EVIDENCE: `node --check` passes; thin-line MODULE header aligned to repo convention.]
- [x] T002 Create `hook-adapter-shared.cjs` as its CommonJS twin. [EVIDENCE: `node --check` passes; thin-line MODULE header aligned to repo convention.]
- [x] T003 [P] Confirm both helpers are byte-behavior-identical to the boilerplate they replace. [EVIDENCE: every migrated adapter's existing test suite passes unchanged post-migration (spec-gate-core 67/67, devin spec-gate 15/15, cursor prebind 16/16, new claude/codex suites 13/13 and 14/14).]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply `firstNonBlankString()` to Claude's `spec-gate-enforce.mjs`. [EVIDENCE: `node --check` passes; `spec-gate-claude.test.mjs` 13/13 including the masking-regression row.]
- [x] T005 Apply `firstNonBlankString()` to Codex's `spec-gate-enforce.mjs`, diff-reviewed to confirm `apply_patch` parsing untouched. [EVIDENCE: `git diff` shows `pathsFromPatch()` has zero line changes; only the generic `filePathFrom()` alias chain and the `readStdin`/JSON.parse boilerplate changed; `spec-gate-codex.test.mjs` 14/14 including a dedicated apply_patch-still-resolves row.]
- [x] T006 Add a discriminating masking-regression test row to Claude's spec-gate test suite. [EVIDENCE: `spec-gate-claude.test.mjs` "a truthy non-string in an earlier field does not mask a valid later alias" row passes.]
- [x] T007 Add a discriminating masking-regression test row to Codex's spec-gate test suite. [EVIDENCE: `spec-gate-codex.test.mjs` equivalent row passes, plus an apply_patch-specific row.]
- [x] T008 [P] Migrate all 4 runtimes' `spec-gate-enforce.mjs` to import the shared helper. [EVIDENCE: grep for the old inline `readStdin`/`JSON.parse` pattern across all four files returns no matches.]
- [x] T009 [P] Migrate `task-dispatch-guard.cjs` (claude, devin) to import the shared CJS helper. [EVIDENCE: grep returns no matches; live smoke invocation (`echo '{}' | node <file>`) exits 0 on both, confirming the relative require path resolves.]
- [x] T010 [P] Migrate `mcp-route-guard.cjs` (claude, codex, devin) to import the shared helper. [EVIDENCE: grep returns no matches; live smoke invocation exits 0 on all three.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run every migrated adapter's existing test suite; confirm unchanged pass counts. [EVIDENCE: spec-gate core 67/67, devin spec-gate 15/15, cursor prebind 16/16, devin permission-request-policy (phase 013 regression check) 2/2 -- all unchanged from pre-migration baselines.]
- [x] T012 Run phase 014 strict and recursive parent strict validation. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 014; recursive validation of the 029 parent reports 0 errors, 0 warnings across all 16 folders.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 tasks have command-backed evidence.
- [x] No blocked implementation tasks remain.
- [x] Runtime, configuration, docs, and recursive packet gates pass. [EVIDENCE: phase 014 strict 0/0; 029 parent recursive strict 0/0 across 16 folders.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
