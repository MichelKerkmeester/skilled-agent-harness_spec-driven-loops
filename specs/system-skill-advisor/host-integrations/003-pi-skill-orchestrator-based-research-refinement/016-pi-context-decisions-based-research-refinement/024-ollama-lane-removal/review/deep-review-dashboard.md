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
- Review Target: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal (spec-folder)
- Started: 2026-11-21T12:42:00.804Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-21T12:42:00Z
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
| P2 (Suggestions) | 10 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.50 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 0.14 | 0/0/1 | complete |
| 5 | correctness (second pass) plus skill_agent and agent_cross_runtime overlays | correctness | 0.00 | 0/0/0 | complete |
| 6 | security (second pass) | security | 0.00 | 0/0/0 | complete |
| 7 | traceability (feature_catalog_code, playbook_capability overlays) | traceability | 0.13 | 0/0/1 | complete |
| 8 | maintainability (second pass): removal leftovers in advisor runtime, launcher, env tables, test guards; core protocol rows | maintainability | 0.00 | 0/0/0 | complete |
| 9 | correctness (third pass): M7 dotenv path, LANE_ENV_KEYS live readers | correctness | 0.11 | 0/0/1 | complete |
| 10 | traceability (checklist_evidence close-out): AC tables, CHK evidence, parent reconciliation | traceability | 0.10 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 0 |
| traceability | covered | 1 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.11 -> 0.10
- convergenceScore: 0.90
- openFindings: 10
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
- candidateCoverage: covered=8, ruledOut=28, deferred=1, blocked=0

### Search Debt
- iteration 4 fixture_realism (deferred): carry to next iteration; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:175

