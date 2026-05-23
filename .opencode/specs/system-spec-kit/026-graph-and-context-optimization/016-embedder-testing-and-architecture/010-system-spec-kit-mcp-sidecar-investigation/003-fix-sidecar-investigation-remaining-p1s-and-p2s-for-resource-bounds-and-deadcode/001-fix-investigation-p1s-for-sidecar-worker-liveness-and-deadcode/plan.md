---
title: "Plan: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code"
description: "Canonical-anchor plan for closing F5, F14, F19, F26, F30, F94, and F95 in sidecar-worker.ts."
trigger_phrases:
  - "arc 010 003 001 plan"
  - "sidecar-worker p1 liveness deadcode plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-sidecar-worker-p1-plan"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0100030010100030010100030010100030010100030010100030010100030010"
      session_id: "010-003-001-sidecar-worker-p1"
      parent_session_id: null
    completion_pct: 100
---
# Plan: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js worker stdin/stdout IPC |
| **Findings** | F5, F14, F19, F26, F30, F94, F95 |
| **Evidence** | Arc 010/001 `research.md` and `findings-registry.json` |

This child phase hardens the embedder sidecar worker by removing dead helper/fallback complexity and making worker liveness, pre-parse errors, and provider-cache recovery explicit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase parent scope confirms this child owns only `sidecar-worker.ts`, `sidecar-hardening.vitest.ts`, and this packet's docs.
- [x] Registry rows for F5, F14, F19, F26, F30, F94, and F95 are identified.
- [x] F88 structured-liveness precedent from arc 010/002/003 and arc 010/002/004 is loaded.

### Definition of Done
- [x] All 7 P1 finding rows are closed in `checklist.md` with file:line evidence.
- [x] F14, F94, and F95 have focused fixture coverage in `sidecar-hardening.vitest.ts`.
- [x] Targeted vitest, TypeScript typecheck, and strict spec validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- Worker parent liveness returns structured state: `{ alive, reason, errorCode }`.
- PID 1 is treated as `pid-1-orphaned`, not as a healthy parent.
- `EPERM` and `ESRCH` liveness outcomes stay distinct and test-covered.
- Worker error responses use canonical `{ phase, code, detail }` fields.
- Pre-parse failures never emit `id: 0`; recoverable ids are mirrored and unparseable input exits 1 with stderr.
- Provider promise cache evicts only rejected promises; successful provider promises remain cached.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| `sidecar-worker.ts` configuration helpers | F5, F19, F26 | Dead fallback/helper indirection is collapsed while preserving configuration behavior. |
| `sidecar-worker.ts` liveness polling | F14 | Parent liveness is structured, explicit, and warning-backed for unknown errors. |
| `sidecar-worker.ts` error output | F30, F94 | Worker errors carry `{ phase, code, detail }` and never use synthetic id 0. |
| `sidecar-worker.ts` provider cache | F95 | Transient provider construction failure does not poison later requests. |
| `sidecar-hardening.vitest.ts` | F14, F94, F95 | Fixtures prove liveness states, pre-parse id policy, and retry-after-rejection. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Read the current packet docs, phase parent, registry evidence, F88 precedent, canonical sibling anchors, `sidecar-worker.ts`, and `sidecar-hardening.vitest.ts`.

### Phase 2: Core Implementation
Apply one surgical worker pass: consolidate single-call trivial helpers, collapse model fallback to env/config/default with warning, introduce structured liveness, canonicalize worker errors, recover parse ids or exit on unparseable input, and evict rejected provider promises.

### Phase 3: Verification
Add seven focused fixture assertions across F14/F94/F95, run targeted vitest, run MCP server typecheck, update packet docs with evidence, and run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Finding | Required Test |
|---------|---------------|
| F14 | PID 1 returns `pid-1-orphaned` and `alive: false`; `EPERM` returns `kill-0-eperm` and `alive: true`; `ESRCH` returns `kill-0-esrch` and `alive: false`. |
| F94 | Partial JSON with a recoverable `id` returns an error using that id; unparseable input exits 1 and emits `sidecar-worker: pre-parse failure` on stderr. |
| F95 | A rejected provider promise is evicted so the next call retries; success after rejection remains cached. |
| All | `sidecar-hardening.vitest.ts`, MCP server typecheck, and strict validation pass. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared/embeddings/factory` | Runtime import | Available | F95 provider-cache tests mock this factory. |
| `tsx` loader under `scripts/node_modules` | Test runtime | Available | F94 worker-process fixtures execute the TypeScript worker. |
| Arc 010/002 liveness decisions | ADR precedent | Available | F14 mirrors structured liveness semantics while applying worker-specific orphan policy. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any worker behavior regresses, revert only the `sidecar-worker.ts` and `sidecar-hardening.vitest.ts` hunks from this phase and keep the canonical docs with status reset to incomplete. No adjacent sidecar-client, execution-router, reindex, launcher, registry, schema, or index files are part of rollback scope.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Arc 010/001 evidence and arc 010/002 liveness precedent | Phase 2 implementation |
| Phase 2: Core Implementation | Current source/test files | Phase 3 verification |
| Phase 3: Verification | Successful code/test edits | Parent handoff and commit by parent agent |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Dead-code cleanup | Small | One worker-local consolidation pass for F5/F19/F26/F30. |
| Behavioral fixes | Medium | F14, F94, and F95 each need focused fixture coverage. |
| Documentation and validation | Small | Canonical anchors plus evidence updates and strict validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record any failed verification command in `implementation-summary.md` with the exit code and stderr summary. Do not advance the parent phase if targeted vitest, typecheck, or strict validation fails.
<!-- /ANCHOR:enhanced-rollback -->
