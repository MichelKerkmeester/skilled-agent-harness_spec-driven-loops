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
- Review Target: Commits ba56b03412..5d9c970447 on main: the 37 commits of the sk-code Ponytail refinement epic (specs/sk-code/011-sk-code-poinytail-based-refinement phases 002-011), the merge 144b1d339e and its 8 hand-resolved conflicts, then 9a74576ccc and 5d9c970447 (files)
- Started: 2026-10-10T18:42:41Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: rvw-012-post-merge-20261010T184241Z
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
| P2 (Suggestions) | 18 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | merge 144b1d339e hand-resolution fidelity (correctness) | correctness | 0.00 | 0/0/0 | complete |
| 2 | hook stdin deadline commits c33f9d1984/60d7e5d15b/6842756e2d/3163ee231e (correctness) | correctness | 1.00 | 0/0/2 | complete |
| 3 | Compiled routing and session-aware tie-break: 5cf062b021, 83ff844329, ee78fc56b9 (correctness) | correctness | 0.50 | 0/0/2 | complete |
| 4 | Deep-loop reducer and findings parser: 0221336dd4, 900d0bcf85, 77df558665 (correctness) | correctness | 0.20 | 0/0/1 | complete |
| 5 | Path containment and untrusted input across the epic: generate-leaf-manifest.cjs symlink and git-ignore handling, hook stdin readers (unbounded input, JSON parse of partial input), the Webflow runtime check fix 82d297a374, and drift-guard or checker scripts that shell out with interpolated paths (security) | security | 0.38 | 0/0/3 | complete |
| 6 | sk-code-review checkers and rule canary: 637eeaeb2e, da9ded3b36, 26df6c4a8a, 4dab32444c, 3cf65c519e, eda0cb91e4. Ran check-rule-copies.js and its test and the hub canaries read-only; the jev-transport-single defer is confirmed on main | correctness | 0.20 | 0/0/2 | complete |
| 7 | maintainability: sk-code-skilled drift guards and doc-claim checks (refuted the 26/16 leaf-manifest claim) | maintainability | 0.09 | 0/0/1 | complete |
| 8 | traceability: phases 010/011 spec vs code, Known Limitations, parent goal criteria after the merge | traceability | 0.15 | 0/0/2 | complete |
| 9 | maintainability: sk-code docs commits (stale names, dead anchors, wrong paths) | maintainability | 0.19 | 0/0/3 | complete |
| 10 | traceability: agents, repo rules and runtime mirrors | traceability | 0.11 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 15 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 3 |

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
- Last 3 ratios: 0.15 -> 0.19 -> 0.11
- convergenceScore: 0.89
- openFindings: 18
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
- candidateCoverage: covered=28, ruledOut=28, deferred=3, blocked=1

### Search Debt
- iteration 1 byte_level_fixture_hash (blocked): no read-only clean-tree path: generating into a scratch tree would create files outside the allowed write list and the dirty worktree cannot be reverted; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/scope-files.txt:1
- iteration 1 residual_release_reference (deferred): the orchestrator plan assigns phase-010/011 spec-versus-code traceability to iteration 8; sampled here only to bound the merge's documentation fallout; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/implementation-summary.md:57
- iteration 3 route_drift_attribution (deferred): Cannot be attributed to the range from a read-only pass; baseline triage owns warn-only admission drift.; evidence=.skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md:6, .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md:6
- iteration 4 stale_scratch_evidence (deferred): Untracked scratch hygiene, not code behavior; noted as edge case 1; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2

