---
title: "Spec: Deep-Research Investigation of System-Spec-Kit MCP Sidecar — Drift, Dead Code, Security, Over-engineering, Simplification, Refinement"
description: "Level 2 research child for a 20-iteration investigation of the system-spec-kit MCP sidecar surface before any remediation work begins."
trigger_phrases:
  - "deep-research sidecar drift simplification"
  - "system-spec-kit mcp sidecar research"
  - "arc 010 phase 001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification"
    last_updated_at: "2026-05-22T21:00:18Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-deep-research-sidecar-investigation"
    next_safe_action: "start-deep-research-iteration-001-drift-detection"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "research/deep-research-config.json"
      - "research/deep-research-state.jsonl"
      - "research/deep-research-strategy.md"
      - "research/deep-research-dashboard.md"
      - "research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0100010100010100010100010100010100010100010100010100010100010100"
      session_id: "013-embedder-testing-and-architecture-010-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Research child is scaffold-only; implementation of fixes is explicitly out of scope."
      - "Executor mix is recorded for workflow-owned dispatch, but this scaffold does not self-dispatch."
---
# Spec: Deep-Research Investigation of System-Spec-Kit MCP Sidecar

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of arc 010 |
| **Predecessor** | None |
| **Successor** | Follow-on remediation packet after synthesis |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit MCP sidecar surface has grown quickly across TypeScript client/worker code, a Node ensure helper, and supporting embedder lifecycle logic. Recent churn raises the risk that dead paths, duplicated abstractions, stale assumptions, local-service security gaps, and unnecessary complexity are hiding in code that now sits on a critical retrieval path.

### Purpose
Produce a 20-iteration deep-research evidence base that categorizes actionable findings across drift, dead code, security risks, over-engineering, simplification opportunities without function loss, and refinement candidates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Primary system-spec-kit MCP sidecar surface: `mcp_server/lib/embedders/sidecar-client.ts`, `mcp_server/lib/embedders/sidecar-worker.ts`, and `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- Immediate dependencies: `execution-router.ts`, `schema.ts`, and `registry.ts`.
- Broader sidecar-related lifecycle code where it intersects: `system-rerank-sidecar/` and mcp-coco-index sidecar interfaces.
- Research artifacts under this phase's `research/` folder.

### Out of Scope
- Implementation of fixes; remediation is deferred to a follow-on packet.
- Non-sidecar code in system-spec-kit except immediate dependencies needed to understand the sidecar path.
- Other skills' internal organization beyond cross-skill sidecar interaction evidence.
- Git mutation, commits, or self-dispatch to CLI executors.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Level 2 research specification |
| `plan.md` | Create | 20-iteration research strategy |
| `tasks.md` | Create | Iteration task ledger |
| `checklist.md` | Create | Research validation checklist |
| `implementation-summary.md` | Create | Not-started research summary scaffold |
| `description.json` | Create | Search metadata |
| `graph-metadata.json` | Create | Graph metadata |
| `research/` | Create | Deep-research state, prompts, deltas, iterations, dashboard, strategy, and registry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete 20 deep-research iterations exploring 5+ investigative angles | 20 iteration markdowns exist under `research/iterations/`; `research/deep-research-state.jsonl` records a convergence event; `research/findings-registry.json` is populated. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Produce a synthesis identifying actionable findings across the 6 investigation angles | Final synthesis in `research/research.md` categorizes findings across drift, dead code, security risks, over-engineering, simplification opportunities without function loss, and refinement. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each dimension has at least one deduplicated finding or a documented no-finding rationale after its assigned iterations.
- **SC-002**: Findings are deduplicated by fingerprint in `research/findings-registry.json` and grouped by dimension, affected file, severity, and follow-on remediation recommendation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research dispatch drifts into implementation | Could violate the research-only boundary. | Keep tasks scoped to evidence collection and route fixes to a follow-on packet. |
| Risk | Sidecar code crosses skill boundaries | Findings may be incomplete if only system-spec-kit files are inspected. | Include immediate cross-skill sidecar interfaces where they intersect. |
| Dependency | Deep-research workflow state contract | Missing state files would prevent clean resume. | Scaffold config, JSONL, dashboard, registry, prompts, deltas, and iterations before dispatch. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NFR-001 | Preserve research provenance | Iteration files cite source paths and evidence without mutating implementation code. |
| NFR-002 | Maintain workflow-owned state boundaries | Config is immutable, JSONL is append-only, iteration markdowns are write-once, and reducer-owned files are not manually edited during execution. |
| NFR-003 | Keep findings actionable | Each finding names the risk, evidence, affected surface, and a concrete remediation direction. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| Edge Case | Expected Handling |
|-----------|-------------------|
| One angle yields no actionable findings | Record the negative result with files inspected and evidence strength. |
| A finding spans system-spec-kit and another skill | Keep the finding in this research packet, mark the external surface, and defer ownership to remediation planning. |
| A simplification removes capability | Classify it as overreach and do not recommend it as simplification without a function-preserving alternative. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Primary sidecar surface, immediate dependencies, and cross-skill intersections. |
| Risk | 20/25 | Local service boundaries, process ownership, auth, env propagation, and code drift. |
| Research | 20/20 | 20 planned deep-research iterations across six angles. |
| **Total** | **60/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- No open scaffold questions. Research iterations may add evidence questions to the strategy and dashboard.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:quality-gates -->
## 9. QUALITY GATES

| Gate | Requirement | Evidence |
|------|-------------|----------|
| Iteration completeness | 20 iteration markdowns and JSONL records | `research/iterations/iteration-001.md` through `iteration-020.md`; state log records all runs. |
| Angle coverage | Six angles covered at least 3 times each, with two angles covered 4 times | Task rotation in `tasks.md`; dashboard progress table. |
| Synthesis | Findings are deduplicated and categorized | `research/findings-registry.json` and final synthesis. |
| Validation | Phase child strict validation exits 0 | `validate.sh .../015-deep-research-drift-and-simplification --strict`. |
<!-- /ANCHOR:quality-gates -->
