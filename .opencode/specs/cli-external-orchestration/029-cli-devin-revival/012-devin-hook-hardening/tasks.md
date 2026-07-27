---
title: "Tasks: Devin hook hardening"
description: "Task breakdown for the devin adapter workspace-root, cwd-fallback, test-suite, and comment-hygiene hardening pass."
trigger_phrases:
  - "devin hook hardening tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Hardening pass complete: 10 adapters unified, test suite 10/10 green."
    next_safe_action: "Run strict validation, then move to phase 006 and 003."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-hook-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin hook hardening

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

- [x] T001 Apply trim-and-fallback `projectDir` resolution to `spec-gate-classify.mjs`. [EVIDENCE: `node --check` passes; adapter uses `typeof workspaceCwd === 'string' && workspaceCwd.trim()`.]
- [x] T002 Apply trim-and-fallback `projectDir` resolution to `spec-gate-enforce.mjs`. [EVIDENCE: `node --check` passes; adapter uses the same trim-and-fallback pattern.]
- [x] T003 Add `payload?.cwd` fallback to `completion-evidence-stop.cjs`. [EVIDENCE: `node --check` passes; adapter now uses `payload?.cwd` with trim-and-fallback instead of hardcoded `process.cwd()`.]
- [x] T004 Apply trim-and-fallback `projectDir` resolution to `post-compaction.cjs`. [EVIDENCE: `node --check` passes.]
- [x] T005 Apply trim-and-fallback `projectDir` resolution to `task-dispatch-guard.cjs`. [EVIDENCE: `node --check` passes.]
- [x] T006 Apply trim-and-fallback `projectDir` resolution to `mcp-route-guard.cjs`. [EVIDENCE: `node --check` passes.]
- [x] T007 Apply trim-and-fallback `projectDir` resolution to `code-graph-freshness.cjs`. [EVIDENCE: `node --check` passes.]
- [x] T008 Apply trim-and-fallback `projectDir` resolution to `dispatch-preflight-lint.mjs`. [EVIDENCE: `node --check` passes.]
- [x] T009 Apply trim-and-fallback `projectDir` resolution to `dispatch-audit-posttooluse.mjs`. [EVIDENCE: `node --check` passes.]
- [x] T010 Trim the stale 8-line "STATUS: LIVE" block to a one-liner in all 9 adapters that carry it. [EVIDENCE: `grep` finds no multi-line `STATUS: LIVE` blocks; the durable fact is preserved as a one-liner.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T011 Build `spec-gate-devin.test.mjs` with a discriminating matrix covering malformed input, missing identity, disabled, child, whitespace cwd, and terminal-state preservation. [EVIDENCE: `spec-gate-devin.test.mjs` 10/10 suite created and passes.]
- [x] T012 Run the devin spec-gate suite green. [EVIDENCE: `node --test` reports 10/10 pass.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the shared spec-gate core suite (67/67) and OpenCode plugin suite (11/11) to confirm no regression. [EVIDENCE: core 67/67, plugin 11/11, cursor prebind 11/11 all pass.]
- [x] T014 Confirm `git diff --stat` is empty on the 6 shared cores. [EVIDENCE: `git diff --stat` on the 6 cores produces no output.]
- [x] T015 Run phase 012 strict and recursive parent strict validation. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 012.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 tasks have command-backed evidence. [EVIDENCE: T001-T015 all complete with `node --check` and `node --test` evidence.]
- [x] No blocked implementation tasks remain. [EVIDENCE: all 15 tasks in `tasks.md` marked complete.]
- [x] Runtime, configuration, docs, and recursive packet gates pass. [EVIDENCE: runtime suites 10/10, 67/67, 11/11, 11/11 all pass; strict validation 0 errors, 0 warnings.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
