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
- Review Target: commits 8f59b9bd0a and 1895122d37 on branch worktrees/129-surface-guide (diff d99ddaff7d..1895122d37): README.md marks OpenCode native and Webflow and Obsidian optional examples and rewrites the "What Adapting `sk-code` Looks Like" block into the external-user guide (hooks, keep-rule, removal recipe with ROUTER.md section 11, add recipe, check battery); the sk-code SKILL.md surface sentence, the hub README rows and the regenerated Hermes copy carry the same roles; .skilled/changelog/skilled/v4.0.0.5.md is the next release note (files)
- Started: 2026-10-13T09:30:10.618Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T09:30:10.618Z
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
| 2 | security | security | 0.33 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.25 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 5 | correctness (adversarial re-verification across all dimensions) | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 1 |
| traceability | covered | 1 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.65
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.25 -> 0.00 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=4, ruledOut=14, deferred=1, blocked=0

### Search Debt
- iteration 5 acceptance_ledger_evidence (deferred): ledger rows P11-1 to P11-6 are written at closeout per goal C3; review runs before closeout; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:87

### Ruled-Out Candidates
- iteration 1 wrong_path_or_command (ruled_out): all referenced paths resolve and all command lines match their scripts usage; evidence=README.md:1451, README.md:1474, .skilled/bin/compiled-route-manifest.cjs:30, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:12
- iteration 1 registry_doc_mismatch (ruled_out): verified against both registries; evidence=.skilled/skills/sk-code/mode-registry.json:1, .skilled/skills/sk-code/hub-router.json:1, README.md:800
- iteration 1 missing_instruction_step (ruled_out): battery-relevant artifacts covered by recipe steps plus the commit gate; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:496, .skilled/scripts/git-hooks/pre-commit:480
- iteration 2 untrusted_execution (ruled_out): bare installer invocation installs; own checkout is trusted; other clones documented in README.md:203; evidence=.skilled/scripts/git-hooks/pre-commit:44
- iteration 2 copy_direction_inversion (ruled_out): guide's manual fallback matches the gate; authored is a mirror; no edit instruction exists; evidence=.skilled/scripts/git-hooks/pre-commit:640
- iteration 3 release_note_behavioral_claim (ruled_out): all six bullets trace to phases 001-004 recorded ledgers (P8-4, P8-5, P9-1..P9-6, P10-1..P10-4, VP-1..VP-4); evidence=.skilled/changelog/skilled/v4.0.0.5.md:1, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/implementation-summary.md:1
- iteration 3 upstream_req_traceability_gap (ruled_out): REQ-001, REQ-004 and REQ-005 map and the block carries all six parts; REQ-002 and REQ-003 rest on closeout ledger rows, tracked separately; evidence=README.md:1445, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/goal.md:1
- iteration 4 style_violation (ruled_out): added prose carries none of the three banned punctuation patterns; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch:1, README.md:800, README.md:1384
- iteration 4 documentation_duplication (ruled_out): roles and ranking are consistent across every changed document; evidence=README.md:800, README.md:1384, README.md:1445, .skilled/skills/sk-code/SKILL.md:40, .skilled/skills/sk-code/README.md:23, .hermes/skills/sk-code/SKILL.md:45, .skilled/changelog/skilled/v4.0.0.5.md:1
- iteration 4 template_nonconformance (ruled_out): compact shape matches the template and the validator passes; evidence=.skilled/changelog/skilled/v4.0.0.5.md:1, .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1
- iteration 4 stale_reference (ruled_out): no canonical line replaces OpenCode or presents the three surfaces as peers; the remaining replace-example wording is the active R2-P2-001 subject; evidence=README.md:1384, .skilled/changelog/skilled/v4.0.0.5.md:22, .skilled/skills/sk-code/shared/references/phase-detection.md:16
- iteration 4 stale_reference (ruled_out): the verify battery flags the stale count on the next removal run; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:320
- iteration 4 anchor_integrity (ruled_out): heading and anchor are unchanged and resolve; evidence=README.md:244, README.md:1445, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch:147
- iteration 4 documentation_consistency (ruled_out): the hub README defers to the SKILL.md list at :23 and the role restatements are spec-mandated, not a competing count; evidence=.skilled/skills/sk-code/README.md:23, .skilled/skills/sk-code/SKILL.md:40
- iteration 5 wrong_path_or_command (ruled_out): no new path, order or red-check trip found beyond the four carried P2 advisories; evidence=README.md:1454, README.md:1466, README.md:1445, README.md:1473

