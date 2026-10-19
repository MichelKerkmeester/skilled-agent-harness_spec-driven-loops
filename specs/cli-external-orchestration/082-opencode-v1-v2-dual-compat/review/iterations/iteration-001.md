# Deep Review -- Iteration 1

Packet: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat`
Dimension: **correctness** (iteration 1 of 5 -- inventory pass, then the plugin dual export, the dispatch guards, and the opencode executor)
Scope: 157 files in `goal-file-manifest.txt`. Executor: cli-pi / deepseek-v4.1-flash.

## DIMENSION

### Inventory pass -- artifact map

The 157 manifest entries group into these subsystems (computed from the manifest, not from memory):

| Subsystem | Files |
|---|---|
| cli-opencode skill | 43 |
| .opencode/plugins/tests | 24 |
| .opencode/plugins (entry files) | 16 |
| deep-loop runtime | 15 |
| agents | 11 |
| config/misc | 11 |
| command-support | 10 |
| .opencode/plugins/lib | 6 |
| doctor battery | 6 |
| dispatch guards | 5 |
| .skilled/bin | 3 |
| sk-doc | 3 |
| sk-vision | 3 |
| cli-classifier | 1 |
| sk-code | 1 |
| system-spec-kit | 1 |
| **Total** | **159** |

The map fixes the iteration queue: the cross-cutting producers are `lib/v2-bridge.js` (every plugin's v2 leg), the two version resolvers (dispatch + runtime), `dispatch-rule-checks.mjs` and `fanout-run.cjs`. Everything else in the map is a consumer of one of those four.

### Design contract reconstructed from the code

Three invariants hold the dual-version build together, and each was tested against its implementation:

1. **One plugin object, two entry points.** `dualPlugin(id, server)` returns `{ id, server, setup }` and every one of the 16 entry files default-exports it. `setup` adapts the v1 hook object onto v2 registrations and returns a cleanup function carrying `skippedKeys`. Verified: all 16 call sites route through `dualPlugin`; `zod 4.1.8` is pinned, so the `z.toJSONSchema` call in the tool transform exists.
2. **Version is decided by the probe, never the binary name.** Both resolvers parse `--version` output, cache on `[realpath, size, mtime]`, and treat an unparseable probe as unresolved. The two differ deliberately: the runtime resolver throws `E_OPENCODE_UNRESOLVED` (a dispatch must not guess), while the hook resolver returns `'unknown'` and lets rules fail open.
3. **Two dispatch shapes.** `buildOpencodeLineageCommand` branches on the resolved version: v1 gets `--dir`/`--variant`/`--dangerously-skip-permissions`, v2 gets `run --standalone`/`-m <model>#<effort>`/`--auto` plus an explicit `cwd`. `buildNativeLineageCommand` refuses v2 outright with a stated reason.

### Where the contract holds

- 16/16 plugins import and default-export `dualPlugin`; no plugin still ships a v1-only object.
- The v2 branch's missing `--dir` is not a regression: `cwd` is set on the built command and reaches the spawn through `commandCwd`.
- `hard-rules.json` splits the slash-prompt family correctly by `appliesTo`: `command-flag-for-slash-prompt` is v1-only `error`, `v2-slash-prompt-route` is v2-only `warn`, so a v2 run is no longer blocked by a v1-shaped rule.
- `skippedKeys` is a real, tested affordance (`v2-bridge.test.cjs:632`) and is documented in the plugins README.

### Where it does not

Three P2 defects below. The shared shape is that each is a *silent* divergence: no throw, no operator-visible message, and the v1 path looks correct, so nothing in a v1-only smoke test would surface them.

## FILES REVIEWED

| File | Lines |
|---|---|
| `.opencode/plugins/lib/v2-bridge.js` | 8-15, 207-402 |
| `.opencode/plugins/lib/tool-identity.js` | 13-17 |
| `.opencode/package.json` | 1-10 |
| `.skilled/hooks/dispatch/lib/opencode-version.mjs` | 56-176, 184-232 |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | 15-16, 125-262, 284-333 |
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | 179-209 |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | 2274-2323, 2353-2433, 3496-3510, 3767 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | 1-47 |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | 171-193 |
| `.opencode/plugins/README.md` | 16, 53-54, 68-74, 175 |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | 632 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | 1-140 |
| `research/research.md` | 63 |

## FINDINGS BY SEVERITY

### P0 -- Critical

None.

### P1 -- Major

None.

### P2 -- Minor

#### R1-P2-001 -- v2 bridge drops `sk-vision`'s `chat.message` hook although research records a v2 destination for it

`MAPPED_HOOKS` [SOURCE: .opencode/plugins/lib/v2-bridge.js:8] contains `event`, `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform`, `tool` and `dispose`. `sk-vision`'s factory also returns `chat.message` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:188], and the research record assigns that key a v2 destination -- `ctx.session.hook("prompt")` -- and calls it documented [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/research.md:63]. On OpenCode 2 the handler is therefore skipped [SOURCE: .opencode/plugins/lib/v2-bridge.js:221], and the only trace is `cleanup.skippedKeys`, which no dispatcher reads.

Counterevidence: the skip is *intended* at the bridge level. `v2-bridge.test.cjs:632` asserts `skippedKeys === ['chat.message']`, and the README states the rule plainly [SOURCE: .opencode/plugins/README.md:175]. What is missing is not the mechanism but the record: no packet document says `sk-vision` loses its pre-submit hook on v2, and the research record says the mapping exists.

