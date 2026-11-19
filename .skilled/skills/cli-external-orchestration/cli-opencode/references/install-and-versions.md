---
title: "OpenCode CLI - Install and Versions"
description: "Install reference for OpenCode 2: the pinned @opencode/cli 2.3.2 target, the setup helper's v2 mode, version detection, upgrade, uninstall and the cleanup of an older install."
trigger_phrases:
  - "opencode install"
  - "opencode version detection"
  - "opencode upgrade"
  - "opencode uninstall"
  - "remove old opencode install"
  - "opencode setup helper"
importance_tier: important
contextType: implementation
version: 1.0.16.0
---

# OpenCode CLI - Install and Versions

How to put OpenCode 2 on a machine, confirm which version a name runs, and clear an older install off the machine.

---

## 1. OVERVIEW

### Purpose

This reference is the skill's install guidance. OpenCode 2 is the only supported version: the repository pins `@opencode/cli` at 2.3.2, and the binary that package installs is named `opencode`. A dispatch needs a known binary: a deep-loop lineage refuses anything that reports a major other than 2, while the dispatch guard applies every rule to a binary it cannot treat as supported.

### When to Use

- Installing OpenCode 2 with the setup helper or with npm
- Confirming that `opencode` runs OpenCode 2 and not an older install
- Working out why a binary is reported as `unsupported`
- Upgrading the pin or uninstalling the package
- Removing an older install and the launcher an earlier layout left behind

### Claim Labels

Claims in the prose carry one of three labels.

| Label | Meaning |
|-------|---------|
| `[confirmed]` | Observed on this machine on the date named in the sentence, with the command named there. |
| `[documented]` | Stated by a named source: the official docs at [https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/), the CLI's own `--help` output, or the npm registry. |
| `[unknown]` | Not probed. Treat it as open and do not plan around it. |

### Key Sources

| Source | What it gives you |
|--------|-------------------|
| [https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/) | The official install channels and the platform docs |
| `../scripts/opencode-setup.sh` | The helper that installs OpenCode 2, removes an older install and reports what each name resolves to |
| `./cli-reference.md` | Subcommands, `run` flags and the version-drift section |

**Pinned target.** The repository pins `@opencode/cli` at 2.3.2, and the helper installs exactly that pin. The binary it writes is named `opencode`, and `opencode --version` prints `opencode v2.3.2`. Flag observations that name 2.0.32 were read on that release and have not been re-read on 2.3.2.

**Two subcommands moved in 2.3.0** [confirmed: `opencode --help` and the commands below, on 2.3.0, 2026-11-15]. There is no `providers` subcommand: `opencode providers` is read as a directory argument and fails. Credentials are under `opencode auth` (`list`, `login [<provider>]`, `logout`, `switch`). There is no `agent` subcommand either: `opencode debug agents` lists every agent with its resolved prompt, and `debug` has no `skill` subcommand.

---

## 2. PREREQUISITES

### Tooling

- Node.js and npm for the npm install path. The `v2` mode refuses before any write when `npm` is not on `PATH`.
- bash for the helper, which is a bash script.
- macOS or Linux. The npm path is cross-platform. The Homebrew channel is not.
- A writable `$HOME/.local`, because the helper installs into that prefix.

### Pinned Target

| Version | Package | Pin | Binary |
|---------|---------|-----|--------|
| v2 (only supported) | `@opencode/cli` | `2.3.2` | `opencode` |

The pin is what the helper installs and what the resolvers accept. A binary that reports major 1 is `unsupported`, and the deep-loop resolver refuses it. A binary that reports any other major is `unknown`.

---

## 3. INSTALLATION

### The Setup Helper

`../scripts/opencode-setup.sh <v2|remove-v1|check>` is the supported path. Every mode is idempotent, every mutating step prints its rollback line, and the helper never runs a rollback. It changes no data file.

| Mode | What it does |
|------|--------------|
| `v2` | Installs `@opencode/cli@2.3.2` into `$HOME/.local`, then verifies that `$HOME/.local/bin/opencode` reports a v2 shape. Skips the install when the pinned version is already present. |
| `remove-v1` | Uninstalls the old `opencode-ai` package from `$HOME/.local` and deletes the `opencode1` launcher. npm deletes `$HOME/.local/bin/opencode` by name on that uninstall, so when the entry resolves outside `opencode-ai` (an OpenCode 2 link), the helper moves it aside first, restores it afterwards and checks it resolves to the same target. Database files are listed and left in place. |
| `check` | Changes nothing. Reports the resolved path and the version shape for each name, and lists the database files. |

