# Deep Research Iteration 1 of 2

## Focus
Resolve the two doctor-command contract gaps from source: (1) phraseQuality pollution handling in `/doctor:speckit`, how lookup ranks the affected phrase classes, and the required DOC-349/DOC-350 and test changes; (2) the missing `/doctor:mcp` unknown-flag error and how the other doctor commands reject unknown arguments.

## Questions answered this pass
- What should `/doctor:speckit` do with non-zero phraseQuality diagnostics, given the lookup ranking behavior, and how should DOC-349/DOC-350 and tests change?
- What unknown-flag error should `/doctor:mcp` add, and how do the other doctor command contracts handle unknown arguments today?

## Research actions
Read the doctor command contracts, YAML/presentation, retrieval normalizer/lookup/generator/tests, current diagnostics, and the two manual scenarios. Record precise file/line evidence; distinguish observed source facts from the policy recommendation.

## Scope
Read-only research sources. Iteration narrative, structured delta, and append gateway event stay inside this lineage.
