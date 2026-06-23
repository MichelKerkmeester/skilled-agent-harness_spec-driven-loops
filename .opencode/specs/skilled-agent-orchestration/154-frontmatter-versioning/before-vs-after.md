---
title: "Spec 154 Before vs After"
description: "The before-and-after of the skill frontmatter versioning work, from 21 inconsistently-versioned SKILL.md to a fully versioned, standardized and gated corpus of 2,222 docs."
trigger_phrases:
  - "154 before vs after"
  - "frontmatter versioning before after"
  - "versioning impact"
importance_tier: "normal"
contextType: "implementation"
---
# Before vs After

## Before

Only the 21 `SKILL.md` files carried a `version` field, and even those were inconsistent. Four used a 3-part `X.Y.Z` and several were stale against their own changelogs. Every other doc, the READMEs and references and assets and feature catalogs and testing playbooks, had no version at all. There was no at-a-glance way to know which revision of a reference or a catalog leaf you were reading, no documented standard for the field and nothing stopping a new doc from shipping without one.

## After

Every in-scope skill doc now self-reports a 4-part `version: X.Y.Z.W` whose front digit stays low because it anchors to the human-curated skill version rather than a git count. The standard lives in `references/frontmatter_versioning.md`, a deterministic engine stamps it, and a corpus-wide gate blocks any in-scope doc that is missing or malformed. New docs are born versioned because the templates carry the field as required.

## At a glance

| Dimension | Before | After |
|-----------|--------|-------|
| Docs carrying a version | 21 SKILL.md, four of them 3-part | 2,210 of 2,222 in-scope |
| Version shape | mixed 3-part and 4-part | uniform 4-part `X.Y.Z.W` |
| Standard | none | `references/frontmatter_versioning.md` |
| Derivation | manual and ad hoc | deterministic engine, changelog-anchored and numstat-gated |
| Enforcement | none | required validators plus a corpus-wide CI gate |
| New docs | unversioned by default | born versioned from the templates |
| Verification | none | 21-assertion suite, gate exit 0, `validate.sh --strict` green on seven folders |

## How the front digit stays low

A naive `git log --follow | wc -l` overcounts by three to five times because the historical repo-wide rename and the bulk-sweep commits touch every file. The engine counts only commits whose own added-plus-deleted line count for that file is above zero, so a reference that shows 31 raw commits resolves to 8 real edits. That real edit count lands in the build segment, capped at 99, while the major and minor come from the skill anchor. A doc reads `3.6.0.41`, never `41.x.x.x`.

The chronological view of how this was built lives in [`timeline.md`](./timeline.md). The per-phase detail lives in [`changelog/`](./changelog/).
