# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `vibe`, session `fanout-vibe-1795299580084-7g6zan`, generation 1, lineageMode `new`)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: correctness
- Iteration: 1 of 5 (`stopPolicy: max-iterations`, convergence is telemetry only)
- Operator review focus addressed: this iteration reviewed the hub scaffold commit (`6efbff5d094`) and the advisor-routing commit (`6a5e1048ea5`) at the file level — the hub's three routing tables, the compiled-routing artifacts added for `010-mcp-browser-use`, and the live activation manifest. The two-stage routing claim in the focus ("advisor routing at both stages") is exactly what the P1 below tests.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mode-registry.json` (full)
- `.skilled/skills/mcp-browser-use/hub-router.json` (full)
- `.skilled/skills/mcp-browser-use/leaf-manifest.json` (full, plus on-disk existence of all 16 leaves)
- `.skilled/skills/mcp-browser-use/leaf-scopes.json` (full)
- `.skilled/skills/mcp-browser-use/SKILL.md` (full)
- `.skilled/skills/mcp-browser-use/ROUTER.md` (full)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` (full)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` (full)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` (full)
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
- `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json}` (reference shape only)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Stage-two intent map omits two stage-one keywords, so a routed request loads no leaf and falls to the defer checklist** -- `.skilled/skills/mcp-browser-use/hub-router.json:98` -- `chrome live manual` (hub-router.json:98) and `core web vitals` (hub-router.json:119) are scoring keywords of the `mcp-chrome-devtools` vocabulary classes, so stage one routes a prompt containing either one to `mcp-chrome-devtools`. Neither keyword appears in the stage-two `INTENT_SIGNALS.CHROME_DEVTOOLS` list (`ROUTER.md:51`) nor in `INTENT_SIGNALS.LIGHTHOUSE_TRACE` (`ROUTER.md:52`), so stage two fires no intent and `ROUTER.md:84` sends the request to the defer fallback ("No keyword match is the hub's defer fallback: confirm the browser mode before loading anything"). The hub therefore resolves the mode and then asks the reader to disambiguate it, which is the two-stage contradiction decision D7 forbids. The gap is sharper for `core web vitals`: the leaf that advertises that phrase as its own trigger, `mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:7`, is listed in `RESOURCE_MAP.LIGHTHOUSE_TRACE` (`ROUTER.md:62`) and in `leaf-manifest.json`, yet no stage-two intent can reach it by that phrase. The parent-skill checker does not catch this: it validates `routerSignals` against the registry and the vocabulary classes (`5b`, `5c`, `5k-alias`) but never compares `ROUTER.md`'s `INTENT_SIGNALS` against `hub-router.json`'s vocabulary, and it exits 0 with 0 warnings on this hub.
   Finding class: contract-drift
   Scope proof: both files are inside the declared review target's scope list (`review-scope-files.txt` lines for `.skilled/skills/mcp-browser-use/hub-router.json` and `ROUTER.md`); the keyword sets were compared mechanically, not by eye.
   Affected surface hints: `.skilled/skills/mcp-browser-use/ROUTER.md` (stage-two map), `.skilled/skills/mcp-browser-use/hub-router.json` (stage-one vocabulary), `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/` (no case covers either phrase), `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (missing cross-check)
   Case: a request that says only "open my chrome live manual session and read the page" scores `mcp-chrome-devtools` at stage one (weight 4, one keyword hit) and then matches no stage-two intent, so the agent asks the reader which browser mode they meant after the hub already decided.

```json
{
  "type": "claim",
  "claim": "Two stage-one scoring keywords have no stage-two intent, so a routed request loads zero leaves and defers.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/hub-router.json:98",
    ".skilled/skills/mcp-browser-use/hub-router.json:119",
    ".skilled/skills/mcp-browser-use/ROUTER.md:51",
    ".skilled/skills/mcp-browser-use/ROUTER.md:52",
    ".skilled/skills/mcp-browser-use/ROUTER.md:84",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:7"
  ],
  "counterevidenceSought": "Searched the whole hub for both phrases (rg over .skilled/skills/mcp-browser-use): the only hits are hub-router.json:98, hub-router.json:119 and the feature-catalog trigger phrase at lighthouse-and-performance-trace.md:7. No manual-testing-playbook case, no INTENT_SIGNALS entry, and no RESOURCE_MAP key covers either phrase. Ran parent-skill-check.cjs against the hub: exit 0, 0 warnings, so no existing gate contradicts the finding.",
  "alternativeExplanation": "The omission could be deliberate: ROUTER.md:31 states that Core Web Vitals phrasing is shared with frontend code work and is deliberately not advertised to the advisor. That explains the advisor projection, not the stage-two map, and it does not explain `chrome live manual`, which carries no such note and is a Chrome-DevTools-only phrase.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if ROUTER.md documents that a stage-one hit with no stage-two intent is an accepted outcome that loads the mode's SKILL.md instead of deferring."
}
```

### P2 Findings

