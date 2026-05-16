---
title: "Feature Specification: Phase 004 - hooks resolver tighten"
description: "Tighten hook autosave script resolution and deep-loop artifact path containment."
trigger_phrases:
  - "hooks resolver tighten"
  - "098 phase 004"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/004-hooks-resolver-tighten"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38"
      - ".opencode/skills/system-spec-kit/mcp_server/ deep-loop artifact resolver"
      - ".opencode/skills/system-spec-kit/mcp_server/**/tests/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 004 - hooks resolver tighten

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Parent** | `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation` |
| **Findings Resolved** | P1-006, P1-005 (downgraded P2) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`session-stop.ts:38` reads an env-selectable autosave script path and executes before canonical workflow path resolution. Deep-loop artifact resolver accepts malformed `spec_folder` values; attack matrix downgraded exploitability but containment should fail closed.

### Purpose
Tighten hook autosave script resolution and deep-loop artifact path containment.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Remove production env-script override or gate it to test-only, add realpath containment before autosave execution, and require deep-loop artifact `spec_folder` values to resolve under `.opencode/specs/`.

### Out of Scope
Changing canonical autosave semantics; changing packet naming policy; treating P1-005 as active exploit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/ deep-loop artifact resolver` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/**/tests/**` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Attack-matrix tests for empty, whitespace, `..`, absolute, symlink, glob, and `{{template}}` values fail closed. | Evidence captured in checklist or implementation summary |
| REQ-002 | Existing unit tests still pass. | Evidence captured in checklist or implementation summary |
| REQ-003 | Production env var cannot redirect autosave script execution. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Attack-matrix tests for empty, whitespace, `..`, absolute, symlink, glob, and `{{template}}` values fail closed.
- **SC-002**: Existing unit tests still pass.
- **SC-003**: Production env var cannot redirect autosave script execution.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild` | Required for phases 002-007 | Phase 001 is complete before draft phases execute |
| Risk | Over-broad remediation edits historical context | Medium | Use targeted edits and explicit allowlists |
| Risk | Verification misses one runtime surface | Medium | Run phase-specific grep, build, smoke, or validator checks |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Verification should use targeted commands and avoid broad repo rewrites.

### Security
- **NFR-S01**: Runtime path, hook, or review-doctrine changes must fail closed where applicable.

### Reliability
- **NFR-R01**: Documentation, generated output, and metadata must agree with the actual runtime surface.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Historical archives and iteration logs may intentionally contain old strings.
- File:line evidence must point at current repo state, not inferred history.

### Error Scenarios
- Validator exit 2 is a failure and must be repaired before completion claims.
- Zero-coverage scans must fail closed instead of passing vacuously.

### Concurrent Operations
- This child can be planned independently, but final parent completion depends on all seven phases.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

Level 2: verification-focused remediation across multiple files or runtime surfaces, with concrete evidence required before completion.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None; implementation questions are resolved or captured as followup advisories.

<!-- /ANCHOR:questions -->
