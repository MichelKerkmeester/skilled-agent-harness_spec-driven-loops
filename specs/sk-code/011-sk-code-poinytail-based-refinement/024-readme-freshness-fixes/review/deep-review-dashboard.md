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
- Review Target: The README freshness fix commits 0725425d46..HEAD on branch worktrees/122-readme-freshness-research: wording fixes F1 to F23 in the root README and eleven related docs, the removal of parent-skill doctor check 13c with its tests, the frontmatter versioning standard line, and the phase's spec docs (files)
- Started: 2026-10-12T16:20:15.273Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-12T16:20:15.273Z
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
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 3 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 4 | traceability | traceability | 1.00 | 0/0/2 | complete |
| 5 | security | security/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
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
- Last 3 ratios: 0.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 2
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
- candidateCoverage: covered=17, ruledOut=17, deferred=1, blocked=1

### Search Debt
- iteration 4 stale_mirror_claim (blocked): Mirror trees absent in this worktree; closure depends on the orchestrator's readlink evidence recorded in the ledger F11 row.; evidence=README.md:933
- iteration 5 version_line_drift (deferred): read budget and no shell in this dispatch; recorded as an edge case; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:1

### Ruled-Out Candidates
- iteration 1 stale_count (ruled_out): count re-derived from the source tree and matches 11; evidence=.skilled/agents/review.md, .claude/agents/Explore.md, .pi/agents/review.md
- iteration 1 stale_count (ruled_out): arithmetic and tree recount match exactly; evidence=.skilled/commands/speckit/plan.md, .skilled/commands/agent-router.md, .skilled/commands/vision.md
- iteration 1 stale_count (ruled_out): registry read confirms 41 rules and 7 warn, both named rules included; evidence=.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:220, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:231, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:433
- iteration 1 stale_count (ruled_out): no residual stale value remains anywhere in the file; evidence=README.md:24, README.md:1336, README.md:1435
- iteration 1 ascii_box_misalignment (ruled_out): right edges verified column-consistent on every box line; evidence=README.md:125, README.md:147
- iteration 1 stale_auth_claim (ruled_out): auth wording matches the skill's own references and the removed env-var claim is contradicted nowhere; evidence=.skilled/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md:61, .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:52, README.md:1336
- iteration 2 stale_count (ruled_out): counted directly in pre-commit: ten implemented gates and nine bypass flags, matching the README's named set; evidence=.skilled/scripts/git-hooks/pre-commit:93, .skilled/scripts/git-hooks/pre-commit:919, .skilled/scripts/git-hooks/README.md:24
- iteration 2 false_import_claim (ruled_out): every observed require resolves to Node core or an intra-folder relative; evidence=.skilled/bin/lib/README.md:97, .skilled/bin/lib/mirror-sync-verify.cjs:10, .skilled/bin/lib/compiled-route-admission.cjs:27
- iteration 2 doc_code_drift (ruled_out): schema bounds, argv forwarding and unknown-surface handling all match the sentence; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:251, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:381
- iteration 2 doc_code_drift (ruled_out): checkVersionParity compares exactly ROUTER.md and the three JSON files with SKILL.md; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1849
- iteration 2 incomplete_removal (ruled_out): no residual 13c reporting anywhere in .skilled; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1754, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:433
- iteration 2 stale_claim (ruled_out): exact command corroborated by the mode's integration-patterns probe step; evidence=.skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:30
- iteration 3 incomplete_removal (ruled_out): diff read shows three surgical hunks and no other change in the file; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:41-47, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:50-72, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:77-82
- iteration 3 orphan_reference (ruled_out): identifier-precise scans clean; remaining hits are the intentional negative assertion and unrelated token collisions; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:437, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/review/prompts/iteration-3.md:61
- iteration 3 test_guard_gap (ruled_out): the assertion is falsified by the restored check; the test proves the removal; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:102-113, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:437
- iteration 3 protection_loss (ruled_out): the per-doc rule needs no README==SKILL parity; the removed check contradicted it; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:17, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:54-56
- iteration 3 dead_code (ruled_out): both symbols keep live call sites; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:178, .skilled/commands/doctor/scripts/parent-skill-check.cjs:188, .skilled/commands/doctor/scripts/parent-skill-check.cjs:596, .skilled/commands/doctor/scripts/parent-skill-check.cjs:997, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1252, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1812, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1826, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1843, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850
- iteration 3 stale_comment (ruled_out): the comment names exactly the checks present; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1757, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1783, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1842
- iteration 4 doc_code_drift (ruled_out): All three rows' operative claims bear out; RM-1's exact printed string is unverifiable without execution but its code path and README silence are confirmed.; evidence=.skilled/scripts/git-hooks/pre-commit:919, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409
- iteration 4 stale_count (ruled_out): Counts and anchors match the ledger exactly; no stale value remains.; evidence=README.md:24, README.md:881, README.md:1278
- iteration 4 orphan_reference (ruled_out): Complete row set and clean repeat scans.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:170
- iteration 5 secret_or_token_leak (ruled_out): full direct read of the changed-line set found no secret or token value; evidence=README.md:1435
- iteration 5 private_path_leak (ruled_out): every changed path mention is repo-relative; evidence=.skilled/skills/cli-external-orchestration/README.md:94
- iteration 5 version_line_drift (ruled_out): all seven raises are single-step third-segment raises; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:169-170, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:191-192, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:211-212, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:233-234, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:255-256, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:307-308, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:338-339
- iteration 5 ascii_box_misalignment (ruled_out): edges and columns verified on every changed block; evidence=README.md:122-125, README.md:144-147, .skilled/scripts/git-hooks/README.md:137-141
- iteration 5 stale_auth_claim (ruled_out): no credential value and no contradiction; evidence=README.md:1435

