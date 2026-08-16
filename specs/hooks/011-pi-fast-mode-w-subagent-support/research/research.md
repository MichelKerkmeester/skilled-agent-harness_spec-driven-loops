# Research Synthesis: pi-fast-mode-w-subagent-support

## 1. Executive Decision

Fork `pi-openai-fast-mode` as the implementation base, preserve its target/config semantics, and add a deliberately small child-process handoff layer modeled on `pi-gpt-fast-mode`. The fork should remain a normal Pi extension package rather than becoming a new orchestration framework.

The implementation contract is:

- Treat `before_provider_request` as a replace-style hook. Return a cloned payload when adding `service_tier`; return `undefined` when no change is needed. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:678-705`; `context/pi-openai-fast-mode/src/payload.ts:45-70`]
- Rehydrate state on `session_start`, refresh the indicator on `model_select`, and release session-local resources on `session_shutdown`. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:281-347,392-432,713-736`]
- Export the preference through a fork-owned environment variable with strict values `1` and `0`; read it in child sessions but never let a child overwrite the parent-owned handoff value. [SOURCE: `context/pi-gpt-fast-mode/src/handoff.ts:1-19`; `~/.pi/agent/npm/node_modules/pi-subagents/src/extension/index.ts:796-807`]
- Keep the `pi-openai-fast-mode` `{enabled, targets}` config shape and implement an explicit legacy-path migration before writing the fork's new config path. Do not silently orphan existing user configuration. [SOURCE: `context/pi-openai-fast-mode/src/config.ts:6-55,92-104,108-153`]
- Use a namespaced `setStatus` entry as the default indicator. Do not use `setFooter` as the primary path because it is exclusive in TUI mode and a no-op in RPC mode, which is the important subagent scenario. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:2556-2595`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1162-1173`]
- Adopt TBG's explicit-tier guard, model guard, atomic state writes, invalid-state-safe reads, and pure model-gate testing pattern. Do not copy TBG's GPT-5.6 regex verbatim or make its footer wrapper the default. [SOURCE: `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:29-149,196-208`; `context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:24-38,196-212`]
- Ship raw TypeScript with a `pi.extensions` manifest, peer dependencies for Pi core packages, a no-emit typecheck, and package metadata that supports Pi gallery discovery. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:23-222`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:2,14,358,368,468,491-492`]

This is an implementation-ready research result, not an implementation or a publication decision. The phase children remain the execution authority.

## 2. Research Objective and Boundaries

The run investigated everything needed to implement the fork correctly: Pi extension APIs, child-process environment inheritance, namespace hygiene, configuration compatibility, command collisions, packaging, tests, indicator behavior under custom footers, TBG edge cases, and licensing/maintenance.

The packet was `specs/hooks/011-pi-fast-mode-w-subagent-support/research/`. The approved queue had ten lanes and the run completed exactly ten iterations under `stopPolicy: max-iterations`. Convergence remained report-only; all ten lanes were dispatched even when the graph guard reported `STOP_BLOCKED`.

Research did not modify implementation files or the pinned source snapshots. Each leaf wrote only its iteration narrative, canonical state append, and per-iteration delta. The final synthesis is the workflow-level output.

## 3. Method and Evidence Provenance

The evidence base combined three pinned context snapshots with the installed Pi runtime and installed extensions:

