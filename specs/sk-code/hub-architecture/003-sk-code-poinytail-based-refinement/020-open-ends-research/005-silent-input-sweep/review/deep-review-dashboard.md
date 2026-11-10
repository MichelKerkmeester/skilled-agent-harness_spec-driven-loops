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
- Review Target: Every CLI script under .skilled/bin, .skilled/skills/**/scripts (nested mode packets included), .skilled/skills/*/runtime/cli and .skilled/commands/*/scripts (tests and node_modules excluded), checked for two defect classes: (1) unknown or misspelled options accepted silently; (2) exit 0 on a detected problem, or a header that documents an option the parser rejects (files)
- Started: 2026-10-11T16:24:55Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: rvw-020-005-silent-input-20261011T162455Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P1 (Required) | 18 |
| P2 (Suggestions) | 55 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/4 | complete |
| 2 | security | security | 1.00 | 0/1/6 | complete |
| 3 | traceability | traceability | 0.31 | 0/1/4 | complete |
| 4 | maintainability | maintainability | 0.28 | 0/1/6 | complete |
| 5 | correctness | correctness | 0.27 | 0/2/6 | complete |
| 6 | security (slice 6/10: silent-input sweep of deep-loop runtime CLI scripts) | security | 0.34 | 0/5/4 | complete |
| 7 | traceability (slice 7/10: silent-input sweep of deep-loop runtime + skill-advisor CLI scripts) | traceability | 0.30 | 0/3/5 | complete |
| 8 | maintainability (slice 8/10: silent-input sweep of system-spec-kit runtime CLI + system-skill-advisor scripts) | maintainability | 0.13 | 0/2/6 | complete |
| 9 | correctness (slice 9/10: silent-input sweep of system-spec-kit runtime CLI rules/setup/spec-folder/spec scripts) | correctness | 0.08 | 0/1/5 | complete |
| 10 | security (slice 10/10: silent-input sweep of system-spec-kit runtime CLI spec/validation/sweep/templates/scripts, 29 files) | security | 0.09 | 0/1/8 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 39 |
| security | covered | 18 |
| traceability | covered | 8 |
| maintainability | covered | 8 |

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
- Last 3 ratios: 0.13 -> 0.08 -> 0.09
- convergenceScore: 0.91
- openFindings: 73
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=10, ruledOut=13, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 UNKNOWN (ruled_out): no counterexample found across the slice's exit paths; evidence=iteration-001 Files Reviewed, compiled-route-sync.cjs:1094, check-no-spec-imports.cjs:170-172, release-update.cjs:2583-2587
- iteration 1 UNKNOWN (ruled_out): usage-vs-parser comparison found no mismatch in the slice; evidence=.skilled/bin/compiled-route-sync.cjs:1037-1053, .skilled/commands/doctor/scripts/release-update.cjs:2459-2520
- iteration 2 documented_option_rejected_by_parser (ruled_out): usage/header vs parser comparison clean for all 32 files; evidence=iteration-002 Files Reviewed, validate_config.py:455-467, render-screenshots.cjs:174-175
- iteration 2 exit_zero_after_detected_problem (ruled_out): all inspected failure branches return nonzero; evidence=check-corpus.cjs:3677, verify-doc-claims.cjs:393, verify-router-sync.cjs:353, verify-notion-migration-parity.sh:632, apply-design-md.cjs:710, run-all-drift-guards.sh:82, run-source-gates.sh:86
- iteration 2 silent_unknown_option (ruled_out): unknown options rejected with a nonzero exit across the cluster; evidence=install.sh cluster case arms, route-validate.sh:51-54, skill-graph-freshness.cjs:319-322
- iteration 3 documented_option_mismatch (ruled_out): full header/usage comparison found no mismatch in slice 3; evidence=deep-review-config.json
- iteration 3 exit_zero_after_detection (ruled_out): no gate-scope exit-0-after-detection instance found; only helper CLI paths (SL-005/006); evidence=frontmatter-version.mjs:414
- iteration 3 silent_unknown_option (ruled_out): strict parsers verified; no silent acceptance; evidence=cite-drift-scan.mjs:1192
- iteration 5 silent_unknown_option (ruled_out): parser rejects unknown tokens explicitly; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:719
- iteration 5 documented_option_rejected (ruled_out): no doc/parser mismatch found in slice; evidence=.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:574
- iteration 5 exit_zero_after_detected_problem (ruled_out): documented contract, backstops named; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:404
- iteration 6 exit_zero_on_detected_problem (ruled_out): every inspected failure branch exits nonzero; documented no-op paths are intentional; evidence=check-contract-drift.cjs:622, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2389, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4016
- iteration 6 documented_option_rejected_by_parser (ruled_out): checked usage/help texts map to parsed options; evidence=.skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:588, .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:721, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2394
- iteration 7 documented_option_rejected (ruled_out): strict parsers reject unknown flags and their help text matches the parser; evidence=.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1367, .skilled/skills/system-deep-loop/runtime/scripts/verify-authority.cjs:165
- iteration 7 unknown_option_silently_accepted (ruled_out): standard argparse parse_args; unrecognized options exit 2; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4753
- iteration 7 detected_problem_exit_zero (ruled_out): no instance found; detected problems in this slice exit non-zero; evidence=.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:379
- iteration 8 unknown_option_accepted_silently (ruled_out): strict rejection verified by read and execution; evidence=.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:234, repro F1, repro F2
- iteration 8 exit_zero_on_detected_problem (ruled_out): drift paths exit non-zero; no safe execution needed for a ruled-out direction; evidence=.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:249
- iteration 8 documented_option_rejected_or_unread (ruled_out): no doc/parser mismatch found in the slice; evidence=.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:80
- iteration 9 documented_option_rejected_or_unread (ruled_out): every documented option maps to a parser arm or an explicit rejection across the slice; evidence=.skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh:141
- iteration 10 documented_option_rejected (ruled_out): documented options map to handled parser branches in every checked file; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:92
- iteration 10 unknown_option_silent (ruled_out): explicit unknown-token rejection verified by read and, where runnable, execution; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs:57, .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:617, repro F7 control

