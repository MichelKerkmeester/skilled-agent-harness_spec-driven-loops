---
title: "Implementation Plan: cli-opencode README"
description: "Gather context with a two-iteration deep-context sweep, dual-draft with DeepSeek and MiMo, then merge and verify the narrative README."
trigger_phrases:
  - "cli-opencode readme plan"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/005-cli-opencode-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "README shipped and validated; Batch A complete"
    next_safe_action: "Begin phase 006 (deep-ai-council README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-opencode README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill README) |
| **Framework** | sk-doc readme validation, deep-context loop, cli-opencode dispatch |
| **Storage** | None |
| **Testing** | `validate_document.py --type readme`, HVR scan |

### Overview

Run the full per-skill recipe: a two-iteration deep-context sweep with DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats, host verification against SKILL.md, a synthesized context report, then a dual-model draft that the host merges into the final README.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Template and golden example available
- [x] deep-context gather complete
- [x] Facts verified against SKILL.md

### Definition of Done
- [x] README rewritten to the narrative skeleton
- [x] `validate_document.py --type readme` passes (0 issues)
- [x] HVR-clean, stale version and count dropped
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Gather then draft then merge. Read-only model seats gather context, the host writes all state and the final file.

### Key Components
- **context/context-report.md**: the synthesized factual map.
- **drafts/**: the two model drafts the host merges.

### Data Flow

Seats return findings, host synthesizes the report, models draft from the report, host merges and writes the README.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. Documentation-only change to one README.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Seed the deep-context packet

### Phase 2: Core Implementation
- [x] Iteration 1 and 2 seats (DeepSeek + MiMo)
- [x] Synthesize context-report.md
- [x] Dual-draft and merge into the README

### Phase 3: Verification
- [x] `validate_document.py --type readme` passes
- [x] HVR scan clean
- [x] `validate.sh --strict` on the phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | README | `validate_document.py` |
| Voice | README | HVR scan |
| Accuracy | Flags, providers, files | Host SKILL.md in context |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| deep-context gather | Internal | Green | No grounded context for the draft |
| cli-opencode dispatch (DeepSeek, MiMo) | Internal | Green | No dual-draft |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README reads worse than the prior version or fails validation.
- **Procedure**: Revert the README with git. No runtime impact.
<!-- /ANCHOR:rollback -->
