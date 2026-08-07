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
- Review Target: Whole-program review: 125-cli-external + 126-mcp-tooling planning packets + cli-opencode GPT-5.6 rename (spec-folder)
- Started: 2026-07-10T03:26:38.055Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-07-10T03:26:38.055Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 7 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 2026-07-10T03:26:38.055Z | correctness | correctness | 0.50 | 0/2/1 | complete |
| 2026-07-10T03:26:38.055Z | security | security | 1.00 | 0/2/0 | complete |
| 2026-07-10T03:26:38.055Z | traceability | traceability | 0.17 | 0/1/0 | complete |
| 2026-07-10T03:26:38.055Z | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 2026-07-10T03:26:38.055Z | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2026-07-10T03:26:38.055Z | security | security | 0.00 | 0/0/0 | complete |
| 2026-07-10T03:26:38.055Z | traceability | traceability | 0.10 | 0/0/1 | complete |
| 2026-07-10T03:26:38.055Z | maintainability | maintainability | 0.25 | 0/1/0 | complete |
| 2026-07-10T03:26:38.055Z | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2026-07-10T03:26:38.055Z | security | security | 0.20 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | covered | 2 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.40
- graphDecision: STOP_BLOCKED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.25 -> 0.00 -> 0.20
- convergenceScore: 0.80
- openFindings: 9
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
- candidateCoverage: covered=13, ruledOut=21, deferred=10, blocked=0

