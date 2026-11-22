# Iteration 001 - Correctness

## Dispatcher
- Lineage: claude2 (fan-out), session fanout-claude2-1795299580084-7g6zan, generation 1
- Dimension: correctness
- Review focus coverage: this pass read the compiled stage-2 hub router added by the hub-scaffold and routing commits, the live activation manifest that turns it on, and the nested sub-track reader added by the system-spec-kit commit. It then ran the live `compiledRoute('mcp-browser-use', ...)` entry point on browser prompts.
- Sources: steer.md absent at iteration start.

## Files Reviewed
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-155`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs:1-59`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:1-140`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-171`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` (diff: `mcp-browser-use` added to DEFAULT_ON_HUBS)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` (diff: HUB_CHILD entry)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` (diff: readWorkingTreeSubTracks / readCommitSubTracks)
- `specs/mcp/mcp-browser-use/description.json`, `graph-metadata.json`

## Findings by Severity

### P0 Findings
- None.

### P1 Findings
1. **Live browser router hard-rejects any prompt containing the word "forbidden"** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107` -- `evaluateRoute` returns `reject` (reason `forbidden`, no targets) whenever the lowercased prompt merely contains the substring `forbidden`, before any keyword scoring. The hub is serving live (`manifest.json` has `servingAuthority: compiled`, `shadowOnly: false`; `resolve.cjs` adds `mcp-browser-use` to `DEFAULT_ON_HUBS`). An HTTP 403 Forbidden is one of the most common things a browser-debugging request names, so a valid Chrome DevTools request is refused at stage 2. Observed: `compiledRoute('mcp-browser-use', 'Debug the 403 Forbidden response in Chrome DevTools')` returned `{"action":"reject","targets":[]}`, while `'open chrome devtools and inspect the dom'` routed `single` to `mcp-chrome-devtools`. The sentinel exists so the canary case `forbidden-reject` (`fixtures/canary-cases.v1.json:182-188`) can exercise the reject branch, and it was copied from the sibling hub routers, but no other hub's domain uses the word "forbidden" as ordinary vocabulary the way browser debugging does.
   Finding class: instance-only
   Scope proof: the file is new in this branch (hub-scaffold commit); the same line exists in other hub routers, but none of them is a browser-debug surface, so the defect only matters here.
   Affected surface hints: `010-mcp-browser-use/lib/router.cjs`, `fixtures/canary-cases.v1.json` (forbidden-reject case), `policy-card.cjs` replay
   Case: prompt "Debug the 403 Forbidden response in Chrome DevTools" is routed to reject instead of mcp-chrome-devtools.

```json
{"type":"claim-adjudication","claim":"The live mcp-browser-use stage-2 router rejects any prompt whose text contains 'forbidden', including valid DevTools 403 debugging requests.","evidenceRefs":[".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107",".skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1",".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:47"],"counterevidenceSought":"Checked whether the hub is shadow-only (it is not), and ran the live compiledRoute entry point; the reject is observed, not inferred.","alternativeExplanation":"The substring check is a fleet-wide canary convention, and a caller may fall back to legacy SKILL.md routing on reject, which would soften the impact.","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Evidence that every stage-2 consumer treats a compiled reject as a fall-through to legacy routing rather than a refusal would drop this to P2."}
```

### P2 Findings
2. **Keyword matching is raw substring, so short aliases fire inside unrelated words** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:29-31` -- `containsSignal` uses `String.includes` with no word boundary. Short aliases in `hub-router.json` (`rb status`, `rb attach`, `cdp`, `bdg`, `aside`) therefore match inside other words. Observed: `'herb status page in chrome devtools'` routed `orderedBundle` [mcp-chrome-devtools, mcp-bladebro] because `herb status` contains `rb status`. Hub-router's own note on bare `aside` (`hub-router.json:117`) accepts prose collisions on the grounds that stage 2 only runs after the advisor picks the hub, but a substring inside a word is a different collision from that one.
   Finding class: class-of-bug
   Scope proof: new router file; the shared sibling routers use the same helper shape.
   Affected surface hints: `router.cjs` containsSignal, `hub-router.json` short aliases
   Case: prompt "herb status page in chrome devtools" adds mcp-bladebro to the route.

3. **Naming two tools routes single when one carries an extra keyword, contrary to the declared orderedBundle outcome** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:88-92` -- `hub-router.json:12-15` declares `orderedBundle` as "multiple explicitly named browser tools route in tie-break order", but `ambiguityDelta` is 1 while every mode weight is 4. Only exact ties bundle, so a prompt that names two tools, where one also matches a workflow phrase, drops the other. Observed: `'capture network requests with lighthouse and bladebro'` routed `single` to mcp-chrome-devtools (score 8 vs 4), and the explicitly named Bladebro was dropped.
   Finding class: instance-only
   Scope proof: new router and hub-router.json in this branch.
   Affected surface hints: `hub-router.json` routerPolicy.ambiguityDelta and outcomes text, `router.cjs` selectNearTiedModes
   Case: prompt "capture network requests with lighthouse and bladebro" never loads mcp-bladebro.

## Traceability Checks
- spec_code: partial. The hub routes three modes via `mode-registry.json` (three modes: mcp-chrome-devtools, mcp-aside-devtools, mcp-bladebro, all `cli-plus-mcp`), and the compiled router reads `hub-router.json` as its comment states (`registry-compiler.cjs:93-112`). The forbidden-sentinel behaviour is not described by the hub contract.

## Integration Evidence
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` HUB_CHILD maps `mcp-browser-use` to `009-parent-hub-rollout/010-mcp-browser-use`.
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` DEFAULT_ON_HUBS includes `mcp-browser-use`.

## Edge Cases
- Ambiguity: main has moved past the branch point. The review used merge-base `22e5257fcb5`..HEAD for diffs, not `main..HEAD`.
- The consumer behaviour on a compiled `reject` was not traced to the advisor stage-2 brief in this iteration. That gap is the P1's downgrade trigger.

## Confirmed-Clean Surfaces
- `track-roots.mjs` nested sub-track reader: the working-tree and commit views apply the same depth rule. At depth > 1 both skip undeclared and symlinked entries silently, and past `MAX_SUB_TRACK_DEPTH` both report `NESTED_TOO_DEEP`. The level-1 path keeps the earlier diagnostics byte-for-byte.
- `policy-card.cjs`: the card round-trips through `canonicalize` / `JSON.parse` and the replay reuses `evaluateRoute`.
- `registry-compiler.cjs` modeVocabulary fails closed on a missing routerSignal or vocabulary class.

## Ruled Out
- Discovery-only classes leaking into mode scores: ruled out. `modeVocabulary` only walks `routerSignals[mode].classes`, and the discovery classes are not referenced. `'take screenshot of the page'` deferred as designed.

## Next Focus
- Dimension: security
- Focus area: install and MCP wiring surfaces (`mcp-chrome-devtools/scripts/install.sh`, `.utcp_config.json`, Bladebro install/mcp-wiring references, pre-commit hook and check-mcp-mutation-class).
- Reason: rotation to D2. Bladebro is a stealth/anti-detection browser that installs a native binary.
- Rotation status: D1 done.
- Required evidence: file:line for any unpinned download, missing digest check, secret exposure, or mutation-class drift.

Review verdict: CONDITIONAL
