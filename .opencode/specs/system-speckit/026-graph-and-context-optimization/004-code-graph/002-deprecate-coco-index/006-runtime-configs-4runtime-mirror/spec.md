---
title: "006: Remove coco from runtime configs + 4-runtime mirror (deprecation phase, planned)"
description: "Remove the cocoindex_code MCP registration from opencode.json/.vscode/.gemini/.codex + RERANK env notes + coco from agent/command frontmatter across all 4 runtimes; doctor_update.yaml + Gemini update.toml coco refs."
trigger_phrases:
  - "runtime-configs-4runtime-mirror"
  - "deprecate cocoindex phase 006"
  - "runtime config cleanup"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove coco from runtime configs + 4-runtime mirror

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
| **Depends on** | 004, 005 (skills deleted before config cleanup) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Part of the CocoIndex / rerank-sidecar deprecation arc (014). Remove the cocoindex_code MCP registration from opencode.json/.vscode/.gemini/.codex + RERANK env notes + coco from agent/command frontmatter across all 4 runtimes; doctor_update.yaml + Gemini update.toml coco refs.

### Purpose
Execute this phase of the deprecation in dependency order (decouple before delete), gated by its verify command and a pre-phase git commit (rollback point).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove cocoindex_code MCP block from opencode.json, .vscode/mcp.json, .gemini/settings.json, .codex/config.toml
- Remove RERANK_SIDECAR_PORT / SPECKIT_CROSS_ENCODER / RERANKER_LOCAL notes
- Remove coco from agent/command frontmatter (.opencode/.claude/.gemini/.codex mirror)
- doctor_update.yaml coco refs (297-299,304-305,393,480) + .gemini/commands/doctor/update.toml:2

### Out of Scope
- Editing frozen historical spec docs under `.opencode/specs/**`.
- Work owned by other phases in the DAG (see `../resource-map.md` §4).

### Files to Change
Approx ~108. Exhaustive file:line list in `../resource-map.md` §4-5 + the cited iteration findings.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply this phase's scoped edits/deletions | All in-scope items done; no out-of-scope changes |
| REQ-002 | Verify gate passes | no cocoindex_code in any config; no RERANK_SIDECAR_PORT; frontmatter clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rollback point recorded | Pre-phase git commit hash recorded before edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verify gate green: no cocoindex_code in any config; no RERANK_SIDECAR_PORT; frontmatter clean
- **SC-002**: No regression in surviving subsystems (code-graph structural / memory default search).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004, 005 (skills deleted before config cleanup) | Phase blocked until predecessor done | Honor DAG order |
| Risk | Out-of-scope drift across the large edit surface | Med | Pre-phase commit; single-vertical edits; resource-map §6 risk register |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm operator decisions D1 (memory cross-encoder loss) + D2 (HYBRID semantic policy) before execution (see `../resource-map.md` §3).
<!-- /ANCHOR:questions -->
