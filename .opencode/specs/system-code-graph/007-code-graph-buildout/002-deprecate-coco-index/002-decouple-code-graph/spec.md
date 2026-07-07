---
title: "002: Decouple system-code-graph from CocoIndex (deprecation phase, planned)"
description: "Sever the CocoIndex coupling from system-code-graph (ccc_* tools 11->8, classify_query_intent routing, cocoindex-path/ccc-readiness-probe/startup-brief, feature_catalog CCC delete, doctor _routes.yaml coco route + doctor_cocoindex.yaml delete) while keeping the structural skill green."
trigger_phrases:
  - "decouple-code-graph"
  - "deprecate cocoindex phase 002"
  - "sever ccc bridge"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Decouple system-code-graph from CocoIndex

<!-- SPECKIT_LEVEL: 1 -->

> **Planned scaffold** from the 001 research DAG. Detailed scope + file:line live in `../resource-map.md` §4 (this phase's row) and the cited `001-touchpoint-research/research/iterations/` files. Run `/spec_kit:plan` on this folder to flesh out plan.md / tasks.md before execution.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
| **Depends on** | None (first phase) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Part of the CocoIndex / rerank-sidecar deprecation arc (014). Sever the CocoIndex coupling from system-code-graph (ccc_* tools 11->8, classify_query_intent routing, cocoindex-path/ccc-readiness-probe/startup-brief, feature_catalog CCC delete, doctor _routes.yaml coco route + doctor_cocoindex.yaml delete) while keeping the structural skill green.

### Purpose
Execute this phase of the deprecation in dependency order (decouple before delete), gated by its verify command and a pre-phase git commit (rollback point).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove ccc_status/ccc_reindex/ccc_feedback from tool-schemas.ts (11->8) + handlers + TOOL_NAMES
- Neutralize semantic/hybrid routing in query-intent-classifier.ts
- Remove cocoindex-path.ts, ccc-readiness-probe.ts, startup-brief.ts coco refs
- DELETE feature_catalog/07--ccc-integration/ (3 files) + references/integrations/ccc_bridge_integration.md
- Remove _routes.yaml cocoindex route (106-120) + DELETE doctor_cocoindex.yaml + _routes.yaml:20/73 + doctor_mcp_install/debug coco entries
- Remove COCOINDEX_BIN_PATH from mk-code-index-launcher.cjs:20

### Out of Scope
- Editing frozen historical spec docs under `.opencode/specs/**`.
- Work owned by other phases in the DAG (see `../resource-map.md` §4).

### Files to Change
Approx ~35. Exhaustive file:line list in `../resource-map.md` §4-5 + the cited iteration findings.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply this phase's scoped edits/deletions | All in-scope items done; no out-of-scope changes |
| REQ-002 | Verify gate passes | vitest code-graph suites (minus ccc); tsc; MCP starts with 8 tools; /doctor route manifest has no coco |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rollback point recorded | Pre-phase git commit hash recorded before edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verify gate green: vitest code-graph suites (minus ccc); tsc; MCP starts with 8 tools; /doctor route manifest has no coco
- **SC-002**: No regression in surviving subsystems (code-graph structural / memory default search).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None (first phase) | Phase blocked until predecessor done | Honor DAG order |
| Risk | Out-of-scope drift across the large edit surface | Med | Pre-phase commit; single-vertical edits; resource-map §6 risk register |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm operator decisions D1 (memory cross-encoder loss) + D2 (HYBRID semantic policy) before execution (see `../resource-map.md` §3).
<!-- /ANCHOR:questions -->
