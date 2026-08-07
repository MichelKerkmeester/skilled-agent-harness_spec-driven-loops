---
title: "Tasks: 016/002/020 Embedder Default Drift Fix"
description: "12 ordered tasks (all complete) — helper authoring + 5 refactors + test + 5 verifications."
trigger_phrases:
  - "020 tasks helper + refactors"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix"
    last_updated_at: "2026-05-23T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "All 12 tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000020a2"
      session_id: "016-002-020-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All tasks shipped in a single execution session 2026-05-23 ~11:00 UTC"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 016/002/020 Embedder Default Drift Fix

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete | `[ ]` pending
- `[T###]` task id | `[P#]` priority (P0 = critical)
- All tasks COMPLETED in single execution session (2026-05-23 ~11:00 UTC)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] [T001] [P0] Verify the 5 hardcoded-default sites still exist via `rg "DEFAULT.*['\"]BAAI/bge-base|DEFAULT.*['\"]jina-embeddings-v3"`. Confirm `MANIFESTS[0].name === 'nomic-embed-text-v1.5'` in `shared/embeddings/registry.ts`.
- [x] [T002] [P0] Read `shared/predicates/boolean-expr.test.ts` for the standalone-assertion test convention (no Vitest in `shared/`).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Helper authoring

- [x] [T003] [P0] Append `CanonicalProvider` type, `EmbedderNotConfiguredError` class, frozen `CLOUD_CANONICAL` table, and `getCanonicalFallback(provider)` function to `shared/embeddings/registry.ts` after the existing `MANIFESTS` export. Doc-comment cites ADR-013/014.
- [x] [T004] [P0] Export `EmbedderNotConfiguredError` and `CanonicalProvider` from `registry.ts`.

### 5 hardcoded-default refactors

- [x] [T005] [P0] `shared/embeddings.ts:873` — replace `DEFAULT_MODEL_NAME = '...'` with `getCanonicalFallback('hf-local')`. Add `import { getCanonicalFallback } from './embeddings/registry.js'`.
- [x] [T006] [P0] `shared/embeddings/providers/hf-local.ts:13` — replace `DEFAULT_MODEL = '...'` with `getCanonicalFallback('hf-local')`. Add `import { getCanonicalFallback } from '../registry.js'`.
- [x] [T007] [P0] `shared/embeddings/providers/ollama.ts:14` — replace `DEFAULT_MODEL = 'jina-embeddings-v3'` (BUG) with `getCanonicalFallback('ollama')`. Add `import { getCanonicalFallback } from '../registry.js'`.
- [x] [T008] [P0] `shared/embeddings/factory.ts:143-148` — refactor `DEFAULT_PROVIDER_MODELS` to derive each of the 4 entries from `getCanonicalFallback(provider)`. Wrap in `Object.freeze({...})`. Add `import { getCanonicalFallback } from './registry.js'`.
- [x] [T009] [P0] `mcp_server/lib/embedders/sidecar-worker.ts:68` — replace `DEFAULT_MODEL = '...'` with `getCanonicalFallback('hf-local')`. Add `import { getCanonicalFallback } from '@spec-kit/shared/embeddings/registry'`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] [T010] [P0] Create `shared/embeddings/registry.test.ts` with 23 invariant assertions (MANIFESTS non-empty; ADR consensus name=nomic-embed-text-v1.5, dim=768, backend=ollama; helper contract for all 4 providers; regression guard against 3 banned legacy strings; EmbedderNotConfiguredError class).
- [x] [T011] [P0] Run `npm run typecheck:root` from `.opencode/skills/system-spec-kit/` → exit 0.
- [x] [T012] [P0] Run `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` → 23/23 ok, exit 0.
- [x] [T013] [P0] `rg "DEFAULT.*['\"]BAAI/bge-base" .opencode/skills/system-spec-kit/` → 0 hits.
- [x] [T014] [P0] `rg "DEFAULT.*['\"]jina-embeddings-v3" .opencode/skills/system-spec-kit/` → 0 hits.
- [x] [T015] [P0] Strict-validate this packet → PASS.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All P0 tasks complete. Helper, refactors, and test all shipped in a single execution session. Spec strict-validate gates Phase A2 final verification.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md §4 REQUIREMENTS — R1–R10 map 1:1 to tasks T001–T015.
- plan.md §4 IMPLEMENTATION PHASES — phase ordering matches.
- checklist.md — each CHK-### references a T### that produced its evidence.
- implementation-summary.md — final-state table summarizes shipped outcome.
- decision-record.md — ADR-001 (Shape C), ADR-002 (cloud-canonical exclusion), ADR-003 (test convention).
<!-- /ANCHOR:cross-refs -->
