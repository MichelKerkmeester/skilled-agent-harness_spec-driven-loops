---
title: "Implementation Plan: Lease Socket-Path Persistence"
description: "Additive lease.socketPath field on mk-spec-memory leases plus a generic prefer-stored-path-with-fallback in the shared launcher bridge, closing the worktree-env SPECKIT_IPC_SOCKET_DIR divergence deferred from packet 018."
trigger_phrases:
  - "lease socket path plan"
  - "prefer stored socket bridge"
  - "no-bridge-socket worktree fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/020-lease-socket-path"
    last_updated_at: "2026-06-04T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented all three surfaces; tests green"
    next_safe_action: "Deploy on next launcher spawn"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Lease Socket-Path Persistence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs` launcher infrastructure) |
| **Framework** | mk-spec-memory launcher + shared model-server-supervision / launcher-ipc-bridge libs |
| **Storage** | JSON lease file (`.mk-spec-memory-launcher.json`) in the resolved DB dir |
| **Testing** | Vitest (`tests/launcher-*.vitest.ts`) |

### Overview
Add an additive, optional `socketPath` to the `mk-spec-memory` lease so the owner records the IPC path it actually listens on. The shared bridge prefers the stored path (when present and on disk) over recomputing one from `SPECKIT_IPC_SOCKET_DIR`, eliminating the worktree-env divergence. Old leases and the other two launchers (which never write the field) fall back to the existing recompute behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (defect (c) from packet 018)
- [x] Success criteria measurable (SC-001..003)
- [x] Dependencies identified (`resolveSessionProxySocketPath`, `getIpcSocketPath`)

### Definition of Done
- [x] All acceptance criteria met (R1..R5)
- [x] Tests passing (5 new + existing launcher suites green)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive optional-field schema extension + generic-read-with-fallback at the shared call site.

### Key Components
- **`buildLeaseObject` (shared, model-server-supervision.cjs)**: emits `socketPath` only when a non-empty string is supplied (same guard style as `childPid`/`modelServerPid`).
- **`writeLeaseFile` / `leaseHeldFromFile` (mk-spec-memory-launcher.cjs)**: the only writer that passes a `socketPath`, and the reader that surfaces it onto the lease-result object.
- **`maybeBridgeLeaseHolder` (launcher-ipc-bridge.cjs)**: prefers `leaseResult.socketPath` when usable, else recomputes.

### Data Flow
mk-spec-memory owner writes lease with its resolved socket path → secondary launcher reads the lease → `leaseHeldFromFile` surfaces `socketPath` → `maybeBridgeLeaseHolder` bridges to the stored path (or recomputes when absent).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `model-server-supervision.cjs::buildLeaseObject` | Shared pure lease builder for all three launchers | update (add optional `socketPath` arg+field) | `node --check`; unit test asserts emit/omit |
| `mk-spec-memory-launcher.cjs::buildLeaseObject` wrapper + `writeLeaseFile` | mk-spec-memory lease writer | update (pass `resolveSessionProxySocketPath()`) | `node --check`; bridge prefers stored-path test |
| `mk-spec-memory-launcher.cjs::leaseHeldFromFile` | mk-spec-memory lease reader | update (surface `lease.socketPath` → result) | `node --check`; lease-result carries socketPath |
| `launcher-ipc-bridge.cjs::maybeBridgeLeaseHolder` | Shared bridge decision for all three launchers | update (prefer stored, fallback recompute) | probe suite + 5 new tests |
| `mk-skill-advisor-launcher.cjs` / `mk-code-index-launcher.cjs` | Other consumers of the shared bridge | unchanged (never write `socketPath`) | grep confirms no `socketPath` in their leases; no-socketPath test stays on recompute |

Required inventories:
- Same-class producers: `rg -n "buildLeaseObject|writeLeaseFile" .opencode/bin` — only mk-spec-memory passes a socketPath.
- Consumers of changed symbols: `rg -n "maybeBridgeLeaseHolder|leaseResult\.socketPath|buildLeaseObject" .opencode/bin` — skill-advisor/code-index leaseResults carry no socketPath.
- Algorithm invariant: a UDS stored path is trusted only when `fs.existsSync(it)`; tcp:// bypasses existence; a null/missing/stale stored path falls back to recompute (which re-applies existence + probe gates).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all three `.cjs` files and the launcher/bridge call sites
- [x] Confirm skill-advisor/code-index leases never carry `socketPath`

### Phase 2: Core Implementation
- [x] `buildLeaseObject` (shared) accepts + emits optional `socketPath`
- [x] mk-spec-memory `buildLeaseObject` wrapper + `writeLeaseFile` pass the owner's resolved socket path
- [x] `leaseHeldFromFile` surfaces `lease.socketPath` (normalized to null when absent)
- [x] `maybeBridgeLeaseHolder` prefers usable stored path, falls back to recompute

### Phase 3: Verification
- [x] `node --check` clean on all three files
- [x] 5 new unit tests + existing launcher suites green
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildLeaseObject` emit/omit; `maybeBridgeLeaseHolder` prefer/fallback/no-bridge-socket | Vitest |
| Integration | Existing launcher-lease / recycle / session-proxy suites stay green | Vitest |
| Syntax | `node --check` on the three `.cjs` files | Node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `resolveSessionProxySocketPath()` (launcher) | Internal | Green | Without it the writer has no owner path to store |
| `getIpcSocketPath()` (bridge) | Internal | Green | Fallback recompute path |
| Vitest launcher suites | Internal | Green | Regression coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A secondary launcher bridges to a wrong/stale stored path, or the other two launchers regress.
- **Procedure**: Revert the three `.cjs` edits (git). The field is additive — reverting the writer stops emitting `socketPath`; reverting the reader/bridge restores pure recompute. No data migration needed since old/new leases are mutually tolerant.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup/Read) ──► Phase 2 (Implement) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implement |
| Implement | Setup | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup/Read | Low | ~0.5 hour |
| Implementation | Low | ~1 hour |
| Verification | Low | ~0.5 hour |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (lease is regenerated on each write) — no backup needed
- [x] No feature flag (additive field with built-in fallback)
- [x] Existing launcher suites green

### Rollback Procedure
1. `git revert` the three `.cjs` edits.
2. Next launcher spawn stops emitting / preferring `socketPath`; pure recompute restored.
3. Smoke test: a session connects and `memory_health` returns normally.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — old and new lease shapes are mutually tolerant; a stale field is ignored by the reverted reader.
<!-- /ANCHOR:enhanced-rollback -->
