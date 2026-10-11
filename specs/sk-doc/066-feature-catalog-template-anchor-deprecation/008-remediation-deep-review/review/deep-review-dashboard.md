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
- Review Target: Git commit range main..HEAD on branch worktrees/096-feature-catalog-anchor-deprecation: the 8 T4 commits e6b0297bcf, 45cb464be8, caafc08377, 99c133fd5a, 837c8e1629, cc1e6baba1, ccf25fdd56, c2fcd2d1e3. Before reviewing, read .skilled/agents/deep-review.md (your agent definition) and follow it as your persona. Inspect with: git log --oneline main..HEAD ; git show --stat <sha> ; git diff main..HEAD -- <path>. What the commits did: (1) stop the sk-create-feature-catalog mode stamping the <!-- sk-doc-template: skill_asset_feature_catalog --> comment and remove it from 548 catalog docs; (2) remove 97 leftover sk-doc-template comments from other skill docs; (3) add the version key to 217 changelog entries; (4) fix skill package findings on six units; (5) rename three sk-code-opencode scripts from snake_case to kebab-case (router_replay_lib.cjs, verify_doc_claims.cjs, verify_router_sync.cjs and their tests); (6) repair feature catalog validator findings 761 to 15; (7) version bumps with new changelog entries. Phase docs: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/00[1-7]-*/ (spec.md, tasks.md, implementation-summary.md, acceptance-criteria.md, scratch/*.py bulk scripts). Check: correctness of each bulk script, broken references to the old snake_case script names anywhere in the repo (tests, hooks, docs, workflows, drift-guard runner) via git grep, accidental content loss in bulk edits (a removed line that was not the marker or its blank line), version and changelog hygiene (SKILL.md version vs newest changelog file, duplicate or skipped versions), prevent-overengineering per .skilled/repo-rules/prevent-overengineering.md, and whether each phase matches its claims. Known environment gap, NOT a defect: sk-vision vision-runtime/dist is not built in this worktree, so 3 catalog validator fails on .opencode/plugins/sk-vision.js are expected. Sample with intent: the diff is about 1159 files; read each bulk script, the riskiest renames, and random docs per kind rather than everything. (files)
- Started: 2026-10-10T21:18:27.610Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: r4-t4-review-2026-10-10T21-18Z
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
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.60 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 0.17 | 0/0/1 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 0.60 -> 0.17 -> 0.00
- convergenceScore: 1.00
- openFindings: 6
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
- candidateCoverage: covered=6, ruledOut=22, deferred=0, blocked=1

### Search Debt
- iteration 3 environment_blocked_rerun (blocked): iteration constraints forbid repo-wide tooling; receipts remain unverified this pass; evidence=UNKNOWN

### Ruled-Out Candidates
- iteration 1 content_loss (ruled_out): mechanically verified with zero exceptions; evidence=remove_template_anchor.py:81-91, git:45cb464be8, git:45cb464be8
- iteration 1 content_loss (ruled_out): diff decomposed line-by-line; evidence=remove_leftover_template_comments.py:57-71, git:99c133fd5a
- iteration 1 broken_reference (ruled_out): repo-wide grep plus direct reads; evidence=git:HEAD, run-all-drift-guards.sh:30, leaf-manifest.json:55, verify-router-sync.cjs:9
- iteration 1 version_metadata_drift (ruled_out): exhaustive scan, zero exceptions; evidence=git:HEAD tree
- iteration 1 claim_count_mismatch (ruled_out): exact counts verified; evidence=git:main..HEAD, git:ccf25fdd56, git:99c133fd5a, git:ccf25fdd56
- iteration 1 script_logic (ruled_out): read and sample verified; evidence=sync_leaf_frontmatter.py:111-139, normalize_validation_types.py:93-135, add_changelog_version_keys.py:118-157, git:45cb464be8, git:ccf25fdd56
- iteration 2 command_injection (ruled_out): list-argv spawn and fully quoted shell; evidence=.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:68, .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:53, .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:30
- iteration 2 path_traversal (ruled_out): hub-gated resolution plus read-only behavior; evidence=.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:74, .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:114, .skilled/skills/sk-code/sk-code-opencode/assets/scripts/router-replay-lib.cjs:194
- iteration 2 fail_open (ruled_out): fail-closed semantics verified; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63, .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791
- iteration 2 untrusted_content (ruled_out): two independent scans clean; evidence=UNKNOWN
- iteration 3 marker_residue (ruled_out): scope-limited grep clean at HEAD; residual occurrences are out-of-scope history; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/goal.md:85
- iteration 3 version_bump_coverage (ruled_out): 27/27 owner paths carry a new entry; the no-SKILL.md runtime case is covered by its changelog carrier; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/implementation-summary.md:60, .skilled/skills/system-deep-loop/runtime/changelog/v1.9.6.0.md:1
- iteration 3 decision_conformance (ruled_out): all four decisions corroborated by artifacts or prior full reads; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:104, specs/sk-doc/066-feature-catalog-template-anchor-deprecation/006-skill-package-doc-findings/implementation-summary.md:103
- iteration 4 changelog_version_hygiene (ruled_out): Every sampled entry is one patch above the previous latest with a matching key and no duplicates.; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:105, .skilled/skills/cli-classifier/changelog/v0.8.1.0.md:1
- iteration 4 version_key_coverage (ruled_out): No in-scope residual beyond R1-P2-001; the 3 head -c 600 suspects were false positives (keys present).; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/008-remediation-deep-review/review/iterations/iteration-001.md:1
- iteration 4 derived_artifact_drift (ruled_out): No drift found; receipts record trigger index --check and compiled-route-guard PASS.; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json:1, .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1
- iteration 4 overengineering (ruled_out): Proportionate one-shot scripts in scratch folders; corroborates the iteration-1 overengineering clearance.; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/scratch/add_changelog_version_keys.py:1
- iteration 4 version_metadata_drift (ruled_out): Every unit's SKILL.md version equals its newest changelog entry.; evidence=.skilled/skills/sk-doc/SKILL.md:5
- iteration 5 doc_code_drift (ruled_out): sampled edits verified against root catalog and code; evidence=.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md:2, .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:414, .skilled/skills/sk-git/feature-catalog/remote-platform-integration/github-mcp-integration.md:3, .skilled/skills/sk-git/feature-catalog/feature-catalog.md:209, .skilled/commands/deep/assets/deep-research-auto.yaml:2119
- iteration 5 taxonomy_mapping_wrong_target (ruled_out): taxonomy and table scope verified; evidence=.skilled/skills/sk-doc/shared/assets/template-rules.json:650, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1222
- iteration 5 broken_reference (ruled_out): targets resolve; evidence=.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:19, .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:107, .skilled/skills/sk-git/references/gitkraken-mcp-integration.md
- iteration 5 stale_cross_reference (ruled_out): no live consumer broken; evidence=.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.0.0.md:21, .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:30
- iteration 5 version_hygiene (ruled_out): version continuity verified; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/changelog/v1.0.4.0.md, .skilled/skills/sk-vision/SKILL.md:5, .skilled/skills/sk-doc/sk-create-feature-catalog/changelog/v1.0.3.0.md
- iteration 5 leftover_template_marker (ruled_out): population check empty; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md:191, .skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md:173

### Clean Search Proof
- iteration 1 content_loss (ruled_out): mechanically verified with zero exceptions; evidence=remove_template_anchor.py:81-91, git:45cb464be8, git:45cb464be8
- iteration 1 content_loss (ruled_out): diff decomposed line-by-line; evidence=remove_leftover_template_comments.py:57-71, git:99c133fd5a
- iteration 1 broken_reference (ruled_out): repo-wide grep plus direct reads; evidence=git:HEAD, run-all-drift-guards.sh:30, leaf-manifest.json:55, verify-router-sync.cjs:9
- iteration 1 version_metadata_drift (ruled_out): exhaustive scan, zero exceptions; evidence=git:HEAD tree
- iteration 1 claim_count_mismatch (ruled_out): exact counts verified; evidence=git:main..HEAD, git:ccf25fdd56, git:99c133fd5a, git:ccf25fdd56
- iteration 1 script_logic (ruled_out): read and sample verified; evidence=sync_leaf_frontmatter.py:111-139, normalize_validation_types.py:93-135, add_changelog_version_keys.py:118-157, git:45cb464be8, git:ccf25fdd56
- iteration 2 command_injection (ruled_out): list-argv spawn and fully quoted shell; evidence=.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:68, .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:53, .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:30
- iteration 2 path_traversal (ruled_out): hub-gated resolution plus read-only behavior; evidence=.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:74, .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:114, .skilled/skills/sk-code/sk-code-opencode/assets/scripts/router-replay-lib.cjs:194
- iteration 2 fail_open (ruled_out): fail-closed semantics verified; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63, .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791
- iteration 2 untrusted_content (ruled_out): two independent scans clean; evidence=UNKNOWN
- iteration 3 marker_residue (ruled_out): scope-limited grep clean at HEAD; residual occurrences are out-of-scope history; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/goal.md:85
- iteration 3 version_bump_coverage (ruled_out): 27/27 owner paths carry a new entry; the no-SKILL.md runtime case is covered by its changelog carrier; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/implementation-summary.md:60, .skilled/skills/system-deep-loop/runtime/changelog/v1.9.6.0.md:1
- iteration 3 decision_conformance (ruled_out): all four decisions corroborated by artifacts or prior full reads; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:104, specs/sk-doc/066-feature-catalog-template-anchor-deprecation/006-skill-package-doc-findings/implementation-summary.md:103
- iteration 4 changelog_version_hygiene (ruled_out): Every sampled entry is one patch above the previous latest with a matching key and no duplicates.; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:105, .skilled/skills/cli-classifier/changelog/v0.8.1.0.md:1
- iteration 4 version_key_coverage (ruled_out): No in-scope residual beyond R1-P2-001; the 3 head -c 600 suspects were false positives (keys present).; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/008-remediation-deep-review/review/iterations/iteration-001.md:1
- iteration 4 derived_artifact_drift (ruled_out): No drift found; receipts record trigger index --check and compiled-route-guard PASS.; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json:1, .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1
- iteration 4 overengineering (ruled_out): Proportionate one-shot scripts in scratch folders; corroborates the iteration-1 overengineering clearance.; evidence=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/scratch/add_changelog_version_keys.py:1
- iteration 4 version_metadata_drift (ruled_out): Every unit's SKILL.md version equals its newest changelog entry.; evidence=.skilled/skills/sk-doc/SKILL.md:5
- iteration 5 doc_code_drift (ruled_out): sampled edits verified against root catalog and code; evidence=.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md:2, .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:414, .skilled/skills/sk-git/feature-catalog/remote-platform-integration/github-mcp-integration.md:3, .skilled/skills/sk-git/feature-catalog/feature-catalog.md:209, .skilled/commands/deep/assets/deep-research-auto.yaml:2119
- iteration 5 taxonomy_mapping_wrong_target (ruled_out): taxonomy and table scope verified; evidence=.skilled/skills/sk-doc/shared/assets/template-rules.json:650, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1222
- iteration 5 broken_reference (ruled_out): targets resolve; evidence=.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:19, .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:107, .skilled/skills/sk-git/references/gitkraken-mcp-integration.md
- iteration 5 stale_cross_reference (ruled_out): no live consumer broken; evidence=.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.0.0.md:21, .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:30
- iteration 5 version_hygiene (ruled_out): version continuity verified; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/changelog/v1.0.4.0.md, .skilled/skills/sk-vision/SKILL.md:5, .skilled/skills/sk-doc/sk-create-feature-catalog/changelog/v1.0.3.0.md
- iteration 5 leftover_template_marker (ruled_out): population check empty; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md:191, .skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md:173

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security. Focus area: the three renamed .cjs assets and the drift-guard wrapper (require resolution, path handling, spawn and quoting), plus the --apply write paths of the bulk scripts. Rotation status: first rotation after D1 correctness. Blocked or productive carry-forward: none blocked; the population-audit approach was productive and should be reused for reference integrity. Required evidence: direct reads of the guard scripts and a grep for shell injection surfaces in the wrapper.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
