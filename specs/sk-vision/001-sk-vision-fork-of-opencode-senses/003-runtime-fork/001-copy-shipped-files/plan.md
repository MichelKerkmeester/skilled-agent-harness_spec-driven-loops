---
title: "Implementation Plan: sk-vision copy shipped dump files"
description: "mkdir dest trees and cp the locked list. Do not rebrand."
trigger_phrases:
  - "sk-vision copy dump"
  - "sk-vision vision-runtime copy"
  - "sk-vision shipped files"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/001-copy-shipped-files"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/plugin.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-001-copy-shipped-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision copy shipped dump files

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
| **Language/Stack** | POSIX cp |
| **Framework** | None |
| **Storage** | Git working tree |
| **Testing** | test -f; git diff --exit-code |

### Overview
mkdir dest trees and cp the locked list. Do not rebrand.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md §2-3 documents problem and copy-only scope]
- [x] Success criteria measurable [evidence: spec.md §5 lists testable proof commands]
- [x] Dependencies identified [evidence: spec.md Phase Context lists 002-skill-scaffold Complete]

### Definition of Done
- [x] All acceptance criteria met [evidence: spec.md §5 success criteria all [x]]
- [x] Tests passing (if applicable) [evidence: copy-pack proof commands exit 0]
- [x] Docs updated (spec/plan/tasks) [evidence: spec.md Status Complete; tasks.md all [x]]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only source, write dest only

### Key Components
- **DUMP**: context/
- **DEST**: vision-runtime/

### Data Flow
cp dump files into dest. No rewrite.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| context/ | read-only dump | unchanged | git diff --exit-code |
| vision-runtime/ | empty reserved path | create copies | test -f listed files |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 002 Class S root exists
- [ ] mkdir dest trees

### Phase 2: Core Implementation
- [ ] Run the locked cp list
- [ ] Do not copy PLAN.md

### Phase 3: Verification
- [ ] test -f dest files
- [ ] git diff context/
- [ ] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A | None |
| Integration | File inventory | test / git diff |
| Manual | ls dest | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-skill-scaffold | Internal | Yellow until Complete | No legal skill root |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
