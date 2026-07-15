---
title: "Implementation Plan: Command Alignment"
description: "Planned Level 1 implementation handoff for Command Alignment."
trigger_phrases:
  - "command alignment plan"
  - "027 release cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/006-command-alignment"
    last_updated_at: "2026-06-10T15:29:29Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed content-only command-doc alignment to shipped 027 reality"
    next_safe_action: "Let phase 027/011 perform the later router/presentation split"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-006-command-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Implementation Plan: Command Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation and spec metadata |
| **Framework** | OpenCode spec-kit documentation workflow |
| **Storage** | Files under the owned outward/governance surface |
| **Testing** | Strict spec validation plus surface-specific review |

### Overview
Align command-doc content accuracy for flags, behavior, and CLI front doors without changing structural router or presentation ownership. This phase followed an inventory -> align -> verify flow and stayed content-only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Inventory current claims on .opencode/commands/**
- [x] Align current-state claims to shipped 027 reality
- [x] Verify coherence and record evidence
- [x] Strict validation passes for this child phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation surface alignment with explicit ownership boundaries.

### Key Components
- **Inventory**: list every current outward claim in scope.
- **Alignment**: update stale or incomplete current-state claims during implementation.
- **Verification**: validate strict spec docs and perform surface-specific checks.

### Data Flow
1. Read the owned surface.
2. Compare claims against shipped 027 reality.
3. Apply only in-scope content changes during implementation.
4. Record verification evidence in implementation-summary.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory .opencode/commands/**

### Phase 2: Implementation
- [x] Align schema v37, flags, CLI front doors, constitutional rules, memory features, and doctrine where applicable
- [x] Preserve ownership boundary: Coordinate with 027/011, which owns the structural router and presentation split; this phase is content-only.

### Phase 3: Verification
- [x] Run strict spec validation
- [x] Run surface-specific coherence checks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This child phase | `validate.sh --strict` |
| Surface review | .opencode/commands/** | Grep/read diff review during implementation |
| Ownership check | 027/000 boundary | Git diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped 027 source of truth | Internal | Available | Cannot align outward claims accurately |
| 027/011 command-presentation ownership | Internal | Planned | Command content work could collide with structural split |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Implementation changes make the surface conflict with shipped 027 behavior or 027/011 ownership.
- **Procedure**:
  1. Revert the affected outward-surface edits.
  2. Restore the last strict-valid spec docs.
  3. Re-run strict validation and surface-specific checks.
<!-- /ANCHOR:rollback -->
