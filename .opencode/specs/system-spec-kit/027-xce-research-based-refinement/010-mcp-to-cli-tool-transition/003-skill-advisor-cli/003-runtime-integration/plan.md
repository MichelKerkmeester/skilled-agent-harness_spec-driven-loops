---
title: "Implementation Plan: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/plan]"
description: "Planned approach: Pairing per program rule: prompt-submit advisor-brief hooks (Claude/Codex) gain the CLI warm path under the <60ms cache-hit p95 bar (D4), mk-skill-advisor plugin bridge gains CLI fallback, config compatibility (D7), doctor routes, docs"
trigger_phrases:
  - "skill-advisor runtime integration plan"
  - "003 003-runtime-integration plan"
  - "skill-advisor phase 3 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "T9xx transport-down drill PASSED; verification approach executed"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
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
| **Framework** | Existing mk_skill_advisor daemon/launcher stack — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Shipped: warm-only prompt-submit hook fallback for Claude/Codex, CLI fallback routing in the mk-skill-advisor bridge, read-only doctor CLI probes, and Gate-2 facade-vs-CLI guidance — MCP registrations diff-verified unchanged. The dual-stack observation window remains open by design; binding scope and acceptance criteria live in spec.md and the research record.
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
- [x] Verification approach below executed with evidence — T9xx transport-down drill PASSED across Claude+Codex hooks (fail-open, no cold spawn, exit-75)
- [x] Phase summary reconciled and parent map updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin client/integration over the existing mk_skill_advisor daemon architecture; no daemon changes in any phase.

### Key Components
- Hook pairing (Claude Code, Codex): the UserPromptSubmit advisor-brief adapters (`system-skill-advisor/hooks/{claude,codex}/user-prompt-submit`) gain a CLI-backed warm-only path with `--timeout-ms`, fail-open; one-shot native bridge per prompt remains banned (824.8ms measured)
- OpenCode plugin: `mk-skill-advisor-bridge.mjs` gains CLI fallback (bridge currently probes MCP; add the CLI path for transport-down)
- Config compatibility: MCP registrations across OpenCode/Codex/Claude stay unchanged (CLI is additive)
- Doctor routes: add CLI checks to doctor:skill-advisor + skill-budget surfaces
- **Three-way latency acceptance**: cache-hit p95 <60ms / warm non-cache ceiling / cold fail-open — verified separately
- **Dual-failure acceptance**: MCP down + daemon dead inside a prompt hook → no cold spawn, fail-open within hook timeout, exit-75 semantics

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
- [x] Transport-down drill passes in ≥2 runtimes within budget; plugin fallback works; docs published — PASSED (Claude+Codex hook suites + unavailable fail-open; launcher delta 0)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | Runtime Integration acceptance per spec.md | invocation matrix + targeted vitest + transport-down drill |
| Drill | Dual-failure + three-way latency checks | transport-down drill + timing harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-hardening-and-tests | Internal | Complete | Phase cannot start |
| Research authority ../000-skill-advisor-cli-research/research/research.md | Internal | Green | Binding scope source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Remove allowlist entries and hook/plugin CLI paths (all additive); revert via git.
<!-- /ANCHOR:rollback -->
