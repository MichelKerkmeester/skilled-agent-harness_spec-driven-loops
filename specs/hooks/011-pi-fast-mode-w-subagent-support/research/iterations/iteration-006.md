# Iteration 6: Packaging & Install Mechanics

## Focus
Q6 (approved operator lane): Packaging & install mechanics for the fork `pi-fast-mode-w-subagent-support` — `pi install` local/git/npm source forms; `package.json` `pi.extensions` manifest; raw TypeScript loading (no build step); tsconfig pattern; pi.dev/npm gallery indexing; publish checklist. This lane had zero prior packet coverage; every finding below is new. Evidence authority: installed pi docs `packages.md`, installed dist `loader.js`, and the three context upstream package manifests.

## Actions Taken
1. Read full installed `packages.md` (install/manage, sources, manifest, dependencies, filtering, scope/dedup sections) — 8 tool calls consumed total this iteration.
2. Read `loader.js` dist internals for `pi.extensions` resolution and the raw-TypeScript load path (jiti).
3. Read all three context `package.json` files (pi-openai-fast-mode, pi-gpt-fast-mode, pi-fast-mode) plus pi-openai-fast-mode `tsconfig.json` as real-world packaging exemplars.
4. Read phase-001 `001-fork-and-package/checklist.md` for the operator's own fork verification gate (CHK-004 typecheck, CHK-005 no-new-deps, CHK-007 identity scan).
5. Cross-checked `extensions.md:150` for the production-install dependency rule (`npm install --omit=dev`).

## Findings
1. **[P1] `pi install` accepts four source forms and two scope flags.** `pi install npm:@foo/bar@1.0.0`, `git:github.com/user/repo@v1`, raw URLs (`https://…`), and absolute/relative local paths. `-l` writes project settings (`.pi/settings.json`) instead of user (`~/.pi/agent/settings.json`); `-e`/`--extension` try-installs into a temp dir for the current run only. Companion surface: `pi remove`, `pi list`, `pi update --extensions`, `pi config`. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:23-46]
2. **[P2] Install layout and pinning semantics.** npm sources land in `~/.pi/agent/npm/` (user) or `.pi/npm/` (project); git sources clone to `~/.pi/agent/git/<host>/<path>` or `.pi/git/<host>/<path>`; local paths are recorded in settings **without copying** (file = single extension, dir = package rules; relative paths resolve against the settings file). Versioned npm specs and git refs are pinned: `pi update --extensions`/`--all` reconcile clones to the pinned ref but never move it; `pi install git:host/user/repo@new-ref` is the way to re-pin. CI: `GIT_TERMINAL_PROMPT=0` + `GIT_SSH_COMMAND` fail fast. `npmCommand` setting can pin npm to a wrapper (mise/asdf). [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:54-104]
3. **[P1] The `pi.extensions` manifest field is the load gate.** `package.json` `"pi": {"extensions": […], "skills": […], "prompts": […], "themes": […]}` with paths relative to package root, glob patterns and `!exclusions`. If no `pi` manifest exists, pi auto-discovers convention dirs (`extensions/` loads `.ts` and `.js`). The dist loader resolves package.json `pi.extensions` declared paths first, then falls back to `index.ts`/`index.js`. All three upstreams declare `pi.extensions` pointing at raw `.ts` entries (`./src/index.ts`, `./index.ts`, `./extensions/openai-codex-fast-mode.ts`). The fork must ship this field. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:106-135; ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:468,491-492; specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-{openai-fast-mode,gpt-fast-mode,fast-mode}/package.json]
4. **[P2] Raw TypeScript runs directly — no build step exists or is needed.** `loader.js:2` states the loader "loads TypeScript extension modules using jiti"; `createJiti` is imported from `jiti/static` and entries are loaded via `jiti.import(extensionPath)`. Consequently the upstream tsconfig is a pure typecheck config: `noEmit: true`, `strict: true`, `moduleResolution: "Bundler"`, `isolatedModules: true`, `types: ["node", "vitest/globals"]`. Publish raw `.ts`; never a compiled `dist/`. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:2,14,358,368; specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/tsconfig.json]
5. **[P1] Dependency contract.** pi bundles five core packages that extensions must declare as `peerDependencies` with `"*"` and must NOT bundle: `@earendil-works/pi-ai`, `@earendil-works/pi-agent-core`, `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`, `typebox`. Third-party runtime deps go in `dependencies` because distributed installs are production installs (`npm install --omit=dev`); other pi packages need `dependencies` + `bundledDependencies` with `node_modules/`-relative manifest paths. Upstreams declare `peerDependencies: {"@earendil-works/pi-coding-agent": "*"}` (pi-fast-mode adds `@earendil-works/pi-tui: "*"`); pi-openai-fast-mode also lists `@earendil-works/pi-coding-agent` in devDependencies for typecheck/test. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:150,169-186; ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:150; context package.jsons]
6. **[P2] pi.dev/npm gallery indexing.** The `pi-package` keyword gates gallery listing at pi.dev/packages; optional `pi.image` (PNG/JPEG/GIF/WebP) and `pi.video` (MP4 only) fields add a preview (video wins when both set). All three upstreams carry `pi-package` + `pi-extension` keywords; pi-openai-fast-mode and pi-gpt-fast-mode also ship `pi.image` preview URLs. The fork should mirror this keyword + image pattern for indexing. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:127-148; context package.jsons]
7. **[P2] Publish checklist synthesis for the fork.** (a) `files` whitelist must include the raw `.ts` entry + `src/` + `README.md` + `LICENSE` (upstreams: `["src","README.md"]`, `["index.ts","src","README.md","LICENSE"]`, `["extensions","LICENSE","README.md"]`); (b) scoped names need `publishConfig.access: "public"` (pi-fast-mode exemplar); (c) `"type": "module"`; (d) scripts `typecheck` (`tsc --noEmit`) + `test` + `check`; (e) `npm publish` then verify `pi install npm:<name>@<ver>`, `pi list`, `pi -e npm:<name>`; (f) git installs pin refs — verify `pi install git:github.com/<owner>/<repo>@<tag>` and re-`pi update --extensions` reconciliation in CI with `GIT_TERMINAL_PROMPT=0`; (g) local dev loop: `pi install ./relative/path` (+`-l` for project settings). [SOURCE: packages.md:23-104 (synthesis over: files-whitelist contract from context package.jsons; access-public from pi-fast-mode package.json; verify loop inferred from packages.md install/list/-e surface) — ordering is [INFERENCE: derived from packages.md command surface + the three shipped manifests]]
8. **[P2] Scope, dedup and filtering are packaging-relevant.** Same package in global + project settings: project entry wins unless `autoload: false` (then applied as a delta over global). Identity: npm name / git URL without ref / resolved absolute local path. Settings object filters (`+path`, `-path`, `!pattern`, key omissions) narrow the manifest per install; `pi config` enables/disables resources in either settings file. Useful for the fork's dual flag+command surface if the operator wants to disable the `/fast` command selectively. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:189-222]

