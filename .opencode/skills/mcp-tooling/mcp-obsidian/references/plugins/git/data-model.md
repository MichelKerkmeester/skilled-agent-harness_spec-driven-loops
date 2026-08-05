---
title: "Git Plugin File-Layer Data Model"
description: "Complete file-layer contract for the Git plugin (obsidian-git): data.json settings keys with defaults and enums, commit message placeholders and the other artifacts the plugin reads and writes in the vault."
trigger_phrases:
  - "obsidian git data model"
  - "obsidian git data json schema"
  - "obsidian git settings keys"
  - "obsidian git default settings"
  - "obsidian git commit message placeholders"
  - "obsidian git conflict file"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Git Plugin File-Layer Data Model

The Git plugin stores configuration in one JSON file. It reads identity from git config and localStorage. It writes one vault file on conflicts. This document lists only keys verified in the installed `main.js` defaults object for version 2.38.6. No data.json exists in the vault yet, so the defaults below are the active configuration.

---

## 1. OVERVIEW

| Artifact | Path | Kind |
| --- | --- | --- |
| Settings | `<vault>/.obsidian/plugins/obsidian-git/data.json` | Editable JSON |
| Manifest | `<vault>/.obsidian/plugins/obsidian-git/manifest.json` | Read-only JSON |
| Repository | `<vault>/.git/` or the `basePath` folder | Never edited by the mode |
| Conflict list | `<vault>/conflict-files-obsidian-git.md` | Plugin-written markdown |
| Ignore rules | `<vault>/.gitignore` | Editable text |
| Commit identity | git config `user.name` and `user.email` | Read and report |
| Local preferences | Obsidian localStorage | Username, password, hostname, git binary path |

### Settings file shape

`data.json` is a single JSON object. Most keys are flat booleans, numbers or strings. Two keys hold nested objects: `hunks` and `lineAuthor`. The plugin persists the file through the standard Obsidian plugin API, so an invalid JSON file makes the plugin fall back to defaults on load.

## 2. BACKUP AND COMMIT SETTINGS

| Key | Default | Meaning |
| --- | --- | --- |
| `autoSaveInterval` | `0` | Minutes between automatic commit (or commit-and-sync). 0 disables |
| `autoPushInterval` | `0` | Minutes between automatic pushes when timers are split. 0 disables |
| `autoPullInterval` | `0` | Minutes between automatic pulls when timers are split. 0 disables |
| `differentIntervalCommitAndPush` | `false` | Split timers, one interval for commit and another for sync |
| `autoCommitOnlyStaged` | `false` | Commit only staged changes instead of everything |
| `autoBackupAfterFileChange` | `false` | Trigger a backup after every file change |
| `customMessageOnAutoBackup` | `false` | Ask for a custom message on each auto backup |
| `setLastSaveToLastCommit` | `false` | Tie the last-save marker to the last commit |
| `commitMessage` | `"vault backup: {{date}}"` | Message template for manual commits |
| `autoCommitMessage` | `"vault backup: {{date}}"` | Message template for automatic backups |
| `commitMessageScript` | `""` | Script run with `sh -c` to generate the message |
| `commitDateFormat` | `"YYYY-MM-DD HH:mm"` | Moment.js format for the `{{date}}` placeholder |
| `listChangedFilesInMessageBody` | `false` | List filenames affected by the commit in the body |

### Commit message placeholders

| Placeholder | Meaning | Verified |
| --- | --- | --- |
| `{{date}}` | Current date formatted with `commitDateFormat` | Yes |
| `{{hostname}}` | Device hostname, custom value wins | Yes |
| `{{numFiles}}` | Number of changed files in the commit | Yes |
| `{{files}}` | Names of changed files | Yes |

The message script receives the same placeholders where documented in the settings UI. The date format follows Moment.js syntax.

## 3. SYNC SETTINGS

| Key | Default | Meaning |
| --- | --- | --- |
| `syncMethod` | `"merge"` | How remote commits integrate into the local branch |
| `mergeStrategy` | `"none"` | How pull conflicts are auto-resolved |
| `pullBeforePush` | `true` | Pull on commit-and-sync before pushing |
| `disablePush` | `false` | Turn commit-and-sync into commit-only behavior |
| `autoPullOnBoot` | `false` | Pull automatically when Obsidian starts |
| `updateSubmodules` | `false` | Let commit-and-sync and pull take care of submodules |
| `submoduleRecurseCheckout` | `false` | Recurse checkout on submodules when the root switches branch |

### Enum values

| Key | Values | Verified |
| --- | --- | --- |
| `syncMethod` | `merge`, `rebase`, `reset` | Yes, reset is the "other sync service" that only moves HEAD |
| `mergeStrategy` | `none`, `ours`, `theirs` | Yes, ours favors local changes, theirs favors remote changes |

## 4. NOTIFICATION AND STATUS BAR SETTINGS

| Key | Default | Meaning |
| --- | --- | --- |
| `disablePopups` | `false` | Disable informative notifications |
| `showErrorNotices` | `true` | Show error notifications. The app toggle inverts the name |
| `disablePopupsForNoChanges` | `false` | Hide notifications when there are no changes |
| `showStatusBar` | `true` | Show the plugin status bar item, restart required |
| `showBranchStatusBar` | `true` | Show the branch name in the status bar, restart required |
| `changedFilesInStatusBar` | `false` | Show the count of modified files in the status bar |

