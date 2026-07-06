# create-readme

`create-readme` is the `sk-doc` workflow packet for writing current-state folder READMEs and install guides from local evidence.

## 1. OVERVIEW

This workflow packet turns a README or install-guide request into a current-state document, routing by artifact type and folder purpose and using packet-local templates instead of a single fixed structure. It writes general project, skill, feature and component READMEs, source-code folder orientation, and folded five-phase install guides.

## 2. WHEN TO USE

Use this packet when you need to create, refresh or audit a `README.md`, especially for:

- Project, skill, feature or component orientation.
- Source-code folder documentation with topology, boundaries, entrypoints and validation.
- Install guides for MCP servers, plugins, CLI tools or development dependencies.
- `/create:folder_readme` requests.
- README freshness checks, broken local reference checks or key artifact coverage audits.

Do not use it for general prose review, changelogs, release notes, non-markdown targets or scaffolding other `sk-doc` artifacts. Those belong in the doc-quality packet or another `sk-doc` workflow.

## 3. WHAT'S INSIDE

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Authoritative workflow contract: routing rules, README and install-guide workflows, output shapes and validation expectations. |
| `references/readme_creation.md` | README type selection, progressive disclosure, voice and section standards. |
| `references/install_guide_creation.md` | Five-phase install-guide workflow, validation checkpoints and STOP-block rules. |
| `assets/readme/readme_template.md` | Template for project, skill, feature and component READMEs. |
| `assets/readme/readme_code_template.md` | Template for source-code folder READMEs, including diagram examples. |
| `assets/readme/install_guide_template.md` | Template for install guides. |
| `scripts/audit_readmes.py` | Repository README audit for template alignment, local references and artifact coverage. |
| `changelog/` | Packet-local changelog history (`v1.0.0.0.md` is the initial release; `.gitkeep` keeps the directory tracked). |

## 4. QUICK START

1. Read `SKILL.md` for the packet contract.
2. Read the target folder, nearby docs, package files and config files before drafting.
3. Choose the README type, then copy the matching template from `assets/readme/` as a scaffold.
4. Write current-state content only, remove unused sections and verify local links resolve.
5. Validate the authored markdown with the shared sk-doc validators.

Example request:

```text
Use create-readme to write a concise README.md for .opencode/skills/sk-doc/create-readme.
Read SKILL.md first, inspect references/assets/scripts, and only document confirmed files.
```

Example repository README audit from the repo root:

```bash
python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py
```

## 5. RELATED

`create-readme` is a nested workflow packet of the `sk-doc` parent hub. It owns README and install-guide authoring and its local template, reference and script files only.

The shared document-quality backbone lives at `../shared`, including common standards and validators such as `validate_document.py`, `quick_validate.py` and `extract_structure.py`. The single advisor identity, skill graph metadata and packet registry live at the `sk-doc` hub root, so this packet must not add packet-local advisor graph identity such as `graph-metadata.json`.
