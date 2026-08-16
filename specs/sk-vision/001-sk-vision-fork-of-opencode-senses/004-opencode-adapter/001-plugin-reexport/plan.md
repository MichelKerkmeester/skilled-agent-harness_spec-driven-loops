---
title: "Implementation Plan: sk-vision OpenCode plugin re-export"
description: "Prove the import target, write the analog re-export, prove it is not a symlink."
trigger_phrases:
  - "sk-vision opencode plugin"
  - "sk-vision.js re-export"
  - "sk-vision plugin file"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/001-plugin-reexport"
    last_updated_at: "2026-08-16T08:20:00.000Z"
    last_updated_by: "cursor-code"
    recent_action: "Created .opencode/plugins/sk-vision.js thin re-export; copy-pack proofs passed."
    next_safe_action: "002-readme-and-proof"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/plugins/sk-vision.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-004-opencode-adapter-001-plugin-reexport"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision OpenCode plugin re-export

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
| **Language/Stack** | JavaScript ESM re-export |
| **Framework** | OpenCode plugin discovery |
| **Storage** | None |
| **Testing** | test -f / test ! -L / rg |

### Overview
Prove the import target, write the analog re-export, prove it is not a symlink.
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
Thin host load path over skill dist/

### Key Components
- **sk-vision.js**: default re-export
- **dist/plugin.js**: canonical factory

### Data Flow
OpenCode loads plugins/sk-vision.js → skill dist/plugin.js hooks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| dist/plugin.js | canonical factory | unchanged | test -f |
| .opencode/plugins/sk-vision.js | missing | create regular file | test ! -L |
| opencode.json | no plugin array | unchanged | do not edit in this child |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] test -f dist/plugin.js
- [x] Read analog mk-communication-projection.js

### Phase 2: Core Implementation
- [x] Write re-export bytes
- [x] Do not symlink

### Phase 3: Verification
- [x] test ! -L
- [x] rg import path
- [x] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A | None |
| Integration | File type and import | test / rg |
| Manual | Read analog | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-runtime-fork/003-build-and-tests | Internal | Yellow until Complete | No import target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