- `context/pi-openai-fast-mode/` — fork base, pinned as commit `9b28456` / v0.3.0.
- `context/pi-gpt-fast-mode/` — handoff reference, pinned as commit `2ac61e0`.
- `context/pi-fast-mode/` — TBG UX and defensive-programming reference, pinned as commit `e2827b6`.
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/` and `dist/` — Pi API, package, RPC, loader, and runtime authority.
- `~/.pi/agent/npm/node_modules/pi-subagents/` and `pi-statusline/` — installed handoff and UI behavior.
- `001-fork-and-package/`, `002-subagent-handoff/`, and `003-integration-and-tests/` — the packet's phase contracts and acceptance gates.

The ten iteration narratives preserve the detailed action logs and citations. The state log contains ten canonical `type: "iteration"` records with route proof. The memory daemon was unavailable during setup, so direct packet context and installed sources were used instead of inventing external context. [SOURCE: `research/iterations/iteration-001.md` through `iteration-010.md`; `research/deep-research-config.json`; `context/README.md:3-12`]

## 4. Extension API and Lifecycle Contract

### Provider request mutation

`before_provider_request` handlers execute in extension load order. Returning `undefined` preserves the current payload. Returning another value replaces the payload for later handlers and for the request. The fork must therefore return `{ ...payload, service_tier }`, never a partial object and never an in-place-only mutation. Payload rewrites are not reflected by `ctx.getSystemPrompt()`. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:655-705`; `context/pi-openai-fast-mode/src/payload.ts:45-56`]

The fast-mode predicate should additionally verify the request record and `payload.model` before applying a tier. This prevents a parent extension from stamping a preference onto a parallel or child request for a different model. [SOURCE: `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:196-208`]

### Session lifecycle

Pi starts an extension instance, emits `session_start`, discovers resources, and then serves requests. Session changes shut down the old instance before rebinding and starting the new one. `model_select` reports the new model, previous model, and source (`set`, `cycle`, or `restore`). The fork should load config and handoff state during `session_start`, refresh the status entry during `model_select`, and clear or release session-local state during `session_shutdown`. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:281-347,392-432,507-512,713-736`]

### Commands, flags, and UI

The inherited extension registers both `fast` command and `fast` flag. Command and flag registries are separate, so the extension does not collide with itself. Duplicate command and flag behavior across extensions is covered in Section 8. [SOURCE: `context/pi-openai-fast-mode/src/index.ts:85-115`]

`ctx.hasUI` is true in TUI and RPC modes and false in print and JSON modes. Guard interactive methods and fire-and-forget UI updates appropriately. `setStatus(key, text)` is a persistent per-key footer status. `setWidget(key, content, options)` renders above or below the editor. A component widget owns `render(width)` and `invalidate()`, so it is the richer but more invasive surface. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:150-170,940-968`; `context/pi-openai-fast-mode/src/status.ts:24-55`]

The upstream factory pattern is directly reusable: create a factory, register hooks at load, resolve config for the current context, return an unchanged payload when the model is unsupported, and update a stable status key. [SOURCE: `context/pi-openai-fast-mode/src/index.ts:40-58`; `context/pi-openai-fast-mode/src/payload.ts:57-70`]

## 5. Subagent Handoff Mechanics

### Child process resolution and inheritance

`pi-subagents` resolves a child Pi command in this order: `PI_SUBAGENT_PI_BINARY`, the current standalone `pi` executable, a resolved `@earendil-works/pi-coding-agent` CLI launched through Node, and finally a bare `pi` on `PATH`. Spawn callers pass the parent's environment, so ordinary Node child-process inheritance carries the handoff variable. [SOURCE: `~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-spawn.ts:83-126`; `~/.pi/agent/npm/node_modules/pi-subagents/inspectors/herdr/client.ts:43-51`]

The parent-only contract is explicit: the root writes `PI_SUBAGENT_PARENT_SESSION` only when the `PI_SUBAGENT_CHILD` marker is absent. Children inherit the value at spawn time and must not replace it with their own identity. The fork should follow the same one-writer/readers pattern. [SOURCE: `~/.pi/agent/npm/node_modules/pi-subagents/src/extension/index.ts:796-807`; `src/runs/shared/pi-args.ts:106-111`]

### Handoff values and timing

The `pi-gpt-fast-mode` handoff parser accepts only `"1"` and `"0"`; unset or invalid values produce `undefined` rather than guessing. Toggle or flag code writes the normalized value to the current process environment. A child confirms the inherited value during `session_start`, then applies it only if the active model is supported/configured. [SOURCE: `context/pi-gpt-fast-mode/src/handoff.ts:1-19`; `context/pi-gpt-fast-mode/tests/state.test.ts:56-64`; `context/pi-gpt-fast-mode/README.md:73,84`]