### Ruled-Out Candidates
- iteration 1 merge_resolution_loss (ruled_out): both sides' features present at HEAD and both sides' test suites pass on the merged file; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:123, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:172, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:522, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:478, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs:1
- iteration 1 version_content_mismatch (ruled_out): merge result is upstream content plus the required 2.7.2.0 version bump, and the Hermes mirror check passes; evidence=.skilled/skills/system-spec-kit/SKILL.md:5, .skilled/skills/system-spec-kit/SKILL.md:496, .hermes/skills/system-spec-kit/SKILL.md:5
- iteration 1 dropped_doc_notes (ruled_out): both carried-over notes verified inside merged v2.7.2.0; v2.7.1.0 intentionally upstream's; evidence=.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:1, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:26, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:27, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:1
- iteration 1 stale_generated_artifact (ruled_out): phrase-level and path-level freshness hold for every document present at HEAD; the reported staleness is the review packet's own untracked files; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1, .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:1
- iteration 1 merge_resolution_loss (ruled_out): upstream's single-marker change is intentional and present; the epic's parallel line also present; evidence=AGENTS.md:86, AGENTS.md:86, AGENTS.md:86
- iteration 2 deadline_margin (ruled_out): margin exists and is asserted; no defect proven; evidence=.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23, .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:38
- iteration 2 timer_leak (ruled_out): timer cleanup present on every path; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:39, .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:53
- iteration 2 partial_input_handling (ruled_out): partial input handled and tested; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:31, .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:79
- iteration 2 late_write_handling (ruled_out): post-settle writes are discarded with no crash; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:47
- iteration 3 hint_reorder_correctness (ruled_out): Hint suite green and engine code constrains the hint to target reordering after validation.; evidence=.skilled/bin/tests/compiled-route-surface-hint.test.cjs:1, .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:106
- iteration 3 routing_lockstep_drift (ruled_out): Guard run at HEAD reports every hub fresh.; evidence=.skilled/bin/compiled-route-guard.cjs:1
- iteration 4 narrative_double_count (ruled_out): verified by code read and per-folder probe sums; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002, specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2
- iteration 4 count_regression (ruled_out): per-folder probe arithmetic; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:148
- iteration 5 partial_input_handling (ruled_out): fail-open on partial input is the adapter's stated contract and was already ruled out in iteration 2; no blocking gate depends on the truncated-bytes case for an enforcement boundary; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:54, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:41
- iteration 5 symlink_containment (ruled_out): walker and writer contain or refuse every symlink case found by direct read; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:188
- iteration 5 shell_injection (ruled_out): no shell interpolation of paths exists at any call site; python and node guards resolve roots from their own file location; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:123, .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:105, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:49
- iteration 5 information_disclosure (ruled_out): the manifest carries path names only, the fallback is deliberate and documented, and git-backed repos are covered by check-ignore; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:115
- iteration 6 contract_gap (ruled_out): no hole inside the documented contract; every tested shape matches the README contract; evidence=.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:1, .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:1
- iteration 7 doc_claim_mismatch (ruled_out): claim did not reproduce: all six suites green and no fixed-routing count assertion exists in scope; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:34
- iteration 7 duplicated_constant (ruled_out): single literal; recorded as a watch item, not a finding; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_router_sync.cjs:16
- iteration 8 spec_code_drift (ruled_out): the remaining spot checks hold; only the two registered mismatches stand; evidence=.skilled/skills/sk-code/sk-code-webflow/SKILL.md:1, .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23, .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:1
- iteration 8 mirror_parity_drift (ruled_out): both mirrored trees pass their checks live; evidence=.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs, .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
- iteration 8 known_limitation_left_open (ruled_out): the only unclosed limitation (REQ-004/T125) is a documented, amended deviation rather than a silent gap; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/tasks.md:163, specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/spec.md:141
- iteration 8 known_limitation_left_open (ruled_out): the four round-three checker limits were implemented or narrowed by 011-005; the remaining one (rare heading forms) is documented by design; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_doc_claims.cjs:81, specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/iterations/iteration-007.md
- iteration 9 dead_anchor (ruled_out): no dead anchors found; evidence=MISSING_ANCHORS=0
- iteration 9 dead_link (ruled_out): all raw hits resolve; evidence=MISSING_FILE_LINKS=10
- iteration 9 claim_drift (ruled_out): count matches the recorded baseline; siblings held or fell; evidence=hvr_scan.py output line
- iteration 9 claim_drift (ruled_out): numbers reproduce; the accuracy gap is a documented known limitation under a no-worse bar; evidence=advisor-probe-battery.md:60
- iteration 10 mirror_body_drift (ruled_out): live gate plus dialect greps show no body drift; evidence=.skilled/agents/deep-review.md:214, .claude/agents/deep-review.md:201, .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:143
- iteration 10 cross_reference_breakage (ruled_out): every markdown link resolves; evidence=REPO RULES.md:36, AGENTS.md:296
- iteration 10 gate_coverage_gap (ruled_out): CI fires pre-merge with .pi paths; no live drift; recorded as observation; evidence=.skilled/scripts/git-hooks/pre-commit:259, .github/workflows/spec-kit-check.yml:157, .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs

