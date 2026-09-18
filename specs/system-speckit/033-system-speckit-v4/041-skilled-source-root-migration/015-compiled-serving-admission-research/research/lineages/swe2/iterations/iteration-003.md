# Iteration 3: The admission machinery beyond the check (Q3)

## Focus

What admission needs beyond the parity/gold check itself: the frozen `HUB_CHILD`/`DEFAULT_ON_HUBS` tables, the activation manifest re-mint path, and `compiled-route-guard.cjs` freshness — plus every other site where the hub cohort is hardcoded.

## Findings

1. **The cohort is hardcoded in SIX places, and tests enforce they move together.** (a) `HUB_CHILD` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:30-36` — the engine registry; a hub absent here throws `unknown hub` from `compiledRoute`, so registration precedes measurement. (b) `DEFAULT_ON_HUBS` in `resolve.cjs:34-40` — the default-on cohort, the actual admission. (c) `HUBS` in `.skilled/bin/compiled-route-guard.cjs:41-47` — the freshness-monitored set; also the auto-remint hook's hub list source. (d) Advisor-side copies `COMPILED_ROUTING_HUBS` + `DEFAULT_ON_HUBS` in `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:14,30`, consumed by `advisor-recommend.ts:334`. (e) `serving-closure.manifest.json` `hubs[]` + `files[]` — the promoted file inventory. (f) The authored counterparts under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/` — edits land there and are promoted by `compiled-route-sync.cjs`. [SOURCE: each cited file:line]

2. **Cohort consistency is test-enforced, so partial edits fail loudly.** `compiled-routing-foundation.vitest.ts` asserts `sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD))`, advisor `DEFAULT_ON_HUBS` == bin resolver == authored resolver, and promoted resolver == authored resolver; `compiled-route-manifest.test.cjs:1127` pins `DEFAULT_ON_HUBS.size === 5`. An admission that edits only some sites is caught — the failure mode is a red battery, not silent divergence. [SOURCE: file:.skilled/bin/compiled-routing-foundation.vitest.ts:54-70,126-128,246-272; file:.skilled/bin/tests/compiled-route-manifest.test.cjs:1127]

3. **The manifest lifecycle is mint → refresh → flip, with the flip owned by authored-only tooling.** `compiled-route-manifest.cjs mint` writes an inert `{schemaVersion:V1, selectedPolicy:{hash,generation:1}, servingAuthority:'legacy', shadowOnly:true}` manifest. `refresh` recompiles at generation+1, prefers the shadow-child snapshot (`shadowChildPolicyFor`), and preserves `servingAuthority`/`shadowOnly` re-read late — atomic temp+rename publish. The `legacy`→`compiled` flip lives in `specs/.../014-runtime-engine/lib/flip-serving.cjs` (P4b): a fenced compare-and-swap gated on P4a binding (`013-live-activation/lib/activate-hub.cjs`), shadow canary green, `assertScorerFrozen`, snapshot identity == selectedPolicy — under the shared per-hub lock with a write-ahead journal and `--rollback`. It was never promoted to `.skilled/bin`. [SOURCE: file:.skilled/bin/lib/compiled-route-manifest.cjs:606-645,693-780; file:specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/flip-serving.cjs:1-26; file:specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/lib/activate-hub.cjs:6-13]

4. **The authored flip path is currently broken at its scorer gate.** `flip-serving.cjs` requires `shared/frozen-scorer-contract.cjs`'s `assertScorerFrozen`, whose `SCORER_DIR` is `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer` — that directory no longer exists (the advisor scorer moved to `.skilled/skills/system-skill-advisor/runtime/lib/scorer`), so the gate throws instead of verifying. The pins file itself (frozen 2026-08-15) also names the dead `mcp-server` paths. Any path that reuses `flip-serving.cjs` must first repoint `SCORER_DIR` and re-freeze the pins — or drop the scorer gate deliberately. [SOURCE: file:specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-contract.cjs:27-47,66-69; file:specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-pins.json:1-20; live tree: `.opencode/skills/system-skill-advisor/` has `runtime/` but no `mcp-server/`]

5. **Freshness enforcement is already automated — but only for guard-listed hubs.** `compiled-route-guard.cjs` checks per hub: manifest valid + `checkCanonicalManifestFreshness` fresh (stale-manifest vs inputs-do-not-compile vs compile-error distinctions) + authored-drift (runtime manifest vs its authored counterpart under `specs/.../015-router-unification-program/013-live-activation/activation/<hub>/`); exemptions excuse only `inputs-do-not-compile` with an expiry. Live run: all 5 hubs `fresh`, authored == runtime byte-identical. [SOURCE: file:.skilled/bin/compiled-route-guard.cjs:60-171; live `node .skilled/bin/compiled-route-guard.cjs --json`; `diff` of the two sk-doc manifests → IDENTICAL]