The fork's approved variable is `PI_FAST_MODE_W_SUBAGENT_SUPPORT`. It should document strict `1`/`0` semantics, treat invalid input as no opinion, and distinguish parent writes from child reads with the existing `PI_SUBAGENT_CHILD` convention. The exact name is long but collision-free and follows the `PI_<COMPONENT>_<CONFIG>` family.

## 6. Namespace Contract

A code-level inventory across installed packages found approximately 25 distinct `PI_*` variables. The occupied families include `PI_SUBAGENT_*`, `PI_SUBAGENTS_*`, `PI_INTERCOM_*`, `PI_BLACKHOLE_*`, `PI_WEB_ACCESS_*`, and official core/session variables such as `PI_OFFLINE`, `PI_CODING_AGENT_DIR`, `PI_PROVIDER`, and `PI_MODEL`. No installed package, pinned source snapshot, or user `.pi` configuration surface contained `PI_FAST_MODE*`, `PI_OPENAI_FAST*`, or `PI_GPT_FAST*`. [SOURCE: `research/iterations/iteration-003.md`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md:16-30,81-90`]

The namespace recommendation is:

- Keep `PI_FAST_MODE_W_SUBAGENT_SUPPORT` as the fork-owned handoff key unless implementation ergonomics favor the shorter documented alias `PI_FAST_MODE_SUBAGENT_HANDOFF`.
- Use one stable name in code, README, and tests. Do not support the stale `PI_OPENAI_FAST_DESIRED` comment as an implicit alias. The live lineage is `PI_OPENAI_FAST_DESIRED` → `PI_GPT_FAST_MODE`; the openai snapshot itself has no handoff variable. [SOURCE: `context/pi-gpt-fast-mode/src/types.ts:19`; `context/pi-gpt-fast-mode/src/handoff.ts:3`; `context/pi-openai-fast-mode/` scan]
- Parse only `1` and `0`. Invalid values must not unexpectedly enable a paid priority tier.

## 7. Config Compatibility and Migration

The fork should retain the `pi-openai-fast-mode` config schema:

```json
{
  "enabled": true,
  "targets": [
    { "provider": "openai-codex", "model": "gpt-5.6-luna", "serviceTier": "priority" }
  ]
}
```

Normalization is field-aware and preserves an explicit empty target array as an opt-out. The upstream target set contains twelve OpenAI/OpenAI-Codex GPT-5.4–5.6 targets. `syncSupportedTargets` preserves the enabled value, refreshes targets, and writes the synchronized config during load. [SOURCE: `context/pi-openai-fast-mode/src/config.ts:6-55,92-98,108-153`; `context/pi-openai-fast-mode/src/index.ts:52-62`; `context/pi-openai-fast-mode/tests/config.test.ts:77-83`]

`pi-gpt-fast-mode` is not a schema to copy. It uses `{persist, desired, tier, models, indicator}` and four default provider/model keys: `openai/gpt-5.4`, `openai/gpt-5.5`, `openai-codex/gpt-5.4`, and `openai-codex/gpt-5.5`. TBG has no comparable config surface; it persists only `{enabled}` in a state file. [SOURCE: `context/pi-gpt-fast-mode/src/types.ts:29-35,60-88`; `context/pi-gpt-fast-mode/src/config.ts:5-9,76-98`; `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:23-27`]

All reference implementations resolve one effective path rather than merging user and project configs. The fork should not introduce dual-read semantics. It should, however, avoid orphaning existing `pi-openai-fast-mode` users:

1. Resolve the fork's new path.
2. If it is absent, look for the legacy `pi-openai-fast-mode` path.
3. Normalize and write the migrated data to the new path using atomic replacement.
4. Keep the legacy file untouched or mark migration completion explicitly.
5. Make the migration behavior and project-local write scope testable.

A project-local `pi-openai-fast-mode` install has a notable path quirk: it selects the project path even when the file does not yet exist. Preserve or intentionally correct this behavior in the fork and document the choice. [SOURCE: `context/pi-openai-fast-mode/src/config.ts:95-104,127-152`; `research/iterations/iteration-004.md`]

## 8. Command and Flag Collision

The fork inherits `registerCommand("fast", ...)` and `registerFlag("fast", ...)`. The command collision surface is three-way when `pi-openai-fast-mode`, TBG `pi-fast-mode`, and the fork are installed together; `pi-gpt-fast-mode` does not register the command. Pi keeps duplicate commands and assigns numeric suffixes in load order. The first-loaded extension owns bare `/fast`; later registrations become `/fast:1`, `/fast:2`. [SOURCE: `context/pi-openai-fast-mode/src/index.ts:94-100`; `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:161`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:1498-1503`; `dist/core/extensions/loader.js:223,430-450`]

