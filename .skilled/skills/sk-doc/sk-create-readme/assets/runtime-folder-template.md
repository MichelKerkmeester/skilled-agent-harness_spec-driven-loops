---
title: Runtime Folder README and Sync Manifest Template
description: Fillable scaffolds for the two documents at the top of a runtime folder such as .pi/ or .claude/, the README a user reads and the SYNC.md manifest a maintainer reads, with the rule for splitting facts between them.
trigger_phrases:
  - "runtime folder readme template"
  - "runtime readme template"
  - "sync manifest template"
  - "runtime sync doc template"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Runtime Folder README and Sync Manifest Template

Use this template for the two documents at the top of a runtime folder, such as `.pi/` or `.claude/`: `README.md` and `SYNC.md`.

---

## 1. OVERVIEW

### Purpose

A runtime folder is where one AI runtime reads this repository. Most of what it holds is generated from `.skilled/` or linked to it, and a few files are written by hand. Two documents explain the folder, and each one serves a different reader.

The README is for someone who uses the runtime here. It says what they get and how to check the folder is healthy. The sync manifest is for someone who changes a source. It lists every surface with its source and names the check that catches drift on each one.

### Usage

Copy the README scaffold in Section 4 into the runtime folder as `README.md`, and the manifest scaffold in Section 5 as `SYNC.md`. Fill both from the folder listing, the generators under `.skilled/`, the runtime's own config files and the check commands. Then remove the sections the runtime does not need and renumber the rest.

Both files sit below the repository root, so they separate their H2 sections with `---` rules. The validator has no rule set named for `SYNC.md` and falls back to the README rules with a warning. Run it with `--type readme` to apply those rules on purpose.

### Why One Template Holds Both

The two documents describe the same surfaces at two depths, and most runtime folders keep both. `.vibe/` has only a `SYNC.md` so far. `.opencode/SYNC.md` is shorter than the rest, because almost every entry in that folder is a link. Writing both documents from one template keeps the split in one place. A fact lives in the manifest in full and in the README as one line that points there. Two separate templates would let each one drift toward repeating the other.

---

## 2. SECTION MODEL

### README

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. An At a Glance table, then what the reader gets |
| 2 | HOW IT CONNECTS TO SKILLED | Always. One row for each piece: instructions, skills, agents, commands, hooks and MCP |
| 3 | GETTING STARTED | Always. The few steps from a fresh checkout to a working session |
| 4 | WHAT IS GENERATED AND WHAT IS AUTHORED | Always. One row for each path, then the one rule about editing |
| 5 | CHECKING IT IS HEALTHY | Always. The check commands and what they print |
| 6 | LIMITS AND KNOWN GAPS | The runtime has gaps a user meets |
| 7 | RELATED | Always |

### Sync Manifest

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. How the runtime reads the folder, and what is generated, linked or authored |
| 2 | SURFACE INVENTORY | Always. One row for each surface, with its mechanism, source and drift check |
| 3 | WHAT THIS FOLDER NEVER HOLDS | Something a reader might expect here lives elsewhere on purpose, such as keys or a home directory |
| 4 | WHEN TO SYNC | Always. Each source change and the generator it calls for |
| 5 | SYNC WORKFLOW | Always. The commands that regenerate the owned trees |
| 6 | FORMAT CONTRACT | A generator translates into a dialect the runtime reads |
| 7 | REQUIRED PARITY | The runtime must carry the same set as its siblings |
| 8 | DRIFT CHECKS | Always. One row for each check, with its exit codes |
| 9 | KNOWN GAPS | Some drift has no check |
| 10 | RELATED DOCUMENTS | Always |

---

## 3. WRITING RULES

- Give each fact one home. The manifest holds the full surface inventory, the format contract and the drift checks. The README names each piece in one row and links the manifest.
- Open the README with the At a Glance table. Its four rows say what the folder is for, how to start, what it works on and what checks it.
- Say how the runtime reads the folder before anything else in the manifest. A runtime that walks up from the working directory, reads only a trusted folder or loads only named patches changes what every later row means.
- Mark each surface as generated, linked, re-exported or authored. A reader who edits a generated file loses the edit at the next run.
- Pair each source change in WHEN TO SYNC with the one command it calls for.
- Give each drift check its exit codes, so a reader can tell a pass from drift without reading the script.
- Write each gap as a bold lead and one or two sentences: what can drift, and what catches it or why nothing does.
- Keep dates, versions and counts out of prose unless a check derives them. A count that drifts needs a `readme-check` allow comment.
- Use plain words in prose. Put in a code block only a command the reader runs.

---

## 4. README SCAFFOLD

````markdown
---
title: "[Runtime] in [Repository]"
description: "How [Runtime] uses this repository: [what it gets], [how its hooks run] and the checks that confirm it."
trigger_phrases:
  - "[runtime] in [repository]"
  - "[runtime] folder readme"
