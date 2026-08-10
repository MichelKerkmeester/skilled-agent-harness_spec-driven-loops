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
- Review Target: .opencode/skills/sk-design/sk-design-mcp-open-design/** plus every live referencing surface (sk-design hub/modes, agents, commands, deep-alignment adapters, sibling skills, advisor corpus, doc fixtures, root docs) and the deprecation plan in this spec packet (files)
- Started: 2026-08-10T08:25:00Z
- Status: COMPLETE
- Iteration: 9 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: rvw-2026-08-10-deprecate-open-design
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: operator-directed early convergence

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
| P1 (Required) | 37 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-rvw-2026-08-10-001 | correctness — deprecation plan acceptance and transport routing surfaces | correctness | 1.00 | 0/2/0 | complete |
| run-rvw-2026-08-10-002 | security — retired transport trust boundaries, secret/path residue, and safe removal of MCP/CLI configuration | security | 0.67 | 0/3/0 | complete |
| run-rvw-2026-08-10-003 | traceability — spec_code, checklist_evidence, skill_agent, and agent_cross_runtime | traceability | 0.63 | 0/4/0 | complete |
| run-rvw-2026-08-10-004 | maintainability — derived manifests, md-generator pairing, changelog continuity, exclusion allowlist, and follow-on change cost | maintainability | 0.71 | 0/7/0 | complete |
| run-rvw-2026-08-10-005 | traceability — feature_catalog_code and playbook_capability overlays | traceability | 0.56 | 0/8/0 | complete |
| run-rvw-2026-08-10-006 | maintainability — completeness sweep of sibling skills and deprecation action classification | maintainability/traceability | 0.56 | 0/9/0 | complete |
| run-rvw-2026-08-10-007 | traceability — completeness sweep B: advisor/doc-infrastructure surfaces | traceability | 0.68 | 0/14/0 | complete |
| run-rvw-2026-08-10-008 | traceability — completeness sweep C: benchmark corpora and generated-artifact adjudication | traceability | 0.53 | 0/15/0 | complete |
| run-rvw-2026-08-10-009 | correctness/completeness — adversarial replay of the whole live-reference inventory | correctness | 0.29 | 0/19/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 23 |
| security | covered | 0 |
| traceability | covered | 8 |
| maintainability | covered | 6 |

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
- Last 3 ratios: 0.68 -> 0.53 -> 0.29
- convergenceScore: 0.71
- openFindings: 37
- persistentSameSeverity: 16
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 16

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
- dimension: correctness - focus area: final iteration-010 replay of the four newly uncovered surfaces and implementation-ready inventory closure - reason: the corrected whole-workspace sweep found four live plan gaps while confirming the three requested carried P1s; all four review dimensions and overlays remain conditionally complete - rotation status: adversarial completeness replay C2 completed conditionally in iteration 009 - blocked/productive carry-forward: productive — preserve P1-001..P1-019; do not retry bounded-OD false positives or ruled-out archive/report directions - required evidence: exact `.claude` config and Cursor/Devin path disposition, advisor playbook classification, `CLAUDE.md` root action, then final zero-residue gate and strict validation proof - recovery note: if any newly named surface is proven generated or historical, record its exact path and consumer proof before downgrading; otherwise amend T021/T025/T029/T030 and rerun the gate. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 37 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
