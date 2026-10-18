# Battery contract: `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`

CommonJS, Node built-ins only. `require.main === module` awaits `main(process.argv.slice(2))` and sets `process.exitCode` to its result. Everything below is exported for the tests.

## CLI

`node opencode-version-battery.cjs [--family=v1|v2|both] [--root=<dir>] [--json] [--out=<file>]`

- `--family` defaults to `both`. `--root` defaults to the repository root (four levels above the script folder). `--out` writes the JSON summary to that file; `--json` prints it on stdout instead of the human lines.
- Unknown argument, or a bad `--family` value: usage text on stderr, exit 2.
- `--out` path not writable: exit 2.

## Result shape

`{ leg, family, status, reason, details }`: `leg` is one of `family-present`, `plugin-discovered`, `plugin-load`, `plugin-active`, `skill-visible`; `family` is `v1` or `v2`; `status` is `PASS`, `FAIL`, `DEGRADED` or `SKIP`; `reason` is one line; `details` is an array of strings (file names, statuses, counts).

Exit code, worst first: a crash or usage error 2, any FAIL 1, any DEGRADED or SKIP 3, else 0.

JSON summary: `{ root, family, results: [...], exit }`.

## Exports

- `parseVersion(text)` -> `'v1' | 'v2' | 'unknown'`. Same answers as `parseOpencodeVersion` in `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` (first line that parses decides; `1.19.3 2.0.32` -> v1; `opencode v2.0.32\nWARN: x` -> v2; `1.19.3\r\n` -> v1; empty or garbage -> unknown). The battery keeps its own copy; it does not require that file.
- `parseArgs(argv)` -> `{ family, root, json, out }`, or throws an Error with `code === 'USAGE'`.
- `listPluginFiles(root)` -> sorted `[{ name, path, broken }]` for each top-level `*.js` in `<root>/.opencode/plugins` (symlinks included; `broken` is true when a symlink target is missing). Throws with `code === 'NO_PLUGIN_DIR'` when the folder is absent.
- `selectBinary(candidates, family)` -> `{ path, family } | null`. `candidates` is `[{ path, output, error }]`, already probed; a candidate with an `error` or an `unknown` parse is skipped, never assumed. The first candidate whose parsed family equals `family` wins.
- `legFamilyPresent(family, selected)` -> PASS when `selected` is non-null, else SKIP with reason `no <family> binary installed`.
- `legPluginDiscovered(files, debugConfig)` -> `debugConfig` is `{ exit, stdout }`. FAIL when `exit !== 0` or stdout has no parseable JSON object. Otherwise read `plugin_origins[].spec` (fall back to `plugin[]`) and FAIL naming every file whose `file://<path>` is not listed; FAIL when `files` is empty; FAIL naming every `broken` file; else PASS.
- `legPluginLoad(files, harness)` -> `harness` is `{ exit, stdout }`, one JSON line per plugin `{ name, v1: 'loaded'|'failed', detail }`. FAIL naming each `failed` plugin with its detail; DEGRADED naming each file with no line; FAIL when `files` is empty; else PASS. A config read alone never gives PASS.
- `stableIndex(counts)` -> the index of the first read whose count equals the previous read's count and is above 0, else -1.
- `legPluginActive(files, reads, root)` -> `reads` is `[{ entries }]` in read order, each `entries` the parsed `data` array of one `/api/plugin` response. Count only entries whose `source` mentions `<root>/.opencode/plugins/`. DEGRADED when `stableIndex` of those counts is -1 (details list the counts). On the stable read: FAIL naming each file with no entry, and each entry whose `state.status` is not `active` (with its status); FAIL when `files` is empty; else PASS.
- `legsForV2(files, v2, root)` -> `[pluginActive, skillVisible]`. When `v2.started` is false, both are DEGRADED with `v2.reason` (the private server did not start); otherwise `legPluginActive(files, v2.reads, root)` and `legSkillVisible(v2.skills, root)`.
- `legSkillVisible(response, root)` -> `response` is the parsed `/api/skill` body. PASS when `data` is an array with at least one entry whose JSON mentions `<root>`; FAIL otherwise; FAIL when the body did not parse (pass `null`).
- `worstExit(results)` -> 0, 1 or 3 by the rule above.
- `formatHuman(results)` -> one line per result: `<STATUS> <family> <leg>: <reason>`, then indented details.
- `main(argv, deps)` -> a Promise of the exit code (async, because `readV2` waits on a child process). `deps` defaults to the real world and is injectable for tests: `{ env, probeVersion(path) -> { output, error }, which(name) -> path|null, runDebugConfig(bin, root) -> { exit, stdout }, runHarness(root) -> { exit, stdout }, readV2(bin, root) -> Promise<{ started, reason, reads: [{ entries }], skills: body|null }>, writeFile(path, text), stdout(text), stderr(text) }`. `main` probes each distinct candidate path at most once: `$OPENCODE_BIN`, then `which('opencode')`, then `which('opencode2')`.

## Real collectors (not exercised by the fixture tests)

- `probeVersion`: `spawnSync(path, ['--version'], { input: '', timeout: 5000, env: { ...env, XDG_DATA_HOME: <temp> } })`.
- `runDebugConfig`: `spawnSync(bin, ['debug', 'config'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000, env with XDG_DATA_HOME: <temp>, maxBuffer: 64 MiB })`.
- `runHarness`: `spawnSync(process.execPath, ['--input-type=module', '-e', HARNESS_SOURCE, root], { cwd: root, timeout: 120000 })`, where `HARNESS_SOURCE` is the import harness: for each top-level `*.js` in `<root>/.opencode/plugins`, sorted, `import()` it, take `default`, use it when it is a function or its `server` when that is a function, call it with `{ client, project: { id: 'battery' }, worktree: root, directory: root, serverUrl: new URL('http://127.0.0.1:0'), $: client }` where `client` is a Proxy that answers every property and call, and print `{ name, v1, detail }` per file; `process.exit(0)` at the end.
- `readV2`: start `spawn(bin, ['serve', '--port', <free port>], { cwd: root, env: { ...env, OPENCODE_DB: <temp>/private.db, XDG_DATA_HOME: <temp>/data }, stdio: ['ignore', 'pipe', 'pipe'] })`; wait up to 30 s for `server listening on http://127.0.0.1:<port>` and `server password <value>` on stdout; then read with `spawnSync(bin, ['api', '--server', 'http://127.0.0.1:<port>', 'GET', '/api/plugin?location%5Bdirectory%5D=' + encodeURIComponent(root)], { env: { ...same, OPENCODE_PASSWORD: <value> } })` up to 15 times 2 s apart, stopping once two consecutive non-zero counts match; then one `/api/skill` read. It returns `{ started: false, reason }` when no listening line or password arrives in 30 s. The server is killed on every exit path, including a thrown error, and the temporary folder is removed. The password is never written to stdout, stderr, a file or a result.
- Every spawn uses an argv array, never a shell.
