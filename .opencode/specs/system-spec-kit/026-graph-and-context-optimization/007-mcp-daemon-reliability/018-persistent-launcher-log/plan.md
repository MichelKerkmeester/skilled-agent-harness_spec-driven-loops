---
title: "Implementation Plan: Persistent launcher log"
description: "Add a bounded, best-effort durable log behind the launcher's log(), with pure testable helpers for enable/path/cap/rotation."
trigger_phrases:
  - "persistent launcher log plan"
  - "launcher log rotation plan"
  - "durable launcher trace plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/018-persistent-launcher-log"
    last_updated_at: "2026-06-07T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested the persistent log"
    next_safe_action: "Phase 019 reap hardening"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-018-persistent-launcher-log"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Persistent launcher log

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS launcher) |
| **Framework** | None (raw process) |
| **Storage** | Append-only text file in the runtime db dir |
| **Testing** | vitest |

### Overview
`log()` keeps its stderr write and additionally appends a timestamped, pid-stamped line to a durable file. Path, enablement, and size cap come from pure helpers reading env (with injectable args for tests). Writes are best-effort and size-bounded with single-generation rotation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive helper layer behind the existing `log()` sink.

### Key Components
- **`persistLauncherLogLine(line)`**: best-effort append + rotation glue.
- **Pure helpers**: `launcherLogIsEnabled`, `launcherLogMaxBytes`, `resolveLauncherLogPath`, `shouldRotateLauncherLog`.

### Data Flow
`log(msg)` -> stderr write (unchanged) + `persistLauncherLogLine(timestamped line)` -> stat/rotate-if-over-cap -> append.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `log()` | sole stderr sink | update (adds durable append) | stderr format byte-identical; tests |
| `isDurableWriteUnavailable` / `logDurableWriteUnavailableOnce` | existing durable-write guard | reused, unchanged | grep + code reuse |
| launcher tests | observe behavior | add new test file | `launcher-persistent-log.vitest.ts` passes |

Required inventories:
- Consumers of `log()`: every launcher log call now also persists; stderr unchanged so no consumer regresses.
- Matrix axes: {enabled?, file-exists?, over-cap?, writable?} -> covered by the new tests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `log()` sink + the durable-write helper pattern
- [x] Confirm `*.log` gitignore coverage for the default path

### Phase 2: Core Implementation
- [x] Add pure helpers (enable/path/cap/rotation)
- [x] Add `persistLauncherLogLine` + wire `log()`
- [x] Export helpers for tests

### Phase 3: Verification
- [x] `node --check` + helper smoke test
- [x] Unit + integration tests (append/rotate/disable/no-throw)
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | pure helpers | vitest |
| Integration | append + rotation + disable + no-throw | vitest + tmp fs |
| Manual | node --check + require smoke | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| runtime db dir | Internal | Green | reuses existing lease dir |
| `*.log` gitignore | Internal | Green | already present |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any unexpected launcher behavior tied to logging.
- **Procedure**: `SPECKIT_LAUNCHER_LOG=0` (instant, no redeploy) or `git revert` the launcher change.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
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
| Setup | Low | <1 hour |
| Core Implementation | Low | 1-2 hours |
| Verification | Low | <1 hour |
| **Total** | | **~2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Feature flag configured (`SPECKIT_LAUNCHER_LOG`)
- [x] Bounded size (no unbounded growth)
- [x] Best-effort writes (no crash path)

### Rollback Procedure
1. Set `SPECKIT_LAUNCHER_LOG=0` to disable instantly.
2. `git revert` the launcher change if needed.
3. Re-run the launcher test suite to confirm baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (log file is gitignored runtime state; delete if desired)
<!-- /ANCHOR:enhanced-rollback -->
