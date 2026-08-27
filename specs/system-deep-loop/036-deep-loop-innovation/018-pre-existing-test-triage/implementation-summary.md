---
title: "Implementation Summary: Pre-Existing Runtime Test-Failure Triage"
description: "Fixed the one cleanly-correct pre-existing failure (a stale sk-prompt census path) and classified the remaining 9 as environment-only or risky-unrelated with root causes and recommendations."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-pre-existing-test-triage"
    last_updated_at: "2026-08-26T10:03:52.975Z"
    last_updated_by: "claude"
    recent_action: "Fixed the sk-prompt census drift; classified the rest"
    next_safe_action: "Commit + push"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Which pre-existing failures are code-fixable now? Only the sk-prompt census path."
---
# Implementation Summary: Pre-Existing Runtime Test-Failure Triage

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-pre-existing-test-triage |
| **Level** | 1 |
| **Status** | Complete (fix landed; risky/env items deferred by design) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

One data fix plus a full classification of the 10 pre-existing failures.

**Fixed:** `state-backend-census.json` line 386 — the `model-benchmark-hub-output` surface's `resolvedPath` was `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`, a stale name from before the sk-prompt hub rename. Both the on-disk directory and the projection manifest use `sk-prompt-models`, so the census was corrected to match. `legacy-projections.test.ts` now passes 15/15.

**Classified (not fixed here):**

*Environment-only — not code-fixable:*
- `replay-fingerprint` — a 30s-timeout flake (slow test straddling the limit under load).
- `authorized-ledger` — a multiprocess temp-dir race (`ENOTEMPTY` on cleanup).
- `event-envelope` — a hostile-locale child needing `tr_TR.UTF-8`, which is not installed on this machine.
- `cli-devin`, `fanout` (stress) — spawn the live devin/CLI binaries, which are not available/authed here.
- `review-depth-convergence` (integration) — timing/environment-sensitive integration path.

*Risky-unrelated — need a deliberate decision:*
- `dependency-seams` — the runtime pins `better-sqlite3@12.10.0` but system-spec-kit ships `12.11.1`; the ABI-safety test wants them equal. Fixing means a cross-skill npm alignment.
- `render-command-contract` + `check-contract-drift` — `STALE_SOURCE_DIGEST` for deep/review, deep/research, deep/ai-council. Recompiling (`compile-command-contracts.cjs --command … --write`) clears the staleness but flips deep/review's rollout mode `fix`→`fallback`, breaking a different assertion. Needs a decision on the correct mode before recompiling.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failing test was run and its real reason read (not inferred). The sk-prompt drift was traced from the manifest (which uses `sk-prompt-models`) to the disk directory (also `sk-prompt-models`) to the census JSON (stale `prompt-models`), making the correct fix unambiguous. The risky and environment-only failures were left untouched — an operator decision, since forcing them would mean cross-skill npm changes, a rollout-mode behavior change, or non-code environment setup.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Fix only the cleanly-correct one.** The census path had an unambiguous ground truth (disk + manifest); everything else is either environment or a decision.
- **Do not recompile the command contracts.** It clears the STALE failures but silently changes deep/review's rollout mode — a behavior change that needs its own decision.
- **Do not touch dependency pins.** Aligning better-sqlite3 across skills is a cross-skill npm operation with ABI implications, out of a triage's scope.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Census fix | Pass | `legacy-projections.test.ts` 15/15 |
| JSON validity | Pass | `python3 -c json.load` on `state-backend-census.json` |
| Scope | Pass | one string changed; no runtime code touched |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **9 of 10 failures remain** — 6 environment-only (not fixable by code here) and 3 risky-unrelated (dependency pin, rollout mode) that need deliberate decisions, not a rushed fix.
2. **No whole-suite re-run in this packet** — the single census-data change cannot affect unrelated suites; `legacy-projections` was verified directly.

<!-- /ANCHOR:limitations -->
