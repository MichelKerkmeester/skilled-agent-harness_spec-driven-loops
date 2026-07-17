# Iteration 7: Traceability - frozen-map interface completeness

## Dispatcher

- Route: 'mode=review target_agent=deep-review'
- Scope: central inventory/map producer and its downstream handoff contract

## Files Reviewed

- '006-inventory-and-frozen-map/spec.md'
- '006-inventory-and-frozen-map/plan.md'
- '006-inventory-and-frozen-map/tasks.md'
- '006-inventory-and-frozen-map/checklist.md'
- Rename-engine and component-consumer references to the frozen map

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F007 - The frozen-map phase does not define its durable consumer interface** -- '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:37' -- Phase 006 is the required producer of the repo-wide candidate classification, bijective rename map, SCC batches, BASE binding, and digest [SOURCE: '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/spec.md:47-76']. Its plan defers detailed design until execution and never names an artifact path, serialization format, row/schema fields, canonical ordering, digest algorithm/input framing, or versioning contract [SOURCE: '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:37-38'; '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:56-94']. Tasks and checklist repeat outcome assertions but do not close that interface [SOURCE: '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/tasks.md:45-61'; '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/checklist.md:50-61']. Downstream engines and 156 execution leaves cannot consume or independently hash the same frozen state from this contract.
   - Finding class: cross-consumer
   - Scope proof: Exact map/schema/artifact/path/digest searches across all phase-006 docs and named downstream consumers found semantic requirements but no durable interface.
   - Affected surface hints: 'phase 006 output', 'rename engine input', 'component batch receipts', 'whole-repo gate'
   - Recommendation: Define and version canonical inventory, map, classification, and batch artifacts with exact paths, schemas, ordering, BASE fields, digest framing/algorithm, and consumer validation rules.

~~~json
{"findingId":"F007","type":"traceability","claim":"The central frozen-map producer specifies outcomes but no durable artifact schema or location that downstream phases can consume and hash consistently.","evidenceRefs":[".opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/spec.md:47-76",".opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:37-38",".opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:56-94",".opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/checklist.md:50-61"],"counterevidenceSought":"Searched all phase-006 canonical docs and downstream frozen-map references for schema, artifact path, serialization, ordering, digest algorithm, and version fields; none defines the interface.","alternativeExplanation":"Implementation-time design could fill these details, but downstream phase contracts already depend on a stable map/hash and cannot be independently authored or verified without them.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade when a cited versioned artifact contract defines byte-level digest inputs and every consumer validates that contract."}
~~~

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| 'spec_code' | fail | hard | phase 006 spec/plan/tasks | Required producer interface is undefined. |
| 'checklist_evidence' | fail | hard | phase 006 checklist ':50-61' | Checks assert properties without identifying the artifact under test. |

## Confirmed-Clean Surfaces

- The semantic invariants are sound: complete classification, bijection, collision checks, SCC closure, and BASE binding are all required.
- Phase 006 clearly owns production; phase 005 clearly owns tooling.

## Ruled Out

- **No classification denominator**: the inventory is explicitly recomputed and unknowns are forbidden.
- **No dependency closure rule**: SCC-based batching is explicit.

## Next Focus

- Dimension: correctness
- Focus area: root-name compatibility lifecycle from phase 002 through alias removal and final gate
- Required evidence: open/close window invariants, conflict fixtures, writers versus readers, and early-removal protection

## Assessment

- New findings: P0=0 P1=1 P2=0
- New findings ratio: 0.143
- Status: complete
- Verdict basis: new P1 cross-consumer interface gap

Review verdict: CONDITIONAL
