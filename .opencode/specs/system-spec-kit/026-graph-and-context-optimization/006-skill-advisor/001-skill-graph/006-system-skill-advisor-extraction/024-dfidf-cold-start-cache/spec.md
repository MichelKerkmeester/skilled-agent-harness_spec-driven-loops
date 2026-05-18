---
title: "Feature Specification: DFIDF cold start cache"
description: "Adds a persisted advisor DF/IDF corpus cache keyed by graph-metadata source mtimes so unchanged cold-start corpus stats can be reused."
trigger_phrases:
  - "018 dfidf follow-on"
  - "dfidf cold start cache"
  - "corpus stats cache"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/024-dfidf-cold-start-cache"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "DFIDF cold start cache implemented"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: DFIDF cold start cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Spec Folder** | `024-dfidf-cold-start-cache` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor corpus DF/IDF module computed document frequencies and IDF values from the provided corpus every time. No persisted cache existed under advisor database scope, so unchanged cold starts had no reusable side-file.

### Purpose
Persist corpus stats behind an explicit cache API and invalidate when graph-metadata mtimes change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `computeCorpusStatsCached()` to the corpus DF/IDF module.
- Persist cache files under advisor database scope by default.
- Add cache-hit and mtime-invalidation tests.

### Out of Scope
- Changing scorer lane weights.
- Changing IDF math or corpus eligibility policy.
- Adding a daemon migration beyond this cache side-file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts` | Modify | Add persisted cache API and optional updater cache integration. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/cache/df-idf-cache.vitest.ts` | Create | Cover cache reuse and mtime invalidation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Corpus stats can be persisted and reused. | Second call with matching graph-metadata mtimes returns cache hit and same stats. |
| REQ-002 | Source changes invalidate the cache. | Changing graphMetadataMtimeMs changes the source key and rewrites the cache. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-900 | Preserve public advisor identities. | No tool-id, server-id, or skill-id rename is introduced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cache file writes under advisor database scope by default.
- **SC-002**: Matching mtimes reuse persisted stats.
- **SC-003**: Changed mtimes invalidate persisted stats.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cache key could ignore source changes. | Stale IDF values. | Include skill id, source path, normalized terms, and graph-metadata mtime in the source key. |
| Risk | Cache write could fail in missing directories. | Cold start throws. | Create the database directory before atomic rename. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-01**: IDF math remains byte-for-byte compatible on cache miss.
- **NFR-02**: Cache failures are isolated to the explicit cached API.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **EC-01**: Missing cache returns miss.
- **EC-02**: Corrupt cache returns miss.
- **EC-03**: Archive/future documents still follow the existing eligibility predicate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Small, scoped surfaces with targeted tests. |
| Risk | 14/25 | Runtime bridge and metadata paths require focused validation. |
| Research | 8/20 | Audit driven from packet 018 and current source. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for new follow-on packets.
<!-- /ANCHOR:questions -->
