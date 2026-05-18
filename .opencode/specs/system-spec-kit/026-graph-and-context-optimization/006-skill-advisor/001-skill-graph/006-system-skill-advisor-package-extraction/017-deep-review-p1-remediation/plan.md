---
title: "Implementation Plan: 10-iter P1 remediation"
description: "Plan for lockdir recovery and shadow-sink path containment."
trigger_phrases:
  - "013/009/017 plan"
  - "P1 remediation plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/017-deep-review-p1-remediation"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "Plan executed"
    next_safe_action: "Strict-validate packet and commit"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: 10-iter P1 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS launcher, TypeScript, Vitest |
| **Framework** | MCP stdio launcher and advisor package tests |
| **Storage** | Package-local advisor database directory and JSONL shadow sink |
| **Testing** | Full advisor `npm test`, targeted syntax/type checks, strict spec validation |

The P1 plan is intentionally narrow: make bootstrap lock ownership recoverable after crash, make dist freshness content-aware by source mtimes, and reject env-controlled shadow sink paths outside the workspace.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Review report and all ten iteration files read.
- [x] R-004 and S-004 verified against current HEAD.
- [x] Gate 3 pre-answered for packet 017.

### Definition of Done

- [x] R-004 fixed and covered.
- [x] S-004 fixed and covered.
- [x] Advisor Vitest passes: 299/299.
- [x] Strict validation passes for 017.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Small guard helpers around existing launcher/sink code, with exported test seams that do not change production CLI behavior.

### Key Components

- **Launcher bootstrap**: `acquireBootstrapLock()`, `artifactsReady()`, stale lock removal.
- **Shadow sink**: env-var path resolution, workspace containment, append/rotate behavior.
- **Tests**: direct helper tests to avoid spawning a live MCP server.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-skill-advisor-launcher.cjs` | Cold-start build and server launch | Add stale lock removal and source mtime freshness | `launcher-bootstrap.vitest.ts`, `node -c` |
| `shadow-sink.ts` | Shadow delta JSONL sink | Bound env-var path to workspace | `shadow-sink.vitest.ts` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit

- [x] Read immutable review report, iter files, and state file.
- [x] Verify R-004/S-004 against current code.

### Phase 2: Implementation

- [x] Add stale lockdir removal and artifact source mtime check.
- [x] Add env-var path containment for the shadow sink.
- [x] Add focused regression tests.

### Phase 3: Verification

- [x] Run full advisor Vitest.
- [x] Run launcher syntax check and TypeScript typecheck.
- [x] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lockdir, artifacts, shadow sink | Vitest |
| Package | Advisor package | `npm test` |
| Syntax/type | Launcher and TS compile | `node -c`, `npm run typecheck` |
| Metadata | Spec packet contract | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor package tests | Internal | Green | Blocks commit if regressed. |
| Review ledger | Evidence | Read-only | Source of truth for P1 closure. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Launcher startup regression or shadow sink false rejection.
- **Procedure**: Revert 017 commit, rerun advisor Vitest, and restore prior launcher/sink behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | Review artifacts | Implementation |
| Implementation | Audit | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Low | Completed in-session |
| Implementation | Medium | Completed in-session |
| Verification | Medium | In progress |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migration. Reverting the commit restores prior runtime behavior.
<!-- /ANCHOR:enhanced-rollback -->
