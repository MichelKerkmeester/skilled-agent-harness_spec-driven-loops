# Review Iteration 001

## Dispatcher

- **Mode**: review
- **Target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: correctness
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- **How this iteration addressed the focus**: it checked goal criterion 2 (`mode-registry.json` lists exactly three modes) and criterion 5 (one real browser request per mode returns that mode from the hub router) against the shipped routing data and the shipped router, by executing the router rather than reading it.
- **Sources read**: `goal.md`, `spec.md`, `.skilled/skills/mcp-browser-use/{mode-registry.json,hub-router.json,leaf-manifest.json,leaf-scopes.json,SKILL.md,README.md}`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`, `.skilled/bin/compiled-route.cjs`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mode-registry.json:1-160`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-200`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1-40`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1-12`
- `.skilled/skills/mcp-browser-use/SKILL.md:1-110`
- `.skilled/skills/mcp-browser-use/README.md:55-60`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-157`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:120-215`
- `.skilled/bin/compiled-route.cjs:1-71`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The three canonical mode ids do not route to all three modes** -- `.skilled/skills/mcp-browser-use/hub-router.json:96-97` -- A prompt that names the three `workflowMode` values this hub publishes routes to two modes and silently drops Bladebro. `mcp-chrome-devtools` matches two vocabulary entries, `"chrome-devtools"` (`hub-router.json:96`) and `"mcp-chrome-devtools"` (`hub-router.json:97`), because the shorter string is a substring of the longer one after `spaced()` folds hyphens to spaces. `mcp-aside-devtools` does the same through `"aside devtools"` (`hub-router.json:142`) and `"mcp-aside-devtools"` (`hub-router.json:143`). `mcp-bladebro` matches only `"bladebro"` (`hub-router.json:162`), because no shorter Bladebro alias is a substring of it. `scoreModes` counts distinct folded keywords (`router.cjs:88-95`), so the two double-counting modes score 8 and Bladebro scores 4. With `ambiguityDelta` 1 (`hub-router.json:6`) and every weight 4 (`hub-router.json:31,41,51`), the 4-point gap exceeds the delta, so `selectNearTiedModes` (`router.cjs:100-104`) drops Bladebro before `exactBundle` (`router.cjs:106-111`) is consulted. The declared `orderedBundle` outcome, "multiple explicitly named browser tools route in tie-break order" (`hub-router.json:14`), therefore fails for the most explicit input the hub supports.
   Finding class: correctness
   Scope proof: the finding is inside the declared target's shipped hub surface, `.skilled/skills/mcp-browser-use/hub-router.json`, and the router that consumes it.
   Affected surface hints: `.skilled/skills/mcp-browser-use/hub-router.json` vocabulary classes; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` scoring; the compiled policy card hash that embeds the vocabulary.
   Case: `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro"` returns `selectionKind: orderedBundle` with targets `[mcp-chrome-devtools, mcp-aside-devtools]` and no `mcp-bladebro`.

```json
{
  "type": "claim",
  "claim": "A prompt naming the three published workflowMode ids routes to two modes, dropping mcp-bladebro, because two modes' vocabularies double-count their own id while Bladebro's does not.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/hub-router.json:96",
    ".skilled/skills/mcp-browser-use/hub-router.json:97",
    ".skilled/skills/mcp-browser-use/hub-router.json:142",
    ".skilled/skills/mcp-browser-use/hub-router.json:143",
    ".skilled/skills/mcp-browser-use/hub-router.json:162",
    ".skilled/skills/mcp-browser-use/hub-router.json:6",
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:88",
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:100"
  ],
  "counterevidenceSought": "Checked whether a bundle rule for the full three-mode set exists and is unreachable, and whether any other path restores Bladebro. registry-compiler.cjs:158-164 builds bundle rules from every subset of tieBreak, so a three-mode rule does exist; it is unreachable for this prompt because selection happens first. Also ran the router on 'bladebro chrome devtools aside devtools', which does return all three, proving the bundle machinery works and isolating the cause to uneven scoring rather than to bundle construction.",
  "alternativeExplanation": "The vocabulary could be read as intentionally weighting the two 'devtools' modes above Bladebro. Rejected: all three weights are 4, the delta is 1, and the outcome text promises tie-break ordering for multiple named tools, so no authored intent makes a 2:1 score ratio correct.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the hub documents that a canonical-id three-mode request is out of contract, or if a caller-side rule is shown to re-add dropped modes."
}
```

### P2 Findings

