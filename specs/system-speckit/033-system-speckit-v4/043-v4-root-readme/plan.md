---
title: "Implementation Plan: Phase 43: v4-root-readme"
description: "Phased refinement of the root README.md to eliminate bloat, re-home misplaced sections, fix agent/skill inventories, populate empty FAQs, and apply Human Voice Rules."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "readme plan"
  - "hvr cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 43: v4-root-readme

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown / POSIX documentation |
| **Framework** | sk-doc (sk-create-readme, sk-create-with-human-voice) |
| **Storage** | Git tracked documentation |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `validate.sh` |

### Overview

Execute a structured, multi-pass refinement of the root `README.md`. First, correct document structure (single H1, blockquote tagline, table formatting, section unnesting). Second, reconcile factual contents (12 agents, 13 skills, populated FAQs, current v4 doctor notes). Third, execute a Human Voice Rules (HVR) linguistic pass to eliminate semicolons, Oxford commas, and corporate/AI filler words. Finally, verify against all automated linters and spec-kit validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and 10 requirements documented in `spec.md`
- [x] Linting and validation scripts verified operational (`validate_document.py`, `hvr_scan.py`, `validate.sh`)
- [x] Baseline HVR scan and reference check executed

### Definition of Done
- [ ] `README.md` updated with all 10 requirements fulfilled
- [ ] `validate_document.py README.md` passes with exit 0 and zero issues
- [ ] `hvr_scan.py README.md` reports 0 hard semicolons and 0 hard word blockers
- [ ] `validate.sh specs/system-speckit/033-system-speckit-v4/043-v4-root-readme --strict` passes with `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
General Project README pattern following `sk-create-readme/references/readme/types-and-voice.md` (two-tier voice: narrative overview and technical reference sections).

### Key Sections
- **Header & Overview**: Plain title, blockquote tagline, clean badges, scannable architecture table, overview and gate diagram.
- **Quick Start**: Installation, verification, and first use.
- **Features**: Spec Kit framework, continuity & retrieval, Skill Advisor, Deep Loop, Skills Library (13 skills), Agent Network (12 agents), Commands, Goal Plugin, Code Mode MCP, and Git Worktree & Live Sync.
- **Configuration**: Customizing for your stack (13 skills mapped), core config files, and MCP config shape.
- **FAQ**: Complete Q&A set with zero empty entries.
- **Related Documents**: Verified links to repository manuals and guides.

### Data Flow
Readers navigate progressively from high-level tagline and overview to quick start, feature deep dives, configuration guides, and troubleshooting FAQs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md` | Root orientation and entry point | Structural, factual, and linguistic cleanup | `validate_document.py`, `hvr_scan.py` |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Parent phase coordination | Update Phase 43 map row and handoff criteria | `validate.sh ../ --strict` |
| `specs/system-speckit/033-system-speckit-v4/043-v4-root-readme/*` | Phase 43 specification packet | Author and complete Level 2 artifacts | `validate.sh . --strict` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document Structure | Markdown heading hierarchy, section tags | `validate_document.py` |
| Linguistic Quality | Punctuation rules, word blockers, tells | `hvr_scan.py` |
| Spec Consistency | Packet completeness, metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3 environment | Internal tool runtime | Green | Required for validator and scanner |
| `system-spec-kit` CLI | Internal tool runtime | Green | Required for spec validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Accidental corruption of technical commands or broken document validation.
- **Procedure**: Revert `README.md` using `git checkout HEAD -- README.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Structural fixes) ──► Phase 2 (Factual fixes) ──► Phase 3 (HVR & Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup & Structure | None | Factual Content |
| Factual Content | Setup & Structure | HVR & Verification |
| HVR & Verification | Factual Content | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup & Structure | Low | 30 minutes |
| Factual Content | Medium | 45 minutes |
| HVR & Verification | Medium | 45 minutes |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Initial state of `README.md` inspected and backed up in git history
- [x] Validation tooling tested on current tree

### Rollback Procedure
1. Run `git checkout HEAD -- README.md` to restore original README.
2. Verify with `git status` that working tree matches clean state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
