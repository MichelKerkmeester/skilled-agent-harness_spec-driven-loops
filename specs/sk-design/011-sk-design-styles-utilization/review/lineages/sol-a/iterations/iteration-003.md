# Deep Review Iteration 003

## Dispatcher
- Route: `mode=review`, `target_agent=deep-review`, single LEAF iteration
- Focus: traceability across phase requirements, tasks, checklists, dependency handoffs, and parent metadata
- Budget profile: `scan` (graphless fallback; direct reads and exact grep)

## Files Reviewed
- Parent `spec.md` and `graph-metadata.json`
- Phase 004 and 006 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`
- Phase 005, 007, 008, 009, and 010 dependency declarations, tasks, and checklists
- Child `graph-metadata.json` dependency fields for phases 004-010

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Canonical parent surfaces omit the implementation-phase dependency graph** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:121-126` -- The parent phase map declares handoff criteria but records only the research-to-implementation transition, while phases 005-010 declare eleven predecessor edges in child specs/tasks/checklists and every planned child `graph-metadata.json` keeps `depends_on: []`. The child-local blockers reduce accidental out-of-order work, but parent and graph consumers cannot discover or validate the 004→005/006, 004→007→008/009, and 007/008→010 ordering. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:121-126`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/graph-metadata.json:6-21`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract/spec.md:143-150`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/tasks.md:56-70`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:128-135`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/spec.md:150-159`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/spec.md:143-150`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/spec.md:125-135`]
   - Finding class: matrix/evidence
   - Scope proof: Exact dependency searches covered the parent map, all phase-004–010 specs/plans/tasks/checklists, and every child graph metadata file; child docs contain the dependency edges, but the parent handoff table has no implementation-phase row and all seven planned child `depends_on` arrays are empty.
   - Affected surface hints: `parent phase map`, `child graph metadata`, `resume routing`, `dependency gate validation`
   - Recommendation: Encode the implementation DAG in the owning parent handoff map and the canonical machine-readable dependency fields, then validate the same edges against child blockers.

```json
{"type":"claim-adjudication","findingId":"SOL-A-I003-P1-001","claim":"The canonical parent and graph metadata cannot represent or validate the implementation-phase ordering that child packets require.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:121-126",".opencode/specs/sk-design/011-sk-design-styles-utilization/graph-metadata.json:6-21",".opencode/specs/sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract/spec.md:143-150",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/tasks.md:56-70",".opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:128-135",".opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/spec.md:150-159",".opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/spec.md:143-150",".opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/spec.md:125-135"],"counterevidenceSought":"Reviewed child dependency tables, blocked tasks, predecessor/successor references, parent transition rules, and all phase-004–010 graph dependency fields for an alternate canonical ordering representation.","alternativeExplanation":"Child-local plans and blocked tasks do encode the ordering and all implementation phases remain planned, which limits immediate execution risk; however, those local controls do not populate the parent handoff contract or machine-readable graph.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if graph `depends_on` is proven not to model child-phase sequencing and the owning workflow proves child-local blockers are the sole authoritative, validated ordering source."}
```

### P2 Findings
None.

### Carried P1 Refinements
- `SOL-A-I002-P1-001`: Phase 004 maps REQ-001–REQ-008 into implementation phases, T001–T020, and checklist gates, but canonical-root containment, traversal rejection, and symlink policy remain absent from all four layers. Generic `outside-root` fix-completeness rows in phases 005/009/010 do not own phase-004 hydration. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:122-136`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/plan.md:128-157`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/tasks.md:94-112`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:83-103`]
- `SOL-A-I002-P1-002`: Phase 006 maps its seven requirements through transformer, envelope, leak-gate, retry, and fixture work, but neither tasks nor checklist require data-only parsing, instruction rejection, or behavioral non-influence. `CHK-FIX-001` names a prompt-injection boundary while its linked tests remain exact-value/normalized-span source-leak checks. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:104-117`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/plan.md:110-135`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/tasks.md:65-80`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/checklist.md:78-118`]

## Traceability Checks

| Phase | Requirement → plan/task/checklist result | Dependency handoff result |
|---|---|---|
| 004 | Partial: eight requirements map to implementation work, but filesystem containment has no owned requirement, task, or checklist gate. | Producer role is explicit in children; absent from parent/graph dependency surfaces. |
| 005 | Covered: phase-004 prerequisite and phase-006 successor evidence are explicit and unchecked. | 004→005 and 005→006 are child-local only. |
| 006 | Partial: seven requirements map to work, but behavioral prompt-injection resistance has no owned task or checklist gate. | 004/005 prerequisites are explicit; successor relation is prose-only. |
| 007 | Covered: phase-004 blocker and phase-008 successor are represented in local artifacts. | 004→007→008 is child-local only. |
| 008 | Covered: phase-004/007 prerequisites and phase-009 handoff checks are explicit. | 007→008→009 is child-local only. |
| 009 | Covered: phase-004/007/008 prerequisites are explicit. | Successor 010 is named, but no canonical parent/graph edge exists. |
| 010 | Covered: phase-007/008 prerequisites and external-daemon gate are explicit. | Terminal handoff remains child-local only. |

- `spec_code`: partial — both active security gaps remain unmapped across requirement/plan/task/checklist layers.
- `checklist_evidence`: partial — all phase-004–010 checklists are honestly unchecked; no checked claim was accepted without evidence, but two required security controls have no dedicated checklist item.
- `dependency_handoff`: fail — child-local dependency evidence exists, while the canonical parent handoff table and child graph fields omit the implementation DAG.

## Integration Evidence
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:113-126` names parent transition, resume, recursive-validation, and handoff responsibilities; only the research handoff is encoded.
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/graph-metadata.json:6-21,44` lists all children and planned parent status but no implementation dependency edges.
- Child specs/tasks/checklists for phases 005-010 consistently name their producer/consumer handoffs, confirming that the gap is canonical projection rather than absent local planning.

## Edge Cases
- Structural-impact and semantic graph analysis were unavailable by prompt contract; direct reads and exact grep supplied graphless evidence.
- All implementation phases remain planned and all reviewed checklist items are unchecked, so no completion evidence was inferred.
- Child-local blockers are meaningful counterevidence and prevented P0 classification; they do not make the parent/metadata trace complete.
- The two security results refine existing findings and are not duplicated in `findingsNew`.

## Confirmed-Clean Surfaces
- Phases 005-010 identify their local predecessor requirements and keep dependent tasks/checklists pending.
- No checked phase-004–010 checklist item was found without evidence.
- Phase 008 records a downstream phase-009 handoff; phase 010 keeps the external daemon behind offline gates.

## Ruled Out
- Missing child-local dependency planning: ruled out; child specs, tasks, and checklists contain the expected predecessor and successor references.
- False completion evidence in phases 004-010: ruled out; reviewed checklist rows remain unchecked.
- Generic `outside-root` checklist language in non-owner phases as closure for phase-004 hydration: ruled out because it is not linked to phase-004 requirements, tasks, or hydration fixtures.

## Next Focus
- dimension: maintainability
- focus area: duplication, ownership clarity, and safe follow-on change cost across the seven planned implementation packets
- reason: traceability now covers security-control closure and dependency handoffs; maintainability is the only unchecked dimension
- rotation status: traceability complete; rotate to maintainability
- blocked/productive carry-forward: do not retry completed correctness/security inventories; direct scoped reads and exact searches remain productive
- required evidence: duplicated schema/proof fields, owner boundaries, generated metadata conventions, and phase-local documentation consistency

Review verdict: CONDITIONAL
