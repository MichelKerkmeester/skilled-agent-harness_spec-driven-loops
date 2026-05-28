---
title: "Feature Specification: blast_radius includeTransitive Flag Fix (029 Phase 008)"
description: "Make code_graph_query blast_radius honor the documented includeTransitive flag (default 1-hop, opt-in multi-hop), fixing contract violation F-022-1."
trigger_phrases:
  - "blast radius include transitive"
  - "f-022-1 fix"
  - "029 phase 008 blast radius flag"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-graph-playbook-validation/008-blast-radius-transitive-flag"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 008 spec for blast_radius includeTransitive fix"
    next_safe_action: "Gate effectiveDepth on includeTransitive in the blast_radius branch"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: blast_radius includeTransitive Flag Fix (029 Phase 008)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Finding F-022-1 (phase 007): `code_graph_query` blast_radius ignores the `includeTransitive` flag. The tool schema documents `includeTransitive` (default false) as "Enable multi-hop BFS traversal" and `maxDepth` as applying "when includeTransitive is true", but the blast_radius branch derives depth solely from `args.maxDepth` (default 3) at `handlers/query.ts:1218-1219` and never reads `includeTransitive`. So blast_radius is always multi-hop (up to depth 3), the flag is a silent no-op, and scenario 022's `transitive > nontransitive` assertion is unachievable.

### Purpose
Make blast_radius honor `includeTransitive` like the call-graph operations: default (false) returns direct importers only (depth 1); `includeTransitive:true` opts into multi-hop closure up to `maxDepth`. A consumer audit (phase 007) found no programmatic caller relies on the implicit full-closure default, so the behavior change is safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate an `effectiveDepth` on `includeTransitive` inside the blast_radius branch of `handlers/query.ts`; route the branch's depth uses through it.
- Update/extend the blast_radius vitest to assert the gated behavior (default 1-hop, transitive expands).
- Update scenario 022 doc so its pass criteria reflect the corrected contract.
- tsc build + vitest + alignment verifier.

### Out of Scope
- Call-graph / imports operations (they already honor includeTransitive — unchanged).
- Changing `maxDepth` semantics or the schema field definitions (only behavior is aligned to the existing schema text).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/query.ts` | Modify | Gate blast_radius depth on includeTransitive |
| `mcp_server/tests/code-graph-query-handler.vitest.ts` | Modify | Assert gated blast_radius depth |
| `manual_testing_playbook/.../022-*.md` | Modify | Reflect corrected pass criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | blast_radius honors includeTransitive | default → depth 1; `includeTransitive:true` → depth maxDepth (default 3) |
| REQ-002 | Other operations unchanged | outline/calls/imports paths untouched; their tests still pass |
| REQ-003 | Build + tests green | tsc clean; new + existing query-handler tests pass; alignment 0 violations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | 022 verdict resolvable to PASS | with `includeTransitive:true`, transitive > nontransitive holds on a deep subject |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `includeTransitive` measurably changes blast_radius depth.
- **SC-002**: The schema description and runtime behavior agree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default depth change (3→1) breaks a consumer | Reduced blast radius | Phase-007 audit found zero programmatic callers; none pass includeTransitive |
| Risk | Existing test asserts old default | test breakage | Run suite; update only tests that encoded the no-op default, preserving intent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default 1-hop is cheaper than 3-hop; no regression.

### Security
- **NFR-S01**: Internal traversal only; no new surface.

### Reliability
- **NFR-R01**: Behavior change covered by a unit test.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `includeTransitive:true` with explicit `maxDepth` honors the requested depth (clamped 0-20).
- `includeTransitive` omitted → depth 1 regardless of maxDepth.

### Error Scenarios
- Fallback/empty depthGroups builders use the same effectiveDepth for structural consistency.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 1 handler branch + 1 test + 1 doc |
| Risk | 12/25 | Public-tool behavior change; bounded by audit + tests |
| Research | 5/20 | Root cause + audit already done |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — audit complete, fix is localized.
<!-- /ANCHOR:questions -->
