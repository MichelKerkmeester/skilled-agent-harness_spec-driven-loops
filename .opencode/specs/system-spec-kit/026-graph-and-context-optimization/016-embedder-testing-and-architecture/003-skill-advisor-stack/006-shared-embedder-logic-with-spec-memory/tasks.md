---
title: "Tasks: shared embedder logic with spec-memory [template:level_1/tasks.md]"
description: "Open tasks for shared embedder factory alignment."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored open task list"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **Priority**: P0 blocks packet completion; P1 can be deferred only with operator approval
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read canonical mk-spec-memory embedder files (`adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts`). | `[x]` | Read 2026-05-21 |
| T002 | P0 | Read current skill-advisor embedder layer + `schema.ts` + `skill-graph-db.ts` writer dispatcher. | `[x]` | Read 2026-05-21 |
| T003 | P0 | Confirm `@spec-kit/shared` workspace alias is already wired in both skills' package.json + tsconfig.json. | `[x]` | Confirmed via exploration |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Step 1: Copy `adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts` to `shared/embeddings/`. Promote skill-advisor's wider interface. | `[ ]` | Planned |
| T005 | P0 | Step 1: Convert both skills' local `lib/embedders/{adapter,types,registry,adapters/ollama}.ts` to thin re-export shims. | `[ ]` | Planned |
| T006 | P0 | Step 2: Delete `adapters/llama-cpp-baseline.ts` from skill-advisor. Remove `embeddinggemma-300m` manifest entry. | `[ ]` | Planned |
| T007 | P0 | Step 3: Add `contentType: 'text' \| 'code'` parameter (default `'text'`) to shared `auto-select.ts`. | `[ ]` | Planned |
| T008 | P0 | Step 3: Flip skill-advisor `DEFAULT_ACTIVE_EMBEDDER` to `{ name: 'auto', dim: 0 }`. Add `ensureActiveEmbedder()` helper. | `[ ]` | Planned |
| T009 | P0 | Step 4: Wire `advisor-server.ts` bootstrap to call `ensureActiveEmbedder()` then `refreshSkillEmbeddings()` if pointer just flipped. | `[ ]` | Planned |
| T010 | P0 | Step 5: Update skill-advisor `INSTALL_GUIDE.md` section 12 + `README.md` pluggable-layer subsection. | `[ ]` | Planned |
| T011 | P0 | Add `shared-factory-parity.vitest.ts` regression test. | `[x]` | Shipped in remediation commit — 9 cases covering MANIFESTS reference identity, manifest lookups, adapter shape parity for jina-v3 + nomic, listManifests/listSupportedDimensions identity, unknown-name + purged-baseline negative cases. |
| T012 | P0 | Add `ensure-active-embedder.vitest.ts` (cascade idempotency, pointer persistence, content-type parameter). | `[ ]` | Planned |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | Run `npm run typecheck` + `npm run build` in both `system-spec-kit/mcp_server` and `system-skill-advisor/mcp_server`. | `[ ]` | Planned |
| T014 | P0 | Run `npx vitest run` in both skills. Confirm existing `vi.mock('@spec-kit/shared/embeddings/factory')` calls still pass. | `[ ]` | Planned |
| T015 | P0 | Parity grep: `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma' .opencode/skills/system-skill-advisor/` returns empty. | `[ ]` | Planned |
| T016 | P0 | Run strict-validate on this packet folder. | `[ ]` | Planned |
| T017 | P1 | Live daemon smoke: cold start, observe pointer flip via sqlite3 probe, run 3 semantic-shadow queries, confirm sane top-3. | `[ ]` | Planned |
| T018 | P1 | Post-implementation 5-iter deep-review via cli-devin SWE-1.6 (scoped to cross-skill import boundary + cascade idempotency + pointer persistence + legacy-path correctness + INSTALL_GUIDE truth-check). | `[ ]` | Planned |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 rows above are `[x]`, implementation evidence is copied into `implementation-summary.md`, and strict validation exits 0 for the packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts`
<!-- /ANCHOR:cross-refs -->