6. **A pre-commit hook auto-re-mints when routing inputs are staged** — commit `a1faf0914a` installed it; it fires on staged `SKILL.md`/`hub-router.json`/`mode-registry.json` under `.opencode/skills` or `.skilled/skills`, reads the hub list from the guard's `HUBS` (so a new hub gets coverage by joining the guard, no hook edit), re-mints via `compiled-route-manifest.cjs refresh`, stages BOTH the runtime and authored manifests, verifies both reached the index, and blocks otherwise (`SPECKIT_SKIP_ROUTE_REMINT=1` bypass). `.opencode` and `.skilled` copies are identical. [SOURCE: file:.opencode/scripts/git-hooks/pre-commit:281-330,440-470; commit:a1faf0914a]

7. **The serve-time identity binding is the deep freshness gate.** `resolveRoute` serves compiled only when `route.effectivePolicyHash === manifest.selectedPolicy.effectivePolicyHash && route.generation === manifest.selectedPolicy.generation`; any post-flip drift drops the hub to legacy silently — the exact failure the guard and hook exist to surface. `compiled-route-status.cjs` mirrors that binding in its probe (`identity-mismatch`, `stale-manifest`, `compiled-serving` causeCodes), making it usable as cheap admission-time evidence. [SOURCE: file:.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:101-121; file:.skilled/bin/compiled-route-status.cjs:255-270]

8. **Serving-closure regeneration is mechanical.** `compiled-route-sync.cjs` instruments `require` resolution, drives the authored resolver across every hub with the flag forced on, and promotes exactly the files the serving path touches byte-identically — `--verify` asserts the promoted graph never reads the spec tree. Admission regenerates `serving-closure.manifest.json` (currently `hubs:5`, `fileCount:48`) after the new hub's shadow-child and manifest land in the authored tree. [SOURCE: file:.skilled/bin/compiled-route-sync.cjs:1-50; file:.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-48]

9. **Every manifest exists twice and must stay byte-identical:** `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/<hub>/manifest.json` (authored) and `.skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json` (promoted runtime). The guard's authored-drift check plus the hook's stage-both rule keep them equal; a new hub needs both. [SOURCE: file:.skilled/bin/compiled-route-guard.cjs:60-71; live diff]

10. **Doc debt discovered:** the architecture doc and `resolve.cjs`'s own comment still say "seven hubs" — `sk-design` was dissolved (commit `f931ba2e14`, topology 7→6) and `sk-prompt` was retired (commit `a9286399bc3`), leaving five. The spec's "seven hubs already admitted" repeats the stale count. Admission docs would need correcting as part of any path. [SOURCE: file:.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:34-42,66-68; file:.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:29-40; commit:f931ba2e14; commit:a9286399bc3]

## Sources Consulted

- `.skilled/bin/compiled-route-manifest.cjs` (CLI verbs) + `.skilled/bin/lib/compiled-route-manifest.cjs` (mint/refresh/freshness internals)
- `.skilled/bin/compiled-route-guard.cjs` (full file + live `--json` run)
- `.skilled/bin/compiled-route-sync.cjs` header (promotion model)
- `.skilled/bin/compiled-route-status.cjs` (probe causeCodes)
- `specs/.../014-runtime-engine/lib/flip-serving.cjs`, `013-live-activation/lib/activate-hub.cjs`, `shared/frozen-scorer-contract.cjs`, `shared/frozen-scorer-pins.json` (authored cutover tooling)
- `.opencode/scripts/git-hooks/pre-commit` (auto-remint gate)
- `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`, `handlers/advisor-recommend.ts`
- `.skilled/bin/compiled-routing-foundation.vitest.ts`, `.skilled/bin/tests/compiled-route-manifest.test.cjs`
- Live: manifest contents, authored-vs-runtime diff, `serving-closure.manifest.json`
- `git log` for `f931ba2e14`, `a9286399bc3`, `a1faf0914a`

## Assessment

- **newInfoRatio: 0.92** — the six-site cohort map, the mint/refresh/flip lifecycle split, the broken authored scorer gate, and the auto-remint hook mechanics are all new to this packet.
- Confidence: high — every claim was read in source or executed live (guard run, manifest diff, `compiledRoute` calls in iteration 2).

## Reflection

- **Worked:** tracing the authored↔promoted duality surfaced the non-obvious sites (advisor flag copies, serving-closure inventory, foundation vitest cohort assertions) that a naive "edit resolve.cjs" answer would miss.
- **Failed/limited:** I did not trace `flip-serving.cjs`'s full journal/lock protocol or `activate-hub.cjs`'s acceptance flow — enough was read to classify their role and the stale scorer gate, not to certify them.
- **Ruled out:** treating `compiled-route-status.cjs` as the flip mechanism — it is read-only probe evidence; the actual `servingAuthority` mutation is `flip-serving.cjs` (or a manual manifest edit, since `refresh` preserves it).

## Recommended Next Focus

Q4: cost/risk per path — restore cost (268 deleted files, retired-deps repairs like the stale scorer gate), new-checker cost (loader+comparator+rollup vs live corpus), keep-closed cost (admission permanently blocked, doc debt) — plus verifying admitted-hub report artifacts.
