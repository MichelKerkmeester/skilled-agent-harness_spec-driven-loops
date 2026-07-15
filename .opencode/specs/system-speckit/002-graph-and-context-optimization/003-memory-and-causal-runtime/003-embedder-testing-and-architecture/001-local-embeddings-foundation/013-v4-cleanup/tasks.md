---
title: "Tasks: Phase 13 - v4 Cleanup"
description: "Task list for Voyage guard timing, dtype health visibility, doc currency, dtype factory options, mutable default fix, and validation."
trigger_phrases:
  - "013 v4 cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup"
    last_updated_at: "2026-05-13T09:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed T001-T015 pending final validation evidence"
    next_safe_action: "Run shared build and parent validation"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140130c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-013-v4-cleanup-2026-05-13"
      parent_session_id: "014-012-v3-remediation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13 - v4 Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Code

- [x] T001 Read v4 finding scope and target files
- [x] T002 Add early Voyage shadow guard to `getStartupEmbeddingProfile` (`factory.ts`)
- [x] T003 Add early Voyage shadow guard to startup config/API validation entry points (`factory.ts`)
- [x] T004 Add `dtype` to provider metadata and hf-local metadata output (`types.ts`, `hf-local.ts`)
- [x] T005 Add `dtype` to `memory_health` embeddingProvider response (`memory-crud-health.ts`, `memory-crud-types.ts`)
- [x] T006 Add `dtype?: HfLocalDtype` to provider options and pass through to hf-local (`types.ts`, `factory.ts`)
- [x] T007 Replace mutable list default in `SearchResult.rankingSignals` (`protocol.py`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Docs

- [x] T008 Update 012 scratch patch status to resolved in 42aa114e3
- [x] T009 Update 012 implementation/spec/plan/tasks shipped-state language
- [x] T010 Update parent handover from 11/in-progress/3 commits to 12/complete/4 commits
- [x] T011 Replace q8 filename examples with runtime slug in Setup A docs
- [x] T012 Record `.codex/config.toml` note patch in 013 scratch because direct write is blocked
- [x] T013 Change tcpdump Qwen comment to EmbeddingGemma
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Create 013 Level-1 packet docs and metadata
- [x] T015 Register 013 in parent graph metadata
- [x] T016 Rebuild shared and MCP server dist
- [x] T017 Verify dist/source evidence for early guard, dtype, and mutable default
- [x] T018 Strict-validate 014 parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Shared TypeScript build and MCP server build exit 0
- [x] Dist/source greps show the requested fixes
- [x] Parent strict validation exits 0 errors / 0 warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross References

- Parent packet: `../spec.md`
- v4 findings: `../review/review-report-v4.md`
- Predecessor: `../012-v3-remediation/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
