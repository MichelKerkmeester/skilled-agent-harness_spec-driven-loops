# Review Iteration 001

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: correctness
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `015-fix-follow-up-review-findings/goal.md`, `review/fanout-config.json`, `review/fanout-review-focus.txt`, `.skilled/skills/mcp-browser-use/{SKILL.md,README.md,ROUTER.md,mode-registry.json,hub-router.json,leaf-manifest.json,leaf-scopes.json,description.json,graph-metadata.json}`, the three mode `SKILL.md` frontmatter blocks, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/{fixtures/canary-cases.v1.json,lib/router.cjs,lib/registry-compiler.cjs}`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/{manifest.json,fence-state.json}`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mode-registry.json:1-140`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-190`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1-60`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1-12`
- `.skilled/skills/mcp-browser-use/ROUTER.md:1-123`
- `.skilled/skills/mcp-browser-use/SKILL.md:1-130`
- `.skilled/skills/mcp-browser-use/README.md:1-20`
- `.skilled/skills/mcp-browser-use/description.json:1`
- `.skilled/skills/mcp-browser-use/graph-metadata.json:1`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-157`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:92-200`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:1-260`

## Findings - New

### P0 Findings

None. No blocker-severity defect was found in the routing registries, the compiled router or the leaf manifest.

### P1 Findings

1. **ROUTER.md says Core Web Vitals is not advertised to the advisor, but the shipped advisor metadata advertises it** -- `.skilled/skills/mcp-browser-use/ROUTER.md:33` -- The stage-two router states that Core Web Vitals phrasing "selects this mode in `hub-router.json` but is not advertised to the advisor". The shipped `graph-metadata.json` contradicts that: `intent_signals_generated` ends with `"core web vitals"` and the 86-entry `intent_signals` array carries it, so the advisor index for this hub does advertise the phrase. A frontend-only performance prompt therefore lifts `mcp-browser-use` in stage one, which is the over-lifting class phase 015 set out to remove.
   - Case: a prompt such as "improve the core web vitals of my landing page" names no browser tool, yet stage one lifts `mcp-browser-use` and stage two routes `mcp-chrome-devtools`, so a frontend performance question lands on a browser-debugging packet.
   - Finding class: cross-consumer
   - Scope proof: `rg -n "core web vitals" .skilled/skills/mcp-browser-use` returns exactly two sites -- `hub-router.json` `browser-debug.keywords` and `graph-metadata.json` `intent_signals`/`intent_signals_generated` -- plus the single prose claim at `ROUTER.md:33`. The generator copies every `routerSignals` class keyword into `intent_signals_generated`, so the phrase cannot be advisor-invisible while it stays in `browser-debug`.
   - Affected surface hints: ["ROUTER.md intent model", "hub-router.json browser-debug class", "graph-metadata.json intent_signals", "advisor stage-one index"]
   - Claim adjudication:
     ```json
     {"type":"claim","claim":"ROUTER.md:33 asserts Core Web Vitals is not advertised to the advisor, while graph-metadata.json intent_signals carries it, so the two shipped artifacts disagree on a stage-one routing property.","evidenceRefs":["ROUTER.md:33","graph-metadata.json:1","hub-router.json:118"],"counterevidenceSought":"Searched for a second intent-signal source that could exclude the phrase, and for a generator filter that drops shared frontend vocabulary. registry-compiler.cjs modeVocabulary copies every keyword of every class named by routerSignals with no exclusion list, and graph-metadata.json intent_signals_generated is the projection of exactly those classes.","alternativeExplanation":"The clause may describe an intended future state rather than shipped behavior, in which case only the prose is stale and the routing is deliberate.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the operator confirms that advertising Core Web Vitals to the advisor is intended, which makes ROUTER.md:33 the only artifact to change."}
     ```

### P2 Findings

2. **README.md carries version 1.1.4.0 while every other hub metadata file and the newest changelog say 1.1.3.0** -- `.skilled/skills/mcp-browser-use/README.md:6` -- `SKILL.md:6`, `ROUTER.md:9`, `mode-registry.json:3`, `hub-router.json:3` and `description.json` all carry `1.1.3.0`, and `changelog/` stops at `v1.1.3.0.md`. `README.md` frontmatter carries `1.1.4.0`, a version with no changelog entry. `SKILL.md:22` states the contract this breaks: "This file's `version` matches the newest entry under `changelog/`. The hub metadata files carry the same value."
   - Case: a reader or release step that reads `README.md` frontmatter to learn the hub's shipped version sees 1.1.4.0 and finds no `changelog/v1.1.4.0.md` to explain it.
   - Finding class: instance-only
   - Scope proof: `for f in SKILL.md ROUTER.md README.md mode-registry.json hub-router.json description.json; do grep -m1 -E '^version:|"version"' $f; done` prints 1.1.3.0 six times and 1.1.4.0 once, so the drift is confined to `README.md`. No gate reads a README version: the skill-root metadata matrix in `skill-root-metadata-contract.md` §3 lists `graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-aliases.json`, `command-metadata.json` and `leaf-scopes.json`, and not `README.md`.
   - Affected surface hints: ["README.md frontmatter", "changelog/", "SKILL.md version authority line"]

## Traceability Checks

- `spec_code` -- partial. Goal completion criterion 2 ("`mode-registry.json` lists exactly three modes") holds: `mode-registry.json` declares `mcp-chrome-devtools`, `mcp-aside-devtools` and `mcp-bladebro`, and `hub-router.json` `routerPolicy.tieBreak` lists the same three in the same order. Criterion 3's id-residue check is deferred to the traceability iteration.
- `checklist_evidence` -- partial. Phase 015 criterion 1 ("the three-mode bundle prompt routes `orderedBundle` to all three modes") is backed by the canary case `three-mode-ids-ordered-bundle` at `fixtures/canary-cases.v1.json`, which expects `orderedBundle` with all three modes in tie-break order. The remaining phase 015 criteria are deferred to the traceability iteration.

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:97-110` -- `modeVocabulary` reads only the classes named by `routerSignals`, so the discovery-only classes `hub-identity` and `generic-browser-automation` never reach a mode's vocabulary. A discovery-only prompt therefore scores zero modes and defers, which is what `hub-router.json` `discoveryClassesContract` promises.
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107-110` -- a `reject` comes only from the caller's `constraints` set, never from prompt text, so the canary case `chrome-devtools-http-403-forbidden` ("debug the 403 Forbidden network requests in chrome devtools") routes instead of rejecting. The paired case `forbidden-reject` carries `constraints: ["forbidden"]`, so both cases are satisfiable at once.
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1` -- `servingAuthority` is `compiled` with `shadowOnly: false` and `fencingEpoch` 1, which backs the `SKILL.md:74` claim that compiled routing is the default for this hub.

