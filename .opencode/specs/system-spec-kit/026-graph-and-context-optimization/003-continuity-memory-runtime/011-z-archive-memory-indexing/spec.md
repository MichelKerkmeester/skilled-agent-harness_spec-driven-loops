---
title: "026/003/011: z_archive memory indexing fix"
description: "Un-exclude z_archive from memory index. ARCHIVE_MULTIPLIERS already penalizes z_archive content with multiplier 0.1 in scoring; the redundant EXCLUDED_FOR_MEMORY block contradicts that decay design by removing archived content from the index entirely."
trigger_phrases:
  - "026/003/011 spec"
  - "z_archive indexing"
  - "memory exclusion fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/011-z-archive-memory-indexing"
    last_updated_at: "2026-05-16T12:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet 113"
    next_safe_action: "Patch index-scope.ts and rebuild dist"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000113"
      session_id: "113-spec-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Scope: z_archive only; z_future + external stay excluded"
      - "Decay: z_archive keeps existing ARCHIVE_MULTIPLIERS 0.1 multiplier"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 026/003/011: z_archive memory indexing fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Target Level | 1 |
| Priority | P1 |
| Status | In Progress |
| Created | 2026-05-16 |
| Branch | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two subsystems disagree about z_archive's role in the memory index. `lib/utils/index-scope.ts:EXCLUDED_FOR_MEMORY` blocks `z_archive/` paths from being indexed at all, while `shared/scoring/folder-scoring.ts:ARCHIVE_MULTIPLIERS` defines an explicit decay multiplier of 0.1 (90% penalty) for `z_archive/` to deprioritize but retain it in search rankings. The exclusion overrides the decay design — archived spec content is invisible to memory search even when its decay-adjusted relevance would otherwise place it ahead of newer noise. Un-exclude z_archive so the decay system operates as designed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY` in `index-scope.ts`
- Rebuild `mcp_server` dist
- Run `node cli.js reindex --force` to populate z_archive into the index
- Verify z_archive rows appear in `memory_index` and search results carry the 0.1 multiplier

### Out of Scope
- z_future un-exclusion (operator deferred)
- external/ un-exclusion (vendor code, stays out)
- Code graph z_archive policy (separate semantics, no decay multiplier present)
- `cleanup-index-scope-violations.ts` policy refresh (it imports `shouldIndexForMemory()` so it inherits the fix automatically)

### Files to Change

| Path | Change | Description |
|------|--------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Modify | Remove z_archive from EXCLUDED_FOR_MEMORY |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/utils/index-scope.js` | Rebuild | Compiled artifact |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | z_archive paths pass `shouldIndexForMemory()` | Returns true for `*/z_archive/*` paths under `.opencode/specs/` |
| REQ-002 | z_future + external still excluded | Returns false for `*/z_future/*` and `*/external/*` |
| REQ-003 | z_archive rows present in memory_index after reindex | At least 1 row from a z_archive path |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Decay multiplier still applied in folder scoring | `getArchiveMultiplier(z_archive_path)` returns 0.1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: index-scope.ts compiled change deployed
- **SC-002**: At least 1 z_archive row indexed
- **SC-003**: Decay multiplier verified via stats / search ranking
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | ~1100 z_archive dirs add ~5000 rows to memory_index | Low | Decay multiplier 0.1 keeps them out of top results unless query is highly specific |
| Risk | Search relevance regression if decay isn't applied | Med | Verify post-reindex with a sample query for an archived packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope confirmed by operator.
<!-- /ANCHOR:questions -->
