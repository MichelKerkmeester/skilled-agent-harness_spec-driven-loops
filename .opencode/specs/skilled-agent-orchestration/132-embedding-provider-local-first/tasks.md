---
title: "Task Breakdown: Embedding Provider Local-First Resolution"
description: "Task list for the resolveProvider local-first reorder, cascade-trigger update, dead-helper removal, and stale-fixture repair."
trigger_phrases:
  - "embedding local-first tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-embedding-provider-local-first"
    last_updated_at: "2026-06-02T21:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All implementation + test tasks complete; gate green"
    next_safe_action: "Metadata + validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "embedding-localfirst-session"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Embedding Provider Local-First Resolution

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Trace all three provider-order definitions — auto-select.ts, getCascadeFallbackOrder (local-first); resolveProvider (cloud-first)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-02 Remove auto-mode voyage/openai branches from resolveProvider — factory.ts diff (-46 lines)
- [x] T-03 Correct resolveProvider precedence docstring — local-first docstring
- [x] T-04 Remove dead isPlaceholderKey helper — `rg isPlaceholderKey` → 0 refs
- [x] T-05 Add hf-local to createEmbeddingsProvider hard-failure cascade trigger (catch only, not warmup) — factory.ts:1112 region
- [x] T-06 Rewrite T513-01b/c/d to assert local-first; un-skip; drop packet-id comments — embeddings.vitest.ts
- [x] T-07 Repair stale fixtures: add vec_memories_rowids to createActiveNomicDb + createActiveOllamaDb — embedder-ollama + factory-auto-resolution
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Confirm failures pre-existing (stash factory, rebuild, re-run) — 2 fail identical against pristine factory
- [x] T-09 Rebuild shared/dist; run embedder gate — 6 files, 62 passed / 5 skipped / 0 failed
- [ ] T-10 description.json + graph-metadata.json
- [ ] T-11 validate.sh --strict → 0
- [ ] T-12 Commit explicit paths to main
- [ ] T-13 (deferred) daemon recycle to deploy live — batch with 015 .cjs restart decision
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation + test tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Embedder test gate passed (62 passed / 0 failed)
- [ ] Ship tasks (metadata, validate, commit) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
