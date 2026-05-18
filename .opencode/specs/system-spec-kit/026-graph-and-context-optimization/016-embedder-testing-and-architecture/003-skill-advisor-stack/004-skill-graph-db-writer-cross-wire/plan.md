---
title: "Plan: 010/004 skill-graph-db writer cross-wire"
description: "Phases for refactoring refreshSkillEmbeddings to use EmbedderAdapter layer"
trigger_phrases:
  - "010/004 plan"
  - "writer cross-wire phases"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire"
    last_updated_at: "2026-05-18T00:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "T001"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010004"
      session_id: "010-004-writer-cross-wire-plan"
      parent_session_id: "010-004-writer-cross-wire-spec"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 010/004 Writer Cross-Wire

<!-- ANCHOR:summary -->
## 1. SUMMARY

Refactor `refreshSkillEmbeddings()` in `lib/skill-graph/skill-graph-db.ts` to use the new EmbedderAdapter layer when `hasActiveEmbedderPointer(db)` is true; preserve legacy code path when pointer is unset (backward compat for fresh installs). Ship round-trip test + 5-iter post-impl review.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Refactor correctness | New path dispatches via `hasActiveEmbedderPointer()` — falsy keeps legacy unchanged |
| Round-trip test | Set pointer → refresh → load → bytes match + dim matches; pass |
| Regression | Existing skill-advisor vitest suite passes |
| Strict-validate | PASSED (0 errors) |
| Post-impl deep-review | 5-iter cli-devin SWE-1.6 PASS or PASS-advisories |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
Before (010/001 + 010/002 shipped, half-wired):
  refreshSkillEmbeddings()
    ├─ createEmbeddingsProvider() [OLD factory]
    │   └─ supports voyage/openai/llama-cpp/hf-local (NO ollama)
    └─ writes to skill_nodes.embedding BLOB (legacy column)

After (010/004 shipped):
  refreshSkillEmbeddings()
    ├─ IF hasActiveEmbedderPointer(db):
    │   ├─ active = getActiveEmbedder(db)
    │   ├─ adapter = getAdapter(active.name) [NEW EmbedderAdapter layer]
    │   ├─ vector = await adapter.embed(text, {inputType: 'document'})
    │   └─ INSERT OR REPLACE INTO vec_<active.dim>
    │
    └─ ELSE (backward compat for fresh installs):
        ├─ provider = await createEmbeddingsProvider() [OLD factory]
        ├─ vector = await provider.embedDocument(text)
        └─ UPDATE skill_nodes SET embedding = ? (legacy)
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read + plan refactor
- T001: Re-read `refreshSkillEmbeddings()` (skill-graph-db.ts:769) + understand the warning/skipped/embedded counters
- T002: Confirm `getAdapter`/`getActiveEmbedder`/`vecTableNameForDim`/`ensureVecTableForDim` import path from `lib/embedders/`

### Phase 2: Implement
- T003: Add dispatch at top of `refreshSkillEmbeddings()`: `if (hasActiveEmbedderPointer(database)) { ... } else { ...existing... }`
- T004: New branch — embed via adapter + write to `vec_<active.dim>` (INSERT OR REPLACE with model_id + content_hash columns)
- T005: Update JSDoc explaining dual-path behavior
- T006: Run build (`npm run build`) — must compile

### Phase 3: Test
- T007: Author `tests/skill-graph/refresh-roundtrip.vitest.ts`:
  - Setup: in-memory DB, set active embedder via setActiveEmbedder(), seed 2-3 skill_nodes
  - Act: call refreshSkillEmbeddings()
  - Assert: loadSkillEmbeddings() returns rows with matching dim + non-empty bytes
- T008: Run new test + full suite

### Phase 4: Document + commit
- T009: Update `implementation-summary.md` with what built, key decisions, verification
- T010: Strict-validate packet
- T011: Strict-scope commit (`git restore --staged .` first)
- T012: Update 010/002 `implementation-summary.md` to mark 010/004 dependency RESOLVED

### Phase 5: Post-impl deep-review
- T013: Dispatch 5-iter cli-devin SWE-1.6 deep-review (single-commit tier per `post-implementation-deep-review.md`)
- T014: Process verdict (PASS-advisories or CONDITIONAL → remediate)
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Unit**: round-trip test (T007) — set pointer → refresh → load → assert bytes match
- **Regression**: existing skill-advisor vitest suite (avoid breaking known-passing tests; pre-existing failures from task #49 stay failing — don't gate on them)
- **Smoke**: optional — after commit, manually call refreshSkillEmbeddings via skill_advisor.py CLI + verify vec_1024 populated
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: 010/001 (pluggable layer) — SHIPPED at `ed5eb0e56`
- **Unblocks**: 010/002 swap execution
- **No new dependencies**: uses existing exports from `lib/embedders/`
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Round-trip test fails | Revert commit; investigate; re-attempt |
| Regression in vitest | Revert; check for column-rename or schema-shape mismatch |
| Production regression (semantic-shadow returns empty) | Revert; verify legacy path still triggers when pointer unset |
| Deep-review CONDITIONAL with P0 | Remediate per review-report.md §7; re-review |
<!-- /ANCHOR:rollback -->
