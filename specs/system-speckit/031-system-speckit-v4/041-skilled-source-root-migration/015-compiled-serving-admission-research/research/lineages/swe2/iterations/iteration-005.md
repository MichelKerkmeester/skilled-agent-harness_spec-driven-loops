# Iteration 5: The recommendation and the build steps (Q5)

## Focus

Which path to recommend, and what a later build phase would actually build and test — weighing bar fidelity (restore), cost (new checker), and risk (keep closed) against what the admission decision genuinely needs.

## Findings

1. **Recommended path: B — build the new checker of compiled decisions against routing-scenario gold.** The admission question for a NEW hub is "does its compiled engine route correctly per the hub's authored routing contract on every scored scenario." Gold-agreement measures that directly on live dependencies; legacy-equivalence measures it indirectly through a replay proxy whose own fidelity was never separately certified. The corpus the checker needs is alive and maintained: 262 gold-bearing playbook files across 44 `manual-testing-playbook` dirs for the five current hubs (sk-code 88, mcp-tooling 66, system-deep-loop 41, sk-doc 36, cli-external-orchestration 31), and a new hub authors its own playbook corpus as part of the coverage build-out recipe anyway. [SOURCE: live `grep -rln expected_workflow_mode|expected_intent` census per hub; file:specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/goal-coverage-buildout.md:55]

2. **Why not restore (Path A): 5x the code for a proxy the bar never needed.** A surgical restore is ~3,700 lines (5-7 modules) plus re-owning the frozen-trio pin discipline and the `.opencode`→`.skilled` path-churn verification — to recover a comparison that was itself compiled-vs-replay-proxy, not compiled-vs-legacy (router-replay reproduces substring-scoring over SKILL.md dicts; it is a model of the router, not the router). Restore is the right choice only if operators decide the bar must remain literally "== legacy" — in which case the replay must come back too, because parity delegates the verdict to the same retired scorer. [SOURCE: file:router-replay.cjs@b45ea54cea3^:7-21; file:compiled-routing-parity.cjs@b45ea54cea3^:64-71; commit:b45ea54cea3 census]

3. **Why not keep-closed (Path C): it converts a tooling gap into a permanent program freeze.** Cost is ~0 and the five admitted hubs keep serving, but new-hub admission becomes unreachable, `create-skill --compiled-routing ready` keeps minting manifests for a verdict that can never be earned, admitted-hub drift goes unmeasured (refresh re-mints mechanically with no correctness re-check), and the "seven hubs" doc debt keeps compounding. It is only honest if the operator declares the compiled-routing cohort permanently closed — a different decision than the one this spec asks. [SOURCE: file:compiled-routing-architecture.md:87-105; file:.skilled/bin/lib/compiled-route-manifest.cjs:693-780; commit:f931ba2e14; commit:a9286399bc3]

4. **The semantic redefinition must be recorded, not smuggled.** Under Path B the bar becomes "compiled decisions agree with the authored routing gold on every scored scenario — zero violations" replacing "compiled == legacy replay." Two consequences, both documented in iteration 2: (a) a shared pre-existing gold gap now blocks (stricter — CS-002/CS-005 pattern), handled by classifying it as a corpus finding that is loud, not silently waived; (b) a correct-but-different-from-legacy decision now passes (looser — but only where gold is authored and maintained, and the corpus-completeness gate below bounds the ungolded surface). [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:712-740; file:playbook-verify report.md:33-44]

5. **The checker's risk register and mitigations.** (a) Self-grading — require the playbook gold corpus as the admission bar; `canary-cases.v1.json` (67 cases across 5 hubs, normalized JSON already in the serving closure) runs only as a pre-admission smoke gate. (b) Coverage blindness — a corpus-completeness gate: every `workflowMode` the hub's `leaf-manifest.json` declares must be exercised by ≥1 scored routing scenario, and every negative/`UNKNOWN` gold must score; modes with no scored scenario are violations, not silence. (c) Defer/holdout/negative — the counting rule from iteration 2, ported from the retired semantics. (d) Gold parse failure — a violation, never dropped from the denominator (frozen-scorer rule, ported). [SOURCE: file:load-playbook-scenarios.cjs@b45ea54cea3^:461-481,555-575; file:score-skill-benchmark.cjs@b45ea54cea3^:891-945; file:.skilled/skills/sk-doc/leaf-manifest.json; canary census]

