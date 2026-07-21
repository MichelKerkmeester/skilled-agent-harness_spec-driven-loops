# Handover — Compiled-Coverage Build-Out (015/013)

_Worktree `.worktrees/0089-sk-doc-default-routing-cutover` (branch `sk-doc/0089-default-routing-cutover`). Merge to v4 is OPERATOR-GATED. Companions: `goal-coverage-buildout.md`, `compiled-routing-coverage-diagnosis.md` (parent 015 folder)._

## Committed checkpoints
- **`f19ee17179`** — sk-code routing recipe + manifest `refresh` verb + 013 spec.
- **`e56361ee53`** — parity-harness correctness (3 bugs) + sk-doc/system-deep-loop unblock.
- **`f9f639674b`** — sk-design + system-deep-loop + mcp-tooling compiled-serving.
- **`b03b1dd882`** — sk-doc under-routing fixes (27/5 → 31/1).
- **`6ba5f2957f`** — parity non-route/surface-layer refinement (SD-015).
- **`7dfffa0c93`** — the default-on flip: `DEFAULT_ON_HUBS` populated with all 7 hubs (both resolver copies); 7 `SKILL.md` directives + both create-skill parent templates + 7 catalog leaves rewritten to default-on wording; all 7 manifests re-minted.

**STATUS: COMPLETE. ALL 7 hubs verified `compiled-serving` (drift=0 each; sk-code 23, sk-design 38, sk-doc 32, sk-prompt 5, mcp-tooling 14, system-deep-loop 21, cli-ext 8), routing == legacy. Coverage build-out COMPLETE and the default-on flip SHIPPED in `7dfffa0c93` — `DEFAULT_ON_HUBS` (both resolver copies, byte-identical) lists all 7 hubs; `SPECKIT_COMPILED_ROUTING=0` remains the fleet-wide kill-switch; per-hub cohort removal restores legacy byte-for-byte. Re-confirmed live during this reconciliation pass (2026-07-21): `compiled-route-status.cjs` reports `compiled-serving`/`fresh: true` for all 7 hubs; the `=0` kill-switch drilled live across all 7 (`flag-off` for every hub); `compiled-route-sync.cjs --verify` reports 0 reads under `.opencode/specs`; the 3 frozen scorer SHA-256 digests are unchanged; the skill-benchmark suite is 258/258 (grown from 247 as lock-in tests were added); `sk-doc` and `sk-prompt` route-gold parity independently re-run and matched exactly (32/0, 5/0). §"NEXT" below is now historical (records what shipped, not what remains). Open follow-ups, none blocking: (1) the advisor-side `compiledRoute` enrichment cohort in `system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` is a separate `DEFAULT_ON_HUBS` copy and is still empty — confirmed live, unaffected by this cutover; (2) add an explicit parity vitest for the non-route/surface-layer clause (verified live + 47/47 existing, but no dedicated lock-in test yet); (3) LUNA-HIGH acceptance sweep DONE — full 7-hub two-plane sweep 14/14 PASS, archived + committed (`bc0e3a3052`); (4) `011-activation-cutover-p4`'s own docs narrated the earlier superseded halt at `sk-prompt` — reconciled to record this outcome in the same reconciliation pass as this document.**

## Verified state — FINAL (all 7 compiled-serving; re-confirmed live during this reconciliation pass)
| Hub | verdict | notes |
|---|---|---|
| sk-code | **compiled-serving** (23/0) | routing fixed (recipe below); `e56361ee53` |
| sk-prompt | **compiled-serving** (5/0) | harness fix alone unblocked it; re-run live 2026-07-21, exact match |
| cli-external-orchestration | **compiled-serving** (8/0) | harness fix alone; `e56361ee53` |
| sk-design | **compiled-serving** (38/0) | TV-003 over-detection fixed; `f9f639674b` |
| sk-doc | **compiled-serving** (32/0) | under-routing fixed (`b03b1dd882`) then SD-015 closed the rest (`6ba5f2957f`); re-run live 2026-07-21, exact match |
| system-deep-loop | **compiled-serving** (21/0) | `f9f639674b` |
| mcp-tooling | **compiled-serving** (14/0) | MT-008 over-detection fixed alongside coverage; `f9f639674b` |

The 4 routing agents dispatched (one per then-drifted hub) all landed successfully: `f9f639674b` (sk-design, system-deep-loop, mcp-tooling), `b03b1dd882` (sk-doc). Each landing was verified per the checklist below at the time, and the whole set is independently re-verified live as part of this reconciliation pass: parity `subVerdict==='compiled-serving'` (drift=0, resolver-missing=0) — confirmed for sk-doc/sk-prompt directly, others corroborated via the live cross-hub vitest assertion; legacy `legacyProjection` byte-identical; frozen SHAs unchanged; `DEFAULT_ON_HUBS` now correctly lists all 7 (populated in `7dfffa0c93`, not still `new Set()`).

