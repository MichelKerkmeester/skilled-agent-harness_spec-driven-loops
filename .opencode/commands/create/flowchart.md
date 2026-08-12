---
description: Pass an ASCII/markdown flowchart request through /create:diagram with the ascii-markdown format pre-selected. Modes :auto, :confirm.
argument-hint: "<target-flowchart.md> [source/process description] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /create:flowchart Pass-Through

This command is a compatibility pass-through. The flowchart capability now lives in `/create:diagram` under the `ascii-markdown` output format.

## 1. PASS-THROUGH CONTRACT

Rewrite `/create:flowchart $ARGUMENTS` as `/create:diagram $ARGUMENTS --output-format ascii-markdown` and let the diagram command resolve its presentation contract, execution mode, pattern selection, and validator gate.

- Preserve the target `.md` path, source/process description, and `:auto` or `:confirm` suffix.
- Do not load or execute the retired flowchart-specific command assets from this pass-through.
- Do not select an HTML/SVG diagram type; `ascii-markdown` is pre-selected before pattern selection.

## 2. TARGET

The target command is `.opencode/commands/create/diagram.md` with `--output-format ascii-markdown` inserted before execution-mode resolution.

User request: $ARGUMENTS
