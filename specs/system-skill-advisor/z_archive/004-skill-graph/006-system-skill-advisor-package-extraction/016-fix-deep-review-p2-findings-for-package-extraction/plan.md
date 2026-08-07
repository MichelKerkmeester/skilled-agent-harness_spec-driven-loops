---
title: "Implementation Plan: P2 remediation for 015 deep-review advisories"
description: "Surgical cleanup plan for the 015 deep-review P2 advisories and D2b shared seam documentation."
trigger_phrases:
  - "013/009/016 plan"
  - "p2 remediation plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction"
    last_updated_at: "2026-05-14T21:30:00Z"
    last_updated_by: "codex"
    recent_action: "Remediation committed and pushed"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: P2 remediation for 015 deep-review advisories

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, JSON, TOML, Markdown |
| **Framework** | MCP server with Vitest package tests |
| **Storage** | SQLite skill graph database, runtime files excluded |
| **Testing** | Advisor package `npm test`, `npm run build`, Spec Kit strict validation |

### Overview

This plan closes the P2 ledger without changing the 015 rename boundary. The implementation is a narrow set of metadata, docs, env-var, and test additions, followed by package build/test evidence and strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Required review report and five iteration files read.
- [x] D2b broader seams section read.
- [x] Parent graph metadata and env-var source files read.

### Definition of Done
- [x] All 11 scoped items fixed or explicitly documented.
- [x] Advisor Vitest passes with at least 291 tests.
- [x] Packet 016 and parent 013/009 strict validation pass.
- [x] Commit and push complete on `main`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical follow-up packet. No ownership or public interface refactor.

### Key Components
- **Parent metadata**: Carries phase-child routing and memory discoverability.
- **Advisor DB resolver points**: Launcher, status handler, projection, and skill graph DB all consume the override env var.
- **Rename-invariant tests**: Static tests guard rename identity across source and runtime configs.
- **Packet docs**: Record D2b shared-seam acceptance and verification evidence.

### Data Flow

The advisor database path resolves from `MK_SKILL_ADVISOR_DB_DIR`, then `SYSTEM_SKILL_ADVISOR_DB_DIR`, then package-local default. Runtime configs document that same order, while tests guard the MCP server id and launcher path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Parent graph metadata | Search/continuity routing for 013/009 | Update stale mk launcher entries and active child | Strict parent validation plus `rg` stale launcher check |
| Env var readers | Runtime DB override | Prefer `MK_SKILL_ADVISOR_DB_DIR`, fallback to legacy | `rg` env-var inventory plus advisor tests |
| Runtime configs | Runtime MCP registration docs | Update DB override notes | New config parity Vitest |
| Advisor README/SET-UP guide | Operator validation commands | Point tests at advisor package | `rg` stale README path check |
| Shared seams | Neutral re-export utilities | Document accepted-as-is | Implementation summary decisions |

Required inventories completed:

- Env readers: `rg -n "SYSTEM_SKILL_ADVISOR_DB_DIR|MK_SKILL_ADVISOR_DB_DIR" .opencode/skills/system-skill-advisor .opencode/bin opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json`.
- Rename invariants: `advisor-server.ts`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`.
- Shared seams: `lib/utils/sqlite-integrity.ts` and `lib/utils/skill-label-sanitizer.ts` from D2b's `BROADER_SEAMS_SHARED_FLAGGED`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read required review and source context.
- [x] Scaffold Level 2 packet docs.
- [x] Verify findings are still open before editing.

### Phase 2: Core Implementation
- [x] Update parent graph metadata.
- [x] Add mk-prefixed DB override fallback logic.
- [x] Add rename-invariant tests.
- [x] Fix stale advisor validation docs.
- [x] Document shared seam acceptance.

### Phase 3: Verification
- [x] Run advisor build and test suite.
- [x] Run packet 016 strict validation.
- [x] Run parent 013/009 strict validation.
- [x] Commit and push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Rename invariants and advisor package regression | `npm test` in advisor MCP |
| Build | Fresh dist from source | `npm run build` in advisor MCP |
| Spec validation | Packet 016 and parent 013/009 | `validate.sh --strict` |
| Grep | Stale paths and env-var references | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor package node_modules | Internal | Green | Blocks `npm test` and `npm run build`. |
| Spec Kit validator | Internal | Green | Blocks completion claim. |
| Git remote `origin main` | External | Unknown until push | Blocks final dispatch success if remote rejects. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor tests, build, or strict validation fail from these edits.
- **Procedure**: Revert this packet commit, leaving 015 shipped state intact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 20 minutes |
| Core Implementation | Medium | 45 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **95 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No branch creation.
- [x] Runtime database dirty files ignored.
- [x] No forced git operations.

### Rollback Procedure
1. Revert the remediation commit.
2. Re-run advisor tests and relevant strict validations.
3. Re-open the P2 ledger if rollback happens.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git revert only.
<!-- /ANCHOR:enhanced-rollback -->
