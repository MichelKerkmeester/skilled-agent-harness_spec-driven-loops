---
title: "007: Rewrite docs + 27 YAML assets to HYBRID search policy (deprecation phase, planned)"
description: "Rewrite the 27 YAML workflow assets + README + install guides + AGENTS.md + CLAUDE.md SEARCH ROUTING to the HYBRID policy (Grep + code-graph structural). P0: 4 deep-loop executor YAMLs remove cocoindex_code from mcp_servers blocks."
trigger_phrases:
  - "docs-readme-search-routing"
  - "deprecate cocoindex phase 007"
  - "docs search routing"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rewrite docs + 27 YAML assets to HYBRID search policy

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
| **Depends on** | 006 (configs cleaned before docs) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Part of the CocoIndex / rerank-sidecar deprecation arc (014). Rewrite the 27 YAML workflow assets + README + install guides + AGENTS.md + CLAUDE.md SEARCH ROUTING to the HYBRID policy (Grep + code-graph structural). P0: 4 deep-loop executor YAMLs remove cocoindex_code from mcp_servers blocks.

### Purpose
Execute this phase of the deprecation in dependency order (decouple before delete), gated by its verify command and a pre-phase git commit (rollback point).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite 27 YAML assets (speckit 6, create 12, deep 4 P0, doctor remainder) to HYBRID policy
- P0: remove cocoindex_code from deep-loop executor mcp_servers: blocks (research/review _auto/_confirm)
- README.md, install_guides, AGENTS.md, CLAUDE.md (global + .claude) SEARCH ROUTING + decision tree
- search.md:116 coco vector/semantic channel ref

### Out of Scope
- Editing frozen historical spec docs under `.opencode/specs/**`.
- Work owned by other phases in the DAG (see `../resource-map.md` §4).

### Files to Change
Approx ~74. Exhaustive file:line list in `../resource-map.md` §4-5 + the cited iteration findings.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply this phase's scoped edits/deletions | All in-scope items done; no out-of-scope changes |
| REQ-002 | Verify gate passes | no coco semantic-search refs; decision trees show Grep+code-graph; loop executors start with modified YAML |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rollback point recorded | Pre-phase git commit hash recorded before edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verify gate green: no coco semantic-search refs; decision trees show Grep+code-graph; loop executors start with modified YAML
- **SC-002**: No regression in surviving subsystems (code-graph structural / memory default search).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 006 (configs cleaned before docs) | Phase blocked until predecessor done | Honor DAG order |
| Risk | Out-of-scope drift across the large edit surface | Med | Pre-phase commit; single-vertical edits; resource-map §6 risk register |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm operator decisions D1 (memory cross-encoder loss) + D2 (HYBRID semantic policy) before execution (see `../resource-map.md` §3).
<!-- /ANCHOR:questions -->