### Clean Search Proof
- iteration 1 merge_resolution_loss (ruled_out): both sides' features present at HEAD and both sides' test suites pass on the merged file; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:123, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:172, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:522, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:478, .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs:1
- iteration 1 version_content_mismatch (ruled_out): merge result is upstream content plus the required 2.7.2.0 version bump, and the Hermes mirror check passes; evidence=.skilled/skills/system-spec-kit/SKILL.md:5, .skilled/skills/system-spec-kit/SKILL.md:496, .hermes/skills/system-spec-kit/SKILL.md:5
- iteration 1 dropped_doc_notes (ruled_out): both carried-over notes verified inside merged v2.7.2.0; v2.7.1.0 intentionally upstream's; evidence=.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:1, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:26, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:27, .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:1
- iteration 1 stale_generated_artifact (ruled_out): phrase-level and path-level freshness hold for every document present at HEAD; the reported staleness is the review packet's own untracked files; evidence=.skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1, .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:1
- iteration 1 merge_resolution_loss (ruled_out): upstream's single-marker change is intentional and present; the epic's parallel line also present; evidence=AGENTS.md:86, AGENTS.md:86, AGENTS.md:86
- iteration 2 deadline_margin (ruled_out): margin exists and is asserted; no defect proven; evidence=.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23, .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:38
- iteration 2 timer_leak (ruled_out): timer cleanup present on every path; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:39, .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:53
- iteration 2 partial_input_handling (ruled_out): partial input handled and tested; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:31, .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:79
- iteration 2 late_write_handling (ruled_out): post-settle writes are discarded with no crash; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:47
- iteration 3 hint_reorder_correctness (ruled_out): Hint suite green and engine code constrains the hint to target reordering after validation.; evidence=.skilled/bin/tests/compiled-route-surface-hint.test.cjs:1, .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:106
- iteration 3 routing_lockstep_drift (ruled_out): Guard run at HEAD reports every hub fresh.; evidence=.skilled/bin/compiled-route-guard.cjs:1
- iteration 4 narrative_double_count (ruled_out): verified by code read and per-folder probe sums; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002, specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2
- iteration 4 count_regression (ruled_out): per-folder probe arithmetic; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:148
- iteration 5 partial_input_handling (ruled_out): fail-open on partial input is the adapter's stated contract and was already ruled out in iteration 2; no blocking gate depends on the truncated-bytes case for an enforcement boundary; evidence=.skilled/hooks/shared/hook-adapter-shared.cjs:54, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:41
- iteration 5 symlink_containment (ruled_out): walker and writer contain or refuse every symlink case found by direct read; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:188
- iteration 5 shell_injection (ruled_out): no shell interpolation of paths exists at any call site; python and node guards resolve roots from their own file location; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:123, .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:105, .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:49
- iteration 5 information_disclosure (ruled_out): the manifest carries path names only, the fallback is deliberate and documented, and git-backed repos are covered by check-ignore; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:115
- iteration 6 contract_gap (ruled_out): no hole inside the documented contract; every tested shape matches the README contract; evidence=.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:1, .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:1
- iteration 6 stale_test_pin (not_applicable): already registered as R3-COR-001; this run re-confirms it at HEAD and adds no new claim; evidence=.skilled/bin/tests/compiled-route-admission.test.cjs:241
- iteration 7 doc_claim_mismatch (ruled_out): claim did not reproduce: all six suites green and no fixed-routing count assertion exists in scope; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:34
- iteration 7 duplicated_constant (ruled_out): single literal; recorded as a watch item, not a finding; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_router_sync.cjs:16
- iteration 8 spec_code_drift (ruled_out): the remaining spot checks hold; only the two registered mismatches stand; evidence=.skilled/skills/sk-code/sk-code-webflow/SKILL.md:1, .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23, .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:1
- iteration 8 mirror_parity_drift (ruled_out): both mirrored trees pass their checks live; evidence=.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs, .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
- iteration 8 known_limitation_left_open (ruled_out): the only unclosed limitation (REQ-004/T125) is a documented, amended deviation rather than a silent gap; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/tasks.md:163, specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/spec.md:141
- iteration 8 known_limitation_left_open (ruled_out): the four round-three checker limits were implemented or narrowed by 011-005; the remaining one (rare heading forms) is documented by design; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_doc_claims.cjs:81, specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/review/iterations/iteration-007.md
- iteration 9 dead_anchor (ruled_out): no dead anchors found; evidence=MISSING_ANCHORS=0
- iteration 9 dead_link (ruled_out): all raw hits resolve; evidence=MISSING_FILE_LINKS=10
- iteration 9 claim_drift (ruled_out): count matches the recorded baseline; siblings held or fell; evidence=hvr_scan.py output line
- iteration 9 claim_drift (ruled_out): numbers reproduce; the accuracy gap is a documented known limitation under a no-worse bar; evidence=advisor-probe-battery.md:60
- iteration 10 mirror_body_drift (ruled_out): live gate plus dialect greps show no body drift; evidence=.skilled/agents/deep-review.md:214, .claude/agents/deep-review.md:201, .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:143
- iteration 10 cross_reference_breakage (ruled_out): every markdown link resolves; evidence=REPO RULES.md:36, AGENTS.md:296
- iteration 10 gate_coverage_gap (ruled_out): CI fires pre-merge with .pi paths; no live drift; recorded as observation; evidence=.skilled/scripts/git-hooks/pre-commit:259, .github/workflows/spec-kit-check.yml:157, .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: traceability (core spec_code and checklist_evidence; overlay skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability). - Focus area: agents, repo rules and runtime mirrors: commits 3617968e35, 8fdb66cc1b, 864a3bccd8, 40fc64d9cd, b5927055b0 (iteration plan row 10). - Required evidence: named agent, repo-rule and mirror files with file:line refs and live sync-check commands; overlay rows resolved against the reviewed commit range.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
