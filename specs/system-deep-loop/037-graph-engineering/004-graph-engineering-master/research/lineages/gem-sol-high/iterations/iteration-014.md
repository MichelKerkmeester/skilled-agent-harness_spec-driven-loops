# Iteration 14: P4 Runtime Mapping

## Focus
Map GEM doctrine onto coverage-graph and contradiction-supersession without inventing code.

## Actions Taken
Inspected live signal and relationship contracts and compared them with knowledge-production needs.

## Findings
1. **[TEXT-CLAIMED][CONFIRM]** The coverage graph already models research question coverage, claim verification, contradiction density, source diversity, and evidence depth; convergence profiles keep loop-local semantics explicit. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:22-56]
2. **[TEXT-CLAIMED][CONFIRM]** Query helpers expose coverage gaps, contradiction pairs, provenance steps, hot nodes, and same-kind consolidation candidates; consolidation is candidate discovery rather than automatic mutation. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:17-82]
3. **[TEXT-CLAIMED][CONFIRM]** Contradiction/supersession candidates are inert, exact-evidence-bound, replay-validated, and projected in additive-dark mode. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:24-96] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/projection.ts:45-113]
4. **[INFERENCE: GEM fills producer semantics, not storage primitives]** Extend coverage metadata and evaluation inputs with ontology/source/extractor/fusion identities and product-quality results; do not change graph nodes into authoritative truth or automate fuzzy consolidation.
5. **[INFERENCE: the coverage graph is a diagnostic projection]** It can reveal low source diversity or unresolved contradictions, but the 036 gateway remains the only transition authority.

## Questions Answered
- Runtime mapping is additive and projection-local; no new control path is required by doctrine.

## Questions Remaining
- P5 temporal containment.

## Ruled Out
- Auto-merging coverage nodes from fuzzy similarity; treating convergence score as authorization.

## Edge Cases
- Similarity metadata may help block candidates but cannot establish real-world identity.

## Sources Consulted
- Live coverage-graph and contradiction-supersession modules.

## Assessment
- New information ratio: 0.31
- Status: complete

## Reflection
The runtime already has the projection vocabulary; the missing work is production provenance and gate evidence.

## Recommended Next Focus
P5 temporal facts versus purpose-bound belief.
