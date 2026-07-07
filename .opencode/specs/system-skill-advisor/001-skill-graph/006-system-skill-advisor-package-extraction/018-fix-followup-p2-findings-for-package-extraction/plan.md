---
title: "Implementation Plan: 10-iter P2 cleanup"
description: "Plan for P2 audit buckets, surgical fixes, verification, and named follow-ons."
trigger_phrases:
  - "013/009/018 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "Plan executed"
    next_safe_action: "Strict-validate packet and commit"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: 10-iter P2 cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, JSON, TOML |
| **Framework** | Vitest, MCP config files |
| **Testing** | Advisor package Vitest, typecheck, JSON parse, strict spec validation |

Audit first, then fix only surgical P2s. Defer broad boundary redesign, subprocess env whitelisting, plugin-bridge unit isolation, cold-start caching, and parent historical doc drift to named packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] All 28 P2 findings listed from iter-010.
- [x] Current HEAD verified before edits.
- [x] Gate 3 pre-answered for packet 018.

### Definition of Done

- [x] 28/28 P2s bucketed.
- [x] 18 P2s fixed in this dispatch.
- [x] 3 P2s classified not applicable against current historical/validated state.
- [x] 7 P2s mapped to named follow-ons.
- [x] Advisor Vitest passes: 299/299.
- [x] Strict validation passes for 018.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Centralize duplicate dispatch behavior into `tools/index.ts`, keep `advisor-server.ts` as MCP transport glue, and preserve existing public tool descriptors.

### Key Components

- **Tool registration**: `TOOL_DEFINITIONS` and `dispatchTool`.
- **Runtime configs**: four MCP surfaces with aligned advisor env controls.
- **Scorer/watcher**: small hot-path and configurability improvements.
- **Tests**: direct regression tests for each surgical change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-server.ts` | MCP server entrypoint | Import shared dispatch/table | Dispatch/listing tests |
| `tools/index.ts` | Tool descriptor module | Own dispatch/table | Dispatch/listing tests |
| Runtime configs | MCP server setup | Add aligned advisor env vars | Rename invariants test, JSON parse |
| `fusion.ts` | Scoring hot path | Index lane matches once | Full advisor Vitest |
| `watcher.ts` | Daemon backpressure | Add env-tunable defaults | Typecheck and full Vitest |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit

- [x] Build finding ledger and current-state buckets.

### Phase 2: Surgical Fixes

- [x] Fix dispatch duplication, cross-package import, fixture ownership, config parity, robustness, testing, performance, and watcher advisories.

### Phase 3: Deferrals

- [x] Name follow-on packets for broad P2s.

### Phase 4: Verification

- [x] Run full advisor Vitest.
- [x] Run typecheck and JSON parse checks.
- [x] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/integration | Advisor package | `npm test` |
| Type | TS package | `npm run typecheck` |
| Config | Runtime JSON parse and parity assertions | Node + Vitest |
| Metadata | Spec packet contract | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Review ledger | Evidence | Read | No silent skips allowed. |
| Existing dirty worktree | Operational | Present | Requires explicit staging. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor test regression, runtime config parse failure, or MCP launch regression.
- **Procedure**: Revert 018 commit and rerun advisor Vitest plus config parse checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | Review evidence | Fixes |
| Fixes | Audit | Verification |
| Deferrals | Audit | Completion ledger |
| Verification | Fixes | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Medium | Completed in-session |
| Fixes | Medium | Completed in-session |
| Verification | Medium | In progress |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migration. Runtime config and source changes are git-revertible.
<!-- /ANCHOR:enhanced-rollback -->
