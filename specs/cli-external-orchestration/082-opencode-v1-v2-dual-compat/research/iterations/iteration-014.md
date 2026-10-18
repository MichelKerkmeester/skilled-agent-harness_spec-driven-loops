# Iteration 014 — A12: shared service vs standalone, and env propagation to server-side plugins

## Focus

On v2, `run` attaches to one per-user background service unless `--standalone` is passed. This iteration asked what that means for the env the *plugins* see: whether `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0` and `OPENCODE_DB` set on a client reach the server-side plugin, who starts the service and with which env/database, and what happens when several `run` clients share it.

## Actions Taken

1. Read the v2 help surfaces: `v2-run-help.txt` (`--standalone  Run with a private server instead of the background service`; `--print-logs  ... server logs require --standalone`), `v2-service-help.txt` (subcommands `start|restart|status|stop|get|set|unset`) and `v2-help.txt` (global `--standalone` / `--server`; `service`, `api`, `plugin`, `reload` subcommands).
2. Built the A12 probe: a throwaway git repo at `scratch/a12-probe/` with an id-tagged probe plugin written into **all three** candidate layouts — `.opencode/plugins/*.js`, `.opencode/plugin/*.js`, `.opencode/plugin/<name>/index.js` — plus one copy reachable only through `opencode.json`'s `plugin` array. Each hook appends timestamp, hook name, plugin id, `process.pid`, `ppid`, `AI_SESSION_CHILD`, `OPENCODE_DB` and `process.cwd()` to `scratch/a12-probe/env.log`.
3. Ran the shared-service leg twice plus a concurrent pair, with `AI_SESSION_CHILD=1 OPENCODE_DB=scratch/a12-probe/probe2.db` on the **client**: `opencode2 api GET /api/plugin?location[directory]=<url-encoded probe dir>`.
4. Stopped the daemon (`opencode2 service stop`) and re-ran the same request so a **fresh** service had to be spawned by that client, then inspected the new daemon's env with `ps -wwE`.
5. Ran `api --standalone` with the same client env, and the v1 leg `opencode debug config` inside the probe directory (twice: with and without `opencode.json`).
6. No model calls were made. All probe output is under `scratch/a12-probe/`.

## Findings

**F1 (P0) — The hook entry point differs by version: v2 calls `setup()`, v1 calls `server()`.** Across six v2 project activations on 2.0.32 only `setup` appears in the log; `server` appears **only** in the v1 entries. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log] A definition exporting only one of the two is a silent no-op on the other host — which is the shape most of this repo's plugins have. A dual-host plugin must export both hooks and route both to one bootstrap, and must therefore treat the hook argument as optional.

**F2 (P0) — A client's env reaches v2 plugins only if that client won the race to spawn the daemon; otherwise the daemon's frozen env wins.** Two identical `api` requests, same client env, seconds apart:

| service pid | started by | plugin saw `AI_SESSION_CHILD` | `OPENCODE_DB` | cwd |
|---|---|---|---|---|
| 6927 | pre-existing daemon | `undefined` | `opencode-v2.db` | `$HOME` |
| 74912 | the probe client (after `service stop`) | `1` | `<probe>/probe2.db` | `$HOME` |

[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log] The daemon is reparented (`ppid=1`) and keeps the env snapshot it was born with for its whole life. So `AI_SESSION_CHILD=1 opencode2 run ...` is **not** a reliable signal: honoured on the first invocation after a `service stop`, silently dropped on every later one. Every plugin in this repo that branches on `AI_SESSION_CHILD` (spec gate, completion sentinel, deep-loop guard) is affected.

**F3 (P1) — `OPENCODE_DB` is read by both versions, but the on-disk formats are incompatible and the loser dies fatally.** Pointing v1 1.19.3 at a database the v2 service had already created produced `Error: Unexpected error / Database is not empty and has no session table` and exit 1, before any plugin loaded. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/c1.json] One `export OPENCODE_DB` shared by a v1 and a v2 invocation is a hard breakage, not a nuance.

**F4 (P1) — `api --standalone` does not load the project plugin tree at all.** The same request against the shared service loaded all four plugin files; with `--standalone` no hook fired and `/api/plugin` returned `{"data":[]}`. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/b1.json] On v2 plugin loading is bound to **project activation inside the service**, not to the request handler. Whatever isolates env on v2 must therefore be tested with `run`, not with `api`.

**F5 (P1) — v2 discovers all three local layouts, and activation is not request-scoped.** Four plugin files produced four `setup` calls in one activation: `.opencode/plugins/*.js` flat, `.opencode/plugin/*.js` flat, `.../plugin/<name>/index.js`, and the `opencode.json`-referenced file. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log] The carried P0 "does v2 load flat `.opencode/plugins/*.js`" is **yes** — the nested plugin tree needs no migration on layout grounds. Conversely, three sequential and two concurrent client calls produced **no** further `setup` lines: plugins load once per project activation, not per request.

