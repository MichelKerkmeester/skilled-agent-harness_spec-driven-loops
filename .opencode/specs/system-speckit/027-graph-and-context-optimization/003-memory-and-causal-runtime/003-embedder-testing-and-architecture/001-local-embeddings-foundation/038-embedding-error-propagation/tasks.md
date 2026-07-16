---
title: "Tasks: Embedding Provider Error Propagation"
description: "Task list for rethrowing real embedding provider failures, preserving intentional degraded fallback wrappers, and validating retry-manager failure_reason behavior."
trigger_phrases:
  - "038 embedding error propagation tasks"
  - "retry-manager failure_reason masking tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation"
    last_updated_at: "2026-05-14T14:45:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Completed implementation and targeted verification"
    next_safe_action: "Manual stage and commit"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-038-embedding-error-propagation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Embedding Provider Error Propagation

<!-- SPECKIT_LEVEL: 1 -->

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

Investigation already done except the reconsolidation receiver check, which must be read before editing that caller.

- [x] T001 Confirm `shared/embeddings.ts` single wrappers swallow provider throws as null.
- [x] T002 Confirm retry-manager's provider-error catch is dead while facade returns null.
- [x] T003 Identify the four degraded-fallback wrappers and seven pass-through callers.
- [x] T004 Read reconsolidation similarity callback receiver and record the wrapper decision.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Change single embedding wrapper catches to rethrow real provider errors.
- [x] T006 Preserve batch null-array semantics and add verbose error-count logging.
- [x] T007 Leave reconsolidation callback pass-through because the receiver catches.
- [x] T008 Add one top-level stage1 candidate-generation fallback catch.
- [x] T009 Add two eval-reporting query fallback wrappers.
- [x] T010 Add one run-ablation query fallback wrapper.
- [x] T011 Add T029-01 through T029-04 to `embeddings.vitest.ts`.
- [x] T012 Add T45d to `retry-manager.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit`.
- [x] T014 Run requested targeted Vitest group.
- [x] T015 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation --strict`.
- [B] T016 Stage only the scoped 029 files if git index access is available. Blocked by `.git/index.lock` EPERM.
- [B] T017 Commit `fix(038): propagate embedding provider errors (bug-A)` if git index access is available. Blocked by `.git/index.lock` EPERM.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [x] Typecheck, targeted Vitest, and strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
