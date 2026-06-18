---
title: "Implementation Plan: system-spec-kit README"
description: "Gather and verify with a two-iteration deep-context sweep, dual-draft the reframed top, then restyle the 1084-line reference body in place keeping its depth."
trigger_phrases:
  - "system-spec-kit readme plan"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/023-system-spec-kit-readme"
    last_updated_at: "2026-06-07T17:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped system-spec-kit README restyle; Batch E 3 of 3"
    next_safe_action: "Begin phase 024 (skills index README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: system-spec-kit README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill README, 1084-line reference manual) |
| **Framework** | sk-doc readme validation, deep-context loop, cli-opencode dispatch |
| **Storage** | None |
| **Testing** | `validate_document.py --type readme`, HVR scan, path resolution, depth spot-check |

### Overview

Run a two-iteration deep-context sweep with DeepSeek v4 Pro and MiMo v2.5 Pro to verify the dense reference facts against source, dual-draft the reframed top matter, then restyle the body in place. Keep-depth forbids a regenerate, so the host preserves every reference block and only reframes the top and sweeps the house-voice violations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Template and golden example available
- [x] deep-context gather complete
- [x] 37 tools, env vars, levels verified against source

### Definition of Done
- [x] README reframed and restyled to the narrative voice, depth preserved
- [x] `validate_document.py --type readme` passes (0 issues)
- [x] Prose HVR-clean (no em dash, double-hyphen, semicolon, Oxford-comma list); stale facts corrected
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Gather and verify, dual-draft the top, restyle the body in place. Read-only seats gather, the host verifies and edits the file.

### Key Components
- **context/context-report.md**: the verified factual map and the consolidated stale-fact list.
- **drafts/**: the dual-model reframed top matter (DeepSeek bounded top was the base).
- **The restyle scripts**: deterministic, asserted top-splice + renumber + HVR sweep applied to the existing body.

### Data Flow

Seats verify the depth against source, the host writes the report, the models draft the reframed top, the host splices the top, renumbers the sections, sweeps HVR and softens drift-prone counts while preserving every reference block.
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
- [x] Seed the deep-context packet and seat prompts

### Phase 2: Core Implementation
- [x] Iteration 1 and 2 seats (DeepSeek + MiMo) verify the depth against source
- [x] Synthesize context-report.md (37 tools verified, version footer the one material stale fact)
- [x] Dual-draft the reframed top; restyle the body in place (top splice, renumber, HVR sweep)

### Phase 3: Verification
- [x] `validate_document.py --type readme` passes
- [x] HVR prose scan clean (em dash, double-hyphen, semicolon, Oxford-comma list)
- [x] `validate.sh --strict` on the phase; depth spot-check; links resolve
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | README | `validate_document.py` |
| Voice | README prose | HVR scan (code blocks exempt) |
| Accuracy | Tools, levels, env vars, paths, reference depth | Host SKILL.md, tool-schemas.ts, ENV_REFERENCE.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| deep-context gather | Internal | Green | No verified facts for the restyle |
| cli-opencode dispatch (DeepSeek, MiMo) | Internal | Green | No dual-draft top |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README reads worse than the prior version, loses depth or fails validation.
- **Procedure**: Revert the README with git. No runtime impact.
<!-- /ANCHOR:rollback -->