## 5. SOURCE CONTROL VIEW SETTINGS

| Key | Default | Meaning |
| --- | --- | --- |
| `refreshSourceControl` | `true` on desktop | Auto refresh the Source Control view on file changes |
| `refreshSourceControlTimer` | `7000` | Milliseconds to wait after a file change before refreshing |
| `treeStructure` | `false` | Show a tree structure instead of a flat list |
| `showFileMenu` | `true` | Add plugin actions to the file context menu |
| `diffStyle` | `"split"` | Style of the Diff view |
| `showedMobileNotice` | `false` | Internal marker for the mobile notice |

`diffStyle` values: `split` (Split) and `git_unified` (Unified). On mobile the view forces the unified variant regardless of the stored value.

## 6. PATH SETTINGS

| Key | Default | Meaning |
| --- | --- | --- |
| `basePath` | `""` | Custom repository path inside the vault, the repository root moves here |
| `gitDir` | `""` | Override for the `GIT_DIR` environment variable, restart required |
| Git binary path | localStorage | Custom git executable, defaults to `git` from PATH |
| Extra environment | localStorage | Additional PATH entries, one per line, reload required |

On Windows the default git binary constant in the plugin is `C:\Program Files\Git\cmd\git.exe`. Path values use `/` separators in the settings UI.

## 7. HISTORY AND DIFF SETTINGS

| Key | Default | Meaning |
| --- | --- | --- |
| `authorInHistoryView` | `"hide"` | Show the author in the History view |
| `dateInHistoryView` | `false` | Show the commit date in the History view |
| `hunks.showSigns` | `false` | Show hunk signs in the editor gutter |
| `hunks.hunkCommands` | `false` | Add stage, reset and navigation commands for hunks |
| `hunks.statusBar` | `"disabled"` | Summary of line changes in the status bar |
| `lineAuthor.show` | `false` | Show line author information in the editor |
| `lineAuthor.followMovement` | `"inactive"` | Follow line movement across commits |
| `lineAuthor.authorDisplay` | `"initials"` | How the author name renders |
| `lineAuthor.showCommitHash` | `false` | Show the commit hash next to the author |
| `lineAuthor.dateTimeFormatOptions` | `"date"` | Date style for line author annotations |
| `lineAuthor.dateTimeFormatCustomString` | `"YYYY-MM-DD HH:mm"` | Custom date format when selected |
| `lineAuthor.dateTimeTimezone` | `"viewer-local"` | Timezone for the displayed date |
| `lineAuthor.coloringMaxAge` | `"1y"` | How far back commit colors apply |
| `lineAuthor.colorNew` | `{"r":255,"g":150,"b":150}` | Color for the newest commits |
| `lineAuthor.colorOld` | `{"r":120,"g":160,"b":255}` | Color for the oldest commits |
| `lineAuthor.textColorCss` | `"var(--text-muted)"` | CSS color for line author text |
| `lineAuthor.ignoreWhitespace` | `false` | Ignore whitespace when attributing lines |

### Enum values

| Key | Values | Verified |
| --- | --- | --- |
| `authorInHistoryView` | `hide`, `initials` | Yes |
| `hunks.statusBar` | `disabled`, `colored`, `monochrome` | Yes |
| `lineAuthor.followMovement` | `inactive`, `same-commit`, `all-commits` | Yes |
| `lineAuthor.authorDisplay` | `initials`, `first name` | Partial, full set VERIFY |
| `lineAuthor.dateTimeTimezone` | `viewer-local` confirmed | Full set VERIFY |
| `lineAuthor.coloringMaxAge` | `1y` confirmed | Full set VERIFY |

## 8. OTHER ARTIFACTS

### Conflict list file

`<vault>/conflict-files-obsidian-git.md` is written at the vault root when a merge fails. The plugin writes it through the vault adapter and opens it in a tab. It lists files that need manual resolution. The mode reads it and reports, it never edits it.

### git config identity

The plugin settings expose `user.name` and `user.email` as git config values. The mode reads them to report commit identity. Writing them through git config is possible but the settings app is the intended path.

### Local storage

Username, password, hostname and the custom git binary path persist in Obsidian localStorage, not in data.json. The field names read from the installed `main.js` are `username`, `password`, `hostname`, `gitPath` (plus `git-show-password`), each fetched as `localStorage.getItem(prefix + field)`; the exact runtime key prefix is VERIFY. The password field is write-only in the app and never displayed again.

### Credential helper

The plugin uses an askpass helper script for credential prompts. The script name constant is `.obsidian_askpass.sh`, its location is VERIFY.

## 9. WHAT THE AI MUST NOT DO

- Never run destructive git operations on a real vault.
- Never edit files inside `.git/`.
- Never rewrite history, reset branches or delete repositories.
- Never add invented settings keys to data.json.
- Never claim a sync or push outcome from settings alone, the app must confirm it.
- Never store credentials in any file the mode writes.
- Never treat a missing data.json as a broken install, defaults are valid state.
