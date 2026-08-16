---
title: "Implementation Plan: sk-vision SKILL.md"
description: "Write SKILL.md from the verbatim skeleton and stub references/. Do not run ci-skill-root-metadata.cjs in this child."
trigger_phrases:
  - "sk-vision skill md"
  - "sk-vision when to use"
  - "sk-vision reserved paths"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/001-skill-md"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-002-skill-scaffold-001-skill-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision SKILL.md

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill body |
| **Framework** | Class S SKILL.md contract |
| **Storage** | None |
| **Testing** | test -f / rg |

### Overview
Write SKILL.md from the verbatim skeleton and stub references/. Do not run ci-skill-root-metadata.cjs in this child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone skill body first, metadata second

### Key Components
- **SKILL.md**: advisor triggers and reserved paths
- **references/**: empty leaf root

### Data Flow
Operator writes SKILL.md. Advisor later reads WHEN TO USE. Runtime still absent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md | missing | create | test -f .opencode/skills/sk-vision/SKILL.md |
| references/.gitkeep | missing | create | test -f .opencode/skills/sk-vision/references/.gitkeep |
| vision-runtime | must stay empty | unchanged | test ! -e or empty dir |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm 001-research is Complete
- [x] mkdir skill root and references/

### Phase 2: Core Implementation
- [x] Write SKILL.md verbatim from File 1
- [x] Do not write JSON manifests

### Phase 3: Verification
- [x] test -f SKILL.md
- [x] rg WHEN NOT TO USE
- [x] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A | None |
| Integration | File existence | test / rg |
| Manual | Read SKILL.md headings | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-research | Internal | Green | Class S lock missing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
