---
title: "Implementation Plan: Daemon-lifecycle healing (F1/F2/F3)"
description: "Applies the 032 root-cause fixes: boot FTS5 shadow auto-rebuild, a launcher clean-close verification barrier, and a corrected substrate stress test that matches the single-daemon runner reality."
trigger_phrases:
  - "daemon lifecycle healing plan"
  - "boot fts rebuild clean-close barrier plan"
  - "substrate stress test fix plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/002-daemon-lifecycle-healing"
    last_updated_at: "2026-05-30T18:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rewrote plan to manifest scaffold"
    next_safe_action: "Strict-validate then commit atomically"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000322"
      session_id: "032-001-plan"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Daemon-lifecycle healing (F1/F2/F3)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp-server) + CommonJS (launcher .cjs) |
| **Framework** | Node.js, better-sqlite3, MCP SDK |
| **Storage** | SQLite (`context-index.sqlite`) with FTS5 shadow |
| **Testing** | Vitest (unit + stress configs), `node --check` |

### Overview
Three independent fixes that together heal the SQ4 daemon-lifecycle root cause and its two symptoms. F2 detects/observes the unclean DB handoff; F1 self-heals whatever still slips through on the replacement daemon's boot; F3 restores the test that detects the SQ1 symptom.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (032 research)
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (context-server 378/378; launcher-clean-close-barrier 4/4; substrate 1/1)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defense-in-depth: an observe-and-log barrier at the launcher (F2) plus a self-healing repair at daemon boot (F1).

### Key Components
- **`runBootFtsIntegrityCheck()`** (context-server.ts): detects + now rebuilds the FTS5 shadow.
- **`reapLeaseChildBeforeRespawn()`** (launcher): reaps the incumbent + now verifies the clean close.
- **substrate harness vitest** (test): asserts single-daemon reality.

### Data Flow
Unclean exit -> `.unclean-shutdown` marker persists + FTS shadow may diverge -> next boot detects marker -> integrity-check fails -> rebuild + re-verify -> healthy DB serves writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runBootFtsIntegrityCheck` (context-server.ts) | Detect-only FTS integrity probe | update -> rebuild+re-verify | context-server.vitest T56c |
| `memory_health` autoRepair (memory-crud-health.ts) | Same FTS `rebuild` verb | unchanged (reused command) | grep confirms identical SQL |
| `reapLeaseChildBeforeRespawn` (launcher) | SIGTERM->SIGKILL reap | update -> compute+log cleanClose | launcher-clean-close-barrier.vitest |
| `close_db` marker removal (vector-index-store.ts) | Sole clean-marker remover | unchanged (the invariant F2 checks) | grep `remove_unclean_shutdown_marker` |
| substrate harness vitest | Stale 5-vs-4 assertion | update | run vs real daemon |

Required inventories:
- FTS rebuild verb consumers: `rg -n "VALUES\('rebuild'\)" .opencode/skills/system-spec-kit/mcp_server` -> boot path (new) + memory_health (existing).
- Marker path producers: `rg -n "unclean-shutdown" .opencode` -> writer (vector-index-store), boot reader (context-server), launcher reader (new).
- Algorithm invariant: a reap is a clean handoff only when `!killed && !markerPresent`; adversarial cases = killed-with-marker, killed-no-marker, term-with-marker, term-no-marker (all unit-tested).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all four change-sites + the rebuild logic to reuse
- [x] Confirm target files clean at HEAD

### Phase 2: Core Implementation
- [x] F1 boot FTS auto-heal (context-server.ts)
- [x] F2 clean-close barrier + helper exports (launcher)
- [x] F3 substrate test correctness

### Phase 3: Verification
- [x] Build + node --check + affected vitest
- [x] Comment-hygiene audit (0 violations)
- [x] Strict-validate the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `cleanCloseAfterReap` truth table + marker-path resolution | Vitest (launcher-clean-close-barrier) |
| Source-guardrail | F1 auto-heal contract in compiled JS | Vitest (context-server T56c) |
| Integration | substrate harness vs real mk-spec-memory daemon | Vitest stress config |
| Syntax | launcher .cjs | `node --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| better-sqlite3 FTS5 `rebuild` verb | External | Green | None (already used by memory_health) |
| `resolvedDbDir()` in launcher | Internal | Green | F2 marker-path resolution |
| Compiled `dist/context-server.js` | Internal | Green | context-server source-guardrail test |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: F1 auto-heal causes any regression in boot or write path.
- **Procedure**: Each fix is independent and revertible by file. F1 has a runtime opt-out (`SPECKIT_BOOT_FTS_AUTOHEAL=0`); F2 fields are additive; F3 is test-only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Read sites) ──► Phase 2 (F1/F2/F3) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | reading 4 sites + tests |
| Core Implementation | Med | 3 fixes + 1 new test |
| Verification | Med | build + 3 test suites + validate |
| **Total** | | **single focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] FTS rebuild is non-destructive (no backup needed)
- [x] Runtime opt-out flag available (`SPECKIT_BOOT_FTS_AUTOHEAL=0`)
- [x] F2 barrier never blocks respawn

### Rollback Procedure
1. Set `SPECKIT_BOOT_FTS_AUTOHEAL=0` to disable F1 at runtime.
2. `git revert` the commit (or revert per-file) to remove F1/F2/F3.
3. Rebuild + re-run the affected vitest suites.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - the FTS shadow rebuild only re-derives existing data.
<!-- /ANCHOR:enhanced-rollback -->