1. **`routerPolicy.outcomes` declares three outcomes while the compiled router emits four** -- `.skilled/skills/mcp-browser-use/hub-router.json:12` -- the authored policy lists `single`, `orderedBundle` and `defer` (hub-router.json:13-15). `router.cjs` also emits `reject` through `negative('reject', { reason: 'forbidden' })` whenever the prompt or a constraint carries `forbidden`, and the canary fixture exercises it as `forbidden-reject`. A reader of the authored policy therefore cannot learn that a fourth outcome exists, and `parent-skill-check.cjs` check `5g` only requires the three declared ones, so the omission is invisible to the gate.
   Finding class: contract-incompleteness
   Scope proof: `hub-router.json` and the compiled router are both in the declared scope; the `reject` path is reachable from the router's own input contract (`input.constraints` and prompt text).
   Affected surface hints: `.skilled/skills/mcp-browser-use/hub-router.json`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`
   Case: a reader who authors a new mode against `hub-router.json`'s `outcomes` map has no way to know a `forbidden` prompt is rejected rather than deferred, so they cannot classify the new mode against the full outcome set that SKILL.md's ESCALATE clause asks them to classify against.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Parent goal completion criterion 2 ("`mode-registry.json` lists exactly three modes") verified: `mode-registry.json` declares `mcp-chrome-devtools`, `mcp-aside-devtools`, `mcp-bladebro` and nothing else; `parent-skill-check.cjs` check `5b` confirms `routerSignals` keys match the registry set (3). Criterion 4 ("parent-skill checker exits 0 and names the hub") verified by running it: `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0, subject `.skilled/skills/mcp-browser-use`. Criterion 3 (no `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` references) is deferred to iteration 3. |

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` compiled in memory from the three authored hub files produced `effectivePolicyHash 8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a`, byte-identical to `selectedPolicy.effectivePolicyHash` in `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`. The live activation manifest is not stale against the authored hub.
- All 14 cases in `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` were replayed through `evaluateRoute` against that compiled snapshot: 0 failures. That covers single-mode routing for all three modes, the `orderedBundle` tie, both defer cases and the `reject` case.
- `.opencode/skills/mcp-browser-use` and `.dsh/skills/mcp-browser-use` are symlinks to `.skilled/skills/mcp-browser-use`; `diff -rq` reports no difference, so the harness's `.opencode` read path and the canonical `.skilled` path cannot drift.

## Edge Cases

- **Ambiguity: which stage owns leaf selection.** The compiled decision returns destinations, not leaf paths — every canary case carries `gold.expectedResources: []` — so leaf selection is always `ROUTER.md`'s job, on both the compiled and the legacy path. I resolved the P1 severity on that reading; if the compiled path were meant to return leaves, the P1 would be a P0 because the compiled front door would then be the broken one.
- **Contradiction recorded, not resolved:** `ROUTER.md:31` says Core Web Vitals phrasing is deliberately not advertised to the advisor, while `hub-router.json:119` keeps it as a scoring keyword. Both statements are true of different surfaces (advisor projection vs stage-one vocabulary), so I did not treat the note as counterevidence to the P1.
- **Missing optional evidence:** `resource-map.md` is absent for this packet, so the resource-map coverage gate is skipped rather than failed.
- **Prior run:** `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review-archive/20261121T221729Z-stopped-run2/` holds a stopped earlier lineage. It was not read as evidence; this lineage's findings stand on the current files.

## Confirmed-Clean Surfaces

- All 16 `leaf-manifest.json` leaves resolve on disk for all three modes.
- `leaf-manifest.json` is byte-identical to a fresh regeneration (`parent-skill-check` `10b-byte-drift`), so the committed manifest is not hand-edited.
- `routerPolicy.tieBreak` covers every registered mode exactly once (`5e`), and `bundleRules` reference real modes (`5f`).
- `discoveryClasses` (`hub-identity`, `generic-browser-automation`) are referenced by no `routerSignals` class, so a discovery-only prompt scores zero modes and defers — the contract in `hub-router.json`'s `discoveryClassesContract` holds.
- `mode-registry.json` `toolSurface.allowed` is identical across the three modes and equals the hub `SKILL.md` `allowed-tools` union (`3j`).
- Version agreement: `SKILL.md`, `mode-registry.json`, `hub-router.json` and `ROUTER.md` all carry `1.1.0.0`, matching the newest changelog entry (`13a`, `13b`).

## Ruled Out

- **`leaf-scopes.json` covering only `mcp-chrome-devtools`.** Ruled out: the generator walks each mode's full configured leaf roots when no scope is declared, and `parent-skill-check` `10b-byte-drift` proves the committed manifest equals a fresh regeneration. Aside and Bladebro are unscoped by design, not by omission.
- **`routerSignals[].resources` listing only `<packet>/SKILL.md` while `RESOURCE_MAP` lists two leaves per intent.** Ruled out: stage one declares the mode's entry resource, stage two declares the leaf set; the two are different projections, not duplicates that must match.
- **`ambiguityDelta: 1` against weight 4 producing spurious bundles.** Ruled out: scores are multiples of 4, so a near-tie can only be an exact tie, and the `named-tools-bundle` canary case confirms the intended bundle behaviour.
- **Mirror drift between `.opencode`/`.dsh` and `.skilled`.** Ruled out by `diff -rq` (both are symlinks).

## Next Focus

- Dimension: security
- Focus area: `.skilled/skills/mcp-browser-use/mcp-bladebro/` (the new stealth-browser mode: `SKILL.md`, `references/install-and-verify.md`, `references/mcp-wiring.md`, `references/browser-lanes.md`, `manual-testing-playbook/preflight-and-install/npm-install.md`, `manual-testing-playbook/teardown/uninstall-and-data-root.md`) plus the hub's `shared/README.md` and the three modes' `mcp-servers/` wiring.
- Reason: the Bladebro mode is the only mode added wholesale in this branch and the only one that installs a global npm binary and attaches to a caller-owned browser; decision D5 requires an operator yes for install, so the install and teardown guidance is the trust boundary to audit.
- Rotation status: correctness complete (1 iteration); security next in the configured order.
- Blocked/productive carry-forward: productive — mechanical keyword-set comparison between `hub-router.json` and `ROUTER.md` found the P1 in one call; reuse the same technique for comparing declared tool surfaces against documented commands.
- Required evidence: exact install command, the operator-consent gate, the profile/data-root path, and the uninstall/rollback steps, each with `file:line`.
- Recovery note: not applicable (first rotation).

Review verdict: CONDITIONAL
