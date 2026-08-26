---
title: "Implementation Summary: Command Rollout-Mode Resolution"
description: "Final state, decision, and verification evidence for restoring the deep/* rollout mode to fix and clearing the stale compiled contracts."
trigger_phrases:
  - "command rollout mode resolution summary"
  - "deep review rollout fix decision"
  - "stale contract recompile evidence"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T12:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Restored deep/* rollout mode to fix, recompiled contracts, verified whole-suite delta clean"
    next_safe_action: "Proceed to child 001 (dependency & Node-ABI alignment)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json"
      - ".opencode/commands/deep/assets/compiled/deep-review.contract.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Intended default rollout mode for deep/* is fix (deliberately set, accidentally demoted)."
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
| **Actual Effort** | ~1 hour (ox-alpha implement + conductor verify) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Restored the compiled-command rollout mode for `deep/research`, `deep/review`, and `deep/ai-council` from `fallback` back to `fix`, then recompiled every stale `deep/*` contract so the recorded source digests match the current sources. The rollout mode is not cosmetic: `fix` renders the compiled contract body, `fallback` renders the legacy body. The two failing tests (`render-command-contract`, `check-contract-drift`) were entangled — the contracts were stale (a mechanical recompile), but a naive recompile silently flipped `deep/review` to `fallback` because the rollout config had been demoted. The fix set the config to the intended mode first, then recompiled.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json` | Modified | `deep/research`, `deep/review`, `deep/ai-council` restored `fallback` → `fix` |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Modified | Recompiled; fresh source digests + `fix` body |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Modified | Recompiled; fresh source digests + `fix` body |
| `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md` | Modified | Recompiled; fresh source digests + `fix` body |
| `.opencode/commands/deep/assets/compiled/deep-alignment.contract.md` | Modified | Recompiled; digest-only staleness clear (mode stays `fallback`, body unchanged) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

ox-alpha (via cli-pi) traced `resolveMode` in `render-command-contract.cjs`, decided the intended mode from git history, edited the rollout config, and recompiled the contracts through the sanctioned `compile-command-contracts.cjs --command <c> --write`. The conductor then verified: four targeted test files pass (55 tests), and the whole runtime suite (2612 tests) shows a clean delta against the baseline — the three target files flip from red to green and no new code-caused failure appears. The one new red, `model-benchmark-ledger-schema`, was proven to be a load-timeout by re-running it in isolation to 13/13 at a generous timeout. Nothing shipped behind a flag; the change is a config restore plus regenerated artifacts, reversible with a single `git checkout` of the compiled contracts and the config.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Intended default mode is **`fix`** | `1904d343ea9` ("flip ai-council to fix") deliberately set these three to `fix`; `bce47507b6d` ("reconcile 013 completion evidence") accidentally demoted all three to `fallback` as collateral in a bookkeeping commit. `fix` is the intended state. |
| Correct the config, not the test | `resolveMode('deep/review')` expecting `fix` was right; the rollout config was wrong. Fixing the config restores intended behavior instead of ratifying an accidental regression. |
| Recompile `deep-alignment` too | `check-contract-drift` scans every compiled contract; `deep-alignment` was also stale. Recompiling it was required to clear the test. Its rollout mode stays `fallback` and its rendered body is unchanged — only the digest header refreshed. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Targeted | Pass | 4 files / 55 tests | `render-command-contract`, `check-contract-drift`, `legacy-projections`, `compile-command-contracts` all green |
| Regression | Pass | 2612 tests | Whole runtime suite; delta vs baseline = +3 fixed, 0 code-caused new failures |
| Behavior | Pass | - | `resolveMode('deep/review')` = `fix`; recompiled body matches the decided mode |

### Whole-Suite Delta vs Baseline

| Metric | Value |
|--------|-------|
| Baseline failing files | 10 |
| Post-fix failing files | 8 |
| Fixed by this change | `check-contract-drift`, `legacy-projections`, `render-command-contract` |
| New code-caused failures | 0 |
| New environment flake | `model-benchmark-ledger-schema` — 30s timeout under load; passes 13/13 in isolation at 120s (not caused by this change) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`model-benchmark-ledger-schema` timeout** — one child-process-heavy test exceeds the default 30s timeout under machine load; it passes with a generous timeout. A separate tightening of that test's timeout budget is out of scope here.
2. **Remaining pre-existing failures** — `review-depth-convergence`, `cli-devin`, `fanout`, `authorized-ledger`, `event-envelope`, `replay-fingerprint` are the environment-only failures triaged in packet 018; `dependency-seams` is the target of sibling child 001.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Scope named 3 deep commands | Recompile touched 4 contracts | `deep-alignment` was also stale; `check-contract-drift` scans all contracts, so it had to be recompiled. Digest-only, no behavior change. |

<!-- /ANCHOR:deviations -->
