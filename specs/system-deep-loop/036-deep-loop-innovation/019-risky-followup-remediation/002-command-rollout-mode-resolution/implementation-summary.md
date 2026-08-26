---
title: "Implementation Summary: Command Rollout-Mode Resolution"
description: "Final state, corrected decision, and verification evidence for keeping the deep/* rollout mode at fallback, clearing the stale contracts, and fixing the stale render-command-contract expectation."
trigger_phrases:
  - "command rollout mode resolution"
  - "deep review rollout fallback decision"
  - "validate-rollout evidence governance"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T15:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Kept rollout at fallback; corrected stale test; validate-rollout green"
    next_safe_action: "Re-verify whole suite (vitest + node:test); push correction"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Intended default rollout mode for deep/* is fallback; fix requires an evidence object that does not exist."
---
# Implementation Summary: Command Rollout-Mode Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-command-rollout-mode-resolution |
| **Completed** | 2026-08-26 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~2.5 hours (including a wrong-turn correction) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Kept `deep/research`, `deep/review`, and `deep/ai-council` in the governance-intended `fallback` rollout mode, recompiled the stale `deep/*` contracts to clear the digest drift, and corrected a stale test expectation so the four affected tests all pass. The two baseline failures were separable: `check-contract-drift` failed because the compiled contracts were stale (a mechanical recompile), and `render-command-contract` failed because its `resolveMode('deep/review')` assertion expected `fix` while the config held `fallback`. The decisive constraint is that a `fix` rollout entry must carry an evidence object (`captureManifest`, `fallbackHash`, `comparatorRuns`, `baselineDivergence`), enforced by `validate-rollout.cjs`; that evidence never existed, so `fallback` is correct and the `fix`-expecting test was the stale artifact.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Modified | Recompiled; fresh source digests |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Modified | Recompiled; fresh source digests |
| `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md` | Modified | Recompiled; fresh source digests |
| `.opencode/commands/deep/assets/compiled/deep-alignment.contract.md` | Modified | Recompiled; digest-only staleness clear |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts` | Modified | Corrected the stale `resolveMode('deep/review')` expectation from `fix` to `fallback` |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A first attempt (via ox-alpha) misread the git history and flipped the rollout config to a bare `"fix"` string, believing `bce47507b6d` had *accidentally* demoted the entries. That passed the vitest gate but broke `validate-rollout.test.cjs` — a **node:test** the vitest run does not execute — which the pre-push hook surfaced. Reading `bce47507b6d`'s message ("demotes the four rollout entries that lacked their evidence mechanism and adds the validator that keeps them honest") showed the demotion was deliberate and evidence-gated, and `validate-rollout`'s own `testLegacyFixStringFails` proves a bare `"fix"` string is invalid. The fix was reverted to `fallback`, the stale `render-command-contract` expectation was corrected to `fallback`, and the recompiled contracts (which do not depend on the rollout mode) were kept. Verification then ran BOTH gates: the runtime vitest suite and `run-node-tests.mjs`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Intended mode is **`fallback`** | `fix` requires an evidence object that does not exist; `validate-rollout.cjs` enforces it and `bce47507b6d` demoted deliberately. Promoting to `fix` would need genuine evidence, which is out of scope. |
| Fix the test, not the config | With `fallback` intended, `render-command-contract`'s `fix` expectation was the stale artifact; `bce47507b6d` demoted the config but never updated that test, leaving it red. |
| Verify with BOTH runners | The wrong turn passed a vitest-only gate but broke a node:test. Completion now requires `run-node-tests.mjs` green too. |
| Recompile `deep-alignment` too | `check-contract-drift` scans every contract; `deep-alignment` was also stale. Digest-only, no mode or body change. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `render-command-contract` + `check-contract-drift` + `legacy-projections` (vitest) | PASS — 39/39 |
| `validate-rollout.test.cjs` (node:test) | PASS |
| `run-node-tests.mjs` (full node:test gate) | 17 fail, ALL pre-existing (`compiled-route-manifest`, `command-topology-pilot`); validate-rollout green |
| Runtime vitest whole suite vs baseline | No new code-caused failures |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The deep commands stay in `fallback`.** They render the legacy body, not the compiled `fix` contract. Promoting to `fix` is a real rollout decision that requires producing genuine evidence (capture manifest, fallback hash, green comparator runs, zero baseline divergence) — deliberately out of scope here.
2. **The pre-existing node:test failures remain.** `compiled-route-manifest` (16 subtests, `.opencode/bin` publication FS logic) and `command-topology-pilot` (a stale hardcoded `deep/review.md` hash) fail independent of this packet.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| One clean fix | A wrong turn then a correction | The first attempt flipped to `fix` on a misread of git history; caught by a node:test the vitest gate missed, then reverted to the governance-correct `fallback`. |
| Scope named 3 deep commands | Recompile touched 4 contracts | `deep-alignment` was also stale; `check-contract-drift` scans all. Digest-only. |

<!-- /ANCHOR:deviations -->
