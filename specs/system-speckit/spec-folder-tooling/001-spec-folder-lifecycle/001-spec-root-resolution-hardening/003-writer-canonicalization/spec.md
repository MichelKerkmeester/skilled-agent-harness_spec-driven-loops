---
title: "Feature Specification: Writer Canonicalization"
description: "Phase S3: make every automatic writer emit canonical targets, add same-ID collision rejection, and ship source+dist as one bundle, then unfreeze."
trigger_phrases:
  - "writer canonicalization"
  - "session-stop autosave canonical"
  - "create.sh canonical"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Writer Canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening` |
| **Predecessor** | `002-data-canonicalization` |
| **Successor** | `004-reader-normalization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The automatic writers resolve legacy-first or re-materialize `specs/`: the Stop autosave, bare/new `generate-context`, the phase-pointer refresh (which re-resolves the original argument and can silently skip), and `spec/create.sh` untracked (`mkdir -p specs/`). With the symlink already deleted, `create.sh` untracked is the live re-materialization vector.

### Purpose
Make every writer emit canonical targets, fix the phase-pointer refresh to consume the resolved path, make both `create.sh` modes canonical, add per-write same-ID collision rejection, and ship source+dist as one bundle before unfreeze.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stop autosave + bare/new saves resolve canonical.
- Phase-pointer refresh consumes the resolved absolute child path.
- Both `spec/create.sh` modes canonical; untracked mode no longer `mkdir -p specs/`.
- Per-write same-ID collision rejection.
- Ship source+dist together; smoke alias-absent; unfreeze.

### Out of Scope
- Reader normalization (phase 004).
- Symlink retirement (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/hooks/claude/session-stop.ts` | Modify | Autosave emits canonical |
| `scripts/memory/generate-context.ts` | Modify | Bare/new saves canonical |
| `scripts/core/workflow.ts` | Modify | Phase-pointer uses resolved path |
| `scripts/spec/create.sh` | Modify | Both modes canonical; no legacy `mkdir -p` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stop autosave + bare/new saves canonical | Writers target `.opencode/specs`; alias-absent smoke passes |
| REQ-002 | Phase-pointer refresh uses the resolved path | Child save no longer silently skips the pointer update |
| REQ-003 | Both `create.sh` modes canonical | Untracked mode never materializes a plain `specs/` root |
| REQ-004 | Per-write same-ID collision rejection | A write to a divergent same-ID location fails closed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the alias absent, no writer produces a plain `specs/` directory.
- **SC-002**: Source and dist ship together; no source/dist behavior mismatch at unfreeze.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Source ships without dist (or vice versa) | Split behavior | Single source+dist bundle gate |
| Dependency | Phase 002 data canonical | Writers could canonicalize onto unresolved divergence | 003 blocked until 002 lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any writer resolve a spec folder outside the four entrypoints above (registry must confirm)?
<!-- /ANCHOR:questions -->
