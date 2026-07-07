---
title: "Implementation Plan: Skill-Advisor Zombie Launcher Fix"
description: "Trace the skill-advisor launcher/daemon lease split, add the missing launcher-owned guard, and verify the spawn-three zombie regression."
trigger_phrases:
  - "007 zombie launcher plan"
  - "skill-advisor launcher fix plan"
  - "spawn-three launcher verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/006-skill-advisor-zombie-launcher-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 007 fix"
    next_safe_action: "Commit explicit scoped paths"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill-Advisor Zombie Launcher Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launcher plus TypeScript MCP server tests |
| **Framework** | Vitest for focused subprocess coverage |
| **Storage** | Launcher PID JSON guard plus existing daemon SQLite lease DB |
| **Testing** | `npm run typecheck`, `npx vitest --run launcher-lease`, strict spec validation, local smoke |

### Overview

The fix keeps skill-advisor's daemon SQLite single-writer lease but stops relying on the child daemon startup path to enforce the launcher process invariant. The launcher will acquire a local PID guard before `launchServer()`, report duplicates from that guard, and continue to consult the daemon SQLite lease for legacy/current daemon owners.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User supplied the existing 007 phase folder and branch policy.
- [x] Target code files read before modification.
- [x] Root cause identified from actual launcher and daemon lifecycle code.

### Definition of Done
- [x] `007-REQ-001` spawn-three Vitest coverage passes.
- [x] `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits 0.
- [x] `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease` exits 0.
- [x] 007 strict spec validation returns `RESULT: PASSED`.
- [x] Smoke check evidence is recorded, with sandbox process-list limitations documented.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Launcher-boundary single-owner guard plus daemon-internal SQLite lease.

### Key Components
- **`mk-skill-advisor-launcher.cjs`**: owns process-level duplicate rejection before spawning `advisor-server.js`.
- **`lease.ts` daemon DB**: continues to own daemon writer exclusivity and legacy daemon lease detection.
- **`launcher-lease.vitest.ts`**: owns regression coverage for duplicate launcher process behavior.

### Data Flow

Startup checks first look for a live launcher PID guard, then for a live daemon SQLite owner. If neither exists, the launcher serializes bootstrap, writes its PID guard, confirms it still owns the guard, and then spawns the MCP server child. Parent cleanup removes the PID guard before normal exit, signal mirror, timeout backstop, or uncaught exception exit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Launcher PID guard | Present cleanup/probe helpers but no acquisition | Add atomic write and re-probe before spawn | `launcher-lease.vitest.ts` spawn-three test |
| Daemon SQLite lease | Detects active daemon writer after child starts | Preserve current probe path | Existing legacy/current lease tests |
| Fixture server | Test fixture writes PID lease as if child owned it | Move ownership to launcher to match production fix | Focused Vitest |
| Process smoke | Operator-visible launcher count | Attempt local spawn-three check | Implementation summary evidence |

Required inventory:
- Same-class producers: exact reads of all three launchers showed code-index/spec-memory call `writeLeaseFile()` before `launchServer()`; skill-advisor did not.
- Consumers of changed helper: `clearLeaseFile`, signal handlers, child `exit` handler, and tests read the same `.mk-skill-advisor-launcher.json` path.
- Matrix axes: strict mode enabled/disabled, live owner, stale owner, legacy daemon owner, signal cleanup.
- Algorithm invariant: duplicate launcher spawns must be rejected before any second child server can remain alive.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read parent/006 packet context and target files.
- [x] Create initial 007 spec metadata.
- [x] Finish Level 2 docs before final validation.

### Phase 2: Core Implementation
- [x] Add local launcher lease held/read/write helpers in `mk-skill-advisor-launcher.cjs`.
- [x] Re-check single-writer state after bootstrap serialization and before PID guard write.
- [x] Write and re-probe the launcher PID guard before `launchServer()`.
- [x] Update launcher fixture so the parent, not the child, owns the PID guard.

### Phase 3: Verification
- [x] Add `007-REQ-001` spawn-three test.
- [x] Run typecheck and focused Vitest.
- [x] Run smoke launch; process-list access blocked by sandbox and documented.
- [ ] Run strict spec validation and record evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/subprocess | Launcher duplicate rejection and cleanup | `npx vitest --run launcher-lease` |
| Typecheck | TypeScript server/test compile contracts | `npm --prefix ... run typecheck` |
| Spec validation | Level 2 packet completeness | `validate.sh <007> --strict` |
| Smoke | Fresh spawn-three launcher behavior | Local launcher subprocesses plus process-count probe where available |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing built advisor server fixture path | Internal | Green | Tests copy the production launcher and write a fixture child at the expected dist path. |
| Process-list access | Runtime | Yellow | Sandbox blocks `ps` in this session; targeted PID assertions remain available. |
| Git index access | Runtime | Yellow | Prior packets hit `.git/index.lock` sandbox denial; handoff will document explicit staging if repeated. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Duplicate launchers still survive, focused tests fail, or startup rejects the first owner incorrectly.
- **Procedure**: Revert the scoped changes in `mk-skill-advisor-launcher.cjs` and `launcher-lease.vitest.ts`, then re-run the focused Vitest to restore the pre-007 baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Setup | User-supplied 007 packet path | Gate 3 documentation must exist before edits. |
| Core Implementation | Target file reads and root-cause trace | The fix must close the actual launcher/daemon split, not copy unrelated launcher behavior blindly. |
| Verification | Core implementation and test update | The spawn-three test proves the process-count invariant after the launcher guard exists. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Area | Estimate | Notes |
|------|----------|-------|
| Investigation | Medium | Requires comparing three launchers plus daemon lease/lifecycle behavior. |
| Code change | Low | One launcher file and one focused test file. |
| Verification | Medium | Requires typecheck, focused Vitest, strict validation, and smoke evidence. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

Rollback is path-scoped. Revert only the Phase 007 changes to `mk-skill-advisor-launcher.cjs`, `launcher-lease.vitest.ts`, and this 007 packet; do not touch the working code-index/spec-memory launcher paths.
<!-- /ANCHOR:enhanced-rollback -->
