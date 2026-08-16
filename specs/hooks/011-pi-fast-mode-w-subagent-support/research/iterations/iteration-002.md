# Iteration 2: Subagent handoff mechanics

## Focus
Lane 2 of the approved ten-lane queue (orchestrator focus-map override): how pi-subagents spawns child pi processes, process.env propagation, the official env surface, PI_GPT_FAST_MODE behavior, and toggle/session_start semantics. This feeds the fork's subagent-handoff design (phase docs `002-subagent-handoff/`). No ambiguity: the orchestrator override and the prompt-pack STATE SUMMARY both name this lane; reducer "Next Focus" (Q5 /fast collision) was correctly deprioritized per the override.

## Actions Taken
1. Located the installed pi-subagents package at `~/.pi/agent/npm/node_modules/pi-subagents` (v0.50.0, MIT, Nico Bailon) and inspected its spawn path: `src/runs/shared/pi-spawn.ts`, `src/extension/index.ts` (session_start + env contract), `src/runs/shared/pi-args.ts` (child marker envs), `src/runs/shared/subagent-prompt-runtime.ts` and `src/watchdog/register-main.ts`/`register-child.ts` (session_start handlers).
2. Read the official env-surface doc `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md` (full PI_* table).
3. Read upstream handoff implementation `context/pi-gpt-fast-mode/src/handoff.ts` plus supporting evidence (`types.ts:19`, `README.md:73,84`, `tests/state.test.ts:56-64`, `index.ts:175`).
4. Grepped pi-subagents `src/` for all `process.env.PI_*` / `PI_SUBAGENT*` references to inventory the extension env namespace.

## Findings

1. **Child pi spawn resolution** — pi-subagents spawns children through `getPiSpawnCommand(args)` in `src/runs/shared/pi-spawn.ts`. Resolution order: (a) `PI_SUBAGENT_PI_BINARY` env override wins outright; (b) if the host `process.execPath` basename matches `/^pi(\.exe)?$/i` it is reused as the command; (c) otherwise the `@earendil-works/pi-coding-agent` package `bin` script is resolved (walk-up `package.json` scan) and launched as `node <cliScript> <args>`; (d) fallback is bare `"pi"` on PATH. Spawn sites pass the parent's `process.env` to the child (e.g. `inspectors/herdr/client.ts:51` uses `spawn(bin, args, { env: process.env })`). [SOURCE: ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-spawn.ts:83-126, 23-28; inspectors/herdr/client.ts:43-51] [INFERENCE: same `env: process.env` pattern applies to subagent spawn callers, which resolve commands via `getPiSpawnCommand`]

2. **Env-inheritance contract (parent-only vars must not be overwritten by children)** — `extension/index.ts:796-807` documents the exact pattern: the root session sets `PI_SUBAGENT_PARENT_SESSION` only when the `PI_SUBAGENT_CHILD` marker is absent; children inherit the value "through the process environment at spawn time and must not overwrite it with their own session identity". The child/root distinction is the `PI_SUBAGENT_CHILD` marker env (defined `src/runs/shared/pi-args.ts:106`). This is the canonical mechanism a handoff env var must follow: parent writes once into its own `process.env`, children inherit, children read but never write. [SOURCE: ~/.pi/agent/npm/node_modules/pi-subagents/src/extension/index.ts:796-807; runs/shared/pi-args.ts:106]

3. **Official env surface** — `environment-variables.md` is the authoritative PI_* list. Per-command session vars (resolved when each bash command starts): `PI_CODING_AGENT=true`, `PI_SESSION_ID`, `PI_SESSION_FILE` (unset for ephemeral sessions), `PI_PROVIDER`, `PI_MODEL`, `PI_REASONING_LEVEL`. Config/process vars: `PI_CODING_AGENT_DIR`, `PI_CODING_AGENT_SESSION_DIR`, `PI_PACKAGE_DIR`, `PI_OFFLINE`, `PI_SKIP_VERSION_CHECK`, `PI_TELEMETRY`, `PI_CACHE_RETENTION`, `PI_SHARE_VIEWER_URL`, `PI_HARDWARE_CURSOR`, `PI_TUI_ESC_TIMEOUT`. **`PI_GPT_FAST_MODE` does not appear in the official list** — it is an extension-invented variable, which is legitimate but means the fork's `PI_FAST_MODE_W_SUBAGENT_SUPPORT` name is likewise extension-namespace and must be scanned for collisions (lane 3). [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md:16-30, 81-90]

