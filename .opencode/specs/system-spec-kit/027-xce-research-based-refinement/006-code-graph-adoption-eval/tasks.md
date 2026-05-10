---
title: "Tasks: 027/006 Code Graph Adoption Eval"
description: "Task list for the Level 3 local evaluation harness, dispatcher hardening, result schema, and reporting workflow."
trigger_phrases:
  - "027 006 adoption eval tasks"
  - "code graph adoption eval tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-code-graph-adoption-eval"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned tasks.md with manifest anchors and Level 3 hardening amendments"
    next_safe_action: "Implement provider preflight, dispatcher, schema, and mocked stress before live harness"
    blockers:
      - "Phases 001-004 must ship before full eval harness run."
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Choose exact task curation source."
    answered_questions:
      - "Subprocess hardening stays in this Level 3 packet."
---
# Tasks: 027/006 Code Graph Adoption Eval

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Curate 12-20 labeled refactoring tasks from recent repo work.
- [ ] T002 Manually review the first 5 tasks for label quality.
- [ ] T003 Define provider preflight behavior and auth-shaped error invalidation.
- [ ] T004 Define discriminated result row schema and zod validation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement `mcp_server/lib/eval/provider-preflight.ts`.
- [ ] T006 Implement hardened dispatcher helper with ignored stdin, 600s timeout, SIGTERM, 5s grace, SIGKILL, close-event wait, and stdout/stderr capture.
- [ ] T007 Implement result schema with `status`, `attempt`, `maxAttempts`, `condition`, `taskId`, `metrics`, `error`, `stdoutPath`, `stderrPath`, `sessionId`, and `includeInPairedStats`.
- [ ] T008 Implement token-measurement helper over `session-analytics-db.ts`.
- [ ] T009 Implement CLI dispatcher at `mcp_server/scripts/dist/eval/code-graph-adoption-eval.js`.
- [ ] T010 Implement metrics and report generator with complete/incomplete/skipped pair accounting.
- [ ] T011 Add stress config entry for the harness.
- [ ] T012 Add stale-process detection and short-backoff retry for DB-lock/readiness failures.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Add mocked 12 x 2 dispatcher stress test covering success, retry, timeout, metrics-missing, DB/readiness retry, and final-failed rows.
- [ ] T014 Add 1 x 2 smoke test as integration sanity, not reliability proof.
- [ ] T015 Run `npx vitest run eval-dispatcher-stress.vitest.ts`.
- [ ] T016 Run `npx vitest run code-graph-adoption-eval.vitest.ts --coverage` and confirm >=80% coverage.
- [ ] T017 Run `npm run check`.
- [ ] T018 Run full harness only after mocked stress passes.
- [ ] T019 Author `implementation-summary.md` with run findings.
- [ ] T020 Run strict validation for this spec folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Mocked stress test passes before any live full-harness run.
- [ ] Result schema safely excludes incomplete pairs from paired statistics.
- [ ] Provider/auth failures fail fast instead of consuming the run budget.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Research**: `../research/027-xce-research-based-refinement-pt-02/research.md`
<!-- /ANCHOR:cross-refs -->
