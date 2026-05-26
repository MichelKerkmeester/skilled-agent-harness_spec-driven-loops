---
title: "Plan: API Response Shape Closure for F9 F32 F39 F97 F99"
description: "Implementation plan for sidecar-client testables separation, response alias compatibility, and pending-map discriminator narrowing."
trigger_phrases:
  - "020 004 plan"
  - "api response shape plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded"
    next_safe_action: "Implement scoped fixes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200040200040200040200040200040200040200040200040200040200040200"
      session_id: "020-004-api-response-shape"
      parent_session_id: null
    completion_pct: 10
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: API Response Shape Closure for F9 F32 F39 F97 F99

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
This packet edits the TypeScript mcp-server sidecar client and its hardening tests. The risk is public response-shape compatibility: field renames must be additive for one release cycle.

### Overview
Close F9 by moving test-only helper access to `sidecar-client.testables.ts`; close F32/F39/F97 by adding canonical camelCase fields plus deprecated aliases; close F99 by narrowing pending entries by discriminator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Packet folder scaffolded and strict-validated.
- Parent halt-on-first-regression rule read.
- `sidecar-client.ts`, `sidecar-client.testables.ts`, and `sidecar-hardening.vitest.ts` read before editing.

### Definition of Done
- Five findings closed or explicitly DEFERRED-AGAIN.
- Requested embedders vitest and mcp-server typecheck exit 0.
- Checklist, ADRs, implementation summary, and strict validation are complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use additive compatibility wrappers rather than hard response-shape breaks. Keep test-only helper exports in the dedicated testables module.

### Key Components
- `SidecarClient` request/response handling.
- `sidecar-client.testables.ts` for test-only helper exports.
- `sidecar-hardening.vitest.ts` for regression coverage.

### Data Flow
Worker response arrives at `handleMessage`, pending entry is looked up and narrowed by expected response type, then canonical response objects are resolved with deprecated aliases where needed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Risk | Guard |
|---------|------|-------|
| Production export surface | Medium | Remove only test-only `buildSidecarEnv` export; halt if live consumers exist |
| Response object shape | High | Emit both old and new names for one release cycle |
| Pending map internals | Medium | Keep type change local to `sidecar-client.ts` or DEFER-AGAIN |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Validate scaffold.
- Read predecessor docs, F37 precedent, current source/tests, and `ac54fd1062` sidecar diff.
- Grep consumer surface for `buildSidecarEnv`.

### Phase 2: Core Implementation
- Move test-only env helper access to `sidecar-client.testables.ts`.
- Add canonical camelCase response fields with deprecated aliases and once-per-process warning.
- Replace pending-map cast with discriminator-narrowing and structured malformed-entry rejection.

### Phase 3: Verification
- Run embedders vitest.
- Run mcp-server typecheck.
- Fill docs and strict-validate final packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Coverage |
|-------|----------|
| F9 import fixture | Hardening test imports `buildSidecarEnv` from `sidecar-client.testables.ts` |
| Response alias fixture | Response has canonical and legacy names; legacy read warns once |
| F99 fixture | Malformed pending entry rejects with structured `SidecarClientError` |
| Regression suite | Full `mcp_server/tests/embedders/` vitest run |
| Static check | mcp-server workspace typecheck |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Use |
|------------|-----|
| 020 parent spec | Halt-on-first-regression and bucket contract |
| F37 precedent | Production/test interface separation pattern |
| Bucket 1 commit `ac54fd1062` | Current sidecar env baseline |
| Findings registry | Source evidence for F9/F32/F39/F97/F99 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the three approved source/test files and packet docs. Since compatibility aliases are additive, rollback risk is limited to restoring the prior production export and response handling if verification exposes a regression.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Exit Criteria |
|-------|------------|---------------|
| Setup | Scaffold | Strict validate exit 0 |
| F9 | Setup | Consumer grep proves no live callers |
| Aliases | Setup | Field names identified in current response contract |
| F99 | Setup | Type change stays inside `sidecar-client.ts` |
| Verification | All implementation phases | Requested commands exit 0 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Research and scaffold | Small | Existing bucket docs provide shape |
| F9 | Small | Test import relocation if no live consumers |
| F32/F39/F97 | Medium | Public response shape compatibility |
| F99 | Medium | Type guard fixture and internal type cleanup |
| Verification/docs | Medium | Full requested command set |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm changed files are limited to approved paths.
- Confirm legacy aliases are additive and warning-only.

### Rollback Procedure
- Revert the scoped source/test edits.
- Restore docs to DEFERRED-AGAIN if implementation cannot safely land.

### Data Reversal
No persistent data migration is involved.
<!-- /ANCHOR:enhanced-rollback -->
