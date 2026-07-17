---
title: "Tasks: 022/001 profile.ts Fallback Fix"
description: "5 P0 tasks, all complete in single execution."
trigger_phrases:
  - "022/001 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix"
    last_updated_at: "2026-05-23T15:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "All 7 tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022b3"
      session_id: "016-002-022-001-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All tasks shipped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/001 profile.ts Fallback Fix

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete | `[ ]` pending
- `[T###]` task id | `[P#]` priority
- All shipped in single execution 2026-05-23 ~15:35 UTC
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] [T001] [P0] Read `profile.ts:185-200` + `embeddings.ts:770-780` context.
- [x] [T002] [P0] Confirm `getCanonicalFallback` is available in registry.ts (shipped by packet 020).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] [T003] [P0] Add `import { getCanonicalFallback, type CanonicalProvider } from './registry.js'` to profile.ts.
- [x] [T004] [P0] Replace 4 inline `||` literals in profile.ts:resolveActiveProfileModel (voyage/openai/ollama/hf-local) with `getCanonicalFallback(provider)` calls + add historical-context comment block.
- [x] [T005] [P0] Replace 3 inline `||` literals in embeddings.ts:detectConfiguredModelName (voyage/openai/ollama) with `getCanonicalFallback(provider)` calls. (hf-local already used DEFAULT_MODEL_NAME via packet 020.)
- [x] [T006] [P0] Create `shared/embeddings/profile.test.ts` with 7 standalone-assertion invariants (3 ban-list + 4 behavioral).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] [T007] [P0] `npm run typecheck:root` exit 0 — VERIFIED.
- [x] [T008] [P0] `node --experimental-vm-modules shared/dist/embeddings/profile.test.js` 7/7 ok — VERIFIED.
- [x] [T009] [P0] Ban-list grep for `BAAI/bge-base-en|jina-embeddings-v3` in production code returns 0 hits (comments + dim-lookups remain, both legitimate) — VERIFIED.
- [x] [T010] [P0] Strict-validate phase 001 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All P0 tasks complete. Phase 001 ships closing 3 P0 audit findings + bonus consistency on voyage/openai inline literals.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md §4 REQUIREMENTS R1–R8 map to T003–T010
- plan.md §4 IMPLEMENTATION PHASES match
- implementation-summary.md captures shipped state
<!-- /ANCHOR:cross-refs -->
