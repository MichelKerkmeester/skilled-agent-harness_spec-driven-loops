# Review Iteration 002

## Dispatcher

- **Mode**: review
- **Target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: correctness
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- **How this iteration addressed the focus**: it checked goal criterion 5's second half -- that the hub router returns the mode -- against the engine that actually serves it in production, and against the canary corpus that admitted this hub to compiled serving. It also checked the phase 005 claim that the compiled engine serves this hub.
- **Sources read**: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{resolve.cjs,compiled-route.cjs}`, `.skilled/bin/lib/compiled-route-layout.cjs`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/{manifest.json,fence-state.json}`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/{harness/build-artifacts.cjs,fixtures/canary-cases.v1.json}`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`, `.skilled/scripts/git-hooks/pre-commit`

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:1-159`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:1-126`
- `.skilled/bin/lib/compiled-route-layout.cjs:1-80`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/fence-state.json:1`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:30-60`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:1-160`
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1`
- `.skilled/scripts/git-hooks/pre-commit:459-500`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The admission canary corpus never exercises the hub's declared three-mode bundle or its canonical ids** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:4` -- The corpus holds 15 cases. Its only bundle case is `named-tools-bundle`, "compare chrome devtools and bladebro on this page" (`canary-cases.v1.json:141`), a two-mode bundle. No case names all three modes, and no case uses the `workflowMode` ids the registry publishes. `resolve.cjs:34` states this corpus is what admitted the hub: "mcp-browser-use, admitted on its own canary corpus after it split out of mcp-tooling", and `resolve.cjs:39-48` lists the hub in `DEFAULT_ON_HUBS`, so an unset flag serves it compiled. The corpus therefore cannot prove the `orderedBundle` outcome declared at `hub-router.json:14`, and iteration 1's defect -- the three canonical ids routing to two modes -- passed admission unobserved.
   Finding class: correctness
   Scope proof: the corpus, the resolver that names it as admission evidence, and the router outcome it fails to cover are all inside the declared target's shipped routing surface.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`; `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` `DEFAULT_ON_HUBS`; `.skilled/skills/mcp-browser-use/hub-router.json` outcomes.
   Case: a maintainer changes the Bladebro vocabulary, runs the canary corpus, sees 15/15 pass, and flips serving authority to `compiled` -- while a three-mode request still drops Bladebro, because no case asks for three modes.

```json
{
  "type": "claim",
  "claim": "The canary corpus that admitted mcp-browser-use to compiled serving has no case for the hub's declared three-mode orderedBundle outcome and no case using the canonical workflowMode ids, so the iteration-1 routing defect could not be caught at admission.",
  "evidenceRefs": [
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:4",
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:141",
    ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34",
    ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:39",
    ".skilled/skills/mcp-browser-use/hub-router.json:14"
  ],
  "counterevidenceSought": "Enumerated all 15 case ids and prompts to confirm no three-mode case and no canonical-id case exists. Checked whether a second corpus covers the hub: the serving-closure manifest lists only this one fixtures file for mcp-browser-use. Checked whether the corpus is illustrative rather than admission evidence: resolve.cjs:34 names it as the admission basis, which rules that reading out.",
  "alternativeExplanation": "The corpus could be a smoke set, with the full contract proven elsewhere. Rejected: the serving-closure manifest lists exactly one fixtures file for this hub, and resolve.cjs names that corpus as the admission basis, so no other artifact carries the proof.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if a second, broader corpus is shown to gate this hub's serving authority, or if the corpus is documented as illustrative rather than admission evidence."
}
```

### P2 Findings

