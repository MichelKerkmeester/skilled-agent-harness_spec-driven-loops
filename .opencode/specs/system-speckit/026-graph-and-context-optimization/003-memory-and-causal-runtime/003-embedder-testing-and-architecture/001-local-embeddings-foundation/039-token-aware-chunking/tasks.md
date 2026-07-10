---
title: "Tasks: Token-Aware Chunking for LlamaCppProvider"
description: "Task list for adding tokenizer-budget truncation to the llama-cpp embedding provider and validating the 039 packet."
trigger_phrases:
  - "039 token-aware chunking tasks"
  - "llama-cpp token budget tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Completed provider patch and targeted verification"
    next_safe_action: "Manual stage and commit"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-039-token-aware-chunking"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Token-Aware Chunking for LlamaCppProvider

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

Investigation already done.

- [x] T001 Confirm the live overflow occurs after normalization and before retry-manager can inspect the provider error.
- [x] T002 Confirm the existing character cap remains valuable as a first-pass provider-neutral guard.
- [x] T003 Confirm the scoped fix is limited to `llama-cpp.ts`, a new test file, and the 039 packet docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extend `LlamaModel` with `trainContextSize`, `tokenizer.tokenize`, and `detokenize`.
- [x] T005 Extend `LlamaCppRuntimeState` with `tokenBudget` and `contextSize`.
- [x] T006 Change `loadRuntime` to create an auto embedding context bounded by `trainContextSize`.
- [x] T007 Compute and store `tokenBudget = Math.floor(trainContextSize * 0.9)`.
- [x] T008 Add tokenizer truncation after semantic chunking and before `getEmbeddingFor`.
- [x] T009 Add a minimal `__llamaCppTestables` seam for runtime injection and loader verification.
- [x] T010 Add T030-01 through T030-04 in `llama-cpp-token-budget.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit`.
- [x] T012 Run `npx vitest run tests/llama-cpp-token-budget.vitest.ts`.
- [x] T013 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking --strict`.
- [B] T014 Stage only the 039 packet, provider file, and new 030 test file. Blocked by `.git/index.lock` EPERM.
- [B] T015 Commit `fix(039): token-aware llama-cpp truncation (bug-B)` on `main`. Blocked by `.git/index.lock` EPERM.
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
