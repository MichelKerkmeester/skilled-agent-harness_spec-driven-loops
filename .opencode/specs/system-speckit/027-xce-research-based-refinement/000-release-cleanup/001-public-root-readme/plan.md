---
title: "Implementation Plan: Public Root README"
description: "Planned Level 1 implementation handoff for Public Root README."
trigger_phrases:
  - "public root readme plan"
  - "027 release cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/001-public-root-readme"
    last_updated_at: "2026-06-10T16:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Rewrote the public root README to current framework state and reconciled phase evidence"
    next_safe_action: "Monitor README drift"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:67a618d91957ff4c7a0fce33d104f4ebba1dd63cd494ef2d25547ab73c042d63"
      session_id: "2026-06-10-001-public-root-readme-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator pre-approved this release-cleanup phase and scope."
---
# Implementation Plan: Public Root README

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
Rewrote the repo-root README to current shipped reality: MCP and CLI dual-stack, memory capabilities, skill, command, and agent surfaces. This capstone followed an inventory -> align -> verify flow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Inventory current claims on README.md
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
- [x] Inventory README.md

### Phase 2: Implementation
- [x] Align schema v37, flags, CLI front doors, constitutional rules, memory features, and doctrine where applicable
- [x] Preserve ownership boundary: Capstone phase; verify after the other outward surfaces settle.

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
| Surface review | README.md | Grep/read diff review during implementation |
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
