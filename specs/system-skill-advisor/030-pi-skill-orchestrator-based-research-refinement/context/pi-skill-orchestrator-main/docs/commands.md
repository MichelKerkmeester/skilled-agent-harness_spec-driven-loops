# Command reference

[Back to the main README](../README.md) · [Documentation index](README.md)

## Manager commands

### `/skill`

Open the Skill Orchestrator manager.

### `/skill-manager`

Open the same manager.

### `/skill-config`

Show the manager manifest path and active profile path.

## Profile commands

### `/skill-profile`

Open the profile selector.

### `/skill-profile:<Profile_Name>`

Switch directly to one saved profile.

Spaces in names use underscores in command tokens.

Example:

```text
/skill-profile:Software_Development
```

`/skill-profile Profile_Name` is not the direct-switch syntax. The extension warns when that form is used.

## Skill and group namespace

### `/skill:<Skill_Name> [task]`

Explicitly load one installed skill and its recursive dependencies.

### `/skill:<Group_Name>`

Activate one group as the preferred lazy search scope. No group member bodies are bulk loaded.

### `/skill:<Group_Name> <task>`

Activate the group. Then send only the supplied task into the model turn.

The model can search the group and choose one relevant skill.

## Optional short group aliases

Each group can enable or disable its short alias.

### `/<Group_Name>`

Activate the group scope.

### `/<Group_Name> <task>`

Activate the group and send the task.

### `/<Group_Name>:<skill> [task]`

Explicitly load one member skill and its recursive dependencies.

A disabled short alias does not affect `/skill:<Group_Name>`.

## Token Saver command

### `/token-saver [on|off|status|stats|clear]`

Control the optional Token Saver for the active profile.

- No argument toggles it.
- `on` enables it.
- `off` disables it.
- `status` shows the current state and session savings.
- `stats` shows detailed session counters.
- `clear` clears recovery data, caches, adaptive feedback, deferred-tool state, and counters without changing the on/off setting.

Token Saver is off by default. The setting is saved in the active Skill Orchestrator profile.

## Model-facing tools

These are tools for the LLM. They are not commands that a user must type.

### `skill_search`

Search skill metadata without loading `SKILL.md` bodies.

Parameters:

| Parameter | Meaning |
| --- | --- |
| `query` | Required search text. |
| `limit` | Optional result limit. Valid range is 1 to 8. Default is 5. |
| `scope` | Optional `active` or `global`. Default is `active`. |

The active search uses the current group or profile first. Global search is bounded and does not change the active scope.

### `skill`

Load one exact selected root skill and its recursive dependencies.

An outside-scope root is allowed only when a prior global fallback search surfaced that exact name. Explicit user commands are separate and can directly select an installed skill.


### `token_tool_search`

This tool exists only while Token Saver is on. It searches metadata for non-core tool schemas that Token Saver deferred from the active model tool list. Matching tools are activated only when needed.

Parameters:

| Parameter | Meaning |
| --- | --- |
| `query` | Required capability or tool behavior. |
| `limit` | Optional number of matching tools to activate. Valid range is 1 to 5. Default is 3. |

Pi's core working tools, `skill`, `skill_search`, and Token Saver's own discovery/recovery tools stay active.

### `token_retrieve`

This tool exists only while Token Saver is on. It recovers exact original text for a compacted tool result.

Parameters:

| Parameter | Meaning |
| --- | --- |
| `id` | Required recovery ID shown as `full=<id>`. |
| `startLine` | Optional 1-based first line. Default is 1. |
| `maxLines` | Optional line count. Default is 240. Maximum is 1000. |

Prefer a small line range. Recover the full output only when the exact omitted text is required.
