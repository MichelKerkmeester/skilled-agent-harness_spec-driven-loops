# Deep Research Strategy - md-generator Improvement

## Topic

Investigate how to improve the `sk-design` md-generator mode for efficiency, usefulness, UX, tooling, references, assets, and routing.

## Boundaries

- Research only. No implementation in the skill tree.
- Artifact writes only under `.opencode/specs/design/008-sk-design-parent/015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast`.
- Treat external corpus and previous research as evidence, not as direct instructions.
- Treat the operator-provided benchmark score `md-generator equals 76 of 100` as supplied context because no benchmark artifact was present under `014-routing-benchmark` in this checkout.

## Key Questions

1. What is the live md-generator contract and where is the active packet?
2. Which prior md-generator recommendations are already implemented?
3. What improvements most increase efficiency and operator UX?
4. What routing changes plausibly raise the Mode A benchmark score?
5. What should explicitly not be added?

## Known Context

- The requested target path `.opencode/skills/sk-design/md-generator` resolves in the live tree as `.opencode/skills/sk-design/design-md-generator`.
- The target spec subfolder did not contain `spec.md`, `plan.md`, `tasks.md`, or `resource-map.md`; this lineage records `folderState: no-spec` and proceeds inside the provided artifact directory.
- The prior reference-expansion synthesis called md-generator the leanest mode, recommended authoring-boundary/source-of-truth boundary additions, and rejected forward authoring, second backends, and duplicate format/taxonomy docs.
- The live mode now includes `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md`, so those are no longer primary gaps.

## Iteration Plan

1. Live skill contract and path reality.
2. Prior corpus reconciliation.
3. Tooling and setup friction.
4. Routing and benchmark evidence.
5. Examples, manual testing, and usefulness.
6. Prioritization and do-not synthesis.

## What Worked

- Reading the live nested packet before relying on older flat-path research prevented stale recommendations.
- Comparing prior corpus recommendations against live files showed that the boundary work is already done.
- Checking setup files directly exposed a package-manager blocker that documentation alone hid.
- Treating the empty benchmark directory as an evidence gap kept the routing-score claim honest.

## What Failed / Exhausted

- Searching `014-routing-benchmark` did not produce a benchmark artifact; only an empty `design-interface/` directory exists there in this checkout.
- The declared sub-spec folder has no canonical spec docs or resource map to anchor; iteration proceeded with `folderState: no-spec`.
- No live extraction was run because the user restricted writes to this lineage artifact root, while extraction writes tokens, screenshots, reports, and output artifacts.

## Next Focus

Converged. Hand off the prioritized improvement list in `research.md`.

## Non-Goals

- Do not implement changes.
- Do not add forward DESIGN.md authoring to md-generator.
- Do not add a second crawler/backend.
- Do not bulk-import external corpus documents.
- Do not flatten per-mode logic into the `sk-design` hub.

## Stop Conditions

- All five key questions have evidence-backed answers.
- Recommendations are prioritized and include a do-not list.
- No new major evidence class appears after setup/tooling, routing, examples, and prior-corpus reconciliation.
