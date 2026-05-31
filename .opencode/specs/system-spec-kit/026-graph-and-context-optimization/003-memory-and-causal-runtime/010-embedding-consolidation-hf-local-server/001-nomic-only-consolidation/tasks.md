---
title: "Tasks: Consolidate local embedding models to nomic only"
description: "Implementation task tracker for nomic-only local embedding registry, dimension, provider, and docs cleanup."
trigger_phrases:
  - "nomic only embedding tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-embedding-consolidation-hf-local-server/001-nomic-only-consolidation"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored task list for nomic-only local embedding consolidation"
    next_safe_action: "Start T001 inventory before scoped implementation"
    blockers: []
    key_files:
      - "shared/embeddings/registry.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000293"
      session_id: "029-001-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Consolidate local embedding models to nomic only

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

- [x] T001 Inventory active local model mentions and exclude `benchmarks/**` plus historical fixtures (`shared`, docs)
- [x] T002 Identify the existing dimension-validation branch that rejects registry-absent local models (`shared/embeddings/factory.ts`)
- [x] T003 [P] Confirm voyage/openai `CLOUD_CANONICAL` entries and cloud fallback paths are out of scope (`shared/embeddings/registry.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reduce `registry.ts` local MANIFESTS to only `nomic-ai/nomic-embed-text-v1.5`; keep canonical fallback nomic for `hf-local` and `ollama` (`shared/embeddings/registry.ts`) [REQ-001]
- [x] T005 Reduce `VALID_PROVIDER_DIMENSIONS` local maps to nomic-only dimension 768 (`shared/embeddings/factory.ts`) [REQ-002]
- [x] T006 Add graceful unknown-model handling so absent explicit local overrides use runtime-derived dimension instead of hard-failing (`shared/embeddings/factory.ts`) [REQ-003]
- [x] T007 Trim local model-menu mentions while preserving fallback-derived `DEFAULT_MODEL` (`providers/ollama.ts`, `providers/hf-local.ts`, `profile.ts`, `types.ts`) [REQ-004]
- [x] T008 Update active docs to nomic-only guidance and remove stale `embeddinggemma-300m` examples (`ENV_REFERENCE.md`, `INSTALL_GUIDE.md`, `README.md`, provider/vector READMEs; `.env.example` already nomic-clean) [REQ-005/008]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add or update focused coverage for unlisted explicit local model runtime dim derivation [REQ-007]
- [x] T010 Run TypeScript compile for affected workspace
- [x] T011 Run embeddings-focused vitest (79 passed / 8 skipped / 0 failed across 8 files)
- [x] T012 Grep active guidance for removed local model names, documenting intentional historical exclusions [SC-001/SC-002]
- [x] T013 Confirm cloud provider canonical entries and behavior are unchanged [REQ-006]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete (T004-T008)
- [x] No `[B]` blocked tasks remaining
- [x] TypeScript + embeddings vitest green; cloud providers unaffected; unknown local override derives runtime dim
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
