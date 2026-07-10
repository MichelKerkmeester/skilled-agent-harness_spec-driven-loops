---
title: "Tasks: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default"
description: "Task list for ADR-014 (local-first cascade) — Phase 1 code + test, Phase 2 doc sweep, Phase 3 verify."
trigger_phrases:
  - "016/002/015 tasks"
  - "adr-014 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default"
    last_updated_at: "2026-05-19T08:10:00Z"
    last_updated_by: "fresh_opus_agent"
    recent_action: "Rewrote tasks.md to canonical Level 1 template structure"
    next_safe_action: "Re-run strict-validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002015"
      session_id: "016-002-015"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read auto-select.ts §2 constants + selectWithoutPersistence sequence (`.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts`)
- [x] T002 Read vitest order assertion (`.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts:158`)
- [x] T003 Confirm HF_LOCAL_MODEL already updated to `nomic-ai/nomic-embed-text-v1.5` (partial-shipped at scaffold)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reorder `sequence` tuple list to `[ollama, hf-local, openai, voyage]` with ADR-014 inline comment (`.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts`)
- [x] T005 Update vitest regex `/voyage:.*openai:.*ollama:.*hf-local:/i` → `/ollama:.*hf-local:.*openai:.*voyage:/i` (`.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts:158`)
- [x] T006 [P] Update INSTALL_GUIDE.md cascade + recommended new-user setup (`.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`)
- [x] T007 [P] Update opencode.json mk-spec-memory env notes (`opencode.json`)
- [x] T008 [P] Update .claude/mcp.json mk-spec-memory env notes (`.claude/mcp.json` — `.mcp.json` symlink target)
- [x] T009 [P] Update system-spec-kit README cascade + new-user setup (`.opencode/skills/system-spec-kit/README.md`)
- [x] T010 [P] Update mcp_server README cascade + new-user setup (`.opencode/skills/system-spec-kit/mcp_server/README.md`)
- [x] T011 [P] Update embedder_architecture.md tier table + supersession note (`.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`)
- [x] T012 [P] Update embedding_resilience.md probe sequence + fallback table (`.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md`)
- [x] T013 [P] Add ADR-014 cascade section to embedder-pluggability.md (`.opencode/skills/system-spec-kit/references/embedder-pluggability.md`)
- [x] T014 [P] Update ENV_REFERENCE.md §15 EMBEDDING cascade prose (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
- [x] T015 Append ADR-014 to bake-off decision record (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 `npm run typecheck` in `.opencode/skills/system-spec-kit/scripts/` → PASS
- [x] T017 `npm run build` → PASS
- [ ] T018 `vitest run embedder-auto-selection.vitest.ts` → environmental SIGSEGV on Node v25.6.1 with non-TTY stdout (affects ALL vitest invocations including the known-good `test:task-enrichment`; pre-existing flake, NOT introduced by this packet)
- [x] T019 `validate.sh <packet> --strict` → PASS
- [x] T020 `grep -rn "voyage > openai > ollama\|Voyage > OpenAI > Ollama\|voyage.*openai.*ollama.*hf-local" .opencode/` → 0 hits outside this packet's own historical spec.md PROBLEM section
- [x] T021 Implementation-summary.md filled with status / what-built / how-delivered / decisions / verification + Commit Handoff
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-vitest tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Strict-validate PASS recorded with evidence
- [x] T018 vitest gap documented in implementation-summary.md "Verification" + "Known Limitations" with the environmental SIGSEGV cause
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **ADR target**: `../004-spec-memory-embedder-bake-off/decision-record.md` (ADR-014 appended after ADR-013)
- **Sibling phase 007 (auto-embedder mechanism)**: `../007-auto-embedder-selection-and-llama-cpp-purge/`
<!-- /ANCHOR:cross-refs -->
