---
title: "Tasks: 010/004 writer cross-wire"
description: "Tasks for skill-graph-db writer refactor"
trigger_phrases:
  - "010/004 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/004-skill-graph-db-writer-cross-wire"
    last_updated_at: "2026-05-18T00:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "T001 — read refreshSkillEmbeddings"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010004"
      session_id: "010-004-writer-cross-wire-tasks"
      parent_session_id: "010-004-writer-cross-wire-spec"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 010/004 Writer Cross-Wire

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-read `refreshSkillEmbeddings()` in `lib/skill-graph/skill-graph-db.ts:769`; understand warning/skipped/embedded counters
- [ ] T002 Confirm `getAdapter` / `getActiveEmbedder` / `vecTableNameForDim` / `ensureVecTableForDim` exports from `lib/embedders/index.ts` barrel
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add dispatch at top of `refreshSkillEmbeddings()`: `if (hasActiveEmbedderPointer(database)) { ... } else { ...existing legacy... }`
- [ ] T004 New branch — embed via `getAdapter(active.name).embed([text], {inputType: 'document'})`; write to `vec_<active.dim>` via INSERT OR REPLACE (skill_id PK, embedding BLOB, model_id, content_hash, updated_at)
- [ ] T005 Update JSDoc on `refreshSkillEmbeddings()` explaining the dual-path behavior + active-pointer flag
- [ ] T006 Run `cd .opencode/skills/system-skill-advisor/mcp_server && npm run build` — must compile clean
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Author `tests/skill-graph/refresh-roundtrip.vitest.ts`:
  - Setup: in-memory DB; set active embedder to jina-embeddings-v3 @ 1024 (or other ollama manifest); seed 2-3 skill_nodes rows with non-null `source_path`
  - Act: call `refreshSkillEmbeddings()`
  - Assert: `loadSkillEmbeddings()` returns rows with `embedding.length === 1024` + non-empty bytes + matching modelId
- [ ] T008 Run `npx vitest run tests/skill-graph/refresh-roundtrip.vitest.ts` — must pass
- [ ] T008b Run full skill-advisor test suite; document any new failures vs task #49 baseline
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation + Commit

- [ ] T009 Update `implementation-summary.md` (what built, decisions, verification, limitations)
- [ ] T010 Strict-validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/004-skill-graph-db-writer-cross-wire/ --strict`
- [ ] T011 Strict-scope commit (`git restore --staged .` then `git add` only the changed files + new test + packet folder)
- [ ] T012 Update 010/002 `implementation-summary.md` `_memory.continuity.blockers` to remove "depends on 010/004" + mark dependency RESOLVED
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## Phase 5: Post-Implementation Deep-Review

- [ ] T013 Dispatch 5-iter cli-devin SWE-1.6 deep-review (single-commit tier — per `post-implementation-deep-review.md`)
  - Loop manager: native Opus Agent
  - Iter worker: cli-devin SWE-1.6 with `--agent-config .opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json`
  - Dimensions: correctness, regression-risk, error-handling, observability, architecture-fit
- [ ] T014 Process verdict:
  - PASS → close 010/004 done
  - PASS-advisories → close + file P2 backlog
  - CONDITIONAL → dispatch remediation; max 2 cycles
  - FAIL → escalate
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:completion -->
## Completion Criteria

14 tasks `[x]`. Test passes. Strict-validate 0 errors. Deep-review verdict ≥ PASS-advisories. 010/002 unblocked.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent umbrella: `../spec.md`
- Upstream dep: `../001-pluggable-architecture/` (010/001 SHIPPED)
- Unblocks: `../002-jina-swap-and-reindex/` (010/002 PARTIAL — waiting on this)
- E review surfacing this gap: `../001-pluggable-architecture/review/review-report.md` §4 P1-1
<!-- /ANCHOR:cross-refs -->
