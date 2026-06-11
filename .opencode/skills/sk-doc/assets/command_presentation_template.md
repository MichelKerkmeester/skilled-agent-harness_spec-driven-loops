---
title: Command Presentation Contract Template
description: Skeleton for the _presentation.md asset of a mode-based workflow command, the display source of truth that a thin command router loads.
trigger_phrases:
  - "command presentation contract template"
  - "presentation router split asset"
  - "startup prompt dashboard results template"
  - "thin router presentation skeleton"
importance_tier: normal
contextType: general
---

# Command Presentation Contract Template

Skeleton for a `assets/<ns>_<command>_presentation.md` file. In the presentation/router split (see [`command_template.md`](command_template.md) § Mode-Based Command Template), the command `.md` is a thin router that owns mode resolution and routing, the `_auto.yaml` / `_confirm.yaml` assets own workflow execution, and this file owns everything the user sees. Copy the body below into the new asset and fill the bracketed parts. Keep all visible wording, reply formats, and templates here and nowhere else.

---

## How To Use

1. The router lists this file under its Owned Assets table and loads it before showing any prompt, dashboard, checkpoint, or result.
2. Move every display-only block out of the command `.md` into the matching section below, verbatim in meaning.
3. Leave routing logic, mode resolution, and gates in the router. This file describes what to show, not how to route.

---

## Template Body (copy below this line)

```markdown
# <Command> Presentation Contract

Presentation source of truth for `/<namespace>:<command>`. The router owns mode selection and asset loading. Workflow YAML owns execution. This file owns visible prompts, dashboard layout, and result displays.

## 1. Startup Presentation

For `:confirm` or no suffix, the consolidated setup prompt is the first visible response. Ask all applicable questions once, then wait.

For `:auto`, do not show the consolidated prompt by default. Resolve setup through the auto-resolution rules below; ask targeted questions only for fields that cannot be defaulted.

### Auto Pre-Bound Setup Answers
[Optional marker block accepted in the prompt body, with the field schema. Unknown fields warn; malformed lines are parse errors.]

### Auto Resolution Table
| Field | Required | Default | Targeted-ask when |
|-------|----------|---------|-------------------|
| [field] | [Yes/No] | [default] | [condition] |

### Consolidated Prompt Template
[The exact question wording and the reply format, e.g. "Reply: B, A, C".]

### Auto Fail-Fast Display
[What to show when required auto inputs are missing, ending with STATUS=FAIL ERROR="...".]

## 2. Dashboard / Checkpoint Layout
[Progress panel and any mid-workflow checkpoint display templates.]

## 3. Results Display

### Success
[Success template, ending with STATUS=OK ...]

### Failure
[Failure template, ending with STATUS=FAIL ERROR="..."]

## 4. Next-Step Suggestions
| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| [condition] | [/command] | [why] |

End interactive presentations with a single next-step prompt.
```
