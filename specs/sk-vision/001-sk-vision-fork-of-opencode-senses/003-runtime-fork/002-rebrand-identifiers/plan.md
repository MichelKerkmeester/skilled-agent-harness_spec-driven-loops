---
title: "Implementation Plan: sk-vision rebrand identifiers"
description: "Apply the table longest-token-first in dest. Keep LICENSE author. Do not build yet."
trigger_phrases:
  - "sk-vision rebrand"
  - "sk-vision SK_VISION_"
  - "sk-vision package name"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/002-rebrand-identifiers"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-002-rebrand-identifiers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision rebrand identifiers

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
| **Language/Stack** | TypeScript + Python source rewrite |
| **Framework** | None |
| **Storage** | None |
| **Testing** | rg identifier inventory |

### Overview
Apply the table longest-token-first in dest. Keep LICENSE author. Do not build yet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md §2-3]
- [x] Success criteria measurable [evidence: spec.md §5 rg proof commands]
- [x] Dependencies identified [evidence: spec.md predecessor 001-copy-shipped-files]

### Definition of Done
- [x] All acceptance criteria met [evidence: spec.md §5 all [x]]
- [x] Tests passing (if applicable) [evidence: rg inventory proofs pass]
- [x] Docs updated (spec/plan/tasks) [evidence: spec.md Status Complete; tasks.md all [x]]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical identifier rewrite

### Key Components
- **Find/replace table**: locked in spec.md
- **LICENSE**: Adarsh line exception

### Data Flow
Edit dest files. context/ stays untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| vision-runtime source | copied dump identifiers | rewrite | rg inventory |
| context/ | read-only | unchanged | git diff --exit-code |
| LICENSE | Adarsh copyright | append notice only | rg Adarsh |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm copied files exist [evidence: 14 vision-runtime files present]
- [x] Read longest-token-first table [evidence: spec.md copy pack applied]

### Phase 2: Core Implementation
- [x] Apply replacements [evidence: NO_SENSES_OUTSIDE_LICENSE; NO_OLD]
- [x] Set package name [evidence: package.json name sk-vision]
- [x] Fix runtime.py model comment [evidence: moondream2 in header and DEFAULT_MODEL]

### Phase 3: Verification
- [x] rg sk_vision_query empty [evidence: rg no matches]
- [x] package.json name [evidence: line 2 match]
- [x] validate.sh --strict [evidence: RESULT PASSED]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A until next child | rg |
| Integration | Identifier inventory | rg |
| Manual | Read LICENSE | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-copy-shipped-files | Internal | Yellow until Complete | Nothing to rewrite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
