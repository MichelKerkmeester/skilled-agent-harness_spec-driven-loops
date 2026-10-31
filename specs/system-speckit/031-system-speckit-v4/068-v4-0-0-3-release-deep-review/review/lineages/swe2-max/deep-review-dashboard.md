---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review (spec-folder)
- Started: 2026-10-06T04:21:48.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-swe2-max-1791260058145-vgna23
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 5 |
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness — .skilled/commands/deep workflow machinery (ledger-gateway cutover) | correctness | 1.00 | 0/2/2 | complete |
| 2 | correctness — sk-git message-contract gate, hooks, validators | correctness | 1.00 | 0/2/1 | complete |
| 3 | correctness — sk-doc shared scripts (validate_document + cite-drift) + system-spec-kit shared/test surface | correctness | 1.00 | 0/0/3 | complete |
| 4 | security — hooks/plugins/scripts enforcement surface (injection screen, message gate, dispatch guard, completion sentinel, gate killswitches) | security | 1.00 | 0/1/2 | complete |
| 5 | traceability — spec↔code claims: contract digests, version authority, feature-catalog constants, gates.tsv, packet-047 file claims, SOURCE_TAGS/FRONTMATTER_VALUES wiring | traceability | 1.00 | 0/0/1 | complete |
| 6 | traceability — agent cross-runtime mirrors (.skilled/.claude/.pi/.codex/.cursor/.devin) + root docs (AGENTS.md prefix guard, REPO RULES.md triggers, README claims) | traceability | 0.00 | 0/0/0 | complete |
| 7 | maintainability — repo-rules corpus tightening + AGENTS.md reorder + README rewrite: cross-reference survival, section-number consistency | maintainability | 0.00 | 0/0/0 | complete |
| 8 | correctness — sk-code hub (renumbering, verify_alignment_drift new checks, check-comment-hygiene multi-file) + sk-prompt scoped-read contract | correctness | 0.00 | 0/0/0 | complete |
| 9 | maintainability — sk-code-webflow renumber completeness + sk-design validator doc contract + hub routing fix evidence | maintainability | 0.00 | 0/0/0 | complete |
| 10 | traceability/maintainability sweep — sk-create-* leaf tooling (leaf-route-replay, ci-router-vocabulary-reach, rule-experiment, measure-rule-compliance) + commands/create + commands/speckit doc refs | traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 14 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 14
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 3 — correctness on `sk-doc` scripts and the shared script surface (`system-spec-kit` shared helpers the gate depends on), continuing down the manifest. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
