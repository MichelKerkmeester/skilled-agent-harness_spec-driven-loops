---
title: Git Plugin File-Layer Troubleshooting
description: "Cause, detection and recovery for Git plugin (obsidian-git) failures: settings file corruption, missing repository, silent automation, push and pull failures, conflicts, binary issues and mobile limits, with named validation checkpoints."
trigger_phrases:
  - "obsidian git not backing up"
  - "obsidian git push failed"
  - "obsidian git pull conflict"
  - "obsidian git data json invalid"
  - "obsidian git git not ready"
  - "obsidian git credentials"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Git Plugin File-Layer Troubleshooting

Diagnose the settings file, the repository surface and the app state separately. A correct data.json does not prove a working sync. A working sync needs a repository, credentials and a running app.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Automatic backup never runs | Zero `autoSaveInterval`, paused routines, missing repository |
| Push never happens | True `disablePush`, zero `autoPushInterval`, no remote configured |
| Pull on startup fails | `autoPullOnBoot` with uncommitted changes or diverged history |
| Settings appear reset | `data.json` does not parse as JSON and the plugin loads defaults |
| "Git is not ready" in settings | Missing git binary, missing repository, wrong path setting |
| Conflict file appears at vault root | Remote and local diverged and auto-merge failed |
| Source Control view is stale | `refreshSourceControl` off or the refresh timer is very long |
| Commit identity is wrong | git config `user.name` and `user.email` are unset or stale |

---

## 2. DIAGNOSIS SEQUENCE

1. Read `.obsidian/plugins/obsidian-git/data.json`. When absent, defaults apply and that is valid state.
2. Validate the JSON parse and the known key names from `data-model.md`.
3. Check the repository surface: `.git` at vault root or `basePath`, `.gitignore` present, conflict file present or absent.
4. Run the read-only allowlist commands from `workflows.md`.
5. Check the automation chain: intervals, `disablePush`, `pullBeforePush`, `autoPullOnBoot`.
6. Check identity: `user.name` and `user.email` in git config.
7. Classify the failure: settings, repository, credentials, remote or app state.
8. Apply the matching recovery, then re-run the named validation checkpoints.

---

## 3. FAILURE MODES

### Invalid settings JSON

The plugin loads defaults when data.json does not parse. Detection is a JSON parse of the file. Recovery restores the backup or rewrites the file from the defaults table in `data-model.md`. All writes keep the backup discipline.

### Repository not initialized

A missing `.git` at vault root or `basePath` stops every git operation. Detection is a directory check. The plugin provides an initialize command in the app. The mode never creates a repository in the real vault.

### Silent automation

Auto backup needs an interval above 0, enabled routines and a running app. The pause-automatic-routines command toggles all automation off. Detection reads `autoSaveInterval`, `autoPushInterval` and `autoPullInterval`. Recovery sets the values the user wants and confirms routines are not paused.

### Push failures

Cause groups: no remote, wrong credentials, `disablePush` true or diverged history. Detection runs `git remote -v` read-only and reads the chain keys. Recovery depends on the cause: configure the remote, set credentials in the app, flip `disablePush` or let the user pull and resolve. The mode never pushes from the file layer.

### Pull conflicts

When local and remote diverge, `syncMethod` chooses merge, rebase or reset. `mergeStrategy` decides auto-resolution with `none`, `ours` or `theirs`. Failed auto-merges write `conflict-files-obsidian-git.md` at the vault root. Detection reads that file and the two enum keys. Recovery reports the file list and lets the user resolve in the app. The mode never resolves conflicts with git commands on the real vault.

### Git binary not found

The plugin falls back to `git` from PATH, with a Windows constant of `C:\Program Files\Git\cmd\git.exe`. A custom binary path lives in localStorage. Detection runs a version check in the app or reports the settings hint. Recovery points the custom path at a real binary or installs git on the machine.

### Credential problems

Username and password or token live in localStorage, managed by the app. The password is write-only. Detection reports that the app must refresh credentials. The mode never writes credentials and never claims a push outcome.

### Stale Source Control view

