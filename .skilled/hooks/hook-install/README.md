---
title: "Hook Install: Codex Hook Installer"
description: "Reconciles the repository's versioned hooks into Codex's user-global hook file, deployed from Claude, Cursor, and Devin. Codex is the install target, not an installer host."
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

`hook-install/` is the index for the installer that reconciles the repository's versioned hooks into Codex's user-global hook file. Codex reads hooks only from `~/.codex/hooks.json`: a file that lives outside the repo and can silently drift (stale checkout anchor, missing adapter, manual edit). This installer merges the repo's authoritative `.codex/hooks.json` into that user-global file, so Codex runs the current managed hook set without the operator hand-editing a global config.

It is tooling that *installs* hooks rather than a runtime event hook. It is explicitly invoked as a reconcile step, not run on every turn, and is indexed here so the hub shows every hook-related executable in one place. The same installer backs a non-mutating `--check` mode that the [`codex-watchdog`](../codex-watchdog/README.md) plugin calls on each OpenCode session start to surface drift.

One real installer backs the wired runtimes. Claude, Cursor, and Devin carry relative symlinks into `.opencode/bin/`; Codex itself carries no copy: it is the install target, not an installer host.

---

## 2. WHAT IT DOES

`install-codex-hooks.mjs` runs in three modes:

| Mode | Invocation | Effect |
|---|---|---|
| Reconcile (default) | `node .opencode/bin/install-codex-hooks.mjs` | Writes the reconciled target. Backs up the existing target to `<target>.bak-<timestamp>` when changed, then atomically writes (temp file + rename, mode preserved). Prints a JSON report. |
| Check (non-mutating) | `node ... install-codex-hooks.mjs --check` | Exits 0 with `install-codex-hooks: OK <path>` when in sync; exits 1 with a `DRIFT` report on stderr when drift is detected. No write. |
| Dry-run | `node ... install-codex-hooks.mjs --dry-run` | Prints the JSON report plus a `drift` object; no write. `--check` and `--dry-run` are mutually exclusive. |

### Reconciliation

The installer treats hook **identity** as the first adapter path in a command (`node`/`bash`/`python` + a `.js`/`.mjs`/`.cjs`/`.sh` file). Against the user-global target it:

- **Removes** hooks whose identity matches a source hook (the source is authoritative for command shape, so the old entry is replaced).
- **Removes repo orphans**: any identity under `.opencode/` that no longer exists on disk. Ownership follows the `.opencode/` namespace, so a renamed script orphans its installed entry rather than silently surviving.
- **Keeps third-party hooks**: anything the repo does not own is preserved untouched.
- **Appends** the canonical source groups, with the portable anchor `${CODEX_PROJECT_DIR:-$PWD}` rewritten to the resolved repo path.

### Drift classification (`--check`)

`analyzeDrift` classifies drift into `missing`, `duplicate`, `command` (command text differs), `orphaned`, `placement` (wrong event), and `structure` (changed but no identity drift). The `--check` report names each category and count.

### Repo anchor safety

`assertSafeRepoAnchor` refuses to anchor hooks at a linked worktree (it compares `git-common-dir` to the primary `.git`), because a worktree's anchor would point at scripts that vanish when the worktree is removed. It throws unless `--allow-worktree` is passed. A missing `git` binary is a skip, not an error.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/install-codex-hooks.mjs` (symlink → `../../../bin/install-codex-hooks.mjs`) | Explicitly invoked reconcile step | Writes/verifies `~/.codex/hooks.json`; JSON report on stdout, drift on stderr |
| **Cursor** | `cursor/install-codex-hooks.mjs` (symlink) | Explicitly invoked reconcile step | Same |
| **Devin** | `devin/install-codex-hooks.mjs` (symlink) | Explicitly invoked reconcile step | Same |
| **Codex** | — | — | Not applicable. Codex is the install *target* (`~/.codex/hooks.json`), not an installer host; it carries no copy of the installer. |
| **OpenCode** | — | — | Not applicable. OpenCode observes Codex hook health through the `codex-watchdog` plugin, which calls this installer's `--check` mode. |
| **Pi** | — | — | Not applicable. |

One real installer backs the wired runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

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
| `.opencode/bin/install-codex-hooks.mjs` | The installer. Argument parsing, hook-identity matching, source/target reconciliation (remove owned, remove repo orphans, keep third-party, append canonical), drift classification, repo-anchor safety, atomic write with backup, and `--check` / `--dry-run` modes. |
| `.opencode/.codex/hooks.json` | The versioned source the installer reads (repo-authoritative hook set). Not in this folder. |
| `~/.codex/hooks.json` | The user-global target the installer reconciles into. Lives outside the repo. |
| `.opencode/hooks/shared/hook-flags.cjs` | The shared kill-switch resolver the installer imports (`isHookEnabled('hook-install')`). |

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

Set a kill-switch inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Explicitly invoked | Runs as a reconcile step, not on every turn. No runtime event hook. |
| Source-authoritative | The repo's `.codex/hooks.json` owns command shape; owned entries are replaced, not merged field-by-field. |
| Third-party preservation | Any hook the repo does not own is kept untouched. Only `.opencode/`-namespaced orphans are removed. |
| Worktree safety | Refuses to anchor at a linked worktree unless `--allow-worktree` is passed. |
| Atomic + backed up | A changed target is backed up to `<target>.bak-<timestamp>` and written via temp-file + rename with mode preserved. |
| Non-fatal check | `--check` never writes; it only reports drift and sets the exit code. |
| Imports | Node builtins only, plus `../hooks/shared/hook-flags.cjs` via `createRequire`. Nothing outside the repo. |
| Real code | Stays in `.opencode/bin/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
node .opencode/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result: `exit: 0` with `install-codex-hooks: OK <target>` when the user-global file is in sync, or `exit: 1` with an `install-codex-hooks: DRIFT <target> (...)` report on stderr when drift is detected.

```bash
node .opencode/bin/install-codex-hooks.mjs --dry-run | head -n 1
```

Expected result: a JSON object whose first line opens with `{` and includes `"dryRun": true`, `"changed": <bool>`, and the `drift` object. No file is written.

```bash
SYSTEM_HOOK_INSTALL_DISABLED=1 node .opencode/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result: `exit: 0`, no output (kill-switch short-circuits before any read or write).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../codex-watchdog/README.md`](../codex-watchdog/README.md): the OpenCode plugin that calls this installer's `--check` mode to monitor Codex hook health after install.
- [`../../bin/install-codex-hooks.mjs`](../../bin/install-codex-hooks.mjs): the installer's real home.
