---
title: "Implementation Plan: Lease Correctness and Arc Traceability"
description: "Plan for closing the 13 P1 launcher-concurrency findings with scoped code, tests, documentation, and verification evidence."
trigger_phrases:
  - "012/005 plan"
  - "lease correctness plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation plan"
    next_safe_action: "Run verification gates"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
---
# Implementation Plan: Lease Correctness and Arc Traceability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launchers, TypeScript MCP server code |
| **Framework** | Vitest, better-sqlite3, spec-kit validation |
| **Storage** | SQLite DB directories for skill-advisor, code-graph, and spec-memory |
| **Testing** | Typecheck, focused vitest suites, full skill-advisor vitest suite, strict spec validation |

### Overview

This packet closes the deep-review P1s without changing the launcher architecture. The implementation keeps the existing PID-file and SQLite lease models, but moves lease ownership to the resolved DB directory where overrides can redirect the database, adds missing tests, and updates arc documentation to reflect what was actually verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] User supplied the existing 005 phase folder.
- [x] Frozen file list and commit policy are explicit.
- [x] Deep-review findings are enumerated with requested fixes.

### Definition of Done

- [ ] All 13 P1 findings closed with evidence.
- [ ] Strict validate passes for 005 and the arc parent.
- [ ] Skill-advisor typecheck and requested vitest suites pass.
- [ ] One commit lands on main with explicit-path staging.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical remediation against existing launcher-boundary single-writer enforcement.

### Key Components

- **Launcher PID files**: Process-boundary lease files for duplicate launcher prevention.
- **Skill-advisor daemon lease**: SQLite lease table used by the advisor daemon lifecycle and `isLeaseHeld()`.
- **Skill graph DB opener**: `initDb()` remains the single runtime opener for WAL and busy_timeout setup.
- **Spec docs**: Phase parent and child specs are the traceability surface for review closure.

### Data Flow

Launcher startup resolves the DB directory, checks the lease boundary before bootstrap, starts the child server only when no live owner exists, and clears its lease on process exit or signal. Skill-advisor DB-open paths route through `getDb()` or `indexSkillMetadata()`, which lazily call `initDb()` and inherit WAL plus busy_timeout setup.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill-advisor launcher | Enforces single-writer and starts advisor child | Resolve PID file beside DB override and add unconditional cleanup | `launcher-lease` vitest and typecheck |
| Code-graph launcher | Enforces inline PID-file lease | Resolve PID file beside `SPECKIT_CODE_GRAPH_DB_DIR` and add unconditional cleanup | code-graph `launcher-lease` vitest |
| Spec-memory launcher | Enforces inline PID-file lease | Add unconditional cleanup; no direct DB-dir override found | spec-kit `launcher-lease` vitest |
| Skill-advisor daemon lease | Backs `isLeaseHeld()` and daemon ownership | Resolve default lease DB beside the resolved skill graph DB | launcher-bootstrap stale and override tests |
| Skill graph DB opener | Owns WAL + busy_timeout setup | Widen WAL fallback error classification | typecheck and static DB-open-path tests |
| Arc docs | Explain phase status and invariants | Align status, validate evidence, and central invariants | strict validate on 005 and parent |

Matrix axes:

| Axis | Rows |
|------|------|
| Lease owner state | live PID, dead PID, clean exit, SIGQUIT, disabled strict mode |
| DB path mode | default workspace path, resolved override path, shared override across workspaces |
| DB open path | handler boot, watcher refresh, rebuild-from-source |
| SQLite fallback error | base READONLY/CANTOPEN/IOERR, extended READONLY/CANTOPEN/IOERR, filesystem permission/full errors |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Traceability Alignment

- [ ] Update parent invariants and child status drift.
- [ ] Record strict validate evidence for 001 and 004.
- [ ] Update REQ-009 and test REQ anchors.

### Phase 2: Correctness and Coverage

- [ ] Align resolved-DB lease paths in affected launchers and `lease.ts`.
- [ ] Widen SQLite WAL fallback error matching.
- [ ] Add missing skill-advisor spawn-twice, stale PID, and DB-open-path coverage.

### Phase 3: Verification and Commit

- [ ] Generate phase metadata.
- [ ] Run all requested gates.
- [ ] Update checklist and implementation summary with actual evidence.
- [ ] Stage explicit paths and commit once on main.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | skill-advisor TypeScript package | `npm --prefix ... run typecheck` |
| Integration | launcher lease subprocess behavior | `npx vitest --run launcher-lease launcher-bootstrap` |
| Integration | code-graph launcher lease | `npx vitest --run launcher-lease` |
| Integration | spec-memory launcher lease | `npx vitest --run launcher-lease` |
| Full suite | skill-advisor suite honesty check | `npx vitest --run` |
| Documentation | phase 005 and arc parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing npm installs | Internal | Green | Vitest/typecheck cannot run. |
| spec-kit validator | Internal | Green | Completion evidence cannot be claimed. |
| Dirty worktree discipline | Process | Yellow | Commit could accidentally include unrelated work without explicit paths. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verification gate fails because the remediation changes introduce regression.
- **Procedure**: Patch the failing scoped file and rerun the relevant gate. If already committed, make a follow-up commit as requested; do not amend.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Traceability Alignment | Existing child specs and review findings | Documentation must describe the current arc before completion evidence is recorded. |
| Correctness and Coverage | Traceability inventory | Tests and code changes map directly to the 13 P1 findings. |
| Verification and Commit | Code, tests, docs, and generated metadata | Final evidence must reflect the exact staged packet. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Area | Estimate | Notes |
|------|----------|-------|
| Code and tests | Medium | Existing launcher-lease fixtures absorb most coverage work. |
| Documentation | Medium | Phase 005 docs plus parent/child traceability updates. |
| Verification | Medium | Multiple vitest workspaces and strict spec validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

Rollback stays file-scoped. If a launcher regression appears, revert only the affected launcher/test hunks in a follow-up commit and preserve the doc evidence of the failed gate for auditability.
<!-- /ANCHOR:enhanced-rollback -->
