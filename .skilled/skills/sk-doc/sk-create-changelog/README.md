---
title: "create-changelog"
description: "Writes a correctly versioned, correctly placed changelog entry from a spec folder, a component hint or git history, for anyone recording a shipped change."
trigger_phrases:
  - "create changelog"
  - "release notes"
version: 1.3.0.14
---

# create-changelog

> Turn "what changed" into a short changelog entry that lands in the right place with the right version.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Writing a global component release or a packet-local nested changelog entry |
| **Invoke with** | `/create:changelog`, "create changelog" or a direct read of `SKILL.md` |
| **Works on** | A spec folder, a component hint or recent git history |
| **Produces** | A validated entry that search can find, plus a GitHub release for the `skilled` line when asked |

---

## 2. OVERVIEW

### Why This Skill Exists

A changelog entry can go wrong in three ways. It lands in the wrong place, as when a packet-local change is written as a global release. It carries the wrong version, because a four-part bump (`major.minor.patch.build`) was miscalculated or an existing file blocks the write. Or it buries the one change a reader cares about under every task that shipped. A fixed workflow and a narrative format that keeps only what the reader needs prevent all three.

### What It Does

create-changelog is the `sk-doc` workflow behind `/create:changelog`. It resolves the source, detects global or packet-local output, calculates the version, writes the entry in the compact or expanded v4 narrative format and checks voice and structure before writing. Every global entry opens with the search metadata a spec document carries, so Gate 1 and `/speckit:search` find it by component and version. With `--release` it also tags the version and publishes the GitHub release, and `sk-git` owns the branch, commit and PR work around it.

---

## 3. QUICK START

**Step 1: Identify the source.** A spec folder, a component name or "recent commits" are all valid starting points.

**Step 2: Read the shared format before writing.**

```bash
cat .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md
```

It holds the compact and expanded shapes, the rules for what to leave out and the length ceilings, all modeled on the v4 exemplar at `.skilled/changelog/skilled/v4.0.0.0.md`.

**Step 3: Check voice and structure.**

```bash
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/changelog/<component>/v<version>.md
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/changelog/<component>/v<version>.md --type changelog
```

The scan must report zero hard blockers, meaning no banned punctuation and no banned words. The validator prints `✅ VALID` when the structure and the search metadata are sound. It does not judge the narrative, so the `SKILL.md` checks still apply.

---

## 4. HOW IT WORKS

The workflow reads the source, detects the output mode, calculates the version, chooses what goes in and writes. It discovers the real folders under `.skilled/changelog/` at run time and picks the primary component by its share of the changed files. Global mode calculates the next `vMAJOR.MINOR.PATCH.BUILD` and never overwrites an existing version. Nested mode skips versioning and writes through the spec-kit generator.

The entry keeps only what a reader would notice or act on, and it says each fact once. Tests, file lists, internal IDs and follow-on housekeeping stay in the spec packet. Fewer than 10 such changes in a release that is neither major nor breaking use the compact format, and the rest use the expanded one.

The four version segments answer different questions. `major` means breaking, a rewrite or a migration, not just "large". `minor` is a genuinely new feature or subsystem, `patch` is a fix, a refactor or a docs update and `build` is a same-day hotfix on a published version. Without `--bump`, auto-detection reads `spec.md` and commit prefixes and falls back to `patch`.

### Key Concept: Global Versus Nested Is Detected, Not Chosen

A spec folder that is a phase child, has child phases or already has a `changelog/` folder routes to nested mode automatically, because a four-part global version would attach meaninglessly to one phase of a larger packet. A phase child such as `003-child-packet` writes to `../changelog/changelog-<packet>-<phase-folder>.md`. Pass `--nested` only when the folder shape alone is ambiguous.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-changelog when a shipped change needs a global release entry, a completed spec folder or phase needs a packet-local summary or a GitHub release needs a body built from a real entry. Skip it for a release plan with no file output, or when the source cannot be resolved to a spec folder, a component or recent commits.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-git` | Owns branch, commit and PR work. create-changelog writes the entry and, with `--release`, the tag and GitHub release. |
| `create-readme` | Owns README prose. A changelog records what changed, a README explains how to use the result. |
| `system-spec-kit` | Owns the nested changelog generator and packet-local templates that nested mode writes through. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| No component folder matches | `component_hint` resembles no folder under `.skilled/changelog/` | Run `ls -d .skilled/changelog/*/` and match by exact name or whole path segment. Never invent a folder |
| No version found for `sk-doc` or `sk-code` | The folder is a hub of links with no entry of its own | Resolve it to `<hub>/parent` for the hub itself or to `<hub>/<link>` for one mode. `ls -l .skilled/changelog/<hub>/` shows the links |
| Version calculation looks off | Auto-detection defaulted to patch without a clear signal | Pass an explicit `--bump` |
| A file already exists at the calculated version | That version was already written | Let the build segment increment until the path is free. Never overwrite |
| Entry looks like it belongs to the packet, not the whole project | The spec folder is a phase child or already has `changelog/` | Nested mode is likely correct. Use `--nested` or let auto-detection route it |
| File uses `Added`/`Changed`/`Fixed` headings | The caller asked for another external format | Rewrite as topical sections named for the domain they change, unless the user needs that format |
| Entry runs long or repeats itself | Every task or fix became its own bullet | Apply the template's section 3: keep what the reader would notice, merge items with one effect and say each fact once |

---

## 7. FAQ

**Q: Why not just run `git log --oneline` for a changelog?**

A: Commit history is noise for anyone who isn't reading diffs. This workflow keeps what changed for the reader, grouped by the domain it touches, and leaves file-level detail in the spec packet.

**Q: Can this workflow also cut the GitHub release?**

A: Yes, for the `skilled` release line when you pass `--release`. After the entry is written, the command tags `v<version>`, pushes the tag and publishes the release with the entry as its body. `:confirm` shows the commands and waits for approval first. Any other component skips the release, because a component version is not a repository release, and a packet-local changelog has no repo-wide version to tag.

**Q: What if two components were both heavily touched?**

A: The entry goes to the primary one by file count, and the report lists the others as additional changelog candidates rather than writing extra files.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Global format | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <changelog-file> --type changelog` | `✅ VALID`: the summary first, the spec-folder blockquote when sourced from a spec, the sections its tier requires and upgrade guidance |
| Voice | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <changelog-file>` | Zero hard blockers |
| Version sequencing | List the target folder and its generation folders, then compare against the calculated version | The new version is strictly greater than the latest, and no file exists at that path |
| Nested output | Confirm the file landed under the packet's `changelog/` folder | `changelog-<packet>-root.md` or `changelog-<packet>-<phase>.md` exists at the expected path |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the seven-step workflow and the versioning and topology rules |
| [`assets/changelog-template.md`](assets/changelog-template.md) | Canonical entry format and the rules for what goes in |
| [`references/README.md`](./references/README.md) | Overflow route map for deeper detail |
| [`references/worked-examples.md`](./references/worked-examples.md) | Fully written global and packet-local entries |
| [`references/version-bump-rules.md`](./references/version-bump-rules.md) | Concrete four-part version examples |
| [`references/topology-edge-cases.md`](./references/topology-edge-cases.md) | Placement, back-dating, source conflicts and the GitHub release flow |
