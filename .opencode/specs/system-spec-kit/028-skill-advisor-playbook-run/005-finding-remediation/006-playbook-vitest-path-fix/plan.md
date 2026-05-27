---
title: "Implementation Plan: Playbook Vitest Path Fix (F5)"
description: "Replace the stale vitest invocation in NC-004/NC-005 with the canonical system-skill-advisor/mcp_server tests path; re-grep to confirm no residual stale paths."
trigger_phrases:
  - "F5 plan vitest path"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/006-playbook-vitest-path-fix"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Playbook Vitest Path Fix (F5)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (playbook docs) |
| **Framework** | system-skill-advisor manual testing playbook |
| **Storage** | n/a |
| **Testing** | run the corrected command (49 tests pass) |

### Overview
Trivial doc fix: swap the pre-extraction `--prefix system-spec-kit/mcp_server ... skill-advisor/tests/` command for `cd system-skill-advisor/mcp_server && npm exec -- vitest run tests/...` in the two affected scenarios, then re-grep to confirm completeness.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Canonical command verified (49/49 pass) — research §3 F5
- [x] Affected scenarios enumerated (NC-004, NC-005)

### Definition of Done
- [x] Both commands corrected
- [x] Re-grep returns no `skill-advisor/tests/` matches
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-only string replacement.

### Key Components
- **004-ambiguous-brief-rendering.md:38** and **005-lifecycle-redirect-metadata.md:36**: the stale command lines

### Data Flow
n/a — documentation edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `004-ambiguous-brief-rendering.md:38` | stale vitest command | replace with canonical | command runs 49 tests |
| `005-lifecycle-redirect-metadata.md:36` | stale vitest command | replace with canonical | command runs |
| whole playbook + feature_catalog | possible residual stale paths | re-grep | no matches |

Inventory: `grep -rn "skill-advisor/tests" .opencode/skills/system-skill-advisor/{manual_testing_playbook,feature_catalog}/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the canonical command runs 49 tests from system-skill-advisor/mcp_server

### Phase 2: Core Implementation
- [x] Replace the command in NC-004 (line ~38)
- [x] Replace the command in NC-005 (line ~36)

### Phase 3: Verification
- [x] Run both corrected commands (49/49 pass)
- [x] Re-grep playbook + feature_catalog → no `skill-advisor/tests/` matches
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | corrected commands run | vitest |
| Audit | residual stale paths | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| test files at canonical path | Internal | Green | already present, 49 pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: n/a (doc-only).
- **Procedure**: Revert the two doc lines.
<!-- /ANCHOR:rollback -->
