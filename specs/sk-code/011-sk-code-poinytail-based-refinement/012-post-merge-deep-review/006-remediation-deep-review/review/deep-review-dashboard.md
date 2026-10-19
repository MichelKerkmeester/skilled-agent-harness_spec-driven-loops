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
- Review Target: Commits 1d078f3356..d1741a28f7: the T1 remediation of the post-merge review, five fix phases (012-post-merge-deep-review/001-005: sk-git and sk-vision hook stdin deadlines, the Webflow minified-runtime callback-cap warning and dead reference paths, the drift-guard warning count, the sk-code hub doc pointers, the claim corrections and mirror checker header) with their version bumps and changelogs, plus the trigger index rebuild (files)
- Started: 2026-10-10T21:18:04Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: rvw-012-006-remediation-20261010T211804Z
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
| 2 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 5 | security | security | 0.00 | 0/0/0 | complete |

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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
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
- candidateCoverage: covered=18, ruledOut=21, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 io_deadline (ruled_out): measured 3030 ms self-exit on open stdin; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:20, .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47
- iteration 1 io_deadline (ruled_out): uniform 3000 ms via shared helper; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63
- iteration 1 resource_leak (ruled_out): 3 ms EOF resolution measured; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:39, .skilled/hooks/shared/hook-adapter-shared.cjs:47
- iteration 1 test_false_pass (ruled_out): pre-fix replay reproduced the recorded failures; evidence=.skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47
- iteration 1 fail_open_semantics (ruled_out): equivalence plus regression suite green; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84
- iteration 2 warning_false_negative (ruled_out): both fixture families plus pre-fix replay measured; evidence=.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:441, .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:42
- iteration 2 exit_code_drift (ruled_out): pre-fix replay plus forced-failure probe; evidence=.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:466, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:80
- iteration 2 count_mismatch (ruled_out): counts match exactly; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:44
- iteration 3 claimed_but_missing (ruled_out): six carriers, changelog and Hermes copy verified consistent; evidence=.skilled/skills/sk-code/SKILL.md:5, .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:5
- iteration 3 count_mismatch (ruled_out): report and corrected row agree; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md:115
- iteration 3 count_mismatch (ruled_out): grep count 12 = 6+6 per the two commits; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md:61
- iteration 3 claimed_but_missing (ruled_out): 7/7 cited paths exist; evidence=.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md:11
- iteration 3 stale_reference (ruled_out): no stale framing remains; evidence=.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:52
- iteration 3 count_mismatch (ruled_out): 41 reproduced and the 36->41 diff verified; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:93
- iteration 4 version_drift (ruled_out): carrier lines read green; evidence=.skilled/skills/sk-code/SKILL.md:5
- iteration 4 version_drift (ruled_out): carrier lines read green; evidence=.hermes/skills/sk-git/SKILL.md:6
- iteration 4 changelog_mismatch (ruled_out): validation plus diff spot checks green; evidence=.skilled/skills/sk-git/changelog/v1.8.1.0.md:10, .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:442
- iteration 4 comment_id_leak (ruled_out): added-line scan matched nothing; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:40
- iteration 4 mirror_drift (ruled_out): check exit 0 with affirmative count; evidence=.hermes/skills/sk-code/SKILL.md:5
- iteration 4 manifest_staleness (ruled_out): probe fresh true plus old hash absent; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1, .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1
- iteration 4 stale_index (ruled_out): staleness attributable to post-commit untracked docs; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1, .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1
- iteration 4 version_drift (ruled_out): standard sect. 4/8 plus corpus convention; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:79
- iteration 5 injection (ruled_out): static read plus syntax check plus live green run; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:42, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:44, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:60, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:20
- iteration 5 unbounded_input (ruled_out): measured oversized probe plus range-scope proof (helper untouched) plus documented fail-open contract; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:26, .skilled/hooks/shared/hook-adapter-shared.cjs:47, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63, .skilled/hooks/shared/hook-adapter-shared.cjs:20
- iteration 5 fail_open_semantics (ruled_out): source read plus probe; consistent with the hook contract; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:389, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:85, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:64, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63
- iteration 5 late_write (ruled_out): source read plus late-write probe plus open-stdin suite self-exit ~3032 ms; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:23, .skilled/hooks/shared/hook-adapter-shared.cjs:39, .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47
- iteration 5 overengineering (ruled_out): diff read against the rule plus helper-reuse proof; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:40, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:45, .skilled/hooks/shared/hook-adapter-shared.cjs:20
- iteration 5 regression (ruled_out): runner characterization plus range-scope proof; evidence=.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts:10, .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts:13, .skilled/skills/sk-git/scripts/hooks/pi/README.md:16, .skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs:130

