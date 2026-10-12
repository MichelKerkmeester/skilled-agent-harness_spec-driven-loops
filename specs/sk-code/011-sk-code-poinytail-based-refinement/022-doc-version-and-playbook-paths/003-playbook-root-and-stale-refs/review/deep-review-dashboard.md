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
- Review Target: The playbook root and stale reference commits b4d4e90192..HEAD on branch worktrees/121-playbook-root-refs: the validator's root-file backticked path check and its test, the sk-doc 2.3.9.0 release, the path corrections in 13 root manual-testing-playbook files, six stale reference fixes, and the phase's spec docs (files)
- Started: 2026-10-12T10:01:23.529Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-12T10:01:23.529Z
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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 4 | security | security | 1.00 | 0/0/1 | complete |
| 5 | maintainability | maintainability | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
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
- graphConvergenceScore: 0.87
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":64,"description":"Dimension coverage (75%) is below threshold (80%). 64 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}, {"count":4,"description":"4 contradiction(s) are lowering finding stability below threshold","severity":"blocking","type":"unstable_findings"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 5
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
- candidateCoverage: covered=14, ruledOut=22, deferred=1, blocked=0

### Search Debt
- iteration 3 proof_command_drift (deferred): re-running the revert would modify the frozen review target; read-only iteration constraint; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/review/iterations/iteration-001.md:53

### Ruled-Out Candidates
- iteration 1 base_resolution (ruled_out): duplicate base inert; no wrong-base case found in code or run output; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:408, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757, .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361
- iteration 1 duplicate_reporting (ruled_out): verified by direct read and observed run; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:744, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757
- iteration 1 exit_code_side_effect (ruled_out): warnings excluded from status and exit computation; exit 0 observed; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:797, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:835, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:899, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:899
- iteration 1 test_effectiveness (ruled_out): parent call-site grep plus exclusion filter is decisive; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:744, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164
- iteration 1 version_consistency (ruled_out): zero stale version refs found; evidence=.skilled/skills/sk-doc/description.json, .skilled/skills/sk-doc/SKILL.md
- iteration 1 residual_warning_policy (ruled_out): documented RM-1 plus scenario pass/fail text; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:106, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57
- iteration 2 path_subject_mismatch (ruled_out): all rewritten targets exist and sampled subjects match the citing text; evidence=git diff b4d4e90192..HEAD, .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog, .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md
- iteration 2 stale_reference_successor (ruled_out): same subject established from old file content, parent-tree check and successor read; evidence=git:7a987e8827, git:b4d4e90192, .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts:25
- iteration 2 stale_reference_successor (ruled_out): deletion commit and schema keys prove the subject is gone; evidence=git:3095cadc0f, git:3095cadc0f^:schemas/tool-input-schemas.ts, .skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts
- iteration 2 stale_reference_successor (ruled_out): empty test-file history plus surviving scenario IDs; evidence=git log --all -- '*manual_namespace.test.js', git:b052f329a7, .skilled/skills/mcp-code-mode/manual-testing-playbook/manual-namespace-contract/list-tools-dot-vs-underscore.md
- iteration 2 unledgered_edit (ruled_out): line-by-line mapping plus count probes all match; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:223, .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:826, .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md:19
- iteration 2 playbook_scenario_mismatch (ruled_out): scenario and SKILL.md agree with the rewritten summary; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md:19, .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:159
- iteration 3 ledger_row_without_change (ruled_out): file-level mapping complete; iteration 2's hunk-level mapping carries; evidence=git diff --name-only b4d4e90192..HEAD
- iteration 3 proof_command_drift (ruled_out): package and SR proof outputs reproduce the ledger claims; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361, .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md:19
- iteration 3 false_green_criterion (ruled_out): no false-green criterion among the child goal criteria; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57
- iteration 3 count_drift (ruled_out): no criterion defect; pending closure explains the sole mismatch; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:81
- iteration 3 rm_row_unjustified (ruled_out): the row's narrowest-change reasoning holds; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md:117
- iteration 3 unledgered_change (ruled_out): all changes are ledgered or declared; evidence=git diff --name-only b4d4e90192..HEAD
- iteration 4 path_resolution_escape (ruled_out): pre-existing documented report-only semantics; the root call adds no new capability; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:416, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:418, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:396, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757
- iteration 4 destructive_or_privileged_command_drift (ruled_out): observed command surface is non-destructive and repo-local; evidence=git diff b4d4e90192..HEAD, .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md:49
- iteration 4 credential_or_personal_path_leak (ruled_out): observed clean on the full diff; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/tasks.md:142, git diff b4d4e90192..HEAD
- iteration 5 version_consistency (ruled_out): all five files, the changelog, the mirror and both manifests agree; the bump check is green over the whole range; evidence=.skilled/skills/sk-doc/SKILL.md:5, .skilled/skills/sk-doc/changelog/v2.3.9.0.md:10, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs
- iteration 5 comment_convention (ruled_out): the edited comment keeps the durable WHY only; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371
- iteration 5 stale_changelog_claim (ruled_out): every changelog claim maps to the shipped change; the new case exits 0 while warning; evidence=.skilled/skills/sk-doc/changelog/v2.3.9.0.md:15, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371

### Clean Search Proof
- iteration 1 base_resolution (ruled_out): duplicate base inert; no wrong-base case found in code or run output; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:408, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757, .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361
- iteration 1 duplicate_reporting (ruled_out): verified by direct read and observed run; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:744, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757
- iteration 1 exit_code_side_effect (ruled_out): warnings excluded from status and exit computation; exit 0 observed; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:797, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:835, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:899, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:899
- iteration 1 test_effectiveness (ruled_out): parent call-site grep plus exclusion filter is decisive; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:744, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164
- iteration 1 version_consistency (ruled_out): zero stale version refs found; evidence=.skilled/skills/sk-doc/description.json, .skilled/skills/sk-doc/SKILL.md
- iteration 1 residual_warning_policy (ruled_out): documented RM-1 plus scenario pass/fail text; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:106, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57
- iteration 2 path_subject_mismatch (ruled_out): all rewritten targets exist and sampled subjects match the citing text; evidence=git diff b4d4e90192..HEAD, .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog, .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md
- iteration 2 stale_reference_successor (ruled_out): same subject established from old file content, parent-tree check and successor read; evidence=git:7a987e8827, git:b4d4e90192, .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts:25
- iteration 2 stale_reference_successor (ruled_out): deletion commit and schema keys prove the subject is gone; evidence=git:3095cadc0f, git:3095cadc0f^:schemas/tool-input-schemas.ts, .skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts
- iteration 2 stale_reference_successor (ruled_out): empty test-file history plus surviving scenario IDs; evidence=git log --all -- '*manual_namespace.test.js', git:b052f329a7, .skilled/skills/mcp-code-mode/manual-testing-playbook/manual-namespace-contract/list-tools-dot-vs-underscore.md
- iteration 2 unledgered_edit (ruled_out): line-by-line mapping plus count probes all match; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:223, .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:826, .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md:19
- iteration 2 playbook_scenario_mismatch (ruled_out): scenario and SKILL.md agree with the rewritten summary; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md:19, .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:159
- iteration 3 ledger_row_without_change (ruled_out): file-level mapping complete; iteration 2's hunk-level mapping carries; evidence=git diff --name-only b4d4e90192..HEAD
- iteration 3 proof_command_drift (ruled_out): package and SR proof outputs reproduce the ledger claims; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361, .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-test-environment.md:19
- iteration 3 false_green_criterion (ruled_out): no false-green criterion among the child goal criteria; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57
- iteration 3 count_drift (ruled_out): no criterion defect; pending closure explains the sole mismatch; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:81
- iteration 3 rm_row_unjustified (ruled_out): the row's narrowest-change reasoning holds; evidence=.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md:117
- iteration 3 unledgered_change (ruled_out): all changes are ledgered or declared; evidence=git diff --name-only b4d4e90192..HEAD
- iteration 4 path_resolution_escape (ruled_out): pre-existing documented report-only semantics; the root call adds no new capability; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:416, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:418, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:396, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757
- iteration 4 destructive_or_privileged_command_drift (ruled_out): observed command surface is non-destructive and repo-local; evidence=git diff b4d4e90192..HEAD, .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md:49
- iteration 4 credential_or_personal_path_leak (ruled_out): observed clean on the full diff; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/tasks.md:142, git diff b4d4e90192..HEAD
- iteration 5 version_consistency (ruled_out): all five files, the changelog, the mirror and both manifests agree; the bump check is green over the whole range; evidence=.skilled/skills/sk-doc/SKILL.md:5, .skilled/skills/sk-doc/changelog/v2.3.9.0.md:10, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs
- iteration 5 comment_convention (ruled_out): the edited comment keeps the durable WHY only; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371
- iteration 5 stale_changelog_claim (ruled_out): every changelog claim maps to the shipped change; the new case exits 0 while warning; evidence=.skilled/skills/sk-doc/changelog/v2.3.9.0.md:15, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