Flag registration uses a per-extension map but seeds a shared global flag value only if the name is absent. Duplicate `fast` flags therefore do not crash, but the first-loaded default wins. Each extension can read the flag only if it registered it. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:234-239,250-255`]

The safe transition is to remove `pi-gpt-fast-mode` and ensure the fork is loaded before any legacy `fast` command extension. After install, query `pi.getCommands()` or RPC `get_commands`, filter extension entries, and assert both the expected source path and the bare-command ownership. Suffix renumbering after removing an earlier extension is inferred from load-order resolution and must be covered by a live integration probe. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md` getCommands section; `research/iterations/iteration-005.md`]

## 9. Packaging and Installation

Pi accepts npm specs, git refs, URLs, and local paths. `-l` scopes installation to project settings; `-e` performs a temporary current-run install. User npm/git packages live under `~/.pi/agent/`; project packages live under `.pi/`. Git refs and versioned npm specs are pinned, and `pi update --extensions` reconciles them without changing the pin. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:23-104`]

The package must declare a `pi.extensions` entry in `package.json`, with paths relative to the package root. Pi loads raw `.ts` entries through jiti and falls back to conventional `extensions/` directories only when no manifest is present. The fork should publish its source and use a typecheck-only `tsconfig.json` (`noEmit`, strict, bundler resolution, isolated modules), not a compiled `dist/`. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:106-135`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js:2,14,358,368,468,491-492`; `context/pi-openai-fast-mode/tsconfig.json`]

Core Pi packages belong in `peerDependencies: {"*"}` and must not be bundled. Runtime third-party dependencies belong in `dependencies` because installed extensions use production installs; other Pi packages need the documented bundled dependency treatment. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:150,169-186`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:150`]

The publish/install checklist is:

- `type: module`, raw source in `files`, README, and an explicit LICENSE entry.
- `pi-package` and `pi-extension` keywords; optional `pi.image` preview.
- `publishConfig.access: public` for a scoped package.
- `typecheck`, test, and check scripts.
- Local install smoke test, `pi list`, `pi -e`, npm install verification, and pinned git install verification.
- CI with `GIT_TERMINAL_PROMPT=0` for non-interactive git failures.

These are grounded in the installed package documentation and the three shipped manifests, not registry metadata. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md:23-222`; `context/pi-openai-fast-mode/package.json`; `context/pi-gpt-fast-mode/package.json`; `context/pi-fast-mode/package.json`]

## 10. Testing Strategy

Use a layered test suite:

