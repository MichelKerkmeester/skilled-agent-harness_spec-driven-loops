---
title: "Implementation Plan: OpenLTM Retrieval Observability"
description: "Add opt-in retrieval observability to memory search/context and health surfaces without changing ranking, scoring, decay, schema, or write behavior."
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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/006-openltm-retrieval-observability"
    last_updated_at: "2026-06-10T13:03:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Planned additive retrieval observability"
    next_safe_action: "Use targeted suite as regression guard"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-openltm-retrieval-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: OpenLTM Retrieval Observability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP handler modules |
| **Storage** | Existing SQLite memory index, no schema change |
| **Testing** | Vitest, TypeScript no-emit |

### Overview
Add an opt-in retrieval observability layer to the existing memory search, context, health, and embedder-status surfaces. The implementation reads ranker-carried intermediates and maintenance outcomes, then formats diagnostics without changing result order, score calculation, FSRS/decay, schema, or persisted retrieval state.
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
- [x] Tests passing: focused suite plus memory-search canaries
- [x] Docs updated: spec, plan, tasks, implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive response-observability helper plus existing handler/formatter surfaces.

### Key Components
- **Retrieval formatter**: Adds per-result `why_ranked` and inline conflict warnings only when trace output is requested.
- **Search/context handlers**: Forward trace/debug opt-in and attach vector degradation diagnostics to trace data.
- **Health/embedder surfaces**: Report degraded-vector state and last-run maintenance counters.
- **Maintenance handlers**: Record in-process last-run counters after scan, reconcile, and retention operations.

### Data Flow
The search pipeline returns already-ranked rows with score/channel metadata. The formatter reads those row fields into `why_ranked`, queries existing causal edges for returned-pair warnings, and leaves the row order untouched. Maintenance handlers record their latest counters in memory, and health/status handlers expose that snapshot read-only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Retrieval formatter | Shapes search results consumed by agents | Add `why_ranked` and returned-pair warnings | `openltm-retrieval-observability.vitest.ts` |
| Search/context handlers | Opt-in trace/debug routing | Add degraded-vector trace and debug-profile forwarding | Focused suite and tsc |
| Health/embedder status | Operator diagnostics | Add recall degradation and maintenance snapshot | Focused suite |
| Maintenance handlers | Scan/reconcile/retention outcomes | Record last-run counters in memory | Focused suite |

Inventories completed through targeted handler, formatter, health, embedder-status, and test reads. No ranking, schema, environment-reference, validator, or sibling-phase files were edited.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Existing handler/formatter/test structure identified
- [x] No dependencies or schema changes needed
- [x] MCP server test config used for source-level verification

### Phase 2: Core Implementation
- [x] Add `why_ranked` from ranker intermediates
- [x] Add inline conflict warnings for returned causal-edge pairs
- [x] Add degraded-vector and maintenance-counter surfaces

### Phase 3: Verification
- [x] Focused Vitest suite passed
- [x] Memory-search and hybrid-search canaries passed
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Observability helper and formatter outputs | Vitest |
| Integration | Health surface and retrieval response shape | Vitest |
| Regression | Memory-search and hybrid-search canaries | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing causal edge vocabulary | Internal | Green | Warnings consume `contradicts`/`supersedes`; no vocabulary change. |
| Existing ranker intermediates | Internal | Green | `why_ranked` reads row metadata; no display formula added. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A trace/debug response causes ranking drift or TypeScript/test regression.
- **Procedure**: Remove the observability helper wiring and tests; no data migration rollback is needed because no schema or persisted ranking state changed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
