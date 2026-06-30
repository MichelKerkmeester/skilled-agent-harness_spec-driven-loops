---
title: "Feature Specification: Phase 003 - narrative validation repair"
description: "Repair 096 validation sufficiency, restore source-to-target rename narratives, and make smart-router validation fail closed on zero coverage."
trigger_phrases:
  - "narrative validation repair"
  - "098 phase 003"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 003 - narrative validation repair

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
| **Parent** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation` |
| **Findings Resolved** | P1-004, P1-010, P1-013 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validate.sh --strict` on 096 exits 2 for spec_doc_sufficiency, 096 narratives now say plural-to-plural rename after self-sed, and `check-smart-router.sh:68` points at `.opencode/skill`, scanning zero skills and passing vacuously.

### Purpose
Repair 096 validation sufficiency, restore source-to-target rename narratives, and make smart-router validation fail closed on zero coverage.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Patch 096 parent and 004-symlinks sufficiency gaps, restore `.opencode/skill/` to `.opencode/skills/`, `.opencode/agent/` to `.opencode/agents/`, `.opencode/command/` to `.opencode/commands/` narratives, and make `check-smart-router.sh` use `.opencode/skills` with zero-scan failure.

### Out of Scope
Re-running the full 096 rename; broad history rewrite; tautology CI guard beyond advisory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/spec.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/spec.md` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `bash validate.sh .../096-rename-opencode-dirs-to-plural --strict` exits 0. | Evidence captured in checklist or implementation summary |
| REQ-002 | Tautology grep on 096 narratives returns 0. | Evidence captured in checklist or implementation summary |
| REQ-003 | `check-smart-router.sh` exits non-zero on a stub repo without skills and 0 on the real repo. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash validate.sh .../096-rename-opencode-dirs-to-plural --strict` exits 0.
- **SC-002**: Tautology grep on 096 narratives returns 0.
- **SC-003**: `check-smart-router.sh` exits non-zero on a stub repo without skills and 0 on the real repo.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild` | Required for phases 002-007 | Phase 001 is complete before draft phases execute |
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
