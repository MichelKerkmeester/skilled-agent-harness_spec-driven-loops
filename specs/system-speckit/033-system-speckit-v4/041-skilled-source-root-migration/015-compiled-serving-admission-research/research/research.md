---
title: "Compiled-Serving Admission After Lane C: Research Synthesis"
description: "How a new parent hub can be admitted to compiled-serving now that the Lane C parity harness is retired. Two independent lineages recommend a new checker of compiled decisions against authored routing gold, with the admission bar restated."
trigger_phrases:
  - "compiled-serving admission research"
  - "lane c parity replacement"
  - "compiled routing gold checker"
  - "compiled routing admission path"
importance_tier: "important"
contextType: "research"
---

# Compiled-Serving Admission After Lane C: Research Synthesis

## 1. Executive Summary

**Recommendation: build a new checker that runs each hub's compiled decision against its playbook's authored routing gold (Path B), and restate the admission bar it enforces.** Both lineages reached this independently, on different models, from the same five questions. The checker needs only live code and data: `compiledRoute()`, the `qualifiedIdToLeaf` bridge, each hub's `leaf-manifest.json`, and 73 hub-level playbook scenarios that already carry typed gold. Restoring the retired parity path (Path A) would bring back about 4,200 lines of the lane phase 13 removed, three of them SHA-256-pinned. Keeping admission closed (Path C) costs nothing to build, but it freezes the cohort and leaves the admitted hubs with no standing measurement.

The one real cost of Path B is semantic, and it is the operator's decision: the bar moves from "compiled equals the legacy replay on every scenario" to "compiled satisfies the authored routing gold on every scored scenario, with coverage floors". Two corrections to this phase's charter also came out of the run and were confirmed by hand: the admitted cohort is **five** hubs, not seven, and the authored tool that flips a hub to compiled serving is **broken** today.

## 2. Research Question and Scope

How should a new parent hub be admitted to compiled-serving now that the Lane C parity harness is retired? The run compared three paths — restore the retired legacy-parity path, build a new checker against routing gold, keep admission closed — through five questions (Q1 to Q5, `../spec.md` section 3). Research only; no code was changed.

## 3. Method and Executors

A two-lineage fan-out through `/deep:research`, five iterations each, stop policy `max-iterations`, so convergence was telemetry and no lineage stopped early.

| Lineage | Executor | Model | Iterations | newInfoRatio by iteration |
|---------|----------|-------|------------|---------------------------|
| `swe2` | cli-devin | `swe-2-max` | 5 | 0.95, 0.90, 0.92, 0.85, 0.55 |
| `deepseek` | cli-pi | `deepseek-v4.1-flash` (LLM Gateway, max effort) | 5 | 1.0, 0.85, 0.80, 0.55, 0.35 |

Each lineage took one question per iteration and wrote its own synthesis (`lineages/*/research.md`). Both completed with no retries (`orchestration-summary.json`).

## 4. Sources and Evidence Quality

Both lineages read the retired modules at `b45ea54cea3^`, the live runtime engine and resolver, the manifest, guard and sync tooling, the authored cutover tooling under `specs/sk-doc/019-skill-routing-refactor/`, the hub playbooks and leaf manifests, CI workflows and commit history. Every load-bearing claim cites a `file:line`, a git object or a command. The orchestrator re-checked the claims that decide the recommendation (section 14).

## 5. Q1 — What Lane C Parity Measured, and What a Restore Needs

Lane C measured, per playbook scenario, whether the live compiled decision matched a deterministic replay of the legacy prose router. The compiled side came through the public front door with the flag forced on; the legacy side was `router-replay.cjs` replaying the hub's `INTENT_SIGNALS`/`RESOURCE_MAP` with substring scoring — a model of the router, not the router. [SOURCE: `compiled-routing-parity.cjs@b45ea54cea3^:7-45,211-217`; `router-replay.cjs@b45ea54cea3^:1-33`]

