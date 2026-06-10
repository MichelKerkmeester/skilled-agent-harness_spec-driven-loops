---
title: "Implementation Plan: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/plan]"
description: "Implemented approach: spec-memory CLI binary with runtime 37-subcommand generation from TOOL_DEFINITIONS, Zod at argv, IPC connect with auto-spawn, exit map 0/1/64/69/75, shim with dist-freshness and short-socket-dir guards."
trigger_phrases:
  - "spec-memory cli core plan"
  - "cli subcommand codegen plan"
  - "spec-memory shim plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core"
    last_updated_at: "2026-06-07T12:45:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Delivered daemon-backed spec-memory CLI core and shim"
    next_safe_action: "Run phase 002 hardening/parity suites and phase 003 runtime integration"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 1: CLI Core

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) + Node CJS shim |
| **Framework** | Existing daemon/IPC stack (launcher, bridge, session proxy) — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Implemented CLI core: `spec-memory-cli.ts` builds its command map from `TOOL_DEFINITIONS`, validates argv-derived objects through existing Zod schemas, calls the daemon through `daemon-ipc.sock`, auto-spawns via the existing launcher when the daemon is unavailable, maps exits 0/1/64/69/75, and runs behind `.opencode/bin/spec-memory.cjs` with dist-freshness and short-socket-dir guards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope pinned in spec.md from the completed research record
- [x] Predecessor phase handoff criteria met
- [x] Phase plan executed directly from the existing Level 1 plan and research authority

### Definition of Done
- [x] All P0 requirements in spec.md implemented with targeted verification evidence
- [x] CLI core verification executed with targeted vitest, typecheck, build, and live smoke evidence
- [x] Phase summary reconciled and parent map updated after final strict validation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin client over the existing daemon/IPC architecture; no daemon changes in any phase.

### Key Components
- **Entrypoint**: compiled `mcp_server/spec-memory-cli.ts` — argv -> Zod -> IPC -> formatted output -> exit code
- **Shim**: `.opencode/bin/spec-memory.cjs` — dist-freshness guard, socket-dir default, exec of dist CLI
- **Command map**: subcommands generated at runtime from `TOOL_DEFINITIONS` (37 tools, drift-proof)
- **Connect path**: `getIpcSocketPath()` + auto-spawn via the existing launcher on ENOENT/dead socket

### Data Flow
argv -> runtime command-map parser -> Zod validateToolArgs -> IPC request over daemon-ipc.sock (spawn on demand) -> JSON-RPC response -> --format renderer -> exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Implemented surfaces are listed below.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/spec-memory-cli.ts` | New daemon-backed CLI | Create | Targeted vitest, typecheck, build, live smoke |
| `.opencode/bin/spec-memory.cjs` | Stable user-facing shim | Create | Build freshness and live smoke |
| `mcp_server/tests/spec-memory-cli.vitest.ts` | Targeted CLI tests | Create | `npx vitest run tests/spec-memory-cli.vitest.ts` |
| `mcp_server/package.json` | Package bin manifest | Modify | Typecheck/build |
| `mcp_server/tsconfig.json` | Build include list | Modify | Typecheck/build |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm predecessor handoff criteria; load research deltas relevant to this phase

### Phase 2: Core Execution
- [x] Execute the task list in tasks.md

### Phase 3: Verification
- [x] Targeted CLI parser/IPC/exit-code tests, package typecheck/build, and live-daemon smoke for `memory_stats`
- [ ] Full 37-tool invocation matrix, dual-spawn race tests, and p95 timing sample remain in phase 002 hardening
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | CLI Core acceptance per spec.md | manual invocation matrix + targeted vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Daemon/IPC stack (unchanged) | Internal | Green | Phase cannot start |
| Research record ../000-spec-memory-cli-research/research/research.md | Internal | Green | Scope authority for this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Revert the phase commits via git; the MCP surface is untouched throughout (dual-stack), so rollback has no continuity impact.
<!-- /ANCHOR:rollback -->
