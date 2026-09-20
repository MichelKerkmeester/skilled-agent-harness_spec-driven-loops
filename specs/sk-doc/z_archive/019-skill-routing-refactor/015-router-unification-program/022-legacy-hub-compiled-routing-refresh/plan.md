---
title: "Implementation Plan: Legacy Hub Compiled Routing Refresh"
description: "Deferred execution plan for repairing the system-deep-loop owner harness, rebuilding two stale hub manifests, promoting safely, and proving a fresh seven-hub fleet"
trigger_phrases:
  - "legacy hub refresh plan"
  - "system-deep-loop prior manifest"
  - "compiled-route-sync promotion"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/022-legacy-hub-compiled-routing-refresh"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored deferred legacy hub refresh plan"
    next_safe_action: "Run in complete compiled-routing environment"
    blockers:
      - "system-deep-loop harness lacks prior activation manifest"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Legacy Hub Compiled Routing Refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js owner harnesses, compiled routing artifacts, JSON activation manifests |
| **Framework** | 015 compiled-routing rollout and `compiled-route-sync` |
| **Storage** | Authored `ROUTER.md`, compiled hub artifacts, activation manifests, retained rollback state |
| **Testing** | Owner harnesses, canary pipeline, `compiled-route-status.cjs --all`, frozen-artifact byte/digest checks |

### Overview

Repair the `system-deep-loop` owner harness first, because its missing prior activation manifest currently prevents a clean build. Then rebuild `sk-prompt` and `system-deep-loop` from their current `ROUTER.md` files, refresh activation state, promote through `compiled-route-sync`, and run the canary and seven-hub status gate inside the complete 015 environment. This packet is a plan only; no implementation or promotion is included in the current worktree.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The complete 015 compiled-routing environment is available with activation state and retained-rollback closure.
- [ ] The current `ROUTER.md` sources, owner harnesses, and frozen replay/scorer baseline are identified.
- [ ] The missing `system-deep-loop` prior-manifest behavior is understood well enough to choose create-versus-no-requirement.

### Definition of Done

- [ ] Both class-H hubs build from their current authored `ROUTER.md` files.
- [ ] Activation manifests are refreshed and promotion completes with retained rollback.
- [ ] The canary passes and all seven hubs report compiled and fresh.
- [ ] Frozen replay/scorer files and protected digests remain byte-identical.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Owner-harness repair followed by a gated compiled-artifact refresh and reversible promotion. The legacy route remains the observed degraded serving path until the complete pipeline proves the compiled authority is safe to promote.

### Key Components

- **`ROUTER.md` sources**: Authored policy inputs for the two class-H hub builds.
- **Owner harnesses**: Build each hub's compiled artifacts; the `system-deep-loop` harness must handle its prior activation manifest safely.
- **Activation manifests**: Capture the candidate and prior state required by the rollout environment.
- **`compiled-route-sync`**: Promotes the refreshed activation state with the retained-rollback closure.
- **Canary and route status**: Confirm the promoted fleet is healthy and all seven hubs are compiled and fresh.

### Data Flow

Current authored `ROUTER.md` -> owner harness build -> compiled artifacts and policy hashes -> refreshed activation manifests -> `compiled-route-sync` promotion with retained rollback -> canary -> `compiled-route-status.cjs --all`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Enter the complete 015 compiled-routing environment.
- [ ] Capture the pre-refresh route-status output and frozen replay/scorer bytes and digests.
- [ ] Inventory activation state and confirm the retained-rollback closure is present.

### Phase 2: Core Implementation

- [ ] Repair the `system-deep-loop` owner harness to create, or safely stop requiring, `manifest.prior.json`.
- [ ] Rebuild `sk-prompt` and `system-deep-loop` from their current authored `ROUTER.md` files.
- [ ] Compare each effective policy hash with the current authored policy hash before promotion.

### Phase 3: Verification

- [ ] Refresh both activation manifests and promote with `compiled-route-sync`.
- [ ] Run the retained-rollback-aware canary pipeline.
- [ ] Confirm all seven hubs are compiled and fresh and frozen artifacts are byte-identical.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool | Pass Signal |
|-----------|-------|------|-------------|
| Harness build | `sk-prompt` and `system-deep-loop` | Their owner `build-artifacts.cjs` harnesses | No `ENOENT`; compiled artifacts are produced |
| Policy freshness | Two rebuilt class-H hubs | Owner harness output and current policy hash | Effective hash matches the authored-policy target |
| Activation/promotion | Two refreshed hub manifests | `compiled-route-sync` in the complete 015 environment | Promotion completes with retained rollback available |
| Canary | Promoted seven-hub fleet | Program canary pipeline | Canary passes without rollback-integrity failure |
| Route status | All seven hubs | `node .opencode/bin/compiled-route-status.cjs --all` | Every hub is compiled and fresh |
| Frozen artifact integrity | Replay/scorer files and protected digests | Existing byte/digest comparison in the 015 environment | No byte or digest difference |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Complete 015 activation environment | Internal runtime state | Required | The refresh cannot be safely executed from this bare worktree |
| Retained-rollback closure | Internal rollout state | Required | Promotion must not begin without reversible recovery |
| `system-deep-loop` owner harness | Repository tool | Blocked | Current build stops on missing `manifest.prior.json` |
| Current authored `ROUTER.md` files | Source policy | Available for execution | Builds cannot prove policy freshness without them |
| Frozen replay/scorer baseline | Protected evidence | Required | Any byte drift blocks completion |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any build error, hash mismatch, activation-manifest inconsistency, promotion failure, canary failure, stale route-status result, or frozen-artifact difference.
- **Procedure**: Stop the pipeline before claiming completion, retain the last known serving state, use the retained-rollback closure, and re-run the status and frozen-artifact checks before any retry.
- **Data reversal**: No SQLite or application data migration is planned; rollback covers compiled routing artifacts and activation state only.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Complete environment -> Harness repair -> Two-hub rebuild -> Activation refresh -> Promotion -> Canary and status proof
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Harness repair |
| Harness repair | Complete environment and current harness sources | Two-hub rebuild |
| Two-hub rebuild | Harness repair | Activation refresh |
| Activation refresh | Successful builds and retained rollback | Promotion |
| Promotion | Refreshed manifests and rollback closure | Canary and status proof |
| Canary and status proof | Successful promotion | Completion decision |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | One controlled environment preparation pass |
| Harness repair | Medium | One owner-harness change and focused build check |
| Two-hub rebuild | Medium | Two compiled artifact builds and hash comparisons |
| Activation and promotion | High | One rollback-aware promotion sequence |
| Canary and status proof | Medium | One full fleet verification pass |
| **Total** | | **Bounded multi-stage execution; estimate to be set in the complete environment** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Baseline route status, frozen bytes, and protected digests captured.
- [ ] Complete activation state is present.
- [ ] Retained-rollback closure is present and usable.
- [ ] `system-deep-loop` harness no longer has the unsafe prior-manifest failure.

### Rollback Procedure

1. Stop before promotion or stop the promotion sequence at the first failed gate.
2. Restore the previous serving state through the retained rollback closure.
3. Re-run route status and frozen-artifact comparisons.
4. Record the failed stage and preserve the evidence before another attempt.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: Restore retained compiled-routing and activation state, then re-run the canary and status checks
<!-- /ANCHOR:enhanced-rollback -->
