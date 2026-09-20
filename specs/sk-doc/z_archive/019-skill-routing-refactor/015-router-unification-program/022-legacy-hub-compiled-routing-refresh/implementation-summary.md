---
title: "Implementation Summary: Legacy Hub Compiled Routing Refresh"
description: "Planned, not-yet-implemented summary for safely refreshing stale compiled routing at sk-prompt and system-deep-loop"
trigger_phrases:
  - "legacy hub refresh summary"
  - "planned compiled routing refresh"
  - "system-deep-loop harness blocker"
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
# Implementation Summary: Legacy Hub Compiled Routing Refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-legacy-hub-compiled-routing-refresh |
| **Status** | Planned |
| **Implementation State** | Not yet implemented |
| **Created** | 2026-08-16 |
| **Completed** | N/A |
| **Level** | 2 |
| **Scope Decision** | Deferred safe completion plan |
| **Next Safe Action** | Run inside the complete 015 compiled-routing environment |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

No runtime implementation was built by this packet. It authors the deferred execution record for the two stale class-H hubs and identifies the owner harness at `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs` as the blocker to resolve before a controlled refresh.

The planned result is a safe rebuild of `sk-prompt` and `system-deep-loop` from their current `ROUTER.md` files, followed by activation-manifest refresh, `compiled-route-sync` promotion with retained rollback, canary verification, and a seven-hub compiled/fresh status result. Frozen replay/scorer files and protected digests remain outside the change surface.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Record the problem, scope, requirements, risks, and deferred acceptance scenarios |
| `plan.md` | Created | Define the gated harness, build, activation, promotion, and rollback sequence |
| `tasks.md` | Created | Track pending execution and verification work |
| `checklist.md` | Created | Track pending Level-2 verification gates |
| `implementation-summary.md` | Created | State the planned, not-yet-implemented status and blocker |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This packet was delivered as documentation only. The attempted refresh established that `sk-prompt` rebuilt cleanly, while the `system-deep-loop` owner harness stopped on `ENOENT` for `activation/manifest.prior.json`. The partial rebuild was reverted; `compiled-route-sync`, the canary, and the final seven-hub promotion were not executed here, and no runtime mutation was left behind.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the packet Planned | The refresh and promotion are deferred work, not completed implementation |
| Repair the owner harness first | The missing prior-manifest behavior blocks a safe `system-deep-loop` build |
| Do not seed the prior manifest | The live-serving manifest is not equivalent to the missing prior state, and the local activation state is incomplete |
| Execute only in the full 015 environment | Activation state and the retained-rollback closure are required for the high-blast-radius pipeline |
| Freeze replay/scorer bytes and digests | The routing refresh must not alter the protected evidence baseline |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Owner harness repair | N/A — deferred until the complete 015 environment is available |
| Two-hub compiled rebuild | N/A — not yet executed as a complete refresh |
| Activation refresh and `compiled-route-sync` promotion | N/A — not run |
| Canary and `compiled-route-status.cjs --all` | N/A — not run |
| Frozen replay/scorer byte and digest comparison | N/A — execution evidence is not yet available |
| Packet authoring validation | N/A in this implementation-evidence section; strict packet proofs are the exit gate for this documentation change |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Missing prior-manifest handling**: `system-deep-loop` currently reads `activation/manifest.prior.json` without creating it, so its owner build cannot complete in the bare worktree.
2. **Incomplete activation state**: The runtime-generated state under `013-live-activation/activation/` is untracked and incomplete here; it must not be seeded into the worktree.
3. **Current serving degradation remains**: Until the deferred refresh is safely promoted, the two hubs continue to serve through legacy with stale compiled manifests.
4. **Execution evidence is absent**: No canary, final route-status, promotion, or frozen-artifact receipts exist for this planned packet yet.
<!-- /ANCHOR:limitations -->
