# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1)
- Dimension: correctness (second pass, compiled-routing engine strand)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration took the one phase 015 criterion the previous pass could not settle (the five probe prompts) and settled it through the compiled engine, and it checked whether the phase's re-minted activation manifest still matches the compiled policy the engine loads.

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:1-150`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:1-200`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/fence-state.json:1`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:26-70`, `:161-228`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:86-150`
- `.skilled/bin/tests/compiled-route-hyphen-parity.test.cjs:28`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:45`, `.skilled/bin/tests/compiled-route-admission.test.cjs:28-98`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/spec.md:96-104`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The engine fingerprints the live manifest while the resolver gates on the overridable one** -- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:27` -- `ACTIVATION_ROOT` here is a fixed path, and `manifestFingerprint` reads it for the engine cache key. `resolve.cjs:26` builds its `ACTIVATION_ROOT` from `SPECKIT_ACTIVATION_ROOT_OVERRIDE` first, and the two routing tests (`compiled-route-hyphen-parity.test.cjs:28`, `compiled-route-surface-hint.test.cjs:45`) set that variable. Under the override the serving gate reads the temp manifest while the cache key and any later manifest-derived read come from the committed tree, so the two halves of one decision can describe different activation states.
Case: point `SPECKIT_ACTIVATION_ROOT_OVERRIDE` at a temp copy, flip its `mcp-browser-use` manifest to `servingAuthority: "legacy"`, and call `resolveRoute` twice across a process that previously loaded the live engine: the gate resolves legacy correctly, but the cache key never moved with it, so nothing in the engine invalidates on the manifest the gate actually read.
Finding class: `narrow-correctness`
Scope proof: both constants are read at the cited lines; the two test files that set the variable are read; `manifestFingerprint` is the only consumer of the engine's `ACTIVATION_ROOT`.
Affected surface hints: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, `.skilled/bin/tests/compiled-route-hyphen-parity.test.cjs`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`.

2. **The resolver's CLI front door misses `--hub` and then routes with the wrong argument** -- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:173` -- `const hub = args[args.indexOf('--hub') + 1]` yields `args[0]` when `--hub` is absent, because `indexOf` returns `-1`. The usage guard then does not fire (the value is truthy), and the process prints a legacy sentinel naming the first CLI argument as the hub and exits 0.
Case: `node resolve.cjs --prompt "open devtools"` prints `{"servingAuthority":"legacy","hubId":"--prompt"}` with exit 0 instead of the `--hub` usage line and exit 2, so a caller cannot tell a malformed invocation from a legitimate legacy fallback.
Finding class: `narrow-correctness`
Scope proof: the parse and the guard are read at `resolve.cjs:170-179`; the fallback print at `:180` is unconditional in the non-null branch.
Affected surface hints: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, and any hub `SKILL.md` routing directive that invokes the front door.

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | `015/spec.md:96-104` names the activation manifest "re-minted for policy `fc55eafa`"; the manifest at `activation/mcp-browser-use/manifest.json:1` holds `effectivePolicyHash` `fc55eafafd5f…aeb8`, and a read-only `loadSnapshot()` returned the identical hash at `generation` 1, so the pin is current and not merely restated. |
| `checklist_evidence` | core | pass | `015/goal.md:41` criterion 1 ("routes `orderedBundle` to all three modes") was reproduced through `resolveRoute("mcp-browser-use", "use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro")`, which returned `action: route`, `selectionKind: orderedBundle`, targets `mcp-chrome-devtools`, `mcp-aside-devtools`, `mcp-bladebro` in that order. Criterion 2's two hub probes now `defer` (see Confirmed-Clean Surfaces), so the previous pass's `partial` is raised to `pass` on the evidence cited there. |
| `skill_agent` | overlay | notApplicable | The hub's `SKILL.md` contract is reviewed under `feature_catalog_code`/traceability in this run; no agent definition is in the seeded scope. |
| `agent_cross_runtime` | overlay | notApplicable | No agent mirror is in the seeded scope for this target. |

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:26` and `:112-131` form the serving gate; the browser hub passes it (`servingAuthority: "compiled"` at `activation/mcp-browser-use/manifest.json:1`, and `mcp-browser-use` is in `DEFAULT_ON_HUBS` at `resolve.cjs:47-56`).
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:39` compiles from `.opencode/skills/<hub>`, which is a symlink to `.skilled/skills` (verified: `.opencode/skills -> ../.skilled/skills`, and `hub-router.json` is byte-identical on both paths), so phase 015's edit reaches the compiled snapshot rather than a stale copy.
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` pins `activationGeneration: 1`, which is the generation the manifest selects.

## Edge Cases

- **`loadSnapshot()` was called in-process, not through the CLI.** `build-artifacts.cjs` writes only inside `buildArtifacts()` (guarded by `require.main === module` at `:228`), and `loadSnapshot()` is pure, so the check wrote nothing. This is stated because a "build-artifacts" harness is exactly the kind of script a review must not run blind.
- **Two probes were exercised, not all five.** The phase 015 criterion names five probe prompts; the two that the hub could own (`fix the code in the parser`, the `staging` loader prompt) were reproduced. The remaining three target `system-deep-loop`, `mcp-tooling` and `mcp-code-mode`, which are outside this target's review scope, so the criterion is marked `pass` for the hub strand only and the advisor strand rests on source reads from iteration 1.
- **Legacy-path shadowing is out of scope here.** The engine selects compiled destinations only; whether the legacy prose router still answers first is a different integration and was not exercised.

## Confirmed-Clean Surfaces

- The three-mode bundle routes all three, in order, through the live compiled path (observed, not inferred).
- `fix the code in the parser` returns `action: defer` with no targets, and `fix the config loader that reads the wrong settings file in staging` also defers: the two hub-side leaks phase 015 claims to have closed are closed at the engine.
- A single-mode prompt still routes (`open devtools on this page and capture a screenshot` selects `mcp-chrome-devtools` as `single`), so the vocabulary change did not over-narrow the hub.
- The activation manifest, the fixture generation and the compiled snapshot agree; `fence-state.json` holds `fencingEpoch: 1` and `schemaVersion: V1`.
- `flagPermitsCompiled` fails closed on an invalid flag value and logs a breadcrumb instead of forcing a route (`resolve.cjs:69-80`).

## Ruled Out

- **The engine compiles from a stale `.opencode/skills` copy** -- ruled out: `.opencode/skills` is a symlink to `.skilled/skills` and the two `hub-router.json` paths are byte-identical.
- **A manifest hash drift makes the hub's compiled serving inert** -- ruled out by the observed hash match.
- **`compiledRoute` drops the surface hint from the returned targets** -- ruled out: `route` is a `let` reassigned from `applySurfaceHint` before `normalizeTargets(route)` reads it (`compiled-route.cjs:120-127`).
- **`surfaces` ordering is unexercised** -- ruled out as a scope claim: `compiled-route-surface-hint.test.cjs:45` exists and sets the override, so the ordering contract has a test, which is why Finding 1 is about cache coherency and not about ordering.

## Next Focus

- Dimension: security
- Focus area: the three mode installers and doctor scripts (`mcp-*/scripts/install.sh`, `doctor.sh`, `commands/doctor/scripts/check-mcp-mutation-class.sh`, `.skilled/scripts/git-hooks/pre-commit`) plus the trust boundaries they touch
- Reason: the phase 015 installer change introduced a digest gate; the sibling installers and the doctor/commit-hook scripts are the same class of surface and were never reviewed in this run
- Rotation status: correctness closed for this run's reachable strands; security begins
- Blocked/productive carry-forward: productive, direct reads plus the pinned-digest comparison pattern
- Required evidence: direct reads at each fetch-to-execute seam, and the mutation-class manifest they claim to enforce

Review verdict: PASS
