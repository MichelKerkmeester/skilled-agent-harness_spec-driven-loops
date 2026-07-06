---
title: Command Creation - Overflow Reference
description: Overflow examples and edge-case guidance for creating OpenCode slash commands with router/presentation separation, argument hints, mode design, and frontmatter discipline.
trigger_phrases:
  - "command creation reference"
  - "slash command worked example"
  - "router presentation split"
  - "argument hint design"
  - "auto confirm command modes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Creation - Overflow Reference

This reference is overflow detail; create-command/SKILL.md is the authoritative workflow contract.

Use this file for examples, edge cases, and deeper explanation that would bloat the primary packet workflow. Do not treat it as a replacement for the numbered creation workflow in `create-command/SKILL.md`.

---

## 1. OVERVIEW

Command creation is for durable slash-triggered workflows under `.opencode/commands/`. A command should help the user trigger a repeatable procedure, parse `$ARGUMENTS`, enforce gates, and route execution with explicit tool permissions.

**Core principle**: Commands are executable entry points. Keep reusable doctrine in skills, long display language in presentation assets, and runtime role boundaries in agents.

**Primary sources**:
- `create-command/SKILL.md`
- `create-command/assets/command/command_template.md`
- `create-command/assets/command/command_presentation_template.md`

**Current reality highlights**:
- root command files live at `.opencode/commands/<command>.md`
- namespace command files live at `.opencode/commands/<namespace>/<action>.md`
- split command families use a thin router plus owned assets
- presentation assets own visible prompts, dashboards, result templates, and next-step wording
- workflow-backed mode families may also own `_auto.yaml` and `_confirm.yaml` assets

## 2. COMMAND VS SKILL VS AGENT

Choose the component type before drafting.

| Component | Primary Question | Use It When |
|---|---|---|
| Command | How should a user trigger this workflow? | A slash invocation should gather input and run a repeatable procedure |
| Skill | How should this work be done? | Reusable knowledge, standards, templates, or deep guidance are needed |
| Agent | Who should do this work? | A named persona needs authority, permissions, and operating rules |

**Practical rule**:
- create a command for a user-triggered workflow entry point
- create a skill for reusable knowledge or workflow doctrine
- create an agent for a durable runtime role with permissions

**Healthy pairing**:
- command gathers input and selects mode
- skill supplies detailed standards or patterns
- agent executes specialized work when delegation is appropriate

## 3. CANONICAL FILE CONTRACT

The smallest command package is one markdown file.

Examples:

```text
.opencode/commands/report.md             -> /report
.opencode/commands/review/packet.md      -> /review:packet
```

Split mode-based workflow packages commonly use this shape:

```text
.opencode/commands/review/packet.md
.opencode/commands/review/assets/review_packet_presentation.txt
.opencode/commands/review/assets/review_packet_auto.yaml
.opencode/commands/review/assets/review_packet_confirm.yaml
```

**Invariants**:
- command and namespace names use lowercase hyphen-case
- the router `.md` owns routing, gates, mode resolution, and asset selection
- the presentation asset owns visible wording only
- workflow YAML exists only when the family routes execution through workflow assets
- direct-router families can omit workflow YAML and dispatch directly to tools or scripts

## 4. FULLY WORKED SPLIT EXAMPLE

This example is illustrative. It shows the output shape for a mode-based namespace command without claiming that `/review:packet` exists.

Router file: `.opencode/commands/review/packet.md`

