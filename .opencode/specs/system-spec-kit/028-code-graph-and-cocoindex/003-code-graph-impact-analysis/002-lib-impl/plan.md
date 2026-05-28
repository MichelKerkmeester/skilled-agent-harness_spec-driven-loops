---
title: "Implementation Plan: 027/004/002 Impact Analysis Library"
description: "Plan for deterministic impact-analysis library implementation."
trigger_phrases:
  - "027 004 002 lib impl plan"
  - "impact library plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 002-lib-impl"
    next_safe_action: "Implement this child phase when its dependencies are available"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/004/002 Impact Analysis Library

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit code graph MCP server |
| **Storage** | Existing code graph SQLite tables |
| **Testing** | Vitest fixtures in `004-test` |

This child implements the deterministic analyzer that computes file-level risk signals and scores.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-contract` is available.
- [ ] `027/002/002-lib-impl` availability checked.

### Definition of Done
- [ ] Analyzer conforms to contract.
- [ ] Five risk signals are implemented.
- [ ] Traversal cap and visited set are implemented.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure deterministic library with DB helper adapters.

### Key Components
- `analyzeImpact()`
- File-node aggregation helpers.
- Risk signal calculators.
- Normalizers and scoring constants.

### Data Flow
Changed files resolve to graph nodes, affected files are gathered from existing impact surfaces, file-level signals are computed, and risk scores are returned with heuristic labels.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract types.
- [ ] Identify existing graph helper APIs.

### Phase 2: Core Implementation
- [ ] Implement file aggregation.
- [ ] Implement five signals.
- [ ] Implement normalizers, score formula, and traversal.

### Phase 3: Verification
- [ ] Run Vitest fixtures from `004-test`.
- [ ] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Aggregation, signals, scoring, traversal | Vitest |
| Integration | Existing impact-mode extension | Vitest |
| Validation | Child packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Internal child | Pending | Cannot implement stable output. |
| `027/002/002-lib-impl` | Cross-packet | Pending | Layer fallback remains unavailable/null. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the analyzer module and any optional integration hooks, then re-run checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Core Implementation |
| Core Implementation | Setup, `027/002/002-lib-impl` | Verification |
| Verification | Core Implementation | Handler and release readiness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | High | 3-4 hours |
| Verification | Medium | 1-2 hours |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migration is involved. Revert analyzer code and integration call sites.
<!-- /ANCHOR:enhanced-rollback -->
