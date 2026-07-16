---
title: "Plan: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers"
description: "Canonical-anchor plan for closing F18, F20, F25, F57, F62, F73, and F91 in sidecar-client.ts."
trigger_phrases:
  - "arc 010 003 003 plan"
  - "sidecar-client p1 constructor helpers plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-sidecar-client-p1-plan"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0100030030100030030100030030100030030100030030100030030100030030"
      session_id: "010-003-003-sidecar-client-p1"
      parent_session_id: null
    completion_pct: 100
---
# Plan: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js child-process sidecar IPC |
| **Findings** | F18, F20, F25, F57, F62, F73, F91 |
| **Evidence** | Arc 010/001 `findings-registry.json`; F37 and F79 sibling precedents |

This child phase narrows the sidecar client API, removes dead/readiness and trivial-helper drift, flattens embed validation, and makes response discriminator handling explicit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase parent scope confirms this child owns sidecar-client constructor/helper findings.
- [x] Registry rows for F18, F20, F25, F57, F62, F73, and F91 are identified.
- [x] F37 production/test option split precedent and F79 single-promise lifecycle precedent are loaded.

### Definition of Done
- [x] All 7 P1 finding rows are closed in `checklist.md` with file:line evidence.
- [x] F18, F57, and F62 have focused fixture coverage.
- [x] Full embedders vitest, MCP server typecheck, alignment drift check, and strict spec validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- `SidecarClientOptions` contains only production fields: provider, model, dimensions, backend.
- `SidecarClientTestOptions` owns worker path, timeout, allowlist, and env injection knobs.
- `EmbedOptions` is canonical in `sidecar-client.ts`; execution-router imports it instead of defining a duplicate.
- `SidecarClient.ready()` is removed; the sidecar execution router uses the adapter surface without readiness.
- Termination uses one grace-period helper for SIGTERM then SIGKILL sequencing.
- `embed()` delegates validation to `validateEmbedInput()` before dispatch.
- `handleResponseLine()` narrows by `type` before resolving or rejecting pending requests.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| `sidecar-client.ts` constructor/options | F18 | Production and test-only options are separated at the type boundary. |
| `sidecar-client.ts` and `execution-router.ts` embed options | F20 | One canonical `EmbedOptions` interface feeds both client and router. |
| `sidecar-client.ts` helpers | F25, F57, F91 | Trivial helpers are folded; retained helpers encode validation, env filtering, default path resolution, or termination policy. |
| `sidecar-client.ts` response handling | F62 | Unknown discriminators reject with `SidecarClientError`. |
| `sidecar-hardening.vitest.ts` | F57, F62 | Runtime fixtures prove grace sequencing and unknown-type rejection. |
| `sidecar-client.testables.ts` | F18 | Compile-time fixture proves production options reject test-only fields. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Scaffold this Level 2 child, read current packet docs, the 010/003 parent, registry evidence, F37/F79 precedents, canonical sibling anchors, `sidecar-client.ts`, `execution-router.ts`, and `sidecar-hardening.vitest.ts`.

### Phase 2: Core Implementation
Apply one surgical client pass: export canonical `EmbedOptions`, overload the constructor for production/test options, remove `ready()`, fold trivial helpers, add `validateEmbedInput()`, consolidate termination signal sequencing, and replace response assertion with discriminator narrowing.

### Phase 3: Verification
Add F18/F57/F62 fixtures, run full embedders vitest, run MCP server typecheck, run OpenCode alignment verification, update packet docs, and run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Finding | Required Test |
|---------|---------------|
| F18 | `sidecar-client.testables.ts` uses `@ts-expect-error` to prove `workerPath` is rejected by `SidecarClientOptions` and accepted by `SidecarClientTestOptions`. |
| F57 | `sidecar-hardening.vitest.ts` verifies a SIGTERM-ignoring child receives SIGTERM, survives the grace period, then is killed. |
| F62 | `sidecar-hardening.vitest.ts` verifies unknown response `type` rejects with `SidecarClientError` code `sidecar-response-type-unknown`. |
| All | Full embedders vitest, MCP server typecheck, alignment drift check, and strict validation pass. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node:child_process` forked worker behavior | Runtime | Available | F57 fixture depends on real child process signal handling. |
| `SidecarClientOptions` import in execution-router | Type boundary | Available | F20 needs only a type-level router import change. |
| TypeScript `@ts-expect-error` | Compile fixture | Available | F18 negative fixture fails typecheck if production options widen again. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If verification fails, revert only the `sidecar-client.ts`, `execution-router.ts`, `sidecar-client.testables.ts`, and `sidecar-hardening.vitest.ts` hunks from this phase and reset packet docs to incomplete. Do not touch sidecar-worker, launcher, reindex, barrel, registry, schema, or parent review artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Arc 010/001 evidence and arc 010/002 precedents | Phase 2 implementation |
| Phase 2: Core Implementation | Current source/test files | Phase 3 verification |
| Phase 3: Verification | Successful code/test edits | Parent handoff and commit by parent agent |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| API/type cleanup | Small | F18/F20/F73 are local type/API surface changes. |
| Helper and validation cleanup | Medium | F25/F57/F91 affect request lifecycle readability. |
| Response handling and fixtures | Medium | F62 needs discriminator validation and runtime fixture coverage. |
| Documentation and validation | Small | Canonical anchors plus evidence updates and strict validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record any failed verification command in `implementation-summary.md` with the exit code and stderr summary. Do not advance parent handoff if full embedders vitest, typecheck, alignment drift check, or strict validation fails.
<!-- /ANCHOR:enhanced-rollback -->
