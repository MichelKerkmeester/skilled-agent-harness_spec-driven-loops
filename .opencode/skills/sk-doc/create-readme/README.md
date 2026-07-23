---
title: "create-readme"
description: "Author current-state folder READMEs and folded five-phase install guides from real files, for anyone writing or refreshing a README.md."
trigger_phrases:
  - "create readme"
  - "write a readme"
version: 1.0.0.0
---

# create-readme

> Turn a bare folder into a README a reader can actually use, drawn from the files that are really there.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Current-state `README.md` and install-guide authoring, sourced from real files, never from memory |
| **Invoke with** | `/create:readme`, "create readme", "write a readme", "install guide" |
| **Works on** | Project, skill, feature, component and source-code folders, plus MCP server, CLI and plugin installs |
| **Produces** | A `README.md` in the target folder, or `.opencode/install-guides/<slug>.md` |

---

## 2. OVERVIEW

### Why This Skill Exists

A folder with no README makes every visitor start from zero: open every file, guess the entry point, guess what is safe to touch. A README written from memory drifts fast. Paths get renamed, commands get replaced, and the document quietly starts lying to the next reader. A single template applied everywhere also produces the wrong shape: a source-code folder needs topology and boundaries, not a features list, and an MCP server install needs a five-phase flow with validation checkpoints, not prose. create-readme exists to read the real folder first and pick the shape that fits before writing a word.

### What It Does

create-readme turns a request into one of three current-state artifacts: a general README for a project, skill, feature or component, a code-folder README for developer orientation or a folded five-phase install guide for MCP servers, CLI tools and plugins. It reads the target folder, nearby docs and existing commands before drafting, then copies the matching template as a scaffold and removes what does not fit. It is the maintenance path, not the birth path: `create-skill` writes a brand-new skill's first README from its own `skill-readme-template.md` while scaffolding the package. create-readme is what you reach for afterward, to refresh that README against what the skill has become, or to write one for anything that is not being scaffolded from scratch.

---

## 3. QUICK START

**Step 1: Point it at a folder.**

```text
Use create-readme to write a concise README.md for .opencode/skills/sk-doc/create-readme.
Read SKILL.md first, inspect references/assets/scripts and only document confirmed files.
```

**Step 2: Let it read before it writes.**

It reads `SKILL.md`, nearby docs, package or config files and existing commands in the target folder, then routes to README, code-folder README or install guide before drafting anything.

**Step 3: Validate the result.**

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <path/to/README.md> --type readme
```

Expected output ends with `✅ VALID` and zero blocking issues.

**Step 4 (optional): Audit every README in the repo.**

```bash
python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --repo-root . \
  --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py
```

Expected output is a JSON summary, for example:

```json
{
  "readmes_total": 1,
  "template_valid": 1,
  "broken_references": 3,
  "missing_key_artifacts": 0,
  "findings_p1": 3
}
```

---

## 4. HOW IT WORKS

Every run follows one lifecycle no matter which artifact comes out the other end. First it reads local evidence only: the target folder, nearby documentation, package files, config files and any commands already in use. It never documents a file, command, API or metric it has not confirmed. Second it routes by artifact type and folder purpose, choosing among a general README, a code-folder README and an install guide. Third it drafts current-state content in the smallest useful shape, copying the matching template as a scaffold and deleting sections that do not earn their place rather than leaving placeholders. Fourth it validates the authored markdown and confirms every local link resolves before calling the work done.

### One Lifecycle, Three Shapes

The same read-route-draft-validate sequence produces very different documents depending on what the folder needs. A skill folder gets a narrative README with overview and quick start. A source-code folder like an adapter layer gets package topology, boundaries and allowed dependency direction instead, because a developer landing there needs to know what may import what, not a features list. An MCP server gets neither: it gets a folded five-phase install guide (prerequisites, installation, initialization, configuration, verification) with a `phase_N_complete` validation checkpoint and a STOP block after every phase that can fail, because the reader there is trying to get a working system, not understand a codebase.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-readme when a `README.md` needs to be created or refreshed for a project, skill, feature, component or source-code folder, or when an MCP server, CLI tool or plugin needs an install guide. Reach for it too when running the repo-wide `audit_readmes.py` check for template drift or broken links. Skip it when the folder is self-explanatory and a parent README or inline comments already give enough orientation, and skip it for a brand-new skill's very first README, which `create-skill` writes as part of scaffolding.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-skill` | Writes a new skill's first README while scaffolding the package. create-readme refreshes it afterward, or writes README for anything not being scaffolded. |
| `create-quality-control` | Audits, scores or optimizes an existing document without rewriting it. create-readme authors or refreshes the document itself. |
| `create-changelog` | Owns versioned changelog entries. create-readme owns the README the changelog sits next to. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `audit_readmes.py` reports `broken_references` | A linked path was renamed or moved after the README was written | Re-read the current folder contents and correct the relative link |
| Validator fails on a code-folder README | The general README shape was used where topology and boundaries were needed | Switch to `assets/readme-code-template.md` and rewrite in technical reference voice |
| Install guide fails the STOP-block check | A validation checkpoint has no STOP condition after it | Add a `❌ STOP if validation fails` block after every phase that can fail |
| `check_authored_name_kebab.py` rejects a slug | The install-guide slug is not lowercase kebab-case | Rename to match `^[a-z0-9]+(?:-[a-z0-9]+)*$` before resolving the output path |
| Commands in the README do not match reality | The document was drafted from memory instead of the live folder | Re-read package files, config and existing commands, then rewrite from confirmed evidence |

---

## 7. FAQ

**Q: Why not use one README template for everything?**

A: A project README and a source-code folder README serve different readers with different needs. Forcing both into the same shape either buries the topology a developer needs or pads a project overview with irrelevant package internals. create-readme routes to the shape the folder actually needs.

**Q: When do I get an install guide instead of a README?**

A: When the tool needs AI-platform configuration, project-specific settings or a multi-step setup the official docs do not cover. A tool that is already well documented gets a link, not a guide, and a one-line install gets an inline command instead.

**Q: Who writes the README for a skill I am creating right now?**

A: `create-skill`, using its own `skill-readme-template.md`, as one step in scaffolding the package. create-readme takes over once the skill exists and the README needs a refresh.

---

## 8. VERIFICATION

| Check | How to run it | Pass looks like |
|---|---|---|
| Document structure | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <path> --type readme` | `✅ VALID`, zero blocking issues |
| Repo-wide drift | `python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py` | `template_invalid: 0`, `broken_references: 0` |
| Authored name casing | `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <artifact-path-or-slug>` | Exits clean for install-guide slugs (`README.md` is exempt) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime workflow, routing rules, and the full validation checklist |
| [`assets/readme-template.md`](./assets/readme-template.md) | Fillable scaffold for project, skill, feature, and component READMEs |
| [`assets/readme-code-template.md`](./assets/readme-code-template.md) | Fillable scaffold for source-code folder READMEs, with diagram examples |
| [`assets/install-guide-template.md`](./assets/install-guide-template.md) | Fillable scaffold for the folded five-phase install guide |
| [`references/README.md`](./references/README.md) | Route map into the `readme/` and `install-guide/` reference groups |
| [`scripts/audit_readmes.py`](./scripts/audit_readmes.py) | Repo-wide template alignment and freshness audit |
