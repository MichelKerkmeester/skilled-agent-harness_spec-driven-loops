# Configuration reference

[Back to the main README](../README.md) · [Documentation index](README.md)

## Files

Skill Orchestrator uses one manager manifest and one JSON file for each profile.

Manager manifest:

```text
~/.pi/agent/skill-manager.json
```

Profile directory:

```text
~/.pi/agent/skill-profiles/
```

Active profile example:

```text
~/.pi/agent/skill-profiles/default.json
```

## Manager manifest

Example:

```json
{
  "version": 2,
  "activeProfileId": "default"
}
```

`activeProfileId` selects the current profile file.

## Profile file

Example:

```json
{
  "version": 1,
  "profileId": "code-review",
  "profileName": "Code Review",
  "profileDescription": "Architecture and code-review workflows",
  "groups": [
    {
      "id": "review",
      "name": "Review",
      "description": "Architecture and code review workflows",
      "shortcutEnabled": true,
      "order": 10
    }
  ],
  "memberships": {
    "architecture-review": ["review"]
  },
  "autoload": {
    "tdd": ["verify-before-done"]
  },
  "ignoreAutoDetected": {},
  "catalogDescriptionMax": 160,
  "tokenSaverEnabled": false
}
```

## Fields

### `profileId`

This is the stable file identity. Renaming a profile does not change this ID.

### `profileName`

This is the name shown in the UI and profile commands.

### `profileDescription`

This is a short user description. The extension normalizes it to one safe line.

### `groups`

This contains group definitions.

Each group has:

- a stable `id`;
- a display `name`;
- a one-line `description`;
- `shortcutEnabled`;
- an `order` value.

### `memberships`

Each key is an installed skill name. The value is a list of group IDs.

A skill can belong to more than one group.

### `autoload`

Each key is a root skill name. The value is a list of dependencies that must load with that skill.

### `ignoreAutoDetected`

Use this to suppress automatic dependency edges that you do not want.

### `catalogDescriptionMax`

This limits the description length returned by `skill_search`.

Valid normalized range:

```text
0..240
```

`0` returns names only.

### `tokenSaverEnabled`

This turns the optional Token Saver on or off for this profile.

Accepted stored values are strict booleans:

```json
"tokenSaverEnabled": true
```

The default is `false`. Strings such as `"true"` do not enable it.

When enabled, the extension can compact large tool results, defer non-core tool schemas, shorten long top-level tool descriptions at the provider boundary, and use conservative output/effort shaping. Exact recovery data stays in session memory.

## Save behavior

The manager autosaves changes.

Writes are atomic. Temporary files are cleaned up after a failed write.

The extension rejects invalid state instead of silently replacing it. This includes invalid JSON, unsafe profile IDs, duplicate profile command tokens, unsupported future versions, and unsafe symlink targets.

## Legacy migration

Older single-file version 1 configuration is migrated to a `Default` profile.

Before the manager manifest is replaced, the old file is copied to:

```text
~/.pi/agent/skill-manager.json.legacy-v1.json
```

The migration refuses an unsafe backup destination.

## What the extension does not edit

The extension does not edit:

- `~/.pi/agent/settings.json`;
- `enableSkillCommands`;
- installed third-party skill files;
- third-party `SKILL.md` frontmatter.
