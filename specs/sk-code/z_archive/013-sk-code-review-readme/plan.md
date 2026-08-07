---
title: "Implementation Plan: sk-code-review README"
description: "Gather context with a two-iteration deep-context sweep, dual-draft with DeepSeek and MiMo, correct the output contract, then merge the narrative README."
trigger_phrases:
  - "sk-code-review readme plan"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/013-sk-code-review-readme"
    last_updated_at: "2026-06-07T13:52:39Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "README shipped and validated"
    next_safe_action: "Begin phase 016 (sk-code README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code-review README

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
| **Testing** | `validate_document.py --type readme`, HVR scan, path resolution |

### Overview

Run the full per-skill recipe: a two-iteration deep-context sweep with DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats, host correction of the output contract to its authoritative shape, a synthesized context report, then a dual-model draft the host merges and validates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Template and golden example available
- [x] deep-context gather complete
- [x] Output contract and reference set verified against SKILL.md

### Definition of Done
- [x] README rewritten to the narrative skeleton
- [x] `validate_document.py --type readme` passes (0 issues)
- [x] Prose HVR-clean, output contract corrected, drift dropped
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Gather then draft then merge. Read-only seats gather, the host corrects the contract and writes the final file.

### Key Components
- **context/context-report.md**: the synthesized factual map with the contract corrected.
- **drafts/**: the two model drafts the host merges.

### Data Flow

Seats return findings, host synthesizes the report and pins the correct output contract, models draft, host scans and merges into the README.
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
- [x] Synthesize context-report.md with the contract corrected
- [x] Dual-draft and merge into the README

### Phase 3: Verification
- [x] `validate_document.py --type readme` passes
- [x] HVR prose scan clean
- [x] `validate.sh --strict` on the phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | README | `validate_document.py` |
| Voice | README prose | HVR scan (code blocks exempt) |
| Accuracy | Output contract, severity, paths | Host SKILL.md, review_core.md and tree |
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
