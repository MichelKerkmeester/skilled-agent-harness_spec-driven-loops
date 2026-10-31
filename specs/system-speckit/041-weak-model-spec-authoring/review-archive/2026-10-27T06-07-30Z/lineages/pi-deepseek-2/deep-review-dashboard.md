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
- Review Target: specs/system-speckit/054-weak-model-spec-authoring (spec-folder)
- Started: 2026-10-25T17:52:23Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-pi-deepseek-2-1792950661620-vss1cp
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

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
| P1 (Required) | 6 |
| P2 (Suggestions) | 18 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness inherited-defect and metadata consistency of the phase parent | correctness | 1.00 | 0/2/3 | complete |
| 2 | traceability of the seven parent completion criteria against recorded evidence | traceability | 0.40 | 0/0/2 | complete |
| 3 | placeholder gate contract cells and orchestrator-versus-shell parity | correctness | 0.29 | 0/0/2 | complete |
| 4 | security and trust boundary of the post-edit placeholder scan and its hook wiring | security | 0.38 | 0/2/1 | complete |
| 5 | sensitivity of the example drift guard and the card sync guard | correctness | 0.30 | 0/1/2 | complete |
| 6 | phase 006 command and agent alignment under skill_agent and agent_cross_runtime | traceability | 0.13 | 0/0/2 | complete |
| 7 | documentation alignment and playbook execution evidence | maintainability | 0.18 | 0/1/2 | complete |
| 8 | benchmark methodology, arithmetic and evidence reproducibility | correctness | 0.10 | 0/0/2 | complete |
| 9 | internal consistency of the v2.3 template contract | maintainability | 0.04 | 0/0/1 | complete |
| 10 | residual security and traceability checks | security/traceability | 0.04 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 12 |
| security | covered | 4 |
| traceability | covered | 4 |
| maintainability | covered | 4 |

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
- Last 3 ratios: 0.10 -> 0.04 -> 0.04
- convergenceScore: 0.96
- openFindings: 24
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
- candidateCoverage: covered=23, ruledOut=21, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 dangling_reference (ruled_out): No waived or superseded row exists in the packet; folder-structure.md:140 makes decision-record.md optional. The dangling pointers that remain are recorded separately as R1-P2-003; evidence=specs/system-spec-kit/references/structure/folder-structure.md:140
- iteration 1 stale_metadata (ruled_out): Both files read Level 2 and the packet is a phase parent without plan.md or tasks.md; evidence=specs/system-speckit/054-weak-model-spec-authoring/description.json:2
- iteration 2 arithmetic_mismatch (ruled_out): Counts reproduce exactly and the before and after cuts are byte-identical; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/b-final.tsv:1
- iteration 2 missing_artifact (ruled_out): Rows and verdicts match the criterion and criteria.txt line C6; evidence=.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv:2
- iteration 2 contradiction (ruled_out): Section labels and the table caption scope the FAIL numbers to the historical first set; only the subject line drifts, recorded as R2-P2-002; evidence=.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:30
- iteration 3 contract_violation (ruled_out): Every cell is asserted against validate.sh and the shell rule, including the warn status; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:83
- iteration 3 implementation_divergence (ruled_out): Normalization and row selection agree; evidence=.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:22
- iteration 4 injection (ruled_out): No shell interpolation on the path; evidence=.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:472
- iteration 4 path_traversal (ruled_out): No link traversal and no absolute-path injection; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:177
- iteration 4 verdict_steering (ruled_out): A non-spec document cannot influence the status gate; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:51
- iteration 5 vacuous_guard (ruled_out): It fails closed; only the message is misleading, recorded as R5-P2-002; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:18
- iteration 5 contract_violation (ruled_out): Every section carries one guidance comment; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:53
- iteration 6 cross_runtime_drift (ruled_out): Every difference is a runtime-specific contract line; evidence=.claude/agents/markdown.md:12
- iteration 6 retired_reference (ruled_out): Every earlier hit was a different file whose name ends in checklist.md; evidence=.skilled/commands/speckit/assets/speckit-complete.yaml:469
- iteration 7 missing_evidence (ruled_out): Every reported row has a transcript and a check file; evidence=specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.txt:1
- iteration 7 missing_evidence (ruled_out): Index coverage is complete for the eight new scenarios; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:346
- iteration 8 arithmetic_mismatch (ruled_out): Every cell reproduces from the stored runs; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.md:12
- iteration 8 brief_drift (ruled_out): One frozen brief on both sides; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/briefs/T005-1.txt:1
- iteration 8 tree_mismatch (ruled_out): The closing commit changed documentation only; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.md:4
- iteration 9 missing_fill_guidance (ruled_out): Every section carries one guidance comment with a good and a weak example; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:53
- iteration 9 stamp_drift (ruled_out): D2 freezes the token gate to v2.3 documents and none of these four is on the weak-model authoring path; evidence=.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:27
- iteration 9 anchor_drift (ruled_out): The examples and the template anchor contract agree; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1
- iteration 10 comment_hygiene (ruled_out): Comments state the durable reason only; evidence=.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:661
- iteration 10 dangling_reference (ruled_out): Paths resolve; the earlier command-prefix defect is already R1-P1-001; evidence=.skilled/skills/system-spec-kit/README.md:625
- iteration 10 status_disagreement (ruled_out): Body statuses agree; only continuity metadata drifted; evidence=specs/system-speckit/054-weak-model-spec-authoring/spec.md:50

