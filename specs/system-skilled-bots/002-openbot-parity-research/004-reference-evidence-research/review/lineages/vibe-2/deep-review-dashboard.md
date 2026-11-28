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
- Review Target: Review the finished reference evidence research in specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/: the synthesis research.md, its regrade-log.md and the 40 iteration records under research/lineages/. Check that each recommendation is backed by the reference and plan lines it cites, that grades are right, that rejected findings were rightly rejected, that no well-supported finding was missed, and that recommendations do not contradict each other, the packet decisions or the licence rules. Read-only against the research, the 003 build plan and the reference repos. (files)
- Started: 2026-11-27T09:16:08.989Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-vibe-2-1795770902266-zziqbr
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/1 | complete |
| 5 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 6 | security | security | 1.00 | 0/0/1 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 8 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 9 | Correctness of phases 009-014 and the sixteen net-new candidates with their ranked order | correctness | 1.00 | 0/0/0 | complete |
| 10 | Traceability: cross-cutting consistency, the packet decisions D1-D6 and the licence rule the document states for itself | traceability | 1.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 2 |
| traceability | covered | 2 |
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
- Last 3 ratios: 0.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
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
- graphCoverageMode: none
- candidateCoverage: covered=15, ruledOut=16, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 grade_inflation (ruled_out): verified by direct read of each cited reference and plan line; evidence=specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:9-13, specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs:34-47, specs/system-skilled-bots/context/buzz-main/crates/buzz-acp/src/pool.rs:2284-2289
- iteration 1 plan_side_miss (ruled_out): the plan-side searches in the rows reproduce; evidence=specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md:88, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md:68
- iteration 2 licence_misgrade (ruled_out): Every repo licence matches the map, including the OpenMausBot enterprise carve-out and the two GPL-3.0-only declarations; evidence=specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2, specs/system-skilled-bots/context/tinychannels-main/Cargo.toml:55, specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:24
- iteration 2 secret_leak_gap (ruled_out): patterns.rs:248-249 imports STANDARD, STANDARD_NO_PAD, URL_SAFE and URL_SAFE_NO_PAD, so the gap is real; evidence=specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-249, specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:73
- iteration 2 plan_side_miss (ruled_out): The plan states no precedence, so the guard is needed; evidence=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:181-184
- iteration 3 count_arithmetic (ruled_out): All seven group rows and the totals row are exact in all six outcome columns and in the kept/confirmed/weak columns; evidence=research/regrade-log.md:1-372, research/research.md:625-636
- iteration 3 rejection_correctness (ruled_out): openhuman-main/vendor holds 21 empty folders, tiny-artifacts has a README, tinywallet is recorded at research.md:464, the 012 stub executor exists, the scorer line is evals/README.md:21, cron_refuses sits at host_tool.rs:19-26, and plan.ts:54-60 records the empty-subject match; evidence=specs/system-skilled-bots/context/openhuman-main/vendor/, specs/system-skilled-bots/context/openhuman-full/vendor/tiny-artifacts/README.md:1-4, specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:21, specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:54-60
- iteration 4 count_arithmetic (ruled_out): Every group row and the totals row match to the cell; evidence=research/research.md:64-437, research/research.md:438-467, research/research.md:468-515
- iteration 4 heading_completeness (ruled_out): 001-activity-and-actor through 015-deep-review match character for character; evidence=specs/system-skilled-bots/003-openbot-parity-build/
- iteration 5 citation_mismatch (ruled_out): turnstone memory.md:38-39, OpenGhost memory.js:11 and :37, approvals.md:5 and :40, approval-outcomes.ts:22-23, app-grants queries.ts:6-12, 008 spec:151 and :169, backends.md:47 and :63-65, leak-checks.md:61 all say what the rows claim; evidence=specs/system-skilled-bots/context/turnstone-main/docs/memory.md:38-39, specs/system-skilled-bots/context/OpenGhost-main/memory.js:11, specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:5, specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:63-65
- iteration 5 plan_side_miss (ruled_out): The kind order differs from approvals.md:5, remove sits in the delete list against approvals.md:40, and memory false contradicts REQ-010; evidence=specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:99, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/fixtures/action-kinds.json:19, specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:96
- iteration 6 transport_retry_map (ruled_out): All three reproduce in the reference source; evidence=specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1975-1977, specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs:12, specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:150-190
- iteration 6 grant_bound (ruled_out): A search for classifyAction and function classify in approvals.ts returns no hit; evidence=specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:62-69
- iteration 7 tag_resolution (ruled_out): 947 of 947 resolve, with no missing path, no out-of-range line and no tag without a line; evidence=research/research.md, research/regrade-log.md
- iteration 7 count_recompute (ruled_out): 616 and 331 tags, 20 manifests with a licence line of which 18 are GPL-3.0-only and 2 GPL-3.0-or-later, tinyvoice with none, and 55 files 9601 lines 9526 under src in both checkouts; evidence=specs/system-skilled-bots/context/openhuman-full/vendor/, specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui
- iteration 7 quote_accuracy (ruled_out): S3:111 reads Reference code to study first none in C, and S3:221 reads Reference to study first no context repository applies, both as quoted; evidence=specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:111, specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:221
- iteration 8 rank_permutation (ruled_out): The order is 1,2,3,11,4,5,7,6,8,9,10,12,13,14,15,16, a permutation of 1 to 16 with exactly candidate 11 up and candidate 7 above candidate 6; evidence=research/research.md:495, research/research.md:497-512
- iteration 8 skip_row_evidence (ruled_out): The three crate READMEs, LICENSING.md:6-9, S1:168, B/spec.md:99, L/posture.ts:5-6 and 002 spec:168 all say what the rows claim, and the regrade pointer resolves to :312; evidence=specs/system-skilled-bots/context/openhuman-full/vendor/tinybox/README.md:3, specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:3, specs/system-skilled-bots/context/openhuman-full/vendor/tinyhosts/README.md:3-4, specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:168, specs/system-skilled-bots/003-openbot-parity-build/spec.md:99
- iteration 8 candidate_claim (ruled_out): AGENT_STALL_TIMEOUT_MS watches the stall, writes agent.stream_stalled and switches off when unset or 0, as the row says; evidence=specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:190-194, .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:82

