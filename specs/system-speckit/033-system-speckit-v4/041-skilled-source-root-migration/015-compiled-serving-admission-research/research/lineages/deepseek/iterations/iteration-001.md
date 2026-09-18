---
title: "Iteration 1: What Lane C Parity Measured and What a Restore Would Need"
trigger_phrases: []
---

# Iteration 1: What Lane C Parity Measured and What a Restore Would Need

## Focus

Q1 — establish, with line citations, exactly what the retired Lane C compiled-vs-legacy parity
measured, how it classified outcomes, and the full inventory of what restoring it would require.

Sources are read at `b45ea54cea3^` (one commit before the retirement), because the four modules were
deleted from the tree in `b45ea54cea3` (`feat(deep-loop)!: retire the skill-benchmark lane`).
Retired paths are given at their historical `.opencode/...` location.

## Findings

### F1.1 — Lane C parity was a per-scenario equivalence check between the compiled decision and the legacy replay

The harness `compiled-routing-parity.cjs` (845 lines) compared, for each playbook scenario: the live
compiled decision against the legacy decision. The compiled side is produced **through the public front
door with the flag forced on** — `runJsonChild(PUBLIC_FRONT_DOOR, ['--hub', hubId, '--prompt', taskText],
{ SPECKIT_COMPILED_ROUTING: '1' })` — so the harness measured exactly what the fleet would serve when
permitted, not an internal engine call. The legacy side is a Mode A deterministic replay of the hub's
fenced `INTENT_SIGNALS`/`RESOURCE_MAP` router.

[SOURCE: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:211-217` at `b45ea54cea3^`]
[SOURCE: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:1-17` at `b45ea54cea3^`]

### F1.2 — Three guards kept the comparison honest: vacuous-parity, shape bridge, frozen-scorer pin

1. **Vacuous-parity guard.** The runtime flag alone is insufficient; the harness reads the hub's live
   activation manifest through the status probe and hard-fails anything but `servingAuthority: "compiled"`
   as `vacuous`. A missing manifest is `n/a` ("legacy-by-construction"); a stale manifest is `drift`
   with reason `re-mint-required`.
2. **Shape bridge.** Compiled emits qualified destination ids; the frozen evaluator reads legacy
   `observedResources`. Every target is resolved through the shared `qualifiedIdToLeaf` boundary
   (`leaf-resource-contract.cjs`) against the **destination hub's** leaf-manifest/mode-registry index;
   an unresolvable target fails closed as `resolver-missing`, never a silent skip. Legacy's observed
   resources are then projected down to what compiled's declared leaves can support
   (`projectCompiledResourcesToLegacyGranularity`) so mode-wide declarations are not compared against
   task-scoped gold.
3. **Frozen-scorer pin.** `router-replay.cjs`, `score-skill-benchmark.cjs` and `load-playbook-scenarios.cjs`
   are re-hashed against `PINNED_FROZEN_SCORER_DIGESTS` before any comparison; missing or changed files
   abort before evidence is written.

[SOURCE: `compiled-routing-parity.cjs:93-110` (pins), `:517-535` (re-hash), `:301-350` (bridge), `:392-400` (projection), `:600-637` (freshness/vacuous gates) at `b45ea54cea3^`]

### F1.3 — The verdict has two levels: gold agreement and routing-projection equality

Both observations are independently run through the frozen `evaluateRouteGold`; then the routing
projections are compared field-by-field — `action`, `selectionKind`, target count, then each target's
`hubId`/`workflowMode`/`packetKind` in authored order. Parity requires `firstDifference === null` and,
for a served `route` only, `compiledGoldPass === legacyGoldPass`. A shared pre-existing gold failure on
matching routing is parity, not drift; only an outcome difference is `route-gold-failure` drift. A
non-route decision (`defer`/`clarify`/`reject`) compares no resources by schema, because resource gold
on those paths is delivered by the retained legacy surface layer.

[SOURCE: `compiled-routing-parity.cjs:640-705` (gold + projection match), `:454-470` (first difference) at `b45ea54cea3^`]
[SOURCE: `score-skill-benchmark.cjs:891-955` (`evaluateRouteGold`) at `b45ea54cea3^`]

### F1.4 — Five statuses, one blocking roll-up, and a named drift-gate owner

Per-scenario statuses: `match` (only pass), `drift`, `vacuous`, `n/a` (informational: no route gold,
browser scenario, hub outside the serving closure), `resolver-missing` (broken compiled path). The
run-level sub-verdict: `broken-compiled-path` outranks `legacy-fallback-drifted`, outranks
`compiled-serving`; both drift and broken block. The harness declared itself the single blocking
drift-gate owner (`DRIFT_GATE_OWNER = 'lane-c-compiled-parity'`) and raised the outer verdict to
`BLOCKED-BY-COMPILED-DRIFT` only over a non-blocked verdict, so structural/registry failures stayed
distinct.

[SOURCE: `compiled-routing-parity.cjs:112-132` (statuses/owner), `:741-792` (rollup + outer verdict) at `b45ea54cea3^`]

### F1.5 — Defer and negative/holdout semantics were explicit in the frozen scorer

- Rejection labels `none`/`defer`/`unknown` all map to the **empty expected-intent set**
  (`REJECTION_INTENT_LABELS`); intent gold is an exact set assertion.
