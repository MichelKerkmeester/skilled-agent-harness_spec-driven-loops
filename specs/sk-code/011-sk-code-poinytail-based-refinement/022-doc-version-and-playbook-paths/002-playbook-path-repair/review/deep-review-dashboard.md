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
- Review Target: The playbook path repair commits 41302e72be..HEAD on branch worktrees/118-playbook-paths: the validator change (symlink and .skilled/release/ rules plus tests) and the backticked path corrections across 223 manual-testing-playbook files (files)
- Started: 2026-10-12T06:18:50.635Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-10-12T06:18:50.635Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/2 | complete |
| 2 | correctness | correctness | 0.25 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.20 | 0/0/1 | complete |
| 4 | security | security | 0.17 | 0/0/1 | complete |
| 5 | maintainability | maintainability | 0.14 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
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
- graphConvergenceScore: 0.79
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":8,"description":"Dimension coverage (60%) is below threshold (80%). 8 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.20 -> 0.17 -> 0.14
- convergenceScore: 0.86
- openFindings: 7
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=8, ruledOut=15, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 test_weakening (ruled_out): both tests fail without their rule by construction; release test also pins the prefix boundary; evidence=validate-playbook-package.test.cjs:158, validate-playbook-package.test.cjs:163
- iteration 1 output_truncation (ruled_out): pinned property (large single write intact through a pipe) is preserved; discovery was never the property; evidence=validate-playbook-package.test.cjs:292, validate-playbook-package.cjs:893
- iteration 2 path_intent_mismatch (ruled_out): identity verified per substitution class; no wrong-target rewrite found; evidence=cli-claude-code/manual-testing-playbook/stress/auth-failure.md:29, cli-codex/manual-testing-playbook/agent-routing/multi-ai-council-profile.md:81
- iteration 2 row_loss (ruled_out): the removed row had no correct target to be repaired to; residual line-25 staleness is pre-existing and named in the narrative; evidence=cli-devin/manual-testing-playbook/rules/rules-list-and-paths.md:82
- iteration 2 rename_breakage (ruled_out): every renamed target resolves to the same scenario identity; evidence=specs/cli-external-orchestration/z_archive/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:55
- iteration 3 spec_criterion_unmet (ruled_out): verified by package-level name mapping and commit trailers; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/spec.md:121, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/spec.md:149
- iteration 3 path_intent_mismatch (ruled_out): identity verified per substitution class plus word-diff slices; evidence=.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md
- iteration 3 row_loss (ruled_out): successor search empty and residual citations zero; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:59
- iteration 3 cross_doc_inconsistency (ruled_out): mirror and manifest checks clean; evidence=.hermes/skills/sk-doc/SKILL.md
- iteration 3 rename_breakage (ruled_out): direct listing of the feature-catalog tree; evidence=.skilled/skills/cli-orca/manual-testing-playbook/runtime/ambiguous-send-recovery.md:82
- iteration 4 destructive_side_effects (ruled_out): both destructive targets are literal /tmp paths the scenario creates itself, pre-existing and not introduced by the diff; evidence=task-dispatch-guard-live-fire.md:48, task-dispatch-guard-live-fire.md:48
- iteration 4 secret_exposure (ruled_out): no key material present; the credential-store reference is a path, not a value; evidence=auth-status-reports-key-state.md:61
- iteration 4 developer_absolute_path (ruled_out): zero added personal paths; evergreenChecks keeps failing DEVELOPER_ABSOLUTE_PATH on any that appear; evidence=validate-playbook-package.cjs:428
- iteration 4 skip_false_negative (ruled_out): no new security angle beyond open R1-P2-001; skip is confined to one namespace that holds only a .gitignore in the source tree; evidence=validate-playbook-package.cjs:381, .skilled/release/.gitignore:1
- iteration 4 unset_variable_expansion (ruled_out): all introduced variables are defined before use in the same scenario; no destructive command expands an unset variable; evidence=git-preflight-advisory.md:89, doctor-update-compat.md:49, unquoted-colon-frontmatter-regression.md:63, context-profile.md:48
- iteration 5 version_drift (ruled_out): six version surfaces consistent; all three installed checks green; evidence=.skilled/skills/sk-doc/SKILL.md:5, .skilled/skills/sk-doc/ROUTER.md:11, .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1
- iteration 5 stale_doc_contradiction (ruled_out): no new contradiction introduced; carried R1/R2/R3 P2s remain the tracked packet-text residue; evidence=.skilled/skills/sk-doc/changelog/v2.3.7.0.md:14, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:381
- iteration 5 comment_hygiene_violation (ruled_out): comments durable and id-free; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:378-380, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:392-393