Three guards kept it honest: a vacuous-parity guard (the manifest must read `servingAuthority: "compiled"`), a shape bridge (compiled qualified ids resolved through `qualifiedIdToLeaf`, with mode-wide leaves projected down to legacy's task-scoped granularity), and a frozen-scorer pin (SHA-256 digests of the scorer trio checked before and after a run). Statuses were `match`, `drift`, `vacuous`, `n/a` and `resolver-missing`; only `match` passed. Parity required equal routing projections and, on a served route, equal gold outcomes — so a gold failure both sides shared counted as parity, not drift. [SOURCE: `compiled-routing-parity.cjs@b45ea54cea3^:19-35,92-113,301-453,640-740`; `score-skill-benchmark.cjs@b45ea54cea3^:874-1000`]

A restore needs the four modules (845 + 1,889 + 741 + 766 lines), their deleted test, `_args.cjs` and `advisor-probe.cjs`, and a driver — either the deleted `run-skill-benchmark.cjs`, which pulls about twelve sibling modules, or a thin new one, since the parity functions take injectable dependencies. The whole lane deleted in `b45ea54cea3` was 268 files. [SOURCE: `git show b45ea54cea3 --name-status`; `run-skill-benchmark.cjs@b45ea54cea3^:27-45`; `compiled-routing-parity.cjs@b45ea54cea3^:545-560`]

## 6. Q2 — Compiled Decisions Against Routing Gold as the Bar

It works, with a restated bar and explicit scoring rules. `compiledRoute(hubId, taskText)` is the pure engine: it returns the action (`route`, `clarify`, `defer`, `reject`), the selection kind and qualified-id targets, and the serving gate stays in `resolveRoute`, so a checker measures the engine rather than the flag. [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:94-106`; `resolve.cjs:101-121`]

Targets are qualified ids, not leaf paths, so gold leaves are checked through `qualifiedIdToLeaf` against each destination hub's leaf manifest. The assertion is must-include at mode granularity — `expected_leaf_resources ⊆ declaredLeaves(routedMode)` — because compiled routing selects a whole mode and set equality would fail every correct route. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:430-467`; `compiled-routing-parity.cjs@b45ea54cea3^:29-35,392-440`]

Scoring the retired scorer already defined, carried over:

- **Negative, `UNKNOWN` and `defer` gold**: the expected set is empty; a compiled route is unsafe over-detection and fails.
- **Concrete gold with a non-route decision**: a silent defer, which fails.
- **Holdout**: counted like routing, with the fitted-minus-holdout gap reported.
- **Gold-less and browser rows**: `n/a`, out of the denominator.

[SOURCE: `load-playbook-scenarios.cjs@b45ea54cea3^:461-481,555-616`; `score-skill-benchmark.cjs@b45ea54cea3^:874-1040,1623-1685`]

The checker should also keep the ordered projection — action, selection kind, ordered targets — because two engines can agree on the mode and still differ on selection kind or cross-hub targets, which parity caught. [SOURCE: `compiled-routing-parity.cjs@b45ea54cea3^:402-453`]

## 7. Q3 — What Admission Needs Beyond the Check

The cohort is hardcoded in several places that must move together: `HUB_CHILD` in `compiled-route.cjs` (the engine registry, needed before a hub can be measured at all), `DEFAULT_ON_HUBS` in the live resolver and its authored copy, the advisor's `compiled-routing-flag.ts` and its compiled output, the guard's and the sync tool's `HUBS` lists, and `serving-closure.manifest.json`. The foundation test holds four of these copies in step and pins the cohort at five; the guard, sync and closure lists have no lockstep test. [SOURCE: `.skilled/bin/compiled-routing-foundation.vitest.ts:47-78,124-146`; `.skilled/bin/compiled-route-guard.cjs:45-51`; `.skilled/bin/compiled-route-sync.cjs:54-60`; `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:14-34`]

A manifest is minted inert (`servingAuthority: "legacy"`, `shadowOnly: true`), refreshed against the hub's own shadow-child snapshot, then flipped to `compiled`. `refresh` preserves the serving fields, so the flip is its own step, and its tool is broken (section 10). Freshness is enforced at three moments: the pre-commit auto re-mint, `compiled-route-guard.cjs`, and the request-time status probe. [SOURCE: `.skilled/bin/lib/compiled-route-manifest.cjs:496-568,606-780`; `.skilled/scripts/git-hooks/pre-commit:281-468`; `.skilled/bin/compiled-route-status.cjs:9-30,217-267`]

## 8. Q4 — Cost and Risk of Each Path

| Path | Build cost | What it measures | Main risks |
|------|-----------|------------------|------------|
| **A. Restore** | About 4,200 lines in four modules plus test and driver; 268 files for the whole lane | Compiled equals the legacy replay, the old bar | Re-buys the maintenance the retirement removed; frozen pins must land byte-identical or be re-pinned; the replay models the router rather than being it |
| **B. New checker** | A few hundred lines plus tests; every dependency live | Compiled satisfies the authored gold | The bar changes and must be recorded; the checker owns its oracle; coverage floors become part of the contract |
| **C. Keep closed** | None | Nothing new | No hub can be admitted; the admitted hubs stay unmeasured against anything; `create-skill --compiled-routing ready` keeps minting manifests nothing can promote |

Whichever check is chosen, the cohort surfaces, the mint-refresh-flip ceremony and the closure promotion are the same fixed work. [SOURCE: both lineages' Q4; `git show 8da89c0594e --stat`, the sk-prompt removal, whose diff is the inverse checklist of an admission]

## 9. Where the Lineages Differed

| Point | `swe2` | `deepseek` | Resolved as |
|-------|--------|------------|-------------|
| Gold corpus size | 262 gold-bearing files across 44 playbook directories | 74 scenarios at the five hubs' playbook roots | Both right at different scopes. The hub-root count is 73 now (section 14); 234 files carry `expected_workflow_mode` anywhere under `.skilled/skills` |
| Cohort surfaces | Six | Eight, splitting the authored resolver and the advisor's compiled output | Eight is the fuller inventory |
| Flip tool | Exists but broken | No CLI flips authority | Both: the authored `flip-serving.cjs` exists, and its scorer gate points at a dead path |
| Checker size | 500 to 800 lines | Low hundreds | Unknown until built; both far below Path A |

## 10. Corrections to the Charter

- **The cohort is five hubs, not seven.** sk-design was dissolved and sk-prompt retired, so `DEFAULT_ON_HUBS` and `HUB_CHILD` list five. The charter, `compiled-routing-architecture.md` and the `resolve.cjs` comment all still say seven. [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:28-40`; `compiled-route.cjs:30-36`; commits `f931ba2e14`, `a9286399bc3`]
- **The authored flip is broken.** `frozen-scorer-contract.cjs` sets `SCORER_DIR` to `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer`, which no longer exists; the scorer lives under `runtime/lib/scorer`. [SOURCE: `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-contract.cjs:29`]
- **sk-code's admission rested on one scenario.** Its hub playbook carries a single typed-gold scenario, so any zero-drift claim for it stands on one assertion. [SOURCE: `.skilled/skills/sk-code/manual-testing-playbook/`, one file with `expected_workflow_mode`]

## 11. Recommendations

**Build Path B, and record the restated bar before using it.** The admission sentence becomes: *a hub is admitted when its compiled decisions satisfy the authored routing gold on its full typed-gold corpus, with coverage floors, and no scenario drifts.* If the operator wants the bar to stay literal legacy equality, Path A comes back — ideally as a minimal `router-replay.cjs` plus a comparison adapter, decided with a Path B baseline in hand.

Build steps for a later phase:

1. **Checker.** A new `.skilled/bin/compiled-route-admission.cjs`: `--hub` or `--all`, JSON and Markdown reports, non-zero on drift, broken or insufficient coverage. It reads typed gold and `stage` with loud parse failures, captures decisions through `compiledRoute()`, bridges targets through `qualifiedIdToLeaf`, scores per section 6, keeps the ordered projection, and reports the fitted and holdout results separately.
2. **Coverage floors.** Every declared workflow mode needs scored gold, and every negative gold is scored; a hub with too little gold fails `insufficient-coverage` rather than passing on one assertion.
3. **Tests.** Fixture cases for every status and sub-reason, a live smoke run on sk-doc, and a corpus-count pin.
4. **Baseline.** Run it over the five admitted hubs, and triage each failure as engine drift or stale gold. The report becomes the replacement baseline.
5. **CI.** Run it beside `compiled-route-guard.cjs` in Routing Registry Drift.
6. **Flip.** Repair `flip-serving.cjs` (repoint `SCORER_DIR`, re-pin) or replace it with a smaller gated flip under the same lock and journal discipline.
7. **Admission runbook**, for when a candidate hub exists:
   - build its shadow child and register it in `HUB_CHILD`;
   - run the checker clean;
   - `mint` then `refresh`, then flip;
   - add the hub to every cohort surface, and update the pinned cohort size;
   - promote with `compiled-route-sync.cjs`;
   - confirm the guard and status report `compiled-serving`.
8. **Docs.** Correct `compiled-routing-architecture.md` (five hubs, current `009`/`013`/`014` paths, restated bar) and the `resolve.cjs` comment.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| `compiled-route-status.cjs` as the parity replacement | It is a request-time serving probe, not a coverage judgment | `compiled-route-status.cjs:9-30`; `compiled-routing-architecture.md` §4 naming note | swe2 1 |
| Comparing gold leaves to compiled targets as strings, or by set equality | Targets are qualified ids with a synthetic identity, and compiled routes whole modes; both would fail every correct route | `leaf-resource-contract.cjs:430-467`; `compiled-routing-parity.cjs@b45ea54cea3^:392-440` | swe2 2, deepseek 2 |
| Treating `UNKNOWN` and `defer` gold as "no gold" | Drops ten of 74 assertions and the conservative half of the contract | deepseek F2.4, F2.5 | deepseek 2 |
| `compiled-route-status.cjs` or `mint` as the flip mechanism | `mint` writes `legacy` and refuses to overwrite; status only reads | `compiled-route-manifest.cjs:611-648` | swe2 3, deepseek 3 |
| The architecture reference as the admission checklist | It names the pre-dissolution cohort and the legacy layout | `compiled-routing-architecture.md:34-46`; `compiled-route-layout.cjs:30-44` | deepseek 3 |
| Canary cases as the admission corpus or standing gate | They are compiled expectations, not authored gold, and nothing runs them outside the generator | `009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:38-57,100-110` | swe2 4, deepseek 4, 5 |
| Restoring the whole lane for its parity modules | Far larger than the modules and inside this phase's out-of-scope fence | `git show b45ea54cea3 --stat` | deepseek 4 |
| Path B without coverage floors | A one-scenario hub (sk-code) could be admitted on one assertion | section 10 | deepseek 4, 5 |
| Path A for fidelity alone | Its fidelity is to a replay model of the router, at the cost of the retired surface | swe2 §7 | swe2 5 |
| Path C for safety | It freezes the program rather than protecting it | swe2 §7 | swe2 5 |

## Divergence Map

Neither lineage ran in divergent mode, so no pivots were taken or failed. Saturated directions: the retired harness contract (Q1) and the admission machinery (Q3), which both lineages mapped to the same files. Remaining frontier: whether authored gold has already drifted from the admitted hubs' behaviour, which only a baseline run of the checker can answer, and the exact policy for `clarify` decisions.

## 12. Open Questions

- Does the operator accept the restated admission sentence, or require literal legacy equality?
- How should `clarify` count: as a non-route like `defer`, or as its own outcome?
- What coverage floor should admission require per workflow mode?
- Should `flip-serving.cjs` be repaired or replaced by a leaner gated flip?
- Has any admitted hub's gold drifted from its live behaviour? The first baseline run answers this.

## 13. Convergence Report

- Stop reason: `maxIterationsReached` in both lineages (stop policy `max-iterations`; convergence was telemetry only)
- Total iterations: 10 (five per lineage)
- Questions answered: 5 of 5 in both lineages
- Last three iterations: swe2 3 (Q3, 0.92), 4 (Q4, 0.85), 5 (Q5, 0.55); deepseek 3 (Q3, 0.80), 4 (Q4, 0.55), 5 (Q5, 0.35)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## 14. Verification by the Orchestrator

The claims that decide the recommendation were re-checked against the tree after the lineages finished:

- `DEFAULT_ON_HUBS` and `HUB_CHILD` each list five hubs: sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-doc (`resolve.cjs:34-40`, `compiled-route.cjs:30-36`).
- `frozen-scorer-contract.cjs:29` names `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer`, which does not exist; `.skilled/skills/system-skill-advisor/runtime/lib/scorer` does.
- `expected_workflow_mode` appears in 73 scenario files at the five hubs' playbook roots: sk-code 1, system-deep-loop 20, mcp-tooling 16, cli-external-orchestration 10, sk-doc 26.

## 15. Confidence

- **High**: the retired harness contract, the live engine and bridge, the cohort surfaces, the five-hub cohort and the broken flip, each cited and three of them re-checked by hand.
- **Medium**: the checker's size, bounded by the retired components but not built.
- **Unknown**: whether a new hub is planned, whether the operator accepts the restated bar, and whether gold has drifted anywhere.

## 16. References

- Retired modules at `b45ea54cea3^`: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{compiled-routing-parity,score-skill-benchmark,router-replay,load-playbook-scenarios,run-skill-benchmark,advisor-probe,_args}.cjs`
- Live engine and gate: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{compiled-route,resolve}.cjs`; `.skilled/bin/{compiled-route,compiled-route-status,compiled-route-manifest,compiled-route-guard,compiled-route-sync}.cjs`
- Contract: `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`; `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`
- Authored cutover tooling: `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/{014-runtime-engine/lib/flip-serving.cjs,shared/frozen-scorer-contract.cjs}`
- Tests: `.skilled/bin/compiled-routing-foundation.vitest.ts`; `.skilled/bin/tests/compiled-route-manifest.test.cjs`
- Resource map for this run: `resource-map.md`

## 17. Lineage Artifacts

- `lineages/swe2/`: five iterations, `research.md`, state log, strategy, registry, deltas.
- `lineages/deepseek/`: five iterations, `research.md`, state log, strategy, registry, deltas, convergence report.
- Merged registry: `findings-registry.json`; attribution: `fanout-attribution.md`; run summary: `orchestration-summary.json`.
