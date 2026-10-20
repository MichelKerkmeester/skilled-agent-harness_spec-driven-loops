ROLE: You edit one Node script and its test file. Match the file's existing style exactly: section banners, a short WHY comment above each function, `makeResult` rows, CommonJS, no new dependencies. Comments never name a spec folder, phase, row or task id.

FILES (only these two):
- `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`
- `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`

GOAL: add a leg named `command-listed` for both families. It checks that the runtime's command listing matches the repository's command files, after removing the two things that make a raw comparison unfair.

FACTS (verified live on 1.19.3 and 2.0.32, do not re-derive):
1. Both versions register every `.md` file under `{command,commands}/**/*.md` inside each config directory. The command name is the path relative to that `command`/`commands` folder, without `.md`, with `/` separators (`create/readme`, `agent-router`).
2. Config directories on both versions: the project's `<root>/.opencode`, the global `$XDG_CONFIG_HOME/opencode` (default `$HOME/.config/opencode`), `$HOME/.opencode`, and `$OPENCODE_CONFIG_DIR` when set.
3. OpenCode 1 stops its project walk at the repository root. OpenCode 2 walks past it and also merges every ancestor directory's `.opencode` folder, so a worktree nested inside another checkout lists the ancestor's commands too.
4. OpenCode 1: the command names are the keys of the `command` object in the `debug config` JSON the battery already collects for `plugin-discovered`. It lists no built-ins.
5. OpenCode 2: `GET /api/command?location%5Bdirectory%5D=<encoded root>` returns `{ data: [{ name, description }] }`. The first read after start-up can be empty (observed counts 0, 42, 42). It always adds two runtime built-ins, `init` and `review`, which live in no folder.

CHANGES:
1. Add `const V2_BUILTIN_COMMANDS = ['init', 'review'];` in the constants section, with a WHY comment (fact 5).
2. Add `listCommandNames(dir)`: returns the sorted command names under `<dir>/command` and `<dir>/commands` per fact 1, following symlinks, `[]` when neither exists.
3. Add `allowedCommandSources(root, family, env)`: returns `{ required, allowed }`. `required` = `listCommandNames(path.join(root, '.opencode'))`. `allowed` = names from the global directories of fact 2 (built from `env`, never from `process.env` directly; skip a directory whose variable is unset or empty), plus, for `v2` only, names from `<ancestor>/.opencode` for every ancestor of `root` up to the filesystem root, plus `V2_BUILTIN_COMMANDS`.
4. Add `legCommandListed(family, listed, sources)`: `listed` is an array of names or `null`. `null` → FAIL `the command listing did not parse`. Otherwise FAIL when a `required` name is not listed (detail `<name>: in the command folder, not listed`) or a listed name is in neither `required` nor `allowed` (detail `<name>: listed, in no command folder`). PASS reason: `all <n> command files listed`, details: one line `listed: <count>` and one line `required: <count>`.
5. v1 in `main()`: keep the single `runDebugConfig` call, store its result, pass it to `legPluginDiscovered` as now, then push `legCommandListed('v1', <command keys or null>, allowedCommandSources(args.root, 'v1', runtime.env))`.
6. v2: in `readV2`, after the skill read, read the command endpoint until two consecutive reads give the same non-zero count (at most `READ_ATTEMPTS`, `READ_INTERVAL_MS` apart), and return it as `commands` (the last parsed body). `legsForV2(files, v2, root, env)` gains a third row: DEGRADED with the same reason when the server never started, else `legCommandListed('v2', <names from v2.commands.data or null>, allowedCommandSources(root, 'v2', env))`. `main()` passes `runtime.env`.
7. Export `listCommandNames`, `allowedCommandSources`, `legCommandListed`, `V2_BUILTIN_COMMANDS`.
8. Update the usage header comment's one-line description so it also names the command listing.

TESTS (add to the test file, keep every existing test passing; update R9 to also expect a DEGRADED `command-listed` row, and any `main()` test whose fake `runDebugConfig` or `readV2` now needs a `command` object or `commands` body):
- `C1 nested`: temp tree `outer/.opencode/commands/outer-only.md`, `outer/inner/.opencode/commands/a.md`, `outer/inner/.opencode/commands/b/c.md`. Fake env with `HOME` and `XDG_CONFIG_HOME` pointing at empty temp dirs. `legCommandListed('v2', ['a','b/c','outer-only','init','review'], allowedCommandSources(inner,'v2',env))` → PASS.
- `C2 isolated`: same inner tree copied to a temp dir with no `.opencode` ancestor. The same listing → FAIL naming `outer-only`. Then `['a','b/c','init','review']` → PASS.
- `C3 v1 no walk-up`: on the nested tree, `legCommandListed('v1', ['a','b/c','outer-only'], allowedCommandSources(inner,'v1',env))` → FAIL naming `outer-only`; and `['a','b/c','init']` → FAIL naming `init`.
- `C4 missing`: `['a']` on v2 → FAIL naming `b/c`.
- `C5 null`: `legCommandListed('v1', null, ...)` → FAIL `the command listing did not parse`.
- `C6 global`: a command file under the fake `XDG_CONFIG_HOME/opencode/commands/g.md` makes a listed `g` PASS on both families.

VERIFY (run, then report the output tail and exit code):
`node --test .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`

REPORT: the functions added, the tests added or changed by name, and the test command's pass/fail counts.
