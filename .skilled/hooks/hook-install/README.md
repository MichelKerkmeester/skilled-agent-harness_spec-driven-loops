---
title: "Hook Install: Codex Hook Installer"
description: "Keeps Codex's user-global hook file free of copies of the repository's hooks, which Codex already loads from the project. Deployed from Claude, Cursor, and Devin. Codex is the cleanup target, not an installer host."
trigger_phrases:
  - "codex hook installer"
  - "install codex hooks"
  - "reconcile codex hooks"
importance_tier: "reference"
contextType: "reference"
---

# Hook Install: Codex Hook Installer

---

## 1. OVERVIEW

`hook-install/` is the index for the installer that keeps Codex's user-global hook file free of this repository's hooks. Codex loads the repository's `.codex/hooks.json` itself for a trusted checkout, so a copy of those entries in `~/.codex/hooks.json` makes every hook run twice per event, and an entry whose adapter was renamed runs a file that no longer exists. The installer removes both kinds and leaves every other entry alone.

It is repository tooling rather than a runtime event hook. It is explicitly invoked as a cleanup step, not run on every turn, and is indexed here so the hub shows every hook-related executable in one place. The same installer backs a non-mutating `--check` mode that the [`codex-watchdog`](../codex-watchdog/README.md) plugin calls on each OpenCode session start to surface drift.

One real installer backs the wired runtimes. Claude, Cursor, and Devin carry relative symlinks into `.skilled/bin/`; Codex itself carries no copy: it is the cleanup target, not an installer host.

---

## 2. WHAT IT DOES

`install-codex-hooks.mjs` runs in three modes:

| Mode | Invocation | Effect |
|---|---|---|
| Reconcile (default) | `node .skilled/bin/install-codex-hooks.mjs` | Writes the reconciled target. Backs up the existing target to `<target>.bak-<timestamp>` when changed, then atomically writes (temp file + rename, mode preserved). Prints a JSON report. |
| Check (non-mutating) | `node ... install-codex-hooks.mjs --check` | Exits 0 with `install-codex-hooks: OK <path>` when in sync; exits 1 with a `DRIFT` report on stderr when drift is detected. No write. |
| Dry-run | `node ... install-codex-hooks.mjs --dry-run` | Prints the JSON report plus a `drift` object; no write. `--check` and `--dry-run` are mutually exclusive. |

### Reconciliation

The installer treats hook **identity** as the first adapter path in a command (`node`/`bash`/`python` + a `.js`/`.mjs`/`.cjs`/`.sh` file). Against the user-global target it:

- **Removes** hooks whose identity matches a source hook: Codex already runs that hook from the project file, so the global entry is a second registration.
- **Removes repo orphans**: any identity under `.skilled/` or `.opencode/` that no longer exists on disk. Ownership follows the source-root namespace, so a renamed script orphans its installed entry rather than silently surviving.
- **Keeps third-party hooks**: anything the repo does not own is preserved untouched.

### Drift classification (`--check`)

`analyzeDrift` classifies drift into `duplicate` (a repo-owned entry still in the global file), `orphaned` (a repo entry whose adapter no longer exists on disk) and `structure` (the file would change without naming an entry, such as an empty group being dropped). The `--check` report names each category and count.

### Repo anchor safety

`assertSafeRepoAnchor` refuses to run from a linked worktree (it compares `git-common-dir` to the primary `.git`), so ownership and orphan checks always read the primary checkout's hook set and adapters. It throws unless `--allow-worktree` is passed. A missing `git` binary is a skip, not an error.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/install-codex-hooks.mjs` (symlink → `../../../bin/install-codex-hooks.mjs`) | Explicitly invoked reconcile step | Removes repo copies from, or verifies, `~/.codex/hooks.json`; JSON report on stdout, drift on stderr |
| **Cursor** | `cursor/install-codex-hooks.mjs` (symlink) | Explicitly invoked reconcile step | Same |
| **Devin** | `devin/install-codex-hooks.mjs` (symlink) | Explicitly invoked reconcile step | Same |
| **Codex** | — | — | Not applicable. Codex reads the project's `.codex/hooks.json` and is the cleanup *target* (`~/.codex/hooks.json`), not an installer host; it carries no copy of the installer. |
| **OpenCode** | — | — | Not applicable. OpenCode observes Codex hook health through the `codex-watchdog` plugin, which calls this installer's `--check` mode. |
| **Pi** | — | — | Not applicable. |

