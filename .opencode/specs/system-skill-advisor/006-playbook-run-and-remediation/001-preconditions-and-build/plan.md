---
title: "Implementation Plan: Preconditions and Build (Playbook Run Phase 001)"
description: "Build both MCP servers, confirm env flags, create evidence workspaces, and probe CLI executor availability for the skill-advisor playbook run."
trigger_phrases:
  - "playbook preconditions plan"
  - "028 phase 001 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-playbook-run-and-remediation/001-preconditions-and-build"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Documented precondition plan"
    next_safe_action: "Phase 002 MCP-native scenarios"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Preconditions and Build (Playbook Run Phase 001)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 25), Python 3 |
| **Framework** | MCP servers (system-spec-kit, system-skill-advisor) |
| **Storage** | SQLite skill-graph, JSONL diagnostics |
| **Testing** | vitest, python regression/bench scripts |

### Overview
Run the documented build commands for both MCP servers, verify env flags and evidence dirs, then probe `devin` and `opencode` so the delegated waves have authenticated executors.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Build-then-probe gating step.

### Key Components
- **system-spec-kit/mcp_server**: hooks, validation, memory generators
- **system-skill-advisor/mcp_server**: advisor handlers, scorer, daemon, dist hooks

### Data Flow
`npm run build` compiles TS to `dist/`; advisor hooks and compat entry are emitted; scenarios then read these artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix packet. No source surfaces are modified; only build artifacts are regenerated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/dist` | compiled runtime | regenerate | `ls dist/` + `advisor_status` live |
| CLI executors | external dispatch | probe only | `devin auth status`, `opencode providers list` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm build scripts exist in both mcp_server package.json files
- [x] Create `/tmp/skill-advisor-playbook` and `/tmp/devin-hook-playbook`
- [x] Confirm `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset

### Phase 2: Core Implementation
- [x] Build system-spec-kit mcp_server
- [x] Build system-skill-advisor mcp_server
- [x] Verify advisor devin hook dist artifact exists

### Phase 3: Verification
- [x] `advisor_status` returns live
- [x] `devin auth status` logged in; `opencode providers list` shows DeepSeek
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | TS compile both servers | npm / tsc |
| Smoke | advisor_status live | MCP tool |
| Probe | CLI auth | devin / opencode CLIs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 25 + Python 3 | External | Green | Build/scenarios cannot run |
| devin CLI auth | External | Green | PC/CP/AU delegation blocked |
| opencode DeepSeek provider | External | Green | SC/AI/LC delegation blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build failure or corrupted dist.
- **Procedure**: Re-run `npm run build`; dist is fully regenerable from source.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Build) ──► Phase 3 (Verify) ──► downstream phases 002-004
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Build |
| Build | Setup | Verify |
| Verify | Build | Phases 002-004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 min |
| Build | Low | 5 min |
| Verification | Low | 5 min |
| **Total** | | **~15 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (build artifacts only)
- [x] No feature flag changes
- [x] No source mutations

### Rollback Procedure
1. Re-run `npm --prefix <server> run build`
2. Confirm `advisor_status` live
3. No stakeholder notification needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
