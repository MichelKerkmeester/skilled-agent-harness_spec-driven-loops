---
title: "create-frontmatter"
description: "Owns the YAML frontmatter contract: which fields each document class carries, what the description budget allows, and how the 4-part version field is derived."
trigger_phrases:
  - "create frontmatter mode"
  - "frontmatter contract owner"
  - "what does create-frontmatter do"
  - "which frontmatter fields do i need"
  - "how is the version field derived"
  - "why was my frontmatter rejected"
importance_tier: normal
contextType: general
version: 1.0.0.3
---

# create-frontmatter

> The block at the top of every document in this repository follows one contract. This is where that contract lives.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Authoring a frontmatter block, fixing a rejected one, or deriving a `version` |
| **Invoke with** | "what frontmatter does this need", a validator rejection, or a direct read of `SKILL.md` |
| **Works on** | Any document class in the repository, plus the files the version standard puts out of scope |
| **Produces** | A correct block, a specific fix, or a derived 4-part version |
| **Does not produce** | The document itself, or a change to a validator |

---

## 2. OVERVIEW

### Why This Skill Exists

Frontmatter is small and it is load-bearing. The advisor routes on `trigger_phrases`. Discovery drops a skill whose `description` pushes the project over a shared character budget, and it drops it silently. A missing `version` fails a corpus gate. None of that is visible in the document body, so a wrong block looks like a working document right up until something stops finding it.

Six modes in this hub emit frontmatter and every one of their templates defers to the same specification. Until now that specification sat in the hub's shared tier, which is the right reach and the wrong ownership. Shared means anyone may read it. It also meant nobody was accountable for it, so it drifted from the validators that enforce it and no single mode could be asked to fix that.

This mode is the answer to "who owns frontmatter."

### What It Owns, And What It Does Not

It owns the **rules**: which fields a class carries, what each field may contain, the description budget and its trim style, and the derivation of the 4-part `version`.

It does not own the **enforcement**. Three scripts do that, and all three stay in the hub's shared tier: the versioning engine, the corpus gate that wraps it, and the fast validator that four command workflows call. They stay because a post-edit hook outside this hub resolves one of them by literal path on every qualifying edit. Moving them would break a runtime hook to gain a tidier diagram.

The split is worth stating plainly, because it decides where to go with a question. **The mode owns the contract, the shared tier keeps the enforcement.** If you want to know what a validator is checking for, read here. If you want to change how it checks, that is a shared-tier change and the contract moves first.

### Document Class Is The First Question

Almost every rejected block is a field that one class requires and another forbids. Read in isolation the field looks right, which is why reading the field row before the class row wastes the most time.

Skill manifests carry a name and an allowed-tools list. References and assets carry a five-field block the advisor harvests. Commands and agents carry frontmatter too and are deliberately outside the version standard. Spec documents use inline metadata instead of a block at all.

---

## 3. QUICK START

**Step 1: Name the class.** Skill manifest, readme, reference, asset, feature catalog, testing playbook, command, agent or spec doc. Everything else follows from it.

**Step 2: Read the contract.**

```bash
cat .opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md
```

Section 4 holds a copy-paste template per class. Section 3 explains what each field is for, including the description budget. Section 6 lists the four common breakages and their fixes.

**Step 3: Check the block you produced.**

```bash
python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py <skill-dir>
```

It reports missing fields, a malformed `version`, and a description over its soft target. The budget constants are duplicated into that script deliberately, so the script is fast and the markdown stays the source of truth for the reasoning.

---

## 4. HOW IT WORKS

Two documents carry everything.

The field reference is eleven sections. It opens with what frontmatter is and which classes carry it, then when to add a block and when to remove one, then a field-by-field reference, then a template per class, then validation rules, common fixes, auto-generation guidance and a quick-reference table. The description budget lives in section 3 with a worked before-and-after trim.

The versioning standard is nine sections covering one algorithm. A skill's anchor is the higher of its own frontmatter version and its highest changelog filename version, compared as integer tuples rather than strings. Every child document inherits major and minor from that anchor, seeds patch to zero, and computes build from its own edit history.

### Key Concept: The Numstat Gate

The build segment is the file's real edit count, and "real" is doing specific work.

Count commits with `git log --follow` alone and the number is three to five times too high. Two things inflate it. A historical repository-wide move rewrote every path, so every file carries the whole pre-move history as commits that changed zero of its lines. And bulk sweeps touch a file's siblings while listing the file as part of the commit.

Gating each commit on its own per-file added-plus-deleted line count removes both. Without the gate a document that has been edited four times reads as version 1.5.0.19, which is not wrong by a little.

### Key Concept: A Silent Budget

Descriptions share one project-wide allowance. Go over it and the longest entries are dropped from auto-discovery. Nothing errors and nothing warns at the point of failure. The skill simply stops being found.