### Clean Search Proof
- iteration 1 dangling_reference (ruled_out): No waived or superseded row exists in the packet; folder-structure.md:140 makes decision-record.md optional. The dangling pointers that remain are recorded separately as R1-P2-003; evidence=specs/system-spec-kit/references/structure/folder-structure.md:140
- iteration 1 stale_metadata (ruled_out): Both files read Level 2 and the packet is a phase parent without plan.md or tasks.md; evidence=specs/system-speckit/054-weak-model-spec-authoring/description.json:2
- iteration 2 arithmetic_mismatch (ruled_out): Counts reproduce exactly and the before and after cuts are byte-identical; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/b-final.tsv:1
- iteration 2 missing_artifact (ruled_out): Rows and verdicts match the criterion and criteria.txt line C6; evidence=.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv:2
- iteration 2 contradiction (ruled_out): Section labels and the table caption scope the FAIL numbers to the historical first set; only the subject line drifts, recorded as R2-P2-002; evidence=.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:30
- iteration 3 contract_violation (ruled_out): Every cell is asserted against validate.sh and the shell rule, including the warn status; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:83
- iteration 3 implementation_divergence (ruled_out): Normalization and row selection agree; evidence=.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:22
- iteration 4 injection (ruled_out): No shell interpolation on the path; evidence=.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:472
- iteration 4 path_traversal (ruled_out): No link traversal and no absolute-path injection; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:177
- iteration 4 verdict_steering (ruled_out): A non-spec document cannot influence the status gate; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:51
- iteration 5 vacuous_guard (ruled_out): It fails closed; only the message is misleading, recorded as R5-P2-002; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:18
- iteration 5 contract_violation (ruled_out): Every section carries one guidance comment; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:53
- iteration 6 cross_runtime_drift (ruled_out): Every difference is a runtime-specific contract line; evidence=.claude/agents/markdown.md:12
- iteration 6 retired_reference (ruled_out): Every earlier hit was a different file whose name ends in checklist.md; evidence=.skilled/commands/speckit/assets/speckit-complete.yaml:469
- iteration 7 missing_evidence (ruled_out): Every reported row has a transcript and a check file; evidence=specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.txt:1
- iteration 7 missing_evidence (ruled_out): Index coverage is complete for the eight new scenarios; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:346
- iteration 8 arithmetic_mismatch (ruled_out): Every cell reproduces from the stored runs; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.md:12
- iteration 8 brief_drift (ruled_out): One frozen brief on both sides; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/briefs/T005-1.txt:1
- iteration 8 tree_mismatch (ruled_out): The closing commit changed documentation only; evidence=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.md:4
- iteration 9 missing_fill_guidance (ruled_out): Every section carries one guidance comment with a good and a weak example; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:53
- iteration 9 stamp_drift (ruled_out): D2 freezes the token gate to v2.3 documents and none of these four is on the weak-model authoring path; evidence=.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:27
- iteration 9 anchor_drift (ruled_out): The examples and the template anchor contract agree; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1
- iteration 10 comment_hygiene (ruled_out): Comments state the durable reason only; evidence=.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:661
- iteration 10 dangling_reference (ruled_out): Paths resolve; the earlier command-prefix defect is already R1-P1-001; evidence=.skilled/skills/system-spec-kit/README.md:625
- iteration 10 status_disagreement (ruled_out): Body statuses agree; only continuity metadata drifted; evidence=specs/system-speckit/054-weak-model-spec-authoring/spec.md:50

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No further review iteration is planned: `stopPolicy` is `max-iterations` and this is iteration 10 of 10. Synthesis consolidates 24 findings across four dimensions, derives the verdict from the registry, and records `stopReason: maxIterationsReached`. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