---

# [Runtime] in [Repository]

> [One sentence on how this runtime reaches the shared skills and guards.]

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | [Working on this repository in [Runtime] with the shared guards and skills] |
| **Start with** | [The command that starts a session in this checkout] |
| **Works on** | [Which sessions read this folder] |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

[Two short paragraphs. How the hooks reach this runtime, and why a fix to a guard needs no copy here. How the shared instructions arrive.]

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How [Runtime] gets it |
|---|---|
| Instructions | [The root `AGENTS.md`, and how the runtime finds it] |
| Skills | [A link or a generated tree] |
| Agents | [Generated, linked or forked, and from where] |
| Commands | [Links, prompt stubs or none] |
| Hooks and guards | [Where they are registered, and what they cover] |
| MCP | [The file that registers the Code Mode server] |

---

## 3. GETTING STARTED

1. [Start the runtime from the repository root, and what it loads.]
2. [How to reach a command or prompt.]
3. Run the checks in section 5 after you change a source file.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `[path]` | [Generated, link or authored] | [What writes it, or why it is authored] |

**The one rule:** [Never edit the generated paths by hand. Change the source in `.skilled/`, then rerun the matching generator.] The [sync manifest](./SYNC.md) lists every surface with its source.

---

## 5. CHECKING IT IS HEALTHY

```bash
[check command]
[check command]
```

[What each one prints on a pass, and the exit code.] `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **[What can drift.]** [One sentence on the effect, then the check that catches it or why none does.]

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, format contract and drift checks
- [`[hooks or plugins folder]/README.md`]([relative path]): how each entry reaches its hook core
- [`.skilled/hooks/README.md`]([relative path]): the hook cores and the coverage matrix
- [`README.md`]([relative path]): the repository overview
````

---

## 5. SYNC MANIFEST SCAFFOLD

````markdown
---
title: "[Runtime]: Runtime Sync Manifest"
description: "How [folder] derives from .skilled: [what is generated], [what is linked], [what is authored] and how to detect drift."
---

# [Runtime] Sync Manifest

> [One sentence on the source of truth and the main way this folder follows it.]

---

## 1. OVERVIEW

[How the runtime reads this folder: where it looks, what it loads and any condition, such as a trust gate.]

[What is generated, what is linked and what is written by hand, and why the authored parts cannot be generated.]

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `[path]` | [generated, link, re-export or authored] | `[source path]` or none | [Yes, with the check that catches it, or No and why] |

---

## 3. WHAT THIS FOLDER NEVER HOLDS

| Kept out | Where it lives | Why |
|---|---|---|
| [Keys, a home directory or installed packages] | [Where instead] | [What would go wrong here] |

---

## 4. WHEN TO SYNC

- [A source change] → rerun `[generator]`.
- [A change nothing regenerates] → [what to review or edit by hand].

---

## 5. SYNC WORKFLOW

```bash
[generator command]
[generator command]
```

[One sentence on what a write run does beyond writing, such as pruning stale output.]

---

## 6. FORMAT CONTRACT

[The dialect a generator writes, with one short example of its output.]

```yaml
[example of generated frontmatter]
```

[What the translation loses, so a reader knows the output never round-trips.]

---

## 7. REQUIRED PARITY

- [What this runtime must carry that its siblings carry, and the check that is authoritative.]

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| [What it checks] | `[command] --check` | 0 ok / 1 drift |
| Everything at once | `/doctor:runtime-mirrors` | read-only |

---

## 9. KNOWN GAPS

- **[What can drift without a check.]** [Why nothing catches it, and where it would show up.]

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a user of this runtime gets |
| `[generator README path]` | The generator contract |
| [`../[sibling]/SYNC.md`](../[sibling]/SYNC.md) | A sibling runtime manifest |
````

---

## 6. VALIDATION CHECKLIST

- [ ] Every path in the folder appears in the manifest's surface inventory, and every surface row names its drift check or says why it cannot drift.
- [ ] The README names each piece in one row and links the manifest for the detail.
- [ ] Every check command ran from the repository root, and the pass output and exit code are shown.
- [ ] Every generator named in WHEN TO SYNC exists at the path given.
- [ ] H2 sections are numbered, ALL CAPS and separated by `---` in both files.
- [ ] `validate_document.py` reports zero issues on the README, and on `SYNC.md` with `--type readme`.
- [ ] `hvr_scan.py` reports zero hard blockers on both files.

---

## 7. RELATED RESOURCES

- [`readme-template.md`](./readme-template.md) - Selection guide for every README template.
- [`runtime-plugin-readme-template.md`](./runtime-plugin-readme-template.md) - The plugin, extension or hook folder inside a runtime folder.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
