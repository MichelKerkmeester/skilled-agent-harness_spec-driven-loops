---
name: create-readme
description: Author folder READMEs and install guides for sk-doc, including code-folder orientation, skill/project READMEs and folded five-phase install guides.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-readme, folder readme, code folder readme, project readme, skill readme, install guide, /create:folder_readme, audit_readmes -->

# Create README (workflow)

`create-readme` is the README authoring packet in the `sk-doc` family. It writes current-state folder READMEs and install guides from local evidence, using packet-local templates under `assets/readme/` and shared doc-quality validators under `../shared`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:

- Creating or refreshing a folder `README.md`.
- Documenting a project, skill, feature, component or source-code directory.
- Writing developer orientation for a code folder, including topology, boundaries, entrypoints and validation.
- Creating an install guide for MCP servers, plugins, CLI tools or development dependencies.
- Running `/create:folder_readme`.
- Auditing README freshness, broken local references or key artifact coverage.

Keyword triggers: `create readme`, `folder readme`, `write readme`, `README.md`, `install guide`, `installation guide`, `setup guide`, `code folder readme`, `/create:folder_readme`, `audit readmes`.

### When NOT to Use

Skip this packet when:

- The user wants general prose quality review of an existing document. Use the doc-quality packet.
- The user wants to scaffold a skill, agent, command, benchmark, feature catalog or testing playbook. Use that specific sk-doc packet.
- The target is not markdown.
- The folder is self-explanatory and a parent README or inline comments already give enough orientation.
- The requested output is a changelog or release note.

### Family Boundary

This is a nested workflow packet under the `sk-doc` parent hub. It owns README and install-guide authoring only. It does not carry `graph-metadata.json`; advisor identity, skill graph metadata and cross-packet routing live at the `sk-doc` hub root.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by artifact type first, then by folder purpose:

```text
README REQUEST
    |
    +- General project, skill, feature or component README
    |  -> references/readme_creation.md
    |  -> assets/readme/readme_template.md
    |
    +- Source-code folder README
    |  -> references/readme_creation.md
    |  -> assets/readme/readme_code_template.md
    |
    +- Install guide
    |  -> references/install_guide_creation.md
    |  -> assets/readme/install_guide_template.md
    |
    +- Existing README audit
       -> scripts/audit_readmes.py
       -> ../shared/scripts/validate_document.py
```

### Resource Domains

- `references/readme_creation.md` defines README purpose, type selection, progressive disclosure, two-tier voice and section standards.
- `references/install_guide_creation.md` defines the five-phase installation workflow, validation checkpoints and STOP blocks.
- `assets/readme/readme_template.md` is the fillable scaffold for project, skill, feature and component READMEs.
- `assets/readme/readme_code_template.md` is the source-folder README scaffold for package topology, boundaries, flow and validation.
- `assets/readme/install_guide_template.md` is the 11-section install-guide scaffold.
- `scripts/audit_readmes.py` audits README template alignment, broken local references and key artifact coverage.
- `../shared/references/global/` supplies core standards, validation rules, HVR and evergreen current-state rules.
- `../shared/scripts/validate_document.py`, `quick_validate.py` and `extract_structure.py` provide deterministic validation.

### Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any README or install-guide task | `../shared/references/global/core_standards.md`, `../shared/references/global/hvr_rules.md`, `../shared/references/global/evergreen_packet_id_rule.md` |
| ALWAYS | Any README creation task | `references/readme_creation.md` |
| CONDITIONAL | Project, skill, feature or component README | `assets/readme/readme_template.md` |
| CONDITIONAL | Source-code folder README | `assets/readme/readme_code_template.md` |
| CONDITIONAL | Install guide | `references/install_guide_creation.md`, `assets/readme/install_guide_template.md` |
| CONDITIONAL | Existing README audit | `scripts/audit_readmes.py`, `../shared/scripts/validate_document.py` |
| ON_DEMAND | Structural diagnosis | `../shared/scripts/extract_structure.py` |

---

## 3. HOW IT WORKS

### README Authoring Workflow

1. Identify the target folder, audience and README type before drafting.
2. Read the target folder contents and nearby documentation. Do not invent commands, files, APIs or capabilities.
3. Choose the smallest useful README shape. Use `readme_template.md` for project, skill, feature and component roots. Use `readme_code_template.md` for source folders.
4. Write current-state documentation only. Use stable file paths, commands and feature names rather than packet IDs, migration history or temporary planning labels.
5. Put orientation first: what this is, who it is for and how to use or navigate it.
6. Use progressive disclosure: overview first, quick start only when there is a runnable path, detailed reference later.
7. Remove unused template sections instead of leaving placeholders.
8. Validate with the shared validator before delivery.

### Install Guide Workflow

1. Confirm the install actually needs a guide rather than a one-line command or link to official docs.
2. Load `references/install_guide_creation.md` and `assets/readme/install_guide_template.md`.
3. Build the folded five-phase flow: prerequisites, installation, initialization when needed, configuration and verification.
4. Add validation checkpoints using `phase_N_complete` labels.
5. Add a STOP block after every checkpoint that can fail.
6. Include platform-specific configuration only when it is real for the tool.
7. Put troubleshooting in its own reference section, not inside the phase flow.
8. Test or clearly mark commands whose behavior cannot be verified locally.

### Audit Workflow

For repository README audits, run from the repo root:

```bash
python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py
```

Use `--json-out`, `--markdown-out` or `--inventory-out` when the user needs artifacts. Treat broken references, missing key artifact coverage and validator blocking errors as findings to fix or report.

---

## 4. RULES

### ALWAYS

1. Read the target folder and nearby docs before writing.
2. Choose the README type before choosing a template.
3. Keep READMEs current-state and reader-focused.
4. Use relative links for local documents.
5. Use fenced code blocks with language tags.
6. Test documented commands when feasible.
7. Show expected output for verification commands.
8. Use tables for file maps, options, comparisons and troubleshooting.
9. Run shared validation on authored markdown.
10. Keep `README.md` and `SKILL.md` casing intact.

### NEVER

1. Add a Table of Contents or anchor-comment navigation.
2. Leave template placeholders in the final document.
3. Document commands, files or features not confirmed from the workspace or user-provided evidence.
4. Cite mutable packet numbers, phase IDs or migration bookkeeping in durable README content.
5. Force Quick Start, Features, FAQ or Troubleshooting into a code-folder README when the folder only needs orientation.
6. Proceed past a failed install-guide checkpoint without a STOP instruction.
7. Create `graph-metadata.json` in this packet.

### ESCALATE IF

1. The target folder purpose or audience is unclear.
2. The README would require product, brand or public-facing claims that are not in the repo.
3. Install steps need secrets, paid services, destructive operations or external accounts.
4. Validation fails in a way that requires changing code or configuration outside the requested document.
