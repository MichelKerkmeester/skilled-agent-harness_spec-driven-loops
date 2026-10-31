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
- Started: 2026-10-06T05:49:40Z
- Status: INITIALIZED
- Iteration: 2 of 10
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-luna-codex-1791264733860-t333md
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
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Correctness — cross-runtime fetched-text screening | correctness | 0.00 | 0/0/0 | complete |
| 2 | Security — classifier transport and hook process boundary | security | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 0 |
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
- Last 3 ratios: 0.00 -> 1.00
- convergenceScore: 0.00
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
- candidateCoverage: covered=8, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 adapter_registration (ruled_out): No registration, path, or tool-name mismatch found in inspected runtime bindings.; evidence=.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:680, .claude/settings.json:220, .devin/hooks.v1.json:155, .opencode/plugins/classifier-injection-screen.js:70
- iteration 1 payload_shape (ruled_out): No unsupported or cross-wired payload shape found in the inspected paths.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:27, .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:45, .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs:60, .hermes/plugins/repo-guards/__init__.py:379
- iteration 1 session_isolation (ruled_out): No cross-session or duplicate-delivery defect found; tests were not executed.; evidence=.opencode/plugins/classifier-injection-screen.js:36, .opencode/plugins/classifier-injection-screen.js:56, .opencode/plugins/classifier-injection-screen.js:82, .opencode/plugins/tests/classifier-injection-screen.test.cjs:74, .opencode/plugins/tests/classifier-injection-screen.test.cjs:117, .opencode/plugins/tests/classifier-injection-screen.test.cjs:135
- iteration 1 bounded_failure (ruled_out): No partial-result-as-flag or unbounded scheduling path found in inspected code.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:125, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:147, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:202, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:215, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:69, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:88, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:111, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:155
- iteration 2 shell_command_injection (ruled_out): No shell interpolation path was found in this call chain.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:147, .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:455, .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:473
- iteration 2 secret_logging (ruled_out): No credential value or fetched body is written to the adapter’s output/log path.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:153, .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:149, .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:156, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:60
- iteration 2 feature_switch_bypass (ruled_out): No bypass found in the shared adapter path.; evidence=.skilled/hooks/shared/hook-flags.cjs:151, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:46, .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:181

### Clean Search Proof
- iteration 1 adapter_registration (ruled_out): No registration, path, or tool-name mismatch found in inspected runtime bindings.; evidence=.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:680, .claude/settings.json:220, .devin/hooks.v1.json:155, .opencode/plugins/classifier-injection-screen.js:70
- iteration 1 payload_shape (ruled_out): No unsupported or cross-wired payload shape found in the inspected paths.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:27, .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:45, .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs:60, .hermes/plugins/repo-guards/__init__.py:379
- iteration 1 session_isolation (ruled_out): No cross-session or duplicate-delivery defect found; tests were not executed.; evidence=.opencode/plugins/classifier-injection-screen.js:36, .opencode/plugins/classifier-injection-screen.js:56, .opencode/plugins/classifier-injection-screen.js:82, .opencode/plugins/tests/classifier-injection-screen.test.cjs:74, .opencode/plugins/tests/classifier-injection-screen.test.cjs:117, .opencode/plugins/tests/classifier-injection-screen.test.cjs:135
- iteration 1 bounded_failure (ruled_out): No partial-result-as-flag or unbounded scheduling path found in inspected code.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:125, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:147, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:202, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:215, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:69, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:88, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:111, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:155
- iteration 2 shell_command_injection (ruled_out): No shell interpolation path was found in this call chain.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:147, .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:455, .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:473
- iteration 2 secret_logging (ruled_out): No credential value or fetched body is written to the adapter’s output/log path.; evidence=.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:153, .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:149, .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:156, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:60
- iteration 2 feature_switch_bypass (ruled_out): No bypass found in the shared adapter path.; evidence=.skilled/hooks/shared/hook-flags.cjs:151, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:46, .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:181

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