### Ruled-Out Candidates
- iteration 1 exit_code (ruled_out): verified by direct read and live run; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1576, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:2183
- iteration 1 path_containment (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1635
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:304, .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:404
- iteration 2 symlink_redirect (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1635, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1934
- iteration 2 wrong_process_signal (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1716, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1881
- iteration 2 secret_exposure (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1469, .skilled/hooks/env-secret-guard/cli/env-secret.cjs:32
- iteration 2 unconfirmed_shared_delete (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1958, .skilled/commands/doctor/assets/doctor-update-apply.yaml:222
- iteration 2 ci_privilege (ruled_out): verified by direct read; evidence=.github/workflows/advisory-checks.yml:30, .github/workflows/advisory-checks.yml:138
- iteration 3 playbook_gap (ruled_out): verified by direct read; evidence=.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md:54
- iteration 3 ac_regression (ruled_out): later phases changed those surfaces intentionally; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/acceptance-criteria.md:56
- iteration 4 comment_hygiene (ruled_out): verified by direct read of finding() calls; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1076
- iteration 4 stale_constants (ruled_out): verified by diff and read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:14
- iteration 4 module_structure (ruled_out): size alone is not a defect; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1881
- iteration 5 file_type_assumption (ruled_out): observed live; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1316, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1690
- iteration 5 dangling_reference (ruled_out): search returned no import; evidence=.skilled/skills/system-skill-advisor/runtime/tests/shared-import-specifier-extension.vitest.ts:57
- iteration 5 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:404
- iteration 5 config_compat (ruled_out): verified by direct read and merge-base diff; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:64
- iteration 6 command_injection (ruled_out): argument arrays with no shell; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:428, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1223, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1490
- iteration 6 ssrf_credential_leak (ruled_out): only the origin is used; the operator chooses the host and it is named in the question; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:826, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1789, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1958
- iteration 6 path_traversal (ruled_out): the parent is realpathed and contained; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1650, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1660
- iteration 6 destructive_delete (ruled_out): rmdirSync cannot remove a non-empty folder; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1909
- iteration 6 regression_in_guard (ruled_out): verified by diff; evidence=.skilled/scripts/orphan-mcp-sweeper.sh:461, .gitignore:432
- iteration 6 fail_destructive (ruled_out): documented design for backups of a derived database; next scan rebuilds; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1186, .skilled/commands/doctor/assets/doctor-update-apply.yaml:219
- iteration 8 dead_code (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:87, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:259
- iteration 8 schema_migration (ruled_out): verified by diff and read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:298
- iteration 8 retired_config (ruled_out): verified by search and read; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:285, .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:172
- iteration 9 destructive_rewrite (ruled_out): apply never edits a dotenv file; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1981
- iteration 9 cross_tool_breakage (ruled_out): exact search found only test references; evidence=.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:42
- iteration 10 completion_state_drift (ruled_out): covered by R3-P2-001 and R3-P2-002; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/spec.md:41

### Clean Search Proof
- iteration 1 exit_code (ruled_out): verified by direct read and live run; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1576, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:2183
- iteration 1 path_containment (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1635
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:304, .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:404
- iteration 2 symlink_redirect (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1635, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1934
- iteration 2 wrong_process_signal (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1716, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1881
- iteration 2 secret_exposure (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1469, .skilled/hooks/env-secret-guard/cli/env-secret.cjs:32
- iteration 2 unconfirmed_shared_delete (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1958, .skilled/commands/doctor/assets/doctor-update-apply.yaml:222
- iteration 2 ci_privilege (ruled_out): verified by direct read; evidence=.github/workflows/advisory-checks.yml:30, .github/workflows/advisory-checks.yml:138
- iteration 3 playbook_gap (ruled_out): verified by direct read; evidence=.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md:54
- iteration 3 ac_regression (ruled_out): later phases changed those surfaces intentionally; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/acceptance-criteria.md:56
- iteration 4 comment_hygiene (ruled_out): verified by direct read of finding() calls; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1076
- iteration 4 stale_constants (ruled_out): verified by diff and read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:14
- iteration 4 module_structure (ruled_out): size alone is not a defect; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1881
- iteration 5 file_type_assumption (ruled_out): observed live; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1316, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1690
- iteration 5 dangling_reference (ruled_out): search returned no import; evidence=.skilled/skills/system-skill-advisor/runtime/tests/shared-import-specifier-extension.vitest.ts:57
- iteration 5 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:404
- iteration 5 config_compat (ruled_out): verified by direct read and merge-base diff; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:64
- iteration 6 command_injection (ruled_out): argument arrays with no shell; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:428, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1223, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1490
- iteration 6 ssrf_credential_leak (ruled_out): only the origin is used; the operator chooses the host and it is named in the question; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:826, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1789, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1958
- iteration 6 path_traversal (ruled_out): the parent is realpathed and contained; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1650, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1660
- iteration 6 destructive_delete (ruled_out): rmdirSync cannot remove a non-empty folder; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1909
- iteration 6 regression_in_guard (ruled_out): verified by diff; evidence=.skilled/scripts/orphan-mcp-sweeper.sh:461, .gitignore:432
- iteration 6 fail_destructive (ruled_out): documented design for backups of a derived database; next scan rebuilds; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1186, .skilled/commands/doctor/assets/doctor-update-apply.yaml:219
- iteration 8 dead_code (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:87, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:259
- iteration 8 schema_migration (ruled_out): verified by diff and read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:298
- iteration 8 retired_config (ruled_out): verified by search and read; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:285, .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:172
- iteration 9 destructive_rewrite (ruled_out): apply never edits a dotenv file; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1981
- iteration 9 cross_tool_breakage (ruled_out): exact search found only test references; evidence=.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:42
- iteration 10 completion_state_drift (ruled_out): covered by R3-P2-001 and R3-P2-002; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/spec.md:41

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. This is the final iteration under the cap and all four dimensions are covered. - Focus area: synthesis. Carry 10 active P2 findings, with no P0 or P1. - Reason: max-iterations stop policy reached. - Rotation status: all dimensions complete. Core protocols `spec_code` and `checklist_evidence` both reached pass. - Blocked/productive carry-forward: R3-P2-001 and R3-P2-002 are the packet-state findings an operator closure pass should settle together with R10-P2-001. - Required evidence: none further. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
