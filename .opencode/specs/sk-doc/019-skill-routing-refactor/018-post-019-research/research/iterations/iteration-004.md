# Iteration 4: Two-Tier Versus Monolithic Leaf Selection

## Focus

This iteration tested whether the repository can support a causal comparison between two-tier required/supplemental leaf selection and the current monolithic union pattern under a fixed route budget. The answer is currently UNKNOWN: the available sealed and typed evidence does not encode the treatment arms, leaf roles, or a common budget, so it cannot establish that either policy wins.

## Actions Taken

1. Inventoried the seven multi-mode hub policies and the five singular compiled-routing units that make up the 12-surface fleet.
2. Compared the surface routers' positive-route assembly rules, including selected-map unioning, ordered bundles, sk-code load tiers, and full-inventory exceptions.
3. Audited the sealed calibration corpora for fleet coverage, selection kinds, target roles, leaf-level gold, and budget fields.
4. Audited all 12 compiled typed route-gold surfaces and the shared schema for required/supplemental labels, leaf costs, outcome labels, and paired-policy predictions.
5. Derived the minimum preregistered experiment and metric family needed to answer the question without relabeling a holdout after observing router output.

## Findings

1. **No current result establishes that two-tier selection beats monolithic unioning.** The live surface routers assemble a deduplicated union of selected intent maps; some cap that union, but none labels emitted leaf resources as required versus supplemental. The sealed calibration corpus and typed route-gold therefore expose only one policy's flat resource set. A single observed policy cannot identify the counterfactual recall of a second policy. This is an evidence gap, not a negative result for two-tier routing. [SOURCE: .opencode/skills/mcp-tooling/shared/references/smart-routing.md:117] [SOURCE: .opencode/skills/sk-design/shared/references/smart-routing.md:141] [SOURCE: .opencode/skills/sk-doc/shared/references/smart-routing.md:209]

2. **The sealed corpus is not a fleet-wide leaf-selection benchmark.** It contains 15 records across only mcp-tooling, sk-code, and system-deep-loop. It covers one ordered bundle and one surface bundle, but its expected leaf resources are flat lists. The route targets use actor, evidence, and transport roles; those are execution-destination roles, not required/supplemental leaf labels. The corpus seal protects calibration integrity, yet it does not make the missing treatment or labels observable. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/008-calibration/001-holdout-corpus/fixtures/corpora/system-deep-loop.v1.json:224] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/008-calibration/001-holdout-corpus/fixtures/corpora/system-deep-loop.v1.json:246]

3. **Typed route-gold cannot represent the proposed comparison.** The shared schema requires observed resources containing only intent and resource, while additional properties are forbidden; it has no leaf role, marginal utility, token cost, or route-budget field. The compiled gold covers deterministic single, bundle, clarify, defer, and reject outcomes, but it is authored conformance evidence rather than paired predictions from two frozen policies on unseen prompts. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/schemas/typed-route-gold.v1.schema.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/schemas/typed-route-gold.v1.schema.json:35]

4. **Raw all-leaf recall is the wrong sole primary metric under a budget.** Monolithic unioning is weakly favored when every gold leaf counts equally and the budget never binds; it emits the complete selected union. Two-tier routing has a plausible advantage only when the budget binds and missing a required leaf costs more than omitting an optional enrichment leaf. The primary metric should therefore be macro required-set recall, paired with exact-required coverage. Supplemental recall, over-selection cost, defer rate, and total normalized route cost are secondary. A route-count cap alone is unfair because current leaf sets vary materially in size; preregistration should bind both canonical-pair count and a normalized token or context-cost budget. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/taxonomy-schema.md:58] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/plan.md:96]

5. **A valid test is a paired, budget-matched ablation.** Before unsealing evaluation prompts: independently label the minimum sufficient required set and the admissible supplemental set; freeze one scorer, tie-break order, abstention rule, pair-count budget, normalized context-cost budget, and failure accounting; then run both policies on every prompt. The two-tier arm admits required leaves first and supplemental leaves by preregistered marginal order. The monolithic arm preserves its current ordered union and applies the same budget without access to role labels. Report per-archetype and macro paired deltas with bootstrap intervals, including all 12 surfaces and explicit slices for single, ordered-bundle, surface-bundle, transport, same-packet-mode, and singular routes. Choose numeric budgets on a fitted development corpus, freeze them, and never tune them on the sealed holdout.

## Questions Answered

- **Does two-tier required/supplemental leaf selection beat monolithic unioning on sealed-holdout recall within a preregistered route budget?**
  - **Not established by current evidence.** Existing artifacts lack paired policy arms, leaf-role gold, and a common budget, so the treatment effect is unidentifiable.
  - **Answerable experiment:** a paired, frozen-policy ablation using independently authored required/supplemental labels and equal pair-count plus normalized context-cost budgets.
  - **Expected direction, not a result:** two-tier should improve required-set recall when the budget binds and optional leaves would otherwise displace essential ones. It need not improve unweighted all-leaf recall.

## Questions Remaining

- Do authored route-gold and typed fixtures predict behavior on unseen natural prompts, or are they overfit?
- What numeric pair-count and normalized context-cost budgets are feasible per routing archetype on a fitted development corpus?
- What per-stratum error budgets should govern low-risk versus mutating/external-effect auto-routing once joined operational outcomes exist?
- Can all supported runtime adapters emit and verify the three-stage leaf-use envelope without storing raw prompts?
- The missing primary hypothesis file still prevents direct comparison with the two claimed post-019 surveys.

## Ruled Out Directions

- **Infer a two-tier win from router schemas alone:** schemas describe allowed structure, not comparative outcomes.
- **Relabel the current sealed corpus after inspecting policy outputs:** that would contaminate the holdout and make the result circular.
- **Use leaf count as the only route budget:** resources have materially different context costs, so equal counts do not imply equal budgets.
- **Claim monolithic unioning is universally worse:** when the budget is unbounded and all leaves are equally valuable, the full union weakly maximizes unweighted set recall.

## Assessment

- New information ratio: 0.68
- Novelty justification: this iteration established that the current sealed and typed evidence cannot identify the treatment effect, separated required-set recall from optional enrichment, and derived a paired preregistered ablation that would answer the question.
- Questions addressed: 1
- Questions answered: 1 as an explicit evidence-gap verdict with a falsifiable experiment
- Confidence: high that the current artifacts are insufficient; medium that two-tier will improve required-set recall until the preregistered ablation is run.

## SCOPE VIOLATIONS

- Progressive synthesis would normally update research/research.md, and the reducer would update strategy, registry, and dashboard state. This dispatch authorizes none of those paths, so those mutations were not executed.
- Adding required/supplemental fields to the typed schema or creating a new holdout experiment would modify researched files outside the allowed write set. Those implementation steps were recorded as findings only.

## Next Focus

Test whether authored route-gold and typed fixtures predict behavior on unseen natural prompts by separating conformance coverage from natural-prompt generalization and auditing the independence of each holdout set.

