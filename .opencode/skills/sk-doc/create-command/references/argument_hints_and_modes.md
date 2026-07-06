---
title: Command Creation - Argument Hints and Modes
description: Design patterns for argument-hint, :auto/:confirm mode design intent, and frontmatter/description/allowed-tools budget tips for OpenCode slash commands.
trigger_phrases:
  - "argument hint design"
  - "auto confirm command modes"
  - "command frontmatter tips"
  - "command description budget"
  - "allowed-tools least privilege"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Creation - Argument Hints and Modes

Depth for SKILL.md Steps 6 and 10 — the surface where a command declares its inputs. Use these patterns when writing `argument-hint`, choosing `:auto`/`:confirm` behavior, or tightening frontmatter.

---

## 1. OVERVIEW

This reference collects the input-declaration patterns that would bloat the SKILL.md workflow: a catalog of `argument-hint` shapes, the design intent behind `:auto`/`:confirm` modes, and budget-minded frontmatter tips for `description` and `allowed-tools`.

---

## 2. ARGUMENT-HINT DESIGN PATTERNS

Use `argument-hint` when the command expects user input. Required arguments use angle brackets. Optional arguments use square brackets. Mode suffixes such as `[:auto|:confirm]` are optional selectors, not required content.

| Pattern | Example | Use When |
|---|---|---|
| Required subject | `"<spec-folder>"` | The command cannot run without one primary input |
| Required plus optional mode | `"<request> [:auto|:confirm]"` | Mode selection changes execution pace |
| Optional action or query | `"[action|query] [options]"` | Empty input can show help or use a safe default |
| Required target plus flags | `"<path> [--dry-run] [--confirm]"` | Flags alter safety or preview behavior |
| Namespace operation | `"<skill-name> [--validate]"` | The namespace/action is in the invocation path, not the hint |

**Good hints**:
- `"<task> [:auto|:confirm]"`
- `"<spec-folder> [--strict]"`
- `"[status|repair|validate] [target]"`

**Weak hints**:
- `"args"` because it does not tell the user what to provide
- `"<optional-target>"` because required syntax contradicts the word optional
- `"<query> [query]"` because it duplicates the same concept in two forms

Mandatory-gate reminder: when the hint contains any required `<argument>`, the command needs a blocking input gate immediately after frontmatter. The gate must ignore mode suffixes when deciding whether real required content exists.

---

## 3. `:auto` VS `:confirm` MODE DESIGN

Use modes when the same workflow needs different execution pacing.

| Mode | Design Intent | Good Fit |
|---|---|---|
| `:auto` | Execute without approval gates, self-validating at checkpoints | Low-risk repeatable workflows with clear defaults |
| `:confirm` | Pause after steps for user approval, modification, skip, or abort | Workflows with ambiguity, review checkpoints, or higher risk |
| no suffix | Ask the user to choose mode | Commands where neither pace is universally safe |

`:auto` should still stop when required input is missing, destructive impact is unclear, or a default would be fabricated. Autonomous does not mean permission to invent.

`:confirm` should not ask tiny repetitive questions. Batch setup into one consolidated prompt, then pause at meaningful checkpoints.

If a command combines modes with argument dispatch, parse mode first and dispatch the remaining arguments after removing the suffix.

---

## 4. FRONTMATTER AND DESCRIPTION BUDGET TIPS

Every command needs YAML frontmatter with a single-line `description`. Add `argument-hint` and `allowed-tools` when applicable.

```yaml
---
description: Review a spec packet with :auto or :confirm execution
argument-hint: "<spec-folder> [:auto|:confirm]"
allowed-tools: Read, Grep, Glob, Bash, Task
---
```

**Description tips**:
- start with an action verb when possible
- keep it concise and single-line
- target 110 characters or less
- retain important trigger tokens such as `:auto` and `:confirm` when they are part of the command contract
- do not use YAML block scalars for `description`
- avoid product lists or implementation detail that belongs in the body

**Allowed-tools tips**:
- list only tools the command actually uses
- do not add broad tools just in case
- use fully qualified MCP IDs in `allowed-tools`, such as `mcp__<server>__<tool>`
- use bare MCP tool names only in prose, not in frontmatter

---

## 5. RELATED RESOURCES

- [README.md](README.md) - command-creation reference map
- [worked_example.md](worked_example.md) - frontmatter and gate applied in a full command
- [common_pitfalls.md](common_pitfalls.md) - hint, mode, and frontmatter mistakes with fixes