## The proven recipe (why hubs under-route, how sk-code was fixed)
The compiled **shadow-child** router (`.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/00N-<hub>/lib/{router,canary-router}.cjs` + `registry-compiler.cjs`) must score/select like the frozen legacy replay `router-replay.cjs`: weighted keyword match over the hub's own `hub-router.json` vocabulary, ambiguity-delta near-tie retention, **always route** near-tied sets, correct bundle rules. sk-code was under-routing because its pipeline used a generic OR-set evaluator + a selective controller that force-`defer`ed bare-surface routes and abstained on ties (neither legacy nor sk-design does this). **Reference impls:** `006-sk-design/lib/router.cjs` (production, 37 match) and `001-sk-code/lib/*` (committed).

## Harness fix (committed, adversarially sound — do NOT re-open)
`compiled-routing-parity.cjs`: (1) `selectionKindForTargets` → `surfaceBundle` only for exactly-1-actor ties; (2) `match = firstDifference===null && compiledGoldPass===legacyGoldPass` (parity = identical behavior, decoupled from gold-achievability); (3) compiled resource projection packet-qualified + narrowed to legacy granularity. A real misroute (different targets) and a compiled-only leaf gap both still classify `drift` — proven by permanent vitest.

## Key mechanism facts
- **Freshness:** `compiled-route-status.cjs` (what parity probes) compares the manifest hash to the **shadow-child** `loadHubEngine(hub).snapshot.policy.effectivePolicyHash`, NOT the canonical recompile. Any compiler change → re-mint the manifest to that shadow-child hash (preserve `servingAuthority`+`shadowOnly`+`generation`).
- **All 7 manifests read `servingAuthority: 'compiled'`.** The flip was therefore **cohort-only** — confirmed: no manifest's `servingAuthority`/`shadowOnly` changed in `7dfffa0c93`, only the re-mint hash (a provenance shift from the directive-wording edit, not a routing-rule change).
- Two divergent compilers exist (canonical `001-sk-code` vs per-hub shadow-child copies); the runtime/parity uses the shadow-child.

## DONE: the staged flip (shipped in `7dfffa0c93`; this section now records what happened, not what remains)
1. **Persist cohort** — DONE. All 7 hub ids added to `DEFAULT_ON_HUBS` in `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` AND its authored twin `.../007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs`; re-synced via `.opencode/bin/compiled-route-sync.cjs`. Verified byte-identical (`diff` clean) during this reconciliation pass.
2. **Lockstep docs** — DONE. All 7 hub `SKILL.md` compiled-routing directives carry default-on wording + explicit `SPECKIT_COMPILED_ROUTING=0` kill-switch (confirmed live, identical pattern across all 7); both create-skill parent templates (`sk-doc/create-skill/assets/parent-skill/*`) carry fleet-default-on wording naming all 7 hubs (confirmed live); 7 catalog leaves updated (spot-checked live for `sk-doc`).
3. **Staging mechanism actually used** — NOT a live run of `011-activation-cutover-p4/controller/cutover-controller.cjs` (that controller remained a DRY-RUN prover throughout, per `011`'s own reconciled docs). Once every hub independently reached `compiled-serving` across the commits above, the persistence was hand-implemented directly as a single reconciling commit (`7dfffa0c93`) rather than a live one-hub-at-a-time run of the controller's stop-on-first-failure loop. This is a documented deviation from the original plan, not a silent one — see both packets' `implementation-summary.md`.
4. **Verify** — DONE, re-confirmed live during this reconciliation pass: with cohort persisted + flag UNSET, every hub resolves compiled == legacy (byte-identical effective routing, 0 drift each); `SPECKIT_COMPILED_ROUTING=0` → all 7 legacy (`causeCode: flag-off`, drilled live); per-hub cohort removal → byte-exact restore (cited from `011`'s CHK-025 drill, not re-mutated live in this doc-only pass); full skill-benchmark vitest green (258/258, re-run live); 3 frozen SHAs unchanged (re-hashed live).

## NEVER
Edit the 3 frozen scorer files (`router-replay.cjs` `d5e13da…`, `score-skill-benchmark.cjs` `d5a9cc7…`, `load-playbook-scenarios.cjs` `5029f22…`); change what LEGACY routes (any `hub-router.json`/`mode-registry.json`/SKILL.md routing); flip a non-hub (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode); flip any hub before it is compiled-serving; touch the 2 strays (`mcp-tooling/008-mcp-aside`, `system-deep-loop/032-…`); merge to v4 without explicit operator go-ahead (still ungranted as of this reconciliation pass).
