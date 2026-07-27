---
title: "Feature Specification: File Placement and Layout Correction"
description: "Files sit where their owning subsystem's documented layout says they should not: test directories contradicting an assets-only contract, a personal macOS keyboard config in a public repository, committed scripts embedding one workstation's "
trigger_phrases:
  - "misplacement and layout"
  - "017 phase 005"
  - "findings remediation 005"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/005-misplacement-and-layout"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec from the audit findings"
    next_safe_action: "Wait for phase 001 dispositions before acting"
    blockers: ["Gated on phase 001 triage dispositions"]
    key_files:
      - "spec.md"
      - "../../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: File Placement and Layout Correction

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 005 of 009 |
| **Findings in scope** | 11 |
| **Blast radius** | Medium |
| **Predecessor** | ../004-legacy-and-superseded-removal/spec.md |
| **Successor** | ../006-hub-doc-runtime-drift/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 005** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Files sit where their owning subsystem's documented layout says they should not: test directories contradicting an assets-only contract, a personal macOS keyboard config in a public repository, committed scripts embedding one workstation's absolute paths, and live SQLite state under two spellings of the same directory name.

### Purpose

Move each misplaced file to where its owning contract says it belongs, or correct the contract when the file's location is actually right.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Directories contradicting a documented layout contract
- Personal machine configuration committed to a public repository
- Committed scripts embedding absolute workstation paths
- Live state existing under both mcp-server and mcp_server spellings
- Run-label naming that departs from the storage convention

### Out of Scope

- Layout contradictions that are documentation errors rather than placement errors — those belong to phase 006

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `(misplaced paths)` | Move | Relocate to the documented location |
| `(layout docs)` | Modify | Where the file is right and the doc is wrong |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each finding is classified as a placement error or a documentation error before action | Classification recorded per finding |
| REQ-002 | Moves preserve every reference to the moved path | Literal search for the old path returns zero live references after the move |
| REQ-003 | Personal configuration is removed from the public repository | No machine-specific config remains tracked |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Dual-spelling state directories are resolved to one canonical path | Only one of the two spellings holds live state |
| REQ-005 | Absolute workstation paths are replaced with repo-relative resolution | No committed script contains a developer home directory path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every misplaced file is either moved or its contract corrected, with the choice recorded.
- **SC-002**: Zero committed files contain absolute workstation paths.
- **SC-003**: Live state resolves through exactly one directory spelling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A move breaks a consumer that referenced the old path by string | High | Literal search for the old path across all file types before and after |
| Risk | Consolidating dual-spelling state loses one side's data | High | Inspect both stores and merge deliberately; back up before consolidating |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which findings in this phase does the operator approve for execution?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../../016-dead-code-and-architecture-audit/findings-report.md`
- **Phase parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
