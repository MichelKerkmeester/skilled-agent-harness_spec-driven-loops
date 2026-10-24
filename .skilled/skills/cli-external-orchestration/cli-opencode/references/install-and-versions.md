---
title: "OpenCode CLI - Install and Version Layouts"
description: "Install recipes for OpenCode 2.1.4 (recommended) and 1.19.3 (fallback): v2-only and side-by-side layouts, v1-only as the fallback, the setup helper, the launcher, version detection and the constraints that stay."
trigger_phrases:
  - "opencode install"
  - "opencode side by side"
  - "opencode1 launcher"
  - "opencode version detection"
  - "opencode upgrade major"
  - "opencode db isolation"
  - "install opencode v2 and v1"
importance_tier: important
contextType: implementation
version: 1.0.10.0
---

# OpenCode CLI - Install and Version Layouts

How to put OpenCode 2.1.4 on a machine, optionally alongside OpenCode 1.19.3 as a fallback, and how to tell which version a name runs.

---

## 1. OVERVIEW

### Purpose

This reference is the skill's install guidance. OpenCode 2 is the version this repository expects and recommends; OpenCode 1 is a backwards-compatible fallback kept only because not every user has updated yet. A dispatch needs a known binary, and the two supported majors are separate npm packages that both claim the name `opencode`. What follows is the layouts that work, the helper that builds them, and the facts that decide which version answers a bare `opencode`.

### Claim Labels

Claims in the prose carry one of three labels. The layout table in section 3 summarises the sections below it, whose claims are labelled there.

| Label | Meaning |
|-------|---------|
| `[confirmed]` | Observed on this machine on 2026-10-18 with the command named in the sentence. |
| `[documented]` | Stated by a named source: the official v2 docs at https://opencode.ai/v2/docs/, the launcher comment in `~/.local/bin/opencode1`, the CLI's own `--help` output, or the npm registry. |
| `[unknown]` | Not probed. Treat it as open and do not plan around it. |

### The Fact Behind Every Collision

Both majors ship a binary named `opencode` [confirmed: `npm view opencode-ai bin` returns `{ opencode: 'bin/opencode.exe' }` and `npm view @opencode/cli bin` returns `{ opencode: 'bin/opencode.exe', opencode2: 'bin/opencode.exe' }`]. One prefix therefore cannot hold both versions under that name. v2 is the expected version, so it keeps the name `opencode`, and v1 is the one that moves: side by side it answers only to the `opencode1` launcher. The second v2 name, `opencode2`, is retired in that layout.

### When to Use

- Installing OpenCode 2.1.4, alone or side by side with the `opencode1` launcher for v1
- Installing OpenCode 1.19.3 alone or side by side, the fallback path for users who have not updated
- Deciding whether Homebrew, mise or a second npm prefix is the right channel
- Working out why a bare `opencode` runs the version you did not expect

### Key Sources

| Source | What it gives you |
|--------|-------------------|
| `~/.local/bin/opencode1` | The v1 launcher that keeps the two databases apart |
| https://opencode.ai/v2/docs/ | The official v2 install channels and the v2 platform docs |
| `../scripts/opencode-setup.sh` | The helper that builds any of the three layouts |
| `./cli-reference.md` | Subcommands, `run` flags and the version-drift section |

**Verified versions.** Verified against OpenCode 2.1.4 on 2026-10-24 and OpenCode 1.19.3 on 2026-10-19. Flag and provider observations that name 2.0.32 were read on that release and have not been re-read on 2.1.4. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified. The delta is in this reference.

---

## 2. PREREQUISITES

### Tooling

- Node.js and npm for every npm layout. The npm on this machine is `/opt/homebrew/bin/npm` 11.19.1 [confirmed: `command -v npm` and `npm -v`].
- A POSIX shell for the launcher, which is `/bin/sh` [confirmed: the launcher's shebang].
- macOS or Linux. The npm path is cross-platform. The Homebrew channels are not.

### Pinned Targets

| Version | Package | Pin | Channel `latest` |
|---------|---------|-----|------------------|
| v2 (recommended) | `@opencode/cli` | `2.1.4` | `2.1.4` |
| v1 (fallback) | `opencode-ai` | `1.19.3` | `1.19.4` |

The v2 pin is its package's current `latest`; the v1 pin trails `latest` by one patch and stays on the verified 1.19.3 [confirmed: `npm view @opencode/cli dist-tags` and `npm view opencode-ai dist-tags`, read 2026-10-24]. The v1 package was not moved to 2.x, so a v1 package update cannot drift a v1 install into v2 [confirmed: `opencode-ai`'s `latest` dist-tag is 1.19.4].

