---
title: "Verification Checklist: 005 substrate-stability-instrumentation"
description: "Verification Date: 2026-05-14"
trigger_phrases:
  - "substrate stability instrumentation checklist"
  - "memory health rss verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation"
    last_updated_at: "2026-05-14T11:25:36Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded verification evidence"
    next_safe_action: "Respawn daemon and call memory_health"
    blockers:
      - "Live Memory MCP daemon restart was outside this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:7777777777777777777777777777777777777777777777777777777777777777"
      session_id: "cli-codex-005-stability-instrumentation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 005 substrate-stability-instrumentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: acceptance criteria list startup log, process fields, flap fields, dist mirror, and summary sample.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: architecture and affected surfaces sections.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: no new package dependency; only Node process APIs and module-local arrays.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes typecheck. Evidence: `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server`.
- [x] CHK-011 [P0] No behavior-path changes. Evidence: save/search/embed DB writes unchanged; only logging, response fields, and transition telemetry added.
- [x] CHK-012 [P1] Error handling unchanged. Evidence: no new throwing paths added.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: existing response envelope and retry-manager export list reused.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Startup log criterion met by code inspection. Evidence: source and dist emit `[health] startup pid=${process.pid} rss=${rssMb}MB uptime=0s` immediately after `server.connect`.
- [x] CHK-021 [P0] `memory_health.data.process` criterion met by source/dist response inspection. Evidence: `processHealth` is included in all successful health response data shapes.
- [x] CHK-022 [P1] Circuit flap criterion met by source/dist response inspection. Evidence: `embeddingRetry` merges `getCircuitFlapState()`.
- [x] CHK-023 [P1] Live MCP verification path documented. Evidence: `implementation-summary.md` lists the daemon respawn command path and expected fields.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: observability gap.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: circuit transitions found in retry-manager open and cooldown-close paths.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `memory-crud-health.ts` is the only new consumer of `getCircuitFlapState()`.
- [x] CHK-FIX-004 [P0] Algorithm invariant stated. Evidence: transition count increments only on actual open/closed changes.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable. Evidence: instrumentation reads process state and module-local telemetry only.
- [x] CHK-FIX-007 [P1] Evidence pinned to command outputs in this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] No user input parsing added.
- [x] CHK-032 [P1] Response fields expose only process pid, RSS MB, uptime seconds, and circuit transition counts.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/summary synchronized.
- [x] CHK-041 [P1] Resource map documents all five requested thresholds.
- [x] CHK-042 [P2] README not applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created in packet.
- [x] CHK-051 [P1] No scratch cleanup needed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Acceptance Criterion | Result | Evidence |
|---------------------|--------|----------|
| Startup log line emitted | PASS | Source and dist contain post-connect `[health] startup ...` log |
| `memory_health.data.process` fields | PASS | Source and dist include `process: processHealth` |
| `embeddingRetry.flapping` and transition count | PASS | Source and dist merge `getCircuitFlapState()` |
| `resource-map.md` has five metric rows | PASS | Threshold table created |
| No behavior change to save/search/embed/retry paths | PASS | No DB write, provider call, retry threshold, or retry scheduling logic changed |
| Summary includes sample health output | PASS | See `implementation-summary.md` |
| Direct dist handler response includes new fields | PASS | Local Node invocation returned `process` and flap fields |
| Live MCP response verified after daemon restart | DEFERRED | Sandbox did not expose a clean daemon restart; path documented |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->