### Clean Search Proof
- iteration 1 test_weakening (ruled_out): both tests fail without their rule by construction; release test also pins the prefix boundary; evidence=validate-playbook-package.test.cjs:158, validate-playbook-package.test.cjs:163
- iteration 1 output_truncation (ruled_out): pinned property (large single write intact through a pipe) is preserved; discovery was never the property; evidence=validate-playbook-package.test.cjs:292, validate-playbook-package.cjs:893
- iteration 2 path_intent_mismatch (ruled_out): identity verified per substitution class; no wrong-target rewrite found; evidence=cli-claude-code/manual-testing-playbook/stress/auth-failure.md:29, cli-codex/manual-testing-playbook/agent-routing/multi-ai-council-profile.md:81
- iteration 2 row_loss (ruled_out): the removed row had no correct target to be repaired to; residual line-25 staleness is pre-existing and named in the narrative; evidence=cli-devin/manual-testing-playbook/rules/rules-list-and-paths.md:82
- iteration 2 rename_breakage (ruled_out): every renamed target resolves to the same scenario identity; evidence=specs/cli-external-orchestration/z_archive/030-cli-cursor-creation/009-cursor-hooks-lifecycle/003-cursor-hooks-claude-parity/implementation-summary.md:55
- iteration 3 spec_criterion_unmet (ruled_out): verified by package-level name mapping and commit trailers; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/spec.md:121, specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/spec.md:149
- iteration 3 path_intent_mismatch (ruled_out): identity verified per substitution class plus word-diff slices; evidence=.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/stack-standards-routing.md
- iteration 3 row_loss (ruled_out): successor search empty and residual citations zero; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:59
- iteration 3 cross_doc_inconsistency (ruled_out): mirror and manifest checks clean; evidence=.hermes/skills/sk-doc/SKILL.md
- iteration 3 rename_breakage (ruled_out): direct listing of the feature-catalog tree; evidence=.skilled/skills/cli-orca/manual-testing-playbook/runtime/ambiguous-send-recovery.md:82
- iteration 4 destructive_side_effects (ruled_out): both destructive targets are literal /tmp paths the scenario creates itself, pre-existing and not introduced by the diff; evidence=task-dispatch-guard-live-fire.md:48, task-dispatch-guard-live-fire.md:48
- iteration 4 secret_exposure (ruled_out): no key material present; the credential-store reference is a path, not a value; evidence=auth-status-reports-key-state.md:61
- iteration 4 developer_absolute_path (ruled_out): zero added personal paths; evergreenChecks keeps failing DEVELOPER_ABSOLUTE_PATH on any that appear; evidence=validate-playbook-package.cjs:428
- iteration 4 skip_false_negative (ruled_out): no new security angle beyond open R1-P2-001; skip is confined to one namespace that holds only a .gitignore in the source tree; evidence=validate-playbook-package.cjs:381, .skilled/release/.gitignore:1
- iteration 4 unset_variable_expansion (ruled_out): all introduced variables are defined before use in the same scenario; no destructive command expands an unset variable; evidence=git-preflight-advisory.md:89, doctor-update-compat.md:49, unquoted-colon-frontmatter-regression.md:63, context-profile.md:48
- iteration 5 version_drift (ruled_out): six version surfaces consistent; all three installed checks green; evidence=.skilled/skills/sk-doc/SKILL.md:5, .skilled/skills/sk-doc/ROUTER.md:11, .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1
- iteration 5 stale_doc_contradiction (ruled_out): no new contradiction introduced; carried R1/R2/R3 P2s remain the tracked packet-text residue; evidence=.skilled/skills/sk-doc/changelog/v2.3.7.0.md:14, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:381
- iteration 5 comment_hygiene_violation (ruled_out): comments durable and id-free; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:378-380, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:392-393

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