### Read First

The name collision in "The Fact Behind Every Collision" decides almost every choice below. If you are adding a second version to a machine that already has one, read section 3 before you run any install command.

---

## 3. INSTALLATION

### The Three Layouts

Read the warning in a layout's own section before you run its command. The v2 layouts come first because OpenCode 2 is the recommended target; the v1-only layout is the fallback for users who have not updated. Each row takes the `opencode` name: the v2 rows orphan or shadow an existing v1 install, and the v1 row collides with a v2 `opencode` already on `PATH`.

| Setup | Channel | Command | `opencode` resolves to | Data file |
|-------|---------|---------|------------------------|-----------|
| v2 only (recommended) | npm, standard prefix | `npm install -g @opencode/cli@2.1.4` | v2 | `opencode.db`, unless `OPENCODE_DB` says otherwise |
| v2 only (recommended) | Homebrew | `brew install opencode` | v2 | `opencode.db` |
| both (recommended) | npm, two prefixes | both npm commands below, plus the v2 links and the `opencode1` launcher | v2 | `opencode.db` for v2, `opencode-v1.db` for v1 |
| v1 only (fallback) | npm | `npm install -g --prefix "$HOME/.local" opencode-ai@1.19.3` | v1 | `opencode.db` |

The two-prefix npm layout is the only verified way to hold both versions on one machine [documented: the npm registry]. It needs the `opencode1` launcher, which gives v1 a name of its own and a database of its own.

### Layout 1: v2 Only (Recommended)

Two things to settle first.

1. `npm install -g @opencode/cli` to the standard prefix takes the `opencode` name. If a v1 `opencode` already resolves, this orphans the v1 install. Use the side-by-side layout instead [documented: the npm registry].
2. If `$HOME/.local/share/opencode/opencode.db` exists from an earlier v1 install, v2 adopts that database and migrates it in place [confirmed: on 2026-10-24 the first v2.1.4 run on this machine added a `session_v2` table to `opencode.db` holding all 1,339 v1 sessions]. Copy the file aside or set `OPENCODE_DB` before the first run if v1 must keep reading it. The helper warns about this and never moves a file.

```bash
npm install -g @opencode/cli@2.1.4
opencode --version    # opencode v2.1.4
```

### Layout 2: Side by Side (Recommended for One Machine)

v2 takes the name `opencode` and v1 moves to `opencode1`; no `opencode2` is on `PATH`. The working layout is four artifacts [confirmed: this is the state of this machine on 2026-10-24].

1. v1 in the default npm prefix, `~/.local/lib/node_modules/opencode-ai`. Its npm install writes `~/.local/bin/opencode`, and the next step takes that name back.
2. v2 in a second prefix, `~/.local/opencode-v2`. The install lands two names there, `opencode` and `opencode2`, both pointing at one binary [confirmed: `~/.local/opencode-v2/bin/` holds both symlinks to `../lib/node_modules/@opencode/cli/bin/opencode.exe`]. That prefix bin is not on `PATH`.
3. `~/.local/bin/opencode`, a symlink to `../opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe`. A bare `opencode` runs v2 against the default `opencode.db`.
4. The launcher at `~/.local/bin/opencode1`, a `/bin/sh` script that sets `OPENCODE_DB=opencode-v1.db` and `OPENCODE_DISABLE_AUTOUPDATE=1` and execs the v1 binary.

```bash
npm install -g --prefix "$HOME/.local" opencode-ai@1.19.3
npm install -g --prefix "$HOME/.local/opencode-v2" @opencode/cli@2.1.4
ln -sfn ../opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe "$HOME/.local/bin/opencode"
# then write ~/.local/bin/opencode1 (the text is in section 4)
```

