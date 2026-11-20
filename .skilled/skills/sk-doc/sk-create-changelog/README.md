---
title: "create-changelog"
description: "Writes a correctly versioned, correctly placed changelog entry from a spec folder, a component hint or git history, for anyone recording a shipped change."
trigger_phrases:
  - "create changelog"
  - "release notes"
version: 1.3.13.0
---

# create-changelog

> Turn a shipped change into a global changelog entry that says what a reader would notice and lands at the right version.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Writing a global changelog entry for a component release. |
| **Invoke with** | `/create:changelog <source> [--bump <type>] [--release] [:auto\|:confirm]`. |
| **Works on** | A spec folder or a component folder under `.skilled/changelog/`. |
| **Produces** | A `v{MAJOR}.{MINOR}.{PATCH}.{BUILD}.md` entry in the component's changelog folder, plus a tag and GitHub release for `skilled` when `--release` is set. |

### What It Does

create-changelog is the `sk-doc` workflow behind `/create:changelog`. It resolves the source to a component and calculates the next four-part version, then writes the entry in the compact or expanded format. Shape and voice checks run before the file lands. With `--release` it tags the version and publishes a GitHub release for the `skilled` release line only.

### Why This Skill Exists

A changelog entry can land in the wrong folder. It can also carry the wrong version, because a four-part bump is easy to miscalculate. The workflow resolves the component and numbers the version before it writes a line.

---

## 2. QUICK START

**Step 1: Invoke it.** Run `/create:changelog` with a spec folder or a component name. The setup prompt also offers recent commits. Add `--bump` with one of `major`, `minor`, `patch`, `build` or `auto` to fix the version change. Add `--release` to publish a GitHub release for the `skilled` release line. With no mode suffix the command runs the checkpointed `:confirm` workflow.

**Step 2: Confirm the target folder exists.** The workflow never creates a component folder.

```bash
ls -d .skilled/changelog/*/
```

Expected output: one line per component folder, such as `.skilled/changelog/sk-doc/` and `.skilled/changelog/skilled/`. A hub folder prints as a folder of links, so `ls -l .skilled/changelog/sk-doc/` shows where each member's entries live.

**Step 3: Check the draft shape.**

```bash
python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py <draft-file>
```

Expected output: `PASS <draft-file>` followed by `SUMMARY files=1 pass=1 fail=0`, with exit 0.

---

## 3. HOW IT WORKS

The workflow runs in seven steps. The command YAMLs insert the optional release as step 7, which makes eight steps in all. It analyzes the source, resolves the target component and calculates the version. Then it selects the content, validates the draft, writes the file and reports the result.

It reads the component folders under `.skilled/changelog/` at run time. A component with more than 60 percent of the changed files becomes the primary target. The rest are reported as candidates rather than written.

Versions are four-part and strictly sequential. The workflow starts from the highest version, locally and upstream. Then it applies the bump and increments the build segment until the path is free. A new file never overwrites an existing one. The `skilled` line has one exception. When its latest entry has no release tag on origin, that release is still open. New work joins that entry and the version stays as it is.

```text
┌─────────────────────────────────────────┐
│ Spec folder or component name           │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Resolve the component folder            │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Calculate the next version              │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Write the compact or expanded entry     │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Run the shape and voice checks          │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Entry in the component changelog folder │
└─────────────────────────────────────────┘
```

### The Two Entry Formats

The format follows the changes that survive selection, not the number of tasks behind them. Count only what a reader would notice.

| Format | When it applies | Sections it carries |
|---|---|---|
| Compact | Under 10 visible changes in a release that is not major and not breaking | A one-paragraph summary, `## Why This Release` when the summary does not say why, `## What's New at a Glance` as short bullets and `## Upgrade` |
| Expanded | 10 or more changes, a major bump or any breaking change | Opening lead sentences with short bullets and an important box for breaks, `## Why This Release`, `## What's New at a Glance` as a linked table, topical H2 sections with anchored H4 items of short bullets, `## How It Was Checked` and `## Upgrade Notes`, with smaller fixes, costs, tests and upgrade groups folded |

Every entry opens with a five-key frontmatter block, which is what the trigger index reads to find it. The keys are `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`.

### The Four Version Segments

`major` means a breaking change. A large release is not major unless something breaks. The next two segments are smaller. `minor` adds a feature or subsystem. `patch` covers a fix or a docs update. `build` marks a same-day hotfix on a published version.

