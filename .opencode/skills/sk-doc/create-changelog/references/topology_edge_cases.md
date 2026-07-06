---
title: Changelog Topology and Edge Cases
description: Output-mode placement table, hub-versus-packet judgment, back-dating, source-format conflicts, and the optional GitHub release flow with its unknowns.
trigger_phrases:
  - "packet local changelog placement"
  - "global vs packet local changelog"
  - "changelog topology edge cases"
  - "github release changelog option"
  - "changelog back dating"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Changelog Topology and Edge Cases

Where a changelog goes, and the edge cases around placement, back-dating, source-format conflicts, and optional release.

---

## 1. OVERVIEW

The mode-detection procedure (`--nested`, phase-child, direct child phase folders, existing `changelog/`, else global) is authoritative in [../SKILL.md](../SKILL.md) §5 and is not repeated here. This file carries the placement table and the edge cases that would otherwise bloat the SKILL.md.

---

## 2. OUTPUT-MODE PLACEMENT

Choose the output mode before thinking about version numbers.

| Output Mode | Where It Writes | Versioned? | Source Rule |
|---|---|---|---|
| Global component changelog | `.opencode/changelog/{component}/v{VERSION}.md` | Yes | Use for public component release notes |
| Packet-local root changelog | `{spec-folder}/changelog/changelog-<packet>-root.md` | No | Use for root spec-folder packet summary |
| Packet-local phase changelog | `{phase-parent}/changelog/changelog-<packet>-<phase-folder>.md` | No | Use for phase-child summary |

---

## 3. HUB VERSUS PACKET PLACEMENT

A hub-level release belongs in the resolved global component folder when it is release-facing. A packet-local execution summary belongs in the spec packet's `changelog/` folder when nested topology is detected.

Practical rule:

- if the changelog is for users of a component, write global
- if the changelog is for a spec packet's internal completion trail, write packet-local
- the real folders under `.opencode/changelog/` are plain component names; the older `00--` umbrella-folder convention is stale

For multi-component tie-breaks — dominant component over 60 percent of changed files, roughly-equal components resolved by highest file count with secondaries noted, or no match at all so you pause and ask — follow the component selection rules in `../SKILL.md` §5 rather than guessing a folder.

---

## 4. BACK-DATING

The workflow sources set `DATE` to today's date in `YYYY-MM-DD` format. They do not define a back-dating rule. Treat back-dating as UNKNOWN unless the user provides an explicit release-management instruction.

---

## 5. SOURCE CONFLICTS TO WATCH

The shared template says global changelog files start directly with the summary paragraph and have no version header. Some YAML validation text still references H1, backlink, and version-date checks. Use the shared template as the format source for authoring examples, and treat the YAML checklist wording as stale or UNKNOWN until the packet contract resolves it. `../SKILL.md` §4 records the same mismatch as a source inconsistency and instructs following the shared template over the older snippets.

---

## 6. OPTIONAL GITHUB RELEASE FLOW

The command surface supports a `--release` flag and a `publish_release` setup field.

Known behavior from sources:

- `publish_release` defaults to `false` in auto setup.
- the startup prompt asks whether to create a tag and GitHub release when `--release` is not supplied.
- the completion result includes `Release Published: yes/no/not requested`.
- the shared template says GitHub release notes can use the changelog body as-is, then append `Full changelog: .opencode/changelog/{component}/v{VERSION}.md`.

UNKNOWN from the provided workflow sources:

- the exact tag name format
- the exact `gh release create` command
- whether the release should be draft or published immediately
- whether packet-local changelogs can publish releases

Use `--release` only after the changelog file path, component, and version are resolved. Do not publish a release for a packet-local changelog unless the primary `SKILL.md` or user instruction explicitly says that is supported.

---

## 7. RELATED

- [README.md](README.md) - reference route-map
- [worked_examples.md](worked_examples.md) - filled-in global and packet-local entries
- [version_bump_rules.md](version_bump_rules.md) - choosing and calculating the global four-part version
- [../SKILL.md](../SKILL.md) - authoritative topology detection (§5), format contract (§4), and release notes (§7)
