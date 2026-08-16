---
title: "Implementation Plan: sk-vision Pi symlink and dry factory"
description: "Create the relative symlink, document it, dry-load Pi. Absolute paths are a stop."
trigger_phrases:
  - "sk-vision pi symlink"
  - "sk-vision pi dry factory"
  - "sk-vision pi --offline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/002-symlink-and-dry-factory"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".pi/extensions/sk-vision.ts"
      - ".pi/extensions/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-002-symlink-and-dry-factory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision Pi symlink and dry factory

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
| **Language/Stack** | POSIX symlink + Pi CLI |
| **Framework** | Pi extension discovery |
| **Storage** | None |
| **Testing** | test -L / readlink / pi --offline --approve |

### Overview
Create the relative symlink, document it, dry-load Pi. Absolute paths are a stop.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met — evidence: REQ-001–REQ-004 satisfied; see `implementation-summary.md`
- [x] Tests passing (if applicable) — evidence: readlink + `pi --offline --approve` exit 0
- [x] Docs updated (spec/plan/tasks) — evidence: this closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Owner file plus relative discovery symlink

### Key Components
- **symlink**: .pi/extensions/sk-vision.ts
- **pi --offline --approve**: dry factory

### Data Flow
ln -s relative → Pi loads factory → session starts or fail-closes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .pi/extensions/sk-vision.ts | missing | relative symlink | readlink proof |
| .pi/extensions/README.md | inventory | add rows | rg sk-vision.ts |
| Pi session | must not fail-close | dry factory | pi --offline --approve |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm owner file exists
- [x] Read analog symlink

### Phase 2: Core Implementation
- [x] ln -s relative target
- [x] README rows
- [x] optional input hook

### Phase 3: Verification
- [x] readlink
- [x] pi --offline --approve
- [x] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A | None |
| Integration | Symlink + dry factory | readlink / pi |
| Manual | README rows | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-extension-factory | Internal | Yellow until Complete | Nothing to link |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