Order matters: the link comes after the v1 install, because that install writes the name `opencode`. Any later reinstall of `opencode-ai` into `~/.local` takes the name back. v1's own auto-update does exactly that [confirmed: on 2026-10-24 v1 updated itself to 1.19.4 and `~/.local/bin/opencode` pointed at v1 again], which is why the launcher turns auto-update off. Run `opencode-setup.sh check` after any v1 npm operation, and rerun `both` if `opencode` reports v1.

Before the first v2 run on a machine that already has v1 history, copy `opencode.db` for v1, because v2 migrates it in place:

```bash
sqlite3 "$HOME/.local/share/opencode/opencode.db" ".backup '$HOME/.local/share/opencode/opencode-v1.db'"
```

### Layout 3: v1 Only (Fallback)

Use this only when you have not moved to OpenCode 2 yet. Before you install, check that no `opencode` on `PATH` already resolves to v2. If one does, stop and resolve the collision by hand. Do not overwrite it.

```bash
npm install -g --prefix "$HOME/.local" opencode-ai@1.19.3
"$HOME/.local/bin/opencode" --version    # 1.19.3
```

No launcher is needed, because with only v1 present there is nothing to disambiguate. The v1 channel still moves by patch releases, so install with the explicit `@1.19.3` pin to stay on the verified version [confirmed: `opencode-ai`'s `latest` dist-tag is 1.19.4 on 2026-10-24]. Because OpenCode 1 support is temporary, this is a holding position rather than a target: move to v2, or to the side-by-side layout, when you can.

### The Setup Helper

`../scripts/opencode-setup.sh <v2|both|v1|check>` builds any of the three layouts [documented: the helper contract].

| Mode | What it does |
|------|--------------|
| `v2` (recommended) | Installs v2 to the standard prefix. Refuses when a v1 `opencode` already resolves and prints the `both` hint. |
| `both` (recommended) | Installs v1 and v2 into the two prefixes, links `opencode` to v2, retires `opencode2`, writes the `opencode1` launcher last, then reports both names. An `opencode2` link into the v2 prefix is removed; any other file at `opencode` or `opencode2` is moved aside to `<name>.pre-v2-default`, never deleted. |
| `v1` (fallback) | Installs v1 only, for users who have not updated. Refuses when a v2 `opencode` already resolves and prints the `both` hint. |
| `check` | Changes nothing. Reports the resolved path and the version for each name. |

Every mode is idempotent, and every step prints its rollback line. The helper never runs a rollback, an uninstall or an upgrade, and it changes no data file: when `opencode.db` exists and `opencode-v1.db` does not, `both` prints the copy command above instead of running it. It writes the links and the launcher only after both npm installs succeed. If the second npm install fails, the first stays installed and nothing else is written. Rerunning `both` completes the layout.

`check` reads the binaries from `$HOME` rather than from the caller's `PATH`, so it reports the layout even when the two disagree [documented: the helper contract].

### Official v2 Channels

The official v2 channels as of 2026-10-18 [documented: https://opencode.ai/v2/docs/].

The v2 binary is named `opencode`, the same as v1's [documented: https://opencode.ai/v2/docs/], so none of these channels solves side-by-side on its own. The `opencode1` launcher is still required.

- `curl -fsSL https://opencode.ai/v2/install | bash`
- `brew install anomalyco/tap/opencode-v2`
- `npm install -g @opencode/cli`
- bun, pnpm, yarn and Vite+ install paths
- AUR package `opencode-beta`
- `mise use -g opencode`. mise 2026.10.9 and later install OpenCode 2 under the name `opencode`, while older mise versions install OpenCode 1 [documented: https://opencode.ai/v2/docs/]. A mise upgrade alone can therefore move a user from v1 to v2 with no explicit choice, so pin the version when you need to stay on v1.

### Homebrew Is v2-Only and Exclusive

`brew install opencode` installs a v2 `opencode` on the default `PATH` [confirmed: `brew info --json=v2 opencode` reports stable `2.0.32`, and the formula tracks the v2 repository].

There is no `opencode@1` formula and no versioned formula at all [confirmed: `versioned_formulae` is an empty list]. Homebrew therefore cannot supply the v1 leg of a side-by-side layout, and a Homebrew v2 collides with an npm v1 on the `opencode` name. One of the two becomes invisible depending on `PATH` order. Treat Homebrew as a v2-only, exclusive channel. Use it when you want only v2, and use the two-prefix npm layout when you want both.

---

## 4. CONFIGURATION

### The Launcher

The launcher carries the isolation, not the packages. Its text, verbatim [confirmed: this is the file at `~/.local/bin/opencode1` on this machine, byte-identical to what the helper writes].

```sh
#!/bin/sh
# OpenCode 1 fallback. OpenCode 2 owns opencode.db and migrates it in place,
# so v1 keeps its own copy. A relative OPENCODE_DB resolves under the shared data directory.
# An auto-update reinstalls the v1 package, which takes the opencode name back from v2.
: "${OPENCODE_DB:=opencode-v1.db}"
: "${OPENCODE_DISABLE_AUTOUPDATE:=1}"
export OPENCODE_DB OPENCODE_DISABLE_AUTOUPDATE
exec "$HOME/.local/lib/node_modules/opencode-ai/bin/opencode.exe" "$@"
```

### Why OPENCODE_DB Is Set

Both versions open `opencode.db` by default, and v2 migrates it in place [confirmed: see Layout 1]. v2 is the expected version, so it keeps the default file and v1 moves to `opencode-v1.db`. Both versions honour `OPENCODE_DB`, and a relative value resolves under the shared data directory, so `opencode-v1.db` lands beside `opencode.db` rather than in the current working directory [confirmed: on 2026-10-24 two `opencode1 run` calls added two sessions to `opencode-v1.db`, two v2 runs added two to `opencode.db`, and `opencode-v1.db` has no `session_v2` table].

`~/.local/share/opencode/` holds four databases on this machine [confirmed]: `opencode.db` (v2), `opencode-v1.db` (v1), `opencode-v2.db`, which holds the v2 sessions from the earlier layout and is no longer opened by either name, and `opencode-next.db`, residue from a v2 preview build. v2 imports `opencode-next.db` on its first run on a database; nothing imports `opencode-v2.db` [documented: the v2 binary's migration code reads `opencode-next.db` by name].

The `: "${OPENCODE_DB:=opencode-v1.db}"` form sets the variable only when it is unset or empty, so a caller can still override it for one run:

```bash
OPENCODE_DB=/tmp/probe.db opencode1 run ...
```

### The Config Directory Is Shared

Both versions read `~/.config/opencode`, and there is no per-version config directory [confirmed: the directory holds one `opencode.jsonc`, one `plugins/` tree and one `service.json`, with no version-suffixed sibling]. A key written for one version is live on the other immediately [documented: https://opencode.ai/v2/docs/, which puts the global config at `~/.config/opencode/opencode.json(c)`]. Nothing isolates them.

That has two consequences you cannot design around:

- A config key only one version understands can break the other.
- `~/.config/opencode` is never cleanup after uninstalling one version.

### How cli-opencode Picks a Binary

The runtime resolves the executor in this order [documented: the cli-opencode dispatch contract].

1. `$OPENCODE_BIN`, when set.
2. Otherwise take `opencode2` from anywhere on `PATH`.
3. Only when no `opencode2` exists anywhere on `PATH`, fall back to the first `opencode`.

Both halves are worth knowing. With no `OPENCODE_BIN`, the side-by-side layout has no `opencode2`, so the pick on this machine is `~/.local/bin/opencode` and a bare dispatch runs v2 [confirmed]. Reaching v1 takes `OPENCODE_BIN=opencode1` [confirmed: `opencode1 --version` reports a 1.x version]. A v2-only layout that installs only `opencode` reaches v2 through step 3, and a v1-only machine reaches v1 the same way.

The rule is deliberately v2-first. OpenCode 2 is the version the repository expects and recommends; OpenCode 1 is kept only as a fallback for machines that have not updated. Resolution therefore never lets an earlier `opencode` on `PATH` beat an `opencode2` that exists later, and a `check` that reports `1.19.3` for a bare `opencode` is reporting the fallback.

### Run Flags Differ Between Versions

The two versions do not take the same `run` flags, so a shared argv does not exist.

| Concern | v2 2.0.32 (recommended) | v1 1.19.3 (fallback) |
|---------|-------------------------|------------------------|
| Working directory | No flag. The spawn directory carries it. | `--dir <path>` |
| Positional arguments | message text only, so every positional is a message | message text |
| Variant | rides on the model id, `-m provider/model#variant` | `--variant max` |
| Permission bypass | `--auto` | `--auto`, with `--dangerously-skip-permissions` as a hidden alias |
| Private server | `--standalone` for a dispatch that should not use the background service | not needed |

The v2 `run` surface on this machine is `--standalone`, `--server`, `--continue`, `--session`, `--fork`, `--model`, `--agent`, `--format`, `--file`, `--title`, `--thinking` and `--auto`, and its help lists the arguments as `message...` [confirmed: `run --help` on 2.0.32]. The v1 `run` surface adds `--dir` and `--variant`, which v2 does not have [confirmed: `run --help` on 1.19.3].

The `--dangerously-skip-permissions` alias is hidden from help and appears only in v1's bundled option table, where it is registered as a hidden alias of `--auto` [documented: the v1 option table]. Pass `--auto` on both versions unless a caller already pins the v1 argv.

### Providers Are Per Version

The two versions list different providers, so a model id that works on one can be missing on the other [confirmed: the two lists below, read on this machine on 2026-10-18].

| Command | Roster-relevant providers listed |
|---------|----------------------------------|
| `opencode models --standalone` (2.0.32, recommended) | llmgateway-providers, llmgateway, opencode |
| `opencode models` (1.19.3, fallback) | llmgateway-providers, llmgateway, opencode-go, openai, opencode, minimax |

A listing also shows any provider whose credential is still in the local auth store, including one that is off the roster. Such a provider is not a dispatch target.

v2 2.0.32 lists `llmgateway`, `llmgateway-providers` and `opencode`; v1 1.19.3 lists `opencode-go`, `openai` and `minimax`, which v2 2.0.32 does not [confirmed: both versions' model listings on 2026-10-18, and `opencode models --standalone` on 2026-10-20, which lists the same v2 provider prefixes]. The former OpenCode 1 default model, `opencode-go/deepseek-v4.1-flash`, names the `opencode-go` provider, which v2 does not list [confirmed: `opencode models` on 1.19.3], so the default on both versions is `llmgateway/deepseek-v4.1-flash-1017`, which v2 does list.

Check the provider on the version you are about to dispatch. For a v2 run, list with `opencode models --standalone` and look for the `<provider>/` prefix: v2 `models` takes no provider argument, and without `--standalone` it asks the shared background service. For a v1 run, use `opencode1 models` side by side, or `opencode models` on a v1-only machine. Whether credentials added on one version reach the other was not probed [unknown].

---

## 5. VERIFICATION

### Detect by Output Shape

```bash
opencode --version    # opencode v2.1.4   -> v2 (recommended)
opencode1 --version   # 1.19.4            -> v1 (fallback)
```

Both lines are observed output on this machine on 2026-10-24 [confirmed]. The v1 line reads 1.19.4 because v1 updated itself before the launcher turned auto-update off; the pin is still 1.19.3.

Do not detect by name. A v1-only machine answers v1 to `opencode`, every other layout answers v2 to it, and only the side-by-side layout has `opencode1` [documented: the npm registry, where `@opencode/cli` declares both `opencode` and `opencode2`, so a plain v2 install also answers to `opencode2`]. Classify by what the binary prints:

- an `opencode v2.0.32` shape, a word before the number, is v2
- a bare `1.19.3` shape, digits and dots only, is v1

Anchor the pattern. A string like `1.19.3garbage` must not pass as v1, and the committed guard rejects it [documented: the guard's anchored pattern].

### What `--version` Proves

`--version` proves which version a name runs. That is all it proves.

It does not prove that plugins load, that the config parses, that a provider is authenticated or that a dispatch will succeed. Those legs stay [unknown]. A pair that reports `1.19.3` and `opencode v2.0.32` is installed, not verified. Say "reports its version" rather than "works" until a real run has loaded a plugin on both.

### What a Probe Writes

A v2 `--version` call is not read-only. The binary appends a `cli starting` line to `~/.local/share/opencode/log/opencode.log` on every invocation, `--version` included, and `--log-level none` does not stop it, in either argument order. v1 `--version` writes nothing [confirmed: repeated probes on this machine, 2026-10-18].

The setup helper points `XDG_DATA_HOME` at a temporary folder for each `--version` probe and removes the folder on exit, so its probes write nothing under HOME [confirmed: a v2 probe with that variable set wrote its log line in the temporary folder, and the HOME log was unchanged, 2026-10-18]. A `--version` you run by hand still writes the log line.

### Verify a Layout by Hand

```bash
"$HOME/.local/bin/opencode" --version    # v2
"$HOME/.local/bin/opencode1" --version   # v1
ls -1 "$HOME/.local/share/opencode"/*.db
```

### The `check` Mode

`../scripts/opencode-setup.sh check` runs all of the above and changes nothing. It prints the resolved path and the reported version for `opencode`, `opencode1` and any leftover `opencode2`, which version the bare word `opencode` runs, and the database files present [documented: the helper contract].

---

## 6. UPGRADE

### A Plain v1 Upgrade Cannot Reach 2.x

`opencode upgrade` with no target resolves against the `opencode-ai` channel, whose `latest` is 1.19.3, the version already installed [confirmed: `opencode upgrade --help` on 1.19.3 and the npm dist-tags]. The v1 leg is stable with no pinning effort. Nothing you do to keep v1 current can move it to 2.x except the flag below.

### Never Run `opencode upgrade --major`

**Stop. Read the flag's own help text before you type it.**

```
--major       upgrade to OpenCode 2 and remove OpenCode 1   [boolean]
```

That is the complete description on 1.19.3 [confirmed]. The removal is in the flag's contract, not an implementation detail. On a side-by-side machine, `--major` migrates v1 to v2 and deletes the v1 install, which destroys the layout you built. It is a migration, never an upgrade. Do not put it in a script, a recipe or a troubleshooting step.

Whether it prompts for confirmation before it acts was not probed [unknown].

### `upgrade --method` Is Version-Specific

| Method | v2 2.0.32 (recommended) | v1 1.19.3 (fallback) |
|--------|-------------------------|------------------------|
| curl, npm, pnpm, bun, brew | yes | yes |
| choco, scoop | no | yes |
| yarn, vp, winget | yes | no |

Both columns are read from the `--help` output on this machine [confirmed]. A shared recipe must not pass `--method`. Let each version pick its own, or build the flag per version.

Only the shared five are usable here, because yarn, vp and winget are absent from this machine [confirmed: `command -v`], and only npm and curl are plausible in a script.

### `--log-level` Is Version-Specific Too

v1 accepts `DEBUG`, `INFO`, `WARN` and `ERROR`, uppercase only [confirmed: v1 help]. v2 accepts `all`, `trace`, `debug`, `info`, `warn`, `warning`, `error`, `fatal` and `none`, lowercase [confirmed: v2 help]. A shared script that passes `--log-level WARN` to v2 fails, and `--log-level warn` to v1 fails. Omit the flag, or build it per version.

---

## 7. UNINSTALLATION

### Rollback Lines

The helper prints these and never runs them. Run them by hand, one layout at a time.

```bash
# v2 leg
"$HOME/.local/opencode-v2/bin/opencode" uninstall --dry-run    # inspect first
"$HOME/.local/opencode-v2/bin/opencode" uninstall --force      # documented as keeping session data, config, state
npm uninstall -g --prefix "$HOME/.local/opencode-v2" @opencode/cli   # when the prefix itself goes

# v1 leg (fallback)
npm uninstall -g --prefix "$HOME/.local" opencode-ai

# after the v2 leg: remove ~/.local/bin/opencode, now a dangling link
# after the v1 leg: remove ~/.local/bin/opencode1, now a launcher with no binary
# after either: DO NOT delete ~/.config/opencode
```

### Order Matters

Each leg leaves names behind. Removing v2 leaves `opencode` pointing at a missing binary, and removing v1 leaves `opencode1` execing one [documented: the links' targets and the launcher's exec line]. The leftovers are harmless but confusing, and the next `check` reports names that no longer work. Whether `npm uninstall` of `opencode-ai` also removes the `opencode` link, which now points into the v2 prefix, was not probed [unknown]. Run `check` afterwards.

### What v2's Uninstall Keeps

`opencode uninstall` is described as `Uninstall OpenCode, keeping session data, configuration, and state`, and it offers `--dry-run` to print the manifest and `--force` to skip confirmation [confirmed: `uninstall --help` on 2.0.32]. Run `--dry-run` first, read it, then `--force`.

On the v1 side, `npm uninstall -g --prefix ~/.local opencode-ai` removes the package. The session data in `~/.local/share/opencode/` is untouched by the npm operation [documented: the npm registry].

Whether the v2 background service outlives the uninstall was not probed [unknown]. Check the process list after a rollback rather than assuming either way.

### Never Delete the Config Directory

`~/.config/opencode` is shared by both versions [documented: https://opencode.ai/v2/docs/, which puts the global config at `~/.config/opencode/opencode.json(c)`]. Never delete it as post-uninstall cleanup. Both versions read it, so removing it breaks whichever one remains.

---

## 8. TROUBLESHOOTING

### Symptoms

| Symptom | Cause | Fix |
|---------|-------|-----|
| `opencode --version` prints `1.19.3` on a side-by-side machine | A v1 npm operation or a v1 auto-update took the `opencode` name back | Rerun `opencode-setup.sh both`, which relinks `opencode` to v2 |
| A v1 run opens the database v2 migrated | `OPENCODE_DB` is unset and the run bypassed the `opencode1` launcher | Run `opencode1` from `~/.local/bin`, or set `OPENCODE_DB=opencode-v1.db` yourself |
| A dispatch picks a version you did not expect | `$OPENCODE_BIN` is set; otherwise the first `opencode2` anywhere on `PATH` wins, and the first `opencode` is the fallback only when no `opencode2` exists | Read the resolved path, then pin `$OPENCODE_BIN` for the run |
| `provider/model not found` on v2 for a model that works on v1 | The provider lists differ per version | Confirm that `opencode models --standalone` lists the `<provider>/` prefix before the dispatch |
| `opencode1` prints `No such file or directory` and exits 126 [confirmed: a launcher whose target is missing, run on this machine] | The v1 package was uninstalled or moved | Reinstall v1, or remove the launcher |
| `npm` aborts with a dyld `Library not loaded` error | The node that npm runs cannot start [confirmed: Homebrew node 26.11.1 on this machine] | Put a working node earlier on `PATH` |

### Gaps That No Recipe Closes

These constraints survive every layout. Plan around them rather than trying to fix them.

1. **Homebrew cannot coexist with a v1 install.** The formula is v2-only, no versioned formula exists, and both binaries are named `opencode`.
2. **`upgrade --major` is a migration that removes v1.** No recipe makes it safe on a side-by-side machine.
3. **The config directory is shared.** One `~/.config/opencode` serves both versions, and a key written for one is live on the other immediately. No isolation exists to document.
4. **The default database is shared.** Both versions open `opencode.db` unless `OPENCODE_DB` is set, and v2 migrates it. The `opencode1` launcher is the only thing keeping v1 off the migrated file.
5. **v2's background service has no v1 analogue [confirmed: `opencode --help` lists a `service` group that `opencode --help` does not, and one service process serves the v2 clients on this machine].** Whether it outlives an uninstall was not probed [unknown].
6. **`upgrade --method` and `--log-level` are version-specific.** A shared recipe must omit both.
7. **bun and pnpm two-prefix behaviour is unestablished.** Only npm was verified for the two-prefix layout. Treat the other managers as single-version rather than implying parity.

### Open Questions

| Question | Status |
|----------|--------|
| Does the v2 service outlive `opencode uninstall`? | [unknown] Not probed. |
| Do `bun add -g` and `pnpm add -g` support the two-prefix layout? | [unknown] Not probed. |
| Does `upgrade --major` prompt before it acts? | [unknown] Not probed. |
| Do the `@opencode/cli` install scripts start a service? | [unknown] Not probed. |

---

## 9. RELATED RESOURCES

- [`./cli-reference.md`](./cli-reference.md) for the subcommand map, the `run` flag surface and the version-drift section
- [`./providers-and-models.md`](./providers-and-models.md) for the provider roster and the per-provider variant map
- [`../scripts/opencode-setup.sh`](../scripts/opencode-setup.sh) for the `v2`, `both`, `v1` and `check` modes
- https://opencode.ai/v2/docs/ for the official v2 channels and the v2 platform documentation
