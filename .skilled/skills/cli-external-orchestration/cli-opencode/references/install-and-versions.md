---
title: "OpenCode CLI - Install and Version Layouts"
description: "Install recipes for OpenCode 1.19.3 and 2.0.32: side-by-side, v1-only and v2-only layouts, the setup helper, the launcher, version detection and the constraints that stay."
trigger_phrases:
  - "opencode install"
  - "opencode side by side"
  - "opencode2 launcher"
  - "opencode version detection"
  - "opencode upgrade major"
  - "opencode db isolation"
  - "install opencode v1 and v2"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# OpenCode CLI - Install and Version Layouts

How to put OpenCode 1.19.3 and 2.0.32 on one machine, or just one of them, and how to tell which version a name runs.

---

## 1. OVERVIEW

### Purpose

This reference is the skill's install guidance. A dispatch needs a known binary, and the two supported majors are separate npm packages that both claim the name `opencode`. What follows is the three layouts that work, the helper that builds them, and the facts that decide which version answers a bare `opencode`.

### Claim Labels

Claims in the prose carry one of three labels. The layout table in section 3 summarises the sections below it, whose claims are labelled there.

| Label | Meaning |
|-------|---------|
| `[confirmed]` | Observed on this machine on 2026-10-18 with the command named in the sentence. |
| `[documented]` | Stated by a named source: the official v2 docs at https://opencode.ai/v2/docs/, the launcher comment in `~/.local/bin/opencode2`, the CLI's own `--help` output, or the npm registry. |
| `[unknown]` | Not probed. Treat it as open and do not plan around it. |

### The Fact Behind Every Collision

Both majors ship a binary named `opencode` [confirmed: `npm view opencode-ai bin` returns `{ opencode: 'bin/opencode.exe' }` and `npm view @opencode/cli bin` returns `{ opencode: 'bin/opencode.exe', opencode2: 'bin/opencode.exe' }`]. One prefix therefore cannot hold both versions under that name. Only v2 ships a second name, `opencode2`, and every layout below exists to use it or to avoid needing it.

### When to Use

- Building a machine that runs both OpenCode 1.19.3 and 2.0.32
- Installing one version only, on a clean machine or one with the other already present
- Deciding whether Homebrew, mise or a second npm prefix is the right channel
- Working out why a bare `opencode` runs the version you did not expect

### Key Sources

| Source | What it gives you |
|--------|-------------------|
| `~/.local/bin/opencode2` | The launcher that keeps the two databases apart |
| https://opencode.ai/v2/docs/ | The official v2 install channels and the v2 platform docs |
| `../scripts/opencode-setup.sh` | The helper that builds any of the three layouts |
| `./cli-reference.md` | Subcommands, `run` flags and the version-drift section |

**Verified versions.** Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-19. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified. The delta is in this reference.

---

## 2. PREREQUISITES

### Tooling

