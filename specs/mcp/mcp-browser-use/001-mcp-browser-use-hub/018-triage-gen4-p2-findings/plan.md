---
title: "Implementation Plan: Phase 18: triage-gen4-p2-findings"
description: "Check each generation-4 P2 finding against source, fix the ones that hold at their source, release hub 1.1.5.0 and replay the routing."
trigger_phrases:
  - "triage gen4 p2 findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: triage-gen4-p2-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, CommonJS |
| **Framework** | Compiled hub routing |
| **Storage** | None |
| **Testing** | Direct runs of each changed script, the hub canary, the two-stage replay, the bin suite |

### Overview

Each finding is read against the current file first, because 016 and 017 changed several of the files the reviewers saw. A held finding is fixed where it starts. A refuted one gets the check that refuted it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The 24 P2 findings are listed from the merged registry.

### Definition of Done

- Every REQ in `spec.md` is Met in `acceptance-criteria.md`, and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verdict first, then the fix at the producer. A doc that states a false fact is corrected to the measured fact, not the other way round, unless the behavior itself is the defect.

### Key Components

- The Aside install wrapper and capture example.
- The shared runtime engine's resolver CLI and engine cache.
- The hub's README, `ROUTER.md` and the epic's continuity fields.

### Data Flow

No data flow changes. The engine change makes the engine cache key read the same manifest root as the resolver when a test overrides it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Aside `scripts/install.sh` | Operator-run installer | Refuse `ASIDE_CLI_BASE_URL` | Run with the variable set |
| Aside capture example | Agent-run script | Segment-only `..` guard | Stub `aside`, five folder names |
| `resolve.cjs` CLI | Secondary front door | Check `--hub` | Run without it |
| `compiled-route.cjs` engine | Cache key producer | Honor the override root | Bin suite |
| Hub `registry-compiler.cjs` | Policy producer | Derived `selectionKinds` | Canary; guard |
| Hub docs and epic docs | Facts agents read | Corrected | Re-read; validate |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Triage the 24 findings.
2. Fix the held ones and sync the engine archive copies.
3. Release 1.1.5.0, re-mint and replay.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Engine and installers | `node --test .skilled/bin/tests/*.test.cjs` |
| Integration | Both routing stages | The two-stage replay, the hub canary |
| Manual | Wrapper, capture guard, resolver CLI | Direct runs with a stub `aside` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The advisor lexical-anchor packet | Internal | Blocked on an operator decision | P2 #15 stays open until it lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit, then re-mint the hub's activation manifest with `compiled-route-manifest.cjs refresh --hub mcp-browser-use` and copy it to its archive path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Triage | None | Fixes |
| Fixes | Triage | Release |
| Release and replay | Fixes | Closure |
<!-- /ANCHOR:phase-deps -->
