---
title: "Implementation Plan: Non-destructive mcp-server build (RC-4)"
description: "Remove the destructive prebuild auto-clean from @spec-kit/mcp-server so tsc --build runs incrementally in place and never deletes the live dist, keeping a running daemon alive across rebuilds; keep clean + add an explicit rebuild for full clean builds."
trigger_phrases:
  - "non-destructive mcp build plan"
  - "prebuild clean removal plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-nondestructive-mcp-server-build"
    last_updated_at: "2026-05-28T20:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + verified non-destructive incremental build"
    next_safe_action: "None; F4 complete pending strict validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000311"
      session_id: "031-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Non-destructive mcp-server build (RC-4)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (composite project, Node ESM) |
| **Framework** | `@spec-kit/mcp-server` (tsc --build + finalize-dist.mjs) |
| **Storage** | N/A (build tooling) |
| **Testing** | vitest (`dist-freshness`, source/dist orphan) |

### Overview
Remove the `prebuild` auto-clean (`rmSync('dist')`) so `tsc --build` updates `dist/` incrementally in place. The live `dist/` is never destroyed, so a running daemon's already-loaded module tree survives a rebuild; preserving `dist/tsconfig.tsbuildinfo` also makes builds incremental (~1s) instead of full wipes.
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
- [x] Tests passing (dist-freshness 18/18; orphan 5/6)
- [x] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Build-tooling change; no runtime architecture impact.

### Key Components
- **`mcp_server/package.json` scripts**: `clean` (manual full wipe), `build` (tsc --build + finalize), and new `rebuild` (clean + build). The auto-`prebuild` clean is removed.
- **`finalize-dist.mjs`**: unchanged — copies JSON, removes known stale roots, asserts required artifacts (the build's completeness gate).

### Data Flow
`npm run build` → `tsc --build` (incremental, in place, reuses tsbuildinfo) → `finalize-dist.mjs` (copy JSON + assert artifacts). The live `dist/` is mutated incrementally, never deleted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/package.json` `prebuild`/`clean` (producer) | Auto-wipes dist before every build | update (drop auto-clean; keep `clean`; add `rebuild`) | `npm run build` leaves dist intact; `grep` shows no `prebuild` |
| `finalize-dist.mjs` (gate) | Asserts dist completeness | unchanged | `assertRequiredArtifacts()` passes post-build |
| `dist-freshness.vitest.ts` (test) | Asserts dist fresh vs source | unchanged — must still pass | 18/18 PASS |
| `check-source-dist-alignment-orphans.vitest.ts` (test) | Orphan detection logic (synthetic dirs) | unchanged | 5/6 PASS (1 pre-existing skip) |
| `@spec-kit/shared`, `@spec-kit/scripts` builds | Sibling workspaces the daemon also loads | not a consumer (no destructive prebuild) | `grep` shows `build: tsc --build` only |

Inventory: `rg -n "prebuild|rmSync|clean" mcp_server/package.json shared/package.json scripts/package.json` → only mcp_server had the destructive prebuild. Invariant: the default build path never deletes the live `dist/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed only mcp_server has the destructive prebuild (shared/scripts already incremental)
- [x] Confirmed composite tsc + tsbuildinfo at `dist/tsconfig.tsbuildinfo`

### Phase 2: Core Implementation
- [x] Removed `prebuild` auto-clean; added `rebuild` = `clean && build`; kept `clean`

### Phase 3: Verification
- [x] `npm run build` leaves dist intact + complete (finalize asserts pass); ~1s incremental
- [x] `dist-freshness` 18/18; orphan detection 5/6 (1 skip) — no regression
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Non-destructive + complete + incremental | `npm run build` + artifact/mtime checks |
| Regression | dist freshness + source/dist orphans | vitest |
| Manual | (Optional) rebuild while daemon runs → daemon survives | live daemon + /mcp |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tsc composite build + `dist/tsconfig.tsbuildinfo` | Internal | Green | Incrementality depends on not wiping dist |
| `finalize-dist.mjs` artifact asserts | Internal | Green | Build completeness gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stale orphans break a consumer, or a build-completeness regression.
- **Procedure**: `git revert` the package.json change (restores `prebuild: clean`), or run `npm run rebuild` for a one-off full clean. Isolated to build scripts.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~15 min |
| Core Implementation | Low | ~10 min (3 script lines) |
| Verification | Low | ~20 min (build + 2 test suites) |
| **Total** | | **~45 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Change is build-scripts only (no data, no runtime code)
- [x] `rebuild` retains an explicit full-clean path
- [x] Regression tests identified (dist-freshness, orphan)

### Rollback Procedure
1. `git revert` the `mcp_server/package.json` commit (restores `prebuild: npm run clean`).
2. `npm run build` (will then full-wipe as before).
3. Smoke: `node dist/context-server.js --help` or daemon start.
4. No stakeholder notification needed (internal tooling).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
