# Digest: .opencode/skills/sk-doc/sk-create-readme

Skill path: `.opencode/skills/sk-doc/sk-create-readme/` | Versions covered: v1.0.0.0 to v1.1.0.0 (both entries in the changelog directory, fewer than ten exist) | Dates: the entry files carry no date field in their frontmatter. Commit dates for the two files are 2026-07-28 (`v1.0.0.0.md`) and 2026-08-13 (`v1.1.0.0.md`).

---

## 1. PER VERSION, NEWEST FIRST

### v1.1.0.0 (`changelog/v1.1.0.0.md`)

A README conformance pass out of the skill-readme refinement packet. The packet's own `README.md` was rewritten purpose-first against `skill-readme-template.md`: a one-line pitch at the top, a problem-first OVERVIEW, an AT A GLANCE table as the opening section, a capability table covering the three output shapes and numbered ALL-CAPS H2 sections separated by dividers. A new capability section named `The Three Output Shapes` was added, naming the general README, the code-folder README and the install guide with what each one does at the file level. The entry states that every confirmed command, path and script from the previous version survived the rewrite and that the HVR grep gate returns zero hits. The `README.md` version field went from `1.0.0.0` to `1.1.0.0`. MOVED PATH: the README's validator invocation and the audit `--validator` argument now point at `.opencode/skills/sk-doc/scripts/validate_document.py` instead of the former `shared/scripts/` location, which the entry describes as a byte-identical copy so every shown command still runs. The entry is explicit that `SKILL.md` stayed at `1.0.0.0`, that no skill file, reference, asset or script moved, and that the `v1.0.0.0` entry stayed byte-identical.

### v1.0.0.0 (`changelog/v1.0.0.0.md`)

First release of `create-readme` as a workflow packet inside the `sk-doc` parent hub, described there as one of ten workflow packets in the hub's workflow-only architecture. The packet authors current-state folder `README.md` files (general project, skill, feature and component READMEs plus source-code folder orientation) and five-phase install guides covering sections 0 through 10, prerequisites through verification, working from local evidence only and routing by artifact type and folder purpose rather than one fixed template. Shipped contents: `SKILL.md` as the primary workflow contract with the route-by-artifact-type decision trees, the README authoring workflow, the general and code-folder output shapes, the folded install-guide workflow with validation checkpoints and STOP blocks, the validation and audit workflow and the writing rules. Also `references/readme_creation.md` and `references/install_guide_creation.md`, three fillable templates under `assets/readme/` (`readme-template.md`, `readme-code-template.md`, `install-guide-template.md`, the last one an 11-section scaffold) and `scripts/audit_readmes.py`, a repository README audit that checks template alignment, broken local references and key artifact coverage. The entry notes the packet deliberately carries no `graph-metadata.json`, because advisor identity, skill graph metadata and cross-packet routing live at the `sk-doc` hub root.

---

## 2. FACTS THE V4 DRAFT GETS WRONG OR MISSES

- Packet count. Draft line 132 says `sk-doc` routes to "fourteen nested `sk-create-*` workflow packets". `changelog/v1.0.0.0.md` says `create-readme` was one of **ten** workflow packets at first release, and a directory listing of `.opencode/skills/sk-doc/` shows **thirteen** `sk-create-*` packets today. The draft number matches neither the entry nor the current tree.
- The install-guide capability is missing from the draft. `changelog/v1.0.0.0.md` establishes install-guide authoring (sections 0 through 10, prerequisites through verification, with validation checkpoints and STOP blocks) as half of what this packet does, and `changelog/v1.1.0.0.md` restates it as one of the three output shapes. The draft names `sk-create-readme` only in the packet list at line 132 and never mentions install guides anywhere.
- The `audit_readmes.py` audit script is missing from the draft. `changelog/v1.0.0.0.md` ships it as a repository-wide README audit for template alignment, broken local references and artifact coverage. No draft line mentions it.
- The validator path move is missing from the draft. `changelog/v1.1.0.0.md` records the shift from `shared/scripts/` to `.opencode/skills/sk-doc/scripts/validate_document.py`. A grep of the draft for `validate_document` returns no hits, so a reader scripting against the old path gets no warning, even though the entry says the old copy is byte-identical rather than gone.
- The `folder_readme` to `readme` command rename at draft line 136 is not recorded in either changelog entry. That is a gap in the packet's own changelog rather than a proven draft error. The draft claim could not be confirmed or refuted from these two entries.
- Version identity drift, verifiable in the tree rather than in the draft. `changelog/v1.1.0.0.md` states under NOT CHANGED that `SKILL.md` stays at `1.0.0.0`, but the live `SKILL.md` frontmatter reads `version: 1.1.0.0` and the live `README.md` frontmatter reads `version: 1.1.0.13`. Both moved past what the last changelog entry documents, so releases after v1.1.0.0 went unrecorded.

---

## 3. CURRENT VERSION AND IDENTITY

- `SKILL.md` frontmatter version: **1.1.0.0** (`name: sk-create-readme`).
- `README.md` frontmatter version: **1.1.0.13**, ahead of both `SKILL.md` and the newest changelog entry.
- Identity: a **mode** (nested workflow packet), not a hub and not standalone. There is no `mode-registry.json` at `.opencode/skills/sk-doc/sk-create-readme/`, and the parent `.opencode/skills/sk-doc/` carries `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json` and `ROUTER.md`. The packet root holds only `README.md`, `SKILL.md`, `assets/`, `changelog/`, `manual-testing-playbook/`, `references/` and `scripts/`, and `changelog/v1.0.0.0.md` states outright that advisor identity and graph metadata live at the hub root.
