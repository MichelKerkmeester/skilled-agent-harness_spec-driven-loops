# Deep Review Iteration 003 — Traceability

## Dispatcher

- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target agent: `deep-review` (definition loaded; LEAF-only)
- Focus: first full `spec_code` and `checklist_evidence` core-protocol audit
- Budget profile: `verify` (graphless direct-read/exact-search workflow)
- Review-depth contract: v2, graphless; structural-impact analysis unavailable by dispatch contract

## Files Reviewed

- Parent `spec.md` and `graph-metadata.json`
- Child 001-003 specs, plans, tasks, implementation summaries, graph metadata, and synthesized `research/lineages/sol/research.md` artifacts
- Child 004-010 specs, tasks, checklists, implementation summaries, and graph metadata through exact status/evidence searches, with phase 004 and 010 summary rereads
- Named `.opencode/skills/sk-design/**` implementation, feature-catalog, and manual-testing-playbook surfaces through exact searches
- Shared severity doctrine: `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Canonical research-output pointers bypass the actual lineage-owned syntheses** — `spec.md:125` — The parent handoff gate names ``001-.../research/research.md`` and all three completed research plans name unlineaged `NNN-.../research/research.md` outputs, but the delivered syntheses live at `research/lineages/sol/research.md`. The correct artifacts exist and substantiate the completion claims, yet the canonical phase-transition and plan pointers lead reviewers and automation to paths that do not exist. [SOURCE: spec.md:123-125] [SOURCE: 001-research-utilization/plan.md:43-48] [SOURCE: 002-md-generator-upgrade/plan.md:43-48] [SOURCE: 003-global-modes-utilization/plan.md:43-48] [SOURCE: 001-research-utilization/implementation-summary.md:60-64]
   - Finding class: cross-consumer
   - Scope proof: Packet-wide exact search found the three stale `research/research.md` plan outputs and the parent placeholder, while the only delivered syntheses are the three `research/lineages/sol/research.md` files; later child specs consistently use the lineage-owned paths.
   - Affected surface hints: parent phase handoff, child 001-003 plans, resume/navigation consumers, validation evidence readers
   - Recommendation: Replace the four canonical output/handoff pointers with the exact lineage-owned synthesis paths, or publish intentional stable aliases and verify them.

```json
{"type":"claim_adjudication","claim":"Canonical handoff/output pointers for completed research resolve to nonexistent unlineaged paths.","evidenceRefs":["spec.md:123-125","001-research-utilization/plan.md:43-48","002-md-generator-upgrade/plan.md:43-48","003-global-modes-utilization/plan.md:43-48","001-research-utilization/implementation-summary.md:60-64"],"counterevidenceSought":"Searched the whole packet for unlineaged and lineage-owned synthesis paths and verified all three lineage-owned research.md artifacts exist.","alternativeExplanation":"The abbreviated parent path may have been intended as prose and the plans may predate command-owned lineage placement, but all four appear in canonical verification/output fields and no stable alias exists.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade to P2 if a supported resolver is shown to interpret these exact placeholders or stable aliases are proven to exist."}
```

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Result | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | Parent phase statuses match child summaries and graph statuses: 001-003 complete; 004-010 planned. Exact searches found no proposed `_engine`, manifest, `CORPUS_CONTEXT_PLAN`, or STUDY runtime artifacts, matching the planned summaries rather than contradicting them. [SOURCE: spec.md:100-111] [SOURCE: 004-retrieval-substrate/implementation-summary.md:48-60] [SOURCE: 010-open-design-transport/implementation-summary.md:44-55] |
| `checklist_evidence` | core | pass | Completed Level-1 research phases have checked tasks with inline evidence and present synthesis/state artifacts; planned phases 004-010 have no checked checklist items and explicitly report implementation not started. [SOURCE: 001-research-utilization/tasks.md:55-84] [SOURCE: 002-md-generator-upgrade/tasks.md:55-84] [SOURCE: 003-global-modes-utilization/tasks.md:55-84] [SOURCE: 005-md-generator-schema-contract/checklist.md:52-197] |
| `feature_catalog_code` | overlay | notApplicable | The implementation phases are planned, packet docs make no feature-catalog delivery claim, and exact packet search found no feature-catalog references to validate. Existing `.opencode/skills/sk-design/feature_catalog/**` therefore does not evidence a claimed packet deliverable. |
| `playbook_capability` | overlay | notApplicable | The implementation phases are planned, packet docs make no manual-playbook delivery claim, and exact packet search found no playbook references to validate. Existing `.opencode/skills/sk-design/manual_testing_playbook/**` is not claimed as phase output. |
| named cross-reference existence | supplemental | fail | The three actual lineage syntheses exist, but the parent handoff and three plan output pointers use nonexistent unlineaged paths (P1-006). |

## Integration Evidence

- `.opencode/skills/sk-design/styles/**`: exact searches confirmed proposed retrieval/proof symbols are absent, consistent with phase 004's planned-only summary.
- `.opencode/skills/sk-design/feature_catalog/**`: inventoried only to adjudicate `feature_catalog_code`; no packet claim linked this overlay to delivered work.
- `.opencode/skills/sk-design/manual_testing_playbook/**`: inventoried only to adjudicate `playbook_capability`; no packet claim linked this overlay to delivered work.
- `research/lineages/sol/{research.md,deep-research-dashboard.md,findings-registry.json,deep-research-state.jsonl}` exists for each completed research child 001-003.

## Edge Cases

- **Refinement, not duplicate:** P1-001 remains active and is strengthened by parent `graph-metadata.json:44,105` (`status: planned`, `last_active_child_id: null`) plus stale parent continuity at `spec.md:15-25`; these are the same lifecycle-navigation root cause, not a new finding.
- Parent aggregate `status: planned` is not itself contradictory while seven implementation children remain planned; the actionable part is stale continuation/last-active navigation already covered by P1-001.
- A literal abbreviated path in a prose sentence might be harmless, but `spec.md:125` places it in the Verification column and each plan labels its stale path as Output, supporting P1 rather than P2.
- Structural-impact analysis was unavailable by dispatch contract; direct reads and exact searches provide the graphless evidence boundary.

## Confirmed-Clean Surfaces

- Parent map and all ten implementation summaries agree on complete versus planned status.
- Child graph statuses agree with their summaries (001-003 complete; 004-010 planned).
- Completed research claims are backed by all three synthesis, dashboard, findings-registry, and state-ledger artifact sets.
- Checked research tasks carry inline evidence; planned checklists contain no prematurely checked items.
- No false shipped-code finding: absent proposed runtime artifacts agree with explicit planned-only summaries.

## Ruled Out

- New metadata-dependency finding: already represented by P1-002 and not duplicated.
- New parent-continuity finding: refined P1-001 instead of creating a second lifecycle finding.
- Missing implementation finding for phases 004-010: ruled out because all seven phases explicitly remain planned.
- Overlay defects: feature-catalog and playbook overlays are not applicable until a packet claim or implementation surface binds them.

## V2 Graphless Search Ledger

- Applicability: `reviewDepthApplicability={version:v2, applicable:true, graphAvailable:false, reason:"dispatch requires graphless direct evidence"}`
- Target selection: parent lifecycle/phase map; completed research evidence in 001-003; planned implementation evidence in 004-010; named sk-design surfaces.
- Coverage: all ten child statuses and summaries, all completed research task evidence/artifact sets, all planned checklist checked-state, proposed runtime symbol absence, named output-path existence, and overlay applicability.
- Ledger: inventory glob → lifecycle/status exact search → completed synthesis/task replay → planned checklist/runtime replay → output-path counterevidence search and direct reread.
- Search debt: transitive consumer impact remains unavailable without a code graph; no active finding relies on that missing evidence.

## Next Focus

- Dimension: maintainability
- Focus area: ownership seams, duplicated contracts, documentation clarity, and safe follow-on change cost across phases 004-010
- Reason: traceability and both core protocols now have a full graphless pass
- Rotation status: first pass
- Blocked/productive carry-forward: direct reads/exact searches productive; memory and graph remain blocked; do not retry false shipped-code or completed core-protocol audits
- Required evidence: shared schema ownership, producer/consumer duplication, phase boundary clarity, and implementation sequencing cost

Review verdict: CONDITIONAL
