---
title: "Implementation Summary: Fan-Out Hardening"
description: "Summary of shipped fan-out hardening fixes and verification evidence."
trigger_phrases:
  - "fan out hardening implementation summary"
  - "detached cli fanout salvage retry summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "glm-fanout-review"
    recent_action: "Shipped and verified fan-out hardening fixes"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-fanout-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "salvage.failed > 0 now always rejects and retries; --dangerously-skip-permissions is opt-in via sandboxMode: danger-full-access"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening` |
| **Completed** | 2026-06-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Hardened the detached CLI fan-out path against seven GLM-review findings. Detached review lineages now initialize with the same setup bindings as native lineages, reject/retry partial-output lineages instead of silently fulfilling them, run with an opt-in permission boundary, reach merge even when registry-absent, and emit typed observability statuses.

### Review Setup Bindings
`buildLoopPrompt` now emits `review_target`, `review_target_type`, `review_dimensions`, `lineage_mode`, and `execution_mode` for review/context loops, matching the native `PRE-BOUND SETUP ANSWERS`.

### Salvage + Retry Classification
A new gate throws when `salvage.failed > 0` even when the top-level report exists. `classifyLineageFailure` gained an `artifact_miss` retry class so mixed `{salvaged:>0, failed:>0}` failures are retried rather than treated as fatal exits.

### Opt-In Sandbox
`--dangerously-skip-permissions` is now emitted only when `sandboxMode === 'danger-full-access'`, with a `FATAL WARN` line documenting the prompt-only write boundary. `sandboxMode` is now supported for cli-opencode.

### Leaf-Only Lineage Merge
`reconstructReviewRegistryFromState` rebuilds a minimal review registry from state-log `findingDetails` so registry-absent (leaf-only) lineages reach `fanout-merge` instead of being silently skipped.

### Observability + Playbook
`lag_ceiling_exceeded`/`lag_ceiling_abort` now map to typed statuses. The salvage playbook step 2 names the new exit-0/no-artifact regression.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Prompt bindings, salvage gate, opt-in sandbox, lag-ceiling status mapping |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Modified | `artifact_miss` retry class |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Leaf-only registry reconstruction |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | `sandboxMode` support for cli-opencode |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | exit-0/no-artifact regression |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified | reconstruction regressions |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Modified | sandboxMode acceptance contract |
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Modified | Pre-existing duplicate-decl fix (unblocked suite) |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-salvage-recovery.md` | Modified | Repoint to exit-0/no-artifact regression |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Code fixes applied directly to the deep-loop-runtime working tree plus regression tests; the adversarial playbook was repointed. Phase docs authored under `007-fan-out-hardening/` and the parent `009` phase map updated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- `--dangerously-skip-permissions` made opt-in (`sandboxMode: danger-full-access`) rather than silently default, with a fatal warning surfacing the prompt-only write boundary.
- Mixed-salvage failures classified as retryable (`artifact_miss`) rather than fatal exit.
- Leaf-only lineages get a reconstructed registry at merge time rather than requiring a separate reducer step.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Full `deep-loop-runtime` Vitest suite: **60 files / 549 tests passed, 0 failures**. Baseline delta: 2 fanout test files previously failed to transform (pre-existing `spawn-cjs.ts` duplicate); after the unblock + fixes all load and pass. Mutation check: the executor-config contract test failed immediately after adding sandboxMode support (true-RED), then passed once the contract was updated to the new intent. Comment hygiene clean on all 8 modified code files.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- opencode CLI has no path-scoped write flag, so a `workspace-write` cli-opencode lineage's lineageDir boundary still relies on the prompt; only the dangerous bypass is now opt-in.
- Packet-wide metadata regeneration was required to clear systemic integrity staleness from the prior packet migration (performed: 62 folders refreshed).
<!-- /ANCHOR:limitations -->
