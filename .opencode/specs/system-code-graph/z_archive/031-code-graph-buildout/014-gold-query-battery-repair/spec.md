---
title: "Feature Specification: Code Graph Gold-Query Battery Repair"
description: "Repair the Code Graph verification battery after the system-code-graph and system-skill-advisor extraction so structural read tools stop blocking on stale gold-query failures. The repair updates path and symbol expectations to current ownership without weakening the stable MCP tool IDs."
trigger_phrases:
  - "code graph gold query battery repair"
  - "verificationGate fail"
  - "system-code-graph extraction battery"
  - "026 004 014 gold query"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/014-gold-query-battery-repair"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "openai-gpt-5-5"
    recent_action: "Completed gold-query battery repair and verifier recovery validation"
    next_safe_action: "Restart the mk-code-index MCP server so the loaded runtime picks up the verifier-only bypass"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Create the phase first, then repair the battery and update the parent timeline."
---
# Feature Specification: Code Graph Gold-Query Battery Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/004-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Code Graph workstream. It is a verification-recovery phase: the runtime graph is indexed, but structural read tools still block because the persisted gold-query battery references pre-extraction file paths and ownership boundaries.

**Scope Boundary**: Repair validation assets and packet documentation first. Runtime Code Graph behavior changes are limited to the real verifier recovery bug exposed by verification.

**Dependencies**:
- Current `system-code-graph` and `system-skill-advisor` source paths.
- Stable MCP tool IDs: `code_graph_query`, `code_graph_context`, `code_graph_scan`, `code_graph_verify`, and `detect_changes`.

**Deliverables**:
- Repaired gold-query battery expectations.
- Repaired companion confidence fixture path evidence.
- Internal verifier-only bypass for the gold-query runner so a stale failed baseline cannot block its own recovery probes.
- Verified Code Graph scan and 28-query gold-query pass.
- Parent timeline update after verification.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Code Graph MCP read path reports a fresh index, but `code_graph_query` still blocks because the verification gate fails. The current gold-query battery still points at old `system-spec-kit/mcp_server/code_graph/**` and `system-spec-kit/mcp_server/skill_advisor/**` paths that moved into the standalone `system-code-graph` and `system-skill-advisor` skills.

### Purpose
Bring the gold-query battery back in line with current source ownership and restore verifier recovery so `code_graph_verify` passes and structural read tools can answer again without weakening public readiness or trust-state checks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update stale file paths, symbol names, and line expectations in the Code Graph gold-query battery.
- Rewrite outdated regression expectations that still assume Spec Kit owns Code Graph schemas.
- Update the companion exclude-rule confidence asset when its evidence paths are stale.
- Run `code_graph_scan`, `code_graph_verify`, and a representative structural read after repair.
- Update the parent timeline only after the repair is verified.

### Out of Scope
- Renaming stable MCP tool IDs or namespaces.
- Moving Code Graph code back into `system-spec-kit`.
- Changing parser, scanner, readiness, or public query behavior beyond the verifier-only recovery bug found during validation.
- Running or claiming a full deep-context loop for this repair.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research/assets/code-graph-gold-queries.json` | Modify | Replace stale paths and expectations with current `system-code-graph` / `system-skill-advisor` anchors |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research/assets/exclude-rule-confidence.json` | Modify | Refresh old path evidence if still stale |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Modify | Add internal verifier-only bypass while preserving public fail-closed query behavior |
| `.opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts` | Modify | Route verifier probes through the bypass |
| `.opencode/skills/system-code-graph/mcp_server/lib/gold-battery-runner.ts` | Modify | Type the verifier probe argument |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts` | Modify | Cover verifier recovery from failed persisted baseline |
| `specs/system-spec-kit/026-graph-and-context-optimization/timeline.md` | Modify | Record verified recovery after the battery passes |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create/Modify | Track this phase and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gold-query paths match current source ownership | Battery contains current `system-code-graph` and `system-skill-advisor` paths for moved handlers/libs |
| REQ-002 | Verification gate passes after repair | `code_graph_verify` succeeds against the repaired battery |
| REQ-006 | Verifier can recover from a failed persisted baseline | Gold-query verifier probes can run when the public read path remains fail-closed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Stale semantic expectations are updated, not deleted blindly | The Spec Kit ownership regression is rewritten to current ownership rather than removed without replacement |
| REQ-004 | Structural read tools unlock after verification | Representative `code_graph_query` call no longer returns `verificationGate: "fail"` |
| REQ-005 | Parent timeline reflects verified state | Timeline update happens after successful scan/verify evidence exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code_graph_verify` returns a passing result for the repaired battery.
- **SC-002**: `code_graph_query` answers a representative structural query instead of blocking on `verificationGate: "fail"`.
- **SC-003**: Timeline and phase docs identify the repair, evidence, and remaining limitations without claiming a full deep-context loop.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Line-number expectations may drift again after nearby edits | Med | Prefer stable path/symbol assertions where possible; verify against current source immediately |
| Risk | Rewriting an outdated regression could weaken coverage | Med | Preserve equivalent ownership coverage for stable MCP tool IDs and extracted skill boundaries |
| Dependency | Code Graph index freshness | High | Run `code_graph_scan` before `code_graph_verify` if readiness is not fresh |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Public structural reads must fail closed if paths or symbols drift. The only allowed bypass is the internal `gold-query-verifier` probe path used so the verifier can recover from a stale failed baseline and persist a real passing result.

### Maintainability
- **NFR-M01**: Battery expectations should describe current ownership boundaries so future extraction work has clear regression coverage.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Old `system-spec-kit/mcp_server/code_graph/**` paths must not remain as expected source anchors.
- Old `system-spec-kit/mcp_server/skill_advisor/**` paths must not remain as expected source anchors.

### Error Scenarios
- If `code_graph_verify` still fails after path repair, inspect failing query details before broadening or deleting expectations.
- If the graph becomes stale during edits, rescan before retrying verification.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two validation assets plus docs/timeline |
| Risk | 13/25 | Verification gate controls structural read trust |
| Research | 7/20 | Requires mapping old paths to current source anchors |
| **Total** | **28/70** | **Level 2** |

Scoring uses the local Level 2 phase rubric: Scope and Risk are each scored out of 25 points; Research is scored out of 20 points.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. User direction is to create this phase first, then repair the battery and update the timeline.
<!-- /ANCHOR:questions -->
