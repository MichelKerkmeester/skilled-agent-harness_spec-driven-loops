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
- Review Target: Double-check the staged (uncommitted) rename in this worktree of sk-code-opencode to sk-code-skilled, code-opencode to code-skilled, and the sk-code surface id OPENCODE to SKILLED. Verify against `git diff --cached HEAD`: (1) no OpenCode runtime name was rewritten (.opencode/, cli-opencode, the opencode binary, the runtime id OPENCODE outside the sk-code hub); (2) no live reference to the old identity remains outside the documented exclusions (this packet's docs, .jsonl/.out/.err/.log machine records in specs/, benchmark JSON reports, OPENCODE in spec history); (3) hub routing (mode-registry.json, hub-router.json, graph-metadata.json, leaf-manifest.json, SKILL.md, ROUTER.md), the advisor plugin surface detection, doctor pins, tests and fixtures are mutually consistent; (4) renamed spec folders have consistent description.json/graph-metadata.json identity and no broken relative links; (5) the changelog symlink and hermes mirror are correct. Report P0/P1/P2 findings with path:line evidence. (files)
- Started: 2026-10-18T20:00:07.159Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: 2026-10-18T20:00:06Z
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
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | pending | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.68
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":8,"description":"Dimension coverage (33%) is below threshold (80%). 8 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 4
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
- candidateCoverage: covered=9, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 runtime_name_rewrite (ruled_out): targeted diff scans returned no runtime-name rewrites; evidence=.opencode/plugins/system-skill-advisor.js:705
- iteration 1 registry_inconsistency (ruled_out): cross-surface consistency verified by direct reads; evidence=.skilled/skills/sk-code/hub-router.json:7
- iteration 1 broken_relative_link (ruled_out): old-basename and old-name sweeps clean outside exclusions; evidence=.skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md:1
- iteration 1 mirror_or_symlink_drift (ruled_out): symlink and mirror verified by direct reads; evidence=.skilled/changelog/sk-code/code-skilled, .hermes/skills/sk-code/SKILL.md:45
- iteration 2 runtime_name_rewrite (ruled_out): staged-diff and existence checks show runtime names preserved; evidence=.opencode/plugins/system-skill-advisor.js:363
- iteration 2 stale_identity_residual (ruled_out): live sweep clean outside exclusions; evidence=.skilled/skills/sk-code/benchmark/reports/2026-06-01--router-final--router/skill-benchmark-report.json, .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907
- iteration 2 dangling_or_wrong_symlink (ruled_out): verified by readlink and existence check; evidence=.skilled/changelog/sk-code/code-skilled
- iteration 2 broken_relative_link (ruled_out): JSON.parse and link existence checks passed; evidence=specs/sk-code/002-rust-standards-for-code-skilled/graph-metadata.json
- iteration 2 mirror_drift (ruled_out): generated banner explains the diff; evidence=.hermes/skills/sk-code-skilled/SKILL.md:3
- iteration 2 registry_inconsistency (ruled_out): token scan across routing/plugin/doctor/tests/fixtures; evidence=.skilled/skills/sk-code/hub-router.json:7
- iteration 3 metadata_identity_mismatch (ruled_out): identity fields consistent with renamed folders; evidence=specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-skilled-alignment/description.json:1, specs/sk-code/001-sk-code-parent/027-code-skilled-refinement-research/description.json:1
- iteration 3 stale_identity_reference (ruled_out): every residual falls in a documented exclusion class or an existing finding; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907, specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json:98
- iteration 3 symlink_mirror_drift (ruled_out): symlink resolves and mirror carries the new identity; evidence=.hermes/skills/sk-code-skilled/SKILL.md:1
- iteration 3 broken_relative_link (ruled_out): zero unresolved candidates outside the packet-docs exclusion; evidence=specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/iterations/iteration-001.md:25

### Clean Search Proof
- iteration 1 runtime_name_rewrite (ruled_out): targeted diff scans returned no runtime-name rewrites; evidence=.opencode/plugins/system-skill-advisor.js:705
- iteration 1 registry_inconsistency (ruled_out): cross-surface consistency verified by direct reads; evidence=.skilled/skills/sk-code/hub-router.json:7
- iteration 1 broken_relative_link (ruled_out): old-basename and old-name sweeps clean outside exclusions; evidence=.skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md:1
- iteration 1 mirror_or_symlink_drift (ruled_out): symlink and mirror verified by direct reads; evidence=.skilled/changelog/sk-code/code-skilled, .hermes/skills/sk-code/SKILL.md:45
- iteration 2 runtime_name_rewrite (ruled_out): staged-diff and existence checks show runtime names preserved; evidence=.opencode/plugins/system-skill-advisor.js:363
- iteration 2 stale_identity_residual (ruled_out): live sweep clean outside exclusions; evidence=.skilled/skills/sk-code/benchmark/reports/2026-06-01--router-final--router/skill-benchmark-report.json, .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907
- iteration 2 dangling_or_wrong_symlink (ruled_out): verified by readlink and existence check; evidence=.skilled/changelog/sk-code/code-skilled
- iteration 2 broken_relative_link (ruled_out): JSON.parse and link existence checks passed; evidence=specs/sk-code/002-rust-standards-for-code-skilled/graph-metadata.json
- iteration 2 mirror_drift (ruled_out): generated banner explains the diff; evidence=.hermes/skills/sk-code-skilled/SKILL.md:3
- iteration 2 registry_inconsistency (ruled_out): token scan across routing/plugin/doctor/tests/fixtures; evidence=.skilled/skills/sk-code/hub-router.json:7
- iteration 3 metadata_identity_mismatch (ruled_out): identity fields consistent with renamed folders; evidence=specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-skilled-alignment/description.json:1, specs/sk-code/001-sk-code-parent/027-code-skilled-refinement-research/description.json:1
- iteration 3 stale_identity_reference (ruled_out): every residual falls in a documented exclusion class or an existing finding; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907, specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json:98
- iteration 3 symlink_mirror_drift (ruled_out): symlink resolves and mirror carries the new identity; evidence=.hermes/skills/sk-code-skilled/SKILL.md:1
- iteration 3 broken_relative_link (ruled_out): zero unresolved candidates outside the packet-docs exclusion; evidence=specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/iterations/iteration-001.md:25

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
maintainability

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
