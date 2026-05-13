---
title: "Implementation Plan: 027/004/003 Impact Analysis Handler"
description: "Plan for MCP handler and optional LLM risk-enrichment adapter."
trigger_phrases:
  - "027 004 003 handler plan"
  - "impact handler plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/009-code-graph-impact-analysis/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 003-handler"
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
# Implementation Plan: 027/004/003 Impact Analysis Handler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Testing** | Handler integration tests and spec validation |

This child exposes the deterministic analyzer through MCP and owns optional enrichment gating.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-contract` is published.
- [ ] Handler patterns in code graph MCP server are reviewed.

### Definition of Done
- [ ] Handler validates input and calls analyzer.
- [ ] Tool registration is wired.
- [ ] Optional adapter is disabled unless configured.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin MCP handler over deterministic library, with optional enrichment adapter as a separate gated module.

### Key Components
- `handlers/impact-analysis.ts`
- Tool registration entry.
- Optional `code-graph-llm-risk-enrich.ts`

### Data Flow
MCP input is parsed, readiness is checked, analyzer output is returned as an MCP success response, and optional enrichment adds narrative only when configured.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract and local handler helpers.
- [ ] Define zod input schema.

### Phase 2: Core Implementation
- [ ] Implement handler and registration.
- [ ] Implement optional enrichment adapter or explicit skipped state.

### Phase 3: Verification
- [ ] Run handler tests.
- [ ] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema and provider gating | Vitest |
| Integration | MCP handler response envelope | Vitest |
| Validation | Child packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Internal child | Pending | Handler schema cannot stabilize. |
| `002-lib-impl` | Internal child | Pending for runtime | Handler can scaffold before analyzer implementation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove handler registration and adapter file, then re-run checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Release readiness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Medium | 45-60 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migration is involved. Revert handler registration and optional adapter code.
<!-- /ANCHOR:enhanced-rollback -->