**F6 (P1) — v2 honours `plugin` (singular) in `opencode.json`.** The only reference to `envprobe-alt.js` was `{"plugin":["./.opencode/plugins/envprobe-alt.js"]}`, and its `setup` fired. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/opencode.json] The v1 half of the key question stays open: both v1 legs died on F3's database error before loading, and the earlier v1 leg fired two un-id-tagged `server` hooks for four candidate files.

**F7 (P2) — Plugin process identity diverges, so in-memory plugin state does.** On v1 the plugin ran in a child of the CLI process (`ppid=68027`, the `opencode` invocation) and inherited that invocation's env (`AI_SESSION_CHILD=1`, the client's `OPENCODE_DB`). On v2 it runs inside the long-lived daemon (`ppid=1`), shared by every concurrent client. Any plugin holding counters, locks or caches (`system-deep-loop-guard`, `system-completion-sentinel`) is per-invocation on v1 and cross-client-global on v2. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log]

**F8 (P2) — There is no per-invocation env contract on v2.** `opencode2 service get` returns `{}`; the only stored service field is a password in `~/.config/opencode/service.json` — no env, no database. The only two levers over a v2 child's server env are *who spawns the daemon* and `--standalone`.

**Recommended dispatch mode for deep-loop children on v2:** `opencode2 run --standalone` for every child, with `OPENCODE_DB` left unset (or version-scoped) and `AI_SESSION_CHILD` treated as advisory only. Rationale: `--standalone` is the only mode where the child's env is unambiguous, and the only mode whose server logs are retrievable (`--print-logs ... server logs require --standalone`). The untested edge is stated next rather than glossed.

## Questions Answered

- Carried P0 "does v2 load **flat** `.opencode/plugins/*.js`, or only per-plugin directories?" → **flat works**, and all three layouts load concurrently (F5).
- Carried "who starts the service, and with which env and database?" → the first client that needs it, with that client's env snapshot, and never again (F2, F8).
- Carried "what happens when several clients share it?" → one process, one plugin instance, one env; plugin state is shared across clients (F2, F7).
- Carried "does `OPENCODE_DB` reach the plugin?" → yes, but frozen at daemon spawn, and the two versions' formats collide (F2, F3).
- Contribution to strategy key question 1 ("where must they diverge?"): the plugin **entry hook** is a mandatory divergence point (F1); the **plugin directory layout** is not (F5); the **config key** is `plugin` singular on v2 (F6).

## Questions Remaining

- **New (P0):** does `run --standalone` on v2 load the project plugin tree? `api --standalone` did not (F4), so the recommended dispatch mode rests on an untested assumption. Requires one live `run` with a trivial prompt.
- **New (P0):** under `run` against an already-running daemon, which env do plugins see — the daemon's or the client's? F2 answers this for `api`; `run` should match but was not probed.
- **New (P1):** can the client env be re-injected per request instead (an `/api` body field, `service set`, or project-local config)? If not, every `AI_SESSION_CHILD`-based rule is unusable on v2 without `--standalone`.
- **New (P1):** v1's local plugin discovery with id-tagged files — the v1 legs died on F3 before load, so "which two of the four layouts v1 picked" is still unknown. Cheap test: re-run in the probe dir with `OPENCODE_DB` unset.
- **New (P2):** does either version dedupe a plugin file referenced twice (directory discovery **plus** `plugin` array entry)? F5 shows distinct ids both loading; same-id dedupe was not tested.
- Carried and untouched: `plugins` (plural) tolerance on v1; `sk-vision.js` symlink following; `run --format json` schema; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1; v2 positional directory for `run`; `--dangerously-skip-permissions`; `models` positional provider; `#`-in-model shell safety; skill permission key / root precedence / `disable-model-invocation` / `allowed-tools` / `node_modules` leak; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`.

## Next Focus

A13: the dual-host plugin template itself — one module exporting `{id, setup, server}` where `setup` and `server` both call one bootstrap, import-free so it survives a v2-only install with no `.opencode/package.json` resolution. Verify it in the probe dir on both hosts with `OPENCODE_DB` unset, and check that an extra top-level key survives `plugin.check`.

## SCOPE VIOLATIONS

None. All probe writes are confined to `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/`, which the iteration focus authorizes and which was `git init`-ed for isolation. One process-level side effect was repaired rather than left behind: the probe's `service stop` / `service start` cycle left a daemon carrying `AI_SESSION_CHILD=1` and a probe `OPENCODE_DB`; it was stopped and restarted with both variables unset (clean service pid 94242, zero `AI_SESSION_CHILD` entries in its environment).

## Sources

- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log`
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/opencode.json`
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/b1.json`
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/c1.json`
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt`
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-service-help.txt`
