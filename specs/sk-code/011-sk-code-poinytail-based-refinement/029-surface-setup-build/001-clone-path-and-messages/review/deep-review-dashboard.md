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
- Review Target: commits 17e465512a, dae07e6286 and d6c30ebdf5 on branch worktrees/133-surface-setup-build (diff a98004816d..d6c30ebdf5): the README sk-code adapting block gains the provision command and skilled.trustRepoHooks under Before you start, the feature catalog in removal step 6, regenerate-skill-derived.cjs in removal step 7, and the surface-count files and leaf-scopes.json in add step 3; compiled-route-guard.cjs prints the refresh command and both manifest paths per stale hub through a shared manifestPair derivation and an exported staleFix; root-router-contract.cjs relabels an unresolvable @spec-kit/shared as SHARED_NOT_BUILT naming the provision command, and ci-skill-root-metadata.cjs prints it with no stack; four tests pin the two code changes (files)
- Started: 2026-10-13T19:08:04.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T19:08:04.000Z
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
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

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
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
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
- candidateCoverage: covered=21, ruledOut=19, deferred=2, blocked=1

### Search Debt
- iteration 2 doc_named_command_blast_radius (deferred): the two scripts are unchanged and outside the review scope; a follow-up outside this security pass; evidence=README.md:1451
- iteration 3 edge_case_unmapped (deferred): no new finding filed; R1-P2-001 stays the single advisory until its downgrade trigger is run; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/spec.md:184, .skilled/bin/compiled-route-guard.cjs:192, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 3 checklist_evidence_gap (blocked): ledger file not in review scope files; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/goal.md:64

### Ruled-Out Candidates
- iteration 1 message_path_accuracy (ruled_out): the line matches spec R2 and is pinned by T1/T2 in compiled-route-manifest.test.cjs; evidence=.skilled/bin/compiled-route-guard.cjs:99, .skilled/bin/compiled-route-guard.cjs:103, .skilled/bin/compiled-route-guard.cjs:145, .skilled/bin/compiled-route-guard.cjs:195
- iteration 1 doc_artifact_existence (ruled_out): every named artifact resolves to a live script, config key or committed file; sk-code's own catalog/leaf-scopes file existence is a stated coverage limit; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs:11, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:69, .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2717, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-phrase-lint-bypass.md:67
- iteration 1 test_fidelity (ruled_out): four tests exist and target the changed lines; the before-fails half is the phase ledger's job and was not executed in this read-only review; evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:628, .skilled/bin/tests/compiled-route-manifest.test.cjs:642, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 2 command_injection_printed_fix (ruled_out): static HUBS literal plus REPO_ROOT-joined paths; no process-execution primitives in the file; evidence=.skilled/bin/compiled-route-guard.cjs:44, .skilled/bin/compiled-route-guard.cjs:99, .skilled/bin/compiled-route-guard.cjs:99
- iteration 2 trust_gate_privilege (ruled_out): untrusted clone skips without blocking; git -c and GIT_CONFIG_* do not grant trust; the hook prints the same instruction; evidence=README.md:1452, .skilled/scripts/git-hooks/pre-commit:44, .skilled/scripts/install-git-hooks.sh:188, .skilled/scripts/git-hooks/tests/pre-commit.test.sh:800
- iteration 2 info_disclosure_error_path (ruled_out): literal-only message; exact-match condition pinned by the unrelated-module test; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:80, .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:63
- iteration 2 test_harness_injection (ruled_out): argv-array spawn plus JSON.stringify quoting; scoped rmSync; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 2 secret_exposure (ruled_out): no process.env usage; error strings carry only source literals; evidence=.skilled/bin/compiled-route-guard.cjs:33
- iteration 3 requirement_without_change (ruled_out): complete requirement-to-line map over the six-file diff; no requirement is unimplemented; evidence=README.md:1451, README.md:1463, .skilled/bin/compiled-route-guard.cjs:104, .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83
- iteration 3 change_without_requirement (ruled_out): spec table and diff file sets are identical (6/6); evidence=.skilled/bin/compiled-route-guard.cjs:65, README.md:1472, .skilled/bin/tests/compiled-route-manifest.test.cjs:623
- iteration 3 doc_claim_drift (ruled_out): every named artifact resolves to a live script, config key or committed file; evidence=README.md:1451, README.md:1452, README.md:1463, README.md:1464, README.md:1472
- iteration 3 requirement_without_change (ruled_out): no decision is contradicted by the diff; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/goal.md:44, README.md:1452, .skilled/bin/compiled-route-guard.cjs:104
- iteration 4 duplication (ruled_out): single literal per command in code; no drift pair exists; evidence=.skilled/bin/compiled-route-guard.cjs:103, .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83, .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64, .skilled/bin/compiled-route-guard.cjs:103
- iteration 4 dead_code (ruled_out): call graph closed over the full guard file and the new tests; evidence=.skilled/bin/compiled-route-guard.cjs:65, .skilled/bin/compiled-route-guard.cjs:100, .skilled/bin/compiled-route-guard.cjs:145, .skilled/bin/tests/compiled-route-manifest.test.cjs:623
- iteration 4 export_surface (ruled_out): surface change is additive and consistent; evidence=.skilled/bin/compiled-route-guard.cjs:219
- iteration 4 message_consistency (ruled_out): no drift; deliberate single-vs-double write phrasing; evidence=.skilled/bin/compiled-route-guard.cjs:92, .skilled/bin/compiled-route-guard.cjs:103, README.md:1451, README.md:1463
- iteration 4 error_handling_consistency (ruled_out): verified by direct read plus the T4 fixture; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:79, .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 4 test_maintainability (ruled_out): no flake or leak vector found; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718, .skilled/bin/tests/compiled-route-manifest.test.cjs:623
- iteration 4 comment_drift (ruled_out): no ephemeral labels and no restatement found; evidence=.skilled/bin/compiled-route-guard.cjs:96, .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:67
- iteration 5 null_propagation (ruled_out): layout resolution fails closed to a legacy path instead of throwing; evidence=.skilled/bin/lib/compiled-route-layout.cjs:139, .skilled/bin/compiled-route-guard.cjs:54