- Resource gold is exact-assembly for the sk-doc-shape corpus (`sameSet`) and
  must-include + no-forbidden-prefix for the sk-code-shape corpus (its authored lists are
  non-exhaustive by contract).
- `scoreHubRoute` treats `routeOutcome: 'defer'` as pass only when actual intents are empty and no
  forbidden mode was hit; a scenario legacy routes whose observation is empty is `silent-default` fail.
- The benchmark stage partitions rows into fitted (`routing` + `negative`) and decontaminated
  `holdout`; the headline aggregate is the fitted set only, and the generalization gap is
  `fitted − holdout`. `negativeActivation: true` scenarios measure forbidden/suppression waste.

[SOURCE: `score-skill-benchmark.cjs:874-935` (rejection labels + `evaluateRouteGold`), `:980-1040` (`scoreHubRoute` defer/single/orderedBundle), `:1623-1685` (stage partition), `:1390-1453` (negative dimensions) at `b45ea54cea3^`]

### F1.6 — Restore inventory: more than the four scripts

A restored path needs:

| Artifact | Role |
|---|---|
| `compiled-routing-parity.cjs` (845 lines) | the parity classifier + drift-gate owner |
| `score-skill-benchmark.cjs` (1889 lines) | the frozen scorer: `evaluateRouteGold`, gold aggregation, stage partition |
| `router-replay.cjs` (741 lines) | Mode A legacy replay of the fenced smart router |
| `load-playbook-scenarios.cjs` (766 lines) | playbook corpus loader (frontmatter gold, sk-code index shape, prompt extraction) |
| `tests/compiled-routing-parity.vitest.ts` | the harness's own test file, deleted in the same commit |
| `/deep:skill-benchmark` YAML + presentation + command entry | the orchestrator that dispatched the loop host |
| `references/skill-benchmark/` docs + `assets/skill-benchmark/` fixtures | operator guide, scoring contract, fixture corpus |
| shared deps | `@spec-kit/shared/frontmatter/parse-frontmatter.js`; `leaf-resource-contract.cjs` (`qualifiedIdToLeaf`) |
| runtime probes | `compiled-route-status.cjs` (freshness/authority probe), `compiled-route.cjs` front door |

**Byte-fidelity constraint:** the three frozen scorer files are digest-pinned inside the harness, so a
restore that edits any of them must re-pin (or restore exact bytes), and the activation driver refused
to run without the same digests. The pins are literal SHA-256 constants in the harness.

[SOURCE: `compiled-routing-parity.cjs:93-110,517-535` at `b45ea54cea3^`]
[SOURCE: `git show b45ea54cea3 --name-status` — deleted: `compiled-routing-parity.cjs`, `load-playbook-scenarios.cjs`, `router-replay.cjs`, `score-skill-benchmark.cjs`, `tests/compiled-routing-parity.vitest.ts`]
[SOURCE: `git show b45ea54cea3^:.opencode/commands/deep/assets/deep-skill-benchmark-auto.yaml:1-22` — "Benchmark a skill's real-world routing, discovery, efficiency, and usefulness (Lane C)"; "Lane C is diagnostic by default and never mutates the target skill."]

### F1.7 — The retirement was deliberate, broad, and recorded as a capability loss

Commit `b45ea54cea3` removed the lane from five runtime command entry points, its workflow and
presentation contracts, its script tree, fixture corpus and typed ledger libraries; the message
carries `BREAKING CHANGE: /deep:skill-benchmark is removed on every runtime`. It also records that a
manual-playbook persistence wrapper "cannot be rehomed as it stands" and that ~43 documents across
eight skills still describe the lane.

[SOURCE: `git show b45ea54cea3 --format=%B` (commit message); `git show b45ea54cea3 -- .opencode/skills/system-deep-loop/deep-improvement/SKILL.md` (Lane C removed from the three-lane table)]

### F1.8 — What parity did not measure

- **Hub selection.** The compiled router only selects *within* an already-identified hub; it "never
  decides which hub owns a prompt in the first place — that step stays the advisor's job."
- **Live dispatch (Mode B)** — parity was Mode A deterministic replay only; the YAML notes the router
  trace is the default/CI mode.
- **Freshness as a serving property** — the harness re-checked manifest freshness per scenario and
  classified stale as drift (`re-mint-required`), but it did not mint or repair anything.

[SOURCE: `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:46`]
[SOURCE: `compiled-routing-parity.cjs:600-637` at `b45ea54cea3^`]
[SOURCE: `git show b45ea54cea3^:.opencode/commands/deep/assets/deep-skill-benchmark-auto.yaml` — `trace_mode: router (Mode A, deterministic, default/CI) or live (Mode B ...)`]

## Ruled-Out Directions

- None yet. (Alternatives are still open at this depth.)

## Open Threads Carried Forward

- Iteration 2 must test whether `compiledRoute()` + scenario gold can reproduce parity's core
  assertion, and how the shape bridge and defer/holdout/negative semantics survive that translation.
- Iteration 3 must inventory the non-harness admission machinery (frozen tables, manifest re-mint,
  guard freshness) that parity itself never touched.

## Quality Note

Every claim above is cited to a retired-module line at `b45ea54cea3^` or to a commit object. No live
file outside the lineage was modified.
