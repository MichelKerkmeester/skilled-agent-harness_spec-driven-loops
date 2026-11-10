# Iteration 003: Registry-derived surface inventory and routing hints

## Focus

Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour?

Round one established the shared surface packet contract and opening section order, identified the workflow-link trio, and recommended assets/checklists as the checklist home. Its seven-step migration plan covered baseline capture, wording, section order, checklist moves, Obsidian reference grouping, mirrors and indexes, and final validation. This iteration adds Q3-specific steps 8–10 to that plan. [SOURCE: specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md:100] [SOURCE: specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md:102] [SOURCE: specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md:126] [SOURCE: specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md:136] [SOURCE: specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md:142]

## Actions Taken

- Read round one sections 7–9 and the preceding round-two iteration notes.
- Compared the mode registry with the router-sync and documentation-claim guards.
- Compared all three surface §2b blocks with the hub load-tier contract.
- Traced compiled-route surface hints through the advisor and checked the router replay classifier.
- Read source only; no researched files were changed and no tests were run.

## Findings

### 1. Derive packet inventory from the mode registry

The registry marks sk-code-webflow, sk-code-skilled, and sk-code-obsidian with packetKind: surface, but repeats those names in extensions.surface-axis.surfaces. [SOURCE: .skilled/skills/sk-code/mode-registry.json:19] [SOURCE: .skilled/skills/sk-code/mode-registry.json:62] [SOURCE: .skilled/skills/sk-code/mode-registry.json:80] [SOURCE: .skilled/skills/sk-code/mode-registry.json:99]

verify-router-sync.cjs still defines SURFACES as only Webflow and Skilled, then adds Obsidian separately to SURFACE_PACKETS. legSurfaceMap iterates SURFACES when it reads child maps and builds the union, so it never compares Obsidian’s child map to the parent union. legBijection also validates only the sk-code-skilled router map. This means a missing or stale Obsidian parent-map entry can escape these checks. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:33] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:34] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:200] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:211] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:261]

There is already a registry-derived precedent: verify-doc-claims.cjs counts modes where packetKind is surface. Derive the verifier’s surface records from that same predicate, keeping workflowMode and packet as distinct fields; validate the duplicate extensions.surface-axis.surfaces list against the derived result if it still has consumers. Keep routerPolicy.tieBreak and routerSignals explicit: tie-break order, weights, vocabulary classes, and resource choices are behavior, not inventory. The guard should fail if any registry surface lacks an authored route signal or tie-break position. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:320] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:331] [SOURCE: .skilled/skills/sk-code/hub-router.json:7] [SOURCE: .skilled/skills/sk-code/hub-router.json:20] [SOURCE: .skilled/skills/sk-code/hub-router.json:31] [SOURCE: .skilled/skills/sk-code/hub-router.json:42]

### 2. Keep one leaf-router schema and one hub load-tier authority

All three leaf blocks already use one schema: DEFAULT_RESOURCE is a list; each INTENT_SIGNALS entry has weight and keywords; each RESOURCE_MAP entry maps an intent to a list of paths. Intent names, weights and paths differ because the surfaces cover different domains. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:61] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:70] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:83] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:79] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:84] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:92] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:66] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:73] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:89] The parser’s return type is already defaultResource: string[]. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:392] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:394]

The drift is in the explanation and ownership. The Skilled comment names Webflow as its sibling, and the Webflow comment names Skilled, both omitting Obsidian; the Obsidian comment already uses generic sibling-surface wording. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:54] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:63] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:75] Load tiers are declared once in sk-code/ROUTER.md, including ALWAYS, SURFACE, INTENT, LANGUAGE and ON_DEMAND. verify-doc-claims.cjs checks the parent’s always-loaded claims against its DEFAULT_RESOURCE list. Keep this split: normalize the three leaf blocks to the existing array/map schema, generalize their sibling prose to “registered surface packets,” and leave load-tier policy in the hub router. Do not add parallel leaf tier tables. [SOURCE: .skilled/skills/sk-code/ROUTER.md:107] [SOURCE: .skilled/skills/sk-code/ROUTER.md:111] [SOURCE: .skilled/skills/sk-code/ROUTER.md:115] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:347] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:353] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:357]

### 3. Hints reorder matched surfaces; they do not add a surface

The compiled route passes a hint to the hub-specific handler only after evaluating the prompt; its contract says to reorder surfaces the prompt matched. [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99] [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:103] [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:106]

