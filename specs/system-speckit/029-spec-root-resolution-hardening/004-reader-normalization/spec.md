---
title: "Feature Specification: Reader Normalization"
description: "Phase S4: switch every unqualified reader/resolver to canonical-first with read-only legacy fallback, then run a clean compatibility window."
trigger_phrases:
  - "reader normalization"
  - "canonical-first readers"
  - "legacy read fallback"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Reader Normalization

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening` |
| **Predecessor** | `003-writer-canonicalization` |
| **Successor** | `005-symlink-retirement-and-validation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared scripts helper (`getSpecsDirectories`/`findActiveSpecsDir`) and the independent constructors (startup pending recovery, generic MCP discovery, resume/authored continuity, API indexing, spec affinity, memory-quality validation) resolve with mixed precedence. With writers already canonical, readers must agree on canonical-first without stranding unique legacy-only packets.

### Purpose
Switch every unqualified reader/resolver to canonical-first with read-only legacy fallback, preserving explicit paths, then run a clean compatibility window to confirm no legacy dependence remains.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared scripts helper → canonical-first with read-only legacy fallback.
- Independent constructors → canonical-first.
- A 28-day zero-hit compatibility window.

### Out of Scope
- Writer changes (phase 003, complete).
- Symlink retirement (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/core/config.ts` | Modify | `getSpecsDirectories`/`findActiveSpecsDir` canonical-first |
| independent MCP/scripts constructors | Modify | canonical-first with read-only legacy fallback |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared helper canonical-first + legacy read fallback | Unqualified selection returns canonical; unique legacy-only still readable |
| REQ-002 | Independent constructors canonical-first | Each registry-listed constructor resolves canonical-first |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Clean 28-day compatibility window | Zero legacy-fallback hits and zero legacy-write attempts recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every unqualified resolver returns canonical-first; explicit paths preserved.
- **SC-002**: The compatibility window records zero legacy-fallback hits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A legacy-first caller was missed | Wrong-root read | Registry (phase 001) drives coverage |
| Dependency | Phase 003 writers canonical | Reader/writer visibility mismatch | 004 follows 003 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What signal instruments legacy-fallback hits during the compatibility window?
<!-- /ANCHOR:questions -->
