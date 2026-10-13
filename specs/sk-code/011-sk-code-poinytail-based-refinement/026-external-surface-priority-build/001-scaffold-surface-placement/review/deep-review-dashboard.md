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
- Review Target: Commit 17bb342b1c on branch worktrees/125-surface-placement: the tieBreak insertion rule in the step_4 hub-router.json activity of both create-skill-parent YAML twins, the two step_6_completion follow-up lines (canary case plus fixture copy; commit with hooks or manual refresh and manifest copy), the same rule in parent-hub-router-schema.md and parent-skills-nested-packets.md, and the sk-create-skill v1.5.4.0 release (SKILL.md version, changelog entry, Hermes copy) (files)
- Started: 2026-10-13T05:59:30.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T05:59:30.000Z
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
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability | maintainability | 0.50 | 0/0/1 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

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
- graphConvergenceScore: 0.65
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.50 -> 0.00
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
- candidateCoverage: covered=2, ruledOut=16, deferred=1, blocked=0

### Search Debt
- iteration 3 checklist_evidence_gap (deferred): T011/T012 own ledger fill and closure; review runs before T012; evidence=implementation-summary.md:48, acceptance-criteria.md:84, tasks.md:58-59

### Ruled-Out Candidates
- iteration 1 cross_file_parity (ruled_out): byte-identical and single-grep-findable; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290
- iteration 1 command_executability (ruled_out): scripts, verbs, and fixture paths all exist; evidence=.skilled/scripts/install-git-hooks.sh:12, .skilled/bin/compiled-route-manifest.cjs:29, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1189, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1271
- iteration 1 generated_copy_drift (ruled_out): no drift detected; evidence=.hermes/skills/sk-create-skill/SKILL.md:5, .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json
- iteration 1 stale_reference (ruled_out): writer inventory complete; version references current; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, .skilled/skills/sk-doc/sk-create-skill/README.md:7
- iteration 1 cross_file_parity (ruled_out): requirement/implementation alignment verified; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:73, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/plan.md:62
- iteration 2 injection_exposure (ruled_out): hubId pattern guard fails closed before any path or argv use; evidence=.skilled/bin/compiled-route-manifest.cjs:49-63, .skilled/bin/lib/compiled-route-manifest.cjs:199-200, .skilled/bin/lib/compiled-route-manifest.cjs:423-427, .skilled/scripts/install-git-hooks.sh:12
- iteration 2 path_traversal (ruled_out): pattern guard plus realpath-basename equality check; evidence=.skilled/bin/lib/compiled-route-manifest.cjs:350-368, .skilled/bin/lib/compiled-route-manifest.cjs:423-427
- iteration 2 routing_precedence_misuse (ruled_out): workflow-over-surface precedence and default-only catch-all intact; evidence=.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290, .skilled/commands/create/assets/create-skill-parent-auto.yaml:423
- iteration 2 fail_open_gate (ruled_out): blocking hook gate plus doctor canary leg; evidence=.skilled/scripts/git-hooks/pre-commit:490-530, .skilled/scripts/git-hooks/pre-commit:575-600, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1273-1285
- iteration 3 spec_code_mismatch (ruled_out): REQ<->AC<->task<->ledger matrix verified complete and spec citation anchors resolved; evidence=spec.md:73, spec.md:104-115, acceptance-criteria.md:54-59, tasks.md:44-59
- iteration 3 release_artifact_inventory (ruled_out): inventory gap resolved to the generated-artifact convention, no defect; evidence=spec.md:84-92, spec.md:74, plan.md:62
- iteration 4 changelog_convention_drift (ruled_out): v1.5.4.0.md matches the sibling changelog structure and frontmatter shape; evidence=.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.3.0.md:1-33
- iteration 4 hardcoded_layout_constant (ruled_out): the literal is the repo layout constant owned by compiled-route-layout.cjs and prose must name a concrete path to stay executable; no divergence found between prose and tooling; evidence=.skilled/scripts/git-hooks/pre-commit:541-548, .skilled/bin/lib/compiled-route-layout.cjs
- iteration 4 reference_doc_version_drift (ruled_out): both edited references carry a fresh minor bump; no edited doc left stale; evidence=.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:12, .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:12
- iteration 4 template_instruction_drift (ruled_out): template placeholder order and checklist instruction do not contradict the insertion rule; the rule is an update-time policy; evidence=.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:188, .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:301
- iteration 4 release_surface_staleness (ruled_out): carried from iteration 1: no current-version reference left stale on the release surface; evidence=.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5, .hermes/skills/sk-create-skill/SKILL.md:5
- iteration 5 spec_code_mismatch (ruled_out): all four sites carry the exact phrase and both completion lines carry the required literals; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:73-74, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:104-107, .skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462
- iteration 5 cross_file_parity (ruled_out): all three changed line groups are identical across the twins; R4-P2-001 records only the missing automated guard, not a live divergence; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, .skilled/commands/create/assets/create-skill-parent-auto.yaml:500-501, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:547-548
- iteration 5 command_executability (ruled_out): verb, flags, and copy direction all match the tooling's own printed fix; evidence=.skilled/bin/compiled-route-manifest.cjs:29-30, .skilled/bin/compiled-route-manifest.cjs:788-799, .skilled/scripts/git-hooks/pre-commit:589-593, .skilled/bin/lib/compiled-route-layout.cjs:50-53

