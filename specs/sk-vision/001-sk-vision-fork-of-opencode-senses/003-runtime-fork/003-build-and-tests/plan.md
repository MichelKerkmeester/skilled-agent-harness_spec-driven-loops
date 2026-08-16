---
title: "Implementation Plan: sk-vision build and tests"
description: "Install, build, test, then rg. GPU is the next child."
trigger_phrases:
  - "sk-vision bun build"
  - "sk-vision dist plugin"
  - "sk-vision bun test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/003-build-and-tests"
    last_updated_at: "2026-08-16T10:15:00.000Z"
    last_updated_by: "code-agent"
    recent_action: "bun install/build/test passed; plan phases and DoD complete."
    next_safe_action: "004-gpu-smoke"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/dist/plugin.js"
      - ".opencode/skills/sk-vision/vision-runtime/dist/python/runtime.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-003-build-and-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision build and tests

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
| **Language/Stack** | Bun + TypeScript |
| **Framework** | Dump scripts/build.ts |
| **Storage** | node_modules / dist |
| **Testing** | bun test; rg |

### Overview
Install, build, test, then rg. GPU is the next child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met [evidence: spec.md §5 success criteria all [x]]
- [x] Tests passing (if applicable) [evidence: `bun test` exit 0, 8/8 pass]
- [x] Docs updated (spec/plan/tasks) [evidence: this child marked Complete; implementation-summary updated]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Package build then test

### Key Components
- **build.ts**: emits dist/plugin.js
- **bun test**: dump tests after rebrand

### Data Flow
bun install → bun run build → dist/plugin.js → bun test → rg.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| dist/plugin.js | missing | generate | test -f |
| dump tests | copied then rebranded | run | bun test |
| identifier inventory | must be clean | rg | LICENSE exception only |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] cd vision-runtime
- [x] bun install or document tsc

### Phase 2: Core Implementation
- [x] bun run build
- [x] test -f dist/plugin.js
- [x] bun test

### Phase 3: Verification
- [x] rg identifier inventory
- [x] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Dump photon/runtime tests | bun test |
| Integration | Build artifact | test -f dist/plugin.js |
| Manual | rg inventory | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-rebrand-identifiers | Internal | Complete | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
