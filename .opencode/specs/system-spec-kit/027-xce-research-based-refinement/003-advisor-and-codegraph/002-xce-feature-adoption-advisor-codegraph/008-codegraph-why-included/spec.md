---
title: "Feature Specification: why_included edge-chain breadcrumbs for blast_radius and code_graph_context"
description: "Code graph returns depth groups and risk but not the concrete import/call chain per file. Adopt 027's inline why-included attribution, behind includeTrace, so users see why a file is in blast_radius / context."
trigger_phrases:
  - "code graph why_included"
  - "edge chain breadcrumbs"
  - "blast radius trace"
  - "code_graph_context includeTrace"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented includeTrace-gated why_included breadcrumbs for blast_radius and code_graph_context"
    next_safe_action: "Use includeTrace only for debugging payloads; keep default responses compact"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-codegraph-why-included"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: codegraph-why-included

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | None (independent; pairs naturally with 007) |
| **Successor** | None (independent) |
| **Source transfers** | Analysis #8 (inline why-included edge-chain breadcrumbs) |
| **Handoff Criteria** | Phase validates `--strict`; breadcrumbs are behind includeTrace; default payload unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the spec-027 feature adoption into the advisor and code-graph daemons. It adds per-file "why included" breadcrumbs to blast-radius and context output.

**Scope Boundary**: `computeBlastRadius` in `handlers/query.ts` and `lib/code-graph-context.ts`. Add `why_included` edge-chain breadcrumbs (depth, import/call path, confidence, ambiguity, truncation reason) behind an `includeTrace` flag. No change to the default payload.

**Dependencies**:
- Phase 007's shared BFS helper is present and now carries optional path breadcrumbs for callers that opt into trace output.

**Deliverables**:
- An opt-in `why_included` trace per included file: depth, the import/call chain, confidence, ambiguity, and truncation reason.
- `includeTrace` flag wiring on `blast_radius` and `code_graph_context`.

**Changelog**:
- Completed 2026-06-10: trace breadcrumbs are available behind `includeTrace`; default payloads remain compact.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code graph already returns depth groups and risk for `blast_radius` and `code_graph_context`, but not the concrete edge chain per file - so a consumer cannot see the import/call path that pulled a file in, its confidence, ambiguity, or why a branch was truncated. This is the same gap 027 closed with inline why-included attribution.

### Purpose
Adopt 027's inline "why included" breadcrumbs: an opt-in per-file edge chain (depth, import/call path, confidence, ambiguity, truncation reason) for `blast_radius` and `code_graph_context`, kept behind `includeTrace` to protect the token/payload budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `why_included` breadcrumb per included file: depth, import/call chain, confidence, ambiguity flag, truncation reason.
- An `includeTrace` flag on `blast_radius` and `code_graph_context` that gates the breadcrumbs.
- Reuse of the existing traversal to build the chain (one pass where possible).

### Out of Scope
- Making breadcrumbs default-on - they stay opt-in to protect the payload/token budget.
- New risk scoring or depth-group semantics - only the per-file chain is added.
- The BM25 symbol resolver (phase 009).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-code-graph/mcp_server/handlers/query.ts` `computeBlastRadius` | Modify | Build `why_included` chain when includeTrace is set |
| `system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify | Emit per-file breadcrumbs for context seeds under includeTrace |
| `system-code-graph/mcp_server/handlers/query.ts` (schema/response) | Modify | Additive `includeTrace` input + `why_included` response field |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default payload unchanged: breadcrumbs only appear with includeTrace | Without the flag, `blast_radius` / `code_graph_context` responses are byte-identical to today |
| REQ-002 | The breadcrumb reflects the real edge chain, not a fabricated path | For a known fixture, the `why_included` chain matches the actual import/call edges that pulled the file in |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Breadcrumb carries depth, confidence, ambiguity, and truncation reason | A truncated branch reports its truncation reason; ambiguous matches are flagged |
| REQ-004 | Payload stays bounded even with includeTrace on large blast radii | Trace output is capped/paged; large results do not blow the token budget |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With includeTrace, a consumer can read the exact edge chain that placed each file in blast_radius / context.
- **SC-002**: Without includeTrace, output is unchanged and the token budget is unaffected.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Payload / token-budget blowup | Med | includeTrace-gated + capped/paged trace (REQ-001, REQ-004) |
| Risk | Breadcrumb misrepresents the real chain | Med | REQ-002 ties the trace to actual edges, tested on fixtures |
| Dependency | Shared traversal from phase 007 | Low | Optional; build the chain from the existing traversal if 007 has not shipped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: breadcrumbs are bounded by existing `limit`, `maxDepth`, context budget, and deadline caps. Overflow is surfaced through existing partial/fallback metadata plus per-breadcrumb truncation reason where applicable.
- Answered: each file exposes the shortest retained chain only. This keeps debug output useful without multiplying payload size.
<!-- /ANCHOR:questions -->

---
