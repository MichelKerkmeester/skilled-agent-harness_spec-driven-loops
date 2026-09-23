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

These examples apply the shared format in [../assets/changelog-template.md](../assets/changelog-template.md) to real content. The canonical full-scale exemplar is `.skilled/changelog/system-spec-kit/v4.0.0.0.md`. Read it for the complete expanded shape: opening narrative, Why This Release, What's New at a Glance, topical sections, Upgrade Notes. The seven-step workflow in [../SKILL.md](../SKILL.md) stays authoritative. Open this file when you want a filled-in entry to model, not the blank template.

---

## 2. COMPACT GLOBAL ENTRY

Compact format for a release under 10 changes with no breaking change. The example is the v1.1.0.0 release of this very packet, written in the format it teaches. The exemplar adds YAML frontmatter and an editorial title H1 above the narrative. Both shapes are valid: the narrative always opens the prose.

```markdown
The changelog template now teaches the narrative shape the v4 release notes established. Generated changelogs open with why the release matters, name their sections for the domain they change, and drop the machine-era tables that no reader asked for. Voice, omission and conciseness rules are enforced at validation time by the Human Voice scanner and a structural check pass.

> Spec folder: `specs/sk-doc/057-sk-create-changelog-v4-style` (Level 1)

## What's New at a Glance

- **The template has two narrative tiers.** Compact and expanded shapes model the v4 exemplar instead of tables and test metrics.
- **An omission decision-aid decides what stays out.** File inventories, test metrics and schema churn are dropped by default, and reverted work shrinks to one story sentence.
- **Voice is enforced at validation time.** The HVR scanner and a structural check pass gate every generated changelog before it is written.
- **The worked examples were rebuilt.** The annotations explain the new shape on real content.

## Upgrade

No migration required. Existing changelog files stay as written, and new changelogs follow the narrative format.
```

**Annotations**:

- The opening paragraph states what the release does and why it matters in three sentences. No file paths, no file counts, no test numbers.
- The spec-folder blockquote keeps the packet record without a table.
- Every at-a-glance bullet opens with a bold lead-in sentence, matching the exemplar's bullets, then adds one plain sentence on the same list line. Four bullets for four themes, not one bullet per file.
- No Files Changed section. The file map lives in the spec packet. That is the omission rule doing its job.
- The Upgrade section stays two sentences because nothing was added that a reader must act on.

---

## 3. EXPANDED FORMAT EXCERPT

For 10 or more changes, a major bump, or a breaking change. The excerpt condenses one topical section to show the pattern. It is written in the exemplar's style, not quoted from it. Model the opening narrative, Why This Release and at-a-glance sections on `.skilled/changelog/system-spec-kit/v4.0.0.0.md`.

```markdown
## Retrieval

The memory database left the framework this release. A committed trigger index and two lexical tools replaced it, and retrieval became a thing you can reason about instead of a thing you debug.

#### The Index Replaces the Engine

The SQLite database, the embedder and the daemon were decommissioned end to end. What replaced them is deliberately small: a trigger index generated from every document's frontmatter, a lookup script that reads it with no daemon, and ripgrep recipes for free text. A miss is a clean no-hit rather than a degraded guess.

&nbsp;

#### Smaller Templates, Same Output

The spec, plan and task templates consolidated into one shared core with level-gated addenda. A Level 1 research doc renders at 175 lines instead of 944. What the templates produce is identical.

---

## Upgrade Notes

- **Repoint.** Anything pinned to `memory_search` or `memory_save` moves to `/speckit:search` and the continuity writer.
- **Drop.** The spec-memory MCP server and its daemon are gone with the engine.
```

**Annotations**:

- The H2 is named for the domain it changes (Retrieval), not the change type. `New Features` or `Bug Fixes` would say less.
- Each H4 heading runs four or five words and states the fact or the gain, inside the 2-7 range most headings use. No numbering.
- One merged paragraph per item: what was broken, what replaced it, why it matters. No `**Problem:**` and `**Fix:**` labels.
- `&nbsp;` separates the two H4 items. `---` appears only between H2 sections.
- The Upgrade Notes carry bold Repoint/Drop lead-ins and list only the actions a reader must take. Paths appear here because this is where the reader acts on them, not in the narrative.
- A reverted mid-cycle experiment earns at most one story sentence, in the narrative, not an item. The exemplar's pattern: an alignment mode was built during the cycle and removed before release.

---

## 4. PACKET-LOCAL ENTRY

Packet-local changelogs do not use the global component version sequence. The YAML routes nested mode to the spec-kit generator and reads the spec-kit root or phase template instead of the global template.

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

- The exact packet-local shape is owned by `.skilled/skills/system-spec-kit/templates/changelog/root.md` and `phase.md`.
- Use the nested generator: `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <spec-folder> --write`.
- The output filename is deterministic, such as `changelog-<packet>-root.md` or `changelog-<packet>-<phase-folder>.md`.
- Do not invent a `vX.Y.Z.W.md` filename for packet-local output.

---

## 5. RELATED

- [README.md](README.md) - reference route-map
- [version-bump-rules.md](version-bump-rules.md) - choosing and calculating the global four-part version
- [topology-edge-cases.md](topology-edge-cases.md) - placement, back-dating, source conflicts, and release edge cases
- [../SKILL.md](../SKILL.md) - authoritative packet workflow
- `.skilled/changelog/system-spec-kit/v4.0.0.0.md` - the canonical exemplar
