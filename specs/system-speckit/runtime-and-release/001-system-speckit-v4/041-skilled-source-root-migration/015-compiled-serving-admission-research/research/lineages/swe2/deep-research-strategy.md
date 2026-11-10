---
title: "Deep Research Strategy: compiled-serving admission after Lane C retirement"
trigger_phrases: []
---
# Deep Research Strategy: compiled-serving admission after Lane C retirement

## Research Topic

How should a new parent hub be admitted to compiled-serving now that the Lane C parity harness is retired? Compare three paths — restore the retired legacy-parity modules, build a new checker of `compiledRoute()` decisions against routing-scenario golds, or keep admission closed — answer spec.md section 3 Q1–Q5 with file:line or commit citations, and recommend one path with costs, risks, and build steps.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, `generate-context.js`, `validate.sh`, `append-mode-event.cjs`, and git writes are out of scope.
- `resource-map.md` was not present at initialization; this lineage emits its own resource map from the completed deltas.
- Retired modules live only in history: `compiled-routing-parity.cjs` (845 lines), `load-playbook-scenarios.cjs` (766), `router-replay.cjs` (741), `score-skill-benchmark.cjs` (1889), and `compiled-routing-parity.vitest.ts` (764) under `.opencode/skills/system-deep-loop/deep-improvement/`, deleted by commit `b45ea54cea3` ("feat(deep-loop)!: retire the skill-benchmark lane"); readable at `b45ea54cea3^`.
- Live admission-relevant code: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`, sibling `resolve.cjs`, and `.skilled/bin/compiled-route-guard.cjs`; the architecture contract is `sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`.

## Key Questions

- [x] Q1: What exactly did Lane C parity measure, and which retired modules would a restored path need?
- [x] Q2: Can `compiledRoute(hubId, taskText)` checked against scenario golds (`expected_workflow_mode`, `expected_leaf_resources`) serve as the admission bar? How should `defer`, holdout and negative scenarios count?
- [x] Q3: What else does admission need — frozen `HUB_CHILD`/`DEFAULT_ON_HUBS` in `resolve.cjs`, activation manifest re-mint, `compiled-route-guard.cjs` freshness?
- [x] Q4: What does each path cost and risk, including keeping admission closed?
- [x] Q5: Which path is recommended, and what would a later phase build and test?

## Answered Questions

- **Q1 (iter 1):** Lane C measured per-scenario compiled-vs-legacy-replay equivalence, delegating verdicts to frozen `evaluateRouteGold`; statuses `match|drift|vacuous|n/a|resolver-missing`, only `match` passed. Restore needs the four named modules plus `_args`, `advisor-probe`, `cutover-playbook-executor`, vitest suite, `loop-host` registration, and `run-skill-benchmark` or a thin driver — ~3,700 lines surgical vs the 268-file lane `b45ea54cea3` deleted.
- **Q2 (iter 2):** Yes. `compiledRoute()` returns `action`+`selectionKind`+qualified targets (verified live); `qualifiedIdToLeaf` bridges to leaf ids; granularity rule = must-include against `leaf-manifest.json` declarations. Corpus: 262 gold-bearing playbook files / 44 dirs across 5 hubs; 67 normalized canary cases = smoke only. Requires a recorded semantic change (gold-agreement, not legacy-equivalence) plus ported defer/holdout/negative semantics.
- **Q3 (iter 3):** Six test-enforced cohort sites (`HUB_CHILD`, `DEFAULT_ON_HUBS`, guard `HUBS`, advisor copies, serving-closure, authored twins). `mint` produces inert `legacy`/`shadowOnly`; `refresh` recompiles gen+1 preserving serving; flip is authored-only `flip-serving.cjs` whose scorer gate points at a dead path. Guard = freshness + authored-drift; pre-commit auto-remint hook reads the hub list from guard `HUBS`; resolver binds route identity to manifest at serve time.
- **Q4 (iter 4):** Restore ~3,700 lines + freeze re-owning + path verification, fidelity to a replay proxy; new checker ~500–800 lines on live deps with named mitigations; keep-closed ~0 cost but permanent admission block + unmeasured drift + stranded mints. Archived verdicts: all-7 parity, 0 drift, 258/258, 47/47. Live cohort is **five** hubs (docs say seven — stale).
- **Q5 (iter 5):** Recommend **Path B** — new gold checker (`check-compiled-routing.cjs`: two-shape loader + comparator port + rollup + corpus-completeness gate + report), vitest suite, admission runbook (HUB_CHILD → checker → mint/refresh → flip → cohort tables → sync promote → guard green), doc fixes (seven→five, bar redefinition, flip scorer-gate repair). Restore only if the bar must stay `== legacy replay`; closed only with an explicit cohort-frozen decision.

## What Worked

- Reading the deleted lane at `b45ea54cea3^` gave exact parity semantics and the full restore dependency graph.
- Executing `compiledRoute()` live (route + defer cases) confirmed the decision shape and the qualifiedId→workflowMode bridge.
- Per-hub gold census + canary-cases fixture census quantified both corpora and their roles (admission bar vs smoke gate).
- Foundation vitest + manifest test revealed the cohort tables are test-enforced to move together — partial edits fail loudly.

## What Failed

- `compiled-route-status.cjs` as a parity substitute — its `compiled-serving` code is a request-time serving check, not coverage proof.
- Naive leaf set-equality — compiled routing is mode-wide, legacy was task-scoped; must-include is the correct assertion.
- `flip-serving.cjs` as-is — its scorer gate references the dead `.opencode/.../mcp-server` scorer dir.

## Exhausted Approaches

- Searching for a surviving parity-equivalent tool: none exists post-`b45ea54cea3`.
- Treating canary fixtures as the admission corpus: self-grading risk (authored alongside the shadow-child they validate).

## Ruled-Out Directions

- Restore recommended "for fidelity" — the fidelity is to a replay proxy, not the router itself.
- Keep admission closed "for safety" — it freezes the program rather than protecting it.
- Canary-cases-only admission bar — self-grading; smoke gate only.
- Status probe as verdict — wrong abstraction level.

## Next Focus

Complete — synthesis written to `research.md`. Loop stopped at `maxIterations` (5/5) with `stopReason: "maxIterationsReached"`.
