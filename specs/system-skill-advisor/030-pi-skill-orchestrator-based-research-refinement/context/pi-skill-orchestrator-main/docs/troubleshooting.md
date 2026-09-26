# Troubleshooting

[Back to the main README](../README.md) · [Documentation index](README.md)

## `/skill:` autocomplete is missing

First test Pi without extensions:

```bash
pi --no-extensions
```

Type:

```text
/skill:
```

If Pi still does not show native skill autocomplete, check your Pi settings. Skill Orchestrator does not change `enableSkillCommands` or `settings.json`.

## The manager says no Pi skills are discovered

Confirm Pi can see your skills without Skill Orchestrator.

Run Pi normally and test `/skill:`.

Then reload resources:

```text
/reload
```

## A group shortcut does not appear

Open `/skill`. Edit the group with `R`. Confirm its short shortcut is enabled.

A disabled short alias still allows:

```text
/skill:Group_Name
```

## `/skill-profile Profile_Name` does not switch profiles

Use the canonical colon syntax:

```text
/skill-profile:Profile_Name
```

Use bare `/skill-profile` to open the selector.

## A group is active but the model needs another capability

This is expected. Groups are preferred search scopes, not permanent workflow restrictions.

The model can call `skill_search` with global scope when no active candidate is suitable.

The active group remains active after the fallback root loads.

## A manual-only skill does not appear in `skill_search`

Check the skill frontmatter for:

```yaml
disable-model-invocation: true
```

That flag means the model must not discover or invoke the skill automatically.

You can select it explicitly:

```text
/skill:skill-name
```

## A save fails

The manager keeps unsaved state visible and reports the failure.

Check write access to:

```text
~/.pi/agent/
~/.pi/agent/skill-profiles/
```

Do not replace profile files with symlinks. Active profile files must be regular files.

## The extension warns about Pi's skill catalog format

A Pi update may have changed the native system-prompt catalog.

Do not assume zero-eager-catalog stripping still works. Run the compatibility audit described in [compatibility.md](compatibility.md).

## Test the local source directly

From the repository:

```bash
npm test
npm run check
pi -e ./src/index.ts
```

This exposes most extension startup problems before you install the package.