1. **Structural extension fake.** Mirror `pi-openai-fast-mode`'s `FakePi`: spy on registration methods, capture handlers in maps, fabricate context with cwd/model, and invoke handlers directly. Do not mock the entire Pi module. [SOURCE: `context/pi-openai-fast-mode/tests/extension.test.ts:13-70`]
2. **Pure state/model tests.** Mirror TBG's type-only `ExtensionAPI` import, temporary agent directories, strict model-gate tables, and state read/write tests. [SOURCE: `context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:9-34,150-176,196-212`]
3. **Raw-TS Vitest gate.** Run Vitest directly against `.ts` sources and add `tsc --noEmit`. Upstream packages do not ship a `vitest.config.*`; the phase contract already mandates an extended Vitest suite. [SOURCE: `context/pi-openai-fast-mode/package.json`; `context/pi-fast-mode/package.json`; `001-fork-and-package/plan.md:142-143`; `003-integration-and-tests/spec.md:75`]
4. **Handoff process test.** Add a child fixture launched with `spawnSync(process.execPath, [fixture], {env: {...process.env, PI_FAST_MODE_W_SUBAGENT_SUPPORT: "1"}})` and assert the child observes the value. Separately test the actual spawn site so it does not replace `process.env` with a fresh environment. This is new authoring: none of the upstream suites contains a child-process test. [INFERENCE: `research/iterations/iteration-007.md`; Node child-process inheritance semantics]
5. **Integration smoke tests.** Exercise config scope resolution, legacy migration, model selection, `/fast` command ownership, RPC/TUI status behavior, `get_commands`, and install/remove ordering. A live `pi -e` and `get_commands` probe remains necessary because documentation alone cannot prove suffix renumbering or runtime footer rendering.

No upstream or phase contract requires a coverage percentage. The authoritative gate is green unit/integration suites, `tsc --noEmit`, and live-session verification. Coverage reporting may be added as observability, not as an invented blocker. [SOURCE: `context/pi-fast-mode/package.json`; `003-integration-and-tests/plan.md:49,142-143`; `003-integration-and-tests/spec.md:75`]

## 11. Indicator UX and Footer Interoperability

`pi-statusline` demonstrates two mutually exclusive modes. Its default installs a custom `setFooter` renderer and owns ANSI-aware width/truncation. Its widget mode clears the footer and uses `setWidget` above or below the editor. [SOURCE: `~/.pi/agent/npm/node_modules/pi-statusline/src/ui.ts:1-91`]

Pi documents `setFooter` as replacing the built-in footer entirely, while `setStatus` adds a persistent per-key entry. A custom footer therefore displaces other extensions' status entries. In RPC mode, `setFooter` and related footer methods are no-ops; `setStatus` and `setWidget` are request-based methods that a client can display or ignore. [SOURCE: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:2556-2595`; `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1157-1173,1264-1293`]

The fork's primary indicator should therefore be `ctx.ui.setStatus("pi-fast-mode-w-subagent-support", text)` with a clear operation when unsupported/disabled. It composes with custom footers when the built-in footer is active and remains available to RPC clients. A `setWidget` indicator can be an optional later mode for richer TUI display. The TBG footer-composition wrapper is a technically valid opt-in TUI pattern, but it owns the single footer slot and is silent in print/RPC contexts; it must not be the default. [INFERENCE: findings above; `research/iterations/iteration-008.md`; `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:66-149`]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Copy `pi-gpt-fast-mode`'s config schema and models array | Its `{persist, desired, tier, models, indicator}` schema is not structurally compatible with the openai fork's `{enabled, targets}` contract. | `context/pi-gpt-fast-mode/src/types.ts:29-35,60-88`; `context/pi-openai-fast-mode/src/config.ts:6-55` | 4 |
| Introduce unconditional dual user/project config reads | No reference implementation merges both scopes; it creates new precedence and migration ambiguity. | `context/pi-openai-fast-mode/src/config.ts:127-152`; `context/pi-gpt-fast-mode/src/config.ts:89-98` | 4 |
| Treat TBG as the config migration source | TBG persists only `{enabled}` and has no target/config schema. | `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:23-27,40-42` | 4 |
| Let the legacy config directory disappear during rename | It would orphan existing user preferences. | `research/iterations/iteration-004.md` | 4 |
| Make TBG's GPT-5.6 regex the fork's model gate | The fork's supported targets are config-driven and include provider/model pairs outside that exact regex. | `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:29-31`; `research/iterations/iteration-009.md` | 9 |
| Use `setFooter` as the default indicator | It is exclusive in TUI mode and a no-op in RPC mode, which defeats the subagent handoff use case. | `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:2590-2595`; `docs/rpc.md:1166-1173` | 8–9 |
| Make TBG's footer wrapper the default | It owns the single footer slot and its real-runtime rendering is not covered by its tests. | `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:66-149`; `research/iterations/iteration-009.md` | 9 |
| Add a mandatory coverage percentage gate | No upstream or phase contract defines one; it would be an invented acceptance criterion. | `context/pi-fast-mode/package.json`; `003-integration-and-tests/plan.md:142-143` | 7 |
| Search the npm registry for runtime implementation truth | Installed source/docs and pinned snapshots are the authoritative evidence for this task. | `research/iterations/iteration-002.md`, `iteration-006.md` | 2, 6 |
| Port tests from `pi-subagents` | The installed package contains no test suite to port. | `research/iterations/iteration-007.md` | 7 |

