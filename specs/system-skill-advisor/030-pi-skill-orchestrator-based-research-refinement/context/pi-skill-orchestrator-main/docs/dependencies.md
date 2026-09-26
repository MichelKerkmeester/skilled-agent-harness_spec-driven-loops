# Dependency loading

[Back to the main README](../README.md) · [Documentation index](README.md)

## Basic rule

A selected root skill can require other skills. Skill Orchestrator resolves those dependencies recursively.

Dependencies are not limited by the active group or profile.

## Automatic dependency detection

The resolver detects explicit references to installed skill names in a `SKILL.md` body.

Supported forms include patterns such as:

```text
/skill:other-skill
skill("other-skill")
invoke other-skill
use the other-skill skill
../other-skill/SKILL.md
```

The detector is conservative. It ignores obvious negated instructions such as:

```text
Do not use other-skill.
Never call skill("other-skill").
```

Only installed Pi skill names can become automatic dependencies.

When you open the TUI manager, Skill Orchestrator reads installed skill bodies locally so it can show these automatically detected dependency edges. That manager-only inspection does not load the bodies into the LLM context. If a body cannot be read during manager inspection, its automatic-dependency preview is empty. Runtime loading is stricter: a body read failure is surfaced instead of silently skipping the dependency resolution.

## User-configured autoload

You can add a dependency manually in the manager.

Select a skill. Press `A`. Press `Space` on the dependency you want to autoload.

Configured autoload dependencies are added to automatic dependencies.

## Ignore one automatic dependency

In the autoload editor, press `I` on an automatically detected dependency.

This adds a suppression for that automatic edge.

The suppression does not delete or change either skill file.

## Manual-only skills

Pi supports `disable-model-invocation: true`.

Skill Orchestrator keeps those skills out of automatic model discovery. It also keeps them out of automatic dependency detection.

A user can still explicitly select a manual-only skill with `/skill:<name>`.

A user-configured dependency can also name a manual-only skill because that dependency was explicitly configured by the user.

## Load order

Dependencies load before the skill that needs them.

Shared dependencies load once.

Cycles are detected and reported. Missing dependencies are also reported.
