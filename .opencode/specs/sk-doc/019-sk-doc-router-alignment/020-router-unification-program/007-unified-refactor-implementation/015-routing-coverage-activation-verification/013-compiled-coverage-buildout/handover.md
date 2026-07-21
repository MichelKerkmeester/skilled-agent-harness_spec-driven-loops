# Handover — Compiled-Coverage Build-Out (015/013)

_Worktree `.worktrees/0089-sk-doc-default-routing-cutover` (branch `sk-doc/0089-default-routing-cutover`). Merge to v4 is OPERATOR-GATED. Companions: `goal-coverage-buildout.md`, `compiled-routing-coverage-diagnosis.md` (parent 015 folder)._

## Committed checkpoints
- **`f19ee17179`** — sk-code routing recipe + manifest `refresh` verb + 013 spec.
- **`e56361ee53`** — parity-harness correctness (3 bugs) + sk-doc/system-deep-loop unblock.
- **`f9f639674b`** — sk-design + system-deep-loop + mcp-tooling compiled-serving.
- **`b03b1dd882`** — sk-doc under-routing fixes (27/5 → 31/1).
- **`6ba5f2957f`** — parity non-route/surface-layer refinement (SD-015).

**STATUS: ALL 7 hubs verified `compiled-serving` (drift=0 each; sk-code 23, sk-design 38, sk-doc 32, sk-prompt 5, mcp-tooling 14, system-deep-loop 21, cli-ext 8), routing == legacy. Coverage build-out COMPLETE. The flip (populate `DEFAULT_ON_HUBS` + doc lockstep) is the only remaining step. If resuming: re-run the 7-hub parity to confirm all serving, then execute the flip per §"NEXT" below. Minor follow-up: add an explicit parity vitest for the non-route/surface-layer clause (verified live + 47/47 existing, but no dedicated lock-in test yet).**

## Verified state (parity, fixed harness + fresh manifests)
| Hub | verdict | notes |
|---|---|---|
| sk-code | **compiled-serving** (23/0) | routing fixed (recipe below) |
| sk-prompt | **compiled-serving** (5/0) | harness fix alone unblocked it |
| cli-external-orchestration | **compiled-serving** (8/0) | harness fix alone |
| sk-design | drifted 37/1 | 1 real over-route (TV-003 adds `foundations`) — agent in-flight |
| sk-doc | drifted 27/5 | **0 real misroute** (residual under-route/gold) — agent in-flight |
| system-deep-loop | drifted 16/5 | 1 real + 4 other — agent in-flight |
| mcp-tooling | drifted 5/9 | 1 over (MT-008) + ~8 under — agent in-flight |

4 routing agents were dispatched (one per drifted hub) to reach `compiled-serving`. **Verify each on landing:** parity `subVerdict==='compiled-serving'` (drift=0, resolver-missing=0); legacy `legacyProjection` byte-identical before/after; frozen SHAs unchanged; only that hub's `006-parent-hub-rollout/00N-<hub>/` (+ its manifest) changed; `DEFAULT_ON_HUBS` still `new Set()`; no commit.

## The proven recipe (why hubs under-route, how sk-code was fixed)
The compiled **shadow-child** router (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/lib/{router,canary-router}.cjs` + `registry-compiler.cjs`) must score/select like the frozen legacy replay `router-replay.cjs`: weighted keyword match over the hub's own `hub-router.json` vocabulary, ambiguity-delta near-tie retention, **always route** near-tied sets, correct bundle rules. sk-code was under-routing because its pipeline used a generic OR-set evaluator + a selective controller that force-`defer`ed bare-surface routes and abstained on ties (neither legacy nor sk-design does this). **Reference impls:** `006-sk-design/lib/router.cjs` (production, 37 match) and `001-sk-code/lib/*` (committed).

## Harness fix (committed, adversarially sound — do NOT re-open)
`compiled-routing-parity.cjs`: (1) `selectionKindForTargets` → `surfaceBundle` only for exactly-1-actor ties; (2) `match = firstDifference===null && compiledGoldPass===legacyGoldPass` (parity = identical behavior, decoupled from gold-achievability); (3) compiled resource projection packet-qualified + narrowed to legacy granularity. A real misroute (different targets) and a compiled-only leaf gap both still classify `drift` — proven by permanent vitest.

## Key mechanism facts
- **Freshness:** `compiled-route-status.cjs` (what parity probes) compares the manifest hash to the **shadow-child** `loadHubEngine(hub).snapshot.policy.effectivePolicyHash`, NOT the canonical recompile. Any compiler change → re-mint the manifest to that shadow-child hash (preserve `servingAuthority`+`shadowOnly`+`generation`).
- **All 7 manifests already read `servingAuthority: 'compiled'`.** So the flip is **cohort-only**.
- Two divergent compilers exist (canonical `001-sk-code` vs per-hub shadow-child copies); the runtime/parity uses the shadow-child.

## NEXT: the staged flip (only once ALL 7 are compiled-serving)
1. Persist cohort: add all 7 hub ids to `DEFAULT_ON_HUBS` in `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` AND its authored twin `.../007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs`; re-sync via `.opencode/bin/compiled-route-sync.cjs`. Verify both byte-identical.
2. Lockstep docs: the 7 hub `SKILL.md` compiled-routing directives → default-on wording + explicit `SPECKIT_COMPILED_ROUTING=0` kill-switch; both create-skill parent templates (`sk-doc/create-skill/assets/parent-skill/*`) → fleet-default-on; catalog leaves.
3. Stage per-hub, stop-on-first-failure, in the controller's recommended order (`011-activation-cutover-p4/controller/cutover-controller.cjs` is a DRY-RUN prover — the persistence is hand-implemented).
4. Verify: with cohort persisted + flag UNSET, every hub resolves compiled == legacy (byte-identical effective routing); `SPECKIT_COMPILED_ROUTING=0` → all legacy (fleet kill); per-hub cohort removal → byte-exact restore; full skill-benchmark vitest green; 3 frozen SHAs unchanged; `validate --strict` 013 Errors:0.

## NEVER
Edit the 3 frozen scorer files (`router-replay.cjs` `d5e13da…`, `score-skill-benchmark.cjs` `d5a9cc7…`, `load-playbook-scenarios.cjs` `5029f22…`); change what LEGACY routes (any `hub-router.json`/`mode-registry.json`/SKILL.md routing); flip a non-hub (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode); flip any hub before it is compiled-serving; touch the 2 strays (`mcp-tooling/008-mcp-aside`, `system-deep-loop/032-…`); merge to v4.
