---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: How can system-skilled-doctor, its /doctor commands, mainly the overlay logic (overlay-engine.cjs, /doctor:overlay status/apply/capture/repin/rollback, overlay-guard hook, .skilled-overlays.json, protectedPaths, repin.exclude, not-copied list), and the user experience for external repositories that link or copy Skilled in (INSTALL-SKILLED.md, /doctor:install, /doctor:symlink, /doctor:setup, /doctor:helper) be improved? Cover correctness gaps, confusing or missing commands and messages, onboarding friction for a new external repo, upgrade/re-pin safety, and doc accuracy versus code. Rank recommendations by user impact.
- Started: 2026-11-08T16:26:27Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-08T16:26:27Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: overlay-engine.cjs correctness and safety for protectedPaths, repin.exclude, the not-copied list, partial failure and rollback | - | 0.72 | 0 | insight |
| 2 | Q3: What onboarding friction does a brand-new external repository hit when linking or copying Skilled in, from INSTALL-SKILLED.md through /doctor:install, /doctor:symlink and /doctor:setup? | - | 0.78 | 0 | insight |
| 3 | Are status/apply/capture classifications correct for every skill-root and json-entry shape, and does the engine detect a manifest pin.commit that disagrees with the bytes actually in the tree? | - | 0.74 | 0 | insight |
| 4 | Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from? | - | 0.76 | 0 | insight |
| 5 | Residual from iteration 3: pinnedSha256 scope validation for multi-output entries; whether apply repairs layout links; capture bodies for json-entry and skill-root. | - | 0.60 | 0 | insight |

- iterationsCompleted: 5
- keyFindings: 24
- openQuestions: 2
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/5
- [x] Q1: Where is overlay-engine.cjs (status/apply/capture/repin/rollback) incorrect or unsafe against its own docs and tests, for example manifest drift, protectedPaths and repin.exclude handling, the not-copied list, partial failure and rollback?
- [x] Q3: What onboarding friction does a brand-new external repository hit when linking or copying Skilled in, from INSTALL-SKILLED.md through /doctor:install, /doctor:symlink and /doctor:setup?
- [x] Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?
- [ ] Q2: Which /doctor command messages, prompts and outputs confuse an external-repo user or leave them without a next step (overlay, install, symlink, setup, helper)? [legacy-import]
- [ ] Q5: Where do INSTALL-SKILLED.md, overlays.md, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Q2: Which /doctor command messages, prompts and outputs confuse an external-repo user or leave them without a next step (overlay, install, symlink, setup, helper)?
- [ ] Q5: Where do INSTALL-SKILLED.md, overlays.md, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▆▇▇███▇▇▇▇▇▇▇▇▆▅▄▂▁
- score sparkline: ▆▆▇▇███▇▇▇▇▇▇▇▇▆▅▄▂▁
- Last 3 ratios: 0.74 -> 0.76 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
New residual: whether `loadManifest` rejects `pinnedSha256` on non-`file` scopes, and whether it rejects unknown keys at all. Confirming this decides whether F1 is "silently inert" or "silently inert plus a missing validation".

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
