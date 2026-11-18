---
title: "create-readme"
description: "Author current-state folder READMEs from real files, for anyone writing or refreshing a README.md."
trigger_phrases:
  - "create readme"
  - "write a readme"
version: 1.1.7.0
---

# create-readme

> Write a README that matches what is in the folder, so the next reader knows where to start.

A folder README answers two questions for a reader: what this is and where to start. A README written from memory stops answering them as soon as a path or a command moves.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | A current-state `README.md` written from files that exist in the folder |
| **Invoke with** | `/create:readme` or a request that names a README |
| **Works on** | Project, skill, feature, component and source-code folders, plus repository root guides |
| **Produces** | A `README.md`, a root guide, a runtime folder's `SYNC.md` or a skill package's `ARCHITECTURE.md` |

### What It Does

create-readme writes documentation from evidence. It reads the target folder, nearby docs, package files, config files and the commands already in use before it drafts. Then it picks the matching template and removes the sections the folder does not need. The result describes the folder as it stands. Start with `/create:readme`.

### What It Does Not Do

It does not audit, validate, score or optimize an existing document. `create-quality-control` owns that pass. It does not scaffold a new skill, agent, command or changelog, because each of those has its own `sk-doc` packet. It also writes nothing when a folder is self-explanatory and a parent document already gives enough orientation.

### The Template Layer

Ten templates sit in `assets/`. The artifact type selects one before the folder decides the sections. That order matters. A source-code folder needs topology and allowed dependency direction, while a project folder needs an overview a newcomer can scan.

| Artifact | Template |
|---|---|
| Repository front page or general README | [`assets/readme-template.md`](./assets/readme-template.md) |
| Skill package README | [`assets/skill-readme-template.md`](./assets/skill-readme-template.md) |
| Source-code folder README | [`assets/readme-code-template.md`](./assets/readme-code-template.md) |
| Shared hook folder and its runtime adapters | [`assets/hook-readme-template.md`](./assets/hook-readme-template.md) |
| Runtime plugin or extension folder README | [`assets/runtime-plugin-readme-template.md`](./assets/runtime-plugin-readme-template.md) |
| Runtime folder README and `SYNC.md` | [`assets/runtime-folder-template.md`](./assets/runtime-folder-template.md) |
| Skill package `ARCHITECTURE.md` | [`assets/architecture-template.md`](./assets/architecture-template.md) |
| Repository install guide | [`assets/install-template.md`](./assets/install-template.md) |
| Repository contributing guide | [`assets/contributing-template.md`](./assets/contributing-template.md) |
| Repository security policy | [`assets/security-policy-template.md`](./assets/security-policy-template.md) |

---

## 2. QUICK START

**Step 1: Point it at a folder.**

```text
Use create-readme to write a README.md for .skilled/skills/sk-doc/sk-create-readme.
Read SKILL.md first, then inspect assets and scripts, and document only files you confirm.
```

Expected output: a `README.md` in that folder that names only the files and commands the run read.

**Step 2: Validate the shape.**

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-readme/README.md --type readme
```

Expected output from the repository root:

```text
✅ VALID: .skilled/skills/sk-doc/sk-create-readme/README.md
Document type: readme
Total issues: 0
```

Exit status is 0.

**Step 3: Prove the local links resolve.**

```bash
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/sk-doc/sk-create-readme/README.md
```

Expected output:

```text
PASS .skilled/skills/sk-doc/sk-create-readme/README.md: references=67 unresolved=0 examples=0 allowed=0
SUMMARY files=1 pass=1 fail=0
```

Exit status is 0.

**Step 4: Audit the whole repository when you need the full picture.**

```bash
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . \
  --validator .skilled/skills/sk-doc/shared/scripts/validate_document.py