### Clean Search Proof
- iteration 1 message_path_accuracy (ruled_out): the line matches spec R2 and is pinned by T1/T2 in compiled-route-manifest.test.cjs; evidence=.skilled/bin/compiled-route-guard.cjs:99, .skilled/bin/compiled-route-guard.cjs:103, .skilled/bin/compiled-route-guard.cjs:145, .skilled/bin/compiled-route-guard.cjs:195
- iteration 1 doc_artifact_existence (ruled_out): every named artifact resolves to a live script, config key or committed file; sk-code's own catalog/leaf-scopes file existence is a stated coverage limit; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs:11, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:69, .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2717, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-phrase-lint-bypass.md:67
- iteration 1 test_fidelity (ruled_out): four tests exist and target the changed lines; the before-fails half is the phase ledger's job and was not executed in this read-only review; evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:628, .skilled/bin/tests/compiled-route-manifest.test.cjs:642, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 2 command_injection_printed_fix (ruled_out): static HUBS literal plus REPO_ROOT-joined paths; no process-execution primitives in the file; evidence=.skilled/bin/compiled-route-guard.cjs:44, .skilled/bin/compiled-route-guard.cjs:99, .skilled/bin/compiled-route-guard.cjs:99
- iteration 2 trust_gate_privilege (ruled_out): untrusted clone skips without blocking; git -c and GIT_CONFIG_* do not grant trust; the hook prints the same instruction; evidence=README.md:1452, .skilled/scripts/git-hooks/pre-commit:44, .skilled/scripts/install-git-hooks.sh:188, .skilled/scripts/git-hooks/tests/pre-commit.test.sh:800
- iteration 2 info_disclosure_error_path (ruled_out): literal-only message; exact-match condition pinned by the unrelated-module test; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:80, .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:63
- iteration 2 test_harness_injection (ruled_out): argv-array spawn plus JSON.stringify quoting; scoped rmSync; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 2 secret_exposure (ruled_out): no process.env usage; error strings carry only source literals; evidence=.skilled/bin/compiled-route-guard.cjs:33
- iteration 3 requirement_without_change (ruled_out): complete requirement-to-line map over the six-file diff; no requirement is unimplemented; evidence=README.md:1451, README.md:1463, .skilled/bin/compiled-route-guard.cjs:104, .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83
- iteration 3 change_without_requirement (ruled_out): spec table and diff file sets are identical (6/6); evidence=.skilled/bin/compiled-route-guard.cjs:65, README.md:1472, .skilled/bin/tests/compiled-route-manifest.test.cjs:623
- iteration 3 doc_claim_drift (ruled_out): every named artifact resolves to a live script, config key or committed file; evidence=README.md:1451, README.md:1452, README.md:1463, README.md:1464, README.md:1472
- iteration 3 requirement_without_change (ruled_out): no decision is contradicted by the diff; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages/goal.md:44, README.md:1452, .skilled/bin/compiled-route-guard.cjs:104
- iteration 4 duplication (ruled_out): single literal per command in code; no drift pair exists; evidence=.skilled/bin/compiled-route-guard.cjs:103, .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:83, .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64, .skilled/bin/compiled-route-guard.cjs:103
- iteration 4 dead_code (ruled_out): call graph closed over the full guard file and the new tests; evidence=.skilled/bin/compiled-route-guard.cjs:65, .skilled/bin/compiled-route-guard.cjs:100, .skilled/bin/compiled-route-guard.cjs:145, .skilled/bin/tests/compiled-route-manifest.test.cjs:623
- iteration 4 export_surface (ruled_out): surface change is additive and consistent; evidence=.skilled/bin/compiled-route-guard.cjs:219
- iteration 4 message_consistency (ruled_out): no drift; deliberate single-vs-double write phrasing; evidence=.skilled/bin/compiled-route-guard.cjs:92, .skilled/bin/compiled-route-guard.cjs:103, README.md:1451, README.md:1463
- iteration 4 error_handling_consistency (ruled_out): verified by direct read plus the T4 fixture; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:79, .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:64, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718
- iteration 4 test_maintainability (ruled_out): no flake or leak vector found; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718, .skilled/bin/tests/compiled-route-manifest.test.cjs:623
- iteration 4 comment_drift (ruled_out): no ephemeral labels and no restatement found; evidence=.skilled/bin/compiled-route-guard.cjs:96, .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:67
- iteration 5 null_propagation (ruled_out): layout resolution fails closed to a legacy path instead of throwing; evidence=.skilled/bin/lib/compiled-route-layout.cjs:139, .skilled/bin/compiled-route-guard.cjs:54

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
