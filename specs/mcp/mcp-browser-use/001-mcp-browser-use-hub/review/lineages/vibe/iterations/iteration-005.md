---
title: Review Iteration 005 - cross-reference (integration verification)
description: Final iteration of the vibe lineage; verifies the compiled-routing serving closure, the admission gate and the promoted-copy parity that decide whether the hub is served at all.
trigger_phrases:
  - "iteration 005"
  - "cross-reference integration verification"
importance_tier: normal
contextType: analysis
version: 1.0.0.0
---

# Review Iteration 005 - cross-reference (integration verification)

## Dispatcher

- Run: `fanout-vibe-1795299580084-7g6zan`, generation 1, lineage mode `new`.
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder).
- Artifact directory: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe`.
- Dimension: cross-reference (integration verification) — the fifth and last configured dimension.
- Operator review focus: the 8 commits `main..HEAD` that build the browser-use parent hub. This iteration addressed the focus by reading the one integration surface the earlier four iterations deferred: the compiled-routing serving closure and the gates that promote it. Those files are in the branch diff (`git diff --stat main..HEAD -- .skilled/bin/lib/compiled-routing/` reports 14 files changed, 1039 insertions), so they are edited files, not renames, and therefore in scope.
- `steer.md` does not exist in the lineage directory; no lead ruling was available to bind.

## Files Reviewed

- `.skilled/bin/compiled-route-sync.cjs` (read: header contract and `--check` semantics)
- `.skilled/bin/compiled-route-admission.cjs` (executed read-only, no `--out`)
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` and its authored twin
- `.skilled/bin/tests/compiled-route-admission.test.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`

## Findings - New

### P0 Findings

None. No active P0 exists in this run.

### P1 Findings

No new P1 findings this iteration.

**Refinement of R4-P1-001 (not a new finding).** Iteration 4 raised the hub-routing report's recorded FAIL as a P1 on the grounds that no later run supersedes it. This iteration ran the gate that report cites and settled the question in the direction that makes the finding sharper rather than weaker: `node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use` prints `mcp-browser-use pass 7 pass, 0 drift, 0 stale, 0 n/a` and `Every hub passes the admission check`, exit 0. The gate is green; the recorded run is red. R4-P1-001 therefore stands at P1 as a stale-evidence defect — the packet's newest hub-routing record contradicts the live gate — and is not a report of a broken gate. The fix is to record a superseding run, not to repair the admission check. Recorded as a refinement row in `deltas/iter-005.jsonl` with `"refines":"R4-P1-001"`.

### P2 Findings

1. **The promoted serving closure is not reproducible from its authored source: one served file has drifted and the parity gate exits 1** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:253` -- `node .skilled/bin/compiled-route-sync.cjs --check` prints `SYNC FAILED: 1 served file(s) out of sync` and exits 1. The served copy reads `'Name the target document or Skilled component.'`; its authored source at `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:253` still reads `'Name the target document or OpenCode component.'`. The `--check` mode is documented at `.skilled/bin/compiled-route-sync.cjs:26` as writing nothing and failing when a served copy is missing or differs from its authored file, so this is a pure read-only parity verdict.
   Finding class: promoted-copy drift
   Scope proof: both paths are inside the branch diff's compiled-routing surface; the drift is a one-line `diff` between the two files, and `git status --porcelain` on both paths is empty, so the drift is committed rather than a dirty working tree.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs`, `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs`, `.skilled/bin/compiled-route-sync.cjs`
   Case: an operator runs `compiled-route-sync.cjs --check` before promoting the closure, gets exit 1, and cannot tell from the message whether the browser-use hub they are shipping caused it — the failing file belongs to the `sk-doc` hub, which this branch never touched, so the gate's red light is attributed to the wrong change and the real fix (re-minting the `sk-doc` bundle or copying the authored string forward) is not obvious.

   **Adjudicated out of scope at synthesis.** The file is absent from `git diff --name-only main..HEAD` and absent from `reviewScopeFiles`, so the Scope Lock forbids keeping it as an active code finding. Recorded through the append gateway as a `claim_adjudication` row with `finalSeverity: "none"`; the observation survives in `review-report.md` under Limitations as a pre-existing issue worth a separate ticket. The scope gate caught this: it first reported `findings-out-of-scope`, and the adjudication is what resolved it.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | Carried from iteration 3 and re-confirmed: the completion criteria in the parent goal are satisfied by the artifacts this iteration read. The serving closure lists `mcp-browser-use` among 8 hubs with `fileCount: 69` matching `len(files) == 69`, and `generatedFrom` resolves to an existing directory. |
| `checklist_evidence` | core | pass | Carried from iteration 3. This iteration added no criterion evidence and contradicted none. The new P2 is in the promoted mirror of a sibling hub, not in any child phase `tasks.md` evidence. |

## Integration Evidence

