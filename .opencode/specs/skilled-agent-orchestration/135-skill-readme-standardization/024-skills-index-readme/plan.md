---
title: "Implementation Plan: skills index README"
description: "Build the catalog from the rewritten child READMEs, dual-draft the index, then merge and verify every skill link."
trigger_phrases:
  - "skills index readme plan"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/024-skills-index-readme"
    last_updated_at: "2026-06-07T19:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped skills index README; packet 135 complete 24 of 24"
    next_safe_action: "Packet 135 complete; no further phases"
    blockers: []
    key_files:
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: skills index README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skills index README) |
| **Framework** | sk-doc readme validation, cli-opencode dispatch |
| **Storage** | None |
| **Testing** | `validate_document.py --type readme`, HVR scan, link resolution |

### Overview

The catalog is built directly from the 22 rewritten child READMEs (their verified one-line pitches), so no fresh gather dispatch is needed. Two models dual-draft the index from that catalog, the template and the golden example; the host merges, verifies every skill link resolves, and publishes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Template and golden example available
- [x] Catalog built from the 22 rewritten READMEs
- [x] Stale facts identified (count, system-code-graph, version pins)

### Definition of Done
- [x] Index rewritten to the narrative skeleton with the family catalog
- [x] `validate_document.py --type readme` passes (0 issues)
- [x] Prose HVR-clean, every skill link resolves
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Catalog-from-children, dual-draft, merge. The host built the catalog, the models draft, the host verifies and writes.

### Key Components
- **context/context-report.md**: the verified catalog and stale-fact list.
- **drafts/**: the two model drafts the host merges.

### Data Flow

The 22 rewritten READMEs supply the one-liners, the host writes the catalog, the models draft the index, the host verifies links and merges.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. Documentation-only change to one index README.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Collect the 22 skill one-liners and confirm the five families

### Phase 2: Core Implementation
- [x] Build context-report.md catalog and the stale-fact list
- [x] Dual-draft the index (DeepSeek + MiMo)
- [x] Merge, fix stale facts, verify links; write `.opencode/skills/README.md`

### Phase 3: Verification
- [x] `validate_document.py --type readme` passes
- [x] HVR prose scan clean; every skill link resolves
- [x] `validate.sh --strict` on the phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Index | `validate_document.py` |
| Voice | Index prose | HVR scan (code blocks exempt) |
| Accuracy | Catalog, families, links | Directory tree and the rewritten READMEs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rewritten child READMEs | Internal | Green | No verified catalog one-liners |
| cli-opencode dispatch (DeepSeek, MiMo) | Internal | Green | No dual-draft |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Index reads worse than the prior version or fails validation.
- **Procedure**: Revert the index with git. No runtime impact.
<!-- /ANCHOR:rollback -->