```

Expected output is a JSON summary. It reports `readmes_total`, `template_valid`, `template_invalid`, `broken_references`, plus `findings_p1` and `findings_p2`. The command prints the summary and exits 0, so read the counts rather than the exit status.

---

## 3. HOW IT WORKS

A run moves through four stages. The order is the contract. It reads local evidence first, routes by artifact type, drafts from the matching template, then validates the markdown and every local link. A claim with no file behind it never reaches the draft.

```text
┌─────────────────────────────────────────────────────┐
│ README request                                      │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Read the folder, nearby docs and commands           │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Pick the artifact type and template                 │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Draft from the scaffold                             │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ Validate the markdown and the links                 │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│ README.md, a root guide, SYNC.md or ARCHITECTURE.md │
└─────────────────────────────────────────────────────┘
```

The evidence rule is the part readers notice. A command appears only after it ran. A path appears only after it opened. A count appears only after the folder proved it. That is why a refresh costs more than a copy edit. The old text is a claim to check, not a source.

### One Lifecycle, Two Shapes

Both README shapes share the lifecycle and differ in what they say. A general README serves a reader deciding whether the folder matters. It carries an overview and a quick start when a runnable path exists. The remaining sections follow the audience. A code-folder README serves a developer about to edit the folder. It carries package topology, boundaries, entrypoints and validation commands.

### The Directory Tree Rule

A code-folder README takes its navigation from the folder shape, not from taste. Count the immediate subdirectories first. When the count is above zero, the README needs a fenced directory tree. When the count is zero, it needs a table that names every direct file except the README. The validator reports `code_folder_directory_tree` or `code_folder_flat_inventory` when either piece is missing.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-readme when a folder needs its first README or an existing one has drifted from the files. It also covers a skill README handed over by `create-skill` and a repository front page with the root guides beside it. Developer orientation for a source-code folder belongs here too. Hook folders and the runtime folders that load them are in scope as well.

The boundary with `create-quality-control` matters. That packet audits, validates, scores or optimizes a document that already exists. This one writes or refreshes it. A request to check a README belongs there. A request to write one belongs here.

Skip it when the folder is self-explanatory and a parent README or inline comments already give enough orientation.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-skill` | Scaffolds a new skill package and hands its README step here. This packet writes that README and every later refresh. |
| `create-quality-control` | Audits, validates, scores or optimizes an existing document. This packet writes or refreshes the document first. |
| `create-changelog` | Owns versioned changelog entries. This packet owns the README the changelog sits beside. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `check_readme_references.py` prints `fail=1` | A link, a path-shaped code span or a tree line names a path that is not on disk | Re-read the folder and correct the path or add an `allow-ref` entry with a reason |
| The validator reports `code_folder_directory_tree` | A folder with subdirectories has no fenced tree | Add a small tree or write the README from `assets/readme-code-template.md` |
| The validator reports `code_folder_flat_inventory` | A flat folder has no complete direct-file table | Add a `CONTENTS` or `KEY FILES` table naming every direct file except the README |
| `check_authored_name_kebab.py` rejects a name | The name is not lowercase kebab-case | Rename it to match `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| A documented command fails | The command came from memory rather than the live folder | Re-read the package files and config, then write the command you ran |

---

## 6. FAQ

### Why Not Use One Template for Every Folder?

A project README and a source-code README serve different readers. One decides whether the folder matters. The other is about to edit it. A single shape either buries the topology or pads an overview with package internals. The artifact type picks the template. The folder decides which sections survive.

### Who Writes the README for a Skill I Am Creating?

`create-skill` scaffolds the package and hands the README step here. This packet writes it from `assets/skill-readme-template.md`. A later refresh starts from the same scaffold.

### Does It Refresh a README That Already Exists?

Yes. It reads the current folder and treats the old text as a claim to check. What survives is what the files still support.

### What Happens When the Artifact Type Is Unclear?

The router stops and reports `UNKNOWN_FALLBACK`. It asks which artifact and folder you mean and what validation you expect, then loads `references/README.md` as the fallback route map.

---

## 7. VERIFICATION

| Check | How to run it | Pass looks like |
|---|---|---|
| README structure | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <path> --type readme` | `✅ VALID` and `Total issues: 0` |
| Links and code spans | `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py <path>` | `SUMMARY files=1 pass=1 fail=0` and exit 0 |
| Count claims | `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py <path>` | `SUMMARY files=1 pass=1 fail=0` and exit 0 |
| Voice floor | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <path>` | `hard blockers: 0` |
| Repository audit | `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . --validator .skilled/skills/sk-doc/shared/scripts/validate_document.py` | A JSON summary with the finding counts, exit 0 |
| Operator scenarios | Run a scenario from the manual testing playbook by hand | A recorded pass or fail verdict with its reason |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime workflow, the two output shapes and the pre-publish checklist |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and load order |
| [`references/README.md`](./references/README.md) | Route map into the `readme/` overflow group |
| [`scripts/README.md`](./scripts/README.md) | The audit and the two gates, with flags and exit codes |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios for routing and evidence |
| [`assets/skill-readme-template.md`](./assets/skill-readme-template.md) | The skill README scaffold this file follows |
| [`hvr-rules.md`](../sk-create-with-human-voice/references/hvr-rules.md) | Human Voice Rules the README prose follows |
| [`validate_document.py`](../shared/scripts/validate_document.py) | The per-file validator the audit drives |