### Clean Search Proof
- iteration 1 cross_file_parity (ruled_out): byte-identical and single-grep-findable; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290
- iteration 1 command_executability (ruled_out): scripts, verbs, and fixture paths all exist; evidence=.skilled/scripts/install-git-hooks.sh:12, .skilled/bin/compiled-route-manifest.cjs:29, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1189, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1271
- iteration 1 generated_copy_drift (ruled_out): no drift detected; evidence=.hermes/skills/sk-create-skill/SKILL.md:5, .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json
- iteration 1 stale_reference (ruled_out): writer inventory complete; version references current; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, .skilled/skills/sk-doc/sk-create-skill/README.md:7
- iteration 1 cross_file_parity (ruled_out): requirement/implementation alignment verified; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:73, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/plan.md:62
- iteration 2 injection_exposure (ruled_out): hubId pattern guard fails closed before any path or argv use; evidence=.skilled/bin/compiled-route-manifest.cjs:49-63, .skilled/bin/lib/compiled-route-manifest.cjs:199-200, .skilled/bin/lib/compiled-route-manifest.cjs:423-427, .skilled/scripts/install-git-hooks.sh:12
- iteration 2 path_traversal (ruled_out): pattern guard plus realpath-basename equality check; evidence=.skilled/bin/lib/compiled-route-manifest.cjs:350-368, .skilled/bin/lib/compiled-route-manifest.cjs:423-427
- iteration 2 routing_precedence_misuse (ruled_out): workflow-over-surface precedence and default-only catch-all intact; evidence=.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290, .skilled/commands/create/assets/create-skill-parent-auto.yaml:423
- iteration 2 fail_open_gate (ruled_out): blocking hook gate plus doctor canary leg; evidence=.skilled/scripts/git-hooks/pre-commit:490-530, .skilled/scripts/git-hooks/pre-commit:575-600, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1273-1285
- iteration 2 secrets_exposure (not_applicable): no credentials or sensitive values introduced; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:500-501, .hermes/skills/sk-create-skill/SKILL.md:5
- iteration 3 spec_code_mismatch (ruled_out): REQ<->AC<->task<->ledger matrix verified complete and spec citation anchors resolved; evidence=spec.md:73, spec.md:104-115, acceptance-criteria.md:54-59, tasks.md:44-59
- iteration 3 release_artifact_inventory (ruled_out): inventory gap resolved to the generated-artifact convention, no defect; evidence=spec.md:84-92, spec.md:74, plan.md:62
- iteration 4 changelog_convention_drift (ruled_out): v1.5.4.0.md matches the sibling changelog structure and frontmatter shape; evidence=.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.3.0.md:1-33
- iteration 4 hardcoded_layout_constant (ruled_out): the literal is the repo layout constant owned by compiled-route-layout.cjs and prose must name a concrete path to stay executable; no divergence found between prose and tooling; evidence=.skilled/scripts/git-hooks/pre-commit:541-548, .skilled/bin/lib/compiled-route-layout.cjs
- iteration 4 reference_doc_version_drift (ruled_out): both edited references carry a fresh minor bump; no edited doc left stale; evidence=.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:12, .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:12
- iteration 4 template_instruction_drift (ruled_out): template placeholder order and checklist instruction do not contradict the insertion rule; the rule is an update-time policy; evidence=.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:188, .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:301
- iteration 4 release_surface_staleness (ruled_out): carried from iteration 1: no current-version reference left stale on the release surface; evidence=.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5, .hermes/skills/sk-create-skill/SKILL.md:5
- iteration 5 spec_code_mismatch (ruled_out): all four sites carry the exact phrase and both completion lines carry the required literals; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:73-74, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:104-107, .skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462
- iteration 5 cross_file_parity (ruled_out): all three changed line groups are identical across the twins; R4-P2-001 records only the missing automated guard, not a live divergence; evidence=.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, .skilled/commands/create/assets/create-skill-parent-auto.yaml:500-501, .skilled/commands/create/assets/create-skill-parent-confirm.yaml:547-548
- iteration 5 command_executability (ruled_out): verb, flags, and copy direction all match the tooling's own printed fix; evidence=.skilled/bin/compiled-route-manifest.cjs:29-30, .skilled/bin/compiled-route-manifest.cjs:788-799, .skilled/scripts/git-hooks/pre-commit:589-593, .skilled/bin/lib/compiled-route-layout.cjs:50-53

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