```markdown
---
description: Review a spec packet with :auto or :confirm execution
argument-hint: "<spec-folder> [:auto|:confirm]"
allowed-tools: Read, Grep, Glob, Bash, Task
---

# MANDATORY FIRST ACTION - DO NOT SKIP

Before using any tools, inspect `$ARGUMENTS`.

If `$ARGUMENTS` is empty, undefined, whitespace-only, or contains only `:auto` / `:confirm`:
- stop immediately
- ask: "Which spec folder should be reviewed? Reply with a path such as `.opencode/specs/track/123-name`."
- wait for the user's answer
- use only `$ARGUMENTS` or that explicit answer as the spec folder
- do not infer the folder from conversation history, open files, or recent work

---

# Review Packet Router

Thin router for `/review:packet`. The router resolves inputs and mode, loads owned assets, and selects the execution target. It does not own display templates.

## 1. ROUTER CONTRACT

Inputs:
- `$ARGUMENTS` containing `<spec-folder>` and optional `:auto` or `:confirm`

Outputs:
- `STATUS=OK REVIEW=<summary>` when the review completes
- `STATUS=FAIL ERROR="<message>"` when required input, validation, or execution fails
- `STATUS=CANCELLED ACTION=cancelled` when the user cancels interactive execution

## 2. OWNED ASSETS

| Asset | Purpose |
|---|---|
| `assets/review_packet_presentation.txt` | User-visible startup prompt, checkpoint layout, result templates, and next-step wording |
| `assets/review_packet_auto.yaml` | Autonomous execution path for the review workflow |
| `assets/review_packet_confirm.yaml` | Interactive execution path with approval checkpoints |

## 3. MODE ROUTING

| Invocation | Mode | Behavior |
|---|---|---|
| `/review:packet:auto <spec-folder>` | AUTONOMOUS | Execute without approval gates; self-validate at checkpoints |
| `/review:packet:confirm <spec-folder>` | INTERACTIVE | Pause after each step for approval or adjustment |
| `/review:packet <spec-folder>` | PROMPT | Load presentation asset and ask the mode-selection prompt |

Parse the mode suffix first. After mode extraction, treat the remaining text as the spec folder.

## 4. EXECUTION TARGETS

| Mode | Target |
|---|---|
| AUTONOMOUS | `assets/review_packet_auto.yaml` |
| INTERACTIVE | `assets/review_packet_confirm.yaml` |
| PROMPT | Use `assets/review_packet_presentation.txt` to ask for mode, then route to the selected target |

## 5. PRESENTATION BOUNDARY

The router must not inline startup prompt wording, dashboard layouts, success templates, failure templates, or next-step suggestions. Load those from `assets/review_packet_presentation.txt`.

## 6. WORKFLOW SUMMARY

Validate the spec folder, choose execution mode, run the selected review workflow, then return the structured status from the workflow result.
```

Presentation asset: `.opencode/commands/review/assets/review_packet_presentation.txt`

```markdown
# Review Packet Presentation Contract

Presentation source of truth for `/review:packet`. The router owns mode selection and asset loading. Workflow YAML owns execution. This file owns visible prompts, dashboard layout, and result displays.

## 1. Startup Presentation

For no suffix, ask once:

"How should the packet review run?"

| Option | Mode | Use When |
|---|---|---|
| A | Autonomous | The packet is low-risk and a full review can proceed without checkpoints |
| B | Interactive | You want to approve or adjust each review step |

Reply with `A` or `B`.

For `:auto`, do not show the mode prompt. Ask only if the spec folder is missing or invalid.

### Auto Fail-Fast Display

`STATUS=FAIL ERROR="Missing required spec-folder for /review:packet:auto"`

## 2. Dashboard / Checkpoint Layout

| Step | Status | Evidence |
|---|---|---|
| Input verified | pending | spec folder path |
| Sources read | pending | files inspected |
| Findings checked | pending | review notes |
| Result emitted | pending | status line |

## 3. Results Display

### Success

`STATUS=OK REVIEW="<summary>" FINDINGS=<count>`

### Failure

`STATUS=FAIL ERROR="<message>"`

## 4. Next-Step Suggestions

| Condition | Suggested Command | Reason |
|---|---|---|
| Findings need implementation | `/speckit:implement <spec-folder>` | Continue from reviewed packet |
| Review needs more context | `/speckit:resume <spec-folder>` | Rehydrate packet context |
```

## 5. ROUTER VS PRESENTATION SEPARATION

The split exists so routing behavior and visible wording can evolve independently. The router should be short and auditable. The presentation asset can be longer because it is the display source of truth.

