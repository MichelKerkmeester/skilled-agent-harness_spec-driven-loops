---
title: "Implementation Plan: Detection-Layer Sub-Agent-Routing Enforcement Plugin"
description: "Build a tool.execute.before hook inspecting/rewriting Task-dispatch args against mode-registry.json, then live-smoke-test whether fail-closed rejection actually works before finalizing the design around whichever mode is real."
trigger_phrases:
  - "implementation"
  - "plan"
  - "deep route guard plugin"
  - "tool execute before hook"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin"
    last_updated_at: "2026-07-01T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 012"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-011-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Plugin home: .opencode/plugins/mk-deep-loop-guard.js (renamed 2026-07-01 from deep-route-guard.js), matching the 5 existing plugins already there (repo's established convention, per .opencode/plugins/README.md)."
      - "Fail-closed vs mutate-and-warn: BOTH confirmed working via live opencode CLI tests. Kept as a configurable toggle (default warn, MK_DEEP_LOOP_GUARD_REJECT=1 for reject, renamed 2026-07-01 from DEEP_ROUTE_GUARD_REJECT) rather than removing either."
---
# Implementation Plan: Detection-Layer Sub-Agent-Routing Enforcement Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode plugin API (`tool.execute.before` hook), TypeScript/JavaScript |
| **Framework** | OpenCode plugin loader, `mode-registry.json` |
| **Storage** | Filesystem plugin module |
| **Testing** | Live smoke test on the installed OpenCode version (hook registration + fail-closed vs. mutate-and-warn) |

### Overview

Detection-only enforcement, not a new source of truth: the plugin reads `mode-registry.json` (already correct and stable after phases 008-010) and inspects/rewrites Task-dispatch `args` at the `tool.execute.before` hook point. The central open question — whether a thrown rejection actually blocks the dispatch on this OpenCode install, or only mutate-and-warn works — is answered by a live smoke test in Phase 1/3 of this plan, not assumed in the design.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 008-010 confirmed complete (routing identity correct before enforcing against it).
- [x] Plugin home decided (system-skill-advisor subpath vs. standalone `.opencode/plugins/mk-deep-loop-guard/`) with rationale recorded.
- [x] OpenCode plugin API's `tool.execute.before` hook signature confirmed via existing plugin examples in the repo (if any) or OpenCode docs.

### Definition of Done
- [x] Plugin registers and fires reliably on a real Task-tool dispatch (confirmed by live smoke test, not by code inspection alone).
- [x] Fail-closed vs. mutate-and-warn question answered with direct evidence; plugin's actual behavior matches whichever is true.
- [x] Plugin reads from `mode-registry.json` directly (or a thin, tested accessor) — no hand-copied mapping.
- [x] Plugin's hard limits documented prominently (no hard identity; no semantic-content catch).
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Detection-and-rewrite hook, registry-backed, with an explicit fail-open safeguard for its own internal errors.

### Key Components

- **`tool.execute.before` hook**: the OpenCode plugin entrypoint; must use a default-export-only module shape (research's confirmed gotcha — hooks silently don't register otherwise).
- **`mode-registry.json` accessor**: reads the 4 deep-mode entries; no forked/hand-copied mapping.
- **Fail-open guard**: if the hook itself throws (bug, missing registry file, etc.), it must not block unrelated correctly-routed dispatches — this is a property of the plugin's own error handling, not of the enforcement logic.

### Data Flow

A Task-tool dispatch is about to execute → `tool.execute.before` fires → plugin reads the dispatch's `mode`/`target_agent`-equivalent args → resolves expected values from `mode-registry.json` → if mismatched, either rewrites the args or throws (whichever Phase 1's live smoke test confirms this OpenCode install actually supports) → dispatch proceeds (rewritten) or is blocked (if throw works).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Plugin home (TBD location) | Does not exist yet | Create plugin module | Hook registration smoke test |
| `mode-registry.json` | Existing source of truth | Read-only consumer added | Accessor unit-level check |
| OpenCode plugin loader | Existing infra | No change — plugin must conform to its conventions | Live smoke test |

Required inventories:
- Same-class producers: none — this is a new surface, not completing an existing one.
- Consumers: the plugin itself is the sole new consumer of `mode-registry.json` at this hook point.
- Matrix axes: 4 deep modes x (rewrite works / throw works / neither works) — the smoke test must characterize all 3 possibilities, not just confirm the hopeful case.
- Algorithm invariant: plugin failure must fail open for correctly-routed dispatches (NFR-R01 in `spec.md`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phases 008-010 are complete.
- [x] Decide plugin home (system-skill-advisor vs. standalone `.opencode/plugins/`) and record rationale in this phase's docs.
- [x] Confirm `tool.execute.before`'s exact hook signature and the default-export-only registration requirement via any existing OpenCode plugin examples in the repo.

### Phase 2: Core Implementation
- [x] Implement the hook: read `mode-registry.json`, resolve expected `mode`/`target_agent` for deep-mode dispatches, compare against outgoing args.
- [x] Implement the fail-open guard around the plugin's own error handling.
- [x] Implement BOTH a rewrite path and a throw path initially (the smoke test in Phase 3 decides which one the final design keeps as primary).
- [x] Write the plugin's own "hard limits" documentation (no hard identity; no semantic-content catch).

### Phase 3: Verification
- [x] Live-smoke-test hook registration: does `tool.execute.before` actually fire on a real Task-tool call?
- [x] Live-smoke-test the throw path: does throwing actually block the dispatch, or does it proceed regardless?
- [x] Based on the throw-path result, finalize the plugin's design (keep throw if it works; fall back to mutate-and-warn only if it doesn't) and remove the unused path.
- [x] Confirm a non-deep-mode dispatch (`@code`, `@review`) passes through the guard unmodified.
- [x] Run `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Hook registration fires on real Task dispatch | Live OpenCode session |
| Smoke | Throw-path actually blocks dispatch (or doesn't) | Live OpenCode session |
| Static | Non-deep dispatch passes through unmodified | Manual trace / unit-level check |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phases 008-010 | Predecessor | Not yet complete | Enforcing against not-yet-correct routing identity would be premature |
| OpenCode plugin API availability in this environment | Environmental | Unconfirmed | If `tool.execute.before` isn't actually available/loadable here, this phase is blocked the same way phase 005/012 were blocked on the external-shell precondition — report honestly rather than building an untestable plugin |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Hook never fires reliably, or the plugin's presence causes unrelated dispatch failures.
- **Procedure**: Remove the plugin module entirely; this phase's fixes (008-010) remain in place and are unaffected, since the plugin is purely additive detection, not a dependency of the routing fixes themselves.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 010 (ai-council subagent-only) -> Phase 011 (this phase) -> Phase 012 (benchmark)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 010 | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 012 (benefits from, does not strictly require) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low-Medium | Small (plugin-home decision + hook-signature research) |
| Core Implementation | Medium | Medium (new plugin surface, dual-path implementation) |
| Verification | Medium-High | Medium (live smoke tests are the load-bearing verification here) |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No persisted data migration.
- [x] Fail-open guard implemented and tested before the enforcement logic is considered done.
- [x] Plugin home decision documented, not left implicit.

### Rollback Procedure
1. Delete the plugin module.
2. Confirm phases 008-010's fixes remain unaffected (they don't depend on this plugin).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File deletion only.
<!-- /ANCHOR:enhanced-rollback -->

---
