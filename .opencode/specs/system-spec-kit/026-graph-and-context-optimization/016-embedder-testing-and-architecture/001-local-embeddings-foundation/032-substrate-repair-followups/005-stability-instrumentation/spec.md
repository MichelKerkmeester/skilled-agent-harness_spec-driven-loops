---
title: "Feature Specification: 005 substrate-stability-instrumentation"
description: "Add observability so future substrate flap incidents are diagnosable in minutes instead of hours. RSS log on startup, RSS field in memory_health response, circuit-flap boolean derived from recent state transitions, and resource-map threshold documentation."
trigger_phrases:
  - "substrate stability instrumentation"
  - "memory_health rss field"
  - "circuit flapping boolean"
  - "memory-mcp threshold documentation"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed substrate stability instrumentation"
    next_safe_action: "Respawn Memory MCP daemon and call memory_health for live process/flapping verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0050050050050050050050050050050050050050050050050050050050050050"
      session_id: "cli-codex-005-stability-instrumentation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The 1500 MB RSS threshold is documentation-only in this packet."
---
# Feature Specification: 005 substrate-stability-instrumentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 2 |
| Priority | P0 |
| Status | Complete |
| Created | 2026-05-14 |
| Branch | `032-substrate-repair-followups/005-stability-instrumentation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Substrate flap incidents are difficult to diagnose when the only visible signal is a degraded `memory_health` response. The council identified RSS pressure and circuit instability as key signals, but the Memory MCP daemon did not expose process RSS or recent circuit-breaker transition state.

### Purpose

Surface lightweight substrate stability metrics in `memory_health` and daemon startup logs so the next flap can be triaged quickly without changing save, search, embed, or retry behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a startup RSS log after the Memory MCP stdio transport connects.
- Add `data.process.{pid,rss_mb,uptime_seconds}` to successful `memory_health` responses.
- Add circuit flap telemetry derived from recent retry circuit state transitions.
- Mirror source changes to dist JavaScript files.
- Document operational thresholds in `resource-map.md`.

### Out of Scope

- Dashboarding, alerting, or kill-switch enforcement.
- Provider-specific latency metrics.
- Changing retry thresholds, circuit cooldowns, save/search/embed flows, or database writes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Add process telemetry and circuit flap fields to `memory_health` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modify | Track actual circuit open/auto-close transitions in memory |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Log startup pid/RSS/uptime after stdio connect |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-crud-health.js` | Modify | Dist mirror of health response fields |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js` | Modify | Dist mirror of circuit flap telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` | Modify | Dist mirror of startup RSS log |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation/resource-map.md` | Create | Document five substrate stability thresholds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Emit daemon startup RSS log | Log line includes pid, rounded RSS MB, and uptime 0s after `server.connect` |
| REQ-002 | Expose process telemetry in `memory_health` | `data.process.pid`, `rss_mb`, and `uptime_seconds` are present |
| REQ-003 | Expose circuit flap telemetry in `memory_health` | `data.embeddingRetry.flapping` and `transitionsInLast10Min` are present |
| REQ-004 | Count only real circuit transitions | Transition counter increments when breaker opens and when cooldown auto-closes |
| REQ-005 | Mirror source to dist | Equivalent JavaScript edits exist in dist files |
| REQ-006 | Document thresholds | `resource-map.md` includes all five requested metric rows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Include sample health output | `implementation-summary.md` shows populated sample fields |
| REQ-008 | Document live verification path | Summary explains daemon respawn and `memory_health` checks when live MCP is unavailable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Startup log line `[health] startup pid=... rss=...MB uptime=0s` is present after daemon connect.
- SC-002: `memory_health` includes `data.process.{pid,rss_mb,uptime_seconds}`.
- SC-003: `memory_health` includes `data.embeddingRetry.{flapping,transitionsInLast10Min}`.
- SC-004: `resource-map.md` documents RSS, circuit flapping, queue depth, failed count, and vec/total ratio thresholds.
- SC-005: No save/search/embed/retry behavior changes are introduced.
- SC-006: `implementation-summary.md` includes sample populated `memory_health` output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Memory MCP daemon respawn | Live `memory_health` verification may be unavailable inside Codex sandbox | Document exact verification path and verify source/dist wiring |
| Risk | Transition counter over-counting | False flap signal | Record only breaker open and cooldown auto-close transitions |
| Risk | Behavior drift | Observability packet accidentally changes retry behavior | Do not modify thresholds, provider calls, queue semantics, DB writes, or retry decisions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- NFR-P01: Health telemetry must be synchronous and lightweight.
- NFR-P02: Circuit transition tracking must remain in-memory only.

### Security

- NFR-S01: Process telemetry must not expose absolute paths or secrets.
- NFR-S02: Startup log must include only pid, RSS MB, and uptime.

### Reliability

- NFR-R01: Missing live retry activity must report stable zero-state flap telemetry.
- NFR-R02: Circuit auto-close behavior must remain unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- No circuit transitions: `flapping=false`, `transitionsInLast10Min=0`.
- More than two transitions in 10 minutes: `flapping=true`.
- Old transitions: timestamps older than 10 minutes are excluded.

### Error Scenarios

- Database unavailable: `memory_health` still reports process and retry telemetry in degraded response paths.
- Live MCP unavailable in Codex: verification path is documented without claiming a live pass.

### State Transitions

- Closed to open: record one transition when the existing breaker opens.
- Open to closed: record one transition when cooldown expires and the breaker auto-closes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three source files, three dist mirrors, packet docs |
| Risk | 8/25 | Public health response shape changes, no behavior changes |
| Research | 6/20 | Required locating health response, retry breaker, and server bootstrap |
| Total | 26/70 | Level 2 |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
