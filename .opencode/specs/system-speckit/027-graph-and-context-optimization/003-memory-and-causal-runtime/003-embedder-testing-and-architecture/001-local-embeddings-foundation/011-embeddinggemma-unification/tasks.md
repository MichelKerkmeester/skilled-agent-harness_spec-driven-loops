---
title: "Tasks: Phase 11 - EmbeddingGemma Unification"
description: "Task list for source defaults, Qwen purge, prior-packet updates, dist rebuild, and strict validation."
trigger_phrases:
  - "011 embeddinggemma unification"
  - "EmbeddingGemma default both surfaces"
  - "Qwen3 purge"
  - "google embeddinggemma cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification"
    last_updated_at: "2026-05-13T07:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "All edits shipped + .codex/config.toml fixed by main agent"
    next_safe_action: "Use 012 for v3 remediation follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140110c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-011-embeddinggemma-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered existing 014/011"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11 - EmbeddingGemma Unification

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

- [x] T001 Inspect 010 packet docs as Level-1 templates
- [x] T002 Confirm `shared.py:_QUERY_PROMPT_MODELS` already includes `google/embeddinggemma-300m: InstructionRetrieval`
- [x] T003 Record main-agent prior work: live global YAML updated outside repo scope
- [x] T004 Record main-agent prior work: stale DB delete + daemon restart already done outside 011 scope
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update `cocoindex_code/config.py` default to `sbert/google/embeddinggemma-300m`
- [x] T006 Update `cocoindex_code/settings.py` default user settings to `google/embeddinggemma-300m` / `sentence-transformers`
- [x] T007 Update `hf-local.ts` default model to `onnx-community/embeddinggemma-300m-ONNX`
- [x] T008 Update `factory.ts` provider default + metadata fallback to ONNX Gemma
- [x] T009 Update OpenCode/MCP/Claude/Gemini runtime notes
- [x] T010 Update `.codex/config.toml` runtime notes (main agent patched outside prior sandbox)
- [x] T011 Update `.env.example` active examples
- [x] T012 Update parent + prior packet docs
- [x] T013 Purge active Qwen3 references outside allowed historical exceptions
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rebuild shared dist: `cd .opencode/skills/system-spec-kit/shared && npx tsc --build`
- [x] T015 Strict validate 011 and every updated packet, then parent recursive strict validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-blocked tasks complete
- [x] Codex config blocker resolved or documented in `scratch/blocker.md`
- [x] Strict validation commands recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessors**: `../004-vec-store-rebuild/implementation-summary.md`, `../009-cocoindex-ipc-fix/implementation-summary.md`, `../010-cocoindex-code-only-patterns/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