That is why the trim rules are specific rather than a suggestion to be brief. Drop product and stack enumerations, drop marketing prose, and keep the skill name, the primary verb, the domain noun and the mode suffixes, because those last ones are what the advisor matches on. A description trimmed by deleting the routing tokens is under budget and no longer routes.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-frontmatter when a document needs a block and you do not know its class, when a validator rejected a block and named a field rather than a fix, when a description is over budget, or when a `version` needs deriving or reconciling.

Skip it when the document body is what needs writing, when a validator needs changing rather than understanding, or when the question is which skill should handle the request at all.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-create-skill` | Emits SKILL.md, reference and asset blocks. Its templates cite this contract |
| `sk-create-command` | Emits command blocks, which are outside the version standard by design |
| `sk-create-agent` | Emits agent blocks, also outside the version standard |
| `sk-create-changelog` | Owns the changelog whose highest filename version is half of the anchor calculation |
| `sk-create-feature-catalog` | Emits catalog blocks, which are in scope for `version` |
| `sk-create-manual-testing-playbook` | Emits playbook blocks, also in scope for `version` |
| `sk-create-quality-control` | Scores documents whose frontmatter this contract defines |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| A field is required in one file and rejected in another | The two files are different document classes | Read the class row in section 4 of the field reference, not the field row in section 3 |
| A skill stopped appearing in auto-discovery | The project description budget was exceeded and the longest entries were dropped | Trim descriptions to the budget. Nothing reports this at the point of failure |
| A trimmed description no longer routes | The trim removed the tokens the advisor matches on | Keep the skill name, primary verb, domain noun and mode suffixes. Cut enumerations instead |
| A computed version looks far too high | The edit count was not gated through per-file numstat | Gate each commit on its own added-plus-deleted count for that file |
| A versioning pass corrupted `trigger_phrases` | A YAML re-serializer reflowed the multi-line block sequence | Edit line-wise. Never re-serialize a frontmatter block |
| The corpus gate skips a file you expected it to fail | Files with no frontmatter block at all are skipped, not failed | That is intended. A versioning pass never synthesizes a block |
| A `version` differs from the computed value and was not overwritten | Skip-on-differ protects a human-set version | Pass the explicit update flag, or reconcile by hand. A `SKILL.md` is the exception: it is the anchor of record |

---

## 7. FAQ

**Q: Why does frontmatter get its own mode when it is four lines at the top of a file?**

A: Because six modes emit it and every one of their templates defers to the same specification. A contract that many producers share and no producer owns gets edited by whoever passes, and drifts from the validators enforcing it. This is the third time that shape has been corrected in this hub.

**Q: Why did the validators not move here too?**

A: One of them is resolved by literal path from a post-edit hook outside this hub, on every qualifying edit. Moving it would break a live hook to gain nothing. Enforcement is exactly the kind of many-consumer utility a shared tier is for, and the rules are exactly what it is not.

**Q: The budget constants are in the Python validator and in the markdown. Is that a bug?**

A: It is deliberate and the validator's own docstring says so. The script needs the numbers to run fast without reading a 900-line document. The markdown carries the reasoning, the worked trim example and the class table. Duplicating two integers is cheaper than either alternative.

**Q: Why is `version` four parts?**

A: To keep the leading digit low while letting the magnitude live somewhere. A document reads `3.6.0.41`, never `41.x.x.x`. Major and minor are human-curated and inherited from the skill, and only the last segment is computed.

**Q: Are commands and agents really out of scope for `version`?**

A: Yes, for now. They carry frontmatter and are governed separately. The version standard says so explicitly rather than leaving it to be inferred from the absence of a rule.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Packaging gate | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` | `Result: PASS` |
| Hub check | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` | Exit 0 |
| Link integrity | `python3 .opencode/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc/sk-create-frontmatter` | `failures=0` |
| Corpus version gate | `bash .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh --skill sk-doc` | Exit 0 |
| Playbook package | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook` | `PASS`, tier `FAIL_CLOSED`, `violations=0` |
| Playbook is visible to the benchmark | `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs --skill .opencode/skills/sk-doc/sk-create-frontmatter` | `scenarios` length 11, `warnings` empty |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the router, and the always-and-never rules |
| [`references/README.md`](./references/README.md) | Router for this mode's reference set |
| [`assets/frontmatter-templates.md`](./assets/frontmatter-templates.md) | The field reference and the per-class templates. Eleven sections, one per concern |
| [`references/frontmatter-versioning.md`](./references/frontmatter-versioning.md) | The 4-part version standard: scope, format, anchor derivation, the numstat gate and the insertion rule |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Eleven operator scenarios across field resolution, the description budget and version derivation |
