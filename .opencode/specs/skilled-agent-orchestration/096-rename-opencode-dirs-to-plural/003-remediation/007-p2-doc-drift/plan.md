---
title: "Implementation Plan: Phase 007 - P2 doc drift"
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
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift"
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
# Implementation Plan: Phase 007 - P2 doc drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown specs plus targeted project surfaces |
| **Framework** | system-spec-kit phase-parent remediation |
| **Storage** | `.opencode/specs/` metadata graph |
| **Testing** | `validate.sh --strict`, `rg`, and phase-specific smoke/build checks |

### Overview
Sweep remaining P2 documentation drift, stale skill inventory, dead Copilot guard branch, and nested-backtick playbook prompts.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent packet pre-approved
- [x] Findings mapped: P2-001, P2-003, P2-004, P2-005, P2-007
- [x] Scope boundaries documented
- [x] Verification strategy identified

### Definition of Done
- [ ] Acceptance criteria met
- [ ] Phase-specific verification run
- [ ] Checklist evidence captured
- [ ] Metadata status updated

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted child-phase remediation under a phase-parent control packet.

### Key Components
- **Child spec docs**: scope, plan, tasks, checklist, and implementation summary.
- **Description metadata**: search and memory routing for this child.
- **Graph metadata**: parent linkage and phase dependency.

### Data Flow
1. Read current affected files.
2. Apply targeted edits only inside this phase.
3. Run verification commands.
4. Update checklist evidence and implementation summary.
5. Validate the parent packet recursively.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Action | Notes |
|---------|--------|-------|
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | See phase scope |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | See phase scope |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Modify | See phase scope |
| `README.md` | Modify | See phase scope |
| `CONTRIBUTING.md` | Modify | See phase scope |
| `barter/README.md` | Modify | See phase scope |
| `.opencode/skills/sk-code/` | Modify | See phase scope |
| `.opencode/skills/cli-opencode/` | Modify | See phase scope |

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Preflight
- [ ] Read affected files and establish current drift.
- [ ] Confirm allowlisted historical references.

### Phase 2: Remediation
- [ ] Apply targeted edits from `tasks.md`.
- [ ] Preserve out-of-scope material.

### Phase 3: Verification
- [ ] Run checks listed in `spec.md`.
- [ ] Update checklist and implementation summary.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Child and parent spec docs | `validate.sh --strict` |
| Drift | Residual strings and allowlists | `rg` |
| Runtime | Build, dry-run, smoke, or unit checks | Existing project scripts |
| Manual | Maintainer decision or render-sensitive docs | Human inspection |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild` | Phase | Required | Cannot complete this phase truthfully |
| system-spec-kit validator | Internal | Required | Cannot claim completion without validation |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Verification fails or scope drift is detected.
- **Procedure**: Revert only files changed by this phase and restore child status to `draft` if needed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 007 p2-doc-drift | `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild` | Parent completion and final review rerun |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preflight | Low | 20-45m |
| Remediation | Medium | 1-3h |
| Verification | Medium | 30-90m |
| Documentation | Low | 20-45m |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Affected files read before edit
- [ ] Verification command selected
- [ ] Metadata update scoped to this child

### Rollback Procedure
1. Revert phase-owned edits only.
2. Re-run phase-specific verification.
3. Reset child metadata if completion evidence no longer holds.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Source and documentation edits only.

<!-- /ANCHOR:enhanced-rollback -->
