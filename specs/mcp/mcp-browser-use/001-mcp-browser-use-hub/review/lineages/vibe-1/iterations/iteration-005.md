# Review Iteration 005

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: correctness, second pass
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed the focus by running the phase 015 fixes as behaviour instead of re-reading them: it compiled the hub router from source and replayed all sixteen canary cases in memory, it ran the five id-noun probe prompts and the five staging probes against the live advisor, and it read the hub capability matrix against the Aside packet's own matrix.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `015-fix-follow-up-review-findings/{goal.md,spec.md,implementation-summary.md}`, `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md`, `.skilled/skills/mcp-browser-use/{SKILL.md,ROUTER.md,hub-router.json}`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/{SKILL.md,README.md}`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/{SKILL.md,README.md,INSTALL-GUIDE.md,feature-catalog/feature-catalog.md}`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/{lib/router.cjs,harness/build-artifacts.cjs,fixtures/canary-cases.v1.json}`, `.skilled/bin/skill-advisor.cjs`

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:80-175`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:47-66`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:1-260`
- `.skilled/skills/mcp-browser-use/ROUTER.md:45-56`
- `.skilled/skills/mcp-browser-use/SKILL.md:32-50`
- `.skilled/skills/mcp-browser-use/SKILL.md:55-80`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:202-205`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md:47`
- `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:1-45`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:1032-1035`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The intent vocabulary has no prose form for Aside, so a request that names Aside either defers or silently drops it from a bundle** -- `.skilled/skills/mcp-browser-use/ROUTER.md:53` -- `ASIDE_DEVTOOLS` lists twenty-one keywords and every one of them carries a qualifier: `use aside`, `run aside`, `open aside`, `with aside`, `aside browser`, `aside cli`, `aside mcp`, `aside repl`, `aside daemon`, `aside account`, `aside devtools`, `mcp-aside-devtools` and nine phrase forms. Bare `aside` is absent. `BLADEBRO` in the same block does carry its bare product name, `bladebro`, so the asymmetry is not a general rule against bare names. Two live reaches follow. `debug this page in aside` reaches the hub from the advisor at 0.82 and the compiled router returns `defer` with no scores, which contradicts `SKILL.md:77`, where `defer` is defined as "the outcome that asks for disambiguation when generic browser phrasing names no mode" -- this request names a mode. `use chrome devtools, aside and bladebro` reaches the hub at 0.95 and the router returns `orderedBundle` over `[mcp-chrome-devtools, mcp-bladebro]`, dropping Aside with no signal that it was dropped. The phase 015 fix is real but covers only the id form: the canary case `three-mode-ids-ordered-bundle` passes because its prompt spells `mcp-aside-devtools`, and no canary case writes the three modes in prose.
   - Case: a reader writes "use chrome devtools, aside and bladebro" or "debug this page in aside". The advisor routes the hub at 0.95 and 0.82, the router scores Aside at zero, and the reader either gets a two-mode bundle that silently omits the mode they named or is asked which mode they meant after already naming it.
   - Finding class: instance-only
   - Scope proof: the gap is one vocabulary class in one file. `rg -n "aside" ROUTER.md:53` shows every Aside keyword carries a qualifier while `BLADEBRO` carries bare `bladebro`; replaying the two prompts through `evaluateRoute` returns `defer` and a two-mode `orderedBundle`; the sixteen canary cases all pass, so the defect is outside the fixture's coverage rather than a regression in the fix.
   - Affected surface hints: `ROUTER.md` `INTENT_SIGNALS` `ASIDE_DEVTOOLS`, `hub-router.json` `vocabularyClasses`, `graph-metadata.json` `intent_signals`, the compiled `routingModel` in `registry-compiler.cjs`, `fixtures/canary-cases.v1.json`, `SKILL.md` defer definition