## Divergence Map

The research began with a reducer recommendation that could point at a different next question. The orchestrator's explicit ten-lane queue remained authoritative, so each iteration covered one distinct lane in order. No divergent pivot was required. The meaningful evidence boundaries are:

- **Engine vs handoff:** openai-fast-mode owns request/config behavior; gpt-fast-mode owns strict environment handoff. The fork combines the mechanisms without copying the divergent config schema.
- **TUI footer vs RPC/subagent UI:** setFooter works as an in-process TUI slot but is exclusive and remote-no-op. The robust shared contract is setStatus; TBG's wrapper remains optional.
- **Documented vs empirical behavior:** command suffixes, package loading, and RPC classifications are documented and source-backed; suffix renumbering after removal, live RPC rendering, live `pi -e`, and real footer rendering remain implementation-phase probes.
- **Research vs implementation:** all phase docs remain pending. The final frontier is empirical validation in phases 001–003, not another document-only research lane.

## 12. Open Questions and Residual Gaps

All ten research lanes are answered. The following are implementation decisions or empirical checks, not unanswered research topics:

- Whether the fork is published to npm or remains local/git installed, as already marked in the parent scope.
- Whether migration copies legacy config once or continues a legacy read fallback; choose and test one policy before coding.
- The final exact environment-variable spelling if the implementation chooses the shorter collision-free alias instead of the approved long name.
- Live verification of `/fast` suffix renumbering after removing an earlier extension.
- Live verification of `pi -e`, `pi list`, and `get_commands` in a clean install fixture.
- Live RPC/TUI indicator smoke tests, especially custom-footer coexistence and child-session visibility.
- The absence of a separate `THIRD_PARTY_NOTICES` file is resolved by retained MIT attribution; add a separate notice only if new dependencies create a need.

## 13. Implementation Handoff

### Phase 001 — fork and package

Copy the upstream source and MIT LICENSE unchanged, rename package identity, retain `{enabled, targets}`, add the `pi.extensions` manifest, use raw TypeScript and `noEmit`, keep core packages as peers, and add README provenance for `pi-openai-fast-mode` commit `9b28456`. Run typecheck and the unmodified upstream suite. [SOURCE: `001-fork-and-package/spec.md:128,143,160`; `001-fork-and-package/checklist.md:62,70,76`; `context/README.md:3-12`]

### Phase 002 — subagent handoff

Add one handoff module with strict `1`/`0` parsing and normalized writes. Write the variable on toggle/flag changes in the parent. Read it on `session_start` in a child, honor only supported/configured targets, and never overwrite parent-owned values. Define precedence between persisted config, explicit flag, and inherited handoff in the phase decision record. Add unit tests for unset/invalid/0/1 and child behavior. [SOURCE: `context/pi-gpt-fast-mode/src/handoff.ts:1-19`; `~/.pi/agent/npm/node_modules/pi-subagents/src/extension/index.ts:796-807`]

### Phase 003 — integration and tests

Extend the Vitest suite with fake API, config migration, child-process, `get_commands`, indicator, and install/remove tests. Replace `pi-gpt-fast-mode` in settings, verify the fork owns the intended bare command, update `.pi/PLUGINS.md` alphabetically, and follow `.pi/SYNC.md` (npm output is operator-local and not synced). Use a live Pi smoke test for the remaining runtime-only claims. [SOURCE: `003-integration-and-tests/plan.md:49,52,142-143`; `.pi/PLUGINS.md`; `.pi/SYNC.md`]