2. **`leaf-scopes.json` is described as per-mode but holds one mode** -- `.skilled/skills/mcp-browser-use/README.md:58` -- The README describes `leaf-scopes.json` as "The folders and files each mode may route to, beyond its defaults", which reads as an entry per mode. The file holds a single entry, `mcp-chrome-devtools` (`leaf-scopes.json:1-12`), and `SKILL.md:106` states the narrower truth: it adds the Chrome DevTools Lighthouse and performance-trace catalog leaf. A reader who trusts the README will look for Aside and Bladebro scope entries that do not exist and may conclude the file is incomplete.
   Finding class: maintainability
   Scope proof: both files are inside the declared target's shipped hub surface.
   Affected surface hints: `.skilled/skills/mcp-browser-use/README.md` file table; `.skilled/skills/mcp-browser-use/leaf-scopes.json`.
   Case: a maintainer adding a routable leaf for `mcp-bladebro` reads README.md:58, adds a Bladebro entry to `leaf-scopes.json`, and finds the generator's contract treats the file as a per-mode narrowing list rather than a complete inventory.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/skills/mcp-browser-use/mode-registry.json:1-160` | Goal criterion 2 holds: the hub registry lists exactly three modes, `mcp-chrome-devtools`, `mcp-aside-devtools` and `mcp-bladebro`, each with `packetKind: workflow` and `backendKind: cli-plus-mcp` as the registry's own discriminator prose declares. |
| `checklist_evidence` | partial | `.skilled/skills/mcp-browser-use/hub-router.json:14` | Criterion 5's router half is only partly evidenced: the router reaches each mode individually, but the three-mode bundle drops one mode, so the criterion's "that mode from the hub router" holds per mode and fails for the combined request. |

## Integration Evidence

- `.skilled/bin/compiled-route.cjs` -- the runtime front door named by `SKILL.md:62`; executed read-only for five prompts to obtain the routing decisions cited above.
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` -- the stage-one scorer the front door delegates to.
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` -- compiles `hub-router.json` into the routing model, including `bundleRules` and `ambiguityDelta`.

## Edge Cases

- **Ambiguity: is the bare-`aside` exclusion a defect?** `hub-router.json:130-141` documents that bare "aside" is deliberately excluded because it is an ordinary English word. A prompt such as "use chrome devtools and aside" therefore routes to Chrome DevTools alone. Recorded as intended behaviour, not a finding, because the vocabulary note states the trade-off and offers verb forms as the supported path. Noted here so a later iteration does not re-raise it as new.
- **Ambiguity: `leaf-scopes.json` has no code consumer.** No file in the repository reads it by content; only `SKILL.md` and `README.md` describe it. Kept at P2 because the impact is a reader's wrong expectation, not a runtime failure.
- **Partial success**: the coverage graph seeded 514 nodes and 447 edges from the 507 scope files, so every scope file has a FILE node; the iteration read 9 of them in depth.

## Confirmed-Clean Surfaces

- `mode-registry.json` mode count and discriminator values: three modes, all `workflow`, all `cli-plus-mcp`, all `routingClass: metadata`, all `command: null`, all `grandfatheredFolderMismatch: false` -- consistent with the registry's own contract prose.
- `hub-router.json` `discoveryClasses` (`hub-identity`, `generic-browser-automation`) are referenced by no `routerSignals` class, so a hub-identity-only or generic-browser prompt scores zero modes and defers, exactly as `routerPolicy.discoveryClassesContract` claims.
- `leaf-manifest.json` leaves: all 17 declared leaves exist on disk under their mode folders.
- `registry-compiler.cjs:166-171` `assertTieBreakCoversModes` fails compilation when `tieBreak` does not list every declared mode exactly once, so the tie-break list cannot silently drift from the registry.

## Ruled Out

- **`leaf-scopes.json` missing Aside and Bladebro entries as a data bug**: ruled out. `SKILL.md:106` and the generator's contract both treat the file as an optional per-mode narrowing list, so a mode with no entry is a mode with no extra scope, not a gap.
- **`ambiguityDelta: 1` being too tight to ever bundle**: ruled out by execution. `"bladebro chrome devtools aside devtools"` returns all three modes as an `orderedBundle`, so the delta and the bundle rules do work when scores tie.
- **`defaultMode: null` causing a silent default route**: ruled out. `router.cjs:126-128` returns a `defer` with reason `no-match` when nothing scores and `defaultMode` is null.

## Next Focus

- **Dimension**: correctness
- **Focus area**: the compiled routing engine that consumes this hub's registry -- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{compiled-route.cjs,resolve.cjs}` and the activation manifests under `013-live-activation/activation/mcp-browser-use/`.
- **Reason**: iteration 1 found the vocabulary-level scoring defect; iteration 2 must establish whether the engine that compiles and serves that vocabulary introduces or masks further correctness problems, including the serving-authority sentinel and the fence state.
- **Rotation status**: correctness continues; security, traceability and maintainability remain unreviewed.
- **Blocked/productive carry-forward**: productive -- executing the shipped router produced a decisive finding in one call, so later iterations should execute the surface under review where it is read-only.
- **Required evidence**: file:line for the resolver's fallback path, the activation manifest's generation and fence state, and the policy-card hash inputs.

Review verdict: CONDITIONAL
