---
title: "Implementation Plan: defaultMode Policy Implementation"
description: "Plan for the config-only, reversible, route-gold-gated defaultMode policy: flip four hubs to null default with a routing-helper fallback, keep sk-prompt, and fix sk-design's hub-identity over-emission. Executed one hub at a time by GPT-5.6-SOL high fast, independently re-verified."
trigger_phrases:
  - "default mode implementation plan"
  - "flip hubs to null default plan"
  - "routing-helper fallback plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/002-default-mode-implementation"
    last_updated_at: "2026-08-16T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Flipped 4 hubs to defaultMode null + routing-helper fallback; sk-design over-emission fixed"
    next_safe_action: "Open follow-ups: defaultApplied telemetry (blocked), cli runtime enforcement, live measurement"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The defaultMode flips do not move route-gold, so gating was clean"
---
# Implementation Plan: defaultMode Policy Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON hub-router config + create-skill canon docs |
| **Framework** | system-skill-advisor parent-hub routing |
| **Storage** | Per-hub `hub-router.json` (`defaultMode`, `defaultResource`); `mode-registry.json` classes |
| **Testing** | Deterministic route-gold gate (per-hub baselines); router-replay on zero-signal prompts |

### Overview

Apply the vetted `defaultMode` recommendations from research child `001-research/007-default-mode-policy-research`. A parent hub is a pure router that should defer on a zero-signal request; a non-null `defaultMode` is only a defer-time lean plus a catch-all anchor. Four hubs whose lean is a presumption or dead metadata flip to `null` with a routing-helper fallback; sk-prompt keeps its default because it genuinely anchors the `hub-identity` catch-all. Every change is config-only, reversible from recorded originals, and gated on route-gold staying green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Keep-1/flip-4 recommendations vetted in the research child
- [x] Reversibility record captured (original `defaultMode`/`defaultResource` per hub)
- [x] Route-gold baselines recorded as the gate (sdl 20/20, mcp 13/13, cli 7/7, sk-design 0/0)

### Definition of Done
- [x] Four hubs at `defaultMode: null` with routing-helper fallback; sk-prompt unchanged
- [x] sk-design `hub-identity` removed from all six modes' classes
- [x] Route-gold held every baseline; no shared-machinery edits
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Config-only edit of the parent-hub router contract, with a canon archetype added so the shape is no longer schema-orphaned.

### Key Components

- **defaultMode flip**: `null` on system-deep-loop, mcp-tooling, cli-external-orchestration, sk-design.
- **defaultResource repoint**: the routing helper `["shared/references/smart_routing.md", "mode-registry.json"]` (later scored as fallback-only).
- **sk-design class fix**: remove `hub-identity` from all six modes' `classes`, keep the class definition discovery-only.
- **Canon archetype**: a third defer-routed hub archetype in create-skill's `parent_hub_router_schema.md`.

### Data Flow

Zero-signal request -> no mode scored -> defer -> `defaultResource` loads the routing helper (how to choose a mode) rather than a guessed child.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Record each hub's original `defaultMode` and `defaultResource` for rollback
- [x] Confirm the route-gold baseline verdicts before any edit

### Phase 2: Core Implementation
- [x] Flip the four hubs to `defaultMode: null` + routing-helper `defaultResource`
- [x] Remove `hub-identity` from sk-design's six modes' classes
- [x] Add the defer-routed archetype to the create-skill canon

### Phase 3: Verification
- [x] Re-run route-gold per hub; confirm each baseline held
- [x] Confirm sk-design defers (not silences) on a hub-generic prompt via router-replay
- [x] Scope-check the diff: four hub-router files + canon doc + this packet only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Route-gold (per hub) | Each hub holds its baseline verdict/counts | router-replay benchmark |
| Zero-signal defer | sk-design defers, `intents: []`, no six-mode co-fire | router-replay |
| Scope + JSON parse | Config-only diff, all JSON parses | `git diff`, JSON parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-research/007-default-mode-policy-research` | Internal | Green (vetted) | No policy basis |
| Route-gold baselines (sdl/mcp/cli/sk-design) | Internal | Green | No gate for the flips |
| create-skill `parent_hub_router_schema.md` | Internal | Green | Flipped hubs stay schema-orphans |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A null flip raises disambiguation friction, or removing `hub-identity` under-emits on a real hub-identity prompt.
- **Procedure**: Restore each hub's recorded original `defaultMode`/`defaultResource` (spec.md section 3); re-add the `hub-identity` class to sk-design's modes. Every change is config-only, so a restore is a one-line-per-field revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Record originals) ──► Phase 2 (Flip + fix + canon) ──► Phase 3 (Route-gold re-verify)
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
| Setup | Low | Record originals |
| Core Implementation | Low | Four config flips + one class fix + canon |
| Verification | Low | Per-hub route-gold re-run |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Original values recorded in spec.md section 3
- [x] Route-gold baseline verdicts captured
- [x] Changes confined to config (no shared scorer)

### Rollback Procedure
1. Restore the hub's `defaultMode` to its recorded original.
2. Restore its `defaultResource` to its recorded original.
3. Re-add `hub-identity` to sk-design's modes if the class fix is reverted.
4. Re-run route-gold to confirm the baseline still holds.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (config-only, no data changes)
<!-- /ANCHOR:enhanced-rollback -->
