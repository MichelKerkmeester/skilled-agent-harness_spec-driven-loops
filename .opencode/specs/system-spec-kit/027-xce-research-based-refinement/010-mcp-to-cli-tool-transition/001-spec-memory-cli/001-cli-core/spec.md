---
title: "Feature Specification: Phase 1: CLI Core [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/spec]"
description: "Built the spec-memory CLI as a second IPC client over the existing daemon: compiled spec-memory-cli.ts behind a .opencode/bin shim, 37 subcommands generated from TOOL_DEFINITIONS, Zod at argv, exits 0/1/64/69/75, connect-falls-back-to-spawn."
trigger_phrases:
  - "spec-memory cli core"
  - "cli subcommand codegen"
  - "spec-memory shim"
  - "daemon ipc cli client"
  - "cli core phase"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core"
    last_updated_at: "2026-06-07T12:45:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Delivered daemon-backed spec-memory CLI core and shim"
    next_safe_action: "Run phase 002 hardening/parity suites and phase 003 runtime integration"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-spec-memory-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-001-cli-core-scaffold"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: CLI Core

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (core delivered; hardening/runtime integration remain in successor phases) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | 000-spec-memory-cli-research |
| **Successor** | 002-hardening-and-tests |
| **Handoff Criteria** | All 37 subcommands invocable against a live daemon; exit-code contract implemented; auto-spawn path works from a dead socket |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Dual-stack spec-memory CLI implementation: daemon-backed CLI alongside the MCP registration specification.

**Scope Boundary**: The CLI binary and shim only — targeted CLI core tests are included for safety, while race/parity suites remain phase 2; runtime allowlists, packaging docs, and rollout remain phase 3; MCP removal and reference migration remain non-goals.

**Dependencies**:
- Completed research record in `../000-spec-memory-cli-research/research/research.md` (§12 design, §14 terminal classifications) — premise, do not relitigate
- Existing daemon stack unchanged: `mk-spec-memory-launcher.cjs`, `launcher-ipc-bridge.cjs`, session proxy, `TOOL_DEFINITIONS` + Zod schemas

**Deliverables**:
- Compiled `mcp_server/spec-memory-cli.ts` behind a stable `.opencode/bin/spec-memory.cjs` shim
- 37 subcommands generated at runtime from `TOOL_DEFINITIONS` with `--json` escape hatch for complex-schema tools
- Connect-falls-back-to-spawn over `daemon-ipc.sock` reusing the existing launcher
- Exit-code contract 0/1/64/69/75 with 75 covering the retryable class (-32001, SQLITE_BUSY, connection failure)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mk-spec-memory daemon already speaks JSON-RPC over its IPC socket, but the only client surface was the MCP protocol layer — which dies permanently on mid-session transport disconnects, costs schema tokens every session, and needs per-runtime registration. This phase adds the CLI front door for hooks, cron, CI, scripts, and transport-down recovery without changing the MCP registration.

### Purpose
Ship `spec-memory` as a second IPC client over the unchanged daemon: every one of the 37 tools is addressable from a shell, with the MCP registration untouched (dual-stack).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/spec-memory-cli.ts` (compiled) + `.opencode/bin/spec-memory.cjs` shim with dist-freshness guard (stale or missing dist → warn + exit 69 unless dev override)
- Subcommand codegen from the canonical `TOOL_DEFINITIONS` (schema drift impossible by construction); existing Zod `validateToolArgs` at the argv boundary; `--json` escape hatch for complex arg shapes
- Output contracts `--format json|text|jsonl` (JSON canonical); exit map 0 success / 1 runtime / 64 usage / 69 protocol-mismatch terminal / 75 retryable
- Connect path over `getIpcSocketPath()` with auto-spawn via `mk-spec-memory-launcher.cjs` on ENOENT/dead socket; warm-only spawn policy via `--timeout-ms` for hook-aware callers
- `--session-id` flag forwarded into tool args (same 4-layer identity resolution as MCP)
- Socket-path safety: default unset socket dir to `/tmp/mk-spec-memory` (35-byte path), reject paths over the 104-byte Darwin sun_path cap or require explicit TCP fallback

### Out of Scope
- Test suites for races, coexistence, and parity — phase 002
- Runtime allowlists, hook wiring, packaging docs, rollout — phase 003
- MCP removal and the 93-file/1,041-reference migration — standing non-goals of the dual-stack program

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | Create | CLI entrypoint: argv -> Zod -> IPC call -> formatted output -> exit code |
| `.opencode/bin/spec-memory.cjs` | Create | Stable shim: dist-freshness check, short-socket-dir default, exec dist CLI |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts` | Create | Targeted parser/IPC/exit-code coverage for the CLI core |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modify | Expose the `spec-memory` entrypoint |
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Modify | Include the new CLI source in package builds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 37 subcommands generated from TOOL_DEFINITIONS | `spec-memory list-tools --format json` enumerates `TOOL_DEFINITIONS.length` (37); no handwritten per-tool arg mapping |
| REQ-002 | CLI is IPC-only — provably never opens the database directly | CLI entrypoint imports tool schemas and IPC/launcher helpers only; it has no SQLite import path |
| REQ-003 | Auto-spawn on ENOENT/dead socket via the existing launcher | CLI probes the daemon and spawns `mk-spec-memory-launcher.cjs` when the probe is not alive; no second daemon bootstrap path introduced |
| REQ-004 | Exit-code contract implemented | 75 returned for -32001/SQLITE_BUSY/connection-failure; 69 for protocol-version mismatch; 64 usage/schema errors; verified by targeted vitest |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `--session-id`, `--timeout-ms`, `--format` flags wired | Flags reach tool args / spawn policy / renderer respectively |
| REQ-006 | Shim dist-freshness guard + short-socket-dir default | Stale dist exits 69 with rebuild hint; unset socket dir lands under /tmp/mk-spec-memory |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 37/37 tools are addressable through the CLI command map, with live-daemon smoke verified for `memory_stats`
- **SC-002**: Warm-path call overhead remains CLI-process-start dominated; formal p95 measurement stays in phase 002 hardening
- **SC-003**: MCP surface untouched — existing MCP clients work unchanged while the CLI is in use (dual-stack)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Daemon/IPC bridge stability | CLI is a client; bridge regressions block everything | Bridge is test-proven for 8 concurrent clients; no bridge changes in this phase |
| Risk | Daemon-bypass temptation (direct DB open) | High — corruption class | Structural: IPC-only entrypoint, backend-only guard, socket 0o600 + uid checks (per research RQ1) |
| Risk | Complex arg shapes don't map to flags | Med | `--json` escape hatch for the ~7 complex tools (per research RQ2) |
| Risk | Spawn races on simultaneous CLI invocations | Med | Existing triple-lock + re-read CAS already closes it (code-traced); regression tests land in phase 002 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. All feasibility and risk questions were terminally classified in the parent research (`../000-spec-memory-cli-research/research/research.md` §14); planning-level questions belong to speckit:plan on this phase.
<!-- /ANCHOR:questions -->
