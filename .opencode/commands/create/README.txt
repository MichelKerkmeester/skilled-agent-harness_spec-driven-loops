---
title: "Create Commands"
description: "Slash commands for scaffolding OpenCode components, documentation packages, and changelogs."
trigger_phrases:
  - "create command"
  - "scaffold component"
  - "create agent"
  - "create skill"
  - "create readme"
  - "create feature catalog"
  - "create testing playbook"
  - "create changelog"
---

# Create Commands

> Slash commands for scaffolding OpenCode components, documentation packages, and changelog entries with proper templates and validation.

---

## 1. OVERVIEW

The `create` command group scaffolds OpenCode components, documentation packages, and changelog entries. All commands follow a structured YAML workflow and support `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.

All shipped `create` commands run Phase 0 (@markdown agent self-verification).

---

## 2. PURPOSE

Use this index to understand which `/create:*` command owns a given scaffolding workflow, which argument shape it expects, and which package contract or artifact family it generates.

This document is a routing and reference surface only. Run the command entrypoint itself for execution, setup prompting, and YAML workflow dispatch.

---

## 3. COMMANDS
| Command | Invocation | Description |
|---------|------------|-------------|
| **agent** | `/create:agent <name> [description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
| **changelog** | `/create:changelog <spec-folder-or-component> [--bump <major\|minor\|patch\|build>] [:auto\|:confirm]` | Create a changelog entry by detecting recent work, resolving the target component folder, and generating a formatted changelog file |
| **feature-catalog** | `/create:feature-catalog <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `feature_catalog/` package using the shipped `sk-doc` contract |
| **readme** | `/create:readme [readme\|install] <target> [flags] [:auto\|:confirm]` | Unified README and install guide creation |
| **skill-parent** | `/create:skill-parent <skill-name> [create\|update] [--modes <m1,m2,...>] [--path <dir>] [:auto\|:confirm]` | Scaffold a parent skill with nested mode packets (one hub `graph-metadata.json`, `mode-registry.json` source of truth, N `deep-<mode>` packets, non-discoverable `shared/`) |
| **skill** | `/create:skill <name> <operation> [type] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
| **manual-testing-playbook** | `/create:manual-testing-playbook <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `manual_testing_playbook/` package using the shipped `sk-doc` contract |
| **command** | `/create:command <command_invocation> [command_request] [:auto\|:confirm]` | Create or update an OpenCode slash command set with router and `:auto`/`:confirm` workflow assets |
| **benchmark** | `/create:benchmark <skill-name> <spec-packet> [create\|update] [--date YYYY-MM-DD] [--path <dir>] [:auto\|:confirm]` | Promote a curated MCP benchmark folder and report into a skill |
| **flowchart** | `/create:flowchart <target-flowchart.md> [source/process description] [:auto\|:confirm]` | Create a validated ASCII flowchart markdown file |

### README Types

The `readme` operation in `/create:readme` accepts a `--type` flag:

| Type | Use Case |
|------|----------|
| `project` | Root-level project documentation |
| `component` | Reusable module or library |
| `feature` | Specific feature or system |
| `skill` | AI skill supplementary documentation |

---

## 4. STRUCTURE

```
create/
├── agent.md              # /create:agent command
├── changelog.md          # /create:changelog command
├── feature-catalog.md    # /create:feature-catalog command
├── readme.md      # /create:readme — unified README + install guide command
├── skill-parent.md       # /create:skill-parent command
├── skill.md           # /create:skill command
├── manual-testing-playbook.md   # /create:manual-testing-playbook command
├── command.md            # /create:command command
├── benchmark.md          # /create:benchmark command
├── flowchart.md          # /create:flowchart command
└── assets/               # YAML workflow definitions
    ├── create_agent_auto.yaml
    ├── create_agent_confirm.yaml
    ├── create_changelog_auto.yaml
    ├── create_changelog_confirm.yaml
    ├── create_feature_catalog_auto.yaml
    ├── create_feature_catalog_confirm.yaml
    ├── create_readme_auto.yaml
    ├── create_readme_confirm.yaml
    ├── create_skill_parent_auto.yaml
    ├── create_skill_parent_confirm.yaml
    ├── create_skill_auto.yaml
    ├── create_skill_confirm.yaml
    ├── create_manual_testing_playbook_auto.yaml
    ├── create_manual_testing_playbook_confirm.yaml
    ├── create_command_auto.yaml
    ├── create_command_confirm.yaml
    ├── create_benchmark_auto.yaml
    ├── create_benchmark_confirm.yaml
    ├── create_flowchart_auto.yaml
    └── create_flowchart_confirm.yaml
```

---

## 5. INSTRUCTIONS

1. Pick the command family that matches the artifact you need.
2. Use the canonical command entrypoint, not a deprecated alias.
3. Supply `:auto` for autonomous execution or `:confirm` for checkpointed execution.
4. For rooted documentation packages, use the package-specific commands instead of composing the files manually.
5. If the command performs file modifications, keep it attached to the active spec workflow.

---

## 6. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode loads a separate YAML workflow from `assets/` when that command ships YAML assets:
- Auto: `create_<command>_auto.yaml`
- Confirm: `create_<command>_confirm.yaml`

The `--chained` flag on `/create:skill` doc-only operations indicates parent workflow handoff.

The documentation-package commands preserve the live `sk-doc` contracts:
- `/create:feature-catalog` produces `feature_catalog/feature_catalog.md` plus numbered category folders
- `/create:manual-testing-playbook` produces `manual_testing_playbook/manual_testing_playbook.md` plus numbered category folders and no sidecar review/ledger files

---

## 7. USAGE EXAMPLES

```bash
# Create a new agent in auto mode
/create:agent my-analyzer "Code analysis specialist" :auto

# Create a README for a specific folder
/create:readme readme .opencode/skills/my-skill --type skill :confirm

# Create a full skill
/create:skill my-new-skill full-create :auto

# Scaffold a parent skill with nested mode packets
/create:skill-parent my-loop-workflows create --modes research,review,ai-council :confirm

# Create a rooted feature catalog package
/create:feature-catalog system-spec-kit create :confirm

# Update an existing testing playbook package
/create:manual-testing-playbook system-spec-kit update :auto

# Add a reference doc to an existing skill
/create:skill my-skill reference-only debugging :confirm

# Create an install guide for multiple platforms
/create:readme install my-tool --platforms opencode,claude-code :confirm

# Create a changelog from a completed spec folder
/create:changelog .opencode/specs/01--system-spec-kit/042-memory-upgrade :auto

# Create a changelog for a specific component
/create:changelog sk-doc --bump minor :confirm
```

---

## 8. FAQ

**Q: When should I use `create` vs `update` for feature-catalog and testing-playbook commands?**

A: Use `create` when the package folder does not yet exist under the skill root. Use `update` when the package already exists and you want to add or revise content within it. Running `create` on an existing package will produce a conflict error.

**Q: What does the `--chained` flag do on `/create:skill`?**

A: The `--chained` flag signals that the command was dispatched from a parent workflow (for example, a `full-create` that hands off to a doc-only phase). It changes how the command reports completion and does not affect the output files. Remove it when running the command standalone.

**Q: How does `/create:changelog` determine which version to assign?**

A: The command reads the most recent changelog entry in the target component folder and auto-increments the BUILD segment. Supply `--bump major`, `--bump minor`, or `--bump patch` to override and bump a higher segment. In `:confirm` mode you can also select the version manually during execution.

---

## 9. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Phase 0 fails | @markdown agent not available | Verify agent files exist in the runtime path (`.opencode/agents/`, `.claude/agents/`, or `.opencode/agents/`) |
| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for operation and mode |
| Skill not found for skill operation | Wrong skill name | Use the exact folder name from `.opencode/skills/` |
| Catalog or playbook update target missing | `update` used before the package exists | Re-run with `create` or point to the correct skill root |
| Playbook scaffolds forbidden sidecar files | Using an outdated package shape | Use `/create:manual-testing-playbook`, which keeps review/orchestration guidance in `manual_testing_playbook.md` |
| `--chained` has no effect | Only meaningful for chained skill doc-only operations | Remove flag when running standalone |
| `changelog` wrong component | File path mapping mismatch | Use `--component` override or select manually in `:confirm` mode |
| `changelog` version conflict | File already exists | Command auto-increments BUILD segment. Specify `--bump` to override |

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [sk-doc SKILL.md](../../skills/sk-doc/SKILL.md) | Templates and standards used by create commands |
| [references/README.md](../../skills/sk-doc/create-feature-catalog/references/README.md) | Standards for rooted feature catalog packages |
| [references/README.md](../../skills/sk-doc/create-manual-testing-playbook/references/README.md) | Standards for rooted testing playbook packages |
| [agent_template.md](../../skills/sk-doc/create-agent/assets/agent_template.md) | Agent creation template |
| [command_template.md](../../skills/sk-doc/create-command/assets/command/command_template.md) | Command creation template |
| [references/README.md](../../skills/sk-doc/create-skill/references/README.md) | Skill creation workflow route-map (includes "Parent Skills with Nested Mode Packets") |
| [parent_skill_hub_template.md](../../skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md) | Parent-skill hub `SKILL.md` template |
| [parent_skill_registry_template.json](../../skills/sk-doc/create-skill/assets/parent_skill/parent_skill_registry_template.json) | Parent-skill `mode-registry.json` template |
