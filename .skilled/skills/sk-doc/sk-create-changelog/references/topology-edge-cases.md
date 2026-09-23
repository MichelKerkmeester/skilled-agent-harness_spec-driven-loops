---
title: Changelog Topology and Edge Cases
description: Output-mode placement table, hub-versus-packet judgment, back-dating, source-format conflicts, and the optional GitHub release flow the command YAMLs run.
trigger_phrases:
  - "packet local changelog placement"
  - "global vs packet local changelog"
  - "changelog topology edge cases"
  - "github release changelog option"
  - "changelog back dating"
importance_tier: normal
contextType: implementation
version: 1.1.0.5
---

# Changelog Topology and Edge Cases

Where a changelog goes, and the edge cases around placement, back-dating, source-format conflicts, and optional release.

---

## 1. OVERVIEW

The mode-detection procedure (`--nested`, phase-child, direct child phase folders, existing `changelog/`, else global) is authoritative in [../SKILL.md](../SKILL.md) §6 and is not repeated here. This file carries the placement table and the edge cases that would otherwise bloat the SKILL.md.

---

## 2. OUTPUT-MODE PLACEMENT

Choose the output mode before thinking about version numbers.

| Output Mode | Where It Writes | Versioned? | Source Rule |
|---|---|---|---|
| Global component changelog | `.skilled/changelog/{component}/v{VERSION}.md` | Yes | Use for public component release notes |
| Packet-local root changelog | `{spec-folder}/changelog/changelog-<packet>-root.md` | No | Use for root spec-folder packet summary |
| Packet-local phase changelog | `{phase-parent}/changelog/changelog-<packet>-<phase-folder>.md` | No | Use for phase-child summary |

---

## 3. HUB VERSUS PACKET PLACEMENT

A hub-level release belongs in the resolved global component folder when it is release-facing. A packet-local execution summary belongs in the spec packet's `changelog/` folder when nested topology is detected.

Practical rule:

- if the changelog is for users of a component, write global
- if the changelog is for a spec packet's internal completion trail, write packet-local
- the real folders under `.skilled/changelog/` are plain component names. The older `00--` umbrella-folder convention is stale

For multi-component tie-breaks (dominant component over 60 percent of changed files, roughly-equal components resolved by highest file count with secondaries noted, or no match at all so you pause and ask) follow the component selection rules in `../SKILL.md` §6 rather than guessing a folder.

---

## 4. BACK-DATING

The workflow sources set `DATE` to today's date in `YYYY-MM-DD` format. They do not define a back-dating rule. Treat back-dating as UNKNOWN unless the user provides an explicit release-management instruction.

---

## 5. SOURCE CONFLICTS TO WATCH

The shared template and the YAML command surface are reconciled on the v4 narrative contract: the prose starts with the summary narrative (YAML frontmatter and an editorial title H1 may precede it), compact files carry at-a-glance bullets and Upgrade, and expanded files carry Why This Release, topical H2 sections with H4 story items and Upgrade Notes. If a source still shows older snippet wording (H1 version header, backlink, version-date header, `###` highlight headings, Problem/Fix labels), follow `assets/changelog-template.md`, write in the narrative format, and record the mismatch rather than inventing a hybrid. `../SKILL.md` §5 records the same rule.

---

## 6. OPTIONAL GITHUB RELEASE FLOW

The command surface supports a `--release` flag and a `publish_release` setup field.

Known behavior from sources:

- `publish_release` defaults to `false` in auto setup.
- the startup prompt asks whether to create a tag and GitHub release when `--release` is not supplied.
- the completion result includes `Release Published: yes/no/not requested`.
- the shared template says GitHub release notes use the changelog content with any YAML frontmatter and the editorial title H1 removed, then append `Full changelog: .skilled/changelog/{component}/v{VERSION}.md`.

Defined by `step_7_publish_release` in both command YAMLs:

- the tag name is `v{next_version}`, the same version the changelog file was written under
- the commands are `git tag -a {release_tag}`, `git push origin {release_tag}` and `gh release create {release_tag} --title "{release_tag} -- {primary_component}" --notes-file {notes_file}`
- the release publishes immediately, with no draft stage
- packet-local changelogs never publish a release, because they have no repo-wide version to tag

Use `--release` only after the changelog file path, component, and version are resolved. `:confirm` shows the exact commands and runs them only after approval. `:auto` runs them when `publish_release` is true and warns when the changelog file is not yet committed, because the tag points at the current HEAD.

---

## 7. RELATED

- [README.md](README.md) - reference route-map
- [worked-examples.md](worked-examples.md) - filled-in global and packet-local entries
- [version-bump-rules.md](version-bump-rules.md) - choosing and calculating the global four-part version
- [../SKILL.md](../SKILL.md) - authoritative topology detection (§6), format contract (§5), and release notes (§8)
