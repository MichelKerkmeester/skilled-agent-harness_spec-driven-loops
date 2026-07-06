# create-agent

Scaffold or update one OpenCode agent markdown file with runtime-aware placement, unified `permission:` frontmatter, clear authority boundaries, and validation-first delivery.

## 1. OVERVIEW

This workflow packet turns a concrete agent request into one runtime-ready agent file, using the packet-local standards and template instead of inventing a structure from scratch.

## 2. WHEN TO USE

Use this packet when a request is about creating or materially updating an agent: frontmatter, permissions, authority boundary, workflow, verification contract, anti-patterns, or runtime placement.

Do not use it for reusable knowledge alone, slash-command entry points alone, broad orchestration design, or wording-only duplicates of existing agents. Those usually belong in a skill, command, or existing agent update instead.

## 3. WHAT'S INSIDE

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Authoritative packet contract for `/create:agent` and agent-authoring rules. |
| `references/` | Overflow route map (`README.md`) plus single-concern depth: `agent-vs-skill-vs-command.md`, `permission_design.md`, `common_pitfalls.md`. The primary workflow stays in `SKILL.md`; these hold only detail that would bloat it. |
| `assets/agent_template.md` | Canonical scaffold for production agent files, including frontmatter shape, Section 0 boundaries, workflow, output verification, anti-patterns, and summary structure. |
| `changelog/` | Packet-local changelog history (`v1.0.0.0.md` is the initial release; `.gitkeep` keeps the directory tracked). |
| `scripts/` | Not present in this packet. Use shared sk-doc validators from `../shared/scripts/`. |

## 4. QUICK START

1. Read `SKILL.md` for the packet contract.
2. Read `references/README.md` (the overflow route map) and `assets/agent_template.md` before writing an agent.
3. Decide whether the requested component truly needs a named runtime persona with tool permissions and authority boundaries.
4. Resolve the active runtime agent directory: `.opencode/agents/` for OpenCode/default, `.claude/agents/` for Claude Code.
5. Copy from `assets/agent_template.md`, then replace placeholders with the agent's actual role, permissions, workflow, verification, and boundaries.
6. Validate the final agent file with the shared sk-doc validators.

Example validation for an OpenCode agent:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/agent-name.md --type agent
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/agents/agent-name.md
```

## 5. RELATED

`create-agent` is a nested workflow packet of the `sk-doc` parent hub. This packet owns agent-authoring guidance and its local template/reference files only.

The shared document-quality backbone lives at `../shared`. The single advisor identity and workflow registry live at the `sk-doc` hub root, so this packet must not add packet-local advisor graph identity such as `graph-metadata.json`.
