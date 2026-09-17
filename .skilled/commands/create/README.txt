---
title: "Create Commands"
description: "Slash commands for scaffolding OpenCode components, docs, changelogs, charts, diagrams, diffs and repo rules."
trigger_phrases:
  - "create command"
  - "scaffold component"
  - "create agent"
  - "create skill"
  - "create readme"
  - "create feature catalog"
  - "create testing playbook"
  - "create changelog"
  - "create chart"
  - "create diagram"
  - "create diff"
  - "create repo rule"
  - "apply human voice"
---

# Create Commands

> Slash commands for scaffolding OpenCode components, documentation packages, changelog entries, charts, diagrams, diff reports and repo rules with proper templates and validation.

---

## 1. OVERVIEW

The `create` command group scaffolds OpenCode components, documentation packages, changelog entries, and standalone visual and prose artifacts. All commands follow a structured YAML workflow and support `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.

The table in section 3 lists every command in this folder. When a command file is added here, add its row there too; a missing row is the failure mode this index has hit before.

All shipped `create` commands run Phase 0 (@markdown agent self-verification).

---

## 2. PURPOSE

Use this index to understand which `/create:*` command owns a given scaffolding workflow, which argument shape it expects, and which package contract or artifact family it generates.

This document is a routing and reference surface only. Run the command entrypoint itself for execution, setup prompting, and YAML workflow dispatch.

---

## 3. COMMANDS
| Command | Invocation | Description |
|---------|------------|-------------|
| **agent** | `/create:agent <agent_name> [agent_description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
| **benchmark** | `/create:benchmark <skill-or-mode> <spec-packet> [create\|update] --family=<family> [--benchmark-id <id>] [--date YYYY-MM-DD] [--path <dir>] [:auto\|:confirm]` | Author or update family-keyed benchmark packages |
| **changelog** | `/create:changelog <spec-folder-or-component> [--nested] [--bump <major\|minor\|patch\|build>] [--release] [:auto\|:confirm]` | Create a global or packet-local changelog entry; topology-aware, with an optional GitHub release |
| **chart** | `/design:chart <target-chart.html> <what the reader compares> [--form <catalog-id>] [--system neutral\|ordered\|categorical] [:auto\|:confirm]` | Author a standalone HTML chart from a catalog of 21 forms, one per reader question |
| **command** | `/create:command <command_invocation> [command_request] [:auto\|:confirm]` | Create or update an OpenCode slash command set with router and `:auto`/`:confirm` workflow assets |
| **diagram** | `/design:diagram <target.html\|target.md> [description\|--import <src>] [--output-format html-svg\|ascii-markdown] [--type <t>] [--format <f>] [:auto\|:confirm]` | Create an HTML/SVG diagram across 27 types, an ASCII/markdown flowchart, or a redraw of a draw.io/Mermaid source |
| **diff** | `/create:diff <target-document \| --before old --after new> [--report out.html] [--view unified\|side-by-side] [:auto\|:confirm]` | Create a self-contained before/after document diff report via the create-diff engine |
| **feature-catalog** | `/create:feature-catalog <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `feature-catalog/` package using the shipped `sk-doc` contract |
| **manual-testing-playbook** | `/create:manual-testing-playbook <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `manual-testing-playbook/` package using the shipped `sk-doc` contract |
| **readme** | `/create:readme [readme\|install] <target> [--type <project\|component\|feature\|skill>] [--platforms <list>] [--output <path>] [:auto\|:confirm]` | Unified README and install guide creation with `sk-doc` quality standards |
| **repo-rule** | `/create:repo-rule <what the rule should bind> [create\|revise\|retire] [--rule <name>] [:auto\|:confirm]` | Create, revise or retire a repo rule under `repo-rules/`, wired into `REPO RULES.md` |
| **skill** | `/create:skill <skill-name> [operation] [type] [--path <dir>] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
| **skill-parent** | `/create:skill-parent <skill-name> [create\|update] [--modes <m1,m2,...>] [--surfaces <s1,s2,...>] [--path <dir>] [:auto\|:confirm]` | Scaffold a parent skill with nested mode packets (one hub identity, `mode-registry.json` source of truth, and a root `ROUTER.md` stage-two control document) |
| **with-human-voice** | `/create:with-human-voice <file or passage> [apply\|score] [--include-code] [:auto\|:confirm]` | Apply or score prose against the Human Voice Rules with a scope gate and a re-scan |

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
├── agent.md                      # /create:agent command
├── benchmark.md                  # /create:benchmark command
├── changelog.md                  # /create:changelog command
├── chart.md                      # /design:chart command
├── command.md                    # /create:command command
├── diagram.md                    # /design:diagram command
├── diff.md                       # /create:diff command
├── feature-catalog.md            # /create:feature-catalog command
├── manual-testing-playbook.md    # /create:manual-testing-playbook command
├── readme.md                     # /create:readme — unified README + install guide command
├── repo-rule.md                  # /create:repo-rule command
├── skill.md                      # /create:skill command
├── skill-parent.md               # /create:skill-parent command
├── with-human-voice.md           # /create:with-human-voice command
└── assets/                       # One auto YAML, one confirm YAML and one presentation
                                  # contract per command; see the folder itself for the
                                  # live file set rather than a count kept here
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
- `/create:feature-catalog` produces `feature-catalog/feature-catalog.md` plus bare descriptive-slug category folders (the root catalog owns display order)
- `/create:manual-testing-playbook` produces `manual-testing-playbook/manual-testing-playbook.md` plus bare descriptive-slug category folders (the root playbook owns display order) and no sidecar review/ledger files

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
/create:changelog specs/01--system-spec-kit/042-memory-upgrade :auto

# Create a changelog for a specific component
/create:changelog sk-doc --bump minor :confirm

# Author a standalone HTML chart from the form catalog
/design:chart revenue-by-region.html "revenue compared across regions" :auto

# Redraw an existing draw.io source as an HTML/SVG diagram
/design:diagram architecture.html --import legacy-architecture.drawio :confirm

# Review what changed in a locally edited document
/create:diff proposal.md --report proposal-diff.html :auto

# Add a repo rule and wire it into REPO RULES.md
/create:repo-rule "how migrations get reviewed" create :confirm

# Score a document against the Human Voice Rules without editing it
/create:with-human-voice docs/overview.md score :auto
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
| Phase 0 fails | @markdown agent not available | Verify agent files exist in the runtime path (`.opencode/agents/` or `.claude/agents/`) |
| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for operation and mode |
| Skill not found for skill operation | Wrong skill name | Use the exact folder name from `.opencode/skills/` |
| Catalog or playbook update target missing | `update` used before the package exists | Re-run with `create` or point to the correct skill root |
| Playbook scaffolds forbidden sidecar files | Using an outdated package shape | Use `/create:manual-testing-playbook`, which keeps review/orchestration guidance in `manual-testing-playbook.md` |
| `--chained` has no effect | Only meaningful for chained skill doc-only operations | Remove flag when running standalone |
| `changelog` wrong component | File path mapping mismatch | Use `--component` override or select manually in `:confirm` mode |
| `changelog` version conflict | File already exists | Command auto-increments BUILD segment. Specify `--bump` to override |

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [sk-doc SKILL.md](../../skills/sk-doc/SKILL.md) | Templates and standards used by create commands |
| [references/README.md](../../skills/sk-doc/sk-create-feature-catalog/references/README.md) | Standards for rooted feature catalog packages |
| [references/README.md](../../skills/sk-doc/sk-create-manual-testing-playbook/references/README.md) | Standards for rooted testing playbook packages |
| [agent-template.md](../../skills/sk-doc/sk-create-agent/assets/agent-template.md) | Agent creation template |
| [command-template.md](../../skills/sk-doc/sk-create-command/assets/command-template.md) | Command creation template |
| [references/README.md](../../skills/sk-doc/sk-create-skill/references/README.md) | Skill creation workflow route-map (includes "Parent Skills with Nested Mode Packets") |
| [parent-skill-hub-template.md](../../skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md) | Parent-skill hub `SKILL.md` template |
| [parent-skill-registry-template.json](../../skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-registry-template.json) | Parent-skill `mode-registry.json` template |