### Clean Search Proof
- iteration 1 wrong_path_or_command (ruled_out): all referenced paths resolve and all command lines match their scripts usage; evidence=README.md:1451, README.md:1474, .skilled/bin/compiled-route-manifest.cjs:30, .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:12
- iteration 1 registry_doc_mismatch (ruled_out): verified against both registries; evidence=.skilled/skills/sk-code/mode-registry.json:1, .skilled/skills/sk-code/hub-router.json:1, README.md:800
- iteration 1 missing_instruction_step (ruled_out): battery-relevant artifacts covered by recipe steps plus the commit gate; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:496, .skilled/scripts/git-hooks/pre-commit:480
- iteration 2 untrusted_execution (ruled_out): bare installer invocation installs; own checkout is trusted; other clones documented in README.md:203; evidence=.skilled/scripts/git-hooks/pre-commit:44
- iteration 2 copy_direction_inversion (ruled_out): guide's manual fallback matches the gate; authored is a mirror; no edit instruction exists; evidence=.skilled/scripts/git-hooks/pre-commit:640
- iteration 3 release_note_behavioral_claim (ruled_out): all six bullets trace to phases 001-004 recorded ledgers (P8-4, P8-5, P9-1..P9-6, P10-1..P10-4, VP-1..VP-4); evidence=.skilled/changelog/skilled/v4.0.0.5.md:1, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/implementation-summary.md:1
- iteration 3 upstream_req_traceability_gap (ruled_out): REQ-001, REQ-004 and REQ-005 map and the block carries all six parts; REQ-002 and REQ-003 rest on closeout ledger rows, tracked separately; evidence=README.md:1445, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/goal.md:1
- iteration 4 style_violation (ruled_out): added prose carries none of the three banned punctuation patterns; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch:1, README.md:800, README.md:1384
- iteration 4 documentation_duplication (ruled_out): roles and ranking are consistent across every changed document; evidence=README.md:800, README.md:1384, README.md:1445, .skilled/skills/sk-code/SKILL.md:40, .skilled/skills/sk-code/README.md:23, .hermes/skills/sk-code/SKILL.md:45, .skilled/changelog/skilled/v4.0.0.5.md:1
- iteration 4 template_nonconformance (ruled_out): compact shape matches the template and the validator passes; evidence=.skilled/changelog/skilled/v4.0.0.5.md:1, .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1
- iteration 4 stale_reference (ruled_out): no canonical line replaces OpenCode or presents the three surfaces as peers; the remaining replace-example wording is the active R2-P2-001 subject; evidence=README.md:1384, .skilled/changelog/skilled/v4.0.0.5.md:22, .skilled/skills/sk-code/shared/references/phase-detection.md:16
- iteration 4 stale_reference (ruled_out): the verify battery flags the stale count on the next removal run; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:320
- iteration 4 anchor_integrity (ruled_out): heading and anchor are unchanged and resolve; evidence=README.md:244, README.md:1445, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch:147
- iteration 4 documentation_consistency (ruled_out): the hub README defers to the SKILL.md list at :23 and the role restatements are spec-mandated, not a competing count; evidence=.skilled/skills/sk-code/README.md:23, .skilled/skills/sk-code/SKILL.md:40
- iteration 5 missing_instruction_step (not_applicable): carried P2 R1-P2-001 re-verified and still holds; no new finding claimed this terminal iteration; evidence=README.md:1461, README.md:1461, .skilled/scripts/git-hooks/pre-commit:233
- iteration 5 stale_reference (not_applicable): carried P2 R1-P2-002 re-verified and still holds; no new finding claimed; evidence=README.md:1384, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:86
- iteration 5 destructive_data_loss (not_applicable): carried P2 R2-P2-001 re-verified and still holds; no new finding claimed; evidence=README.md:1456, README.md:1384
- iteration 5 spec_scope_mismatch (not_applicable): carried P2 R3-P2-001 re-verified and still holds; no new finding claimed; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:87
- iteration 5 wrong_path_or_command (ruled_out): no new path, order or red-check trip found beyond the four carried P2 advisories; evidence=README.md:1454, README.md:1466, README.md:1445, README.md:1473

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: cross-reference / synthesis (all four dimensions complete). - Focus area: final pass over the four active P2 advisories against the frozen diff state and the closeout handoff. - Reason: D4 is complete; stop policy max-iterations runs iteration 5. - Rotation status: all dimensions complete; synthesis next. - Blocked/productive carry-forward: R1-P2-001, R1-P2-002, R2-P2-001 and R3-P2-001 remain active P2 advisories; ledger rows P11-1 to P11-6 belong to closeout. - Required evidence: README.md:1456, :1461, :1384, spec.md:91, .hermes/skills/sk-code/SKILL.md:45. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
