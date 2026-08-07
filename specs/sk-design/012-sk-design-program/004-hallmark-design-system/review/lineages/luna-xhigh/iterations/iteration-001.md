# Iteration 1: Correctness

## Focus

Reviewed the phase-parent metadata against all five child packets, then checked the authored-brand export boundary and measured-composition contracts that the child packets claim to ship.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 18
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1, Required

- **F001**: Phase-parent scope and lifecycle metadata omit a completed fifth child — `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:72` — the parent defines exactly four lanes and only maps phases 1-4, while the child packet declares Phase 5 Complete and `graph-metadata.json` lists it as a child. A recursive review or resume path using the parent map can miss the shipped measured-composition lane and retain the parent’s Planned state. Remediation: reconcile the parent scope, phase map, status, and generated metadata with the five-child topology.

```json
{
  "claim": "The hallmark phase parent contains four planned adoption lanes.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:72",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:90",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md:51",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json:11"
  ],
  "counterevidenceSought": "A parent-level phase map or generated child list that excludes the fifth packet by design.",
  "alternativeExplanation": "The fifth packet may be an intentionally separate follow-on, but its parent pointer and graph child registration contradict that interpretation.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "An authoritative parent topology document proves the fifth packet is intentionally outside this phase parent."
}
```

- **F002**: Authored Markdown export is only provenance-marker checked — `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:76` — `refreshAuthoredExports` validates the structured token payload but accepts any Markdown containing `origin: authored`, even though the authored artifact template requires `artifactType`, schema, source description, authored date, and per-value palette/type/voice provenance. The helper can therefore publish a malformed or mismatched `AUTHORED-DESIGN.md` beside a valid `authored-tokens.json`. Remediation: parse and validate the rendered Markdown contract, or make the structured brand the sole source for rendering both exports.

```json
{
  "claim": "Every authored export carries the authored-brand schema and value-level provenance contract.",
  "evidenceRefs": [
    ".opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:76",
    ".opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:80",
    ".opencode/skills/sk-design/shared/authored-brand/authored-design-template.md:25",
    ".opencode/skills/sk-design/shared/authored-brand/authored-design-template.md:38"
  ],
  "counterevidenceSought": "A parser or downstream validator that rejects malformed rendered Markdown before or after this writer runs.",
  "alternativeExplanation": "The caller may guarantee rendered Markdown correctness, but that guarantee is not enforced at the boundary that owns the write.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "A tested caller-level invariant proves renderedDesign is deterministically generated from the validated authoredBrand and cannot be caller-supplied."
}
```

### P2, Suggestion

- **F003**: Paired authored exports are not refreshed atomically — `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:93` — the two independent `writeFile` calls run in `Promise.all`; an interruption or second-write failure can leave `AUTHORED-DESIGN.md` and `authored-tokens.json` from different refreshes. That violates the documented paired-export refresh model under partial I/O failure. Remediation: write a staged pair and rename both only after both contents are durable, or add rollback/consistency recovery.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:72` | Parent topology is stale against child and graph metadata. |
| checklist_evidence | partial | hard | `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/checklist.md:59` | Child evidence covers direct tests but not the malformed-rendered-output or partial-write cases. |
| feature_catalog_code | partial | advisory | `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:76` | Boundary implementation is present; the Markdown contract is not fully enforced. |
| playbook_capability | partial | advisory | `.opencode/skills/sk-design/shared/references/brand-first-lane.md:1` | Procedure documents the pair but no atomic refresh behavior. |

## Assessment

- New findings ratio: 0.55
- Dimensions addressed: correctness
- Novelty justification: parent topology drift, rendered-export validation gap, and pair-write failure semantics were not previously recorded in this lineage.

## Ruled Out

- No evidence that the measured-composition retrieval additions change the default ranking path; the composition terms are only added to the structured score when explicitly requested (`.opencode/skills/sk-design/styles/lib/database/retrieval.mjs:197`).

## Dead Ends

- Coverage-graph evidence was unavailable; direct file reads and exact grep were used instead.

## Recommended Next Focus

Security: adversarial path handling at the authored boundary, plus untrusted-input and clean-room checks in the measured indexer.

Review verdict: CONDITIONAL
