---
title: "Feature Specification: Phase 006 - skill advisor python"
description: "Migrate remaining skill advisor and Python support-tool defaults from singular `.opencode/skill` to plural `.opencode/skills`."
trigger_phrases:
  - "skill advisor python"
  - "098 phase 006"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/"
      - ".opencode/skill/.advisor-state/"
      - ".opencode/commands/doctor/scripts/audit_descriptions.py:157"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 006 - skill advisor python

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
| **Findings Resolved** | P1-003, P1-014 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Advisor freshness still writes `.opencode/skill/.advisor-state`, regenerating a stale survivor directory. `audit_descriptions.py:157` and `skill_advisor.py` native bridge constants still retain singular-root defaults despite 096 claiming they were patched.

### Purpose
Migrate remaining skill advisor and Python support-tool defaults from singular `.opencode/skill` to plural `.opencode/skills`.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Patch `freshness/generation.ts:12`, rebuild dist, delete `.opencode/skill/.advisor-state/` and empty root, patch `audit_descriptions.py:157`, patch `skill_advisor.py`, and add singular-root/zero-coverage smoke guards.

### Out of Scope
Changing advisor semantics; deleting unrelated historical references; redesigning doctor audit output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/dist/` | Modify | Phase-owned remediation surface |
| `.opencode/skill/.advisor-state/` | Modify | Phase-owned remediation surface |
| `.opencode/commands/doctor/scripts/audit_descriptions.py:157` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `find .opencode -maxdepth 1 -type d -name skill` returns nothing. | Evidence captured in checklist or implementation summary |
| REQ-002 | `python3 skill_advisor.py --force-native "test"` exits 0 with valid output. | Evidence captured in checklist or implementation summary |
| REQ-003 | `python3 audit_descriptions.py` on a stub repo without expected dirs exits non-zero. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find .opencode -maxdepth 1 -type d -name skill` returns nothing.
- **SC-002**: `python3 skill_advisor.py --force-native "test"` exits 0 with valid output.
- **SC-003**: `python3 audit_descriptions.py` on a stub repo without expected dirs exits non-zero.

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
