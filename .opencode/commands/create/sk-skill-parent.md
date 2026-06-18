---
description: Scaffold a parent skill with nested mode packets (one hub identity, registry source of truth). Modes :auto, :confirm.
argument-hint: "<skill-name> [create|update] [--modes <mode1,mode2,...>] [--path <dir>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:sk-skill-parent Router

This command is a thin router. It separates execution routing from user-facing presentation.

## Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_parent_skill_presentation.txt` | Startup questions, setup dashboard, operation/status display, and completion template |
| Auto workflow | `.opencode/commands/create/assets/create_parent_skill_auto.yaml` | Autonomous parent-skill scaffolding workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_parent_skill_confirm.yaml` | Interactive checkpointed parent-skill scaffolding workflow execution |

## Execution Order

1. Read `.opencode/commands/create/assets/create_parent_skill_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Resolve operation from setup: `create` or `update`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_parent_skill_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_parent_skill_confirm.yaml`
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## What This Scaffolds

This command generates the "parent skill with nested mode packets" pattern. The canonical example is `deep-loop-workflows`; the pattern is standardized in `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`. The hub and registry templates are `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md` and `.opencode/skills/sk-doc/assets/skill/parent_skill_registry_template.json`.

The generated package is:

- A thin hub `SKILL.md` (routing only, no per-mode logic).
- A declarative `mode-registry.json` with one `advisorRouting` block per mode (`routingClass`, `legacyAdvisorId` for lexical/alias-fold modes, optional `advisorDefaultMode`, `legacyAliases`, `packetSkillName`). The registry is the single source of truth; routers and tests read it, none re-derive it.
- Exactly one hub `graph-metadata.json` — the one hard invariant.
- N mode packets, each self-contained with its own `SKILL.md`, where `folder == packetSkillName == deep-<mode>`, and with NO per-packet `graph-metadata.json`.
- A non-discoverable `shared/` directory for packet-shared workflow-layer helpers.

## Routing Rules

- This command is the canonical `/create:sk-skill-parent` entrypoint.
- Do not split behavior across legacy or ad-hoc parent-skill scaffolders.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## One-Identity Invariant

- The hub owns exactly one `graph-metadata.json`. This is the load-bearing keystone: skill-graph discovery keys only on `graph-metadata.json` and throws when `skill_id` does not equal its folder.
- NEVER add a `graph-metadata.json` inside a mode packet or inside `shared/`. A nested `graph-metadata.json` creates a rogue advisor identity (B-style discovery drift) and re-introduces the multi-ID brittleness this pattern removes.
- The mode packets and `shared/` stay non-discoverable by design; their invisibility is a consequence of nesting, not a special mechanism.

## Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_parent_skill_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, operation display, status display, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

User request: $ARGUMENTS