2. **The engine ignores the activation-root override the resolver honours** -- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:29` -- `resolve.cjs:22-25` reads `SPECKIT_ACTIVATION_ROOT_OVERRIDE` and its comment states the purpose: "Tests point SPECKIT_ACTIVATION_ROOT_OVERRIDE at a temp copy so the harness never reads or mutates live committed state." `compiled-route.cjs:29` hardcodes the same activation root with no override, and `manifestFingerprint` (`compiled-route.cjs:46-53`) reads `manifest.json` from it. With the override set, the resolver gates on the temp manifest while the engine fingerprints the live one, so the stated isolation does not hold.
   Finding class: correctness
   Scope proof: both files are the shipped runtime engine for this hub's compiled route.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` `ACTIVATION_ROOT` and `manifestFingerprint`; `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` override.
   Case: a test sets `SPECKIT_ACTIVATION_ROOT_OVERRIDE` to a temp activation tree and flips the temp manifest's `selectedPolicy`; the resolver reads the temp manifest, but the engine's cache key still comes from the live manifest, so the test reads live committed state despite the comment promising it does not.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1` | Phase 005's claim that the compiled engine serves this hub holds: the manifest carries `servingAuthority: "compiled"`, `selectedPolicy.effectivePolicyHash` `be9b1fe7...` and `generation: 1`, and the executed route returned exactly that hash and generation. |
| `checklist_evidence` | partial | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:141` | Criterion 5's admission evidence is partial: the corpus proves each mode singly and one two-mode bundle, but not the three-mode bundle the hub declares. |

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` -- the serving-authority resolver that gates the compiled route on the flag, the manifest and the policy identity.
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` -- the engine that loads the hub's snapshot and evaluates it.
- `.skilled/bin/lib/compiled-route-layout.cjs` -- selects one coherent layout (`current` = `014-runtime-engine`, `legacy` = `011-runtime-engine`) and fails closed rather than mixing generations.
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` -- lists the eight `mcp-browser-use` closure files, including `manifest.json`, `fence-state.json` and the three lib modules, so the hub is inside the verified serving closure.
- `.skilled/scripts/git-hooks/pre-commit:459-500` -- the mirror parity gate; its `MIRROR_SOURCES` list does not include `.opencode/skills/mcp-browser-use`, which is why the mirror question below was ruled out on a different ground.

## Edge Cases

- **Ambiguity: is the engine reading a mirror rather than the canonical skill?** `build-artifacts.cjs:39` sets `SKILL_ROOT` to `.opencode/skills/mcp-browser-use`, which reads as a mirror dependency. Ruled out: `.opencode/skills` is a symlink to `../.skilled/skills`, and `stat` confirms both `hub-router.json` paths share inode `1288838277`. The engine reads the canonical file. Recorded so a later iteration does not re-raise it.
- **Partial success**: the `fence-state.json` (`fencingEpoch: 1`) is listed in the serving closure but is not read by the resolver or the engine; only `compiled-route-status.cjs`, `compiled-route-sync.cjs` and the foundation test read it. Not a finding, because the fence is a sync-tool concern rather than a route-time gate.
- **Ambiguity: does the engine cache serve a stale policy after a vocabulary edit?** `loadHubEngine` keys its cache on the manifest fingerprint (`compiled-route.cjs:59`), not on the hub's authored files, so an in-process edit to `hub-router.json` would serve the cached snapshot. Kept out of the findings because each CLI invocation is a fresh process, so the window is one process and no shipped caller edits the vocabulary mid-run.

## Confirmed-Clean Surfaces

- `resolve.cjs:96-118` `resolveRoute` fails safe on every path: a missing manifest, a non-`compiled` serving authority, a policy-hash or generation mismatch, and any thrown error all return `null`, which `bin/compiled-route.cjs:60-68` turns into the `{"servingAuthority":"legacy"}` sentinel rather than a wrong route.
- `resolve.cjs:66-79` `parseFlagMode` is tri-state and fails closed: `0`/`false`/`off` is the fleet-wide kill-switch, an unset flag defers to the per-hub cohort, and any other value is treated as invalid and serves legacy with a breadcrumb.
- `compiled-route-layout.cjs:60-70` `isCoherent` requires the resolver, engine and compiler to exist together, so a partial layout cannot mix a current engine with a legacy activation tree.
- `bin/compiled-route.cjs:28-40` rejects an unknown option with exit 2 rather than routing with a hub or prompt the caller never supplied.

## Ruled Out

- **The compiled engine reading a stale mirror instead of the canonical skill**: ruled out by inode identity -- `.opencode/skills` is a symlink to `../.skilled/skills`.
- **The hub serving legacy despite the phase 005 claim**: ruled out by execution -- the route returned `effectivePolicyHash` `be9b1fe7...` and `generation: 1`, matching the manifest's `selectedPolicy` exactly.
- **`fence-state.json` being an unread dead artifact**: ruled out -- `compiled-route-status.cjs`, `compiled-route-sync.cjs` and `compiled-routing-foundation.vitest.ts` read it.
- **A missing or malformed manifest causing a throw into the routing hot path**: ruled out -- `readManifest` returns `null` on a read or parse failure and `resolveRoute` then returns `null`.

## Next Focus

- **Dimension**: security
- **Focus area**: the trust boundaries this hub's modes cross -- the Bladebro install path and its operator-yes gate (D5), the Aside signed-in account handling, the Chrome `--autoConnect` live-profile path, and the MCP wiring references that carry credentials or profile directories.
- **Reason**: correctness has now covered the hub's routing data, the scorer, the engine and its admission evidence. Security is the next unreviewed dimension and the modes handle signed-in browser profiles, which is the highest-impact surface in the packet.
- **Rotation status**: correctness is complete for the routing surfaces; security, traceability and maintainability remain.
- **Blocked/productive carry-forward**: productive -- reading the admission corpus alongside the resolver that names it as admission evidence produced a P1 in one pass.
- **Required evidence**: file:line for the install gate, the credential or profile handling, and the MCP wiring that names a secret or a profile directory.

Review verdict: CONDITIONAL
