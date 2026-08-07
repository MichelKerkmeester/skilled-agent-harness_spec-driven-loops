---
title: "Feature Specification: 002-fix-documentation-bugs (skeleton, pre-synthesis)"
description: "Skeleton spec — audit-confirmed P0 bug fixes for system-skill-advisor. Specifics author after 001 synthesis."
trigger_phrases:
  - "skill-advisor bug fixes"
  - "002 bug fixes phase"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/004-documentation-quality-refactor/002-fix-documentation-bugs"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded child 002 skeleton"
    next_safe_action: "Fill after 001 synthesis ships"
    blockers: ["001-documentation-quality-audit-research must ship research.md first"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 002-fix-documentation-bugs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Pending (gated by 001 synthesis) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Audit-confirmed P0 bugs in system-skill-advisor docs: broken ADR-001 path (missing `004-skill-graph/` segment), broken hook reference link in README/INSTALL_GUIDE, wrong build-command path in ARCHITECTURE §8, and 9 nested READMEs with stale audit-packet rows.

### Purpose
Fix all P0 bugs identified in 001 synthesis. Restore link integrity and command accuracy across the package.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Specifics filled post-001 synthesis from `research/research.md` P0 findings

### Out of Scope
- P1/P2 findings (deferred to children 003/004/005)
- Embeddings symlink work

### Files to Change
[Filled post-synthesis]

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [TBD] | [TBD] | [TBD] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
[Filled post-synthesis from 001 research.md]

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [TBD] | [TBD] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P0 findings from 001 research closed
- **SC-002**: `validate.sh --strict` passes on this child
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 research.md | Blocker | Cannot author specifics until 001 ships |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- All deferred to post-001 synthesis
<!-- /ANCHOR:questions -->
