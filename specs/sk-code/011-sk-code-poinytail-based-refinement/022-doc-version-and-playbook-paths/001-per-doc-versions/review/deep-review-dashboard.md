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
- Review Target: The per-doc version commits 41302e72be..HEAD on branch worktrees/119-docver-per-doc: the frontmatter-version engine scope, verify and bump mode, the packager and post-edit router scope mirrors, the pre-commit doc-version-bump gate and gates.tsv row, the pull-request bump --check job, the versioning standard and templates, the 2,845-line version restore, the 22 docs given frontmatter, the 68 docs started at 1.0.0.0, the sk-code citation re-anchor and the sk-doc 2.3.7.0 release (files)
- Started: 2026-10-12T07:01:58.951Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-10-12T07:01:58.951Z
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
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/3 | complete |
| 2 | security | security | 0.50 | 0/0/3 | complete |
| 3 | traceability | traceability | 0.25 | 0/1/1 | complete |
| 4 | maintainability | maintainability | 0.11 | 0/0/1 | complete |
| 5 | correctness | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 9 |
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
- graphConvergenceScore: 0.89
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":16,"description":"Dimension coverage (57%) is below threshold (80%). 16 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.25 -> 0.11 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=10, ruledOut=22, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Invariant held across every branch exercised by read, suite and probes.; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:407, .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs:1
- iteration 1 encoding_handling (ruled_out): EOL and quoting preserved by withEdition; body comparison normalization is line-content based.; evidence=.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs:78
- iteration 1 duplicate_state (ruled_out): head-version > base-version guard skips an already-raised doc; one row per path per diff.; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410
- iteration 1 gating_bypass (ruled_out): Hook guards and the skip file is untracked; CI env does not set SKDOC_SKIP_VALIDATION.; evidence=.skilled/scripts/git-hooks/pre-commit:841, .gitignore:348, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:386
- iteration 1 state_transition (ruled_out): Exit-code contract matches the hook and the suite.; evidence=.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs:53, .skilled/scripts/git-hooks/pre-commit:880
- iteration 2 path_injection (ruled_out): NUL-delimited diff parse plus quoted git add -- plus lexical inScope plus the git pathspec confine the gate to the skills root; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:174, .skilled/scripts/git-hooks/pre-commit:900
- iteration 2 command_injection (ruled_out): shell variable expansion inside double quotes does not re-parse metacharacters; the job is pull_request-only with a read-only token and base_ref names a base-repository branch; evidence=.github/workflows/skill-doc-frontmatter.yml:77, .github/workflows/skill-doc-frontmatter.yml:78
- iteration 2 env_bypass_persistence (ruled_out): every persisted source lives outside the commit stream (git config, gitignored env file); CI sets no such variable; evidence=.skilled/scripts/git-hooks/pre-commit:841, .skilled/scripts/git-hooks/lib/gates.tsv:1, .gitignore:348
- iteration 2 partial_staging_data_loss (ruled_out): the engine refuses (exit 3) before writing on mismatch, and for raised files there were no unstaged edits to lose; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:428, .skilled/scripts/git-hooks/pre-commit:880, .skilled/scripts/git-hooks/pre-commit:900
- iteration 3 count_claim_mismatch (ruled_out): every numeric claim matched the commits exactly; evidence=commit 31888d05bb, commit a8d0dd7c2a, commit 3e848d1303, commit 18d3233a52
- iteration 3 restore_value_mismatch (ruled_out): restore completeness and value fidelity hold; evidence=commit 31888d05bb, commit a8d0dd7c2a, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs
- iteration 3 standard_engine_scope_mismatch (ruled_out): scope constants and bump rule agree; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:56, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:174, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:25
- iteration 3 enforcement_claim_mismatch (ruled_out): every changelog bullet maps to a shipped change; no overclaim found; evidence=.skilled/skills/sk-doc/changelog/v2.3.7.0.md:23, commit 812197ab82, .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:212
- iteration 3 overlay_skill_mirror_drift (ruled_out): skill edition, changelog and Hermes mirror agree in one release commit; evidence=commit aa89063bca, .skilled/skills/sk-doc/changelog/v2.3.7.0.md:10
- iteration 4 test_mirrors_implementation (ruled_out): all suites exercise fixtures, subprocess CLI runs or dispatch calls; none asserts a constant or mirrors code structure; evidence=.skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24, .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:280-291, .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:185-207
- iteration 4 duplicated_policy_constant (ruled_out): the gate over scaffolded output binds every checked file; residual risk limited to files the engine skips; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:66, .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24
- iteration 4 dead_code_unreachable_branch (ruled_out): the branch executes and is test-pinned; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:129, .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:637, .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:296-307
- iteration 5 off_by_one_anchor (ruled_out): no missed or over-corrected citation; every living citation into the two shifted docs resolves to pre-removal numbering; evidence=f60fa8adac, .skilled/skills/sk-code/manual-testing-playbook/surface-detection/opencode-detection.md:15, .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md:32, .skilled/skills/sk-code/shared/references/stack-detection.md:30
- iteration 5 temp_index_loss (ruled_out): blocks instead of writing into an index git discards; no owed raise lost; evidence=.skilled/scripts/git-hooks/pre-commit:862, .skilled/scripts/git-hooks/tests/pre-commit.test.sh:992
- iteration 5 temp_index_loss (ruled_out): the temp index never contained a skill doc, so no raise was owed in that commit; the staged change stays visible to the next gate; evidence=.skilled/scripts/git-hooks/pre-commit:845
- iteration 5 gate_bypass (ruled_out): the engine diffs the index against the amended HEAD, so the raise lands in the amended commit; an amend with nothing staged is a no-op; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384
- iteration 5 gate_bypass (ruled_out): merge content a human introduces is gated; a clean merge carries only commits that were gated or explicitly bypassed, and CI re-checks the PR diff with bump --check; evidence=.skilled/scripts/git-hooks/pre-commit:875
- iteration 5 silent_skip (ruled_out): deletions are excluded by --diff-filter=AMR on both sides of the gate; a doc leaving the tree owes no raise; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346
- iteration 5 wrong_raise (ruled_out): the raise is monotonic against the merge base and overrides a lowered value when the body changed; a frontmatter-only change raising nothing is the pinned contract, not a missed raise; evidence=.skilled/scripts/git-hooks/tests/pre-commit.test.sh:966, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410
- iteration 5 crash_on_git_edge_state (ruled_out): the guard skips a state the engine cannot compare; the format gate and the PR check remain for this one commit; evidence=.skilled/scripts/git-hooks/pre-commit:841, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384
- iteration 5 silent_skip (ruled_out): the same condition shape as the two sibling re-mint gates; node is a declared prerequisite of the chain and the PR check is the enforcement net; recorded as a boundary, not a defect; evidence=.skilled/scripts/git-hooks/pre-commit:841, .skilled/scripts/git-hooks/pre-commit:691, .skilled/scripts/git-hooks/pre-commit:496
- iteration 5 wrong_raise (ruled_out): every raise matches the documented arithmetic; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:315

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Invariant held across every branch exercised by read, suite and probes.; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:407, .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs:1
- iteration 1 encoding_handling (ruled_out): EOL and quoting preserved by withEdition; body comparison normalization is line-content based.; evidence=.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs:78
- iteration 1 duplicate_state (ruled_out): head-version > base-version guard skips an already-raised doc; one row per path per diff.; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410
- iteration 1 gating_bypass (ruled_out): Hook guards and the skip file is untracked; CI env does not set SKDOC_SKIP_VALIDATION.; evidence=.skilled/scripts/git-hooks/pre-commit:841, .gitignore:348, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:386
- iteration 1 state_transition (ruled_out): Exit-code contract matches the hook and the suite.; evidence=.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs:53, .skilled/scripts/git-hooks/pre-commit:880
- iteration 2 path_injection (ruled_out): NUL-delimited diff parse plus quoted git add -- plus lexical inScope plus the git pathspec confine the gate to the skills root; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:174, .skilled/scripts/git-hooks/pre-commit:900
- iteration 2 command_injection (ruled_out): shell variable expansion inside double quotes does not re-parse metacharacters; the job is pull_request-only with a read-only token and base_ref names a base-repository branch; evidence=.github/workflows/skill-doc-frontmatter.yml:77, .github/workflows/skill-doc-frontmatter.yml:78
- iteration 2 env_bypass_persistence (ruled_out): every persisted source lives outside the commit stream (git config, gitignored env file); CI sets no such variable; evidence=.skilled/scripts/git-hooks/pre-commit:841, .skilled/scripts/git-hooks/lib/gates.tsv:1, .gitignore:348
- iteration 2 partial_staging_data_loss (ruled_out): the engine refuses (exit 3) before writing on mismatch, and for raised files there were no unstaged edits to lose; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:428, .skilled/scripts/git-hooks/pre-commit:880, .skilled/scripts/git-hooks/pre-commit:900
- iteration 3 count_claim_mismatch (ruled_out): every numeric claim matched the commits exactly; evidence=commit 31888d05bb, commit a8d0dd7c2a, commit 3e848d1303, commit 18d3233a52
- iteration 3 restore_value_mismatch (ruled_out): restore completeness and value fidelity hold; evidence=commit 31888d05bb, commit a8d0dd7c2a, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs
- iteration 3 standard_engine_scope_mismatch (ruled_out): scope constants and bump rule agree; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:56, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:174, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:25
- iteration 3 enforcement_claim_mismatch (ruled_out): every changelog bullet maps to a shipped change; no overclaim found; evidence=.skilled/skills/sk-doc/changelog/v2.3.7.0.md:23, commit 812197ab82, .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:212
- iteration 3 overlay_skill_mirror_drift (ruled_out): skill edition, changelog and Hermes mirror agree in one release commit; evidence=commit aa89063bca, .skilled/skills/sk-doc/changelog/v2.3.7.0.md:10
- iteration 4 test_mirrors_implementation (ruled_out): all suites exercise fixtures, subprocess CLI runs or dispatch calls; none asserts a constant or mirrors code structure; evidence=.skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24, .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:280-291, .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:185-207
- iteration 4 duplicated_policy_constant (ruled_out): the gate over scaffolded output binds every checked file; residual risk limited to files the engine skips; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:66, .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24
- iteration 4 dead_code_unreachable_branch (ruled_out): the branch executes and is test-pinned; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:129, .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:637, .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:296-307
- iteration 5 off_by_one_anchor (ruled_out): no missed or over-corrected citation; every living citation into the two shifted docs resolves to pre-removal numbering; evidence=f60fa8adac, .skilled/skills/sk-code/manual-testing-playbook/surface-detection/opencode-detection.md:15, .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md:32, .skilled/skills/sk-code/shared/references/stack-detection.md:30
- iteration 5 temp_index_loss (ruled_out): blocks instead of writing into an index git discards; no owed raise lost; evidence=.skilled/scripts/git-hooks/pre-commit:862, .skilled/scripts/git-hooks/tests/pre-commit.test.sh:992
- iteration 5 temp_index_loss (ruled_out): the temp index never contained a skill doc, so no raise was owed in that commit; the staged change stays visible to the next gate; evidence=.skilled/scripts/git-hooks/pre-commit:845
- iteration 5 gate_bypass (ruled_out): the engine diffs the index against the amended HEAD, so the raise lands in the amended commit; an amend with nothing staged is a no-op; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384
- iteration 5 gate_bypass (ruled_out): merge content a human introduces is gated; a clean merge carries only commits that were gated or explicitly bypassed, and CI re-checks the PR diff with bump --check; evidence=.skilled/scripts/git-hooks/pre-commit:875
- iteration 5 silent_skip (ruled_out): deletions are excluded by --diff-filter=AMR on both sides of the gate; a doc leaving the tree owes no raise; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346
- iteration 5 wrong_raise (ruled_out): the raise is monotonic against the merge base and overrides a lowered value when the body changed; a frontmatter-only change raising nothing is the pinned contract, not a missed raise; evidence=.skilled/scripts/git-hooks/tests/pre-commit.test.sh:966, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:410
- iteration 5 crash_on_git_edge_state (ruled_out): the guard skips a state the engine cannot compare; the format gate and the PR check remain for this one commit; evidence=.skilled/scripts/git-hooks/pre-commit:841, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:384
- iteration 5 silent_skip (ruled_out): the same condition shape as the two sibling re-mint gates; node is a declared prerequisite of the chain and the PR check is the enforcement net; recorded as a boundary, not a defect; evidence=.skilled/scripts/git-hooks/pre-commit:841, .skilled/scripts/git-hooks/pre-commit:691, .skilled/scripts/git-hooks/pre-commit:496
- iteration 5 wrong_raise (ruled_out): every raise matches the documented arithmetic; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:315

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