4. **PI_GPT_FAST_MODE semantics** — upstream `src/handoff.ts` is strict-boolean: `readHandoff` returns `true` only for `"1"`, `false` only for `"0"`, `undefined` for unset or any invalid value (`"yes"`, `""` — no opinion); `writeHandoff` sets `"1"`/`"0"` into the current process env. The handoff contract (file header + README): the parent exports the desired preference into its own env; child pi processes inherit `process.env`; the child confirms the preference on `session_start` and only injects priority when on a supported model. Verification is documented as asking a subagent to print `PI_GPT_FAST_MODE` (`1` = preference active). Tests pin the strict semantics (`PI_GPT_FAST_MODE: "1"` → true; `"yes"` → undefined; `""` → undefined). `index.ts:175` marks this as the "inherited subagent hand-off" path. [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src/handoff.ts:1-19; src/types.ts:19; README.md:73,84; tests/state.test.ts:56-64; index.ts:175]

5. **session_start / toggle semantics** — `session_start` fires in both parent and child processes: pi-subagents registers it in the main watchdog (`watchdog/register-main.ts:411`), the child watchdog (`watchdog/register-child.ts:89`), the extension root (`extension/index.ts:869`, where `event.reason` is `startup|reload|resume` and drives `resetSessionState`), and the subagent prompt runtime gates its own start on `session_start` (`subagent-prompt-runtime.ts:494`). Implication for the fork: a child-side handoff consumer can rely on `session_start` (with `event.reason`) as the confirmation point — matching upstream's "confirm on session_start" comment — and must use the `PI_SUBAGENT_CHILD`-style marker pattern to distinguish parent write from child read. [SOURCE: ~/.pi/agent/npm/node_modules/pi-subagents/src/watchdog/register-main.ts:411-414; watchdog/register-child.ts:89-92; extension/index.ts:869-871; runs/shared/subagent-prompt-runtime.ts:491-496]

6. **pi-subagents env-namespace inventory** — the package already occupies these `PI_SUBAGENT*` names (collision scan input for lane 3): per-run child identity `PI_SUBAGENT_CHILD`, `PI_SUBAGENT_PARENT_SESSION`, `PI_SUBAGENT_DEPTH`, `PI_SUBAGENT_MAX_DEPTH`, `PI_SUBAGENT_MAX_SPAWNS_PER_SESSION`, `PI_SUBAGENT_MAX_SPAWNS_PER_RUN`, `PI_SUBAGENT_PI_BINARY`, `PI_SUBAGENT_INTERCOM_SESSION_NAME`, `PI_SUBAGENT_TASK_DELIVERY`, `PI_SUBAGENT_CAPABILITY_CEILING_V1`, `PI_SUBAGENT_ORCHESTRATOR_TARGET`/`_SESSION_ID`, `PI_SUBAGENT_SUPERVISOR_CHANNEL_DIR`; package-wide plural `PI_SUBAGENTS_*` (`LLM_INTENT_ARBITER`, `WORKTREE_DIR`, `MAX_HASH_FILE_BYTES`, `MAX_HASH_TOTAL_BYTES`, `MAX_HASH_ENTRIES`, `PI_CODING_AGENT_PACKAGE_ROOT`); plus `PI_INTERCOM_ASK_TIMEOUT_MS`. Naming convention observed: singular `PI_SUBAGENT_*` = per-run child identity, plural `PI_SUBAGENTS_*` = package settings. The proposed fork name `PI_FAST_MODE_W_SUBAGENT_SUPPORT` does not collide with any of these, and it follows the pi-gpt-fast-mode preference-var style (singular, purpose-described) rather than pi-subagents' package-prefix style. [SOURCE: ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-args.ts:76,106-111; runs/shared/subagent-prompt-runtime.ts:32; runs/shared/capability-ceiling.ts:5; runs/shared/worktree.ts:198; runs/shared/types.ts:2147-2193; shared/utils.ts:19; watchdog/change-signature.ts:23-31; runs/shared/llm-intent-arbiter.ts:20,229; intercom/native-supervisor-channel.ts:190]

## Questions Answered
- Subagent handoff mechanics (lane 2): spawn mechanism, env propagation contract, official env surface, PI_GPT_FAST_MODE strict-boolean semantics, session_start confirmation point, and the pi-subagents env namespace are all now evidenced.

