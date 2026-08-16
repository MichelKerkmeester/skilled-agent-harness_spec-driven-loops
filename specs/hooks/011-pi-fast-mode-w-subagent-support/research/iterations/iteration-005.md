# Iteration 5: /fast command collision - duplicate command/flag registration behavior; safe install/remove ordering; verification method

## Focus
Lane Q5 of the approved ten-lane queue (orchestrator override; reducer next-focus text was generic and superseded). Investigated whether a fork of pi-openai-fast-mode (which registers command `fast` AND flag `fast`) collides with the other fast-mode extensions, how pi's runtime handles duplicate registration, what install/remove ordering is safe, and how to verify the effective command objectively. Ambiguity: none - lane fixed by dispatch; no deferred alternatives.

## Actions Taken
1. Grepped prior packet evidence (iterations/iteration-001.md finding 4) for existing registerCommand/registerFlag coverage - established that keep-all + numeric-suffix behavior was already known at doc level; the lane gap is participants, flag semantics, ordering, and verification.
2. Read context/pi-openai-fast-mode/src/index.ts:85-115 and commands.ts - exact registration surface of the fork source.
3. Grepped context/pi-gpt-fast-mode/src (no command registration found) and context/pi-fast-mode/extensions/openai-codex-fast-mode.ts (registers command `fast`).
4. Read installed core docs extensions.md registerCommand / getCommands / registerFlag sections.
5. Read installed core dist loader.js createExtensionAPI runtime surface (registerCommand :223, registerFlag :234-239, getFlag :250-255) and loadExtensionsFromPaths (:430-450).

## Findings
1. Dual registration surface in the fork source: pi-openai-fast-mode registers BOTH `pi.registerFlag("fast", {type:"boolean", default:false})` AND `pi.registerCommand("fast", ...toggle...)` (index.ts:94-100). A fork inherits both; flag and command namespaces are separate, so there is no intra-extension conflict. [SOURCE: context/pi-openai-fast-mode/src/index.ts:94-100]
2. Collision surface is real: two existing extensions register command `fast` - pi-openai-fast-mode (index.ts:100) and TheBinaryGuy pi-fast-mode (openai-codex-fast-mode.ts:161). Installing the fork alongside both yields THREE registrations of `fast`. pi-gpt-fast-mode registers no commands or flags (grep of src returned empty) - not a collision participant. [SOURCE: context/pi-openai-fast-mode/src/index.ts:100; context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:161; grep context/pi-gpt-fast-mode/src]
3. Duplicate command registration: keep-all + numeric suffix in load order. Official docs: "If multiple extensions register the same command name, pi keeps them all and assigns numeric invocation suffixes in load order, for example /review:1 and /review:2". No crash, no last-write-wins. Re-confirms iteration-1 finding 4 at the doc-anchor level; the runtime stores per-extension in a Map (loader.js:223) and suffix assignment happens downstream at command resolution. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md registerCommand section; dist/core/extensions/loader.js:223; cross-check research/iterations/iteration-001.md:44-49]
4. Duplicate flag registration: per-extension Map + shared global value store, first-registered default wins. loader.js registerFlag stores into `extension.flags` (a per-extension Map - no cross-extension registration error) and seeds the shared `runtime.flagValues` ONLY when `!runtime.flagValues.has(name)`, so the first-loaded extension's default wins and later defaults are silently ignored. getFlag additionally gates reads on `extension.flags.has(name)` - an extension can only read flags it registered. Consequence: the fork and pi-openai-fast-mode can both register flag `fast` without crash; the value is a single global and the fork must treat `getFlag("fast")` as a shared, first-default-wins namespace. [SOURCE: dist/core/extensions/loader.js:234-239, 250-255]
5. Safe install/remove ordering follows load order. loadExtensionsFromPaths pushes extensions in path-list order (loader.js:430-450) and suffixes are assigned in load order (docs), so the FIRST-loaded extension keeps bare `/fast` and later ones get `/fast:1`, `/fast:2`. Safe install ordering: load the fork before any other fast-command extension (or uninstall legacy first) so the fork owns the bare command. Removal ordering: removing an earlier-loaded extension renumbers the surviving suffixes (inferred from keep-all + load-order semantics - not empirically observed this iteration; flagged for the testing lane to confirm). [SOURCE: dist/core/extensions/loader.js:430-450; extensions.md registerCommand "in load order"; INFERENCE: suffix renumbering on removal follows from keep-all + load-order semantics]
6. Verification method: `pi.getCommands()` / RPC `get_commands`. Documented API returns the session's slash commands ordered "extensions first, then templates, then skills", with per-entry `source` and `sourceInfo` (including scope and extension path). Objective post-install verification: query get_commands, filter `source === "extension"`, and assert (a) exactly the expected fast entries exist, (b) the fork's registration is the bare `fast` (load order first), (c) each entry's sourceInfo.path resolves to the intended extension. Scriptable in a test, unlike interactive /fast invocation. [SOURCE: extensions.md getCommands section]

