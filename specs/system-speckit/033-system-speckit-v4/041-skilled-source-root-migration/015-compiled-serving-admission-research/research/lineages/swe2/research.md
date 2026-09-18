---
title: "Compiled-serving admission after Lane C retirement — detached research synthesis"
trigger_phrases: []
---
# Compiled-serving admission after Lane C retirement — detached research synthesis

**Lineage:** `swe2`
**Session:** `fanout-swe2-1789762218897-56yqt6`
**Loop:** `research`, 5 iterations, `max-iterations` (convergence telemetry-only)
**Executor:** `cli-devin` / `swe-2-max`
**Artifact root:** `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research/research/lineages/swe2`

## 1. Executive Summary

**Recommendation: build the new checker (Path B) — a tool that runs `compiledRoute(hubId, taskText)` against each routing scenario's authored gold (`expected_workflow_mode`, `expected_leaf_resources`, defer/negative labels) and admits a hub when it produces zero violations across its playbook corpus.** It is the cheapest path that honestly answers the admission question (~500–800 lines on entirely live dependencies vs a ~3,700-line surgical restore or a ~268-file lane resurrection), it measures correctness directly rather than through the retired replay proxy, and the corpus it needs is alive and maintained (262 gold-bearing files across 44 playbook dirs for the five current hubs).

The semantic change must be recorded, not smuggled: the bar moves from "compiled == legacy replay on every scenario" to "compiled == authored routing gold on every scored scenario." Restore (Path A) is the right choice only if the operator insists the bar stay literally legacy-equivalence — which itself requires resurrecting the replay+scorer the verdict was delegated to. Keep-closed (Path C) is only honest alongside an explicit "cohort permanently frozen" decision.

A correction to the spec's premise discovered in evidence: the admitted cohort is **five** hubs, not seven — `sk-design` was dissolved (commit `f931ba2e14`) and `sk-prompt` retired (commit `a9286399bc3`); the docs and `resolve.cjs` comment still say seven.

## 2. Scope and Boundary

This detached lineage wrote only under its bound artifact root. It did not modify the spec packet docs, the parent `research/` files, `.skilled` sources, continuity/memory state, shared telemetry, or git state. `resolveArtifactRoot` was skipped; `artifact_dir` was bound directly from `config.fanout_lineage_artifact_dir`. `generate-context.js`, `validate.sh`, `append-mode-event.cjs`, and git write commands were not run; JSONL records were written directly into this lineage's `deep-research-state.jsonl`.

## 3. Method and Source Quality

Five iterations, each a distinct evidence pass: (1) the retired Lane C modules read at `b45ea54cea3^`; (2) the live `compiledRoute()` surface executed and the gold corpus inventoried; (3) the admission machinery (cohort tables, manifest lifecycle, guard/hook/sync tooling) read live and in the authored spec tree; (4) cost/risk priced from file census, require-graph analysis, archived verdict reports, and fixture census; (5) recommendation synthesized against the proven coverage-buildout recipe.

All load-bearing claims cite `file:line` (live or `@b45ea54cea3^`) or a commit hash. Where a judgment call remains (the semantic-bar choice), it is named as an admission-policy decision, not hidden as a technical fact.

## 4. Q1 — What Lane C parity measured and what a restore needs

