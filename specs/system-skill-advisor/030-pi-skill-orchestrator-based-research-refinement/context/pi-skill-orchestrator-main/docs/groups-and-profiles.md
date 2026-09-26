# Groups and profiles

[Back to the main README](../README.md) · [Documentation index](README.md)

## Why use groups

A large skill library can cover many unrelated jobs. A research task does not need deployment skills. A coding task does not need audio-editing skills. A writing task does not need debugging skills.

A group gives Skill Orchestrator a smaller place to search first.

Example groups:

```text
Research
Writing
Documents
Planning
Debugging
Testing
Images
Audio
Release
```

A group does not preload its skills. It does not add every member name or description to the LLM system prompt.

When you activate a group, the system prompt gets only a small scope stub. `skill_search` uses the group's skill metadata outside model context and returns only a few matches when the model asks for them.

## Why use profiles

A profile is a complete saved Skill Orchestrator setup.

Each profile has its own:

- profile name and description;
- groups;
- group memberships;
- configured autoload dependencies;
- automatic-dependency suppressions;
- `catalogDescriptionMax` setting.

This is useful when the same Pi installation serves different kinds of work.

Examples:

```text
Daily Work profile
  Research
  Writing
  Documents
  Planning

Software Development profile
  Architecture
  Debugging
  Testing
  Review
  Release

Media Creation profile
  Writing
  Images
  Audio
  Video
  Publishing

System Administration profile
  Diagnostics
  Linux
  Networking
  Containers
  Deployment
```

Switching profiles changes the preferred skill organization. It does not install, uninstall, copy, or edit the underlying skills.

## Groups are preferred scopes, not hard walls

An active group tells the model where to search first.

If that group has a useful match, the model can load one matching skill.

If it does not, Skill Orchestrator can perform a bounded global fallback search. Only the few fallback results enter model context. The active group stays selected.

```text
active group
    |
    v
search group first
    |
    +-- useful match --> load one skill
    |
    +-- no useful match --> bounded global fallback
                              |
                              v
                         load one skill
```

This keeps normal work focused without blocking a valid skill that happens to live outside the current group.

## Profiles are also lazy scopes

When a profile is active but no group is selected, its preferred search scope is the union of the skills assigned to its groups.

A new empty profile has zero automatic candidates. It does not silently fall back to advertising the complete installed catalog in the system prompt.

The model can still use bounded global fallback when a task needs a capability that is outside the profile.

## Create a group

Open the manager:

```text
/skill
```

Press `N`.

Enter a name and description. Choose whether the short group alias is enabled.

After the group is created, press `Tab` to move to the Skills pane. Use `Space` to add or remove skills.

## Activate a group

Select the group in the manager and press `Enter`.

You can also type:

```text
/skill:Research
```

If the short alias is enabled, you can use:

```text
/Research
```

Group command tokens use underscores for spaces.

## Create a profile

Open the manager and press `P`.

Enter the profile name and description.

A new profile starts with no groups or memberships. Add only the organization you want for that profile.

## Switch profiles

Open the profile selector:

```text
/skill-profile
```

Or switch directly:

```text
/skill-profile:Software_Development
```

The direct-switch form uses a colon. `/skill-profile Software_Development` is not the direct-switch syntax.

## What switching does not do

Switching a group or profile does not:

- load all member skill bodies;
- place all member descriptions in the system prompt;
- change Pi's `settings.json`;
- change `enableSkillCommands`;
- edit installed `SKILL.md` files;
- block recursive dependencies outside the active scope.

For the exact storage format, read [Configuration reference](configuration.md). For the search rules, read [Architecture and context model](architecture.md).