### Clean Search Proof
- iteration 1 io_deadline (ruled_out): measured 3030 ms self-exit on open stdin; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:20, .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47
- iteration 1 io_deadline (ruled_out): uniform 3000 ms via shared helper; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63
- iteration 1 resource_leak (ruled_out): 3 ms EOF resolution measured; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:39, .skilled/hooks/shared/hook-adapter-shared.cjs:47
- iteration 1 test_false_pass (ruled_out): pre-fix replay reproduced the recorded failures; evidence=.skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47
- iteration 1 fail_open_semantics (ruled_out): equivalence plus regression suite green; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84
- iteration 2 warning_false_negative (ruled_out): both fixture families plus pre-fix replay measured; evidence=.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:441, .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:42
- iteration 2 exit_code_drift (ruled_out): pre-fix replay plus forced-failure probe; evidence=.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:466, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:80
- iteration 2 count_mismatch (ruled_out): counts match exactly; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:44
- iteration 3 claimed_but_missing (ruled_out): six carriers, changelog and Hermes copy verified consistent; evidence=.skilled/skills/sk-code/SKILL.md:5, .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:5
- iteration 3 count_mismatch (ruled_out): report and corrected row agree; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md:115
- iteration 3 count_mismatch (ruled_out): grep count 12 = 6+6 per the two commits; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md:61
- iteration 3 claimed_but_missing (ruled_out): 7/7 cited paths exist; evidence=.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md:11
- iteration 3 stale_reference (ruled_out): no stale framing remains; evidence=.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:52
- iteration 3 count_mismatch (ruled_out): 41 reproduced and the 36->41 diff verified; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:93
- iteration 4 version_drift (ruled_out): carrier lines read green; evidence=.skilled/skills/sk-code/SKILL.md:5
- iteration 4 version_drift (ruled_out): carrier lines read green; evidence=.hermes/skills/sk-git/SKILL.md:6
- iteration 4 changelog_mismatch (ruled_out): validation plus diff spot checks green; evidence=.skilled/skills/sk-git/changelog/v1.8.1.0.md:10, .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:442
- iteration 4 comment_id_leak (ruled_out): added-line scan matched nothing; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:40
- iteration 4 mirror_drift (ruled_out): check exit 0 with affirmative count; evidence=.hermes/skills/sk-code/SKILL.md:5
- iteration 4 manifest_staleness (ruled_out): probe fresh true plus old hash absent; evidence=.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1, .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1
- iteration 4 stale_index (ruled_out): staleness attributable to post-commit untracked docs; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1, .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1
- iteration 4 version_drift (ruled_out): standard sect. 4/8 plus corpus convention; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:79
- iteration 5 injection (ruled_out): static read plus syntax check plus live green run; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:42, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:44, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:60, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:20
- iteration 5 unbounded_input (ruled_out): measured oversized probe plus range-scope proof (helper untouched) plus documented fail-open contract; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:26, .skilled/hooks/shared/hook-adapter-shared.cjs:47, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63, .skilled/hooks/shared/hook-adapter-shared.cjs:20
- iteration 5 fail_open_semantics (ruled_out): source read plus probe; consistent with the hook contract; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:389, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:85, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:64, .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63
- iteration 5 late_write (ruled_out): source read plus late-write probe plus open-stdin suite self-exit ~3032 ms; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:23, .skilled/hooks/shared/hook-adapter-shared.cjs:39, .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47
- iteration 5 overengineering (ruled_out): diff read against the rule plus helper-reuse proof; evidence=.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:40, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:45, .skilled/hooks/shared/hook-adapter-shared.cjs:20
- iteration 5 regression (ruled_out): runner characterization plus range-scope proof; evidence=.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts:10, .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts:13, .skilled/skills/sk-git/scripts/hooks/pi/README.md:16, .skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs:130

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security (rotation; orchestrator may reassign). - Focus area: the remaining doc/claim commits — 019b94a403 (legacy PostToolUse hook name and a real file citation), f4f678328b (two recorded count corrections and the mirror-checker header), d1741a28f7 (trigger-index rebuild). - Reason: the two executable fix commits are now verified on correctness; one P2 residual stands. - Rotation status: correctness covered again (PASS, P2=1). - Carry-forward: productive — fixture runs, git-show pre-fix replay, independent WARN counting, forced-failure probe. Open finding R2-P2-001. - Required evidence: per-file reads plus targeted command proof per commit. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
