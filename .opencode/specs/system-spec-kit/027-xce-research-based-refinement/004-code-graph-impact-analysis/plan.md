---
title: "Implementation Plan: 027/004 Code Graph Impact Analysis"
description: "Plan for deterministic file-level impact scoring, reproducible normalizers, honest coverage evidence, and explicit enrichment provider options."
trigger_phrases:
  - "027 004 impact plan"
  - "code graph impact analysis plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-code-graph-impact-analysis"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned plan.md with manifest anchors and pt-02 scoring/provider amendments"
    next_safe_action: "Choose normalizer constants before implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Choose deterministic normalizer semantics."
    answered_questions:
      - "Default LLM enrichment provider is none."
---
# Implementation Plan: 027/004 Code Graph Impact Analysis

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | Existing code_graph SQLite tables |
| **Testing** | Vitest, `npm run check`, spec validator |

### Overview
Phase 004 adds deterministic impact analysis over the existing code graph. pt-02 tightened the design: all risk signals must aggregate symbol-level graph data to files, normalizers must be reproducible, TESTED_BY must be read in the incoming direction, and LLM enrichment must be explicit provider-configured optional behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Normalizer semantics selected.
- [ ] Coverage evidence output shape selected.
- [ ] Enrichment options contract documented.

### Definition of Done
- [ ] Deterministic output is complete with `provider: "none"`.
- [ ] File-level aggregation and TESTED_BY direction fixtures pass.
- [ ] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic analysis library plus MCP handler and optional provider adapter.

### Key Components
- **`code-graph-impact-analysis.ts`**: owns aggregation, normalizers, BFS, and scoring.
- **`handlers/impact-analysis.ts`**: owns MCP input validation and response envelope.
- **Optional provider adapter**: generates narrative only when explicit config is supplied.

### Data Flow
Changed files produce affected file candidates, each file aggregates all matching nodes and their incoming/outgoing edges, deterministic signals feed the risk formula, and optional enrichment adds narrative without replacing the local baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code_graph/lib/code-graph-impact-analysis.ts` | New analyzer | Create | Unit tests for aggregation, normalizers, BFS |
| `code_graph/handlers/impact-analysis.ts` | New MCP handler | Create | Handler integration test |
| `handlers/detect-changes.ts` | Existing change detector | Optional risk passthrough | Integration fixture |
| Optional enrichment adapter | Narrative generation | Explicit opt-in only | Provider none and CLI hardening tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Define output schema and normalizer strategy.
- [ ] Define enrichment options object.

### Phase 2: Core Implementation
- [ ] Implement file-node aggregation and risk signals.
- [ ] Implement normalizers, score formula, and BFS.
- [ ] Implement handler, tool registration, optional detect_changes integration, optional provider adapter.

### Phase 3: Verification
- [ ] Add aggregation, coverage, BFS, skipped-provider, and layer fallback tests.
- [ ] Run checks and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | aggregation, normalizers, TESTED_BY, BFS, formula | Vitest |
| Integration | handler and detect_changes passthrough | Vitest |
| Validation | Spec folder structure and anchors | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing detect_changes | Internal | Available | Cannot reuse current affected-symbol logic |
| Existing code_graph DB APIs | Internal | Available | Cannot compute deterministic signals |
| Phase 002 layer data | Optional internal | Pending | Emit unavailable/null instead |
| Phase 006 dispatcher helper | Optional internal | Pending | Required only for CLI enrichment |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: impact handler returns unstable scores, mislabels coverage evidence, or introduces remote calls by default.
- **Procedure**: Revert impact implementation commit and remove tool registration; no data migration rollback should be needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Phase 006 calibration |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 45-60 minutes |
| Core Implementation | High | 3-4 hours |
| Verification | High | 2-3 hours |
| **Total** | | **5.5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm deterministic baseline works without enrichment.
- [ ] Confirm optional provider config is absent by default.

### Rollback Procedure
1. Revert the implementation commit.
2. Run `npm run check`.
3. Re-run detect_changes tests if that handler was touched.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
