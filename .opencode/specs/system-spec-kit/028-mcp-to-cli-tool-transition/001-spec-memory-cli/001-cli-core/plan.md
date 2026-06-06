---
title: "Implementation Plan: Phase 1: CLI Core [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/plan]"
description: "Planned approach: spec-memory CLI binary: codegen of 37 subcommands from TOOL_DEFINITIONS, Zod at argv, IPC connect with auto-spawn, exit map 0/1/64/69/75, shim with dist-freshness and short-socket-dir guards."
trigger_phrases:
  - "spec-memory cli core plan"
  - "cli subcommand codegen plan"
  - "spec-memory shim plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core"
    last_updated_at: "2026-06-06T12:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase to expand the plan before implementation"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
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
Planned phase (~5-6 days); not implemented. spec-memory CLI binary: codegen of 37 subcommands from TOOL_DEFINITIONS, Zod at argv, IPC connect with auto-spawn, exit map 0/1/64/69/75, shim with dist-freshness and short-socket-dir guards. Detailed planning happens via speckit:plan when this phase opens; the binding scope and acceptance criteria live in spec.md and the parent research record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope pinned in spec.md from the completed research record
- [ ] Predecessor phase handoff criteria met
- [ ] speckit:plan pass completed for this phase

### Definition of Done
- [ ] All P0 requirements in spec.md verified
- [ ] Verification approach below executed with evidence
- [ ] Phase summary reconciled and parent map updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin client over the existing daemon/IPC architecture; no daemon changes in any phase.

### Key Components
- **Entrypoint**: compiled `mcp_server/spec-memory-cli.ts` — argv -> Zod -> IPC -> formatted output -> exit code
- **Shim**: `.opencode/bin/spec-memory.cjs` — dist-freshness guard, socket-dir default, exec of dist CLI
- **Codegen**: subcommand manifest generated from `TOOL_DEFINITIONS` (37 tools, drift-proof)
- **Connect path**: `getIpcSocketPath()` + auto-spawn via the existing launcher on ENOENT/dead socket

### Data Flow
argv -> generated subcommand parser -> Zod validateToolArgs -> IPC request over daemon-ipc.sock (spawn on demand) -> JSON-RPC response -> --format renderer -> exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planned-state placeholder: surfaces are enumerated in spec.md "Files to Change" and re-verified at speckit:plan time.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| See spec.md Files to Change | per spec | per spec | per Testing Strategy below |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm predecessor handoff criteria; load research deltas relevant to this phase

### Phase 2: Core Execution
- [ ] Execute the task list in tasks.md (planned rows; expanded at speckit:plan time)

### Phase 3: Verification
- [ ] Manual invocation matrix across the 37 subcommands; exit-code spot checks for retryable vs terminal classes; warm-path timing sample vs the ~50ms p95 baseline.
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