### Clean Search Proof
- iteration 1 stale_count (ruled_out): count re-derived from the source tree and matches 11; evidence=.skilled/agents/review.md, .claude/agents/Explore.md, .pi/agents/review.md
- iteration 1 stale_count (ruled_out): arithmetic and tree recount match exactly; evidence=.skilled/commands/speckit/plan.md, .skilled/commands/agent-router.md, .skilled/commands/vision.md
- iteration 1 stale_count (ruled_out): registry read confirms 41 rules and 7 warn, both named rules included; evidence=.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:220, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:231, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:433
- iteration 1 stale_count (ruled_out): no residual stale value remains anywhere in the file; evidence=README.md:24, README.md:1336, README.md:1435
- iteration 1 ascii_box_misalignment (ruled_out): right edges verified column-consistent on every box line; evidence=README.md:125, README.md:147
- iteration 1 stale_auth_claim (ruled_out): auth wording matches the skill's own references and the removed env-var claim is contradicted nowhere; evidence=.skilled/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md:61, .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:52, README.md:1336
- iteration 2 stale_count (ruled_out): counted directly in pre-commit: ten implemented gates and nine bypass flags, matching the README's named set; evidence=.skilled/scripts/git-hooks/pre-commit:93, .skilled/scripts/git-hooks/pre-commit:919, .skilled/scripts/git-hooks/README.md:24
- iteration 2 false_import_claim (ruled_out): every observed require resolves to Node core or an intra-folder relative; evidence=.skilled/bin/lib/README.md:97, .skilled/bin/lib/mirror-sync-verify.cjs:10, .skilled/bin/lib/compiled-route-admission.cjs:27
- iteration 2 doc_code_drift (ruled_out): schema bounds, argv forwarding and unknown-surface handling all match the sentence; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:251, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:381
- iteration 2 doc_code_drift (ruled_out): checkVersionParity compares exactly ROUTER.md and the three JSON files with SKILL.md; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1849
- iteration 2 incomplete_removal (ruled_out): no residual 13c reporting anywhere in .skilled; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1754, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:433
- iteration 2 stale_claim (ruled_out): exact command corroborated by the mode's integration-patterns probe step; evidence=.skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md:30
- iteration 3 incomplete_removal (ruled_out): diff read shows three surgical hunks and no other change in the file; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:41-47, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:50-72, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:77-82
- iteration 3 orphan_reference (ruled_out): identifier-precise scans clean; remaining hits are the intentional negative assertion and unrelated token collisions; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:437, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/review/prompts/iteration-3.md:61
- iteration 3 test_guard_gap (ruled_out): the assertion is falsified by the restored check; the test proves the removal; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:102-113, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:437
- iteration 3 protection_loss (ruled_out): the per-doc rule needs no README==SKILL parity; the removed check contradicted it; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:17, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:54-56
- iteration 3 dead_code (ruled_out): both symbols keep live call sites; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:178, .skilled/commands/doctor/scripts/parent-skill-check.cjs:188, .skilled/commands/doctor/scripts/parent-skill-check.cjs:596, .skilled/commands/doctor/scripts/parent-skill-check.cjs:997, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1252, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1812, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1826, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1843, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850
- iteration 3 stale_comment (ruled_out): the comment names exactly the checks present; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1757, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1783, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1842
- iteration 4 doc_code_drift (ruled_out): All three rows' operative claims bear out; RM-1's exact printed string is unverifiable without execution but its code path and README silence are confirmed.; evidence=.skilled/scripts/git-hooks/pre-commit:919, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409
- iteration 4 stale_count (ruled_out): Counts and anchors match the ledger exactly; no stale value remains.; evidence=README.md:24, README.md:881, README.md:1278
- iteration 4 orphan_reference (ruled_out): Complete row set and clean repeat scans.; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:170
- iteration 5 secret_or_token_leak (ruled_out): full direct read of the changed-line set found no secret or token value; evidence=README.md:1435
- iteration 5 private_path_leak (ruled_out): every changed path mention is repo-relative; evidence=.skilled/skills/cli-external-orchestration/README.md:94
- iteration 5 version_line_drift (ruled_out): all seven raises are single-step third-segment raises; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:169-170, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:191-192, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:211-212, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:233-234, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:255-256, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:307-308, specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:338-339
- iteration 5 ascii_box_misalignment (ruled_out): edges and columns verified on every changed block; evidence=README.md:122-125, README.md:144-147, .skilled/scripts/git-hooks/README.md:137-141
- iteration 5 stale_auth_claim (ruled_out): no credential value and no contradiction; evidence=README.md:1435

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- **Dimension:** none — the five-iteration cap is reached (stop policy max-iterations); iteration 5 closed the security dimension and the loop hands off to synthesis. - **Carry-forward:** (a) `agent_cross_runtime` mirror closure — still blocked; (b) the five non-version-bumped docs — corroborated-only; (c) R4-P2-001 and R4-P2-002 — doc-state fixes for the remediation step, not review blockers.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
