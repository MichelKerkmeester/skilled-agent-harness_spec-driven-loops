---
title: "Plan: Code Graph Launcher and DB Lifecycle"
description: "Implementation plan for Code Graph Launcher and DB Lifecycle."
trigger_phrases:
  - "code-graph-launcher-and-db-lifecycle"
  - "memory leak 7"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle"
    last_updated_at: "2026-05-22T14:05:00Z"
    last_updated_by: "opencode"
    recent_action: "planned-code-graph-owner-lease-and-close-db"
    next_safe_action: "implement-code-graph-owner-lease"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0707070707070707070707070707070707070707070707070707070707070707"
      session_id: "009-memory-leak-remediation-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Code Graph Launcher and DB Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server, CommonJS launcher |
| **Framework** | Code Graph (`mk-code-index`) under OpenCode system tooling |
| **Storage** | SQLite graph DB directory plus JSON owner lease |
| **Testing** | Vitest, TypeScript typecheck/build, strict spec validation |

### Overview
Enforce one code-graph launcher/server owner per canonical effective graph DB directory and prove shutdown closes graph DB handles. The implementation will reuse the existing launcher startup path, add Code Graph-owned canonical DB and owner-lease helpers, and preserve Phase 005's no-kill rule: stale/orphan evidence permits lease overwrite only, never process termination.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source evidence links from packets 020 and 024 are listed in the parent remediation map.
- [x] Verification fixtures are named: same-effective-DB, symlink, EPERM, PPID-1 orphan, child-survival, closeDb.
- [x] Destructive cleanup boundary is explicit: no process termination, only refuse-to-start or stale lease overwrite.

### Definition of Done
- [ ] REQ-001 and REQ-002 are satisfied.
- [ ] New and existing system-code-graph tests pass.
- [ ] Typecheck/build pass for `@spec-kit/system-code-graph`.
- [ ] This phase and the parent phase map are updated with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-owner lease by canonical DB directory with non-destructive stale-owner reclaim.

### Key Components
- **Effective DB identity**: `resolveCanonicalDbDir(dir)` resolves paths with `fs.realpathSync.native` after ensuring the directory exists. Symlink aliases collapse to the same canonical directory.
- **Owner lease**: `<canonicalDbDir>/.code-graph-owner.json` stores `{ ownerPid, startedAtIso, lastHeartbeatIso, ttlMs, ppid, executablePath, canonicalDbDir }`.
- **Single-owner gate**: launcher startup calls `acquireOwnerLease()` before heavy init. Existing live owners return a typed refusal; stale owners are reclaimed by atomic write-temp-then-rename only.
- **Classification**: `classifyOwner(lease)` returns `live-owner | stale-pid | ppid-1-orphan | symlink-alias | unknown-eperm`.
- **Shutdown**: server signal paths call `closeDb()` and run a post-close probe that proves the prior handle is closed.

### Data Flow
Launcher resolves the effective DB directory, acquires the canonical owner lease, then spawns the MCP server with `SPECKIT_CODE_GRAPH_DB_DIR` set to that canonical path. The server uses the same DB directory through `DATABASE_DIR`; on shutdown it closes IPC and DB resources, then validates that the closed handle rejects subsequent DB operations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Existing launcher/PID gate | Integrate canonical owner lease before bootstrap/build/server spawn | Same-effective-DB, symlink, live owner refusal |
| `.opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts` | New helper if no reusable resolver exists | Canonicalize effective DB dirs via realpath | Symlink alias, EPERM, missing dir |
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | New lease helper | Acquire, refresh, release, read, classify owner leases | stale PID, EPERM, PPID-1 orphan, child survival |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | DB singleton | Add close assertion/probe without removing exports | closeDb idempotence and post-close probe |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | MCP server shutdown | Call `closeDb()` assertion on signal and process lifecycle paths | closeDb ran on shutdown |

Required invariants:
- Same-effective DB identity is the realpath-resolved directory, not the user-provided spelling.
- EPERM means alive but untracked; it is not reclaimable.
- Dead PID or PPID-1 orphan evidence may reclaim a lease by overwrite only.
- Child-survival detection treats a live child whose recorded parent died as stale/orphan evidence, not as a live launcher owner.
- No code path sends signals to an owner process.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Effective DB Identity
- [ ] Add or reuse `resolveCanonicalDbDir(dir)` in `system-code-graph/mcp_server/lib/`.
- [ ] Normalize launcher `SPECKIT_CODE_GRAPH_DB_DIR` to the canonical path before lease acquisition.
- [ ] Preserve legacy PID-file compatibility only as a diagnostic fallback.

### Phase 2: Owner Lease and Shutdown Lifecycle
- [ ] Add `owner-lease.ts` with atomic write-temp-then-rename and owner-mismatch refresh/release refusal.
- [ ] Integrate `acquireOwnerLease()` into launcher startup before bootstrap/build/server spawn.
- [ ] Integrate `releaseOwnerLease()` into launcher exit/error/signal cleanup.
- [ ] Integrate `closeDb()` and `assertDbClosed()` into server shutdown.

### Phase 3: Verification
- [ ] Add vitest coverage for same-effective-DB, symlink alias, EPERM, PPID-1 orphan, child-survival, and closeDb.
- [ ] Run targeted tests, full system-code-graph tests, typecheck/build, alignment drift, and strict spec validation.
- [ ] Update implementation summary and parent remediation map with evidence and handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Canonical DB resolver, owner lease, closeDb probe | Vitest |
| Integration | Launcher duplicate owner refusal and DB-dir override | Existing launcher vitest plus new fixtures |
| Static | TypeScript correctness and build output | `npm run typecheck`, `npm run build` in system-code-graph |
| Spec | Phase and parent packet validity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 lock helpers | `processAlive`, atomic write-temp+rename pattern | Available | Owner lease semantics drift from existing lock behavior. |
| Phase 005 sweep policy | Exact identity + dry-run/no-kill rule | Available | Reclaim logic could become destructive or too broad. |
| Existing launcher lease tests | Launcher lifecycle fixtures | Available | Regression risk in duplicate-start behavior. |
| Read-path friction item #16 | P2 follow-on | Deferred unless small bounded fix is reachable | Ownership work could sprawl into batching/socket retention. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Lease logic refuses legitimate startup, reclaims EPERM/live owners, or closeDb probe breaks existing DB lifecycle.
- **Procedure**: Disable the new owner lease with the existing `MK_CODE_INDEX_STRICT_SINGLE_WRITER=0` escape hatch while preserving old PID diagnostics, revert the phase files if needed, and rerun launcher plus DB tests.
- **Data safety**: The lease file is metadata only. No graph SQLite files are deleted or rewritten by rollback.
<!-- /ANCHOR:rollback -->
