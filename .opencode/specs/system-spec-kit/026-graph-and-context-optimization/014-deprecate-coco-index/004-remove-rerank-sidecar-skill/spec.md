---
title: "004: Remove the system-rerank-sidecar skill (deprecation phase, planned)"
description: "Delete the system-rerank-sidecar skill folder, .venv, scripts, tests, pyproject after its only consumers (memory in 003, coco) are removed."
trigger_phrases:
  - "remove-rerank-sidecar-skill"
  - "deprecate cocoindex phase 004"
  - "delete rerank sidecar"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove the system-rerank-sidecar skill

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
| **Depends on** | 003 (memory no longer consumes sidecar) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Part of the CocoIndex / rerank-sidecar deprecation arc (014). Delete the system-rerank-sidecar skill folder, .venv, scripts, tests, pyproject after its only consumers (memory in 003, coco) are removed.

### Purpose
Execute this phase of the deprecation in dependency order (decouple before delete), gated by its verify command and a pre-phase git commit (rollback point).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- rm -rf .opencode/skills/system-rerank-sidecar/ (SKILL.md, scripts/, tests/, pyproject.toml, .venv)

### Out of Scope
- Editing frozen historical spec docs under `.opencode/specs/**`.
- Work owned by other phases in the DAG (see `../resource-map.md` §4).

### Files to Change
Approx ~30. Exhaustive file:line list in `../resource-map.md` §4-5 + the cited iteration findings.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply this phase's scoped edits/deletions | All in-scope items done; no out-of-scope changes |
| REQ-002 | Verify gate passes | skill folder gone; port 8765 free (lsof); no rerank_sidecar process |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rollback point recorded | Pre-phase git commit hash recorded before edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verify gate green: skill folder gone; port 8765 free (lsof); no rerank_sidecar process
- **SC-002**: No regression in surviving subsystems (code-graph structural / memory default search).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 003 (memory no longer consumes sidecar) | Phase blocked until predecessor done | Honor DAG order |
| Risk | Out-of-scope drift across the large edit surface | Med | Pre-phase commit; single-vertical edits; resource-map §6 risk register |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm operator decisions D1 (memory cross-encoder loss) + D2 (HYBRID semantic policy) before execution (see `../resource-map.md` §3).
<!-- /ANCHOR:questions -->
