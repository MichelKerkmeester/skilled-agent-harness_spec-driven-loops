---
title: "Implementation Plan: Phase 1: advisor-observability"
description: "Completed adoption of the cited 027 observability patterns into the skill advisor: prompt-safe recommendation attribution and semantic-lane health reporting."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-advisor-and-codegraph-migrated-items/004-advisor-observability"
    last_updated_at: "2026-06-10T22:36:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Delivered advisor observability with prompt-safe attribution and semantic-lane health"
    next_safe_action: "Open a separate packet for the unrelated Claude settings parity failure if needed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advisor-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: advisor-observability

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_skill_advisor MCP daemon |
| **Storage** | skill-graph.sqlite (read-only here) |
| **Testing** | vitest |

### Overview
Surface attribution the scorer already computes and add semantic-lane health counters. The approach is additive and read-only over existing internals: no scorer math changes, opt-in output only, and queryable degraded-vector reasons alongside the existing console warnings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Targeted tests passing; full suite has one unrelated hook-settings parity failure outside allowed write paths
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive MCP handler/schema observability.

### Key Components
- **advisor_recommend**: returns `why_recommended` only when attribution is requested.
- **advisor_status**: returns `semanticLaneHealth` only when `includeSemanticHealth` or `debug` is set.
- **semantic-shadow lane**: records prompt-embedding and vector degradation reasons for queryable diagnostics.

### Data Flow
The scorer still computes recommendations exactly as before. The public handler sanitizes scorer evidence into category labels, while status reads the skill-graph database read-only to report active embedder, vector coverage, dimension mismatch, last refresh, and disabled reason.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-recommend.ts` | Public recommendation projection | Add opt-in prompt-safe `why_recommended` | `tests/handlers/advisor-recommend.vitest.ts` |
| `advisor-status.ts` | Diagnostic status projection | Add opt-in semantic-lane health | `tests/handlers/advisor-status.vitest.ts` |
| `semantic-shadow.ts` | Semantic lane runtime state | Record disabled reasons without changing scoring | Typecheck and status health tests |
| `advisor-tool-schemas.ts` | Public input/output validation | Add strict schemas for new optional fields | Typecheck and handler tests |

Inventory evidence:
- Same-class producers inspected: advisor recommend/status handlers, scorer fusion types, semantic-shadow lane, and schemas.
- Consumers updated: handler tests and status tests cover new public fields and default compact behavior.
- Algorithm invariant: recommendation order, scores, confidence, and uncertainty must not change when attribution is enabled.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Existing advisor handler, schema, scorer, and test surfaces inspected
- [x] No new dependencies or package metadata changes required
- [x] Allowed write paths confirmed before editing

### Phase 2: Core Implementation
- [x] Added opt-in `why_recommended` with lane scores and evidence categories only
- [x] Added opt-in `semanticLaneHealth` with active embedder, vector coverage, dim mismatch, last refresh, disabled reason, and lane-enabled state
- [x] Recorded semantic-shadow disabled reasons for database, adapter, dimension, prompt embedding, skill vector, and empty-vector degradation paths

### Phase 3: Verification
- [x] Targeted vitest handler/scorer tests passed
- [x] Full suite rerun after build; only `.claude/settings.local.json` hook-shape parity remains failing outside scope
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Attribution gating, prompt safety, ranking drift, semantic health | Vitest |
| Type | Handler/schema/scorer compile safety | `npm run typecheck` |
| Build | Dist freshness for CLI parity tests | `npm run build` |
| Validation | Spec folder structure and completion docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing scorer intermediates | Internal | Green | Needed to avoid new scoring computation |
| Skill-graph SQLite schema | Internal | Green | Needed for semantic health coverage counts |
| Claude hook settings parity | External to phase scope | Red | Full advisor suite remains red until a separate allowed change restores `.claude/settings.local.json` hooks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Attribution leaks raw prompt text, default output changes, or recommendation order/scores drift.
- **Procedure**: Remove the optional public fields and semantic health read path while keeping scorer math untouched.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
