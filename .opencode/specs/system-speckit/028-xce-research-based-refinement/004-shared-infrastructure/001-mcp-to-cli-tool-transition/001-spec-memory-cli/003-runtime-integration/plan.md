---
title: "Implementation Plan: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/plan]"
description: "Planned approach: Adoption surfaces: per-runtime allowlists for the shim, warm-only hook policy, packaging/install steps, MCP-transport-down fallback guidance, dual-stack verification window."
trigger_phrases:
  - "cli runtime integration plan"
  - "spec-memory allowlist plan"
  - "dual-stack rollout plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled plan status with shipped runtime evidence"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 90
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
| **Language/Stack** | TypeScript (mcp_server) + Node CJS shim |
| **Framework** | Existing daemon/IPC stack (launcher, bridge, session proxy) — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Shipped: warm-only CLI fallback in the Claude/Codex hook adapters (socket probe first, fail-open, no prompt-time cold spawn), the NEW OpenCode mk-spec-memory plugin with a CLI/IPC-transport-only bridge, runtime allowlists, and AGENTS.md transport-down guidance — MCP registrations diff-verified unchanged. The dual-stack observation window remains open by design; binding scope and acceptance criteria live in spec.md and the parent research record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope pinned in spec.md from the completed research record
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
Thin client over the existing daemon/IPC architecture; no daemon changes in any phase.

### Key Components
- **Allowlists**: Claude Bash pattern + Codex/OpenCode equivalents for the shim
- **Hook policy**: warm-only with --timeout-ms at prompt-time; cold spawn only SessionStart/prewarm/cron
- **Packaging**: bin wiring + fresh-checkout install verification
- **Fallback guidance**: transport-down detection signal + exact CLI invocation + exit-75 retry semantics
- **Hook pairing ×2 runtimes**: spec-memory-serving adapters (Claude/Codex) gain the CLI warm path, fail-open
- **OpenCode plugin (NEW)**: spec-memory plugin + bridge (mk-skill-advisor pattern); OpenCode memory access is MCP-only today
- **Codex live-registration rewiring**: `.codex/hooks.json` → Codex adapters (today it points at the Claude scripts), smoked against the live file
- **Dual-failure acceptance**: MCP down + daemon dead inside a prompt hook → no cold spawn, fail-open within hook timeout, exit-75 semantics

### Data Flow
Runtime permission config -> shim invocation under allowlist -> hook callers use warm-only policy -> dual-stack window observations recorded -> rollback = remove allowlist entries.
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
- [x] Execute the task list in tasks.md (window-observation row T008 stays open by design)

### Phase 3: Verification
- [ ] End-to-end transport-down drill (kill MCP transport, CLI keeps continuity ops working); two runtimes invoke without manual approval; window observations recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | Runtime Integration acceptance per spec.md | manual invocation matrix + targeted vitest |
| Drill | Dual-failure (MCP stopped + daemon dead) fail-open behavior in hooks | transport-down drill |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-hardening-and-tests green | Internal | Complete | Phase cannot start |
| Research record ../000-spec-memory-cli-research/research/research.md | Internal | Green | Scope authority for this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Remove allowlist entries (CLI is additive); revert doc changes via git.
<!-- /ANCHOR:rollback -->