### Clean Search Proof
- iteration 1 grade_inflation (ruled_out): verified by direct read of each cited reference and plan line; evidence=specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:9-13, specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs:34-47, specs/system-skilled-bots/context/buzz-main/crates/buzz-acp/src/pool.rs:2284-2289
- iteration 1 plan_side_miss (ruled_out): the plan-side searches in the rows reproduce; evidence=specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md:88, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md:68
- iteration 2 licence_misgrade (ruled_out): Every repo licence matches the map, including the OpenMausBot enterprise carve-out and the two GPL-3.0-only declarations; evidence=specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2, specs/system-skilled-bots/context/tinychannels-main/Cargo.toml:55, specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:24
- iteration 2 secret_leak_gap (ruled_out): patterns.rs:248-249 imports STANDARD, STANDARD_NO_PAD, URL_SAFE and URL_SAFE_NO_PAD, so the gap is real; evidence=specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-249, specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:73
- iteration 2 plan_side_miss (ruled_out): The plan states no precedence, so the guard is needed; evidence=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:181-184
- iteration 3 count_arithmetic (ruled_out): All seven group rows and the totals row are exact in all six outcome columns and in the kept/confirmed/weak columns; evidence=research/regrade-log.md:1-372, research/research.md:625-636
- iteration 3 rejection_correctness (ruled_out): openhuman-main/vendor holds 21 empty folders, tiny-artifacts has a README, tinywallet is recorded at research.md:464, the 012 stub executor exists, the scorer line is evals/README.md:21, cron_refuses sits at host_tool.rs:19-26, and plan.ts:54-60 records the empty-subject match; evidence=specs/system-skilled-bots/context/openhuman-main/vendor/, specs/system-skilled-bots/context/openhuman-full/vendor/tiny-artifacts/README.md:1-4, specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:21, specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:54-60
- iteration 4 count_arithmetic (ruled_out): Every group row and the totals row match to the cell; evidence=research/research.md:64-437, research/research.md:438-467, research/research.md:468-515
- iteration 4 heading_completeness (ruled_out): 001-activity-and-actor through 015-deep-review match character for character; evidence=specs/system-skilled-bots/003-openbot-parity-build/
- iteration 5 citation_mismatch (ruled_out): turnstone memory.md:38-39, OpenGhost memory.js:11 and :37, approvals.md:5 and :40, approval-outcomes.ts:22-23, app-grants queries.ts:6-12, 008 spec:151 and :169, backends.md:47 and :63-65, leak-checks.md:61 all say what the rows claim; evidence=specs/system-skilled-bots/context/turnstone-main/docs/memory.md:38-39, specs/system-skilled-bots/context/OpenGhost-main/memory.js:11, specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:5, specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:63-65
- iteration 5 plan_side_miss (ruled_out): The kind order differs from approvals.md:5, remove sits in the delete list against approvals.md:40, and memory false contradicts REQ-010; evidence=specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:99, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/fixtures/action-kinds.json:19, specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:96
- iteration 6 transport_retry_map (ruled_out): All three reproduce in the reference source; evidence=specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1975-1977, specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs:12, specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:150-190
- iteration 6 grant_bound (ruled_out): A search for classifyAction and function classify in approvals.ts returns no hit; evidence=specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:62-69
- iteration 7 tag_resolution (ruled_out): 947 of 947 resolve, with no missing path, no out-of-range line and no tag without a line; evidence=research/research.md, research/regrade-log.md
- iteration 7 count_recompute (ruled_out): 616 and 331 tags, 20 manifests with a licence line of which 18 are GPL-3.0-only and 2 GPL-3.0-or-later, tinyvoice with none, and 55 files 9601 lines 9526 under src in both checkouts; evidence=specs/system-skilled-bots/context/openhuman-full/vendor/, specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui
- iteration 7 quote_accuracy (ruled_out): S3:111 reads Reference code to study first none in C, and S3:221 reads Reference to study first no context repository applies, both as quoted; evidence=specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:111, specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:221
- iteration 8 rank_permutation (ruled_out): The order is 1,2,3,11,4,5,7,6,8,9,10,12,13,14,15,16, a permutation of 1 to 16 with exactly candidate 11 up and candidate 7 above candidate 6; evidence=research/research.md:495, research/research.md:497-512
- iteration 8 skip_row_evidence (ruled_out): The three crate READMEs, LICENSING.md:6-9, S1:168, B/spec.md:99, L/posture.ts:5-6 and 002 spec:168 all say what the rows claim, and the regrade pointer resolves to :312; evidence=specs/system-skilled-bots/context/openhuman-full/vendor/tinybox/README.md:3, specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:3, specs/system-skilled-bots/context/openhuman-full/vendor/tinyhosts/README.md:3-4, specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:168, specs/system-skilled-bots/003-openbot-parity-build/spec.md:99
- iteration 8 candidate_claim (ruled_out): AGENT_STALL_TIMEOUT_MS watches the stall, writes agent.stream_stalled and switches off when unset or 0, as the row says; evidence=specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:190-194, .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:82

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining — correctness and traceability are both complete across the whole target
- Focus area: synthesis — the review report, the Planning Packet built from the nine active findings, and the final verdict
- Reason: the iteration budget is spent at 10 of 10, and every configured dimension has been swept. The remaining work is to state the verdict and hand the findings to the merge.
- Rotation status: correctness complete for 001-014 and section 5; traceability complete for the packet decisions, the licence rule and the cross-cutting counts
- Blocked/productive carry-forward: productive — the cross-cutting read found the one count that does not close, which no single-phase read could see
- Required evidence: the nine active P2 findings, the findings registry, and the reducer's convergence figures
- Recovery note: not applicable

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 9 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
