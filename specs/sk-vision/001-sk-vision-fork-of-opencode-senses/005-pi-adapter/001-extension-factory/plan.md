---
title: "Implementation Plan: sk-vision Pi extension factory"
description: "Write the owner factory from the skeleton. Do not symlink yet."
trigger_phrases:
  - "sk-vision pi factory"
  - "sk-vision registerTool"
  - "sk-vision ExtensionFactory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/001-extension-factory"
    last_updated_at: "2026-08-16T10:30:00.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Definition of Done and phase checklists marked complete."
    next_safe_action: "002-symlink-and-dry-factory"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-001-extension-factory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision Pi extension factory

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
| **Language/Stack** | TypeScript ExtensionFactory |
| **Framework** | Pi 0.84.2 types |
| **Storage** | None |
| **Testing** | Read default export; rg registerTool |

### Overview
Write the owner factory from the skeleton. Do not symlink yet.
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
- [x] Tests passing (if applicable) — evidence: rg/copy-pack proofs pass; no unit suite in scope
- [x] Docs updated (spec/plan/tasks) — evidence: this closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Owner-tree factory, load-path later

### Key Components
- **sk-vision.ts**: ExtensionFactory
- **RuntimeClient / PhotonProvider**: 003 core

### Data Flow
Pi will later load the symlink → factory → registerTool × 13 → shutdown close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| pi/sk-vision.ts | missing | create function export | rg export default function |
| .pi/extensions/sk-vision.ts | must not exist yet | unchanged | test ! -e |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm 003 RuntimeClient exists
- [x] Read analog git-preflight-advisory.ts

### Phase 2: Core Implementation
- [x] Write function default export
- [x] Register 13 tools
- [x] Close client on shutdown

### Phase 3: Verification
- [x] rg sk_vision_query empty
- [x] test ! -e .pi/extensions/sk-vision.ts (orchestrator gate at factory delivery)
- [x] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A | None |
| Integration | Export shape | rg |
| Manual | Read analog | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-runtime-fork | Internal | Complete | No provider to call |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