`refreshSourceControl` off or a long `refreshSourceControlTimer` keeps the view stale. Detection reads both keys. Recovery raises the timer responsiveness or enables auto refresh, then notes that the view needs the app.

### Commit identity missing

Empty `user.name` or `user.email` makes commits carry the wrong author. Detection reads git config identity. Recovery asks the user to set the values in the app settings, the mode does not write git config silently.

### Submodule drift

`updateSubmodules` and `submoduleRecurseCheckout` change how submodules sync. Detection reads both keys. Recovery documents the gap: conflicted files and commit counts inside submodules are not fully covered by the plugin.

### Sync method reset

`syncMethod` set to `reset` only moves HEAD and never touches the working directory. Local commits can vanish from the branch view without a file change. Detection reads `syncMethod` when users report missing commits. Recovery switches to `merge` or `rebase` and lets the user restore history in the app. The mode never resets anything.

### Backup storm on file change

`autoBackupAfterFileChange` triggers a backup on every vault change. Large vaults can flood the commit history. Detection reads the key and the commit log depth. Recovery sets the key to `false` and prefers the interval timer.

---

## 4. SETTINGS LABEL INVERSIONS

Some app labels invert or rename the stored key. Read the key before reporting the value.

| App label | Stored key | Inversion |
| --- | --- | --- |
| Disable informative notifications | `disablePopups` | None |
| Disable error notifications | `showErrorNotices` | Inverted, true means notices are shown |
| Hide notifications for no changes | `disablePopupsForNoChanges` | None |
| Push on commit-and-sync | `disablePush` | Inverted, enabling the toggle sets the key to `false` |
| Pull on commit-and-sync | `pullBeforePush` | None |
| Split timers for automatic commit and sync | `differentIntervalCommitAndPush` | None |
| Show the count of modified files in the status bar | `changedFilesInStatusBar` | None |
| Auto refresh source control view | `refreshSourceControl` | None |

---

## 5. VALIDATION CHECKPOINTS

Run these named checks after any diagnosis or recovery. Each one is a pass or fail verdict.

| Checkpoint | Check | Pass condition |
| --- | --- | --- |
| Settings parse | JSON parse of data.json | File parses, every key is known |
| Defaults state | data.json presence | Absent file reported as defaults, not as a defect |
| Repo presence | `.git` location | Repository exists at vault root or `basePath` |
| Automation chain | Interval and pause state | Interval above 0, routines enabled |
| Push chain | Remote and chain keys | Remote configured, `disablePush` matches intent |
| Conflict state | Conflict file presence | Conflict file absent or fully reported |
| Message render | Placeholder substitution | Preview has no unresolved tokens |
| Identity | git config values | `user.name` and `user.email` are set |
| Backup hygiene | Backup copy age | Backup taken before the last write, diff confirms one key |

---

## 6. RECOVERY

| Problem | Fix |
| --- | --- |
| Invalid data.json | Restore the backup or rewrite from the defaults table, then reload Obsidian |
| Repository missing | User runs the plugin initialize command in the app |
| Automation silent | Set intervals above 0 and resume automatic routines |
| Push blocked | Configure remote, refresh credentials, review `disablePush` |
| Conflict file present | Report the file list, user resolves in the app |
| Git binary missing | Set the custom binary path or install git |
| Credentials stale | User re-enters credentials in the app, password is write-only |
| Stale view | Enable auto refresh or lower the refresh timer |
| Wrong commit author | Set `user.name` and `user.email` in the app settings |

---

## 7. LIMITS

- The mode verifies files and settings, not executed syncs. Push and pull outcomes need the app.
- Credentials and hostname live in localStorage and stay app-managed.
- Destructive and state-changing git operations are out of scope for the real vault, throwaway repositories only.
- Mobile forces the unified diff view and has different path behavior, the stored `diffStyle` may not match the rendered view.
- Settings label names invert some keys, read the actual key before reporting the value.
- A missing data.json is default state, never report it as data loss.
- `syncMethod` reset moves only HEAD, so missing-commit reports must check the sync method first.
- Interval automation needs a running app with the plugin enabled, the mode cannot create that precondition.