## Edge Cases

- `leaf-scopes.json` declares only `mcp-chrome-devtools`. Read as a defect at first, then resolved: `skill-root-metadata-contract.md` §3 makes the file optional and per-mode, and `README.md:58` and `SKILL.md:106` both state that only Chrome DevTools needs the extra Lighthouse catalog leaf. Not a finding.
- `leaf-manifest.config.json` is absent from the hub. Resolved as correct: `skill-root-metadata-contract.md` §3 marks it **forbidden** for class H, and the sibling hub `.skilled/skills/mcp-tooling/` omits it too. Not a finding.
- `hub-router.json` `ambiguityDelta` is 1 while every mode weight is 4, so a near-tie can only be an exact tie. Recorded as intentional rather than a defect: the comment at `router.cjs:85-87` states the hub declares no `clarify` outcome, so a tie must resolve as a bundle.
- The `ROUTER.md` `INTENT_SIGNALS` block splits the hub's `chrome-devtools-aliases` and `browser-debug` classes into `CHROME_DEVTOOLS` and `LIGHTHOUSE_TRACE`. Verified as a faithful split, not drift: the union of the two `ROUTER.md` lists equals the union of the two `hub-router.json` classes at 38 keywords with no missing and no extra entry, and the Aside (21) and Bladebro (19) unions match exactly.

## Confirmed-Clean Surfaces

- `mode-registry.json` and `hub-router.json` are bidirectionally aligned: every `routerSignals` key names a declared `workflowMode`, every declared mode has a signal, and `assertTieBreakCoversModes` (`registry-compiler.cjs:166-172`, called at `:212`) fails closed on a mismatch.
- Every `leaf-manifest.json` leaf resolves on disk: 17 leaves across three packets, 0 missing.
- Every `ROUTER.md` `RESOURCE_MAP` path both resolves on disk and appears in `leaf-manifest.json`, which is what `ROUTER.md:24` promises.
- The three mode `SKILL.md` `allowed-tools` sets equal their `mode-registry.json` `toolSurface.allowed` sets.
- `graph-metadata.json` declares one hub identity with `siblings: []`, so no hub member carries a second advisor identity.

## Ruled Out

- "The compiled router rejects on the word `forbidden` in a prompt": ruled out by `router.cjs:107-110`, which reads only `input.constraints`.
- "Discovery vocabulary fans out to every mode": ruled out by `registry-compiler.cjs:97-110` plus the `generic-browser-automation-defer` and `hub-identity-defer` canary cases.
- "`leaf-scopes.json` is missing two modes": ruled out by the optional-per-mode contract and the two docs that state the Chrome-only scope.
- "The hub carries a second advisor identity for a mode": ruled out by `graph-metadata.json` `siblings: []` and the single `skill_id`.

## Next Focus

- Dimension: security
- Focus area: the Aside installer digest pin, the Aside capture example's `..` path guard, the Bladebro install and rollback path, and any secret or credential handling in the three mode packets
- Reason: phase 015 shipped an installer that runs only a script matching a pinned sha256 and an example that rejects `..` paths; both are trust-boundary changes that need a security read rather than a correctness read
- Rotation status: correctness pass 1 complete, three dimensions remain
- Blocked/productive carry-forward: productive -- reading the registry pair against the compiled compiler found the advisor-metadata contradiction, so the same registry-versus-projection comparison is worth repeating for the installer and example scripts
- Required evidence: file:line on the digest comparison, the path guard and the rollback command

Review verdict: CONDITIONAL
