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
- Review Target: 027/019 skill-advisor cross-session reconnect (commit 2f106976f3): owner-lease + reconnecting proxy in mk-skill-advisor-launcher.cjs, shared launcher-session-proxy.cjs change, 3 new launcher tests (files)
- Started: 2026-06-11T09:05:00Z
- Status: IN-PROGRESS
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-11T09:05:00Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 5 |
| P1 (Required) | 8 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | shared-lib-compat | shared-lib-compat | 1.00 | 0/0/0 | complete |
| run-001 | lease-correctness | lease-correctness | 1.00 | 1/1/0 | complete |
| run-001 | reconnect-bridging | reconnect-bridging | 1.00 | 1/1/1 | complete |
| run-001 | lifecycle-reaping | lifecycle-reaping | 1.00 | 3/2/0 | complete |
| run-001 | test-rigor | test-rigor | 1.00 | 0/4/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | pending | 15 |
| security | pending | 0 |
| traceability | pending | 0 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 15
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
- candidateCoverage: covered=0, ruledOut=6, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 race|lease (ruled_out): O_CREAT|O_EXCL-style acquisition plus owner reprobes prevent the no-prior-lease double-writer interleaving.; evidence=.opencode/bin/mk-skill-advisor-launcher.cjs:339
- iteration 3 framing (ruled_out): Proven-equivalent shared implementation to mk-spec-memory for framing; no divergent skill-advisor bridge code on this path.; evidence=bin/lib/launcher-session-proxy.cjs:74
- iteration 4 lease-wipe (ruled_out): Lease release is conditional on local ownership for the owner lease and on local pid/current child for the PID lease. The remaining lease-deletion risk is the missing release/adoption path covered by the P0 findings, not wiping another live owner's lease.; evidence=bin/mk-skill-advisor-launcher.cjs:500
- iteration 4 reaping (ruled_out): No target-side one-probe healthy-daemon reap path was found.; evidence=bin/mk-skill-advisor-launcher.cjs:537
- iteration 5 host-safety (ruled_out): Sandbox-critical env vars and fixture paths are temp-scoped for the reviewed tests.; evidence=.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:146
- iteration 5 test-gap (ruled_out): The asserted stdout response is end-to-end evidence for this specific test.; evidence=.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:304

### Clean Search Proof
- iteration 2 race|lease (ruled_out): O_CREAT|O_EXCL-style acquisition plus owner reprobes prevent the no-prior-lease double-writer interleaving.; evidence=.opencode/bin/mk-skill-advisor-launcher.cjs:339
- iteration 3 framing (ruled_out): Proven-equivalent shared implementation to mk-spec-memory for framing; no divergent skill-advisor bridge code on this path.; evidence=bin/lib/launcher-session-proxy.cjs:74
- iteration 4 lease-wipe (ruled_out): Lease release is conditional on local ownership for the owner lease and on local pid/current child for the PID lease. The remaining lease-deletion risk is the missing release/adoption path covered by the P0 findings, not wiping another live owner's lease.; evidence=bin/mk-skill-advisor-launcher.cjs:500
- iteration 4 reaping (ruled_out): No target-side one-probe healthy-daemon reap path was found.; evidence=bin/mk-skill-advisor-launcher.cjs:537
- iteration 5 host-safety (ruled_out): Sandbox-critical env vars and fixture paths are temp-scoped for the reviewed tests.; evidence=.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:146
- iteration 5 test-gap (ruled_out): The asserted stdout response is end-to-end evidence for this specific test.; evidence=.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:304

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P0 finding(s) blocking release.
- 8 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
