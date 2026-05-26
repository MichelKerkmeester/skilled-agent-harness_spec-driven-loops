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
- Review Target: 014 CocoIndex/rerank-sidecar deprecation arc — the live repo surface it touched across 4 runtimes (configs, agents, commands, code, docs) + the kept documented exceptions; verify nothing was missed and nothing broke. (track)
- Started: 2026-05-25T00:00:00Z
- Status: IN-PROGRESS
- Iteration: 1 of 14
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-05-25T00-00-00Z
- Parent Session: 2026-05-25T00-00-00Z
- Lifecycle Mode: resume
- Generation: 1
- continuedFromRun: 4

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 7 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| undefined | unknown | correctness | 1.00 | 1/2/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
| security | pending | 3 |
| traceability | pending | 1 |
| maintainability | pending | 0 |

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
- Last 3 ratios: 1.00
- convergenceScore: 0.00
- openFindings: 14
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
- Line 3: Unexpected non-whitespace character after JSON at position 2004 (line 1 column 2005) (raw: {"type":"iteration","iteration":2,"mode":"review","dimensions":["security"],"filesReviewed":[".vscode/mcp.json:1-67",".gemini/settings.json:1-169",".codex/config.toml:1-118",".mcp.json:1-69",".devin/c...)
- Line 4: Unexpected non-whitespace character after JSON at position 1390 (line 1 column 1391) (raw: {"type":"iteration","iteration":4,"mode":"review","dimensions":["maintainability"],"filesReviewed":[".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts",".opencode/skills/system-sp...)
- Line 6: Unexpected non-whitespace character after JSON at position 1058 (line 1 column 1059) (raw: {"type":"iteration","iteration":5,"mode":"review","dimensions":["correctness"],"filesReviewed":[".opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts",".opencode/skills/sys...)

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis if exhausted, OR remaining gap. This iteration found 4 NEW findings (F010-F013) across the analogous surfaces to iter-6, confirming the pattern that deeper digging finds more residue. The exhaustive alias grep confirmed no NEW live refs beyond documented exceptions. The remaining gap is the feature_catalog residue (F010) and the misleading handler references (F011-F012) which are traceability/maintainability issues. Review verdict: FAIL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 7 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