Tests directly verify that default tie-break puts Skilled ahead of Webflow, a WEBFLOW hint moves Webflow first, and a Webflow hint resolves an Obsidian/Webflow collision in Webflow’s favor. A hint of OBSIDIAN on a Webflow-only prompt changes nothing. The suite does not positively test an explicit SKILLED or OBSIDIAN hint. [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61] [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:68] [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:74] [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:79] [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:86]

The advisor’s workspace detector returns SKILLED, OBSIDIAN or WEBFLOW from root markers, and advisorCliRequest passes the result as surfaceHint. Because the compiled contract only reorders already matched targets, this workspace hint cannot add a surface that prompt scoring omitted; it only changes priority among matched surfaces. This follows from the two code paths; a positive matched-prompt test for each hint would confirm parity. [SOURCE: .opencode/plugins/system-skill-advisor.js:692] [SOURCE: .opencode/plugins/system-skill-advisor.js:697] [SOURCE: .opencode/plugins/system-skill-advisor.js:705] [SOURCE: .opencode/plugins/system-skill-advisor.js:707] [SOURCE: .opencode/plugins/system-skill-advisor.js:708] [SOURCE: .opencode/plugins/system-skill-advisor.js:716] [SOURCE: .opencode/plugins/system-skill-advisor.js:725] [SOURCE: .opencode/plugins/system-skill-advisor.js:1009]

### 4. The replay classifier omits Obsidian

router-replay-lib.cjs maps resource prefixes only for Motion, Webflow, and Skilled, and detectSurface recognizes only OpenCode and Webflow markers. Obsidian-only prompts therefore resolve to UNKNOWN in this replay model, and sk-code-obsidian resource paths fall through to UNIVERSAL. The packet registry cannot fill this gap alone because it contains no marker vocabulary or precedence. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:492] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:497] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:503] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:507] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:512]

### Ordered remediation steps to append after round one

8. Derive the verifier’s surface records from mode-registry.json modes filtered by packetKind: surface. Use packet for filesystem paths and workflowMode for compiled identity. Make legSurfaceMap and legBijection iterate every derived surface. Keep the route-specific tie-break and signal definitions authored, but fail when one lacks a corresponding registry surface. Validate extensions.surface-axis.surfaces against the derived inventory until consumers no longer need that duplicate. Guard: add a synthetic fourth-surface fixture to verify-router-sync tests, then run the targeted test and scripts/run-all-drift-guards.sh; the fixture must fail before the fix when that surface is omitted.
9. Standardize the three §2b blocks on DEFAULT_RESOURCE as string[], INTENT_SIGNALS entries as {weight, keywords[]}, and RESOURCE_MAP as intent-to-path-list. Rewrite sibling-union comments in terms of registered surfaces, not named siblings. Keep load tiers only in ROUTER.md. Guard: router-sync leg 2 checks the parent union, verify-doc-claims checks always-loaded tier claims, and run-all-drift-guards.sh must pass.
10. Complete surface replay and hint coverage. Add Obsidian’s path prefix and task markers to router-replay-lib, then add positive matched-target hint cases for SKILLED, OBSIDIAN and WEBFLOW plus an unmatched-hint control; add advisor marker cases for all three workspaces. Refresh the compiled route and require both compiled-route hint tests and the advisor tests to pass, then rerun the full drift-guard wrapper.

## Questions Answered

- Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour?

## Questions Remaining

- None in round two; this was iteration 3 of 3 under the max-iterations stop policy.

## Assessment

Status: insight. newInfoRatio: 0.72. Novelty justification: this iteration newly located a verifier inventory gap, a replay-model Obsidian omission, and the limits of advisor hints; it also confirmed the leaf router blocks already share a parseable schema with hub-owned load tiers.

## Sources Consulted

- specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md
- .skilled/skills/sk-code/mode-registry.json
- .skilled/skills/sk-code/hub-router.json
- .skilled/skills/sk-code/ROUTER.md
- .skilled/skills/sk-code/sk-code-skilled/{SKILL.md,assets/scripts/verify-router-sync.cjs,assets/scripts/verify-doc-claims.cjs,assets/scripts/router-replay-lib.cjs}
- .skilled/skills/sk-code/sk-code-obsidian/SKILL.md
- .skilled/skills/sk-code/sk-code-webflow/SKILL.md
- .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs
- .skilled/bin/tests/compiled-route-surface-hint.test.cjs
- .opencode/plugins/system-skill-advisor.js

## Reflection

Four evidence-gathering actions answered Q3. No alternate direction was exhausted; round one’s seven steps remain the base plan, and this iteration supplies three additive steps.

## Next Focus

None. Iteration 3 of 3 reached the configured max-iterations stop. The workflow synthesis can combine Q1–Q3 and append steps 8–10.
