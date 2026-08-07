---
title: "Implementation Plan: Adopt deep-pi as Exclusive DeepSeek Extension"
description: "Install deep-pi, confirm its self-gating via isDeepPiModel, and record the accepted all-or-nothing module trade-off."
trigger_phrases:
  - "deep-pi install plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/004-adopt-deep-pi-deepseek"
    last_updated_at: "2026-08-07T11:24:10Z"
    last_updated_by: "spec-author"
    recent_action: "Install/integrity/activation confirmed; plan checkboxes reconciled"
    next_safe_action: "None — phase 004 complete"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Adopt deep-pi as Exclusive DeepSeek Extension

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension) |
| **Framework** | Pi coding-agent extension hook API |
| **Storage** | `deep-pi`'s own telemetry state (location TBD from its docs at install time) |
| **Testing** | Manual: live DeepSeek session smoke test, live non-DeepSeek session no-op check |

### Overview
Install `@arter/deep-pi@1.0.0` via Pi's package manager. No patching needed — its three hook groups already self-gate behind `isDeepPiModel(model)`, confirmed by reading `extensions/deeppi.ts` directly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003 scope defined (its completion is this phase's dependency)
- [x] `deep-pi` source structure confirmed (three hook groups, single shared gate, no env toggles)

### Definition of Done
- [x] `deep-pi` installed and `/deeppi` command available
- [x] Confirmed active only on DeepSeek-matched models (source-verified via `isDeepPiModel`)
- [x] Trade-off (no per-module toggles) documented, not silently accepted
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Provider-gated extension bundle (single activation predicate covering three modules).

### Key Components
- **`isDeepPiModel(model)`**: shared gate for all three hook groups (confirmed in `extensions/deeppi.ts`)
- **`registerStabilityHooks`**: cache-prefix stability module
- **`registerStormBreaker`**: retry-loop guard module
- **`registerTelemetryHooks`**: cost/cache telemetry module
- **`/deeppi` command**: interactive entry point

### Data Flow
Pi resolves the active model → `deep-pi` checks `isDeepPiModel(model)` once at session/model-select time → if DeepSeek-matched, all three hook groups register and run; if not, none of them do anything. This is why installing it has zero effect on the `openai-codex/gpt-5.6-luna` traffic that makes up 100% of today's usage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Install
- [x] Confirmed `003-fork-and-guard-cache-optimizer` complete (patched fork active) before proceeding
- [x] Ran `pi install npm:@arter/deep-pi@1.0.0`
- [x] Reloaded Pi and confirmed `/deeppi` command is available

### Phase B: Activation Confirmation
- [x] `deepseek/deepseek-v4-flash` live session completed cleanly; `isDeepPiModel` source-confirmed to match this model exactly
- [x] `openai-codex/gpt-5.6-luna` (non-DeepSeek): `isDeepPiModel` source-confirmed to reject it on provider mismatch

### Phase C: Trade-off Documentation
- [x] Recorded that the cache/storm-breaker/hashline modules cannot be independently toggled
- [x] Noted the `jrimmer/pi-deepseek-optimized` fallback (granular `PI_HARNESS_*_ENABLED` env vars) as the documented escape hatch if the bundle proves too coarse
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual smoke | DeepSeek session activates `deep-pi` | `/deeppi` command output, live session behavior |
| Manual no-op check | Non-DeepSeek session shows zero `deep-pi` activity | Live session with `openai-codex/gpt-5.6-luna` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-fork-and-guard-cache-optimizer` complete | Internal (this packet) | Blocked until phase 003 closes | Installing `deep-pi` before the fork is active means DeepSeek sessions get double-mutated by both extensions |
| `@arter/deep-pi@1.0.0` (npm) | External | Green (public, Apache-2.0) | Falls back to `jrimmer/pi-deepseek-optimized` directly if the npm package is unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `deep-pi` misbehaves on DeepSeek sessions (bad edits, broken retries, incorrect telemetry)
- **Procedure**: Uninstall `@arter/deep-pi`. DeepSeek sessions then run with no cache/storm-breaker/hashline layer until a replacement is chosen — an acceptable degraded state, not a broken one, since `pi-cache-optimizer` stays correctly excluded from DeepSeek per phase 003 regardless.
<!-- /ANCHOR:rollback -->
