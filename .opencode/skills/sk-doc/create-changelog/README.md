---
title: "create-changelog"
description: "Writes a correctly versioned, correctly placed changelog entry from a spec folder, component hint, or git history, for anyone recording a shipped change."
trigger_phrases:
  - "create changelog"
  - "release notes"
version: 1.0.0.0
---

# create-changelog

> Turn "what changed" into a changelog entry that lands in the right place with the right version.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Writing a global component release or a packet-local nested changelog entry |
| **Invoke with** | `/create:changelog`, "create changelog", or a direct read of `SKILL.md` |
| **Works on** | A spec folder, a component hint, or recent git history |
| **Produces** | A validated changelog file, plus an optional GitHub release-note body |

---

## 2. OVERVIEW

### Why This Skill Exists

A changelog entry has two ways to go wrong before you write a single sentence: the wrong place and the wrong version. Placement fails when a packet-local change gets written as a global release, or when a change that deserved a real component release gets buried in a nested file instead. Version fails when a four-part bump (`major.minor.patch.build`) is miscalculated by hand, and an existing file at the calculated version silently blocks a naive write. Add a shared prose format that leads with why a release matters instead of a wall of file paths, and a hand-written entry drifts fast without a fixed workflow behind it.

### What It Does

create-changelog is the `sk-doc` workflow behind `/create:changelog`. It resolves the work source, a spec folder, a component hint, or git history, detects global versus packet-local nested output, calculates the version when global rules apply, and generates content in the shared compact or expanded format before validating and writing. It prepares release-note content only. `sk-git` owns the actual branch, commit, and PR mechanics that ship the release.

---

## 3. QUICK START

**Step 1: Identify the source.** A spec folder, a component name, or "recent commits" are all valid starting points.

**Step 2: Read the shared format before writing.**

```bash
cat .opencode/skills/sk-doc/shared/assets/changelog-template.md
```

You get the compact and expanded shapes, the spec-folder blockquote convention, and the plain-category section vocabulary.

**Step 3: Validate the written file.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/changelog/<component>/v<version>.md --type changelog
```

You get `✅ VALID` when the summary, category sections, and upgrade guidance are all present.

---

## 4. HOW IT WORKS

For a spec folder source, read `implementation-summary.md` first, then `tasks.md` and `spec.md`, and extract the work summary, files changed, and change type. For a component hint or git history, gather recent commits and affected files instead. From there, detect the output mode, discover the real folders under `.opencode/changelog/` at run time rather than trusting a hardcoded list, and pick the primary component by file-count share when several are affected. Global mode calculates the next `vMAJOR.MINOR.PATCH.BUILD` and refuses to overwrite an existing version. Nested mode skips version calculation and writes through the spec-kit nested generator instead. Either way, choose compact format under 10 changes and expanded format for 10 or more, a major release, or a breaking change, then validate before writing.

The four version segments each answer a different question. `major` means breaking, a rewrite, or a migration, not just "large." `minor` covers a genuinely new feature or subsystem. `patch` covers the everyday case: a fix, a refactor, a docs update. `build` covers a same-day hotfix on a version already published. When no explicit `--bump` is passed, auto-detection reads `spec.md` and commit prefixes first and falls back to `patch` when no clear signal exists.

### Key Concept: Global Versus Nested Is Detected, Not Chosen

You rarely pick global or packet-local by hand. A spec folder that is a phase child, that already has child phases of its own, or that already has a `changelog/` folder routes to nested mode automatically, even without a `--nested` flag, because four-part global versioning would attach meaninglessly to one phase of a larger packet. A phase child like `003-child-packet` writes to `../changelog/changelog-<packet>-<phase-folder>.md`, never to a global `sk-doc` release folder. Pass `--nested` explicitly only to force the mode when the folder shape alone is ambiguous.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-changelog when a shipped change needs a global component release entry, when a completed spec folder or phase needs a packet-local summary, or when a GitHub release needs a note body built from real changelog content. Skip it when the request is a generic release plan with no file output, or when the source can't be resolved to a spec folder, component, or recent commit history.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-git` | Owns branch, commit, and PR mechanics. create-changelog prepares the note content, `sk-git` ships it. |
| `create-readme` | Owns README and install-guide prose. A changelog records what changed, a README explains how to use the result. |
| `system-spec-kit` | Owns the nested changelog generator and packet-local templates that nested mode writes through. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| No component folder matches | `component_hint` doesn't resemble any real folder under `.opencode/changelog/` | Run `ls -d .opencode/changelog/*/` first, then match by substring or path segment. Never invent a folder |
| Version calculation looks off | Auto-detection defaulted to patch with no clear signal, or the target file already exists | Pass an explicit `--bump`, or let the build segment auto-increment on collision |
| Entry looks like it belongs to the packet, not the whole project | The spec folder is a phase child or already has `changelog/` | Nested mode is likely correct here. Use `--nested` or let auto-detection route it |
| File uses `Added`/`Changed`/`Fixed` headings | The caller asked for a different external format | Translate the content into the shared plain-category vocabulary (New Features, Bug Fixes, and similar) unless the user explicitly needs that other format |
| Write fails with a version collision | A file already exists at the calculated version path | Bump the build segment, or confirm the change actually warrants a new version |
| Existing changelog got overwritten | The write path targeted a version that already had content | Never overwrite an existing file. Increment the build segment until the target path is free |

---

## 7. FAQ

**Q: Why not just run `git log --oneline` for a changelog?**

A: Commit history is noise for anyone who isn't reading diffs. This workflow turns it into a summary that leads with why the release matters, sorted into categories a non-developer can follow, with file-level detail kept separate from the plain-English explanation.

**Q: When does an entry go global instead of packet-local?**

A: Global when the source resolves to a component hint, git history, or a spec folder with no phase structure and no existing `changelog/` folder. Packet-local when `--nested` is set, the folder is a phase child, has phase children of its own, or already has a `changelog/` folder.

**Q: Can this workflow also cut the GitHub release?**

A: It can prepare the release-note body from the generated changelog content plus a full-changelog path line. The release mechanics themselves belong to `sk-git`.

**Q: What if two components were both heavily touched?**

A: List every affected component in the report and write to the primary one by file count. Secondary components get noted as additional changelog candidates, not silently written as extra files.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Global format | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <changelog-file> --type changelog` | `✅ VALID`, with summary, spec-folder blockquote when sourced from a spec, category sections, files changed, and upgrade guidance all present |
| Version sequencing | List the target folder and compare against the calculated version | New version is strictly greater than the latest existing one, and no file already exists at that exact path |
| Nested output | Confirm the file landed under the packet's `changelog/` folder with the correct `changelog-<packet>-root.md` or `changelog-<packet>-<phase>.md` name | File exists at the expected nested path |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the seven-step workflow, and versioning and topology rules |
| [`../shared/assets/changelog-template.md`](../shared/assets/changelog-template.md) | Canonical compact and expanded entry format |
| [`references/README.md`](./references/README.md) | Overflow route map for deeper detail |
| [`references/worked-examples.md`](./references/worked-examples.md) | Fully written global and packet-local entries |
| [`references/version-bump-rules.md`](./references/version-bump-rules.md) | Concrete four-part version examples |
| [`references/topology-edge-cases.md`](./references/topology-edge-cases.md) | Placement, back-dating, source conflicts, and the GitHub release flow |
