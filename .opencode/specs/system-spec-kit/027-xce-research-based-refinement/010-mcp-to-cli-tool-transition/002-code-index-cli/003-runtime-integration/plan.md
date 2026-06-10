---
title: "Implementation Plan: Phase 3: Runtime Integration [system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/plan]"
description: "Planned approach: Pairing per program rule: allowlists, code-graph hook adapters (Claude/Codex) gain the CLI warm path, OpenCode plugin bridge repaired via CLI/IPC transport + CLI fallback, docs, dual-stack window"
trigger_phrases:
  - "code-index runtime integration plan"
  - "002 003-runtime-integration plan"
  - "code-index phase 3 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled plan status with shipped runtime evidence"
    next_safe_action: "Run final multi-runtime transport-down drill"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 3: Runtime Integration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Hook adapters (TS/JS) + plugin bridge (mjs) + runtime configs |
| **Framework** | Existing mk_code_index daemon/launcher stack — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Shipped: warm-only code-index CLI fallback wired into the Claude/Codex session adapters, the mk-code-graph bridge REPAIRED from in-process dist/DB imports to the CLI route (plugin transport contract synthesized from the status payload), allowlists, and the maintenance-tool policy — MCP registrations diff-verified unchanged. The dual-stack observation window remains open by design; binding scope and acceptance criteria live in spec.md and the research record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope pinned in spec.md from the research record + program pairing rule
- [x] Predecessor phase handoff criteria met
- [x] Phase plan executed directly from the existing Level 1 plan and research authority

### Definition of Done
- [x] All P0 requirements in spec.md verified
- [ ] Verification approach below executed with evidence — dual-stack window observations remain open by design
- [x] Phase summary reconciled and parent map updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin client/integration over the existing mk_code_index daemon architecture; no daemon changes in any phase.

### Key Components
- Allowlist entries per runtime for the code-index shim
- Hook pairing (Claude Code, Codex): the code-graph-serving session adapters (`system-spec-kit/mcp_server/hooks/claude/session-prime`, `hooks/codex/session-start`) gain a CLI-backed warm-only path with `--timeout-ms`, fail-open, engaged on MCP-transport-down
- OpenCode plugin: repair `mk-code-graph-bridge.mjs` via a CLI/IPC-backed transport (the in-process import-only fix tried in 026/008 was reverted — it armed a direct-DB dual-writer; the bridge must never initialize the memory DB in-process), then add CLI fallback to the bridge
- Docs: transport-down fallback guidance + maintenance-command policy (scan/apply/verify never from prompt-time hooks)
- **Dual-failure acceptance**: MCP down + daemon dead inside a prompt hook → no cold spawn, fail-open within hook timeout, exit-75 semantics
- **Config-note correction**: `.codex/config.toml` code-index DB-path note updated to the skill-local default

### Data Flow
Runtime hook/plugin → CLI warm path with --timeout-ms (fail-open) → daemon via IPC; MCP path untouched alongside.
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
- [x] Confirm predecessor handoff criteria; load research deltas relevant to this phase

### Phase 2: Core Execution
- [x] Execute the task list in tasks.md (planned rows; expanded at speckit:plan time)

### Phase 3: Verification
- [ ] Transport-down drill passes end-to-end in ≥2 runtimes; plugin functional; window observations recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | Runtime Integration acceptance per spec.md | invocation matrix + targeted vitest + transport-down drill |
| Drill | Dual-failure (MCP stopped + daemon dead) fail-open behavior in hooks | transport-down drill |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-hardening-and-tests | Internal | Complete | Phase cannot start |
| Research authority ../000-code-index-cli-research/research/research.md | Internal | Green | Binding scope source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Remove allowlist entries and hook/plugin CLI paths (all additive); revert via git.
<!-- /ANCHOR:rollback -->
