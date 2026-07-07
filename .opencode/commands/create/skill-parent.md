---
description: Scaffold a parent skill with nested mode packets (one hub identity, registry source of truth). Modes :auto, :confirm.
argument-hint: "<skill-name> [create|update] [--modes <mode1,mode2,...>] [--surfaces <s1,s2,...>] [--path <dir>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:skill-parent Router

This command is a thin router. It separates execution routing from user-facing presentation.

## Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_skill_parent_presentation.txt` | Startup questions, setup dashboard, operation/status display, and completion template |
| Auto workflow | `.opencode/commands/create/assets/create_skill_parent_auto.yaml` | Autonomous parent-skill scaffolding workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_skill_parent_confirm.yaml` | Interactive checkpointed parent-skill scaffolding workflow execution |

## Execution Order

1. Read `.opencode/commands/create/assets/create_skill_parent_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Resolve operation from setup: `create` or `update`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_skill_parent_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_skill_parent_confirm.yaml`
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## What This Scaffolds

This command generates the "parent skill with nested mode packets" pattern following the two-axis hub canon. The canonical example is `sk-code` (workflow modes plus read-only surface packets); `deep-loop-workflows` is the runtime-loop variant that expresses its extra machinery as named `extensions`. The pattern is standardized in `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`, and the hub-router contract in `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md`. The templates are `parent_skill_hub_template.md`, `parent_skill_registry_template.json`, `parent_skill_hub_router_template.json`, `parent_skill_description_template.json`, and `parent_skill_graph_metadata_template.json` under `.opencode/skills/sk-doc/create-skill/assets/skill/`.

The generated package is:

- A thin hub `SKILL.md` (routing only, no per-mode logic).
- A declarative `mode-registry.json` where every mode carries the two-axis discriminator — `workflowMode` + `packetKind` (`workflow` | `surface`) + `backendKind` — plus `toolSurface`, `grandfatheredFolderMismatch`, and one `advisorRouting` block (`routingClass`, `legacyAdvisorId` for lexical/alias-fold modes, optional `advisorDefaultMode`, `legacyAliases`, `packetSkillName`). The registry is the single source of truth; routers and tests read it, none re-derive it.
- A `hub-router.json` describing how a prompt selects and bundles modes (routerSignals, typed vocabularyClasses, tieBreak, and a `surfaceBundle` outcome when surfaces exist), and a `description.json`.
- Exactly one hub `graph-metadata.json` — the one hard invariant.
- N workflow mode packets, each self-contained with its own `SKILL.md`, `README.md`, and `changelog/`, where `folder == packetSkillName == [hub-prefix]-<mode>`, and with NO per-packet `graph-metadata.json`.
- Optional read-only `surface` packets (bare-noun folders, `packetKind: surface`, `backendKind: evidence-base`, read-only `toolSurface`, advisor-invisible `metadata` routing) carrying domain evidence rather than process.
- A hub `changelog/` and `manual_testing_playbook/` (changelog entries are real files, never symlinks).
- A non-discoverable `shared/` directory (with `shared/README.md`) for packet-shared workflow-layer helpers.

## Routing Rules

- This command is the canonical `/create:skill-parent` entrypoint.
- Do not split behavior across legacy or ad-hoc parent-skill scaffolders.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## One-Identity Invariant

- The hub owns exactly one `graph-metadata.json`. This is the load-bearing keystone: skill-graph discovery keys only on `graph-metadata.json` and throws when `skill_id` does not equal its folder.
- NEVER add a `graph-metadata.json` inside a mode packet or inside `shared/`. A nested `graph-metadata.json` creates a rogue advisor identity (B-style discovery drift) and re-introduces the multi-ID brittleness this pattern removes.
- The mode packets and `shared/` stay non-discoverable by design; their invisibility is a consequence of nesting, not a special mechanism.

## Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_skill_parent_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, operation display, status display, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

User request: $ARGUMENTS
