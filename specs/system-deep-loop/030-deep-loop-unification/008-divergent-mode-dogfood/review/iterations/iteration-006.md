# Deep Review Iteration 006

## Dimension

Traceability overlay protocol coverage: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability` across the deep-research iteration artifact contract.

## Files Reviewed

- `.opencode/agents/deep-research.md:61-73,79-93,411-443`
- `.claude/agents/deep-research.md:44-56,60-76,394-426`
- `.opencode/skills/system-deep-loop/deep-research/feature_catalog/feature_catalog.md:46-58`
- `.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop-lifecycle/iteration-dispatch.md:19-43`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md:13-33,47-58,61-88`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/manual_testing_playbook.md:15-30,41-71`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1218-1257,1306-1325`

## Findings by Severity

### P0

None.

### P1

#### R6-P1-001: Deep-research overlay contracts omit the workflow-required delta artifact

- File: `.opencode/agents/deep-research.md:69`
- Evidence: Both runtime LEAF definitions authorize and describe an iteration narrative plus one append-only state record, but neither authorizes or produces `deltas/iter-NNN.jsonl` (`.opencode/agents/deep-research.md:69-73,79-93`; `.claude/agents/deep-research.md:52-56,60-76`). The feature catalog repeats the two-artifact contract (`feature_catalog.md:46-58`; `loop-lifecycle/iteration-dispatch.md:25-29`), and DR-008 declares narrative, JSONL append, and reducer refresh complete while also claiming no feature catalog exists (`iteration-writes-iteration-jsonl-and-strategy-update.md:27-33,47-58,68,88`). The live workflow rejects the iteration when the delta file or its canonical iteration record is absent (`deep_research_auto.yaml:1218-1257`).
- Finding class: cross-consumer.
- Scope proof: Exact searches covered both runtime agent mirrors, the owning deep-research skill, its feature catalog, the DR-008 capability scenario, and the active auto workflow. The OpenCode and Claude contracts match on the relevant write boundary, so this is shared contract drift rather than a single-mirror typo.
- Affected surface hints: `deep-research runtime agents`, `deep-research feature catalog`, `DR-008 playbook`, `post-dispatch validator`.
- Recommendation: Define the delta as a LEAF-owned required artifact in both runtime agents, the feature catalog, and DR-008, then align the playbook's feature-catalog metadata with the extant catalog package.

```json
{"type":"claim_adjudication","findingId":"R6-P1-001","claim":"Deep-research's runtime agents, feature catalog, and DR-008 playbook expose a two-artifact iteration contract that cannot satisfy the live workflow's mandatory per-iteration delta gate.","evidenceRefs":[".opencode/agents/deep-research.md:69-73",".opencode/agents/deep-research.md:79-93",".claude/agents/deep-research.md:52-56",".claude/agents/deep-research.md:60-76",".opencode/skills/system-deep-loop/deep-research/feature_catalog/feature_catalog.md:46-58",".opencode/skills/system-deep-loop/deep-research/feature_catalog/loop-lifecycle/iteration-dispatch.md:25-29",".opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md:27-33",".opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md:68-88",".opencode/commands/deep/assets/deep_research_auto.yaml:1218-1257"],"counterevidenceSought":"Searched both runtime agents and the owning skill, feature catalog, playbook, and workflow for an alternate delta producer or wording that makes the delta optional; the workflow instead explicitly requires the file and canonical iteration record before reducer execution.","alternativeExplanation":"The reducer might have historically created the delta, or the documentation may predate delta rollout. The current workflow validates the delta before invoking the reducer, so neither explanation makes the documented LEAF contract executable.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade to P2 only if the live workflow is changed to generate the delta independently before validation or to make it optional without reducing recovery and convergence guarantees.","transitions":[{"iteration":6,"from":null,"to":"P1","reason":"Initial discovery during overlay protocol coverage"}]}
```

### P2

None.

## Traceability Checks

| Protocol | Level | Status | Evidence | Result |
|---|---|---|---|---|
| `spec_code` | core | partial | `.opencode/commands/deep/assets/deep_research_auto.yaml:1218-1257`; `deep-research/feature_catalog/loop-lifecycle/iteration-dispatch.md:25-29` | The executable workflow requires a delta that the owning catalog omits. |
| `checklist_evidence` | core | covered | `review/iterations/iteration-005.md:51-60` | Retained from the dedicated stabilization pass; not reopened. |
| `skill_agent` | overlay | fail | `.opencode/agents/deep-research.md:69-73,79-93`; `deep-research/feature_catalog/feature_catalog.md:46-58` | Agent and skill-facing catalog omit the required delta artifact. |
| `agent_cross_runtime` | overlay | pass | `.opencode/agents/deep-research.md:69-73,411-443`; `.claude/agents/deep-research.md:52-56,394-426` | The two mirrors agree on the reviewed write boundary; the shared contract is stale rather than runtime-divergent. |
| `feature_catalog_code` | overlay | fail | `deep-research/feature_catalog/loop-lifecycle/iteration-dispatch.md:25-29`; `.opencode/commands/deep/assets/deep_research_auto.yaml:1218-1257` | Catalog behavior omits the validator-required delta. |
| `playbook_capability` | overlay | fail | `deep-research/manual_testing_playbook/iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md:27-33,68-88` | DR-008 omits the delta and falsely reports that no dedicated feature catalog exists. |

## Verdict

CONDITIONAL. One new P1 cross-consumer traceability finding is active. All four overlay protocols now have explicit evidence in this pass; cross-runtime parity passes, while skill-agent, feature-catalog-code, and playbook-capability fail on the shared missing-delta contract.

## Next Dimension

Convergence evaluation with active P1 remediation still required. A later pivot must choose a direction outside this completed deep-research overlay slice.

Review verdict: CONDITIONAL
