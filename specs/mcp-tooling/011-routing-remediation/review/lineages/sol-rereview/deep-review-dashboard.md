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
- Review Target: .opencode/specs/mcp-tooling/011-routing-remediation (spec-folder)
- Started: 2026-07-16T18:41:41Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-sol-rereview-1784227058428-v8wtp3
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness — deterministic routing, fallback-only resource assembly, defer behavior, and route-gold enforcement | correctness | 0.00 | 0/0/0 | complete |
| 2 | security — fallback isolation, inert gold parsing, transport trust metadata, and design-judgment pairing | security | 0.00 | 0/0/0 | complete |
| 3 | traceability — prior-finding closure and six-mode projection | traceability | 1.00 | 0/0/1 | complete |
| 4 | maintainability — shared-harness durability, compatibility, and repeatability | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- Last 3 ratios: 0.00 -> 1.00 -> 0.00
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
- candidateCoverage: covered=1, ruledOut=23, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 positive-route-failure (ruled_out): 13/13 exact intent and resource matches.; evidence=.opencode/skills/mcp-tooling/hub-router.json:150-171, .opencode/specs/mcp-tooling/011-routing-remediation/review/lineages/sol-rereview/logs/iteration-001-replay-hub.json
- iteration 1 cross-mode-resource-contamination (ruled_out): No default resource appears in scored or zero-score assemblies.; evidence=.opencode/skills/mcp-tooling/hub-router.json:20-29, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:529-550
- iteration 1 defer-contract-bypass (ruled_out): Zero-signal request defers with empty assembly.; evidence=.opencode/skills/mcp-tooling/hub-router.json:25-29, .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-24
- iteration 1 benchmark-route-gate-blindness (ruled_out): The hard gate blocks a violation and accepts the clean corpus.; evidence=.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298, .opencode/specs/mcp-tooling/011-routing-remediation/review/lineages/sol-rereview/logs/iteration-001-benchmark/skill-benchmark-report.json
- iteration 2 zero-score-resource-load (ruled_out): No packet hard-loads its default on fallback.; evidence=.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:217-225, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:270-340
- iteration 2 gold-parser-command-execution (ruled_out): Untrusted-looking values only participate in exact comparisons.; evidence=.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121-175, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:219-269
- iteration 2 transport-workspace-write-misrepresentation (ruled_out): No silent local write or unpaired design-decision path remains.; evidence=.opencode/skills/mcp-tooling/mode-registry.json:139-166, .opencode/skills/mcp-tooling/mcp-figma/SKILL.md:254-276
- iteration 4 shared-harness-regression (ruled_out): No mcp-tooling hardcode or legacy behavior break exists.; evidence=run-skill-benchmark.cjs:65-89,289-298, router-replay.cjs:529-550, route-gold-gate.vitest.ts:270-420
- iteration 4 repeat-run-nondeterminism (ruled_out): No scoring or gate drift observed.; evidence=logs/iteration-001-benchmark/skill-benchmark-report.json, logs/iteration-004-benchmark/skill-benchmark-report.json

### Clean Search Proof
- iteration 1 positive-route-failure (ruled_out): 13/13 exact intent and resource matches.; evidence=.opencode/skills/mcp-tooling/hub-router.json:150-171, .opencode/specs/mcp-tooling/011-routing-remediation/review/lineages/sol-rereview/logs/iteration-001-replay-hub.json
- iteration 1 cross-mode-resource-contamination (ruled_out): No default resource appears in scored or zero-score assemblies.; evidence=.opencode/skills/mcp-tooling/hub-router.json:20-29, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:529-550
- iteration 1 defer-contract-bypass (ruled_out): Zero-signal request defers with empty assembly.; evidence=.opencode/skills/mcp-tooling/hub-router.json:25-29, .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-24
- iteration 1 benchmark-route-gate-blindness (ruled_out): The hard gate blocks a violation and accepts the clean corpus.; evidence=.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298, .opencode/specs/mcp-tooling/011-routing-remediation/review/lineages/sol-rereview/logs/iteration-001-benchmark/skill-benchmark-report.json
- iteration 2 zero-score-resource-load (ruled_out): No packet hard-loads its default on fallback.; evidence=.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:217-225, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:270-340
- iteration 2 gold-parser-command-execution (ruled_out): Untrusted-looking values only participate in exact comparisons.; evidence=.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121-175, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:219-269
- iteration 2 transport-workspace-write-misrepresentation (ruled_out): No silent local write or unpaired design-decision path remains.; evidence=.opencode/skills/mcp-tooling/mode-registry.json:139-166, .opencode/skills/mcp-tooling/mcp-figma/SKILL.md:254-276
- iteration 4 shared-harness-regression (ruled_out): No mcp-tooling hardcode or legacy behavior break exists.; evidence=run-skill-benchmark.cjs:65-89,289-298, router-replay.cjs:529-550, route-gold-gate.vitest.ts:270-420
- iteration 4 repeat-run-nondeterminism (ruled_out): No scoring or gate drift observed.; evidence=logs/iteration-001-benchmark/skill-benchmark-report.json, logs/iteration-004-benchmark/skill-benchmark-report.json

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Phase: synthesis - Focus area: authoritative registry, planning trigger, coverage status, and terminal verdict - Reason: all four required dimensions are complete and `maxIterations=4` is reached - Rotation status: 4/4 dimensions complete Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
