# Iteration 12: P3 Ontology as Versioned Dependency

## Focus
Derive safe change doctrine while avoiding invented mechanisms.

## Actions Taken
Compared ontology consumers with 036's existing version/read/replay policy.

## Findings
1. **[TEXT-CLAIMED][CONFIRM]** GEM names one ontology file as source of truth and requires every extraction prompt to consume it. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:56-59]
2. **[TEXT-CLAIMED][CONFIRM]** 036 already requires current writers, registered adjacent upcasters for supported old events, refusal of unknown/new versions, and no partial projection from incomplete mixed-version replay. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:90-119]
3. **[INFERENCE: apply dependency discipline, not event-envelope identity, to ontology]** The design needs an immutable ontology version/digest referenced by extraction and evaluation artifacts; a schema change must classify affected source mappings, prompts, fusion rules, competency questions, and serving evaluations, then regenerate or explicitly retain old evidence under its original version.
4. **[INFERENCE: ontology compatibility is semantic and may not be safely upcast]** Renames, splits, merges, domain/range changes, and altered canonicalization can change meaning; fail closed on ambiguous mappings instead of mechanically borrowing 036 event upcasters.

## Questions Answered
- P3 requires versioned dependency and change-impact evidence, but GEM does not justify a specific wire contract.

## Questions Remaining
- Compose knowledge-quality and runtime-parity evidence.

## Ruled Out
- Silent in-place ontology edits; claiming event upcasters automatically solve semantic ontology migration.

## Edge Cases
- Additive vocabulary can still alter candidate routing and evaluation denominators.

## Sources Consulted
- GEM modeling; 036 transition/versioning policy.

## Assessment
- New information ratio: 0.39
- Status: insight

## Reflection
The safe doctrine is dependency pinning plus impact analysis; exact serialization remains an implementation decision.

## Recommended Next Focus
P4 three evidence-gate families.
