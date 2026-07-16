---
description: Author or update family-keyed benchmark packages. Modes :auto, :confirm.
argument-hint: "<skill-or-mode> <spec-packet> [create|update] --family=<FAMILIES-key> [--benchmark-id <id>] [--date YYYY-MM-DD] [--path <dir>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:benchmark Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:benchmark to its presentation contract and workflow YAML for family-keyed benchmark authoring. The existing `mcp_promotion` route remains intact; `conformance_benchmark` is an authoring-only branch.

- Do not split behavior across legacy or ad-hoc benchmark commands.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create_benchmark_presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create_benchmark_auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create_benchmark_confirm.yaml` |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## 4. EXECUTION TARGETS

1. Read `.opencode/commands/create/assets/create_benchmark_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve `benchmark_family` from `--family=<FAMILIES-key>` or the single consolidated setup prompt.
4. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
5. Resolve operation and family-specific target fields from setup.
6. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_benchmark_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_benchmark_confirm.yaml`
7. Execute the selected YAML step by step and route first by family, then by operation.
8. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create_benchmark_presentation.txt`:

- Startup questions, Phase 0 verification, family and operation display, setup/status dashboards, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create_benchmark_auto.yaml` for `:auto`, `create_benchmark_confirm.yaml` for `:confirm` or an omitted mode) routes `mcp_promotion` through the existing benchmark-folder workflow. The `conformance_benchmark` branch copies and fills the four conformance templates, validates the authored Markdown and JSON, reports the package path, and terminates without invoking an adapter or deep-alignment. `:auto` executes autonomously; `:confirm` runs the same branch with checkpoints. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract.

User request: $ARGUMENTS