One real installer backs the wired runtimes; the per-runtime entries are symlinks into `.skilled/bin/`.

---

## 4. DIRECTORY TREE

```text
hook-install/
+-- README.md
+-- claude/   install-codex-hooks.mjs (symlink -> ../../../bin/install-codex-hooks.mjs)
+-- cursor/   install-codex-hooks.mjs (symlink)
`-- devin/    install-codex-hooks.mjs (symlink)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/install-codex-hooks.mjs` | The installer. Argument parsing, hook-identity matching, source/target reconciliation (remove owned, remove repo orphans, keep third-party), drift classification, repo-anchor safety, atomic write with backup, and `--check` / `--dry-run` modes. |
| `.codex/hooks.json` | The versioned project hook set Codex loads for a trusted checkout. The installer reads it to learn which entries are the repo's own. Not in this folder. |
| `~/.codex/hooks.json` | The user-global file the installer cleans. Lives outside the repo. |
| `.skilled/hooks/shared/hook-flags.cjs` | The shared kill-switch resolver the installer imports (`isHookEnabled('hook-install')`). |

---

## 6. CONFIGURATION

The installer is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_HOOK_INSTALL_DISABLED=1` | Canonical kill-switch. `main()` short-circuits before any read or write; the installer becomes a no-op. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Flags and options:

| Flag / option | Effect |
|---|---|
| `--repo <path>` | Repo root (default: two levels up from the installer). |
| `--source <file>` | Source hooks file (default: `<repo>/.codex/hooks.json`). |
| `--target <file>` | Target hooks file (default: `~/.codex/hooks.json`). |
| `--check` | Non-mutating verification; exits 1 on drift. |
| `--dry-run` | Print the report only; no write. Mutually exclusive with `--check`. |
| `--allow-worktree` | Permit anchoring at a linked worktree (otherwise refused). |

Set a kill-switch inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Explicitly invoked | Runs as a cleanup step, not on every turn. No runtime event hook. |
| Project-owned | The repo's `.codex/hooks.json` defines which entries are the repo's own; the installer removes those from the user-global file and never adds any. |
| Third-party preservation | Any hook the repo does not own is kept untouched. Only orphans under `.skilled/` or `.opencode/` are removed. |
| Worktree safety | Refuses to anchor at a linked worktree unless `--allow-worktree` is passed. |
| Atomic + backed up | A changed target is backed up to `<target>.bak-<timestamp>` and written via temp-file + rename with mode preserved. |
| Non-fatal check | `--check` never writes; it only reports drift and sets the exit code. |
| Imports | Node builtins only, plus `../hooks/shared/hook-flags.cjs` via `createRequire`. Nothing outside the repo. |
| Real code | Stays in `.skilled/bin/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
node .skilled/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result: `exit: 0` with `install-codex-hooks: OK <target>` when the user-global file is in sync, or `exit: 1` with an `install-codex-hooks: DRIFT <target> (...)` report on stderr when drift is detected.

```bash
node .skilled/bin/install-codex-hooks.mjs --dry-run | head -n 1
```

Expected result: a JSON object whose first line opens with `{` and includes `"dryRun": true`, `"changed": <bool>`, and the `drift` object. No file is written.

```bash
SYSTEM_HOOK_INSTALL_DISABLED=1 node .skilled/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result: `exit: 0`, no output (kill-switch short-circuits before any read or write).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../codex-watchdog/README.md`](../codex-watchdog/README.md): the OpenCode plugin that calls this installer's `--check` mode to monitor Codex hook health after install.
- [`../../bin/install-codex-hooks.mjs`](../../bin/install-codex-hooks.mjs): the installer's real home.