**Router owns**:
- mandatory input gate or Phase 0
- owned-assets table
- mode detection and routing
- argument dispatch
- execution target selection
- presentation boundary statement

**Presentation owns**:
- startup questions and consolidated setup prompts
- dashboard and checkpoint layouts
- success and failure result templates
- next-step suggestions
- exact reply formats shown to the user

Before:

```markdown
## 3. MODE ROUTING

If no mode suffix is present, ask:
"How should the review run? Choose A for auto or B for confirm."

After completion, show:
"Review complete. Next you can run /speckit:implement."
```

After:

```markdown
## 3. MODE ROUTING

If no mode suffix is present, load `assets/review_packet_presentation.txt` and show the mode-selection prompt from `Startup Presentation`.

## 5. PRESENTATION BOUNDARY

Result templates and next-step wording live only in `assets/review_packet_presentation.txt`.
```

**Behavior-preserving rule**: moving display text into the presentation asset must not change routing semantics, required inputs, confirmation behavior, or tool permissions.

## 6. ARGUMENT-HINT DESIGN PATTERNS

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

## 7. `:auto` VS `:confirm` MODE DESIGN

Use modes when the same workflow needs different execution pacing.

| Mode | Design Intent | Good Fit |
|---|---|---|
| `:auto` | Execute without approval gates, self-validating at checkpoints | Low-risk repeatable workflows with clear defaults |
| `:confirm` | Pause after steps for user approval, modification, skip, or abort | Workflows with ambiguity, review checkpoints, or higher risk |
| no suffix | Ask the user to choose mode | Commands where neither pace is universally safe |

` :auto` should still stop when required input is missing, destructive impact is unclear, or a default would be fabricated. Autonomous does not mean permission to invent.

` :confirm` should not ask tiny repetitive questions. Batch setup into one consolidated prompt, then pause at meaningful checkpoints.

If a command combines modes with argument dispatch, parse mode first and dispatch the remaining arguments after removing the suffix.

## 8. FRONTMATTER AND DESCRIPTION BUDGET TIPS

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

## 9. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Creating a command for reference-only guidance | The slash command becomes a bloated manual instead of an executable workflow | Create or extend a skill/reference instead |
| Omitting `argument-hint` for required input | Users cannot see what the invocation expects | Add a precise hint with `<required>` and `[optional]` parts |
| Using a required hint without a gate | The command may infer missing input from context | Put the blocking gate immediately after frontmatter |
| Treating `:auto` as permission to guess | Autonomous runs can fabricate missing decisions | Fail fast or ask targeted questions when required data is missing |
| Putting dashboards in the router | Routing logic becomes hard to audit and presentation cannot evolve independently | Move visible wording to `_presentation.txt` |
| Changing behavior while splitting presentation | A refactor becomes a hidden semantic change | Move wording without changing routing, modes, gates, or permissions |
| Over-broad `allowed-tools` | The command can use tools outside its contract | Reduce the list to the tools actually required |
| Using bare MCP names in `allowed-tools` | Runtime tool resolution can drift from the configured namespace | Use fully qualified `mcp__<server>__<tool>` IDs |
| Writing a multi-line description | Help output and metadata consumers expect a single-line summary | Keep `description` one line and move detail into the body |
| Adding workflow YAML to every split command | Direct-router command families may not need YAML execution assets | Add `_auto.yaml` and `_confirm.yaml` only when the family routes to workflow assets |

## 10. RELATED RESOURCES

- `create-command/SKILL.md` - authoritative command creation workflow contract
- `create-command/assets/command/command_template.md` - command templates, gates, dispatch, modes, and validation checklist
- `create-command/assets/command/command_presentation_template.md` - presentation asset skeleton for split command families
- `create-agent/references/agent_creation.md` - sibling overflow reference style mirrored by this document
- `../shared/scripts/validate_document.py` - shared structure validator when available
- `../shared/scripts/extract_structure.py` - structure extraction helper when available
