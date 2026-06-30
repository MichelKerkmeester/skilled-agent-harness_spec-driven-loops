---
title: "Feature Specification: Phase 007 - P2 doc drift"
description: "Sweep remaining P2 documentation drift, stale skill inventory, dead Copilot guard branch, and nested-backtick playbook prompts."
trigger_phrases:
  - "p2 doc drift"
  - "098 phase 007"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/install_guides/SET-UP - Opencode Agents.md"
      - ".opencode/install_guides/SET-UP - AGENTS.md"
      - ".opencode/install_guides/SET-UP - Code Graph.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 007 - P2 doc drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Parent** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation` |
| **Findings Resolved** | P2-001, P2-003, P2-004, P2-005, P2-007 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Install guides and root docs still cite singular paths or stale inventory; `.opencode/skills/sk-code/` has a dead Copilot target-authority guard branch; two cli-opencode playbooks have nested-backtick prompts that render incorrectly.

### Purpose
Sweep remaining P2 documentation drift, stale skill inventory, dead Copilot guard branch, and nested-backtick playbook prompts.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Patch install guides, root README/CONTRIBUTING, `barter/README.md`, setup guide inventory, and cli-opencode prompts. Confirm P2-004 with maintainer before removing or implementing the dead Copilot branch; default recommendation is remove.

### Out of Scope
Historical archives; large guide rewrites; implementing new Copilot guard behavior without maintainer confirmation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | Phase-owned remediation surface |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Phase-owned remediation surface |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Modify | Phase-owned remediation surface |
| `README.md` | Modify | Phase-owned remediation surface |
| `CONTRIBUTING.md` | Modify | Phase-owned remediation surface |
| `barter/README.md` | Modify | Phase-owned remediation surface |
| `.opencode/skills/sk-code/` | Modify | Phase-owned remediation surface |
| `.opencode/skills/cli-opencode/` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Case-insensitive `rg '\.opencode/(skill|agent|command)/'` across install guides and root docs returns only allowlisted historical hits. | Evidence captured in checklist or implementation summary |
| REQ-002 | Two cli-opencode playbook prompts render correctly when manually inspected. | Evidence captured in checklist or implementation summary |
| REQ-003 | P2-004 has a maintainer-confirmed remove-or-implement disposition. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Case-insensitive `rg '\.opencode/(skill|agent|command)/'` across install guides and root docs returns only allowlisted historical hits.
- **SC-002**: Two cli-opencode playbook prompts render correctly when manually inspected.
- **SC-003**: P2-004 has a maintainer-confirmed remove-or-implement disposition.

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

- Open: P2-004 remove-vs-implement requires maintainer confirmation before code change.

<!-- /ANCHOR:questions -->
