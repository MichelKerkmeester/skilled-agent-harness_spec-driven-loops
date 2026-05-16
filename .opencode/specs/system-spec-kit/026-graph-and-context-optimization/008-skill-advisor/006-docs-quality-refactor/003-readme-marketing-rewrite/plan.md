---
title: "Implementation Plan: 003-readme-marketing-rewrite (skeleton)"
description: "Plan skeleton — fills post-001 synthesis with concrete section outlines."
trigger_phrases:
  - "003 readme marketing plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "006-docs-quality-refactor/003-readme-marketing-rewrite"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded plan skeleton"
    next_safe_action: "Fill post-001"
    blockers: ["001 not shipped"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 003-readme-marketing-rewrite

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc skill_readme template + HVR rules |
| **Storage** | n/a |
| **Testing** | HVR grep + sk-doc validate + peer-read |

### Overview
Full rewrite of README.md targeting ~2000 words across 9 numbered sections, marketing-but-HVR-compliant.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 001 research.md ships with iter 02 README gap findings
- [ ] USP list confirmed

### Definition of Done
- [ ] README ≈ 1800-2200 words
- [ ] HVR grep clean
- [ ] sk-doc skill_readme anchors all present
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Marketing voice anchored on peer `system-code-graph/README.md`. Less marketing than root README but more than current reference-style README.

### Key Components
- USP narrative paragraphs (8 selling points)
- Tables for stats, features, comparisons
- Quick-start with copyable commands

### Data Flow
n/a
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read iter 02 README findings
- [ ] Re-read peer system-code-graph/README.md for voice ceiling

### Phase 2: Core Implementation
- [ ] Author 9 sections (OVERVIEW → RELATED DOCUMENTS)
- [ ] Map each USP to a section

### Phase 3: Verification
- [ ] HVR grep sweep
- [ ] sk-doc strict validate
- [ ] User read-through
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| HVR compliance | README.md | rg with hard-blocker word list |
| Template adherence | README.md anchors | manual diff vs sk-doc skill_readme |
| Voice match | README.md vs peer | side-by-side read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 research.md iter 02 | Internal | Blocked | Cannot author until iter findings shipped |
| sk-doc/references/global/hvr_rules.md | Internal | Green | n/a |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: HVR grep fails after rewrite
- **Procedure**: Revert single-file via `git checkout -- README.md`
<!-- /ANCHOR:rollback -->