**What it measured.** Lane C measured per-scenario behavioral equivalence between the compiled decision and a deterministic replay of the legacy prose router — "WITHOUT re-implementing any scoring judgment," delegating gold verdicts to the frozen `evaluateRouteGold` (`compiled-routing-parity.cjs@b45ea54cea3^:7-45`). Per-scenario statuses were `match`/`drift`/`vacuous`/`n/a`/`resolver-missing`; only `match` passed (`:103-113`, `:562-578`). Three guards kept it honest: the vacuous-parity guard (the hub's activation manifest must read `servingAuthority:"compiled"` — `:19-22`, `:636-643`), the shape bridge (qualified ids → legacy `observedIntents`/`observedResources` via `qualifiedIdToLeaf`, with mode-wide→task-scoped granularity projection — `:23-35`, `:301-453`), and the frozen-scorer pin (SHA-256 digests of the trio re-verified before and after the run — `:92-100`). The match formula required projection equality plus, on `route` decisions only, equal gold outcomes — parity decoupled from gold achievability (`:712-740`).

**The supporting cast.** `router-replay.cjs` replayed the SKILL.md `INTENT_SIGNALS`/`RESOURCE_MAP` dicts with substring-scoring + `AMBIGUITY_DELTA=1` semantics (`:7-21,33`) — a *model* of the router, not the router. `load-playbook-scenarios.cjs` normalized the playbook corpus with gold captured as authored, stages `routing`/`holdout`/`negative`, classKinds `browser`/`advisor`/`routing` (`:7-24,461-481,555-575`). `score-skill-benchmark.cjs` owned `evaluateRouteGold` (intent exact-set, `none|defer|unknown`→empty set, resource exact-assembly vs must-include, gold-parse-failure=violation — `:874-945`) and `scoreHubRoute` (defer pass iff empty actual + no forbidden hit — `:963-1000`). `run-skill-benchmark.cjs` wired it via `--compiled-routing-parity on|off|auto`, rolled `compiled-serving`/`legacy-fallback-drifted`/`broken-compiled-path`/`n/a` sub-verdicts, and applied the drift verdict (`:43-45,272-287,460-462,565-615`).

**What a restore needs.** Beyond the four named modules: `_args.cjs`, `advisor-probe.cjs` (required by the scorer at `:30`), `cutover-playbook-executor.cjs` (second parity consumer), `compiled-routing-parity.vitest.ts` + ~15 sibling test files, `loop-host.cjs` registration, and either `run-skill-benchmark.cjs` (which pulls ~12 sibling modules — `:27-45`) or a thin new driver (~150 lines — the parity functions take injectable deps at `:545-560`). The full lane deleted in `b45ea54cea3` was 268 files. Live deps that survive: `leaf-resource-contract.cjs` (`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/`), `@spec-kit/shared` (resolves via per-skill `node_modules/@spec-kit/shared` symlinks; `"./*.js"→"./dist/*.js"` exports map), the `compiled-route.cjs`/`compiled-route-status.cjs` front doors, `serving-closure.manifest.json`, and activation manifests.

## 5. Q2 — `compiledRoute()` vs scenario gold as the admission bar

**Yes — with a named semantic change and a granularity rule.** `compiledRoute(hubId, taskText)` is the pure engine evaluation returning `{hubId, action ∈ route|clarify|defer|reject, selectionKind, targets, effectivePolicyHash, generation}` — the flag/manifest gate lives in `resolveRoute`, so the checker measures the engine, not the serving gate (`compiled-route.cjs:53-106`; `resolve.cjs:101-121`). The decision↔gold bridge exists and runs live: targets decompose to `{skillId, workflowMode, packetId}` (verified: `compiledRoute('sk-doc','author a changelog entry')` → `workflowMode:"sk-create-changelog"`; an off-topic prompt → `{action:"defer", targets:[]}`), and `qualifiedIdToLeaf` owns the fail-closed decomposition (`leaf-resource-contract.cjs:430-463`). Gold corpora are authored and current: 111 files carry `leaf_resource_id`, 78 carry `expected_workflow_mode: UNKNOWN`; leaf ids match `leaf-manifest.json` mode `leaves` byte-for-byte.

**Semantic delta (the admission-policy call).** Parity required compiled==legacy regardless of gold achievability — a shared pre-existing gold gap (documented CS-002/CS-005 "non-Webflow" pattern) was parity, not drift. Gold-checking fails that case (stricter) and passes a correct-but-different-from-legacy decision (looser — bounded by the completeness gate below). Which the bar should mean is an operator decision; it cannot be inherited from Lane C. [SOURCE: `compiled-routing-parity.cjs@b45ea54cea3^:712-740`; `sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:33-44`]

**Defer / holdout / negative counting** (ported from the retired semantics):
- `stage:negative` / `expected_workflow_mode: UNKNOWN` / labels `none|defer|unknown` → expected set is empty: compiled MUST NOT route; a route is unsafe over-detection and blocks.
- `routeOutcome: defer` gold → compiled `action` must be non-route; routing is drift.
- Routing-stage gold + compiled `defer` → silent defer, blocking.
- `stage:holdout` counts identically to routing — keyword-blind anti-overfit evidence, not a discount tier.
- `classKind:browser` and gold-absent rows → `n/a`, out of the denominator. [SOURCE: `load-playbook-scenarios.cjs@b45ea54cea3^:461-481,555-575`; `score-skill-benchmark.cjs@b45ea54cea3^:874-945,963-1000`]

**Leaf granularity.** Compiled routing selects a whole mode (mode-wide declared leaves); legacy picked a task-scoped subset. The correct assertion is `expected_leaf_resources ⊆ declaredLeaves(routedMode)` (must-include); expected leaves the mode does not declare are genuine compiled gaps. Set-equality would fail every correct route on breadth — parity's `projectCompiledResourcesToLegacyGranularity` exists precisely for this (`:29-35,392-440`).

**What parity saw that a thin gold check would miss:** the ordered `action + selectionKind + targets` projection — two engines agreeing on mode but differing on `selectionKind` or cross-hub targets were drift under parity. Mitigation: keep the ordered projection in the checked comparison, not just the mode set (`:402-453`).

## 6. Q3 — What else admission needs

**The cohort is hardcoded in six places, test-enforced to move together:**
1. `HUB_CHILD`, `compiled-route.cjs:30-36` — engine registry; required *before* measurement (`compiledRoute` throws `unknown hub`).
2. `DEFAULT_ON_HUBS`, `resolve.cjs:34-40` — the default-on cohort (the admission itself).
3. `HUBS`, `compiled-route-guard.cjs:41-47` — freshness-monitored set + auto-remint hook's hub list.
4. Advisor copies `COMPILED_ROUTING_HUBS` + `DEFAULT_ON_HUBS`, `system-skill-advisor/runtime/lib/compiled-routing-flag.ts:14,30` (consumed by `advisor-recommend.ts:334`).
5. `serving-closure.manifest.json` `hubs[]`/`files[]` — the promoted inventory (regenerated by `compiled-route-sync.cjs`).
6. Authored counterparts under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/` — edited there, promoted by sync.

`compiled-routing-foundation.vitest.ts:54-70,126-128,246-272` asserts all copies agree; `compiled-route-manifest.test.cjs:1127` pins `DEFAULT_ON_HUBS.size === 5` — partial edits fail loudly.

**Manifest lifecycle.** `compiled-route-manifest.cjs mint` → inert `{servingAuthority:'legacy', shadowOnly:true, generation:1}`; `refresh` recompiles at generation+1 preferring the shadow-child snapshot, preserving serving state, atomic publish (`lib/compiled-route-manifest.cjs:606-645,693-780`). The `legacy`→`compiled` flip is authored-only `flip-serving.cjs` (P4b fenced compare-and-swap; P4a `activate-hub.cjs` binding; canary green; scorer-frozen gate; snapshot identity; per-hub lock + write-ahead journal + `--rollback`). **The authored flip path is currently broken**: `frozen-scorer-contract.cjs`'s `SCORER_DIR` points at the dead `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer` (advisor moved to `runtime/lib/scorer`) — it must be repointed + re-pinned, or the flip done as a gated two-field manifest edit (`servingAuthority`, `shadowOnly`) since `refresh` preserves them.

**Freshness.** `compiled-route-guard.cjs` enforces manifest freshness + authored-drift (runtime manifest vs authored spec-tree copy — verified byte-identical for all 5, live run all-`fresh`); exemptions only for `inputs-do-not-compile`. A pre-commit hook (commit `a1faf0914a`) auto-re-mints on staged routing inputs, reads the hub list from guard `HUBS`, stages both manifests, verifies index, blocks otherwise. The resolver's serve-time identity binding (`route.effectivePolicyHash+generation == selectedPolicy`, `resolve.cjs:111-115`) is the deep gate — a stale manifest silently drops to legacy, which is exactly what guard+hook exist to surface.

## 7. Q4 — Cost and risk per path

| Path | Build cost | Fidelity to stated bar | Key risks |
|---|---|---|---|
| **A. Restore** | ~3,700 lines surgical (5-7 files + thin driver) or ~268 files full lane; freeze-discipline re-owning; `.opencode`→`.skilled` path verification | Highest — but to a replay *proxy* | Re-buys retired maintenance surface; frozen-trio pins must land byte-identical or re-pin; `router-replay` models the router, isn't the router |
| **B. New checker** | ~500–800 lines + tests; all deps live | Different — gold-agreement, not equivalence | Semantic-bar change (must be recorded); self-grading if fixture-only (mitigate: playbook corpus required); coverage blindness (mitigate: completeness gate); defer/negative policy must be encoded |
| **C. Keep closed** | ~0 | n/a | Permanent new-admission block; admitted-hub drift unmeasured (refresh is mechanical); `create-skill --compiled-routing ready` strands inert mints; doc debt compounds ("seven hubs" stale) |

Measured verdicts are archived and real: `benchmark-sweep--r3/report.json` records `compiledServingAllSevenHubs:true`, `driftAnySeven:0`, `skillBenchmarkSuite258:"258/258 PASS"`, `compiledRoutingParityVitest47:"47/47 PASS"`. Keep-closed's blast radius is narrower than it looks — the five admitted hubs keep serving and their policy *evolution* still works via `refresh` (the bar was per-hub admission, not per-policy) — but it freezes the program, not protects it.

## 8. Q5 — Recommendation and build steps

**Recommended: Path B — the gold checker.** Choose restore only if the bar must stay literally `== legacy replay` (and budget the replay+scorer resurrection, not just the parity harness). Choose closed only with an explicit cohort-frozen decision plus the doc-debt fix.

**Risks carried and their mitigations** (all named in §5–§7): semantic change → record the redefinition in `compiled-routing-architecture.md` §4; self-grading → playbook corpus is the bar, `canary-cases.v1.json` (67 cases across 5 hubs, normalized JSON already in the serving closure) is smoke-gate only; coverage blindness → corpus-completeness gate (every declared `workflowMode` scored, every negative gold scored; ungolded modes are violations, not silence); shared-gold-gap → classified as a loud corpus finding, consistent with the loader's never-silent-gold rule.

**What a later phase builds and tests:**

1. `check-compiled-routing.cjs` (~500–800 lines): two-shape playbook-gold loader (sk-code index-table + sk-doc per-scenario frontmatter, via live `@spec-kit/shared`), comparator port (`evaluateRouteGold` semantics + ordered projection + leaf must-include + gold-parse-failure=violation), rollup to `compiled-serving`/violations/broken sub-verdicts, corpus-completeness gate, JSON+markdown report in the archived shape.
2. Vitest suite covering the status space via injected fixtures (as `compiled-routing-parity.vitest.ts` did).
3. Admission runbook: shadow-child build-out per the proven recipe (`goal-coverage-buildout.md:55` — grow `registry-compiler.cjs` + router + canary-cases on the hub's full playbook set) → register `HUB_CHILD` → checker clean → `mint`/`refresh` → flip `servingAuthority`→`compiled` + `shadowOnly`→`false` (repair `flip-serving.cjs`'s stale scorer gate or perform the gated two-field edit under the same lock/journal discipline) → add to `DEFAULT_ON_HUBS`, guard `HUBS`, advisor copies → `compiled-route-sync.cjs` promote + regenerate `serving-closure.manifest.json` → `compiled-route-guard.cjs` green → foundation vitest green.
4. Doc fixes: "seven"→"five" (architecture doc §2/§4, `resolve.cjs:29` comment, spec text); bar redefinition recorded.

**Tests the phase runs:** checker vitest; `compiled-routing-foundation.vitest.ts` (cohort consistency); `compiled-route-manifest.test.cjs` (update `size===5`→6); `compiled-route-guard.cjs` all-fresh; `compiled-route-sync.cjs --verify` (no spec-tree reads); a smoke `compiled-route-status.cjs --hub <new>` showing `compiled-serving`; the auto-remint hook staging both manifests.

## 9. Open Questions / Follow-ups

- The defer-vs-`clarify` distinction in compiled decisions (`clarify` appears in canary fixtures) needs a policy line in the checker — treated here as non-route, consistent with the rejection-label semantics, but the build phase should confirm against hub router contracts.
- Whether `flip-serving.cjs` is repaired (repoint `SCORER_DIR`, re-freeze pins) or retired in favor of a leaner gated flip — a design decision for the build phase.
- Corpus-completeness gate thresholds: should a declared mode with zero authored gold block admission, or require a minimum scenario count per mode?
- The authored-vs-promoted duality means admission edits land in the spec tree then promote via sync — the runbook assumes that flow; confirm no direct-to-`.skilled` path is wanted.

## 10. Convergence Report

- **Stop reason:** `maxIterationsReached` (stopPolicy `max-iterations`, 5/5 iterations; convergence telemetry only, no early synthesis)
- **Questions answered:** 5/5 (Q1–Q5)
- **newInfoRatio trend:** 0.95 → 0.90 → 0.92 → 0.85 → 0.55 (rolling avg 0.83; the final iteration is analytical synthesis, hence lower novelty)
- **Iterations:** 1=Lane C modules at `b45ea54cea3^`; 2=`compiledRoute()` + gold corpus; 3=cohort/manifest/guard machinery; 4=cost/risk ledger; 5=recommendation + build steps
- **Ruled-out directions:** status-probe as parity replacement or flip mechanism; naive leaf set-equality; canary-cases alone as admission corpus; restore-for-fidelity; closed-for-safety

## 11. References

- Retired modules at `b45ea54cea3^`: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{compiled-routing-parity,score-skill-benchmark,router-replay,load-playbook-scenarios,run-skill-benchmark,cutover-playbook-executor,advisor-probe,_args}.cjs`, `tests/compiled-routing-parity.vitest.ts`
- Live engine/gate: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{compiled-route,resolve}.cjs`, `.skilled/bin/{compiled-route,compiled-route-status,compiled-route-manifest,compiled-route-guard,compiled-route-sync}.cjs`, `.skilled/bin/lib/compiled-route-manifest.cjs`, `serving-closure.manifest.json`
- Contract/identity: `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`, `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`
- Authored cutover tooling: `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/flip-serving.cjs`, `013-live-activation/lib/activate-hub.cjs`, `shared/frozen-scorer-contract.cjs`, `019-routing-coverage-activation-verification/goal-coverage-buildout.md`
- Advisor cohort copies: `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`, `handlers/advisor-recommend.ts`
- Tests: `.skilled/bin/compiled-routing-foundation.vitest.ts`, `.skilled/bin/tests/compiled-route-manifest.test.cjs`
- Corpora: per-hub `manual-testing-playbook/` (gold frontmatter), `009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`, `leaf-manifest.json` per hub
- Archived evidence: `.skilled/skills/*/benchmark/reports/compiled-routing/` (sweep report, serving-snapshots, playbook-verify)
- Automation: `.opencode/scripts/git-hooks/pre-commit` (= `.skilled/scripts/git-hooks/pre-commit`)
- Commits: `b45ea54cea3` (lane retirement), `f931ba2e14` (sk-design dissolution 7→6), `a9286399bc3` (sk-prompt removal), `a1faf0914a` (auto-remint hook), `4cd19370da1` (default-on all-7)
