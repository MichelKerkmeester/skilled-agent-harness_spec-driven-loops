# Iteration 001 — Correctness: compiled routing for the mcp-browser-use hub

## Dispatcher

- Lineage: claude2 (fan-out), sessionId `fanout-claude2-1795300286921-qfagh7`, generation 1, lineageMode new
- Iteration 1 of 5, stopPolicy max-iterations
- Dimension: correctness
- Operator focus coverage: this pass reviewed the "advisor routing at both stages" and "hub scaffold" commits from the stage-two side: the new compiled router for the hub (`010-mcp-browser-use`), its admission into the default-on cohort (`resolve.cjs`, `compiled-route.cjs`), and the authored vocabulary it scores (`hub-router.json`). The routing claims were checked by running the live resolver on probe prompts, not only by reading.
- Sources: `steer.md` absent at iteration start; lineage config and strategy read.

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-155`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs` (diffed as the sibling it was derived from)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` (diff vs sibling)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs` (diff vs sibling)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs` (diff vs sibling)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:30-159`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:35-126`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:182-188`
- `.skilled/skills/mcp-browser-use/hub-router.json`
- `.skilled/skills/mcp-browser-use/SKILL.md:58-77`, `.skilled/skills/mcp-browser-use/ROUTER.md:105`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Any prompt containing the word "forbidden" is rejected, so HTTP 403 Forbidden debugging requests are refused** -- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107 -- `evaluateRoute` rejects when `text.includes('forbidden')`, a substring test over the raw user prompt. The canary fixture uses the word as a synthetic reject trigger (`canary-cases.v1.json:182-188`, prompt "forbidden browser operation"), but the same check runs on live prompts. The hub is served compiled by default (`resolve.cjs:44-47` adds `mcp-browser-use` to `DEFAULT_ON_HUBS`; `activation/mcp-browser-use/manifest.json` has `servingAuthority: "compiled"`), and SKILL.md:62 tells the caller that `reject` refuses. Probe run: `resolve.cjs --hub mcp-browser-use --prompt "debug the 403 Forbidden network requests in chrome devtools"` returned `{"action":"reject"}`, while the same request without the word routes to `mcp-chrome-devtools`. "403 Forbidden" is ordinary browser-debugging vocabulary, so this hub hits the check far more often than the sibling hubs that share it.
   - Finding class: correctness / routing contract
   - Scope proof: the router file is new on this branch (whole `010-mcp-browser-use/` directory added), and its admission to the default-on cohort is in this branch's `resolve.cjs` diff.
   - Affected surface hints: `010-mcp-browser-use/lib/router.cjs`, `010-mcp-browser-use/fixtures/canary-cases.v1.json` (forbidden case should move to the `constraints` channel only), same pattern in `003-mcp-tooling/lib/router.cjs:145` and the other hubs' canary routers (pre-existing).
   - Case: the user asks the hub to "debug the 403 Forbidden network requests in chrome devtools" and the compiled front door returns reject, so the documented contract refuses a valid Chrome DevTools request.

```json
{"type":"claim-adjudication","findingId":"C2-I1-P1-001","claim":"The compiled router rejects every live prompt whose text contains 'forbidden', including legitimate 403 debugging requests, and the hub contract says reject refuses.","evidenceRefs":[".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107",".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:44",".skilled/skills/mcp-browser-use/SKILL.md:62",".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:183"],"counterevidenceSought":"Checked whether the reject falls back to legacy routing (resolveRoute returns the compiled decision as authoritative, only errors and identity drift fall back) and whether the check is constraint-only (it also tests text). Ran the live resolver: reject confirmed.","alternativeExplanation":"The substring check is a fleet-wide canary convention copied from the sibling routers; the authors may consider it test scaffolding. It still runs on live prompts.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if the SKILL.md contract is changed so that a compiled reject falls back to hub-router.json routing instead of refusing."}
```

### P2 Findings

