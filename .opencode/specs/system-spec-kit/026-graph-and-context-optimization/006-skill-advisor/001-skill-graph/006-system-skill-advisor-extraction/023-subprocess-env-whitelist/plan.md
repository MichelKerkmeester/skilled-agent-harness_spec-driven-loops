---
title: "Implementation Plan: Subprocess env whitelist"
description: "Hardens the three named advisor subprocess spawn surfaces with explicit environment allowlists and tests that parent secrets do not leak."
trigger_phrases:
  - "018 subprocess env follow-on"
  - "subprocess env whitelist"
  - "advisor env hardening"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/023-subprocess-env-whitelist"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "Subprocess env whitelist implemented"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Implementation Plan: Subprocess env whitelist

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Python, Markdown |
| **Framework** | Vitest, Node, Python stdlib |
| **Storage** | Advisor database side files where applicable |
| **Testing** | Focused Vitest, syntax checks, full advisor Vitest, strict spec validation |

### Overview
Hardens the three named advisor subprocess spawn surfaces with explicit environment allowlists and tests that parent secrets do not leak.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 018 source summary read.
- [x] Current target files audited.
- [x] Level 2 packet scaffolded.

### Definition of Done
- [x] Scoped source/docs implemented.
- [x] Focused verification passes.
- [x] Full advisor Vitest and strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small boundary hardening with tests at the closest stable seam.

### Key Components
- **Advisor package**: owns tests and runtime advisor logic.
- **Spec-kit bridge**: keeps the OpenCode plugin subprocess contract.
- **Spec packet docs**: preserve close-out evidence for resume and audit.

### Data Flow
The user prompt enters runtime hooks or the OpenCode plugin, reaches advisor bridge logic, and returns bounded recommendation metadata. This packet keeps that flow stable while narrowing test or runtime boundaries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Target surface | Modify | Focused tests and strict validation |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Target surface | Modify | Focused tests and strict validation |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Target surface | Modify | Focused tests and strict validation |
| `Advisor tests` | Target surface | Modify | Focused tests and strict validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Audit three spawn sites.

### Phase 2: Core Implementation
- [x] Add allowlist helpers and tests.

### Phase 3: Verification
- [x] Run focused env, bridge, launcher, and shim tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Focused | Packet-owned code and tests | `npm test -- ...` |
| Syntax | JS/Python entrypoints | `node -c`, `node --check`, `py_compile` |
| Package | Full advisor package | `npm test` |
| Metadata | New packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor test runner | Internal | Available | Cannot prove no vitest regression. |
| Spec validator | Internal | Available | Cannot claim packet completion. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Focused tests fail, full advisor suite regresses, or strict validation fails.
- **Procedure**: Revert this packet's scoped commit and rerun the focused tests listed above.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 and audit | Core |
| Core | Setup | Verification |
| Verification | Core | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed in-session |
| Core Implementation | Medium | Completed in-session |
| Verification | Medium | In progress |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git revert restores source, tests, and docs.
<!-- /ANCHOR:enhanced-rollback -->
