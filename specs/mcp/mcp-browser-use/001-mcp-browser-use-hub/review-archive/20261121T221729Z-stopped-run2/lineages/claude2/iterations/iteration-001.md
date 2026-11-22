# Iteration 001 - Correctness: browser hub compiled routing

## Dispatcher

- Lineage: claude2 (fan-out, inline executor cli-claude-code claude-opus-5-5)
- Session: fanout-claude2-1795298930568-k8qdqy, generation 1, lineageMode new
- Dimension: correctness
- Sources read this iteration: lineage `steer.md` (absent), `review-scope-files.txt`, `deep-review-config.json`, prompt pack template.
- Review focus coverage: this iteration covers the "advisor routing at both stages" and "hub scaffold" commits from the operator focus, reading the stage-two compiled router the hub added and the stage-one advisor scorer edits that move browser vocabulary from mcp-tooling to mcp-browser-use.

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-155`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` (diffed against the 003-mcp-tooling sibling)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:1-228`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` (case list)
- `.skilled/skills/mcp-browser-use/hub-router.json:1-171`
- `.skilled/skills/mcp-browser-use/mode-registry.json:1-124`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, `compiled-route.cjs`, `serving-closure.manifest.json`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs` (diffs)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `lexical.ts`, `fusion.ts`, `compiled-routing-flag.ts`, `runtime/scripts/skill_advisor.py` (diffs)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Any prompt containing the word "forbidden" is rejected by the live browser hub router** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107` -- `evaluateRoute` rejects with reason `forbidden` whenever the prompt text contains the substring `forbidden`, before any scoring. In a browser hub, "403 Forbidden" is ordinary debugging vocabulary. Probe: `evaluateRoute(snapshot, {prompt: "debug the 403 Forbidden network requests in chrome devtools"})` returns `reject forbidden` with empty `matchedScores`, although the prompt names Chrome DevTools and `network requests`. The hub is live and default-on (`013-live-activation/activation/mcp-browser-use/manifest.json` has `servingAuthority: compiled, shadowOnly: false`; `resolve.cjs` adds it to `DEFAULT_ON_HUBS`). The same check exists in the mcp-tooling and sk-doc routers, so the pattern was copied, but the copy lands it in the one hub whose domain uses the word routinely. The canary fixture only exercises the synthetic `"forbidden browser operation"` prompt, so the false positive is untested.
   Finding class: input-handling false positive (substring sentinel)
   Scope proof: new file added by the browser-hub routing commit; served live through the compiled front door
   Affected surface hints: router.cjs evaluateRoute; canary-cases.v1.json (add a "403 Forbidden" route case); sibling routers share the pattern
   Case: the prompt "debug the 403 Forbidden network requests in chrome devtools" gets a reject instead of a single route to mcp-chrome-devtools.

2. **Nested aliases are counted twice, so one longer alias outweighs another named tool and breaks the declared bundle outcome** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:76-83` -- `scoreModes` dedupes only identical folded keywords. A mention of `aside mcp` also matches `aside`, `cdp domain` also matches `cdp`, `bladebro mcp` also matches `bladebro`, so one tool mention scores 8 while another tool named once scores 4. `ambiguityDelta` is 1 (`hub-router.json:6`), so the second tool is dropped. `hub-router.json:14` declares that "multiple explicitly named browser tools route in tie-break order" as an orderedBundle. Probes: "use the aside mcp and chrome devtools" routes `single mcp-aside-devtools` (aside 8, chrome 4); "use aside and the bladebro mcp" routes `single mcp-bladebro`; while "use chrome devtools and bladebro" correctly bundles. The comment at router.cjs:74-75 claims a single mention is worth one hit, which is only true for identical spellings, not for contained aliases.
   Finding class: scoring-contract mismatch
   Scope proof: new router and hub-router.json vocabulary added on this branch
   Affected surface hints: router.cjs scoreModes; hub-router.json alias classes (`aside`/`aside mcp`, `bladebro`/`bladebro mcp`/`bladebro cli`, `cdp`/`cdp domain`, `chrome devtools`/`chrome devtools live`/`mcp-chrome-devtools`); canary fixture lacks a two-tool case where one tool uses a long alias
   Case: the prompt "use the aside mcp and chrome devtools" routes to Aside alone, dropping Chrome DevTools that the user named.

## Traceability Checks

- `spec_code` (partial): hub-router.json `outcomes.orderedBundle` (`hub-router.json:14`) is not honored for nested aliases (finding 2). The compiled policy hash matches the live manifest: `loadSnapshot()` yields `8793753e...4717a`, equal to `013-live-activation/activation/mcp-browser-use/manifest.json`; `compiled-route-guard.cjs` reports every hub fresh (exit 0).
- `skill_agent` (pass): stage-one advisor boosts moved from `mcp-tooling` to `mcp-browser-use` consistently across `explicit.ts` (TOKEN_BOOSTS chrome/devtools/har/staging, PHRASE_BOOSTS), `lexical.ts` CATEGORY_HINTS, `fusion.ts:742` read-only lift, `skill_advisor.py` INTENT_BOOSTERS and a new `browser` normalization rule; `compiled-routing-flag.ts` mirrors `resolve.cjs` DEFAULT_ON_HUBS.

## Integration Evidence

- `.skilled/bin/compiled-route-guard.cjs` (run, read-only): "All hubs fresh or excused", exit 0.
- `014-runtime-engine/lib/compiled-route.cjs` HUB_CHILD maps `mcp-browser-use` to `009-parent-hub-rollout/010-mcp-browser-use`.

## Edge Cases

- Advisor stage-one CLI probes (`skill_advisor.py <prompt>`) printed non-JSON output to stdout in this environment, so stage-one routing for Aside/Bladebro-only prompts was not observed at runtime. Stage-one vocabulary has no `aside` or `bladebro` token boost in `explicit.ts`; whether those prompts reach the hub depends on graph-metadata triggers, carried to the traceability iteration.
- Bare `aside` matches ordinary prose ("set aside the lighthouse audit" scores Aside 4). The hub-router note at `hub-router.json:123` accepts this because stage two runs only after the advisor picks the hub; recorded, not raised.

## Confirmed-Clean Surfaces

- Tie-break ordering and exact-bundle lookup (`router.cjs:94-128`): three-way and two-way ties route in tie-break order with an orderedBundle kind.
- Advisor contribution identity check (`router.cjs:140-150`).
- Registry compiler fails closed on a missing routerSignal or unknown vocabulary class (stricter than the mcp-tooling sibling).

## Ruled Out

- Stale compiled policy: ruled out, hash recomputed and matches the manifest.
- Discovery-only classes leaking into mode scoring: ruled out, `browser automation for this site` defers via the canary case and no routerSignal references the discovery classes.

## Next Focus

- Dimension: security
- Focus area: Bladebro stealth-browser mode (SKILL.md, references/install-and-verify.md, mcp-wiring.md, browser-lanes.md), `.utcp_config.json` additions, `mcp-chrome-devtools/scripts/install.sh`, `check-mcp-mutation-class.sh` and its manifest, `.skilled/scripts/git-hooks/pre-commit` edits
- Reason: the stealth/attach-to-real-browser mode and new MCP wiring are the trust-boundary surfaces of this branch
- Rotation status: correctness done (iteration 1); security, traceability, maintainability remain
- Required evidence: file:line for any install, digest, or credential handling claims

Review verdict: PASS
