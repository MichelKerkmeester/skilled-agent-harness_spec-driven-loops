---
title: "Implementation Plan: sk-git README"
description: "Finalize the sk-git README by confirming the phase-001 golden example is current and valid, with no rewrite."
trigger_phrases:
  - "sk-git readme plan"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/003-sk-git-readme"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "README confirmed current and valid"
    next_safe_action: "Begin phase 019 (sk-prompt-models README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-018"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-git README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill README) |
| **Framework** | sk-doc readme validation, HVR scan, path resolution |
| **Storage** | None |
| **Testing** | `validate_document.py --type readme`, HVR scan, path resolution |

### Overview

Confirm rather than rewrite. The sk-git README was authored as the narrative golden example in phase 001. This phase validates its structure, re-checks the voice and verifies every cited path resolves against the current sk-git skill, then records the confirmation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Golden example exists and was committed in phase 001
- [x] sk-git skill unchanged during this packet

### Definition of Done
- [x] README structure validates (0 issues)
- [x] Prose HVR-clean
- [x] All nine cited paths resolve
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Confirm-not-rewrite. The exemplar stands; this phase verifies it.

### Key Components
- **The golden example**: `.opencode/skills/sk-git/README.md` from phase 001.

### Data Flow

Validate the README, re-check the voice, resolve the cited paths, record the confirmation in this phase's docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. No file change to the README; this phase only adds continuity docs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the README is the phase-001 golden example

### Phase 2: Core Implementation
- [x] Validate structure, re-check voice, resolve cited paths

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
| Accuracy | Cited paths | Host path resolution against sk-git tree |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 golden example | Internal | Green | No README to confirm |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The README turns out to be stale against the current sk-git skill.
- **Procedure**: Run the full per-skill recipe (gather plus dual-draft) to refresh it. Not needed here, the README verified clean.
<!-- /ANCHOR:rollback -->