Exit codes are 0 for success, 1 for a refusal or failure, and 2 for a usage error.

```bash
../scripts/opencode-setup.sh v2
```

The helper warns when a database already exists at `$HOME/.local/share/opencode/opencode.db`, because OpenCode 2 adopts and migrates that file in place. Move the file aside before the first run if you need to keep it. The helper changes no data file.

### The Equivalent npm Command

The `v2` mode runs this install:

```bash
npm install -g --prefix "$HOME/.local" "@opencode/cli@2.3.2"
```

The prefix is the part that matters. `$HOME/.local/bin` is where the helper looks for `opencode`, and the helper verifies that path rather than whatever a bare `opencode` resolves to on the caller's `PATH`.

### Official Channels

The official channels as of 2026-10-18 [documented: [https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/)].

- `curl -fsSL https://opencode.ai/v2/install | bash`
- `brew install anomalyco/tap/opencode-v2`
- `npm install -g @opencode/cli`
- bun, pnpm, yarn and Vite+ install paths
- AUR package `opencode-beta`
- `mise use -g opencode`

Every channel installs a binary named `opencode`, so two channels on one machine shadow each other depending on `PATH` order. Pick one channel per machine, or keep the second one off `PATH`.

---

## 4. CONFIGURATION

### How cli-opencode Picks a Binary

The dispatch resolver probes `opencode` on `PATH` [documented: the cli-opencode dispatch contract]. `OPENCODE_BIN` names a different binary when it is set, and a path-qualified value is only probed when its canonical file is one the operator already put in reach.

The probe reads `--version` and classifies the output by shape, not by the name that produced it:

- a major-2 token is `v2`
- a major-1 token is `unsupported`, and the deep-loop resolver refuses it
- anything else, including empty output, is `unknown`

### The Config Directory

OpenCode 2 reads its global config from `~/.config/opencode` [documented: [https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/), which puts the global config at `~/.config/opencode/opencode.json(c)`]. Uninstalling the package does not remove it, and it is never post-uninstall cleanup.

---

## 5. VERIFICATION

### Detect by Output Shape

```bash
opencode --version    # opencode v2.3.2   -> v2
```

That line is the shape the helper verifies after an install. Classify by what the binary prints, not by the name it answers to:

- an `opencode v2.3.2` shape, a word before the number, is v2
- a bare three-part number whose major is 1 is an older major, which is `unsupported`
- anything else is `unknown`

