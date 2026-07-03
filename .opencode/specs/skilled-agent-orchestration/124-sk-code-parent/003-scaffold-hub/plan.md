---
title: "Implementation Plan: Phase 3 — scaffold hub"
description: "Author the nested sk-code hub scaffold in the worktree via GPT-5.5-fast through cli-opencode, then verify the structural invariants with Claude while deferring toolchain/integration work to later phases."
trigger_phrases:
  - "sk-code scaffold hub plan"
  - "sk-code parent scaffold plan"
  - "five mode scaffold plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/003-scaffold-hub"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the completed scaffold-hub plan"
    next_safe_action: "Proceed to 004-onboard-implement to relocate implement, quality, debug, and verify contracts into packets and shared/"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 — scaffold hub

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
| **Language/Stack** | OpenCode skill markdown + JSON scaffold files |
| **Framework** | `cli-opencode` GPT-5.5-fast authored the scaffold in the worktree; Claude verified |
| **Storage** | `.opencode/skills/sk-code/` hub root, `shared/`, `changelog/`, and five `code-*` packet folders |
| **Testing** | Structural invariant checks and manual inspection; advisor/toolchain rebuild deferred to main integration phases |

### Overview
Build only the parent-hub scaffold accepted by phase 002. GPT-5.5-fast via `cli-opencode` authored the scaffold from a precise structural spec in the worktree. Claude then verified the resulting file set and invariants. The plan intentionally kept the toolchain/integration work out of phase 003: advisor rebuild, review-keyword merge, command metadata, and downstream agent repoints belong to phase 007.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 accepted the 5-mode architecture and regression-first build sequence.
- [x] Scaffold scope isolated to `.opencode/skills/sk-code/` structural files and packet skeletons.
- [x] Routing-parity fixture expectations identified for later baseline capture.
- [x] Out-of-scope content relocation and `sk-code-review` fold-in explicitly deferred.

### Definition of Done
- [x] Hub `SKILL.md`, registry, router, graph metadata, README, changelog, shared placeholder, and five packet skeletons exist.
- [x] Exactly one `graph-metadata.json` exists under `.opencode/skills/sk-code/`.
- [x] JSON files are valid by inspection/verification result from the scaffold pass.
- [x] Banned paths, `sk-code-review`, and package files are not changed by the completed scaffold.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Nested parent hub: one advisor-routable `sk-code` skill routes to five mode packets by `workflowMode` through `mode-registry.json`. The hub contains routing rules only; mode contracts live in packet `SKILL.md` files and are completed in later phases.

### Key Components
- **Hub**: `.opencode/skills/sk-code/SKILL.md`, version `4.0.0.0`, routes by mode and keeps no per-mode logic.
- **Registry**: `mode-registry.json`, the discriminator and advisor-routing source of truth.
- **Router signals**: `hub-router.json`, the regression-preserving lexical routing vocabulary.
- **Graph identity**: root `graph-metadata.json`, the only advisor graph metadata under `sk-code/`.
- **Mode packets**: `code-implement`, `code-quality`, `code-debug`, `code-verify`, and `code-review` skeletons.

### Data Flow
User code intent -> `sk-code` advisor identity -> hub mode classification -> `mode-registry.json` -> selected `code-*` packet -> shared surface router/backend as declared by `backendKind`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase affects only the scaffold surface under `.opencode/skills/sk-code/`. Existing content directories are intentionally left in place for phase 004.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-code/SKILL.md` | Former flat skill entrypoint | rewrite to routing-only hub | version `4.0.0.0`, mode table, registry routing rule |
| `.opencode/skills/sk-code/mode-registry.json` | New registry | create | five modes, metadata routing, tool surfaces |
| `.opencode/skills/sk-code/hub-router.json` | New hub router vocabulary | create | default mode + five signals + vocabulary classes |
| `.opencode/skills/sk-code/graph-metadata.json` | Existing advisor identity | rewrite preserving identity | one root graph identity, preserved edges/domains/intent signals |
| `.opencode/skills/sk-code/code-*` | New mode packets | create skeletons | each packet has `SKILL.md` + `README.md`, no graph metadata |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the phase 002 decision record and bind the 5-mode scaffold scope.
- [x] Confirm scaffold is additive and does not relocate existing content.
- [x] Prepare routing-parity fixture expectations for later baseline capture.

### Phase 2: Core
- [x] Rewrite the hub `SKILL.md` as routing-only.
- [x] Create `mode-registry.json` and `hub-router.json`.
- [x] Rewrite root `graph-metadata.json` as the one hub identity.
- [x] Create hub README, changelog, shared placeholder, and five skeleton mode packets.

### Phase 3: Verification
- [x] Verify exactly one `graph-metadata.json` remains in the `sk-code` tree.
- [x] Verify JSON validity and mode registry completeness.
- [x] Verify banned paths and `sk-code-review` are untouched.
- [x] Revert the out-of-scope `package.json` / `package-lock.json` runtime side effect.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Single graph metadata, five packet skeletons, expected hub files | Manual/Claude verification of scaffold result |
| JSON | Registry, router, and graph metadata validity | JSON parse checks from scaffold verification |
| Scope | Banned paths, `sk-code-review`, and package files | Path-diff verification from scaffold verification |
| Deferred | Advisor rebuild, command metadata, routing benchmark | Phase 007+ on main/integration surface |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 decision record | Internal | Complete | Scaffold shape would be unbound |
| `cli-opencode` GPT-5.5-fast authoring pass | Internal | Complete | Scaffold files would need manual authoring |
| Claude verification | Internal | Complete | Invariants would lack independent verification |
| Phase 004 onboard-implement | Internal | Pending | Skeleton packets remain intentionally shallow |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scaffold invariants fail or the hub shape must be abandoned before content relocation.
- **Procedure**: Revert the additive scaffold commit/worktree changes for `.opencode/skills/sk-code/` and restore the prior flat `SKILL.md` / `graph-metadata.json`. Because no content was relocated and `sk-code-review` was untouched, rollback stays confined to the scaffold files.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
