---
title: "Ripgrep archive search"
description: "Searches archived packets on request, labels each archived hit and lists the archived packet metadata files that carry the phrase."
trigger_phrases:
  - "Ripgrep archive search"
  - "rg-wrapper --include-archive"
  - "search archived spec packets"
  - "archived label in ripgrep results"
version: 1.0.0.0
---

# Ripgrep archive search (rg-wrapper.mjs --include-archive)

## 1. OVERVIEW

Searches archived packets on request, labels each archived hit and lists the archived packet metadata files that carry the phrase.

Every recipe leaves `z_archive/` folders out by default, so an archived packet is invisible to a normal search. The `--include-archive` flag is the opt-in for a caller who needs to know whether finished work already covered a phrase.

---

## 2. HOW IT WORKS

### Archived hits

`--include-archive` works with the structured, path-only and count recipes. It drops only the archive exclusion from the recipe, so the other guards and the file limit apply as before. A path counts as archived when one of its segments is exactly `z_archive`.

In human output each archived path ends with `[archived]`. In JSON the report carries `includeArchive: true`, and each row in `results` and in `counts` carries `archived: true` or `archived: false`. The `paths` list of the path-only recipe stays a list of plain strings. Without the flag none of these fields appear, and the report shape is unchanged.

### Metadata lane

The flag also runs a second search for the same phrase over the `description.json` and `graph-metadata.json` files of archived packets. It is a separate ripgrep run, because one run cannot combine two output modes, and a caller cannot name it as a recipe.

Human output lists its matches under a `json    :` line that gives the number of archived metadata files, with one path per line and each marked `[archived]`. JSON carries them as `jsonLane`, with the command, exit code, outcome, sorted paths and stderr of that run. The lane is not bounded by `--limit`, so every matching file is listed.

### Edge cases

When the main recipe finds nothing in markdown and the metadata lane finds a match, the run reports a match and the main recipe's own fields stay shaped as a miss. When either run fails, the run reports an error. If both fail, the main recipe's exit status and stderr are the ones reported.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Script | Parses the flag, builds the archive-inclusive recipes and the metadata lane, labels archived paths and formats both outputs |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Shared | Ranks matches and keeps the first ranked row for each path, before archived rows are labelled |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts` | Vitest | Covers the default exclusion, the archive-inclusive recipes, archive search behavior and flag parsing |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/rg-archive-search.md`

Related references:
- [rg-flood-control.md](rg-flood-control.md) - Covers the per-file rows and file limit this mode keeps.
- [stale-index-fallback.md](stale-index-fallback.md) - Covers the adjacent ripgrep retrieval experience.
