# Iteration 2: Prior Corpus Reconciliation

## Focus

Separate still-useful prior recommendations from recommendations already implemented in the live mode.

## Findings

- Prior reference-expansion research called md-generator the leanest expansion target and recommended only authoring boundary, source-of-truth card, and one non-SaaS exemplar; it rejected forward authoring, second backends, and duplicated references [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:115-125].
- The live mode now has `references/authoring_boundary.md`, which defines measured, brief-provided, inferred, and absent origins while stating that it adds no capability and does not relax fidelity [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md:18-28].
- The live mode now has `assets/source_of_truth_router_card.md`, which operationalizes the same four origins and stops forward authoring at the card level [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md:16-74].
- The older GPT lineage included a broader prompt skeleton for non-extraction authoring, but the consolidated synthesis reconciled this by keeping boundary docs in scope and forward-authoring capability out of scope [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:179-182].

## What Was Tried And Failed

- Tried to carry forward the prior `authoring_boundary.md` recommendation as a new improvement. It is already implemented, so repeating it would be stale.
- Tried to treat external Stitch guidance as a direct feature source. The live authoring boundary rules it out for this mode.

## Assessment

- newInfoRatio: 0.64
- Novelty: medium-high. The useful shift is from reference expansion to operational improvement.
- Next focus: tooling and setup friction.
