---
title: "create-readme"
description: "Author current-state folder READMEs and folded five-phase install guides from real files, for anyone writing or refreshing a README.md."
trigger_phrases:
  - "create readme"
  - "write a readme"
version: 1.1.0.0
---

# create-readme

> Turn a bare folder into a README a reader can actually use, drawn from the files that are really there.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Current-state `README.md` and install-guide authoring, sourced from real files, never from memory |
| **Invoke with** | `/create:readme`, "create readme", "write a readme", "install guide" |
| **Works on** | Project, skill, feature, component and source-code folders, plus MCP server, CLI, plugin and tool installs |
| **Produces** | A `README.md` in the target folder or an `.opencode/install-guides/<slug>.md` |

---

## 2. OVERVIEW

### Why This Skill Exists

A folder with no README makes every visitor start from zero. They open every file, guess the entry point and wonder what is safe to touch. A README written from memory drifts fast. Paths get renamed and commands get replaced. The document quietly starts lying to the next reader. A single template applied everywhere also produces the wrong shape: a source-code folder needs topology and boundaries rather than a features list. An MCP server install needs a five-phase flow with validation checkpoints rather than prose. create-readme exists to read the real folder first and pick the shape that fits before writing a word.

### What It Does

create-readme turns a request into one of three current-state artifacts, chosen by what the folder needs. The shape table below names each one and what it operates on. It reads the target folder, nearby docs and existing commands before drafting, then copies the matching template as a scaffold and removes what does not fit. The entry point is the `/create:readme` command, with the natural phrases "create readme" and "write a readme" as alternatives.

It is the maintenance path, not the birth path. `create-skill` writes a brand-new skill's first README from its own `skill-readme-template.md` while scaffolding the package. create-readme is what you reach for afterward, to refresh that README against what the skill has become or to write one for anything that is not being scaffolded from scratch.

### The Three Output Shapes

| Shape | What the skill knows how to operate |
|---|---|
| **General README** | a project, skill, feature or component folder's current state, written as narrative prose with a quick start |
| **Code-folder README** | a source-code folder's topology, boundaries and allowed dependency direction, in technical reference voice |
| **Install guide** | an MCP server, CLI or plugin's folded five-phase setup with `phase_N_complete` checkpoints and STOP blocks |

---

## 3. QUICK START

**Step 1: Point it at a folder.**

```text
Use create-readme to write a concise README.md for .opencode/skills/sk-doc/sk-create-readme.
Read SKILL.md first, inspect references/assets/scripts and only document confirmed files.
```

**Step 2: Let it read before it writes.**

It reads `SKILL.md`, nearby docs, package or config files and existing commands in the target folder, then routes to one of the three output shapes before drafting anything.

**Step 3: Validate the result.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <path/to/README.md> --type readme
```

Expected output ends with `✅ VALID` and zero blocking issues.

**Step 4 (optional): Audit every README in the repo.**

```bash
python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . \
  --validator .opencode/skills/sk-doc/scripts/validate_document.py
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

Every run follows one lifecycle no matter which artifact comes out the other end. First it reads local evidence only: the target folder, nearby documentation, package files, config files and any commands already in use. It never documents a file, command, API or metric it has not confirmed. Second it routes by artifact type and folder purpose to one of the three output shapes described above. Third it drafts current-state content in the smallest useful shape, copying the matching template as a scaffold and deleting sections that do not earn their place rather than leaving placeholders. Fourth it validates the authored markdown and confirms every local link resolves before calling the work done.

### One Lifecycle, Three Shapes

The same read-route-draft-validate sequence produces very different documents depending on what the folder needs. A skill folder gets a narrative README with overview and quick start. A source-code folder like an adapter layer gets package topology and boundaries, plus allowed dependency direction, because a developer landing there needs to know what may import what, not a features list. An MCP server gets neither: it gets a folded five-phase install guide (prerequisites, installation, initialization, configuration, verification) with a `phase_N_complete` validation checkpoint and a STOP block after every phase that can fail, because the reader there is trying to get a working system, not understand a codebase.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-readme when a `README.md` needs to be created or refreshed for a project, skill, feature, component or source-code folder. Reach for it too when an MCP server or CLI tool needs an install guide or a plugin needs setup documentation. The repo-wide `audit_readmes.py` check for template drift or broken links also lands here.

Skip it when the folder is self-explanatory and a parent README or inline comments already give enough orientation. Also skip a brand-new skill's very first README: `create-skill` writes that one during scaffolding.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-skill` | Writes a new skill's first README while scaffolding the package. create-readme refreshes it afterward or writes README for anything not being scaffolded. |
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

A: When the official docs do not cover the tool's AI-platform configuration or its project-specific settings. A multi-step setup with validation checkpoints also earns a guide. A tool that is already well documented gets a link, not a guide. A one-line install gets an inline command instead.

**Q: Who writes the README for a skill I am creating right now?**

A: `create-skill`, using its own `skill-readme-template.md`, as one step in scaffolding the package. create-readme takes over once the skill exists and the README needs a refresh.

---

## 8. VERIFICATION

| Check | How to run it | Pass looks like |
|---|---|---|
| Document structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <path> --type readme` | `✅ VALID`, zero blocking issues |
| Repo-wide drift | `python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/scripts/validate_document.py` | `template_invalid: 0`, `broken_references: 0` |
| Authored name casing | `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <artifact-path-or-slug>` | Exits clean for install-guide slugs (`README.md` is exempt) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime workflow, routing rules and the full validation checklist |
| [`assets/readme-template.md`](./assets/readme-template.md) | Fillable scaffold for project, skill, feature and component READMEs |
| [`assets/readme-code-template.md`](./assets/readme-code-template.md) | Fillable scaffold for source-code folder READMEs, with diagram examples |
| [`assets/install-guide-template.md`](./assets/install-guide-template.md) | Fillable scaffold for the folded five-phase install guide |
| [`references/README.md`](./references/README.md) | Route map into the `readme/` and `install-guide/` reference groups |
| [`scripts/audit_readmes.py`](./scripts/audit_readmes.py) | Repo-wide template alignment and freshness audit |
