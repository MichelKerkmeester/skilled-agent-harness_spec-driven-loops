---
title: "Feature Specification: Phase 002 - sk-deep token replacement"
description: "Replace actionable legacy sk-deep-review and sk-deep-research citations with renamed deep-review and deep-research skill paths."
trigger_phrases:
  - "sk deep token replace"
  - "098 phase 002"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 002 - sk-deep token replacement

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
| **Findings Resolved** | P1-002, P1-008, P1-009, P1-011, P1-012 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Command assets, agent bodies, orchestrator routing, Codex review doctrine, runtime mirrors, and install guides still cite legacy `sk-deep-review` / `sk-deep-research` even though packet 070 renamed folders to `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/`.

### Purpose
Replace actionable legacy sk-deep-review and sk-deep-research citations with renamed deep-review and deep-research skill paths.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Patch the four deep-review/deep-research command YAML assets, Opencode agents, orchestrator routing, `.codex/agents/review.toml`, `.claude/.codex/.gemini` mirrors, and `SET-UP - AGENTS.md`; verify actionable grep is clean and dry-run init succeeds.

### Out of Scope
Historical references in `z_archive/`, iteration logs, packet 070, and packet 081 review report.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Phase-owned remediation surface |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Phase-owned remediation surface |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Phase-owned remediation surface |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Phase-owned remediation surface |
| `.opencode/agents/deep-review.md` | Modify | Phase-owned remediation surface |
| `.opencode/agents/deep-research.md` | Modify | Phase-owned remediation surface |
| `.opencode/agents/orchestrate.md:96` | Modify | Phase-owned remediation surface |
| `.codex/agents/review.toml` | Modify | Phase-owned remediation surface |
| `.claude/agents/` | Modify | Phase-owned remediation surface |
| `.codex/agents/` | Modify | Phase-owned remediation surface |
| `.gemini/agents/` | Modify | Phase-owned remediation surface |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Actionable-surface `rg 'sk-deep-(review|research)'` returns 0. | Evidence captured in checklist or implementation summary |
| REQ-002 | Dry-run init succeeds for `/spec_kit:deep-review:auto`, `:confirm`, `/spec_kit:deep-research:auto`, and `:confirm`. | Evidence captured in checklist or implementation summary |
| REQ-003 | Orchestrator routing dispatch by-name lookup succeeds. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Actionable-surface `rg 'sk-deep-(review|research)'` returns 0.
- **SC-002**: Dry-run init succeeds for `/spec_kit:deep-review:auto`, `:confirm`, `/spec_kit:deep-research:auto`, and `:confirm`.
- **SC-003**: Orchestrator routing dispatch by-name lookup succeeds.

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