### Search Debt
- iteration 6 authentication-configuration-drift (deferred): Requires execution-scope runtime/configuration validation outside the named files.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:109-113,137-142,160-165, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:118-122
- iteration 7 checklist-evidence (deferred): Execution checklists and completion evidence are outside the named target files.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-72
- iteration 7 feature-catalog-code (deferred): Feature catalog and playbook capability checks are out of scope.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59
- iteration 10 authentication_configuration_drift (deferred): Requires execution-scope authentication and configuration validation.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:109-114,139-143, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-138

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Direct review found the invariant, acceptance criteria, and rollback all require one atomic change.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:102-145, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:181-191
- iteration 1 transport_classification (ruled_out): Direct review found the transport-axis, tool surface, and pairing contract.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/plan.md:128-186
- iteration 2 fail-open-enforcement (ruled_out): Active trigger acceptance criteria are specified at both onboarding and closeout.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:135-140, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:130-137
- iteration 3 scope-boundary-contract (ruled_out): Detailed contract is complete.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:110,130
- iteration 4 phase_ownership (ruled_out): Direct review confirms explicit phase boundaries.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md:101-145, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-153
- iteration 4 identity_transition (ruled_out): No duplicate finding emitted.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:350-366, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-120
- iteration 4 documentation_contract_maintenance (ruled_out): No new independently actionable contradiction.; evidence=.opencode/skills/cli-opencode/SKILL.md:271-311, .opencode/skills/cli-opencode/README.md:63-145, .opencode/skills/cli-opencode/references/cli_reference.md:121-145
- iteration 5 staged_identity_transition (ruled_out): Direct review found an explicit same-commit requirement and verification for the previously identified failure mode.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md:101-145, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-145
- iteration 5 scorer_output_contract (ruled_out): Direct review found the required live validation consumer.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/spec.md:103-165, .opencode/skills/cli-opencode/SKILL.md:271-311
- iteration 5 graph_identity_transition (ruled_out): No new independent transition defect was supported by the scoped documents.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/spec.md:104-161, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-178, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:102-159
- iteration 6 share-publication-consent (ruled_out): Duplicate of active R2-P1-001.; evidence=.opencode/skills/cli-opencode/README.md:78-87, .opencode/skills/cli-opencode/SKILL.md:19-22,354-358, .opencode/skills/cli-opencode/references/cli_reference.md:331-334
- iteration 6 destructive-scope-enforcement (ruled_out): Direct review found explicit mitigation and verification obligations.; evidence=.opencode/skills/cli-opencode/references/destructive_scope_violations.md:85-97,127-164, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:77-110,130-137
- iteration 6 stale-functional-referrer (ruled_out): Direct review found atomic migration and terminal zero-live-hit verification requirements.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-122,146-148,174-179, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-107,127-138,156-161
- iteration 8 phase_ownership (ruled_out): Explicit phase boundaries cover structural moves and integration sweeps.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:103-115, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-115, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md:102-110, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:103-113
- iteration 8 documentation_contract_maintenance (ruled_out): Prior findings cover the existing contract conflicts.; evidence=.opencode/skills/cli-opencode/SKILL.md:271-311, .opencode/skills/cli-opencode/README.md:63-76,123-145, .opencode/skills/cli-opencode/references/cli_reference.md:269-296
- iteration 9 atomic_identity_scorer_transition (ruled_out): Direct review confirms equivalent atomicity requirements across scope, acceptance criteria, and rollback.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-146, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:181-206
- iteration 9 code_mode_registration_stability (ruled_out): Direct review confirms the scope exception is metadata-only and preserves the registration boundary.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:460-465, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:105-121
- iteration 10 session_publication_consent (ruled_out): Duplicate direction already represented in the findings registry.; evidence=.opencode/skills/cli-opencode/README.md:78-87, .opencode/skills/cli-opencode/SKILL.md:19-22,354-365, .opencode/skills/cli-opencode/references/cli_reference.md:331-334
- iteration 10 destructive_scope_enforcement (ruled_out): Direct review found explicit containment and verification obligations.; evidence=.opencode/skills/cli-opencode/references/destructive_scope_violations.md:85-164, .opencode/skills/cli-opencode/SKILL.md:350, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:103-137
- iteration 10 fail_open_enforcement (ruled_out): Direct review found both atomic repoint and terminal active-trigger requirements.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:103-140,153-170, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:103-137

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Direct review found the invariant, acceptance criteria, and rollback all require one atomic change.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:102-145, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:181-191
- iteration 1 transport_classification (ruled_out): Direct review found the transport-axis, tool surface, and pairing contract.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/plan.md:128-186
- iteration 2 fail-open-enforcement (ruled_out): Active trigger acceptance criteria are specified at both onboarding and closeout.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:135-140, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:130-137
- iteration 3 scope-boundary-contract (ruled_out): Detailed contract is complete.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:110,130
- iteration 4 phase_ownership (ruled_out): Direct review confirms explicit phase boundaries.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md:101-145, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-153
- iteration 4 identity_transition (ruled_out): No duplicate finding emitted.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:350-366, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-120
- iteration 4 documentation_contract_maintenance (ruled_out): No new independently actionable contradiction.; evidence=.opencode/skills/cli-opencode/SKILL.md:271-311, .opencode/skills/cli-opencode/README.md:63-145, .opencode/skills/cli-opencode/references/cli_reference.md:121-145
- iteration 5 staged_identity_transition (ruled_out): Direct review found an explicit same-commit requirement and verification for the previously identified failure mode.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md:101-145, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-145
- iteration 5 scorer_output_contract (ruled_out): Direct review found the required live validation consumer.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/spec.md:103-165, .opencode/skills/cli-opencode/SKILL.md:271-311
- iteration 5 graph_identity_transition (ruled_out): No new independent transition defect was supported by the scoped documents.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/spec.md:104-161, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-178, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:102-159
- iteration 6 share-publication-consent (ruled_out): Duplicate of active R2-P1-001.; evidence=.opencode/skills/cli-opencode/README.md:78-87, .opencode/skills/cli-opencode/SKILL.md:19-22,354-358, .opencode/skills/cli-opencode/references/cli_reference.md:331-334
- iteration 6 destructive-scope-enforcement (ruled_out): Direct review found explicit mitigation and verification obligations.; evidence=.opencode/skills/cli-opencode/references/destructive_scope_violations.md:85-97,127-164, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:77-110,130-137
- iteration 6 stale-functional-referrer (ruled_out): Direct review found atomic migration and terminal zero-live-hit verification requirements.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-122,146-148,174-179, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-107,127-138,156-161
- iteration 8 phase_ownership (ruled_out): Explicit phase boundaries cover structural moves and integration sweeps.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:103-115, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-115, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md:102-110, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:103-113
- iteration 8 documentation_contract_maintenance (ruled_out): Prior findings cover the existing contract conflicts.; evidence=.opencode/skills/cli-opencode/SKILL.md:271-311, .opencode/skills/cli-opencode/README.md:63-76,123-145, .opencode/skills/cli-opencode/references/cli_reference.md:269-296
- iteration 9 atomic_identity_scorer_transition (ruled_out): Direct review confirms equivalent atomicity requirements across scope, acceptance criteria, and rollback.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-146, .opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:181-206
- iteration 9 code_mode_registration_stability (ruled_out): Direct review confirms the scope exception is metadata-only and preserves the registration boundary.; evidence=.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:460-465, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:105-121
- iteration 10 session_publication_consent (ruled_out): Duplicate direction already represented in the findings registry.; evidence=.opencode/skills/cli-opencode/README.md:78-87, .opencode/skills/cli-opencode/SKILL.md:19-22,354-365, .opencode/skills/cli-opencode/references/cli_reference.md:331-334
- iteration 10 destructive_scope_enforcement (ruled_out): Direct review found explicit containment and verification obligations.; evidence=.opencode/skills/cli-opencode/references/destructive_scope_violations.md:85-164, .opencode/skills/cli-opencode/SKILL.md:350, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:103-137
- iteration 10 fail_open_enforcement (ruled_out): Direct review found both atomic repoint and terminal active-trigger requirements.; evidence=.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:103-140,153-170, .opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:103-137

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 7 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
