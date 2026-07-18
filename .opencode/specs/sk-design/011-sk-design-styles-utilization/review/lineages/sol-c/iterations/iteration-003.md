# Iteration 3: Traceability Protocols

## Dispatcher

- Budget profile: verify
- Dimension: traceability
- Protocols: `spec_code`, `checklist_evidence`, `feature_catalog_code`, `playbook_capability`
- Prior active findings: F001, F002 (both P1)

## Files Reviewed

- Parent phase map: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:95-125`
- Research task evidence: `001-research-utilization/tasks.md:52-84`, `002-md-generator-upgrade/tasks.md:52-84`, `003-global-modes-utilization/tasks.md:52-84`
- Retrieval research handoff: `001-research-utilization/research/lineages/sol/research.md:367-398`
- Md-generator research safety matrix: `002-md-generator-upgrade/research/lineages/sol/research.md:310-316`
- Global-mode research sequence: `003-global-modes-utilization/research/lineages/sol/research.md:342-400`
- Implementation checklists 004-010, especially their Verification Summary rows.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Verification Summary totals undercount future completion obligations in six implementation packets** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:127-133` -- Exact row counts show the published P0/P1/P2 totals disagree with the actual checklist rows in 004, 006, 007, 008, 009, and 010. Examples: 004 publishes 13/16/6 but contains 15/23/8; 008 publishes 15/15/3 but contains 17/22/8; 009 publishes 12/13/5 but contains 15/23/9. Only phase 005 matches. Because completion uses these summaries to reconcile blocker/required/advisory obligations, an operator can reach the advertised denominator while leaving real rows unchecked.
   - Finding class: matrix/evidence
   - Scope proof: exact anchored checklist-row counts were run over every child checklist using `rg -c '^- \[[ x]\].*\[P[012]\]'`; all seven files were compared to their own summary tables.
   - Affected surface hints: phase 004 checklist, phase 006 checklist, phase 007 checklist, phase 008 checklist, phase 009 checklist, phase 010 checklist
   - Recommendation: derive or mechanically validate the Verification Summary totals from checklist rows; correct all six drifted summaries before any phase completion claim.

```json
{"findingId":"F003","claim":"Six of seven implementation checklists publish P0/P1/P2 Verification Summary totals that do not equal their actual priority-tagged checklist rows.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:127-133",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/checklist.md:147-154",".opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/checklist.md:147-154",".opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/checklist.md:127-133",".opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/checklist.md:133-139",".opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:125-132"],"counterevidenceSought":"Counted only actual checklist bullets beginning with an unchecked/checked box and a P0/P1/P2 tag, excluding protocol legends and summary rows; phase 005 matched exactly, proving the counting method can agree when the summary is correct.","alternativeExplanation":"The summaries could intentionally count a subset, but they are labeled total and provide no exclusion rule; completion semantics treat all P0/P1 rows as obligations.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade to P2 only if the validator computes completion from live rows and explicitly ignores these summary denominators everywhere they appear.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2 Findings

None.

## Findings - Refined

- **F002 remains P1 and gains research-to-plan traceability evidence.** The phase-002 research explicitly requires embedded prompt-injection fixtures (`002.../research.md:310-316`), but phase 006 carries only the name “injection envelope” and authored-draft leakage tests. This rules out the alternative that injection hardening was outside the upstream recommendation.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | research handoffs + child specs | Phase sequencing and planned-status claims align; F002 is an unresolved research-to-implementation safety omission. |
| `checklist_evidence` | pass | hard | research task lines 55-84 | Every checked task in phases 001-003 has substantive evidence; planned checklists contain no checked implementation claims. F003 concerns denominator integrity, not unsupported `[x]` marks. |
| `feature_catalog_code` | notApplicable | advisory | packet inventory | No packet-local feature catalog claims implementation delivery. |
| `playbook_capability` | notApplicable | advisory | packet inventory | No packet-local playbook claims executable capability. |

## Integration Evidence

- Phase 001 research maps directly to phase 004 retrieval controls.
- Phase 002 Phase A/B maps to phases 005 and 006, but prompt-injection fixture coverage is incomplete in phase 006 (F002).
- Phase 003 Phase A-D maps directly to phases 007-010 and preserves the fixed authority order.

## Edge Cases

- Research stopped below ten iterations but each synthesis records legal question-coverage convergence; this is not a completion defect.
- Planned child checklists are intentionally unchecked; only their static summary denominators are wrong.

## Confirmed-Clean Surfaces

- Checked research tasks in 001-003 carry inline evidence that resolves to existing syntheses and state logs.
- Parent phase ordering preserves dependency order for retrieval, schema, STUDY, shared seam, pilots, heavy modes, and transport.
- Phase 005 checklist is the control case whose summary exactly matches its priority rows.

## Ruled Out

- Unsupported checked implementation claims: ruled out; phases 004-010 have no checked implementation rows.
- Missing global-mode consumer: ruled out; phases 007-010 cover the Phase A-D matrix.
- Feature-catalog or playbook drift: not applicable because no such packet-local claims exist.

## Next Focus

- Dimension: maintainability
- Focus area: artifact hygiene, malformed residue, package/path precision, and safe follow-on execution
- Reason: functional/security/traceability coverage is complete; remaining risk is whether the packet can be executed and maintained without ambiguous or corrupted docs.
- Rotation status: correctness, security, traceability covered; maintainability pending.
- Required evidence: exact malformed markers, unresolved proposed paths, duplicated authority definitions, and task/plan consistency.

## Verdict

F001-F003 are active P1 findings; `spec_code` is partial and `checklist_evidence` passes.

Review verdict: CONDITIONAL