### Clean Search Proof
- iteration 1 UNKNOWN (ruled_out): no counterexample found across the slice's exit paths; evidence=iteration-001 Files Reviewed, compiled-route-sync.cjs:1094, check-no-spec-imports.cjs:170-172, release-update.cjs:2583-2587
- iteration 1 UNKNOWN (ruled_out): usage-vs-parser comparison found no mismatch in the slice; evidence=.skilled/bin/compiled-route-sync.cjs:1037-1053, .skilled/commands/doctor/scripts/release-update.cjs:2459-2520
- iteration 2 documented_option_rejected_by_parser (ruled_out): usage/header vs parser comparison clean for all 32 files; evidence=iteration-002 Files Reviewed, validate_config.py:455-467, render-screenshots.cjs:174-175
- iteration 2 exit_zero_after_detected_problem (ruled_out): all inspected failure branches return nonzero; evidence=check-corpus.cjs:3677, verify-doc-claims.cjs:393, verify-router-sync.cjs:353, verify-notion-migration-parity.sh:632, apply-design-md.cjs:710, run-all-drift-guards.sh:82, run-source-gates.sh:86
- iteration 2 silent_unknown_option (ruled_out): unknown options rejected with a nonzero exit across the cluster; evidence=install.sh cluster case arms, route-validate.sh:51-54, skill-graph-freshness.cjs:319-322
- iteration 2 silent_unknown_option (not_applicable): no CLI entry point; the defect classes cannot occur; evidence=_utils.sh:845-871, router-replay-lib.cjs:507
- iteration 3 documented_option_mismatch (ruled_out): full header/usage comparison found no mismatch in slice 3; evidence=deep-review-config.json
- iteration 3 exit_zero_after_detection (ruled_out): no gate-scope exit-0-after-detection instance found; only helper CLI paths (SL-005/006); evidence=frontmatter-version.mjs:414
- iteration 3 silent_unknown_option (ruled_out): strict parsers verified; no silent acceptance; evidence=cite-drift-scan.mjs:1192
- iteration 5 silent_unknown_option (ruled_out): parser rejects unknown tokens explicitly; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:719
- iteration 5 documented_option_rejected (ruled_out): no doc/parser mismatch found in slice; evidence=.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:574
- iteration 5 exit_zero_after_detected_problem (ruled_out): documented contract, backstops named; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:404
- iteration 5 silent_unknown_option (not_applicable): CLI tail shows no argument-parsing surface requiring an unknown-flag branch beyond module exports; no defect observed in the read regions; evidence=.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2960
- iteration 6 exit_zero_on_detected_problem (ruled_out): every inspected failure branch exits nonzero; documented no-op paths are intentional; evidence=check-contract-drift.cjs:622, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2389, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4016
- iteration 6 documented_option_rejected_by_parser (ruled_out): checked usage/help texts map to parsed options; evidence=.skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:588, .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:721, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2394
- iteration 7 documented_option_rejected (ruled_out): strict parsers reject unknown flags and their help text matches the parser; evidence=.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1367, .skilled/skills/system-deep-loop/runtime/scripts/verify-authority.cjs:165
- iteration 7 unknown_option_silently_accepted (ruled_out): standard argparse parse_args; unrecognized options exit 2; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4753
- iteration 7 detected_problem_exit_zero (ruled_out): no instance found; detected problems in this slice exit non-zero; evidence=.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:379
- iteration 8 unknown_option_accepted_silently (ruled_out): strict rejection verified by read and execution; evidence=.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:234, repro F1, repro F2
- iteration 8 exit_zero_on_detected_problem (ruled_out): drift paths exit non-zero; no safe execution needed for a ruled-out direction; evidence=.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:249
- iteration 8 unknown_option_accepted_silently (not_applicable): no CLI option surface in the helpers; the one adjacent fallback (template-utils level) is recorded as an edge case, not an option; evidence=.skilled/skills/system-skill-advisor/scripts/doctor.sh:29
- iteration 8 documented_option_rejected_or_unread (ruled_out): no doc/parser mismatch found in the slice; evidence=.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:80
- iteration 9 documented_option_rejected_or_unread (ruled_out): every documented option maps to a parser arm or an explicit rejection across the slice; evidence=.skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh:141
- iteration 10 documented_option_rejected (ruled_out): documented options map to handled parser branches in every checked file; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:92
- iteration 10 unknown_option_silent (ruled_out): explicit unknown-token rejection verified by read and, where runnable, execution; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs:57, .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:617, repro F7 control

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security (rotation). - Focus area: slice 7 of 10 (orchestrator-assigned). - Reason: stopPolicy=max-iterations; the sweep continues to iteration 10. - Rotation status: security slice 6 complete. - Blocked/productive carry-forward: none. - Required evidence: parser line, usage/header text and every exit path for the next slice's files. - Recovery note: not applicable.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 18 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
