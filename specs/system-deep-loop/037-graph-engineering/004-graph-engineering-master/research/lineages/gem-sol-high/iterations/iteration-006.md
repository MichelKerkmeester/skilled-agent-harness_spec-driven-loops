# Iteration 6: P1/P4 Knowledge-Plane Quality Gate

## Focus
Define what must pass before fusion.

## Actions Taken
Audited GEM quality instructions and evaluation workflow against evidence-gate doctrine.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Before fusion, sample entity and relation outputs, measure whether entities are real/correctly typed and whether source text asserts each edge, repair the producer, and rerun. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:76-80]
2. **[TEXT-CLAIMED][REFINE]** The ≥90% precision on 50 items is a pedagogical pilot threshold, not a universal release criterion; production gates need per-source confidence intervals, risk weighting, and recall/coverage expectations. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:88-94] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:148-162]
3. **[TEXT-CLAIMED][ADOPT]** Evaluation must detect train/prompt-development leakage and compare claimed performance against trivial baselines. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:156-162]
4. **[INFERENCE: fusion multiplies upstream false positives and makes repair harder]** Gate each source family and stage independently before cross-source fusion; a global average can hide a poisoned producer.

## Questions Answered
- Data-quality gates are producer/stage/source specific and precede fusion.

## Questions Remaining
- Fusion mechanics and reversibility.

## Ruled Out
- Hand-editing bad outputs; a single aggregate quality score.

## Edge Cases
- High precision alone does not prove adequate recall or downstream answer coverage.

## Sources Consulted
- GEM SKILL and `/kg-extract`/`/kg-eval` workflows.

## Assessment
- New information ratio: 0.60
- Status: complete

## Reflection
Quality evidence is distinct from runtime parity evidence even when both control promotion.

## Recommended Next Focus
P1 fusion pipeline and reversibility.
