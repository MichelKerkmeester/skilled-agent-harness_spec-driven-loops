---
title: Changelog Topology and Edge Cases
description: Output-mode placement table, hub-versus-packet judgment, back-dating, source-format conflicts and the optional GitHub release flow the command YAMLs run.
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

Where a changelog goes, and the edge cases around placement, back-dating, source-format conflicts and the optional release.

---

## 1. OVERVIEW

Mode detection and component resolution are authoritative in [../SKILL.md](../SKILL.md) section 6. This file carries the placement table and the edge cases around it.

---

## 2. OUTPUT-MODE PLACEMENT

Choose the output mode before thinking about version numbers.

| Output Mode | Where It Writes | Versioned? | Use For |
|---|---|---|---|
| Global component changelog | `.skilled/changelog/{component}/v{VERSION}.md` | Yes | Public component release notes |
| Packet-local root changelog | `{spec-folder}/changelog/changelog-<packet>-root.md` | No | A root spec folder's summary |
| Packet-local phase changelog | `{phase-parent}/changelog/changelog-<packet>-<phase-folder>.md` | No | A phase child's summary |

---

## 3. HUB VERSUS PACKET PLACEMENT

A changelog for the users of a component goes global. A changelog for a spec packet's own completion trail goes packet-local. The folders under `.skilled/changelog/` are plain component names, except `skilled`, the framework release line, which the workflow writes to only when the operator names it. For ties between components, or no match at all, follow the selection rules in SKILL.md section 6 rather than guessing a folder.

---

## 4. BACK-DATING

The workflow sets `DATE` to today in `YYYY-MM-DD` format and defines no back-dating rule. Treat back-dating as UNKNOWN unless the user gives an explicit release-management instruction.

---

## 5. SOURCE CONFLICTS TO WATCH

The template and the command YAMLs share the v4 narrative contract. If a source still shows an older snippet (an H1 version header, a backlink, a version-date header, `###` highlight headings or Problem/Fix labels), follow `assets/changelog-template.md` and record the mismatch rather than inventing a hybrid.

---

## 6. OPTIONAL GITHUB RELEASE FLOW

SKILL.md section 8 describes the release step: `skilled` only, tag `v{next_version}`, `git tag -a`, `git push origin {release_tag}` and `gh release create` with no draft stage. A packet-local changelog never publishes, because it has no repo-wide version to tag. What the command surface adds:

- `publish_release` defaults to `false` in auto setup.
- The startup prompt asks whether to create a tag and GitHub release when `--release` is not supplied.
- The result reports `Release Published: yes/no/not requested`.
- `:confirm` shows the exact commands and runs them only after approval.
- `:auto` runs them when `publish_release` is true and warns when the changelog file is not yet committed, because the tag points at the current HEAD.

Use `--release` only after the changelog path, component and version are resolved.

---

## 7. RELATED

- [README.md](README.md) - reference route-map
- [worked-examples.md](worked-examples.md) - filled-in global and packet-local entries
- [version-bump-rules.md](version-bump-rules.md) - choosing and calculating the global four-part version
- [../SKILL.md](../SKILL.md) - authoritative topology (section 6), format contract (section 5) and release notes (section 8)
