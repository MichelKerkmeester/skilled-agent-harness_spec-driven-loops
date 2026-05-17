---
title: "Tasks: 016/001 EmbedderAdapter interface + EmbedderRegistry"
description: "Numbered checklist for the foundational types phase."
trigger_phrases: ["016/001 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-embedder-adapter-interface"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks stub"
    next_safe_action: "Native Claude @code picks up T1.1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-001-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/001 EmbedderAdapter interface + EmbedderRegistry

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` = completed | `[ ]` = pending | `[~]` = partial


<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [ ] T0.1: Read existing `mcp_server/lib/search/` for current embedder call sites (read-only)
- [ ] T0.2: Sketch interface signatures + types
- [ ] T0.3: Confirm directory `mcp_server/lib/embedders/` doesn't already exist


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [ ] T1.1: Write `adapter.ts` with `EmbedderAdapter` interface + TSDoc
- [ ] T1.2: Write `types.ts` with `BackendKind` + `EmbedderManifest`
- [ ] T1.3: Write `registry.ts` with 6 skeleton manifest entries
- [ ] T1.4: Write `index.ts` barrel
- [ ] T1.5: Write `tests/embedder-registry.vitest.ts` (hit/miss/all-6)


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [ ] T2.1: `npx vitest run tests/embedder-registry.vitest.ts` pass
- [ ] T2.2: `npm run build` clean
- [ ] T2.3: `npx tsc --noEmit` clean
- [ ] T2.4: strict-validate 016/001 exit 0
- [ ] T2.5: Commit + push: `feat(spec-kit/mcp_server): EmbedderAdapter interface + Registry (016/001)`


<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- 4 new files in `mcp_server/lib/embedders/` + 1 vitest
- All P0 + P1 requirements met
- Ready for phase 002 to start implementing Ollama adapter


<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Parent: `016-embedder-testing-and-architecture/spec.md`
- Next phase: `002-ollama-backend-and-multi-dim-schema/`

<!-- /ANCHOR:cross-refs -->

