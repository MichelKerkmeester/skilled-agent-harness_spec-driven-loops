---
title: Changelog Worked Examples
description: Filled-in changelog entries using the v4 release layout, with notes explaining each choice.
trigger_phrases:
  - "changelog creation examples"
  - "global changelog example"
  - "v4 changelog example"
  - "worked changelog entry"
  - "annotated changelog sample"
importance_tier: normal
contextType: implementation
version: 1.3.0.0
---

# Changelog Worked Examples

These examples use real release facts.

---

## 1. OVERVIEW

### Purpose

These examples apply the [changelog template](../assets/changelog-template.md) to real release content. Use `.skilled/changelog/skilled/v4.1.0.0.md` as the layout model. The workflow in [../SKILL.md](../SKILL.md) remains authoritative.

### When to Use

- Model a global entry from a filled example.
- See what compact entries leave out by default.
- Compare compact and expanded example layouts.

---

## 2. COMPACT GLOBAL ENTRY

This compact entry models fewer than ten changes without a breaking change. It shows which details the selection rules leave out.

```markdown
---
title: "sk-create-changelog v1.3.1.0, Hubs Resolve to Their Own Changelogs"
description: "/create:changelog now resolves a hub such as sk-doc to its own changelog or to one mode's, where it used to find no version in the hub's folder of links."
trigger_phrases:
  - "sk-create-changelog v1.3.1.0"
  - "sk-create-changelog 1.3.1.0"
  - "changelog hub component resolution"
importance_tier: "normal"
contextType: "general"
---

# v1.3.1.0, Hubs Resolve to Their Own Changelogs

`/create:changelog` now finds the changelog that owns each hub change. Previously, it found no version and could write beside the hub's links.

&nbsp;

## What's New at a Glance

- Changes inside a mode packet go to that mode's changelog.
- Other changes under the hub go to `parent`.
- Version checks follow the resolved changelog's history.

&nbsp;

## Upgrade

No migration required.

&nbsp;

> Spec folder: `specs/sk-doc/document-standards/003-changelog-system/003-skilled-release-changelog/003-adjacent-alignment`
```

Annotations:

- The summary names the change and its old failure.
- Each glance bullet adds one routing detail.
- The source also records two playbook scenarios and README updates.
- No reader sees those, so the entry leaves them in the spec packet.
- The final spec line follows an `&nbsp;` separator.
- The upgrade sentence carries only the required action.

---

## 3. EXPANDED FORMAT EXCERPT

Expanded entries suit major releases or breaking changes. This excerpt shows retrieval work and upgrade actions.

```markdown
&nbsp;

## Retrieval

Retrieval now has a clear lookup path and smaller templates.

#### Frontmatter Builds a Clean Index <a id="c-frontmatter-builds-a-clean-index"></a>

- Every document's frontmatter builds a trigger index.
- A lookup script reads the index without a daemon.
- Ripgrep recipes cover free-text searches.

> [!WARNING]
> The SQLite database, embedder and daemon are removed.
> Use the trigger index and free-text recipes instead.

#### Templates Keep Their Output <a id="c-templates-keep-their-output"></a>

- Spec, plan and task templates share one core.
- Level-gated addenda preserve each document's needed detail.
- Level 1 research docs render 175 lines, down from 944.
- Generated output remains identical.

<details>
<summary><b>Smaller fixes</b></summary>

- A miss returns a clean no-hit instead of a degraded guess.

</details>

&nbsp;

## Upgrade Notes

Update memory references before using search or saves.

#### Before You Start <a id="c-before-you-start"></a>

1. Replace `memory_search` pins with `/speckit:search`.
2. Replace `memory_save` pins with the continuity writer.

<details>
<summary><b>Retrieval</b></summary>

- Remove the spec-memory MCP server from runtime configs.

</details>
```

Annotations:

- The H2 names the changed area: retrieval.
- Its opening states the shared effect in one sentence.
- Each H4 gives one benefit and an anchor.
- Short bullets separate each feature's facts.
- The warning names the removed engine and its replacement.
- Smaller fixes folds the no-hit behavior at section end.
- Upgrade Notes starts with shared actions, then folds configuration work.
- Numbering shows the order for search and save references.

---

## 4. PACKET-LOCAL ENTRY (DEPRECATED)

Packet-local changelogs are deprecated, so there is no new entry to model here. Record a spec folder's work in a global entry for the component it touched, shaped like section 2 or section 3.

Existing files such as `changelog-<packet>-root.md` stay as history and still validate. The spec-kit nested generator that rendered them is removed.

---

## 5. RELATED

- [README.md](README.md) - reference route-map
- [version-bump-rules.md](version-bump-rules.md) - choosing and calculating the global four-part version
- [topology-edge-cases.md](topology-edge-cases.md) - placement, back-dating, source conflicts and release edge cases
- [../SKILL.md](../SKILL.md) - authoritative packet workflow
- `.skilled/changelog/skilled/v4.1.0.0.md` - the layout model
- `.skilled/changelog/skilled/v4.0.1.0.md` - the model for selection in a release with many changes
- `.skilled/changelog/skilled/v4.0.0.0.md` - the model for voice and how a major release opens