- **Admission gate** — `node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use` (read-only, no `--out`): `mcp-browser-use pass 7 pass, 0 drift, 0 stale, 0 n/a`, `Every hub passes the admission check`, exit 0. The cohort-wide line confirms the check ran over all hubs, not only the named one.
- **Serving closure** — `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`: 8 hubs, `fileCount: 69` equals the actual `files` array length, `generatedFrom: specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists on disk. `mcp-browser-use` is present in the closure.
- **Promoted-copy parity** — `node .skilled/bin/compiled-route-sync.cjs --check`: exit 1, one file out of sync (`007-sk-doc/lib/registry-compiler.cjs`), all 8 hubs still resolve. The `mcp-browser-use` bundle itself is byte-identical to its authored source across all five files (`lib/registry-compiler.cjs`, `lib/router.cjs`, `lib/policy-card.cjs`, `harness/build-artifacts.cjs`, `fixtures/canary-cases.v1.json`).
- **Activation manifest** — `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` is byte-identical to its authored twin, carries `servingAuthority: "compiled"`, `shadowOnly: false`, and `selectedPolicy.effectivePolicyHash: 8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a`, matching the hash iteration 1 compiled in memory from the three authored hub files.
- **Pinned corpus** — `.skilled/bin/tests/compiled-route-admission.test.cjs:32` sets `LIVE_CORPUS_SIZE = 85`, consistent with the 78→85 growth the hub-routing report records.
- **Fail-safe path** — `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` returns `{servingAuthority:'legacy'}` on any error, and `resolve.cjs` honours `SPECKIT_COMPILED_ROUTING` with `0`/`false`/`off` as a fleet kill-switch and an invalid value failing closed to legacy. A broken closure degrades to the legacy router rather than mis-routing.

## Edge Cases

- **Pre-existing drift attributed to this branch.** The parity failure is in the `sk-doc` bundle. `git log --oneline main..HEAD -- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs` is empty, and on `main` the same two files already disagree at line 253. The drift therefore predates the branch and is not a regression this review can charge to it. Severity is held at P2 for that reason; the finding is still reported because the branch's own parity gate is red and a reader of the branch would reasonably assume the branch caused it.
- **`--check` exit code masked by a pipe.** The first run was piped to `tail`, so `$?` reported `tail`'s status. Re-run without a pipe: `REAL_EXIT=1`. The finding cites the unpiped exit code.
- **In-memory compile of the `mcp-tooling` bundle is not available.** That hub's `registry-compiler.cjs` exports `artifactBytes, assertNoTransportApprover, compileRegistry, destinationKey, extractMutationSignals, sha256` and no `HUB_ID`/`REGISTRY_SOURCE`, so the iteration-1 technique does not transfer. The cohort-wide admission line covers the same ground and is used instead. Recorded as a ruled-out direction rather than retried.
- **`resource-map.md` absent.** The coverage gate is skipped for this packet, as recorded in the strategy's known context. No finding is raised for it; it is a packet-shape fact, not a defect.

## Confirmed-Clean Surfaces

- The `mcp-browser-use` promoted bundle is byte-identical to its authored source in all five files.
- The `mcp-browser-use` activation manifest is byte-identical to its authored twin and its policy hash matches the in-memory compile.
- `serving-closure.manifest.json` is internally consistent: `fileCount` equals the array length, and `generatedFrom` resolves.
- The admission check passes for the whole hub cohort with zero drift and zero stale gold.
- The compiled front door fails safe to the legacy router on error and on an invalid kill-switch value.

## Ruled Out

- **`serving-closure.manifest.json` `fileCount` disagreeing with its `files` array.** Counted: 69 vs 69. Clean.
- **`generatedFrom` pointing at a path the branch's spec move deleted.** `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists and holds 20 child folders including `009-parent-hub-rollout` and `013-live-activation`. Clean.
- **The admission check being broken, which would have made R4-P1-001 a P0.** It exits 0 with 7 pass and 0 drift. R4-P1-001 is stale evidence, not a broken gate.
- **The `mcp-browser-use` bundle drifting from its authored source.** All five files in sync; the single drift is in the `sk-doc` bundle.
- **Compiling the `mcp-tooling` bundle in memory to check its manifest.** Its `registry-compiler.cjs` exports a different surface with no `HUB_ID`/`REGISTRY_SOURCE`; the cohort-wide admission line already covers it.

## Next Focus

- Dimension: none remaining — correctness, security, traceability, maintainability and cross-reference are all complete.
- Focus area: synthesis. Consolidate the 3 active P1 and 8 active P2 findings into the review report and the planning packet.
- Reason: `config.stopPolicy: max-iterations` with `config.maxIterations: 5` is reached; convergence is telemetry only.
- Rotation status: all five configured dimensions complete.
- Blocked/productive carry-forward: productive — running the gate a recorded report cites, rather than reading the report alone, is what separated a stale record from a broken gate. Reuse it at synthesis when rechecking the carried-forward P1s.
- Required evidence: the findings registry, the dashboard, and the three carried-forward P1 findings re-read against current file content.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
