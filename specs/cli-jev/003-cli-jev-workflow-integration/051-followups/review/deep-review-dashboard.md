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
- Review Target: The deletion of killed and retired Jev feature code (002 tie-break, 019 suggested order, 006 goal lint, 027 stop rater, 028 stop hint, 029 severity replay, 033 residue flagger, 026 completion claims, 031 debug next check) and the Jev-arm strip (021 leaf-route replay, 034 reader lens, 003 gate line): verify no live code, test, doc, command, agent, mirror or generated file outside specs/ still references or depends on the deleted code (spec-folder)
- Started: 2026-10-04T07:44:47.000Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: 2026-10-04T07:44:47.000Z
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 1 |
| Resolved | 1 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.02 | 0/1/0 | complete |
| 2 | traceability | traceability | 0.03 | 0/0/1 | complete |
| 3 | maintainability | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | pending | 0 |
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
- Last 3 ratios: 0.02 -> 0.03 -> 0.00
- convergenceScore: 1.00
- openFindings: 1
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
- candidateCoverage: covered=4, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 dangling_import_or_spawn (ruled_out): repo-wide exact search clean outside specs/ and changelog/; evidence=.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs:1
- iteration 1 removed_flag_reference (ruled_out): no caller of the two stripped replays passes the removed flag; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:1, .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py:1
- iteration 1 mirror_drift (ruled_out): find over all mirrors returns no deleted scorer file; evidence=.opencode/skills/system-skill-advisor/leaf-manifest.json:46
- iteration 1 fixture_staleness (ruled_out): index has no .skilled deleted-doc path and no deleted-scorer token; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:101985
- iteration 1 survivor_parse_or_import_breakage (ruled_out): node --check, py_compile and import/export cross-check all pass; evidence=.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs:44, .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:34
- iteration 2 stale_generated_artifact (ruled_out): check-mode gate passes every root except the one already reported; evidence=.skilled/skills/system-skill-advisor/leaf-manifest.json:46
- iteration 2 stale_reference (ruled_out): repo-wide search clean outside the known generated and excluded classes; evidence=.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:53
- iteration 2 fixture_staleness (ruled_out): direct reads show spec-tree ownership of every token and path; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:79695
- iteration 2 dangling_markdown_link (ruled_out): link existence check returned no broken target; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:1
- iteration 3 dead_code_surface (ruled_out): per-export usage counts are all nonzero; evidence=.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs:44, .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:34
- iteration 3 dead_code_surface (ruled_out): no single-use definition and no leftover Jev token or flag; evidence=.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs:390, .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs:208
- iteration 3 fixture_staleness (ruled_out): no fixture file left with zero live readers; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs:993
- iteration 3 doc_count_drift (ruled_out): stated totals reconcile with disk after the deletion; evidence=.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19, .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:31
- iteration 3 stale_generated_artifact (ruled_out): metadata gate is clean fleet-wide and both registries are free of the deleted leaf names; evidence=.skilled/skills/system-skill-advisor/leaf-manifest.json:46
- iteration 3 stale_reference (ruled_out): zero deleted basenames in runner configs, package scripts or workflows; evidence=.skilled/skills/system-spec-kit/runtime/vitest.config.ts:16

### Clean Search Proof
- iteration 1 dangling_import_or_spawn (ruled_out): repo-wide exact search clean outside specs/ and changelog/; evidence=.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs:1
- iteration 1 removed_flag_reference (ruled_out): no caller of the two stripped replays passes the removed flag; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:1, .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py:1
- iteration 1 mirror_drift (ruled_out): find over all mirrors returns no deleted scorer file; evidence=.opencode/skills/system-skill-advisor/leaf-manifest.json:46
- iteration 1 fixture_staleness (ruled_out): index has no .skilled deleted-doc path and no deleted-scorer token; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:101985
- iteration 1 survivor_parse_or_import_breakage (ruled_out): node --check, py_compile and import/export cross-check all pass; evidence=.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs:44, .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:34
- iteration 2 stale_generated_artifact (ruled_out): check-mode gate passes every root except the one already reported; evidence=.skilled/skills/system-skill-advisor/leaf-manifest.json:46
- iteration 2 stale_reference (ruled_out): repo-wide search clean outside the known generated and excluded classes; evidence=.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:53
- iteration 2 fixture_staleness (ruled_out): direct reads show spec-tree ownership of every token and path; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:79695
- iteration 2 dangling_markdown_link (ruled_out): link existence check returned no broken target; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:1
- iteration 3 dead_code_surface (ruled_out): per-export usage counts are all nonzero; evidence=.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs:44, .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:34
- iteration 3 dead_code_surface (ruled_out): no single-use definition and no leftover Jev token or flag; evidence=.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs:390, .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs:208
- iteration 3 fixture_staleness (ruled_out): no fixture file left with zero live readers; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs:993
- iteration 3 doc_count_drift (ruled_out): stated totals reconcile with disk after the deletion; evidence=.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19, .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:31
- iteration 3 stale_generated_artifact (ruled_out): metadata gate is clean fleet-wide and both registries are free of the deleted leaf names; evidence=.skilled/skills/system-skill-advisor/leaf-manifest.json:46
- iteration 3 stale_reference (ruled_out): zero deleted basenames in runner configs, package scripts or workflows; evidence=.skilled/skills/system-spec-kit/runtime/vitest.config.ts:16

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
