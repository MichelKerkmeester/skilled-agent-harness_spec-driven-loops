---
title: "Feature Specification: Persistent launcher log"
description: "The mk-spec-memory launcher logs only to stderr, which the MCP host captures inconsistently, so an owner-disposal race or daemon flap leaves no durable trace. This packet adds a bounded, best-effort persistent log file."
trigger_phrases:
  - "persistent launcher log"
  - "mk-spec-memory launcher log file"
  - "attributable daemon flap"
  - "launcher stderr durable trace"
  - "SPECKIT_LAUNCHER_LOG"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/018-persistent-launcher-log"
    last_updated_at: "2026-06-07T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added a bounded best-effort persistent launcher log behind log()"
    next_safe_action: "Phase 019 dead-socket reap hardening"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-018-persistent-launcher-log"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Where should the log live? -> alongside the lease in the runtime db dir, default-on, gitignored by *.log."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Persistent launcher log

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The launcher's `log()` writes only to `process.stderr`. The MCP host (Claude Code / OpenCode) captures that stream inconsistently, so when the daemon flaps or an owner-disposal race fires there is no durable record to attribute it from afterward. Phase 017 deferred this as the first foundational item: without a log, every later reliability change is hard to validate from real incidents.

### Purpose
The launcher keeps a bounded, best-effort, durable log file so daemon flaps and disposal races are attributable after the fact, while never letting a logging failure affect the launcher.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `log()` additionally appends a timestamped, pid-stamped line to a durable file.
- Pure, testable helpers for enablement, path resolution, size cap, and rotation decision.
- Single-generation size-bounded rotation (`*.prev.log`), best-effort writes, env controls.

### Out of Scope
- The reap, orphan-sweeper, code-index proxy, and RC-2 hardening - separate phases 019-021.
- Structured/JSON logging or a log shipper - stderr text parity is the goal here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Persistent-log helpers + `log()` appends to the durable file |
| `mcp_server/tests/launcher-persistent-log.vitest.ts` | Create | Unit + append/rotation/disable integration tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `log()` persists to a durable file | Each logged line is appended to the resolved log path with timestamp + pid |
| REQ-002 | Logging never breaks the launcher | A stat/append failure is swallowed; `persistLauncherLogLine` never throws |
| REQ-003 | Bounded growth | The file rotates to a single `.prev.log` generation once it exceeds the cap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Operator controls | `SPECKIT_LAUNCHER_LOG=0` disables; `SPECKIT_LAUNCHER_LOG_PATH` / `SPECKIT_LAUNCHER_LOG_MAX_BYTES` override path/cap |
| REQ-005 | stderr parity preserved | The stderr line format is byte-identical to before (no test/log-parse regression) |
| REQ-006 | Not committed | The log file is gitignored (`*.log`) so runtime state never enters version control |

### Acceptance Criteria (Given/When/Then)

- **Given** an enabled launcher, **When** `log()` runs, **Then** the line is appended to the durable file.
- **Given** `SPECKIT_LAUNCHER_LOG=0`, **When** `log()` runs, **Then** no file is written.
- **Given** a file over the cap, **When** the next line is logged, **Then** it rotates to `.prev.log` first.
- **Given** an unwritable target, **When** a line is logged, **Then** the launcher does not throw.
- **Given** a blank `SPECKIT_LAUNCHER_LOG_PATH`, **When** resolved, **Then** the default db-dir path is used.
- **Given** the change, **When** `node --check` and the launcher tests run, **Then** all pass.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Logged lines land in a durable, bounded file; stderr output is unchanged.
- **SC-002**: `node --check` clean; new + existing launcher tests pass (28+).
- **SC-003**: `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Log write contends with daemon work | Low | Append-only, best-effort, swallows errors; never on a hot path |
| Risk | Unbounded growth | Low | Size cap + single-generation rotation; default 1 MiB |
| Dependency | Runtime db dir exists | Low | Reuses the dir the lease already lives in; gitignored |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One `statSync` + one `appendFileSync` per logged line; negligible vs daemon work.
- **NFR-P02**: No steady-state cost when disabled (early return).

### Security
- **NFR-S01**: File created mode `0o600`; no secrets logged beyond existing stderr content.
- **NFR-S02**: Path override is operator-only via env; no external input.

### Reliability
- **NFR-R01**: Logging failures are isolated; the launcher continues regardless.
- **NFR-R02**: Durable-write-unavailable codes (ENOSPC/EDQUOT/EROFS) are reported once, not repeatedly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing file: first append creates it (stat ENOENT is not an error).
- Over-cap file: rotated to `.prev.log` before append.
- Blank/whitespace path override: falls back to the default db-dir path.

### Error Scenarios
- Unwritable dir: append throws internally, is swallowed; no crash.
- ENOSPC/EDQUOT/EROFS: reported once via the existing durable-write-unavailable path.

### State Transitions
- Disabled mid-life via env: next `log()` early-returns (env read per call).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | ~45 LOC in one launcher file + one test file |
| Risk | 8/25 | Shared infra but additive, best-effort, isolated |
| Research | 4/20 | Foundational item already scoped by phase 017 |
| **Total** | **18/70** | **Level 2 (risk-weighted, shared MCP infra)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. This is the foundational observability item; the remaining hardening is phases 019-021.
<!-- /ANCHOR:questions -->