```json
{"type":"claim","claim":"The hub's Aside vocabulary has no prose form, so a request that names Aside by its product name scores zero: it defers when Aside is the only mode named, and it silently drops Aside from a bundle when other modes are named too.","evidenceRefs":["ROUTER.md:53","SKILL.md:77","hub-router.json:1"],"counterevidenceSought":"Replayed all sixteen canary cases in memory against the compiled router: 16 of 16 pass, including `aside-devtools-single` on the prompt `aside browser` and `three-mode-ids-ordered-bundle` on the full-id prompt. So the fix works for every form the fixture covers, and the gap is the prose form the fixture does not cover. Also ran the live advisor on both failing prompts to confirm the hub is actually reached: 0.82 and 0.95.","alternativeExplanation":"Bare `aside` is an ordinary English word, so adding it as a keyword would false-fire on prose that has nothing to do with the tool. That explanation is confirmed rather than refuted: `set this aside for now`, `put that aside and open the page` and `aside from that, ship it` all defer today, and a bare keyword would route all three to the hub. The defect is therefore the missing phrase forms, not the missing bare word.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the hub documents that a mode must be named by id or by a qualified phrase, which would put the prose form outside the routing contract.","upgradeTrigger":"Raise to P0 if a gate or a playbook scenario is found that asserts a prose three-mode prompt routes all three modes."}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass. Goal criterion 5 ("One real browser request per mode returns `mcp-browser-use` from the advisor and that mode from the hub router") still holds: the advisor returns the hub for each mode's own prompt and the compiled router returns that mode. The new P1 does not touch criterion 5, because each single-mode request in the criterion is written in a form the vocabulary covers.
- `checklist_evidence` -- pass, with one coverage note. Phase 015 criterion 1 ("The three-mode bundle prompt routes `orderedBundle` to all three modes, and the canary harness exits 0") holds literally: the canary case `three-mode-ids-ordered-bundle` returns `orderedBundle` over all three modes in tie-break order, and the other fifteen cases pass too. Phase 015 criterion 2 ("The five probe prompts no longer lift a skill they do not name") holds as behaviour, not only as the changelog's claim: `fix the infinite loop in this function`, `update the build tooling` and `the mode rollout` each return no recommendations at all; `run the doctor update check` still returns `system-skilled-doctor` at 0.82; `fix the code in the parser` returns `sk-code` and `local-webflow` with the hub absent. The changelog's staging claim holds too: bare `staging` returns nothing while `staging site`, `staging url`, `staging website` and `staging portal` each return the hub at 0.82. The changelog's disclosed known limitation reproduces exactly: `fix the container orchestration config` lifts `sk-code`, `mcp-code-mode` and `mcp-browser-use` to 0.82. The coverage note is that criterion 1's canary prompt spells the three ids, so the criterion is satisfied by the id form only, which is what the new P1 records.

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:96-131` -- `exactBundle` matches a bundle rule by joining `targetWorkflowModes` with a space, and `evaluateRoute` falls back to the literal `orderedBundle` kind when no rule matches. The compiled `routingModel` carries four bundle rules: the three pairs and the triple. The triple rule is what makes the phase 015 fix work, and it is reached only when all three modes score above zero.
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs:56-66` -- `loadSnapshot` compiles the router from `mode-registry.json`, `hub-router.json` and `SKILL.md` in memory. This iteration called `loadSnapshot` and `evaluateRoute` directly, so the replay ran against the same compiled model the harness builds.
- `.skilled/bin/skill-advisor.cjs` -- the daemon-backed advisor CLI. `advisor_recommend --prompt <p> --format json` returned `data.recommendations[].skillId` with `confidence` and `confidenceFloored`, which is the surface the five probe prompts and the staging probes were read from.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147` and `:202-205` -- the Aside packet's own matrix marks console capture, network capture and HAR export as gaps on `1.26.626.1517` because `page.on` rejects those events. The hub matrix at `SKILL.md:40` now says the same thing, so the phase 015 capability-matrix correction is faithful to the packet it summarises.

## Edge Cases

