---
title: "Implementation Plan: README template and standard"
description: "Read the sk-doc readme validation rules and HVR, redesign the template scaffold to the narrative voice within numbered ALL-CAPS sections, then prove it on the sk-git README."
trigger_phrases:
  - "readme template plan"
  - "narrative skeleton plan"
  - "sk-doc template rewrite"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-skill-readme-standardization/001-readme-template-and-standard"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Template + golden example shipped and validated"
    next_safe_action: "Begin batch A skill README rewrites (phases 002-005)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/skill/skill_readme_template.md"
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Validator parses only numbered H2 headers, so READMEs keep numbered ALL-CAPS sections"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: README template and standard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-doc templates and skill READMEs) |
| **Framework** | sk-doc validation (`validate_document.py`, `template_rules.json`) |
| **Storage** | None |
| **Testing** | `validate_document.py --type readme`, HVR scan |

### Overview

Read the sk-doc readme rules and the Human Voice Rules first, then redesign the template scaffold so the narrative voice (human pitch, At-a-Glance table, problem-first overview, verification close) lives inside numbered ALL-CAPS sections the validator accepts. Prove the design by rewriting the sk-git README as the golden example.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (readme rules, HVR)

### Definition of Done
- [x] Template rewritten to the narrative skeleton
- [x] Golden example passes `validate_document.py --type readme` (0 issues)
- [x] Template and example are HVR-clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Template plus exemplar. The template carries the rules and a fillable scaffold. The golden example is the scaffold filled for a real skill, so later phases copy from a working reference.

### Key Components
- **skill_readme_template.md**: the section model, writing rules, fillable scaffold and validation checklist.
- **sk-git/README.md**: the golden example that conforms to the template.

### Data Flow

A phase copies the scaffold, fills it from the skill's real files, then validates with `validate_document.py` before commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is a documentation change with no bug fix, no security surface and no shared-policy change. The only producers are the template and one README, and there are no runtime consumers.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read the contract
- [x] Read `template_rules.json` readme rules
- [x] Read `hvr_rules.md`
- [x] Confirm the validator parses only numbered H2 headers

### Phase 2: Rewrite the template
- [x] New section model and writing rules
- [x] New fillable scaffold (numbered ALL-CAPS narrative sections)
- [x] New validation checklist

### Phase 3: Prove and verify
- [x] Author the sk-git golden example
- [x] Pass `validate_document.py --type readme`
- [x] HVR scan clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Template and golden example | `validate_document.py` |
| Voice | Template and golden example | HVR scan (em dash, semicolon, Oxford comma, banned words) |
| Manual | Readability and accuracy of facts | Read against sk-git SKILL.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc readme rules | Internal | Green | Template could fail validation |
| HVR rules | Internal | Green | Voice would drift from the house style |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new template or golden example fails validation or reads worse than the old one.
- **Procedure**: Revert the two changed files with git. No runtime or data impact.
<!-- /ANCHOR:rollback -->
