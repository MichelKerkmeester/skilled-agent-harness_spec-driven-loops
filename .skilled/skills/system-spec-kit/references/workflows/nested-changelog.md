---
title: Nested Changelog Workflow
description: Generate packet-local changelog files for spec roots and phase child folders.
trigger_phrases:
  - "nested changelog workflow"
  - "packet-local changelog"
  - "changelog generator modes"
  - "changelog evidence stack"
importance_tier: normal
contextType: implementation
version: 3.6.0.7
---

# Nested Changelog Workflow

Packet-local changelogs capture completion state inside a spec folder instead of the global `.skilled/changelog/` release stream.

---

## 1. OVERVIEW

Generate packet-local changelog files for spec roots and phase child folders.

---

## 2. WHEN TO USE

- A root spec folder needs a local changelog history beside `implementation-summary.md`
- A phase child folder needs a packet-local changelog entry in the parent `changelog/` folder
- `/spec_kit:complete` or `/spec_kit:implement` finishes work on a root packet or phase child

---

## 3. GENERATOR

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <spec-folder> --write
```

### Modes

| Mode | Detected when | Output |
|---|---|---|
| `root` | The target folder is a spec root | `<spec-folder>/changelog/changelog-<packet>-root.md` |
| `phase` | The target folder is a direct phase child | `<parent-spec>/changelog/changelog-<packet>-<phase-folder>.md` |

### Search Metadata

Each rendered changelog carries one identity phrase in `trigger_phrases`, so a lookup by packet and phase name finds it. The generator derives the phrase from the output path:

1. Take the filename stem, drop `changelog-` and up to three leading number groups, then drop a trailing `root`.
2. Take the owner: the folder that holds `changelog/`, or the parent folder when the file sits deeper inside a changelog tree. Drop its number groups too.
3. Write the owner's words, then the entry's words. Where the owner's last words repeat the entry's first words, write them once.
4. Past nine words, trim the owner from its end. The entry's own words always survive whole.
5. End with `changelog` unless the words already end with it.

A packet folder `042-search-overhaul` gets `search overhaul changelog` for its root changelog and `search overhaul ranking fix changelog` for its `003-ranking-fix` phase. Both templates carry the phrase as the `{{CHANGELOG_IDENTITY_PHRASE}}` placeholder rather than a fixed phrase, because a fixed phrase in a template names every packet's changelog at once.

---

## 4. EVIDENCE STACK

The generator prefers these sources, in order:

1. `implementation-summary.md`
2. `tasks.md`
3. `acceptance-criteria.md`
4. `decision-record.md`
5. `spec.md`

It derives summary, change bullets, verification notes, files changed, and follow-ups from the available packet evidence. Root changelogs also roll up direct child phase folders when they exist.

---

## 5. CANONICAL TEMPLATES

- `templates/changelog/root.md`
- `templates/changelog/phase.md`

Use these templates for packet-local changelog generation. Do not reuse the global `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` for nested packet output.

---

