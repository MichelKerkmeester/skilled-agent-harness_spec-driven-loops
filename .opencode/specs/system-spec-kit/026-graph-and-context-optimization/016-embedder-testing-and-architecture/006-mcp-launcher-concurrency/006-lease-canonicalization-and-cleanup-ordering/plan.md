---
title: "Implementation Plan: Lease Canonicalization and Cleanup Ordering"
description: "Plan for closing Phase 005 council findings with realpath lease identity, legacy probes, cleanup ordering, focused tests, and documentation reconciliation."
trigger_phrases:
  - "012/006 plan"
  - "lease canonicalization plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored implementation plan"
    next_safe_action: "Run final verification gates"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
---
# Implementation Plan: Lease Canonicalization and Cleanup Ordering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launchers and TypeScript MCP server code |
| **Framework** | Vitest, better-sqlite3, spec-kit validation |
| **Storage** | SQLite lease DB, inline JSON PID lease files, DB directories |
| **Testing** | Typecheck, focused Vitest suites, strict spec validation |

### Overview

The packet keeps the existing lease models but fixes identity and ordering. Skill-advisor keeps the daemon SQLite lease table; code-graph and spec-memory keep inline PID files; all derive ownership from canonical filesystem paths and clear lease artifacts before dangerous exits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] User supplied existing 006 phase folder.
- [x] Council findings and frozen file list are explicit.
- [x] Branch policy is `main`.

### Definition of Done

- [ ] All P1 findings closed.
- [ ] In-scope P2 findings closed; P2-Seat4 deferral documented if scope remains frozen.
- [ ] Requested validations and Vitest suites pass.
- [ ] One explicit-path commit lands on main.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical compatibility hardening around existing launcher-boundary lease enforcement.

### Key Components

- **Canonical path helper**: `path.resolve()` followed by `fs.realpathSync.native()` when possible, with ENOENT fallback for first-run directories.
- **Legacy probe**: one-release read-only check of old lease locations before declaring no live owner.
- **Cleanup ordering**: synchronous lease cleanup before `process.kill(process.pid, signal)` and before normal mirrored exits.
- **Focused subprocess fixtures**: temp workspaces copy the production launchers and use stub child servers to prove process behavior.

### Data Flow

Launcher startup canonicalizes the DB directory, probes the current lease, probes legacy lease locations if no live current owner exists, and only then writes its own lease or starts the child. On child exit or parent signal, cleanup runs before the parent exits or mirrors an uncatchable signal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill-advisor `lease.ts` | Daemon SQLite lease source of truth | Canonical DB dir, legacy `.advisor-state` probe, secure perms | Typecheck and launcher-bootstrap/launcher-lease tests |
| Skill-advisor launcher | Startup lease preflight | Realpath DB reporting, legacy marker, cleanup before signal mirror | skill-advisor `launcher-lease` |
| Code-graph launcher | Inline PID-file lease | Realpath `SPECKIT_CODE_GRAPH_DB_DIR`, legacy skill-local probe, 0600 writes | code-graph `launcher-lease` |
| Spec-memory launcher | Inline PID-file lease | Realpath DB dir, singular `.opencode/skill` legacy probe, 0600 writes | spec-kit `launcher-lease` |
| Test anchors | Review traceability | Phase-namespace every REQ comment | `rg -n "REQ-"` inspection |
| Older docs | Packet consistency | Fix 005 T022, 002 pending text, parent invariant | strict validate |

Matrix axes:

| Axis | Rows |
|------|------|
| Path identity | normal path, symlink alias, canonical real dir |
| Lease origin | current path, legacy path, stale legacy owner |
| Process exit | clean child exit, parent signal, child ignores SIGTERM until SIGKILL backstop |
| Permission model | owned dir `0700`, inline lease `0600`, skill-advisor lease DB `0600` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Lease Behavior

- [ ] Add realpath canonicalization helpers.
- [ ] Add legacy lease probes and `(legacy path)` diagnostics.
- [ ] Tighten lease file and owned directory permissions.
- [ ] Clear leases before child signal mirroring.

### Phase 2: Tests and Anchors

- [ ] Add symlink-alias and legacy-probe tests.
- [ ] Add SIGKILL-backstop cleanup tests.
- [ ] Namespace REQ anchors and correct `005-REQ-011` mapping.
- [ ] Replace brittle DB pragma static assertions with runtime rebuild-path coverage.

### Phase 3: Documentation and Verification

- [ ] Reconcile older packet docs and daemon lease reference.
- [ ] Generate 006 metadata.
- [ ] Run all requested gates.
- [ ] Commit explicit scoped paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | skill-advisor TypeScript | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` |
| Integration | skill-advisor launcher and bootstrap | `npx vitest --run launcher-lease launcher-bootstrap` |
| Integration | code-graph launcher | `npx vitest --run launcher-lease` |
| Integration | spec-memory launcher | `npx vitest --run launcher-lease` |
| Documentation | 006 and arc parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing Node dependencies | Internal | Green | Typecheck/Vitest cannot run if unavailable. |
| spec-kit scripts | Internal | Green | Metadata and strict validation depend on built scripts. |
| Git index access | Process | Unknown | Commit may need handoff if sandbox blocks `.git/index.lock`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A focused verification gate fails due to Phase 006 code.
- **Procedure**: Patch the failing scoped file and rerun the relevant gate. If already committed, revert only the explicit Phase 006 commit with a follow-up commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Lease Behavior | Council evidence and existing launcher patterns | Code changes must preserve current process model. |
| Tests and Anchors | Lease Behavior | New assertions need the canonical path and legacy output behavior. |
| Documentation and Verification | Code and tests | Packet evidence must describe the exact implementation. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Area | Estimate | Notes |
|------|----------|-------|
| Lease implementation | Medium | Repeated across three launcher surfaces. |
| Tests | Medium | Backstop cases add intentional wait time. |
| Documentation | Low | Reconciliation is narrow and evidence-driven. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

Rollback stays commit-scoped. If one launcher regresses after merge, revert the Phase 006 commit or patch only that launcher's explicit paths in a follow-up commit; do not alter unrelated parallel work.
<!-- /ANCHOR:enhanced-rollback -->
