---
title: "Git Plugin File-Layer Index"
description: "Entry point for operating the Git plugin (obsidian-git) at the file layer: plugin identity, file-layer surface, settings location, safety doctrine and links to the sibling reference files."
trigger_phrases:
  - "obsidian git plugin"
  - "obsidian git backup"
  - "obsidian git settings"
  - "obsidian git data json"
  - "obsidian git commit and sync"
  - "git vault repository"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Git Plugin File-Layer Index (`obsidian-git`)

The `mcp-obsidian` mode operates this plugin by reading and editing its `data.json` settings and by inspecting repository state with read-only git commands. It never runs state-changing git operations on a real vault.

---

## 1. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `obsidian-git` | Plugin directory name plus enablement entry |
| Display name | **Git** | Current manifest name |
| Author | Vinzent (github.com/Vinzent03) | Source of behavior facts |
| Version installed | 2.38.6 | Verified in the vault manifest.json |
| Desktop only | No | `isDesktopOnly: false` in manifest.json |
| Distribution | Obsidian community plugin | Enablement entry lives in `community-plugins.json` |
| State file | `<vault>/.obsidian/plugins/obsidian-git/data.json` | The settings surface for the mode |
| State file present | Not yet | The vault has no data.json, so built-in defaults apply |

---

## 2. WHAT IT DOES

Turns the vault into a git repository. The repository root is the vault root when the repository is initialized. Automatic backup commits changed files on an interval measured in minutes. Commit-and-sync can pull before push and push after commit. When local and remote history diverge, the plugin merges, rebases or hard-resets per the `syncMethod` setting. It can also auto-resolve conflicts per `mergeStrategy`. Conflicted files are listed in a file written at the vault root. The plugin integrates with the built-in Source Control view and registers its own commands, a History view and a Diff view.

### Core automation loop

1. Interval timer fires after `autoSaveInterval` minutes.
2. The plugin stages changes and commits with the auto commit message.
3. Per settings it pulls, then pushes.
4. Results surface as notifications or status bar text.

With `differentIntervalCommitAndPush` enabled, commit and push run on separate timers.

The plugin registers three views: the Source Control view, the History view and the Diff view. All three render in the app, none of them needs file-layer work from the mode.

---

## 3. FILE-LAYER SURFACE

| Layer | Path or artifact | Operable by AI |
| --- | --- | --- |
| Settings | `<vault>/.obsidian/plugins/obsidian-git/data.json` | **Yes**: read and edit with backup discipline |
| Identity | `<vault>/.obsidian/plugins/obsidian-git/manifest.json` | Read-only |
| Repository | `<vault>/.git/` or `basePath` location | **No**: never touch internals |
| Conflict list | `<vault>/conflict-files-obsidian-git.md` | Read and report only |
| Ignore rules | `<vault>/.gitignore` | Yes: append entries |
| Commit identity | git config `user.name` and `user.email` | Read and report |
| Credentials and hostname | Obsidian localStorage | Read-only for the mode, exact key VERIFY |

### In-app surfaces the mode does not drive

| Surface | Reason the mode stays out |
| --- | --- |
| Source Control view | Render only, the same state is visible at the file layer |
| History and Diff views | Render only |
| Credential prompts | Interactive and sensitive |
| Delete repository command | Irreversible |
| Discard all changes command | Irreversible |
| Raw command palette | Unbounded by design, out of the allowlist |

---

## 4. PLUGIN COMMANDS

Every command id below is verified from the installed `main.js`. The palette names are quoted as registered. Commands marked CAUTION are irreversible and stay out of the mode's reach.

### Backup and commit commands

| Palette name | Command id | Mode note |
| --- | --- | --- |
| Commit-and-sync | `push` | The full chain: stage, commit, pull, push |
| Commit-and-sync and then close Obsidian | `backup-and-close` | Chain plus app close |
| Commit-and-sync with specific message | `commit-push-specified-message` | Chain with a custom message |
| Commit all changes | `commit` | Commit only |
| Commit all changes with specific message | `commit-specified-message` | Commit with a custom message |
| Commit | `commit-smart` | Smart commit behavior |
| Commit staged | `commit-staged` | Staged files only |
| Commit with specific message | `commit-smart-specified-message` | Smart commit with a message |
| Commit staged with specific message | `commit-staged-specified-message` | Staged files with a message |
| Amend staged | `commit-amend-staged-specified-message` | Rewrites the last commit, caution |

### Sync and remote commands

