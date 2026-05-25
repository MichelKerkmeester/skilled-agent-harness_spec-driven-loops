---
title: "008: Clean runtime artifacts, hooks, sweeper (deprecation phase, planned)"
description: "Clean venvs, daemon sockets/pids, index dirs, sidecar reaper telemetry, orphan-mcp-sweeper rerank/8765 probes, and scripts/README coco refs after the skills are deleted."
trigger_phrases:
  - "runtime-artifacts-cleanup"
  - "deprecate cocoindex phase 008"
  - "runtime artifacts cleanup"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Clean runtime artifacts, hooks, sweeper

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
| **Depends on** | 004, 005 (skills deleted before runtime cleanup) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Part of the CocoIndex / rerank-sidecar deprecation arc (014). Clean venvs, daemon sockets/pids, index dirs, sidecar reaper telemetry, orphan-mcp-sweeper rerank/8765 probes, and scripts/README coco refs after the skills are deleted.

### Purpose
Execute this phase of the deprecation in dependency order (decouple before delete), gated by its verify command and a pre-phase git commit (rollback point).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove deleted-skill .venv dirs
- Clean ~/.cocoindex_code/ (daemon.sock/pid/log) + .cocoindex_code/ index + sidecar-reaper.jsonl
- orphan-mcp-sweeper.sh:195-196/304 (rerank/8765 probes) + scripts/README.md:66/78
- Confirm port 8765 free; git hooks (session-start.sh) updated

### Out of Scope
- Editing frozen historical spec docs under `.opencode/specs/**`.
- Work owned by other phases in the DAG (see `../resource-map.md` §4).

### Files to Change
Approx ~10 items. Exhaustive file:line list in `../resource-map.md` §4-5 + the cited iteration findings.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply this phase's scoped edits/deletions | All in-scope items done; no out-of-scope changes |
| REQ-002 | Verify gate passes | no deleted-skill .venv; daemon runtime gone; port 8765 free; hooks updated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rollback point recorded | Pre-phase git commit hash recorded before edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verify gate green: no deleted-skill .venv; daemon runtime gone; port 8765 free; hooks updated
- **SC-002**: No regression in surviving subsystems (code-graph structural / memory default search).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004, 005 (skills deleted before runtime cleanup) | Phase blocked until predecessor done | Honor DAG order |
| Risk | Out-of-scope drift across the large edit surface | Med | Pre-phase commit; single-vertical edits; resource-map §6 risk register |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm operator decisions D1 (memory cross-encoder loss) + D2 (HYBRID semantic policy) before execution (see `../resource-map.md` §3).
<!-- /ANCHOR:questions -->
