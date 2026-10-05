---
title: Changelog Worked Examples
description: Filled-in changelog entries in the v4 narrative style, with annotations explaining why each is shaped the way it is.
trigger_phrases:
  - "changelog creation examples"
  - "global changelog example"
  - "v4 changelog example"
  - "packet local changelog example"
  - "worked changelog entry"
  - "annotated changelog sample"
importance_tier: normal
contextType: implementation
version: 1.1.0.8
---

# Changelog Worked Examples

Filled-in changelog entries in the v4 narrative style, annotated to explain the choices.

---

## 1. OVERVIEW

These examples apply [../assets/changelog-template.md](../assets/changelog-template.md) to real content. For the full expanded shape, read the canonical exemplar, `.skilled/changelog/skilled/v4.0.0.0.md`. The workflow in [../SKILL.md](../SKILL.md) stays authoritative.

---

## 2. COMPACT GLOBAL ENTRY

A compact entry for a release under 10 changes with no breaking change. It is a leaner rewrite of this packet's published v1.3.1.0 entry, showing what the selection rules in template section 3 leave out. The frontmatter block comes first, per the Frontmatter Contract in SKILL.md section 5, and an editorial title H1 may follow it.

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

`/create:changelog` now writes a hub's changelog where the hub keeps it. A hub such as `sk-doc` holds one link per mode plus `parent` and no entry of its own, so the workflow used to find no version there and would have written beside the links.

> Spec folder: `specs/sk-doc/061-skilled-release-changelog/003-adjacent-alignment` (Level 2)

&nbsp;

## What's New at a Glance

- **A change lands in the changelog of the mode it belongs to.** A change inside one mode's packet goes to that mode's link, and anything else under the hub goes to `parent`.
- **The next version follows the hub's own history.** The version reader reads the resolved link, so it no longer comes back empty.

&nbsp;

## Upgrade

No migration required.
```

**Annotations**:

- The summary says what changed and why in two sentences, with no file paths or counts.
- Each glance bullet adds something the summary did not say: where a mode's change lands, and where the next version comes from.
- The source also recorded two new playbook scenarios, a README and command-doc catch-up and a note that identity phrases keep the skill's name. None of them changes what a user of the workflow sees, so the entry leaves them in the spec packet.
- An `&nbsp;` line sits before each H2, the glance section and the Upgrade line alike.
- The Upgrade line is only the action. The published entry added a sentence that repeated the first bullet, and the lean version drops it.

---

## 3. EXPANDED FORMAT EXCERPT

For 10 or more changes, a major bump or a breaking change. The excerpt condenses one topical section in the exemplar's style, without quoting it.

```markdown
&nbsp;

## Retrieval

Retrieval became something you can reason about instead of something you debug.

#### The Index Replaces the Engine

The SQLite database, the embedder and the daemon were decommissioned end to end. A trigger index generated from every document's frontmatter replaced them. A lookup script reads it with no daemon, and ripgrep recipes cover free text. A miss is now a clean no-hit rather than a degraded guess.

#### Smaller Templates, Same Output

The spec, plan and task templates consolidated into one shared core with level-gated addenda. A Level 1 research doc renders at 175 lines instead of 944, and what the templates produce is identical.

&nbsp;

## Upgrade Notes

- **Repoint.** Move anything pinned to `memory_search` or `memory_save` to `/speckit:search` and the continuity writer.
- **Drop.** Remove the spec-memory MCP server from your runtime configs.
```

**Annotations**:

- The H2 names the domain it changes (Retrieval), not a change type such as `New Features`.
- The section intro says what neither item says, so nothing is stated twice.
- Each H4 heading states the fact or the gain in four or five words, and each item runs one paragraph: what was there, what replaced it and why it matters.
- An `&nbsp;` line sits before each H2, nothing separates the H4 items and no `---` rule appears.
- The Upgrade Notes carry only the actions, with the names the reader must change. Why the engine left belongs to the section above.

---

## 4. PACKET-LOCAL ENTRY

Packet-local changelogs skip the global version sequence. Nested mode writes through the spec-kit generator and its root or phase template, which own this shape.

```markdown
# Changelog - sk-doc parent root

This packet adds the `create-changelog` sub-skill to the sk-doc parent hub and records the work needed to keep changelog creation topology-aware.

## Summary

- Added a dedicated creation packet for changelog authoring.
- Kept the packet `SKILL.md` focused on the primary workflow.
- Moved longer examples and pitfalls into the `references/` route-map and its concern files.

## Changed Files

| File | Change |
|---|---|
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | New packet contract |
| `.skilled/skills/sk-doc/sk-create-changelog/references/` | Supplemental reference set |

## Validation

- Confirmed the reference set is grounded in the existing changelog template and command YAMLs.
```

**Annotations**:

- The shape belongs to `.skilled/skills/system-spec-kit/templates/changelog/root.md` and `phase.md`, written by `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <spec-folder> --write`.
- The filename is deterministic, such as `changelog-<packet>-root.md` or `changelog-<packet>-<phase-folder>.md`, never a `vX.Y.Z.W.md` name.

---

## 5. RELATED

- [README.md](README.md) - reference route-map
- [version-bump-rules.md](version-bump-rules.md) - choosing and calculating the global four-part version
- [topology-edge-cases.md](topology-edge-cases.md) - placement, back-dating, source conflicts and release edge cases
- [../SKILL.md](../SKILL.md) - authoritative packet workflow
- `.skilled/changelog/skilled/v4.0.0.0.md` - the canonical exemplar