1. **Bare "aside" matches ordinary prose and pulls the Aside mode into unrelated bundles** -- .skilled/skills/mcp-browser-use/hub-router.json:117 -- The `aside-devtools-aliases` note claims ordinary-prose uses of the word never reach stage two because the advisor picks the hub first. That holds only for prompts that do not reach the hub. Once a browser prompt reaches the hub, `containsSignal` (router.cjs:29-31) is a plain substring test with no word boundary, so "Aside from that, run lighthouse on the homepage" and "set aside time to capture browser screenshots" both returned `orderedBundle [mcp-chrome-devtools, mcp-aside-devtools]` in the probe run. The sibling mcp-tooling router keeps a word-boundary set for short tokens (`003-mcp-tooling/lib/router.cjs` `WORD_BOUNDARY_KEYWORDS`), which this copy dropped.
   - Finding class: correctness / vocabulary precision
   - Scope proof: `hub-router.json` and `router.cjs` are both added on this branch.
   - Affected surface hints: `hub-router.json` aside-devtools-aliases note and keyword, `010-mcp-browser-use/lib/router.cjs` containsSignal, canary fixtures.
   - Case: "Aside from that, run lighthouse on the homepage" routes a two-mode bundle and loads the Aside packet for a pure Lighthouse request.

2. **Ambiguity delta of 1 with uniform weight 4 makes every cross-mode one-hit overlap a bundle** -- .skilled/skills/mcp-browser-use/hub-router.json:5 -- With every mode weighted 4 and `ambiguityDelta: 1`, any prompt matching one keyword in each of two modes ties and routes as an ordered bundle; the probe "use the stealth browser to check console errors" returned `[mcp-chrome-devtools, mcp-bladebro]`. The `bladebro-workflow` note says tie-break order resolves overlap, but tie-break only orders a bundle, it never picks one mode. This is the authored contract (`outcomes.orderedBundle`), so it is a design advisory rather than a bug.
   - Finding class: correctness / routing design
   - Scope proof: authored in this branch's `hub-router.json`.
   - Affected surface hints: `hub-router.json` routerPolicy and bladebro-workflow note.
   - Case: a stealth-browser request that mentions console errors loads both Chrome DevTools and Bladebro packets instead of Bladebro alone.

## Traceability Checks

- `spec_code` (partial): SKILL.md:60 says "Debugging words go to Chrome DevTools"; a debugging prompt that says "Forbidden" is rejected instead (P1-001). Other probes ("use chrome devtools to inspect the dom" -> chrome-devtools single; "open the web browser" -> defer; "rb status" -> bladebro single) match SKILL.md:50-60.
- `checklist_evidence`: not run this iteration.

## Integration Evidence

- Live CLI: `node .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs --hub mcp-browser-use --prompt <p>` for 8 probe prompts; manifest selected policy hash `8793753e...` matched, generation 1, so every decision came from the compiled path.

## Edge Cases

- The forbidden substring check is shared with `003-mcp-tooling`, `001-sk-code`, `002-system-deep-loop` and `009-sk-design` routers. Only the new hub's copy is in scope; the others are noted as pre-existing.
- SKILL.md:62 names `.skilled/bin/compiled-route.cjs` as the front door while ROUTER.md and this probe used `resolve.cjs`; both resolve to the same `resolveRoute` contract (not verified for the wrapper in this iteration).

## Confirmed-Clean Surfaces

- `compiled-route.cjs:38` HUB_CHILD entry points at the correct child folder; `loadHubEngine` finds `lib/router.cjs` (plain router shape).
- `registry-compiler.cjs` adds explicit `ROUTER_SIGNAL_MISSING` and `VOCABULARY_CLASS_MISSING` failures that the sibling lacked (fail-closed improvement).
- `build-artifacts.cjs` compiles only from the hub's three authored files.
- Defer on discovery-only vocabulary works ("open the web browser" -> defer).

## Ruled Out

- Manifest identity drift: resolved policy hash and generation equal the manifest's selectedPolicy.
- Missing-mode crash in `route()`: every routerSignals mode exists in mode-registry destinations (compiler fails closed otherwise).

## Next Focus

- Dimension: security
- Focus area: Bladebro mode (install/verify, native binary digest, browser lanes, MCP wiring), `mcp-chrome-devtools/scripts/install.sh`, `.utcp_config.json`, mutation-class manifest and checker, `pre-commit` hook change.
- Reason: Bladebro is a new stealth-browser tool that attaches to signed-in browsers; install and trust boundaries are the highest-risk unreviewed surface.
- Rotation status: correctness done (1/4 dimensions).
- Required evidence: file:line for install commands, digest checks, credential/profile handling.

Review verdict: CONDITIONAL