## Questions Answered
- Q5 /fast command collision: duplicate command/flag registration behavior; safe install/remove ordering; verification method - answered (all three sub-parts).

## Questions Remaining
- Q6 Packaging & install mechanics (pi install local/git/npm; package.json pi.extensions; raw TypeScript; tsconfig; pi.dev/npm indexing; publish checklist)
- Q7 Testing patterns (ExtensionAPI mocks; vitest for raw TS; env-inheritance child-process tests; coverage)
- Q8 Indicator UX under custom footers (setFooter vs widget placement; status fallback)
- Q9 TheBinaryGuy pi-fast-mode edge cases (footer-composition wrapper; atomic state writes; service_tier/payload.model guards; supportsFastMode regex)
- Q10 Licensing, notices, docs, maintenance (MIT; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md; npm keywords)

## Next Focus
Q6 Packaging & install mechanics.

## Ruled Out
- None this iteration. No BLOCKED exhausted-approach category applies to lane 5; prior exhausted entries (reading dist bundles over src, npm-registry spawn hunting) were respected and not retried.

## Edge Cases
- Ambiguous input: none - orchestrator override fixed lane Q5; reducer next-focus text was generic ("6 of 10 lanes remain") and superseded.
- Contradictory evidence: none - docs and installed dist agree (keep-all suffix for commands; per-extension flags Map); iteration-1 finding 4 re-confirmed by doc anchor.
- Missing dependencies: memory daemon unavailable per state summary; direct packet + installed core used as authority.
- Partial success: none.

## Dead Ends
- None definitively eliminated this iteration. The suffix-renumbering-on-remove behavior is an inference, not an observation; it is a candidate verification step for the testing lane (Q7), not a dead end.

## Sources Consulted
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/index.ts:85-115
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/commands.ts:1-40
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:161
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src (grep: no registerCommand/registerFlag)
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md (registerCommand, getCommands, registerFlag sections)
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:223, 234-239, 250-255, 430-450
- specs/hooks/011-pi-fast-mode-w-subagent-support/research/iterations/iteration-001.md:44-49

## Assessment
- New information ratio: 0.92
- Questions addressed: 1 (Q5, three sub-parts)
- Questions answered: 1

## Reflection
- What worked and why: reading the installed dist runtime surface (createExtensionAPI in loader.js) instead of relying on docs alone - the per-extension flags Map and first-default-wins seeding are only visible in code, and the docs are silent on flag collisions. Ground-truth source beats absence-of-documentation.
- What did not work and why: nothing failed. The only limit is that suffix renumbering on removal is inferred from keep-all + load-order semantics, not empirically observed (no live pi session this iteration).
- What I would do differently: the Q6/Q7 iterations should add a live `get_commands` probe test to empirically confirm suffix renumbering after remove/reinstall and to make the verification method executable.

## Recommended Next Focus
Q6 Packaging & install mechanics - and carry forward the get_commands probe as the acceptance test for install/remove ordering.
