---
title: "Implementation Plan: Phase 12: ci-and-binaries"
description: "Deleted the launcher, CLI shim, and their tests; stripped the shared launcher-ipc-bridge branch that also serves the surviving mk-spec-memory and mk-skill-advisor daemons; removed smoke matrices, gitignore patterns, the deploy-mcp build step, and the CI isolation job that policed the now-removed import boundary."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/012-ci-and-binaries"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-012-ci-and-binaries"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: ci-and-binaries

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CJS launchers), YAML (CI), shell (deploy) |
| **Framework** | GitHub Actions, shared launcher-ipc-bridge |
| **Storage** | None |
| **Testing** | Launcher vitest suites (deleted), surviving daemon start checks |

### Overview
Removed the executable surface and its supporting CI. The launcher, CLI shim, and their vitest suites were deleted by a concurrent session; this session stripped the shared launcher-ipc-bridge branch (never deleted, because it serves the surviving mk-spec-memory and mk-skill-advisor daemons), removed the smoke matrices, gitignore patterns, the deploy-mcp build step, and deleted the CI isolation job that policed the now-removed import boundary.
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
Binary deletion plus shared-library strip, with CI job removal and ignore-pattern cleanup.

### Key Components
- **Launcher and CLI**: `mk-code-index-launcher.cjs` and `code-index.cjs` deleted (by concurrent session)
- **Shared launcher-ipc-bridge**: `launcher-ipc-bridge.cjs` stripped of the code-graph branch only; never deleted because it serves mk-spec-memory and mk-skill-advisor
- **Smoke matrices**: graph CLI entries removed from offline and exit-taxonomy smokes
- **CI isolation job**: `isolation-check.yml` deleted (guarded a boundary that no longer exists)
- **Deploy script**: `build_pkg "code-graph"` step removed from `deploy-mcp.sh`
- **Gitignore**: artifact patterns for the removed subsystem cleared

### Data Flow
With the launcher and CLI gone, nothing in the repository can attempt to start or test the subsystem. The shared bridge still loads for the two surviving daemons, verified after the strip.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a fix_bug finding. This phase is a binary and CI removal, not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Launcher / CLI | Executable front door for the removed server | Deleted (concurrent session) | No binary targeting the subsystem remains |
| Shared launcher-ipc-bridge | Branches on serviceName for three daemons | Stripped (code-graph branch only; never deleted) | Both surviving daemons start and serve after strip |
| Smoke matrices | Included the removed CLI | Entries removed | Smoke scripts pass without the removed CLI |
| CI isolation job | Policed the spec-kit import boundary | Deleted | Remaining CI is green |
| Deploy script | Built the removed package | `build_pkg "code-graph"` step removed | Deploy script runs without the step |
| Gitignore | Carried artifact patterns for the subsystem | Cleared | No orphan ignore rule points inside the removed folder |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phases 003-011 removed every caller so deleting the launcher breaks nothing still in use

### Phase 2: Core Implementation
- [x] Launcher, CLI shim, and six launcher vitest suites deleted (concurrent session)
- [x] Stripped the shared `launcher-ipc-bridge.cjs` code-graph branch (never deleted; serves mk-spec-memory + mk-skill-advisor)
- [x] Removed smoke matrices (commit `fef098b6b2`)
- [x] Cleared gitignore patterns for the subsystem's database and build artifacts
- [x] Removed `build_pkg "code-graph"` step from `deploy-mcp.sh`
- [x] Deleted the CI isolation job (commit `1e548b0ed5`)

### Phase 3: Verification
- [x] Both surviving daemons (mk-spec-memory, mk-skill-advisor) start and serve after the shared bridge strip
- [x] Remaining CI is green with the isolation job absent
- [x] No executable targeting the subsystem remains in the bin directory
- [x] No gitignore orphan pattern points inside the removed folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Surviving daemon startup | Manual start of mk-spec-memory and mk-skill-advisor |
| CI | Remaining workflow suite | GitHub Actions |
| Manual | Smoke scripts | Offline and exit-taxonomy smokes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 003-011 | Internal | Green | A surviving caller would break on launcher deletion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A surviving daemon needs the code-graph branch back (not expected; the bridge was stripped, not deleted).
- **Procedure**: Restore the code-graph branch in `launcher-ipc-bridge.cjs` from git history (commit `fef098b6b2` predecessor), and restore the launcher, CLI, and CI job from the same point.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
