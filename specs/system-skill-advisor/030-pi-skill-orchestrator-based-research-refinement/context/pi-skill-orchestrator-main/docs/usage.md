# Usage

[Back to the main README](../README.md) · [Documentation index](README.md)

## Open the manager

Run:

```text
/skill
```

`/skill-manager` opens the same manager.

## Create a profile

Press `P` in the manager. Enter a profile name and description.

A new profile starts empty. It does not expose all installed skills to the model.

## Create a group

Press `N` in the manager. Enter the group name and description. Choose whether the short group alias is enabled.

A group can contain zero or more installed skills.

## Add skills to a group

Select the group. Press `Tab` to move to the Skills pane. Select a skill. Press `Space` to add or remove it.

The skill list still shows installed skills that are not members of the selected group. Membership is a marker, not a filter.

## Activate a group

With the Groups pane selected, press `Enter`.

You can also type:

```text
/skill:Research
```

This makes the group the preferred search scope. It does not load every member.

## Run a task in a group scope

You can activate a group and send a task in one command:

```text
/skill:Research compare these sources and summarize the differences
```

The model receives the task. The model can search the active group lazily. It can then load one selected skill.

## Use the short group alias

If the group shortcut is enabled:

```text
/Research
```

You can also send a task:

```text
/Research compare these sources and summarize the differences
```

## Load one exact skill yourself

Use:

```text
/skill:architecture-review review this change
```

This loads the selected skill and its recursive dependency closure.

## Load one skill through a group alias

If the group shortcut is enabled and the skill belongs to that group:

```text
/Research:web-research compare these sources and summarize the differences
```

This is an explicit user selection. The model does not need to discover the root skill first.

## Switch profiles

Open the selector:

```text
/skill-profile
```

Or switch directly:

```text
/skill-profile:Software_Development
```

Use the colon form for direct switching. Do not use `/skill-profile Software_Development` as a direct switch.

## Use Token Saver

Token Saver is separate from lazy skill loading. Lazy skills are always part of Skill Orchestrator's normal architecture. Token Saver is optional and off by default.

Enable it for the current profile:

```text
/token-saver on
```

Or press `T` in the manager.

When enabled, it can:

- compact large tool results before the next model call;
- preserve exact compacted originals for line-range recovery;
- collapse exact repeated outputs;
- keep explicit JSON/machine-readable output exact;
- keep source reads exact when the current task clearly requires editing or patching code;
- defer non-core tool schemas behind `token_tool_search`;
- shorten unusually long top-level tool descriptions without changing parameter schemas;
- ask the model to stay concise;
- lower an existing reasoning-effort field only after routine successful tool continuations.

Inspect it with:

```text
/token-saver status
/token-saver stats
```

If compacted output omitted a required detail, the model can call `token_retrieve` with the recovery ID.

See [Token Saver](token-saver.md) for the full safety model.

## Search behavior

The model-facing search starts with the active scope.

If no active-scope match exists, the extension can perform one bounded global fallback search automatically.

If active results exist but are not useful, the model can request a bounded global search explicitly.

A global fallback does not activate another group. It does not load every skill in another group. It returns only a few candidate names and descriptions.

## Manager keys

| Key | Action |
| --- | --- |
| `Tab` | Switch Groups and Skills panes. |
| Arrow keys | Move the selection. |
| `Enter` | Activate a group or load one selected skill. |
| `Space` | Toggle skill membership in the selected group. |
| `A` | Edit autoload dependencies. |
| `N` | Create a group. |
| `R` | Edit a group. |
| `D` | Delete a group after confirmation. |
| `/` | Search skills. |
| `T` | Toggle Token Saver for the active profile. |
| `P` | Create a profile. |
| `L` | Open the profile list. |
| `?` | Open help. |
| `Esc` | Close. |

Changes autosave as you make them.
