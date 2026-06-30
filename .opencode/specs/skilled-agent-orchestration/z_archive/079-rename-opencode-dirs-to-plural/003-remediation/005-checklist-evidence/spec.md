---
title: "Feature Specification: Phase 005 - checklist evidence"
description: "Backfill required checklist evidence for completed packets 093-096 and add 093 supersession notes for the 094 ADR."
trigger_phrases:
  - "checklist evidence"
  - "098 phase 005"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/**/checklist.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/**/checklist.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/**/checklist.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/**/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 005 - checklist evidence

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
| **Findings Resolved** | P1-007, P2-006 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
094 Level 2 checklist has unchecked required CHK-* items despite complete status, and the pattern repeats across 093/095/096. 094 RCAF naturalization ADR supersedes assumptions in 093 specs without explicit notes.

### Purpose
Backfill required checklist evidence for completed packets 093-096 and add 093 supersession notes for the 094 ADR.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
For 093/094/095/096, mark required CHK-* items `[x]` with concrete file:line evidence or qualify completion claims. Add supersession blocks to 093 specs referencing `094-playbook-prompt-naturalness/decision-record.md`.

### Out of Scope
Optional CHK-* without evidence; fabricating evidence; modifying the 094 ADR itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/**/checklist.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/**/checklist.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/**/checklist.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/**/checklist.md` | Modify | Phase-owned remediation surface |
| `.opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/**/spec.md` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every required CHK-* in 093-096 has file:line evidence or an explicit completion downgrade. | Evidence captured in checklist or implementation summary |
| REQ-002 | 093 specs include supersession notes to `094-playbook-prompt-naturalness/decision-record.md`. | Evidence captured in checklist or implementation summary |
| REQ-003 | Strict validation exits 0 for 093, 094, 095, and 096. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every required CHK-* in 093-096 has file:line evidence or an explicit completion downgrade.
- **SC-002**: 093 specs include supersession notes to `094-playbook-prompt-naturalness/decision-record.md`.
- **SC-003**: Strict validation exits 0 for 093, 094, 095, and 096.

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