## 14. Verification Matrix

| Claim or behavior | Objective proof | Status after research |
|---|---|---|
| Payload replacement semantics | Unit test returned payload and unchanged `undefined` path | Source-backed; implement in phase 002/003 |
| Parent-to-child handoff | `spawnSync` fixture observes strict `1`/`0` value | Source-backed contract; live test still required |
| Config migration | Legacy-only fixture creates new path without data loss | Design required; not yet run |
| Command ownership | `get_commands` asserts extension source/path and bare `/fast` | Source-backed; live probe required |
| Package loading | `pi install ./path`, `pi -e`, `pi list`, raw `.ts` load | Docs/source-backed; smoke test required |
| TUI/RPC indicator | TUI custom-footer and RPC status requests | Docs/source-backed; live smoke test required |
| Defensive writes | Torn-write simulation and malformed JSON fallback | TBG source/test-backed; fork tests required |
| Licensing/provenance | LICENSE byte/content check and README commit reference | Phase checklist-backed; phase 001 gate |
| Final integration | `typecheck`, Vitest, install transition, sync checks | Pending implementation phases |

## 15. References

Primary sources are preserved in the iteration files. The most important direct references are:

- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/packages.md`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/runner.js`
- `~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-spawn.ts`
- `~/.pi/agent/npm/node_modules/pi-subagents/src/extension/index.ts`
- `~/.pi/agent/npm/node_modules/pi-statusline/src/ui.ts`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/context/README.md`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/`
- `specs/hooks/011-pi-fast-mode-w-subagent-support/research/iterations/iteration-001.md` through `iteration-010.md`

No `resource-map.md` is cited because the packet did not have a resource map at initialization.

## 16. Convergence Report

- **Stop reason:** `maxIterationsReached` after exactly 10 iterations. The configured `max-iterations` policy treated convergence as telemetry and did not stop early.
- **Questions answered:** 10 / 10 approved queue lanes.
- **Novelty ratios:** iteration 1 `1.00`, 2 `1.00`, 3 `0.83`, 4 `1.00`, 5 `0.92`, 6 `1.00`, 7 `1.00`, 8 `0.93`, 9 `0.93`, 10 `0.94`.
- **Convergence telemetry:** the graph guard reported `STOP_BLOCKED` with score `0.4` because the session graph's source-diversity and evidence-depth signals were not populated as the runtime expected. Under the explicit max-iterations policy this was report-only; it did not invalidate the ten verified iteration artifacts.
- **Research state:** reducer refresh completed after each iteration; graph nodes and edges were upserted; no state corruption was observed.
- **Residual frontier:** runtime probes and implementation-phase tests listed in Sections 12–14.

## 17. Execution Audit

The official command contract was read and the packet paths, prompt-pack template, verifier, reducer, convergence tool, and synthesis contract were followed. This Pi runtime could not invoke the OpenCode YAML runner directly because `cli-opencode` dispatch was denied for a plan that required native dispatch. The direct `deepseek/deepseek-v4-flash` provider also returned HTTP 402 (`Insufficient Balance`) on iteration 5. With explicit operator approval, iterations 5–10 used the enabled `opencode-go/deepseek-v4-flash` model route through native `deep-research` leaves; the model family remained `deepseek-v4-flash`.

This bounded runtime deviation is recorded for reproducibility. Every leaf used fresh context, did not dispatch sub-agents, and passed `verify-iteration.cjs`. The final artifacts are suitable for the next `/speckit:plan` / phase implementation step, subject to the live verification matrix above.

### Iteration artifact inventory

- `iterations/iteration-001.md` … `iterations/iteration-010.md`
- `deltas/iter-001.jsonl` … `deltas/iter-010.jsonl`
- `deep-research-state.jsonl`
- `deep-research-config.json`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `research.md`