6. **What a later phase builds (Path B work breakdown).** (i) `check-compiled-routing.cjs` (~500-800 lines): a two-shape playbook-gold loader (sk-code index-table + sk-doc per-scenario frontmatter; `@spec-kit/shared` is live with `"./*.js"->"./dist/*.js"` exports), the comparator port (`evaluateRouteGold` semantics + parity's ordered projection + leaf must-include), the rollup (serving/violations/broken sub-verdicts mirroring Lane C's), the completeness gate, and a JSON+markdown report matching the archived report shape. (ii) Vitest suite covering the status space via injected fixtures (parity's own vitest did exactly this). (iii) Admission runbook: shadow-child build-out per the proven recipe → register `HUB_CHILD` → run checker to a clean verdict → `compiled-route-manifest.cjs mint/refresh` → flip `servingAuthority`→`compiled`+`shadowOnly`→`false` (repair `flip-serving.cjs`'s stale scorer gate — its `SCORER_DIR` points at the dead `mcp-server` path — or perform the gated two-field manifest edit under the same lock/journal discipline) → add to `DEFAULT_ON_HUBS`, guard `HUBS`, advisor `COMPILED_ROUTING_HUBS`+`DEFAULT_ON_HUBS` → `compiled-route-sync.cjs` promote + regenerate `serving-closure.manifest.json` → `compiled-route-guard.cjs` green → foundation vitest green (it asserts all cohort copies agree). (iv) Doc fixes: "seven"→"five" across architecture doc + `resolve.cjs` comment + spec text; record the bar redefinition in `compiled-routing-architecture.md` §4. [SOURCE: file:.skilled/bin/compiled-routing-foundation.vitest.ts:54-70,126-128; file:.opencode/scripts/git-hooks/pre-commit:281-330; file:.skilled/bin/compiled-route-sync.cjs:1-50; file:specs/.../shared/frozen-scorer-contract.cjs:27-47]

7. **Cost/risk summary the operator can act on.** Build: ~500-800 lines of new code + ~300-400 of tests vs ~3,700 restored lines + freeze discipline (restore) vs 0 (closed). Risk: semantic-bar change + self-grading + coverage blindness, each with a named mitigation above. Reversibility: a new hub is removable byte-identically (manifest flip back, cohort-table removal, flag kill-switch) exactly as the five today. [SOURCE: synthesis of iterations 1-4]

8. **Decision rule for the operator.** Choose Path B if new hubs will ever be admitted (the spec's premise). Choose restore only if the bar must stay literally "== legacy replay" — and budget the replay+scorer resurrection, not just the parity harness. Choose closed only alongside an explicit "cohort permanently frozen" decision + doc debt fix. [SOURCE: synthesis]

## Sources Consulted

- `goal-coverage-buildout.md` + `013-compiled-coverage-buildout/` docs (the proven per-hub recipe: registry-compiler + router + canary-cases until compiled==legacy on the full playbook set)
- Per-hub gold census: `grep -rln expected_workflow_mode|expected_intent` across `.skilled/skills/<hub>`
- All evidence from iterations 1-4 re-weighed

## Assessment

- **newInfoRatio: 0.55** — the recommendation itself is analytical synthesis over iterations 1-4; the new evidence is the coverage-buildout recipe, the per-hub gold census, and the corpus-completeness-gate design. Lower ratio reflects synthesis, not thin evidence.
- Status: `insight` territory but reported `complete` — this is the analytical iteration that closes Q5.
- Confidence: high on the recommendation's cost basis; the semantic-bar trade-off is honestly flagged as an admission-policy decision the operator must ratify.

## Reflection

- **Worked:** the coverage-buildout doc confirmed a new hub's playbook corpus is authored *as part of* admission build-out anyway — so Path B's corpus requirement is not an extra burden but the same work the recipe already demands.
- **Failed/limited:** no prototype of the checker was built (research-only scope); line estimates are from dependency analysis of the retired modules' relevant sections.
- **Ruled out:** recommending restore "for fidelity" — the fidelity is to a proxy; recommending closed "for safety" — it freezes the program rather than protecting it.

## Recommended Next Focus

Synthesis: consolidate iterations 1-5 into `research.md` answering Q1-Q5 with file:line/commit citations, the ranked recommendation (Path B), its costs/risks, and the build-step runbook — plus `resource-map.md`, registry/dashboard/strategy refresh, and the terminal `phase_synthesis` record with `stopReason: "maxIterationsReached"`.