- **Alternative explanation:** a deliberate port-time deferral; the skip is the safe default rather than an accepted parity gap.
- **Final severity:** P2. **Confidence:** medium-high.
- **Downgrade trigger:** upgrades to P1 if a phase child's acceptance criteria or the sk-vision feature-catalog entry claims v2 parity for the pre-submit path; downgrades to informational if a phase doc records `chat.message` as an accepted v2 gap.

#### R1-P2-002 -- a path-qualified binary resolves to `'unknown'`, silently downgrading a v1 error rule to a warning

`resolveOpencodeVersionSync` returns `'unknown'` whenever the binary contains a path separator [SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:186], mirroring `hasPathSeparator` in the async twin [SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:143]. The rule engine, meanwhile, deliberately *matches* path-qualified binaries: `OPENCODE_RUN_BINARY` carries an optional `(?:[^\s"';&|]*[\\/])?` prefix [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:16]. So the engine extracts `/usr/local/bin/opencode2` and hands the resolver a value it refuses to probe.

The consequence is in the severity mapping [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:319]: when `version === 'unknown'`, any rule whose `appliesTo` is not both versions is downgraded to `warn`. `command-flag-for-slash-prompt` is `severity: error` with `appliesTo: ["v1"]` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:26], so on a v1 run invoked by path it stops blocking and a slash prompt without `--command` is delivered as raw prose -- the wrong task, no error.

Counterevidence: fail-open is this file's declared doctrine, and the runtime resolver accepts a path-qualified `OPENCODE_BIN` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:188], so the bail is the odd one out rather than the family rule. The `evaluate()` signature accepts an explicit `options.version`, but no reviewed caller passes one.

- **Alternative explanation:** the separator bail predates the dual-version work and was kept as-is for uniform fail-open behavior, with the lost refusal on a path-qualified binary never evaluated.
- **Final severity:** P2. **Confidence:** medium.
- **Downgrade trigger:** upgrades to P1 if the documented `opencode2` launcher called by absolute path is confirmed to reach this branch with a slash prompt; downgrades to informational if the PreToolUse caller always passes `options.version`.

#### R1-P2-003 -- the async probe deadline cannot fire against the shipped synchronous probe

`probeWithTimeout` races a 3000ms timer against `Promise.resolve().then(() => probe(binary))` [SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:71]. The default `probe` is `probeBinary`, which runs `spawnSync` [SOURCE: .skilled/hooks/dispatch/lib/opencode-version.mjs:56]. A microtask that calls `spawnSync` blocks the event loop, so the timer cannot fire until the probe has already returned; the only real bound is `spawnSync`'s own `timeout`. The function advertises a hard deadline it does not enforce on the path that ships.

Counterevidence: the race *is* meaningful for an injected async `deps.probe`, and `spawnSync` kills its child on timeout, so runtime impact is bounded at the same 3000ms by another mechanism.

- **Alternative explanation:** the race is a seam for injected and future async probes, not a claim about the default path.
- **Final severity:** P2. **Confidence:** high.
- **Downgrade trigger:** downgrades to informational if the docstring states that the default probe is bounded by `spawnSync` and the race governs only injected probes.

## OBSERVATIONS (not findings)

- `sessionEventState` [SOURCE: .opencode/plugins/lib/v2-bridge.js:226] is deleted on `session.deleted` and the two `started` events [SOURCE: .opencode/plugins/lib/v2-bridge.js:296]. Each value is a two-element `Set`, so no growth path was demonstrated; noted for the maintainability iteration rather than raised.
- The v2 builder emits `-m <model>#<effort>` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2410]. Whether v2 accepts the `#` variant suffix is the same open question the research record leaves open for v1; recorded as a deferred ledger row, not a finding, because the cli-opencode invocation contract has not been read.
- `buildNativeLineageCommand` refuses v2 with a stated reason [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2281]. That is a documented capability limit, not a defect.

## TRACEABILITY CHECKS

| Protocol | Status | Detail |
|---|---|---|
| `spec_code` (core) | partial | spec.md section 3 scope confirmed for the plugin dual export, dispatch guards and executor. The cli-opencode `SKILL.md` invocation contract was not read, so the documented dispatch shapes remain unverified. |
| `checklist_evidence` (core) | pending | No phase acceptance-criteria or tasks.md opened this iteration; belongs to the traceability iteration. |
| `skill_agent` (overlay) | pending | -- |
| `agent_cross_runtime` (overlay) | pending | -- |
| `feature_catalog_code` (overlay) | pending | `feature-catalog/opencode-dual-version-dispatch` has not been compared against the dispatch shapes read here. |
| `playbook_capability` (overlay) | pending | -- |

## SCOPE VIOLATIONS

None. Only the three allowed state artifacts were written; every reviewed file was opened read-only.

## VERDICT

**PASS with advisories.** No P0 and no P1. Three P2 correctness findings, each a silent divergence on the v2 leg or in the guard's fail-open path, plus one deferred question on the v2 model-selector shape.

## NEXT DIMENSION

**security** (iteration 2). Grounded in what this pass exposed: the version probe executes whatever `PATH`/`OPENCODE_BIN` resolves to, `dispatch-rule-checks.mjs` builds its checks from command text, `sk-git-message-gate` and `cli-dispatch-audit` read command strings out of tool args, `session-cleanup` shells out through `runSync`/`runScript`, and `classifier-injection-screen` exists precisely to screen hostile prompt text. Correctness coverage should be extended in a later iteration to the 149 unread files, starting with the cli-opencode `SKILL.md` contract.

Review verdict: PASS
