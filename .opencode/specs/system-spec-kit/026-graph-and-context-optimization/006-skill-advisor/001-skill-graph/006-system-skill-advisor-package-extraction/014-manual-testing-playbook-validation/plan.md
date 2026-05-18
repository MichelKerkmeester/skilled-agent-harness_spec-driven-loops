---
title: "Implementation Plan: 014 Manual Testing Validation"
description: "Plan for manual scenario execution, plugin bridge regression classification, and packet strict-validation repair."
trigger_phrases:
  - "013/009/014 plan"
  - "advisor manual testing plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/014-manual-testing-playbook-validation"
    last_updated_at: "2026-05-14T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Plan executed; full advisor Vitest and strict validation pass"
    next_safe_action: "Commit scoped close-out changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Implementation Plan: 014 Manual Testing Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | OpenCode native MCP tool calls |
| **Package** | `.opencode/skills/system-skill-advisor/mcp_server` |
| **Bridge** | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` |
| **Testing** | Vitest, strict spec validation |

### Overview

The packet runs the manual testing playbook, records scenario outcomes, classifies plugin bridge test failures, and repairs the generated docs so the packet satisfies the Level 2 strict-validation contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered as Option C for related 013/009/014 updates.
- [x] Manual dispatch log and D2b implementation summary read.
- [x] Plugin bridge test failures reproduced.
- [x] Template and frontmatter contracts loaded.

### Definition of Done

- [x] Plugin bridge compat suites pass.
- [x] Packet 014 strict validation passes.
- [x] Full advisor vitest reports at least 291 passing tests.
- [x] Parent and lane strict validation pass.
- [x] Commit contains only scoped close-out changes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manual runtime evidence is recorded in packet docs, while automated compatibility evidence comes from the advisor Vitest package. The plugin bridge is a cross-package runtime helper: advisor tests spawn the bridge from the system-spec-kit plugin bridge path, and that bridge launches the advisor MCP server.

### Data Flow

OpenCode MCP calls validate the live advisor tools. Plugin bridge tests validate the subprocess envelope by spawning Node against the bridge file. Strict validation checks packet markdown structure, anchors, frontmatter continuity, and checklist priority tags.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm branch is `main`.
- [x] Locate packet 014 under the nested 013/009 folder.
- [x] Read required logs, summaries, bridge tests, and template contracts.

### Phase 2: Implementation

- [x] Restore missing system-spec-kit workspace dependencies expected by `package-lock.json`.
- [x] Add plugin bridge test cleanup for the shared advisor generation marker.
- [x] Re-run plugin bridge smoke, compat, and shim interaction suites.
- [x] Rewrite packet docs to Level 2 template shape.
- [x] Normalize frontmatter actor slugs and checklist priority tags.

### Phase 3: Verification

- [x] Run targeted plugin bridge Vitest.
- [x] Run full advisor Vitest.
- [x] Run strict validation for packet 014.
- [x] Run strict validation for parent 009 and lane 013.
- [x] Commit scoped changes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Targeted Vitest | Plugin bridge compat and smoke tests | `npm test -- tests/compat/plugin-bridge.vitest.ts tests/compat/plugin-bridge-smoke.vitest.ts` |
| Package Vitest | Full advisor package | `npm test` |
| Packet validation | Packet 014 strict docs | `validate.sh 014-manual-testing-playbook-validation --strict` |
| Parent validation | 009 parent and 013 lane | `validate.sh <parent> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-spec-kit workspace install | Local runtime | Restored | Plugin bridge subprocess cannot import MCP SDK. |
| Advisor package test runner | Local runtime | Available | Full pass count cannot be verified without Vitest. |
| Spec Kit validator | Local script | Available | Completion cannot be claimed without strict validation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet validation regresses or advisor tests fail after scoped edits.
- **Procedure**: Revert the packet doc edits, restore prior docs from git, and rerun targeted validation to confirm the rollback.
- **Data impact**: No external data migration is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 and required reads | Implementation |
| Implementation | Setup and test reproduction | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed in-session |
| Implementation | Medium | Completed in-session |
| Verification | Medium | In progress |
| **Total** | | **Single close-out dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert of the close-out commit restores the prior packet docs; `node_modules` install-state restoration is not staged.
<!-- /ANCHOR:enhanced-rollback -->