- The canary harness has two halves and only one was exercised. `loadSnapshot` compiles and `evaluateRoute` scores, both read-only, and both ran. `buildArtifacts` writes compiled artifacts into `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/`, which is outside this lineage's write surface, so it was not run. The replay therefore proves the compile-and-route path and not the artifact-writing path. Recorded as a scope limit rather than a pass.
- The advisor CLI is daemon-backed and writes its own socket and cache under `/tmp/system-skill-advisor`. That is scratch state outside the repository, and no repository file was written by the eleven advisor calls.
- The Aside version pin reads `1.26.626.1517` in every one of the packet's files. An earlier iteration's sweep pattern `Aside [0-9.]+` matched only the `1.26.626` prefix and made the pin look like it had two forms. It does not: the four-part form is single-valued across the hub, so there is no drift to report.
- The `defer` outcome on `debug this page in aside` is ambiguous between two readings: a deliberate ask, or a vocabulary miss. `SKILL.md:77` resolves it, because it defines `defer` as the outcome for a request that "names no mode", and this request names one. The finding keeps the higher reading on that evidence and carries a downgrade trigger in case the hub later documents a stricter naming rule.

## Confirmed-Clean Surfaces

- All sixteen canary cases pass against the compiled router: 16 of 16, covering four Chrome DevTools prompts, three Aside prompts, two Bladebro prompts, two bundles, two defers, one reject and two adversarial Chrome prompts (`Open DevTools and inspect the console logs.` and `debug the 403 Forbidden network requests in chrome devtools`, the second of which proves prompt text alone never rejects).
- The three-mode bundle rule works for the id form: `use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro` scores all three modes at 8 and returns `orderedBundle` over `[mcp-chrome-devtools, mcp-aside-devtools, mcp-bladebro]` in tie-break order.
- The hub capability matrix agrees with all three mode packets on every row checked: `bdg network har <path>` for HAR export, `300+ methods across 53 domains` for raw CDP, `lighthouse_audit` and the three `performance_*` tools as MCP-lane-only, and `chrome_devtools_live --autoConnect` for the signed-in profile. Each of those names exists in the Chrome packet.
- The Aside capability-matrix correction is complete: `page.on` appears nowhere in the hub `SKILL.md`, and the console-and-network row now states the gap with the pinned version.
- The advisor 2.0.3.0 id-noun change holds on all five probe prompts and on the doctor control row `my doctor update came in`, which returns no recommendations as the changelog says it should.

## Ruled Out

- "The phase 015 three-mode bundle fix does not work": ruled out, the id-form prompt returns all three modes and the canary case passes.
- "The advisor 2.0.3.0 changelog overstates the id-noun change": ruled out, all five probe prompts and the doctor control row behave as the changelog states.
- "The advisor 2.0.3.0 changelog overstates the staging change": ruled out, bare `staging` returns nothing and the four qualified forms each return the hub at 0.82.
- "The disclosed 0.45 lexical-anchor limitation is worse than disclosed": ruled out, `fix the container orchestration config` lifts exactly the three skills the changelog names, at exactly the 0.82 floor it names.
- "The hub capability matrix still advertises Aside `page.on` events": ruled out, the row now states the gap and no `page.on` remains in the hub `SKILL.md`.
- "The Aside version pin has two forms": ruled out, `1.26.626.1517` is single-valued across the hub; the earlier two-form reading was a truncated sweep pattern.
- "The near-tie rule over-bundles ordinary prompts": ruled out on the probes run, `take a screenshot with chrome devtools` and `use bladebro to screenshot this page` each return a single mode, and `run a lighthouse audit and then replay it in aside` returns single Chrome DevTools because the Lighthouse class scores 8 against Aside's 0.

## Next Focus

- Dimension: traceability, second pass
- Focus area: the four overlay protocols the strategy declares -- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` -- read against the hub and its three modes
- Reason: the first traceability pass covered the two core protocols and the seven goal criteria; the overlay set is declared in the strategy's review boundaries and has not been run
- Rotation status: all four dimensions covered once, correctness covered twice; traceability's second pass is next
- Blocked/productive carry-forward: productive -- running the reach instead of arguing it worked twice now, so the overlay pass should execute each protocol's check rather than read its prose
- Required evidence: for each overlay protocol, the exact command, workflow, skill, caller agent or mirror path it names, plus the file:line that proves the link

Review verdict: CONDITIONAL
