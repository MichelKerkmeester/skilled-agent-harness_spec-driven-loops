# create-readme

`create-readme` is the `sk-doc` workflow packet for writing current-state folder READMEs and install guides from local evidence.

## When To Use

Use this packet when you need to create, refresh, or audit a `README.md`, especially for:

- Project, skill, feature, or component orientation.
- Source-code folder documentation with topology, boundaries, entrypoints, and validation.
- Install guides for MCP servers, plugins, CLI tools, or development dependencies.
- `/create:folder_readme` requests.
- README freshness checks, broken local reference checks, or key artifact coverage audits.

Do not use it for general prose review, changelogs, release notes, non-markdown targets, or scaffolding other `sk-doc` artifacts.

## What's Inside

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Authoritative workflow contract, routing rules, loading levels, and validation expectations. |
| `references/readme_creation.md` | README type selection, progressive disclosure, voice, and section standards. |
| `references/install_guide_creation.md` | Five-phase install-guide workflow, validation checkpoints, and STOP-block rules. |
| `assets/readme/readme_template.md` | Template for project, skill, feature, and component READMEs. |
| `assets/readme/readme_code_template.md` | Template for source-code folder READMEs. |
| `assets/readme/install_guide_template.md` | Template for install guides. |
| `scripts/audit_readmes.py` | Repository README audit script for template alignment, local references, and artifact coverage. |
| `changelog/` | Packet-local change history. |
| `README.md` | Human orientation for this packet. |

## Quick Start

Example request:

```text
Use create-readme to write a concise README.md for .opencode/skills/sk-doc/create-readme.
Read SKILL.md first, inspect references/assets/scripts, and only document confirmed files.
```

For a README audit from the repo root:

```bash
python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py
```

## How It Fits

This is a nested workflow packet of the `sk-doc` parent hub.

The shared doc-quality backbone lives at `../shared`, including common standards and validators such as `validate_document.py`, `quick_validate.py`, and `extract_structure.py`.

The single advisor identity, skill graph metadata, and packet registry live at the `sk-doc` hub root, not inside this packet.