## Questions Remaining
- [ ] 3. Env-var namespace hygiene: collision scan of PI_* vars across installed packages, git sources, and Public .pi; naming conventions; PI_FAST_MODE_W_SUBAGENT_SUPPORT fit (partially seeded by finding 6)
- [ ] 4. Config compatibility & migration: pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question
- [ ] 5. /fast command collision: duplicate command/flag registration behavior; safe install/remove ordering; verification method
- [ ] 6. Packaging & install mechanics: pi install local/git/npm; package.json pi.extensions; raw TypeScript; tsconfig; pi.dev/npm indexing; publish checklist
- [ ] 7. Testing patterns: upstream ExtensionAPI mocks; vitest setup for raw TypeScript; env-inheritance child-process tests; coverage expectations
- [ ] 8. Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation
- [ ] 9. TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject
- [ ] 10. Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key

## Ruled Out
- Reading `dist/` bundles instead of `src/` of pi-subagents (src is present and authoritative; dist would add noise).
- Searching npm registry metadata for pi-subagents spawn internals (installed source is the ground truth).

## Dead Ends
- None this iteration. No exhausted-approach category applies to lane 2 yet.

## Edge Cases
- Ambiguous input: none — orchestrator focus-map override resolved the reducer-next-focus conflict (Q5 vs lane 2) in favor of lane 2.
- Contradictory evidence: none found; upstream handoff.ts, README, and tests agree on strict `"1"`/`"0"` semantics.
- Missing dependencies: none — installed package source and official docs were both available locally.
- Partial success: none — all four research actions succeeded.

## Sources Consulted
- ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-spawn.ts:83-126 (spawn resolution)
- ~/.pi/agent/npm/node_modules/pi-subagents/src/extension/index.ts:796-807 (env inheritance contract), 869-871 (session_start)
- ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-args.ts:76,106-111 (marker envs)
- ~/.pi/agent/npm/node_modules/pi-subagents/src/watchdog/register-main.ts:411-414; watchdog/register-child.ts:89-92
- ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/subagent-prompt-runtime.ts:491-496
- ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/types.ts:2147-2193; shared/utils.ts:19; runs/shared/worktree.ts:198; runs/shared/llm-intent-arbiter.ts:20,229; watchdog/change-signature.ts:23-31; intercom/native-supervisor-channel.ts:190; runs/shared/capability-ceiling.ts:5; runs/shared/subagent-prompt-runtime.ts:32
- ~/.pi/agent/npm/node_modules/pi-subagents/package.json (v0.50.0, exports map)
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md:16-30, 81-90
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src/handoff.ts:1-19; src/types.ts:19; README.md:73,84; tests/state.test.ts:56-64; index.ts:175

## Assessment
- New information ratio: 1.0 (6 of 6 findings fully new; no prior packet evidence covered lane 2)
- Questions addressed: 1 (lane 2, subagent handoff mechanics)
- Questions answered: 1 (lane 2 complete)

## Reflection
- What worked and why: targeting the *installed* pi-subagents source (`~/.pi/agent/npm/node_modules/`) instead of hunting GitHub gave ground-truth mechanics with line-level anchors; the official `environment-variables.md` doc table settled the "official vs extension-invented" question in one read. The upstream handoff.ts + tests + README triple-confirmed the strict-boolean semantics, so no contradiction cleanup was needed.
- What did not work and why: nothing failed. The only near-miss was the reducer "Next Focus" (Q5) pointing away from the approved lane; the orchestrator override in the prompt pack resolved it before any research began.
- What I would do differently: for lane 3 (env-var hygiene), the inventory in finding 6 should be widened with a mechanical scan (`env | grep '^PI_'` + grep across Public .pi and git sources) rather than source-grep only.

## Next Focus
Lane 3: Env-var namespace hygiene — mechanical collision scan of PI_* vars; validate PI_FAST_MODE_W_SUBAGENT_SUPPORT fit.

## Recommended Next Focus
Lane 3: Env-var namespace hygiene — mechanical collision scan of PI_* vars across installed packages (`~/.pi/agent/npm/node_modules/*`, `~/.local/lib/node_modules/@earendil-works/*`), git sources, and Public `.pi` settings; validate the proposed `PI_FAST_MODE_W_SUBAGENT_SUPPORT` against the naming conventions documented here (official table vs singular/plural extension styles).

## SCOPE VIOLATIONS
None — no out-of-scope mutation was attempted or executed; all researched paths were read-only.