| Palette name | Command id | Mode note |
| --- | --- | --- |
| Push | `push2` | Push only |
| Pull | `pull` | Pull only |
| Fetch | `fetch` | Fetch without merge |
| Switch to remote branch | `switch-to-remote-branch` | Branch switch |
| Edit remotes | `edit-remotes` | Remote configuration |
| Remove remote | `remove-remote` | Remote removal |
| Set upstream branch | `set-upstream-branch` | Tracking configuration |

### Branch and repository commands

| Palette name | Command id | Mode note |
| --- | --- | --- |
| Switch branch | `switch-branch` | Branch switch |
| Create new branch | `create-branch` | Branch creation |
| Delete branch | `delete-branch` | Branch removal, caution |
| Initialize a new repo | `init-repo` | Repository creation |
| Clone an existing remote repo | `clone-repo` | Repository creation |
| CAUTION: Delete repository | `delete-repo` | Irreversible, never for the mode |
| CAUTION: Discard all changes | `discard-all` | Irreversible, never for the mode |

### File and staging commands

| Palette name | Command id | Mode note |
| --- | --- | --- |
| Stage current file | `stage-current-file` | Staging |
| Unstage current file | `unstage-current-file` | Unstaging |
| List changed files | `list-changed-files` | Status summary |
| Add file to .gitignore | `add-to-gitignore` | Ignore rules, file-layer alternative exists |
| Edit .gitignore | `edit-gitignore` | Opens the ignore file |

### View and navigation commands

| Palette name | Command id | Mode note |
| --- | --- | --- |
| Open source control view | `open-git-view` | View |
| Open history view | `open-history-view` | View |
| Open diff view | `open-diff-view` | View |
| Open file on GitHub | `view-file-on-github` | Remote link |
| Open file history on GitHub | `view-history-on-github` | Remote link |
| Toggle line author information | `toggle-line-author-info` | Editor overlay |

### Hunk and routine commands

| Palette name | Command id | Mode note |
| --- | --- | --- |
| Stage hunk | `stage-hunk` | Hunk staging |
| Reset hunk | `reset-hunk` | Hunk reset |
| Preview hunk | `preview-hunk` | Hunk preview |
| Go to next hunk / Go to previous hunk | Present per settings text, ids VERIFY | Navigation helper for hunk commands |
| Pause/Resume automatic routines | `pause-automatic-routines` | Master switch for automation |
| Raw command | `raw-command` | Unbounded git input, out of the allowlist |

---

## 5. SETTINGS LOCATION

Settings live in `.obsidian/plugins/obsidian-git/data.json` as a JSON object with flat keys plus two nested objects, `hunks` and `lineAuthor`. This vault has no data.json yet, so every key uses its built-in default until the user changes it in the app. The full key table with defaults and enums lives in `data-model.md`. The mode must read the file before any edit and must never assume a key exists.

---

## 6. WHEN TO USE THIS REFERENCE SET

Use this set when the user asks about Obsidian Git backup, commit-and-sync behavior, vault repository state, commit messages, ignore rules or pull and push failures. Use it when a task reads or edits the plugin settings file. Use it before any workflow that inspects vault repository state. Use it for the plugin commands named in `workflows.md` when the mode must explain or verify behavior at the file layer.

---

## 7. REFERENCE FILES

| File | Contents |
| --- | --- |
| `data-model.md` | Exact data artifacts, JSON keys, defaults, enums and commit message placeholders |
| `workflows.md` | Read, validate and modify recipes with backup discipline and before/after patterns |
| `troubleshooting.md` | Failure modes, diagnosis sequence and named validation checkpoints |

---

## 8. SAFETY DOCTRINE

The mode never runs destructive git operations on a real vault. Delete repository, discard all changes and history rewrites are out of reach. State-changing git workflows are validated in throwaway repositories only. Read-only git inspection of the real vault is allowed against an explicit allowlist in `workflows.md`. Every settings edit takes a backup copy first. Any unverified detail is marked VERIFY and stays out of copyable examples.

---

## 9. GOTCHAS

- **Defaults apply until a data.json exists.** Absence of the file is the default configuration, not an error.
- **Interval 0 disables automation.** Auto save, auto push and auto pull all default to 0 minutes.
- **Commit-and-sync is a chain.** Stage everything, commit, then pull and push per settings.
- **The conflict file is written at vault root.** It lists files the plugin could not auto-merge.
- **Re-read data.json before editing.** The user can change settings in the app at any time.
- **File-layer verification is read-back only.** Rendering and sync outcomes need the app running.
- **Push is optional by default of the user, not the plugin.** `disablePush` and `pullBeforePush` control the chain.
- **Settings label names invert some keys.** For example the toggle "Disable error notifications" controls `showErrorNotices`.
