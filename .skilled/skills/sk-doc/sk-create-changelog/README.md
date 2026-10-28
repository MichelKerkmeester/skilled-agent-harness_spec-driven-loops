---
title: "create-changelog"
description: "Writes a correctly versioned, correctly placed changelog entry from a spec folder, a component hint or git history, for anyone recording a shipped change."
trigger_phrases:
  - "create changelog"
  - "release notes"
version: 1.3.2.0
---

# create-changelog

> Turn "what changed" into a short changelog entry that lands in the right place with the right version.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Writing a global component release entry. Packet-local changelogs are deprecated |
| **Invoke with** | `/create:changelog`, "create changelog" or a direct read of `SKILL.md` |
| **Works on** | A spec folder, a component hint or recent git history |
| **Produces** | A validated entry that search can find, plus a GitHub release for the `skilled` line when asked |

---

## 2. OVERVIEW

### Why This Skill Exists

A changelog entry can go wrong in three ways. It lands in the wrong place, as when a change is filed under the wrong component. It carries the wrong version, because a four-part bump (`major.minor.patch.build`) was miscalculated or an existing file blocks the write. Or it buries the one change a reader cares about under every task that shipped. A fixed workflow and a narrative format that keeps only what the reader needs prevent all three.

### What It Does

create-changelog is the `sk-doc` workflow behind `/create:changelog`. It resolves the source to a global component, calculates the version, writes the entry in the compact or expanded v4 narrative format and checks voice and structure before writing. Every global entry opens with the search metadata a spec document carries, so Gate 1 and `/speckit:search` find it by component and version. With `--release` it also tags the version and publishes the GitHub release, and `sk-git` owns the branch, commit and PR work around it.

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

The workflow reads the source, resolves the component, calculates the version, chooses what goes in and writes. It discovers the real folders under `.skilled/changelog/` at run time and picks the primary component by its share of the changed files. Global mode calculates the next `vMAJOR.MINOR.PATCH.BUILD` and never overwrites an existing version. The one exception is the `skilled` release line: when its latest entry has no release tag on origin, that release is still open, and new work is folded into its entry instead of opening a second one.

The entry keeps only what a reader would notice or act on, and it says each fact once. Tests, file lists, internal IDs and follow-on housekeeping stay in the spec packet. Fewer than 10 such changes in a release that is neither major nor breaking use the compact format, and the rest use the expanded one.

The four version segments answer different questions. `major` means breaking, a rewrite or a migration, not just "large". `minor` is a genuinely new feature or subsystem, `patch` is a fix, a refactor or a docs update and `build` is a same-day hotfix on a published version. Without `--bump`, auto-detection reads `spec.md` and commit prefixes and falls back to `patch`.

### Key Concept: Packet-Local Changelogs Are Deprecated

Spec folders no longer get changelogs. A spec folder source, a phase child included, resolves to the global component its changed paths touch. `--nested` is refused. Existing files under `specs/**/changelog/` stay and still validate, and the spec-kit nested generator only renders them.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-changelog when a shipped change needs a global release entry, a completed spec folder needs its change recorded against a component or a GitHub release needs a body built from a real entry. Skip it for a release plan with no file output, or when the source cannot be resolved to a spec folder, a component or recent commits.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-git` | Owns branch, commit and PR work. create-changelog writes the entry and, with `--release`, the tag and GitHub release. |
| `create-readme` | Owns README prose. A changelog records what changed, a README explains how to use the result. |
| `system-spec-kit` | Owns the deprecated nested changelog generator, which only renders existing packet-local files. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| No component folder matches | `component_hint` resembles no folder under `.skilled/changelog/` | Run `ls -d .skilled/changelog/*/` and match by exact name or whole path segment. Never invent a folder |
| No version found for `sk-doc` or `sk-code` | The folder is a hub of links with no entry of its own | Resolve it to `<hub>/parent` for the hub itself or to `<hub>/<link>` for one mode. `ls -l .skilled/changelog/<hub>/` shows the links |
| Version calculation looks off | Auto-detection defaulted to patch without a clear signal | Pass an explicit `--bump` |
| A file already exists at the calculated version | That version was already written | Let the build segment increment until the path is free. Never overwrite |
| A `skilled` run edits the latest entry instead of writing a new one | That release has no tag on origin yet, so it is still open | Expected. Tag and publish it first if the new work belongs in the next release |
| `--nested` is refused | Packet-local changelogs are deprecated | Write a global entry for the component the packet changed |
| File uses `Added`/`Changed`/`Fixed` headings | The caller asked for another external format | Rewrite as topical sections named for the domain they change, unless the user needs that format |
| Entry runs long or repeats itself | Every task or fix became its own bullet | Apply the template's section 3: keep what the reader would notice, merge items with one effect and say each fact once |

---

## 7. FAQ

**Q: Why not just run `git log --oneline` for a changelog?**

A: Commit history is noise for anyone who isn't reading diffs. This workflow keeps what changed for the reader, grouped by the domain it touches, and leaves file-level detail in the spec packet.

**Q: Can this workflow also cut the GitHub release?**

A: Yes, for the `skilled` release line when you pass `--release`. After the entry is written, the command tags `v<version>`, pushes the tag and publishes the release with the entry as its body. `:confirm` shows the commands and waits for approval first. Any other component skips the release, because a component version is not a repository release.

**Q: What if two components were both heavily touched?**

A: The entry goes to the primary one by file count, and the report lists the others as additional changelog candidates rather than writing extra files.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Global format | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <changelog-file> --type changelog` | `✅ VALID`: the summary first, the spec-folder blockquote when sourced from a spec, the sections its tier requires and upgrade guidance |
| Voice | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <changelog-file>` | Zero hard blockers |
| Version sequencing | List the target folder and its generation folders, then compare against the calculated version | The new version is strictly greater than the latest, and no file exists at that path. An extended `skilled` entry keeps its version |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the seven-step workflow and the versioning and topology rules |
| [`assets/changelog-template.md`](assets/changelog-template.md) | Canonical entry format and the rules for what goes in |
| [`references/README.md`](./references/README.md) | Overflow route map for deeper detail |
| [`references/worked-examples.md`](./references/worked-examples.md) | Fully written global entries and a note on deprecated packet-local files |
| [`references/version-bump-rules.md`](./references/version-bump-rules.md) | Concrete four-part version examples |
| [`references/topology-edge-cases.md`](./references/topology-edge-cases.md) | Placement, back-dating, source conflicts and the GitHub release flow |
