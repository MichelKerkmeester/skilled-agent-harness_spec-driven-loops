---
description: Create global or packet-local changelog. Topology-aware, optional GitHub release. :auto/:confirm.
argument-hint: "<spec-folder-or-component> [--nested] [--bump <major|minor|patch|build>] [--release] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__mk_code_index__code_graph_query
---

# /create:changelog Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:changelog to its presentation contract and workflow YAML for creating global or packet-local changelogs with topology-aware release options.

- Do not dispatch agents from this router.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create-changelog-presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create-changelog-auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create-changelog-confirm.yaml` |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

1. Read `.opencode/commands/create/assets/create-changelog-presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, release-option display, and final result display.

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/create/assets/create-changelog-auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/create/assets/create-changelog-confirm.yaml` |

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create-changelog-presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, release prompt layout, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-changelog-auto.yaml` for `:auto`, `create-changelog-confirm.yaml` for `:confirm` or an omitted mode) runs the changelog workflow step by step after Phase 0 verification and setup resolution, producing global or packet-local changelogs with topology-aware release options. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, release-option display, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
