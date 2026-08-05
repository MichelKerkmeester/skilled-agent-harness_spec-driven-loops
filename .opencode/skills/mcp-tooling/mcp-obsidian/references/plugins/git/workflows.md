---
title: "Git Plugin File-Layer Workflows"
description: "Safe file-layer recipes for the Git plugin (obsidian-git): read plugin state, validate settings, edit with backup discipline, preview commit messages, manage ignore rules, inspect repository health and report conflicts."
trigger_phrases:
  - "read obsidian git settings"
  - "change obsidian git backup interval"
  - "update obsidian git commit message"
  - "check obsidian git repo status"
  - "add file to obsidian git ignore"
  - "obsidian git conflict file check"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Git Plugin File-Layer Workflows

These recipes operate the plugin through its files and read-only git commands. Every settings write takes a backup first. Every state-changing git validation happens in a throwaway repository, never in the real vault.

---

## 1. OVERVIEW

### Operating sequence

1. Read the settings file `.obsidian/plugins/obsidian-git/data.json`. If it is absent, state that defaults apply.
2. Inspect the repository surface: `.git` presence, `.gitignore`, the conflict file, git config identity.
3. Decide the file-layer action and take a backup copy before any write.
4. Apply the edit, then read the file back and validate it.
5. Report what only the app can confirm, such as push results and view rendering.

### Read-only git allowlist

These commands inspect the real vault repository and change nothing.

```bash
git status --short
git log --oneline -n 5
git remote -v
git branch --show-current
git diff --stat
```

Anything outside this allowlist counts as state-changing and moves to a throwaway repository.

## 2. RECIPES

### Read the plugin state

1. Read `<vault>/.obsidian/plugins/obsidian-git/data.json`.
2. Confirm the installed version from `manifest.json`.
3. Run the read-only allowlist commands from the repository root.
4. Read the conflict file when present.
5. Summarize: version, settings of interest, repo health, conflicts, identity.

### Validate the settings file

1. Confirm the file parses as JSON.
2. Confirm every key exists in the key table from `data-model.md`.
3. Confirm enum keys hold allowed values: `syncMethod`, `mergeStrategy`, `diffStyle`, `authorInHistoryView`, `hunks.statusBar`.
4. Confirm numeric keys are numbers: intervals, timers, RGB color components.
5. Report the verdict. An invalid file means the plugin loads defaults, so the fix is a restore or a rewrite from the defaults table.

### Change the automatic backup interval

Backup first, then edit one key.

Before:

```json
{
  "autoSaveInterval": 0
}
```

Change `autoSaveInterval` to the requested minutes, for example 10.

After:

```json
{
  "autoSaveInterval": 10
}
```

Preserve every other key in the file. When the user wants split timers, also set `differentIntervalCommitAndPush` to `true` and choose `autoSaveInterval` for commit plus `autoPushInterval` for push.

### Change the automatic commit message

Backup first, then edit the message template.

Before:

```json
{
  "autoCommitMessage": "vault backup: {{date}}"
}
```

After:

```json
{
  "autoCommitMessage": "vault backup {{hostname}} {{date}}"
}
```

Use only verified placeholders: `{{date}}`, `{{hostname}}`, `{{numFiles}}`, `{{files}}`. The `{{date}}` output follows `commitDateFormat`, which uses Moment.js syntax. Preview the rendered message before claiming the change is right.

### Preview the next auto commit message

1. Read `autoCommitMessage` and `commitDateFormat`.
2. Render `{{date}}` with the configured format and the current time.
3. Substitute `{{hostname}}` from the hostname setting or the OS hostname.
4. Show the preview to the user. Never claim the plugin rendered it, the preview is a file-layer computation.

### Change push and pull behavior

Backup first, then edit the chain keys.

| Intent | Edit |
| --- | --- |
| Stop pushing on commit-and-sync | Set `disablePush` to `true` |
| Pull before every push | Keep `pullBeforePush` as `true` |
| Pull on Obsidian startup | Set `autoPullOnBoot` to `true` |
| Auto push on a timer | Set `autoPushInterval` to minutes and `differentIntervalCommitAndPush` to `true` |

After editing, verify the chain reads the way the user asked: commit, pull, push order and the interval values.

### Add a file to the ignore rules

1. Read `.gitignore` at the repository root.
2. Append one entry per line with a trailing newline.
3. Match the user's intent with a pattern, for example a folder name or a glob.
4. Read the file back and report the exact entries added.

Before (last line of `.gitignore`):

```text
.obsidian/workspace.json
```

After:

```text
.obsidian/workspace.json
private-notes/
```

The mode never rewrites existing entries and never deletes the file.

### Report conflicts

1. Read `<vault>/conflict-files-obsidian-git.md` when it exists.
2. List the files the plugin could not auto-merge.
3. Explain the resolution options in terms of `mergeStrategy` and manual editing.
4. Never edit the conflict file and never resolve the conflict with git commands on the real vault.

### Verify repository health read-only

1. Confirm `.git` exists at the vault root or at the `basePath` folder.
2. Run `git status --short` and check for unexpected changes.
3. Run `git log --oneline -n 5` and confirm recent backups.
4. Run `git remote -v` and confirm the remote matches user intent.
5. Report findings. When the repository is missing, the plugin can initialize it through its own commands, which the user triggers in the app.

## 3. BACKUP DISCIPLINE

Every settings write follows this pattern.

1. Copy `.obsidian/plugins/obsidian-git/data.json` to `data.json.bak` beside it.
2. Apply the edit to the original file.
3. Read the edited file back and validate JSON plus key names.
4. Keep the backup until the user confirms the behavior, then report it for cleanup.

The same rule applies to `.gitignore`: copy before appending.

## 4. VERIFYING

- After any write: read the file back and validate the JSON parse.
- Confirm only intended keys changed, compare against the backup.
- Confirm enum values match the allowed lists.
- Confirm intervals read as numbers and are greater than 0 when the user expects scheduled automation.
- Confirm the chain keys match the user intent: `disablePush`, `pullBeforePush`, `autoPullOnBoot`.
- Confirm the rendered commit message preview contains no unresolved placeholder tokens.
- Confirm no file outside the scoped write target changed.
- State clearly which outcomes still need the app: push success, view rendering, credential prompts.

## 5. LIMITS

- The mode verifies files, not sync results. A settings edit proves intent, not an executed push.
- Credential storage and retrieval stay in the app and in localStorage, the mode never writes them.
- Repository history operations and destructive commands are out of scope for the real vault.
- Interval automation requires Obsidian to run with the plugin enabled. A running app is a precondition the mode cannot create.