- Node.js and npm for every npm layout. The npm on this machine is `/opt/homebrew/bin/npm` 11.19.1 [confirmed: `command -v npm` and `npm -v`].
- A POSIX shell for the launcher, which is `/bin/sh` [confirmed: the launcher's shebang].
- macOS or Linux. The npm path is cross-platform. The Homebrew channels are not.

### Pinned Targets

| Version | Package | Pin | Channel `latest` |
|---------|---------|-----|------------------|
| v1 | `opencode-ai` | `1.19.3` | `1.19.3` |
| v2 | `@opencode/cli` | `2.0.32` | `2.0.32` |

Both pins are the current `latest` of their own package [confirmed: `npm view opencode-ai dist-tags` and `npm view @opencode/cli dist-tags`, read 2026-10-18]. The v1 package was not moved to 2.x, so a v1 package update cannot drift a v1 install into v2 [confirmed: `opencode-ai`'s `latest` dist-tag is still 1.19.3].

### Read First

The name collision in "The Fact Behind Every Collision" decides almost every choice below. If you are adding a second version to a machine that already has one, read section 3 before you run any install command.

---

## 3. INSTALLATION

### The Three Layouts

Read the warning in a layout's own section before you run its command. Each row takes the `opencode` name: the v1 row collides with a v2 `opencode` already on `PATH`, and the v2 rows orphan or shadow an existing v1 install.

| Setup | Channel | Command | `opencode` resolves to | Data file |
|-------|---------|---------|------------------------|-----------|
| v1 only | npm | `npm install -g --prefix "$HOME/.local" opencode-ai@1.19.3` | v1 | `opencode.db` |
| v2 only | npm, standard prefix | `npm install -g @opencode/cli@2.0.32` | v2 | `opencode.db`, unless `OPENCODE_DB` says otherwise |
| both | npm, two prefixes | both commands above, plus the launcher | v1 | `opencode.db` for v1, `opencode-v2.db` for v2 |
| v2 only | Homebrew | `brew install opencode` | v2 | `opencode.db` |

The two-prefix npm layout is the only verified way to hold both versions on one machine [documented: the npm registry]. It needs the launcher, and the launcher needs the second prefix to stay off `PATH`.

### Layout 1: v1 Only

Before you install, check that no `opencode` on `PATH` already resolves to v2. If one does, stop and resolve the collision by hand. Do not overwrite it.

```bash
npm install -g --prefix "$HOME/.local" opencode-ai@1.19.3
"$HOME/.local/bin/opencode" --version    # 1.19.3
```

No launcher is needed, because with only v1 present there is nothing to disambiguate. The v1 channel is frozen at 1.19.3, so this leg stays put with no pinning upkeep [confirmed: `opencode-ai`'s `latest` dist-tag is 1.19.3].

### Layout 2: v2 Only

Two things to settle first.

1. `npm install -g @opencode/cli` to the standard prefix takes the `opencode` name. If a v1 `opencode` already resolves, this orphans the v1 install. Use the side-by-side layout instead [documented: the npm registry].
2. If `$HOME/.local/share/opencode/opencode.db` exists from an earlier v1 install, v2 adopts that database and migrates it in place [documented: the launcher comment only]. Move the file aside or set `OPENCODE_DB` before the first run. The helper warns about this and never moves a file.

```bash
npm install -g @opencode/cli@2.0.32
opencode --version    # opencode v2.0.32
```

### Layout 3: Side by Side

The working layout is three artifacts, and each one matters [confirmed: this is the state of this machine].

1. v1 in the default npm prefix. `~/.local/bin/opencode` is a symlink to `../lib/node_modules/opencode-ai/bin/opencode.exe`.
2. v2 in a second prefix, `~/.local/opencode-v2`, deliberately kept off `PATH`. `$PATH` contains `~/.local/bin` and does not contain `~/.local/opencode-v2/bin`, which is exactly why v2's own `opencode` cannot shadow v1's.
3. The launcher at `~/.local/bin/opencode2`, a 260-byte `/bin/sh` script that sets `OPENCODE_DB` and execs the v2 binary.

Never add `~/.local/opencode-v2/bin` to `PATH`. That re-creates the collision the whole layout exists to avoid.

```bash
npm install -g --prefix "$HOME/.local" opencode-ai@1.19.3
npm install -g --prefix "$HOME/.local/opencode-v2" @opencode/cli@2.0.32
# then write ~/.local/bin/opencode2 (the text is in section 4)
```

The v2 install lands two names in the second prefix, `opencode` and `opencode2`, both pointing at one binary [confirmed: `~/.local/opencode-v2/bin/` holds both symlinks to `../lib/node_modules/@opencode/cli/bin/opencode.exe`]. Only `opencode2` gets a launcher on `PATH`. The prefix's own `opencode` name stays off `PATH` and shadows nothing.

### The Setup Helper

`../scripts/opencode-setup.sh <both|v1|v2|check>` builds any of the three layouts [documented: the helper contract].

| Mode | What it does |
|------|--------------|
| `both` | Installs v1 and v2 into the two prefixes, writes the launcher last, then reports both names. |
| `v1` | Installs v1 only. Refuses when a v2 `opencode` already resolves and prints the `both` hint. |
| `v2` | Installs v2 to the standard prefix. Refuses when a v1 `opencode` already resolves and prints the `both` hint. |
| `check` | Changes nothing. Reports the resolved path and the version for each name. |

Every mode is idempotent, and every step prints its rollback line. The helper never runs a rollback, an uninstall or an upgrade. It also refuses to run when the v2 prefix bin is already on `PATH`, and it writes the launcher only after both npm installs succeed. If the second npm install fails, the first stays installed and the launcher is not written. Rerunning `both` completes the layout.

`check` reads the binaries from `$HOME` rather than from the caller's `PATH`, so it reports the layout even when the two disagree [documented: the helper contract].

### Official v2 Channels

The official v2 channels as of 2026-10-18 [documented: https://opencode.ai/v2/docs/].

The v2 binary is named `opencode`, the same as v1's [documented: https://opencode.ai/v2/docs/], so none of these channels solves side-by-side on its own. The renamed launcher is still required.

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

The launcher carries the isolation, not the packages. Its text, verbatim [confirmed: this is the file at `~/.local/bin/opencode2` on this machine].

```sh
#!/bin/sh
# v2 would otherwise open the same opencode.db as v1 and migrate it in place.
# A relative OPENCODE_DB resolves under the shared data directory.
: "${OPENCODE_DB:=opencode-v2.db}"
export OPENCODE_DB
exec "$HOME/.local/opencode-v2/bin/opencode2" "$@"
```

### Why OPENCODE_DB Is Set

v2 opens `opencode.db` by default, the same file v1 uses, and migrates it in place [documented: the launcher comment only]. The variable moves v2 to its own database. A relative `OPENCODE_DB` resolves under the shared data directory, so `opencode-v2.db` lands beside `opencode.db` rather than in the current working directory [documented: the launcher comment].

The data directory confirms this is not hypothetical. `~/.local/share/opencode/` holds three databases on this machine, `opencode.db`, `opencode-next.db` and `opencode-v2.db` [confirmed]. The `-next` file is residue from an earlier v2 preview build, which shows that a version switch created a third database rather than reusing one.

The `: "${OPENCODE_DB:=opencode-v2.db}"` form sets the variable only when it is unset or empty, so a caller can still override it for one run:

```bash
OPENCODE_DB=/tmp/probe.db opencode2 run --standalone ...
```

Whether v1 honours `OPENCODE_DB` was not probed [unknown]. The launcher is v2-only, so the question does not change the layout either way.

### The Config Directory Is Shared

Both versions read `~/.config/opencode`, and there is no per-version config directory [confirmed: the directory holds one `opencode.jsonc`, one `plugins/` tree and one `service.json`, with no version-suffixed sibling]. A key written for one version is live on the other immediately [documented: https://opencode.ai/v2/docs/, which puts the global config at `~/.config/opencode/opencode.json(c)`]. Nothing isolates them.

That has two consequences you cannot design around:

- A config key only one version understands can break the other.
- `~/.config/opencode` is never cleanup after uninstalling one version.

### How cli-opencode Picks a Binary

The runtime resolves the executor in this order [documented: the cli-opencode dispatch contract].

1. `$OPENCODE_BIN`, when set.
2. Otherwise walk `PATH` in order and, inside each directory, take `opencode2` before `opencode`.

Both halves are worth knowing. With no `OPENCODE_BIN`, the pick on this machine is `~/.local/bin/opencode2`, so a bare dispatch runs v2 [confirmed]. With `OPENCODE_BIN=opencode`, the pick reports `1.19.3`, so v1 is kept [confirmed].

The per-directory rule is deliberate. Searching all of `PATH` for `opencode2` before any `opencode` would let a v2 binary in a late directory beat a v1 stub earlier in `PATH`, and a stub that loses the race reaches a real binary instead of failing its own check.

### Run Flags Differ Between Versions

The two versions do not take the same `run` flags, so a shared argv does not exist.

| Concern | v1 1.19.3 | v2 2.0.32 |
|---------|-----------|-----------|
| Working directory | `--dir <path>` | No flag. The spawn directory carries it. |
| Positional arguments | message text | message text only, so every positional is a message |
| Variant | `--variant max` | rides on the model id, `-m provider/model#variant` |
| Permission bypass | `--auto`, with `--dangerously-skip-permissions` as a hidden alias | `--auto` |
| Private server | not needed | `--standalone` for a dispatch that should not use the background service |

The v2 `run` surface on this machine is `--standalone`, `--server`, `--continue`, `--session`, `--fork`, `--model`, `--agent`, `--format`, `--file`, `--title`, `--thinking` and `--auto`, and its help lists the arguments as `message...` [confirmed: `run --help` on 2.0.32]. The v1 `run` surface adds `--dir` and `--variant`, which v2 does not have [confirmed: `run --help` on 1.19.3].

The `--dangerously-skip-permissions` alias is hidden from help and appears only in v1's bundled option table, where it is registered as a hidden alias of `--auto` [documented: the v1 option table]. Pass `--auto` on both versions unless a caller already pins the v1 argv.

### Providers Are Per Version

The two versions list different providers, so a model id that works on one can be missing on the other [confirmed: the two lists below, read on this machine on 2026-10-18].

| Command | Providers listed |
|---------|------------------|
| `opencode models` (1.19.3) | llmgateway-providers, llmgateway, opencode-go, openai, cline-pass, opencode, minimax |
| `opencode2 models` (2.0.32) | llmgateway-providers, llmgateway, cline-pass, opencode |

v1 1.19.3 lists `opencode-go`, `openai` and `minimax`, which v2 2.0.32 does not [confirmed: `opencode models` and `opencode2 models` on 2026-10-18], and v2 lists `llmgateway`, `llmgateway-providers`, `cline-pass` and `opencode`. The skill's default model, `opencode-go/deepseek-v4.1-flash`, names the `opencode-go` provider, which v2 does not list [confirmed: `opencode models` on 1.19.3], so the default cannot be assumed to work on v2.

Check the provider on the version you are about to dispatch. For a v2 run, check the v2 name in your layout with `models`: `opencode2` in the side-by-side layout, `opencode` in a v2-only layout. For a v1 run, use `opencode models`. Whether credentials added on one version reach the other was not probed [unknown].

---

## 5. VERIFICATION

### Detect by Output Shape

```bash
opencode --version    # 1.19.3            -> v1
opencode2 --version   # opencode v2.0.32   -> v2
```

Both lines are observed output on this machine [confirmed].

Do not detect by name. On a machine with both installed the names differ, and on a v2-only machine both names resolve to v2 [documented: the npm registry, where `@opencode/cli` declares both `opencode` and `opencode2`]. Classify by what the binary prints:

- a bare `1.19.3` shape, digits and dots only, is v1
- an `opencode v2.0.32` shape, a word before the number, is v2

Anchor the pattern. A string like `1.19.3garbage` must not pass as v1, and the committed guard rejects it [documented: the guard's anchored pattern].

### What `--version` Proves

`--version` proves which version a name runs. That is all it proves.

It does not prove that plugins load, that the config parses, that a provider is authenticated or that a dispatch will succeed. Those legs stay [unknown]. A pair that reports `1.19.3` and `opencode v2.0.32` is installed, not verified. Say "reports its version" rather than "works" until a real run has loaded a plugin on both.

### What a Probe Writes

A v2 `--version` call is not read-only. The binary appends a `cli starting` line to `~/.local/share/opencode/log/opencode.log` on every invocation, `--version` included, and `--log-level none` does not stop it, in either argument order. v1 `--version` writes nothing [confirmed: repeated probes on this machine, 2026-10-18].

The setup helper points `XDG_DATA_HOME` at a temporary folder for each `--version` probe and removes the folder on exit, so its probes write nothing under HOME [confirmed: a v2 probe with that variable set wrote its log line in the temporary folder, and the HOME log was unchanged, 2026-10-18]. A `--version` you run by hand still writes the log line.

### Verify a Layout by Hand

```bash
"$HOME/.local/bin/opencode" --version
"$HOME/.local/bin/opencode2" --version
ls -1 "$HOME/.local/share/opencode"/*.db
printf '%s\n' "$PATH" | tr ':' '\n' | grep -c 'opencode-v2'   # must print 0
```

The last line is the `PATH` guard. A non-zero count means the second prefix leaked onto `PATH` and the collision is back.

### The `check` Mode

`../scripts/opencode-setup.sh check` runs all of the above and changes nothing. It prints the resolved path and the reported version for `opencode` and `opencode2`, which version the bare word `opencode` runs, the database files present, and whether the v2 prefix bin is on `PATH` [documented: the helper contract].

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

| Method | v1 1.19.3 | v2 2.0.32 |
|--------|-----------|-----------|
| curl, npm, pnpm, bun, brew | yes | yes |
| choco, scoop | yes | no |
| yarn, vp, winget | no | yes |

Both columns are read from the `--help` output on this machine [confirmed]. A shared recipe must not pass `--method`. Let each version pick its own, or build the flag per version.

Only the shared five are usable here, because yarn, vp and winget are absent from this machine [confirmed: `command -v`], and only npm and curl are plausible in a script.

### `--log-level` Is Version-Specific Too

v1 accepts `DEBUG`, `INFO`, `WARN` and `ERROR`, uppercase only [confirmed: v1 help]. v2 accepts `all`, `trace`, `debug`, `info`, `warn`, `warning`, `error`, `fatal` and `none`, lowercase [confirmed: v2 help]. A shared script that passes `--log-level WARN` to v2 fails, and `--log-level warn` to v1 fails. Omit the flag, or build it per version.

---

## 7. UNINSTALLATION

### Rollback Lines

The helper prints these and never runs them. Run them by hand, one layout at a time.

```bash
# v1 leg
npm uninstall -g --prefix "$HOME/.local" opencode-ai

# v2 leg
"$HOME/.local/opencode-v2/bin/opencode" uninstall --dry-run    # inspect first
"$HOME/.local/opencode-v2/bin/opencode" uninstall --force      # documented as keeping session data, config, state
npm uninstall -g --prefix "$HOME/.local/opencode-v2" @opencode/cli   # when the prefix itself goes

# after either: remove the now-dangling launcher, and DO NOT delete ~/.config/opencode
```

### Order Matters

Uninstall v2 before you remove the `opencode2` launcher, or the launcher execs a missing binary [documented: the launcher's exec line]. In the other direction the leftover launcher is harmless but confusing, and the next `check` reports a name that no longer works.

### What v2's Uninstall Keeps

`opencode2 uninstall` is described as `Uninstall OpenCode, keeping session data, configuration, and state`, and it offers `--dry-run` to print the manifest and `--force` to skip confirmation [confirmed: `uninstall --help` on 2.0.32]. Run `--dry-run` first, read it, then `--force`.

On the v1 side, `npm uninstall -g --prefix ~/.local opencode-ai` removes the package and its `opencode` name. The session data at `~/.local/share/opencode/opencode.db` is untouched by the npm operation [documented: the npm registry].

Whether the v2 background service outlives the uninstall was not probed [unknown]. Check the process list after a rollback rather than assuming either way.

### Never Delete the Config Directory

`~/.config/opencode` is shared by both versions [documented: https://opencode.ai/v2/docs/, which puts the global config at `~/.config/opencode/opencode.json(c)`]. Never delete it as post-uninstall cleanup. Both versions read it, so removing it breaks whichever one remains.

---

## 8. TROUBLESHOOTING

### Symptoms

| Symptom | Cause | Fix |
|---------|-------|-----|
| `opencode --version` prints `opencode v2.0.32` when you expected `1.19.3` | A v2 `opencode` shadows v1, from Homebrew or a standard-prefix npm install | Remove the v2 `opencode` name, or rebuild with the two-prefix layout |
| A v2 run picks up the v1 database | `OPENCODE_DB` is unset and the run bypassed the launcher | Run `opencode2` from `~/.local/bin`, or set `OPENCODE_DB` yourself |
| A dispatch picks a version you did not expect | `$OPENCODE_BIN` is set, or `PATH` order puts another directory first | Read the resolved path, then pin `$OPENCODE_BIN` for the run |
| `provider/model not found` on v2 for a model that works on v1 | The provider lists differ per version | Confirm the provider with `models` on the v2 name in your layout (`opencode2` side by side, `opencode` in a v2-only layout) before the dispatch |
| The launcher prints `No such file or directory` and exits 126 [confirmed: a launcher whose target is missing, run on this machine] | The v2 prefix was uninstalled or moved | Reinstall v2, or remove the launcher |
| `npm` aborts with a dyld `Library not loaded` error | The node that npm runs cannot start [confirmed: Homebrew node 26.11.1 on this machine] | Put a working node earlier on `PATH` |

### Gaps That No Recipe Closes

These constraints survive every layout. Plan around them rather than trying to fix them.

1. **Homebrew cannot coexist with a v1 install.** The formula is v2-only, no versioned formula exists, and both binaries are named `opencode`.
2. **`upgrade --major` is a migration that removes v1.** No recipe makes it safe on a side-by-side machine.
3. **The config directory is shared.** One `~/.config/opencode` serves both versions, and a key written for one is live on the other immediately. No isolation exists to document.
4. **The default database is shared.** v2 opens v1's `opencode.db` unless `OPENCODE_DB` is set. The launcher is the only thing preventing it.
5. **v2's background service has no v1 analogue [confirmed: `opencode2 --help` lists a `service` group that `opencode --help` does not, and one service process serves the v2 clients on this machine].** Whether it outlives an uninstall was not probed [unknown].
6. **`upgrade --method` and `--log-level` are version-specific.** A shared recipe must omit both.
7. **bun and pnpm two-prefix behaviour is unestablished.** Only npm was verified for the two-prefix layout. Treat the other managers as single-version rather than implying parity.

### Open Questions

| Question | Status |
|----------|--------|
| Does v1 honour `OPENCODE_DB`? | [unknown] Not probed. |
| Does the v2 service outlive `opencode2 uninstall`? | [unknown] Not probed. |
| Do `bun add -g` and `pnpm add -g` support the two-prefix layout? | [unknown] Not probed. |
| Does `upgrade --major` prompt before it acts? | [unknown] Not probed. |
| Do the `@opencode/cli` install scripts start a service? | [unknown] Not probed. |

---

## 9. RELATED RESOURCES

- [`./cli-reference.md`](./cli-reference.md) for the subcommand map, the `run` flag surface and the version-drift section
- [`./providers-and-models.md`](./providers-and-models.md) for the provider roster and the per-provider variant map
- [`../scripts/opencode-setup.sh`](../scripts/opencode-setup.sh) for the `both`, `v1`, `v2` and `check` modes
- https://opencode.ai/v2/docs/ for the official v2 channels and the v2 platform documentation