| Segment | Meaning |
|---|---|
| `major` | A breaking change or a migration |
| `minor` | A new feature or subsystem |
| `patch` | A fix or a docs update |
| `build` | A same-day hotfix on a published version |

Without `--bump`, auto-detection reads the `spec.md` title and purpose. It then reads the commit prefixes and falls back to `patch` when no signal is clear.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for it when a component ships a change a reader should hear about. A completed spec folder uses it too, because the work is recorded against the component it touched. Skip it for a release plan with no file output. Skip it too when the source resolves to no known component. A README explains how to use the result. That belongs to `sk-create-readme`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-git` | Owns branch and commit work. create-changelog writes the entry. With `--release` on the `skilled` line it creates the tag and the GitHub release too. |
| `sk-create-readme` | Owns README prose. A changelog records what changed, a README explains how to use the result. |
| `sk-create-quality-control` | Audits an existing changelog. Use it to score or improve an entry rather than write a new one. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| No component folder matches | The hint resembles no folder under `.skilled/changelog/` | Run `ls -d .skilled/changelog/*/` and match a whole path segment. Never invent a folder. |
| The entry lands in `<hub>/parent` instead of a member folder | The changed paths sit outside every member packet | Name the member link or its packet folder in the hint. A path under one member packet resolves to that member's link. |
| The calculated version already exists | That version was written earlier | The build segment increments until the path is free. Never overwrite. |
| A `skilled` run edits the latest entry | That release has no tag on origin yet | Expected. New work joins the open release and its version stays. |
| `--nested` is refused | Packet-local changelogs are deprecated | Write a global entry for the component the packet changed. |
| The voice scan shows deductions but no hard blockers | The scan counts soft word and phrase deductions | Hard blockers must be zero. A soft deduction is acceptable for an entry. |

---

## 6. FAQ

### Why not build the entry from `git log --oneline`?

Commit history records the work. The entry records what changed for a reader, grouped by the domain it touches. A task list is evidence of what shipped. The template turns it into the few changes a reader would notice.

### Can the workflow publish the GitHub release?

Yes, for the `skilled` release line when you pass `--release`. It tags `v<version>` and publishes the release with the entry as its body. `:confirm` shows the commands and waits for approval first. Any other component skips the release, because release tags name framework releases.

### What happens when two components changed?

The component with more than 60 percent of the changed files becomes the primary target. The run reports the others as candidates instead of writing extra files.

### Does a spec folder still keep its own changelog?

No. Packet-local changelogs are deprecated and `--nested` is refused. Existing files under `specs/**/changelog/` stay as history and still validate.

---

## 7. VERIFICATION

Run the checks from the repository root. The shape and voice gates run on the draft before the write. The format validator runs on the written file.

| Check | How to run it | What a pass looks like |
|---|---|---|
| Shape | `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py <entry>` | `PASS <entry>` then `SUMMARY files=1 pass=1 fail=0` |
| Voice | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <entry>` | `hard blockers: 0` |
| Format | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <entry> --type changelog` | `✅ VALID: <entry>` and exit 0. A clean entry reports `Total issues: 0`, and a warning does not block |
| Component slug | `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <slug>` | `PASS: authored artifact name is kebab-case: <slug>` |
| Release body | `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/build_release_notes.py <entry>` | The entry without its frontmatter or title H1, ending with the `Full changelog:` pointer |

The format validator checks the five frontmatter keys and at least one trigger phrase. For a version file, it also requires a phrase that names the version. It warns on internal ids and on test counts outside `## How It Was Checked`. The narrative checks stay in `SKILL.md` section 9.

The manual testing playbook walks the same behavior by hand, from component resolution to the open-release case: [`manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md). Each scenario records a `PASS`, `FAIL` or `SKIP` verdict.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract: the seven-step workflow, versioning, topology and validation |
| [`ROUTER.md`](./ROUTER.md) | Machine router for the packet's routing decisions |
| [`assets/changelog-template.md`](assets/changelog-template.md) | The two formats, the selection rules, the omission rules and the sentence ceilings |
| [`references/README.md`](./references/README.md) | Route map to the reference files |
| [`references/worked-examples.md`](./references/worked-examples.md) | Filled-in entries with annotations |
| [`references/version-bump-rules.md`](./references/version-bump-rules.md) | Concrete bump choices and the first-entry case |
| [`references/topology-edge-cases.md`](./references/topology-edge-cases.md) | Placement, back-dating, source conflicts and the release flow |
| [`scripts/README.md`](./scripts/README.md) | The shape gate and the release notes builder |
| [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md) | Hand-run scenarios for resolution, versioning, format and release |
