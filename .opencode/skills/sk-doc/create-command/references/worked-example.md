---
title: Command Creation - Worked Split Example
description: The canonical command file contract and its invariants, plus a fully worked mode-based split command showing the router .md and its presentation .txt asset.
trigger_phrases:
  - "slash command worked example"
  - "command file contract"
  - "worked split command"
  - "router presentation example"
  - "namespace command example"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Creation - Worked Split Example

A concrete end-to-end example of a mode-based namespace command. `create-command/SKILL.md` owns the numbered workflow; this file shows what the finished output package looks like so you can model the shape.

---

## 1. OVERVIEW

This reference is a single worked example: the canonical command file contract and its invariants, then a full mode-based split showing both the router `.md` and its presentation `.txt`. It is illustrative overflow for SKILL.md Steps 5 and 11 — model the shape, do not treat `/review:packet` as a live command.

---

## 2. CANONICAL FILE CONTRACT

The smallest command package is one markdown file.

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

---

## 3. FULLY WORKED SPLIT EXAMPLE

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

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `assets/review_packet_presentation.txt` |
| Auto workflow | `assets/review_packet_auto.yaml` |
| Confirm workflow | `assets/review_packet_confirm.yaml` |

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

---

## 4. RELATED RESOURCES

- [README.md](README.md) - command-creation reference map
- [router-presentation-split.md](router-presentation-split.md) - the separation rules this example follows
- [command-template.md](../assets/command/command-template.md) - command templates, gates, dispatch, modes, and validation checklist
- [command-presentation-template.md](../assets/command/command-presentation-template.md) - full presentation asset skeleton
