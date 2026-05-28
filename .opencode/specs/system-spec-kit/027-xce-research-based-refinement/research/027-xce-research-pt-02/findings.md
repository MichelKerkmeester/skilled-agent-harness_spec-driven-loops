# 027 pt-02 Implementation-Risk Matrix

## Matrix

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

| Phase | IRQ1 | IRQ2 | IRQ3 | IRQ4 | IRQ5 | IRQ6 | IRQ7 | IRQ8 | IRQ9 | IRQ10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 004-skill-advisor-first-action-mandate | N/A | N/A | N/A | BLOCKING | N/A | N/A | N/A | N/A | N/A | CONFIRMED |

## BLOCKING Findings

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

### B-iter004-002

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: `passes_threshold: true` can bypass numeric uncertainty checks in the renderer and producer. Stronger mandate wording would overstate high-uncertainty recommendations.
- Spec.md REQ impacted: Phase 004 REQ-001/REQ-002 (`../../004-skill-advisor-first-action-mandate/spec.md:117-125`).
- Recommended remediation: Re-check uncertainty in render or add producer invariant tests proving `passes_threshold` always encodes the dual threshold.


### B-iter004-004

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: Static first-action hint coverage is inventory-fragile and the spec count is already ambiguous. Unknown safe labels must not render `undefined`.
- Spec.md REQ impacted: Phase 004 REQ-003 (`../../004-skill-advisor-first-action-mandate/spec.md:126-131`).
- Recommended remediation: Use a safe fallback hint and add an unknown-label fixture.


### B-iter004-006

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: Legacy renderer and producer tests pin exact old strings. Implementation will fail unless fixtures are updated intentionally.
- Spec.md REQ impacted: Phase 004 REQ-006 (`../../004-skill-advisor-first-action-mandate/spec.md:142-143`).
- Recommended remediation: Rewrite exact string fixtures and add directive-shape assertions while preserving poisoning/cache/cap coverage.



## CONFIRMED Findings Subset

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

### C-iter004-001

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: The confidence boundary is inclusive at exactly 0.80 in both renderer and producer paths.
- Spec.md REQ impacted: Phase 004 threshold semantics (`../../004-skill-advisor-first-action-mandate/spec.md:117-125`).
- Recommended remediation: Add regression tests for 0.79, 0.80, and 0.81.



## NO-CHANGE-NEEDED Findings Subset

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

### N-iter004-007

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: Prompt-cache hit rate should not change from brief wording because the cache key does not include rendered text.
- Spec.md REQ impacted: Phase 004 non-functional cache behavior (`../../004-skill-advisor-first-action-mandate/spec.md:155-162`).
- Recommended remediation: Update only cached brief expectations that assert old rendered strings.