## Ruled Out
- Reading npm-registry metadata to validate `pi.extensions`/keywords (respects iteration-2 exhausted entry; installed docs + dist + shipped manifests are the ground truth and were sufficient).
- Treating any of the three upstream `files`/keyword sets as mandatory verbatim — they are exemplars, not a spec; the fork's `pi.extensions` entry path is its own decision (finding 3/7).

## Dead Ends
- None definitively eliminated this iteration. Candidate verification steps for Q7 (testing lane): empirical `pi install ./local` + `pi -e` smoke runs, and confirming jiti version pinning in the installed pi build.

## Edge Cases
- Ambiguous input: none — the approved lane text maps 1:1 to `packages.md` sections.
- Contradictory evidence: none — docs (`packages.md`), dist (`loader.js`), and shipped manifests agree on every cross-checked point (manifest-first resolution, raw-TS jiti loading, peerDeps contract).
- Missing dependencies: none. The npm registry was intentionally not consulted (exhausted in iteration 2); installed docs/dist are authoritative for this lane.
- Partial success: none — all research actions succeeded.

## Questions Answered
- Q6 Packaging & install mechanics: pi install local/git/npm source forms and flags (F1-2); package.json pi.extensions manifest + convention-dir fallback (F3); raw TypeScript via jiti, no build step (F4); tsconfig noEmit typecheck pattern (F4); pi.dev/npm gallery indexing via pi-package keyword + image/video (F6); publish checklist (F7); scope/dedup/filtering (F8).

## Questions Remaining
- Q7 Testing patterns: upstream ExtensionAPI mocks; vitest setup for raw TypeScript; env-inheritance child-process tests; coverage expectations
- Q8 Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation
- Q9 TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject
- Q10 Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key

## Sources Consulted
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:23-222
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:150
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:2,14,358,368,462-507
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/package.json
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/tsconfig.json
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/package.json
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/package.json
- specs/hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/checklist.md

## Assessment
- New information ratio: 1.0 (8 of 8 findings fully new; Q6 had no prior packet coverage)
- Questions addressed: 1 (Q6)
- Questions answered: 1 (Q6); run total 6/10 lanes answered

## Reflection
- What worked and why: `packages.md` is the single authoritative install doc and covers the whole lane; pairing it with the dist loader (jiti evidence for raw TS) and three real shipped manifests turned every claim into a multi-source cross-check. The three upstreams double as a de-facto publish template, so the checklist (F7) is grounded in shipped examples rather than invented.
- What did not work and why: nothing failed. The only gap: git-ref reconciliation and `pi -e` temp-install behavior are documented but not empirically observed this iteration (no live pi run); they are candidates for the Q7 testing lane.
- What I would do differently: capture exact jiti version/pinning from the installed pi build so the fork can pin its dev toolchain compatibly; that detail was out of budget scope here.

## Recommended Next Focus
Q7 Testing patterns (per operator queue): upstream ExtensionAPI mocks, vitest setup for raw TypeScript, env-inheritance child-process tests, coverage expectations — and fold in the two empirical verifications surfaced here (`pi -e` temp-install smoke test; jiti version pinning).

## SCOPE VIOLATIONS
- None. No would-be mutation outside the allowed-write list was encountered; all researched paths were read-only.