Anchor the pattern. A string like `2.3.2garbage` must not pass as a version, and the committed resolver rejects it [documented: the resolver's anchored pattern].

### What `--version` Proves

`--version` proves which version a name runs. That is all it proves.

It does not prove that plugins load, that the config parses, that a provider is authenticated or that a dispatch will succeed. Those legs stay [unknown]. Say "reports its version" rather than "works" until a real run has loaded a plugin.

### What a Probe Writes

A `--version` call is not read-only. The binary appends a `cli starting` line to `~/.local/share/opencode/log/opencode.log` on every invocation, `--version` included, and `--log-level none` does not stop it, in either argument order [confirmed: repeated probes on this machine, 2026-10-18].

The setup helper points `XDG_DATA_HOME` at a temporary folder for each `--version` probe and removes the folder on exit, so its probes write nothing under HOME [confirmed: a probe with that variable set wrote its log line in the temporary folder, and the HOME log was unchanged, 2026-10-18]. A `--version` you run by hand still writes the log line.

### The `check` Mode

`../scripts/opencode-setup.sh check` runs all of the above and changes nothing. It prints the resolved path and the reported version shape for each name it finds, which version the bare word `opencode` runs, and the database files present [documented: the helper contract].

---

## 6. UPGRADE

### The Pin Is the Upgrade

The helper installs one pinned version, so an upgrade is a change to that pin. When the repository moves the pin, rerun `v2`. To install a newer release ahead of the pin, use the same prefix with npm:

```bash
npm install -g --prefix "$HOME/.local" "@opencode/cli@<version>"
```

The helper skips the install when the pinned version is already present, so rerunning `v2` is safe. It verifies the installed binary reports a v2 shape after every install, and exits 1 when it does not.

### A Major Change Is a Reinstall

A binary that reports major 1 is reported as `unsupported`: a deep-loop lineage refuses it, and the dispatch guard checks it against every rule without treating it as OpenCode 2. There is no in-place path from an older major to OpenCode 2. Remove the old install with `remove-v1`, then install with `v2`.

---

## 7. UNINSTALLATION

### Rollback Lines

The `v2` mode prints these and never runs them. Run them by hand.

```bash
npm uninstall -g --prefix "$HOME/.local" @opencode/cli
# then remove $HOME/.local/bin/opencode if it is now a dangling link
# DO NOT delete ~/.config/opencode
```

### What the Binary's Own Uninstaller Keeps

`opencode uninstall` is described as `Uninstall OpenCode, keeping session data, configuration, and state`, and it offers `--dry-run` to print the manifest and `--force` to skip confirmation [confirmed: `uninstall --help` on 2.0.32]. Run `--dry-run` first, read it, then `--force`.

Whether the background service outlives the uninstall was not probed [unknown]. Check the process list after a rollback rather than assuming either way.

### Never Delete the Config Directory

`~/.config/opencode` holds the global config. Never delete it as post-uninstall cleanup.

---

## 8. REMOVING AN OLD OPENCODE 1 INSTALL

An earlier layout installed `opencode-ai` and wrote an `opencode1` launcher beside it. Neither is supported now, and one mode removes both:

```bash
../scripts/opencode-setup.sh remove-v1
```

The mode uninstalls `opencode-ai` from `$HOME/.local` and deletes `$HOME/.local/bin/opencode1`. It removes the launcher only when it is the regular file the helper wrote; a symlink, a folder or a file that does not run the old package is refused, and nothing is changed. Every refusal runs before the first write. When `$HOME/.local/bin/opencode` resolves outside `opencode-ai`, the mode moves it aside before the uninstall and restores the same entry afterwards, because npm otherwise deletes it by name. The rollback it prints reinstalls `opencode-ai` and then restores that link, so OpenCode 1 never keeps the name.

The user's old data files are listed and left in place. An `opencode-v1.db` holds only OpenCode 1 history, so it is the user's to keep or delete. The helper never removes a database file.

When nothing answers to `opencode` afterwards, the helper says so and points at the `v2` mode.

---

## 9. TROUBLESHOOTING

### Symptoms

| Symptom | Cause | Fix |
|---------|-------|-----|
| `opencode --version` prints a 1.x line | An older install still answers to the name | Run `opencode-setup.sh remove-v1`, then `opencode-setup.sh v2` |
| A binary is reported as `unsupported`, or a deep-loop lineage refuses it | The resolved binary reports major 1 | Same fix: remove the old install, then install OpenCode 2 |
| `opencode1` prints `No such file or directory` and exits 126 [confirmed: a launcher whose target is missing, run on this machine] | The old package was uninstalled and the launcher was left behind | `opencode-setup.sh remove-v1` removes the launcher |
| `provider/model not found` | The provider is not listed on this machine | Confirm that `opencode models --standalone` lists the `<provider>/` prefix before the dispatch |
| `npm` aborts with a dyld `Library not loaded` error | The node that npm runs cannot start [confirmed: Homebrew node 26.11.1 on this machine] | Put a working node earlier on `PATH` |

### Gaps That No Recipe Closes

1. **The config directory outlives the package.** `~/.config/opencode` is never post-uninstall cleanup.
2. **The default database is migrated in place.** OpenCode 2 adopts an existing `opencode.db`, so move the file aside before the first run if you need to keep it.
3. **Two channels shadow each other.** Every channel installs a binary named `opencode`, so `PATH` order decides which one answers.
4. **`--version` is not a health check.** It proves the version, not that plugins load or that a provider is authenticated.

### Open Questions

| Question | Status |
|----------|--------|
| Does the background service outlive `opencode uninstall`? | [unknown] Not probed. |
| Do the `@opencode/cli` install scripts start a service? | [unknown] Not probed. |

---

## 10. RELATED RESOURCES

- [`./cli-reference.md`](./cli-reference.md) for the subcommand map, the `run` flag surface and the version-drift section
- [`./providers-and-models.md`](./providers-and-models.md) for the provider roster and the per-provider effort map
- [`../scripts/opencode-setup.sh`](../scripts/opencode-setup.sh) for the `v2`, `remove-v1` and `check` modes
- [https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/) for the official channels and the platform documentation
