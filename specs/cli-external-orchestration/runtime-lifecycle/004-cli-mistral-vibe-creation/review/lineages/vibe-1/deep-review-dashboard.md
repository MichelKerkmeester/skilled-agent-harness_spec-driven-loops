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
- Review Target: .vibe/hooks.toml .vibe/plugins/repo-guards/*.mjs .vibe/plugins/repo-guards/*.cjs .vibe/plugins/repo-guards/lib/*.mjs .skilled/hooks/session-lifecycle/vibe/*.mjs .skilled/hooks/ask-surface-guard/vibe/*.mjs .skilled/hooks/decision-capture/vibe/*.mjs .skilled/hooks/goal/vibe/*.mjs .skilled/hooks/session-handover/vibe/*.mjs .skilled/hooks/shared/session-readers/vibe.mjs .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs .skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs (files)
- Started: 2026-11-16T06:00:44Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-vibe-1-1794808672532-65xu0h
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 15 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/5 | complete |
| 2 | security | security | 0.23 | 0/0/3 | complete |
| 3 | traceability | traceability | 0.19 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 0.16 | 0/0/3 | complete |
| 5 | cross-reference | cross-reference | 0.13 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | covered | 3 |
| traceability | covered | 3 |
| maintainability | covered | 3 |

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
- Last 3 ratios: 0.19 -> 0.16 -> 0.13
- convergenceScore: 0.88
- openFindings: 16
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
- graphCoverageMode: none
- candidateCoverage: covered=25, ruledOut=21, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 payload_mismatch (ruled_out): the field is documented for post_tool; evidence=.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:196
- iteration 2 tool_coverage_gap (ruled_out): the binding and the core agree on every tool name; evidence=.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-35, .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:40, .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:770-798
- iteration 2 self_injection (ruled_out): no path carries model text into the advisory, and neither the marker nor the receipt directory is payload-rooted; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:260, .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:176-180
- iteration 3 dead_binding (ruled_out): the hook filters to MCP names before the core runs, and the names cannot be enumerated in a static selector; evidence=.vibe/plugins/repo-guards/mcp-route-guard.mjs:53-54
- iteration 3 parity_gap (ruled_out): no new parity gap; the two known ones are already recorded; evidence=.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:118-140, .opencode/plugins/overlay-guard.js:101-103
- iteration 4 god_module (ruled_out): the sections are cohesive and the size is the detector's, not a mix of concerns; evidence=.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:16-311
- iteration 4 duplicated_tree (ruled_out): the tree is a symlink farm, not a copy, so there is nothing to drift; evidence=.skilled/hooks/env-secret-guard/vibe/env-secret-guard.mjs
- iteration 5 stale_finding (ruled_out): no carried finding was fixed or invalidated; two were narrowed by counterevidence; evidence=.vibe/plugins/repo-guards/lib/hook-io.mjs:37, .vibe/plugins/repo-guards/spec-gate.mjs:76, .vibe/hooks.toml:124-128
- iteration 5 stale_verdict (ruled_out): the rows for the three hooks the hand-over merge changed were rerun on the merged code; evidence=specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md, .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:265
- iteration 5 misdeclared_binding (ruled_out): the declaration is correct; the finding is the missing verification, not the declaration; evidence=.vibe/hooks.toml:141-144, .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:69

### Clean Search Proof
- iteration 1 payload_mismatch (ruled_out): the field is documented for post_tool; evidence=.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:196
- iteration 2 tool_coverage_gap (ruled_out): the binding and the core agree on every tool name; evidence=.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-35, .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:40, .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:770-798
- iteration 2 self_injection (ruled_out): no path carries model text into the advisory, and neither the marker nor the receipt directory is payload-rooted; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:260, .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:176-180
- iteration 3 dead_binding (ruled_out): the hook filters to MCP names before the core runs, and the names cannot be enumerated in a static selector; evidence=.vibe/plugins/repo-guards/mcp-route-guard.mjs:53-54
- iteration 3 parity_gap (ruled_out): no new parity gap; the two known ones are already recorded; evidence=.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:118-140, .opencode/plugins/overlay-guard.js:101-103
- iteration 4 god_module (ruled_out): the sections are cohesive and the size is the detector's, not a mix of concerns; evidence=.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:16-311
- iteration 4 duplicated_tree (ruled_out): the tree is a symlink farm, not a copy, so there is nothing to drift; evidence=.skilled/hooks/env-secret-guard/vibe/env-secret-guard.mjs
- iteration 5 stale_finding (ruled_out): no carried finding was fixed or invalidated; two were narrowed by counterevidence; evidence=.vibe/plugins/repo-guards/lib/hook-io.mjs:37, .vibe/plugins/repo-guards/spec-gate.mjs:76, .vibe/hooks.toml:124-128
- iteration 5 stale_verdict (ruled_out): the rows for the three hooks the hand-over merge changed were rerun on the merged code; evidence=specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md, .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:265
- iteration 5 misdeclared_binding (ruled_out): the declaration is correct; the finding is the missing verification, not the declaration; evidence=.vibe/hooks.toml:141-144, .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:69

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four declared dimensions are complete and the cross-reference sweep is closed. - Focus area: the synthesis. The report carries 16 active findings (1 P1, 15 P2), the verdict `CONDITIONAL`, and the Planning Packet built from the finding registry. - Reason: `config.maxIterations` is 5 and this is iteration 5, so the lineage stops on `max-iterations` with `stopReason: "maxIterationsReached"`. - Rotation status: correctness, security, traceability, maintainability and cross-reference all complete. - Blocked/productive carry-forward: productive — cross-referencing the scenario census against the binding census found the one unverified binding in a single pass, and the verdict table supplied counterevidence that narrowed two carried findings. - Required evidence: the synthesis cites the registry, not this narrative, for the finding count and the verdict. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
