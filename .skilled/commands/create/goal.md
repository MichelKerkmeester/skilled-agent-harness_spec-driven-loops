---
description: Author or revise a packet goal.md: top-level, phase-parent, child, retrofit, phase-add, amend. :auto/:confirm.
argument-hint: "<packet path> [top-level|phase-parent|child|retrofit|phase-add|amend] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# /create:goal Router

This command is a thin router. It separates execution routing from user-facing presentation.

### MANDATORY INPUT GATE

**STATUS: BLOCKED** until `packet_path`, `operation`, and `execution_mode` are bound.

1. Parse `$ARGUMENTS`; strip the `:auto` / `:confirm` suffix before resolving the required packet path.
2. Treat an absent or whitespace-only `<packet path>` as missing. Do not infer it from conversation history, open files, screenshots, or repository contents.
3. When the packet path is missing, ask for it and the intended operation, then stop and wait for an explicit reply. Use only `$ARGUMENTS` or that reply.
4. Resolve `operation` from the six tokens `top-level`, `phase-parent`, `child`, `retrofit`, `phase-add`, `amend`. When no token is present, derive it from the packet's own files through the mode's routing decisions and record it; never infer it from unrelated conversation context.
5. A request to set, bind or resend a session objective is not missing input. Route it away per section 3 and write no goal file.

| Field | Required | Source |
|---|---:|---|
| `packet_path` | yes | explicit `<packet path>` positional or explicit reply |
| `operation` | yes | operation token, or resolved from the packet's own files |
| `execution_mode` | yes | suffix or explicit choice |

If a gate phase was skipped, stop, state the skipped phase, return to it, and complete it before any goal file is written.

## 1. ROUTER CONTRACT

Route /create:goal to its presentation contract and workflow YAML for authoring or revising a spec packet's `goal.md`.

Do not author goal content from this document. The goal template, the authoring standards and the six goal workflows are owned by `sk-create-goal`; the workflow YAML owns setup, execution mode and artifact writes. This command authors packet files only: it never sets, binds or resends a session objective.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/create/assets/create-goal-presentation.txt` |
| Auto workflow | `.skilled/commands/create/assets/create-goal-auto.yaml` |
| Confirm workflow | `.skilled/commands/create/assets/create-goal-confirm.yaml` |
| Mode contract | `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `INTERACTIVE`; no suffix sets `ASK`.
2. Treat `top-level`, `phase-parent`, `child`, `retrofit`, `phase-add` and `amend` as workflow inputs, not execution modes. The packet path is the required positional.
3. A request to "set the goal" or "resend the goal" as a session objective reaches no workflow asset. Redirect it to the goal hooks using the presentation contract's redirect block, write nothing, and stop.
4. Load the sk-doc hub, then `sk-create-goal/SKILL.md`, then the presentation contract.
5. Execute the selected workflow asset step by step.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.skilled/commands/create/assets/create-goal-auto.yaml` |
| `:confirm` or interactive choice | `.skilled/commands/create/assets/create-goal-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, the session-goal redirect wording, checkpoint prompts, success and failure output, and next-step prompts live only in the presentation contract.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-goal-auto.yaml` for `:auto`, `create-goal-confirm.yaml` for `:confirm` or an omitted mode) runs the goal workflow step by step: read the packet's sources, pick the operation, render the goal through system-spec-kit, fill it against the authoring standards, match any phase-parent binding table to the phase folders on disk, measure the durable slice, run the goal checker, then print the packet's `chat_slice` and stop. `:confirm` checkpoints after the operation is chosen, before any goal file is written, and before handoff. All prompts and result wording come from the presentation contract, not this router.
